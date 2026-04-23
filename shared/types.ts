export type UserRole = 'superadmin' | 'admin' | 'student' | 'instructor';
export type UserStatus = 'pending' | 'active' | 'suspended';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
}

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  category: string;
  status: CourseStatus;
  price: number;
  studentsCount: number;
  rating: number;
  createdAt: number;
  updatedAt: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  enrolledAt: number;
  lastAccessedAt: number;
}
