import { Request, Response, NextFunction } from 'express';
import { adminStore } from '../../auth/store.js';
import { verifyPassword, hashPassword, validatePasswordPolicy } from '../../auth/password.js';
import { getPermissionsForRole } from '../../auth/permissions.js';
import { COOKIE_NAME, maskIp } from '../../middleware/authMiddleware.js';
import { logStore } from '../../logs/logStore.js';
import { auditLogger } from '../../logs/auditLogger.js';
import type { PublicAdminUser } from '../../auth/types.js';
import type { ApiResponse } from '../../types/index.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// TTL do cookie em milissegundos
function getSessionTtlMs(): number {
  const hours = parseInt(process.env.ADMIN_SESSION_TTL_HOURS ?? '8', 10);
  return hours * 60 * 60 * 1000;
}

function setCookieForSession(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'lax',
    maxAge: getSessionTtlMs(),
    path: '/',
  });
}

function toPublicUser(admin: ReturnType<typeof adminStore.findAdminById>): PublicAdminUser | null {
  if (!admin) return null;
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

export class AuthController {
  /**
   * POST /api/auth/login
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const ip = maskIp(req.ip || '');
      const ua = (req.headers['user-agent'] || '').substring(0, 200);

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Email e senha são obrigatórios.' },
        });
        return;
      }

      // Verificar bloqueio por brute-force
      const block = adminStore.isBlocked(req.ip || '', email);
      if (block.blocked) {
        const retryMin = block.retryAfter
          ? Math.ceil((block.retryAfter.getTime() - Date.now()) / 60000)
          : 15;
        res.status(429).json({
          success: false,
          error: {
            code: 'TOO_MANY_ATTEMPTS',
            message: `Muitas tentativas. Tente novamente em ${retryMin} minuto(s).`,
          },
        });
        return;
      }

      // Mensagem genérica para evitar enumeração de usuários
      const GENERIC_ERROR = 'Credenciais inválidas.';

      const admin = adminStore.findAdminByEmail(email);
      if (!admin || !admin.active) {
        adminStore.recordLoginAttempt(req.ip || '', email, false);
        logStore.addSecurityLog({
          event: 'LOGIN_FAILED',
          actorId: email,
          ip: req.ip || '',
          userAgent: ua,
          result: 'FAILURE',
          requestId: (req as any).requestId,
          correlationId: (req as any).correlationId,
          metadata: { details: admin && !admin.active ? 'Conta desativada' : 'Email não encontrado' },
        });
        res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: GENERIC_ERROR } });
        return;
      }

      const passwordMatch = await verifyPassword(password, admin.passwordHash);
      if (!passwordMatch) {
        adminStore.recordLoginAttempt(req.ip || '', email, false);
        logStore.addSecurityLog({
          event: 'LOGIN_FAILED',
          actorId: admin.id,
          ip: req.ip || '',
          userAgent: ua,
          result: 'FAILURE',
          requestId: (req as any).requestId,
          correlationId: (req as any).correlationId,
          metadata: { details: 'Senha incorreta' },
        });
        res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: GENERIC_ERROR } });
        return;
      }

      // Login bem-sucedido
      adminStore.recordLoginAttempt(req.ip || '', email, true);
      adminStore.recordLogin(admin.id);

      const session = adminStore.createSession(admin.id, ip, ua);
      setCookieForSession(res, session.token);

      logStore.addSecurityLog({
        event: 'LOGIN_SUCCESS',
        actorId: admin.id,
        ip: req.ip || '',
        userAgent: ua,
        result: 'SUCCESS',
        requestId: (req as any).requestId,
        correlationId: (req as any).correlationId,
      });

      auditLogger.logAction({
        actorType: 'ADMIN',
        actorId: admin.id,
        actorName: admin.name,
        action: 'ADMIN_LOGIN',
        result: 'SUCCESS',
        requestId: (req as any).requestId,
        correlationId: (req as any).correlationId,
      });

      const response: ApiResponse = {
        success: true,
        data: toPublicUser(admin),
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/auth/logout
   */
  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      const ip = maskIp(req.ip || '');
      const ua = (req.headers['user-agent'] || '').substring(0, 200);

      if (token) {
        const session = adminStore.findSessionByToken(token);
        adminStore.revokeSession(token);
        adminStore.addAuthAuditLog({
          timestamp: new Date().toISOString(),
          event: 'LOGOUT',
          adminId: session?.adminId ?? null,
          adminEmail: req.admin?.email ?? null,
          ip,
          userAgent: ua,
        });
      }

      res.clearCookie(COOKIE_NAME, { path: '/' });
      const response: ApiResponse = { success: true, data: { message: 'Sessão encerrada.' } };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/auth/me
   */
  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // admin é injetado pelo requireAuth
      const pub = toPublicUser(req.admin!);
      const response: ApiResponse = { success: true, data: pub };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/auth/change-password
   */
  public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admin = req.admin!;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Preencha todos os campos obrigatórios.' },
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Nova senha e confirmação não coincidem.' },
        });
        return;
      }

      const valid = await verifyPassword(currentPassword, admin.passwordHash);
      if (!valid) {
        res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Senha atual incorreta.' },
        });
        return;
      }

      const policy = validatePasswordPolicy(newPassword);
      if (!policy.valid) {
        res.status(400).json({
          success: false,
          error: { code: 'WEAK_PASSWORD', message: policy.errors.join(' ') },
        });
        return;
      }

      const newHash = await hashPassword(newPassword);
      adminStore.updateAdmin(admin.id, { passwordHash: newHash });

      adminStore.addAuthAuditLog({
        timestamp: new Date().toISOString(),
        event: 'PASSWORD_CHANGED',
        adminId: admin.id,
        adminEmail: admin.email,
        ip: maskIp(req.ip || ''),
        userAgent: (req.headers['user-agent'] || '').substring(0, 100),
      });

      const response: ApiResponse = { success: true, data: { message: 'Senha alterada com sucesso.' } };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
