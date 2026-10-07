// Hero Slider Service — Firestore `slides` (shared with the mobile app)
import { store } from './store';
import { isVideoSlide } from '../utils/media';

const COLLECTION = 'slides';
const byOrder = (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0);

export const sliderService = {
  getSlides: async () => (await store.list(COLLECTION)).sort(byOrder),

  getActiveSlides: async () => (await sliderService.getSlides()).filter((s) => s.active !== false),

  createSlide: async (slideData, existingCount = 0) => {
    const id = `slide_${Date.now()}`;
    const slide = {
      id,
      documentId: id,
      title: slideData.title || '',
      mediaType: slideData.mediaType || (isVideoSlide(slideData) ? 'video' : 'image'),
      mediaUrl: slideData.mediaUrl,
      aspectRatio: Number(slideData.aspectRatio) || null, // width / height; < 1 means portrait
      posterUrl: slideData.posterUrl || '',
      ctaLabel: slideData.ctaLabel || '',
      ctaType: slideData.ctaType || 'screen', // 'none' | 'url' | 'screen'
      ctaUrl: slideData.ctaUrl || '',
      ctaScreen: slideData.ctaScreen || '/membership',
      order: Number.isFinite(Number(slideData.order)) ? Number(slideData.order) : existingCount,
      active: slideData.active !== undefined ? slideData.active : true,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
    };
    return store.set(COLLECTION, id, slide);
  },

  updateSlide: (id, updates) => store.update(COLLECTION, id, updates),

  toggleSlideActive: async (id) => {
    const slide = await store.get(COLLECTION, id);
    if (!slide) throw new Error('Slide not found.');
    return store.update(COLLECTION, id, { active: slide.active === false });
  },

  deleteSlide: (id) => store.remove(COLLECTION, id),
};
