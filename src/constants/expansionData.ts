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
  tiles: GridCoord[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  center: GridCoord;
  stakePoints: GridCoord[];
  lake?: {
    x: number;
    y: number;
    name?: string;
    radiusX?: number;
    radiusY?: number;
  };
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates contiguous tiles spanning [minX..maxX) x [minY..maxY) with ZERO gaps.
 */
function createContiguousTiles(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): GridCoord[] {
  const tiles: GridCoord[] = [];
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      tiles.push({ x, y });
    }
  }
  return tiles;
}

/**
 * Canonical contiguous expansion parcels matching the Hay Day layout.
 * Contiguous 5x5 grid plots with shared stone walls and 0 gaps.
 */
export const EXPANSION_PARCELS: ExpansionParcel[] = [
  // --- NORTH-EAST EXPANSION ROW 1 (Across North Road, contiguous Y: -5..0) ---
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
    tiles: createContiguousTiles(4, 9, -5, 0),
    bounds: { minX: 4, maxX: 9, minY: -5, maxY: 0 },
    center: { x: 6.5, y: -2.5 },
    stakePoints: [
      { x: 4, y: -5 },
      { x: 9, y: -5 },
      { x: 9, y: 0 },
      { x: 4, y: 0 },
    ],
    lake: {
      x: 6.5,
      y: -2.5,
      name: 'Lago dos Cisnes',
      radiusX: 42,
      radiusY: 23,
    },
    x: 4,
    y: -5,
    width: 5,
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
    tiles: createContiguousTiles(9, 14, -5, 0),
    bounds: { minX: 9, maxX: 14, minY: -5, maxY: 0 },
    center: { x: 11.5, y: -2.5 },
    stakePoints: [
      { x: 9, y: -5 },
      { x: 14, y: -5 },
      { x: 14, y: 0 },
      { x: 9, y: 0 },
    ],
    x: 9,
    y: -5,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_south_valley',
    name: 'Vale Verde do Leste',
    subtitle: 'Campos Férteis das Macieiras',
    description: 'Vasto terreno fértil que expande a fazenda ao norte da estrada, ideal para pomares e celeiros adicionais.',
    biome: 'fruit_meadow',
    requiredLevel: 14,
    cost: {
      coins: 2200,
      items: { land_map: 4, marker_stake: 4, brick: 3 },
    },
    tiles: createContiguousTiles(14, 19, -5, 0),
    bounds: { minX: 14, maxX: 19, minY: -5, maxY: 0 },
    center: { x: 16.5, y: -2.5 },
    stakePoints: [
      { x: 14, y: -5 },
      { x: 19, y: -5 },
      { x: 19, y: 0 },
      { x: 14, y: 0 },
    ],
    x: 14,
    y: -5,
    width: 5,
    height: 5,
  },

  // --- FAR NORTH EXPANSION ROW 2 (Contiguous Y: -10..-5) ---
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
    tiles: createContiguousTiles(4, 9, -10, -5),
    bounds: { minX: 4, maxX: 9, minY: -10, maxY: -5 },
    center: { x: 6.5, y: -7.5 },
    stakePoints: [
      { x: 4, y: -10 },
      { x: 9, y: -10 },
      { x: 9, y: -5 },
      { x: 4, y: -5 },
    ],
    x: 4,
    y: -10,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_highland_ridge',
    name: 'Cume dos Pinhais',
    subtitle: 'Platô Superior do Vento',
    description: 'Terreno elevado e fresco com abundância de pinheiros, pedras rústicas e espaço para novas construções.',
    biome: 'pine_hill',
    requiredLevel: 16,
    cost: {
      coins: 2800,
      items: { land_map: 5, marker_stake: 5, brick: 4 },
    },
    tiles: createContiguousTiles(9, 14, -10, -5),
    bounds: { minX: 9, maxX: 14, minY: -10, maxY: -5 },
    center: { x: 11.5, y: -7.5 },
    stakePoints: [
      { x: 9, y: -10 },
      { x: 14, y: -10 },
      { x: 14, y: -5 },
      { x: 9, y: -5 },
    ],
    x: 9,
    y: -10,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_south_meadow',
    name: 'Pradaria das Borboletas',
    subtitle: 'Encosta Florida das Borboletas',
    description: 'Belo campo florido no platô norte com um lago cristalino e abundância de flores silvestres.',
    biome: 'woodland',
    requiredLevel: 17,
    cost: {
      coins: 3100,
      items: { land_map: 5, marker_stake: 5, brick: 4 },
    },
    tiles: createContiguousTiles(14, 19, -10, -5),
    bounds: { minX: 14, maxX: 19, minY: -10, maxY: -5 },
    center: { x: 16.5, y: -7.5 },
    stakePoints: [
      { x: 14, y: -10 },
      { x: 19, y: -10 },
      { x: 19, y: -5 },
      { x: 14, y: -5 },
    ],
    lake: {
      x: 16.5,
      y: -7.5,
      name: 'Lago das Ninfas',
      radiusX: 38,
      radiusY: 20,
    },
    x: 14,
    y: -10,
    width: 5,
    height: 5,
  },

  // --- EAST EXPANSION COLUMN 1 (Right of base farm 0..13, Contiguous X: 14..19) ---
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
    tiles: createContiguousTiles(14, 19, 0, 5),
    bounds: { minX: 14, maxX: 19, minY: 0, maxY: 5 },
    center: { x: 16.5, y: 2.5 },
    stakePoints: [
      { x: 14, y: 0 },
      { x: 19, y: 0 },
      { x: 19, y: 5 },
      { x: 14, y: 5 },
    ],
    lake: {
      x: 16.8,
      y: 2.5,
      name: 'Lago Esmeralda',
      radiusX: 46,
      radiusY: 25,
    },
    x: 14,
    y: 0,
    width: 5,
    height: 5,
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
    tiles: createContiguousTiles(14, 19, 5, 10),
    bounds: { minX: 14, maxX: 19, minY: 5, maxY: 10 },
    center: { x: 16.5, y: 7.5 },
    stakePoints: [
      { x: 14, y: 5 },
      { x: 19, y: 5 },
      { x: 19, y: 10 },
      { x: 14, y: 10 },
    ],
    x: 14,
    y: 5,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_south_grove',
    name: 'Bosque dos Cedros',
    subtitle: 'Reserva Selvagem do Sudeste',
    description: 'Bosque sereno e fértil repleto de cedros majestosos, rochedos e um lago tranquilo para relaxar e produzir.',
    biome: 'woodland',
    requiredLevel: 19,
    cost: {
      coins: 3600,
      items: { land_map: 5, marker_stake: 5, brick: 4 },
    },
    tiles: createContiguousTiles(14, 19, 10, 15),
    bounds: { minX: 14, maxX: 19, minY: 10, maxY: 15 },
    center: { x: 16.5, y: 12.5 },
    stakePoints: [
      { x: 14, y: 10 },
      { x: 19, y: 10 },
      { x: 19, y: 15 },
      { x: 14, y: 15 },
    ],
    lake: {
      x: 16.5,
      y: 12.5,
      name: 'Lago dos Cedros',
      radiusX: 44,
      radiusY: 24,
    },
    x: 14,
    y: 10,
    width: 5,
    height: 5,
  },

  // --- FAR EAST EXPANSION COLUMN 2 (Contiguous X: 19..24) ---
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
    tiles: createContiguousTiles(19, 24, 0, 5),
    bounds: { minX: 19, maxX: 24, minY: 0, maxY: 5 },
    center: { x: 21.5, y: 2.5 },
    stakePoints: [
      { x: 19, y: 0 },
      { x: 24, y: 0 },
      { x: 24, y: 5 },
      { x: 19, y: 5 },
    ],
    x: 19,
    y: 0,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_sunflower_plains',
    name: 'Planície dos Girassóis',
    subtitle: 'Vasto Território Oriental',
    description: 'Planície ensolarada de solo fértil que se estende ao leste, perfeita para expandir grandes complexos de plantio e fábricas.',
    biome: 'fruit_meadow',
    requiredLevel: 23,
    cost: {
      coins: 5000,
      items: { land_map: 7, marker_stake: 7, brick: 6 },
    },
    tiles: createContiguousTiles(19, 24, 5, 10),
    bounds: { minX: 19, maxX: 24, minY: 5, maxY: 10 },
    center: { x: 21.5, y: 7.5 },
    stakePoints: [
      { x: 19, y: 5 },
      { x: 24, y: 5 },
      { x: 24, y: 10 },
      { x: 19, y: 10 },
    ],
    x: 19,
    y: 5,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_far_east_plateau',
    name: 'Platô Dourado do Leste',
    subtitle: 'Horizonte do Sol Nascente',
    description: 'Platô elevado no extremo leste com visão deslumbrante e espaço perfeito para fábricas modernas.',
    biome: 'fruit_meadow',
    requiredLevel: 26,
    cost: {
      coins: 6200,
      items: { land_map: 8, marker_stake: 8, brick: 7 },
    },
    tiles: createContiguousTiles(19, 24, 10, 15),
    bounds: { minX: 19, maxX: 24, minY: 10, maxY: 15 },
    center: { x: 21.5, y: 12.5 },
    stakePoints: [
      { x: 19, y: 10 },
      { x: 24, y: 10 },
      { x: 24, y: 15 },
      { x: 19, y: 15 },
    ],
    x: 19,
    y: 10,
    width: 5,
    height: 5,
  },

  // --- WEST EXPANSION (Past the Country Road, Contiguous X: -5..0) ---
  {
    id: 'exp_west_pasture',
    name: 'Pasto do Pôr do Sol',
    subtitle: 'Colinas Suaves do Oeste',
    description: 'Pasto amplo e plano a oeste da fazenda, ideal para criação de animais, plantações e pomares sob o sol poente.',
    biome: 'pasture',
    requiredLevel: 12,
    cost: {
      coins: 1600,
      items: { land_map: 3, marker_stake: 3, brick: 2 },
    },
    tiles: createContiguousTiles(-5, 0, 0, 5),
    bounds: { minX: -5, maxX: 0, minY: 0, maxY: 5 },
    center: { x: -2.5, y: 2.5 },
    stakePoints: [
      { x: -5, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 5 },
      { x: -5, y: 5 },
    ],
    x: -5,
    y: 0,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_south_west_slopes',
    name: 'Encosta dos Carvalhos',
    subtitle: 'Bosque Suave do Poente',
    description: 'Colina arborizada ao noroeste da fazenda, com grandes carvalhos e solo rico para pastagem.',
    biome: 'woodland',
    requiredLevel: 20,
    cost: {
      coins: 3900,
      items: { land_map: 6, marker_stake: 6, brick: 5 },
    },
    tiles: createContiguousTiles(-5, 0, 5, 10),
    bounds: { minX: -5, maxX: 0, minY: 5, maxY: 10 },
    center: { x: -2.5, y: 7.5 },
    stakePoints: [
      { x: -5, y: 5 },
      { x: 0, y: 5 },
      { x: 0, y: 10 },
      { x: -5, y: 10 },
    ],
    x: -5,
    y: 5,
    width: 5,
    height: 5,
  },
  {
    id: 'exp_mountain_view',
    name: 'Mirante da Montanha',
    subtitle: 'Pico dos Pinheiros Alpinos',
    description: 'O ponto mais alto da região com ar puro da montanha, grandes depósitos rochosos de minério e vista exuberante de todo o vale.',
    biome: 'highland',
    requiredLevel: 28,
    cost: {
      coins: 7200,
      items: { land_map: 9, marker_stake: 9, brick: 8 },
    },
    tiles: createContiguousTiles(-5, 0, 10, 15),
    bounds: { minX: -5, maxX: 0, minY: 10, maxY: 15 },
    center: { x: -2.5, y: 12.5 },
    stakePoints: [
      { x: -5, y: 10 },
      { x: 0, y: 10 },
      { x: 0, y: 15 },
      { x: -5, y: 15 },
    ],
    x: -5,
    y: 10,
    width: 5,
    height: 5,
  },
];

export const LEGACY_PARCEL_ALIASES: Record<string, string> = {
  exp_north_west_2: 'exp_north_2',
  exp_far_north: 'exp_north_west_1',
  exp_south_west_grove: 'exp_east_valley',
  exp_south_pasture: 'exp_east_meadow',
  exp_south_riverbank: 'exp_far_east_terrace',
};

export function isTileInBaseFarm(x: number, y: number): boolean {
  return x >= 0 && x <= 13 && y >= 0 && y <= 13;
}

export function isTileInParcel(parcel: ExpansionParcel, x: number, y: number): boolean {
  if (
    x < parcel.bounds.minX ||
    x >= parcel.bounds.maxX ||
    y < parcel.bounds.minY ||
    y >= parcel.bounds.maxY
  ) {
    return false;
  }
  return parcel.tiles.some((t) => t.x === x && t.y === y);
}

export function getParcelByTile(x: number, y: number): ExpansionParcel | undefined {
  return EXPANSION_PARCELS.find((p) => isTileInParcel(p, x, y));
}
