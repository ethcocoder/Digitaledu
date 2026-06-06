export type UserRole = 'superadmin' | 'admin' | 'student' | 'instructor';
export type UserStatus = 'pending' | 'active' | 'suspended';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'am';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'en',
  emailNotifications: true,
  pushNotifications: true,
};

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  preferences?: UserPreferences;
  createdAt: number;
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  courseModerationEnabled: boolean;
  requireEmailVerification: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  adminAlertEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpFromEmail: string;
  autoBackupEnabled: boolean;
  backupRetentionDays: number;
  updatedAt: number;
  updatedBy: string;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'DigitalEdu Global',
  supportEmail: 'support@digitaledu.app',
  maintenanceMode: false,
  courseModerationEnabled: false,
  requireEmailVerification: false,
  sessionTimeoutMinutes: 60,
  maxLoginAttempts: 5,
  emailNotificationsEnabled: true,
  pushNotificationsEnabled: true,
  adminAlertEmail: 'admin@digitaledu.app',
  smtpHost: '',
  smtpPort: 587,
  smtpFromEmail: 'noreply@digitaledu.app',
  autoBackupEnabled: false,
  backupRetentionDays: 30,
  updatedAt: 0,
  updatedBy: '',
};

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseModule {
  id: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  order: number;
}

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
  modules: CourseModule[];
  createdAt: number;
  updatedAt: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  progress: number;
  completedModules: string[];
  enrolledAt: number;
  lastAccessedAt: number;
}
