import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '../../../shared/types';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { user, role, profile, loading, logout } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="w-10 h-10 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    setLocation('/login');
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    setLocation('/');
    return null;
  }

  // Block access if user is pending or suspended (except for superadmins and admins to prevent lockouts)
  if (profile && profile.status === 'pending' && role !== 'superadmin' && role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-6">
        <div className="p-4 bg-yellow-500/10 rounded-full">
          <Loader className="w-12 h-12 text-yellow-500 animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Pending Approval</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Your account has been created successfully, but it requires administrator approval before you can access the dashboard.
          </p>
        </div>
        <button 
          onClick={logout}
          className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors"
        >
          Logout for now
        </button>
      </div>
    );
  }

  if (profile && profile.status === 'suspended') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-6">
        <h1 className="text-3xl font-bold text-red-500">Account Suspended</h1>
        <p className="text-gray-500 max-w-md text-center">
          Your account has been suspended by an administrator. Please contact support.
        </p>
        <button onClick={logout} className="px-6 py-2 bg-red-500 text-white rounded-lg">Logout</button>
      </div>
    );
  }

  return <>{children}</>;
}
