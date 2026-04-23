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
  Auth,
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  Firestore 
} from 'firebase/firestore';
import { UserRole, UserProfile } from '../../../shared/types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHN5ZHaDSnYsNc4OYEUtV_7RCVlYfWdGU",
  authDomain: "digital-edu-b93df.firebaseapp.com",
  projectId: "digital-edu-b93df",
  storageBucket: "digital-edu-b93df.firebasestorage.app",
  messagingSenderId: "661264024077",
  appId: "1:661264024077:web:ba8c4e73895524ac64cb44",
  measurementId: "G-TW7L4K2RN0"
};

// Initialize Firebase with error handling
let app;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error: any) {
  console.error('Firebase initialization error:', error);
}

export { auth, db };

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ 'prompt': 'consent' });

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

export { googleProvider, githubProvider };

// Authentication functions
export const authService = {
  // Register with email and password
  register: async (email: string, password: string, fullName: string, role: UserRole = 'student') => {
    try {
      if (!auth || !db) throw new Error('Firebase not initialized');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email,
        fullName,
        role,
        createdAt: Date.now(),
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      
      return { user: result.user, profile: userProfile, error: null };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { user: null, profile: null, error: error.message };
    }
  },

  // Get user profile
  getUserProfile: async (uid: string) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { profile: docSnap.data() as UserProfile, error: null };
      }
      return { profile: null, error: 'Profile not found' };
    } catch (error: any) {
      console.error('Get profile error:', error);
      return { profile: null, error: error.message };
    }
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      if (!auth) throw new Error('Firebase not initialized');
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { user: null, error: error.message };
    }
  },

  // Login with Google
  loginWithGoogle: async () => {
    try {
      if (!auth) throw new Error('Firebase not initialized');
      const result = await signInWithPopup(auth, googleProvider);
      // Store user info
      if (result.user) {
        console.log('Google login successful:', result.user.email);
        
        // Check if profile exists, if not create it
        const { profile } = await this.getUserProfile(result.user.uid);
        if (!profile) {
          const userProfile: UserProfile = {
            uid: result.user.uid,
            email: result.user.email || '',
            fullName: result.user.displayName || 'Google User',
            role: 'student',
            createdAt: Date.now(),
          };
          await setDoc(doc(db!, 'users', result.user.uid), userProfile);
        }
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
      if (!auth) throw new Error('Firebase not initialized');
      const result = await signInWithPopup(auth, githubProvider);
      if (result.user) {
        console.log('GitHub login successful:', result.user.email);
        
        // Check if profile exists, if not create it
        const { profile } = await this.getUserProfile(result.user.uid);
        if (!profile) {
          const userProfile: UserProfile = {
            uid: result.user.uid,
            email: result.user.email || '',
            fullName: result.user.displayName || 'GitHub User',
            role: 'student',
            createdAt: Date.now(),
          };
          await setDoc(doc(db!, 'users', result.user.uid), userProfile);
        }
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
      if (!auth) throw new Error('Firebase not initialized');
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { error: error.message };
    }
  },

  // Send password reset email
  resetPassword: async (email: string) => {
    try {
      if (!auth) throw new Error('Firebase not initialized');
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    if (!auth) {
      console.error('Firebase not initialized');
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },
};

export default app || {};
export { app };
