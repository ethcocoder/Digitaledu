import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Course, CourseStatus, CourseModule, CourseReview } from '../../../shared/types';

function sortDesc(a: Course, b: Course, field: 'createdAt' | 'updatedAt') {
  return (b[field] || 0) - (a[field] || 0);
}

export const courseService = {
  getAllCourses: async (): Promise<{ courses: Course[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const courses: Course[] = [];
      querySnapshot.forEach((d) => courses.push(normalizeCourse(d.id, d.data())));
      return { courses, error: null };
    } catch (error: any) {
      console.error('Error fetching all courses:', error);
      return { courses: [], error: error.message };
    }
  },

  getPublishedCourses: async (): Promise<{ courses: Course[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(collection(db, 'courses'));
      const querySnapshot = await getDocs(q);
      const courses: Course[] = [];
      querySnapshot.forEach((d) => courses.push(normalizeCourse(d.id, d.data())));
      // Show approved + published courses to students
      const filtered = courses.filter((c) => c.status === 'approved' || c.status === 'published');
      filtered.sort((a, b) => sortDesc(a, b, 'createdAt'));
      return { courses: filtered, error: null };
    } catch (error: any) {
      console.error('Error fetching published courses:', error);
      return { courses: [], error: error.message };
    }
  },

  getCourseById: async (courseId: string): Promise<{ course: Course | null; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const snap = await getDoc(doc(db, 'courses', courseId));
      if (!snap.exists()) return { course: null, error: null };
      return { course: normalizeCourse(snap.id, snap.data()), error: null };
    } catch (error: any) {
      return { course: null, error: error.message };
    }
  },

  getInstructorCourses: async (instructorId: string): Promise<{ courses: Course[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(collection(db, 'courses'));
      const querySnapshot = await getDocs(q);
      const courses: Course[] = [];
      querySnapshot.forEach((d) => courses.push(normalizeCourse(d.id, d.data())));
      const filtered = courses.filter((c) => c.instructorId === instructorId);
      filtered.sort((a, b) => sortDesc(a, b, 'createdAt'));
      return { courses: filtered, error: null };
    } catch (error: any) {
      return { courses: [], error: error.message };
    }
  },

  createCourse: async (
    courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'studentsCount' | 'rating' | 'status' | 'modules'> & {
      modules?: CourseModule[];
    }
  ): Promise<{ courseId: string | null; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const coursesRef = collection(db, 'courses');
      const newCourseRef = doc(coursesRef);
      const courseId = newCourseRef.id;
      const now = Date.now();

      const newCourse: Course = {
        ...courseData,
        id: courseId,
        modules: courseData.modules || [],
        status: 'draft' as CourseStatus,
        studentsCount: 0,
        rating: 0,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'courses', courseId), newCourse);
      return { courseId, error: null };
    } catch (error: any) {
      return { courseId: null, error: error.message };
    }
  },

  updateCourse: async (
    courseId: string,
    updates: Partial<Pick<Course, 'title' | 'description' | 'category' | 'price' | 'modules'>>
  ): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'courses', courseId), {
        ...updates,
        updatedAt: Date.now(),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  updateCourseStatus: async (courseId: string, status: CourseStatus): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'courses', courseId), { status, updatedAt: Date.now() });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  submitForReview: async (courseId: string): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'courses', courseId), {
        status: 'pending_review', review: null, updatedAt: Date.now(),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  reviewCourse: async (
    courseId: string,
    decision: 'approved' | 'rejected',
    reviewerName: string,
    comment: string,
    reviewerUid: string
  ): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'courses', courseId), {
        status: decision,
        review: { reviewedBy: reviewerUid, reviewerName, reviewedAt: Date.now(), decision, comment },
        updatedAt: Date.now(),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getPendingCourses: async (): Promise<{ courses: Course[]; error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const q = query(collection(db, 'courses'));
      const querySnapshot = await getDocs(q);
      const courses: Course[] = [];
      querySnapshot.forEach((d) => courses.push(normalizeCourse(d.id, d.data())));
      const filtered = courses.filter((c) => c.status === 'pending_review');
      filtered.sort((a, b) => sortDesc(a, b, 'updatedAt'));
      return { courses: filtered, error: null };
    } catch (error: any) {
      return { courses: [], error: error.message };
    }
  },

  incrementStudentsCount: async (courseId: string): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await updateDoc(doc(db, 'courses', courseId), {
        studentsCount: increment(1), updatedAt: Date.now(),
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
};

function normalizeCourse(id: string, data: Record<string, unknown>): Course {
  return {
    id,
    instructorId: (data.instructorId as string) || '',
    instructorName: (data.instructorName as string) || '',
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    category: (data.category as string) || '',
    status: (data.status as CourseStatus) || 'draft',
    price: (data.price as number) || 0,
    studentsCount: (data.studentsCount as number) || 0,
    rating: (data.rating as number) || 0,
    modules: (data.modules as CourseModule[]) || [],
    review: (data.review as CourseReview) || undefined,
    createdAt: (data.createdAt as number) || 0,
    updatedAt: (data.updatedAt as number) || 0,
  };
}
