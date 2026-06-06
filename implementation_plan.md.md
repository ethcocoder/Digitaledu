# DigitalEdu: Multi-Role Dashboard Architecture & Implementation Plan

## 1. Architectural Overview & Intertwined Roles
DigitalEdu is a comprehensive learning management system where actions in one dashboard immediately reflect in others. The system revolves around four intertwined roles:

- **Student:** Consumes content, tracks learning progress, submits assignments, and engages with instructors.
- **Instructor:** Creates/manages courses, grades assignments, monitors student progress, and views earning analytics.
- **Admin:** Manages regional hubs, oversees localized courses, moderates content, and handles frontline support.
- **Superadmin:** Has global visibility. Manages platform-wide settings, system health, high-level financials, and all users.

### The Intertwined Flow
1. **Instructor** creates a course (Draft -> Published).
2. **Superadmin/Admin** reviews and approves the course (if moderation is enabled), which updates platform analytics.
3. **Student** enrolls in the published course. Their payment updates the **Instructor's** financials and the **Superadmin's** global revenue.
4. **Student** makes progress. This progress is visible to the **Student** (my learning), the **Instructor** (course analytics), and the **Admin** (regional engagement).

---

## 2. Global Database Schema (Firebase Firestore)
To support this intertwined ecosystem, we must use a scalable NoSQL schema.

### `users` Collection
- `uid` (string)
- `email` (string)
- `fullName` (string)
- `role` (enum: 'student', 'instructor', 'admin', 'superadmin')
- `avatarUrl` (string, optional)
- `preferences` (map: theme, language, notifications)
- `createdAt` (timestamp)

### `courses` Collection
- `courseId` (string)
- `instructorId` (string, ref to `users`)
- `title` (string)
- `description` (string)
- `category` (string)
- `status` (enum: 'draft', 'published', 'archived')
- `price` (number)
- `enrollmentCount` (number)
- `rating` (number)
- `createdAt` / `updatedAt` (timestamp)

### `enrollments` Collection (The bridge between Student & Course)
- `enrollmentId` (string)
- `studentId` (string, ref to `users`)
- `courseId` (string, ref to `courses`)
- `progress` (number: 0-100)
- `enrolledAt` (timestamp)
- `lastAccessedAt` (timestamp)

---

## 3. Premium UI/UX Design System
All dashboards will share a unified, premium design language.
- **Theming:** Full Light/Dark mode support seamlessly switching via `LanguageThemeSwitcher`.
- **Styling:** Glassmorphism (`backdrop-blur`, semi-transparent backgrounds), vibrant accent colors (Cyan/Blue for admins, Yellow/Orange for public/students).
- **Animations:** Micro-interactions using `framer-motion` for page transitions, row hover effects, and chart loading.
- **Layout:** Collapsible sidebars for navigation, persistent top-bars with search/notifications, and a widget-based grid layout for analytics.

---

## 4. Phased Implementation Roadmap

### Phase 1: Core Foundation & Data Layer (Immediate Next Step)
- Define the TypeScript interfaces (`User`, `Course`, `Enrollment`).
- Implement the Firebase CRUD utilities (`courseService.ts`, `enrollmentService.ts`).
- Replace existing mock data in Superadmin with real-time Firebase listeners.

### Phase 2: Student Ecosystem
- **Student Dashboard:** Overview of in-progress courses, recent achievements, and recommended courses.
- **Course Catalog:** Marketplace to search, filter, and enroll in courses.
- **Learning Environment:** Video player, module navigation, and progress tracking.

### Phase 3: Instructor Ecosystem
- **Instructor Dashboard:** Financial overview, total student count, and recent course reviews.
- **Course Studio:** A multi-step form to create, edit, and publish course content and modules.
- **Student Analytics:** View engagement metrics for their specific courses.

### Phase 4: Admin & Superadmin Maturation
- **Admin Dashboard:** Focused on user moderation, regional engagement metrics, and support tickets.
- **Live Superadmin:** Fully wire up the existing UI (`SuperadminUsers`, `SuperadminCourses`) to Firestore. Implement role-changing capabilities directly from the UI.

---

## 5. Security & Rules
- **Firestore Rules:** Strict security rules to ensure Students can only read published courses and their own enrollments; Instructors can only edit their own courses; Superadmins have global read/write.
- **Route Protection:** React Router (`wouter`) guards utilizing our `ProtectedRoute` component to prevent URL spoofing.
