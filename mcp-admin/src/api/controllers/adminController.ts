import { Request, Response, NextFunction } from 'express';
import config from '../../config/index.js';
import { gameService } from '../../services/gameService.js';
import { playerService } from '../../services/playerService.js';
import { journalService } from '../../services/journalService.js';
import { marketService } from '../../services/marketService.js';
import { mcpRegistry } from '../../mcp/registry.js';
import { auditLogger } from '../../logs/auditLogger.js';
import { metricsManager } from '../../metrics/metricsManager.js';
import { ApiResponse } from '../../types/index.js';
import { AuthorizationError, ValidationError } from '../../utils/errors.js';

export class AdminController {
  public getDashboardOverview = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameApiStatus = await gameService.checkHealth();
      const journalStatus = await journalService.getStatus();
      const marketStatus = await marketService.getStatus();
      const tools = mcpRegistry.getAllTools();
      const metrics = metricsManager.getMetrics();
      const recentAudit = auditLogger.getRecentLogs(10);

      const data = {
        service: {
          name: config.mcp.name,
          version: config.mcp.version,
          environment: config.env,
          uptime: Number(process.uptime().toFixed(2)),
        },
        services: {
          http: { status: 'online', message: `Porta ${config.port}` },
          mcp: { status: 'online', message: `${tools.length} ferramentas` },
          gameApi: gameApiStatus,
          database: { status: 'not_connected', message: 'Sem escritas no BD' },
          journal: journalStatus,
          market: marketStatus,
        },
        metrics,
        recentActivity: recentAudit,
        toolsCount: tools.length,
      };

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse = { success: true, data };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public getPlayers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.query as string) || '';
      const limit = parseInt((req.query.limit as string) || '20', 10);

      const result = query
        ? await playerService.searchPlayers(query, limit)
        : await playerService.getOnlinePlayers(limit);

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse = { success: true, data: result };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public getPlayerDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const player = await playerService.getPlayer(id);
      const diagnosis = await playerService.diagnosePlayer(id);

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse = {
        success: true,
        data: {
          ...player,
          diagnosis,
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public getJournalData = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const journalStatus = await journalService.getJournalStatus();
      const diagnosis = await journalService.diagnoseJournal();

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse = {
        success: true,
        data: {
          status: journalStatus,
          diagnosis,
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public getMarketData = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const marketStatus = await marketService.getMarketStatus();
      const diagnosis = await marketService.diagnoseMarket();

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse = {
        success: true,
        data: {
          status: marketStatus,
          diagnosis,
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = parseInt((req.query.limit as string) || '50', 10);
      const logs = auditLogger.getRecentLogs(limit);

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse = { success: true, data: logs };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public executeTool = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { toolName, params } = req.body;

      if (!toolName) {
        throw new ValidationError('O campo toolName é obrigatório');
      }

      const tool = mcpRegistry.getTool(toolName);
      if (!tool) {
        throw new ValidationError(`Ferramenta '${toolName}' não encontrada`);
      }

      // Trava de Segurança: Somente executa tools LOW e READ-ONLY pelo Dashboard
      if (tool.riskLevel !== 'LOW' || !tool.readOnly) {
        throw new AuthorizationError(`A ferramenta '${toolName}' possui nível de risco '${tool.riskLevel}' e não pode ser executada pelo Dashboard.`);
      }

      const result = await mcpRegistry.executeTool(toolName, params || {}, 'dashboard_admin');

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const response: ApiResponse = {
        success: true,
        data: {
          toolName,
          result,
          timestamp: new Date().toISOString(),
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}

export const adminController = new AdminController();
