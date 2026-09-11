import React, { useState, useRef, useEffect } from 'react';
import { gridToScreen, screenToGrid } from '../utils/isometricCoords';
import { FishingSpot } from '../types/game';
import { sound } from '../utils/sound';
import { LakeEntity, LakeEntityType } from '../types/adm';
import { TerrainGridMap } from '../utils/admStorage';
import {
  IsoFishingHut,
  IsoLureMaker,
  IsoNetMaker,
  IsoWaterfall,
  IsoFishSpot,
  IsoDuckTrap,
  IsoShrimpTrap,
  IsoPineTree,
  IsoLakeTree,
  IsoWaterLog,
  IsoDuckSalon,
  IsoFisherman,
  IsoExpansionSpot,
  IsoEntityWrapper,
} from './isometric/IsoFishingEntities';
import { IsoFishingScenery } from './isometric/IsoFishingScenery';
import { IsoLakeTerrainOverlay } from './isometric/IsoLakeTerrainOverlay';
import { RiverStone, Cattails, WaterLily } from './isometric/IsoScenery';

export const FISHING_MAP_SIZE = 16;

interface FishingCanvasProps {
  spots: FishingSpot[];
  activeSpot: string | null;
  onSpotClick: (spot: FishingSpot) => void;
  selectedLure: string | null;
  onReturnToFarm: () => void;
  onHutClick: () => void;
  onLureMakerClick?: () => void;
  onNetMakerClick?: () => void;
  onExpansionUnlock?: (name: string, cost: number) => void;

  // ADM Mode Props
  isAdmMode?: boolean;
  activeAdmTab?: 'objects' | 'terrain' | 'transform';
  entities?: LakeEntity[];
  onEntitiesChange?: (entities: LakeEntity[]) => void;
  selectedEntityId?: string | null;
  onSelectEntity?: (id: string | null) => void;
  entityToPlace?: LakeEntityType | null;
  onPlaceEntityAt?: (gx: number, gy: number) => void;
  terrainMap?: TerrainGridMap;
  selectedTiles?: { x: number; y: number }[];
  onTileClick?: (gx: number, gy: number) => void;
  onTileAreaSelected?: (tiles: { x: number; y: number }[]) => void;
}

interface WaterClickRipple {
  id: number;
  x: number;
  y: number;
}

export const FishingCanvas: React.FC<FishingCanvasProps> = ({
  spots,
  activeSpot,
  onSpotClick,
  selectedLure,
  onHutClick,
  onLureMakerClick,
  onNetMakerClick,
  onExpansionUnlock,

  isAdmMode = false,
  activeAdmTab = 'objects',
  entities = [],
  onEntitiesChange,
  selectedEntityId = null,
  onSelectEntity,
  entityToPlace = null,
  onPlaceEntityAt,
  terrainMap = {},
  selectedTiles = [],
  onTileClick,
  onTileAreaSelected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.55);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<WaterClickRipple[]>([]);

  // ADM Dragging state for entities and area selection
  const [draggingEntityId, setDraggingEntityId] = useState<string | null>(null);
  const [dragStartTile, setDragStartTile] = useState<{ x: number; y: number } | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);

  const wasMapDraggedRef = useRef<boolean>(false);
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);

  useEffect(() => {
    if (!isInitialized && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const centerScreen = gridToScreen(7.5, 7.5);

      setPan({
        x: width / 2 - centerScreen.x * 1.55,
        y: height / 2 - centerScreen.y * 1.55 + 50,
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Spawn water ripple on tap/click (or place object in ADM)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (wasMapDraggedRef.current) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;

    if (isAdmMode && entityToPlace) {
      const grid = screenToGrid(clickScreenX, clickScreenY, pan, zoom);
      const gx = Math.round(grid.x * 2) / 2;
      const gy = Math.round(grid.y * 2) / 2;
      onPlaceEntityAt?.(gx, gy);
      return;
    }

    if ((e.target as HTMLElement).closest('.cursor-pointer')) return;

    // Normal water click ripple
    const worldX = (clickScreenX - pan.x) / zoom;
    const worldY = (clickScreenY - pan.y) / zoom;

    const newRipple: WaterClickRipple = {
      id: Date.now() + Math.random(),
      x: worldX,
      y: worldY,
    };

    setRipples((prev) => [...prev.slice(-6), newRipple]);
    sound.playWaterSplash();

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  // Handle Drag / Pan / Zoom
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.ui-element')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    wasMapDraggedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // If dragging an entity in ADM mode
    if (draggingEntityId && onEntitiesChange && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const grid = screenToGrid(clickX, clickY, pan, zoom);
      const newGx = Math.round(grid.x * 2) / 2;
      const newGy = Math.round(grid.y * 2) / 2;

      onEntitiesChange(
        entities.map((ent) =>
          ent.id === draggingEntityId ? { ...ent, x: newGx, y: newGy } : ent
        )
      );
      wasMapDraggedRef.current = true;
      return;
    }

    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      wasMapDraggedRef.current = true;
    }

    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (draggingEntityId) {
      setDraggingEntityId(null);
      sound.playWoodHit();
    }
    setDragStartTile(null);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    if ((e.target as HTMLElement).closest('.ui-element')) return;
    e.preventDefault();

    const zoomSensitivity = 0.001;
    let newZoom = zoom - e.deltaY * zoomSensitivity;
    newZoom = Math.max(0.6, Math.min(newZoom, 2.4));

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scaleChange = newZoom - zoom;
      const newPanX = pan.x - (mouseX - pan.x) * (scaleChange / zoom);
      const newPanY = pan.y - (mouseY - pan.y) * (scaleChange / zoom);

      setPan({ x: newPanX, y: newPanY });
    }
    setZoom(newZoom);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const scale = dist / touchStartDistRef.current;

      let newZoom = touchStartZoomRef.current * scale;
      newZoom = Math.max(0.6, Math.min(newZoom, 2.4));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchStartDistRef.current = null;
    }
  };

  // Terrain selection handlers
  const handleTilePointerDown = (gx: number, gy: number) => {
    if (activeAdmTab === 'terrain') {
      setDragStartTile({ x: gx, y: gy });
      onTileClick?.(gx, gy);
    }
  };

  const handleTilePointerEnter = (gx: number, gy: number) => {
    setHoveredTile({ x: gx, y: gy });
    if (dragStartTile && activeAdmTab === 'terrain') {
      const minX = Math.min(dragStartTile.x, gx);
      const maxX = Math.max(dragStartTile.x, gx);
      const minY = Math.min(dragStartTile.y, gy);
      const maxY = Math.max(dragStartTile.y, gy);

      const newArea: { x: number; y: number }[] = [];
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          newArea.push({ x, y });
        }
      }
      onTileAreaSelected?.(newArea);
    }
  };

  // Helper to render an individual entity
  const renderEntity = (entity: LakeEntity) => {
    const isSelected = selectedEntityId === entity.id;
    const scale = entity.scale || 1;
    const flipH = entity.flipH || false;

    const handleEntitySelect = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (wasMapDraggedRef.current) return;

      if (isAdmMode) {
        sound.playPop();
        onSelectEntity?.(isSelected ? null : entity.id);
      }
    };

    const handleEntityPointerDown = (e: React.PointerEvent) => {
      if (isAdmMode && activeAdmTab === 'transform') {
        e.stopPropagation();
        onSelectEntity?.(entity.id);
        setDraggingEntityId(entity.id);
        wasMapDraggedRef.current = false;
      }
    };

    const wrapperProps = {
      className: `transition-transform duration-150 ${
        isAdmMode ? 'hover:brightness-110 cursor-move' : ''
      }`,
      style: {
        transform: `${flipH ? 'scaleX(-1)' : ''}`,
      },
    };

    let component: React.ReactNode = null;

    switch (entity.type) {
      case 'cabin':
        // RESTORED ORIGINAL CABIN (Sem senhor com varinha cobrindo!)
        component = (
          <IsoFishingHut
            x={entity.x}
            y={entity.y}
            onClick={() => {
              if (isAdmMode) {
                onSelectEntity?.(entity.id);
              } else if (!wasMapDraggedRef.current) {
                onHutClick();
              }
            }}
          />
        );
        break;

      case 'waterfall':
        component = <IsoWaterfall x={entity.x} y={entity.y} />;
        break;

      case 'pine':
        component = <IsoPineTree x={entity.x} y={entity.y} scale={scale} offsetY={-65} />;
        break;

      case 'lake_tree':
        component = <IsoLakeTree x={entity.x} y={entity.y} scale={scale} offsetY={-60} />;
        break;

      case 'lure_maker':
        component = (
          <IsoLureMaker
            x={entity.x}
            y={entity.y}
            onClick={() => {
              if (isAdmMode) {
                onSelectEntity?.(entity.id);
              } else if (!wasMapDraggedRef.current) {
                onLureMakerClick?.();
              }
            }}
          />
        );
        break;

      case 'net_maker':
        component = (
          <IsoNetMaker
            x={entity.x}
            y={entity.y}
            onClick={() => {
              if (isAdmMode) {
                onSelectEntity?.(entity.id);
              } else if (!wasMapDraggedRef.current) {
                onNetMakerClick?.();
              }
            }}
          />
        );
        break;

      case 'duck_salon':
        component = (
          <IsoDuckSalon
            x={entity.x}
            y={entity.y}
            onClick={() => {
              if (isAdmMode) {
                onSelectEntity?.(entity.id);
              } else {
                sound.playDuckQuack?.();
              }
            }}
          />
        );
        break;

      case 'duck':
        component = <IsoDuckTrap x={entity.x} y={entity.y} />;
        break;

      case 'shrimp_trap':
        component = <IsoShrimpTrap x={entity.x} y={entity.y} />;
        break;

      case 'water_log':
        component = <IsoWaterLog x={entity.x} y={entity.y} scale={scale} offsetY={-40} />;
        break;

      case 'fisherman':
        component = <IsoFisherman x={entity.x} y={entity.y} offsetY={-60} />;
        break;

      case 'fishing_spot': {
        const spotObj: FishingSpot = {
          id: entity.id,
          x: entity.x,
          y: entity.y,
          status: 'ready',
        };
        component = (
          <IsoFishSpot
            spot={spotObj}
            x={entity.x}
            y={entity.y}
            selectedLure={selectedLure}
            isActive={activeSpot === entity.id}
            onClick={() => {
              if (isAdmMode) {
                onSelectEntity?.(entity.id);
              } else if (!wasMapDraggedRef.current) {
                onSpotClick(spotObj);
              }
            }}
          />
        );
        break;
      }

      case 'river_stones': {
        const scr = gridToScreen(entity.x, entity.y);
        component = (
          <IsoEntityWrapper x={entity.x} y={entity.y} width={1} height={1}>
            <svg className="overflow-visible pointer-events-none">
              <RiverStone x={0} y={0} scale={scale} />
            </svg>
          </IsoEntityWrapper>
        );
        break;
      }

      case 'cattails': {
        component = (
          <IsoEntityWrapper x={entity.x} y={entity.y} width={1} height={1}>
            <svg className="overflow-visible pointer-events-none">
              <Cattails x={0} y={0} scale={scale} />
            </svg>
          </IsoEntityWrapper>
        );
        break;
      }

      case 'water_lily': {
        component = (
          <IsoEntityWrapper x={entity.x} y={entity.y} width={1} height={1}>
            <svg className="overflow-visible pointer-events-none">
              <WaterLily x={0} y={0} scale={scale} />
            </svg>
          </IsoEntityWrapper>
        );
        break;
      }

      case 'rowboat': {
        component = (
          <IsoEntityWrapper x={entity.x} y={entity.y} width={2} height={1.2} offsetY={-20}>
            <div className="relative select-none flex flex-col items-center">
              <span className="text-5xl drop-shadow-lg">🛶</span>
            </div>
          </IsoEntityWrapper>
        );
        break;
      }

      case 'lantern_post': {
        component = (
          <IsoEntityWrapper x={entity.x} y={entity.y} width={1} height={1} offsetY={-30}>
            <div className="relative select-none flex flex-col items-center">
              <div className="w-4 h-4 bg-amber-400 rounded-full blur-xs animate-pulse absolute -top-2" />
              <span className="text-4xl drop-shadow-md">🏮</span>
            </div>
          </IsoEntityWrapper>
        );
        break;
      }

      default:
        component = <IsoPineTree x={entity.x} y={entity.y} scale={scale} />;
    }

    return (
      <div
        key={entity.id}
        onClick={handleEntitySelect}
        onPointerDown={handleEntityPointerDown}
        {...wrapperProps}
      >
        {component}

        {/* Highlight Ring when Selected in ADM mode */}
        {isAdmMode && isSelected && (
          <div
            className="absolute pointer-events-none flex flex-col items-center justify-center z-50 animate-bounce"
            style={{
              left: `${gridToScreen(entity.x, entity.y).x - 36}px`,
              top: `${gridToScreen(entity.x, entity.y).y - 20}px`,
            }}
          >
            <div className="w-20 h-10 border-3 border-dashed border-yellow-300 rounded-[50%] bg-yellow-400/30 shadow-[0_0_20px_rgba(253,224,71,0.8)] flex items-center justify-center">
              <span className="text-[9px] font-black text-amber-950 bg-yellow-300 px-1.5 py-0.5 rounded-full shadow border border-white">
                OBJETO
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none ${
        isAdmMode
          ? entityToPlace
            ? 'cursor-crosshair'
            : activeAdmTab === 'terrain'
            ? 'cursor-cell'
            : 'cursor-default'
          : 'cursor-grab active:cursor-grabbing'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
    >
      {/* World transform root */}
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isDragging || draggingEntityId ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Scenery: Mountains Ridge, Shorelines & Detailed Lake */}
        <IsoFishingScenery />

        {/* Dynamic Terrain Overlays (Water Expansion / Grass / Pier / Sand) & ADM Selection Grid */}
        <IsoLakeTerrainOverlay
          terrainMap={terrainMap}
          isAdmMode={isAdmMode}
          activeTab={activeAdmTab}
          selectedTiles={selectedTiles}
          hoveredTile={hoveredTile}
          onTileClick={(gx, gy) => onTileClick?.(gx, gy)}
          onTilePointerDown={handleTilePointerDown}
          onTilePointerEnter={handleTilePointerEnter}
        />

        {/* Dynamic Entities Rendered from State (or defaults) */}
        {entities.map((entity) => renderEntity(entity))}

        {/* EXPANSION FISHING BAYS (Lagos de Expansão Hay Day) */}
        <IsoExpansionSpot
          x={14.2}
          y={13.5}
          name="Baía do Leste"
          cost={150}
          onUnlock={() => onExpansionUnlock?.('Baía do Leste', 150)}
        />
        <IsoExpansionSpot
          x={5}
          y={14.5}
          name="Enseada do Sul"
          cost={100}
          onUnlock={() => onExpansionUnlock?.('Enseada do Sul', 100)}
        />
        <IsoExpansionSpot
          x={9.5}
          y={14.5}
          name="Águas Profundas"
          cost={200}
          onUnlock={() => onExpansionUnlock?.('Águas Profundas', 200)}
        />

        {/* Dynamic Interactive Water Ripples on Player Tap */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 15,
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-8 border-2 border-cyan-200/90 rounded-[50%] animate-ping" />
              <div
                className="absolute w-24 h-12 border border-white/80 rounded-[50%] animate-ping"
                style={{ animationDuration: '1.2s' }}
              />
              <div className="absolute text-sm animate-bounce opacity-80">💧</div>
            </div>
          </div>
        ))}
      </div>

      {/* ADM Mode Top Indicator Banner */}
      {isAdmMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 px-5 py-1.5 rounded-full border-2 border-white shadow-2xl font-black text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300 drop-shadow-md">
          <span className="text-base animate-spin" style={{ animationDuration: '4s' }}>⚙️</span>
          <span>MODO ADMINISTRADOR ATIVO • SENHA 2412</span>
          <span className="bg-amber-950 text-yellow-300 text-[10px] px-2 py-0.5 rounded-full uppercase">
            {activeAdmTab === 'terrain'
              ? 'Área / Estender Lago'
              : activeAdmTab === 'objects'
              ? 'Criar Objetos'
              : 'Mover / Editar'}
          </span>
        </div>
      )}
    </div>
  );
};
