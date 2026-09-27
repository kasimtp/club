// Club Data Context Provider
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sliderService } from '../services/sliderService';
import { programService } from '../services/programService';
import { galleryService } from '../services/galleryService';
import { eventService } from '../services/eventService';
import { memberService } from '../services/memberService';
import { defaultTeam, defaultNews, defaultServices, clubInfo } from '../data/clubData';
import { useToast } from './ToastContext';

const ClubDataContext = createContext(null);

export const ClubDataProvider = ({ children }) => {
  const { showToast } = useToast();

  const [slides, setSlides] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [news] = useState(defaultNews);
  const [team] = useState(defaultTeam);
  const [services] = useState(defaultServices);
  const [favourites, setFavourites] = useState(() => eventService.getFavourites());
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [sList, pList, eList, gList, mList, rList] = await Promise.all([
        sliderService.getSlides(),
        programService.getPrograms(),
        eventService.getEvents(),
        galleryService.getPhotos(),
        memberService.getMembers(),
        memberService.getRequests(),
      ]);

      setSlides(sList);
      setPrograms(pList);
      setEvents(eList);
      setGallery(gList);
      setMembers(mList);
      setRequests(rList);
    } catch (err) {
      console.error('Error loading club data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadInit = async () => {
      try {
        const [sList, pList, eList, gList, mList, rList] = await Promise.all([
          sliderService.getSlides(),
          programService.getPrograms(),
          eventService.getEvents(),
          galleryService.getPhotos(),
          memberService.getMembers(),
          memberService.getRequests(),
        ]);

        if (isMounted) {
          setSlides(sList);
          setPrograms(pList);
          setEvents(eList);
          setGallery(gList);
          setMembers(mList);
          setRequests(rList);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading club data:', err);
        if (isMounted) setLoading(false);
      }
    };
    loadInit();
    return () => { isMounted = false; };
  }, []);

  // Favourites helper
  const toggleFavourite = (eventId) => {
    const updated = eventService.toggleFavourite(eventId);
    setFavourites(updated);
    const isNowFav = updated.includes(eventId);
    showToast(isNowFav ? 'Added to your saved events' : 'Removed from saved events', 'info');
  };

  const isFavourite = (eventId) => {
    return favourites.includes(eventId);
  };

  // Membership Actions
  const applyForMembership = async (formData, currentUser) => {
    try {
      const newReq = await memberService.submitApplication(formData, currentUser);
      await fetchAllData();
      showToast('Application submitted successfully! Our team will review it shortly.', 'success');
      return newReq;
    } catch (err) {
      showToast(err.message || 'Failed to submit application', 'error');
      throw err;
    }
  };

  const approveRequest = async (requestId, adminName) => {
    try {
      const approved = await memberService.approveApplication(requestId, adminName);
      await fetchAllData();
      showToast(`Membership ${approved.membershipId} issued and approved!`, 'success');
      return approved;
    } catch (err) {
      showToast(err.message || 'Failed to approve request', 'error');
      throw err;
    }
  };

  const rejectRequest = async (requestId, adminName) => {
    try {
      await memberService.rejectApplication(requestId, adminName);
      await fetchAllData();
      showToast('Application marked as rejected.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to reject request', 'error');
      throw err;
    }
  };

  const renewMemberRecord = async (memberId, adminName) => {
    try {
      const renewed = await memberService.renewMember(memberId, adminName);
      await fetchAllData();
      showToast(`Membership extended by 1 year until ${new Date(renewed.expiryDate).toLocaleDateString()}!`, 'success');
      return renewed;
    } catch (err) {
      showToast(err.message || 'Failed to renew membership', 'error');
      throw err;
    }
  };

  const addManualMember = async (formData, adminName) => {
    try {
      const added = await memberService.addExistingMember(formData, adminName);
      await fetchAllData();
      showToast(`Member ${added.membershipId} record created successfully!`, 'success');
      return added;
    } catch (err) {
      showToast(err.message || 'Failed to add member', 'error');
      throw err;
    }
  };

  const linkMember = async (memberId, targetUser) => {
    try {
      const linked = await memberService.linkMemberToUser(memberId, targetUser);
      await fetchAllData();
      showToast(`Account linked to ${targetUser.email || targetUser.name}!`, 'success');
      return linked;
    } catch (err) {
      showToast(err.message || 'Failed to link account', 'error');
      throw err;
    }
  };

  const unlinkMember = async (memberId) => {
    try {
      const unlinked = await memberService.unlinkMember(memberId);
      await fetchAllData();
      showToast('Account unlinked successfully.', 'info');
      return unlinked;
    } catch (err) {
      showToast(err.message || 'Failed to unlink account', 'error');
      throw err;
    }
  };

  // Slider CMS Actions
  const addSlide = async (slideData) => {
    try {
      const slide = await sliderService.createSlide(slideData);
      await fetchAllData();
      showToast('Hero slide created successfully!', 'success');
      return slide;
    } catch (err) {
      showToast(err.message || 'Failed to create slide', 'error');
      throw err;
    }
  };

  const toggleSlideStatus = async (slideId) => {
    try {
      await sliderService.toggleSlideActive(slideId);
      await fetchAllData();
      showToast('Slide visibility updated!', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to update slide', 'error');
      throw err;
    }
  };

  const removeSlide = async (slideId) => {
    try {
      await sliderService.deleteSlide(slideId);
      await fetchAllData();
      showToast('Slide deleted.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete slide', 'error');
      throw err;
    }
  };

  // Program CMS Actions
  const addProgram = async (programData) => {
    try {
      const prog = await programService.createProgram(programData);
      await fetchAllData();
      showToast('Program published successfully!', 'success');
      return prog;
    } catch (err) {
      showToast(err.message || 'Failed to publish program', 'error');
      throw err;
    }
  };

  const removeProgram = async (programId) => {
    try {
      await programService.deleteProgram(programId);
      await fetchAllData();
      showToast('Program removed.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove program', 'error');
      throw err;
    }
  };

  // Gallery CMS Actions
  const addGalleryPhoto = async (photoData, author) => {
    try {
      const photo = await galleryService.createPhoto(photoData, author);
      await fetchAllData();
      showToast('Photo uploaded to gallery!', 'success');
      return photo;
    } catch (err) {
      showToast(err.message || 'Failed to upload photo', 'error');
      throw err;
    }
  };

  const removeGalleryPhoto = async (photoId) => {
    try {
      await galleryService.deletePhoto(photoId);
      await fetchAllData();
      showToast('Photo deleted from gallery.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete photo', 'error');
      throw err;
    }
  };

  return (
    <ClubDataContext.Provider
      value={{
        clubInfo,
        slides,
        programs,
        events,
        gallery,
        members,
        requests,
        news,
        team,
        services,
        loading,
        fetchAllData,
        // Favourites
        favourites,
        toggleFavourite,
        isFavourite,
        // Membership
        applyForMembership,
        approveRequest,
        rejectRequest,
        renewMemberRecord,
        addManualMember,
        linkMember,
        unlinkMember,
        // CMS
        addSlide,
        toggleSlideStatus,
        removeSlide,
        addProgram,
        removeProgram,
        addGalleryPhoto,
        removeGalleryPhoto
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
