import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import config from '../config/index.js';
import { logger } from '../logs/logger.js';

export function mcpAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const tokenFromEnv = config.mcp.accessToken || process.env.MCP_ACCESS_TOKEN;

  // Se nenhum token estiver configurado e estivermos em dev/test, permitimos acesso mas emitimos log
  if (!tokenFromEnv) {
    if (config.isDevelopment || config.isTest) {
      logger.warn('[MCP Auth] MCP_ACCESS_TOKEN não definido. Permitindo acesso sem autenticação apenas em modo DEV/TEST.');
      return next();
    }
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'MCP_ACCESS_TOKEN não está configurado no servidor.',
      },
    });
    return;
  }

  // Extrai token do header Authorization: Bearer <token> ou query parameter ?token=<token>
  const authHeader = req.headers.authorization;
  let tokenProvided: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    tokenProvided = authHeader.substring(7).trim();
  } else if (req.query.token && typeof req.query.token === 'string') {
    tokenProvided = req.query.token;
  }

  let isValidToken = false;
  if (tokenProvided && typeof tokenProvided === 'string') {
    const bufProvided = Buffer.from(tokenProvided);
    const bufExpected = Buffer.from(tokenFromEnv);
    if (bufProvided.length === bufExpected.length) {
      isValidToken = crypto.timingSafeEqual(bufProvided, bufExpected);
    }
  }

  if (!isValidToken) {
    logger.warn('[MCP Auth] Tentativa de acesso não autorizada ao endpoint /mcp', {
      ip: req.ip,
      path: req.originalUrl,
    });
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token de acesso ao MCP inválido ou ausente.',
      },
    });
    return;
  }

  next();
}
