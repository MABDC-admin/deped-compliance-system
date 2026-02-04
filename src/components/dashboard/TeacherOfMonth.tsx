import React from 'react';

interface TeacherOfMonthProps {
  name: string;
  subject: string;
  imageUrl?: string;
}

const TeacherOfMonth: React.FC<TeacherOfMonthProps> = ({ name, subject }) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-md overflow-hidden h-full border border-amber-100">
      <div className="flex items-center p-4 gap-4">
        {/* Teacher Image with decorative elements */}
        <div className="relative flex-shrink-0">
          {/* Decorative books behind */}
          <div className="absolute -bottom-2 -left-3 w-8 h-10 bg-red-400 rounded-sm transform -rotate-12 shadow-sm"></div>
          <div className="absolute -bottom-1 -left-1 w-8 h-10 bg-yellow-400 rounded-sm transform -rotate-6 shadow-sm"></div>
          <div className="absolute -bottom-2 -right-3 w-8 h-10 bg-orange-400 rounded-sm transform rotate-12 shadow-sm"></div>
          
          {/* Teacher avatar */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg relative z-10 border-2 border-white">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background */}
              <rect x="0" y="0" width="100" height="100" fill="#E3F2FD" />
              {/* Hair */}
              <ellipse cx="50" cy="38" rx="28" ry="25" fill="#5D4037" />
              <ellipse cx="50" cy="48" rx="22" ry="18" fill="#5D4037" />
              {/* Face */}
              <ellipse cx="50" cy="42" rx="20" ry="22" fill="#FFCCBC" />
              {/* Eyes */}
              <ellipse cx="42" cy="40" rx="3" ry="2.5" fill="#5D4037" />
              <ellipse cx="58" cy="40" rx="3" ry="2.5" fill="#5D4037" />
              {/* Eyebrows */}
              <path d="M 38 36 Q 42 34 46 36" stroke="#5D4037" strokeWidth="1.5" fill="none" />
              <path d="M 54 36 Q 58 34 62 36" stroke="#5D4037" strokeWidth="1.5" fill="none" />
              {/* Smile */}
              <path d="M 44 52 Q 50 58 56 52" stroke="#E57373" strokeWidth="2" fill="none" />
              {/* Lips */}
              <ellipse cx="50" cy="52" rx="4" ry="2" fill="#E57373" />
              {/* Body/Dress */}
              <ellipse cx="50" cy="88" rx="28" ry="22" fill="#1976D2" />
              {/* Collar */}
              <polygon points="50,64 38,76 62,76" fill="#FFFFFF" />
            </svg>
          </div>
        </div>

        {/* Teacher Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Teacher of the Month</h3>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{subject}</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherOfMonth;
