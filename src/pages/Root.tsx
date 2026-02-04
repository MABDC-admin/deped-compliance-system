import React from 'react';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/pages/LoginPage';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return <LoginPage />;
  }

  // If authenticated, show the main app
  return <AppLayout />;
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AuthenticatedApp />
      </AppProvider>
    </AuthProvider>
  );
};

export default Index;
