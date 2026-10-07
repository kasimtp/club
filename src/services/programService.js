// Programs & Upcoming Tournaments Service — Firestore `programs` (shared with the mobile app)
import { store } from './store';

const COLLECTION = 'programs';
const newestFirst = (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''));

export const programService = {
  getPrograms: async () => (await store.list(COLLECTION)).sort(newestFirst),

  getProgramById: (id) => store.get(COLLECTION, id),

  createProgram: async (programData) => {
    const id = `prog_${Date.now()}`;
    return store.set(COLLECTION, id, {
      id,
      documentId: id,
      title: programData.title,
      description: programData.description || '',
      date: programData.date || 'Coming Soon',
      time: programData.time || 'TBA',
      location: programData.location || 'Vellur',
      category: programData.category || 'Upcoming Program',
      posterUrl: programData.posterUrl || '',
      status: 'coming_soon',
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
    });
  },

  deleteProgram: (id) => store.remove(COLLECTION, id),
};
