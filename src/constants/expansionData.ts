import { ItemId } from '../types/game';

export type ExpansionBiome =
  | 'woodland'
  | 'pine_hill'
  | 'fruit_meadow'
  | 'riverbank'
  | 'pasture'
  | 'ancient_grove'
  | 'highland'
  | 'waterfall_terrace';

export interface GridCoord {
  x: number;
  y: number;
}

export interface ExpansionParcel {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  biome: ExpansionBiome;
  requiredLevel: number;
  cost: {
    coins: number;
    items: Partial<Record<ItemId, number>>;
  };
  // Explicit irregular tiles making up this natural territory
  tiles: GridCoord[];
  // Pre-calculated bounding box
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  // Visual center for signpost and interactive banner
  center: GridCoord;
  // Natural perimeter survey stake locations for visual boundary markers
  stakePoints: GridCoord[];
  // Optional picturesque forest lake inside the parcel
  lake?: {
    x: number;
    y: number;
    name?: string;
    radiusX?: number;
    radiusY?: number;
  };
  // Bounding rect representation for backward-compatibility
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Generates an organic, natural set of tiles from a base shape with natural scalloped indentations.
 */
function createOrganicParcelTiles(
  coords: [number, number][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): GridCoord[] {
  const tileSet = new Set<string>();
  const tiles: GridCoord[] = [];

  coords.forEach(([x, y]) => {
    const key = `${x},${y}`;
    if (!tileSet.has(key)) {
      tileSet.add(key);
      tiles.push({ x, y });
    }
  });

  return tiles;
}

// 1. Bosque do Lago Encantado (North / North-East - across the road)
const tilesNorth1: [number, number][] = [
  [5, -1], [6, -1], [7, -1], [8, -1], [9, -1], [10, -1], [11, -1],
  [4, -2], [5, -2], [6, -2], [7, -2], [8, -2], [9, -2], [10, -2], [11, -2], [12, -2],
  [4, -3], [5, -3], [6, -3], [7, -3], [8, -3], [9, -3], [10, -3], [11, -3],
  [5, -4], [6, -4], [7, -4], [8, -4], [9, -4], [10, -4],
  [6, -5], [7, -5], [8, -5], [9, -5],
];

// 2. Colina dos Pinheiros (North / North-West - above the mine)
const tilesNorth2: [number, number][] = [
  [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1], [4, -1],
  [-3, -2], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [3, -2], [4, -2],
  [-3, -3], [-2, -3], [-1, -3], [0, -3], [1, -3], [2, -3], [3, -3],
  [-2, -4], [-1, -4], [0, -4], [1, -4], [2, -4],
  [-1, -5], [0, -5], [1, -5],
];

// 3. Platô das Nuvens (Far North Highland Peak)
const tilesFarNorth: [number, number][] = [
  [2, -6], [3, -6], [4, -6], [5, -6], [6, -6], [7, -6], [8, -6], [9, -6], [10, -6], [11, -6], [12, -6],
  [1, -7], [2, -7], [3, -7], [4, -7], [5, -7], [6, -7], [7, -7], [8, -7], [9, -7], [10, -7], [11, -7], [12, -7],
  [1, -8], [2, -8], [3, -8], [4, -8], [5, -8], [6, -8], [7, -8], [8, -8], [9, -8], [10, -8], [11, -8],
  [2, -9], [3, -9], [4, -9], [5, -9], [6, -9], [7, -9], [8, -9], [9, -9], [10, -9],
  [3, -10], [4, -10], [5, -10], [6, -10], [7, -10], [8, -10],
];

// 4. Pradaria do Lago Sol (East Meadow - with picturesque wilderness lake)
const tilesEastMeadow: [number, number][] = [
  [14, 1], [15, 1], [16, 1],
  [14, 2], [15, 2], [16, 2], [17, 2],
  [14, 3], [15, 3], [16, 3], [17, 3], [18, 3],
  [14, 4], [15, 4], [16, 4], [17, 4], [18, 4], [19, 4],
  [14, 5], [15, 5], [16, 5], [17, 5], [18, 5],
  [14, 6], [15, 6], [16, 6], [17, 6],
];

// 5. Vale das Flores e Pedras (East Valley - elevated highland, strictly above the cliff away from river)
const tilesEastValley: [number, number][] = [
  [14, 7], [15, 7], [16, 7], [17, 7],
  [14, 8], [15, 8], [16, 8], [17, 8], [18, 8],
  [14, 9], [15, 9], [16, 9], [17, 9], [18, 9], [19, 9],
  [14, 10], [15, 10], [16, 10], [17, 10], [18, 10],
  [14, 11], [15, 11], [16, 11], [17, 11],
  [14, 12], [15, 12], [16, 12],
];

// 6. Terraço da Cascata (Far East Highland Vista)
const tilesEastTerrace: [number, number][] = [
  [19, 2], [20, 2], [21, 2],
  [19, 3], [20, 3], [21, 3], [22, 3],
  [18, 4], [19, 4], [20, 4], [21, 4], [22, 4], [23, 4],
  [18, 5], [19, 5], [20, 5], [21, 5], [22, 5], [23, 5],
  [19, 6], [20, 6], [21, 6], [22, 6],
  [20, 7], [21, 7],
];

export const EXPANSION_PARCELS: ExpansionParcel[] = [
  {
    id: 'exp_north_1',
    name: 'Bosque do Lago',
    subtitle: 'Clareira do Riacho e Lago',
    description: 'Um vale verdejante com carvalhos nobres, lago natural cristalino com vitórias-régias e pedras graníticas.',
    biome: 'woodland',
    requiredLevel: 7,
    cost: {
      coins: 800,
      items: { land_map: 2, marker_stake: 2, brick: 1 },
    },
    tiles: createOrganicParcelTiles(tilesNorth1, 4, 12, -5, -1),
    bounds: { minX: 4, maxX: 12, minY: -5, maxY: -1 },
    center: { x: 7.5, y: -2.5 },
    stakePoints: [
      { x: 4, y: -1.5 },
      { x: 8, y: -5 },
      { x: 12, y: -2 },
      { x: 8, y: -1 },
    ],
    lake: {
      x: 8.5,
      y: -3.8,
      name: 'Lago dos Cisnes',
      radiusX: 46,
      radiusY: 26,
    },
    x: 4,
    y: -5,
    width: 9,
    height: 5,
  },
  {
    id: 'exp_north_2',
    name: 'Colina dos Pinheiros',
    subtitle: 'Encosta do Vento Fresco',
    description: 'Colina elevada com pinheiros alpinos frondosos, pedras graníticas e toras de madeira rústica.',
    biome: 'pine_hill',
    requiredLevel: 10,
    cost: {
      coins: 1400,
      items: { land_map: 3, marker_stake: 3, brick: 2 },
    },
    tiles: createOrganicParcelTiles(tilesNorth2, -3, 4, -5, -1),
    bounds: { minX: -3, maxX: 4, minY: -5, maxY: -1 },
    center: { x: 0.5, y: -3 },
    stakePoints: [
      { x: -3, y: -2 },
      { x: 0, y: -5 },
      { x: 4, y: -1.5 },
      { x: 1, y: -1 },
    ],
    x: -3,
    y: -5,
    width: 8,
    height: 5,
  },
  {
    id: 'exp_north_west_1',
    name: 'Platô das Nuvens',
    subtitle: 'Mirante dos Picos Altos',
    description: 'Território nobre das montanhas com vista panorâmica da fazenda, pinheiros centenários e pedregulhos nobres.',
    biome: 'highland',
    requiredLevel: 14,
    cost: {
      coins: 2200,
      items: { land_map: 4, marker_stake: 4, brick: 3 },
    },
    tiles: createOrganicParcelTiles(tilesFarNorth, 1, 12, -10, -6),
    bounds: { minX: 1, maxX: 12, minY: -10, maxY: -6 },
    center: { x: 6.5, y: -8 },
    stakePoints: [
      { x: 1.5, y: -7 },
      { x: 12, y: -6.5 },
      { x: 8, y: -10 },
      { x: 3, y: -10 },
    ],
    x: 1,
    y: -10,
    width: 12,
    height: 5,
  },
  {
    id: 'exp_east_meadow',
    name: 'Pradaria do Lago Sol',
    subtitle: 'Terraço Oriental do Lago',
    description: 'Platô banhado pelo sol nascente, com um sereno lago natural cercado por pedras, flores e carvalhos frondosos.',
    biome: 'fruit_meadow',
    requiredLevel: 17,
    cost: {
      coins: 3000,
      items: { land_map: 5, marker_stake: 5, brick: 4 },
    },
    tiles: createOrganicParcelTiles(tilesEastMeadow, 14, 19, 1, 6),
    bounds: { minX: 14, maxX: 19, minY: 1, maxY: 6 },
    center: { x: 16.5, y: 3.5 },
    stakePoints: [
      { x: 14, y: 1.5 },
      { x: 19, y: 3.5 },
      { x: 17, y: 6 },
      { x: 14, y: 5 },
    ],
    lake: {
      x: 17,
      y: 3.8,
      name: 'Lago Esmeralda',
      radiusX: 52,
      radiusY: 28,
    },
    x: 14,
    y: 1,
    width: 6,
    height: 6,
  },
  {
    id: 'exp_east_valley',
    name: 'Vale das Pedras & Flores',
    subtitle: 'Encosta Florida do Leste',
    description: 'Encosta verdejante repleta de maciços rochosos, flores silvestres e árvores frutíferas no platô oriental.',
    biome: 'ancient_grove',
    requiredLevel: 21,
    cost: {
      coins: 4200,
      items: { land_map: 6, marker_stake: 6, brick: 5 },
    },
    tiles: createOrganicParcelTiles(tilesEastValley, 14, 19, 7, 12),
    bounds: { minX: 14, maxX: 19, minY: 7, maxY: 12 },
    center: { x: 16.5, y: 9.5 },
    stakePoints: [
      { x: 14, y: 7 },
      { x: 19, y: 9 },
      { x: 17, y: 12 },
      { x: 14, y: 10 },
    ],
    x: 14,
    y: 7,
    width: 6,
    height: 6,
  },
  {
    id: 'exp_far_east_terrace',
    name: 'Terraço da Cascata',
    subtitle: 'Vista do Desfiladeiro',
    description: 'Terraço oriental exuberante próximo às quedas d’água com formações rochosas majestosas e brisa constante.',
    biome: 'waterfall_terrace',
    requiredLevel: 25,
    cost: {
      coins: 5800,
      items: { land_map: 8, marker_stake: 8, brick: 7 },
    },
    tiles: createOrganicParcelTiles(tilesEastTerrace, 18, 23, 2, 7),
    bounds: { minX: 18, maxX: 23, minY: 2, maxY: 7 },
    center: { x: 20.5, y: 4.5 },
    stakePoints: [
      { x: 19, y: 2.5 },
      { x: 23, y: 4.5 },
      { x: 21, y: 7 },
      { x: 18, y: 5 },
    ],
    x: 18,
    y: 2,
    width: 6,
    height: 6,
  },
];

/**
 * Backward-compatibility aliases for any older save files:
 * maps legacy IDs (especially old riverbank parcels) to the active canonical parcels.
 */
export const LEGACY_PARCEL_ALIASES: Record<string, string> = {
  exp_north_west_2: 'exp_north_2',
  exp_far_north: 'exp_north_west_1',
  exp_south_west_grove: 'exp_east_valley',
  exp_south_pasture: 'exp_east_meadow',
  exp_south_riverbank: 'exp_far_east_terrace',
};

/**
 * Checks if a coordinate is within the base starting farm territory.
 * The original starting farm covers x: 1..13 and y: 1..13.
 */
export function isTileInBaseFarm(x: number, y: number): boolean {
  return x >= 1 && x <= 13 && y >= 1 && y <= 13;
}

/**
 * Fast lookup to check if a specific grid tile belongs to a parcel.
 */
export function isTileInParcel(parcel: ExpansionParcel, x: number, y: number): boolean {
  // 1. Fast bounding box check
  if (
    x < parcel.bounds.minX ||
    x > parcel.bounds.maxX ||
    y < parcel.bounds.minY ||
    y > parcel.bounds.maxY
  ) {
    return false;
  }
  // 2. Exact tile match
  return parcel.tiles.some((t) => t.x === x && t.y === y);
}

/**
 * Finds which expansion parcel contains the given tile, if any.
 */
export function getParcelByTile(x: number, y: number): ExpansionParcel | undefined {
  return EXPANSION_PARCELS.find((p) => isTileInParcel(p, x, y));
}
