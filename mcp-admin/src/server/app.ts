import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { setupSecurityMiddleware } from '../middleware/security.js';
import { correlationMiddleware } from '../middleware/correlationMiddleware.js';
import { requestLoggerMiddleware } from '../middleware/requestLogger.js';
import { mcpAuthMiddleware } from '../middleware/mcpAuth.js';
import { errorHandlerMiddleware } from '../middleware/errorHandler.js';
import { createMcpServer, setupMcpTransport } from '../mcp/server.js';
import mainRoutes from './routes.js';
import apiRoutes from '../api/routes/index.js';
import { bootstrapOwnerIfNeeded } from '../auth/bootstrap.js';

export async function createApp(): Promise<Express> {
  const app = express();

  // Middleware de correlação de IDs
  app.use(correlationMiddleware);

  // Cookie parser — necessário para ler admin_session antes do requireAuth
  app.use(cookieParser());

  // Configuração de segurança (Helmet, CORS, Rate Limit, Trust Proxy)
  setupSecurityMiddleware(app);

  // Logging de requisições e medição de métricas
  app.use(requestLoggerMiddleware);

  // Rotas da API e status
  app.use('/', mainRoutes);
  app.use('/api', apiRoutes);

  // Autenticação e transporte MCP (Bearer Token — distinto da sessão do Dashboard)
  const mcpServer = createMcpServer();
  app.use('/mcp', mcpAuthMiddleware);
  setupMcpTransport(app, mcpServer);

  // Servidor de arquivos estáticos do Dashboard React SPA
  const dashboardPath = path.join(process.cwd(), 'dist', 'dashboard');
  if (fs.existsSync(dashboardPath)) {
    app.use(express.static(dashboardPath));

    // Fallback SPA para rotas do Dashboard (exceto /api e /mcp)
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (
        req.path.startsWith('/api') ||
        req.path.startsWith('/mcp') ||
        req.path.startsWith('/health')
      ) {
        return next();
      }
      const acceptHeader = req.headers.accept || '';
      if (acceptHeader.includes('text/html') || !req.path.startsWith('/api')) {
        res.sendFile(path.join(dashboardPath, 'index.html'));
        return;
      }
      next();
    });
  } else {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path === '/' || !req.path.startsWith('/api')) {
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Farm MCP Control</title></head>
            <body style="background:#0f172a;color:#f8fafc;font-family:sans-serif;text-align:center;padding:50px;">
              <h1>🌾 Farm MCP Control Admin</h1>
              <p style="color:#94a3b8;">Dashboard em execução. Build disponível após <code>npm run build</code>.</p>
              <p><a href="/health" style="color:#38bdf8;">/health</a> | <a href="/api/status" style="color:#38bdf8;">/api/status</a></p>
            </body>
          </html>
        `);
        return;
      }
      next();
    });
  }

  // Handler global de erros
  app.use(errorHandlerMiddleware);

  // Bootstrap: criar OWNER via variáveis de ambiente, se ainda não existir
  await bootstrapOwnerIfNeeded();

  return app;
}
