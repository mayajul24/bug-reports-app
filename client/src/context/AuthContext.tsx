import { createContext, useContext, useState, ReactNode } from 'react';
import { UserStatus } from '../types/Report';

interface AuthState {
  email: string;
  status: UserStatus;
}

interface AuthContextValue {
  auth: AuthState | null;
  setAuth: (auth: AuthState | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}