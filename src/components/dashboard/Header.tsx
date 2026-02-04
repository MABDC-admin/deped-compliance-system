import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SchoolYearSelector } from './SchoolYearSelector';

interface HeaderProps {
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onNotificationClick,
  onSettingsClick,
  onHelpClick,
  onLoginClick,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator': return 'text-purple-200';
      case 'teacher': return 'text-blue-200';
      case 'student': return 'text-green-200';
      case 'parent': return 'text-orange-200';
      default: return 'text-blue-100';
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-md flex items-center justify-center">
            <svg viewBox="0 0 48 48" className="w-10 h-10">
              <rect x="8" y="20" width="32" height="24" fill="#E57373" rx="2" />
              <polygon points="24,4 4,20 44,20" fill="#EF5350" />
              <rect x="20" y="28" width="8" height="16" fill="#5D4037" />
              <rect x="12" y="26" width="6" height="6" fill="#BBDEFB" />
              <rect x="30" y="26" width="6" height="6" fill="#BBDEFB" />
              <circle cx="24" cy="12" r="3" fill="#FFC107" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-wide">School Management System</h1>
        </div>

        {/* User Profile and Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* School Year Selector */}
              <SchoolYearSelector />

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden shadow-md flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                  <p className={`text-xs capitalize ${getRoleColor(user.role)}`}>{user.role}</p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={onNotificationClick}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors relative"
                  aria-label="Notifications"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  onClick={onSettingsClick}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Settings"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  onClick={onHelpClick}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Help"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  onClick={logout}
                  className="ml-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                  aria-label="Logout"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
