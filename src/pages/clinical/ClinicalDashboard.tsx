import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, TrendingUp, Clock } from 'lucide-react';
import DateRangeFilter from '../../components/DateRangeFilter';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuditBadge from '../../components/AuditBadge';
import RBACGuard from '../../components/RBACGuard';
import { getDefaultDateRange } from '../../utils/dateUtils';
import { useClinicalStats } from '../../hooks/useClinical';

export default function ClinicalDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data: stats, isLoading } = useClinicalStats({ dateRange });

  return (
    <RBACGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clinical Documentation</h1>
            <p className="mt-2 text-gray-600">Manage clinical notes and patient documents</p>
          </div>
          <AuditBadge action="Clinical Data Access" variant="compact" />
        </div>

        <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

        {isLoading && <LoadingSpinner />}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Clinical Notes"
              value={stats.totalNotes}
              change={stats.notesChange}
              trend={stats.notesChange > 0 ? 'up' : 'down'}
              format="number"
              icon={FileText}
            />
            <StatCard
              title="Documents Uploaded"
              value={stats.totalDocuments}
              change={stats.documentsChange}
              trend={stats.documentsChange > 0 ? 'up' : 'down'}
              format="number"
              icon={Upload}
            />
            <StatCard
              title="Pending Reviews"
              value={stats.pendingReviews}
              change={stats.reviewsChange}
              trend={stats.reviewsChange < 0 ? 'up' : 'down'}
              format="number"
              icon={Clock}
            />
            <StatCard
              title="Avg. Completion Time (min)"
              value={stats.averageCompletionTime}
              change={stats.timeChange}
              trend={stats.timeChange < 0 ? 'up' : 'down'}
              format="number"
              icon={TrendingUp}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/clinical/notes"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Clinical Notes</h3>
                <p className="text-sm text-gray-600">Create and manage clinical notes</p>
              </div>
              <FileText size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/clinical/documents"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Documents</h3>
                <p className="text-sm text-gray-600">Upload and view patient documents</p>
              </div>
              <Upload size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </RBACGuard>
  );
}
