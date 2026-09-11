export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface ErrorModel {
  code: string;
  message: string;
  service: string;
  operation: string;
  retryable: boolean;
  requestId?: string;
  correlationId?: string;
  details?: Record<string, any>;
}

export interface ApplicationLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  requestId: string;
  correlationId: string;
  duration?: number;
  status?: string;
  errorCode?: string;
  environment: string;
  details?: Record<string, any>;
}

import { McpToolRiskLevel } from '../types/index.js';

export interface McpToolLog {
  id: string;
  timestamp: string;
  toolName: string;
  category: string;
  riskLevel: McpToolRiskLevel;
  readOnly: boolean;
  principal: string; // Ex: 'admin_123' ou 'AI_CLIENT'
  requestId: string;
  correlationId: string;
  duration: number;
  success: boolean;
  errorCode?: string;
  targetType?: string; // Ex: 'player' | 'journal' | 'market' | 'server'
  targetId?: string; // Ex: 'player_123'
  resultCount?: number;
  parameters?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorType: 'ADMIN' | 'SYSTEM' | 'AI_CLIENT';
  actorId: string;
  actorName: string;
  action: string; // Ex: 'ADMIN_LOGIN', 'TOOL_EXECUTED', 'PASSWORD_CHANGED', etc.
  resourceType?: string;
  resourceId?: string;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED';
  requestId: string;
  correlationId: string;
  metadata?: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  event:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'RATE_LIMIT_HIT'
    | 'INVALID_TOKEN'
    | 'PERMISSION_DENIED'
    | 'SESSION_REVOKED'
    | 'SESSION_EXPIRED'
    | 'BRUTE_FORCE_BLOCK'
    | 'INVALID_ORIGIN'
    | 'INVALID_REQUEST';
  actorId?: string;
  ip: string;
  userAgent?: string;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  requestId: string;
  correlationId: string;
  metadata?: Record<string, any>;
}

export type LogCategoryType = 'application' | 'mcp_tool' | 'audit' | 'security';

export interface UnifiedLogRecord {
  id: string;
  type: LogCategoryType;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  requestId: string;
  correlationId: string;
  duration?: number;
  status?: string;
  errorCode?: string;
  actorId?: string;
  targetId?: string;
  toolName?: string;
  data: ApplicationLog | McpToolLog | AuditLogEntry | SecurityLogEntry;
}

export interface LogFilterParams {
  type?: LogCategoryType | 'all';
  level?: LogLevel;
  service?: string;
  toolName?: string;
  status?: string;
  errorCode?: string;
  actorId?: string;
  targetId?: string;
  requestId?: string;
  correlationId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ToolMetrics {
  toolName: string;
  category: string;
  riskLevel: McpToolRiskLevel;
  calls: number;
  success: number;
  errors: number;
  successRate: number; // Percentual 0 - 100
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  p50?: number;
  p95?: number;
  p99?: number;
  lastExecutedAt: string | null;
}

export interface IncidentGroup {
  fingerprint: string;
  errorCode: string;
  service: string;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
  sampleMessage: string;
  affectedTools?: string[];
}

export interface TraceSpan {
  id: string;
  type: 'REQUEST' | 'MCP_TOOL' | 'SERVICE' | 'GAME_API' | 'AUDIT' | 'SECURITY';
  name: string;
  timestamp: string;
  durationMs?: number;
  status: 'SUCCESS' | 'FAILURE' | 'ERROR';
  details?: Record<string, any>;
}

export interface RequestTrace {
  correlationId: string;
  totalDurationMs: number;
  startTime: string;
  endTime: string;
  spans: TraceSpan[];
}
