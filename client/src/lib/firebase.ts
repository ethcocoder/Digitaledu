import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCHN5ZHaDSnYsNc4OYEUtV_7RCVlYfWdGU',
  authDomain: 'digital-edu-b93df.firebaseapp.com',
  projectId: 'digital-edu-b93df',
  storageBucket: 'digital-edu-b93df.firebasestorage.app',
  messagingSenderId: '661264024077',
  appId: '1:661264024077:web:ba8c4e73895524ac64cb44',
  measurementId: 'G-TW7L4K2RN0',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ 'prompt': 'consent' });

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

// Authentication functions
export const authService = {
  // Register with email and password
  register: async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  // Login with Google
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Store user info
      if (result.user) {
        console.log('Google login successful:', result.user.email);
      }
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('Google login error:', error);
      // Handle specific error codes
      if (error.code === 'auth/popup-blocked') {
        return { user: null, error: 'Popup was blocked. Please allow popups and try again.' };
      } else if (error.code === 'auth/popup-closed-by-user') {
        return { user: null, error: 'Sign-in was cancelled.' };
      } else if (error.code === 'auth/cancelled-popup-request') {
        return { user: null, error: 'Sign-in request was cancelled.' };
      }
      return { user: null, error: error.message || 'Google sign-in failed. Please check your internet connection.' };
    }
  },

  // Login with GitHub
  loginWithGithub: async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      if (result.user) {
        console.log('GitHub login successful:', result.user.email);
      }
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('GitHub login error:', error);
      if (error.code === 'auth/popup-blocked') {
        return { user: null, error: 'Popup was blocked. Please allow popups and try again.' };
      } else if (error.code === 'auth/popup-closed-by-user') {
        return { user: null, error: 'Sign-in was cancelled.' };
      }
      return { user: null, error: error.message || 'GitHub sign-in failed. Please check your internet connection.' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Send password reset email
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

export default app;
