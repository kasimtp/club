// Hero Slider Service
// Manages video and image hero slides, active status, order sorting, and interactive CTA links.

import { db, isFirebaseConfigured } from '../config/firebase';
import { defaultSlides } from '../data/clubData';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const SLIDES_KEY = 'universal_club_slides_store';

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
    console.error(`Failed to save slides key: ${key}`, err);
  }
};

export const sliderService = {
  getSlides: async () => {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'slides'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (list.length > 0) return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn('Firestore getSlides fallback:', err.message);
      }
    }
    const slides = loadLocal(SLIDES_KEY, defaultSlides);
    return slides.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  getActiveSlides: async () => {
    const slides = await sliderService.getSlides();
    return slides.filter(s => s.active !== false);
  },

  createSlide: async (slideData) => {
    const slides = loadLocal(SLIDES_KEY, defaultSlides);
    const id = `slide_${Date.now()}`;
    const newSlide = {
      id,
      documentId: id,
      title: slideData.title || 'Universal Club Showcase',
      mediaType: slideData.mediaType || (slideData.mediaUrl?.endsWith('.mp4') ? 'video' : 'image'),
      mediaUrl: slideData.mediaUrl,
      ctaLabel: slideData.ctaLabel || 'Learn More',
      ctaType: slideData.ctaType || 'screen', // 'none' | 'url' | 'screen'
      ctaUrl: slideData.ctaUrl || '',
      ctaScreen: slideData.ctaScreen || '/membership',
      order: Number(slideData.order) || slides.length + 1,
      active: slideData.active !== undefined ? slideData.active : true,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    };

    slides.push(newSlide);
    saveLocal(SLIDES_KEY, slides);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'slides', id), newSlide);
      } catch (err) {
        console.warn('Firestore createSlide fallback:', err.message);
      }
    }

    return newSlide;
  },

  updateSlide: async (id, updates) => {
    const slides = loadLocal(SLIDES_KEY, defaultSlides);
    const index = slides.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Slide not found.');

    slides[index] = { ...slides[index], ...updates };
    saveLocal(SLIDES_KEY, slides);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'slides', id), updates);
      } catch (err) {
        console.warn('Firestore updateSlide fallback:', err.message);
      }
    }

    return slides[index];
  },

  toggleSlideActive: async (id) => {
    const slides = loadLocal(SLIDES_KEY, defaultSlides);
    const slide = slides.find(s => s.id === id);
    if (!slide) throw new Error('Slide not found.');

    const newActiveState = !slide.active;
    return await sliderService.updateSlide(id, { active: newActiveState });
  },

  deleteSlide: async (id) => {
    let slides = loadLocal(SLIDES_KEY, defaultSlides);
    slides = slides.filter(s => s.id !== id);
    saveLocal(SLIDES_KEY, slides);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'slides', id));
      } catch (err) {
        console.warn('Firestore deleteSlide fallback:', err.message);
      }
    }

    return true;
  }
};
