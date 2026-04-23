export type UserRole = 'superadmin' | 'admin' | 'student' | 'instructor';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: number;
}
