// Events Service
import { defaultEvents } from '../data/clubData';

const EVENTS_KEY = 'universal_club_events_store';
const FAVOURITES_KEY = 'universal_club_favourite_events';

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
    console.error(`Failed to save events key: ${key}`, err);
  }
};

export const eventService = {
  getEvents: async () => {
    return loadLocal(EVENTS_KEY, defaultEvents);
  },

  getFavourites: () => {
    return loadLocal(FAVOURITES_KEY, []);
  },

  toggleFavourite: (eventId) => {
    const favs = loadLocal(FAVOURITES_KEY, []);
    const index = favs.indexOf(eventId);
    let updated;
    if (index >= 0) {
      updated = favs.filter(id => id !== eventId);
    } else {
      updated = [...favs, eventId];
    }
    saveLocal(FAVOURITES_KEY, updated);
    return updated;
  },

  isFavourite: (eventId) => {
    const favs = loadLocal(FAVOURITES_KEY, []);
    return favs.includes(eventId);
  },

  createEvent: async (eventData) => {
    const list = loadLocal(EVENTS_KEY, defaultEvents);
    const id = `e_${Date.now()}`;
    const newEvent = {
      id,
      ...eventData,
      createdAt: new Date().toISOString()
    };
    list.unshift(newEvent);
    saveLocal(EVENTS_KEY, list);
    return newEvent;
  },

  deleteEvent: async (id) => {
    let list = loadLocal(EVENTS_KEY, defaultEvents);
    list = list.filter(e => e.id !== id);
    saveLocal(EVENTS_KEY, list);
    return true;
  }
};
