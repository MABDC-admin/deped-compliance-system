import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import api from '@/lib/api';
import {
  Sidebar,
  Header,
  StatsCards,
  StudentsOverview,
  MonthlyAttendance,
  UpcomingEvents,
  RecentActivities,
  ExamResults,
  TeacherOfMonth,
  NoticeBoard,
  BackgroundDecoration,
} from './dashboard';
import {
  StudentsPage,
  TeachersPage,
  ClassesPage,
  AttendancePage,
  EnrollmentPage,
  UserManagementPage,
  StudentDashboard,
  TeacherDashboard
} from '@/pages';

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_type: string;
}

interface Notice {
  id: string;
  title: string;
  priority: string;
}

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { user, isAuthenticated, hasPermission } = useAuth();
  const isMobile = useIsMobile();
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Dynamic data states
  const [events, setEvents] = useState<Event[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch dynamic data
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [eventsRes, noticesRes] = await Promise.all([
        api.get('/dashboard/events'),
        api.get('/dashboard/notices')
      ]);

      if (eventsRes.data.success) {
        setEvents(eventsRes.data.events);
      }
      if (noticesRes.data.success) {
        setNotices(noticesRes.data.notices);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Transform events for UpcomingEvents component
  const transformedEvents = events.slice(0, 3).map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    icon: (event.event_type === 'academic' ? 'science' :
      event.event_type === 'meeting' ? 'meeting' :
        event.event_type === 'sports' ? 'sports' : 'science') as 'science' | 'meeting' | 'sports'
  }));

  // Transform notices for NoticeBoard component
  const transformedNotices = notices.slice(0, 3).map(notice => ({
    id: notice.id,
    text: notice.title,
    priority: (notice.priority === 'urgent' || notice.priority === 'high' ? 'high' :
      notice.priority === 'medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low'
  }));

  // Mock data for components that don't have dynamic data yet
  const attendanceData = [
    { month: 'Jan', percentage: 72 },
    { month: 'Feb', percentage: 85 },
    { month: 'Mar', percentage: 88 },
    { month: 'Apr', percentage: 92 },
    { month: 'May', percentage: 95 },
    { month: 'Jun', percentage: 94 },
    { month: 'Jul', percentage: 97 },
  ];

  const recentActivities = [
    { id: '1', title: 'New Admission: Emma Wilson', type: 'admission' as const },
    { id: '2', title: 'Assignment Uploaded for Class 8', type: 'assignment' as const },
    { id: '3', title: 'Grade Report Updated', type: 'grade' as const },
  ];

  const examResults = [
    { grade: 'A', percentage: 85, color: '#2196F3' },
    { grade: 'B', percentage: 65, color: '#4CAF50' },
    { grade: 'C', percentage: 45, color: '#00BCD4' },
    { grade: 'D', percentage: 35, color: '#FF9800' },
    { grade: 'F', percentage: 20, color: '#F44336' },
  ];

  const handleNavItemClick = (id: string) => {
    setActiveNavItem(id);
  };

  const handleStatCardClick = (id: string) => {
    if (hasPermission(['administrator', 'teacher'])) {
      setActiveNavItem(id);
    }
  };

  const handleEventClick = (id: string) => {
    console.log(`Opening event: ${id}`);
  };

  const handleActivityClick = (id: string) => {
    console.log(`Opening activity: ${id}`);
  };

  const handleNoticeClick = (id: string) => {
    console.log(`Opening notice: ${id}`);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleHelpClick = () => {
    console.log('Opening help');
  };

  const renderContent = () => {
    switch (activeNavItem) {
      case 'students':
        if (hasPermission(['administrator', 'teacher'])) {
          return <StudentsPage />;
        }
        break;
      case 'teachers':
        if (hasPermission(['administrator'])) {
          return <TeachersPage />;
        }
        break;
      case 'classes':
        if (hasPermission(['administrator', 'teacher'])) {
          return <ClassesPage />;
        }
        break;
      case 'attendance':
        return <AttendancePage />;
      case 'enrollment':
        if (hasPermission(['administrator', 'teacher', 'parent'])) {
          return <EnrollmentPage />;
        }
        break;
      case 'exams':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Exams Management</h1>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-600">Exam management module coming soon.</p>
              <p className="text-sm text-gray-500 mt-2">
                {hasPermission(['administrator', 'teacher'])
                  ? 'Create and manage exams, schedules, and results.'
                  : 'View your exam schedules and results.'}
              </p>
            </div>
          </div>
        );

      case 'grades':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {hasPermission(['administrator', 'teacher']) ? 'Grade Management' : 'My Grades'}
            </h1>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-600">Grade management module coming soon.</p>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Events Calendar</h1>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-600">Events calendar module coming soon.</p>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Library Management</h1>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <p className="text-gray-600">Library management module coming soon.</p>
            </div>
          </div>
        );
      case 'reports':
        if (hasPermission(['administrator'])) {
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-600">Reports and analytics module coming soon.</p>
              </div>
            </div>
          );
        }
        break;
      case 'settings':
        if (hasPermission(['administrator'])) {
          return <UserManagementPage />;
        }
        break;
    }

    // Role-based default dashboard
    if (user?.role === 'student') {
      return <StudentDashboard />;
    }

    if (user?.role === 'teacher') {
      return <TeacherDashboard />;
    }

    // Admin dashboard (default)
    return (
      <div className="w-full space-y-6">
        {/* Role-specific welcome message */}
        {user && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-4 text-white">
            <h2 className="text-lg font-semibold">
              Welcome back, {user.firstName}!
            </h2>
            <p className="text-blue-100 text-sm">
              {user.role === 'administrator' && 'You have full access to all system features.'}
              {user.role === 'teacher' && 'Manage your classes, attendance, and grades.'}
              {user.role === 'student' && 'View your classes, grades, and attendance records.'}
              {user.role === 'parent' && "Monitor your child's academic progress."}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards onCardClick={handleStatCardClick} />

        {/* Middle Section - Students Overview & Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudentsOverview boysCount={700} girlsCount={550} />
          <MonthlyAttendance data={attendanceData} />
        </div>

        {/* Bottom Section - Events, Activities, Exam Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingData ? (
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <UpcomingEvents events={transformedEvents} onEventClick={handleEventClick} />
          )}
          <RecentActivities activities={recentActivities} onActivityClick={handleActivityClick} />
          <ExamResults results={examResults} />
        </div>

        {/* Footer Section - Teacher of Month & Notice Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeacherOfMonth name="Ms. Karen Lee" subject="Mathematics Teacher" />
          {loadingData ? (
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <NoticeBoard notices={transformedNotices} onNoticeClick={handleNoticeClick} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Background Decoration */}
      <BackgroundDecoration />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          onNotificationClick={handleNotificationClick}
          onSettingsClick={handleSettingsClick}
          onHelpClick={handleHelpClick}
          onLoginClick={() => { }}
        />

        <div className="flex flex-1">
          {/* Sidebar */}
          {(!isMobile || sidebarOpen) && (
            <Sidebar activeItem={activeNavItem} onItemClick={handleNavItemClick} />
          )}

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4" onClick={() => setShowNotifications(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-80 mt-16 mr-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-auto">
              <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">New student enrolled</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Grade reports submitted</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Parent meeting reminder</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Dark Mode</span>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">SMS Alerts</span>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                </button>
              </div>
              <div className="pt-4 border-t">
                <label className="block text-gray-700 mb-2">Language</label>
                <select className="w-full border rounded-lg px-3 py-2 text-gray-700">
                  <option>English</option>
                  <option>Filipino</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AppLayout;
