import React from 'react';

interface Activity {
  id: string;
  title: string;
  type: 'admission' | 'assignment' | 'grade';
}

interface RecentActivitiesProps {
  activities: Activity[];
  onActivityClick: (id: string) => void;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onActivityClick }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'admission':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        );
      case 'assignment':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'grade':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
        <h3 className="text-white font-semibold">Recent Activities</h3>
        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-4 space-y-3">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => onActivityClick(activity.id)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            {getActivityIcon(activity.type)}
            <p className="font-medium text-gray-700 text-sm">{activity.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
