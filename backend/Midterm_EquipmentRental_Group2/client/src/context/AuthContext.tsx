import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, GoogleUser } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  userId: number | null;
  name: string | null;
  email: string | null;
  //login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: () => void; // Google OAuth login
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isLoading: boolean;
  checkAuth: () => Promise<{ isAuthenticated: boolean; user?: GoogleUser }>;
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

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authResult = await authService.checkAuth();
        if (authResult.isAuthenticated && authResult.user) {
          setIsAuthenticated(true);
          setRole(authResult.user.role);
          setUserId(authResult.user.id ? parseInt(authResult.user.id) : null);
          setName(authResult.user.name || null);
          setEmail(authResult.user.email || null);
        } else {
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
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // check localStorage
        const token = authService.getToken();
        const storedRole = authService.getRole();
        if (token && storedRole) {
          setIsAuthenticated(true);
          setRole(storedRole);
          setUserId(authService.getUserId());
          setName(authService.getName());
          setEmail(authService.getEmail());
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);


  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if on callback page or just authenticated
      const urlParams = new URLSearchParams(window.location.search);
      const isCallback = urlParams.has('code') || window.location.pathname.includes('callback');
      
      if (isCallback) {
        try {
          setTimeout(async () => {
            const authResult = await authService.checkAuth();
            if (authResult.isAuthenticated && authResult.user) {
              setIsAuthenticated(true);
              setRole(authResult.user.role);
              setUserId(authResult.user.id ? parseInt(authResult.user.id) : null);
              setName(authResult.user.name || null);
              setEmail(authResult.user.email || null);
              
              // Redirect
                window.location.href = '/';
            }
          }, 500);
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  // Old Login
  //const login = async (username: string, password: string) => {
  //  const response = await authService.login({ username, password });
  //  authService.setAuthData(response.token, response.role, response.userId, response.name, response.email);

  //  setIsAuthenticated(true);
  //  setRole(response.role);
  //  setUserId(response.userId || null);
  //  setName(response.name || null);
  //  setEmail(response.email || null);
  //};

  // Google OAuth login
  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setIsAuthenticated(false);
      setRole(null);
      setUserId(null);
      setName(null);
      setEmail(null);
    }
  };

  // check auth status
  const checkAuth = async () => {
    return await authService.checkAuth();
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
    //login,
    loginWithGoogle,
    logout,
    isAdmin,
    isLoading,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};