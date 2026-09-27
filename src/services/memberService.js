// Membership Service
// Implements exact approval pipeline, sequential CLUB-XXXXXX ID generation, 1-year expiry calculation,
// renewals, old record transcription, and user-to-member account linking.

import { db, isFirebaseConfigured } from '../config/firebase';
import { initialMembers, initialRequests } from '../data/clubData';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

const MEMBERS_KEY = 'universal_club_members_store';
const REQUESTS_KEY = 'universal_club_requests_store';
const COUNTER_KEY = 'universal_club_member_counter';

// Local storage helpers
const loadLocal = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (err) {
    return defaultVal;
  }
};

const saveLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Failed to save storage key: ${key}`, err);
  }
};

/**
 * Calculates 1-year expiry date (365 days) from a base date
 */
export function calculateOneYearExpiry(baseDate = new Date()) {
  const date = new Date(baseDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

/**
 * Generates the next sequential CLUB-XXXXXX ID
 */
export function getNextMembershipId() {
  const currentCount = Number(localStorage.getItem(COUNTER_KEY) || initialMembers.length);
  const nextCount = currentCount + 1;
  localStorage.setItem(COUNTER_KEY, String(nextCount));
  return `CLUB-${String(nextCount).padStart(6, '0')}`;
}

export const memberService = {
  /**
   * Fetch all members
   */
  getMembers: async () => {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'members'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (list.length > 0) return list;
      } catch (err) {
        console.warn('Firestore getMembers fallback to local:', err.message);
      }
    }
    return loadLocal(MEMBERS_KEY, initialMembers);
  },

  /**
   * Fetch all membership applications / requests
   */
  getRequests: async () => {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'membership_requests'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (list.length > 0) return list;
      } catch (err) {
        console.warn('Firestore getRequests fallback to local:', err.message);
      }
    }
    return loadLocal(REQUESTS_KEY, initialRequests);
  },

  /**
   * Submit a new membership application
   */
  submitApplication: async (formData, currentUser = null) => {
    const allRequests = loadLocal(REQUESTS_KEY, initialRequests);
    const allMembers = loadLocal(MEMBERS_KEY, initialMembers);

    // Validate non-duplicate
    const emailToCheck = (formData.email || '').toLowerCase().trim();
    const phoneToCheck = (formData.phone || formData.mobile || '').trim();

    const existingReq = allRequests.find(r => 
      r.status === 'pending' && 
      (r.email.toLowerCase() === emailToCheck || r.phone === phoneToCheck)
    );
    if (existingReq) {
      throw new Error('An application is already pending review with this email or phone number.');
    }

    const existingMember = allMembers.find(m => 
      m.status === 'approved' && 
      (m.email.toLowerCase() === emailToCheck || m.phone === phoneToCheck)
    );
    if (existingMember) {
      throw new Error('An active membership record already exists for this member.');
    }

    const newDocId = `req_${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newRequest = {
      id: newDocId,
      documentId: newDocId,
      userId: currentUser ? currentUser.uid : null,
      name: formData.name || formData.fullName,
      fullName: formData.name || formData.fullName,
      email: formData.email,
      phone: formData.phone || formData.mobile,
      mobile: formData.phone || formData.mobile,
      dateOfBirth: formData.dateOfBirth || formData.dob || '',
      gender: formData.gender || 'Male',
      bloodGroup: formData.bloodGroup || '',
      address: formData.address || '',
      photoURL: formData.photoURL || formData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      profilePhoto: formData.photoURL || formData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      authProvider: currentUser ? 'google' : 'manual',
      source: 'new_application',
      status: 'pending',
      membershipType: '1 Year Membership',
      appliedAt: nowIso,
      createdAt: nowIso,
    };

    allRequests.unshift(newRequest);
    saveLocal(REQUESTS_KEY, allRequests);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'membership_requests', newDocId), {
          ...newRequest,
          createdAtServer: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore write request fallback:', err.message);
      }
    }

    return newRequest;
  },

  /**
   * Approve a pending application: generates CLUB-XXXXXX ID, sets 1-year expiry
   */
  approveApplication: async (requestId, adminName = 'Administrator') => {
    const allRequests = loadLocal(REQUESTS_KEY, initialRequests);
    const allMembers = loadLocal(MEMBERS_KEY, initialMembers);

    const reqIndex = allRequests.findIndex(r => r.id === requestId || r.documentId === requestId);
    if (reqIndex === -1) throw new Error('Application request not found.');

    const targetReq = allRequests[reqIndex];
    const membershipNumber = targetReq.membershipId || getNextMembershipId();
    const now = new Date();
    const joiningDate = now.toISOString();
    const expiryDate = calculateOneYearExpiry(now);

    // Update request state
    targetReq.status = 'approved';
    targetReq.approvedAt = joiningDate;
    targetReq.approvedBy = adminName;
    targetReq.membershipId = membershipNumber;
    targetReq.membershipNumber = membershipNumber;
    allRequests[reqIndex] = targetReq;
    saveLocal(REQUESTS_KEY, allRequests);

    // Create / update member record
    const memberDocId = `mem_${targetReq.id}`;
    const newMemberRecord = {
      ...targetReq,
      id: memberDocId,
      documentId: memberDocId,
      status: 'approved',
      membershipId: membershipNumber,
      membershipNumber: membershipNumber,
      membershipType: '1 Year Membership',
      joiningDate,
      expiryDate,
      approvedAt: joiningDate,
      approvedBy: adminName,
    };

    const existingMemberIdx = allMembers.findIndex(m => m.email.toLowerCase() === targetReq.email.toLowerCase());
    if (existingMemberIdx >= 0) {
      allMembers[existingMemberIdx] = newMemberRecord;
    } else {
      allMembers.unshift(newMemberRecord);
    }
    saveLocal(MEMBERS_KEY, allMembers);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'membership_requests', targetReq.id), {
          status: 'approved',
          membershipId: membershipNumber,
          approvedAt: joiningDate,
          approvedBy: adminName,
        });
        await setDoc(doc(db, 'members', memberDocId), newMemberRecord);
      } catch (err) {
        console.warn('Firestore approve fallback:', err.message);
      }
    }

    return newMemberRecord;
  },

  /**
   * Reject a membership application
   */
  rejectApplication: async (requestId, adminName = 'Administrator') => {
    const allRequests = loadLocal(REQUESTS_KEY, initialRequests);
    const reqIndex = allRequests.findIndex(r => r.id === requestId || r.documentId === requestId);
    if (reqIndex === -1) throw new Error('Application request not found.');

    const nowIso = new Date().toISOString();
    allRequests[reqIndex].status = 'rejected';
    allRequests[reqIndex].rejectedAt = nowIso;
    allRequests[reqIndex].rejectedBy = adminName;
    saveLocal(REQUESTS_KEY, allRequests);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'membership_requests', requestId), {
          status: 'rejected',
          rejectedAt: nowIso,
          rejectedBy: adminName,
        });
      } catch (err) {
        console.warn('Firestore reject fallback:', err.message);
      }
    }

    return allRequests[reqIndex];
  },

  /**
   * Renew an active or expired member for +1 Year
   */
  renewMember: async (memberId, adminName = 'Administrator') => {
    const allMembers = loadLocal(MEMBERS_KEY, initialMembers);
    const memberIndex = allMembers.findIndex(m => m.id === memberId || m.documentId === memberId);
    if (memberIndex === -1) throw new Error('Member record not found.');

    const member = allMembers[memberIndex];
    const currentExpiry = member.expiryDate ? new Date(member.expiryDate) : new Date();
    const now = new Date();

    // If current expiry is in the future, extend from current expiry; otherwise extend from now
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiryDate = calculateOneYearExpiry(baseDate);

    member.expiryDate = newExpiryDate;
    member.status = 'approved';
    member.renewedAt = now.toISOString();
    member.updatedAt = now.toISOString();
    allMembers[memberIndex] = member;
    saveLocal(MEMBERS_KEY, allMembers);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'members', member.id), {
          expiryDate: newExpiryDate,
          status: 'approved',
          renewedAt: now.toISOString(),
          updatedAt: now.toISOString()
        });
      } catch (err) {
        console.warn('Firestore renew fallback:', err.message);
      }
    }

    return member;
  },

  /**
   * Manually add an existing offline/paper member record
   */
  addExistingMember: async (formData, adminName = 'Administrator') => {
    const allMembers = loadLocal(MEMBERS_KEY, initialMembers);
    const membershipNumber = formData.membershipNumber || formData.membershipId || getNextMembershipId();
    const joiningDate = formData.joiningDate ? new Date(formData.joiningDate).toISOString() : new Date().toISOString();
    const expiryDate = calculateOneYearExpiry(new Date(joiningDate));
    const nowIso = new Date().toISOString();

    const docId = `mem_manual_${Date.now()}`;
    const newMember = {
      id: docId,
      documentId: docId,
      userId: null,
      name: formData.name || formData.fullName,
      fullName: formData.name || formData.fullName,
      email: formData.email,
      phone: formData.phone || formData.mobile,
      mobile: formData.phone || formData.mobile,
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender || 'Male',
      bloodGroup: formData.bloodGroup || '',
      address: formData.address || '',
      photoURL: formData.photoURL || formData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      profilePhoto: formData.photoURL || formData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      authProvider: 'manual',
      source: 'old_record',
      status: 'approved',
      membershipId: membershipNumber,
      membershipNumber: membershipNumber,
      membershipType: '1 Year Membership',
      joiningDate,
      expiryDate,
      approvedAt: nowIso,
      approvedBy: adminName,
      createdAt: nowIso,
    };

    allMembers.unshift(newMember);
    saveLocal(MEMBERS_KEY, allMembers);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'members', docId), newMember);
      } catch (err) {
        console.warn('Firestore addExistingMember fallback:', err.message);
      }
    }

    return newMember;
  },

  /**
   * Link an existing member record to a Google registered user account
   */
  linkMemberToUser: async (memberId, targetUser) => {
    const allMembers = loadLocal(MEMBERS_KEY, initialMembers);
    const memberIndex = allMembers.findIndex(m => m.id === memberId || m.documentId === memberId);
    if (memberIndex === -1) throw new Error('Member not found.');

    const nowIso = new Date().toISOString();
    allMembers[memberIndex].userId = targetUser.uid;
    allMembers[memberIndex].linkedAt = nowIso;
    saveLocal(MEMBERS_KEY, allMembers);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'members', allMembers[memberIndex].id), {
          userId: targetUser.uid,
          linkedAt: nowIso,
        });
      } catch (err) {
        console.warn('Firestore link fallback:', err.message);
      }
    }

    return allMembers[memberIndex];
  },

  /**
   * Unlink a member record from a user
   */
  unlinkMember: async (memberId) => {
    const allMembers = loadLocal(MEMBERS_KEY, initialMembers);
    const memberIndex = allMembers.findIndex(m => m.id === memberId || m.documentId === memberId);
    if (memberIndex === -1) throw new Error('Member not found.');

    allMembers[memberIndex].userId = null;
    allMembers[memberIndex].linkedAt = null;
    saveLocal(MEMBERS_KEY, allMembers);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'members', allMembers[memberIndex].id), {
          userId: null,
          linkedAt: null,
        });
      } catch (err) {
        console.warn('Firestore unlink fallback:', err.message);
      }
    }

    return allMembers[memberIndex];
  }
};
