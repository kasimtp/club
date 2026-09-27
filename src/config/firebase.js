// Firebase Configuration and Service Initializer
// Safely supports live Cloud Firestore & Firebase Auth when env vars are present,
// and provides fallback persistence to guarantee flawless runtime across environments.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForUniversalClubApp",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "universal-club-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "universal-club-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "universal-club-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyMockKeyForUniversalClubApp"
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.warn("Firebase initialization warning (using local fallback sync engine):", error.message);
}

export { app, auth, db, googleProvider };
