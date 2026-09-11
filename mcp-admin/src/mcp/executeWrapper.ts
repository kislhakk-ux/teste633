import { logStore } from '../logs/logStore.js';
import { auditLogger } from '../logs/auditLogger.js';
import { getCorrelationId, getRequestId } from '../utils/correlation.js';
import { sanitizeLogData } from '../logs/sanitizer.js';
import { ErrorModel } from '../logs/types.js';

import { McpToolRiskLevel } from '../types/index.js';

export interface ExecuteToolOptions {
  toolName: string;
  category: string;
  riskLevel: McpToolRiskLevel;
  readOnly: boolean;
  principal?: string;
  requestId?: string;
  correlationId?: string;
  handler: (params: any) => Promise<any>;
  params: any;
}

export function formatErrorModel(err: any, toolName: string, reqId: string, corrId: string): ErrorModel {
  let code = 'INTERNAL_ERROR';
  let message = 'Ocorreu um erro interno durante a execução da ferramenta.';
  let service = 'mcp-server';
  let retryable = false;

  if (err && typeof err === 'object') {
    if (err.code) code = String(err.code);
    else if (err.message?.includes('GAME_API_UNAVAILABLE')) code = 'GAME_API_UNAVAILABLE';
    else if (err.message?.includes('PLAYER_NOT_FOUND')) code = 'PLAYER_NOT_FOUND';
    else if (err.message?.includes('TIMEOUT')) code = 'GAME_API_TIMEOUT';
    else if (err.name === 'TimeoutError') code = 'GAME_API_TIMEOUT';

    if (err.message) message = err.message;
    if (err.service) service = err.service;
    if (typeof err.retryable === 'boolean') retryable = err.retryable;
    else if (code.includes('TIMEOUT') || code.includes('UNAVAILABLE')) retryable = true;
  } else if (typeof err === 'string') {
    message = err;
  }

  return {
    code,
    message,
    service,
    operation: toolName,
    retryable,
    requestId: reqId,
    correlationId: corrId,
  };
}

import config from '../config/index.js';

export async function executeToolWithLogging(options: ExecuteToolOptions): Promise<any> {
  const { toolName, category, riskLevel, readOnly, principal = 'AI_CLIENT', params = {} } = options;
  const requestId = options.requestId || getRequestId();
  const correlationId = options.correlationId || getCorrelationId();

  const startTime = Date.now();
  const sanitizedParams = sanitizeLogData(params);

  let success = false;
  let result: any = null;
  let errorModel: ErrorModel | null = null;
  let targetId: string | undefined = params.playerId || params.id || params.farmId;

  try {
    // 1. Verifica ADMIN_WRITE_MODE para ferramentas de escrita
    if (!readOnly && !config.flags.adminWriteMode) {
      const err = new Error('ADMIN_WRITE_MODE_DISABLED: Operações de escrita estão desativadas neste ambiente (ADMIN_WRITE_MODE=false)');
      (err as any).code = 'ADMIN_WRITE_MODE_DISABLED';
      throw err;
    }

    // 2. Verifica ENABLE_DIAMOND_TOOLS
    const isDiamondTool = category.toUpperCase().includes('DIAMOND') || toolName.toLowerCase().includes('diamond');
    if (isDiamondTool && !config.flags.enableDiamondTools) {
      const err = new Error('FEATURE_DISABLED: Ferramentas de diamantes estão desativadas (ENABLE_DIAMOND_TOOLS=false)');
      (err as any).code = 'FEATURE_DISABLED';
      throw err;
    }

    // 3. Verifica ENABLE_BAN_TOOLS
    const isBanTool = category.toUpperCase().includes('BAN') || toolName.toLowerCase().includes('ban');
    if (isBanTool && !config.flags.enableBanTools) {
      const err = new Error('FEATURE_DISABLED: Ferramentas de banimento estão desativadas (ENABLE_BAN_TOOLS=false)');
      (err as any).code = 'FEATURE_DISABLED';
      throw err;
    }

    result = await options.handler(params);
    success = true;
    return result;
  } catch (err: any) {
    success = false;
    errorModel = formatErrorModel(err, toolName, requestId, correlationId);
    throw err;
  } finally {
    const duration = Date.now() - startTime;
    const resultCount = Array.isArray(result) ? result.length : result && typeof result === 'object' ? Object.keys(result).length : undefined;

    // 1. Registra no McpToolLog (e atualiza métricas de ferramenta)
    logStore.addMcpToolLog({
      toolName,
      category,
      riskLevel,
      readOnly,
      principal,
      requestId,
      correlationId,
      duration,
      success,
      errorCode: errorModel?.code,
      targetType: targetId ? 'player' : category.toLowerCase(),
      targetId,
      resultCount,
      parameters: sanitizedParams,
      metadata: {
        resultSummary: success ? 'SUCCESS' : errorModel?.code,
      },
    });

    // 2. Registra no Audit Log para ações administrativas/tools
    auditLogger.logAction({
      actorType: principal.startsWith('admin') ? 'ADMIN' : 'AI_CLIENT',
      actorId: principal,
      actorName: principal,
      action: 'TOOL_EXECUTED',
      resourceType: 'TOOL',
      resourceId: toolName,
      result: success ? 'SUCCESS' : 'FAILURE',
      requestId,
      correlationId,
      parameters: sanitizedParams,
      metadata: {
        durationMs: duration,
        errorCode: errorModel?.code,
        targetId,
      },
    });
  }
}
