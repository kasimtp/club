// Club Data Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { initDb } from '../services/mockDb';
import { useToast } from './ToastContext';

const ClubDataContext = createContext(null);

export const ClubDataProvider = ({ children }) => {
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [news, setNews] = useState([]);
  const [team, setTeam] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState({
    members: false,
    events: false,
    gallery: false,
    news: false,
    team: false,
    requests: false
  });

  // Initialize and load all data on mount
  useEffect(() => {
    initDb();
    refreshAll();
  }, []);

  const refreshAll = () => {
    fetchMembers();
    fetchEvents();
    fetchGallery();
    fetchNews();
    fetchTeam();
    fetchRequests();
  };

  // ---------------- MEMBERS ACTIONS ----------------
  const fetchMembers = async () => {
    setLoading(prev => ({ ...prev, members: true }));
    try {
      const res = await api.members.getAll();
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch members list', 'error');
    } finally {
      setLoading(prev => ({ ...prev, members: false }));
    }
  };

  const createMember = async (memberData) => {
    setLoading(prev => ({ ...prev, members: true }));
    try {
      const res = await api.members.create(memberData);
      setMembers(prev => [res.data, ...prev]);
      showToast('Member created successfully!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to create member', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, members: false }));
    }
  };

  const updateMember = async (id, memberData) => {
    setLoading(prev => ({ ...prev, members: true }));
    try {
      const res = await api.members.update(id, memberData);
      setMembers(prev => prev.map(m => m.id === id ? res.data : m));
      showToast('Member profile updated!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to update member', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, members: false }));
    }
  };

  const deleteMember = async (id) => {
    setLoading(prev => ({ ...prev, members: true }));
    try {
      await api.members.delete(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      showToast('Member deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete member', 'error');
    } finally {
      setLoading(prev => ({ ...prev, members: false }));
    }
  };

  // ---------------- EVENTS ACTIONS ----------------
  const fetchEvents = async () => {
    setLoading(prev => ({ ...prev, events: true }));
    try {
      const res = await api.events.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch events list', 'error');
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const createEvent = async (eventData) => {
    setLoading(prev => ({ ...prev, events: true }));
    try {
      const res = await api.events.create(eventData);
      setEvents(prev => [res.data, ...prev]);
      showToast('Event created successfully!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to create event', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const updateEvent = async (id, eventData) => {
    setLoading(prev => ({ ...prev, events: true }));
    try {
      const res = await api.events.update(id, eventData);
      setEvents(prev => prev.map(e => e.id === id ? res.data : e));
      showToast('Event updated successfully!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to update event', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const deleteEvent = async (id) => {
    setLoading(prev => ({ ...prev, events: true }));
    try {
      await api.events.delete(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      showToast('Event removed successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete event', 'error');
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const registerForEvent = async (eventId, registrationData) => {
    setLoading(prev => ({ ...prev, events: true }));
    try {
      const res = await api.events.register(eventId, registrationData);
      setEvents(prev => prev.map(e => e.id === eventId ? res.data : e));
      showToast('Registered for event successfully!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  // ---------------- GALLERY ACTIONS ----------------
  const fetchGallery = async () => {
    setLoading(prev => ({ ...prev, gallery: true }));
    try {
      const res = await api.gallery.getAll();
      setGallery(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load gallery items', 'error');
    } finally {
      setLoading(prev => ({ ...prev, gallery: false }));
    }
  };

  const createGalleryItem = async (itemData) => {
    setLoading(prev => ({ ...prev, gallery: true }));
    try {
      const res = await api.gallery.create(itemData);
      setGallery(prev => [res.data, ...prev]);
      showToast('Gallery media item added!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to add gallery item', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, gallery: false }));
    }
  };

  const deleteGalleryItem = async (id) => {
    setLoading(prev => ({ ...prev, gallery: true }));
    try {
      await api.gallery.delete(id);
      setGallery(prev => prev.filter(g => g.id !== id));
      showToast('Media item removed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete item', 'error');
    } finally {
      setLoading(prev => ({ ...prev, gallery: false }));
    }
  };

  // ---------------- NEWS ACTIONS ----------------
  const fetchNews = async () => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const res = await api.news.getAll();
      setNews(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch announcements', 'error');
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  const createNews = async (newsData) => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const res = await api.news.create(newsData);
      setNews(prev => [res.data, ...prev]);
      showToast('Announcement posted!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to post announcement', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  const updateNews = async (id, newsData) => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const res = await api.news.update(id, newsData);
      setNews(prev => prev.map(n => n.id === id ? res.data : n));
      showToast('Announcement edited!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to update announcement', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  const deleteNews = async (id) => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      await api.news.delete(id);
      setNews(prev => prev.filter(n => n.id !== id));
      showToast('Announcement removed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete news article', 'error');
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  // ---------------- TEAM ACTIONS ----------------
  const fetchTeam = async () => {
    setLoading(prev => ({ ...prev, team: true }));
    try {
      const res = await api.team.getAll();
      setTeam(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch team members list', 'error');
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  };

  const createTeamMember = async (teamData) => {
    setLoading(prev => ({ ...prev, team: true }));
    try {
      const res = await api.team.create(teamData);
      setTeam(prev => [...prev, res.data]);
      showToast('Team member added successfully!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to add team member', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  };

  const updateTeamMember = async (id, teamData) => {
    setLoading(prev => ({ ...prev, team: true }));
    try {
      const res = await api.team.update(id, teamData);
      setTeam(prev => prev.map(t => t.id === id ? res.data : t));
      showToast('Team member details updated!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to update team details', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  };

  const deleteTeamMember = async (id) => {
    setLoading(prev => ({ ...prev, team: true }));
    try {
      await api.team.delete(id);
      setTeam(prev => prev.filter(t => t.id !== id));
      showToast('Team member removed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to remove team member', 'error');
    } finally {
      setLoading(prev => ({ ...prev, team: false }));
    }
  };

  // ---------------- MEMBERSHIP REQUESTS ACTIONS ----------------
  const fetchRequests = async () => {
    setLoading(prev => ({ ...prev, requests: true }));
    try {
      const res = await api.requests.getAll();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch requests', 'error');
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const createMembershipRequest = async (requestData) => {
    setLoading(prev => ({ ...prev, requests: true }));
    try {
      const res = await api.requests.create(requestData);
      setRequests(prev => [res.data, ...prev]);
      showToast('Registration request submitted!', 'success');
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to submit application', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const updateRequestStatus = async (id, status) => {
    setLoading(prev => ({ ...prev, requests: true }));
    try {
      const res = await api.requests.updateStatus(id, status);
      setRequests(prev => prev.map(r => r.id === id ? res.data : r));
      
      if (status === 'Approved') {
        showToast('Application approved! Added to members.', 'success');
        // Refresh members list to show newly approved member
        fetchMembers();
      } else {
        showToast('Application marked as rejected', 'info');
      }
      return res.data;
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const deleteRequest = async (id) => {
    setLoading(prev => ({ ...prev, requests: true }));
    try {
      await api.requests.delete(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      showToast('Application deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete request', 'error');
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  return (
    <ClubDataContext.Provider
      value={{
        members,
        events,
        gallery,
        news,
        team,
        requests,
        loading,
        createMember,
        updateMember,
        deleteMember,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        createGalleryItem,
        deleteGalleryItem,
        createNews,
        updateNews,
        deleteNews,
        createTeamMember,
        updateTeamMember,
        deleteTeamMember,
        createMembershipRequest,
        updateRequestStatus,
        deleteRequest
      }}
    >
      {children}
    </ClubDataContext.Provider>
  );
};

export const useClubData = () => {
  const context = useContext(ClubDataContext);
  if (!context) {
    throw new Error('useClubData must be used within a ClubDataProvider');
  }
  return context;
};
