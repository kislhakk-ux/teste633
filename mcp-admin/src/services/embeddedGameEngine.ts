/**
 * Embedded Game Engine State
 * Provedor autônomo de dados e simulador de fazenda / multiplayer.
 * Garante que o MCP Admin funcione 100% de forma independente,
 * mesmo quando a Game API externa não estiver configurada ou rodando em serviço separado.
 */

export interface EmbeddedOffer {
  id: string;
  sellerFarmId: string;
  sellerFarmName: string;
  sellerAvatar: string;
  sellerLevel: number;
  boxId: number;
  itemId: string;
  count: number;
  price: number;
  advertised: boolean;
  isSold: boolean;
  buyerFarmId?: string;
  buyerFarmName?: string;
  soldAt?: number;
  createdAt: number;
}

export interface EmbeddedFarm {
  farmId: string;
  farmName: string;
  level: number;
  avatar: string;
  isOnline: boolean;
  lastSeen: number;
  likes: number;
  offersCount: number;
  coins?: number;
  diamonds?: number;
  roadsideBoxes: Array<{
    id: number;
    itemId: string;
    count: number;
    price: number;
    advertised: boolean;
    isSold: boolean;
  }>;
}

class EmbeddedGameEngine {
  private farms = new Map<string, EmbeddedFarm>();
  private offers: EmbeddedOffer[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const starterOffers = [
      { sellerFarmId: 'npc_greg', sellerFarmName: 'Fazenda do Greg', sellerAvatar: '🧔‍♂️', sellerLevel: 50, boxId: 1, itemId: 'wood_plank', count: 2, price: 320, advertised: true, isSold: false },
      { sellerFarmId: 'npc_greg', sellerFarmName: 'Fazenda do Greg', sellerAvatar: '🧔‍♂️', sellerLevel: 50, boxId: 2, itemId: 'nail', count: 2, price: 320, advertised: true, isSold: false },
      { sellerFarmId: 'npc_ze', sellerFarmName: 'Recanto do Tio Zé', sellerAvatar: '👨‍🌾', sellerLevel: 18, boxId: 1, itemId: 'bread', count: 4, price: 84, advertised: true, isSold: false },
      { sellerFarmId: 'npc_julia', sellerFarmName: 'Horta da Júlia', sellerAvatar: '👩‍🌾', sellerLevel: 12, boxId: 1, itemId: 'corn', count: 10, price: 70, advertised: true, isSold: false },
      { sellerFarmId: 'npc_pedro', sellerFarmName: 'Rancho São Pedro', sellerAvatar: '🤠', sellerLevel: 22, boxId: 1, itemId: 'cheese', count: 2, price: 240, advertised: true, isSold: false },
      { sellerFarmId: 'npc_rosa', sellerFarmName: 'Pomar da Dona Rosa', sellerAvatar: '👵', sellerLevel: 15, boxId: 1, itemId: 'apple', count: 6, price: 180, advertised: true, isSold: false },
      { sellerFarmId: 'npc_lucas', sellerFarmName: 'Granja do Lucas', sellerAvatar: '🧑‍🌾', sellerLevel: 9, boxId: 1, itemId: 'egg', count: 6, price: 108, advertised: true, isSold: false },
      { sellerFarmId: 'npc_marcos', sellerFarmName: 'Engenho Boa Vista', sellerAvatar: '👨‍🍳', sellerLevel: 25, boxId: 1, itemId: 'sugar', count: 3, price: 150, advertised: true, isSold: false },
    ];

    starterOffers.forEach((o, idx) => {
      this.offers.push({
        ...o,
        id: `offer_${o.sellerFarmId}_${o.boxId}_${idx}`,
        createdAt: Date.now() - idx * 60000,
      });

      if (!this.farms.has(o.sellerFarmId)) {
        this.farms.set(o.sellerFarmId, {
          farmId: o.sellerFarmId,
          farmName: o.sellerFarmName,
          level: o.sellerLevel,
          avatar: o.sellerAvatar,
          isOnline: true,
          lastSeen: Date.now(),
          likes: 24,
          offersCount: 2,
          coins: 15000,
          diamonds: 50,
          roadsideBoxes: [
            { id: 1, itemId: o.itemId, count: o.count, price: o.price, advertised: o.advertised, isSold: o.isSold },
            { id: 2, itemId: 'wheat', count: 10, price: 36, advertised: true, isSold: false },
          ],
        });
      }
    });

    // Player padrão de teste
    this.farms.set('player_001', {
      farmId: 'player_001',
      farmName: 'Fazenda da Colina',
      level: 28,
      avatar: '👩‍🌾',
      isOnline: true,
      lastSeen: Date.now(),
      likes: 18,
      offersCount: 3,
      coins: 8450,
      diamonds: 32,
      roadsideBoxes: [
        { id: 1, itemId: 'carrot', count: 10, price: 72, advertised: true, isSold: false },
        { id: 2, itemId: 'milk', count: 4, price: 128, advertised: true, isSold: false },
        { id: 3, itemId: 'butter', count: 2, price: 180, advertised: true, isSold: false },
      ],
    });
  }

  public getHealth() {
    return {
      status: 'ok',
      onlineCount: Array.from(this.farms.values()).filter((f) => f.isOnline).length,
      totalFarms: this.farms.size,
      activeOffers: this.offers.filter((o) => !o.isSold).length,
      time: Date.now(),
    };
  }

  public getState() {
    return {
      onlineCount: Array.from(this.farms.values()).filter((f) => f.isOnline).length,
      totalFarms: this.farms.size,
      farms: Array.from(this.farms.values()),
      offers: this.offers,
    };
  }

  public getNewspaper() {
    return {
      success: true,
      offers: this.offers.filter((o) => o.advertised && !o.isSold),
      onlineCount: Array.from(this.farms.values()).filter((f) => f.isOnline).length,
    };
  }

  public getFarm(farmId: string): EmbeddedFarm | null {
    return this.farms.get(farmId) || null;
  }

  public searchFarms(query: string): EmbeddedFarm[] {
    const q = (query || '').toLowerCase().trim();
    return Array.from(this.farms.values()).filter(
      (f) => f.farmId.toLowerCase().includes(q) || f.farmName.toLowerCase().includes(q)
    );
  }
}

export const embeddedGameEngine = new EmbeddedGameEngine();
