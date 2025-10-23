import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  Activity,
  Building2,
  Package,
  Pill,
  DollarSign,
  Users,
  FileText,
  Menu,
  X,
  LogOut,
  CreditCard,
  Stethoscope,
  Calendar,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/patient-flow', icon: Activity, label: 'Patient Flow' },
  { path: '/occupancy', icon: Building2, label: 'Occupancy' },
  { path: '/resource-utilization', icon: Package, label: 'Resources' },
  { path: '/medicine-usage', icon: Pill, label: 'Medicine' },
  { path: '/billing', icon: CreditCard, label: 'Billing', requiredRoles: ['admin', 'manager'] },
  { path: '/clinical', icon: Stethoscope, label: 'Clinical Docs', requiredRoles: ['admin', 'manager'] },
  { path: '/staff', icon: Calendar, label: 'Staff Mgmt', requiredRoles: ['admin', 'manager'] },
  { path: '/finance-kpi', icon: DollarSign, label: 'Finance' },
  { path: '/staff-performance', icon: Users, label: 'Performance' },
  { path: '/custom-reports', icon: FileText, label: 'Custom Reports' },
];

interface MenuItem {
  path: string;
  icon: any;
  label: string;
  requiredRoles?: string[];
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, hasRole } = useAuthStore();

  const filteredMenuItems = (menuItems as MenuItem[]).filter((item) => {
    if (!item.requiredRoles) return true;
    return hasRole(item.requiredRoles as any);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="ml-2 text-xl font-bold text-gray-900">Management Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out mt-16 lg:mt-0`}
        >
          <nav className="h-full overflow-y-auto py-4">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
