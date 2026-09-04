export type LakeTerrainType = 'water' | 'shallow_water' | 'grass' | 'sand' | 'pier' | 'cliff';

export interface LakeTerrainTile {
  x: number;
  y: number;
  type: LakeTerrainType;
}

export type LakeEntityType =
  | 'cabin'
  | 'waterfall'
  | 'pine'
  | 'lake_tree'
  | 'lure_maker'
  | 'net_maker'
  | 'duck_salon'
  | 'duck'
  | 'shrimp_trap'
  | 'water_log'
  | 'fishing_spot'
  | 'fisherman'
  | 'rowboat'
  | 'river_stones'
  | 'cattails'
  | 'water_lily'
  | 'lantern_post'
  | 'wooden_fence';

export interface LakeEntity {
  id: string;
  type: LakeEntityType;
  x: number;
  y: number;
  scale?: number;
  rotation?: number; // 0, 90, 180, 270 or flip
  flipH?: boolean;
  name?: string;
  customColor?: string;
}

export interface AdmState {
  isUnlocked: boolean;
  isActive: boolean;
  activeTool: 'select' | 'move' | 'place' | 'terrain' | 'inspect';
  selectedEntityId: string | null;
  selectedEntity: LakeEntity | null;
  entityToPlace: LakeEntityType | null;
  selectionBox: {
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
  } | null;
  selectedTiles: { x: number; y: number }[];
  brushTerrainType: LakeTerrainType;
}
