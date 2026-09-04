import React, { useState, useEffect } from 'react';
import { calculateIsoPlacement, TILE_WIDTH, TILE_HEIGHT } from '../../utils/isometricCoords';
import { FishingSpot } from '../../types/game';
import { HD_BUILDING_SPRITES } from '../../constants/buildingSprites';
import { getCutoutSprite } from '../../utils/spriteCutout';
import { sound } from '../../utils/sound';

// Base wrapper for isometric entities
const IsoEntityWrapper: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
  offsetY?: number;
  offsetX?: number;
  className?: string;
}> = ({ x, y, width, height, children, offsetY = 0, offsetX = 0, className = '' }) => {
  const anchor = { widthPx: width * TILE_WIDTH, heightPx: height * TILE_HEIGHT, anchorX: 0.5, anchorY: 0.5, shadow: { width: 0, height: 0, opacity: 0 } };
  const { left, top, zIndex } = calculateIsoPlacement(x, y, width, height, anchor);
  return (
    <div
      className={`absolute select-none ${className}`}
      style={{
        left: left + offsetX,
        top: top + offsetY,
        width: TILE_WIDTH * width,
        height: TILE_HEIGHT * height,
        zIndex,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
};

// 1. 3D FISHING CABIN (Cabana de Pesca com Álbum de Recordes)
export const IsoFishingHut: React.FC<{ x: number; y: number; onClick?: () => void }> = ({ x, y, onClick }) => {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCutoutSprite(HD_BUILDING_SPRITES.fishing_cabin).then((res) => {
      if (active) setCutoutSrc(res);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <IsoEntityWrapper x={x} y={y} width={2.5} height={2.5} offsetY={-90} className="pointer-events-auto cursor-pointer">
      <div
        className="relative group transition-transform duration-200 hover:scale-[1.03] active:scale-95 flex flex-col items-center justify-end"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        {/* Soft shadow on water / pier */}
        <div className="absolute -bottom-2 w-48 h-20 bg-[#001f3f]/50 rounded-[50%] blur-md pointer-events-none" />

        {/* 3D Sprite Cutout */}
        <img
          src={cutoutSrc || HD_BUILDING_SPRITES.fishing_cabin}
          alt="Cabana de Pesca"
          className="w-56 sm:w-64 h-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] pointer-events-none"
          style={{
            mixBlendMode: !cutoutSrc ? 'multiply' : 'normal',
          }}
        />

        {/* Animated Lantern Glow */}
        <div className="absolute bottom-28 right-16 w-8 h-8 rounded-full bg-amber-400/40 blur-sm animate-pulse pointer-events-none" />

        {/* Floating Interactive Badge: Fish Album / Collection Book */}
        <div className="absolute -top-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-black text-xs px-3 py-1.5 rounded-full border-2 border-white shadow-xl flex items-center gap-1.5 animate-bounce pointer-events-none drop-shadow-md">
          <span className="text-base">📖</span>
          <span>ÁLBUM DE PEIXES</span>
        </div>
      </div>
    </IsoEntityWrapper>
  );
};

// 2. 3D MOUNTAIN WATERFALL (Cachoeira das Montanhas com Espuma e Névoa)
export const IsoWaterfall: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);
  const [splashCount, setSplashCount] = useState(0);

  useEffect(() => {
    let active = true;
    getCutoutSprite(HD_BUILDING_SPRITES.fishing_waterfall).then((res) => {
      if (active) setCutoutSrc(res);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleWaterfallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playWaterSplash();
    setSplashCount((c) => c + 1);
  };

  return (
    <IsoEntityWrapper x={x} y={y} width={3} height={3} offsetY={-120} className="pointer-events-auto cursor-pointer">
      <div
        className="relative flex flex-col items-center justify-end select-none group"
        onClick={handleWaterfallClick}
        title="Toque na cachoeira para ouvir o som da água!"
      >
        {/* Waterfall 3D image */}
        <img
          src={cutoutSrc || HD_BUILDING_SPRITES.fishing_waterfall}
          alt="Cachoeira 3D"
          className="w-72 sm:w-80 h-auto object-contain filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)] pointer-events-none transition-transform duration-200 group-hover:scale-105"
          style={{
            mixBlendMode: !cutoutSrc ? 'multiply' : 'normal',
          }}
        />

        {/* Rushing Water White Streams Overlay */}
        <div className="absolute inset-x-8 bottom-12 top-10 pointer-events-none overflow-hidden opacity-30 mix-blend-overlay flex justify-center gap-3">
          <div className="w-2 h-full bg-gradient-to-b from-white via-cyan-200 to-white animate-pulse" style={{ animationDuration: '0.8s' }} />
          <div className="w-3 h-full bg-gradient-to-b from-white via-cyan-100 to-white animate-pulse" style={{ animationDuration: '1.2s' }} />
          <div className="w-2 h-full bg-gradient-to-b from-white via-cyan-200 to-white animate-pulse" style={{ animationDuration: '0.9s' }} />
        </div>

        {/* Churning Splash Pool & Mist at Base */}
        <div className="absolute -bottom-4 w-44 h-14 bg-white/75 rounded-full blur-md animate-pulse pointer-events-none" />
        <div className="absolute -bottom-2 w-36 h-10 bg-cyan-200/60 rounded-full blur-sm animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />

        {/* Interactive Splash Droplets on Click */}
        {splashCount > 0 && (
          <div key={splashCount} className="absolute bottom-6 flex gap-2 pointer-events-none animate-in zoom-in fade-in duration-300">
            <span className="text-xl animate-bounce">💦</span>
            <span className="text-2xl animate-ping">🫧</span>
            <span className="text-xl animate-bounce" style={{ animationDelay: '0.1s' }}>💦</span>
          </div>
        )}
      </div>
    </IsoEntityWrapper>
  );
};

// 3. 3D LURE MAKER WORKBENCH (Fabricador de Iscas)
export const IsoLureMaker: React.FC<{ x: number; y: number; onClick?: () => void }> = ({ x, y, onClick }) => {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCutoutSprite(HD_BUILDING_SPRITES.lure_maker).then((res) => {
      if (active) setCutoutSrc(res);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <IsoEntityWrapper x={x} y={y} width={1.8} height={1.8} offsetY={-40} className="pointer-events-auto cursor-pointer">
      <div
        className="relative group flex flex-col items-center justify-end transition-transform duration-200 hover:scale-105 active:scale-95"
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onClick?.();
        }}
      >
        {/* Pier platform base shadow */}
        <div className="absolute -bottom-1 w-32 h-14 bg-[#001f3f]/50 rounded-[50%] blur-sm pointer-events-none" />

        <img
          src={cutoutSrc || HD_BUILDING_SPRITES.lure_maker}
          alt="Fabricador de Iscas"
          className="w-40 sm:w-44 h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] pointer-events-none"
          style={{
            mixBlendMode: !cutoutSrc ? 'multiply' : 'normal',
          }}
        />

        {/* Floating Badge */}
        <div className="absolute -top-3 bg-amber-500 hover:bg-amber-400 text-white font-black text-[11px] px-2.5 py-1 rounded-full border-2 border-white shadow-lg flex items-center gap-1 animate-pulse pointer-events-none">
          <span>🎣</span>
          <span>ISCAS</span>
        </div>
      </div>
    </IsoEntityWrapper>
  );
};

// 4. 3D NET MAKER MACHINE (Fabricador de Redes)
export const IsoNetMaker: React.FC<{ x: number; y: number; onClick?: () => void }> = ({ x, y, onClick }) => {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCutoutSprite(HD_BUILDING_SPRITES.net_maker).then((res) => {
      if (active) setCutoutSrc(res);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <IsoEntityWrapper x={x} y={y} width={1.8} height={1.8} offsetY={-40} className="pointer-events-auto cursor-pointer">
      <div
        className="relative group flex flex-col items-center justify-end transition-transform duration-200 hover:scale-105 active:scale-95"
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onClick?.();
        }}
      >
        <div className="absolute -bottom-1 w-32 h-14 bg-[#001f3f]/50 rounded-[50%] blur-sm pointer-events-none" />

        <img
          src={cutoutSrc || HD_BUILDING_SPRITES.net_maker}
          alt="Fabricador de Redes"
          className="w-40 sm:w-44 h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] pointer-events-none"
          style={{
            mixBlendMode: !cutoutSrc ? 'multiply' : 'normal',
          }}
        />

        <div className="absolute -top-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] px-2.5 py-1 rounded-full border-2 border-white shadow-lg flex items-center gap-1 pointer-events-none">
          <span>🕸️</span>
          <span>REDES</span>
        </div>
      </div>
    </IsoEntityWrapper>
  );
};

// 5. 3D SWIMMING MALLARD DUCK (Pato Nadando com Ondulações)
export const IsoDuckTrap: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);
  const [quackCount, setQuackCount] = useState(0);

  useEffect(() => {
    let active = true;
    getCutoutSprite(HD_BUILDING_SPRITES.duck_swim).then((res) => {
      if (active) setCutoutSrc(res);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleDuckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playDuckQuack();
    sound.playWaterSplash();
    setQuackCount((c) => c + 1);
  };

  return (
    <IsoEntityWrapper x={x} y={y} width={1.4} height={1.4} offsetY={-10} className="pointer-events-auto cursor-pointer">
      <div
        className="relative group flex flex-col items-center justify-end select-none"
        onClick={handleDuckClick}
        title="Clique no pato para alimentá-lo!"
      >
        {/* Animated Water Wake Ripples behind duck */}
        <div className="absolute -bottom-2 w-28 h-10 border-2 border-cyan-200/60 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
        <div className="absolute -bottom-1 w-20 h-8 border border-white/70 rounded-full animate-pulse pointer-events-none" />

        {/* Duck Water Shadow */}
        <div className="absolute bottom-0 w-24 h-10 bg-[#001f3f]/55 rounded-full blur-xs pointer-events-none" />

        {/* 3D Duck Bobbing on Water */}
        <div className="animate-boat-bobbing transition-transform duration-200 group-hover:scale-110 active:scale-95">
          <img
            src={cutoutSrc || HD_BUILDING_SPRITES.duck_swim}
            alt="Pato Nadador 3D"
            className="w-28 sm:w-32 h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] pointer-events-none"
            style={{
              mixBlendMode: !cutoutSrc ? 'multiply' : 'normal',
            }}
          />
        </div>

        {/* Quack Bubble or Hearts when clicked */}
        {quackCount > 0 && (
          <div key={quackCount} className="absolute -top-8 bg-white/95 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-full border-2 border-emerald-500 shadow-xl animate-bounce pointer-events-none flex items-center gap-1">
            <span>Quack! 🌾</span>
          </div>
        )}
      </div>
    </IsoEntityWrapper>
  );
};

// 6. 3D LOBSTER TRAP CAGE (Armadilha de Lagostas com Bóia Flutuante)
export const IsoShrimpTrap: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);
  const [bubbleCount, setBubbleCount] = useState(0);

  useEffect(() => {
    let active = true;
    getCutoutSprite(HD_BUILDING_SPRITES.lobster_pot).then((res) => {
      if (active) setCutoutSrc(res);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleTrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playWaterSplash();
    setBubbleCount((c) => c + 1);
  };

  return (
    <IsoEntityWrapper x={x} y={y} width={1.4} height={1.4} offsetY={-10} className="pointer-events-auto cursor-pointer">
      <div
        className="relative group flex flex-col items-center justify-end select-none"
        onClick={handleTrapClick}
        title="Armadilha de Lagostas"
      >
        {/* Water ripples and bubbles */}
        <div className="absolute -bottom-1 w-24 h-10 border border-cyan-300/70 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1 w-20 h-8 bg-[#001f3f]/50 rounded-full blur-xs pointer-events-none" />

        {/* Floating Bobbing Trap */}
        <div className="animate-boat-bobbing transition-transform duration-200 group-hover:scale-110 active:scale-95">
          <img
            src={cutoutSrc || HD_BUILDING_SPRITES.lobster_pot}
            alt="Armadilha de Lagosta 3D"
            className="w-28 sm:w-32 h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] pointer-events-none"
            style={{
              mixBlendMode: !cutoutSrc ? 'multiply' : 'normal',
            }}
          />
        </div>

        {/* Bubbles pop on click */}
        {bubbleCount > 0 && (
          <div key={bubbleCount} className="absolute -top-6 flex gap-1 pointer-events-none animate-in fade-in zoom-in">
            <span className="text-xl animate-bounce">🦞</span>
            <span className="text-lg animate-ping">🫧</span>
          </div>
        )}
      </div>
    </IsoEntityWrapper>
  );
};

// 7. VIVID 3D FISHING SPOT (Ponto de Pesca com Peixes Saltando e Ondulações)
export const IsoFishSpot: React.FC<{
  x: number;
  y: number;
  spot: FishingSpot;
  selectedLure: string | null;
  isActive: boolean;
  onClick: () => void;
}> = ({ x, y, spot, selectedLure, isActive, onClick }) => {
  const isCooldown = spot.status === 'cooldown';
  const anchor = { widthPx: TILE_WIDTH * 1.5, heightPx: TILE_HEIGHT * 1.5, anchorX: 0.5, anchorY: 0.5, shadow: { width: 0, height: 0, opacity: 0 } };
  const { left, top, zIndex } = calculateIsoPlacement(x, y, 1.5, 1.5, anchor);

  return (
    <div
      className={`absolute flex items-center justify-center select-none ${
        !isCooldown ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-85'
      } transition-transform duration-200`}
      style={{
        left: left + (TILE_WIDTH * 1.5) / 2 - 60,
        top: top + (TILE_HEIGHT * 1.5) / 2 - 60,
        width: 120,
        height: 120,
        zIndex: zIndex + 2,
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {isCooldown ? (
        // Cooldown State: Peaceful resting water with hourglass
        <div className="relative w-24 h-16 flex items-center justify-center">
          <div
            className="w-24 h-14 bg-blue-950/70 rounded-[50%] border-2 border-blue-800/80 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center backdrop-blur-xs"
            style={{ transform: 'rotateX(55deg)' }}
          >
            <span className="text-2xl opacity-70 transform -rotate-x-55 animate-pulse">⏳</span>
          </div>
          <div className="absolute -bottom-2 bg-black/60 text-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
            Descansando
          </div>
        </div>
      ) : (
        // Active Vivid Fishing Spot
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Concentric Expanding Water Ripples */}
          <div
            className="absolute w-28 h-28 border-2 border-cyan-300 rounded-full animate-ping opacity-60 pointer-events-none"
            style={{ transform: 'rotateX(55deg)', animationDuration: '2.8s' }}
          />
          <div
            className="absolute w-20 h-20 border-[3px] border-cyan-400 rounded-full animate-pulse opacity-75 pointer-events-none"
            style={{ transform: 'rotateX(55deg)', animationDuration: '1.8s' }}
          />

          {/* Deep Turquoise Water Pool with Sun Caustics */}
          <div
            className="w-24 h-16 bg-gradient-to-br from-cyan-400/60 via-blue-600/70 to-blue-900/80 rounded-[50%] border-2 border-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.7),inset_0_2px_8px_rgba(255,255,255,0.4)] relative overflow-hidden flex items-center justify-center backdrop-blur-xs"
            style={{ transform: 'rotateX(55deg)' }}
          >
            {/* Darting Fish Shadows circling under the water */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3.5s' }}>
              <div className="absolute top-2 left-4 w-5 h-2 bg-blue-950/80 rounded-full blur-[1px] transform -rotate-12" />
              <div className="absolute bottom-2 right-4 w-4 h-1.5 bg-blue-950/70 rounded-full blur-[1px] transform rotate-45" />
            </div>

            {/* Sun Caustics Glint */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] animate-pulse" />
          </div>

          {/* Jumping 3D Fish leaping out of water with water splash */}
          <div className="absolute -top-4 pointer-events-none animate-bounce" style={{ animationDuration: '1.6s' }}>
            <div className="relative transform rotate-[-20deg] drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="spot-fish-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4DD0E1" />
                    <stop offset="40%" stopColor="#00BCD4" />
                    <stop offset="100%" stopColor="#006064" />
                  </linearGradient>
                  <linearGradient id="spot-belly-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9C4" />
                    <stop offset="100%" stopColor="#FFD54F" />
                  </linearGradient>
                </defs>
                {/* Tail Fin */}
                <path d="M 6 24 C 2 16 2 32 6 24 Z" fill="#26C6DA" stroke="#00838F" strokeWidth="1.5" />
                <path d="M 6 24 L 14 20 L 14 28 Z" fill="#00ACC1" />
                {/* Main Body */}
                <ellipse cx="26" cy="24" rx="14" ry="9" fill="url(#spot-fish-grad)" stroke="#00838F" strokeWidth="1.5" />
                {/* Golden Belly */}
                <path d="M 16 26 Q 26 33 36 26 Q 26 29 16 26 Z" fill="url(#spot-belly-grad)" />
                {/* Dorsal Fin */}
                <path d="M 22 15 Q 26 10 30 15 Z" fill="#80DEEA" stroke="#00838F" strokeWidth="1" />
                {/* Eye with glint */}
                <circle cx="34" cy="22" r="2.5" fill="#FFFFFF" />
                <circle cx="35" cy="22" r="1.2" fill="#000000" />
                <circle cx="35.5" cy="21.5" r="0.5" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* Water Splash Droplets around fish */}
          <div className="absolute -top-1 pointer-events-none flex gap-4 opacity-80">
            <span className="text-xs text-cyan-200 animate-ping">🫧</span>
            <span className="text-xs text-white animate-pulse">💧</span>
          </div>

          {/* Interactive Badge (PESCAR) */}
          <div
            className={`absolute -top-7 px-3 py-1 rounded-full font-black text-xs shadow-xl border-2 flex items-center gap-1 transition-all ${
              selectedLure
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-white scale-110 animate-bounce'
                : 'bg-amber-500 text-amber-950 border-amber-200'
            }`}
          >
            <span>{selectedLure ? '🎣' : '🐟'}</span>
            <span>{selectedLure ? 'PESCAR AQUI!' : 'PEIXES VIVOS'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
