import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

export interface RequestContext {
  requestId: string;
  correlationId: string;
  adminId?: string;
  startTime: number;
}

export const requestContextStore = new AsyncLocalStorage<RequestContext>();

export function generateCorrelationId(): string {
  return `corr_${randomUUID()}`;
}

export function generateRequestId(): string {
  return `req_${randomUUID()}`;
}

export function getCurrentContext(): RequestContext | undefined {
  return requestContextStore.getStore();
}

export function getCorrelationId(): string {
  return requestContextStore.getStore()?.correlationId || generateCorrelationId();
}

export function getRequestId(): string {
  return requestContextStore.getStore()?.requestId || generateRequestId();
}
