import React from 'react';

interface AttendanceData {
  month: string;
  percentage: number;
}

interface MonthlyAttendanceProps {
  data: AttendanceData[];
}

const MonthlyAttendance: React.FC<MonthlyAttendanceProps> = ({ data }) => {
  const maxPercentage = 100;
  const minPercentage = 50;
  const chartHeight = 180;
  const chartWidth = 350;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - ((d.percentage - minPercentage) / (maxPercentage - minPercentage)) * innerHeight;
    return { x, y, ...d };
  });

  // Create line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Create area path for gradient fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;

  // Y-axis labels
  const yLabels = [100, 90, 80, 70, 60, 50];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Monthly Attendance</h3>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-orange-300"></div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF7043" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF7043" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yLabels.map((label, i) => {
          const y = padding.top + (i / (yLabels.length - 1)) * innerHeight;
          return (
            <g key={label}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {label}%
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#FF5722"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#FF5722"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={padding.top + innerHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default MonthlyAttendance;
