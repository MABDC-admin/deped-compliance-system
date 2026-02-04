import React from 'react';

interface StudentsOverviewProps {
  boysCount: number;
  girlsCount: number;
}

const StudentsOverview: React.FC<StudentsOverviewProps> = ({ boysCount, girlsCount }) => {
  const total = boysCount + girlsCount;
  const boysPercentage = Math.round((boysCount / total) * 100);
  const girlsPercentage = 100 - boysPercentage;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Students Overview</h3>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-orange-300"></div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Pie Chart */}
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 200 200" className="w-44 h-44">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            {/* Blue slice (Boys - 56%) - starts from top, goes clockwise */}
            <path
              d="M 100 100 L 100 20 A 80 80 0 1 1 35.36 155.36 Z"
              fill="#2196F3"
              filter="url(#shadow)"
            />
            
            {/* Orange slice (Girls - 44%) */}
            <path
              d="M 100 100 L 35.36 155.36 A 80 80 0 0 1 100 20 Z"
              fill="#FF9800"
              filter="url(#shadow)"
            />
            
            {/* Green accent slice */}
            <path
              d="M 100 100 L 164.64 155.36 A 80 80 0 0 1 100 180 Z"
              fill="#4CAF50"
              filter="url(#shadow)"
            />
            
            {/* Yellow accent slice */}
            <path
              d="M 100 100 L 100 180 A 80 80 0 0 1 35.36 155.36 Z"
              fill="#FFEB3B"
              filter="url(#shadow)"
            />
            
            {/* Center white circle for donut effect */}
            <circle cx="100" cy="100" r="35" fill="white" />
            
            {/* Percentage labels on slices */}
            <text x="65" y="75" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">
              {boysPercentage}%
            </text>
            <text x="65" y="90" fill="white" fontSize="10" textAnchor="middle">
              Boys
            </text>
            
            <text x="135" y="75" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">
              {girlsPercentage}%
            </text>
            <text x="135" y="90" fill="white" fontSize="10" textAnchor="middle">
              Girls
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-700 font-medium">Boys: {boysCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-700 font-medium">Girls: {girlsCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Percentage boxes */}
      <div className="flex gap-3 mt-4">
        <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">{boysPercentage}%</span>
          <span className="text-gray-600 text-sm">Boys</span>
        </div>
        <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">{girlsPercentage}%</span>
          <span className="text-gray-600 text-sm">Girls</span>
        </div>
      </div>
    </div>
  );
};

export default StudentsOverview;
