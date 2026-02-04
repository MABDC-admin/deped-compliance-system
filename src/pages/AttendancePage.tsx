import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface AttendanceRecord {
  student_id: string;
  student_name: string;
  lrn: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

interface Section {
  id: string;
  name: string;
  grade_level: string;
}

const AttendancePage: React.FC = () => {
  const { currentSchoolYearId } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSection, setSelectedSection] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentSchoolYearId) {
      fetchSections();
    }
  }, [currentSchoolYearId]);

  useEffect(() => {
    if (selectedSection && currentSchoolYearId) {
      loadAttendance();
    }
  }, [selectedSection, selectedDate, currentSchoolYearId]);

  const fetchSections = async () => {
    try {
      const response = await api.get('/classes/sections', {
        params: { schoolYearId: currentSchoolYearId }
      });
      if (response.data.success) {
        setSections(response.data.sections);
        if (response.data.sections.length > 0) {
          setSelectedSection(response.data.sections[0].id);
        } else {
          setSelectedSection('');
          setAttendance([]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/${selectedSection}/${selectedDate}`, {
        params: { schoolYearId: currentSchoolYearId }
      });
      if (response.data.success) {
        setAttendance(response.data.attendance);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
      toast({
        title: 'Error',
        description: 'Failed to load attendance records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async () => {
    try {
      const response = await api.post('/attendance/bulk', {
        date: selectedDate,
        records: attendance,
        schoolYearId: currentSchoolYearId
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Attendance saved successfully',
        });
      }
    } catch (err) {
      console.error('Failed to save attendance:', err);
      toast({
        title: 'Error',
        description: 'Failed to save attendance',
        variant: 'destructive',
      });
    }
  };

  const updateStatus = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendance(prev =>
      prev.map(record =>
        record.student_id === studentId ? { ...record, status } : record
      )
    );
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-700 border-green-300';
      case 'Absent': return 'bg-red-100 text-red-700 border-red-300';
      case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Excused': return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const stats = {
    present: attendance.filter(a => a.status === 'Present').length,
    absent: attendance.filter(a => a.status === 'Absent').length,
    late: attendance.filter(a => a.status === 'Late').length,
    excused: attendance.filter(a => a.status === 'Excused').length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Tracking</h1>
        <button
          onClick={saveAttendance}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.grade_level} - {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-600">{stats.present}</div>
          <div className="text-sm text-green-700">Present</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-3xl font-bold text-red-600">{stats.absent}</div>
          <div className="text-sm text-red-700">Absent</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="text-3xl font-bold text-yellow-600">{stats.late}</div>
          <div className="text-sm text-yellow-700">Late</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-600">{stats.excused}</div>
          <div className="text-sm text-blue-700">Excused</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">LRN</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student Name</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading attendance records...
                    </div>
                  </td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No students found in this section.
                  </td>
                </tr>
              ) : attendance.map((record) => (
                <tr key={record.student_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{record.lrn}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.student_name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      {(['Present', 'Absent', 'Late', 'Excused'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(record.student_id, status)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${record.status === status
                            ? status === 'Present' ? 'bg-green-600 text-white' :
                              status === 'Absent' ? 'bg-red-600 text-white' :
                                status === 'Late' ? 'bg-yellow-600 text-white' :
                                  'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {status.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
