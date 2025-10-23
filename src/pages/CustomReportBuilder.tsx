import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDefaultDateRange } from '../utils/dateUtils';
import { ReportDimension, ReportMetric } from '../types/analytics';
import { FileText, Play } from 'lucide-react';

const availableDimensions: ReportDimension[] = [
  { id: 'date', label: 'Date', type: 'date' },
  { id: 'department', label: 'Department', type: 'category' },
  { id: 'category', label: 'Category', type: 'category' },
  { id: 'staff', label: 'Staff Member', type: 'category' },
];

const availableMetrics: ReportMetric[] = [
  { id: 'patients', label: 'Patient Count', aggregation: 'count' },
  { id: 'revenue', label: 'Revenue', aggregation: 'sum' },
  { id: 'cost', label: 'Cost', aggregation: 'sum' },
  { id: 'utilization', label: 'Utilization Rate', aggregation: 'avg' },
  { id: 'rating', label: 'Rating', aggregation: 'avg' },
  { id: 'occupancy', label: 'Occupancy Rate', aggregation: 'avg' },
];

export default function CustomReportBuilder() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [reportName, setReportName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<unknown[] | null>(null);

  const toggleDimension = (dimensionId: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dimensionId)
        ? prev.filter((id) => id !== dimensionId)
        : [...prev, dimensionId]
    );
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const generateReport = async () => {
    if (selectedDimensions.length === 0 || selectedMetrics.length === 0) {
      alert('Please select at least one dimension and one metric');
      return;
    }

    setIsGenerating(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData = Array.from({ length: 5 }, (_, i) => {
      const row: Record<string, unknown> = {};
      selectedDimensions.forEach((dim) => {
        if (dim === 'date') {
          row[dim] = `2024-01-${String(i + 1).padStart(2, '0')}`;
        } else if (dim === 'department') {
          row[dim] = ['ICU', 'Emergency', 'Surgery', 'Pediatrics', 'General'][i];
        } else {
          row[dim] = `${dim}-${i + 1}`;
        }
      });
      selectedMetrics.forEach((metric) => {
        row[metric] = Math.floor(Math.random() * 1000);
      });
      return row;
    });

    setReportData(mockData);
    setIsGenerating(false);
  };

  const saveReport = () => {
    if (!reportName) {
      alert('Please enter a report name');
      return;
    }

    const reportConfig = {
      name: reportName,
      dimensions: selectedDimensions,
      metrics: selectedMetrics,
      dateRange,
    };

    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    savedReports.push(reportConfig);
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
    
    alert('Report configuration saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Report Builder</h1>
          <p className="mt-2 text-gray-600">Configure and generate custom reports</p>
        </div>
        {reportData && <ExportButton data={reportData} filename={reportName || 'custom-report'} />}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Name
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter report name"
              className="input"
            />
          </div>
        </div>
      </div>

      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Dimensions</h2>
          <div className="space-y-2">
            {availableDimensions.map((dimension) => (
              <label
                key={dimension.id}
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedDimensions.includes(dimension.id)}
                  onChange={() => toggleDimension(dimension.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{dimension.label}</p>
                  <p className="text-xs text-gray-500">Type: {dimension.type}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Metrics</h2>
          <div className="space-y-2">
            {availableMetrics.map((metric) => (
              <label
                key={metric.id}
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.id)}
                  onChange={() => toggleMetric(metric.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                  <p className="text-xs text-gray-500">Aggregation: {metric.aggregation}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={generateReport}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Play size={18} />
              Generate Report
            </>
          )}
        </button>
        <button
          onClick={saveReport}
          className="btn-secondary flex items-center gap-2"
        >
          <FileText size={18} />
          Save Configuration
        </button>
      </div>

      {isGenerating && <LoadingSpinner />}

      {reportData && !isGenerating && (
        <>
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Preview</h2>
            {selectedMetrics.length > 0 && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={selectedDimensions[0]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedMetrics.map((metric, index) => (
                    <Bar
                      key={metric}
                      dataKey={metric}
                      fill={['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[...selectedDimensions, ...selectedMetrics].map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {availableDimensions.find((d) => d.id === key)?.label ||
                        availableMetrics.find((m) => m.id === key)?.label ||
                        key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((row, index) => (
                  <tr key={index}>
                    {[...selectedDimensions, ...selectedMetrics].map((key) => (
                      <td
                        key={key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {String((row as Record<string, unknown>)[key])}
                      </td>
                    ))}
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
