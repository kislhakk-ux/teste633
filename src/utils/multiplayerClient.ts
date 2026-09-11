import {
  ClientWsMessage,
  MultiplayerOffer,
  OnlineFarm,
  ServerWsMessage,
  SoldNotification,
} from '../types/multiplayer';
import { FarmEntity, ItemId, RoadsideBox } from '../types/game';

type EventCallback<T = any> = (data: T) => void;

class MultiplayerClient {
  private socket: WebSocket | null = null;
  private farmId: string = '';
  private farmName: string = 'Minha Fazenda';
  private level: number = 1;
  private avatar: string = '👨‍🌾';
  private reconnectTimer: any = null;
  private heartbeatTimer: any = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  public isConnected: boolean = false;
  public onlineCount: number = 1;
  public onlineFarms: OnlineFarm[] = [];
  public currentOffers: MultiplayerOffer[] = [];

  constructor() {
    this.farmId = this.getOrCreateFarmId();
  }

  public getOrCreateFarmId(): string {
    const key = 'hayday_player_farm_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = 'farm_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  }

  public setFarmId(id: string) {
    if (id && id !== this.farmId) {
      console.log(`[MultiplayerClient] Updating farmId from '${this.farmId}' to '${id}'`);
      this.farmId = id;
      localStorage.setItem('hayday_player_farm_id', id);
    }
  }

  public getFarmId(): string {
    return this.farmId;
  }

  public on(event: string, cb: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(cb);
    return () => {
      this.listeners.get(event)?.delete(cb);
    };
  }

  private emit(event: string, data?: any) {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  public getApiUrl(endpoint: string): string {
    const isCapacitor = typeof window !== 'undefined' && (
      window.location.protocol.startsWith('capacitor') || 
      (window.location.protocol.startsWith('http') && 
       (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
       !window.location.port)
    );

    if (isCapacitor) {
      const prodServer = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PRODUCTION_SERVER_URL) ||
                         (typeof process !== 'undefined' && process.env?.PRODUCTION_SERVER_URL) ||
                         'teste633.onrender.com';
      const cleanProdServer = prodServer.replace(/^wss?:\/\//, '').replace(/\/ws$/, '').replace(/^https?:\/\//, '');
      return `https://${cleanProdServer}${endpoint}`;
    }
    return endpoint;
  }

  // Fetch all current Newspaper offers via REST for instant synchronization
  public async fetchNewspaper(): Promise<MultiplayerOffer[]> {
    const url = this.getApiUrl('/api/multiplayer/newspaper');
    console.log(`[Multiplayer/Newspaper] Fetching offers for current farmId=${this.farmId} from URL=${url}`);
    try {
      const res = await fetch(url);
      console.log(`[Multiplayer/Newspaper] Response HTTP status=${res.status}`);
      if (!res.ok) {
        console.warn(`[Multiplayer/Newspaper] Failed to fetch: HTTP ${res.status}`);
        return this.currentOffers;
      }
      const data = await res.json();
      const offers: MultiplayerOffer[] = Array.isArray(data.offers) ? data.offers : [];
      this.currentOffers = offers;
      if (data.farms) this.onlineFarms = data.farms;
      if (data.onlineCount) this.onlineCount = data.onlineCount;
      console.log(`[Multiplayer/Newspaper] Received ${offers.length} total offers (IDs: ${offers.map((o: any) => o.id).slice(0, 5).join(', ')}...)`);
      this.emit('init', {
        type: 'init',
        onlineCount: this.onlineCount,
        farms: this.onlineFarms,
        offers: this.currentOffers,
      });
      return offers;
    } catch (e: any) {
      console.error('[Multiplayer/Newspaper] Error fetching offers:', e);
      return this.currentOffers;
    }
  }

  public connect(
    farmName: string,
    level: number,
    avatar: string,
    entities?: FarmEntity[],
    roadsideBoxes?: RoadsideBox[]
  ) {
    this.farmName = farmName;
    this.level = level;
    this.avatar = avatar;

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      this.sendRegister(entities, roadsideBoxes);
      return;
    }

    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const host = window.location.host;
      
      // Detect if we are running inside the Capacitor mobile app (uses capacitor:// protocol or localhost without dev server port)
      const isCapacitor = window.location.protocol.startsWith('capacitor') || 
                          (window.location.protocol.startsWith('http') && 
                           (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
                           !window.location.port);
      
      let wsUrl = '';
      if (isCapacitor) {
        // Target production server (can be overridden by environment variable or falls back to a hosted Render instance)
        const prodServer = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PRODUCTION_SERVER_URL) ||
                           (typeof process !== 'undefined' && process.env?.PRODUCTION_SERVER_URL) ||
                           'teste633.onrender.com';
        wsUrl = prodServer.startsWith('ws') ? prodServer : `wss://${prodServer}/ws`;
      } else {
        wsUrl = `${wsProtocol}//${host}/ws`;
      }

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.emit('connection_change', true);
        this.sendRegister(entities, roadsideBoxes);

        // Heartbeat
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => {
          if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
            this.send({ type: 'heartbeat', farmId: this.farmId });
          }
        }, 20000);
      };

      this.socket.onmessage = (event) => {
        try {
          const msg: ServerWsMessage = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.emit('connection_change', false);
        clearInterval(this.heartbeatTimer);
        this.scheduleReconnect(entities, roadsideBoxes);
      };

      this.socket.onerror = (err) => {
        console.warn('WebSocket connection error:', err);
        // Socket onclose will handle reconnection
      };
    } catch (e) {
      console.warn('Could not establish WebSocket connection, will retry:', e);
      this.scheduleReconnect(entities, roadsideBoxes);
    }
  }

  private scheduleReconnect(entities?: FarmEntity[], roadsideBoxes?: RoadsideBox[]) {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect(this.farmName, this.level, this.avatar, entities, roadsideBoxes);
    }, 4000);
  }

  public send(msg: ClientWsMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    }
  }

  public sendRegister(entities?: FarmEntity[], roadsideBoxes?: RoadsideBox[]) {
    this.send({
      type: 'register',
      farmId: this.farmId,
      farmName: this.farmName,
      level: this.level,
      avatar: this.avatar,
      entities,
      roadsideBoxes,
    });
  }

  private handleServerMessage(msg: ServerWsMessage) {
    switch (msg.type) {
      case 'init': {
        this.onlineCount = msg.onlineCount;
        this.onlineFarms = msg.farms;
        this.currentOffers = msg.offers;
        this.emit('init', msg);
        if (msg.pendingSales && msg.pendingSales.length > 0) {
          msg.pendingSales.forEach((sale) => {
            this.emit('item_sold_to_you', sale);
          });
        }
        break;
      }

      case 'presence': {
        this.onlineCount = msg.onlineCount;
        this.onlineFarms = msg.farms;
        this.emit('presence', msg);
        break;
      }

      case 'offer_published': {
        // Prepend offer
        this.currentOffers = [
          msg.offer,
          ...this.currentOffers.filter((o) => o.id !== msg.offer.id),
        ];
        this.emit('offer_published', msg.offer);
        break;
      }

      case 'offer_sold': {
        this.currentOffers = this.currentOffers.map((o) =>
          o.id === msg.offerId
            ? { ...o, isSold: true, buyerFarmName: msg.buyerFarmName }
            : o
        );
        this.emit('offer_sold', msg);
        break;
      }

      case 'offer_removed': {
        this.currentOffers = this.currentOffers.filter((o) => o.id !== msg.offerId);
        this.emit('offer_removed', msg.offerId);
        break;
      }

      case 'item_sold_to_you': {
        this.emit('item_sold_to_you', msg);
        break;
      }

      case 'buy_result': {
        this.emit('buy_result', msg);
        break;
      }

      case 'farm_data': {
        this.emit('farm_data', msg.farm);
        break;
      }
    }
  }

  // Publish offer to server
  public async publishOffer(boxId: number, itemId: ItemId, count: number, price: number, advertised: boolean = true) {
    const offerId = `offer_${this.farmId}_${boxId}_${Date.now()}`;
    const offer: MultiplayerOffer = {
      id: offerId,
      sellerFarmId: this.farmId,
      sellerFarmName: this.farmName,
      sellerAvatar: this.avatar,
      sellerLevel: this.level,
      boxId,
      itemId,
      count,
      price,
      advertised,
      isSold: false,
      createdAt: Date.now(),
    };

    console.log(`[Multiplayer/Publish] Publishing offer ID=${offerId} for farmId=${this.farmId}, boxId=${boxId}, item=${itemId}, count=${count}, price=${price}, advertised=${advertised}`);

    // Send via WS
    this.send({
      type: 'publish_offer',
      offer,
    });

    // Also send via REST API for high reliability
    const url = this.getApiUrl('/api/multiplayer/publish');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          farmId: this.farmId,
          boxId,
          itemId,
          count,
          price,
          advertised,
        }),
      });
      console.log(`[Multiplayer/Publish] REST publish response HTTP status=${res.status}`);
    } catch (e) {
      console.warn('[Multiplayer/Publish] REST publish fallback failed:', e);
    }
  }

  // Buy offer
  public async buyOffer(offerId: string): Promise<{ success: boolean; item?: any; error?: string }> {
    const url = this.getApiUrl('/api/multiplayer/buy');
    console.log(`[Multiplayer/Buy] Buying offer ID=${offerId} by buyerFarmId=${this.farmId} (${this.farmName}) at URL=${url}`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId,
          buyerFarmId: this.farmId,
          buyerFarmName: this.farmName,
        }),
      });

      console.log(`[Multiplayer/Buy] Response HTTP status=${res.status}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn(`[Multiplayer/Buy] Purchase rejected:`, data.error);
        return { success: false, error: data.error || 'Erro ao comprar item' };
      }

      console.log(`[Multiplayer/Buy] Purchase SUCCESS:`, data);
      return {
        success: true,
        item: {
          itemId: data.itemId,
          count: data.count,
          price: data.price,
          sellerFarmName: data.sellerFarmName,
        },
      };
    } catch (e: any) {
      console.error(`[Multiplayer/Buy] Network error:`, e);
      return { success: false, error: e.message || 'Erro de rede' };
    }
  }

  // Collect money from box
  public async collectBox(boxId: number) {
    this.send({
      type: 'collect_box',
      farmId: this.farmId,
      boxId,
    });

    try {
      await fetch(this.getApiUrl('/api/multiplayer/collect'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmId: this.farmId,
          boxId,
        }),
      });
    } catch (e) {
      console.warn('REST collect error:', e);
    }
  }

  // Fetch a specific neighbor farm
  public async fetchFarm(targetFarmId: string): Promise<OnlineFarm | null> {
    try {
      const res = await fetch(this.getApiUrl(`/api/multiplayer/farm/${targetFarmId}`));
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('Failed to fetch farm:', e);
      return null;
    }
  }

  // Like a farm
  public async likeFarm(targetFarmId: string): Promise<number> {
    this.send({
      type: 'like_farm',
      farmId: this.farmId,
      targetFarmId,
    });

    try {
      const res = await fetch(this.getApiUrl(`/api/multiplayer/like/${targetFarmId}`), {
        method: 'POST',
      });
      const data = await res.json();
      return data.likes || 1;
    } catch (e) {
      return 1;
    }
  }
}

export const multiplayerClient = new MultiplayerClient();
