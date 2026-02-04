import React from 'react';

interface Notice {
  id: string;
  text: string;
  priority?: 'high' | 'medium' | 'low';
}

interface NoticeBoardProps {
  notices: Notice[];
  onNoticeClick: (id: string) => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, onNoticeClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-3 flex items-center justify-between">
        <h3 className="text-white font-semibold">Notice Board</h3>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="p-4 space-y-3">
        {notices.map((notice) => (
          <button
            key={notice.id}
            onClick={() => onNoticeClick(notice.id)}
            className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">{notice.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
