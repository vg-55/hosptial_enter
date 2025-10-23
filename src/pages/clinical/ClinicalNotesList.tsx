import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Filter, Eye } from 'lucide-react';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuditBadge from '../../components/AuditBadge';
import RBACGuard from '../../components/RBACGuard';
import { useClinicalNotes } from '../../hooks/useClinical';

const ITEMS_PER_PAGE = 10;

export default function ClinicalNotesList() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: notes, isLoading } = useClinicalNotes({ search, type: typeFilter || undefined });

  const totalPages = Math.ceil((notes?.length || 0) / ITEMS_PER_PAGE);
  const paginatedNotes = notes?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'amended':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <RBACGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clinical Notes</h1>
            <p className="mt-2 text-gray-600">View and manage clinical documentation</p>
          </div>
          <div className="flex items-center gap-3">
            <AuditBadge action="Notes Access" variant="compact" />
            <Link to="/clinical/notes/new" className="btn btn-primary flex items-center gap-2">
              <Plus size={20} />
              New Note
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchFilter
                placeholder="Search by patient, title, or content..."
                onSearch={setSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" aria-hidden="true" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter by type"
              >
                <option value="">All Types</option>
                <option value="progress">Progress Note</option>
                <option value="admission">Admission</option>
                <option value="discharge">Discharge</option>
                <option value="consultation">Consultation</option>
                <option value="procedure">Procedure</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {isLoading && <LoadingSpinner />}

          {paginatedNotes && paginatedNotes.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedNotes.map((note) => (
                      <tr key={note.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(note.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{note.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{note.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{note.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{note.authorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(note.status)}`}>
                            {note.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1">
                            <Eye size={16} />
                            View
                          </button>
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
                totalItems={notes?.length || 0}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No clinical notes found</p>
            </div>
          )}
        </div>
      </div>
    </RBACGuard>
  );
}
