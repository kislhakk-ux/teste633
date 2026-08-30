import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

// Types for in-memory multiplayer
interface MultiplayerOffer {
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

interface OnlineFarm {
  farmId: string;
  farmName: string;
  level: number;
  avatar: string;
  isOnline: boolean;
  lastSeen: number;
  likes: number;
  offersCount: number;
  entities?: any[];
  roadsideBoxes?: any[];
}

interface SoldNotification {
  boxId: number;
  itemId: string;
  count: number;
  price: number;
  buyerFarmName: string;
  soldAt: number;
}

// In-Memory Storage
const farms = new Map<string, OnlineFarm>();
const clientSockets = new Map<string, WebSocket>();
const socketToFarmId = new Map<WebSocket, string>();
const pendingSales = new Map<string, SoldNotification[]>();

// Starter Neighborhood Offers for authentic Hay Day newspaper feel
const NEIGHBORHOOD_OFFERS: Omit<MultiplayerOffer, 'id' | 'createdAt'>[] = [
  {
    sellerFarmId: 'npc_greg',
    sellerFarmName: 'Fazenda do Greg',
    sellerAvatar: '🧔‍♂️',
    sellerLevel: 50,
    boxId: 1,
    itemId: 'wood_plank',
    count: 2,
    price: 320,
    advertised: true,
    isSold: false,
  },
  {
    sellerFarmId: 'npc_greg',
    sellerFarmName: 'Fazenda do Greg',
    sellerAvatar: '🧔‍♂️',
    sellerLevel: 50,
    boxId: 2,
    itemId: 'nail',
    count: 2,
    price: 320,
    advertised: true,
    isSold: false,
  },
  {
    sellerFarmId: 'npc_ze',
    sellerFarmName: 'Recanto do Tio Zé',
    sellerAvatar: '👨‍🌾',
    sellerLevel: 18,
    boxId: 1,
    itemId: 'bread',
    count: 4,
    price: 84,
    advertised: true,
    isSold: false,
  },
  {
    sellerFarmId: 'npc_julia',
    sellerFarmName: 'Horta da Júlia',
    sellerAvatar: '👩‍🌾',
    sellerLevel: 12,
    boxId: 1,
    itemId: 'corn',
    count: 10,
    price: 70,
    advertised: true,
    isSold: false,
  },
  {
    sellerFarmId: 'npc_pedro',
    sellerFarmName: 'Rancho São Pedro',
    sellerAvatar: '🤠',
    sellerLevel: 22,
    boxId: 1,
    itemId: 'cheese',
    count: 2,
    price: 240,
    advertised: true,
    isSold: false,
  },
  {
    sellerFarmId: 'npc_rosa',
    sellerFarmName: 'Pomar da Dona Rosa',
    sellerAvatar: '👵',
    sellerLevel: 15,
    boxId: 1,
    itemId: 'apple',
    count: 6,
    price: 180,
    advertised: true,
    isSold: false,
  },
  {
    sellerFarmId: 'npc_lucas',
    sellerFarmName: 'Granja do Lucas',
    sellerAvatar: '🧑‍🌾',
    sellerLevel: 9,
    boxId: 1,
    itemId: 'egg',
    count: 6,
    price: 108,
    advertised: true,
    isSold: false,
  },
  {
    sellerFarmId: 'npc_marcos',
    sellerFarmName: 'Engenho Boa Vista',
    sellerAvatar: '👨‍🍳',
    sellerLevel: 25,
    boxId: 1,
    itemId: 'sugar',
    count: 3,
    price: 150,
    advertised: true,
    isSold: false,
  },
];

let globalOffers: MultiplayerOffer[] = NEIGHBORHOOD_OFFERS.map((o, idx) => ({
  ...o,
  id: `npc_offer_${idx}_${Date.now()}`,
  createdAt: Date.now() - idx * 60000,
}));

function broadcast(message: any, excludeWs?: WebSocket) {
  const data = JSON.stringify(message);
  for (const client of clientSockets.values()) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      try {
        client.send(data);
      } catch (err) {
        console.error('Error broadcasting to client:', err);
      }
    }
  }
}

function getOnlineCount(): number {
  let count = 0;
  for (const farm of farms.values()) {
    if (farm.isOnline) count++;
  }
  return Math.max(count, 1);
}

function getSanitizedFarms(): OnlineFarm[] {
  return Array.from(farms.values()).map((f) => ({
    ...f,
    entities: undefined, // keep list lightweight
  }));
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 8080;

  // CORS and JSON Middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '5mb' }));

  // ================= API ROUTES =================

  // Health check & multiplayer status
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      onlineCount: getOnlineCount(),
      totalFarms: farms.size,
      activeOffers: globalOffers.filter((o) => !o.isSold).length,
      time: Date.now(),
    });
  });

  // Get current market & online farms state
  app.get(['/api/multiplayer/state', '/api/multiplayer/newspaper'], (_req, res) => {
    res.json({
      onlineCount: getOnlineCount(),
      farms: getSanitizedFarms(),
      offers: globalOffers,
    });
  });

  // Register or update farm details
  app.post('/api/multiplayer/register', (req, res) => {
    const { farmId, farmName, level, avatar, entities, roadsideBoxes } = req.body;
    if (!farmId) {
      return res.status(400).json({ error: 'farmId is required' });
    }

    const existing = farms.get(farmId);
    const updatedFarm: OnlineFarm = {
      farmId,
      farmName: farmName || existing?.farmName || 'Fazenda Feliz',
      level: level || existing?.level || 1,
      avatar: avatar || existing?.avatar || '👨‍🌾',
      isOnline: true,
      lastSeen: Date.now(),
      likes: existing?.likes || 0,
      offersCount: roadsideBoxes ? roadsideBoxes.filter((b: any) => b.itemId && !b.isSold).length : 0,
      entities: entities || existing?.entities,
      roadsideBoxes: roadsideBoxes || existing?.roadsideBoxes,
    };

    farms.set(farmId, updatedFarm);

    // Sync any advertised boxes into global newspaper
    if (Array.isArray(roadsideBoxes)) {
      // Remove old offers from this farm
      globalOffers = globalOffers.filter((o) => o.sellerFarmId !== farmId);

      roadsideBoxes.forEach((box: any) => {
        if (box.itemId && box.count > 0 && box.advertised && !box.isSold) {
          globalOffers.unshift({
            id: `offer_${farmId}_${box.id}_${Date.now()}`,
            sellerFarmId: farmId,
            sellerFarmName: updatedFarm.farmName,
            sellerAvatar: updatedFarm.avatar,
            sellerLevel: updatedFarm.level,
            boxId: box.id,
            itemId: box.itemId,
            count: box.count,
            price: box.price,
            advertised: true,
            isSold: false,
            createdAt: Date.now(),
          });
        }
      });
    }

    const pending = pendingSales.get(farmId) || [];

    res.json({
      success: true,
      farm: updatedFarm,
      pendingSales: pending,
      onlineCount: getOnlineCount(),
    });
  });

  // Publish a roadside box item to the newspaper
  app.post('/api/multiplayer/publish', (req, res) => {
    const { offerId, farmId, boxId, itemId, count, price, advertised } = req.body;
    if (!farmId || !itemId || !count || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const farm = farms.get(farmId);
    const id = offerId || `offer_${farmId}_${boxId}_${Date.now()}`;
    const newOffer: MultiplayerOffer = {
      id,
      sellerFarmId: farmId,
      sellerFarmName: farm?.farmName || 'Fazenda Vizinha',
      sellerAvatar: farm?.avatar || '👨‍🌾',
      sellerLevel: farm?.level || 1,
      boxId: Number(boxId),
      itemId,
      count: Number(count),
      price: Number(price),
      advertised: Boolean(advertised),
      isSold: false,
      createdAt: Date.now(),
    };

    // Remove any previous offer for the same box or with same id
    globalOffers = globalOffers.filter(
      (o) => !(o.sellerFarmId === farmId && o.boxId === Number(boxId)) && o.id !== id
    );

    globalOffers.unshift(newOffer);

    broadcast({
      type: 'offer_published',
      offer: newOffer,
    });

    console.log(`[Server/Publish] Offer ${id} published by farm ${farmId} (${newOffer.sellerFarmName}): ${count}x ${itemId} for ${price} coins (advertised=${advertised})`);

    res.json({ success: true, offer: newOffer });
  });

  // Buy an offer from the newspaper or roadside stand
  app.post('/api/multiplayer/buy', (req, res) => {
    const { offerId, buyerFarmId, buyerFarmName } = req.body;
    const offer = globalOffers.find((o) => o.id === offerId);

    if (!offer) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }

    if (offer.isSold) {
      return res.status(400).json({ error: 'Este item já foi vendido!' });
    }

    if (offer.sellerFarmId === buyerFarmId) {
      return res.status(400).json({ error: 'Você não pode comprar da sua própria banca!' });
    }

    // Mark as sold
    offer.isSold = true;
    offer.buyerFarmId = buyerFarmId;
    offer.buyerFarmName = buyerFarmName || 'Fazendeiro Vizinho';
    offer.soldAt = Date.now();

    // Notify seller
    const sellerSocket = clientSockets.get(offer.sellerFarmId);
    const saleNotif: SoldNotification = {
      boxId: offer.boxId,
      itemId: offer.itemId,
      count: offer.count,
      price: offer.price,
      buyerFarmName: offer.buyerFarmName,
      soldAt: offer.soldAt,
    };

    if (sellerSocket && sellerSocket.readyState === WebSocket.OPEN) {
      sellerSocket.send(
        JSON.stringify({
          type: 'item_sold_to_you',
          ...saleNotif,
        })
      );
    } else {
      // Store pending notification for when seller reconnects
      const list = pendingSales.get(offer.sellerFarmId) || [];
      list.push(saleNotif);
      pendingSales.set(offer.sellerFarmId, list);
    }

    // Update seller farm's roadsideBoxes memory if present
    const sellerFarm = farms.get(offer.sellerFarmId);
    if (sellerFarm && sellerFarm.roadsideBoxes) {
      const b = sellerFarm.roadsideBoxes.find((box: any) => box.id === offer.boxId);
      if (b) {
        b.isSold = true;
      }
    }

    // Broadcast that this offer was sold
    broadcast({
      type: 'offer_sold',
      offerId: offer.id,
      buyerFarmName: offer.buyerFarmName,
      isSold: true,
    });

    res.json({
      success: true,
      offerId: offer.id,
      itemId: offer.itemId,
      count: offer.count,
      price: offer.price,
      sellerFarmName: offer.sellerFarmName,
    });
  });

  // Collect money from sold box
  app.post('/api/multiplayer/collect', (req, res) => {
    const { farmId, boxId } = req.body;
    if (!farmId || boxId === undefined) {
      return res.status(400).json({ error: 'farmId and boxId required' });
    }

    // Remove from global offers
    globalOffers = globalOffers.filter(
      (o) => !(o.sellerFarmId === farmId && o.boxId === Number(boxId))
    );

    // Clear from pending sales
    const list = pendingSales.get(farmId) || [];
    pendingSales.set(
      farmId,
      list.filter((s) => s.boxId !== Number(boxId))
    );

    res.json({ success: true });
  });

  // Get full farm layout for visiting another player's farm
  app.get('/api/multiplayer/farm/:farmId', (req, res) => {
    const { farmId } = req.params;
    const farm = farms.get(farmId);
    if (!farm) {
      return res.status(404).json({ error: 'Fazenda não encontrada' });
    }

    res.json({
      farmId: farm.farmId,
      farmName: farm.farmName,
      level: farm.level,
      avatar: farm.avatar,
      likes: farm.likes,
      entities: farm.entities || [],
      roadsideBoxes: farm.roadsideBoxes || [],
    });
  });

  // Like a farm
  app.post('/api/multiplayer/like/:farmId', (req, res) => {
    const { farmId } = req.params;
    const farm = farms.get(farmId);
    if (farm) {
      farm.likes = (farm.likes || 0) + 1;
      broadcast({
        type: 'presence',
        onlineCount: getOnlineCount(),
        farms: getSanitizedFarms(),
      });
      return res.json({ success: true, likes: farm.likes });
    }
    res.status(404).json({ error: 'Farm not found' });
  });

  // ================= WEBSOCKET SERVER =================
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    let connectedFarmId: string | null = null;

    ws.on('message', (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString());

        switch (msg.type) {
          case 'register': {
            const { farmId, farmName, level, avatar, entities, roadsideBoxes } = msg;
            connectedFarmId = farmId;
            clientSockets.set(farmId, ws);
            socketToFarmId.set(ws, farmId);

            const existing = farms.get(farmId);
            const farmData: OnlineFarm = {
              farmId,
              farmName: farmName || existing?.farmName || 'Fazenda Vizinha',
              level: level || existing?.level || 1,
              avatar: avatar || existing?.avatar || '👨‍🌾',
              isOnline: true,
              lastSeen: Date.now(),
              likes: existing?.likes || 0,
              offersCount: roadsideBoxes ? roadsideBoxes.filter((b: any) => b.itemId && !b.isSold).length : 0,
              entities: entities || existing?.entities,
              roadsideBoxes: roadsideBoxes || existing?.roadsideBoxes,
            };
            farms.set(farmId, farmData);

            // Check pending sales to deliver
            const pending = pendingSales.get(farmId) || [];

            // Send init data to newly connected client
            ws.send(
              JSON.stringify({
                type: 'init',
                onlineCount: getOnlineCount(),
                farms: getSanitizedFarms(),
                offers: globalOffers,
                pendingSales: pending,
              })
            );

            // Broadcast presence to other clients
            broadcast(
              {
                type: 'presence',
                onlineCount: getOnlineCount(),
                farms: getSanitizedFarms(),
              },
              ws
            );
            break;
          }

          case 'heartbeat': {
            if (connectedFarmId && farms.has(connectedFarmId)) {
              const farm = farms.get(connectedFarmId)!;
              farm.isOnline = true;
              farm.lastSeen = Date.now();
            }
            break;
          }

          case 'publish_offer': {
            const offer: MultiplayerOffer = {
              ...msg.offer,
              id: msg.offer.id || `offer_${msg.offer.sellerFarmId}_${msg.offer.boxId}_${Date.now()}`,
              createdAt: msg.offer.createdAt || Date.now(),
              isSold: false,
            };

            globalOffers = globalOffers.filter(
              (o) => !(o.sellerFarmId === offer.sellerFarmId && o.boxId === offer.boxId) && o.id !== offer.id
            );
            globalOffers.unshift(offer);

            broadcast({
              type: 'offer_published',
              offer,
            });

            console.log(`[Server/WS-Publish] Offer ${offer.id} published by farm ${offer.sellerFarmId} (${offer.sellerFarmName}): ${offer.count}x ${offer.itemId} for ${offer.price} coins`);
            break;
          }

          case 'buy_offer': {
            const { offerId, buyerFarmId, buyerFarmName } = msg;
            const offer = globalOffers.find((o) => o.id === offerId);

            if (!offer || offer.isSold) {
              ws.send(
                JSON.stringify({
                  type: 'buy_result',
                  success: false,
                  error: 'Item indisponível ou já vendido!',
                })
              );
              return;
            }

            offer.isSold = true;
            offer.buyerFarmId = buyerFarmId;
            offer.buyerFarmName = buyerFarmName;
            offer.soldAt = Date.now();

            // Confirm to buyer
            ws.send(
              JSON.stringify({
                type: 'buy_result',
                success: true,
                offerId: offer.id,
                itemId: offer.itemId,
                count: offer.count,
                price: offer.price,
                sellerFarmName: offer.sellerFarmName,
              })
            );

            // Notify seller
            const sellerWs = clientSockets.get(offer.sellerFarmId);
            const notif: SoldNotification = {
              boxId: offer.boxId,
              itemId: offer.itemId,
              count: offer.count,
              price: offer.price,
              buyerFarmName,
              soldAt: offer.soldAt,
            };

            if (sellerWs && sellerWs.readyState === WebSocket.OPEN) {
              sellerWs.send(
                JSON.stringify({
                  type: 'item_sold_to_you',
                  ...notif,
                })
              );
            } else {
              const pending = pendingSales.get(offer.sellerFarmId) || [];
              pending.push(notif);
              pendingSales.set(offer.sellerFarmId, pending);
            }

            // Broadcast to everyone that the offer was sold
            broadcast({
              type: 'offer_sold',
              offerId: offer.id,
              buyerFarmName,
              isSold: true,
            });
            break;
          }

          case 'like_farm': {
            const { targetFarmId } = msg;
            const farm = farms.get(targetFarmId);
            if (farm) {
              farm.likes = (farm.likes || 0) + 1;
              broadcast({
                type: 'presence',
                onlineCount: getOnlineCount(),
                farms: getSanitizedFarms(),
              });
            }
            break;
          }
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      const fId = socketToFarmId.get(ws);
      if (fId) {
        clientSockets.delete(fId);
        socketToFarmId.delete(ws);
        const farm = farms.get(fId);
        if (farm) {
          farm.isOnline = false;
          farm.lastSeen = Date.now();
        }
        broadcast({
          type: 'presence',
          onlineCount: getOnlineCount(),
          farms: getSanitizedFarms(),
        });
      }
    });
  });

  // ================= VITE MIDDLEWARE =================
  const distPath = path.join(process.cwd(), 'dist');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌾 Hay Day Farm Server running on port ${PORT} (0.0.0.0)`);
    console.log(`🌐 Ready for real-time multiplayer newspaper trading and cross-play!`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
