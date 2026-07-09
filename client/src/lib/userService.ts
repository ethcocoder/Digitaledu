import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserRole } from '../../../shared/types';

const API_BASE = '';

export const userService = {
  getAllUsers: async (): Promise<{ users: UserProfile[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserProfile);
      });
      return { users, error: null };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return { users: [], error: error.message };
    }
  },

  updateUserRole: async (uid: string, newRole: UserRole): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  updateUserStatus: async (uid: string, newStatus: string): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'users', uid), { status: newStatus });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Update user profile fields (name, email, role, status)
  updateUserProfile: async (
    uid: string,
    data: { fullName?: string; email?: string; role?: UserRole; status?: string }
  ): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'users', uid), data);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Create user via server API (Admin SDK) — creates Auth + Firestore
  createUser: async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ): Promise<{ error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/api/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Failed to create user' };
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Delete user via server API (Admin SDK) — removes Auth + Firestore
  deleteUser: async (uid: string): Promise<{ error: string | null }> => {
    try {
      const res = await fetch(`${API_BASE}/api/delete-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Failed to delete user' };
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
