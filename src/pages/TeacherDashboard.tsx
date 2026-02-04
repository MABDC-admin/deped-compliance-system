import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppContext } from '@/contexts/AppContext';
import api from '@/lib/api';

interface ClassInfo {
  id: string;
  name: string;
  section: string;
  students: number;
  schedule: string;
  room: string;
}

interface PendingTask {
  id: string;
  type: 'grade' | 'attendance' | 'assignment';
  title: string;
  class: string;
  dueDate: string;
  count?: number;
}

interface StudentPerformance {
  name: string;
  grade: number;
  trend: 'up' | 'down' | 'stable';
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentSchoolYearId } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageAttendance: 0,
    pendingGrades: 0
  });

  // Keep existing mocks for UI components that aren't backend-ready yet
  const myClasses: ClassInfo[] = [
    { id: '1', name: 'Mathematics', section: 'Grade 7 - Section A', students: 35, schedule: 'MWF 7:30-8:30 AM', room: 'Room 101' },
    { id: '2', name: 'Mathematics', section: 'Grade 7 - Section B', students: 32, schedule: 'MWF 8:30-9:30 AM', room: 'Room 101' },
    { id: '3', name: 'Mathematics', section: 'Grade 8 - Section A', students: 38, schedule: 'TTH 7:30-9:00 AM', room: 'Room 102' },
    { id: '4', name: 'Mathematics', section: 'Grade 8 - Section B', students: 36, schedule: 'TTH 9:00-10:30 AM', room: 'Room 102' },
  ];

  const pendingTasks: PendingTask[] = [
    { id: '1', type: 'grade', title: 'Grade Quiz 3', class: 'Grade 7-A', dueDate: '2026-02-05', count: 35 },
    { id: '2', type: 'attendance', title: 'Mark Attendance', class: 'Grade 8-B', dueDate: '2026-02-03', count: 36 },
    { id: '3', type: 'assignment', title: 'Review Homework', class: 'Grade 7-B', dueDate: '2026-02-04', count: 28 },
    { id: '4', type: 'grade', title: 'Grade Project', class: 'Grade 8-A', dueDate: '2026-02-06', count: 38 },
  ];

  const topPerformers: StudentPerformance[] = [
    { name: 'Maria Garcia', grade: 98, trend: 'up' },
    { name: 'Juan Dela Cruz', grade: 96, trend: 'stable' },
    { name: 'Sofia Martinez', grade: 95, trend: 'up' },
    { name: 'Carlos Lopez', grade: 94, trend: 'down' },
    { name: 'Emma Wilson', grade: 93, trend: 'up' },
  ];

  const needsAttention: StudentPerformance[] = [
    { name: 'Pedro Santos', grade: 72, trend: 'down' },
    { name: 'Ana Reyes', grade: 74, trend: 'stable' },
    { name: 'Miguel Fernandez', grade: 75, trend: 'up' },
  ];

  const todaySchedule = [
    { time: '7:30 AM', class: 'Grade 7 - Section A', room: 'Room 101', status: 'completed' },
    { time: '8:30 AM', class: 'Grade 7 - Section B', room: 'Room 101', status: 'current' },
    { time: '9:45 AM', class: 'Grade 8 - Section A', room: 'Room 102', status: 'upcoming' },
    { time: '1:00 PM', class: 'Grade 8 - Section B', room: 'Room 102', status: 'upcoming' },
  ];

  const recentActivity = [
    { id: '1', action: 'Graded Quiz 2', class: 'Grade 7-A', time: '2 hours ago' },
    { id: '2', action: 'Marked Attendance', class: 'Grade 8-A', time: '3 hours ago' },
    { id: '3', action: 'Uploaded Assignment', class: 'Grade 7-B', time: 'Yesterday' },
    { id: '4', action: 'Updated Grades', class: 'Grade 8-B', time: 'Yesterday' },
  ];

  useEffect(() => {
    if (currentSchoolYearId) {
      loadDashboardData();
    }
  }, [currentSchoolYearId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/teacher', {
        params: { schoolYearId: currentSchoolYearId }
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'grade':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'attendance':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'assignment':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
      case 'down':
        return <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
      default:
        return <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Good morning, {user?.firstName}!</h1>
            <p className="text-indigo-100">You have {pendingTasks.length} pending tasks today</p>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-indigo-100">Total Students</p>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
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
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClasses}</p>
              <p className="text-sm text-gray-600">My Classes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.averageAttendance}%</p>
              <p className="text-sm text-gray-600">Avg. Attendance</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingGrades}</p>
              <p className="text-sm text-gray-600">Pending Grades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
            <p className="text-blue-100 text-sm">Tuesday, February 3, 2026</p>
          </div>
          <div className="divide-y">
            {todaySchedule.map((item, index) => (
              <div key={index} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${item.status === 'completed' ? 'bg-gray-300' :
                  item.status === 'current' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                  }`}></div>
                <div className="flex-1">
                  <p className={`font-medium ${item.status === 'completed' ? 'text-gray-400' : 'text-gray-800'}`}>
                    {item.class}
                  </p>
                  <p className="text-sm text-gray-500">{item.room}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${item.status === 'completed' ? 'text-gray-400' : 'text-gray-700'}`}>
                    {item.time}
                  </p>
                  {item.status === 'current' && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Now</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Pending Tasks</h2>
          </div>
          <div className="divide-y">
            {pendingTasks.map(task => (
              <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.class} • {task.count} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Tasks</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="divide-y">
            {recentActivity.map(activity => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.class} • {activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {myClasses.map(classInfo => (
            <div key={classInfo.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {classInfo.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{classInfo.name}</p>
                  <p className="text-sm text-gray-500">{classInfo.section}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  {classInfo.students} Students
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {classInfo.schedule}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {classInfo.room}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Top Performers</h2>
          </div>
          <div className="divide-y">
            {topPerformers.map((student, index) => (
              <div key={student.name} className="px-6 py-3 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{student.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">{student.grade}</span>
                  {getTrendIcon(student.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Needs Attention</h2>
          </div>
          <div className="divide-y">
            {needsAttention.map((student) => (
              <div key={student.name} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-500">Below average performance</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">{student.grade}</span>
                  {getTrendIcon(student.trend)}
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Schedule Consultation</button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Mark Attendance</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:bg-green-50 hover:border-green-200 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Enter Grades</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Create Assignment</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
