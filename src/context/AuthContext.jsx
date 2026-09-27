// Global Auth Context Provider
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const current = authService.getCurrentUser();
      if (current) {
        if (current.role === 'admin') {
          setUser(current);
        } else {
          const synced = await authService.syncUserProfile(current);
          setUser(synced);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error refreshing user session:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      const current = authService.getCurrentUser();
      if (current && isMounted) {
        if (current.role === 'admin') {
          setUser(current);
        } else {
          const synced = await authService.syncUserProfile(current);
          if (isMounted) setUser(synced);
        }
      }
    };
    initSession();

    // Listen for storage changes across tabs
    const handleStorage = (e) => {
      if (e.key === 'universal_club_auth_user' || e.key === 'universal_club_members_store') {
        refreshUser();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshUser]);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const loggedUser = await authService.signInWithGoogle();
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMockGoogle = async (mockData) => {
    setLoading(true);
    try {
      const loggedUser = await authService.signInWithMockGoogle(mockData);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (username, password) => {
    setLoading(true);
    try {
      const adminUser = await authService.loginAdmin(username, password);
      setUser(adminUser);
      return adminUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.uid || user.id, profileData);
    setUser(updated);
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
        loading,
        loginWithGoogle,
        loginWithMockGoogle,
        loginAdmin,
        logout,
        updateUserProfile,
        refreshUser
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
