import { Activity, Building2, Package, DollarSign, Users, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to the Management Analytics Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Patients Today"
          value={234}
          change={8.2}
          trend="up"
          icon={Activity}
        />
        <StatCard
          title="Average Occupancy"
          value={72}
          format="percentage"
          change={-3.1}
          trend="down"
          icon={Building2}
        />
        <StatCard
          title="Resource Utilization"
          value={78}
          format="percentage"
          change={5.4}
          trend="up"
          icon={Package}
        />
        <StatCard
          title="Monthly Revenue"
          value={2450000}
          format="currency"
          change={12.5}
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="Active Staff"
          value={342}
          change={2.1}
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Medicine Stock Value"
          value={156000}
          format="currency"
          change={-4.2}
          trend="down"
          icon={Pill}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/patient-flow" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity size={32} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Patient Flow</h3>
              <p className="text-sm text-gray-600">Track admissions, discharges, and transfers</p>
            </div>
          </div>
        </Link>

        <Link to="/occupancy" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 size={32} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Occupancy</h3>
              <p className="text-sm text-gray-600">Monitor bed occupancy by department</p>
            </div>
          </div>
        </Link>

        <Link to="/resource-utilization" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package size={32} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
              <p className="text-sm text-gray-600">View equipment and facility utilization</p>
            </div>
          </div>
        </Link>

        <Link to="/medicine-usage" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-100 rounded-lg">
              <Pill size={32} className="text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Medicine Usage</h3>
              <p className="text-sm text-gray-600">Analyze medicine consumption and costs</p>
            </div>
          </div>
        </Link>

        <Link to="/finance-kpi" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign size={32} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Finance KPIs</h3>
              <p className="text-sm text-gray-600">Review financial performance metrics</p>
            </div>
          </div>
        </Link>

        <Link to="/staff-performance" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users size={32} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Staff Performance</h3>
              <p className="text-sm text-gray-600">Evaluate staff productivity and ratings</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
