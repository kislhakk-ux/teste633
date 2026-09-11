import { gameApiClient } from './http/gameApiClient.js';
import { ServiceStatus } from '../types/index.js';

export class JournalService {
  public async getStatus(): Promise<ServiceStatus> {
    try {
      const data = await gameApiClient.get('/api/multiplayer/newspaper');
      const offers = Array.isArray(data.offers) ? data.offers : [];
      return {
        status: 'online',
        message: `Jornal ativo com ${offers.length} anúncios sincronizados em tempo real`,
      };
    } catch (_err) {
      return {
        status: 'not_connected',
        message: 'Backend do jogo indisponível para consulta de jornal',
      };
    }
  }

  public async getJournalStatus() {
    const data = await gameApiClient.get('/api/multiplayer/newspaper');
    const offers = Array.isArray(data.offers) ? data.offers : [];
    const activeOffers = offers.filter((o: any) => !o.isSold);
    const soldOffers = offers.filter((o: any) => o.isSold);

    return {
      status: 'ONLINE',
      totalOffersInNewspaper: offers.length,
      activeOffersCount: activeOffers.length,
      soldOffersCount: soldOffers.length,
      npcOffersCount: offers.filter((o: any) => o.sellerFarmId?.startsWith('npc_')).length,
      realPlayerOffersCount: offers.filter((o: any) => !o.sellerFarmId?.startsWith('npc_')).length,
      recentOffers: activeOffers.slice(0, 10).map((o: any) => ({
        id: o.id,
        sellerFarmId: o.sellerFarmId,
        sellerFarmName: o.sellerFarmName,
        sellerLevel: o.sellerLevel,
        itemId: o.itemId,
        count: o.count,
        price: o.price,
        advertised: o.advertised,
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : undefined,
      })),
    };
  }

  public async getJournalListings(filters: { playerId?: string; itemId?: string; advertised?: boolean; limit?: number }) {
    const data = await gameApiClient.get('/api/multiplayer/newspaper');
    let offers = Array.isArray(data.offers) ? data.offers : [];

    if (filters.playerId) {
      offers = offers.filter((o: any) => o.sellerFarmId === filters.playerId);
    }
    if (filters.itemId) {
      offers = offers.filter((o: any) => o.itemId === filters.itemId);
    }
    if (filters.advertised !== undefined) {
      offers = offers.filter((o: any) => Boolean(o.advertised) === filters.advertised);
    }

    const limit = Math.min(Math.max(1, filters.limit || 50), 100);
    return {
      totalFound: offers.length,
      limit,
      listings: offers.slice(0, limit),
    };
  }

  public async diagnoseJournal() {
    const data = await gameApiClient.get('/api/multiplayer/newspaper');
    const offers = Array.isArray(data.offers) ? data.offers : [];
    const issues: Array<{ severity: 'WARNING' | 'ERROR'; issue: string; details: any }> = [];

    const now = Date.now();
    for (const offer of offers) {
      // Checa se o anúncio tem vendedor válido
      if (!offer.sellerFarmId || !offer.sellerFarmName) {
        issues.push({
          severity: 'ERROR',
          issue: 'LISTING_MISSING_SELLER: Anúncio no jornal sem ID ou nome do vendedor',
          details: { offerId: offer.id },
        });
      }

      // Checa quantidade ou preço zero ou negativo
      if (!offer.count || offer.count <= 0 || !offer.price || offer.price < 0) {
        issues.push({
          severity: 'ERROR',
          issue: 'INVALID_PRICE_OR_COUNT: Anúncio no jornal com preço ou quantidade inválida',
          details: { offerId: offer.id, count: offer.count, price: offer.price },
        });
      }

      // Checa anúncios muito antigos (> 24h)
      if (offer.createdAt && now - offer.createdAt > 24 * 60 * 60 * 1000 && !offer.isSold) {
        issues.push({
          severity: 'WARNING',
          issue: 'STALE_ADVERTISEMENT: Anúncio ativo há mais de 24 horas no jornal',
          details: { offerId: offer.id, ageHours: Math.round((now - offer.createdAt) / 3600000) },
        });
      }
    }

    return {
      journalHealth: issues.length === 0 ? 'HEALTHY' : 'ISSUES_DETECTED',
      totalListingsAnalyzed: offers.length,
      issuesCount: issues.length,
      issues,
      timestamp: new Date().toISOString(),
    };
  }
}

export const journalService = new JournalService();
