import { Request, Response, NextFunction } from 'express';
import { requestContextStore, generateCorrelationId, generateRequestId, RequestContext } from '../utils/correlation.js';

export function correlationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
  const requestId = (req.headers['x-request-id'] as string) || generateRequestId();

  // Anexar aos headers da resposta
  res.setHeader('X-Correlation-ID', correlationId);
  res.setHeader('X-Request-ID', requestId);

  (req as any).correlationId = correlationId;
  (req as any).requestId = requestId;

  const context: RequestContext = {
    requestId,
    correlationId,
    startTime: Date.now(),
  };

  requestContextStore.run(context, () => {
    next();
  });
}
