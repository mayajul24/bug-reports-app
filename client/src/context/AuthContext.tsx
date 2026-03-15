import { createContext, useContext, useState, ReactNode } from 'react';
import { UserStatus } from '../types/Auth';

interface AuthState {
  email: string;
  status: UserStatus;
}

interface AuthContextValue {
  auth: AuthState | null;
  setAuth: (auth: AuthState | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = 'auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Wrapped in try/catch to handle corrupted or invalid JSON in localStorage
  const [auth, setAuthState] = useState<AuthState | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setAuth = (value: AuthState | null) => {
    setAuthState(value);
    if (value) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}