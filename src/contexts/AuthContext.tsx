import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Admin {
  id: string;
  collegeName: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Validate token by making a test request
      api.get('/api/college-admin/users')
        .then(() => {
          // Token is valid, decode and set admin info
          const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
          setAdmin(adminData);
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/college-admin/login', { email, password });
      const { token, admin: adminData } = response.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(adminData));
      setAdmin(adminData);
      
      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
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
