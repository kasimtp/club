// Club Data Context Provider
// Loads all dynamic content from the database (Firestore) and exposes CRUD actions.
// Private records (members & applications) are only loaded for signed-in admins, so public
// visitors never download members' personal details.
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sliderService } from '../services/sliderService';
import { programService } from '../services/programService';
import { galleryService } from '../services/galleryService';
import { eventService, newsService } from '../services/eventService';
import { memberService } from '../services/memberService';
import { defaultTeam, defaultServices, clubInfo } from '../data/clubData';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const ClubDataContext = createContext(null);

// Turns Firestore errors into something an admin can act on
export function describeDbError(err, fallback = 'Something went wrong.') {
  if (err?.code === 'permission-denied') {
    return 'The database refused this. Only a signed-in Firebase admin account can do this — '
      + 'sign out and sign in with an account that has an admins/{uid} document in Firestore.';
  }
  if (err?.code === 'unavailable') return 'Cannot reach the database — check your internet connection.';
  return err?.message || fallback;
}

// Everything shown on the site, from the database. Members & applications only for admins.
async function loadAll(isAdmin) {
  const [slides, programs, events, news, gallery, members, requests] = await Promise.all([
    sliderService.getSlides(),
    programService.getPrograms(),
    eventService.getEvents(),
    newsService.list(),
    galleryService.getPhotos(),
    isAdmin ? memberService.getMembers() : [],
    isAdmin ? memberService.getRequests() : [],
  ]);
  return { slides, programs, events, news, gallery, members, requests };
}

export const ClubDataProvider = ({ children }) => {
  const { showToast } = useToast();
  const { isAdmin, authReady } = useAuth();

  const [slides, setSlides] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [team] = useState(defaultTeam);
  const [services] = useState(defaultServices);
  const [favourites, setFavourites] = useState(() => eventService.getFavourites());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const applyData = useCallback((data) => {
    setSlides(data.slides);
    setPrograms(data.programs);
    setEvents(data.events);
    setNews(data.news);
    setGallery(data.gallery);
    setMembers(data.members);
    setRequests(data.requests);
    setLoadError(null);
    setLoading(false);
  }, []);

  const applyError = useCallback((err) => {
    console.error('Error loading club data:', err);
    setLoadError(describeDbError(err, 'Could not load data from the database.'));
    setLoading(false);
  }, []);

  /** Reloads everything from the database (used after every write) */
  const fetchAllData = useCallback(
    () => loadAll(isAdmin).then(applyData, applyError),
    [isAdmin, applyData, applyError]
  );

  useEffect(() => {
    if (!authReady) return undefined;
    let cancelled = false;
    loadAll(isAdmin).then(
      (data) => { if (!cancelled) applyData(data); },
      (err) => { if (!cancelled) applyError(err); }
    );
    return () => { cancelled = true; };
  }, [authReady, isAdmin, applyData, applyError]);

  // Runs a write, refreshes data, and reports the result as a toast
  const run = useCallback(
    async (action, success, failure) => {
      try {
        const result = await action();
        await fetchAllData();
        const message = typeof success === 'function' ? success(result) : success;
        if (message) showToast(message, 'success');
        return result;
      } catch (err) {
        showToast(describeDbError(err, failure), 'error');
        throw err;
      }
    },
    [fetchAllData, showToast]
  );

  // Favourites (per-device preference)
  const toggleFavourite = (eventId) => {
    const updated = eventService.toggleFavourite(eventId);
    setFavourites(updated);
    showToast(updated.includes(eventId) ? 'Added to your saved events' : 'Removed from saved events', 'info');
  };
  const isFavourite = (eventId) => favourites.includes(eventId);

  const value = {
    clubInfo,
    slides,
    programs,
    events,
    news,
    gallery,
    members,
    requests,
    team,
    services,
    loading,
    loadError,
    fetchAllData,
    favourites,
    toggleFavourite,
    isFavourite,

    // Membership
    applyForMembership: (formData, currentUser) =>
      run(() => memberService.submitApplication(formData, currentUser),
        'Application submitted! The committee will review it shortly.', 'Failed to submit application'),
    approveRequest: (id, adminName) =>
      run(() => memberService.approveApplication(id, adminName),
        (m) => `Membership ${m.membershipId} issued and approved!`, 'Failed to approve request'),
    rejectRequest: (id, adminName) =>
      run(() => memberService.rejectApplication(id, adminName), 'Application marked as rejected.', 'Failed to reject request'),
    renewMemberRecord: (id, adminName) =>
      run(() => memberService.renewMember(id, adminName),
        (m) => `Membership extended until ${new Date(m.expiryDate).toLocaleDateString()}!`, 'Failed to renew membership'),
    addManualMember: (formData, adminName) =>
      run(() => memberService.addExistingMember(formData, adminName),
        (m) => `Member ${m.membershipId} record created!`, 'Failed to add member'),
    linkMember: (id, targetUser) =>
      run(() => memberService.linkMemberToUser(id, targetUser),
        `Account linked to ${targetUser.email || targetUser.name}!`, 'Failed to link account'),
    unlinkMember: (id) => run(() => memberService.unlinkMember(id), 'Account unlinked.', 'Failed to unlink account'),

    // Hero slides
    addSlide: (data) => run(() => sliderService.createSlide(data, slides.length), 'Hero slide published!', 'Failed to create slide'),
    updateSlide: (id, patch) => run(() => sliderService.updateSlide(id, patch), 'Slide updated!', 'Failed to update slide'),
    toggleSlideStatus: (id) => run(() => sliderService.toggleSlideActive(id), 'Slide visibility updated!', 'Failed to update slide'),
    removeSlide: (id) => run(() => sliderService.deleteSlide(id), 'Slide deleted.', 'Failed to delete slide'),

    // Programs
    addProgram: (data) => run(() => programService.createProgram(data), 'Program published!', 'Failed to publish program'),
    removeProgram: (id) => run(() => programService.deleteProgram(id), 'Program removed.', 'Failed to remove program'),

    // Gallery
    addGalleryPhoto: (data, author) => run(() => galleryService.createPhoto(data, author), 'Photo added to the gallery!', 'Failed to save photo'),
    removeGalleryPhoto: (id) => run(() => galleryService.deletePhoto(id), 'Photo deleted.', 'Failed to delete photo'),

    // Events
    addEvent: (data) => run(() => eventService.createEvent(data), 'Event published!', 'Failed to publish event'),
    updateEvent: (id, patch) => run(() => eventService.updateEvent(id, patch), 'Event updated!', 'Failed to update event'),
    removeEvent: (id) => run(() => eventService.deleteEvent(id), 'Event removed.', 'Failed to remove event'),
    importBuiltInEvents: () => run(() => eventService.importBuiltIn(), 'Built-in events saved to the database.', 'Failed to save events'),

    // News
    addNews: (data) => run(() => newsService.create(data), 'News published!', 'Failed to publish news'),
    updateNews: (id, patch) => run(() => newsService.update(id, patch), 'News updated!', 'Failed to update news'),
    removeNews: (id) => run(() => newsService.remove(id), 'News removed.', 'Failed to remove news'),
    importBuiltInNews: () => run(() => newsService.importBuiltIn(), 'Built-in news saved to the database.', 'Failed to save news'),
  };

  return <ClubDataContext.Provider value={value}>{children}</ClubDataContext.Provider>;
};

export const useClubData = () => {
  const context = useContext(ClubDataContext);
  if (!context) {
    throw new Error('useClubData must be used within a ClubDataProvider');
  }
  return context;
};
