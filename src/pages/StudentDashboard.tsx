import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppContext } from '@/contexts/AppContext';
import api from '@/lib/api';

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
}

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
}

interface Grade {
  subject_name: string;
  quarter: number;
  initial_grade: number;
  transmuted_grade: number;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentSchoolYearId } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0
  });
  const [dashboardGrades, setDashboardGrades] = useState<any[]>([]);
  const [gpa, setGpa] = useState(0);

  // Keep existing mocks for UI components that aren't backend-ready yet
  const todaySchedule: ScheduleItem[] = [
    { id: '1', subject: 'Mathematics', teacher: 'Mr. Santos', time: '7:30 - 8:30 AM', room: 'Room 101' },
    { id: '2', subject: 'Science', teacher: 'Ms. Garcia', time: '8:30 - 9:30 AM', room: 'Lab 1' },
    { id: '3', subject: 'English', teacher: 'Mrs. Reyes', time: '9:45 - 10:45 AM', room: 'Room 102' },
    { id: '4', subject: 'Filipino', teacher: 'Mr. Cruz', time: '10:45 - 11:45 AM', room: 'Room 103' },
    { id: '5', subject: 'Social Studies', teacher: 'Ms. Lopez', time: '1:00 - 2:00 PM', room: 'Room 104' },
    { id: '6', subject: 'MAPEH', teacher: 'Mr. Fernandez', time: '2:00 - 3:00 PM', room: 'Gym' },
  ];

  const assignments: Assignment[] = [
    { id: '1', subject: 'Mathematics', title: 'Chapter 5 Problem Set', dueDate: '2026-02-05', status: 'pending' },
    { id: '2', subject: 'Science', title: 'Lab Report: Photosynthesis', dueDate: '2026-02-06', status: 'pending' },
    { id: '3', subject: 'English', title: 'Essay: My Hero', dueDate: '2026-02-04', status: 'submitted' },
    { id: '4', subject: 'Filipino', title: 'Pagsusuri ng Akda', dueDate: '2026-02-03', status: 'graded' },
  ];

  const announcements = [
    { id: '1', title: 'Science Fair Registration Open', date: '2026-02-02', type: 'event' },
    { id: '2', title: 'Midterm Exams Schedule Released', date: '2026-02-01', type: 'academic' },
    { id: '3', title: 'Sports Day - February 14', date: '2026-01-30', type: 'event' },
  ];

  useEffect(() => {
    if (currentSchoolYearId) {
      loadDashboardData();
    }
  }, [currentSchoolYearId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/student', {
        params: { schoolYearId: currentSchoolYearId }
      });
      if (response.data.success) {
        setAttendanceSummary(response.data.attendance || {
          present: 0,
          absent: 0,
          late: 0,
          total: 0
        });

        // Group grades by subject for the table
        const gradesBySubject: Record<string, any> = {};
        response.data.grades.forEach((g: any) => {
          if (!gradesBySubject[g.subject_name]) {
            gradesBySubject[g.subject_name] = {
              subject: g.subject_name,
              q1: null, q2: null, q3: null, q4: null
            };
          }
          gradesBySubject[g.subject_name][`q${g.quarter}`] = g.transmuted_grade;
        });

        const gradesList = Object.values(gradesBySubject);
        setDashboardGrades(gradesList);

        // Calculate GPA from transmuted grades
        const validGrades = response.data.grades.map((g: any) => g.transmuted_grade);
        if (validGrades.length > 0) {
          const avg = validGrades.reduce((a: number, b: number) => a + b, 0) / validGrades.length;
          setGpa(avg);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const attendancePercentage = attendanceSummary.total > 0
    ? ((attendanceSummary.present / attendanceSummary.total) * 100).toFixed(1)
    : '0';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'graded': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.firstName}!</h1>
            <p className="text-blue-100">Here's your academic overview for today</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Current GPA</p>
              <p className="text-3xl font-bold">{gpa.toFixed(2)}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{attendancePercentage}%</p>
              <p className="text-sm text-gray-600">Attendance</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{assignments.filter(a => a.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{todaySchedule.length}</p>
              <p className="text-sm text-gray-600">Classes Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{announcements.length}</p>
              <p className="text-sm text-gray-600">Announcements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
            <p className="text-blue-100 text-sm">Tuesday, February 3, 2026</p>
          </div>
          <div className="divide-y">
            {todaySchedule.map((item, index) => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className={`w-1 h-12 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.subject}</p>
                  <p className="text-sm text-gray-500">{item.teacher} • {item.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{item.time}</p>
                  {index === 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Announcements</h2>
          </div>
          <div className="divide-y">
            {announcements.map(announcement => (
              <div key={announcement.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${announcement.type === 'event' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{announcement.title}</p>
                    <p className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Announcements</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Upcoming Assignments</h2>
          </div>
          <div className="divide-y">
            {assignments.map(assignment => (
              <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{assignment.title}</p>
                    <p className="text-sm text-gray-500">{assignment.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Assignments</button>
          </div>
        </div>

        {/* Grades Overview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Grades Overview</h2>
            <p className="text-green-100 text-sm">School Year 2025-2026</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Subject</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Q1</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Q2</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Avg</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dashboardGrades.slice(0, 6).map(grade => {
                  const avg = grade.q1 && grade.q2 ? ((grade.q1 + grade.q2) / 2).toFixed(0) : '-';
                  return (
                    <tr key={grade.subject} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-800">{grade.subject}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`text-sm font-medium ${grade.q1 && grade.q1 >= 90 ? 'text-green-600' :
                          grade.q1 && grade.q1 >= 80 ? 'text-blue-600' :
                            grade.q1 && grade.q1 >= 75 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {grade.q1 || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`text-sm font-medium ${grade.q2 && grade.q2 >= 90 ? 'text-green-600' :
                          grade.q2 && grade.q2 >= 80 ? 'text-blue-600' :
                            grade.q2 && grade.q2 >= 75 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {grade.q2 || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-sm font-bold text-gray-800">{avg}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Full Report Card</button>
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Attendance</h2>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#22c55e"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(attendanceSummary.present / attendanceSummary.total) * 352} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{attendancePercentage}%</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{attendanceSummary.present}</p>
              <p className="text-sm text-green-700">Present</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</p>
              <p className="text-sm text-red-700">Absent</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{attendanceSummary.late}</p>
              <p className="text-sm text-yellow-700">Late</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{attendanceSummary.total}</p>
              <p className="text-sm text-gray-700">Total Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
