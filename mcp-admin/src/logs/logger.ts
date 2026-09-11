import { LogLevel } from './types.js';
import { sanitizeLogData } from './sanitizer.js';
import { logStore } from './logStore.js';
import { getCurrentContext, getCorrelationId, getRequestId } from '../utils/correlation.js';
import config from '../config/index.js';

export function sanitize(data: any): any {
  return sanitizeLogData(data);
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  CRITICAL: 5,
};

function getMinLevelPriority(): number {
  const configured = (config.logging?.level || 'info').toUpperCase() as LogLevel;
  return LEVEL_PRIORITY[configured] || 2;
}

class Logger {
  private serviceName = 'mcp-admin';

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= getMinLevelPriority();
  }

  private writeLog(
    level: LogLevel,
    message: string,
    details?: Record<string, any>,
    error?: any,
    reqId?: string
  ): void {
    if (!this.shouldLog(level)) return;

    const ctx = getCurrentContext();
    const requestId = reqId || ctx?.requestId || getRequestId();
    const correlationId = ctx?.correlationId || getCorrelationId();

    const cleanDetails = details ? sanitizeLogData(details) : undefined;
    const cleanError = error
      ? error instanceof Error
        ? { message: error.message, stack: config.isProduction ? undefined : error.stack }
        : sanitizeLogData(error)
      : undefined;

    // Persistir no LogStore
    logStore.addApplicationLog({
      level,
      service: this.serviceName,
      message,
      requestId,
      correlationId,
      details: { ...cleanDetails, error: cleanError },
    });

    const consoleStr = JSON.stringify(
      sanitizeLogData({
        timestamp: new Date().toISOString(),
        service: this.serviceName,
        level,
        message,
        requestId,
        correlationId,
        details: cleanDetails,
        error: cleanError,
      })
    );

    switch (level) {
      case 'DEBUG':
        if (!config.isProduction) console.debug(consoleStr);
        break;
      case 'INFO':
        console.info(consoleStr);
        break;
      case 'WARN':
        console.warn(consoleStr);
        break;
      case 'ERROR':
      case 'CRITICAL':
        console.error(consoleStr);
        break;
    }
  }

  public debug(message: string, details?: Record<string, any>, requestId?: string): void {
    this.writeLog('DEBUG', message, details, undefined, requestId);
  }

  public info(message: string, details?: Record<string, any>, requestId?: string): void {
    this.writeLog('INFO', message, details, undefined, requestId);
  }

  public warn(message: string, details?: Record<string, any>, requestId?: string): void {
    this.writeLog('WARN', message, details, undefined, requestId);
  }

  public error(message: string, error?: any, details?: Record<string, any>, requestId?: string): void {
    this.writeLog('ERROR', message, details, error, requestId);
  }

  public critical(message: string, error?: any, details?: Record<string, any>, requestId?: string): void {
    this.writeLog('CRITICAL', message, details, error, requestId);
  }
}

export const logger = new Logger();
