import config from '../../config/index.js';
import { logger } from '../../logs/logger.js';
import { IntegrationError, NotFoundError } from '../../utils/errors.js';
import { getCorrelationId, getRequestId } from '../../utils/correlation.js';

export class GameApiClient {
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold = 5;
  private readonly resetTimeoutMs = 15000;

  private get baseUrl(): string {
    return config.gameApiUrl.replace(/\/+$/, '');
  }

  private isCircuitOpen(): boolean {
    if (this.failureCount >= this.failureThreshold) {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        logger.info('[CircuitBreaker] Timeout expirou. Mudando para HALF_OPEN.');
        return false;
      }
      return true;
    }
    return false;
  }

  private recordSuccess(): void {
    this.failureCount = 0;
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }

  public async get<T = any>(path: string, requestId?: string): Promise<T> {
    if (this.isCircuitOpen()) {
      logger.warn(`[CircuitBreaker OPEN] Requisição para ${path} bloqueada temporariamente devido a falhas consecutivas no backend do jogo.`);
      throw new IntegrationError('GAME_API_UNAVAILABLE: O backend do jogo está temporariamente indisponível (Circuit Breaker Aberto).');
    }

    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    const timeoutMs = parseInt(process.env.MCP_REQUEST_TIMEOUT_MS || '10000', 10);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const corrId = getCorrelationId();
    const reqId = requestId || getRequestId();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'FarmMCPAdminClient/1.0',
          'X-Correlation-ID': corrId,
          'X-Request-ID': reqId,
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.status === 404) {
        this.recordSuccess();
        throw new NotFoundError(`PLAYER_NOT_FOUND: Recurso ou jogador não encontrado: ${path}`);
      }

      if (!response.ok) {
        this.recordFailure();
        throw new IntegrationError(`GAME_API_ERROR: HTTP ${response.status} em ${path}`);
      }

      this.recordSuccess();
      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timer);

      if (err.name === 'AbortError') {
        this.recordFailure();
        throw new IntegrationError(`INTEGRATION_TIMEOUT: Timeout de ${timeoutMs}ms excedido em ${url}`);
      }

      if (err instanceof NotFoundError) {
        throw err;
      }

      this.recordFailure();
      if (err instanceof IntegrationError) {
        throw err;
      }

      throw new IntegrationError(`GAME_API_UNAVAILABLE: Falha de conexão com o jogo (${url}): ${err.message}`);
    }
  }
}

export const gameApiClient = new GameApiClient();
