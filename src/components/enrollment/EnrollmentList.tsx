import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

interface Application {
  id: string;
  application_number: string;
  student_first_name: string;
  student_middle_name: string;
  student_last_name: string;
  grade_level: string;
  status: 'pre-registered' | 'enrolled' | 'transferred';
  created_at: string;
  section_id?: string;
  section_name?: string;
}

interface Section {
  id: string;
  name: string;
  grade_level: string;
  capacity: number;
  current_enrollment: number;
}

interface EnrollmentListProps {
  onRefresh: () => void;
}

const EnrollmentList: React.FC<EnrollmentListProps> = ({ onRefresh }) => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch applications from new backend
      const appsResponse = await api.get('/enrollment');

      // Fetch sections from classes API
      const sectionsResponse = await api.get('/classes/sections');

      if (appsResponse.data.success) {
        setApplications(appsResponse.data.applications);
      }
      if (sectionsResponse.data.success) {
        setSections(sectionsResponse.data.sections);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      (app.student_first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.student_last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.application_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || app.grade_level === gradeFilter;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedApplications(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (id: string, newStatus: 'pre-registered' | 'enrolled' | 'transferred') => {
    try {
      const response = await api.put(`/enrollment/${id}/status`, { status: newStatus });
      if (!response.data.success) throw new Error('Update failed');

      setApplications(prev => prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
      toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}`,
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleBulkStatusChange = async (newStatus: 'pre-registered' | 'enrolled' | 'transferred') => {
    try {
      const response = await api.post('/enrollment/bulk/status', { ids: selectedApplications, status: newStatus });
      if (!response.data.success) throw new Error('Bulk update failed');

      setApplications(prev => prev.map(app =>
        selectedApplications.includes(app.id) ? { ...app, status: newStatus } : app
      ));
      toast({
        title: 'Bulk Update Complete',
        description: `${selectedApplications.length} applications updated to ${newStatus}`,
      });
      setSelectedApplications([]);
    } catch (err) {
      console.error('Failed to bulk update:', err);
      toast({
        title: 'Error',
        description: 'Failed to update applications',
        variant: 'destructive'
      });
    }
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
  };

  const handleAssignSection = (app: Application) => {
    setSelectedApplication(app);
    setShowAssignModal(true);
  };

  const handleSectionAssignment = async (sectionId: string, sectionName: string) => {
    if (!selectedApplication) return;

    try {
      const response = await api.put(`/enrollment/${selectedApplication.id}/status`, {
        status: 'enrolled',
        section_id: sectionId
      });

      if (!response.data.success) throw new Error('Assignment failed');

      setApplications(prev => prev.map(app =>
        app.id === selectedApplication.id
          ? { ...app, section_id: sectionId, section_name: sectionName, status: 'enrolled' }
          : app
      ));
      toast({
        title: 'Section Assigned',
        description: `Student assigned to ${sectionName}`,
      });
      setShowAssignModal(false);
      setSelectedApplication(null);
      fetchData(); // Refresh to get updated counts
    } catch (err) {
      console.error('Failed to assign section:', err);
      toast({
        title: 'Error',
        description: 'Failed to assign section',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'bg-green-100 text-green-700';
      case 'pre-registered':
        return 'bg-yellow-100 text-yellow-700';
      case 'transferred':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvailableSections = (gradeLevel: string) => {
    return sections.filter(s =>
      s.grade_level === gradeLevel &&
      (s.current_enrollment || 0) < (s.capacity || 45)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or application number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pre-registered">Pre-Registered</option>
            <option value="enrolled">Enrolled</option>
            <option value="transferred">Transferred</option>
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Grades</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
          <button
            onClick={() => { fetchData(); onRefresh(); }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && hasPermission(['administrator']) && (
          <div className="mt-4 pt-4 border-t flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedApplications.length} selected
            </span>
            <button
              onClick={() => handleBulkStatusChange('enrolled')}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Mark as Enrolled
            </button>
            <button
              onClick={() => handleBulkStatusChange('transferred')}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Mark as Transferred
            </button>
            <button
              onClick={() => setSelectedApplications([])}
              className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {hasPermission(['administrator']) && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Application #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Student Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Grade Level</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Section</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Submitted</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  {hasPermission(['administrator']) && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(app.id)}
                        onChange={() => handleSelectOne(app.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-blue-600">{app.application_number || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {app.student_first_name?.charAt(0) || 'S'}{app.student_last_name?.charAt(0) || 'N'}
                      </div>
                      <span className="font-medium text-gray-800">
                        {app.student_last_name}, {app.student_first_name} {app.student_middle_name?.charAt(0)}.
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.grade_level}</td>
                  <td className="px-4 py-3">
                    {app.section_name ? (
                      <span className="text-gray-800">{app.section_name}</span>
                    ) : (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}>
                      {app.status?.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {hasPermission(['administrator', 'teacher']) && app.status === 'pre-registered' && (
                        <button
                          onClick={() => handleAssignSection(app)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Assign Section"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-500">No applications found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
          <p className="text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Application Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedApplication.student_first_name?.charAt(0)}{selectedApplication.student_last_name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {selectedApplication.student_first_name} {selectedApplication.student_middle_name} {selectedApplication.student_last_name}
                  </h4>
                  <p className="text-gray-500">{selectedApplication.application_number}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Grade Level</p>
                  <p className="font-medium">{selectedApplication.grade_level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Section</p>
                  <p className="font-medium">{selectedApplication.section_name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(selectedApplication.status)}`}>
                    {selectedApplication.status?.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">{selectedApplication.created_at ? new Date(selectedApplication.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              {hasPermission(['administrator']) && (
                <div className="pt-4 border-t flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const response = await api.post('/enrollment/approve', { applicationId: selectedApplication.id });
                        if (response.data.success) {
                          toast({ title: 'Success', description: 'Application approved' });
                          setShowDetailModal(false);
                          fetchData();
                        }
                      } catch (err) {
                        toast({ title: 'Error', description: 'Approval failed', variant: 'destructive' });
                      }
                    }}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Enrolled
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedApplication.id, 'transferred');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Mark as Transferred
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section Assignment Modal */}
      {showAssignModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAssignModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Assign Section</h3>
              <button onClick={() => setShowAssignModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Assign <strong>{selectedApplication.student_first_name} {selectedApplication.student_last_name}</strong> to a section in <strong>{selectedApplication.grade_level}</strong>
              </p>
              <div className="space-y-2">
                {getAvailableSections(selectedApplication.grade_level).length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No available sections for this grade level</p>
                ) : (
                  getAvailableSections(selectedApplication.grade_level).map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionAssignment(section.id, section.name)}
                      className="w-full p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left flex items-center justify-between"
                    >
                      <span className="font-medium">{section.name}</span>
                      <span className="text-sm text-gray-500">
                        {section.current_enrollment || 0}/{section.capacity || 45} students
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;
