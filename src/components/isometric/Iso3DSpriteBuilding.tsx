import React, { useState, useEffect } from 'react';
import { getCutoutSprite } from '../../utils/spriteCutout';
import { HD_BUILDING_SPRITES } from '../../constants/buildingSprites';

export type GroundBaseType = 'dirt' | 'cobblestone' | 'wood' | 'none';

interface Iso3DSpriteBuildingProps {
  src: string;
  alt: string;
  widthPx?: number;
  heightPx?: number;
  widthClass?: string;
  heightClass?: string;
  isWorking?: boolean;
  isSelected?: boolean;
  baseType?: GroundBaseType;
}

export const Iso3DSpriteBuilding: React.FC<Iso3DSpriteBuildingProps> = React.memo(({
  src,
  alt,
  widthPx,
  heightPx,
  widthClass = 'w-36 sm:w-44',
  heightClass = 'h-36 sm:h-44',
  isWorking,
  isSelected,
  baseType = 'dirt',
}) => {
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCutoutSprite(src).then((processed) => {
      if (isMounted) {
        setCutoutSrc(processed);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div
      style={
        widthPx && heightPx
          ? { width: `${widthPx}px`, height: `${heightPx}px` }
          : undefined
      }
      className={`relative ${!widthPx ? widthClass : ''} ${!heightPx ? heightClass : ''} flex items-center justify-center select-none pointer-events-none transition-transform duration-150`}
    >
      {/* 1. Authentic Dimetric 2:1 Isometric Foundation Curb */}
      {baseType !== 'none' && (
        <div className="absolute bottom-1 w-[90%] h-14 flex items-center justify-center pointer-events-auto cursor-pointer z-0">
          <svg
            viewBox="0 0 160 80"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="iso-stone-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={baseType === 'cobblestone' ? '#E0E0E0' : baseType === 'wood' ? '#D7CCC8' : '#D7CCC8'} />
                <stop offset="50%" stopColor={baseType === 'cobblestone' ? '#BDBDBD' : baseType === 'wood' ? '#BCAAA4' : '#BCAAA4'} />
                <stop offset="100%" stopColor={baseType === 'cobblestone' ? '#9E9E9E' : baseType === 'wood' ? '#8D6E63' : '#8D6E63'} />
              </linearGradient>
              <linearGradient id="iso-stone-side-l" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#757575" />
                <stop offset="100%" stopColor="#424242" />
              </linearGradient>
              <linearGradient id="iso-stone-side-r" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#616161" />
                <stop offset="100%" stopColor="#212121" />
              </linearGradient>
            </defs>

            {/* Platform Top Facet (2:1 Diamond) */}
            <polygon
              points="80,12 152,44 80,72 8,44"
              fill="url(#iso-stone-top)"
              stroke={baseType === 'wood' ? '#6D4C41' : '#616161'}
              strokeWidth="1.2"
              opacity="0.85"
            />
            {/* Front Left Bevel Rim */}
            <polygon
              points="8,44 80,72 80,77 8,49"
              fill="url(#iso-stone-side-l)"
              opacity="0.9"
            />
            {/* Front Right Bevel Rim */}
            <polygon
              points="80,72 152,44 152,49 80,77"
              fill="url(#iso-stone-side-r)"
              opacity="0.9"
            />

            {/* Cobblestone / Timber details on top */}
            {baseType === 'cobblestone' && (
              <>
                <ellipse cx="80" cy="42" rx="6" ry="3" fill="#EEEEEE" opacity="0.6" />
                <ellipse cx="60" cy="36" rx="5" ry="2.5" fill="#EEEEEE" opacity="0.5" />
                <ellipse cx="100" cy="36" rx="5" ry="2.5" fill="#EEEEEE" opacity="0.5" />
                <ellipse cx="80" cy="56" rx="6" ry="3" fill="#EEEEEE" opacity="0.5" />
                <ellipse cx="44" cy="46" rx="5" ry="2.5" fill="#EEEEEE" opacity="0.4" />
                <ellipse cx="116" cy="46" rx="5" ry="2.5" fill="#EEEEEE" opacity="0.4" />
              </>
            )}

            {baseType === 'wood' && (
              <>
                <line x1="44" y1="28" x2="116" y2="60" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
                <line x1="26" y1="36" x2="98" y2="68" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
                <line x1="62" y1="20" x2="134" y2="52" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
              </>
            )}

            {/* Perimeter Grass Tufts on Border */}
            <path d="M 12 43 Q 14 36 18 42 M 148 42 Q 146 35 142 41 M 80 73 Q 82 66 85 73" stroke="#8bc34a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* 2. Main Building 3D Model anchored firmly */}
      <div
        className={`relative z-10 w-full h-full flex items-center justify-center pb-2 pointer-events-none ${
          isWorking ? 'animate-machine-pulse' : ''
        }`}
      >
        {cutoutSrc ? (
          <img
            src={cutoutSrc}
            alt={alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain pointer-events-none transition-all duration-300 filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.32)]"
            style={{
              filter: 'contrast(1.04) saturate(1.08)',
            }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain pointer-events-none mix-blend-multiply opacity-90 pb-2"
          />
        )}

        {/* Hearth / Furnace warm ember glow when working */}
        {isWorking && (
          <div className="absolute bottom-6 w-20 h-10 bg-amber-500/35 rounded-full blur-md animate-hearth-glow pointer-events-none" />
        )}
      </div>

      {/* 3. Active Multi-Puff Chimney Smoke & Sparkles FX */}
      {isWorking && (
        <div className="absolute -top-5 right-7 flex flex-col items-center pointer-events-none z-20">
          <div className="relative w-8 h-8">
            {/* Animated rising cloud puffs */}
            <div className="absolute w-4 h-4 rounded-full bg-white/80 shadow-xs blur-[1px] animate-smoke-1 bottom-0 left-0" />
            <div className="absolute w-5 h-5 rounded-full bg-amber-50/85 shadow-xs blur-[1.2px] animate-smoke-2 bottom-1 left-2" />
            <span className="absolute -top-2 right-1 text-xs text-amber-300 font-black animate-ping">
              ✨
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
