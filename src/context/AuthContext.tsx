import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import {
  getActiveSessionUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  initializeDatabaseSeed,
} from '../services/authService';
import { dbListUsers, dbGetUser } from '../services/db';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, phone: string, pin: string, avatarUrl?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  availableUsers: User[];
  refreshAvailableUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  const refreshAvailableUsers = useCallback(async () => {
    try {
      const list = await dbListUsers();
      setAvailableUsers(list);
    } catch (e) {
      console.error('Failed to list users:', e);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    async function init() {
      try {
        await initializeDatabaseSeed();
        const activeUser = await getActiveSessionUser();
        // If no active session, default to demo user 1 for instant preview
        if (activeUser) {
          setUser(activeUser);
        }
        await refreshAvailableUsers();
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [refreshAvailableUsers]);

  const login = async (phone: string, pin: string) => {
    const res = await loginUser(phone, pin);
    if (res.success && res.user) {
      setUser(res.user);
      await refreshAvailableUsers();
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const register = async (name: string, phone: string, pin: string, avatarUrl?: string) => {
    const res = await registerUser(name, phone, pin, avatarUrl);
    if (res.success && res.user) {
      setUser(res.user);
      await refreshAvailableUsers();
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const switchUser = async (userId: string) => {
    const target = await dbGetUser(userId);
    if (target) {
      localStorage.setItem('memoryvault_active_session_uid', target.id);
      setUser(target);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await updateUserProfile(user.id, updates);
    if (updated) {
      setUser(updated);
      await refreshAvailableUsers();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchUser,
        updateUser,
        availableUsers,
        refreshAvailableUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
