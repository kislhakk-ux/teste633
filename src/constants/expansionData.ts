import { ItemId } from '../types/game';

export interface ExpansionParcel {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  requiredLevel: number;
  cost: {
    coins: number;
    items: Partial<Record<ItemId, number>>;
  };
}

// "Sempre para cima" -> Using negative X and Y coordinates to expand North in isometric grid
export const EXPANSION_PARCELS: ExpansionParcel[] = [
  {
    id: 'exp_north_1',
    name: 'Clareira Norte',
    x: 1,
    y: -5,
    width: 6,
    height: 6,
    requiredLevel: 10,
    cost: {
      coins: 1000,
      items: { land_map: 2, marker_stake: 2, brick: 2 },
    },
  },
  {
    id: 'exp_north_2',
    name: 'Bosque Superior',
    x: 7,
    y: -5,
    width: 7,
    height: 6,
    requiredLevel: 12,
    cost: {
      coins: 1500,
      items: { land_map: 4, marker_stake: 3, brick: 3 },
    },
  },
  {
    id: 'exp_north_west_1',
    name: 'Colina Alta',
    x: -5,
    y: 1,
    width: 6,
    height: 7,
    requiredLevel: 15,
    cost: {
      coins: 2000,
      items: { land_map: 5, marker_stake: 5, brick: 5 },
    },
  },
  {
    id: 'exp_north_west_2',
    name: 'Vale dos Pinheiros',
    x: -5,
    y: 8,
    width: 6,
    height: 6,
    requiredLevel: 18,
    cost: {
      coins: 2500,
      items: { land_map: 8, marker_stake: 6, brick: 8 },
    },
  },
  {
    id: 'exp_far_north',
    name: 'Platô das Nuvens',
    x: 1,
    y: -12,
    width: 13,
    height: 7,
    requiredLevel: 22,
    cost: {
      coins: 4000,
      items: { land_map: 12, marker_stake: 10, brick: 10 },
    },
  }
];

export function isTileInBaseFarm(x: number, y: number): boolean {
  // O espaço 13x13 original da fazenda (1 a 13)
  return x >= 1 && x <= 13 && y >= 1 && y <= 13;
}
