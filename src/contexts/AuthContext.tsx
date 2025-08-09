import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  bio: string;
  photos: string[];
  location: {
    lat: number;
    lng: number;
    city: string;
  } | string;
  interests: string[];
  verified?: boolean;
  isVerified?: boolean;
  subscription?: 'free' | 'premium';
  lastActive: Date | string;
  role?: 'user' | 'admin';
  settings?: {
    discoverable: boolean;
    ageRange: [number, number];
    maxDistance: number;
    showOnlineStatus: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  bio: string;
  interests: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Создаём админа при первом запуске
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.find((u: User) => u.email === 'Noumi');
    
    if (!adminExists) {
      const admin: User = {
        id: 'admin-1',
        name: 'Администратор',
        email: 'Noumi',
        password: '908908Tolya--Qwe',
        age: 30,
        bio: 'Администратор системы',
        interests: ['Управление'],
        photos: [],
        isVerified: true,
        lastActive: new Date().toISOString(),
        location: 'Система',
        role: 'admin'
      };
      
      users.push(admin);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === userData.email);
    
    if (existingUser) {
      setIsLoading(false);
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      photos: [],
      location: {
        lat: 55.7558,
        lng: 37.6176,
        city: 'Москва'
      },
      verified: false,
      subscription: 'free',
      lastActive: new Date(),
      settings: {
        discoverable: true,
        ageRange: [18, 35],
        maxDistance: 25,
        showOnlineStatus: true
      }
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};