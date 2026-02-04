import React from 'react';

interface ExamResult {
  grade: string;
  percentage: number;
  color: string;
}

interface ExamResultsProps {
  results: ExamResult[];
}

const ExamResults: React.FC<ExamResultsProps> = ({ results }) => {
  const chartHeight = 120;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
        <h3 className="text-white font-semibold">Exam Results</h3>
        <div className="flex gap-0.5">
          <div className="w-1 h-3 bg-white/60 rounded"></div>
          <div className="w-1 h-5 bg-white/80 rounded"></div>
          <div className="w-1 h-4 bg-white/70 rounded"></div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="p-4">
        {/* Y-axis labels and chart */}
        <div className="flex">
          <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 py-1" style={{ height: chartHeight }}>
            <span>100%</span>
            <span>80%</span>
            <span>60%</span>
            <span>40%</span>
            <span>20%</span>
          </div>

          {/* Bars container */}
          <div className="flex-1 relative" style={{ height: chartHeight }}>
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-b border-gray-100"></div>
              ))}
            </div>
            
            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around gap-2 px-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="w-10 rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${(result.percentage / 100) * chartHeight}px`,
                    backgroundColor: result.color,
                  }}
                  title={`${result.grade}: ${result.percentage}%`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex mt-2 pl-8">
          <div className="flex-1 flex justify-around">
            {results.map((result, index) => (
              <span key={index} className="text-sm font-bold text-gray-700 w-10 text-center">
                {result.grade}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
