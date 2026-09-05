import { ItemId } from '../types/game';

export interface DropReward {
  itemId: ItemId;
  count: number;
  source: string;
}

/**
 * Checks for a random tool drop when performing common farm activities.
 * Mining tools only drop for players who are level 24+.
 */
export function checkRandomToolDrop(
  playerLevel: number,
  activity: 'harvest_crop' | 'collect_animal' | 'truck_order'
): DropReward | null {
  // Base chance per activity
  let chance = 0;
  if (activity === 'harvest_crop') chance = 0.08; // 8% chance per plot harvested
  if (activity === 'collect_animal') chance = 0.15; // 15% chance per pen collection
  if (activity === 'truck_order') chance = 0.45; // 45% chance per truck delivery

  if (Math.random() > chance) return null;

  // Pool of possible tools
  const candidateTools: { itemId: ItemId; minLevel: number; weight: number }[] = [
    // Standard tools
    { itemId: 'axe', minLevel: 1, weight: 20 },
    { itemId: 'saw', minLevel: 1, weight: 20 },
    { itemId: 'dynamite', minLevel: 1, weight: 15 },
    { itemId: 'wood_plank', minLevel: 1, weight: 15 },
    { itemId: 'nail', minLevel: 1, weight: 15 },
    { itemId: 'screw', minLevel: 1, weight: 15 },
    { itemId: 'bolt', minLevel: 1, weight: 15 },
  ];

  // Mining tools unlocked at level 24+
  if (playerLevel >= 24) {
    candidateTools.push({ itemId: 'shovel', minLevel: 24, weight: 30 });
    candidateTools.push({ itemId: 'pickaxe', minLevel: 24, weight: 25 });
    candidateTools.push({ itemId: 'dynamite', minLevel: 24, weight: 20 });
    candidateTools.push({ itemId: 'tnt_barrel', minLevel: 24, weight: 12 });
  }

  const eligible = candidateTools.filter((t) => playerLevel >= t.minLevel);
  const totalWeight = eligible.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of eligible) {
    if (roll <= item.weight) {
      return {
        itemId: item.itemId,
        count: 1,
        source: activity,
      };
    }
    roll -= item.weight;
  }

  return null;
}
