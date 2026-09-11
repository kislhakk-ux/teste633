import { gameApiClient } from './http/gameApiClient.js';
import { ServiceStatus } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';

export class PlayerService {
  public async getStatus(): Promise<ServiceStatus> {
    try {
      const state = await gameApiClient.get('/api/multiplayer/state');
      return {
        status: 'online',
        message: `${state.farms?.length || 0} fazendas conectadas e registradas na memória`,
      };
    } catch (_err) {
      return {
        status: 'not_connected',
        message: 'Backend do jogo indisponível para consulta de fazendas/jogadores',
      };
    }
  }

  public async getOnlinePlayers(limit: number = 50) {
    const state = await gameApiClient.get('/api/multiplayer/state');
    const farms = Array.isArray(state.farms) ? state.farms : [];
    
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const onlineFarms = farms.filter((f: any) => f.isOnline);

    return {
      onlineCount: state.onlineCount || onlineFarms.length,
      totalFarms: farms.length,
      limit: safeLimit,
      players: farms.slice(0, safeLimit).map((f: any) => ({
        farmId: f.farmId,
        farmName: f.farmName,
        level: f.level,
        avatar: f.avatar,
        isOnline: Boolean(f.isOnline),
        likes: f.likes || 0,
        offersCount: f.offersCount || 0,
        lastSeen: f.lastSeen ? new Date(f.lastSeen).toISOString() : undefined,
      })),
    };
  }

  public async searchPlayers(query: string, limit: number = 20) {
    const state = await gameApiClient.get('/api/multiplayer/state');
    const farms = Array.isArray(state.farms) ? state.farms : [];
    const q = (query || '').toLowerCase().trim();

    const matched = farms.filter((f: any) => 
      (f.farmId && f.farmId.toLowerCase().includes(q)) ||
      (f.farmName && f.farmName.toLowerCase().includes(q))
    );

    const safeLimit = Math.min(Math.max(1, limit), 50);
    return {
      query,
      matchedCount: matched.length,
      limit: safeLimit,
      players: matched.slice(0, safeLimit).map((f: any) => ({
        farmId: f.farmId,
        farmName: f.farmName,
        level: f.level,
        avatar: f.avatar,
        isOnline: Boolean(f.isOnline),
        likes: f.likes || 0,
      })),
    };
  }

  public async getPlayer(farmId: string) {
    try {
      const farm = await gameApiClient.get(`/api/multiplayer/farm/${farmId}`);
      return {
        farmId: farm.farmId,
        farmName: farm.farmName,
        level: farm.level,
        avatar: farm.avatar,
        likes: farm.likes || 0,
        entitiesCount: Array.isArray(farm.entities) ? farm.entities.length : 0,
        roadsideBoxesCount: Array.isArray(farm.roadsideBoxes) ? farm.roadsideBoxes.length : 0,
        roadsideBoxes: farm.roadsideBoxes || [],
      };
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError(`PLAYER_NOT_FOUND: Fazenda ID '${farmId}' não encontrada no backend do jogo.`);
      }
      throw err;
    }
  }

  public async diagnosePlayer(farmId: string) {
    const farm = await this.getPlayer(farmId);
    const issues: Array<{ severity: 'WARNING' | 'ERROR'; issue: string; details: any }> = [];

    if (!farm.level || farm.level < 1) {
      issues.push({
        severity: 'ERROR',
        issue: 'INVALID_PLAYER_LEVEL: Nível do jogador menor que 1',
        details: { farmId, level: farm.level },
      });
    }

    if (farm.level > 100 && !farm.farmName.toLowerCase().includes('wongamer') && !farm.farmName.toLowerCase().includes('kislhakk')) {
      issues.push({
        severity: 'WARNING',
        issue: 'UNUSUALLY_HIGH_LEVEL: Nível do jogador extremamente elevado sem flag VIP',
        details: { farmId, level: farm.level },
      });
    }

    const boxes = farm.roadsideBoxes || [];
    for (const box of boxes) {
      if (box.count < 0 || box.price < 0) {
        issues.push({
          severity: 'ERROR',
          issue: 'INVALID_BOX_VALUES: Caixa da banca com quantidade ou preço negativo',
          details: { boxId: box.id, count: box.count, price: box.price },
        });
      }
    }

    return {
      farmId,
      farmName: farm.farmName,
      healthStatus: issues.length === 0 ? 'HEALTHY' : 'ISSUES_DETECTED',
      issuesCount: issues.length,
      issues,
      timestamp: new Date().toISOString(),
    };
  }

  public async diagnoseInventory(farmId: string) {
    const farm = await this.getPlayer(farmId);
    const boxes = farm.roadsideBoxes || [];
    const invalidItems: any[] = [];

    for (const box of boxes) {
      if (box.itemId && (box.count <= 0 || box.price <= 0)) {
        invalidItems.push(box);
      }
    }

    return {
      farmId,
      inventoryHealth: invalidItems.length === 0 ? 'HEALTHY' : 'ANOMALIES_FOUND',
      totalRoadsideSlots: boxes.length,
      anomalousSlotsCount: invalidItems.length,
      anomalousSlots: invalidItems,
      timestamp: new Date().toISOString(),
    };
  }
}

export const playerService = new PlayerService();
