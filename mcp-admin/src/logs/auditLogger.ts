import { AuditLogEntry } from './types.js';
import { logStore } from './logStore.js';
import { getCorrelationId, getRequestId } from '../utils/correlation.js';

class AuditLogger {
  public logAction(entry: Partial<AuditLogEntry> & { action: string; result: 'SUCCESS' | 'FAILURE' | 'DENIED' }): AuditLogEntry {
    return logStore.addAuditLog({
      actorType: entry.actorType || 'ADMIN',
      actorId: entry.actorId || (entry as any).adminId || 'system',
      actorName: entry.actorName || (entry as any).adminId || 'System Admin',
      action: entry.action,
      resourceType: entry.resourceType || (entry as any).toolName ? 'TOOL' : 'RESOURCE',
      resourceId: entry.resourceId || (entry as any).parameters?.playerId || 'system',
      result: entry.result,
      requestId: entry.requestId || getRequestId(),
      correlationId: entry.correlationId || getCorrelationId(),
      metadata: entry.metadata,
      parameters: entry.parameters,
    });
  }

  public getRecentLogs(limit: number = 50): AuditLogEntry[] {
    const query = logStore.queryLogs({ type: 'audit', limit, page: 1 });
    return query.data.map((r) => r.data as AuditLogEntry);
  }
}

export const auditLogger = new AuditLogger();
