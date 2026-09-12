import config from '../../config/index.js';
import { logger } from '../../logs/logger.js';
import { NotFoundError } from '../../utils/errors.js';
import { getCorrelationId, getRequestId } from '../../utils/correlation.js';
import { embeddedGameEngine } from '../embeddedGameEngine.js';

export class GameApiClient {
  private get baseUrl(): string {
    return (config.gameApiUrl || 'http://127.0.0.1:3000').replace(/\/+$/, '');
  }

  private handleEmbeddedFallback<T = any>(path: string): T {
    const cleanPath = path.split('?')[0];

    if (cleanPath === '/api/health') {
      return embeddedGameEngine.getHealth() as unknown as T;
    }

    if (cleanPath === '/api/multiplayer/state') {
      return embeddedGameEngine.getState() as unknown as T;
    }

    if (cleanPath === '/api/multiplayer/newspaper') {
      return embeddedGameEngine.getNewspaper() as unknown as T;
    }

    if (cleanPath.startsWith('/api/multiplayer/farm/')) {
      const farmId = cleanPath.replace('/api/multiplayer/farm/', '');
      const farm = embeddedGameEngine.getFarm(farmId);
      if (!farm) {
        throw new NotFoundError(`PLAYER_NOT_FOUND: Fazenda não encontrada: ${farmId}`);
      }
      return farm as unknown as T;
    }

    // Default fallback
    return {
      status: 'ok',
      mode: 'embedded',
      message: 'Embedded Game Engine Fallback',
    } as unknown as T;
  }

  public async get<T = any>(path: string, requestId?: string): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    const timeoutMs = parseInt(process.env.MCP_REQUEST_TIMEOUT_MS || '3000', 10);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const corrId = getCorrelationId();
    const reqId = requestId || getRequestId();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'FarmMCPAdminClient/1.0',
          'X-Correlation-ID': corrId,
          'X-Request-ID': reqId,
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.status === 404) {
        // Tenta buscar no embedded engine antes de disparar erro 404 definitivo
        try {
          return this.handleEmbeddedFallback<T>(path);
        } catch {
          throw new NotFoundError(`PLAYER_NOT_FOUND: Recurso ou jogador não encontrado: ${path}`);
        }
      }

      if (response.ok) {
        return (await response.json()) as T;
      }

      // Se retornou status diferente de 200, usa o fallback embedded
      return this.handleEmbeddedFallback<T>(path);
    } catch (err: any) {
      clearTimeout(timer);

      if (err instanceof NotFoundError) {
        throw err;
      }

      logger.info(`[GameApiClient] Fallback autônomo acionado para ${path} (Game API externa: ${err.message || 'unreachable'})`);
      return this.handleEmbeddedFallback<T>(path);
    }
  }
}

export const gameApiClient = new GameApiClient();
