import React, { useState, useRef, useEffect } from 'react';
import { gridToScreen } from '../utils/isometricCoords';
import { FishingSpot } from '../types/game';
import { sound } from '../utils/sound';
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
  IsoFisherman,
  IsoWaterLog,
  IsoDuckSalon,
  IsoExpansionSpot,
} from './isometric/IsoFishingEntities';
import { IsoFishingScenery } from './isometric/IsoFishingScenery';

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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.55);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<WaterClickRipple[]>([]);

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

  // Spawn water ripple on tap/click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (wasMapDraggedRef.current) return;
    if ((e.target as HTMLElement).closest('.cursor-pointer')) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate position in world coordinates
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    const newRipple: WaterClickRipple = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
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
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if ((e.target as HTMLElement).closest('.ui-element')) return;
    e.preventDefault();

    const zoomSensitivity = 0.001;
    let newZoom = zoom - e.deltaY * zoomSensitivity;
    newZoom = Math.max(0.6, Math.min(newZoom, 2.2));

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
      newZoom = Math.max(0.6, Math.min(newZoom, 2.2));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchStartDistRef.current = null;
    }
  };

  const spotPositions = [
    { gridX: 7, gridY: 6.5 },
    { gridX: 10.5, gridY: 6.5 },
    { gridX: 6.5, gridY: 10.5 },
    { gridX: 12, gridY: 11.5 },
    { gridX: 8.5, gridY: 13 },
  ];

  return (
    <div
      className="relative w-full h-full bg-[#0d47a1] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCanvasClick}
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute origin-top-left will-change-transform"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Scenery: Rocky Mountains Ridge, Shorelines, Island & Crystal Detailed Lake */}
        <IsoFishingScenery />

        {/* 1. 3D MOUNTAIN WATERFALL (Integrated in Cliff, Facing Forward into Lake) */}
        <IsoWaterfall x={1.2} y={0.8} />

        {/* Dense Mountain Ridge Evergreen Forest (No empty green plane visible!) */}
        {/* Upper Mountain Crest */}
        <IsoPineTree x={-1.5} y={-1.2} scale={1.5} offsetY={-70} />
        <IsoPineTree x={-0.2} y={-1.5} scale={1.6} offsetY={-75} />
        <IsoLakeTree x={1.8} y={-1.6} scale={1.4} offsetY={-70} />
        <IsoPineTree x={3.6} y={-1.8} scale={1.5} offsetY={-75} />
        <IsoPineTree x={5.5} y={-1.8} scale={1.6} offsetY={-80} />
        <IsoLakeTree x={7.5} y={-1.8} scale={1.5} offsetY={-75} />
        <IsoPineTree x={9.5} y={-1.6} scale={1.6} offsetY={-75} />
        <IsoPineTree x={11.8} y={-1.5} scale={1.5} offsetY={-70} />
        <IsoLakeTree x={13.8} y={-1.2} scale={1.4} offsetY={-65} />
        <IsoPineTree x={15.5} y={-0.8} scale={1.5} offsetY={-70} />

        {/* Left Rocky Mountain Flank */}
        <IsoPineTree x={-1.2} y={1.5} scale={1.4} offsetY={-65} />
        <IsoPineTree x={-1.4} y={4} scale={1.5} offsetY={-70} />
        <IsoLakeTree x={-1.2} y={7} scale={1.3} offsetY={-60} />
        <IsoPineTree x={-1.4} y={10} scale={1.4} offsetY={-65} />
        <IsoLakeTree x={-1.2} y={13.5} scale={1.4} offsetY={-60} />
        <IsoPineTree x={-0.8} y={15.5} scale={1.3} offsetY={-50} />

        {/* Right Mountain & Cove Flank */}
        <IsoPineTree x={16.2} y={1.5} scale={1.4} offsetY={-65} />
        <IsoLakeTree x={16.5} y={4.5} scale={1.3} offsetY={-60} />
        <IsoPineTree x={16.2} y={8} scale={1.4} offsetY={-65} />
        <IsoPineTree x={16} y={11} scale={1.3} offsetY={-60} />
        <IsoLakeTree x={15.8} y={14} scale={1.3} offsetY={-50} />

        {/* Lower Foreshore Framing */}
        <IsoLakeTree x={5.5} y={16.2} scale={1.2} offsetY={-40} />
        <IsoPineTree x={9} y={16.2} scale={1.3} offsetY={-40} />
        <IsoLakeTree x={12.5} y={16} scale={1.2} offsetY={-40} />

        {/* 2. THE LONE PINE ISLAND (Ilhota no Lago com Pinheiro Hay Day) */}
        <IsoPineTree x={3.8} y={11.8} scale={1.15} offsetY={-65} />

        {/* 3. 3D FISHING CABIN (Cabana de Pesca no Píer de Madeira) */}
        <IsoFishingHut
          x={3}
          y={2.6}
          onClick={() => {
            if (!wasMapDraggedRef.current) {
              onHutClick();
            }
          }}
        />

        {/* 4. 3D FISHERMAN (Angus com Vara de Pescar e Caixa de Iscas no Píer) */}
        <IsoFisherman x={4.3} y={3.4} offsetY={-60} />

        {/* 5. 3D LURE MAKER WORKBENCH (Bancada de Iscas) */}
        <IsoLureMaker
          x={5.8}
          y={1.8}
          onClick={() => {
            if (!wasMapDraggedRef.current) {
              onLureMakerClick?.();
            }
          }}
        />

        {/* 6. 3D NET MAKER MACHINE (Fabricador de Redes) */}
        <IsoNetMaker
          x={1.8}
          y={4.5}
          onClick={() => {
            if (!wasMapDraggedRef.current) {
              onNetMakerClick?.();
            }
          }}
        />

        {/* 7. 3D DUCK SALON (Salão de Tratamento de Patos no Hay Day) */}
        <IsoDuckSalon
          x={14.8}
          y={3.6}
          onClick={() => {
            sound.playDuckQuack?.();
          }}
        />

        {/* 8. 3D HOLLOW WATER LOGS & BARRELS (Troncos Submersos no Lago) */}
        <IsoWaterLog x={11.5} y={5.2} offsetY={-40} scale={1.05} />
        <IsoWaterLog x={4.2} y={8.2} offsetY={-40} scale={0.9} />

        {/* 9. 3D Swimming Mallard Ducks with water wakes */}
        <IsoDuckTrap x={8.5} y={4.2} />
        <IsoDuckTrap x={13} y={7.8} />

        {/* 10. 3D Lobster Pot Cage with floating buoy */}
        <IsoShrimpTrap x={3.2} y={9.5} />

        {/* 11. Vivid 3D Fishing Spots with jumping 3D fish */}
        {spots.map((spot, index) => {
          const gridPos = spotPositions[index % spotPositions.length];
          return (
            <IsoFishSpot
              key={spot.id}
              spot={spot}
              x={gridPos.gridX}
              y={gridPos.gridY}
              selectedLure={selectedLure}
              isActive={activeSpot === spot.id}
              onClick={() => {
                if (!wasMapDraggedRef.current) {
                  onSpotClick(spot);
                }
              }}
            />
          );
        })}

        {/* 12. EXPANSION FISHING BAYS (Lagos de Expansão com Estacas de Madeira Hay Day) */}
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
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30"
            style={{ left: ripple.x, top: ripple.y }}
          >
            <div
              className="w-16 h-10 border-2 border-cyan-200/80 rounded-full animate-ping"
              style={{ transform: 'rotateX(55deg)', animationDuration: '1s' }}
            />
            <div
              className="w-8 h-5 border border-white rounded-full animate-pulse"
              style={{ transform: 'rotateX(55deg)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
