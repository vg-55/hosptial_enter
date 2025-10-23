import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RBACGuard from '../RBACGuard';
import { useAuthStore } from '../../store/authStore';

vi.mock('../../store/authStore');

describe('RBACGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user has required role', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      hasRole: vi.fn().mockReturnValue(true),
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <RBACGuard allowedRoles={['admin']}>
        <div>Protected Content</div>
      </RBACGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show access denied when user does not have required role', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Viewer', email: 'viewer@test.com', role: 'viewer' },
      isAuthenticated: true,
      hasRole: vi.fn().mockReturnValue(false),
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <RBACGuard allowedRoles={['admin', 'manager']}>
        <div>Protected Content</div>
      </RBACGuard>
    );

    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Viewer', email: 'viewer@test.com', role: 'viewer' },
      isAuthenticated: true,
      hasRole: vi.fn().mockReturnValue(false),
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <RBACGuard allowedRoles={['admin']} fallback={<div>Custom Fallback</div>}>
        <div>Protected Content</div>
      </RBACGuard>
    );

    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();
    expect(screen.queryByText('Access Restricted')).not.toBeInTheDocument();
  });
});
