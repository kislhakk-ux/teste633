import { ItemId } from '../types/game';

export interface MineToolConfig {
  id: 'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel';
  name: string;
  icon: string;
  description: string;
  minYield: number;
  maxYield: number;
  actionTimeMs: number;
  soundType: 'shovel' | 'pickaxe' | 'dynamite' | 'tnt';
  weights: {
    coal: number;
    iron_ore: number;
    silver_ore: number;
    gold_ore: number;
    diamond: number; // Gives gems directly
  };
}

export interface MineResourceDef {
  id: ItemId | 'diamond';
  name: string;
  icon: string;
  minLevel: number;
  color: string;
  glowColor: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpPerUnit: number;
  occupiesBarn: boolean;
}

export const MINE_CONFIG = {
  unlockLevel: 24,
  repairCostCoins: 25000,
  // 1 day and 12 hours = 36 hours = 129600 seconds
  repairDurationSeconds: 129600,
  // Approximate conversion: 1 gem per 30 minutes remaining, minimum 1
  calculateSpeedUpCost: (remainingSeconds: number): number => {
    if (remainingSeconds <= 0) return 0;
    return Math.max(1, Math.ceil(remainingSeconds / 1800));
  },
};

export const MINE_RESOURCES: Record<string, MineResourceDef> = {
  coal: {
    id: 'coal',
    name: 'Carvão Mineral',
    icon: '🪨',
    minLevel: 24,
    color: '#374151',
    glowColor: '#9CA3AF',
    rarity: 'common',
    xpPerUnit: 5,
    occupiesBarn: true,
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Minério de Ferro',
    icon: '🪙',
    minLevel: 24,
    color: '#94A3B8',
    glowColor: '#CBD5E1',
    rarity: 'uncommon',
    xpPerUnit: 8,
    occupiesBarn: true,
  },
  silver_ore: {
    id: 'silver_ore',
    name: 'Minério de Prata',
    icon: '🔘',
    minLevel: 27,
    color: '#E2E8F0',
    glowColor: '#38BDF8',
    rarity: 'rare',
    xpPerUnit: 14,
    occupiesBarn: true,
  },
  gold_ore: {
    id: 'gold_ore',
    name: 'Minério de Ouro',
    icon: '✨',
    minLevel: 30,
    color: '#FBBF24',
    glowColor: '#F59E0B',
    rarity: 'epic',
    xpPerUnit: 22,
    occupiesBarn: true,
  },
  diamond: {
    id: 'diamond',
    name: 'Diamante Precioso',
    icon: '💎',
    minLevel: 24,
    color: '#38BDF8',
    glowColor: '#67E8F9',
    rarity: 'legendary',
    xpPerUnit: 50,
    occupiesBarn: false, // Enters directly into gems counter!
  },
};

export const MINE_TOOLS: Record<'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel', MineToolConfig> = {
  shovel: {
    id: 'shovel',
    name: 'Pá de Mineração',
    icon: '🥄',
    description: 'Raspa sedimentos superficiais na galeria. Retira 1 a 2 minérios leves.',
    minYield: 1,
    maxYield: 2,
    actionTimeMs: 1400,
    soundType: 'shovel',
    weights: {
      coal: 45,
      iron_ore: 40,
      silver_ore: 10,
      gold_ore: 4,
      diamond: 1,
    },
  },
  pickaxe: {
    id: 'pickaxe',
    name: 'Picareta de Ferro',
    icon: '⛏️',
    description: 'Quebra veios sólidos na parede de rocha. Alta probabilidade de ferro e prata.',
    minYield: 1,
    maxYield: 2,
    actionTimeMs: 1600,
    soundType: 'pickaxe',
    weights: {
      coal: 25,
      iron_ore: 50,
      silver_ore: 18,
      gold_ore: 6,
      diamond: 1.5,
    },
  },
  dynamite: {
    id: 'dynamite',
    name: 'Dinamite',
    icon: '🧨',
    description: 'Detonação rápida com pavio aceso. Estilhaça a rocha produzindo de 2 a 4 recursos.',
    minYield: 2,
    maxYield: 4,
    actionTimeMs: 2200,
    soundType: 'dynamite',
    weights: {
      coal: 20,
      iron_ore: 40,
      silver_ore: 25,
      gold_ore: 12,
      diamond: 3,
    },
  },
  tnt_barrel: {
    id: 'tnt_barrel',
    name: 'Barril de TNT',
    icon: '🛢️',
    description: 'Máxima potência explosiva! Gera de 3 a 6 recursos com grande chance de prata, ouro e diamantes.',
    minYield: 3,
    maxYield: 6,
    actionTimeMs: 2800,
    soundType: 'tnt',
    weights: {
      coal: 10,
      iron_ore: 30,
      silver_ore: 32,
      gold_ore: 22,
      diamond: 6,
    },
  },
};

export interface MiningRollResult {
  barnItems: { itemId: ItemId; count: number }[];
  directGems: number;
  totalXp: number;
  drops: {
    id: ItemId | 'diamond';
    name: string;
    icon: string;
    count: number;
    isGem: boolean;
    color: string;
    glowColor: string;
    rarity: string;
  }[];
}

/**
 * Calculates mining drop outcomes according to player level and tool weights.
 */
export function rollMiningDrops(
  toolId: 'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel',
  playerLevel: number
): MiningRollResult {
  const tool = MINE_TOOLS[toolId];
  const yieldCount = Math.floor(
    Math.random() * (tool.maxYield - tool.minYield + 1)
  ) + tool.minYield;

  // Filter available resources by level
  const weights: { key: string; weight: number }[] = [];

  // Coal (level 24+)
  if (playerLevel >= 24) {
    weights.push({ key: 'coal', weight: tool.weights.coal });
    weights.push({ key: 'iron_ore', weight: tool.weights.iron_ore });
    weights.push({ key: 'diamond', weight: tool.weights.diamond });
  }
  // Silver (level 27+)
  if (playerLevel >= 27) {
    weights.push({ key: 'silver_ore', weight: tool.weights.silver_ore });
  }
  // Gold (level 30+)
  if (playerLevel >= 30) {
    weights.push({ key: 'gold_ore', weight: tool.weights.gold_ore });
  }

  const totalWeight = weights.reduce((acc, w) => acc + w.weight, 0);

  const counts: Record<string, number> = {};

  for (let i = 0; i < yieldCount; i++) {
    let rand = Math.random() * totalWeight;
    let chosenKey = 'iron_ore';
    for (const w of weights) {
      if (rand <= w.weight) {
        chosenKey = w.key;
        break;
      }
      rand -= w.weight;
    }
    counts[chosenKey] = (counts[chosenKey] || 0) + 1;
  }

  const barnItems: { itemId: ItemId; count: number }[] = [];
  let directGems = 0;
  let totalXp = 0;

  const drops: MiningRollResult['drops'] = [];

  for (const [key, count] of Object.entries(counts)) {
    const resDef = MINE_RESOURCES[key];
    if (!resDef) continue;

    totalXp += resDef.xpPerUnit * count;

    if (key === 'diamond') {
      directGems += count;
      drops.push({
        id: 'diamond',
        name: resDef.name,
        icon: resDef.icon,
        count,
        isGem: true,
        color: resDef.color,
        glowColor: resDef.glowColor,
        rarity: resDef.rarity,
      });
    } else {
      barnItems.push({ itemId: key as ItemId, count });
      drops.push({
        id: key as ItemId,
        name: resDef.name,
        icon: resDef.icon,
        count,
        isGem: false,
        color: resDef.color,
        glowColor: resDef.glowColor,
        rarity: resDef.rarity,
      });
    }
  }

  return { barnItems, directGems, totalXp, drops };
}
