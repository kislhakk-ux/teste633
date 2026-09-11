import { gameApiClient } from './http/gameApiClient.js';
import { ServiceStatus } from '../types/index.js';

export class GameService {
  public async checkHealth(): Promise<ServiceStatus> {
    try {
      const data = await gameApiClient.get('/api/health');
      return {
        status: 'online',
        message: `Backend do jogo ativo. Jogadores online: ${data.onlineCount || 0}, Ofertas ativas: ${data.activeOffers || 0}`,
      };
    } catch (err: any) {
      return {
        status: 'not_connected',
        message: err.message || 'Falha ao conectar com a API do jogo',
      };
    }
  }

  public async getGameInfo() {
    const health = await gameApiClient.get('/api/health');
    return {
      gameName: 'Hay Day Farm Simulator',
      status: health.status === 'ok' ? 'ONLINE' : 'DEGRADED',
      onlinePlayersCount: health.onlineCount || 0,
      totalFarmsRegistered: health.totalFarms || 0,
      activeMarketOffersCount: health.activeOffers || 0,
      serverTime: health.time ? new Date(health.time).toISOString() : new Date().toISOString(),
    };
  }
}

export const gameService = new GameService();
