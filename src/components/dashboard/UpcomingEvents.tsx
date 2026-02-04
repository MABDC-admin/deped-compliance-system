import React from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  icon: 'science' | 'meeting' | 'sports';
}

interface UpcomingEventsProps {
  events: Event[];
  onEventClick: (id: string) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onEventClick }) => {
  const getEventIcon = (type: Event['icon']) => {
    switch (type) {
      case 'science':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'meeting':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      case 'sports':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-3 flex items-center justify-between">
        <h3 className="text-white font-semibold">Upcoming Events</h3>
        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Events List */}
      <div className="p-4 space-y-3">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => onEventClick(event.id)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            {getEventIcon(event.icon)}
            <div>
              <p className="font-medium text-gray-800 text-sm">{event.title}</p>
              <p className="text-xs text-gray-500">{event.date}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
