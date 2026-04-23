import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserRole } from '../../../shared/types';

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<{ users: UserProfile[], error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const usersRef = collection(db, 'users');
      // Order by creation date descending
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

  // Update user role
  updateUserRole: async (uid: string, newRole: UserRole): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role: newRole
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error updating user role:', error);
      return { error: error.message };
    }
  },

  // Update user status
  updateUserStatus: async (uid: string, newStatus: string): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        status: newStatus
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error updating user status:', error);
      return { error: error.message };
    }
  }
};
