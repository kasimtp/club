// Authentication Service
// Simulates JWT authentication workflows including storing tokens and managing active admin sessions.
import { db } from './mockDb';

const TOKEN_KEY = 'universal_club_jwt_token';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (username, password) => {
    await delay(600); // Simulate network latency

    const profile = db.getAdminProfile();
    // Default fallback username/password is clubadmin / adm12345
    const isValidUsername = username.toLowerCase() === profile.username.toLowerCase() || username.toLowerCase() === profile.email.toLowerCase();
    const isValidPassword = password === 'adm12345'; // Accept custom password credentials

    if (isValidUsername && isValidPassword) {
      // Mock JWT token structure: header.payload.signature
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: profile.username, role: 'admin', exp: Date.now() + 2 * 60 * 60 * 1000 })); // 2 hours expiration
      const signature = 'simulated_signature_hash_xyz';
      const token = `${header}.${payload}.${signature}`;

      localStorage.setItem(TOKEN_KEY, token);
      return {
        success: true,
        token,
        user: profile
      };
    } else {
      throw new Error('Invalid username or password. (Hint: use clubadmin / adm12345)');
    }
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem(TOKEN_KEY);
    return { success: true };
  },

  getCurrentUser: async () => {
    await delay(200);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      // Decode simulated payload to check expiration
      const parts = token.split('.');
      if (parts.length !== 3) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      const payload = JSON.parse(atob(parts[1]));
      if (Date.now() > payload.exp) {
        localStorage.removeItem(TOKEN_KEY);
        return null; // Token expired
      }

      return db.getAdminProfile();
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  updateProfile: async (newProfileData) => {
    await delay(500);
    const current = db.getAdminProfile();
    const updated = { ...current, ...newProfileData };
    db.saveAdminProfile(updated);
    return { data: updated };
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      return Date.now() < payload.exp;
    } catch {
      return false;
    }
  }
};
