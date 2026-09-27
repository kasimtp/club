// Programs & Upcoming Tournaments Service
import { db, isFirebaseConfigured } from '../config/firebase';
import { defaultPrograms } from '../data/clubData';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const PROGRAMS_KEY = 'universal_club_programs_store';

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
    console.error(`Failed to save programs key: ${key}`, err);
  }
};

export const programService = {
  getPrograms: async () => {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'programs'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (list.length > 0) return list;
      } catch (err) {
        console.warn('Firestore getPrograms fallback:', err.message);
      }
    }
    return loadLocal(PROGRAMS_KEY, defaultPrograms);
  },

  getProgramById: async (id) => {
    const list = await programService.getPrograms();
    return list.find(p => p.id === id || p.documentId === id) || null;
  },

  createProgram: async (programData) => {
    const list = loadLocal(PROGRAMS_KEY, defaultPrograms);
    const id = `prog_${Date.now()}`;
    const newProg = {
      id,
      documentId: id,
      title: programData.title,
      description: programData.description || '',
      date: programData.date || 'Coming Soon',
      time: programData.time || 'TBA',
      location: programData.location || 'Universal Club Complex',
      category: programData.category || 'Upcoming Program',
      posterUrl: programData.posterUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      status: 'coming_soon',
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    };

    list.unshift(newProg);
    saveLocal(PROGRAMS_KEY, list);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'programs', id), newProg);
      } catch (err) {
        console.warn('Firestore createProgram fallback:', err.message);
      }
    }

    return newProg;
  },

  deleteProgram: async (id) => {
    let list = loadLocal(PROGRAMS_KEY, defaultPrograms);
    list = list.filter(p => p.id !== id && p.documentId !== id);
    saveLocal(PROGRAMS_KEY, list);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'programs', id));
      } catch (err) {
        console.warn('Firestore deleteProgram fallback:', err.message);
      }
    }

    return true;
  }
};
