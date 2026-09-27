// Gallery Photos Service
import { db, isFirebaseConfigured } from '../config/firebase';
import { defaultGallery } from '../data/clubData';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const GALLERY_KEY = 'universal_club_gallery_store';

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
    console.error(`Failed to save gallery key: ${key}`, err);
  }
};

export const galleryService = {
  getPhotos: async () => {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'gallery'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (list.length > 0) return list;
      } catch (err) {
        console.warn('Firestore getPhotos fallback:', err.message);
      }
    }
    return loadLocal(GALLERY_KEY, defaultGallery);
  },

  createPhoto: async (photoData, authorName = 'Member') => {
    const list = loadLocal(GALLERY_KEY, defaultGallery);
    const id = `gal_${Date.now()}`;
    const newPhoto = {
      id,
      documentId: id,
      title: photoData.title || 'Club Activity',
      description: photoData.description || '',
      category: photoData.category || 'General',
      imageUrl: photoData.imageUrl,
      createdAt: new Date().toISOString(),
      createdBy: authorName
    };

    list.unshift(newPhoto);
    saveLocal(GALLERY_KEY, list);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'gallery', id), newPhoto);
      } catch (err) {
        console.warn('Firestore createPhoto fallback:', err.message);
      }
    }

    return newPhoto;
  },

  deletePhoto: async (id) => {
    let list = loadLocal(GALLERY_KEY, defaultGallery);
    list = list.filter(p => p.id !== id && p.documentId !== id);
    saveLocal(GALLERY_KEY, list);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'gallery', id));
      } catch (err) {
        console.warn('Firestore deletePhoto fallback:', err.message);
      }
    }

    return true;
  }
};
