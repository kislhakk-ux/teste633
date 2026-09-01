import React from 'react';
import { calculateIsoPlacement, TILE_WIDTH, TILE_HEIGHT } from '../../utils/isometricCoords';
import { FishingSpot } from '../../types/game';

// Base wrapper for simple SVG/Emoji isometric entities
const IsoEntityWrapper: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
  offsetY?: number;
}> = ({ x, y, width, height, children, offsetY = 0 }) => {
  const anchor = { widthPx: width * TILE_WIDTH, heightPx: height * TILE_HEIGHT, anchorX: 0.5, anchorY: 0.5, shadow: { width: 0, height: 0, opacity: 0 } };
  const { left, top, zIndex } = calculateIsoPlacement(x, y, width, height, anchor);
  return (
    <div
      className="absolute pointer-events-none drop-shadow-xl"
      style={{
        left,
        top: top + offsetY,
        width: TILE_WIDTH * width,
        height: TILE_HEIGHT * height,
        zIndex,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      {children}
    </div>
  );
};

export const IsoFishingHut: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <IsoEntityWrapper x={x} y={y} width={2} height={2} offsetY={-40}>
    <div className="relative w-full h-full flex flex-col items-center justify-end">
      {/* Wooden Dock base */}
      <div className="absolute bottom-0 w-32 h-16 bg-amber-900 rounded-md border-t-4 border-amber-800" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }} />
      {/* Red Hut */}
      <div className="relative w-24 h-24 bg-red-600 rounded-t-xl shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] border-4 border-red-800 flex items-center justify-center">
        <div className="absolute -top-6 w-28 h-12 bg-gray-800 rounded-t-full shadow-lg" />
        <div className="w-8 h-12 bg-amber-200 border-4 border-amber-900 rounded-t-md relative mt-4">
           <div className="absolute top-1/2 left-1 w-2 h-2 bg-amber-900 rounded-full" />
        </div>
        <div className="absolute -right-4 top-1/4 w-8 h-8 bg-blue-300 rounded-full border-4 border-gray-400" />
      </div>
    </div>
  </IsoEntityWrapper>
);

export const IsoLureMaker: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <IsoEntityWrapper x={x} y={y} width={1} height={1}>
    <div className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🎣</div>
  </IsoEntityWrapper>
);

export const IsoNetMaker: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <IsoEntityWrapper x={x} y={y} width={1} height={1}>
    <div className="text-6xl drop-shadow-md">🕸️</div>
  </IsoEntityWrapper>
);

export const IsoDuckTrap: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <IsoEntityWrapper x={x} y={y} width={1} height={1}>
    <div className="text-5xl animate-pulse">🦆</div>
  </IsoEntityWrapper>
);

export const IsoShrimpTrap: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <IsoEntityWrapper x={x} y={y} width={1} height={1}>
    <div className="text-5xl drop-shadow-lg">🦞</div>
  </IsoEntityWrapper>
);

export const IsoWaterfall: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <IsoEntityWrapper x={x} y={y} width={2} height={2} offsetY={-60}>
    <div className="relative w-32 h-48 bg-blue-400 rounded-b-3xl overflow-hidden shadow-inner border-t-8 border-gray-400 flex flex-col justify-end">
      <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 animate-pulse" />
      <div className="w-full h-8 bg-white/60 animate-bounce blur-sm" />
    </div>
  </IsoEntityWrapper>
);

export const IsoFishSpot: React.FC<{
  x: number;
  y: number;
  spot: FishingSpot;
  selectedLure: string | null;
  isActive: boolean;
  onClick: () => void;
}> = ({ x, y, spot, selectedLure, isActive, onClick }) => {
  const isCooldown = spot.status === 'cooldown';
  const anchor = { widthPx: TILE_WIDTH, heightPx: TILE_HEIGHT, anchorX: 0.5, anchorY: 0.5, shadow: { width: 0, height: 0, opacity: 0 } };
  const { left, top, zIndex } = calculateIsoPlacement(x, y, 1, 1, anchor);
  
  return (
    <div
      className={`absolute flex items-center justify-center transition-transform ${!isCooldown && selectedLure && !isActive ? 'cursor-pointer hover:scale-110' : ''}`}
      style={{
        left: left + TILE_WIDTH/2 - 40,
        top: top + TILE_HEIGHT/2 - 40,
        width: 80,
        height: 80,
        zIndex: zIndex + 1,
        pointerEvents: 'auto'
      }}
      onClick={onClick}
    >
      {isCooldown ? (
         <div className="w-16 h-16 bg-blue-900/60 rounded-full border-4 border-blue-800/80 flex items-center justify-center shadow-inner" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
           <span className="text-xl opacity-50 transform -rotate-45 -rotate-x-60">⏳</span>
         </div>
      ) : (
         <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="absolute w-20 h-20 border-4 border-cyan-300 rounded-full animate-ping opacity-60" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }} />
            <div className="w-16 h-16 bg-cyan-400/50 rounded-full border-2 border-cyan-200 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.8)] z-10" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
              <span className="text-2xl animate-bounce drop-shadow-md transform -rotate-45 -rotate-x-60">🐟</span>
            </div>
            {selectedLure && !isActive && (
              <div className="absolute -top-6 bg-green-500 text-white text-xs font-black px-2 py-1 rounded-full whitespace-nowrap drop-shadow-md animate-pulse pointer-events-none">
                PESCAR
              </div>
            )}
         </div>
      )}
    </div>
  );
};
