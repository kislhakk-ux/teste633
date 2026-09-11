import { gameApiClient } from './http/gameApiClient.js';
import { ServiceStatus } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';

export class MarketService {
  public async getStatus(): Promise<ServiceStatus> {
    try {
      const state = await gameApiClient.get('/api/multiplayer/state');
      const offers = Array.isArray(state.offers) ? state.offers : [];
      return {
        status: 'online',
        message: `Mercado ativo com ${offers.filter((o: any) => !o.isSold).length} ofertas ativas para compra`,
      };
    } catch (_err) {
      return {
        status: 'not_connected',
        message: 'Backend do jogo indisponível para consulta de mercado',
      };
    }
  }

  public async getMarketStatus() {
    const state = await gameApiClient.get('/api/multiplayer/state');
    const offers = Array.isArray(state.offers) ? state.offers : [];
    const activeOffers = offers.filter((o: any) => !o.isSold);
    const soldOffers = offers.filter((o: any) => o.isSold);

    const itemStats: Record<string, { totalItems: number; totalVolume: number }> = {};
    for (const offer of activeOffers) {
      if (!itemStats[offer.itemId]) {
        itemStats[offer.itemId] = { totalItems: 0, totalVolume: 0 };
      }
      itemStats[offer.itemId].totalItems += 1;
      itemStats[offer.itemId].totalVolume += offer.count;
    }

    return {
      status: 'ONLINE',
      totalListings: offers.length,
      activeListings: activeOffers.length,
      soldListings: soldOffers.length,
      topItemsForSale: Object.entries(itemStats)
        .map(([itemId, stats]) => ({ itemId, listingsCount: stats.totalItems, volume: stats.totalVolume }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 10),
    };
  }

  public async getMarketListings(filters: { sellerId?: string; buyerId?: string; itemId?: string; isSold?: boolean; limit?: number }) {
    const state = await gameApiClient.get('/api/multiplayer/state');
    let offers = Array.isArray(state.offers) ? state.offers : [];

    if (filters.sellerId) {
      offers = offers.filter((o: any) => o.sellerFarmId === filters.sellerId);
    }
    if (filters.buyerId) {
      offers = offers.filter((o: any) => o.buyerFarmId === filters.buyerId);
    }
    if (filters.itemId) {
      offers = offers.filter((o: any) => o.itemId === filters.itemId);
    }
    if (filters.isSold !== undefined) {
      offers = offers.filter((o: any) => Boolean(o.isSold) === filters.isSold);
    }

    const limit = Math.min(Math.max(1, filters.limit || 50), 100);
    return {
      totalFound: offers.length,
      limit,
      listings: offers.slice(0, limit),
    };
  }

  public async getMarketListing(listingId: string) {
    const state = await gameApiClient.get('/api/multiplayer/state');
    const offers = Array.isArray(state.offers) ? state.offers : [];
    const offer = offers.find((o: any) => o.id === listingId);

    if (!offer) {
      throw new NotFoundError(`LISTING_NOT_FOUND: Anúncio da banca ID '${listingId}' não encontrado`);
    }

    return offer;
  }

  public async diagnoseMarket() {
    const state = await gameApiClient.get('/api/multiplayer/state');
    const offers = Array.isArray(state.offers) ? state.offers : [];
    const issues: Array<{ severity: 'WARNING' | 'ERROR'; issue: string; details: any }> = [];

    const boxIdSellerMap = new Map<string, string>();

    for (const offer of offers) {
      // Checa duplicidade de caixas da banca para a mesma fazenda
      const key = `${offer.sellerFarmId}_box_${offer.boxId}`;
      if (boxIdSellerMap.has(key) && !offer.isSold) {
        issues.push({
          severity: 'ERROR',
          issue: 'DUPLICATE_BOX_OFFER: Duas ofertas ativas para a mesma caixa de banca da fazenda',
          details: { sellerFarmId: offer.sellerFarmId, boxId: offer.boxId, offerId: offer.id },
        });
      } else {
        boxIdSellerMap.set(key, offer.id);
      }

      // Checa compras sem comprador identificado
      if (offer.isSold && !offer.buyerFarmId && !offer.buyerFarmName) {
        issues.push({
          severity: 'WARNING',
          issue: 'SOLD_OFFER_MISSING_BUYER: Oferta marcada como sold sem comprador registrado',
          details: { offerId: offer.id, sellerFarmId: offer.sellerFarmId },
        });
      }
    }

    return {
      marketHealth: issues.length === 0 ? 'HEALTHY' : 'ISSUES_DETECTED',
      totalListingsAnalyzed: offers.length,
      issuesCount: issues.length,
      issues,
      timestamp: new Date().toISOString(),
    };
  }
}

export const marketService = new MarketService();
