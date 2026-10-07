// Events & News Services — Firestore `events` and `news`
// Until the admin saves anything, the built-in posts from the club's Facebook/Instagram
// (data/clubData.js) are shown; the admin pages can copy them into the database.
import { store } from './store';
import { defaultEvents, defaultNews } from '../data/clubData';

const FAVOURITES_KEY = 'universal_club_favourite_events'; // per-device preference, stays local

const byDateDesc = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));

const loadFavourites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVOURITES_KEY) || '[]');
  } catch {
    return [];
  }
};

function contentService(collectionName, builtIn, prefix) {
  return {
    /** Saved records, newest first; falls back to the built-in posts when the collection is empty */
    async list() {
      const saved = await store.list(collectionName);
      return (saved.length ? saved : builtIn.map((d) => ({ ...d, builtIn: true }))).sort(byDateDesc);
    },

    async create(data) {
      const id = `${prefix}_${Date.now()}`;
      return store.set(collectionName, id, {
        ...data,
        id,
        documentId: id,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin',
      });
    },

    update: (id, patch) => store.update(collectionName, id, patch),

    remove: (id) => store.remove(collectionName, id),

    /** Copies the built-in posts into the database so they can be edited / removed */
    async importBuiltIn() {
      for (const item of builtIn) {
        await store.set(collectionName, item.id, { ...item, documentId: item.id, createdAt: new Date().toISOString(), createdBy: 'Admin' });
      }
    },
  };
}

export const newsService = contentService('news', defaultNews, 'news');
const events = contentService('events', defaultEvents, 'evt');

export const eventService = {
  getEvents: events.list,
  createEvent: events.create,
  updateEvent: events.update,
  deleteEvent: events.remove,
  importBuiltIn: events.importBuiltIn,

  getFavourites: loadFavourites,

  toggleFavourite: (eventId) => {
    const favs = loadFavourites();
    const updated = favs.includes(eventId) ? favs.filter((id) => id !== eventId) : [...favs, eventId];
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
    return updated;
  },

  isFavourite: (eventId) => loadFavourites().includes(eventId),
};
