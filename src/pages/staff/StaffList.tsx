import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, Plus, Filter } from 'lucide-react';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuditBadge from '../../components/AuditBadge';
import RBACGuard from '../../components/RBACGuard';
import { useStaffMembers } from '../../hooks/useStaffManagement';

const ITEMS_PER_PAGE = 10;

export default function StaffList() {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: staff, isLoading } = useStaffMembers({
    search,
    department: departmentFilter || undefined,
    status: statusFilter || undefined,
  });

  const totalPages = Math.ceil((staff?.length || 0) / ITEMS_PER_PAGE);
  const paginatedStaff = staff?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <RBACGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Directory</h1>
            <p className="mt-2 text-gray-600">View and manage hospital staff</p>
          </div>
          <div className="flex items-center gap-3">
            <AuditBadge action="Staff Access" variant="compact" />
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={20} />
              Add Staff
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchFilter
                placeholder="Search by name, email, or employee ID..."
                onSearch={setSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" aria-hidden="true" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter by department"
              >
                <option value="">All Departments</option>
                <option value="Emergency">Emergency</option>
                <option value="Surgery">Surgery</option>
                <option value="ICU">ICU</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Maternity">Maternity</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {isLoading && <LoadingSpinner />}

          {paginatedStaff && paginatedStaff.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.employeeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                            {member.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/staff/${member.id}`}
                            className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={staff?.length || 0}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No staff members found</p>
            </div>
          )}
        </div>
      </div>
    </RBACGuard>
  );
}
