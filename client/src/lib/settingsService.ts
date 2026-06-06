import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  PlatformSettings,
  DEFAULT_PLATFORM_SETTINGS,
  UserPreferences,
  DEFAULT_USER_PREFERENCES,
} from '../../../shared/types';

const platformSettingsRef = () => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db, 'platformSettings', 'global');
};

export const settingsService = {
  getPlatformSettings: async (): Promise<{ settings: PlatformSettings; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const snap = await getDoc(platformSettingsRef());
      if (!snap.exists()) {
        return { settings: DEFAULT_PLATFORM_SETTINGS, error: null };
      }
      return { settings: { ...DEFAULT_PLATFORM_SETTINGS, ...snap.data() } as PlatformSettings, error: null };
    } catch (error: any) {
      return { settings: DEFAULT_PLATFORM_SETTINGS, error: error.message };
    }
  },

  savePlatformSettings: async (
    settings: Partial<PlatformSettings>,
    updatedBy: string
  ): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const current = await settingsService.getPlatformSettings();
      const merged: PlatformSettings = {
        ...current.settings,
        ...settings,
        updatedAt: Date.now(),
        updatedBy,
      };
      await setDoc(platformSettingsRef(), merged);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getUserPreferences: (profile: { preferences?: UserPreferences } | null): UserPreferences => ({
    ...DEFAULT_USER_PREFERENCES,
    ...profile?.preferences,
  }),

  saveUserPreferences: async (
    uid: string,
    preferences: UserPreferences
  ): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'users', uid), { preferences });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};
