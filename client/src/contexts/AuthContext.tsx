import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  followers: number;
  following: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock API call - In production, this would call the User Authentication Service
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser: User = {
            id: '1',
            email,
            username: email.split('@')[0],
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Pinterest enthusiast',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
            followers: 1234,
            following: 567,
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (userData: RegisterData) => {
    // Mock API call - In production, this would call the User Authentication Service
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate checking for existing email
        const existingUsers = ['existing@example.com', 'test@test.com'];
        if (existingUsers.includes(userData.email)) {
          reject(new Error('EMAIL_EXISTS'));
          return;
        }

        const mockUser: User = {
          id: Date.now().toString(),
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          bio: '',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
          followers: 0,
          following: 0,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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