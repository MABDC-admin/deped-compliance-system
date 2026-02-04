import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface ClassSection {
  id: string;
  name: string;
  grade_level: string;
  adviser_name: string;
  room_number: string;
  current_enrollment: number;
  capacity: number;
}

const ClassesPage: React.FC = () => {
  const { currentSchoolYearId } = useAppContext();
  const [filterGrade, setFilterGrade] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentSchoolYearId) {
      fetchClasses();
    }
  }, [currentSchoolYearId]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/classes/sections', {
        params: { schoolYearId: currentSchoolYearId }
      });
      if (response.data.success) {
        setClasses(response.data.sections);
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls =>
    filterGrade === 'all' || cls.grade_level === filterGrade
  );

  const getCapacityColor = (count: number, capacity: number) => {
    const ratio = count / capacity;
    if (ratio >= 0.95) return 'bg-red-500';
    if (ratio >= 0.8) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Class
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Grade Levels</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 11">Grade 11</option>
          <option value="Grade 12">Grade 12</option>
        </select>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading classes...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            No classes found.
          </div>
        ) : filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 text-white">
              <h3 className="font-bold text-lg">{cls.grade_level}</h3>
              <p className="text-orange-100">{cls.name}</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{cls.adviser_name || 'No Adviser Assigned'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{cls.room_number}</span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{cls.current_enrollment}/{cls.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getCapacityColor(cls.current_enrollment, cls.capacity)}`}
                    style={{ width: `${(cls.current_enrollment / cls.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                {/* ... existing buttons ... */}
                <button className="text-blue-600 hover:text-blue-800 p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="text-green-600 hover:text-green-800 p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Class</h2>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                  <select className="w-full border rounded-lg px-3 py-2">
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Section A" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Adviser</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>Ms. Karen Lee</option>
                  <option>Mr. John Santos</option>
                  <option>Ms. Maria Garcia</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Room 101" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2" defaultValue={45} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
