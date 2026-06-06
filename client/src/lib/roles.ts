import { UserRole } from '../../../shared/types';

export function normalizeRole(role: string | undefined | null): UserRole | null {
  if (!role) return null;
  const normalized = role.trim().toLowerCase();
  if (normalized === 'superadmin' || normalized === 'admin' || normalized === 'instructor' || normalized === 'student') {
    return normalized;
  }
  return null;
}

export function getDashboardPathForRole(role: string | undefined | null): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case 'superadmin':
      return '/superadmin';
    case 'admin':
      return '/admin';
    case 'instructor':
      return '/instructor';
    case 'student':
      return '/student';
    default:
      return '/';
  }
}
