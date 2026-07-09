import {
  doc, setDoc, getDoc, updateDoc, increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProgress, Badge } from '../../../shared/types';

const DEFAULT_BADGES: Badge[] = [
  { id: 'first_quiz', name: { en: 'First Steps', am: 'የመጀመሪያ እርምጃ' }, description: { en: 'Complete your first quiz', am: 'የመጀመሪያ ፈተናዎን ያጠናቅቁ' }, icon: '🎯', earnedAt: 0 },
  { id: 'streak_3', name: { en: '3-Day Streak', am: 'የ3 ቀን ተከታታይ' }, description: { en: 'Study for 3 days in a row', am: 'በተከታታይ ለ3 ቀናት ያጥኑ' }, icon: '🔥', earnedAt: 0 },
  { id: 'streak_7', name: { en: 'Week Warrior', am: 'የሳምንቱ ተዋጊ' }, description: { en: 'Study for 7 days in a row', am: 'በተከታታይ ለ7 ቀናት ያጥኑ' }, icon: '⚔️', earnedAt: 0 },
  { id: 'xp_100', name: { en: 'Century', am: 'መቶ' }, description: { en: 'Earn 100 XP', am: '100 ነጥብ ያግኙ' }, icon: '💯', earnedAt: 0 },
  { id: 'xp_500', name: { en: 'High Scorer', am: 'ከፍተኛ ነጥብ' }, description: { en: 'Earn 500 XP', am: '500 ነጥብ ያግኙ' }, icon: '🏆', earnedAt: 0 },
  { id: 'module_complete', name: { en: 'Module Master', am: 'የሞዱል ባለሙያ' }, description: { en: 'Complete your first module', am: 'የመጀመሪያ ሞዱልዎን ያጠናቅቁ' }, icon: '📚', earnedAt: 0 },
];

export const progressService = {
  getProgress: async (uid: string): Promise<{ progress: UserProgress | null; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const snap = await getDoc(doc(db, 'userProgress', uid));
      if (!snap.exists()) return { progress: null, error: null };
      return { progress: snap.data() as UserProgress, error: null };
    } catch (error: any) {
      return { progress: null, error: error.message };
    }
  },

  initProgress: async (uid: string): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const progress: UserProgress = {
        uid,
        totalXP: 0,
        streakCount: 0,
        lastActiveDate: Date.now(),
        badges: [],
        completedCourses: 0,
        totalQuizzesTaken: 0,
        quizzesCorrect: 0,
      };
      await setDoc(doc(db, 'userProgress', uid), progress);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  addXP: async (uid: string, amount: number): Promise<{ error: string | null; newBadges: Badge[] }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const ref = doc(db, 'userProgress', uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await progressService.initProgress(uid);
      }

      const current = snap.exists() ? snap.data() as UserProgress : null;
      const newTotal = (current?.totalXP || 0) + amount;
      const earnedBadges: Badge[] = [];

      // Check for XP badges
      const now = Date.now();
      if (newTotal >= 100 && !current?.badges.some((b) => b.id === 'xp_100')) {
        const badge = { ...DEFAULT_BADGES.find((b) => b.id === 'xp_100')!, earnedAt: now };
        earnedBadges.push(badge);
      }
      if (newTotal >= 500 && !current?.badges.some((b) => b.id === 'xp_500')) {
        const badge = { ...DEFAULT_BADGES.find((b) => b.id === 'xp_500')!, earnedAt: now };
        earnedBadges.push(badge);
      }

      // Update streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActive = current?.lastActiveDate ? new Date(current.lastActiveDate) : null;
      let streakCount = current?.streakCount || 0;

      if (lastActive) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastDate = new Date(lastActive);
        lastDate.setHours(0, 0, 0, 0);

        if (lastDate.getTime() === today.getTime()) {
          // Already active today, keep streak
        } else if (lastDate.getTime() === yesterday.getTime()) {
          streakCount += 1;
        } else {
          streakCount = 1;
        }
      } else {
        streakCount = 1;
      }

      // Check streak badges
      if (streakCount >= 3 && !current?.badges.some((b) => b.id === 'streak_3')) {
        const badge = { ...DEFAULT_BADGES.find((b) => b.id === 'streak_3')!, earnedAt: now };
        earnedBadges.push(badge);
      }
      if (streakCount >= 7 && !current?.badges.some((b) => b.id === 'streak_7')) {
        const badge = { ...DEFAULT_BADGES.find((b) => b.id === 'streak_7')!, earnedAt: now };
        earnedBadges.push(badge);
      }

      await updateDoc(ref, {
        totalXP: increment(amount),
        streakCount,
        lastActiveDate: today.getTime(),
        badges: [...(current?.badges || []), ...earnedBadges],
      });

      return { error: null, newBadges: earnedBadges };
    } catch (error: any) {
      return { error: error.message, newBadges: [] };
    }
  },

  recordQuiz: async (uid: string, correct: boolean): Promise<{ error: string | null; newBadges: Badge[] }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const ref = doc(db, 'userProgress', uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await progressService.initProgress(uid);
      }

      const current = snap.exists() ? snap.data() as UserProgress : null;
      const now = Date.now();
      const earnedBadges: Badge[] = [];

      // Check first quiz badge
      const newTotalQuizzes = (current?.totalQuizzesTaken || 0) + 1;
      if (newTotalQuizzes >= 1 && !current?.badges.some((b) => b.id === 'first_quiz')) {
        const badge = { ...DEFAULT_BADGES.find((b) => b.id === 'first_quiz')!, earnedAt: now };
        earnedBadges.push(badge);
      }

      await updateDoc(ref, {
        totalQuizzesTaken: increment(1),
        quizzesCorrect: increment(correct ? 1 : 0),
        badges: [...(current?.badges || []), ...earnedBadges],
      });

      // Also grant XP for quiz attempt
      const xpResult = await progressService.addXP(uid, correct ? 10 : 2);

      return { error: null, newBadges: [...earnedBadges, ...xpResult.newBadges] };
    } catch (error: any) {
      return { error: error.message, newBadges: [] };
    }
  },

  recordModuleComplete: async (uid: string): Promise<{ error: string | null; newBadges: Badge[] }> => {
    try {
      const now = Date.now();
      const earnedBadges: Badge[] = [];

      const ref = doc(db, 'userProgress', uid);
      const snap = await getDoc(ref);
      const current = snap.exists() ? snap.data() as UserProgress : null;

      if (!current?.badges.some((b) => b.id === 'module_complete')) {
        const badge = { ...DEFAULT_BADGES.find((b) => b.id === 'module_complete')!, earnedAt: now };
        earnedBadges.push(badge);
        await updateDoc(ref, { badges: [...(current?.badges || []), ...earnedBadges] });
      }

      const xpResult = await progressService.addXP(uid, 25);
      return { error: null, newBadges: [...earnedBadges, ...xpResult.newBadges] };
    } catch (error: any) {
      return { error: error.message, newBadges: [] };
    }
  },

  getDefaultBadges: () => DEFAULT_BADGES,
};
