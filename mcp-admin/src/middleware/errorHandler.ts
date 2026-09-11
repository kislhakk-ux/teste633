import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../logs/logger.js';
import config from '../config/index.js';
import { ApiResponse } from '../types/index.js';
import { RequestWithId } from './requestLogger.js';

export function errorHandlerMiddleware(err: any, req: RequestWithId, res: Response, _next: NextFunction): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const errorCode = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.isOperational || config.isDevelopment ? err.message : 'An unexpected error occurred';

  logger.error(`[ErrorHandler] ${errorCode}: ${err.message}`, err, {
    statusCode,
    url: req.originalUrl,
    method: req.method,
    requestId: req.requestId,
  });

  const response: ApiResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(req.requestId ? { requestId: req.requestId } : {}),
      ...(config.isDevelopment && !err.isOperational ? { stack: err.stack } : {}),
    },
  };

  res.status(statusCode).json(response);
}
