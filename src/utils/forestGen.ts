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
  parcel: ExpansionParcel | { x: number; y: number; width: number; height: number; id: string; tiles?: { x: number; y: number }[]; biome?: string; lake?: { x: number; y: number } }
): ForestItem[] => {
  const items: ForestItem[] = [];
  const parcelId = parcel.id;
  const hash = parcelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seedBase = parcel.x * 137 + parcel.y * 311 + hash;

  const lakePos = 'lake' in parcel && parcel.lake ? parcel.lake : null;

  // Retrieve tile list or fallback to grid
  const tiles: { x: number; y: number }[] =
    'tiles' in parcel && Array.isArray(parcel.tiles) && parcel.tiles.length > 0
      ? parcel.tiles
      : [];

  if (tiles.length > 0) {
    // Generate organic clusters over the actual tiles
    tiles.forEach((tile, index) => {
      // If this tile is directly on the lake center, leave it clear for the lake
      if (lakePos) {
        const distToLake = Math.hypot(tile.x - lakePos.x, tile.y - lakePos.y);
        if (distToLake < 1.3) return; // Keep lake water surface open
      }

      const tileSeed = seedBase + tile.x * 17 + tile.y * 53 + index * 7;
      const rand = pseudoRandom(tileSeed);

      // ~80% chance of nature features (trees, rocks, props) for a dense Hay Day wilderness
      if (rand > 0.20) {
        let type: FoliagePropType = 'oak';
        const typeRoll = pseudoRandom(tileSeed + 1);

        // Biome-tailored flora & rock distribution with high rock density
        const biome = ('biome' in parcel && parcel.biome) || 'woodland';

        if (biome === 'pine_hill' || biome === 'highland') {
          // Pine hill: High rocks, alpine pines, granite crags
          if (typeRoll < 0.32) type = 'pine';
          else if (typeRoll < 0.50) type = 'medium_rock';
          else if (typeRoll < 0.65) type = 'rock';
          else if (typeRoll < 0.78) type = 'rock_cluster';
          else if (typeRoll < 0.88) type = 'cypress';
          else if (typeRoll < 0.94) type = 'log';
          else type = 'bush';
        } else if (biome === 'fruit_meadow') {
          // Fruit meadow: Apples/oranges, blossoms, smooth boulders, wildflowers
          if (typeRoll < 0.28) type = 'fruit_tree';
          else if (typeRoll < 0.44) type = 'oak';
          else if (typeRoll < 0.60) type = 'rock_cluster';
          else if (typeRoll < 0.72) type = 'medium_rock';
          else if (typeRoll < 0.84) type = 'blossom';
          else if (typeRoll < 0.92) type = 'bush';
          else type = 'wildflowers';
        } else if (biome === 'ancient_grove' || biome === 'waterfall_terrace') {
          // Dense ancient rocks & oaks
          if (typeRoll < 0.28) type = 'oak';
          else if (typeRoll < 0.45) type = 'rock';
          else if (typeRoll < 0.60) type = 'medium_rock';
          else if (typeRoll < 0.72) type = 'rock_cluster';
          else if (typeRoll < 0.84) type = 'blossom';
          else if (typeRoll < 0.92) type = 'log';
          else type = 'bush';
        } else {
          // Standard vibrant woodland with high rock and tree richness
          if (typeRoll < 0.28) type = 'oak';
          else if (typeRoll < 0.45) type = 'rock';
          else if (typeRoll < 0.60) type = 'medium_rock';
          else if (typeRoll < 0.72) type = 'pine';
          else if (typeRoll < 0.82) type = 'rock_cluster';
          else if (typeRoll < 0.90) type = 'bush';
          else if (typeRoll < 0.95) type = 'wildflowers';
          else type = 'log';
        }

        // Natural jitter inside the tile (never centered on rigid grid lines)
        const jitterX = (pseudoRandom(tileSeed + 2) - 0.5) * 0.72;
        const jitterY = (pseudoRandom(tileSeed + 3) - 0.5) * 0.72;
        const scale = 0.84 + pseudoRandom(tileSeed + 4) * 0.36;

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
        if (rand > 0.25) {
          let type: FoliagePropType = 'oak';
          if (rand > 0.75) type = 'pine';
          else if (rand > 0.55) type = 'rock';
          else if (rand > 0.40) type = 'medium_rock';
          else if (rand > 0.30) type = 'rock_cluster';
          else type = 'bush';

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
