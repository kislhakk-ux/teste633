import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../logs/logger.js';
import { metricsManager } from '../metrics/metricsManager.js';

export interface RequestWithId extends Request {
  requestId?: string;
  startTime?: number;
}

export function requestLoggerMiddleware(req: RequestWithId, res: Response, next: NextFunction): void {
  req.requestId = (req.headers['x-request-id'] as string) || randomUUID();
  req.startTime = Date.now();

  res.setHeader('X-Request-ID', req.requestId);

  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || Date.now());
    metricsManager.recordRequest(res.statusCode, duration);

    logger.info(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      requestId: req.requestId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}
