var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_http = __toESM(require("http"), 1);
var import_path = __toESM(require("path"), 1);
var import_ws = require("ws");
var import_vite = require("vite");
var farms = /* @__PURE__ */ new Map();
var clientSockets = /* @__PURE__ */ new Map();
var socketToFarmId = /* @__PURE__ */ new Map();
var pendingSales = /* @__PURE__ */ new Map();
var NEIGHBORHOOD_OFFERS = [
  {
    sellerFarmId: "npc_greg",
    sellerFarmName: "Fazenda do Greg",
    sellerAvatar: "\u{1F9D4}\u200D\u2642\uFE0F",
    sellerLevel: 50,
    boxId: 1,
    itemId: "wood_plank",
    count: 2,
    price: 320,
    advertised: true,
    isSold: false
  },
  {
    sellerFarmId: "npc_greg",
    sellerFarmName: "Fazenda do Greg",
    sellerAvatar: "\u{1F9D4}\u200D\u2642\uFE0F",
    sellerLevel: 50,
    boxId: 2,
    itemId: "nail",
    count: 2,
    price: 320,
    advertised: true,
    isSold: false
  },
  {
    sellerFarmId: "npc_ze",
    sellerFarmName: "Recanto do Tio Z\xE9",
    sellerAvatar: "\u{1F468}\u200D\u{1F33E}",
    sellerLevel: 18,
    boxId: 1,
    itemId: "bread",
    count: 4,
    price: 84,
    advertised: true,
    isSold: false
  },
  {
    sellerFarmId: "npc_julia",
    sellerFarmName: "Horta da J\xFAlia",
    sellerAvatar: "\u{1F469}\u200D\u{1F33E}",
    sellerLevel: 12,
    boxId: 1,
    itemId: "corn",
    count: 10,
    price: 70,
    advertised: true,
    isSold: false
  },
  {
    sellerFarmId: "npc_pedro",
    sellerFarmName: "Rancho S\xE3o Pedro",
    sellerAvatar: "\u{1F920}",
    sellerLevel: 22,
    boxId: 1,
    itemId: "cheese",
    count: 2,
    price: 240,
    advertised: true,
    isSold: false
  },
  {
    sellerFarmId: "npc_rosa",
    sellerFarmName: "Pomar da Dona Rosa",
    sellerAvatar: "\u{1F475}",
    sellerLevel: 15,
    boxId: 1,
    itemId: "apple",
    count: 6,
    price: 180,
    advertised: true,
    isSold: false
  },
  {
    sellerFarmId: "npc_lucas",
    sellerFarmName: "Granja do Lucas",
    sellerAvatar: "\u{1F9D1}\u200D\u{1F33E}",
    sellerLevel: 9,
    boxId: 1,
    itemId: "egg",
    count: 6,
    price: 108,
    advertised: true,
    isSold: false
  },
  {
    sellerFarmId: "npc_marcos",
    sellerFarmName: "Engenho Boa Vista",
    sellerAvatar: "\u{1F468}\u200D\u{1F373}",
    sellerLevel: 25,
    boxId: 1,
    itemId: "sugar",
    count: 3,
    price: 150,
    advertised: true,
    isSold: false
  }
];
var globalOffers = NEIGHBORHOOD_OFFERS.map((o, idx) => ({
  ...o,
  id: `npc_offer_${idx}_${Date.now()}`,
  createdAt: Date.now() - idx * 6e4
}));
function broadcast(message, excludeWs) {
  const data = JSON.stringify(message);
  for (const client of clientSockets.values()) {
    if (client !== excludeWs && client.readyState === import_ws.WebSocket.OPEN) {
      try {
        client.send(data);
      } catch (err) {
        console.error("Error broadcasting to client:", err);
      }
    }
  }
}
function getOnlineCount() {
  let count = 0;
  for (const farm of farms.values()) {
    if (farm.isOnline) count++;
  }
  return Math.max(count, 1);
}
function getSanitizedFarms() {
  return Array.from(farms.values()).map((f) => ({
    ...f,
    entities: void 0
    // keep list lightweight
  }));
}
async function startServer() {
  const app = (0, import_express.default)();
  const server = import_http.default.createServer(app);
  const PORT = 3e3;
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(import_express.default.json({ limit: "5mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      onlineCount: getOnlineCount(),
      totalFarms: farms.size,
      activeOffers: globalOffers.filter((o) => !o.isSold).length,
      time: Date.now()
    });
  });
  app.get(["/api/multiplayer/state", "/api/multiplayer/newspaper"], (_req, res) => {
    res.json({
      onlineCount: getOnlineCount(),
      farms: getSanitizedFarms(),
      offers: globalOffers
    });
  });
  app.post("/api/multiplayer/register", (req, res) => {
    const { farmId, farmName, level, avatar, entities, roadsideBoxes } = req.body;
    if (!farmId) {
      return res.status(400).json({ error: "farmId is required" });
    }
    const existing = farms.get(farmId);
    const updatedFarm = {
      farmId,
      farmName: farmName || existing?.farmName || "Fazenda Feliz",
      level: level || existing?.level || 1,
      avatar: avatar || existing?.avatar || "\u{1F468}\u200D\u{1F33E}",
      isOnline: true,
      lastSeen: Date.now(),
      likes: existing?.likes || 0,
      offersCount: roadsideBoxes ? roadsideBoxes.filter((b) => b.itemId && !b.isSold).length : 0,
      entities: entities || existing?.entities,
      roadsideBoxes: roadsideBoxes || existing?.roadsideBoxes
    };
    farms.set(farmId, updatedFarm);
    if (Array.isArray(roadsideBoxes)) {
      globalOffers = globalOffers.filter((o) => o.sellerFarmId !== farmId);
      roadsideBoxes.forEach((box) => {
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
            createdAt: Date.now()
          });
        }
      });
    }
    const pending = pendingSales.get(farmId) || [];
    res.json({
      success: true,
      farm: updatedFarm,
      pendingSales: pending,
      onlineCount: getOnlineCount()
    });
  });
  app.post("/api/multiplayer/publish", (req, res) => {
    const { offerId, farmId, boxId, itemId, count, price, advertised } = req.body;
    if (!farmId || !itemId || !count || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const farm = farms.get(farmId);
    const id = offerId || `offer_${farmId}_${boxId}_${Date.now()}`;
    const newOffer = {
      id,
      sellerFarmId: farmId,
      sellerFarmName: farm?.farmName || "Fazenda Vizinha",
      sellerAvatar: farm?.avatar || "\u{1F468}\u200D\u{1F33E}",
      sellerLevel: farm?.level || 1,
      boxId: Number(boxId),
      itemId,
      count: Number(count),
      price: Number(price),
      advertised: Boolean(advertised),
      isSold: false,
      createdAt: Date.now()
    };
    globalOffers = globalOffers.filter(
      (o) => !(o.sellerFarmId === farmId && o.boxId === Number(boxId)) && o.id !== id
    );
    globalOffers.unshift(newOffer);
    broadcast({
      type: "offer_published",
      offer: newOffer
    });
    console.log(`[Server/Publish] Offer ${id} published by farm ${farmId} (${newOffer.sellerFarmName}): ${count}x ${itemId} for ${price} coins (advertised=${advertised})`);
    res.json({ success: true, offer: newOffer });
  });
  app.post("/api/multiplayer/buy", (req, res) => {
    const { offerId, buyerFarmId, buyerFarmName } = req.body;
    const offer = globalOffers.find((o) => o.id === offerId);
    if (!offer) {
      return res.status(404).json({ error: "Oferta n\xE3o encontrada" });
    }
    if (offer.isSold) {
      return res.status(400).json({ error: "Este item j\xE1 foi vendido!" });
    }
    if (offer.sellerFarmId === buyerFarmId) {
      return res.status(400).json({ error: "Voc\xEA n\xE3o pode comprar da sua pr\xF3pria banca!" });
    }
    offer.isSold = true;
    offer.buyerFarmId = buyerFarmId;
    offer.buyerFarmName = buyerFarmName || "Fazendeiro Vizinho";
    offer.soldAt = Date.now();
    const sellerSocket = clientSockets.get(offer.sellerFarmId);
    const saleNotif = {
      boxId: offer.boxId,
      itemId: offer.itemId,
      count: offer.count,
      price: offer.price,
      buyerFarmName: offer.buyerFarmName,
      soldAt: offer.soldAt
    };
    if (sellerSocket && sellerSocket.readyState === import_ws.WebSocket.OPEN) {
      sellerSocket.send(
        JSON.stringify({
          type: "item_sold_to_you",
          ...saleNotif
        })
      );
    } else {
      const list = pendingSales.get(offer.sellerFarmId) || [];
      list.push(saleNotif);
      pendingSales.set(offer.sellerFarmId, list);
    }
    const sellerFarm = farms.get(offer.sellerFarmId);
    if (sellerFarm && sellerFarm.roadsideBoxes) {
      const b = sellerFarm.roadsideBoxes.find((box) => box.id === offer.boxId);
      if (b) {
        b.isSold = true;
      }
    }
    broadcast({
      type: "offer_sold",
      offerId: offer.id,
      buyerFarmName: offer.buyerFarmName,
      isSold: true
    });
    res.json({
      success: true,
      offerId: offer.id,
      itemId: offer.itemId,
      count: offer.count,
      price: offer.price,
      sellerFarmName: offer.sellerFarmName
    });
  });
  app.post("/api/multiplayer/collect", (req, res) => {
    const { farmId, boxId } = req.body;
    if (!farmId || boxId === void 0) {
      return res.status(400).json({ error: "farmId and boxId required" });
    }
    globalOffers = globalOffers.filter(
      (o) => !(o.sellerFarmId === farmId && o.boxId === Number(boxId))
    );
    const list = pendingSales.get(farmId) || [];
    pendingSales.set(
      farmId,
      list.filter((s) => s.boxId !== Number(boxId))
    );
    res.json({ success: true });
  });
  app.get("/api/multiplayer/farm/:farmId", (req, res) => {
    const { farmId } = req.params;
    const farm = farms.get(farmId);
    if (!farm) {
      return res.status(404).json({ error: "Fazenda n\xE3o encontrada" });
    }
    res.json({
      farmId: farm.farmId,
      farmName: farm.farmName,
      level: farm.level,
      avatar: farm.avatar,
      likes: farm.likes,
      entities: farm.entities || [],
      roadsideBoxes: farm.roadsideBoxes || []
    });
  });
  app.post("/api/multiplayer/like/:farmId", (req, res) => {
    const { farmId } = req.params;
    const farm = farms.get(farmId);
    if (farm) {
      farm.likes = (farm.likes || 0) + 1;
      broadcast({
        type: "presence",
        onlineCount: getOnlineCount(),
        farms: getSanitizedFarms()
      });
      return res.json({ success: true, likes: farm.likes });
    }
    res.status(404).json({ error: "Farm not found" });
  });
  const wss = new import_ws.WebSocketServer({ server, path: "/ws" });
  wss.on("connection", (ws) => {
    let connectedFarmId = null;
    ws.on("message", (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString());
        switch (msg.type) {
          case "register": {
            const { farmId, farmName, level, avatar, entities, roadsideBoxes } = msg;
            connectedFarmId = farmId;
            clientSockets.set(farmId, ws);
            socketToFarmId.set(ws, farmId);
            const existing = farms.get(farmId);
            const farmData = {
              farmId,
              farmName: farmName || existing?.farmName || "Fazenda Vizinha",
              level: level || existing?.level || 1,
              avatar: avatar || existing?.avatar || "\u{1F468}\u200D\u{1F33E}",
              isOnline: true,
              lastSeen: Date.now(),
              likes: existing?.likes || 0,
              offersCount: roadsideBoxes ? roadsideBoxes.filter((b) => b.itemId && !b.isSold).length : 0,
              entities: entities || existing?.entities,
              roadsideBoxes: roadsideBoxes || existing?.roadsideBoxes
            };
            farms.set(farmId, farmData);
            const pending = pendingSales.get(farmId) || [];
            ws.send(
              JSON.stringify({
                type: "init",
                onlineCount: getOnlineCount(),
                farms: getSanitizedFarms(),
                offers: globalOffers,
                pendingSales: pending
              })
            );
            broadcast(
              {
                type: "presence",
                onlineCount: getOnlineCount(),
                farms: getSanitizedFarms()
              },
              ws
            );
            break;
          }
          case "heartbeat": {
            if (connectedFarmId && farms.has(connectedFarmId)) {
              const farm = farms.get(connectedFarmId);
              farm.isOnline = true;
              farm.lastSeen = Date.now();
            }
            break;
          }
          case "publish_offer": {
            const offer = {
              ...msg.offer,
              id: msg.offer.id || `offer_${msg.offer.sellerFarmId}_${msg.offer.boxId}_${Date.now()}`,
              createdAt: msg.offer.createdAt || Date.now(),
              isSold: false
            };
            globalOffers = globalOffers.filter(
              (o) => !(o.sellerFarmId === offer.sellerFarmId && o.boxId === offer.boxId) && o.id !== offer.id
            );
            globalOffers.unshift(offer);
            broadcast({
              type: "offer_published",
              offer
            });
            console.log(`[Server/WS-Publish] Offer ${offer.id} published by farm ${offer.sellerFarmId} (${offer.sellerFarmName}): ${offer.count}x ${offer.itemId} for ${offer.price} coins`);
            break;
          }
          case "buy_offer": {
            const { offerId, buyerFarmId, buyerFarmName } = msg;
            const offer = globalOffers.find((o) => o.id === offerId);
            if (!offer || offer.isSold) {
              ws.send(
                JSON.stringify({
                  type: "buy_result",
                  success: false,
                  error: "Item indispon\xEDvel ou j\xE1 vendido!"
                })
              );
              return;
            }
            offer.isSold = true;
            offer.buyerFarmId = buyerFarmId;
            offer.buyerFarmName = buyerFarmName;
            offer.soldAt = Date.now();
            ws.send(
              JSON.stringify({
                type: "buy_result",
                success: true,
                offerId: offer.id,
                itemId: offer.itemId,
                count: offer.count,
                price: offer.price,
                sellerFarmName: offer.sellerFarmName
              })
            );
            const sellerWs = clientSockets.get(offer.sellerFarmId);
            const notif = {
              boxId: offer.boxId,
              itemId: offer.itemId,
              count: offer.count,
              price: offer.price,
              buyerFarmName,
              soldAt: offer.soldAt
            };
            if (sellerWs && sellerWs.readyState === import_ws.WebSocket.OPEN) {
              sellerWs.send(
                JSON.stringify({
                  type: "item_sold_to_you",
                  ...notif
                })
              );
            } else {
              const pending = pendingSales.get(offer.sellerFarmId) || [];
              pending.push(notif);
              pendingSales.set(offer.sellerFarmId, pending);
            }
            broadcast({
              type: "offer_sold",
              offerId: offer.id,
              buyerFarmName,
              isSold: true
            });
            break;
          }
          case "like_farm": {
            const { targetFarmId } = msg;
            const farm = farms.get(targetFarmId);
            if (farm) {
              farm.likes = (farm.likes || 0) + 1;
              broadcast({
                type: "presence",
                onlineCount: getOnlineCount(),
                farms: getSanitizedFarms()
              });
            }
            break;
          }
        }
      } catch (err) {
        console.error("Error handling WebSocket message:", err);
      }
    });
    ws.on("close", () => {
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
          type: "presence",
          onlineCount: getOnlineCount(),
          farms: getSanitizedFarms()
        });
      }
    });
  });
  const distPath = import_path.default.join(process.cwd(), "dist");
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`\u{1F33E} Hay Day Farm Server running on port ${PORT} (0.0.0.0)`);
    console.log(`\u{1F310} Ready for real-time multiplayer newspaper trading and cross-play!`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
