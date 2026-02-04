import React from 'react';

interface StatCard {
  id: string;
  title: string;
  value: number | string;
  bgColor: string;
  icon: React.ReactNode;
}

interface StatsCardsProps {
  onCardClick: (id: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ onCardClick }) => {
  const stats: StatCard[] = [
    {
      id: 'students',
      title: 'Total Students',
      value: '1,250',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: (
        <svg viewBox="0 0 80 80" className="w-20 h-20">
          {/* Group of students icon */}
          <circle cx="25" cy="25" r="10" fill="#E3F2FD" />
          <circle cx="25" cy="23" r="7" fill="#FFCCBC" />
          <ellipse cx="25" cy="45" rx="12" ry="10" fill="#1976D2" />
          
          <circle cx="55" cy="25" r="10" fill="#C8E6C9" />
          <circle cx="55" cy="23" r="7" fill="#FFCCBC" />
          <ellipse cx="55" cy="45" rx="12" ry="10" fill="#388E3C" />
          
          <circle cx="40" cy="35" r="12" fill="#FFECB3" />
          <circle cx="40" cy="32" r="8" fill="#FFCCBC" />
          <ellipse cx="40" cy="58" rx="14" ry="12" fill="#FFA000" />
        </svg>
      ),
    },
    {
      id: 'teachers',
      title: 'Total Teachers',
      value: '85',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: (
        <svg viewBox="0 0 80 80" className="w-20 h-20">
          {/* Teacher icon */}
          <circle cx="40" cy="22" r="14" fill="#5D4037" />
          <circle cx="40" cy="20" r="10" fill="#FFCCBC" />
          <rect x="34" y="18" width="12" height="2" fill="#5D4037" rx="1" />
          <ellipse cx="40" cy="52" rx="18" ry="16" fill="#1565C0" />
          <rect x="32" y="34" width="16" height="6" fill="#FFFFFF" />
          <polygon points="40,40 34,48 46,48" fill="#1565C0" />
        </svg>
      ),
    },
    {
      id: 'classes',
      title: 'Classes',
      value: '30',
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
      icon: (
        <svg viewBox="0 0 80 80" className="w-20 h-20">
          {/* Classroom/chalkboard icon */}
          <rect x="10" y="15" width="60" height="40" fill="#2E7D32" rx="3" />
          <rect x="15" y="20" width="50" height="30" fill="#4CAF50" />
          <rect x="28" y="55" width="24" height="10" fill="#5D4037" />
          <rect x="22" y="63" width="36" height="6" fill="#795548" rx="2" />
          <line x1="20" y1="30" x2="60" y2="30" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="20" y1="38" x2="50" y2="38" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'admissions',
      title: 'New Admissions',
      value: '45',
      bgColor: 'bg-gradient-to-br from-teal-400 to-teal-500',
      icon: (
        <svg viewBox="0 0 80 80" className="w-20 h-20">
          {/* Checklist/admission icon */}
          <rect x="15" y="10" width="50" height="60" fill="#FFFFFF" rx="4" />
          <rect x="15" y="10" width="50" height="14" fill="#4CAF50" rx="4" />
          <circle cx="30" cy="34" r="5" fill="#4CAF50" />
          <path d="M27 34 L29 37 L34 31" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="40" y="32" width="20" height="4" fill="#E0E0E0" rx="2" />
          <circle cx="30" cy="48" r="5" fill="#4CAF50" />
          <path d="M27 48 L29 51 L34 45" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="40" y="46" width="20" height="4" fill="#E0E0E0" rx="2" />
          <circle cx="30" cy="62" r="5" fill="#E0E0E0" />
          <rect x="40" y="60" width="20" height="4" fill="#E0E0E0" rx="2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <button
          key={stat.id}
          onClick={() => onCardClick(stat.id)}
          className={`${stat.bgColor} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-between min-h-[100px]`}
        >
          <div>
            <p className="text-sm font-medium opacity-90">{stat.title}</p>
            <p className="text-4xl font-bold mt-1">{stat.value}</p>
          </div>
          <div className="opacity-90 flex-shrink-0">{stat.icon}</div>
        </button>
      ))}
    </div>
  );
};

export default StatsCards;
