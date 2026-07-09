import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider } from "./contexts/UserContext";
import { PlatformSettingsProvider } from "./contexts/PlatformSettingsContext";
import InteractiveCursor from "./components/InteractiveCursor";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import SuperadminOverview from "./pages/superadmin/Overview";
import SuperadminUsers from "./pages/superadmin/Users";
import SuperadminCourses from "./pages/superadmin/Courses";
import SuperadminSettings from "./pages/superadmin/Settings";
import SuperadminAnalytics from "./pages/superadmin/Analytics";
import SuperadminFinancials from "./pages/superadmin/Financials";
import SuperadminRegions from "./pages/superadmin/Regions";
import SuperadminHealth from "./pages/superadmin/Health";
import AdminCourseReview from "./pages/admin/CourseReview";

import AdminOverview from "./pages/admin/Overview";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import AdminLayout from "./components/AdminLayout";

import StudentDashboard from "./pages/student/Dashboard";
import StudentCatalog from "./pages/student/Catalog";
import StudentLearning from "./pages/student/Learning";
import StudentCourseIntro from "./pages/student/CourseIntro";
import StudentAchievements from "./pages/student/Achievements";
import StudentCertificates from "./pages/student/Certificates";
import StudentSettings from "./pages/student/Settings";

import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorCourses from "./pages/instructor/Courses";
import InstructorCourseStudio from "./pages/instructor/CourseStudio";
import InstructorStudents from "./pages/instructor/Students";
import InstructorEarnings from "./pages/instructor/Earnings";
import InstructorSettings from "./pages/instructor/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Superadmin Routes */}
      <Route path="/superadmin">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminOverview />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/users">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminUsers />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/courses">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminCourses />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/settings">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/analytics">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/financials">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminFinancials />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/regions">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminRegions />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/health">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperadminHealth />
        </ProtectedRoute>
      </Route>
      <Route path="/superadmin/course-review">
        <ProtectedRoute allowedRoles={['superadmin']}>
          <AdminCourseReview layout={AdminLayout} />
        </ProtectedRoute>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AdminOverview />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AdminUsers />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/courses">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <SuperadminCourses />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/analytics">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <SuperadminAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/financials">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <SuperadminFinancials />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AdminSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/course-review">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <AdminCourseReview layout={AdminLayout} />
        </ProtectedRoute>
      </Route>

      {/* Instructor Routes */}
      <Route path="/instructor">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <InstructorDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/instructor/courses">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <InstructorCourses />
        </ProtectedRoute>
      </Route>
      <Route path="/instructor/courses/new">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <InstructorCourseStudio />
        </ProtectedRoute>
      </Route>
      <Route path="/instructor/courses/:courseId/edit">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <InstructorCourseStudio />
        </ProtectedRoute>
      </Route>
      <Route path="/instructor/students">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <InstructorStudents />
        </ProtectedRoute>
      </Route>
      <Route path="/instructor/earnings">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <InstructorEarnings />
        </ProtectedRoute>
      </Route>
      <Route path="/instructor/settings">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <InstructorSettings />
        </ProtectedRoute>
      </Route>

      {/* Student Routes */}
      <Route path="/student">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <StudentDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/student/catalog">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <StudentCatalog />
        </ProtectedRoute>
      </Route>
      <Route path="/student/course-intro/:courseId">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <StudentCourseIntro />
        </ProtectedRoute>
      </Route>
      <Route path="/student/learn/:courseId">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <StudentLearning />
        </ProtectedRoute>
      </Route>
      <Route path="/student/achievements">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <StudentAchievements />
        </ProtectedRoute>
      </Route>
      <Route path="/student/certificates">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <StudentCertificates />
        </ProtectedRoute>
      </Route>
      <Route path="/student/settings">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <StudentSettings />
        </ProtectedRoute>
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <UserProvider>
          <PlatformSettingsProvider>
            <TooltipProvider>
              <InteractiveCursor />
              <Toaster />
              <Router />
            </TooltipProvider>
          </PlatformSettingsProvider>
        </UserProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
