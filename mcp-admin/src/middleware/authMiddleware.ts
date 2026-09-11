import { Request, Response, NextFunction } from 'express';
import { adminStore } from '../auth/store.js';
import { getPermissionsForRole } from '../auth/permissions.js';
import type { Role, Permission, AdminUser } from '../auth/types.js';

export const COOKIE_NAME = 'admin_session';

// Extende Express Request com o admin autenticado
declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

/**
 * requireAuth — exige sessão válida.
 * Extrai o token do cookie HttpOnly e valida a sessão.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária.' },
    });
    return;
  }

  // Limpar sessões expiradas periodicamente
  adminStore.purgeExpiredSessions();

  const session = adminStore.findSessionByToken(token);
  if (!session) {
    // Cookie inválido ou sessão expirada
    res.clearCookie(COOKIE_NAME);
    res.status(401).json({
      success: false,
      error: { code: 'SESSION_EXPIRED', message: 'Sessão expirada. Entre novamente.' },
    });
    return;
  }

  const now = new Date();
  if (new Date(session.expiresAt) < now) {
    adminStore.revokeSession(token);
    adminStore.addAuthAuditLog({
      timestamp: now.toISOString(),
      event: 'SESSION_EXPIRED',
      adminId: session.adminId,
      adminEmail: null,
      ip: maskIp(req.ip || ''),
      userAgent: req.headers['user-agent']?.substring(0, 100) || '',
    });
    res.clearCookie(COOKIE_NAME);
    res.status(401).json({
      success: false,
      error: { code: 'SESSION_EXPIRED', message: 'Sessão expirada. Entre novamente.' },
    });
    return;
  }

  const admin = adminStore.findAdminById(session.adminId);
  if (!admin || !admin.active) {
    adminStore.revokeSession(token);
    res.clearCookie(COOKIE_NAME);
    res.status(401).json({
      success: false,
      error: { code: 'ACCOUNT_DISABLED', message: 'Conta desativada.' },
    });
    return;
  }

  // Atualizar last activity
  adminStore.touchSession(token);

  req.admin = admin;
  next();
}

/**
 * requirePermission — exige que o admin autenticado possua UMA DAS permissões listadas.
 */
export function requirePermission(...permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const admin = req.admin;
    if (!admin) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária.' },
      });
      return;
    }

    const rolePerms = getPermissionsForRole(admin.role);
    const granted = permissions.some((p) => rolePerms.includes(p));

    if (!granted) {
      adminStore.addAuthAuditLog({
        timestamp: new Date().toISOString(),
        event: 'PERMISSION_DENIED',
        adminId: admin.id,
        adminEmail: admin.email,
        ip: maskIp(req.ip || ''),
        userAgent: req.headers['user-agent']?.substring(0, 100) || '',
        details: `Permissão negada: ${permissions.join(', ')} em ${req.method} ${req.path}`,
      });
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Você não possui permissão para realizar esta ação.',
        },
      });
      return;
    }

    next();
  };
}

/**
 * requireRole — exige que o admin possua um dos roles listados.
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const admin = req.admin;
    if (!admin) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária.' },
      });
      return;
    }

    if (!roles.includes(admin.role)) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Acesso restrito a este perfil.' },
      });
      return;
    }

    next();
  };
}

// Mascara o último octeto do IP para logs do frontend
export function maskIp(ip: string): string {
  if (ip.includes(':')) return ip.replace(/:[^:]+$/, ':***'); // IPv6 parcial
  const parts = ip.split('.');
  if (parts.length === 4) {
    parts[3] = '***';
    return parts.join('.');
  }
  return ip;
}
