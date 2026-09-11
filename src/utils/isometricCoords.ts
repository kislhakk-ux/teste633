/**
 * Central Isometric Engine & Coordinate Math
 * Hay Day-style 2:1 Dimetric Projection System
 * 
 * Rules:
 * 1. The grid plane is the absolute reference.
 * 2. All objects, shadows, and characters have a defined ground footpoint.
 * 3. Positioning is purely mathematical: screen = gridToScreen(gx, gy).
 * 4. Image anchors (anchorX, anchorY) align the contact base with the ground cell.
 * 5. Depth sorting (Z-index) is strictly derived from the front-most footprint edge.
 */

export const TILE_WIDTH = 84;
export const TILE_HEIGHT = 42;
export const HALF_TILE_W = TILE_WIDTH / 2; // 42
export const HALF_TILE_H = TILE_HEIGHT / 2; // 21

/**
 * Converts continuous or integer grid coordinates (gx, gy) to screen pixel coordinates (x, y).
 * This is the SINGLE SOURCE OF TRUTH for all isometric calculations.
 */
export function gridToScreen(gx: number, gy: number): { x: number; y: number } {
  return {
    x: (gx - gy) * HALF_TILE_W,
    y: (gx + gy) * HALF_TILE_H,
  };
}

/**
 * Converts screen pixel coordinates (clientX, clientY) back to grid coordinates (gx, gy),
 * taking into account camera pan and zoom.
 */
export function screenToGrid(
  screenX: number,
  screenY: number,
  pan: { x: number; y: number },
  zoom: number
): { x: number; y: number } {
  const localX = (screenX - pan.x) / zoom;
  const localY = (screenY - pan.y) / zoom;
  const gx = Math.floor(localX / TILE_WIDTH + localY / TILE_HEIGHT);
  const gy = Math.floor(localY / TILE_HEIGHT - localX / TILE_WIDTH);
  return { x: gx, y: gy };
}

/**
 * Visual specification for an isometric asset or entity type.
 */
export interface IsoAnchorDef {
  widthPx: number;      // Fixed width in screen pixels
  heightPx: number;     // Fixed height in screen pixels
  anchorX: number;      // Normalized horizontal anchor (0.5 = horizontal center)
  anchorY: number;      // Normalized vertical anchor (where base touches ground)
  shadow: {
    width: number;      // Elliptical ground shadow width in pixels
    height: number;     // Elliptical ground shadow height in pixels (strictly 2:1 isometric ratio)
    offsetX?: number;   // Optional horizontal offset
    offsetY?: number;   // Optional vertical offset
    opacity?: number;   // Ground shadow opacity
  };
}

/**
 * Complete calculated placement output for rendering an entity on the canvas.
 */
export interface IsoScreenPlacement {
  footpointX: number;   // Screen X of footprint center on ground plane
  footpointY: number;   // Screen Y of footprint center on ground plane
  left: number;         // CSS left (pixels)
  top: number;          // CSS top (pixels)
  transform: string;    // CSS translate(-anchorX%, -anchorY%)
  width: number;        // Display width
  height: number;       // Display height
  depth: number;        // Isometric depth for layering sort
  zIndex: number;       // CSS z-index
  shadow: {
    left: number;
    top: number;
    width: number;
    height: number;
    transform: string;  // translate(-50%, -50%)
    zIndex: number;
    opacity: number;
  };
}

/**
 * Canonical Anchor & Dimension Registry for ALL entities in the game.
 * Supports both 3D Pre-rendered Sprites and Vector art.
 */
export const ISO_ANCHOR_REGISTRY: {
  '3d_rendered': Record<string, IsoAnchorDef>;
  vector: Record<string, IsoAnchorDef>;
} = {
  '3d_rendered': {
    // Farmhouse (2x2) - measured base ground center
    farmhouse: {
      widthPx: 208,
      heightPx: 208,
      anchorX: 0.556,
      anchorY: 0.705,
      shadow: { width: 168, height: 84, opacity: 0.25 },
    },
    // Silo (1x2) - measured base ground center
    silo: {
      widthPx: 160,
      heightPx: 208,
      anchorX: 0.426,
      anchorY: 0.810,
      shadow: { width: 126, height: 63, opacity: 0.25 },
    },
    // Barn (2x2) - measured base ground center
    barn: {
      widthPx: 208,
      heightPx: 208,
      anchorX: 0.521,
      anchorY: 0.752,
      shadow: { width: 168, height: 84, opacity: 0.25 },
    },
    // Order Board (1x1)
    order_board: {
      widthPx: 144,
      heightPx: 144,
      anchorX: 0.422,
      anchorY: 0.790,
      shadow: { width: 84, height: 42, opacity: 0.20 },
    },
    // Roadside Shop (2x1)
    roadside_shop: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.503,
      anchorY: 0.700,
      shadow: { width: 126, height: 63, opacity: 0.22 },
    },
    // Lucky Wheel Truck (2x1)
    lucky_wheel: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.583,
      anchorY: 0.760,
      shadow: { width: 126, height: 63, opacity: 0.22 },
    },
    // Production Machines (2x2)
    bakery: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.507,
      anchorY: 0.662,
      shadow: { width: 168, height: 84, opacity: 0.24 },
    },
    feed_mill: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.521,
      anchorY: 0.681,
      shadow: { width: 168, height: 84, opacity: 0.24 },
    },
    dairy: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.499,
      anchorY: 0.651,
      shadow: { width: 168, height: 84, opacity: 0.24 },
    },
    sugar_mill: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.524,
      anchorY: 0.712,
      shadow: { width: 168, height: 84, opacity: 0.24 },
    },
    popcorn_pot: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.508,
      anchorY: 0.712,
      shadow: { width: 168, height: 84, opacity: 0.24 },
    },
    bbq_grill: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.439,
      anchorY: 0.724,
      shadow: { width: 168, height: 84, opacity: 0.24 },
    },
    honey_extractor: {
      widthPx: 176,
      heightPx: 176,
      anchorX: 0.536,
      anchorY: 0.665,
      shadow: { width: 168, height: 84, opacity: 0.24 },
    },
    // Bee Tree (2x2)
    bee_tree: {
      widthPx: 192,
      heightPx: 192,
      anchorX: 0.501,
      anchorY: 0.743,
      shadow: { width: 140, height: 70, opacity: 0.24 },
    },
    // Nectar Bush (1x1)
    nectar_bush: {
      widthPx: 112,
      heightPx: 112,
      anchorX: 0.500,
      anchorY: 0.733,
      shadow: { width: 70, height: 35, opacity: 0.18 },
    },
    // Dead Obstacles
    dead_tree: {
      widthPx: 128,
      heightPx: 128,
      anchorX: 0.490,
      anchorY: 0.786,
      shadow: { width: 84, height: 42, opacity: 0.20 },
    },
    dead_bush: {
      widthPx: 96,
      heightPx: 96,
      anchorX: 0.500,
      anchorY: 0.750,
      shadow: { width: 70, height: 35, opacity: 0.18 },
    },
    // Crop Plot (1x1) - flat on ground, 0 external shadow
    crop_plot: {
      widthPx: 128,
      heightPx: 96,
      anchorX: 0.500,
      anchorY: 0.385,
      shadow: { width: 84, height: 42, opacity: 0 },
    },
    // Animal Pen (2x2)
    animal_pen: {
      widthPx: 192,
      heightPx: 160,
      anchorX: 0.500,
      anchorY: 0.475,
      shadow: { width: 168, height: 84, opacity: 0.22 },
    },
  },
  vector: {
    // Farmhouse (2x2)
    farmhouse: {
      widthPx: 192,
      heightPx: 176,
      anchorX: 0.5,
      anchorY: 0.728,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    // Silo (1x2)
    silo: {
      widthPx: 160,
      heightPx: 210,
      anchorX: 0.5,
      anchorY: 0.876,
      shadow: { width: 126, height: 63, opacity: 0.45 },
    },
    // Barn (2x2)
    barn: {
      widthPx: 192,
      heightPx: 176,
      anchorX: 0.5,
      anchorY: 0.763,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    // Order Board (1x1)
    order_board: {
      widthPx: 144,
      heightPx: 144,
      anchorX: 0.5,
      anchorY: 0.8875,
      shadow: { width: 84, height: 42, opacity: 0.4 },
    },
    // Roadside Shop (2x1)
    roadside_shop: {
      widthPx: 176,
      heightPx: 160,
      anchorX: 0.5,
      anchorY: 0.761,
      shadow: { width: 126, height: 63, opacity: 0.45 },
    },
    // Lucky Wheel (2x1)
    lucky_wheel: {
      widthPx: 176,
      heightPx: 160,
      anchorX: 0.5,
      anchorY: 0.777,
      shadow: { width: 126, height: 63, opacity: 0.45 },
    },
    // Production Machines (2x2)
    bakery: {
      widthPx: 192,
      heightPx: 176,
      anchorX: 0.5,
      anchorY: 0.747,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    feed_mill: {
      widthPx: 176,
      heightPx: 160,
      anchorX: 0.5,
      anchorY: 0.7625,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    dairy: {
      widthPx: 192,
      heightPx: 176,
      anchorX: 0.5,
      anchorY: 0.742,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    sugar_mill: {
      widthPx: 192,
      heightPx: 176,
      anchorX: 0.5,
      anchorY: 0.747,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    popcorn_pot: {
      widthPx: 192,
      heightPx: 176,
      anchorX: 0.5,
      anchorY: 0.742,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    bbq_grill: {
      widthPx: 192,
      heightPx: 176,
      anchorX: 0.5,
      anchorY: 0.747,
      shadow: { width: 168, height: 84, opacity: 0.45 },
    },
    // Crop Plot (1x1)
    crop_plot: {
      widthPx: 128,
      heightPx: 96,
      anchorX: 0.5,
      anchorY: 0.38,
      shadow: { width: 84, height: 42, opacity: 0.32 },
    },
    // Animal Pen (2x2)
    animal_pen: {
      widthPx: 192,
      heightPx: 160,
      anchorX: 0.5,
      anchorY: 0.46875,
      shadow: { width: 168, height: 84, opacity: 0.38 },
    },
  },
};

/**
 * Anchors for Decorative Objects & Characters
 */
export const ISO_DECORATION_ANCHORS: Record<string, IsoAnchorDef> = {
  scarecrow: {
    widthPx: 96,
    heightPx: 110,
    anchorX: 0.5,
    anchorY: 0.88,
    shadow: { width: 64, height: 32, opacity: 0.4 },
  },
  apple_tree: {
    widthPx: 110,
    heightPx: 130,
    anchorX: 0.5,
    anchorY: 0.88,
    shadow: { width: 80, height: 40, opacity: 0.45 },
  },
  flower_red: {
    widthPx: 84,
    heightPx: 64,
    anchorX: 0.5,
    anchorY: 0.70,
    shadow: { width: 84, height: 42, opacity: 0.35 },
  },
  flower_yellow: {
    widthPx: 84,
    heightPx: 64,
    anchorX: 0.5,
    anchorY: 0.70,
    shadow: { width: 84, height: 42, opacity: 0.35 },
  },
  hay_bale: {
    widthPx: 84,
    heightPx: 64,
    anchorX: 0.5,
    anchorY: 0.75,
    shadow: { width: 84, height: 42, opacity: 0.4 },
  },
  fence_wood: {
    widthPx: 84,
    heightPx: 64,
    anchorX: 0.5,
    anchorY: 0.75,
    shadow: { width: 84, height: 42, opacity: 0.35 },
  },
  windmill: {
    widthPx: 160,
    heightPx: 180,
    anchorX: 0.5,
    anchorY: 0.80,
    shadow: { width: 168, height: 84, opacity: 0.48 },
  },
  tractor: {
    widthPx: 160,
    heightPx: 140,
    anchorX: 0.5,
    anchorY: 0.78,
    shadow: { width: 150, height: 75, opacity: 0.45 },
  },
  // Special dynamic entities
  visitor: {
    widthPx: 64,
    heightPx: 84,
    anchorX: 0.5,
    anchorY: 0.95,
    shadow: { width: 44, height: 22, opacity: 0.45 },
  },
  truck: {
    widthPx: 120,
    heightPx: 96,
    anchorX: 0.5,
    anchorY: 0.80,
    shadow: { width: 90, height: 45, opacity: 0.42 },
  },
};

/**
 * Returns the anchor definition for any entity based on its type and attributes.
 * Falls back to generic mathematical defaults for any newly introduced entity.
 */
export function getEntityAnchorDef(
  entity: {
    type: string;
    width: number;
    height: number;
    buildingData?: { buildingType: string };
    decorationType?: string;
  },
  graphicsStyle: '3d_rendered' | 'vector' | '2d_flat' = '3d_rendered'
): IsoAnchorDef {
  const styleKey = graphicsStyle === 'vector' ? 'vector' : '3d_rendered';
  const styleRegistry = ISO_ANCHOR_REGISTRY[styleKey] || ISO_ANCHOR_REGISTRY['3d_rendered'];

  let def: IsoAnchorDef | undefined;

  // 1. Building types (e.g. bakery, feed_mill)
  if (entity.type === 'building' && entity.buildingData?.buildingType) {
    const bType = entity.buildingData.buildingType;
    if (styleRegistry[bType]) def = { ...styleRegistry[bType] };
  }

  // 2. Direct named buildings (farmhouse, silo, barn, order_board, roadside_shop, lucky_wheel)
  if (!def && styleRegistry[entity.type]) {
    def = { ...styleRegistry[entity.type] };
  }

  // 3. Special dynamic entities (dead obstacles)
  if (!def && (entity.type === 'dead_tree' || entity.type === 'dead_bush' || entity.type === 'bee_tree' || entity.type === 'nectar_bush')) {
    if (styleRegistry[entity.type]) {
      def = { ...styleRegistry[entity.type] };
    } else {
      const isTree = entity.type === 'dead_tree' || entity.type === 'bee_tree';
      def = {
        widthPx: isTree ? 136 : 100,
        heightPx: isTree ? 136 : 100,
        anchorX: 0.5,
        anchorY: 0.5,
        shadow: {
          width: isTree ? 100 : 70,
          height: isTree ? 50 : 35,
          opacity: 0.4,
        }
      };
    }
  }

  if (def) {
    return def;
  }

  // 4. Decorations (scarecrow, apple_tree, windmill, etc.)
  if (entity.type === 'decoration' && entity.decorationType) {
    if (ISO_DECORATION_ANCHORS[entity.decorationType]) {
      return ISO_DECORATION_ANCHORS[entity.decorationType];
    }
  }

  // 5. Fully Generic Fallback: Mathematically derived from footprint dimensions (Rule 12)
  const w = entity.width || 1;
  const h = entity.height || 1;
  const yOffset = (w + h) * 10.5;
  const fallbackHeight = Math.max(84, (w + h) * 42);

  return {
    widthPx: Math.max(84, (w + h) * 42),
    heightPx: fallbackHeight,
    anchorX: 0.5,
    anchorY: 1 - yOffset / fallbackHeight,
    shadow: {
      width: Math.round((w + h) * 42),
      height: Math.round((w + h) * 21),
      opacity: 0.45,
    },
  };
}

/**
 * Central Placement Function:
 * Calculates exact screen coordinates, anchor transformations, depth sorting, and ground shadow
 * for ANY object on the isometric grid.
 */
export function calculateIsoPlacement(
  gridX: number,
  gridY: number,
  width: number,
  height: number,
  anchorDef: IsoAnchorDef,
  customAnchorX?: number,
  customAnchorY?: number
): IsoScreenPlacement {
  // Use explicit entity overrides if present, otherwise canonical anchor
  const ax = customAnchorX !== undefined ? customAnchorX : anchorDef.anchorX;
  const ay = customAnchorY !== undefined ? customAnchorY : anchorDef.anchorY;

  // 1. Precise Ground Footpoint: The center of the entity's footprint on the ground plane
  const groundCenterX = gridX + width / 2;
  const groundCenterY = gridY + height / 2;
  const { x: footpointX, y: footpointY } = gridToScreen(groundCenterX, groundCenterY);

  // 2. Depth sorting: The South-most point of the footprint determines occlusion depth
  // South point = (gridX + width, gridY + height)
  const southX = gridX + width;
  const southY = gridY + height;
  const depth = southX + southY;
  const zIndex = Math.round(depth * 100);

  // 3. Ground shadow: Centered precisely at the footpoint, right below the entity
  const shadowZIndex = Math.max(1, zIndex - 1);

  return {
    footpointX,
    footpointY,
    left: footpointX,
    top: footpointY,
    transform: `translate(-${ax * 100}%, -${ay * 100}%)`,
    width: anchorDef.widthPx,
    height: anchorDef.heightPx,
    depth,
    zIndex,
    shadow: {
      left: footpointX + (anchorDef.shadow.offsetX || 0),
      top: footpointY + (anchorDef.shadow.offsetY || 0),
      width: anchorDef.shadow.width,
      height: anchorDef.shadow.height,
      transform: 'translate(-50%, -50%)',
      zIndex: shadowZIndex,
      opacity: anchorDef.shadow.opacity ?? 0.45,
    },
  };
}
