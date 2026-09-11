import { Request, Response } from 'express';
import { logStore } from '../../logs/logStore.js';
import { auditLogger } from '../../logs/auditLogger.js';
import { LogFilterParams } from '../../logs/types.js';

export async function getLogs(req: Request, res: Response): Promise<void> {
  try {
    const userRole = (req as any).admin?.role || 'ADMIN';
    const params: LogFilterParams = {
      type: req.query.type as any,
      level: req.query.level as any,
      service: req.query.service as string,
      toolName: req.query.toolName as string,
      status: req.query.status as string,
      errorCode: req.query.errorCode as string,
      actorId: req.query.actorId as string,
      targetId: req.query.targetId as string,
      requestId: req.query.requestId as string,
      correlationId: req.query.correlationId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    };

    const result = logStore.queryLogs(params, userRole);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}

export async function getTrace(req: Request, res: Response): Promise<void> {
  try {
    const { correlationId } = req.params;
    if (!correlationId) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'correlationId é obrigatório.' } });
      return;
    }

    const trace = logStore.getTraceByCorrelationId(correlationId);
    if (!trace) {
      res.status(404).json({ success: false, error: { code: 'TRACE_NOT_FOUND', message: `Nenhum rastro encontrado para a correlação '${correlationId}'.` } });
      return;
    }

    res.json({ success: true, data: trace });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}

export async function exportLogsController(req: Request, res: Response): Promise<void> {
  try {
    const format = (req.query.format as string) === 'csv' ? 'csv' : 'json';
    const admin = (req as any).admin;
    const params: LogFilterParams = {
      type: req.query.type as any,
      level: req.query.level as any,
      service: req.query.service as string,
      toolName: req.query.toolName as string,
      status: req.query.status as string,
      errorCode: req.query.errorCode as string,
      actorId: req.query.actorId as string,
      targetId: req.query.targetId as string,
      requestId: req.query.requestId as string,
      correlationId: req.query.correlationId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      search: req.query.search as string,
    };

    const exported = logStore.exportLogs(params, format);

    // Registrar ação no audit log imutável
    auditLogger.logAction({
      actorType: 'ADMIN',
      actorId: admin?.id || 'system',
      actorName: admin?.name || admin?.email || 'Admin',
      action: 'LOG_EXPORT',
      resourceType: 'LOGS',
      result: 'SUCCESS',
      requestId: (req as any).requestId,
      correlationId: (req as any).correlationId,
      metadata: {
        format,
        filters: params,
        filename: exported.filename,
      },
    });

    res.setHeader('Content-Type', exported.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${exported.filename}"`);
    res.status(200).send(exported.content);
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}

export async function getToolMetricsController(_req: Request, res: Response): Promise<void> {
  try {
    const metrics = logStore.getToolMetrics();
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}

export async function getIncidentGroupsController(_req: Request, res: Response): Promise<void> {
  try {
    const incidents = logStore.getIncidentGroups();
    res.json({ success: true, data: incidents });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}

export async function getDashboardSummaryController(_req: Request, res: Response): Promise<void> {
  try {
    const summary = logStore.getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}

export async function getPlayerLogsController(req: Request, res: Response): Promise<void> {
  try {
    const { playerId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const logs = logStore.getLogsForPlayer(playerId, limit);
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}

export async function getAdminLogsController(req: Request, res: Response): Promise<void> {
  try {
    const { adminId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const logs = logStore.getLogsForAdmin(adminId, limit);
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
}
