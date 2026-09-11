import { Request, Response, NextFunction } from 'express';
import config from '../../config/index.js';
import { gameService } from '../../services/gameService.js';
import { journalService } from '../../services/journalService.js';
import { marketService } from '../../services/marketService.js';
import { mcpRegistry } from '../../mcp/registry.js';
import { metricsManager } from '../../metrics/metricsManager.js';
import { ApiResponse, HealthStatusData, SystemStatusData, ServiceStatus } from '../../types/index.js';

export class StatusController {
  public getHealth = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const data: HealthStatusData = {
      status: 'online',
      service: 'mcp-admin',
      version: config.mcp.version,
      environment: config.env,
      uptime: Number(process.uptime().toFixed(2)),
      timestamp: new Date().toISOString(),
    };

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const response: ApiResponse<HealthStatusData> = { success: true, data };
    res.json(response);
  };

  public getReadiness = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const gameApiStatus = await gameService.checkHealth();
    const isReady = gameApiStatus.status === 'online';

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const response: ApiResponse = {
      success: isReady,
      data: {
        readiness: isReady ? 'READY' : 'DEGRADED',
        http: 'online',
        mcp: 'online',
        gameApi: gameApiStatus.status,
      },
    };

    res.status(isReady ? 200 : 503).json(response);
  };

  public getStatus = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameApiStatus = await gameService.checkHealth();
      const journalStatus = await journalService.getStatus();
      const marketStatus = await marketService.getStatus();
      const tools = mcpRegistry.getAllTools();
      const metrics = metricsManager.getMetrics();

      const databaseStatus: ServiceStatus = config.databaseUrl
        ? { status: 'not_connected', message: 'Detecção de URL configurada; sem escritas ativas' }
        : { status: 'not_connected', message: 'DATABASE_URL não configurada' };

      const mcpStatus: ServiceStatus = {
        status: 'online',
        message: `MCP Server operacional com ${tools.length} ferramentas registradas`,
      };

      const httpStatus: ServiceStatus = {
        status: 'online',
        message: `HTTP Server ativo na porta ${config.port}`,
      };

      const data: SystemStatusData = {
        service: {
          name: config.mcp.name,
          version: config.mcp.version,
          environment: config.env,
          uptime: Number(process.uptime().toFixed(2)),
        },
        services: {
          http: httpStatus,
          mcp: mcpStatus,
          gameApi: gameApiStatus,
          database: databaseStatus,
          journal: journalStatus,
          market: marketStatus,
        },
        metrics,
        mcpToolsCount: tools.length,
      };

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse<SystemStatusData> = { success: true, data };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public getMcpTools = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const tools = mcpRegistry.getAllTools().map((t) => ({
      name: t.name,
      description: t.description,
      category: t.category,
      riskLevel: t.riskLevel,
      readOnly: t.readOnly,
      enabled: t.enabled,
      available: true,
      requiresGameApi: t.requiresGameApi,
      requiresDatabase: t.requiresDatabase,
      executionsCount: t.executionsCount,
      errorsCount: t.errorsCount,
      lastExecutedAt: t.lastExecutedAt,
    }));

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const response: ApiResponse = {
      success: true,
      data: tools,
    };
    res.json(response);
  };
}

export const statusController = new StatusController();
