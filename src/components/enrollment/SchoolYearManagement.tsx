import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

interface SchoolYear {
  id: string;
  year_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  enrollment_start: string;
  enrollment_end: string;
}

interface SchoolYearManagementProps {
  onRefresh: () => void;
}

const SchoolYearManagement: React.FC<SchoolYearManagementProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<SchoolYear | null>(null);
  const [formData, setFormData] = useState({
    year_name: '',
    start_date: '',
    end_date: '',
    enrollment_start: '',
    enrollment_end: '',
  });

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  const fetchSchoolYears = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/enrollment/school-years');
      if (response.data.success) {
        setSchoolYears(response.data.schoolYears);
      }
    } catch (err) {
      console.error('Failed to fetch school years:', err);
      toast({
        title: 'Error',
        description: 'Failed to load school years',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const response = await api.post(`/enrollment/school-years/${id}/active`);
      if (response.data.success) {
        setSchoolYears(prev => prev.map(sy => ({
          ...sy,
          is_active: sy.id === id,
        })));
        toast({
          title: 'Active School Year Updated',
          description: 'The active school year has been changed.',
        });
      }
    } catch (err) {
      console.error('Failed to set active year:', err);
      toast({
        title: 'Error',
        description: 'Failed to update active year',
        variant: 'destructive'
      });
    }
  };

  const handleAddSchoolYear = async () => {
    try {
      const response = await api.post('/enrollment/school-years', formData);

      if (response.data.success) {
        setSchoolYears(prev => [response.data.schoolYear, ...prev]);
        setShowAddModal(false);
        setFormData({ year_name: '', start_date: '', end_date: '', enrollment_start: '', enrollment_end: '' });
        toast({
          title: 'School Year Added',
          description: `${formData.year_name} has been created successfully.`,
        });
      }
    } catch (err) {
      console.error('Failed to add school year:', err);
      toast({
        title: 'Error',
        description: 'Failed to add school year',
        variant: 'destructive'
      });
    }
  };

  const handleEditSchoolYear = async () => {
    if (!selectedYear) return;

    try {
      const response = await api.put(`/enrollment/school-years/${selectedYear.id}`, formData);

      if (response.data.success) {
        setSchoolYears(prev => prev.map(sy =>
          sy.id === selectedYear.id
            ? { ...sy, ...formData }
            : sy
        ));
        setShowEditModal(false);
        setSelectedYear(null);
        toast({
          title: 'School Year Updated',
          description: 'School year details have been updated successfully.',
        });
      }
    } catch (err) {
      console.error('Failed to update school year:', err);
      toast({
        title: 'Error',
        description: 'Failed to update school year',
        variant: 'destructive'
      });
    }
  };

  const openEditModal = (year: SchoolYear) => {
    setSelectedYear(year);
    setFormData({
      year_name: year.year_name,
      start_date: year.start_date,
      end_date: year.end_date,
      enrollment_start: year.enrollment_start || '',
      enrollment_end: year.enrollment_end || '',
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getEnrollmentStatus = (start: string, end: string) => {
    if (!start || !end) return { text: 'Not Set', color: 'bg-gray-100 text-gray-700' };

    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) {
      return { text: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= startDate && now <= endDate) {
      return { text: 'Open', color: 'bg-green-100 text-green-700' };
    } else {
      return { text: 'Closed', color: 'bg-gray-100 text-gray-700' };
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">School Year Management</h3>
          <p className="text-sm text-gray-500">Manage academic years and enrollment periods</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add School Year
        </button>
      </div>

      {/* School Years List */}
      {schoolYears.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <p className="text-gray-500">No school years found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First School Year
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {schoolYears.map((year) => {
            const enrollmentStatus = getEnrollmentStatus(year.enrollment_start, year.enrollment_end);
            return (
              <div
                key={year.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden ${year.is_active ? 'ring-2 ring-blue-500' : ''
                  }`}
              >
                <div className={`px-6 py-4 ${year.is_active ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-xl font-bold">{year.year_name}</h4>
                        <p className={year.is_active ? 'text-blue-100' : 'text-gray-500'}>
                          {formatDate(year.start_date)} - {formatDate(year.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {year.is_active && (
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                          Current
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${enrollmentStatus.color}`}>
                        Enrollment {enrollmentStatus.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Enrollment Period</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(year.enrollment_start)} - {formatDate(year.enrollment_end)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`text-sm font-medium ${year.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                        {year.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => openEditModal(year)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      Edit Details
                    </button>
                    {!year.is_active && (
                      <button
                        onClick={() => handleSetActive(year.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Set as Active
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add School Year Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Add School Year</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Year Name</label>
                <input
                  type="text"
                  value={formData.year_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, year_name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2025-2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Start</label>
                  <input
                    type="date"
                    value={formData.enrollment_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, enrollment_start: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment End</label>
                  <input
                    type="date"
                    value={formData.enrollment_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, enrollment_end: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleAddSchoolYear}
                disabled={!formData.year_name || !formData.start_date || !formData.end_date}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add School Year
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit School Year Modal */}
      {showEditModal && selectedYear && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Edit School Year</h3>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Year Name</label>
                <input
                  type="text"
                  value={formData.year_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, year_name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Start</label>
                  <input
                    type="date"
                    value={formData.enrollment_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, enrollment_start: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment End</label>
                  <input
                    type="date"
                    value={formData.enrollment_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, enrollment_end: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleEditSchoolYear}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolYearManagement;
