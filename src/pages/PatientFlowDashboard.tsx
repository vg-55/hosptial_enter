import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { usePatientFlow } from '../hooks/useAnalytics';
import { getDefaultDateRange } from '../utils/dateUtils';

export default function PatientFlowDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data, isLoading, error } = usePatientFlow({ dateRange });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Flow Analytics</h1>
          <p className="mt-2 text-gray-600">Track patient admissions, discharges, and transfers</p>
        </div>
        {data && <ExportButton data={data} filename="patient-flow" />}
      </div>

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load patient flow data" />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Admissions</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.reduce((sum, d) => sum + d.admissions, 0)}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Discharges</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.reduce((sum, d) => sum + d.discharges, 0)}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Transfers</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.reduce((sum, d) => sum + d.transfers, 0)}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Emergency Visits</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data.reduce((sum, d) => sum + d.emergencyVisits, 0)}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Flow Trends</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="admissions" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="discharges" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="transfers" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="emergencyVisits" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="admissions" fill="#0ea5e9" />
                <Bar dataKey="discharges" fill="#10b981" />
                <Bar dataKey="transfers" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
