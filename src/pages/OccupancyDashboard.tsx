import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useOccupancy } from '../hooks/useAnalytics';
import { getDefaultDateRange } from '../utils/dateUtils';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function OccupancyDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data, isLoading, error } = useOccupancy({ dateRange });

  const totalBeds = data?.reduce((sum, d) => sum + d.totalBeds, 0) || 0;
  const occupiedBeds = data?.reduce((sum, d) => sum + d.occupiedBeds, 0) || 0;
  const overallOccupancy = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Occupancy Analytics</h1>
          <p className="mt-2 text-gray-600">Monitor bed occupancy across departments</p>
        </div>
        {data && <ExportButton data={data} filename="occupancy" />}
      </div>

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load occupancy data" />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Overall Occupancy</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {overallOccupancy.toFixed(1)}%
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Beds</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalBeds}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Available Beds</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalBeds - occupiedBeds}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Occupancy by Department</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="department" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occupancyRate" fill="#0ea5e9" name="Occupancy Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bed Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="totalBeds"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Occupancy Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Beds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((dept) => (
                  <tr key={dept.department}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.occupancyRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.totalBeds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.occupiedBeds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.availableBeds}
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
