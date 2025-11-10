import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId?: number;
  name?: string;
  email?: string;
}

// For Google OAuth
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authService = {
  // Old Login
  //login: async (credentials: LoginRequest): Promise<LoginResponse> => {
  //  try {
  //    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  //    return response.data;
  //  } catch (error) {
  //    if (axios.isAxiosError(error)) {
  //      throw error.response?.data || 'Login failed';
  //    }
  //    throw 'Login failed';
  //  }
  //},

  // Init Google OAuth login
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google-login`;
  },

  // Check Auth
  checkAuth: async (): Promise<{isAuthenticated: boolean, user?: GoogleUser }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/check`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to check auth:', error);
      return { isAuthenticated: false };
    }
  },
  

  // Get current user info
  getCurrentUser: async (): Promise<GoogleUser | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },


  logout: async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getRole: (): string | null => {
    return localStorage.getItem('role');
  },

  getUserId: (): number | null => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  },

  getName: (): string | null => {
    return localStorage.getItem('name');
  },

  getEmail: (): string | null => {
    return localStorage.getItem('email');
  },

  setAuthData: (token: string, role: string, userId?: number, name?: string, email?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    }
    if (name) {
      localStorage.setItem('name', name);
    }
    if (email) {
      localStorage.setItem('email', email);
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    return localStorage.getItem('role') === 'Admin';
  }
};