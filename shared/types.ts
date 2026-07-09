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

export type CourseStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';

export interface CourseReview {
  reviewedBy: string;
  reviewerName: string;
  reviewedAt: number;
  decision: 'approved' | 'rejected';
  comment: string;
}

// ── Content Blocks ──────────────────────────────────────────────
export type ContentBlockType = 'concept' | 'example' | 'audio' | 'quiz';

export interface BilingualContent {
  en: string;
  am: string;
}

export interface ConceptBlock {
  type: 'concept';
  id: string;
  title: BilingualContent;
  content: BilingualContent;
}

export interface ExampleBlock {
  type: 'example';
  id: string;
  source: BilingualContent;
  translation: BilingualContent;
  notes?: BilingualContent;
}

export interface AudioBlock {
  type: 'audio';
  id: string;
  term: BilingualContent;
  audioUrl: string;
  transcript: BilingualContent;
}

export interface QuizOption {
  id: string;
  content: BilingualContent;
  isCorrect: boolean;
}

export interface QuizBlock {
  type: 'quiz';
  id: string;
  question: BilingualContent;
  options: QuizOption[];
  explanation: BilingualContent;
  questionType: 'mcq' | 'fill-blank';
}

export type ContentBlock = ConceptBlock | ExampleBlock | AudioBlock | QuizBlock;

export interface CourseModule {
  id: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  order: number;
  blocks: ContentBlock[];
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
  isBilingual?: boolean;
  targetLanguage?: string;
  supportLanguage?: string;
  review?: CourseReview;
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
  assessmentResults?: AssessmentResult;
  goal?: LearningGoal;
}

// ── Advanced: Assessment & Placement ────────────────────────────
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type LearningGoal = 'travel' | 'work' | 'school';

export interface AssessmentResult {
  level: Difficulty;
  score: number;
  completedAt: number;
}

export interface PlacementQuestion {
  id: string;
  question: BilingualContent;
  options: QuizOption[];
  difficulty: Difficulty;
}

// ── Gamification ────────────────────────────────────────────────
export interface Badge {
  id: string;
  name: BilingualContent;
  description: BilingualContent;
  icon: string;
  earnedAt: number;
}

export interface UserProgress {
  uid: string;
  totalXP: number;
  streakCount: number;
  lastActiveDate: number;
  badges: Badge[];
  completedCourses: number;
  totalQuizzesTaken: number;
  quizzesCorrect: number;
}
