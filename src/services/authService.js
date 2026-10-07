// Authentication & User Profile Service
//
// With Firebase configured:
//   • Members sign in with Google (Firebase Auth). Their profile lives in Firestore `users/{uid}`
//     (same schema as the mobile app) and is linked to their `members` record by uid or email.
//   • Admins sign in with email + password (Firebase Auth). An account is an admin only if a
//     Firestore document `admins/{uid}` exists with role 'admin' — nothing is hard-coded here.
// Without Firebase (bare local development) a local demo admin and a mock Google user are used.

import { auth, googleProvider } from '../config/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { store, useCloud, serverTimestamp } from './store';
import { memberService } from './memberService';

const SESSION_KEY = 'universal_club_auth_user'; // cached session for instant UI; Firebase Auth is authoritative

// ⚠ TEMPORARY TEST ADMIN shortcut — remove once the committee has its own admin accounts.
// Typing the username `clubadmin` signs in to the real Firebase account TEST_ADMIN.email, so the
// database security rules still apply (that account must exist and have an admins/{uid} document).
// Pre-filled in `npm run dev`; on a deployed site only when VITE_ENABLE_TEST_ADMIN=true.
export const testAdminEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_ADMIN === 'true';
export const TEST_ADMIN = {
  username: 'clubadmin',
  password: 'adm12345',
  email: import.meta.env.VITE_TEST_ADMIN_EMAIL || 'clubadmin@clubvellur.com',
};

const saveSession = (user) => {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* storage unavailable */ }
};

const FRIENDLY_AUTH_ERRORS = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/user-not-found': 'Wrong email or password.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please wait a minute and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Authentication yet.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/popup-blocked': 'Your browser blocked the sign-in popup. Please allow popups for this site.',
  'auth/unauthorized-domain': 'This website address is not authorised in Firebase Authentication → Settings → Authorized domains.',
  'auth/network-request-failed': 'Network error — check your connection and try again.',
};

const friendly = (err) => new Error(FRIENDLY_AUTH_ERRORS[err?.code] || err?.message || 'Sign-in failed.');

const deriveMembershipStatus = (record) => {
  if (!record) return 'not_applied';
  if (record.status === 'approved' && record.expiryDate && new Date(record.expiryDate) < new Date()) return 'expired';
  return record.status || 'not_applied';
};

const adminSession = (fbUser, adminDoc) => ({
  id: fbUser.uid,
  uid: fbUser.uid,
  name: adminDoc.name || adminDoc.fullName || fbUser.displayName || 'Administrator',
  fullName: adminDoc.fullName || adminDoc.name || fbUser.displayName || 'Administrator',
  email: fbUser.email,
  username: adminDoc.username || fbUser.email,
  role: 'admin',
  membershipStatus: 'approved',
  profilePhoto: adminDoc.profilePhoto || fbUser.photoURL || '',
  authenticatedAt: new Date().toISOString(),
});

export const authService = {
  /** Cached session for the first paint; replaced by Firebase Auth state once it resolves */
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  },

  /** Returns the admin record for a Firebase user, or null */
  getAdminRecord: async (uid) => {
    if (!useCloud || !uid) return null;
    const record = await store.get('admins', uid);
    return record && (record.role || 'admin') === 'admin' ? record : null;
  },

  /** Builds the app session for a signed-in Firebase user (admin or member) */
  resolveSession: async (fbUser) => {
    const adminDoc = await authService.getAdminRecord(fbUser.uid);
    const session = adminDoc ? adminSession(fbUser, adminDoc) : await authService.syncUserProfile(fbUser);
    saveSession(session);
    return session;
  },

  signInWithGoogle: async () => {
    if (useCloud) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return authService.resolveSession(result.user);
      } catch (err) {
        throw friendly(err);
      }
    }
    // Local development only
    const session = await authService.syncUserProfile({
      uid: 'local_member',
      displayName: 'Local Test Member',
      email: 'member@localhost',
      photoURL: '',
    });
    saveSession(session);
    return session;
  },

  loginAdmin: async (email, password) => {
    if (!email || !password) throw new Error('Please enter both email and password.');

    // Temporary shortcut: `clubadmin` → the test admin's Firebase account (see TEST_ADMIN above)
    const usingTestAdmin = testAdminEnabled && email.trim().toLowerCase() === TEST_ADMIN.username;
    if (usingTestAdmin) email = TEST_ADMIN.email;

    if (useCloud) {
      let cred;
      try {
        cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (err) {
        if (usingTestAdmin && ['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(err?.code)) {
          throw new Error(
            `The test admin account doesn't exist yet. In Firebase → Authentication → Users, add ${TEST_ADMIN.email} ` +
            `with password ${TEST_ADMIN.password}, then create Firestore document admins/<its UID> with role "admin".`,
            { cause: err }
          );
        }
        throw friendly(err);
      }
      const adminDoc = await authService.getAdminRecord(cred.user.uid);
      if (!adminDoc) {
        await firebaseSignOut(auth);
        throw new Error(
          `This account is not a club admin. Add a document admins/${cred.user.uid} with role "admin" in Firestore.`
        );
      }
      const session = adminSession(cred.user, adminDoc);
      saveSession(session);
      return session;
    }

    throw new Error('Invalid administrator credentials.');
  },

  /**
   * Creates / refreshes users/{uid} and links it to the matching `members` record (by uid or email),
   * exactly like the mobile app. Existing fields written by the app (whatsapp, mobile, …) are kept.
   */
  syncUserProfile: async (fbUser) => {
    const uid = fbUser.uid;
    const email = String(fbUser.email || '').toLowerCase();
    // Only this person's records: by linked uid, or by their Google email (not the whole member list)
    const [existing, byUid, byEmail] = await Promise.all([
      store.get('users', uid),
      store.findBy('members', 'userId', uid),
      email ? store.findBy('members', 'email', fbUser.email) : [],
    ]);

    const mine = [...byUid, ...byEmail.filter((m) => !byUid.some((u) => u.id === m.id))]
      .sort((a, b) => (a.status === 'approved' ? -1 : b.status === 'approved' ? 1 : 0));
    const record = mine[0] || null;

    if (record && record.status === 'approved' && !record.userId) {
      await memberService.linkMemberToUser(record.id, { uid, email });
    }

    const membershipStatus = deriveMembershipStatus(record);
    const nowIso = new Date().toISOString();
    const photo = existing?.profilePhoto || fbUser.photoURL || '';

    const profile = {
      id: uid,
      uid,
      name: existing?.name || fbUser.displayName || 'Club Member',
      fullName: existing?.fullName || fbUser.displayName || 'Club Member',
      email: fbUser.email || existing?.email || '',
      profilePhoto: photo,
      photoURL: existing?.photoURL || photo,
      role: existing?.role === 'admin' ? 'admin' : 'user',
      accountStatus: existing?.accountStatus || 'active',
      membershipStatus,
      membershipId: record?.membershipId || null,
      updatedAt: nowIso,
      ...(existing ? {} : { createdAt: nowIso, createdAtServer: serverTimestamp() }),
    };

    await store.set('users', uid, profile, { merge: true });

    return { ...(existing || {}), ...profile, memberData: record };
  },

  updateProfile: async (uid, profileData) => {
    const patch = { ...profileData, updatedAt: new Date().toISOString() };
    delete patch.memberData;
    await store.set('users', uid, patch, { merge: true });
    const updated = { ...(authService.getCurrentUser() || {}), ...patch };
    saveSession(updated);
    return updated;
  },

  /** Registered users for the admin panel */
  getAllUsers: async () =>
    (await store.list('users')).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))),

  logout: async () => {
    if (useCloud && auth) {
      try {
        await firebaseSignOut(auth);
      } catch { /* already signed out */ }
    }
    saveSession(null);
    return true;
  },
};
