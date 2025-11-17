"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/supabase';
import { 
  getUserByEmail, 
  createUser, 
  getUserProgress, 
  createUserProgress,
  updateUserProgress 
} from '@/lib/supabase-functions';

interface UserContextType {
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProgress: (completedDays: number[], currentDay: number, totalSaved: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário do localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserId(userData.id);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, name?: string) => {
    try {
      setIsLoading(true);
      
      // Verificar se usuário existe
      let userData = await getUserByEmail(email);
      
      if (!userData && name) {
        // Criar novo usuário
        userData = await createUser(name, email);
        
        // Criar progresso inicial
        await createUserProgress(userData.id);
      }
      
      if (userData) {
        setUser(userData);
        setUserId(userData.id);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('user');
  };

  const updateProgress = async (
    completedDays: number[], 
    currentDay: number, 
    totalSaved: number
  ) => {
    if (!userId) return;
    
    try {
      await updateUserProgress(userId, completedDays, currentDay, totalSaved);
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, userId, isLoading, login, logout, updateProgress }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}
