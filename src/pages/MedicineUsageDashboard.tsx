import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useMedicineUsage } from '../hooks/useAnalytics';
import { getDefaultDateRange } from '../utils/dateUtils';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function MedicineUsageDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data, isLoading, error } = useMedicineUsage({ dateRange });

  const totalCost = data?.reduce((sum, d) => sum + d.cost, 0) || 0;
  const totalQuantity = data?.reduce((sum, d) => sum + d.quantity, 0) || 0;

  const categoryData = data?.reduce((acc, item) => {
    const existing = acc.find((a) => a.category === item.category);
    if (existing) {
      existing.cost += item.cost;
      existing.quantity += item.quantity;
    } else {
      acc.push({ category: item.category, cost: item.cost, quantity: item.quantity });
    }
    return acc;
  }, [] as Array<{ category: string; cost: number; quantity: number }>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medicine Usage Analytics</h1>
          <p className="mt-2 text-gray-600">Track medicine consumption and costs</p>
        </div>
        {data && <ExportButton data={data} filename="medicine-usage" />}
      </div>

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load medicine usage data" />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Cost</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${totalCost.toLocaleString()}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Quantity</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalQuantity.toLocaleString()}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Average Cost per Unit</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${(totalCost / totalQuantity).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost by Medicine</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="medicineName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" fill="#0ea5e9" name="Cost ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost by Category</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="cost"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {categoryData?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quantity Usage</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="medicineName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#10b981" name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Medicine Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost per Unit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((medicine, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medicine.medicineName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicine.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medicine.quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${medicine.cost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(medicine.cost / medicine.quantity).toFixed(2)}
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
