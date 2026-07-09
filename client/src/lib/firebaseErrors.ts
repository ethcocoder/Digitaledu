import { toast } from 'sonner';

const PERMISSION_MESSAGES: Record<string, string> = {
  'permission-denied': 'Access denied. Your account may not have the required permissions for this action.',
  'missing-or-insufficient-permissions': 'Access denied. Please contact an administrator.',
  'unauthorized': 'You are not authorized to perform this action.',
};

export function handleFirebaseError(error: any, context?: string): string {
  const code = error?.code || '';
  const message = error?.message || '';

  let friendly: string;
  if (code === 'permission-denied' || message.includes('Missing or insufficient permissions')) {
    friendly = PERMISSION_MESSAGES['missing-or-insufficient-permissions'];
  } else if (code === 'unavailable' || code === 'deadline-exceeded') {
    friendly = 'Service temporarily unavailable. Please try again.';
  } else if (code?.startsWith('auth/')) {
    friendly = message;
  } else {
    friendly = message || 'An unexpected error occurred.';
  }

  if (context) {
    toast.error(`${context}: ${friendly}`);
  }

  return friendly;
}
