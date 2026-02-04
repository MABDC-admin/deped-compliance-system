import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

interface Section {
  id: string;
  grade_level: string;
  name: string;
  capacity: number;
  current_enrollment: number;
  adviser_name: string;
  room_number: string;
}

interface SectionManagementProps {
  onRefresh: () => void;
}

const SectionManagement: React.FC<SectionManagementProps> = ({ onRefresh }) => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    grade_level: '',
    name: '',
    capacity: 40,
    adviser_name: '',
    room_number: '',
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/classes/sections');
      if (response.data.success) {
        setSections(response.data.sections);
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
      toast({
        title: 'Error',
        description: 'Failed to load sections',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSections = sections.filter(section =>
    gradeFilter === 'all' || section.grade_level === gradeFilter
  );

  const gradeLevels = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 95) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCapacityStatus = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 95) return { text: 'Full', color: 'text-red-600 bg-red-50' };
    if (percentage >= 80) return { text: 'Almost Full', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'Available', color: 'text-green-600 bg-green-50' };
  };

  const handleAddSection = async () => {
    try {
      const response = await api.post('/classes/sections', {
        name: formData.name,
        gradeLevel: formData.grade_level,
        room: formData.room_number,
        capacity: formData.capacity,
        adviser_name: formData.adviser_name // Note: backend uses adviser_id but we are sending adviser_name for now as per schema
      });

      if (response.data.success) {
        setSections(prev => [...prev, response.data.section]);
        setShowAddModal(false);
        setFormData({ grade_level: '', name: '', capacity: 40, adviser_name: '', room_number: '' });
        toast({
          title: 'Section Added',
          description: `${formData.name} has been created successfully.`,
        });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to add section:', err);
      toast({
        title: 'Error',
        description: 'Failed to add section',
        variant: 'destructive'
      });
    }
  };

  const handleEditSection = async () => {
    if (!selectedSection) return;

    try {
      const response = await api.put(`/classes/sections/${selectedSection.id}`, formData);

      if (response.data.success) {
        setSections(prev => prev.map(s =>
          s.id === selectedSection.id
            ? { ...s, ...formData }
            : s
        ));
        setShowEditModal(false);
        setSelectedSection(null);
        toast({
          title: 'Section Updated',
          description: 'Section details have been updated successfully.',
        });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to update section:', err);
      toast({
        title: 'Error',
        description: 'Failed to update section',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const response = await api.delete(`/classes/sections/${id}`);

      if (response.data.success) {
        setSections(prev => prev.filter(s => s.id !== id));
        toast({
          title: 'Section Deleted',
          description: 'Section has been removed successfully.',
        });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete section:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete section',
        variant: 'destructive'
      });
    }
  };

  const openEditModal = (section: Section) => {
    setSelectedSection(section);
    setFormData({
      grade_level: section.grade_level,
      name: section.name,
      capacity: section.capacity,
      adviser_name: section.adviser_name || '',
      room_number: section.room_number || '',
    });
    setShowEditModal(true);
  };

  // Group sections by grade level
  const groupedSections = filteredSections.reduce((acc, section) => {
    if (!acc[section.grade_level]) {
      acc[section.grade_level] = [];
    }
    acc[section.grade_level].push(section);
    return acc;
  }, {} as Record<string, Section[]>);

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Grade Levels</option>
            {gradeLevels.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
        {hasPermission(['administrator']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Section
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Total Sections</p>
          <p className="text-2xl font-bold text-gray-800">{sections.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Total Capacity</p>
          <p className="text-2xl font-bold text-gray-800">{sections.reduce((sum, s) => sum + (s.capacity || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Total Enrolled</p>
          <p className="text-2xl font-bold text-green-600">{sections.reduce((sum, s) => sum + (s.current_enrollment || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-500">Available Slots</p>
          <p className="text-2xl font-bold text-blue-600">
            {sections.reduce((sum, s) => sum + ((s.capacity || 0) - (s.current_enrollment || 0)), 0)}
          </p>
        </div>
      </div>

      {/* Sections by Grade */}
      {Object.keys(groupedSections).length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
          </svg>
          <p className="text-gray-500">No sections found</p>
          {hasPermission(['administrator']) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Section
            </button>
          )}
        </div>
      ) : (
        Object.entries(groupedSections).map(([grade, gradeSections]) => (
          <div key={grade} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
              <h3 className="text-lg font-semibold text-white">{grade}</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradeSections.map((section) => {
                const status = getCapacityStatus(section.current_enrollment || 0, section.capacity || 45);
                return (
                  <div key={section.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{section.name}</h4>
                        <p className="text-sm text-gray-500">{section.room_number || 'No room assigned'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Capacity</span>
                        <span className="font-medium">{section.current_enrollment || 0} / {section.capacity || 45}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getCapacityColor(section.current_enrollment || 0, section.capacity || 45)} transition-all`}
                          style={{ width: `${((section.current_enrollment || 0) / (section.capacity || 45)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{section.adviser_name || 'No adviser assigned'}</span>
                    </div>

                    {hasPermission(['administrator']) && (
                      <div className="flex gap-2 pt-3 border-t">
                        <button
                          onClick={() => openEditModal(section)}
                          className="flex-1 py-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="flex-1 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Add New Section</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                <select
                  value={formData.grade_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade_level: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Grade Level</option>
                  {gradeLevels.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Einstein, Rizal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adviser Name</label>
                <input
                  type="text"
                  value={formData.adviser_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, adviser_name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Room 101"
                />
              </div>
              <button
                onClick={handleAddSection}
                disabled={!formData.grade_level || !formData.name}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {showEditModal && selectedSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Edit Section</h3>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                <select
                  value={formData.grade_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade_level: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {gradeLevels.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adviser Name</label>
                <input
                  type="text"
                  value={formData.adviser_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, adviser_name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleEditSection}
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

export default SectionManagement;
