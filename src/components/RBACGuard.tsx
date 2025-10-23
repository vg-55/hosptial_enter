import { useAuthStore, UserRole } from '../store/authStore';
import { AlertTriangle } from 'lucide-react';

interface RBACGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RBACGuard({ children, allowedRoles, fallback }: RBACGuardProps) {
  const { user, hasRole } = useAuthStore();

  if (!hasRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div 
        className="flex items-center justify-center min-h-[400px]"
        role="alert"
        aria-live="polite"
      >
        <div className="text-center">
          <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to view this content.
          </p>
          <p className="text-sm text-gray-500">
            Your role: <span className="font-semibold">{user?.role}</span>
          </p>
          <p className="text-sm text-gray-500">
            Required roles: <span className="font-semibold">{allowedRoles.join(', ')}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
