import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EnrollmentForm from '@/components/enrollment/EnrollmentForm';
import EnrollmentList from '@/components/enrollment/EnrollmentList';
import EnrollmentStatistics from '@/components/enrollment/EnrollmentStatistics';
import SectionManagement from '@/components/enrollment/SectionManagement';
import SchoolYearManagement from '@/components/enrollment/SchoolYearManagement';
import BulkEnrollment from '@/components/enrollment/BulkEnrollment';

type TabType = 'statistics' | 'applications' | 'new-application' | 'sections' | 'school-years' | 'bulk';

const EnrollmentPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('statistics');
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = hasPermission(['administrator']);
  const isRegistrar = hasPermission(['administrator', 'teacher']);

  const tabs = [
    { id: 'statistics' as TabType, label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
    ), roles: ['administrator', 'teacher'] },
    { id: 'applications' as TabType, label: 'Applications', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ), roles: ['administrator', 'teacher'] },
    { id: 'new-application' as TabType, label: 'New Application', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ), roles: ['administrator', 'teacher', 'parent'] },
    { id: 'sections' as TabType, label: 'Sections', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ), roles: ['administrator', 'teacher'] },
    { id: 'school-years' as TabType, label: 'School Years', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ), roles: ['administrator'] },
    { id: 'bulk' as TabType, label: 'Bulk Enrollment', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ), roles: ['administrator'] },
  ];

  const filteredTabs = tabs.filter(tab => hasPermission(tab.roles as any));

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleApplicationSuccess = () => {
    setActiveTab('applications');
    handleRefresh();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <EnrollmentStatistics key={refreshKey} />;
      case 'applications':
        return <EnrollmentList key={refreshKey} onRefresh={handleRefresh} />;
      case 'new-application':
        return <EnrollmentForm onSuccess={handleApplicationSuccess} />;
      case 'sections':
        return <SectionManagement key={refreshKey} onRefresh={handleRefresh} />;
      case 'school-years':
        return <SchoolYearManagement key={refreshKey} onRefresh={handleRefresh} />;
      case 'bulk':
        return <BulkEnrollment onRefresh={handleRefresh} />;
      default:
        return <EnrollmentStatistics key={refreshKey} />;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          Student Enrollment
        </h1>
        <p className="text-gray-600 mt-1">Manage student enrollment applications, sections, and school years</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
        <div className="flex flex-wrap border-b">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
};

export default EnrollmentPage;
