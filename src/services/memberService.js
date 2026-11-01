// Membership Service — Firestore `members` + `counters/membershipCounter`
//
// Every application requires Google Authentication and is saved directly to `members/mem_{userId}`
// with status 'pending'.
// Approval by an admin generates a sequential CLUB-XXXXXX ID, sets a 1-year expiry,
// and updates both `members` and `users/{uid}`.

import { db } from '../config/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { store, useCloud, serverTimestamp } from './store';

const MEMBERS = 'members';
const USERS = 'users';
const COUNTER_DOC = ['counters', 'membershipCounter'];
const LOCAL_COUNTER_KEY = 'universal_club_member_counter';

const DEFAULT_PHOTO = '';

export function calculateOneYearExpiry(baseDate = new Date()) {
  const date = new Date(baseDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

const formatMembershipId = (n) => `CLUB-${String(n).padStart(6, '0')}`;

/** Atomically reserves the next CLUB-XXXXXX number */
async function nextMembershipId() {
  if (useCloud) {
    const ref = doc(db, ...COUNTER_DOC);
    const next = await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const n = (snap.exists() ? Number(snap.data().currentNumber) || 0 : 0) + 1;
      tx.set(ref, { currentNumber: n }, { merge: true });
      return n;
    });
    return formatMembershipId(next);
  }
  const n = Number(localStorage.getItem(LOCAL_COUNTER_KEY) || 0) + 1;
  localStorage.setItem(LOCAL_COUNTER_KEY, String(n));
  return formatMembershipId(n);
}

const norm = (s) => String(s || '').toLowerCase().trim();
const digits = (s) => String(s || '').replace(/\D/g, '');

/** Mirrors membership state onto the linked user's profile (users/{uid}) */
async function syncLinkedUser(userId, patch) {
  if (!userId) return;
  try {
    await store.set(USERS, userId, { ...patch, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Could not update linked user profile:', err.message);
  }
}

const isApplication = (m) => m.status === 'pending' || m.status === 'rejected' || m.source === 'new_application';
const isMemberRecord = (m) => m.status === 'approved' || m.status === 'expired';

export const memberService = {
  /** Every document in `members` (applications and members) - admin only */
  getAll: () => store.list(MEMBERS),

  /** Approved / expired members - admin only */
  getMembers: async () => (await store.list(MEMBERS)).filter(isMemberRecord),

  /** Applications (pending, rejected, and approved ones) - admin only */
  getRequests: async () =>
    (await store.list(MEMBERS))
      .filter(isApplication)
      .sort((a, b) => String(b.appliedAt || '').localeCompare(String(a.appliedAt || ''))),

  /**
   * Public "verify a member" lookup by exact membership ID, email or phone.
   * Queries only the matching document instead of downloading the whole member list.
   */
  lookup: async (rawQuery) => {
    const q = String(rawQuery || '').trim();
    if (!q) return null;
    const attempts = /^club-/i.test(q)
      ? [['membershipId', q.toUpperCase()], ['membershipNumber', q.toUpperCase()]]
      : q.includes('@')
        ? [['email', q.toLowerCase()]]
        : [['phone', digits(q)], ['mobile', digits(q)]];
    for (const [field, value] of attempts) {
      const hit = (await store.findBy(MEMBERS, field, value)).find(isMemberRecord);
      if (hit) return hit;
    }
    return null;
  },

  /**
   * Submit an official membership application.
   * STRICT: Requires an authenticated Google user (`currentUser.uid` and `currentUser.email`).
   * Never scans the entire members collection.
   */
  submitApplication: async (formData, currentUser) => {
    if (!currentUser || !currentUser.uid) {
      throw new Error('Please sign in with Google before submitting a membership application.');
    }

    const userId = currentUser.uid;
    const docId = `mem_${userId}`;
    const normalizedEmail = (currentUser.email || formData.email || '').toLowerCase().trim();

    if (!normalizedEmail) {
      throw new Error('A valid email address is required from your authenticated Google account.');
    }

    // Targeted check: ensure user doesn't already have an active/pending application
    const existing = await store.get(MEMBERS, docId);
    if (existing) {
      if (existing.status === 'pending') {
        throw new Error('You already have a membership application pending review by the club committee.');
      }
      if (existing.status === 'approved') {
        throw new Error('You already have an active official Universal Club membership.');
      }
    }

    const nowIso = new Date().toISOString();
    const name = (formData.name || formData.fullName || currentUser.displayName || '').trim();
    const photo = formData.photoURL || formData.profilePhoto || currentUser.photoURL || DEFAULT_PHOTO;

    const application = {
      id: docId,
      documentId: docId,
      userId,
      name,
      fullName: name,
      email: normalizedEmail,
      phone: digits(formData.phone || formData.mobile),
      mobile: digits(formData.phone || formData.mobile),
      dateOfBirth: formData.dateOfBirth || formData.dob || '',
      gender: formData.gender || 'Male',
      bloodGroup: formData.bloodGroup || '',
      address: (formData.address || '').trim(),
      photoURL: photo,
      profilePhoto: photo,
      authProvider: 'google',
      source: 'new_application',
      status: 'pending',
      membershipId: null,
      membershipNumber: null,
      membershipType: '1 Year Membership',
      appliedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
      appliedAtServer: serverTimestamp(),
      createdAtServer: serverTimestamp(),
    };

    await store.set(MEMBERS, docId, application);
    await syncLinkedUser(userId, { membershipStatus: 'pending' });
    return application;
  },

  /**
   * Approve a pending application.
   * Atomically assigns the next sequential CLUB-XXXXXX ID, sets 1-year expiry,
   * and updates both `members/{id}` and `users/{userId}`.
   */
  approveApplication: async (memberDocId, adminName = 'Administrator') => {
    const application = await store.get(MEMBERS, memberDocId);
    if (!application) throw new Error('Application not found.');

    const membershipId = application.membershipId || (await nextMembershipId());
    const now = new Date();
    const patch = {
      status: 'approved',
      membershipId,
      membershipNumber: membershipId,
      membershipType: '1 Year Membership',
      joiningDate: now.toISOString(),
      expiryDate: calculateOneYearExpiry(now),
      approvedAt: now.toISOString(),
      approvedBy: adminName,
      rejectedAt: null,
      updatedAt: now.toISOString(),
    };

    await store.update(MEMBERS, memberDocId, patch);
    if (application.userId) {
      await syncLinkedUser(application.userId, { membershipStatus: 'approved', membershipId });
    }
    return { ...application, ...patch };
  },

  /**
   * Reject an application.
   * Updates application status to 'rejected' in both `members` and `users/{userId}`.
   */
  rejectApplication: async (memberDocId, adminName = 'Administrator') => {
    const application = await store.get(MEMBERS, memberDocId);
    if (!application) throw new Error('Application not found.');

    const nowIso = new Date().toISOString();
    const patch = { status: 'rejected', rejectedAt: nowIso, rejectedBy: adminName, updatedAt: nowIso };
    await store.update(MEMBERS, memberDocId, patch);
    if (application.userId) {
      await syncLinkedUser(application.userId, { membershipStatus: 'rejected' });
    }
    return { ...application, ...patch };
  },

  /**
   * Extend membership validity by 1 full year.
   */
  renewMember: async (memberDocId) => {
    const member = await store.get(MEMBERS, memberDocId);
    if (!member) throw new Error('Member record not found.');

    const now = new Date();
    const currentExpiry = member.expiryDate ? new Date(member.expiryDate) : now;
    const expiryDate = calculateOneYearExpiry(currentExpiry > now ? currentExpiry : now);
    const patch = { expiryDate, status: 'approved', renewedAt: now.toISOString(), updatedAt: now.toISOString() };

    await store.update(MEMBERS, memberDocId, patch);
    if (member.userId) {
      await syncLinkedUser(member.userId, { membershipStatus: 'approved', membershipId: member.membershipId });
    }
    return { ...member, ...patch };
  },

  /**
   * Transcribe an existing paper / offline member record (Admin only).
   */
  addExistingMember: async (formData, adminName = 'Administrator') => {
    const requestedId = (formData.membershipNumber || formData.membershipId || '').trim().toUpperCase();
    if (requestedId) {
      const all = await store.list(MEMBERS);
      if (all.some((m) => norm(m.membershipId) === norm(requestedId))) {
        throw new Error(`Membership ID ${requestedId} is already in use.`);
      }
    }
    const membershipId = requestedId || (await nextMembershipId());
    const joiningDate = formData.joiningDate ? new Date(formData.joiningDate).toISOString() : new Date().toISOString();
    const nowIso = new Date().toISOString();
    const phone = digits(formData.phone || formData.mobile);

    const id = `mem_offline_${phone || 'manual'}_${Date.now()}`;
    const name = (formData.name || formData.fullName || '').trim();
    const photo = formData.photoURL || formData.profilePhoto || DEFAULT_PHOTO;

    return store.set(MEMBERS, id, {
      id,
      documentId: id,
      userId: null,
      name,
      fullName: name,
      email: (formData.email || '').toLowerCase().trim(),
      phone: digits(formData.phone || formData.mobile),
      mobile: digits(formData.phone || formData.mobile),
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender || 'Male',
      bloodGroup: formData.bloodGroup || '',
      address: (formData.address || '').trim(),
      photoURL: photo,
      profilePhoto: photo,
      authProvider: 'manual',
      source: 'old_record',
      status: 'approved',
      membershipId,
      membershipNumber: membershipId,
      membershipType: '1 Year Membership',
      joiningDate,
      expiryDate: calculateOneYearExpiry(new Date(joiningDate)),
      approvedAt: nowIso,
      approvedBy: adminName,
      appliedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdAtServer: serverTimestamp(),
    });
  },

  linkMemberToUser: async (memberDocId, targetUser) => {
    const member = await store.get(MEMBERS, memberDocId);
    if (!member) throw new Error('Member not found.');
    const nowIso = new Date().toISOString();
    await store.update(MEMBERS, memberDocId, { userId: targetUser.uid, linkedAt: nowIso, updatedAt: nowIso });
    await syncLinkedUser(targetUser.uid, { membershipStatus: member.status, membershipId: member.membershipId || null });
    return { ...member, userId: targetUser.uid, linkedAt: nowIso };
  },

  unlinkMember: async (memberDocId) => {
    const member = await store.get(MEMBERS, memberDocId);
    if (!member) throw new Error('Member not found.');
    await store.update(MEMBERS, memberDocId, { userId: null, linkedAt: null, updatedAt: new Date().toISOString() });
    if (member.userId) {
      await syncLinkedUser(member.userId, { membershipStatus: 'not_applied', membershipId: null });
    }
    return { ...member, userId: null, linkedAt: null };
  },
};
