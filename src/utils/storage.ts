import {
  GameState,
  ItemId,
  TruckOrder,
  FarmVisitor,
} from '../types/game';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_ENTITIES,
  ITEMS,
} from '../constants/gameData';

const STORAGE_KEY = 'hayday_farm_simulator_save_v1';

export const CHARACTERS = [
  { name: 'Greg', avatar: '👨‍🌾', dialogue: 'Olá vizinho! Minha fazenda precisa de mantimentos frescos.' },
  { name: 'Mariazinha', avatar: '👧', dialogue: 'Vim da cidade comprar coisas deliciosas da sua horta!' },
  { name: 'Fazendeiro Bob', avatar: '🤠', dialogue: 'Belos campos! Pode me enviar um pedido com seu caminhão?' },
  { name: 'Prefeita Clara', avatar: '👩‍💼', dialogue: 'Para o festival da nossa cidadezinha campestre!' },
  { name: 'Vovó Amélia', avatar: '👵', dialogue: 'Nada como ingredientes fresquinhos para minhas receitas.' },
  { name: 'Padeiro Tom', avatar: '👨‍🍳', dialogue: 'Preciso de colheitas frescas para a minha padaria!' },
];

export function generateRandomOrder(level: number): TruckOrder {
  const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const availableCropIds: ItemId[] = ['wheat'];
  if (level >= 2) availableCropIds.push('corn');
  if (level >= 3) availableCropIds.push('carrot', 'sugarcane');
  if (level >= 4) availableCropIds.push('soybean');
  if (level >= 6) availableCropIds.push('pumpkin');

  const availableProductIds: ItemId[] = ['bread', 'chicken_feed'];
  if (level >= 2) availableProductIds.push('egg', 'corn_bread', 'cow_feed');
  if (level >= 3) availableProductIds.push('milk', 'cookie', 'cream', 'brown_sugar');
  if (level >= 4) availableProductIds.push('butter', 'carrot_pie', 'popcorn', 'pancake', 'white_sugar');
  if (level >= 5) availableProductIds.push('bacon', 'cheese', 'bacon_and_eggs', 'butter_popcorn');

  const itemCount = Math.min(3, 1 + Math.floor(Math.random() * 2));
  const items: { itemId: ItemId; count: number }[] = [];
  let totalCoins = 0;
  let totalXp = 0;

  for (let i = 0; i < itemCount; i++) {
    const isProduct = Math.random() > 0.5 && availableProductIds.length > 0;
    const pool = isProduct ? availableProductIds : availableCropIds;
    const chosenId = pool[Math.floor(Math.random() * pool.length)];

    if (!items.some((it) => it.itemId === chosenId)) {
      const def = ITEMS[chosenId];
      const count = isProduct ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 4) + 1;
      items.push({ itemId: chosenId, count });
      totalCoins += (def?.basePrice || 10) * count * 1.5;
      totalXp += (def?.basePrice || 10) * count * 0.8;
    }
  }

  // Fallback if empty
  if (items.length === 0) {
    items.push({ itemId: 'wheat', count: 3 });
    totalCoins = 20;
    totalXp = 10;
  }

  return {
    id: 'ord_' + Math.random().toString(36).substring(2, 9),
    characterName: char.name,
    characterAvatar: char.avatar,
    dialogue: char.dialogue,
    items,
    rewardCoins: Math.round(totalCoins + 10),
    rewardXp: Math.round(totalXp + 6),
    state: 'available',
  };
}

export function generateRandomVisitor(level: number, inventory: Partial<Record<ItemId, number>>): FarmVisitor {
  const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const candidateItems: ItemId[] = ['wheat', 'corn'];
  if (level >= 2) candidateItems.push('egg');
  if (level >= 3) candidateItems.push('bread', 'carrot', 'milk');

  const chosenItem = candidateItems[Math.floor(Math.random() * candidateItems.length)];
  const def = ITEMS[chosenItem];
  const count = Math.max(1, Math.min(6, (inventory[chosenItem] || 0) + 1));
  const offeredCoins = Math.round((def?.basePrice || 5) * count * 1.3);

  return {
    id: 'vis_' + Date.now(),
    name: char.name,
    avatar: char.avatar,
    requestedItem: chosenItem,
    count,
    offeredCoins,
    dialogue: `Olá! Você tem ${count}x ${def?.name} para me vender? Pago bem!`,
  };
}

export function getInitialGameState(): GameState {
  const initialInventory: Partial<Record<ItemId, number>> = {
    wheat: 8,
    corn: 4,
    carrot: 0,
    sugarcane: 0,
    soybean: 0,
    pumpkin: 0,
    apple: 0,
    egg: 2,
    milk: 0,
    bacon: 0,
    wool: 0,
    chicken_feed: 3,
    cow_feed: 0,
    pig_feed: 0,
    sheep_feed: 0,
    bread: 2,
    corn_bread: 0,
    cookie: 0,
    carrot_pie: 0,
    pizza: 0,
    cream: 0,
    butter: 0,
    cheese: 0,
    brown_sugar: 0,
    white_sugar: 0,
    syrup: 0,
    pancake: 0,
    bacon_and_eggs: 0,
    burger: 0,
    popcorn: 0,
    butter_popcorn: 0,
    wood_plank: 2,
    nail: 2,
    screw: 2,
    bolt: 1,
    axe: 3,
    saw: 3,
    nectar: 0,
    honey: 0,
  };

  const initialOrders: TruckOrder[] = [
    generateRandomOrder(1),
    generateRandomOrder(1),
    generateRandomOrder(1),
  ];

  return {
    farmName: 'Fazenda Feliz',
    level: 1,
    xp: 0,
    coins: 350,
    gems: 25,
    siloLevel: 1, // 50 capacity
    barnLevel: 1, // 50 capacity
    inventory: initialInventory,
    entities: INITIAL_ENTITIES,
    orders: initialOrders,
    truckDeliveringUntil: null,
    roadsideBoxes: [
      { id: 1, itemId: null, count: 0, price: 0, isSold: false, advertised: false },
      { id: 2, itemId: null, count: 0, price: 0, isSold: false, advertised: false },
      { id: 3, itemId: null, count: 0, price: 0, isSold: false, advertised: false },
      { id: 4, itemId: null, count: 0, price: 0, isSold: false, advertised: false },
      { id: 5, itemId: null, count: 0, price: 0, isSold: false, advertised: false },
      { id: 6, itemId: null, count: 0, price: 0, isSold: false, advertised: false },
    ],
    activeVisitor: null,
    lastLuckySpinDate: null,
    achievements: INITIAL_ACHIEVEMENTS,
    stats: {
      totalHarvested: 0,
      totalAnimalCollected: 0,
      totalCrafted: 0,
      totalOrdersCompleted: 0,
      totalCoinsEarned: 350,
      wheelSpins: 0,
    },
    soundEnabled: true,
    musicEnabled: false,
    graphicsStyle: '3d_rendered',
    fishingBoat: {
      status: 'broken',
      spots: [
        { id: 'spot_1', x: 25, y: 45, status: 'ready' },
        { id: 'spot_2', x: 40, y: 75, status: 'ready' },
        { id: 'spot_3', x: 70, y: 75, status: 'ready' },
      ],
    },
    deliveryBoat: {
      status: 'away',
      arrivesAt: Date.now() + 1000 * 60, // Arrives in 1 min the first time!
      crates: [],
    },
  };
}

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const initial = getInitialGameState();

      // Ensure all inventory keys exist
      parsed.inventory = { ...initial.inventory, ...(parsed.inventory || {}) };
      parsed.stats = { ...initial.stats, ...(parsed.stats || {}) };

      // Ensure graphics style
      if (!parsed.graphicsStyle) {
        parsed.graphicsStyle = '3d_rendered';
      }

      // Ensure fishing boat exists
      if (!parsed.fishingBoat) {
        parsed.fishingBoat = initial.fishingBoat;
      } else if (!parsed.fishingBoat.spots) {
        parsed.fishingBoat.spots = initial.fishingBoat.spots;
      }

      // Ensure delivery boat exists
      if (!parsed.deliveryBoat) {
        parsed.deliveryBoat = {
          status: 'away',
          arrivesAt: Date.now() + 1000 * 30, // 30s to test
          crates: [],
        };
      }

      // Ensure entities have proper arrays and filter out nulls
      if (Array.isArray(parsed.entities) && parsed.entities.length > 0) {
        parsed.entities = parsed.entities
          .filter((e: any) => e !== null && e !== undefined)
          .map((e: any) => {
            if (e.type === 'building' && e.buildingData) {
              e.buildingData.queue = Array.isArray(e.buildingData.queue) ? e.buildingData.queue : [];
              e.buildingData.completedItems = Array.isArray(e.buildingData.completedItems)
                ? e.buildingData.completedItems
                : [];
              e.buildingData.totalCrafted = e.buildingData.totalCrafted || 0;
            }
            return e;
          });
      } else {
        parsed.entities = initial.entities;
      }

      // Ensure orders array and items are valid
      if (!Array.isArray(parsed.orders) || parsed.orders.length === 0) {
        parsed.orders = initial.orders;
      } else {
        parsed.orders = parsed.orders.map((ord: any) => {
          if (!ord) return generateRandomOrder(parsed.level || 1);
          if (!Array.isArray(ord.items)) {
            ord.items = [{ itemId: 'wheat', count: 3 }];
          }
          if (!ord.state) {
            ord.state = 'available';
          }
          return ord;
        });
      }

      // Ensure roadsideBoxes
      if (!Array.isArray(parsed.roadsideBoxes) || parsed.roadsideBoxes.length === 0) {
        parsed.roadsideBoxes = initial.roadsideBoxes;
      }

      // Check for WONGAMER / kislhakk VIP account
      const name = (parsed.farmName || '').toLowerCase();
      if (name.includes('wongamer') || name.includes('kislhakk')) {
        parsed.level = 1000;
        parsed.xp = 0;
        parsed.coins = Math.max(parsed.coins || 0, 5000000);
        parsed.gems = Math.max(parsed.gems || 0, 10000);
        parsed.siloLevel = Math.max(parsed.siloLevel || 1, 100);
        parsed.barnLevel = Math.max(parsed.barnLevel || 1, 100);
      }

      return parsed;
    }
  } catch (e) {
    console.error('Error loading game state:', e);
  }
  return getInitialGameState();
}

export function saveGameState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving game state:', e);
  }
}

export function getStorageUsage(inventory: Partial<Record<ItemId, number>>, storageType: 'silo' | 'barn'): { used: number; max: number } {
  let used = 0;
  for (const [id, count] of Object.entries(inventory)) {
    const itemDef = ITEMS[id as ItemId];
    if (itemDef && itemDef.storage === storageType) {
      used += count;
    }
  }
  return { used, max: 0 }; // max will be filled with siloLevel / barnLevel * 50
}
