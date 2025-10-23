import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useResourceUtilization } from '../hooks/useAnalytics';
import { getDefaultDateRange } from '../utils/dateUtils';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ResourceUtilizationDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data, isLoading, error } = useResourceUtilization({ dateRange });

  const categories = ['all', ...new Set(data?.map((d) => d.category) || [])];
  const filteredData = selectedCategory === 'all' 
    ? data 
    : data?.filter((d) => d.category === selectedCategory);

  const averageUtilization = filteredData 
    ? (filteredData.reduce((sum, d) => sum + d.utilizationRate, 0) / filteredData.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Utilization</h1>
          <p className="mt-2 text-gray-600">Monitor equipment and facility usage</p>
        </div>
        {filteredData && <ExportButton data={filteredData} filename="resource-utilization" />}
      </div>

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      <div className="card">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${
                selectedCategory === category ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load resource utilization data" />}

      {filteredData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Average Utilization</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{averageUtilization}%</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Resources</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{filteredData.length}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">High Utilization (&gt;80%)</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {filteredData.filter((d) => d.utilizationRate > 80).length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilization Rates</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="resource" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="utilizationRate" fill="#0ea5e9" name="Utilization (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={filteredData}
                    dataKey="usedHours"
                    nameKey="resource"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {filteredData.map((_, index) => (
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Resource Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Used Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((resource) => (
                  <tr key={resource.resource}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {resource.resource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded ${
                        resource.utilizationRate > 80 ? 'bg-red-100 text-red-800' :
                        resource.utilizationRate > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {resource.utilizationRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.usedHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.totalHours}
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
