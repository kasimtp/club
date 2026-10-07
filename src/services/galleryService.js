// Gallery Photos Service — Firestore `gallery` (shared with the mobile app)
import { store } from './store';

const COLLECTION = 'gallery';
const newestFirst = (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''));

export const galleryService = {
  getPhotos: async () => (await store.list(COLLECTION)).sort(newestFirst),

  createPhoto: async (photoData, authorName = 'Member') => {
    const id = `gal_${Date.now()}`;
    return store.set(COLLECTION, id, {
      id,
      documentId: id,
      title: photoData.title || 'Club Activity',
      description: photoData.description || '',
      category: photoData.category || 'General',
      imageUrl: photoData.imageUrl,
      createdAt: new Date().toISOString(),
      createdBy: authorName,
    });
  },

  deletePhoto: (id) => store.remove(COLLECTION, id),
};
