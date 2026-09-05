import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  FarmEntity,
  ItemId,
  TileType,
  BuildingType,
  AnimalType,
} from '../types/game';
import { CROPS, BUILDINGS, ANIMAL_PENS, ITEMS, DECORATIONS, RECIPES } from '../constants/gameData';
import { EXPANSION_PARCELS } from '../constants/expansionData';
import { sound } from '../utils/sound';

export const ScytheSvg: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="scythe-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#ECEFF1" />
        <stop offset="80%" stopColor="#B0BEC5" />
        <stop offset="100%" stopColor="#78909C" />
      </linearGradient>
      <linearGradient id="scythe-wood" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D7CCC8" />
        <stop offset="40%" stopColor="#8D6E63" />
        <stop offset="100%" stopColor="#4E342E" />
      </linearGradient>
    </defs>
    {/* Wooden Staff/Handle */}
    <path d="M10 42 L28 16" stroke="url(#scythe-wood)" strokeWidth="4.5" strokeLinecap="round" />
    {/* Metallic Connector Ring */}
    <ellipse cx="28" cy="16" rx="3.5" ry="2.5" fill="#CFD8DC" stroke="#455A64" strokeWidth="0.8" />
    {/* Curved Razor Blade */}
    <path
      d="M28 16 C30 6, 44 6, 44 20 C42 24, 34 22, 28 16 Z"
      fill="url(#scythe-metal)"
      stroke="#37474F"
      strokeWidth="1.2"
    />
    {/* Blade Highlight */}
    <path d="M30 14 C36 9, 42 12, 42 19" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);
import { IsoFarmhouse } from './isometric/IsoFarmhouse';
import { IsoBarn } from './isometric/IsoBarn';
import { IsoSilo } from './isometric/IsoSilo';
import { IsoBakery } from './isometric/IsoBakery';
import { IsoFeedMill } from './isometric/IsoFeedMill';
import { IsoDairy } from './isometric/IsoDairy';
import { IsoSugarMill } from './isometric/IsoSugarMill';
import { IsoPopcornPot } from './isometric/IsoPopcornPot';
import { IsoBBQGrill } from './isometric/IsoBBQGrill';
import { IsoHoneyExtractor } from './isometric/IsoHoneyExtractor';
import { IsoSmelter } from './isometric/IsoSmelter';
import { IsoCropPlot } from './isometric/IsoCropPlot';
import { IsoAnimalPen } from './isometric/IsoAnimalPen';
import { IsoOrderBoard } from './isometric/IsoOrderBoard';
import { IsoRoadsideShop } from './isometric/IsoRoadsideShop';
import { IsoLuckyWheel } from './isometric/IsoLuckyWheel';
import { IsoTruck } from './isometric/IsoTruck';
import { IsoNpcVisitor } from './isometric/IsoNpcVisitor';
import { IsoBeeTree } from './isometric/IsoBeeTree';
import { IsoNectarBush } from './isometric/IsoNectarBush';
import { IsoScenery, TreeOakCartoon, TreePineCartoon } from './isometric/IsoScenery';
import { IsoExpansionTerritory } from './isometric/IsoExpansionTerritory';
import {
  Detailed3DOak,
  Detailed3DPine,
  Detailed3DBoulder,
  Detailed3DBush,
  Detailed3DFallenLog,
  Detailed3DFruitTree,
} from './isometric/IsoCartoonFoliage';
import { IsoLushGrass } from './isometric/IsoLushGrass';
import { pseudoRandom, generateForestForParcel } from '../utils/forestGen';
import { Iso3DSpriteBuilding } from './isometric/Iso3DSpriteBuilding';
import { IsoDecoration } from './isometric/IsoDecoration';
import { HD_BUILDING_SPRITES } from '../constants/buildingSprites';
import { validatePlacement, MAP_SIZE } from '../utils/buildingPlacement';
import {
  gridToScreen,
  screenToGrid,
  TILE_WIDTH,
  TILE_HEIGHT,
  calculateIsoPlacement,
  getEntityAnchorDef,
  ISO_DECORATION_ANCHORS,
} from '../utils/isometricCoords';

interface FarmCanvasProps {
  entities: FarmEntity[];
  selectedEntity: FarmEntity | null;
  onSelectEntity: (entity: FarmEntity | null) => void;
  onQuickHarvestCrop: (entityId: string) => void;
  onQuickPlantCrop?: (entityId: string, cropId: string) => void;
  inventory?: Record<string, number>;
  onQuickCollectAnimal: (entityId: string, animalIndex: number) => void;
  onQuickFeedAnimals?: (entityId: string) => void;
  onQuickCollectBuilding: (entityId: string) => void;
  isMovingMode: boolean;
  onMoveEntityPosition?: (entityId: string, newX: number, newY: number) => void;
  truckDeliveringUntil: number | null;
  activeVisitor: any;
  onOpenVisitor: () => void;
  graphicsStyle?: '3d_rendered' | '2d_flat';

  // Live Structure HUD & Storage Gauges
  siloUsed?: number;
  siloCap?: number;
  siloLevel?: number;
  barnUsed?: number;
  barnCap?: number;
  barnLevel?: number;
  playerLevel?: number;
  farmName?: string;
  hasFulfillableOrders?: boolean;
  availableOrdersCount?: number;
  hasRoadsideCoinsToCollect?: boolean;
  canSpinWheel?: boolean;

  // Direct modal callbacks for quick taps
  onOpenSilo?: () => void;
  onOpenBarn?: () => void;
  onOpenFarmhouse?: () => void;
  onOpenOrderBoard?: () => void;
  onOpenRoadsideShop?: () => void;
  onOpenLuckyWheel?: () => void;
  onOpenBeeTree?: (entity: FarmEntity) => void;
  onHarvestNectarFromBush?: (bushId: string) => void;
  onAddNectarToTree?: () => void;
  onRemoveDeadEntity?: (entityId: string) => void;

  // Expansion
  unlockedParcelIds?: string[];
  onOpenExpansionModal?: (parcelId: string) => void;

  // Fishing System
  fishingBoatStatus?: 'broken' | 'repairing' | 'repaired';
  onFishingBoatClick?: () => void;

  // Delivery Boat System
  deliveryBoatStatus?: 'away' | 'docked';
  onDeliveryBoatClick?: () => void;

  // Mining System
  mineStatus?: 'locked' | 'broken' | 'repairing' | 'repaired';
  mineRepairStartedAt?: number;
  onMineClick?: () => void;
}



export const FarmCanvas: React.FC<FarmCanvasProps> = ({
  entities,
  selectedEntity,
  onSelectEntity,
  onQuickHarvestCrop,
  onQuickCollectAnimal,
  onQuickCollectBuilding,
  isMovingMode,
  onMoveEntityPosition,
  truckDeliveringUntil,
  activeVisitor,
  onOpenVisitor,
  graphicsStyle = '2d_flat',
  siloUsed = 0,
  siloCap = 50,
  siloLevel = 1,
  barnUsed = 0,
  barnCap = 50,
  barnLevel = 1,
  playerLevel = 1,
  farmName = 'Fazenda',
  hasFulfillableOrders = false,
  availableOrdersCount = 0,
  hasRoadsideCoinsToCollect = false,
  canSpinWheel = false,
  onOpenSilo,
  onOpenBarn,
  onOpenFarmhouse,
  onOpenOrderBoard,
  onOpenRoadsideShop,
  onOpenLuckyWheel,
  onOpenBeeTree,
  onHarvestNectarFromBush,
  onAddNectarToTree,
  onRemoveDeadEntity,
  inventory = {},
  onQuickPlantCrop,
  onQuickFeedAnimals,
  unlockedParcelIds = [],
  onOpenExpansionModal,
  fishingBoatStatus,
  onFishingBoatClick,
  deliveryBoatStatus,
  onDeliveryBoatClick,
  mineStatus = 'broken',
  mineRepairStartedAt,
  onMineClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.5); // Initial zoom more focused
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [movingEntityId, setMovingEntityId] = useState<string | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [visualBees, setVisualBees] = useState<any[]>([]);

  // 2 seconds long press drag-and-drop state/refs
  const [draggingEntityId, setDraggingEntityId] = useState<string | null>(null);
  const [isLongPressDragging, setIsLongPressDragging] = useState(false);
  const longPressTimerRef = useRef<any>(null);
  const longPressTriggeredRef = useRef<boolean>(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const pressedEntityRef = useRef<any>(null);
  const pointerDownTimeRef = useRef<number>(0);
  const wasMapDraggedRef = useRef<boolean>(false);
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);

  // Dragging tools state
  const [activeDragTool, setActiveDragTool] = useState<string | null>(null);
  const [dragCursorPos, setDragCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 4 progressive loading bars hold-to-drag state
  const [holdingEntityId, setHoldingEntityId] = useState<string | null>(null);
  const [holdingProgress, setHoldingProgress] = useState<number>(0);

  // Currently actively moved or dragged building entity
  const activeMovedEntity = useMemo(() => {
    const id = draggingEntityId || movingEntityId;
    if (!id) return null;
    return entities.find((e) => e.id === id) || null;
  }, [entities, draggingEntityId, movingEntityId]);

  // Real-time space occupation validation
  const placementValidation = useMemo(() => {
    if (!activeMovedEntity || !hoveredTile) return null;
    return validatePlacement(
      hoveredTile.x,
      hoveredTile.y,
      activeMovedEntity.width || 1,
      activeMovedEntity.height || 1,
      entities,
      activeMovedEntity.id
    );
  }, [activeMovedEntity, hoveredTile, entities]);

  // Sync visual bee count based on current Stage * 5
  const beeTree = useMemo(() => entities.find((e) => e.type === 'bee_tree'), [entities]);
  const maxBees = beeTree?.beeTreeData?.beesCount || 0;

  useEffect(() => {
    if (!isInitialized && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      // Center of the base farm (which is 13x13, so around x:6, y:6)
      const centerTile = gridToIso(6, 6);
      
      setPan({
        x: (width / 2) - (centerTile.x * 1.5),
        y: (height / 2) - (centerTile.y * 1.5)
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (maxBees <= 0) {
      setVisualBees([]);
      return;
    }
    setVisualBees((prev) => {
      if (prev.length === maxBees) return prev;
      const nextBees = [...prev];
      if (nextBees.length > maxBees) {
        return nextBees.slice(0, maxBees);
      }
      while (nextBees.length < maxBees) {
        nextBees.push({
          id: Math.random(),
          state: 'idle',
          progress: 0,
          targetBushId: null,
          harvestStart: 0,
          idleStart: Date.now() - Math.random() * 12000, // Stagger initial flight starts
          angleOffset: Math.random() * Math.PI * 2,
          speed: 0.85 + Math.random() * 0.3,
          hasNectar: false,
          archHeight: -25 - Math.random() * 35, // High vs low arches
          wobbleAmp: 8 + Math.random() * 14,      // Wide vs narrow wobbles
          wobbleFreq: 4 + Math.random() * 4,     // Fast vs slow cycles
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
      return nextBees;
    });
  }, [maxBees]);

  // Bee Real-time Flight Simulation Loop
  useEffect(() => {
    if (maxBees <= 0) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      setVisualBees((prevBees) => {
        const tree = entities.find((e) => e.type === 'bee_tree');
        if (!tree || !tree.beeTreeData) return prevBees;

        const currentNectar = tree.beeTreeData.nectarCount;
        const pendingNectar = prevBees.filter((b) => b.hasNectar || b.state === 'harvesting').length;
        const projectedNectar = currentNectar + pendingNectar;

        const activeBushes = entities.filter(
          (e) => e.type === 'nectar_bush' && e.nectarBushData && e.nectarBushData.nectarLeft > 0
        );

        return prevBees.map((bee) => {
          let { state, progress, targetBushId, harvestStart, idleStart, hasNectar } = bee;

          if (state === 'idle') {
            if (!idleStart) {
              idleStart = Date.now();
            }
            const idleTime = Date.now() - idleStart;
            const customIdleDuration = 10000 + (Math.round(bee.id * 10000) % 6000); // 10s to 16s staggered wait
            if (idleTime >= customIdleDuration) {
              if (projectedNectar < 100 && activeBushes.length > 0) {
                const chosenBush = activeBushes[Math.floor(Math.random() * activeBushes.length)];
                state = 'flying_to_bush';
                progress = 0;
                targetBushId = chosenBush.id;
                hasNectar = false;
                idleStart = undefined; // Reset
              }
            }
          } else if (state === 'flying_to_bush') {
            progress += deltaSec * 0.075 * bee.speed; // slower flight (~13s)
            if (progress >= 1) {
              progress = 1;
              state = 'harvesting';
              harvestStart = Date.now();
            }
          } else if (state === 'harvesting') {
            const elapsed = Date.now() - harvestStart;
            if (elapsed >= 10000) { // 10 seconds harvest time
              const targetBush = entities.find((e) => e.id === targetBushId);
              if (targetBush && targetBush.nectarBushData && targetBush.nectarBushData.nectarLeft > 0) {
                if (onHarvestNectarFromBush && targetBushId) {
                  onHarvestNectarFromBush(targetBushId);
                }
                state = 'flying_to_tree';
                progress = 0;
                hasNectar = true;
              } else {
                if (activeBushes.length > 0) {
                  const newBush = activeBushes[Math.floor(Math.random() * activeBushes.length)];
                  state = 'flying_to_bush';
                  progress = 0;
                  targetBushId = newBush.id;
                  hasNectar = false;
                } else {
                  state = 'flying_to_tree';
                  progress = 0;
                  hasNectar = false;
                }
              }
            }
          } else if (state === 'flying_to_tree') {
            progress += deltaSec * 0.075 * bee.speed; // slower flight (~13s)
            if (progress >= 1) {
              progress = 1;
              state = 'idle';
              if (hasNectar) {
                if (onAddNectarToTree) {
                  onAddNectarToTree();
                }
              }
              hasNectar = false;
              targetBushId = null;
              idleStart = Date.now(); // Start tree resting timer
            }
          }

          return { ...bee, state, progress, targetBushId, harvestStart, idleStart, hasNectar };
        });
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [maxBees, entities, onHarvestNectarFromBush, onAddNectarToTree]);

  // Helper to validate and confirm movement safely
  const tryConfirmMove = useCallback(
    (entityId: string, targetX: number, targetY: number) => {
      const ent = entities.find((e) => e.id === entityId);
      if (!ent || !onMoveEntityPosition) return;

      const validation = validatePlacement(
        targetX,
        targetY,
        ent.width || 1,
        ent.height || 1,
        entities,
        entityId
      );

      if (validation.isValid) {
        sound.playDing();
        onMoveEntityPosition(entityId, targetX, targetY);
      } else {
        sound.playWoodHit();
      }
    },
    [entities, onMoveEntityPosition]
  );

  const isCropPlotReady = useCallback((entity: FarmEntity) => {
    if (entity.type !== 'crop_plot' || !entity.cropData) return false;
    const cropData = entity.cropData;
    if (!cropData.cropId || !cropData.plantedAt) return false;
    const elapsed = (Date.now() - cropData.plantedAt) / 1000;
    return elapsed >= cropData.growDuration;
  }, []);

  const cancelHoldGesture = useCallback(() => {
    if (longPressTimerRef.current) {
      clearInterval(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setHoldingEntityId(null);
    setHoldingProgress(0);
  }, []);

  // Floating notifications / animations ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Center the map on initial load
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({
        x: rect.width / 2,
        y: rect.height / 3.5,
      });
    }
  }, []);

  // Touch distance helper for pinch-to-zoom
  const getTouchDistance = (t1: Touch | React.Touch, t2: Touch | React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Central Grid to Screen coordinates (Isometric Projection)
  const gridToIso = useCallback((gx: number, gy: number) => {
    return gridToScreen(gx, gy);
  }, []);

  // Central Screen to Grid coordinates (Accounting for camera pan & zoom)
  const isoToGrid = useCallback((screenX: number, screenY: number) => {
    return screenToGrid(screenX, screenY, pan, zoom);
  }, [pan, zoom]);

  // Pointer events for dragging entity (Hold 2s to drag)
  const handleEntityPointerDown = (entity: any, e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    pointerDownTimeRef.current = Date.now();
    wasMapDraggedRef.current = false;
    longPressTriggeredRef.current = false;
    touchStartPosRef.current = { x: e.clientX, y: e.clientY };
    pressedEntityRef.current = entity;

    // Start 4-segment hold progress interval
    cancelHoldGesture();

    setHoldingEntityId(entity.id);
    setHoldingProgress(0);

    const startTime = Date.now();
    longPressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / 2000) * 100);
      setHoldingProgress(progress);

      if (elapsed >= 2000) {
        clearInterval(longPressTimerRef.current);
        longPressTimerRef.current = null;
        longPressTriggeredRef.current = true;
        sound.playDing();
        setDraggingEntityId(entity.id);
        setIsLongPressDragging(true);
        setHoldingEntityId(null);
        setHoldingProgress(0);
      }
    }, 50);
  };

  const handleEntityPointerUp = (entity: any, e: React.PointerEvent) => {
    cancelHoldGesture();

    const clickDuration = Date.now() - pointerDownTimeRef.current;
    const wasLongPress = longPressTriggeredRef.current || isLongPressDragging || draggingEntityId === entity.id;

    if (wasLongPress) {
      e.stopPropagation();
      if (hoveredTile && draggingEntityId === entity.id) {
        tryConfirmMove(entity.id, hoveredTile.x, hoveredTile.y);
      }
      setDraggingEntityId(null);
      setIsLongPressDragging(false);
      longPressTriggeredRef.current = false;
      pressedEntityRef.current = null;
      touchStartPosRef.current = null;
      return; // Do NOT trigger normal click / open building modal
    }

    // Normal short tap (rapid < 350ms and not dragged)
    if (clickDuration < 350 && !wasMapDraggedRef.current) {
      e.stopPropagation();
      if (isMovingMode) {
        setMovingEntityId(entity.id);
      } else {
        sound.playClick();
        onSelectEntity(entity);
      }
    }

    pressedEntityRef.current = null;
    touchStartPosRef.current = null;
  };

  // Centralized Drag Action processor for Scythe and Seeds across all plots
  const processDragAction = useCallback(
    (clientX: number, clientY: number, overrideTool?: string) => {
      const tool = overrideTool || activeDragTool;
      if (!tool) return;

      setDragCursorPos({ x: clientX, y: clientY });

      // Robust Proximity & Isometric check across all crop plots
      const hoveredPlot = entities.find((ent) => {
        if (ent.type !== 'crop_plot') return false;
        const center = gridToScreen(ent.x + 0.5, ent.y + 0.5);
        const screenX = pan.x + center.x * zoom;
        const screenY = pan.y + center.y * zoom;
        const dx = clientX - screenX;
        const dy = clientY - screenY;
        const normX = dx / (46 * zoom);
        const normY = dy / (25 * zoom);
        return normX * normX + normY * normY <= 1.35;
      });

      if (hoveredPlot) {
        if (tool === 'scythe') {
          if (isCropPlotReady(hoveredPlot) && onQuickHarvestCrop) {
            onQuickHarvestCrop(hoveredPlot.id);
          }
        } else if (tool.startsWith('plant_')) {
          const seedId = tool.replace('plant_', '');
          const isEmpty = !hoveredPlot.cropData || !hoveredPlot.cropData.cropId;
          const qty = inventory[seedId] || 0;
          if (isEmpty && qty > 0 && onQuickPlantCrop) {
            onQuickPlantCrop(hoveredPlot.id, seedId);
          }
        }
      }
    },
    [activeDragTool, entities, pan, zoom, inventory, onQuickHarvestCrop, onQuickPlantCrop, isCropPlotReady]
  );

  // Global window pointer listener for continuous drag over entire screen
  useEffect(() => {
    if (!activeDragTool) return;
    const onWinPointerMove = (e: PointerEvent) => {
      processDragAction(e.clientX, e.clientY);
    };
    const onWinPointerUp = () => {
      setActiveDragTool(null);
      onSelectEntity(null);
    };
    window.addEventListener('pointermove', onWinPointerMove, { passive: true });
    window.addEventListener('pointerup', onWinPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onWinPointerMove);
      window.removeEventListener('pointerup', onWinPointerUp);
    };
  }, [activeDragTool, processDragAction, onSelectEntity]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (isLongPressDragging || activeDragTool) return;
    
    pointerDownTimeRef.current = Date.now();
    wasMapDraggedRef.current = false;
    touchStartPosRef.current = { x: e.clientX, y: e.clientY };

    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeDragTool) {
      processDragAction(e.clientX, e.clientY);
      return;
    }

    const tile = isoToGrid(e.clientX, e.clientY);
    if (tile.x >= 0 && tile.x < MAP_SIZE && tile.y >= 0 && tile.y < MAP_SIZE) {
      setHoveredTile((prev) => {
        if (prev && prev.x === tile.x && prev.y === tile.y) return prev;
        return tile;
      });
    } else {
      setHoveredTile((prev) => (prev === null ? null : null));
    }

    // If hold gesture is active, check if user moves too far
    if (touchStartPosRef.current && !isLongPressDragging) {
      const dx = e.clientX - touchStartPosRef.current.x;
      const dy = e.clientY - touchStartPosRef.current.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 10) {
        cancelHoldGesture();
      }
      if (isDragging && dist > 6) {
        wasMapDraggedRef.current = true;
      }
    }

    if (isDragging && !isLongPressDragging) {
      setPan((prev) => {
        const nextX = e.clientX - dragStart.x;
        const nextY = e.clientY - dragStart.y;
        
        // Clamp boundaries based on map size and current zoom
        const paddingX = window.innerWidth / 2;
        const paddingY = window.innerHeight / 2;
        
        const minX = -MAP_SIZE * 92 * zoom + paddingX;
        const maxX = MAP_SIZE * 92 * zoom + paddingX;
        const minY = -MAP_SIZE * 46 * zoom + paddingY;
        const maxY = MAP_SIZE * 46 * zoom + paddingY;
        
        return {
          x: Math.min(maxX, Math.max(minX, nextX)),
          y: Math.min(maxY, Math.max(minY, nextY)),
        };
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    cancelHoldGesture();
    if (activeDragTool) {
      setActiveDragTool(null);
      onSelectEntity(null);
    }
    if (isLongPressDragging || longPressTriggeredRef.current) {
      if (pressedEntityRef.current && hoveredTile) {
        tryConfirmMove(pressedEntityRef.current.id, hoveredTile.x, hoveredTile.y);
      }
      setDraggingEntityId(null);
      setIsLongPressDragging(false);
      longPressTriggeredRef.current = false;
      pressedEntityRef.current = null;
    }
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom gesture starts
      setIsDragging(false);
      cancelHoldGesture();
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
      return;
    }

    if (isLongPressDragging) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      pointerDownTimeRef.current = Date.now();
      wasMapDraggedRef.current = false;
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

      setIsDragging(true);
      setDragStart({
        x: touch.clientX - pan.x,
        y: touch.clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (activeDragTool && e.touches.length === 1) {
      const touch = e.touches[0];
      setDragCursorPos({ x: touch.clientX, y: touch.clientY });

      const tile = isoToGrid(touch.clientX, touch.clientY);
      if (tile.x >= 0 && tile.x < MAP_SIZE && tile.y >= 0 && tile.y < MAP_SIZE) {
        const hoveredPlot = entities.find(
          (ent) =>
            ent.type === 'crop_plot' &&
            tile.x >= ent.x &&
            tile.x < ent.x + ent.width &&
            tile.y >= ent.y &&
            tile.y < ent.y + ent.height
        );
        
        if (hoveredPlot) {
          if (activeDragTool === 'scythe') {
            if (isCropPlotReady(hoveredPlot) && onQuickHarvestCrop) {
              onQuickHarvestCrop(hoveredPlot.id);
            }
          } else if (activeDragTool.startsWith('plant_')) {
            const seedId = activeDragTool.replace('plant_', '');
            const isEmpty = !hoveredPlot.cropData || !hoveredPlot.cropData.cropId;
            if (isEmpty && onQuickPlantCrop) {
              onQuickPlantCrop(hoveredPlot.id, seedId);
            }
          }
        }
      }
      return;
    }

    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      const ratio = dist / touchStartDistRef.current;
      const newZoom = Math.min(2.5, Math.max(0.9, touchStartZoomRef.current * ratio));
      setZoom(newZoom);
      return;
    }

    if (touchStartPosRef.current && !isLongPressDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStartPosRef.current.x;
      const dy = e.touches[0].clientY - touchStartPosRef.current.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 10) {
        cancelHoldGesture();
      }
      if (isDragging && dist > 6) {
        wasMapDraggedRef.current = true;
      }
    }

    if (isDragging && e.touches.length === 1 && !isLongPressDragging) {
      setPan((prev) => {
        const nextX = e.touches[0].clientX - dragStart.x;
        const nextY = e.touches[0].clientY - dragStart.y;
        
        // Clamp boundaries based on map size and current zoom
        const paddingX = window.innerWidth / 2;
        const paddingY = window.innerHeight / 2;
        
        const minX = -MAP_SIZE * 92 * zoom + paddingX;
        const maxX = MAP_SIZE * 92 * zoom + paddingX;
        const minY = -MAP_SIZE * 46 * zoom + paddingY;
        const maxY = MAP_SIZE * 46 * zoom + paddingY;
        
        return {
          x: Math.min(maxX, Math.max(minX, nextX)),
          y: Math.min(maxY, Math.max(minY, nextY)),
        };
      });
    }

    if (e.touches.length === 1) {
      const tile = isoToGrid(e.touches[0].clientX, e.touches[0].clientY);
      if (tile.x >= 0 && tile.x < MAP_SIZE && tile.y >= 0 && tile.y < MAP_SIZE) {
        setHoveredTile((prev) => {
          if (prev && prev.x === tile.x && prev.y === tile.y) return prev;
          return tile;
        });
      } else {
        setHoveredTile((prev) => (prev === null ? null : null));
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    cancelHoldGesture();
    if (activeDragTool) {
      setActiveDragTool(null);
      onSelectEntity(null);
    }
    if (e.touches.length < 2) {
      touchStartDistRef.current = null;
    }
    if (isLongPressDragging || longPressTriggeredRef.current) {
      if (pressedEntityRef.current && hoveredTile) {
        tryConfirmMove(pressedEntityRef.current.id, hoveredTile.x, hoveredTile.y);
      }
      setDraggingEntityId(null);
      setIsLongPressDragging(false);
      longPressTriggeredRef.current = false;
      pressedEntityRef.current = null;
    }
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(2.5, Math.max(0.9, prev + delta)));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    handleZoom(zoomDelta);
  };

  // Sorted entities by render depth (isometric sorting: South-most front edge)
  const sortedEntities = useMemo(() => {
    return [...entities].filter(Boolean).sort((a, b) => {
      const depthA = (a.x || 0) + (a.y || 0) + (a.width || 1) + (a.height || 1);
      const depthB = (b.x || 0) + (b.y || 0) + (b.width || 1) + (b.height || 1);
      if (Math.abs(depthA - depthB) > 0.001) {
        return depthA - depthB;
      }
      return ((a.x || 0) - (a.y || 0)) - ((b.x || 0) - (b.y || 0));
    });
  }, [entities]);

  // Check if tile has an entity
  const handleTileClick = (gx: number, gy: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const clickDuration = Date.now() - pointerDownTimeRef.current;
    if (wasMapDraggedRef.current || clickDuration > 300 || isLongPressDragging || longPressTriggeredRef.current) {
      return; // Ignore drag panning or long click wait gestures!
    }

    if (isMovingMode && movingEntityId) {
      // Move selected entity to this tile safely
      tryConfirmMove(movingEntityId, gx, gy);
      setMovingEntityId(null);
      return;
    }

    // Only crop plots are selected from background tile clicks.
    // Buildings/animals/decorations are clicked directly on their visible figures.
    const clickedPlot = entities.find(
      (ent) =>
        ent.type === 'crop_plot' &&
        gx >= ent.x &&
        gx < ent.x + ent.width &&
        gy >= ent.y &&
        gy < ent.y + ent.height
    );

    if (clickedPlot) {
      onSelectEntity(clickedPlot);
    } else {
      // Clicking on empty terrain clears selection
      onSelectEntity(null);
    }
  };

  const viewportBoundingBox = useMemo(() => {
    if (!containerRef.current) return null;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Convert screen corners to isometric grid space
    // Account for zoom and pan
    const pad = 8; // Render 8 extra tiles outside view to prevent pop-in
    
    const topLeft = screenToGrid(0, 0, pan, zoom);
    const topRight = screenToGrid(w, 0, pan, zoom);
    const bottomLeft = screenToGrid(0, h, pan, zoom);
    const bottomRight = screenToGrid(w, h, pan, zoom);
    
    const minX = Math.floor(Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x)) - pad;
    const maxX = Math.ceil(Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x)) + pad;
    const minY = Math.floor(Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y)) - pad;
    const maxY = Math.ceil(Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y)) + pad;
    
    return { minX, maxX, minY, maxY };
  }, [pan, zoom]);

  const isDeliveringTruck = truckDeliveringUntil !== null && currentTime < truckDeliveringUntil;

  return (
    <div
      ref={containerRef}
      id="farm-canvas-container"
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#9ad87d] to-[#71c356] select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <style>{`
        @keyframes entity-shake {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 1px) rotate(-1deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          60% { transform: translate(-1px, -1px) rotate(-1deg); }
          80% { transform: translate(1px, 1px) rotate(1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-shake {
          animation: entity-shake 0.18s infinite ease-in-out;
        }
        @keyframes chop-saw-float {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.2; }
          20% { transform: scale(1.2) rotate(-20deg); opacity: 1; }
          80% { transform: scale(1.2) rotate(20deg); opacity: 1; }
          100% { transform: scale(0.9) rotate(0deg); opacity: 0.2; }
        }
        .animate-chop-saw {
          animation: chop-saw-float 0.4s infinite ease-in-out;
        }
      `}</style>

      {/* Sky clouds / Sun decoration */}
      <div className="absolute top-4 left-6 pointer-events-none opacity-80 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-yellow-300 shadow-[0_0_30px_#FACC15] animate-pulse"></div>
        <div className="text-white/90 text-sm font-semibold tracking-wide bg-amber-900/40 px-3 py-1 rounded-full backdrop-blur-xs">
          ☀️ Dia Ensolarado na Fazenda
        </div>
      </div>

      {/* Cloud floats */}
      <div className="absolute top-8 left-1/4 pointer-events-none opacity-40 text-4xl animate-bounce">
        ☁️
      </div>
      <div className="absolute top-14 right-1/3 pointer-events-none opacity-30 text-5xl">
        ☁️
      </div>



      {/* Moving Mode Banner */}
      {isMovingMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-white font-bold px-5 py-2 rounded-full shadow-xl border-2 border-white animate-pulse text-sm">
          {movingEntityId
            ? '👉 Clique em um lote de terra para posicionar a estrutura!'
            : '🛠️ Modo Edição: Toque na construção que deseja mover'}
        </div>
      )}

      {/* Isometric Map Surface */}
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* Scenery Environment (Lush Grass Base, Distant Hills, Country Trees, Fences, Dirt Road, Butterflies) */}
        <svg
          className="overflow-visible pointer-events-none"
          style={{ width: 1, height: 1 }}
        >
          {/* Main 3D Lush Hay Day Continuous Grass Meadow & Scatter Details */}
          <IsoLushGrass
            mapSize={MAP_SIZE}
            tileWidth={TILE_WIDTH}
            tileHeight={TILE_HEIGHT}
            gridToIso={gridToIso}
          />

          {/* Rich Iso Scenery Component (Pure Grass, Trees, Fences, Dirt Road, Hay Bales) */}
          <IsoScenery
            mapSize={MAP_SIZE}
            tileWidth={TILE_WIDTH}
            tileHeight={TILE_HEIGHT}
            gridToIso={gridToIso}
            fishingBoatStatus={fishingBoatStatus}
            onBoatClick={onFishingBoatClick}
            deliveryBoatStatus={deliveryBoatStatus}
            onDeliveryBoatClick={onDeliveryBoatClick}
            mineStatus={mineStatus}
            mineRepairStartedAt={mineRepairStartedAt}
            playerLevel={playerLevel}
            onMineClick={onMineClick}
          />
        </svg>

        {/* Organic 3D Cartoon Expansion Territories Layer */}
        <svg className="absolute inset-0 overflow-visible pointer-events-none" style={{ width: 1, height: 1 }}>
          <IsoExpansionTerritory
            unlockedParcelIds={unlockedParcelIds}
            gridToIso={gridToIso}
            onOpenExpansionModal={onOpenExpansionModal}
            viewportBoundingBox={viewportBoundingBox}
            playerLevel={playerLevel}
          />
        </svg>

        {/* Isometric Interactive Farm Grid (Seamless in normal mode, clean guides in move mode) */}
        {Array.from({ length: MAP_SIZE }).map((_, gy) =>
          Array.from({ length: MAP_SIZE }).map((_, gx) => {
            // Viewport Culling Optimization
            if (
              viewportBoundingBox &&
              (gx < viewportBoundingBox.minX ||
               gx > viewportBoundingBox.maxX ||
               gy < viewportBoundingBox.minY ||
               gy > viewportBoundingBox.maxY)
            ) {
              return null;
            }

            const { x: isoX, y: isoY } = gridToIso(gx, gy);
            const isHovered = hoveredTile?.x === gx && hoveredTile?.y === gy;

            // Check if this tile is inside the actively moved entity footprint
            const isInMovingFootprint =
              activeMovedEntity &&
              hoveredTile &&
              gx >= hoveredTile.x &&
              gx < hoveredTile.x + (activeMovedEntity.width || 1) &&
              gy >= hoveredTile.y &&
              gy < hoveredTile.y + (activeMovedEntity.height || 1);

            return (
              <div
                key={`tile_${gx}_${gy}`}
                onClick={(e) => handleTileClick(gx, gy, e)}
                style={{
                  left: isoX,
                  top: isoY,
                  width: TILE_WIDTH,
                  height: TILE_HEIGHT,
                  position: 'absolute',
                  transform: 'translate(-50%, 0)',
                }}
                className="group cursor-pointer pointer-events-auto select-none"
              >
                <svg
                  viewBox="0 0 84 42"
                  className="w-full h-full overflow-visible transition-colors"
                >
                  {isInMovingFootprint ? (
                    /* Real-time Space Occupation Footprint: Green if Valid, Red if Colliding / Out of Bounds */
                    <polygon
                      points="42,1 83,21 42,41 1,21"
                      fill={
                        placementValidation?.isValid
                          ? 'rgba(34, 197, 94, 0.48)'
                          : 'rgba(239, 68, 68, 0.58)'
                      }
                      stroke={placementValidation?.isValid ? '#22C55E' : '#EF4444'}
                      strokeWidth="2.5"
                      strokeDasharray={placementValidation?.isValid ? 'none' : '4 2'}
                    />
                  ) : isMovingMode ? (
                    /* In Move Mode, show subtle placement grid lines and active target highlight */
                    <polygon
                      points="42,1 83,21 42,41 1,21"
                      fill={isHovered ? 'rgba(163, 230, 53, 0.4)' : 'rgba(255, 255, 255, 0.04)'}
                      stroke={isHovered ? '#FACC15' : 'rgba(255, 255, 255, 0.3)'}
                      strokeWidth={isHovered ? '2' : '1'}
                      strokeDasharray={isHovered ? 'none' : '3 3'}
                    />
                  ) : isHovered ? (
                    /* In Normal Mode, show ONLY a soft subtle translucent highlight on hover - NO harsh borders or squares! */
                    <polygon
                      points="42,1 83,21 42,41 1,21"
                      fill="rgba(255, 255, 255, 0.12)"
                      stroke="rgba(255, 255, 255, 0.28)"
                      strokeWidth="1"
                    />
                  ) : (
                    /* Invisible hit-box: keeps clicks perfectly responsive without showing any ugly squares */
                    <polygon
                      points="42,1 83,21 42,41 1,21"
                      fill="transparent"
                      stroke="none"
                    />
                  )}
                </svg>
              </div>
            );
          })
        )}

        {/* Floating Space Occupation Status Indicator Badge above dragged building */}
        {activeMovedEntity && hoveredTile && (() => {
          const centerIso = gridToIso(
            hoveredTile.x + (activeMovedEntity.width || 1) / 2,
            hoveredTile.y + (activeMovedEntity.height || 1) / 2
          );
          const isValid = placementValidation?.isValid;

          return (
            <div
              style={{
                left: centerIso.x,
                top: centerIso.y - 70,
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
              }}
              className={`pointer-events-none z-50 px-3 py-1 rounded-full text-xs font-black shadow-2xl flex items-center gap-1.5 whitespace-nowrap border-2 transition-all backdrop-blur-sm ${
                isValid
                  ? 'bg-emerald-600/95 text-white border-emerald-300 animate-pulse'
                  : 'bg-red-600/95 text-white border-red-300 animate-bounce'
              }`}
            >
              <span>{isValid ? '🟢' : '🔴'}</span>
              <span>
                {isValid
                  ? 'Posição Válida (Solte para fixar)'
                  : placementValidation?.reason === 'out_of_bounds'
                  ? 'Fora do Terreno!'
                  : 'Bloqueado (Sobreposição com outra construção!)'}
              </span>
            </div>
          );
        })()}

        {/* Real-time animated flying/gathering worker bees */}
        {visualBees.map((bee) => {
          const tree = entities.find((e) => e.type === 'bee_tree');
          if (!tree) return null;

          const treeCenter = gridToIso(tree.x + 1.0, tree.y + 1.0);
          let bx = treeCenter.x;
          let by = treeCenter.y - 45;
          let isFacingRight = true;
          let leanAngle = 0;

          const bush = bee.targetBushId ? entities.find((e) => e.id === bee.targetBushId) : null;
          const bushCenter = bush ? gridToIso(bush.x + 0.5, bush.y + 0.5) : null;

          if (bee.state === 'idle') {
            bx = treeCenter.x + (Math.round(bee.id * 100) % 2 === 0 ? 12 : -12);
            by = treeCenter.y - 48 + (Math.round(bee.id * 100) % 3 === 0 ? 5 : -5);
            isFacingRight = (Math.round(bee.id * 100) % 2 === 0);
            leanAngle = 0;
          } else if (bee.state === 'flying_to_bush' && bushCenter) {
            const startX = treeCenter.x;
            const startY = treeCenter.y - 45;
            const endX = bushCenter.x;
            const endY = bushCenter.y - 25;

            const arch = bee.archHeight !== undefined ? bee.archHeight : -35;
            const baseLineX = startX + (endX - startX) * bee.progress;
            const baseLineY = startY + (endY - startY) * bee.progress + Math.sin(bee.progress * Math.PI) * arch;

            // Wobble perpendicular to path for organic flight feel
            const dx = endX - startX;
            const dy = endY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / dist;
            const ny = dx / dist;

            const amp = bee.wobbleAmp !== undefined ? bee.wobbleAmp : 18;
            const freq = bee.wobbleFreq !== undefined ? bee.wobbleFreq : 6;
            const phase = bee.wobblePhase !== undefined ? bee.wobblePhase : 0;
            const wobbleVal = Math.sin(bee.progress * Math.PI * freq + phase) * amp;

            bx = baseLineX + nx * wobbleVal;
            by = baseLineY + ny * wobbleVal + Math.sin(currentTime / 120) * 3.5;
            isFacingRight = endX > startX;
            leanAngle = Math.cos(bee.progress * Math.PI * freq + phase) * (amp * 0.9);
          } else if (bee.state === 'harvesting' && bushCenter) {
            bx = bushCenter.x;
            by = bushCenter.y - 25;
            isFacingRight = true;
            leanAngle = 0;
          } else if (bee.state === 'flying_to_tree' && bushCenter) {
            const startX = bushCenter.x;
            const startY = bushCenter.y - 25;
            const endX = treeCenter.x;
            const endY = treeCenter.y - 45;

            const arch = bee.archHeight !== undefined ? bee.archHeight : -35;
            const baseLineX = startX + (endX - startX) * bee.progress;
            const baseLineY = startY + (endY - startY) * bee.progress + Math.sin(bee.progress * Math.PI) * arch;

            const dx = endX - startX;
            const dy = endY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / dist;
            const ny = dx / dist;

            const amp = bee.wobbleAmp !== undefined ? bee.wobbleAmp : 18;
            const freq = bee.wobbleFreq !== undefined ? bee.wobbleFreq : 6;
            const phase = bee.wobblePhase !== undefined ? bee.wobblePhase : 0;
            const wobbleVal = Math.sin(bee.progress * Math.PI * freq + phase) * amp;

            bx = baseLineX + nx * wobbleVal;
            by = baseLineY + ny * wobbleVal + Math.sin(currentTime / 120) * 3.5;
            isFacingRight = endX > startX;
            leanAngle = Math.cos(bee.progress * Math.PI * freq + phase) * (amp * 0.9);
          }

          return (
            <div
              key={bee.id}
              className="absolute pointer-events-none z-40 flex flex-col items-center justify-center transition-transform duration-100 ease-linear"
              style={{
                left: bx,
                top: by,
              }}
            >
              <div
                style={{
                  transform: `scale(${isFacingRight ? 1.0 : -1.0}, 1.0) rotate(${isFacingRight ? leanAngle : -leanAngle}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative"
              >
                {/* Trailing honey sparkles when carrying nectar */}
                {bee.hasNectar && (
                  <div className="absolute -left-3 top-2 flex flex-col items-center pointer-events-none select-none z-50">
                    <span className="text-[8px] text-yellow-300 animate-ping opacity-80 leading-none">✨</span>
                    <span className="text-[6px] text-amber-500 animate-bounce opacity-60 delay-75 mt-0.5 leading-none">💧</span>
                  </div>
                )}

                <svg width="18" height="18" viewBox="0 0 32 32" className="overflow-visible filter drop-shadow-md">
                  <defs>
                    <style>{`
                      @keyframes flap-left-${bee.id} {
                        0% { transform: rotate(-28deg) scaleY(1); }
                        50% { transform: rotate(-8deg) scaleY(0.2); }
                        100% { transform: rotate(-28deg) scaleY(1); }
                      }
                      @keyframes flap-right-${bee.id} {
                        0% { transform: rotate(28deg) scaleY(1); }
                        50% { transform: rotate(8deg) scaleY(0.2); }
                        100% { transform: rotate(28deg) scaleY(1); }
                      }
                      .wing-left-${bee.id} {
                        animation: flap-left-${bee.id} 0.08s infinite ease-in-out;
                        transform-origin: 10px 8px;
                      }
                      .wing-right-${bee.id} {
                        animation: flap-right-${bee.id} 0.08s infinite ease-in-out;
                        transform-origin: 22px 8px;
                      }
                    `}</style>
                    <radialGradient id={`wing-grad-${bee.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={`body-grad-${bee.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="40%" stopColor="#f59e0b" />
                      <stop offset="85%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#7c2d12" />
                    </linearGradient>
                  </defs>
                  
                  {/* Glossy wings flapping rapidly */}
                  <ellipse
                    cx="10"
                    cy="8"
                    rx="8"
                    ry="4.5"
                    fill={`url(#wing-grad-${bee.id})`}
                    stroke="#cbd5e1"
                    strokeWidth="0.8"
                    className={`wing-left-${bee.id}`}
                  />
                  <ellipse
                    cx="22"
                    cy="8"
                    rx="8"
                    ry="4.5"
                    fill={`url(#wing-grad-${bee.id})`}
                    stroke="#cbd5e1"
                    strokeWidth="0.8"
                    className={`wing-right-${bee.id}`}
                  />
                  
                  {/* Stinger */}
                  <polygon points="6,16 1.5,14.5 1.5,17.5" fill="#1e293b" />
                  
                  {/* Tiny Insect Legs */}
                  <path d="M 12 22 Q 11 25 9 25" stroke="#1e293b" strokeWidth="0.85" strokeLinecap="round" fill="none" />
                  <path d="M 16 22.5 Q 16 26 14 26" stroke="#1e293b" strokeWidth="0.85" strokeLinecap="round" fill="none" />
                  <path d="M 20 22 Q 21 25 20 25" stroke="#1e293b" strokeWidth="0.85" strokeLinecap="round" fill="none" />

                  {/* Chubby 3D Body */}
                  <ellipse cx="16" cy="16" rx="9" ry="7" fill={`url(#body-grad-${bee.id})`} stroke="#1e293b" strokeWidth="1.2" />
                  
                  {/* Body Gloss Highlight */}
                  <path d="M 11 13 A 6 4 0 0 1 21 13" stroke="#ffffff" strokeWidth="0.85" strokeLinecap="round" fill="none" opacity="0.45" />

                  {/* Velvet Stripes */}
                  <path d="M 13.5 9.5 C 13.5 9.5 14.5 16 13.5 22.5" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M 18.5 9.5 C 18.5 9.5 19.5 16 18.5 22.5" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
                  
                  {/* Head & cute face */}
                  <circle cx="23.5" cy="16" r="4.5" fill="#1e293b" />
                  
                  {/* Rosy blush cheeks */}
                  <circle cx="23" cy="17.8" r="0.8" fill="#f43f5e" opacity="0.8" />

                  {/* Antennae */}
                  <path d="M 23.5 12 Q 25 8 28 9" stroke="#1e293b" strokeWidth="1" fill="none" />
                  <circle cx="28" cy="9" r="1" fill="#1e293b" />
                  
                  {/* Eye */}
                  <circle cx="25.5" cy="14.5" r="1" fill="#ffffff" />
                  
                  {/* Yellow pollen ball carrying indicator */}
                  {bee.hasNectar && (
                    <g>
                      <circle cx="16" cy="24" r="6" fill="#fbbf24" opacity="0.65" className="animate-ping" />
                      <circle cx="16" cy="24" r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                    </g>
                  )}
                </svg>
              </div>
            </div>
          );
        })}

        {/* Dynamic Animated Farm NPC Visitor Character waiting at the Farmhouse door */}
        {activeVisitor && (() => {
          const farmhouse = entities.find((e) => e.type === 'farmhouse');
          const doorX = farmhouse ? farmhouse.x + 1.65 : 7.65;
          const doorY = farmhouse ? farmhouse.y + 2.05 : 4.05;
          return (
            <IsoNpcVisitor
              visitor={activeVisitor}
              gridToIso={gridToIso}
              targetPos={{ x: doorX, y: doorY }}
              onOpenVisitor={onOpenVisitor}
            />
          );
        })()}

        {/* Delivery Truck on Road */}
        {(() => {
          const tPlacement = calculateIsoPlacement(
            0, 3, 2, 1,
            ISO_DECORATION_ANCHORS.truck
          );
          return (
            <div
              id="delivery-truck"
              style={{
                left: tPlacement.left,
                top: tPlacement.top,
                position: 'absolute',
                zIndex: tPlacement.zIndex,
                transform: tPlacement.transform,
              }}
              className={`pointer-events-none transition-all duration-1000 ${
                isDeliveringTruck
                  ? 'translate-x-[-120px] translate-y-[-100px] opacity-40 scale-75'
                  : 'translate-x-0 translate-y-0 opacity-100 scale-100'
              }`}
            >
              <div className="relative flex flex-col items-center">
                {isDeliveringTruck && (
                  <div className="absolute -top-6 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                    🚚 Entregando pedido...
                  </div>
                )}
                <IsoTruck isDelivering={isDeliveringTruck} />
              </div>
            </div>
          );
        })()}

        {/* Render Sorted Game Entities (Buildings, Plots, Animals, Decorations) */}
        {sortedEntities.map((entity) => {
          // Viewport Culling Optimization for Entities
          if (
            viewportBoundingBox &&
            (entity.x + entity.width < viewportBoundingBox.minX ||
             entity.x > viewportBoundingBox.maxX ||
             entity.y + entity.height < viewportBoundingBox.minY ||
             entity.y > viewportBoundingBox.maxY) &&
            !isMovingMode // don't cull while moving
          ) {
            return null;
          }

          const isSelected = selectedEntity?.id === entity.id;
          const isMovingThis = movingEntityId === entity.id || draggingEntityId === entity.id;
          const isDraggingThis = draggingEntityId === entity.id;
          const targetX = (isMovingThis && hoveredTile) ? hoveredTile.x : entity.x;
          const targetY = (isMovingThis && hoveredTile) ? hoveredTile.y : entity.y;

          // 1. Calculate structural placement and ground footpoint
          const anchorDef = getEntityAnchorDef(
            entity,
            graphicsStyle
          );
          const placement = calculateIsoPlacement(
            targetX,
            targetY,
            entity.width,
            entity.height,
            anchorDef,
            entity.anchorX,
            entity.anchorY
          );

          const isHoldingThis = holdingEntityId === entity.id;

          return (
            <React.Fragment key={entity.id}>
              {/* Natural, Soft Ambient Contact Shadow (Ground footpoint) */}
              {placement.shadow.opacity > 0 && (
                <div
                  id={`entity-shadow-${entity.id}`}
                  className="absolute pointer-events-none select-none transition-opacity duration-200"
                  style={{
                    left: placement.shadow.left,
                    top: placement.shadow.top,
                    width: `${placement.shadow.width}px`,
                    height: `${placement.shadow.height}px`,
                    transform: placement.shadow.transform,
                    zIndex: placement.shadow.zIndex,
                    opacity: isMovingThis ? 0.2 : placement.shadow.opacity,
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="w-full h-full rounded-[50%] blur-[3px]"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 50%, rgba(25, 45, 15, 0.32) 0%, rgba(25, 45, 15, 0.12) 55%, transparent 80%)',
                    }}
                  />
                </div>
              )}

              {/* Main Entity Visual Container anchored precisely at footpoint */}
              <div
                id={`entity-${entity.id}`}
                onPointerDown={(e) => handleEntityPointerDown(entity, e)}
                onPointerUp={(e) => handleEntityPointerUp(entity, e)}
                style={{
                  left: placement.left,
                  top: placement.top,
                  position: 'absolute',
                  zIndex: isDraggingThis ? 10000 : placement.zIndex,
                  transform: placement.transform,
                  touchAction: 'none',
                }}
                className={`cursor-pointer group select-none transition-transform duration-150 relative ${
                  isMovingThis ? 'opacity-60 scale-105 animate-pulse' : ''
                } ${entity.isCutting ? 'animate-shake' : ''}`}
              >
                {/* 4 progressive loading bars while holding */}
                {isHoldingThis && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-40px',
                      left: '50%',
                      transform: 'translateX(-50%) scale(0.9)',
                      zIndex: 21000,
                    }}
                    className="flex items-center gap-1.5 bg-amber-950/95 border-2 border-amber-400 p-2 rounded-2xl shadow-2xl pointer-events-none"
                  >
                    <div className={`w-2.5 h-6 rounded-md border-2 transition-colors duration-100 ${holdingProgress >= 25 ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_8px_#FACC15]' : 'bg-amber-900 border-amber-950/50'}`}></div>
                    <div className={`w-2.5 h-6 rounded-md border-2 transition-colors duration-100 ${holdingProgress >= 50 ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_8px_#FACC15]' : 'bg-amber-900 border-amber-950/50'}`}></div>
                    <div className={`w-2.5 h-6 rounded-md border-2 transition-colors duration-100 ${holdingProgress >= 75 ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_8px_#FACC15]' : 'bg-amber-900 border-amber-950/50'}`}></div>
                    <div className={`w-2.5 h-6 rounded-md border-2 transition-colors duration-100 ${holdingProgress >= 100 ? 'bg-yellow-400 border-yellow-200 shadow-[0_0_8px_#FACC15]' : 'bg-amber-900 border-amber-950/50'}`}></div>
                  </div>
                )}

                {/* Chopping/Sawing animation overlay */}
                {entity.isCutting && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none select-none">
                    <div className="text-4xl absolute animate-chop-saw top-0 left-1/2 -translate-x-1/2">
                      {entity.type === 'dead_tree' ? '🪚' : '🪓'}
                    </div>
                    <div className="absolute text-xs animate-ping top-2 left-2 opacity-75">🪵</div>
                    <div className="absolute text-xs animate-ping top-4 right-4 opacity-75">🍃</div>
                    <div className="absolute text-xs animate-ping bottom-2 left-6 opacity-75">🍂</div>
                  </div>
                )}

                {/* Render Specific Entity Visuals */}
                {renderEntityVisual({
                  entity,
                  currentTime,
                  onHarvestCrop: onQuickHarvestCrop,
                  onCollectAnimal: onQuickCollectAnimal,
                  onCollectBuilding: onQuickCollectBuilding,
                  isSelected,
                  graphicsStyle: (graphicsStyle as '3d_rendered' | 'vector') || '3d_rendered',
                  siloUsed,
                  siloCap,
                  siloLevel,
                  barnUsed,
                  barnCap,
                  barnLevel,
                  playerLevel,
                  farmName,
                  hasFulfillableOrders,
                  availableOrdersCount,
                  hasRoadsideCoinsToCollect,
                  canSpinWheel,
                  onOpenSilo,
                  onOpenBarn,
                  onOpenFarmhouse,
                  onOpenOrderBoard,
                  onOpenRoadsideShop,
                  onOpenLuckyWheel,
                  onOpenBeeTree,
                  onRemoveDeadEntity,
                  inventory,
                  onFeedAnimals: onQuickFeedAnimals,
                })}
              </div>
            </React.Fragment>
          );
        })}

        {/* CROP BUBBLE SELECTOR (Floating inline on top of selected plot) */}
        {!activeDragTool && selectedEntity && selectedEntity.type === 'crop_plot' && (() => {
          const isPlanted = selectedEntity.cropData && selectedEntity.cropData.cropId;
          const now = currentTime;
          const isReady = isPlanted && (now - selectedEntity.cropData!.plantedAt!) / 1000 >= selectedEntity.cropData!.growDuration;
          const { x: isoX, y: isoY } = gridToIso(selectedEntity.x, selectedEntity.y);
          
          return (
            <div
              style={{
                left: isoX,
                top: isoY - 30,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
              }}
              className="absolute z-[20000] flex items-center justify-center select-none"
            >
              {isReady ? (
                /* Scythe Bubble (Foice de Colheita Hay Day) */
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    sound.playClick();
                    setActiveDragTool('scythe');
                    processDragAction(e.clientX, e.clientY, 'scythe');
                  }}
                  className="w-16 h-16 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 hover:scale-110 active:scale-95 text-white border-4 border-amber-950 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform animate-in zoom-in duration-150"
                  title="Arraste a Foice sobre as plantações para colher!"
                >
                  <ScytheSvg size={38} className="drop-shadow" />
                </div>
              ) : !isPlanted ? (
                /* Seed Bags Row */
                <div className="bg-gradient-to-r from-amber-900/95 to-amber-950/95 border-4 border-amber-400 p-2.5 rounded-3xl shadow-2xl flex items-center gap-2.5 animate-in zoom-in duration-150">
                  {[
                    { id: 'wheat', name: 'Trigo', icon: '🌾', level: 1 },
                    { id: 'corn', name: 'Milho', icon: '🌽', level: 2 },
                    { id: 'carrot', name: 'Cenoura', icon: '🥕', level: 3 },
                    { id: 'sugarcane', name: 'Cana', icon: '🎋', level: 3 },
                    { id: 'soybean', name: 'Soja', icon: '🌱', level: 4 },
                    { id: 'pumpkin', name: 'Abóbora', icon: '🎃', level: 6 },
                  ].map((seed) => {
                    const isUnlocked = playerLevel >= seed.level;
                    if (!isUnlocked) return null;
                    
                    const seedQty = inventory[seed.id] || 0;
                    
                    return (
                      <div
                        key={seed.id}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (seedQty <= 0) {
                            sound.playClick();
                            alert(`Você não tem sementes de ${seed.name} suficientes no Silo!`);
                            return;
                          }
                          sound.playPlant();
                          setActiveDragTool(`plant_${seed.id}`);
                          processDragAction(e.clientX, e.clientY, `plant_${seed.id}`);
                        }}
                        className={`relative flex flex-col items-center justify-center w-12 h-12 bg-amber-100 hover:scale-110 active:scale-95 rounded-2xl border-2 border-amber-800 shadow cursor-grab active:cursor-grabbing transition-all ${
                          seedQty <= 0 ? 'opacity-50 grayscale' : ''
                        }`}
                        title={`Arraste sobre os canteiros para plantar! (${seedQty})`}
                      >
                        <span className="text-2xl">{seed.icon}</span>
                        <span className="absolute -bottom-1.5 -right-1 bg-amber-950 text-yellow-100 font-extrabold text-[8px] px-1 rounded-full border border-amber-400">
                          {seedQty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Growing state info bubble */
                <div className="bg-amber-950/90 text-amber-200 border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-xl text-center flex flex-col gap-1 text-[10px] font-bold animate-in fade-in duration-150">
                  <span className="text-yellow-400 uppercase text-[8px] tracking-wider font-black">Crescendo</span>
                  <div className="w-16 h-1.5 bg-amber-900 rounded-full overflow-hidden border border-amber-600/30">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round(((now - selectedEntity.cropData!.plantedAt!) / 1000) / selectedEntity.cropData!.growDuration * 100))}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {activeDragTool && (
        <div
          style={{
            position: 'fixed',
            left: dragCursorPos.x,
            top: dragCursorPos.y,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
          className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] select-none pointer-events-none"
        >
          {activeDragTool === 'scythe' ? (
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full border-3 border-amber-950 shadow-2xl flex items-center justify-center rotate-[-15deg] animate-bounce">
              <ScytheSvg size={42} />
            </div>
          ) : (() => {
            const seed = activeDragTool.replace('plant_', '');
            const icon =
              seed === 'wheat'
                ? '🌾'
                : seed === 'corn'
                ? '🌽'
                : seed === 'sugarcane'
                ? '🎋'
                : seed === 'carrot'
                ? '🥕'
                : seed === 'pumpkin'
                ? '🎃'
                : '🌱';
            return (
              <div className="w-14 h-14 bg-amber-950/95 text-3xl rounded-full border-2 border-yellow-300 shadow-2xl flex items-center justify-center animate-pulse">
                {icon}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

interface VisualContext {
  entity: FarmEntity;
  currentTime: number;
  onHarvestCrop: (id: string) => void;
  onCollectAnimal: (id: string, idx: number) => void;
  onCollectBuilding: (id: string) => void;
  isSelected?: boolean;
  graphicsStyle: '3d_rendered' | 'vector';
  siloUsed: number;
  siloCap: number;
  siloLevel: number;
  barnUsed: number;
  barnCap: number;
  barnLevel: number;
  playerLevel: number;
  farmName: string;
  hasFulfillableOrders: boolean;
  availableOrdersCount: number;
  hasRoadsideCoinsToCollect: boolean;
  canSpinWheel: boolean;
  onOpenSilo?: () => void;
  onOpenBarn?: () => void;
  onOpenFarmhouse?: () => void;
  onOpenOrderBoard?: () => void;
  onOpenRoadsideShop?: () => void;
  onOpenLuckyWheel?: () => void;
  onOpenBeeTree?: (entity: FarmEntity) => void;
  onRemoveDeadEntity?: (entityId: string) => void;
  inventory?: Record<string, number>;
  onFeedAnimals?: (entityId: string) => void;
}

// Sub-renderer for rich realistic Hay Day isometric entity graphics
function renderEntityVisual(ctx: VisualContext) {
  const {
    entity,
    currentTime,
    onHarvestCrop,
    onCollectAnimal,
    onCollectBuilding,
    onFeedAnimals,
    inventory = {},
    isSelected,
    graphicsStyle,
    siloUsed,
    siloCap,
    siloLevel,
    barnUsed,
    barnCap,
    barnLevel,
    playerLevel,
    farmName,
    hasFulfillableOrders,
    availableOrdersCount,
    hasRoadsideCoinsToCollect,
    canSpinWheel,
    onOpenSilo,
    onOpenBarn,
    onOpenFarmhouse,
    onOpenOrderBoard,
    onOpenRoadsideShop,
    onOpenLuckyWheel,
    onOpenBeeTree,
    onRemoveDeadEntity,
  } = ctx;

  const is3D = graphicsStyle === '3d_rendered';

  switch (entity.type) {
    case 'crop_plot': {
      const cropData = entity.cropData;
      return (
        <IsoCropPlot
          cropId={cropData?.cropId}
          plantedAt={cropData?.plantedAt}
          growDuration={cropData?.growDuration}
          currentTime={currentTime}
          onHarvest={() => onHarvestCrop(entity.id)}
        />
      );
    }

    case 'animal_pen': {
      const pen = entity.animalData;
      if (!pen) return null;
      const penDef = ANIMAL_PENS[pen.animalType];
      const feedCount = penDef ? (inventory[penDef.feedId] || 0) : 0;
      return (
        <IsoAnimalPen
          animalType={pen.animalType}
          animals={pen.animals}
          currentTime={currentTime}
          onCollectAnimal={(idx) => onCollectAnimal(entity.id, idx)}
          onFeedAnimals={() => {
            if (onFeedAnimals) {
              onFeedAnimals(entity.id);
            }
          }}
          hasFeed={feedCount > 0}
        />
      );
    }

    case 'building': {
      const bData = entity.buildingData;
      if (!bData) return null;
      const bDef = BUILDINGS[bData.buildingType];
      const completedItems = Array.isArray(bData.completedItems) ? bData.completedItems : [];
      const queue = Array.isArray(bData.queue) ? bData.queue : [];
      const hasCompleted = completedItems.length > 0;
      const isWorking = queue.length > 0;

      // Calculate Building Mastery Stars
      const crafts = (bData.totalCrafted || 0) + completedItems.length;
      const stars = crafts >= 50 ? 3 : crafts >= 25 ? 2 : crafts >= 10 ? 1 : 0;

      return (
        <div className="relative flex flex-col items-center justify-center">
          {/* Specific Realistic Building Graphic: 3D Pre-rendered Models vs Vector */}
          {is3D && HD_BUILDING_SPRITES[bData.buildingType as keyof typeof HD_BUILDING_SPRITES] ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES[bData.buildingType as keyof typeof HD_BUILDING_SPRITES]}
              alt={bDef?.name || bData.buildingType}
              widthPx={176}
              heightPx={176}
              isWorking={isWorking}
              isSelected={isSelected}
              baseType={
                bData.buildingType === 'bakery' || bData.buildingType === 'bbq_grill'
                  ? 'cobblestone'
                  : bData.buildingType === 'dairy' || bData.buildingType === 'popcorn_pot'
                  ? 'wood'
                  : 'dirt'
              }
            />
          ) : (
            <>
              {bData.buildingType === 'bakery' && <IsoBakery isWorking={isWorking} />}
              {bData.buildingType === 'feed_mill' && <IsoFeedMill isWorking={isWorking} />}
              {bData.buildingType === 'dairy' && <IsoDairy isWorking={isWorking} />}
              {bData.buildingType === 'sugar_mill' && <IsoSugarMill isWorking={isWorking} />}
              {bData.buildingType === 'popcorn_pot' && <IsoPopcornPot isWorking={isWorking} />}
              {bData.buildingType === 'bbq_grill' && <IsoBBQGrill isWorking={isWorking} />}
              {bData.buildingType === 'honey_extractor' && <IsoHoneyExtractor isWorking={isWorking} />}
              {bData.buildingType === 'smelter' && <IsoSmelter isWorking={isWorking} />}
            </>
          )}

          {/* 1. Live Production Progress Badge with Circular Progress & Countdown */}
          {isWorking && !hasCompleted && queue.length > 0 && (() => {
            const activeItem = queue[0];
            if (!activeItem) return null;
            const activeRecipe = RECIPES.find((r) => r.id === activeItem.recipeId);
            const duration = activeItem.durationSeconds || 1;
            const elapsed = Math.max(0, (currentTime - (activeItem.startedAt || currentTime)) / 1000);
            const remaining = Math.max(0, Math.ceil(duration - elapsed));
            const progressPct = Math.min(100, Math.max(0, (elapsed / duration) * 100));
            const mm = Math.floor(remaining / 60);
            const ss = remaining % 60;
            const timeStr = mm > 0 ? `${mm}:${ss < 10 ? '0' : ''}${ss}` : `${ss}s`;

            return (
              <div className="absolute -top-8 z-20 flex items-center gap-1.5 bg-linear-to-r from-amber-950/95 via-amber-900/95 to-amber-950/95 text-amber-100 px-2.5 py-1 rounded-full border border-amber-400/80 shadow-xl backdrop-blur-xs select-none pointer-events-none">
                {/* Mini Circular Progress Ring */}
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="4"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * progressPct) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[10px]">
                    {activeRecipe?.id ? ITEMS[activeRecipe.id]?.icon : '⚙️'}
                  </span>
                </div>

                <span className="text-[10px] font-black text-amber-200">{timeStr}</span>

                {/* Additional Queued Items Count */}
                {queue.length > 1 && (
                  <span className="bg-amber-700 text-amber-100 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    +{queue.length - 1}
                  </span>
                )}
              </div>
            );
          })()}

          {/* 2. Floating 3D Golden Harvest Bubbles (Direct Tap-to-Collect) */}
          {hasCompleted && completedItems.length > 0 && (
            <div className="absolute -top-11 z-30 flex items-center justify-center animate-bubble-float pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCollectBuilding(entity.id);
                }}
                className="group relative flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 hover:scale-110"
                title="Toque para coletar produtos prontos!"
              >
                {/* Ambient Golden Glow */}
                <div className="absolute inset-0 rounded-full bg-amber-400/50 blur-md animate-pulse pointer-events-none" />

                {/* Bubble Shell */}
                <div className="relative w-12 h-12 rounded-full bg-linear-to-b from-amber-200 via-amber-400 to-amber-600 border-2 border-yellow-100 shadow-xl flex items-center justify-center ring-2 ring-amber-500/50">
                  <span className="text-2xl filter drop-shadow-md select-none transform transition-transform group-hover:scale-115">
                    {ITEMS[completedItems[0]]?.icon || '📦'}
                  </span>

                  {/* Multiple Items Count Badge */}
                  {completedItems.length > 1 && (
                    <div className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-md">
                      x{completedItems.length}
                    </div>
                  )}
                </div>

                {/* Tap Hint on Hover */}
                <div className="absolute -bottom-4 bg-black/80 text-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                  Coletar!
                </div>
              </button>
            </div>
          )}

          {/* 2. Floating 3D Golden Harvest Bubbles (Direct Tap-to-Collect when ready) */}
          {hasCompleted && completedItems.length > 0 && (
            <div className="absolute -top-11 z-30 flex items-center justify-center animate-bubble-float pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCollectBuilding(entity.id);
                }}
                className="group relative flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 hover:scale-110"
                title="Toque para coletar produtos prontos!"
              >
                {/* Ambient Golden Glow */}
                <div className="absolute inset-0 rounded-full bg-amber-400/50 blur-md animate-pulse pointer-events-none" />

                {/* Bubble Shell */}
                <div className="relative w-12 h-12 rounded-full bg-linear-to-b from-amber-200 via-amber-400 to-amber-600 border-2 border-yellow-100 shadow-xl flex items-center justify-center ring-2 ring-amber-500/50">
                  <span className="text-2xl filter drop-shadow-md select-none transform transition-transform group-hover:scale-115">
                    {ITEMS[completedItems[0]]?.icon || '📦'}
                  </span>

                  {/* Multiple Items Count Badge */}
                  {completedItems.length > 1 && (
                    <div className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-md">
                      x{completedItems.length}
                    </div>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      );
    }

    case 'farmhouse': {
      return (
        <div
          onClick={(e) => {
            if (onOpenFarmhouse) {
              e.stopPropagation();
              onOpenFarmhouse();
            }
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer"
        >
          {is3D ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.farmhouse}
              alt="Casa Principal"
              widthPx={208}
              heightPx={208}
              isSelected={isSelected}
              baseType="cobblestone"
            />
          ) : (
            <IsoFarmhouse isSelected={isSelected} />
          )}
        </div>
      );
    }

    case 'silo': {
      return (
        <div
          onClick={(e) => {
            if (onOpenSilo) {
              e.stopPropagation();
              onOpenSilo();
            }
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer"
        >
          {is3D ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.silo}
              alt="Silo de Grãos"
              widthPx={160}
              heightPx={208}
              isSelected={isSelected}
              baseType="dirt"
            />
          ) : (
            <IsoSilo isSelected={isSelected} />
          )}
        </div>
      );
    }

    case 'barn': {
      return (
        <div
          onClick={(e) => {
            if (onOpenBarn) {
              e.stopPropagation();
              onOpenBarn();
            }
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer"
        >
          {is3D ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.barn}
              alt="Celeiro"
              widthPx={208}
              heightPx={208}
              isSelected={isSelected}
              baseType="dirt"
            />
          ) : (
            <IsoBarn isSelected={isSelected} />
          )}
        </div>
      );
    }

    case 'order_board': {
      return (
        <div
          onClick={(e) => {
            if (onOpenOrderBoard) {
              e.stopPropagation();
              onOpenOrderBoard();
            }
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer"
        >
          {is3D ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.order_board}
              alt="Quadro de Pedidos"
              widthPx={144}
              heightPx={144}
              isSelected={isSelected}
              baseType="dirt"
            />
          ) : (
            <IsoOrderBoard />
          )}
        </div>
      );
    }

    case 'roadside_shop': {
      return (
        <div
          onClick={(e) => {
            if (onOpenRoadsideShop) {
              e.stopPropagation();
              onOpenRoadsideShop();
            }
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer"
        >
          {is3D ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.roadside_shop}
              alt="Banca de Vendas"
              widthPx={176}
              heightPx={176}
              isSelected={isSelected}
              baseType="wood"
            />
          ) : (
            <IsoRoadsideShop isSelected={isSelected} />
          )}
        </div>
      );
    }

    case 'lucky_wheel': {
      return (
        <div
          onClick={(e) => {
            if (onOpenLuckyWheel) {
              e.stopPropagation();
              onOpenLuckyWheel();
            }
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer"
        >
          {is3D ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.lucky_wheel}
              alt="Caminhão da Roleta"
              widthPx={176}
              heightPx={176}
              isSelected={isSelected}
              baseType="dirt"
            />
          ) : (
            <IsoLuckyWheel isSelected={isSelected} />
          )}
        </div>
      );
    }

    case 'decoration': {
      return (
        <div className="relative flex flex-col items-center justify-center">
          <IsoDecoration
            type={entity.decorationType || 'scarecrow'}
            isSelected={isSelected}
          />
        </div>
      );
    }

    case 'bee_tree': {
      const data = entity.beeTreeData || { stage: 1, beesCount: 5, nectarCount: 0, maxNectar: 100 };
      const isFull = data.nectarCount >= data.maxNectar;
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenBeeTree) onOpenBeeTree(entity);
          }}
          className="relative flex flex-col items-center justify-center cursor-pointer"
        >
          {/* Nectar Status Bubble */}
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 z-35 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-lg border-2 transition-all ${
              isFull
                ? 'bg-amber-500 text-white border-yellow-200 animate-bounce shadow-yellow-400/50'
                : data.nectarCount > 0
                ? 'bg-amber-950/90 text-yellow-300 border-amber-400'
                : 'bg-amber-900/60 text-amber-200 border-amber-600/40'
            }`}
          >
            <span>🍯</span>
            <span>{data.nectarCount}/100</span>
            {isFull && <span className="text-[9px] text-yellow-200 uppercase font-extrabold ml-0.5">CHEIO!</span>}
          </div>

          {is3D && HD_BUILDING_SPRITES.bee_tree ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.bee_tree}
              alt="Árvore de Abelhas"
              widthPx={180}
              heightPx={180}
              isSelected={isSelected}
              baseType="dirt"
            />
          ) : (
            <IsoBeeTree
              entity={entity}
              isSelected={isSelected}
              onOpenModal={() => {
                if (onOpenBeeTree) onOpenBeeTree(entity);
              }}
            />
          )}
        </div>
      );
    }

    case 'nectar_bush': {
      const data = entity.nectarBushData || { nectarLeft: 200, maxNectar: 200, isWilted: false };
      const isWilted = data.nectarLeft <= 0 || data.isWilted;
      const spriteKey = isWilted ? 'nectar_bush_wilted' : 'nectar_bush';
      const sprite = HD_BUILDING_SPRITES[spriteKey];

      return (
        <div className="relative flex flex-col items-center justify-center cursor-pointer">
          {/* Nectar left status bubble */}
          <div className={`absolute -top-2 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-full text-[9px] font-black border shadow-md ${
            isWilted ? 'bg-red-950/95 text-red-200 border-red-500/50' : 'bg-amber-950/90 text-yellow-300 border-amber-400'
          }`}>
            {isWilted ? '🥀 Seco' : `🌸 ${data.nectarLeft}/${data.maxNectar}`}
          </div>

          {/* Tool label indicator above if selected & dry */}
          {isSelected && isWilted && (
            <div className="absolute -top-7 z-30 bg-amber-950/95 text-yellow-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-amber-400 shadow-md">
              🪓 Machado
            </div>
          )}

          {is3D && sprite ? (
            <Iso3DSpriteBuilding
              src={sprite}
              alt="Arbusto de Néctar"
              widthPx={110}
              heightPx={110}
              isSelected={isSelected}
              baseType="none"
            />
          ) : (
            <IsoNectarBush
              entity={entity}
              isSelected={isSelected}
            />
          )}
        </div>
      );
    }

    case 'dead_tree': {
      return (
        <div className="relative flex flex-col items-center justify-center cursor-pointer">
          {/* Tool label indicator above */}
          {isSelected && (
            <div className="absolute -top-7 z-30 bg-amber-950/95 text-yellow-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-amber-400 shadow-md">
              🪚 Serrote
            </div>
          )}

          {is3D && HD_BUILDING_SPRITES.dead_tree ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.dead_tree}
              alt="Árvore Seca Grande"
              widthPx={136}
              heightPx={136}
              isSelected={isSelected}
              baseType="none"
            />
          ) : (
            <div className={`relative flex flex-col items-center justify-center cursor-pointer ${isSelected ? 'scale-105 transition-transform' : ''}`}>
              <svg width="64" height="80" viewBox="0 0 64 80" className="overflow-visible filter drop-shadow-md">
                <path d="M 32 78 L 32 45 M 24 78 L 32 60 L 40 78" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
                <path d="M 32 50 C 26 40, 20 42, 14 38" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 32 45 C 38 35, 46 38, 52 32" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 32 58 Q 20 54 18 48" stroke="#5D4037" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 32 55 Q 44 50 48 44" stroke="#5D4037" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 14 38 Q 10 32 6 36 M 52 32 Q 58 26 62 30" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          )}
        </div>
      );
    }

    case 'dead_bush': {
      return (
        <div className="relative flex flex-col items-center justify-center cursor-pointer">
          {/* Tool label indicator above */}
          {isSelected && (
            <div className="absolute -top-7 z-30 bg-amber-950/95 text-yellow-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-amber-400 shadow-md">
              🪓 Machado
            </div>
          )}

          {is3D && HD_BUILDING_SPRITES.nectar_bush_wilted ? (
            <Iso3DSpriteBuilding
              src={HD_BUILDING_SPRITES.nectar_bush_wilted}
              alt="Arbusto Morto Pequeno"
              widthPx={100}
              heightPx={100}
              isSelected={isSelected}
              baseType="none"
            />
          ) : (
            <div className={`relative flex flex-col items-center justify-center cursor-pointer ${isSelected ? 'scale-105 transition-transform' : ''}`}>
              <svg width="48" height="48" viewBox="0 0 48 48" className="overflow-visible filter drop-shadow-md">
                <path d="M 24 45 Q 12 30 10 24" stroke="#8D6E63" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 24 45 Q 36 30 38 24" stroke="#8D6E63" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 24 45 Q 24 24 22 18" stroke="#8D6E63" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 18 36 Q 8 28 6 22" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 30 36 Q 40 28 42 22" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <ellipse cx="6" cy="22" rx="3" ry="1.5" fill="#795548" transform="rotate(-15 6 22)" />
                <ellipse cx="10" cy="24" rx="3" ry="1.5" fill="#795548" transform="rotate(30 10 24)" />
                <ellipse cx="38" cy="24" rx="3" ry="1.5" fill="#795548" transform="rotate(-30 38 24)" />
              </svg>
            </div>
          )}
        </div>
      );
    }

    case 'obstacle': {
      const type = entity.obstacleData?.type || 'pine';
      let toolRequired = '🪓 Machado';
      if (type === 'oak') toolRequired = '🪚 Serrote';
      if (type === 'rock') toolRequired = '🧨 Dinamite';
      if (type === 'bush') toolRequired = '🪓 Machado';

      return (
        <div className="relative flex flex-col items-center justify-center cursor-pointer">
          {/* Tool label indicator above */}
          {isSelected && (
            <div className="absolute -top-7 z-30 bg-amber-950/95 text-yellow-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-amber-400 shadow-md whitespace-nowrap">
              {toolRequired}
            </div>
          )}

          {/* Random variation based on ID or coords */}
          {(() => {
            const scale = 0.85 + (Math.sin(entity.x * 137 + entity.y * 311) * 0.2);
            return (
              <svg
                width="120"
                height="120"
                viewBox="-60 -70 120 120"
                className={`overflow-visible transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}
              >
                {type === 'pine' && <Detailed3DPine x={0} y={0} scale={scale} seed={entity.x * 17} />}
                {type === 'oak' && <Detailed3DOak x={0} y={0} scale={scale} seed={entity.y * 31} hasFruit={true} />}
                {type === 'rock' && <Detailed3DBoulder x={0} y={0} scale={scale} />}
                {type === 'bush' && <Detailed3DBush x={0} y={0} scale={scale} hasBerries={true} />}
              </svg>
            );
          })()}
        </div>
      );
    }

    default:
      return null;
  }
}
