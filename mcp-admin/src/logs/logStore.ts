import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  ApplicationLog,
  McpToolLog,
  AuditLogEntry,
  SecurityLogEntry,
  UnifiedLogRecord,
  LogFilterParams,
  ToolMetrics,
  IncidentGroup,
  RequestTrace,
  TraceSpan,
  LogLevel,
} from './types.js';
import { sanitizeLogData, maskIpAddress } from './sanitizer.js';
import config from '../config/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'logs_store.json');

interface LogsStoreData {
  records: UnifiedLogRecord[];
}

class LogStore {
  private data: LogsStoreData = { records: [] };
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly maxMemoryRecords = 10000;

  constructor() {
    this.load();
    this.scheduleAutoCleanup();
  }

  private load(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data.records = Array.isArray(parsed.records) ? parsed.records : [];
      }
    } catch (err) {
      console.error('[LogStore] Erro ao carregar arquivo de logs, iniciando zerado:', err);
      this.data = { records: [] };
    }
  }

  private scheduleSave(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[LogStore] Erro ao persistir logs:', err);
    }
  }

  // --- ADICIONAR LOGS ---

  public addApplicationLog(
    entry: Omit<ApplicationLog, 'id' | 'timestamp' | 'environment'> & { timestamp?: string; environment?: string }
  ): ApplicationLog {
    const sanitizedDetails = entry.details ? sanitizeLogData(entry.details) : undefined;
    const fullLog: ApplicationLog = {
      id: `app_${randomUUID()}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      level: entry.level || 'INFO',
      service: entry.service || 'mcp-admin',
      message: entry.message,
      requestId: entry.requestId || 'req_unknown',
      correlationId: entry.correlationId || 'corr_unknown',
      duration: entry.duration,
      status: entry.status,
      errorCode: entry.errorCode,
      environment: entry.environment || (config.isProduction ? 'production' : 'development'),
      details: sanitizedDetails,
    };

    const record: UnifiedLogRecord = {
      id: fullLog.id,
      type: 'application',
      timestamp: fullLog.timestamp,
      level: fullLog.level,
      service: fullLog.service,
      message: fullLog.message,
      requestId: fullLog.requestId,
      correlationId: fullLog.correlationId,
      duration: fullLog.duration,
      status: fullLog.status,
      errorCode: fullLog.errorCode,
      data: fullLog,
    };

    this.pushRecord(record);
    return fullLog;
  }

  public addMcpToolLog(entry: Omit<McpToolLog, 'id' | 'timestamp'> & { timestamp?: string }): McpToolLog {
    const fullLog: McpToolLog = {
      id: `tool_${randomUUID()}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      toolName: entry.toolName,
      category: entry.category,
      riskLevel: entry.riskLevel,
      readOnly: entry.readOnly,
      principal: entry.principal,
      requestId: entry.requestId,
      correlationId: entry.correlationId,
      duration: entry.duration,
      success: entry.success,
      errorCode: entry.errorCode,
      targetType: entry.targetType,
      targetId: entry.targetId,
      resultCount: entry.resultCount,
      parameters: entry.parameters ? sanitizeLogData(entry.parameters) : undefined,
      metadata: entry.metadata ? sanitizeLogData(entry.metadata) : undefined,
    };

    const record: UnifiedLogRecord = {
      id: fullLog.id,
      type: 'mcp_tool',
      timestamp: fullLog.timestamp,
      level: fullLog.success ? 'INFO' : 'ERROR',
      service: 'mcp-server',
      message: `Tool ${fullLog.toolName} executada por ${fullLog.principal} - Status: ${fullLog.success ? 'SUCCESS' : 'FAILURE'}`,
      requestId: fullLog.requestId,
      correlationId: fullLog.correlationId,
      duration: fullLog.duration,
      status: fullLog.success ? 'SUCCESS' : 'FAILURE',
      errorCode: fullLog.errorCode,
      actorId: fullLog.principal,
      targetId: fullLog.targetId,
      toolName: fullLog.toolName,
      data: fullLog,
    };

    this.pushRecord(record);
    return fullLog;
  }

  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'> & { timestamp?: string }): AuditLogEntry {
    const fullLog: AuditLogEntry = {
      id: `audit_${randomUUID()}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      actorType: entry.actorType,
      actorId: entry.actorId,
      actorName: entry.actorName,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      result: entry.result,
      requestId: entry.requestId,
      correlationId: entry.correlationId,
      metadata: entry.metadata ? sanitizeLogData(entry.metadata) : undefined,
      parameters: entry.parameters ? sanitizeLogData(entry.parameters) : undefined,
    };

    const record: UnifiedLogRecord = {
      id: fullLog.id,
      type: 'audit',
      timestamp: fullLog.timestamp,
      level: fullLog.result === 'SUCCESS' ? 'INFO' : 'WARN',
      service: 'mcp-admin-audit',
      message: `[AUDIT] Action=${fullLog.action} Actor=${fullLog.actorName} (${fullLog.actorId}) Result=${fullLog.result}`,
      requestId: fullLog.requestId,
      correlationId: fullLog.correlationId,
      status: fullLog.result,
      actorId: fullLog.actorId,
      targetId: fullLog.resourceId,
      data: fullLog,
    };

    this.pushRecord(record);
    return fullLog;
  }

  public addSecurityLog(entry: Omit<SecurityLogEntry, 'id' | 'timestamp'> & { timestamp?: string }): SecurityLogEntry {
    const fullLog: SecurityLogEntry = {
      id: `sec_${randomUUID()}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      event: entry.event,
      actorId: entry.actorId,
      ip: entry.ip,
      userAgent: entry.userAgent,
      result: entry.result,
      requestId: entry.requestId,
      correlationId: entry.correlationId,
      metadata: entry.metadata ? sanitizeLogData(entry.metadata) : undefined,
    };

    const record: UnifiedLogRecord = {
      id: fullLog.id,
      type: 'security',
      timestamp: fullLog.timestamp,
      level: fullLog.result === 'SUCCESS' ? 'INFO' : 'WARN',
      service: 'mcp-security',
      message: `[SECURITY] Event=${fullLog.event} IP=${maskIpAddress(fullLog.ip)} Result=${fullLog.result}`,
      requestId: fullLog.requestId,
      correlationId: fullLog.correlationId,
      status: fullLog.result,
      actorId: fullLog.actorId,
      data: fullLog,
    };

    this.pushRecord(record);
    return fullLog;
  }

  private pushRecord(record: UnifiedLogRecord): void {
    this.data.records.unshift(record);
    if (this.data.records.length > this.maxMemoryRecords) {
      this.data.records.pop();
    }
    this.scheduleSave();
  }

  // --- CONSULTAS E FILTROS ---

  public queryLogs(params: LogFilterParams, userRole: string = 'ADMIN'): {
    data: UnifiedLogRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    let filtered = [...this.data.records];

    if (params.type && params.type !== 'all') {
      filtered = filtered.filter((r) => r.type === params.type);
    }
    if (params.level) {
      filtered = filtered.filter((r) => r.level === params.level);
    }
    if (params.service) {
      filtered = filtered.filter((r) => r.service.toLowerCase().includes(params.service!.toLowerCase()));
    }
    if (params.toolName) {
      filtered = filtered.filter((r) => r.toolName?.toLowerCase() === params.toolName!.toLowerCase());
    }
    if (params.status) {
      filtered = filtered.filter((r) => r.status?.toLowerCase() === params.status!.toLowerCase());
    }
    if (params.errorCode) {
      filtered = filtered.filter((r) => r.errorCode?.toLowerCase() === params.errorCode!.toLowerCase());
    }
    if (params.actorId) {
      filtered = filtered.filter((r) => r.actorId?.toLowerCase() === params.actorId!.toLowerCase());
    }
    if (params.targetId) {
      filtered = filtered.filter((r) => r.targetId?.toLowerCase() === params.targetId!.toLowerCase());
    }
    if (params.requestId) {
      filtered = filtered.filter((r) => r.requestId.includes(params.requestId!));
    }
    if (params.correlationId) {
      filtered = filtered.filter((r) => r.correlationId.includes(params.correlationId!));
    }
    if (params.startDate) {
      filtered = filtered.filter((r) => new Date(r.timestamp) >= new Date(params.startDate!));
    }
    if (params.endDate) {
      filtered = filtered.filter((r) => new Date(r.timestamp) <= new Date(params.endDate!));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.message.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q) ||
          r.correlationId.toLowerCase().includes(q) ||
          (r.toolName && r.toolName.toLowerCase().includes(q)) ||
          (r.errorCode && r.errorCode.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    // Sanitizar e mascarar se o papel do usuário tiver restrições
    const sanitizedPaginated = paginated.map((rec) => {
      const copy = JSON.parse(JSON.stringify(rec));
      if (copy.type === 'security' && userRole !== 'OWNER' && userRole !== 'ADMIN') {
        if (copy.data && copy.data.ip) {
          copy.data.ip = maskIpAddress(copy.data.ip);
        }
      }
      return copy;
    });

    return {
      data: sanitizedPaginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // --- TRACE SYSTEM ---

  public getTraceByCorrelationId(correlationId: string): RequestTrace | null {
    const matches = [...this.data.records]
      .reverse()
      .filter((r) => r.correlationId === correlationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (matches.length === 0) return null;

    const startTime = matches[0].timestamp;
    const endTime = matches[matches.length - 1].timestamp;
    const totalDurationMs = new Date(endTime).getTime() - new Date(startTime).getTime();

    const spans: TraceSpan[] = matches.map((r, index) => {
      let spanType: TraceSpan['type'] = 'REQUEST';
      if (r.type === 'mcp_tool') spanType = 'MCP_TOOL';
      else if (r.type === 'audit') spanType = 'AUDIT';
      else if (r.type === 'security') spanType = 'SECURITY';
      else if (r.service.includes('game')) spanType = 'GAME_API';
      else spanType = 'SERVICE';

      return {
        id: `span_${index + 1}_${r.id}`,
        type: spanType,
        name: r.toolName ? `Tool: ${r.toolName}` : r.message,
        timestamp: r.timestamp,
        durationMs: r.duration || 0,
        status: r.status === 'FAILURE' || r.level === 'ERROR' || r.level === 'CRITICAL' ? 'FAILURE' : 'SUCCESS',
        details: sanitizeLogData(r.data),
      };
    });

    return {
      correlationId,
      totalDurationMs,
      startTime,
      endTime,
      spans,
    };
  }

  // --- TOOL METRICS & HISTORY ---

  public getToolMetrics(): ToolMetrics[] {
    const toolLogs = this.data.records.filter((r) => r.type === 'mcp_tool') as UnifiedLogRecord[];
    const map = new Map<string, McpToolLog[]>();

    for (const record of toolLogs) {
      const toolLog = record.data as McpToolLog;
      if (!map.has(toolLog.toolName)) {
        map.set(toolLog.toolName, []);
      }
      map.get(toolLog.toolName)!.push(toolLog);
    }

    const metrics: ToolMetrics[] = [];

    map.forEach((logs, toolName) => {
      const calls = logs.length;
      const successLogs = logs.filter((l) => l.success);
      const errorLogs = logs.filter((l) => !l.success);
      const success = successLogs.length;
      const errors = errorLogs.length;
      const successRate = calls > 0 ? Number(((success / calls) * 100).toFixed(1)) : 100;

      const durations = logs.map((l) => l.duration).sort((a, b) => a - b);
      const sumDuration = durations.reduce((acc, d) => acc + d, 0);
      const averageDuration = Math.round(sumDuration / (calls || 1));
      const minDuration = durations[0] || 0;
      const maxDuration = durations[durations.length - 1] || 0;

      const getPercentile = (p: number) => {
        if (durations.length === 0) return 0;
        const idx = Math.floor((p / 100) * durations.length);
        return durations[Math.min(idx, durations.length - 1)];
      };

      const first = logs[0]; // mais recente devido ao sorting do log store

      metrics.push({
        toolName,
        category: first.category || 'GENERAL',
        riskLevel: first.riskLevel || 'LOW',
        calls,
        success,
        errors,
        successRate,
        averageDuration,
        minDuration,
        maxDuration,
        p50: getPercentile(50),
        p95: getPercentile(95),
        p99: getPercentile(99),
        lastExecutedAt: first.timestamp || null,
      });
    });

    return metrics.sort((a, b) => b.calls - a.calls);
  }

  // --- FINGERPRINTS & INCIDENT GROUPING ---

  public getIncidentGroups(): IncidentGroup[] {
    const errorRecords = this.data.records.filter(
      (r) => r.level === 'ERROR' || r.level === 'CRITICAL' || r.status === 'FAILURE' || r.errorCode
    );

    const groupsMap = new Map<string, IncidentGroup>();

    for (const rec of errorRecords) {
      const errCode = rec.errorCode || 'INTERNAL_ERROR';
      const service = rec.service || 'mcp-admin';
      const fp = `${service}:${errCode}`;

      if (!groupsMap.has(fp)) {
        groupsMap.set(fp, {
          fingerprint: fp,
          errorCode: errCode,
          service,
          count: 0,
          firstSeenAt: rec.timestamp,
          lastSeenAt: rec.timestamp,
          sampleMessage: rec.message,
          affectedTools: rec.toolName ? [rec.toolName] : [],
        });
      }

      const g = groupsMap.get(fp)!;
      g.count += 1;
      if (new Date(rec.timestamp) < new Date(g.firstSeenAt)) g.firstSeenAt = rec.timestamp;
      if (new Date(rec.timestamp) > new Date(g.lastSeenAt)) g.lastSeenAt = rec.timestamp;
      if (rec.toolName && !g.affectedTools?.includes(rec.toolName)) {
        g.affectedTools?.push(rec.toolName);
      }
    }

    return Array.from(groupsMap.values()).sort((a, b) => b.count - a.count);
  }

  // --- PLAYER & ADMIN TRACES ---

  public getLogsForPlayer(playerId: string, limit = 50): UnifiedLogRecord[] {
    return this.data.records
      .filter((r) => r.targetId === playerId || r.message.includes(playerId))
      .slice(0, limit);
  }

  public getLogsForAdmin(adminId: string, limit = 50): UnifiedLogRecord[] {
    return this.data.records
      .filter((r) => r.actorId === adminId)
      .slice(0, limit);
  }

  // --- DASHBOARD AGGREGATED METRICS ---

  public getDashboardSummary() {
    const now = Date.now();
    const last24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    const recentRecords = this.data.records.filter((r) => r.timestamp >= last24h);
    const errors24h = recentRecords.filter((r) => r.level === 'ERROR' || r.level === 'CRITICAL' || r.status === 'FAILURE').length;
    
    const mcpLogs24h = recentRecords.filter((r) => r.type === 'mcp_tool');
    const mcpTotal = mcpLogs24h.length;
    const mcpSuccess = mcpLogs24h.filter((r) => r.status === 'SUCCESS').length;
    const mcpSuccessRate = mcpTotal > 0 ? Number(((mcpSuccess / mcpTotal) * 100).toFixed(1)) : 100;

    const durations = mcpLogs24h.map((r) => r.duration || 0);
    const avgLatency = mcpTotal > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / mcpTotal) : 0;

    const failedLogins24h = recentRecords.filter((r) => r.type === 'security' && (r.data as SecurityLogEntry).event === 'LOGIN_FAILED').length;
    const adminActions24h = recentRecords.filter((r) => r.type === 'audit').length;

    // Erros por hora nas últimas 24 horas
    const hourlyErrors: Record<string, number> = {};
    const hourlyExecutions: Record<string, number> = {};

    for (let i = 23; i >= 0; i--) {
      const hourStr = new Date(now - i * 60 * 60 * 1000).toISOString().slice(11, 13) + ':00';
      hourlyErrors[hourStr] = 0;
      hourlyExecutions[hourStr] = 0;
    }

    recentRecords.forEach((r) => {
      const hourStr = new Date(r.timestamp).toISOString().slice(11, 13) + ':00';
      if (hourlyExecutions[hourStr] !== undefined) {
        hourlyExecutions[hourStr] += 1;
      }
      if (hourlyErrors[hourStr] !== undefined && (r.level === 'ERROR' || r.status === 'FAILURE')) {
        hourlyErrors[hourStr] += 1;
      }
    });

    return {
      errors24h,
      mcpTotal24h: mcpTotal,
      mcpSuccessRate,
      avgLatency,
      failedLogins24h,
      adminActions24h,
      hourlyErrors: Object.entries(hourlyErrors).map(([hour, count]) => ({ hour, count })),
      hourlyExecutions: Object.entries(hourlyExecutions).map(([hour, count]) => ({ hour, count })),
    };
  }

  // --- EXPORTAÇÃO SANITIZADA ---

  public exportLogs(params: LogFilterParams, format: 'json' | 'csv' = 'json'): { content: string; filename: string; contentType: string } {
    const query = this.queryLogs({ ...params, limit: 1000, page: 1 });
    const records = query.data;

    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');

    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'Type', 'Level', 'Service', 'Message', 'RequestID', 'CorrelationID', 'DurationMS', 'Status', 'ErrorCode', 'ActorID', 'TargetID'];
      const rows = records.map((r) => [
        r.id,
        r.timestamp,
        r.type,
        r.level,
        r.service,
        `"${(r.message || '').replace(/"/g, '""')}"`,
        r.requestId,
        r.correlationId,
        r.duration || 0,
        r.status || '',
        r.errorCode || '',
        r.actorId || '',
        r.targetId || '',
      ]);

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
      return {
        content: csvContent,
        filename: `mcp_logs_export_${timestampStr}.csv`,
        contentType: 'text/csv; charset=utf-8',
      };
    } else {
      const jsonContent = JSON.stringify(records, null, 2);
      return {
        content: jsonContent,
        filename: `mcp_logs_export_${timestampStr}.json`,
        contentType: 'application/json; charset=utf-8',
      };
    }
  }

  // --- CLEANUP JOB AUTOMÁTICO ---

  private scheduleAutoCleanup(): void {
    // Executar limpeza 1 minuto após subir e depois diariamente
    const t1 = setTimeout(() => this.cleanupOldLogs(), 60000);
    t1.unref();
    const t2 = setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000);
    t2.unref();
  }

  public cleanupOldLogs(): { appLogsRemoved: number; auditLogsRemoved: number } {
    const now = Date.now();
    const appRetentionMs = (config.logging?.retentionDays || 30) * 24 * 60 * 60 * 1000;
    const auditRetentionMs = (config.logging?.auditRetentionDays || 180) * 24 * 60 * 60 * 1000;

    const cutoffApp = new Date(now - appRetentionMs).toISOString();
    const cutoffAudit = new Date(now - auditRetentionMs).toISOString();

    const initialCount = this.data.records.length;

    this.data.records = this.data.records.filter((r) => {
      if (r.type === 'audit') {
        return r.timestamp >= cutoffAudit;
      }
      return r.timestamp >= cutoffApp;
    });

    const removed = initialCount - this.data.records.length;
    if (removed > 0) {
      this.scheduleSave();
      console.log(`[LogStore] Limpeza de logs executada: ${removed} registros expirados removidos.`);
    }
    return { appLogsRemoved: removed, auditLogsRemoved: 0 };
  }
}

export const logStore = new LogStore();
