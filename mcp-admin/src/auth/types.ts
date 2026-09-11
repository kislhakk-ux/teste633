// Types centrais para o sistema de autenticação administrativa

export type Role = 'OWNER' | 'ADMIN' | 'SUPPORT' | 'READ_ONLY';

export type Permission =
  | 'dashboard:view'
  | 'players:view'
  | 'inventory:view'
  | 'economy:view'
  | 'journal:view'
  | 'market:view'
  | 'logs:view'
  | 'logs:export'
  | 'audit:view'
  | 'security:view'
  | 'traces:view'
  | 'tools:view'
  | 'tools:execute'
  | 'settings:view'
  | 'settings:update'
  | 'admins:view'
  | 'admins:manage'
  | 'sessions:view'
  | 'sessions:revoke';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface AdminSession {
  id: string;
  adminId: string;
  token: string; // session ID (opaque, armazenado no cookie)
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface LoginAttempt {
  ip: string;
  email: string;
  failedCount: number;
  lastAttemptAt: string;
  blockedUntil: string | null;
}

export interface AuthAuditLog {
  id: string;
  timestamp: string;
  event:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT'
    | 'SESSION_EXPIRED'
    | 'PERMISSION_DENIED'
    | 'ADMIN_CREATED'
    | 'ADMIN_UPDATED'
    | 'ADMIN_DISABLED'
    | 'PASSWORD_CHANGED'
    | 'SESSION_REVOKED';
  adminId: string | null;
  adminEmail: string | null;
  ip: string;
  userAgent: string;
  details?: string;
}

// Usuário retornado ao frontend — sem dados sensíveis
export interface PublicAdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  permissions: Permission[];
  createdAt: string;
  lastLoginAt: string | null;
}
