import { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { UserResponse, RegisterRequest } from '../types';

// Extend UserResponse if we need extra frontend-only fields
interface User extends UserResponse {
  followers: number;
  following: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from sessionStorage immediately to prevent redirect issues
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    return !!(storedToken && storedUser);
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const token = response.token;

      // Store token in session storage
      sessionStorage.setItem('token', token);

      // Fetch user profile
      const userProfile = await authService.getProfile(response.userId);

      const userData: User = {
        ...userProfile,
        followers: 0, // TODO: Fetch real count
        following: 0, // TODO: Fetch real count
      };

      setUser(userData);
      setIsAuthenticated(true);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);

      const token = response.token;
      sessionStorage.setItem('token', token);

      const userProfile = await authService.getProfile(response.userId);

      const newUser: User = {
        ...userProfile,
        followers: 0,
        following: 0,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear sessionStorage first (synchronous)
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.clear(); // Clear all sessionStorage to be safe

    // Then update state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (user) {
      try {
        const updated = await authService.updateProfile(user.id, userData);
        const updatedUser = { ...user, ...updated };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};