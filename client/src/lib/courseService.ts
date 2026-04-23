import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Course, CourseStatus } from '../../../shared/types';

export const courseService = {
  // Get all courses (for Superadmin)
  getAllCourses: async (): Promise<{ courses: Course[], error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const courses: Course[] = [];
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() } as Course);
      });
      
      return { courses, error: null };
    } catch (error: any) {
      console.error('Error fetching all courses:', error);
      return { courses: [], error: error.message };
    }
  },

  // Get courses by instructor
  getInstructorCourses: async (instructorId: string): Promise<{ courses: Course[], error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, where('instructorId', '==', instructorId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const courses: Course[] = [];
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() } as Course);
      });
      
      return { courses, error: null };
    } catch (error: any) {
      console.error('Error fetching instructor courses:', error);
      return { courses: [], error: error.message };
    }
  },

  // Create a new course
  createCourse: async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'studentsCount' | 'rating' | 'status'>): Promise<{ courseId: string | null, error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const coursesRef = collection(db, 'courses');
      const newCourseRef = doc(coursesRef);
      const courseId = newCourseRef.id;
      const now = Date.now();
      
      const newCourse: Course = {
        ...courseData,
        id: courseId,
        status: 'draft',
        studentsCount: 0,
        rating: 0,
        createdAt: now,
        updatedAt: now,
      };
      
      await setDoc(doc(db, 'courses', courseId), newCourse);
      return { courseId, error: null };
    } catch (error: any) {
      console.error('Error creating course:', error);
      return { courseId: null, error: error.message };
    }
  },

  // Update course status
  updateCourseStatus: async (courseId: string, status: CourseStatus): Promise<{ error: string | null }> => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, {
        status,
        updatedAt: Date.now()
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error updating course status:', error);
      return { error: error.message };
    }
  }
};
