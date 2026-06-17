// API Service Layer
// Mimics asynchronous Axios requests with custom loading delays to trigger React loading states and spinners.
import { db } from './mockDb';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Members Endpoints
  members: {
    getAll: async () => {
      await delay(500);
      return { data: db.getMembers() };
    },
    create: async (memberData) => {
      await delay(400);
      const members = db.getMembers();
      const newMember = {
        id: `m-${Date.now()}`,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        ...memberData
      };
      members.unshift(newMember);
      db.saveMembers(members);
      return { data: newMember };
    },
    update: async (id, memberData) => {
      await delay(400);
      const members = db.getMembers();
      const index = members.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Member not found');
      members[index] = { ...members[index], ...memberData };
      db.saveMembers(members);
      return { data: members[index] };
    },
    delete: async (id) => {
      await delay(300);
      const members = db.getMembers();
      const filtered = members.filter(m => m.id !== id);
      db.saveMembers(filtered);
      return { data: { success: true } };
    }
  },

  // Events Endpoints
  events: {
    getAll: async () => {
      await delay(500);
      return { data: db.getEvents() };
    },
    getById: async (id) => {
      await delay(300);
      const events = db.getEvents();
      const event = events.find(e => e.id === id);
      if (!event) throw new Error('Event not found');
      return { data: event };
    },
    create: async (eventData) => {
      await delay(500);
      const events = db.getEvents();
      const newEvent = {
        id: `e-${Date.now()}`,
        registrations: [],
        ...eventData
      };
      events.unshift(newEvent);
      db.saveEvents(events);
      return { data: newEvent };
    },
    update: async (id, eventData) => {
      await delay(400);
      const events = db.getEvents();
      const index = events.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Event not found');
      events[index] = { ...events[index], ...eventData };
      db.saveEvents(events);
      return { data: events[index] };
    },
    delete: async (id) => {
      await delay(300);
      const events = db.getEvents();
      const filtered = events.filter(e => e.id !== id);
      db.saveEvents(filtered);
      return { data: { success: true } };
    },
    register: async (eventId, registrationData) => {
      await delay(500);
      const events = db.getEvents();
      const index = events.findIndex(e => e.id === eventId);
      if (index === -1) throw new Error('Event not found');
      events[index].registrations = events[index].registrations || [];
      events[index].registrations.push({
        ...registrationData,
        dateRegistered: new Date().toISOString().split('T')[0]
      });
      db.saveEvents(events);
      return { data: events[index] };
    }
  },

  // Gallery Endpoints
  gallery: {
    getAll: async () => {
      await delay(400);
      return { data: db.getGallery() };
    },
    create: async (itemData) => {
      await delay(400);
      const gallery = db.getGallery();
      const newItem = {
        id: `g-${Date.now()}`,
        ...itemData
      };
      gallery.unshift(newItem);
      db.saveGallery(gallery);
      return { data: newItem };
    },
    delete: async (id) => {
      await delay(300);
      const gallery = db.getGallery();
      const filtered = gallery.filter(g => g.id !== id);
      db.saveGallery(filtered);
      return { data: { success: true } };
    }
  },

  // News Endpoints
  news: {
    getAll: async () => {
      await delay(400);
      return { data: db.getNews() };
    },
    create: async (newsData) => {
      await delay(400);
      const news = db.getNews();
      const newNews = {
        id: `n-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...newsData
      };
      news.unshift(newNews);
      db.saveNews(news);
      return { data: newNews };
    },
    update: async (id, newsData) => {
      await delay(400);
      const news = db.getNews();
      const index = news.findIndex(n => n.id === id);
      if (index === -1) throw new Error('News not found');
      news[index] = { ...news[index], ...newsData };
      db.saveNews(news);
      return { data: news[index] };
    },
    delete: async (id) => {
      await delay(300);
      const news = db.getNews();
      const filtered = news.filter(n => n.id !== id);
      db.saveNews(filtered);
      return { data: { success: true } };
    }
  },

  // Team Endpoints
  team: {
    getAll: async () => {
      await delay(300);
      return { data: db.getTeam() };
    },
    create: async (teamData) => {
      await delay(400);
      const team = db.getTeam();
      const newMember = {
        id: `t-${Date.now()}`,
        ...teamData
      };
      team.push(newMember);
      db.saveTeam(team);
      return { data: newMember };
    },
    update: async (id, teamData) => {
      await delay(400);
      const team = db.getTeam();
      const index = team.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Team member not found');
      team[index] = { ...team[index], ...teamData };
      db.saveTeam(team);
      return { data: team[index] };
    },
    delete: async (id) => {
      await delay(300);
      const team = db.getTeam();
      const filtered = team.filter(t => t.id !== id);
      db.saveTeam(filtered);
      return { data: { success: true } };
    }
  },

  // Membership Requests Endpoints
  requests: {
    getAll: async () => {
      await delay(500);
      return { data: db.getRequests() };
    },
    create: async (requestData) => {
      await delay(500);
      const requests = db.getRequests();
      const newRequest = {
        id: `r-${Date.now()}`,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        ...requestData
      };
      requests.unshift(newRequest);
      db.saveRequests(requests);
      return { data: newRequest };
    },
    updateStatus: async (id, status) => {
      await delay(400);
      const requests = db.getRequests();
      const index = requests.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Request not found');
      requests[index].status = status;
      
      // If approved, automatically add them to members db
      if (status === 'Approved') {
        const members = db.getMembers();
        // Check if member already exists
        const exists = members.some(m => m.email === requests[index].email);
        if (!exists) {
          members.unshift({
            id: `m-${Date.now()}`,
            name: requests[index].name,
            email: requests[index].email,
            phone: requests[index].phone,
            role: 'Member',
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0]
          });
          db.saveMembers(members);
        }
      }

      db.saveRequests(requests);
      return { data: requests[index] };
    },
    delete: async (id) => {
      await delay(300);
      const requests = db.getRequests();
      const filtered = requests.filter(r => r.id !== id);
      db.saveRequests(filtered);
      return { data: { success: true } };
    }
  }
};
