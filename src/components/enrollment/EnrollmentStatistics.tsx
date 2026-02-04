import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAppContext } from '@/contexts/AppContext';

interface StatCard {
  label: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface GradeData {
  grade: string;
  enrolled: number;
  preRegistered: number;
  capacity: number;
}

interface Application {
  id: string;
  student_first_name: string;
  student_last_name: string;
  grade_level: string;
  status: string;
  created_at: string;
}

const EnrollmentStatistics: React.FC = () => {
  const { currentSchoolYearId } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    enrolled: 0,
    preRegistered: 0,
    transferred: 0
  });

  useEffect(() => {
    if (currentSchoolYearId) {
      fetchData();
    }
  }, [currentSchoolYearId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [appsRes, sectionsRes] = await Promise.all([
        api.get('/enrollment', { params: { schoolYearId: currentSchoolYearId } }),
        api.get('/classes/sections', { params: { schoolYearId: currentSchoolYearId } })
      ]);

      if (appsRes.data.success) {
        setApplications(appsRes.data.applications);
        const apps = appsRes.data.applications;

        // Calculate stats
        const enrolled = apps.filter((a: any) => a.status === 'enrolled').length;
        const preRegistered = apps.filter((a: any) => a.status === 'pre-registered').length;
        const transferred = apps.filter((a: any) => a.status === 'transferred').length;

        setStats({
          total: apps.length,
          enrolled,
          preRegistered,
          transferred
        });
      }

      if (sectionsRes.data.success) {
        setSections(sectionsRes.data.sections);
      }
    } catch (err) {
      console.error('Failed to fetch statistics data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      label: 'Total Applications',
      value: stats.total,
      change: '+12%',
      changeType: 'positive',
      color: 'bg-blue-500',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Enrolled Students',
      value: stats.enrolled,
      change: '+8%',
      changeType: 'positive',
      color: 'bg-green-500',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      label: 'Pre-Registered',
      value: stats.preRegistered,
      change: '-5%',
      changeType: 'negative',
      color: 'bg-yellow-500',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'Transferred',
      value: stats.transferred,
      change: '0%',
      changeType: 'neutral',
      color: 'bg-red-500',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  // Calculate grade data from sections
  const gradeData: GradeData[] = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => {
    const gradeSections = sections.filter(s => s.grade_level === grade);
    const totalCapacity = gradeSections.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalEnrolled = gradeSections.reduce((sum, s) => sum + (s.current_enrollment || 0), 0);
    const preReg = applications.filter(a => a.grade_level === grade && a.status === 'pre-registered').length;

    return {
      grade,
      enrolled: totalEnrolled,
      preRegistered: preReg,
      capacity: totalCapacity || 120
    };
  });

  const recentApplications = applications.slice(0, 5);

  // Calculate percentages for pie chart
  const total = stats.total || 1;
  const enrolledPercent = ((stats.enrolled / total) * 100).toFixed(1);
  const preRegPercent = ((stats.preRegistered / total) * 100).toFixed(1);
  const transferredPercent = ((stats.transferred / total) * 100).toFixed(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value.toLocaleString()}</p>
                <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                  {stat.change} from last year
                </p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment by Grade Level */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrollment by Grade Level</h3>
          <div className="space-y-4">
            {gradeData.map((grade) => {
              const enrolledPercent = grade.capacity > 0 ? (grade.enrolled / grade.capacity) * 100 : 0;
              const preRegPercent = grade.capacity > 0 ? (grade.preRegistered / grade.capacity) * 100 : 0;
              return (
                <div key={grade.grade}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{grade.grade}</span>
                    <span className="text-gray-500">
                      {grade.enrolled + grade.preRegistered} / {grade.capacity}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-green-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(enrolledPercent, 100)}%` }}
                    ></div>
                    <div
                      className="bg-yellow-400 h-full transition-all duration-500"
                      style={{ width: `${Math.min(preRegPercent, 100 - enrolledPercent)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-sm text-gray-600">Pre-Registered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
          </div>
        </div>

        {/* Enrollment Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Pie Chart SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.enrolled / total) * 251.2} 251.2`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.preRegistered / total) * 251.2} 251.2`}
                  strokeDashoffset={`${-(stats.enrolled / total) * 251.2}`}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.transferred / total) * 251.2} 251.2`}
                  strokeDashoffset={`${-((stats.enrolled + stats.preRegistered) / total) * 251.2}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{stats.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
              <p className="text-2xl font-bold text-gray-800">{enrolledPercent}%</p>
              <p className="text-sm text-gray-500">Enrolled</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
              <p className="text-2xl font-bold text-gray-800">{preRegPercent}%</p>
              <p className="text-sm text-gray-500">Pre-Registered</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
              <p className="text-2xl font-bold text-gray-800">{transferredPercent}%</p>
              <p className="text-sm text-gray-500">Transferred</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        {recentApplications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No applications yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Student Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Grade Level</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {app.student_first_name?.charAt(0) || 'S'}
                        </div>
                        <span className="font-medium text-gray-800">
                          {app.student_first_name} {app.student_last_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{app.grade_level}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'enrolled' ? 'bg-green-100 text-green-700' :
                        app.status === 'pre-registered' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">New Application</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Export Report</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Bulk Import</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Print List</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentStatistics;
