import { Request, Response, NextFunction } from 'express';
import { adminStore } from '../../auth/store.js';
import { hashPassword, validatePasswordPolicy } from '../../auth/password.js';
import { getPermissionsForRole } from '../../auth/permissions.js';
import { COOKIE_NAME, maskIp } from '../../middleware/authMiddleware.js';
import type { Role, PublicAdminUser } from '../../auth/types.js';
import type { ApiResponse } from '../../types/index.js';
import { ValidationError, AuthorizationError } from '../../utils/errors.js';
import { auditLogger } from '../../logs/auditLogger.js';

function toPublicUser(admin: any): PublicAdminUser {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    active: admin.active,
    permissions: getPermissionsForRole(admin.role),
    createdAt: admin.createdAt,
    lastLoginAt: admin.lastLoginAt,
  };
}

const VALID_ROLES: Role[] = ['OWNER', 'ADMIN', 'SUPPORT', 'READ_ONLY'];

export class UserController {
  /**
   * GET /api/admin/users
   * Requer: admins:view
   */
  public listAdmins = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admins = adminStore.getAllAdmins().map(toPublicUser);
      const response: ApiResponse = { success: true, data: admins };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/admin/users
   * Requer: admins:manage
   */
  public createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;
      const requestingAdmin = req.admin!;

      if (!name || !email || !password || !role) {
        throw new ValidationError('Campos obrigatórios: name, email, password, role.');
      }

      if (!VALID_ROLES.includes(role)) {
        throw new ValidationError(`Role inválida. Use: ${VALID_ROLES.join(', ')}`);
      }

      // Somente OWNER pode criar outro OWNER
      if (role === 'OWNER' && requestingAdmin.role !== 'OWNER') {
        throw new AuthorizationError('Somente um OWNER pode criar outro OWNER.');
      }

      const existing = adminStore.findAdminByEmail(email);
      if (existing) {
        throw new ValidationError('Já existe um administrador com este e-mail.');
      }

      const policy = validatePasswordPolicy(password);
      if (!policy.valid) {
        throw new ValidationError(policy.errors.join(' '));
      }

      const passwordHash = await hashPassword(password);
      const admin = adminStore.createAdmin({
        name,
        email,
        passwordHash,
        role,
        active: true,
      });

      auditLogger.logAction({
        actorType: 'ADMIN',
        actorId: requestingAdmin.id,
        actorName: requestingAdmin.name,
        action: 'ADMIN_CREATED',
        resourceType: 'ADMIN_USER',
        resourceId: admin.id,
        result: 'SUCCESS',
        requestId: (req as any).requestId,
        correlationId: (req as any).correlationId,
        metadata: { createdEmail: email, createdRole: role },
      });

      adminStore.addAuthAuditLog({
        timestamp: new Date().toISOString(),
        event: 'ADMIN_CREATED',
        adminId: requestingAdmin.id,
        adminEmail: requestingAdmin.email,
        ip: maskIp(req.ip || ''),
        userAgent: (req.headers['user-agent'] || '').substring(0, 100),
        details: `Criou admin: ${email} (${role})`,
      });

      const response: ApiResponse = { success: true, data: toPublicUser(admin) };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * PATCH /api/admin/users/:id
   * Requer: admins:manage
   */
  public updateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const requestingAdmin = req.admin!;
      const { role, active } = req.body;

      const target = adminStore.findAdminById(id);
      if (!target) {
        throw new ValidationError('Administrador não encontrado.');
      }

      // Proteger o último OWNER ativo
      if (target.role === 'OWNER' && target.id !== requestingAdmin.id) {
        if (active === false || role !== 'OWNER') {
          const activeOwners = adminStore.countActiveOwners();
          if (activeOwners <= 1) {
            throw new AuthorizationError(
              'Não é possível remover ou rebaixar o único OWNER ativo do sistema.'
            );
          }
        }
      }

      // Não pode rolar para OWNER sem ser OWNER
      if (role === 'OWNER' && requestingAdmin.role !== 'OWNER') {
        throw new AuthorizationError('Somente um OWNER pode promover outro OWNER.');
      }

      const updates: any = {};
      if (role !== undefined && VALID_ROLES.includes(role)) updates.role = role;
      if (active !== undefined) updates.active = Boolean(active);

      const updated = adminStore.updateAdmin(id, updates);

      // Revogar sessões se conta for desativada
      if (active === false) {
        adminStore.revokeAllSessionsForAdmin(id);
        adminStore.addAuthAuditLog({
          timestamp: new Date().toISOString(),
          event: 'ADMIN_DISABLED',
          adminId: requestingAdmin.id,
          adminEmail: requestingAdmin.email,
          ip: maskIp(req.ip || ''),
          userAgent: (req.headers['user-agent'] || '').substring(0, 100),
          details: `Desativou admin: ${target.email}`,
        });
      } else {
        adminStore.addAuthAuditLog({
          timestamp: new Date().toISOString(),
          event: 'ADMIN_UPDATED',
          adminId: requestingAdmin.id,
          adminEmail: requestingAdmin.email,
          ip: maskIp(req.ip || ''),
          userAgent: (req.headers['user-agent'] || '').substring(0, 100),
          details: `Atualizou admin ${target.email}: ${JSON.stringify({ role, active })}`,
        });
      }

      const response: ApiResponse = { success: true, data: toPublicUser(updated!) };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/admin/sessions
   * Requer: sessions:view
   */
  public listSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const all = adminStore.getAllActiveSessions();
      // Mascarar o token — nunca expor ao frontend
      const sanitized = all.map((s) => ({
        id: s.id,
        adminId: s.adminId,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        lastActivityAt: s.lastActivityAt,
        ipAddress: maskIp(s.ipAddress),
        userAgent: s.userAgent.substring(0, 80),
        isCurrent: s.token === req.cookies?.[COOKIE_NAME],
      }));
      const response: ApiResponse = { success: true, data: sanitized };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /api/admin/sessions/:id
   * Requer: sessions:revoke
   */
  public revokeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const session = adminStore.findSessionById(id);
      if (!session) {
        throw new ValidationError('Sessão não encontrada.');
      }
      adminStore.revokeSessionById(id);
      adminStore.addAuthAuditLog({
        timestamp: new Date().toISOString(),
        event: 'SESSION_REVOKED',
        adminId: req.admin!.id,
        adminEmail: req.admin!.email,
        ip: maskIp(req.ip || ''),
        userAgent: (req.headers['user-agent'] || '').substring(0, 100),
        details: `Sessão ${id} revogada`,
      });
      const response: ApiResponse = { success: true, data: { message: 'Sessão revogada.' } };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /api/admin/sessions/other
   * Encerra outras sessões do admin autenticado
   */
  public revokeOtherSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      adminStore.revokeOtherSessionsForAdmin(req.admin!.id, token);
      const response: ApiResponse = { success: true, data: { message: 'Outras sessões encerradas.' } };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/admin/security
   * Dados de segurança para a página de Segurança
   * Requer: sessions:view
   */
  public getSecurityData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const all = adminStore.getAllActiveSessions();
      const myToken = req.cookies?.[COOKIE_NAME];

      const activeSessions = all.map((s) => ({
        id: s.id,
        adminId: s.adminId,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        lastActivityAt: s.lastActivityAt,
        ipAddress: maskIp(s.ipAddress),
        userAgent: s.userAgent.substring(0, 80),
        isCurrent: s.token === myToken,
      }));

      const recentLogins = adminStore.getRecentLoginAttempts(20);
      const authLogs = adminStore.getAuthAuditLogs(50);

      const response: ApiResponse = {
        success: true,
        data: {
          activeSessions,
          recentLogins: recentLogins.map((l) => ({
            ...l,
            ip: maskIp(l.ip),
          })),
          authLogs: authLogs.map((l) => ({
            ...l,
            ip: maskIp(l.ip),
          })),
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}

export const userController = new UserController();
