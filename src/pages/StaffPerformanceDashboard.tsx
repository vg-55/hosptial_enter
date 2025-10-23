import { useState } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useStaffPerformance } from '../hooks/useAnalytics';
import { getDefaultDateRange } from '../utils/dateUtils';
import { Star } from 'lucide-react';

export default function StaffPerformanceDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const { data, isLoading, error } = useStaffPerformance({ dateRange });

  const departments = ['all', ...new Set(data?.map((d) => d.department) || [])];
  const filteredData = selectedDepartment === 'all' 
    ? data 
    : data?.filter((d) => d.department === selectedDepartment);

  const averageRating = filteredData 
    ? (filteredData.reduce((sum, d) => sum + d.averageRating, 0) / filteredData.length).toFixed(2)
    : 0;

  const totalPatientsHandled = filteredData?.reduce((sum, d) => sum + d.patientsHandled, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Performance</h1>
          <p className="mt-2 text-gray-600">Monitor staff productivity and ratings</p>
        </div>
        {filteredData && <ExportButton data={filteredData} filename="staff-performance" />}
      </div>

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      <div className="card">
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`btn ${
                selectedDepartment === dept ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {dept.charAt(0).toUpperCase() + dept.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load staff performance data" />}

      {filteredData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
              <div className="flex items-center mt-2">
                <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                <Star size={24} className="ml-2 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Patients Handled</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalPatientsHandled.toLocaleString()}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Staff Members</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{filteredData.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Patients Handled</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patientsHandled" fill="#0ea5e9" name="Patients" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Ratings</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageRating" fill="#10b981" name="Rating" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="patientsHandled" name="Patients Handled" />
                <YAxis dataKey="averageRating" name="Rating" domain={[0, 5]} />
                <ZAxis dataKey="tasksCompleted" name="Tasks Completed" range={[100, 1000]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Staff Performance" data={filteredData} fill="#0ea5e9" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Staff Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patients Handled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks Completed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((staff) => (
                  <tr key={staff.staffId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {staff.staffId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.patientsHandled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span>{staff.averageRating}</span>
                        <Star size={16} className="ml-1 text-yellow-500 fill-yellow-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.tasksCompleted}
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
