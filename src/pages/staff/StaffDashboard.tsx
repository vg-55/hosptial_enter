import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, TrendingUp, UserCheck } from 'lucide-react';
import DateRangeFilter from '../../components/DateRangeFilter';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuditBadge from '../../components/AuditBadge';
import RBACGuard from '../../components/RBACGuard';
import { getDefaultDateRange } from '../../utils/dateUtils';
import { useStaffStats } from '../../hooks/useStaffManagement';

export default function StaffDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data: stats, isLoading } = useStaffStats({ dateRange });

  return (
    <RBACGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="mt-2 text-gray-600">Manage staff profiles, schedules, and performance</p>
          </div>
          <AuditBadge action="Staff Data Access" variant="compact" />
        </div>

        <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

        {isLoading && <LoadingSpinner />}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Staff"
              value={stats.totalStaff}
              change={stats.staffChange}
              trend={stats.staffChange > 0 ? 'up' : 'down'}
              format="number"
              icon={Users}
            />
            <StatCard
              title="Active Shifts"
              value={stats.activeShifts}
              change={stats.shiftsChange}
              trend={stats.shiftsChange > 0 ? 'up' : 'down'}
              format="number"
              icon={Calendar}
            />
            <StatCard
              title="Avg. Performance Rating"
              value={stats.averagePerformance}
              change={stats.performanceChange}
              trend={stats.performanceChange > 0 ? 'up' : 'down'}
              format="number"
              icon={TrendingUp}
            />
            <StatCard
              title="Vacancy Rate"
              value={stats.vacancyRate}
              change={stats.vacancyChange}
              trend={stats.vacancyChange < 0 ? 'up' : 'down'}
              format="percentage"
              icon={UserCheck}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/staff/list"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Staff Directory</h3>
                <p className="text-sm text-gray-600">View and manage staff profiles</p>
              </div>
              <Users size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/staff/schedule"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Shift Scheduling</h3>
                <p className="text-sm text-gray-600">Manage staff schedules</p>
              </div>
              <Calendar size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/staff-performance"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Performance</h3>
                <p className="text-sm text-gray-600">Track staff performance</p>
              </div>
              <TrendingUp size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </RBACGuard>
  );
}
