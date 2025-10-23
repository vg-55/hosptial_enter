import { useState } from 'react';
import { DateRange } from '../types/analytics';
import { getDefaultDateRange, getLastMonthRange, getThisMonthRange } from '../utils/dateUtils';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangeFilter({ dateRange, onChange }: DateRangeFilterProps) {
  const [quickSelect, setQuickSelect] = useState<string>('custom');

  const handleQuickSelect = (period: string) => {
    setQuickSelect(period);
    switch (period) {
      case 'last7days':
        onChange(getDefaultDateRange());
        break;
      case 'thisMonth':
        onChange(getThisMonthRange());
        break;
      case 'lastMonth':
        onChange(getLastMonthRange());
        break;
      default:
        break;
    }
  };

  return (
    <div className="card">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => {
              setQuickSelect('custom');
              onChange({ ...dateRange, startDate: e.target.value });
            }}
            className="input"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => {
              setQuickSelect('custom');
              onChange({ ...dateRange, endDate: e.target.value });
            }}
            className="input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleQuickSelect('last7days')}
            className={`btn ${
              quickSelect === 'last7days' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleQuickSelect('thisMonth')}
            className={`btn ${
              quickSelect === 'thisMonth' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => handleQuickSelect('lastMonth')}
            className={`btn ${
              quickSelect === 'lastMonth' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Last Month
          </button>
        </div>
      </div>
    </div>
  );
}
