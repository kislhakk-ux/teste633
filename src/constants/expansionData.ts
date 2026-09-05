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

// 1. Bosque do Riacho (North / North-East)
const tilesNorth1: [number, number][] = [
  [5, -1], [6, -1], [7, -1], [8, -1], [9, -1], [10, -1], [11, -1],
  [4, -2], [5, -2], [6, -2], [7, -2], [8, -2], [9, -2], [10, -2], [11, -2], [12, -2],
  [4, -3], [5, -3], [6, -3], [7, -3], [8, -3], [9, -3], [10, -3], [11, -3],
  [5, -4], [6, -4], [7, -4], [8, -4], [9, -4], [10, -4],
  [6, -5], [7, -5], [8, -5], [9, -5],
];

// 2. Colina dos Pinheiros (North / North-West)
const tilesNorth2: [number, number][] = [
  [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1], [4, -1],
  [-3, -2], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [3, -2], [4, -2],
  [-3, -3], [-2, -3], [-1, -3], [0, -3], [1, -3], [2, -3], [3, -3],
  [-2, -4], [-1, -4], [0, -4], [1, -4], [2, -4],
  [-1, -5], [0, -5], [1, -5],
];

// 3. Pradaria do Sol Nascente (East Meadow)
const tilesEastMeadow: [number, number][] = [
  [14, 2], [15, 2], [16, 2],
  [14, 3], [15, 3], [16, 3], [17, 3], [18, 3],
  [14, 4], [15, 4], [16, 4], [17, 4], [18, 4], [19, 4],
  [14, 5], [15, 5], [16, 5], [17, 5], [18, 5], [19, 5],
  [14, 6], [15, 6], [16, 6], [17, 6], [18, 6],
  [14, 7], [15, 7], [16, 7], [17, 7],
  [14, 8], [15, 8], [16, 8],
];

// 4. Margem dos Salgueiros (South-East Riverbank)
const tilesSouthRiverbank: [number, number][] = [
  [13, 12], [14, 12], [15, 12],
  [12, 13], [13, 13], [14, 13], [15, 13], [16, 13], [17, 13],
  [12, 14], [13, 14], [14, 14], [15, 14], [16, 14], [17, 14], [18, 14],
  [12, 15], [13, 15], [14, 15], [15, 15], [16, 15], [17, 15],
  [13, 16], [14, 16], [15, 16], [16, 16],
  [13, 17], [14, 17], [15, 17],
];

// 5. Campina Dourada (South Pasture)
const tilesSouthPasture: [number, number][] = [
  [3, 14], [4, 14], [5, 14], [6, 14], [7, 14], [8, 14], [9, 14], [10, 14], [11, 14],
  [2, 15], [3, 15], [4, 15], [5, 15], [6, 15], [7, 15], [8, 15], [9, 15], [10, 15], [11, 15],
  [2, 16], [3, 16], [4, 16], [5, 16], [6, 16], [7, 16], [8, 16], [9, 16], [10, 16],
  [3, 17], [4, 17], [5, 17], [6, 17], [7, 17], [8, 17], [9, 17],
  [4, 18], [5, 18], [6, 18], [7, 18], [8, 18],
];

// 6. Recanto dos Carvalhos Antigos (South-West Grove)
const tilesSouthWestGrove: [number, number][] = [
  [-2, 10], [-1, 10], [0, 10],
  [-3, 11], [-2, 11], [-1, 11], [0, 11], [1, 11], [2, 11],
  [-3, 12], [-2, 12], [-1, 12], [0, 12], [1, 12], [2, 12],
  [-3, 13], [-2, 13], [-1, 13], [0, 13], [1, 13],
  [-2, 14], [-1, 14], [0, 14], [1, 14],
  [-1, 15], [0, 15], [1, 15],
];

// 7. Platô das Nuvens (Far North Highland)
const tilesFarNorth: [number, number][] = [
  [2, -6], [3, -6], [4, -6], [5, -6], [6, -6], [7, -6], [8, -6], [9, -6], [10, -6], [11, -6], [12, -6],
  [1, -7], [2, -7], [3, -7], [4, -7], [5, -7], [6, -7], [7, -7], [8, -7], [9, -7], [10, -7], [11, -7], [12, -7],
  [1, -8], [2, -8], [3, -8], [4, -8], [5, -8], [6, -8], [7, -8], [8, -8], [9, -8], [10, -8], [11, -8],
  [2, -9], [3, -9], [4, -9], [5, -9], [6, -9], [7, -9], [8, -9], [9, -9], [10, -9],
  [3, -10], [4, -10], [5, -10], [6, -10], [7, -10], [8, -10],
];

// 8. Terraço da Cascata (Far East Vista)
const tilesEastTerrace: [number, number][] = [
  [19, 7], [20, 7], [21, 7],
  [18, 8], [19, 8], [20, 8], [21, 8], [22, 8],
  [18, 9], [19, 9], [20, 9], [21, 9], [22, 9], [23, 9],
  [18, 10], [19, 10], [20, 10], [21, 10], [22, 10], [23, 10],
  [18, 11], [19, 11], [20, 11], [21, 11], [22, 11],
  [19, 12], [20, 12], [21, 12],
];

export const EXPANSION_PARCELS: ExpansionParcel[] = [
  {
    id: 'exp_north_1',
    name: 'Bosque do Riacho',
    subtitle: 'Clareira Norte Suave',
    description: 'Um vale verdejante com carvalhos nobres, arbustos de amoras e solo muito fértil para plantações.',
    biome: 'woodland',
    requiredLevel: 7,
    cost: {
      coins: 800,
      items: { land_map: 2, marker_stake: 2, brick: 1 },
    },
    tiles: createOrganicParcelTiles(tilesNorth1, 4, 12, -5, -1),
    bounds: { minX: 4, maxX: 12, minY: -5, maxY: -1 },
    center: { x: 7.5, y: -3 },
    stakePoints: [
      { x: 4, y: -1.5 },
      { x: 8, y: -5 },
      { x: 12, y: -2 },
      { x: 8, y: -1 },
    ],
    x: 4,
    y: -5,
    width: 9,
    height: 5,
  },
  {
    id: 'exp_north_2',
    name: 'Colina dos Pinheiros',
    subtitle: 'Encosta do Vento Fresco',
    description: 'Colina elevada com pinheiros alpinos frondosos e pedras graníticas decorativas para expandir seu rancho.',
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
    id: 'exp_east_meadow',
    name: 'Pradaria do Sol Nascente',
    subtitle: 'Terraço Oriental Florido',
    description: 'Platô banhado pelos primeiros raios de sol da manhã, perfeito para novos currais de animais e árvores frutíferas.',
    biome: 'fruit_meadow',
    requiredLevel: 12,
    cost: {
      coins: 2000,
      items: { land_map: 4, marker_stake: 4, brick: 3 },
    },
    tiles: createOrganicParcelTiles(tilesEastMeadow, 14, 19, 2, 8),
    bounds: { minX: 14, maxX: 19, minY: 2, maxY: 8 },
    center: { x: 16.5, y: 5 },
    stakePoints: [
      { x: 14, y: 2 },
      { x: 18.5, y: 3.5 },
      { x: 19, y: 6 },
      { x: 16, y: 8 },
    ],
    x: 14,
    y: 2,
    width: 6,
    height: 7,
  },
  {
    id: 'exp_south_riverbank',
    name: 'Margem dos Salgueiros',
    subtitle: 'Beira do Canal de Pesca',
    description: 'Terreno cênico margeando o rio com brisa fresca, pedras polidas e espaço amplo para estruturas produtivas.',
    biome: 'riverbank',
    requiredLevel: 14,
    cost: {
      coins: 2800,
      items: { land_map: 5, marker_stake: 5, brick: 4 },
    },
    tiles: createOrganicParcelTiles(tilesSouthRiverbank, 12, 18, 12, 17),
    bounds: { minX: 12, maxX: 18, minY: 12, maxY: 17 },
    center: { x: 15, y: 14.5 },
    stakePoints: [
      { x: 13, y: 12 },
      { x: 18, y: 14 },
      { x: 16, y: 17 },
      { x: 12, y: 15 },
    ],
    x: 12,
    y: 12,
    width: 7,
    height: 6,
  },
  {
    id: 'exp_south_pasture',
    name: 'Campina Dourada',
    subtitle: 'Pasto Sul da Fazenda',
    description: 'Vasta extensão de grama macia e ensolarada, ideal para grandes plantios e novas fábricas.',
    biome: 'pasture',
    requiredLevel: 16,
    cost: {
      coins: 3600,
      items: { land_map: 6, marker_stake: 6, brick: 5 },
    },
    tiles: createOrganicParcelTiles(tilesSouthPasture, 2, 11, 14, 18),
    bounds: { minX: 2, maxX: 11, minY: 14, maxY: 18 },
    center: { x: 6.5, y: 16 },
    stakePoints: [
      { x: 2.5, y: 14.5 },
      { x: 11, y: 14.5 },
      { x: 8, y: 18 },
      { x: 4, y: 18 },
    ],
    x: 2,
    y: 14,
    width: 10,
    height: 5,
  },
  {
    id: 'exp_south_west_grove',
    name: 'Recanto dos Carvalhos',
    subtitle: 'Bosque Ancestral Sombreado',
    description: 'Bosque centenário próximo à trilha de entrada, repleto de flores silvestres e troncos rústicos.',
    biome: 'ancient_grove',
    requiredLevel: 18,
    cost: {
      coins: 4400,
      items: { land_map: 7, marker_stake: 7, brick: 6 },
    },
    tiles: createOrganicParcelTiles(tilesSouthWestGrove, -3, 2, 10, 15),
    bounds: { minX: -3, maxX: 2, minY: 10, maxY: 15 },
    center: { x: -0.5, y: 12.5 },
    stakePoints: [
      { x: -2, y: 10 },
      { x: 2, y: 11 },
      { x: 1, y: 15 },
      { x: -3, y: 13 },
    ],
    x: -3,
    y: 10,
    width: 6,
    height: 6,
  },
  {
    id: 'exp_north_west_1',
    name: 'Platô das Nuvens',
    subtitle: 'Mirante dos Picos Altos',
    description: 'O mais nobre território do norte com vista panorâmica de toda a fazenda e ar puro das montanhas.',
    biome: 'highland',
    requiredLevel: 21,
    cost: {
      coins: 5500,
      items: { land_map: 9, marker_stake: 9, brick: 8 },
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
    id: 'exp_far_east_terrace',
    name: 'Terraço da Cascata',
    subtitle: 'Vista do Desfiladeiro',
    description: 'Terraço oriental exuberante próximo às quedas d’água com formações rochosas majestosas e brisa constante.',
    biome: 'waterfall_terrace',
    requiredLevel: 24,
    cost: {
      coins: 7000,
      items: { land_map: 11, marker_stake: 11, brick: 10 },
    },
    tiles: createOrganicParcelTiles(tilesEastTerrace, 18, 23, 7, 12),
    bounds: { minX: 18, maxX: 23, minY: 7, maxY: 12 },
    center: { x: 20.5, y: 9.5 },
    stakePoints: [
      { x: 18.5, y: 8 },
      { x: 23, y: 9 },
      { x: 21, y: 12 },
      { x: 18.5, y: 11 },
    ],
    x: 18,
    y: 7,
    width: 6,
    height: 6,
  },
];

/**
 * Backward-compatibility aliases for any older save files:
 * maps legacy IDs to the active canonical parcels.
 */
export const LEGACY_PARCEL_ALIASES: Record<string, string> = {
  exp_north_west_2: 'exp_north_2',
  exp_far_north: 'exp_north_west_1',
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
