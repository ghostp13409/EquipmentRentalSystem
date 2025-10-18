import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  userId: number | null;
  name: string | null;
  email: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const token = authService.getToken();
    const storedRole = authService.getRole();
    const storedUserId = authService.getUserId();
    const storedName = authService.getName();
    const storedEmail = authService.getEmail();

    if (token && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
      setUserId(storedUserId);
      setName(storedName);
      setEmail(storedEmail);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    authService.setAuthData(response.token, response.role, response.userId, response.name, response.email);

    setIsAuthenticated(true);
    setRole(response.role);
    setUserId(response.userId || null);
    setName(response.name || null);
    setEmail(response.email || null);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
    setName(null);
    setEmail(null);
  };

  const isAdmin = () => {
    return role === 'Admin';
  };

  const value: AuthContextType = {
    isAuthenticated,
    role,
    userId,
    name,
    email,
    login,
    logout,
    isAdmin,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};