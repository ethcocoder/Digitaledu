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
  const { user, role, loading } = useUser();

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

  return <>{children}</>;
}
