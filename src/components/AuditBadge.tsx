import { Shield, Clock, User } from 'lucide-react';

interface AuditBadgeProps {
  action: string;
  user?: string;
  timestamp?: string;
  variant?: 'compact' | 'full';
}

export default function AuditBadge({ action, user, timestamp, variant = 'compact' }: AuditBadgeProps) {
  if (variant === 'compact') {
    return (
      <div 
        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
        role="status"
        aria-label={`Audit: ${action}`}
      >
        <Shield size={12} aria-hidden="true" />
        <span>Audited</span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"
      role="status"
      aria-label={`Audit information: ${action}`}
    >
      <div className="flex items-center gap-2">
        <Shield size={16} className="text-blue-600" aria-hidden="true" />
        <span className="font-medium text-blue-900">{action}</span>
      </div>
      {user && (
        <div className="flex items-center gap-1 text-blue-700">
          <User size={14} aria-hidden="true" />
          <span>{user}</span>
        </div>
      )}
      {timestamp && (
        <div className="flex items-center gap-1 text-blue-700">
          <Clock size={14} aria-hidden="true" />
          <span>{new Date(timestamp).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
