import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: LucideIcon;
  format?: 'number' | 'currency' | 'percentage';
}

export default function StatCard({ title, value, change, trend, icon: Icon, format = 'number' }: StatCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatValue(value)}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' && <TrendingUp size={16} className="text-green-500 mr-1" />}
              {trend === 'down' && <TrendingDown size={16} className="text-red-500 mr-1" />}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-100 rounded-lg">
            <Icon size={24} className="text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
}
