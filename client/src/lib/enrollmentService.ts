import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Enrollment } from '../../../shared/types';
import { courseService } from './courseService';

export const enrollmentService = {
  enrollStudent: async (
    studentId: string,
    studentName: string,
    courseId: string
  ): Promise<{ enrollmentId: string | null; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');

      const { course, error: courseError } = await courseService.getCourseById(courseId);
      if (courseError || !course) throw new Error(courseError || 'Course not found');
      if (course.status !== 'approved') throw new Error('Course is not available for enrollment');

      const existing = await enrollmentService.getEnrollment(studentId, courseId);
      if (existing.enrollment) throw new Error('Already enrolled in this course');

      const enrollmentsRef = collection(db, 'enrollments');
      const newRef = doc(enrollmentsRef);
      const now = Date.now();

      const enrollment: Enrollment = {
        id: newRef.id,
        studentId,
        studentName,
        courseId,
        courseTitle: course.title,
        instructorId: course.instructorId,
        progress: 0,
        completedModules: [],
        enrolledAt: now,
        lastAccessedAt: now,
      };

      await setDoc(newRef, enrollment);
      await courseService.incrementStudentsCount(courseId);

      return { enrollmentId: newRef.id, error: null };
    } catch (error: any) {
      console.error('Error enrolling student:', error);
      return { enrollmentId: null, error: error.message };
    }
  },

  getEnrollment: async (
    studentId: string,
    courseId: string
  ): Promise<{ enrollment: Enrollment | null; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(
        collection(db, 'enrollments'),
        where('studentId', '==', studentId),
        where('courseId', '==', courseId)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return { enrollment: null, error: null };
      const docSnap = snapshot.docs[0];
      return { enrollment: { id: docSnap.id, ...docSnap.data() } as Enrollment, error: null };
    } catch (error: any) {
      return { enrollment: null, error: error.message };
    }
  },

  getStudentEnrollments: async (
    studentId: string
  ): Promise<{ enrollments: Enrollment[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(
        collection(db, 'enrollments'),
        where('studentId', '==', studentId),
        orderBy('lastAccessedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const enrollments: Enrollment[] = [];
      snapshot.forEach((d) => enrollments.push({ id: d.id, ...d.data() } as Enrollment));
      return { enrollments, error: null };
    } catch (error: any) {
      return { enrollments: [], error: error.message };
    }
  },

  getInstructorEnrollments: async (
    instructorId: string
  ): Promise<{ enrollments: Enrollment[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(
        collection(db, 'enrollments'),
        where('instructorId', '==', instructorId),
        orderBy('enrolledAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const enrollments: Enrollment[] = [];
      snapshot.forEach((d) => enrollments.push({ id: d.id, ...d.data() } as Enrollment));
      return { enrollments, error: null };
    } catch (error: any) {
      return { enrollments: [], error: error.message };
    }
  },

  getAllEnrollments: async (): Promise<{ enrollments: Enrollment[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(collection(db, 'enrollments'), orderBy('enrolledAt', 'desc'));
      const snapshot = await getDocs(q);
      const enrollments: Enrollment[] = [];
      snapshot.forEach((d) => enrollments.push({ id: d.id, ...d.data() } as Enrollment));
      return { enrollments, error: null };
    } catch (error: any) {
      return { enrollments: [], error: error.message };
    }
  },

  updateEnrollment: async (
    enrollmentId: string,
    updates: Partial<Pick<Enrollment, 'progress' | 'completedModules' | 'assessmentResults' | 'goal'>>
  ): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        ...updates,
        lastAccessedAt: Date.now(),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  updateProgress: async (
    enrollmentId: string,
    progress: number,
    completedModules: string[]
  ): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        progress,
        completedModules,
        lastAccessedAt: Date.now(),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  subscribeToStudentEnrollments: (
    studentId: string,
    callback: (enrollments: Enrollment[]) => void
  ): (() => void) => {
    if (!db) return () => {};
    const q = query(
      collection(db, 'enrollments'),
      where('studentId', '==', studentId),
      orderBy('lastAccessedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const enrollments: Enrollment[] = [];
      snapshot.forEach((d) => enrollments.push({ id: d.id, ...d.data() } as Enrollment));
      callback(enrollments);
    });
  },
};
