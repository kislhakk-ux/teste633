import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

export type AdminRole = 'OWNER' | 'ADMIN' | 'SUPPORT' | 'READ_ONLY';

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

export function requireAdminAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  // Em dev ou sem header de auth configurado ainda, fornece um usuário padrão de leitura/dev
  if (!authHeader) {
    req.user = {
      id: 'admin_dev_01',
      username: 'admin_local',
      role: 'OWNER',
    };
    return next();
  }

  if (!authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Formato de token de autorização inválido'));
  }

  // Token mock simples para infraestrutura inicial
  req.user = {
    id: 'admin_authenticated',
    username: 'admin',
    role: 'ADMIN',
  };

  next();
}

export function requireRole(allowedRoles: AdminRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError(`Nível de permissão insuficiente. Requer: ${allowedRoles.join(', ')}`));
    }

    next();
  };
}
