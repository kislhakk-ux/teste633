export type ItemId =
  // Crops & Produce
  | 'wheat'
  | 'corn'
  | 'carrot'
  | 'sugarcane'
  | 'soybean'
  | 'pumpkin'
  | 'apple'
  // Animal Products
  | 'egg'
  | 'milk'
  | 'bacon'
  | 'wool'
  // Animal Feeds
  | 'chicken_feed'
  | 'cow_feed'
  | 'pig_feed'
  | 'sheep_feed'
  // Bakery
  | 'bread'
  | 'corn_bread'
  | 'cookie'
  | 'carrot_pie'
  | 'pizza'
  // Dairy
  | 'cream'
  | 'butter'
  | 'cheese'
  // Sugar Mill
  | 'brown_sugar'
  | 'white_sugar'
  | 'syrup'
  // BBQ Grill
  | 'pancake'
  | 'bacon_and_eggs'
  | 'burger'
  // Popcorn Pot
  | 'popcorn'
  | 'butter_popcorn'
  // Expansion & Tools
  | 'wood_plank'
  | 'nail'
  | 'screw'
  | 'bolt'
  | 'axe';

export type StorageType = 'silo' | 'barn';

export interface ItemDef {
  id: ItemId;
  name: string;
  category: 'crop' | 'animal_product' | 'feed' | 'food' | 'material';
  storage: StorageType;
  icon: string;
  basePrice: number;
  minLevel: number;
  description: string;
}

export interface CropDef {
  id: ItemId;
  name: string;
  growTimeSeconds: number;
  harvestYield: number;
  xp: number;
  minLevel: number;
  icon: string;
  color: string;
  growStages: string[]; // Emoji or visual representation
}

export type AnimalType = 'chicken' | 'cow' | 'pig' | 'sheep';

export interface AnimalPenDef {
  type: AnimalType;
  name: string;
  icon: string;
  penName: string;
  feedId: ItemId;
  produceId: ItemId;
  produceTimeSeconds: number;
  xp: number;
  maxAnimalsPerPen: number;
  cost: number;
  minLevel: number;
}

export type BuildingType =
  | 'bakery'
  | 'feed_mill'
  | 'dairy'
  | 'sugar_mill'
  | 'bbq_grill'
  | 'popcorn_pot';

export interface Recipe {
  id: ItemId;
  name: string;
  building: BuildingType;
  produceTimeSeconds: number;
  xp: number;
  ingredients: { itemId: ItemId; count: number }[];
  minLevel: number;
}

export interface BuildingDef {
  type: BuildingType;
  name: string;
  icon: string;
  cost: number;
  minLevel: number;
  description: string;
  baseQueueSlots: number;
}

export type TileType =
  | 'grass'
  | 'dirt'
  | 'water'
  | 'stone_path'
  | 'crop_plot'
  | 'animal_pen'
  | 'building'
  | 'farmhouse'
  | 'silo'
  | 'barn'
  | 'order_board'
  | 'roadside_shop'
  | 'lucky_wheel'
  | 'decoration';

export interface GridPos {
  x: number;
  y: number;
}

export interface CropPlotData {
  cropId: ItemId | null;
  plantedAt: number | null; // timestamp ms
  growDuration: number; // in seconds
}

export interface AnimalState {
  id: string;
  fedAt: number | null; // timestamp ms
  isReady: boolean;
}

export interface AnimalPenData {
  animalType: AnimalType;
  animals: AnimalState[];
}

export interface ProductionQueueItem {
  id: string;
  recipeId: ItemId;
  durationSeconds: number;
  startedAt: number; // timestamp ms
  completed: boolean;
}

export interface BuildingData {
  buildingType: BuildingType;
  queueSlots: number;
  queue: ProductionQueueItem[];
  completedItems: ItemId[];
  totalCrafted?: number;
  masteryLevel?: number;
}

export type DecorationType =
  | 'fence_wood'
  | 'flower_red'
  | 'flower_yellow'
  | 'hay_bale'
  | 'scarecrow'
  | 'windmill'
  | 'tractor'
  | 'apple_tree';

export interface DecorationDef {
  type: DecorationType;
  name: string;
  icon: string;
  cost: number;
  minLevel: number;
  width: number;
  height: number;
}

export interface FarmEntity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: TileType;
  cropData?: CropPlotData;
  animalData?: AnimalPenData;
  buildingData?: BuildingData;
  decorationType?: DecorationType;
  appleTreeData?: {
    harvestsLeft: number;
    readyAt: number;
  };
  anchorX?: number;
  anchorY?: number;
}

export interface OrderReq {
  itemId: ItemId;
  count: number;
}

export interface TruckOrder {
  id: string;
  characterName: string;
  characterAvatar: string;
  dialogue: string;
  items: OrderReq[];
  rewardCoins: number;
  rewardXp: number;
  state: 'available' | 'delivering' | 'trashing';
  deliveredAt?: number;
  availableAt?: number;
}

export interface RoadsideBox {
  id: number;
  itemId: ItemId | null;
  count: number;
  price: number;
  isSold: boolean;
  soldAt?: number;
  advertised: boolean;
}

export interface FarmVisitor {
  id: string;
  name: string;
  avatar: string;
  requestedItem: ItemId;
  count: number;
  offeredCoins: number;
  dialogue: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  rewardGems: number;
  rewardCoins: number;
  claimed: boolean;
}

export interface GameStats {
  totalHarvested: number;
  totalAnimalCollected: number;
  totalCrafted: number;
  totalOrdersCompleted: number;
  totalCoinsEarned: number;
  wheelSpins: number;
}

export interface GameState {
  farmName: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  siloLevel: number; // each level adds +25 capacity
  barnLevel: number; // each level adds +25 capacity
  inventory: Record<ItemId, number>;
  entities: FarmEntity[];
  orders: TruckOrder[];
  truckDeliveringUntil: number | null;
  roadsideBoxes: RoadsideBox[];
  activeVisitor: FarmVisitor | null;
  lastLuckySpinDate: string | null;
  achievements: Achievement[];
  stats: GameStats;
  soundEnabled: boolean;
  musicEnabled: boolean;
  graphicsStyle?: '3d_rendered' | 'vector';
}
