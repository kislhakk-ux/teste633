import { FoliagePropType } from '../components/isometric/IsoCartoonFoliage';
import { ExpansionParcel } from '../constants/expansionData';

export const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export interface ForestItem {
  x: number;
  y: number;
  type: FoliagePropType;
  scale: number;
  seed: number;
}

/**
 * Generates natural, organic wilderness props for a locked expansion parcel.
 * Uses the parcel's specific organic tiles and biome to distribute varied,
 * clustered vegetation without repetitive grid alignment.
 */
export const generateForestForParcel = (
  parcel: ExpansionParcel | { x: number; y: number; width: number; height: number; id: string; tiles?: { x: number; y: number }[]; biome?: string }
): ForestItem[] => {
  const items: ForestItem[] = [];
  const parcelId = parcel.id;
  const hash = parcelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seedBase = parcel.x * 137 + parcel.y * 311 + hash;

  // Retrieve tile list or fallback to grid
  const tiles: { x: number; y: number }[] =
    'tiles' in parcel && Array.isArray(parcel.tiles) && parcel.tiles.length > 0
      ? parcel.tiles
      : [];

  if (tiles.length > 0) {
    // Generate organic clusters over the actual tiles
    tiles.forEach((tile, index) => {
      const tileSeed = seedBase + tile.x * 17 + tile.y * 53 + index * 7;
      const rand = pseudoRandom(tileSeed);

      // ~55% chance of a feature on any tile to allow open grassy clearings
      if (rand > 0.42) {
        let type: FoliagePropType = 'oak';
        const typeRoll = pseudoRandom(tileSeed + 1);

        // Biome-tailored flora distribution
        const biome = ('biome' in parcel && parcel.biome) || 'woodland';

        if (biome === 'pine_hill' || biome === 'highland') {
          if (typeRoll < 0.50) type = 'pine';
          else if (typeRoll < 0.70) type = 'cypress';
          else if (typeRoll < 0.85) type = 'rock';
          else if (typeRoll < 0.93) type = 'log';
          else type = 'bush';
        } else if (biome === 'fruit_meadow') {
          if (typeRoll < 0.35) type = 'fruit_tree';
          else if (typeRoll < 0.60) type = 'oak';
          else if (typeRoll < 0.75) type = 'bush';
          else if (typeRoll < 0.90) type = 'wildflowers';
          else type = 'blossom';
        } else if (biome === 'riverbank' || biome === 'ancient_grove') {
          if (typeRoll < 0.40) type = 'oak';
          else if (typeRoll < 0.60) type = 'bush';
          else if (typeRoll < 0.75) type = 'log';
          else if (typeRoll < 0.90) type = 'rock';
          else type = 'blossom';
        } else {
          // Standard vibrant woodland / pasture
          if (typeRoll < 0.35) type = 'oak';
          else if (typeRoll < 0.55) type = 'pine';
          else if (typeRoll < 0.72) type = 'bush';
          else if (typeRoll < 0.85) type = 'wildflowers';
          else if (typeRoll < 0.93) type = 'rock';
          else type = 'log';
        }

        // Natural jitter inside the tile (never centered on rigid grid lines)
        const jitterX = (pseudoRandom(tileSeed + 2) - 0.5) * 0.7;
        const jitterY = (pseudoRandom(tileSeed + 3) - 0.5) * 0.7;
        const scale = 0.82 + pseudoRandom(tileSeed + 4) * 0.38;

        items.push({
          x: tile.x + 0.5 + jitterX,
          y: tile.y + 0.5 + jitterY,
          type,
          scale,
          seed: tileSeed,
        });
      }
    });
  } else {
    // Fallback bounding box iteration if no tiles array
    for (let dy = 0; dy < parcel.height; dy++) {
      for (let dx = 0; dx < parcel.width; dx++) {
        const tileSeed = seedBase + dx * 19 + dy * 43;
        const rand = pseudoRandom(tileSeed);
        if (rand > 0.45) {
          let type: FoliagePropType = 'oak';
          if (rand > 0.75) type = 'pine';
          else if (rand > 0.65) type = 'bush';
          else if (rand > 0.55) type = 'rock';

          items.push({
            x: parcel.x + dx + pseudoRandom(tileSeed + 1) * 0.7 + 0.15,
            y: parcel.y + dy + pseudoRandom(tileSeed + 2) * 0.7 + 0.15,
            type,
            scale: 0.85 + pseudoRandom(tileSeed + 3) * 0.35,
            seed: tileSeed,
          });
        }
      }
    }
  }

  // Depth sort back-to-front for proper isometric occlusion (low X+Y in back, high X+Y in front)
  return items.sort((a, b) => a.x + a.y - (b.x + b.y));
};

export interface PostUnlockObstacle {
  x: number;
  y: number;
  type: 'pine' | 'oak' | 'rock' | 'bush';
  scale: number;
  seed: number;
}

/**
 * When unlocking a parcel, generates ONLY 2-3 charming perimeter obstacles
 * (e.g. 1 rock, 1 bush, 1 tree) so the vast majority of the newly unlocked
 * territory is immediately clear and usable for farming and building!
 */
export const generatePostUnlockObstacles = (parcel: ExpansionParcel): PostUnlockObstacle[] => {
  const tiles = parcel.tiles;
  if (!tiles || tiles.length === 0) return [];

  const items: PostUnlockObstacle[] = [];
  const hash = parcel.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Pick 2 or 3 corner/edge tiles
  const step = Math.max(1, Math.floor(tiles.length / 3));
  const candidateIndices = [0, step, Math.min(tiles.length - 1, step * 2)];

  candidateIndices.forEach((idx, i) => {
    const tile = tiles[idx];
    const seed = hash + i * 97 + tile.x * 13 + tile.y * 29;
    const typeRoll = pseudoRandom(seed);
    let type: 'pine' | 'oak' | 'rock' | 'bush' = 'pine';
    if (typeRoll < 0.4) type = 'rock';
    else if (typeRoll < 0.7) type = 'oak';
    else type = 'bush';

    items.push({
      x: tile.x + 0.5,
      y: tile.y + 0.5,
      type,
      scale: 0.9 + pseudoRandom(seed + 1) * 0.2,
      seed,
    });
  });

  return items;
};
