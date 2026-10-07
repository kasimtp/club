// Global Auth Context Provider
// With Firebase configured, Firebase Auth state is the source of truth: the cached session in
// localStorage only paints the first frame and is replaced (or cleared) once Firebase reports
// who is signed in — so editing localStorage can't grant admin access.
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useCloud } from '../services/store';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  // In cloud mode we wait for Firebase before trusting any session (ProtectedRoute shows a spinner)
  const [authReady, setAuthReady] = useState(!useCloud);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!useCloud) return undefined;
    return onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (!fbUser) {
          await authService.logout();
          setUser(null);
        } else {
          setUser(await authService.resolveSession(fbUser));
        }
      } catch (err) {
        console.error('Could not load your account:', err);
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (useCloud) {
        if (auth.currentUser) setUser(await authService.resolveSession(auth.currentUser));
        return;
      }
      const current = authService.getCurrentUser();
      if (current && current.role !== 'admin') {
        setUser(await authService.syncUserProfile(current));
      }
    } catch (err) {
      console.error('Error refreshing user session:', err);
    }
  }, []);

  const withLoading = async (fn) => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () =>
    withLoading(async () => {
      const loggedUser = await authService.signInWithGoogle();
      setUser(loggedUser);
      return loggedUser;
    });

  const loginAdmin = (email, password) =>
    withLoading(async () => {
      const adminUser = await authService.loginAdmin(email, password);
      setUser(adminUser);
      return adminUser;
    });

  const logout = () =>
    withLoading(async () => {
      await authService.logout();
      setUser(null);
    });

  const updateUserProfile = async (profileData) => {
    if (!user) return undefined;
    const updated = await authService.updateProfile(user.uid || user.id, profileData);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const membershipStatus = user?.membershipStatus || 'not_applied';
  const isMember = membershipStatus === 'approved';
  const isPending = membershipStatus === 'pending';
  const memberData = user?.memberData || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isMember,
        isPending,
        membershipStatus,
        memberData,
        loading: loading || !authReady,
        authReady,
        loginWithGoogle,
        loginAdmin,
        logout,
        updateUserProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
