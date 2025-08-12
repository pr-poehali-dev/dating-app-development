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
  
  // Основная информация
  height?: number;
  weight?: number;
  bodyType?: 'slim' | 'athletic' | 'average' | 'curvy' | 'large';
  hairColor?: 'blonde' | 'brunette' | 'red' | 'black' | 'gray' | 'other';
  eyeColor?: 'brown' | 'blue' | 'green' | 'hazel' | 'gray' | 'other';
  
  // Образ жизни
  zodiac?: 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';
  smoking?: 'never' | 'sometimes' | 'often' | 'socially';
  drinking?: 'never' | 'socially' | 'often' | 'rarely';
  diet?: 'omnivore' | 'vegetarian' | 'vegan' | 'kosher' | 'halal' | 'other';
  religion?: 'christian' | 'muslim' | 'jewish' | 'buddhist' | 'hindu' | 'atheist' | 'agnostic' | 'other';
  
  // Карьера и образование
  education?: 'school' | 'college' | 'bachelor' | 'master' | 'phd';
  work?: string;
  income?: 'prefer_not_say' | 'low' | 'average' | 'above_average' | 'high';
  
  // Отношения и семья
  relationship?: 'single' | 'divorced' | 'widowed';
  children?: 'none' | 'have' | 'want' | 'dont_want';
  wantChildren?: 'yes' | 'no' | 'maybe';
  pets?: 'none' | 'have_dogs' | 'have_cats' | 'have_other' | 'love_all';
  
  // Персональность
  personality?: string[];
  languages?: string[];
  travelStyle?: 'homebody' | 'explorer' | 'adventurer' | 'luxury' | 'budget';
  
  // Поиск отношений
  lookingFor?: 'casual' | 'serious' | 'friendship' | 'marriage' | 'activity_partner';
  
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
    // Создаем админа если его еще нет
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.find((u: User) => u.email === 'swi79@bk.ru');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Администратор',
        email: 'swi79@bk.ru',
        password: '908908Tolya--Qwe',
        age: 35,
        bio: 'Администратор системы NoumiDating',
        photos: [],
        location: {
          lat: 55.7558,
          lng: 37.6176,
          city: 'Москва'
        },
        interests: ['Администрирование', 'Техподдержка'],
        verified: true,
        subscription: 'premium',
        lastActive: new Date(),
        role: 'admin',
        settings: {
          discoverable: false,
          ageRange: [18, 65],
          maxDistance: 100,
          showOnlineStatus: false
        }
      };
      
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Проверяем сохранённого пользователя
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