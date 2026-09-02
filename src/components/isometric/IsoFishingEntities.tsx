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

export const IsoFishingHut: React.FC<{ x: number; y: number; onClick?: () => void }> = ({ x, y, onClick }) => (
  <IsoEntityWrapper x={x} y={y} width={2} height={2} offsetY={-50}>
    <div 
      className={`relative w-48 h-48 flex flex-col items-center justify-end ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible drop-shadow-2xl">
        <defs>
          <linearGradient id="hut-wood-front" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E53935" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>
          <linearGradient id="hut-wood-side" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D32F2F" />
            <stop offset="100%" stopColor="#880E4F" />
          </linearGradient>
          <linearGradient id="roof-shingle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#607D8B" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>
          <linearGradient id="deck-wood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>
          <linearGradient id="beam-wood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#795548" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
        </defs>

        {/* --- DECK AND STILTS --- */}
        <g transform="translate(0, 110)">
          {/* Stilts submerged in water */}
          {[
            { x: 30, y: 15 },
            { x: 90, y: 45 },
            { x: 170, y: 5 },
            { x: 110, y: -25 },
            { x: 150, y: 25 },
            { x: 50, y: -15 },
          ].map((stilt, i) => (
            <g key={`stilt_${i}`} transform={`translate(${stilt.x}, ${stilt.y})`}>
              <rect x="-4" y="0" width="8" height="40" fill="url(#beam-wood)" />
              {/* Moss/Algae on stilts at water line */}
              <path d="M -4 30 Q 0 25 4 30 L 4 40 L -4 40 Z" fill="#33691E" opacity="0.8" />
            </g>
          ))}
          
          {/* Deck Platform (Isometric Polygon) */}
          <polygon points="100,-30 180,10 80,60 0,20" fill="url(#deck-wood)" stroke="#3E2723" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="0,20 80,60 80,65 0,25" fill="#4E342E" />
          <polygon points="80,60 180,10 180,15 80,65" fill="#3E2723" />
          
          {/* Planks lines */}
          <line x1="20" y1="10" x2="160" y2="20" stroke="#5D4037" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="0" x2="140" y2="30" stroke="#5D4037" strokeWidth="1" opacity="0.6" />
          <line x1="60" y1="-10" x2="120" y2="40" stroke="#5D4037" strokeWidth="1" opacity="0.6" />
        </g>

        {/* --- CABIN BODY --- */}
        <g transform="translate(100, 100)">
          {/* Side Wall */}
          <polygon points="0,0 60,-30 60,-90 0,-60" fill="url(#hut-wood-side)" stroke="#212121" strokeWidth="1" strokeLinejoin="round" />
          {/* Front Wall */}
          <polygon points="0,0 -70,-35 -70,-95 0,-60" fill="url(#hut-wood-front)" stroke="#212121" strokeWidth="1" strokeLinejoin="round" />
          
          {/* Wood Planks on Front Wall */}
          <line x1="-70" y1="-80" x2="0" y2="-45" stroke="#880E4F" strokeWidth="1" opacity="0.5" />
          <line x1="-70" y1="-65" x2="0" y2="-30" stroke="#880E4F" strokeWidth="1" opacity="0.5" />
          <line x1="-70" y1="-50" x2="0" y2="-15" stroke="#880E4F" strokeWidth="1" opacity="0.5" />
          
          {/* Corner Beam */}
          <polygon points="-3,2 3,-1 3,-61 -3,-58" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1" />
          <polygon points="-73,-33 -67,-36 -67,-96 -73,-93" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1" />
          <polygon points="63,-28 57,-31 57,-91 63,-88" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1" />

          {/* Door */}
          <g transform="translate(-40, -10)">
            <polygon points="0,0 25,12 25,-28 0,-40" fill="#FFECB3" stroke="#5D4037" strokeWidth="2" />
            {/* Door Frame */}
            <polygon points="-3,-1 0,0 0,-40 -3,-38" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
            <polygon points="25,12 28,11 28,-29 25,-28" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
            <polygon points="-3,-38 28,-29 25,-28 0,-40" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
            {/* Door Knob */}
            <circle cx="20" cy="-10" r="2" fill="#FFC107" stroke="#FF8F00" strokeWidth="0.5" />
            {/* Door window */}
            <polygon points="5,-25 20,-17 20,-10 5,-17" fill="#4FC3F7" stroke="#0288D1" strokeWidth="1" opacity="0.8" />
          </g>

          {/* Round Porthole Window (Front) */}
          <g transform="translate(-15, -60)">
            <ellipse cx="0" cy="0" rx="10" ry="14" fill="#4FC3F7" stroke="#ECEFF1" strokeWidth="4" transform="rotate(26)" />
            <line x1="-8" y1="-4" x2="8" y2="4" stroke="#ECEFF1" strokeWidth="2" transform="rotate(26)" />
            <line x1="-4" y1="8" x2="4" y2="-8" stroke="#ECEFF1" strokeWidth="2" transform="rotate(26)" />
          </g>

          {/* Side Window (Open with Net) */}
          <g transform="translate(30, -35)">
            <ellipse cx="0" cy="0" rx="12" ry="16" fill="#212121" stroke="#CFD8DC" strokeWidth="3" transform="rotate(-26)" />
            {/* Open hatch door */}
            <ellipse cx="15" cy="-8" rx="12" ry="16" fill="#B0BEC5" stroke="#78909C" strokeWidth="2" transform="rotate(-26)" />
            <line x1="5" y1="-14" x2="25" y2="-2" stroke="#78909C" strokeWidth="2" transform="rotate(-26)" />
            <line x1="11" y1="2" x2="19" y2="-18" stroke="#78909C" strokeWidth="2" transform="rotate(-26)" />
          </g>

          {/* Hanging Life Ring (Boia) */}
          <g transform="translate(-5, -25)">
            <ellipse cx="0" cy="0" rx="10" ry="15" fill="none" stroke="#FFFFFF" strokeWidth="5" transform="rotate(26)" />
            <path d="M -5 -10 L 5 5" stroke="#F44336" strokeWidth="6" strokeLinecap="round" transform="rotate(26)" />
            <path d="M -5 10 L 5 -5" stroke="#F44336" strokeWidth="6" strokeLinecap="round" transform="rotate(26)" />
            <text x="0" y="2" fontSize="4" fontWeight="bold" fill="#212121" transform="rotate(26)">SALVA</text>
          </g>
        </g>

        {/* --- ROOF --- */}
        <g transform="translate(100, 100)">
          {/* Main Roof Pitch (Facing viewer) */}
          <polygon points="-80,-90 -10,-130 70,-90 0,-50" fill="url(#roof-shingle)" stroke="#263238" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Shingle lines for texture */}
          <line x1="-60" y1="-80" x2="10" y2="-45" stroke="#37474F" strokeWidth="1" />
          <line x1="-40" y1="-90" x2="30" y2="-55" stroke="#37474F" strokeWidth="1" />
          <line x1="-20" y1="-100" x2="50" y2="-65" stroke="#37474F" strokeWidth="1" />
          
          <line x1="-70" y1="-95" x2="0" y2="-130" stroke="#37474F" strokeWidth="1" />
          <line x1="-50" y1="-85" x2="20" y2="-120" stroke="#37474F" strokeWidth="1" />

          {/* Large Roof Beam (Crane support) */}
          <polygon points="-20,-130 70,-85 75,-95 -15,-140" fill="#A1887F" stroke="#4E342E" strokeWidth="2" />
          
          {/* Crane / Pulley Mechanism */}
          <g transform="translate(-15, -140)">
            {/* Wooden arm extending out */}
            <polygon points="0,0 -30,15 -25,25 5,10" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
            {/* Wheel */}
            <circle cx="-25" cy="20" r="6" fill="#424242" stroke="#212121" strokeWidth="2" />
            <circle cx="-25" cy="20" r="2" fill="#BDBDBD" />
            {/* Rope hanging down */}
            <line x1="-31" y1="20" x2="-31" y2="70" stroke="#FFCC80" strokeWidth="2" strokeDasharray="3 1" />
            {/* Hook at the end of rope */}
            <path d="M -31 70 L -31 75 C -31 80 -25 80 -25 75" fill="none" stroke="#757575" strokeWidth="2" />
          </g>
          
          {/* Hooks attached to roof shingles */}
          <g transform="translate(10, -100)">
            <rect x="0" y="0" width="10" height="5" fill="#795548" transform="rotate(26)" />
            <line x1="5" y1="3" x2="5" y2="15" stroke="#BDBDBD" strokeWidth="1" />
            <path d="M 5 15 C 5 20 10 20 10 15" fill="none" stroke="#BDBDBD" strokeWidth="1" />
            {/* Lure on hook */}
            <ellipse cx="5" cy="10" rx="2" ry="4" fill="#FF5252" />
          </g>
          <g transform="translate(30, -90)">
            <rect x="0" y="0" width="10" height="5" fill="#795548" transform="rotate(26)" />
            <line x1="5" y1="3" x2="5" y2="20" stroke="#BDBDBD" strokeWidth="1" />
            <path d="M 5 20 C 5 25 10 25 10 20" fill="none" stroke="#BDBDBD" strokeWidth="1" />
            {/* Lure on hook */}
            <ellipse cx="5" cy="12" rx="2" ry="4" fill="#4CAF50" />
          </g>
        </g>

        {/* --- EXTERNAL DETAILS --- */}
        <g transform="translate(100, 100)">
          {/* Lantern by the door */}
          <g transform="translate(-15, -30)">
            <rect x="0" y="0" width="4" height="2" fill="#424242" />
            <rect x="-3" y="2" width="10" height="15" rx="3" fill="#FFF59D" stroke="#F57F17" strokeWidth="1" opacity="0.9" />
            {/* Glow */}
            <circle cx="2" cy="10" r="15" fill="#FFF59D" opacity="0.3" className="animate-pulse" />
          </g>
          
          {/* Giant Anchor on the deck */}
          <g transform="translate(45, 50)">
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#5D4037" strokeWidth="4" />
            <path d="M -15 10 C -15 25 15 25 15 10" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
            <polygon points="-15,10 -20,5 -10,5" fill="#5D4037" />
            <polygon points="15,10 20,5 10,5" fill="#5D4037" />
            <circle cx="0" cy="-22" r="4" fill="none" stroke="#5D4037" strokeWidth="2" />
            {/* Rope wrapped around anchor */}
            <path d="M -5 -15 Q 5 -5 -5 5 Q 5 15 0 20" fill="none" stroke="#FFCC80" strokeWidth="2" strokeDasharray="3 1" />
          </g>

          {/* Fishing Net draped over railing */}
          <g transform="translate(60, -10)">
            <path d="M 0 0 Q 30 10 20 40 Q -10 30 0 0" fill="none" stroke="#BCAAA4" strokeWidth="0.5" opacity="0.8" />
            <path d="M 5 0 Q 30 15 15 40 M 10 0 Q 25 20 10 35 M 15 0 Q 20 25 5 30" fill="none" stroke="#BCAAA4" strokeWidth="0.5" opacity="0.8" />
            <path d="M 0 5 Q 15 5 25 10 M 0 10 Q 20 10 25 20 M 0 15 Q 25 15 20 30" fill="none" stroke="#BCAAA4" strokeWidth="0.5" opacity="0.8" />
            {/* Glass Floats in the net */}
            <circle cx="10" cy="15" r="3" fill="#4DD0E1" stroke="#0097A7" strokeWidth="0.5" />
            <circle cx="20" cy="25" r="3" fill="#81C784" stroke="#388E3C" strokeWidth="0.5" />
            <circle cx="5" cy="30" r="3" fill="#FF8A65" stroke="#E64A19" strokeWidth="0.5" />
          </g>
          
          {/* Lobster Traps (Caixas empilhadas) on left side of deck */}
          <g transform="translate(-70, 0)">
            {/* Trap 1 */}
            <polygon points="0,0 -20,10 -10,15 10,5" fill="#A1887F" stroke="#4E342E" strokeWidth="1" />
            <polygon points="0,0 -20,-10 -10,-15 10,-5" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
            <polygon points="-20,10 -20,-10 0,0 0,20" fill="#795548" stroke="#4E342E" strokeWidth="1" />
            {/* Netting on trap */}
            <line x1="-15" y1="5" x2="-5" y2="10" stroke="#D7CCC8" strokeWidth="0.5" />
            <line x1="-15" y1="-5" x2="-5" y2="0" stroke="#D7CCC8" strokeWidth="0.5" />
          </g>
          <g transform="translate(-80, 5)">
            {/* Trap 2 */}
            <polygon points="0,0 -20,10 -10,15 10,5" fill="#A1887F" stroke="#4E342E" strokeWidth="1" />
            <polygon points="0,0 -20,-10 -10,-15 10,-5" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
            <polygon points="-20,10 -20,-10 0,0 0,20" fill="#795548" stroke="#4E342E" strokeWidth="1" />
          </g>

        </g>
        
        {/* Animated UI floating icon indicating it's clickable for Collection Book */}
        {onClick && (
          <g transform="translate(100, 30)" className="animate-bounce cursor-pointer">
             <circle cx="0" cy="0" r="14" fill="#4CAF50" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />
             <text x="0" y="5" fontSize="14" textAnchor="middle" fill="white">📖</text>
          </g>
        )}

      </svg>
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
    <div className="relative w-32 h-48 bg-gradient-to-b from-blue-300 to-blue-600 rounded-b-3xl overflow-hidden shadow-[inset_0_-10px_20px_rgba(0,0,0,0.4)] border-t-8 border-gray-500 flex flex-col justify-end">
      {/* 3D Water Flow Lines */}
      <div className="absolute inset-0 flex space-x-2 opacity-40 mix-blend-overlay overflow-hidden">
        <div className="w-2 h-[200%] bg-white animate-[slideDown_1s_linear_infinite]" />
        <div className="w-4 h-[200%] bg-white animate-[slideDown_1.5s_linear_infinite]" style={{ animationDelay: '0.2s' }} />
        <div className="w-1 h-[200%] bg-white animate-[slideDown_0.8s_linear_infinite]" style={{ animationDelay: '0.5s' }} />
        <div className="w-3 h-[200%] bg-white animate-[slideDown_1.2s_linear_infinite]" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-[200%] bg-white animate-[slideDown_0.9s_linear_infinite]" style={{ animationDelay: '0.7s' }} />
        <div className="w-4 h-[200%] bg-white animate-[slideDown_1.3s_linear_infinite]" style={{ animationDelay: '0.4s' }} />
      </div>
      {/* Foam at the bottom */}
      <div className="w-full h-12 bg-white/80 animate-bounce blur-md rounded-t-[50%]" />
      <div className="absolute bottom-0 w-full h-8 bg-white/90 animate-pulse blur-sm" />
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
         <div className="relative w-16 h-16 bg-blue-900/60 rounded-full border-4 border-blue-800/80 flex items-center justify-center shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
           {/* Dark Water / Cooldown indicator */}
           <div className="absolute inset-0 rounded-full bg-black/30 animate-pulse" />
           <span className="text-xl opacity-50 transform -rotate-45 -rotate-x-60">⏳</span>
         </div>
      ) : (
         <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Animated Ripples */}
            <div className="absolute w-24 h-24 border-2 border-cyan-300 rounded-full animate-ping opacity-60" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }} />
            <div className="absolute w-16 h-16 border-4 border-cyan-400 rounded-full animate-pulse opacity-80" style={{ transform: 'rotateX(60deg) rotateZ(45deg)', animationDuration: '2s' }} />
            
            {/* The Fish Spot Pool */}
            <div className="w-16 h-16 bg-cyan-400/50 rounded-full border-[3px] border-cyan-200 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.8),inset_0_0_10px_rgba(0,0,0,0.3)] z-10 overflow-hidden" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
              
              {/* Fish Shadow Swimming in Circle inside the pool */}
              <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '4s' }}>
                <div className="absolute top-2 left-2 w-4 h-2 bg-black/30 rounded-full blur-[1px]" />
              </div>
              
              {/* Rich Fish SVG jumping */}
              <div className="absolute text-2xl animate-bounce drop-shadow-[0_10px_5px_rgba(0,0,0,0.3)] transform -rotate-45 -rotate-x-60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-[-30deg]">
                  <path d="M11 4C11 4 19 6 21 11C23 16 20.5 19.5 20.5 19.5L16 16.5L18 22L13 20C13 20 8 18 5 13C2 8 4.5 4.5 4.5 4.5L9 7.5L7 2L11 4Z" fill="#00E5FF" stroke="#00838F" strokeWidth="1"/>
                  <circle cx="16" cy="9" r="1.5" fill="white" />
                  <circle cx="16.5" cy="9" r="0.5" fill="black" />
                </svg>
              </div>
            </div>

            {selectedLure && !isActive && (
              <div className="absolute -top-8 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-black px-3 py-1 rounded-full whitespace-nowrap shadow-lg animate-pulse pointer-events-none border border-white/50">
                PESCAR
              </div>
            )}
         </div>
      )}
    </div>
  );
};
