import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import { useFinanceKPIs, useFinanceData } from '../hooks/useAnalytics';
import { getDefaultDateRange } from '../utils/dateUtils';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function FinanceKPIDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useFinanceKPIs({ dateRange });
  const { data: financeData, isLoading: dataLoading, error: dataError } = useFinanceData({ dateRange });

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance KPIs</h1>
          <p className="mt-2 text-gray-600">Track financial performance and metrics</p>
        </div>
        {kpiData && (
          <ExportButton 
            data={[...kpiData, ...(financeData || [])]} 
            filename="finance-kpis" 
          />
        )}
      </div>

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load finance data" />}

      {kpiData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiData.map((kpi) => (
              <StatCard
                key={kpi.metric}
                title={kpi.metric}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                format={
                  kpi.metric.includes('Revenue') || kpi.metric.includes('Expenses') || 
                  kpi.metric.includes('Profit') || kpi.metric.includes('Cost')
                    ? 'currency'
                    : kpi.metric.includes('Efficiency')
                    ? 'percentage'
                    : 'number'
                }
                icon={
                  kpi.metric.includes('Revenue') ? DollarSign :
                  kpi.metric.includes('Profit') ? TrendingUp :
                  kpi.metric.includes('Expenses') ? TrendingDown :
                  Activity
                }
              />
            ))}
          </div>
        </>
      )}

      {financeData && (
        <>
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#0ea5e9" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                <Bar dataKey="profit" fill="#0ea5e9" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Financial Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financeData.map((item) => (
                  <tr key={item.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.expenses.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.profit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((item.profit / item.revenue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
