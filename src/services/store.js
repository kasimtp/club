// Data store: Cloud Firestore (shared with the Universal Vellur mobile app).
//
// When Firebase is configured (.env), Firestore is the single source of truth: every read
// comes from it and every write goes to it, and errors are thrown so the UI can show them.
// Without Firebase (bare local development) the same API falls back to localStorage.

import { db, isFirebaseConfigured } from '../config/firebase';
import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, limit,
} from 'firebase/firestore';

export const useCloud = Boolean(isFirebaseConfigured && db);

const localKey = (name) => `universal_club_${name}_store`;

const readLocal = (name) => {
  try {
    const raw = localStorage.getItem(localKey(name));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocal = (name, list) => {
  try {
    localStorage.setItem(localKey(name), JSON.stringify(list));
  } catch (err) {
    throw new Error(`Browser storage is full — could not save ${name}.`, { cause: err });
  }
};

// serverTimestamp() sentinels can't be stored locally and don't need to be
const withoutSentinels = (data) =>
  Object.fromEntries(Object.entries(data).filter(([, v]) => !(v && typeof v === 'object' && v._methodName)));

export const store = {
  /** All documents in a collection, as { id, ...data } */
  async list(name) {
    if (useCloud) {
      const snap = await getDocs(collection(db, name));
      return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
    }
    return readLocal(name);
  },

  async get(name, id) {
    if (useCloud) {
      const snap = await getDoc(doc(db, name, id));
      return snap.exists() ? { ...snap.data(), id: snap.id } : null;
    }
    return readLocal(name).find((d) => d.id === id) || null;
  },

  /** Documents where `field == value` (exact match), at most `max` */
  async findBy(name, field, value, max = 5) {
    if (useCloud) {
      const snap = await getDocs(query(collection(db, name), where(field, '==', value), limit(max)));
      return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
    }
    return readLocal(name).filter((d) => d[field] === value).slice(0, max);
  },

  /** Create or fully replace a document (merge keeps fields we don't know about, e.g. from the app) */
  async set(name, id, data, { merge = false } = {}) {
    if (useCloud) {
      await setDoc(doc(db, name, id), { ...data, updatedAtServer: serverTimestamp() }, { merge });
      return { ...data, id };
    }
    const list = readLocal(name);
    const i = list.findIndex((d) => d.id === id);
    const next = { ...(merge && i >= 0 ? list[i] : {}), ...withoutSentinels(data), id };
    if (i >= 0) list[i] = next; else list.unshift(next);
    writeLocal(name, list);
    return next;
  },

  async update(name, id, patch) {
    if (useCloud) {
      await updateDoc(doc(db, name, id), { ...patch, updatedAtServer: serverTimestamp() });
      return { ...patch, id };
    }
    const list = readLocal(name);
    const i = list.findIndex((d) => d.id === id);
    if (i === -1) throw new Error(`Record not found in ${name}.`);
    list[i] = { ...list[i], ...withoutSentinels(patch) };
    writeLocal(name, list);
    return list[i];
  },

  async remove(name, id) {
    if (useCloud) {
      await deleteDoc(doc(db, name, id));
      return true;
    }
    writeLocal(name, readLocal(name).filter((d) => d.id !== id));
    return true;
  },
};

export { serverTimestamp };
