import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';

export type UserRole = 'administrator' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  status?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
  verifyToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'sms_auth_token';
const USER_KEY = 'sms_user';

// Admin credentials for direct database authentication
const ADMIN_EMAIL = 'sottodennis@gmail.com';
const ADMIN_PASSWORD = 'Denskie123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const verifyToken = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

    if (!storedToken) {
      // Mock Admin user for development/bypassed mode
      const mockAdmin: User = {
        id: 'mock-admin-id',
        email: 'admin@example.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'administrator',
        status: 'active'
      };

      setState({
        user: mockAdmin,
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    // If we have a stored user, use it directly
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    try {
      // Assuming a verify endpoint for the Node.js backend
      const response = await api.post('/auth/verify', { token: storedToken });

      const { user } = response.data; // Assuming the verify endpoint returns the user if token is valid

      // Update local storage with the verified user data if necessary
      // localStorage.setItem(USER_KEY, JSON.stringify(user)); // Uncomment if verify returns updated user data

      setState({
        user,
        token: storedToken, // Keep the existing token
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      console.error('Token verification failed:', err);
      // Token invalid or verification failed, clear storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        const storage = credentials.rememberMe ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, token);
        storage.setItem(USER_KEY, JSON.stringify(user));

        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: response.data.error || 'Login failed' };
    } catch (err: any) {
      console.error('Login error:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: err.response?.data?.error || 'Authentication failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: response.data.success,
        message: response.data.message,
        error: response.data.error
      };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'An unexpected error occurred' };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return {
        success: response.data.success,
        message: response.data.message,
        error: response.data.error
      };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'An unexpected error occurred' };
    }
  }, []);

  const hasPermission = useCallback((allowedRoles: UserRole[]) => {
    if (!state.user) return false;
    return allowedRoles.includes(state.user.role);
  }, [state.user]);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      forgotPassword,
      resetPassword,
      hasPermission,
      verifyToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
