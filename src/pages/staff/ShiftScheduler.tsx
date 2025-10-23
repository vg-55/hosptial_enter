import { useState } from 'react';
import { Calendar, Plus, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuditBadge from '../../components/AuditBadge';
import RBACGuard from '../../components/RBACGuard';
import { useShifts, useDepartments } from '../../hooks/useStaffManagement';

export default function ShiftScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  const { data: shifts, isLoading: shiftsLoading } = useShifts({
    department: departmentFilter || undefined,
    startDate: selectedDate,
    endDate: selectedDate,
  });
  const { data: departments } = useDepartments();

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'afternoon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'night':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'on_call':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <RBACGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shift Scheduler</h1>
            <p className="mt-2 text-gray-600">Manage staff shift schedules</p>
          </div>
          <div className="flex items-center gap-3">
            <AuditBadge action="Schedule Access" variant="compact" />
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={20} />
              Create Shift
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Departments</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {shiftsLoading && <LoadingSpinner />}

          {shifts && shifts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`p-4 rounded-lg border-2 ${getShiftTypeColor(shift.shiftType)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{shift.staffName}</h3>
                      <p className="text-sm text-gray-600">{shift.department}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shift.status)}`}>
                      {shift.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} />
                      <span>
                        {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium capitalize">{shift.shiftType.replace('_', ' ')} Shift</span>
                    </div>
                    <div className="text-sm text-gray-600">{shift.location}</div>
                    {shift.notes && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        {shift.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No shifts scheduled for this date</p>
            </div>
          )}
        </div>
      </div>
    </RBACGuard>
  );
}
