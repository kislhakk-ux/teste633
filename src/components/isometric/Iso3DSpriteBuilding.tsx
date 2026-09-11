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
      className={`relative ${!widthPx ? widthClass : ''} ${!heightPx ? heightClass : ''} flex items-end justify-center select-none pointer-events-none transition-transform duration-150`}
    >
      {/* Main Building 3D Model anchored directly on the terrain */}
      <div
        className={`relative z-10 w-full h-full flex items-end justify-center pb-0 pointer-events-none ${
          isWorking ? 'animate-machine-pulse' : ''
        }`}
      >
        {cutoutSrc ? (
          <img
            src={cutoutSrc}
            alt={alt}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full w-auto h-auto pointer-events-none transition-all duration-300"
            style={{
              filter: 'contrast(1.04) saturate(1.08)',
            }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full w-auto h-auto pointer-events-none mix-blend-multiply opacity-90"
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
