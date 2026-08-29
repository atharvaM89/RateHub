import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'STORE_OWNER';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res: any = await api.get('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      }
      throw new Error(res.message || 'Login failed');
    } catch (e) {
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: any) => {
    await api.post('/auth/register', data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed on backend:', e);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
