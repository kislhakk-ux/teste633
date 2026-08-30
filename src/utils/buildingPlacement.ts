import { FarmEntity, GridPos } from '../types/game';

export const MAP_SIZE = 14;

// Blocked or reserved zones (e.g. road / map edges)
export const RESERVED_AREAS: { x: number; y: number; width: number; height: number; name?: string }[] = [
  // Left border / truck road path
  { x: 0, y: 0, width: 1, height: MAP_SIZE, name: 'road' },
];

export interface PlacementValidationResult {
  isValid: boolean;
  reason?: 'out_of_bounds' | 'overlap' | 'reserved_area';
  overlappingEntityId?: string;
}

/**
 * Checks whether a rectangular area [x, x+width) * [y, y+height) is completely within map bounds.
 */
export function isWithinMapBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  mapSize = MAP_SIZE
): boolean {
  return x >= 1 && y >= 1 && x + width <= mapSize && y + height <= mapSize;
}

/**
 * Checks AABB rectangle intersection between two entities with an optional margin.
 */
export function isOverlapping(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number,
  margin = 0
): boolean {
  return (
    x1 < x2 + w2 + margin &&
    x1 + w1 + margin > x2 &&
    y1 < y2 + h2 + margin &&
    y1 + h1 + margin > y2
  );
}

/**
 * Centralized space occupation validator.
 * Agnostic to building type. Works for all existing and future buildings/structures.
 * 
 * @param targetX Target grid X coordinate
 * @param targetY Target grid Y coordinate
 * @param width Width in grid units (e.g. 1 or 2)
 * @param height Height in grid units (e.g. 1 or 2)
 * @param entities Current list of farm entities
 * @param movingEntityId Optional entity ID to ignore (when repositioning an existing building)
 * @param margin Optional spacing margin between buildings (default: 0)
 */
export function validatePlacement(
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  entities: FarmEntity[],
  movingEntityId?: string | null,
  margin = 0
): PlacementValidationResult {
  // 1. Boundary check: must be inside playable map limits
  if (!isWithinMapBounds(targetX, targetY, width, height)) {
    return { isValid: false, reason: 'out_of_bounds' };
  }

  // 2. Reserved areas check (e.g. main entrance road)
  for (const reserved of RESERVED_AREAS) {
    if (
      isOverlapping(
        targetX,
        targetY,
        width,
        height,
        reserved.x,
        reserved.y,
        reserved.width,
        reserved.height,
        0
      )
    ) {
      return { isValid: false, reason: 'reserved_area' };
    }
  }

  // 3. Collision with all other farm entities (buildings, pens, crop plots, trees, decorations)
  for (const ent of entities) {
    if (movingEntityId && ent.id === movingEntityId) {
      continue; // Ignore the building being moved
    }

    const entW = ent.width || 1;
    const entH = ent.height || 1;

    if (isOverlapping(targetX, targetY, width, height, ent.x, ent.y, entW, entH, margin)) {
      return { isValid: false, reason: 'overlap', overlappingEntityId: ent.id };
    }
  }

  return { isValid: true };
}

/**
 * Returns true if target placement is valid and free of collisions.
 */
export function isValidPlacement(
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  entities: FarmEntity[],
  movingEntityId?: string | null,
  margin = 0
): boolean {
  return validatePlacement(targetX, targetY, width, height, entities, movingEntityId, margin).isValid;
}

/**
 * Finds the first available non-colliding position on the map.
 */
export function findNextAvailablePosition(
  width: number,
  height: number,
  entities: FarmEntity[],
  margin = 0
): GridPos {
  for (let gy = 2; gy <= MAP_SIZE - height; gy++) {
    for (let gx = 1; gx <= MAP_SIZE - width; gx++) {
      if (isValidPlacement(gx, gy, width, height, entities, null, margin)) {
        return { x: gx, y: gy };
      }
    }
  }
  return { x: 5, y: 5 };
}
