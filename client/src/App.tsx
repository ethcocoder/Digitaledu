import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider } from "./contexts/UserContext";
import InteractiveCursor from "./components/InteractiveCursor";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";


import ProtectedRoute from "./components/ProtectedRoute";
import SuperadminOverview from "./pages/SuperadminOverview";

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

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <h1 className="text-3xl font-bold">Admin Dashboard (Coming Soon)</h1>
          </div>
        </ProtectedRoute>
      </Route>

      {/* Instructor Routes */}
      <Route path="/instructor">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor']}>
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <h1 className="text-3xl font-bold">Instructor Dashboard (Coming Soon)</h1>
          </div>
        </ProtectedRoute>
      </Route>

      {/* Student Routes */}
      <Route path="/student">
        <ProtectedRoute allowedRoles={['superadmin', 'admin', 'instructor', 'student']}>
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <h1 className="text-3xl font-bold">Student Dashboard (Coming Soon)</h1>
          </div>
        </ProtectedRoute>
      </Route>

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <UserProvider>
          <TooltipProvider>
            <InteractiveCursor />
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
