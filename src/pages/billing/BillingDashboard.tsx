import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, FileText, CreditCard, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import DateRangeFilter from '../../components/DateRangeFilter';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import AuditBadge from '../../components/AuditBadge';
import RBACGuard from '../../components/RBACGuard';
import { getDefaultDateRange } from '../../utils/dateUtils';
import { useBillingStats, useInvoices, useInsuranceClaims } from '../../hooks/useBilling';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export default function BillingDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data: stats, isLoading: statsLoading } = useBillingStats({ dateRange });
  const { data: invoices, isLoading: invoicesLoading } = useInvoices({ dateRange });
  const { data: claims, isLoading: claimsLoading } = useInsuranceClaims({ dateRange });

  const isLoading = statsLoading || invoicesLoading || claimsLoading;

  const invoiceStatusData = invoices
    ? [
        { name: 'Paid', value: invoices.filter((inv) => inv.status === 'paid').length },
        { name: 'Sent', value: invoices.filter((inv) => inv.status === 'sent').length },
        { name: 'Overdue', value: invoices.filter((inv) => inv.status === 'overdue').length },
        { name: 'Draft', value: invoices.filter((inv) => inv.status === 'draft').length },
      ]
    : [];

  const claimStatusData = claims
    ? [
        { name: 'Approved', value: claims.filter((c) => c.status === 'approved').length },
        { name: 'Submitted', value: claims.filter((c) => c.status === 'submitted').length },
        { name: 'Under Review', value: claims.filter((c) => c.status === 'under_review').length },
        { name: 'Denied', value: claims.filter((c) => c.status === 'denied').length },
      ]
    : [];

  return (
    <RBACGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage invoices, payments, and insurance claims</p>
          </div>
          <AuditBadge action="Financial Data Access" variant="compact" />
        </div>

        <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

        {isLoading && <LoadingSpinner />}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue}
              change={stats.revenueChange}
              trend={stats.revenueChange > 0 ? 'up' : 'down'}
              format="currency"
              icon={DollarSign}
            />
            <StatCard
              title="Outstanding Balance"
              value={stats.outstandingBalance}
              change={stats.balanceChange}
              trend={stats.balanceChange < 0 ? 'up' : 'down'}
              format="currency"
              icon={AlertCircle}
            />
            <StatCard
              title="Claims Processed"
              value={stats.claimsProcessed}
              change={stats.claimsChange}
              trend={stats.claimsChange > 0 ? 'up' : 'down'}
              format="number"
              icon={FileText}
            />
            <StatCard
              title="Avg. Claim Time (days)"
              value={stats.averageClaimTime}
              change={stats.timeChange}
              trend={stats.timeChange < 0 ? 'up' : 'down'}
              format="number"
              icon={TrendingDown}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Insurance Claims Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/billing/invoices"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Invoices</h3>
                <p className="text-sm text-gray-600">Manage patient invoices</p>
              </div>
              <FileText size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/billing/claims"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Insurance Claims</h3>
                <p className="text-sm text-gray-600">Track claim submissions</p>
              </div>
              <CreditCard size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            to="/finance-kpi"
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Financial Summary</h3>
                <p className="text-sm text-gray-600">View financial reports</p>
              </div>
              <TrendingUp size={32} className="text-primary-600 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </RBACGuard>
  );
}
