import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface Permission {
  [key: string]: boolean;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'SUPPORT' | 'READ_ONLY';
  active: boolean;
  permissions: string[];
  createdAt: string;
  lastLoginAt: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  hasPermission: (perm: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function apiFetch(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    credentials: 'include', // Necessário para envio do cookie HttpOnly
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(options?.headers || {}) },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err: any = new Error(body?.error?.message || `Erro HTTP ${res.status}`);
    err.status = res.status;
    err.code = body?.error?.code;
    throw err;
  }

  return body;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const fetchMe = useCallback(async (): Promise<void> => {
    try {
      const res = await apiFetch('/api/auth/me');
      setUser(res.data);
      setSessionExpired(false);
    } catch (err: any) {
      setUser(null);
      if (err.status === 401) {
        // Só exibir "sessão expirada" se havia um usuário antes
        if (user !== null) {
          setSessionExpired(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Carregamento inicial — verificar sessão sem piscar o dashboard
    setLoading(true);
    fetchMe().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(res.data);
    setSessionExpired(false);
  };

  const logout = async (): Promise<void> => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignorar erros de logout — limpar estado local de qualquer forma
    }
    setUser(null);
    setSessionExpired(false);
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
    await apiFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
  };

  const hasPermission = (perm: string): boolean => {
    return user?.permissions.includes(perm) ?? false;
  };

  const refreshUser = async (): Promise<void> => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: !!user,
        sessionExpired,
        login,
        logout,
        changePassword,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
