import { Response, NextFunction } from 'express';
import { NotFoundError } from '../utils/errors.js';
import { RequestWithId } from './requestLogger.js';

export function notFoundHandlerMiddleware(req: RequestWithId, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}
