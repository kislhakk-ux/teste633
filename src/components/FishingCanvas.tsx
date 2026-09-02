import React, { useState, useRef, useEffect } from 'react';
import {
  gridToScreen,
  TILE_WIDTH,
  TILE_HEIGHT
} from '../utils/isometricCoords';
import { FishingSpot } from '../types/game';
import { sound } from '../utils/sound';
import { 
  IsoFishingHut, 
  IsoLureMaker, 
  IsoNetMaker, 
  IsoWaterfall, 
  IsoFishSpot, 
  IsoDuckTrap, 
  IsoShrimpTrap 
} from './isometric/IsoFishingEntities';
import { IsoScenery } from './isometric/IsoScenery';
import { IsoFishingScenery } from './isometric/IsoFishingScenery';

export const FISHING_MAP_SIZE = 16;

interface FishingCanvasProps {
  spots: FishingSpot[];
  activeSpot: string | null;
  onSpotClick: (spot: FishingSpot) => void;
  selectedLure: string | null;
  onReturnToFarm: () => void;
  onHutClick: () => void;
}

export const FishingCanvas: React.FC<FishingCanvasProps> = ({
  spots,
  activeSpot,
  onSpotClick,
  selectedLure,
  onReturnToFarm,
  onHutClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.2);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const wasMapDraggedRef = useRef<boolean>(false);
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);

  useEffect(() => {
    if (!isInitialized && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const centerScreen = gridToScreen(FISHING_MAP_SIZE / 2, FISHING_MAP_SIZE / 2);
      
      setPan({
        x: (width / 2) - (centerScreen.x * 1.2),
        y: (height / 2) - (centerScreen.y * 1.2) + 200 // Offset a bit to see the lake
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

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
    
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
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
    newZoom = Math.max(0.5, Math.min(newZoom, 2.5));

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
      newZoom = Math.max(0.5, Math.min(newZoom, 2.5));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchStartDistRef.current = null;
    }
  };

  const spotPositions = [
    { gridX: 6, gridY: 10 },
    { gridX: 10, gridY: 6 },
    { gridX: 12, gridY: 12 },
  ];

  return (
    <div 
      className="relative w-full h-full bg-[#1e88e5] overflow-hidden select-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <div 
        className="absolute origin-top-left will-change-transform"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <IsoFishingScenery />

        <IsoFishingHut 
          x={3} 
          y={3} 
          onClick={() => {
            if (!wasMapDraggedRef.current) {
              onHutClick();
            }
          }}
        />
        <IsoLureMaker x={5} y={1} />
        <IsoNetMaker x={1} y={5} />
        <IsoDuckTrap x={8} y={3} />
        <IsoShrimpTrap x={3} y={8} />
        <IsoWaterfall x={0} y={14} />

        {/* Removed IsoScenery */}

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
      </div>
    </div>
  );
};
