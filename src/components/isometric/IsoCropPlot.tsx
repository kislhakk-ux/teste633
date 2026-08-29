import React from 'react';
import { ItemId } from '../../types/game';

interface IsoCropPlotProps {
  cropId?: ItemId;
  plantedAt?: number;
  growDuration?: number;
  currentTime: number;
  onHarvest?: () => void;
}

export const IsoCropPlot: React.FC<IsoCropPlotProps> = ({
  cropId,
  plantedAt,
  growDuration = 10,
  currentTime,
  onHarvest,
}) => {
  const isPlanted = !!cropId && !!plantedAt;
  const elapsed = isPlanted && plantedAt ? (currentTime - plantedAt) / 1000 : 0;
  const isReady = isPlanted && elapsed >= growDuration;
  const progress = isPlanted ? Math.min(1, elapsed / growDuration) : 0;

  // Growth Stage: 0 (Sprout/Baby), 1 (Growing Green), 2 (Mature/Ripe 3D)
  const stage = progress >= 1 ? 2 : progress >= 0.4 ? 1 : 0;

  return (
    <div className="relative w-32 h-24 flex items-center justify-center filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.3)]">
      <svg
        viewBox="0 0 140 100"
        className="w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          {/* Rich Dark Soil Bed 3D Gradients */}
          <linearGradient id="plot-soil-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#795548" />
            <stop offset="35%" stopColor="#5D4037" />
            <stop offset="75%" stopColor="#4E342E" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>

          <linearGradient id="plot-soil-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E342E" />
            <stop offset="100%" stopColor="#2D1B15" />
          </linearGradient>

          <linearGradient id="plot-soil-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3E2723" />
            <stop offset="100%" stopColor="#1E100B" />
          </linearGradient>

          {/* Golden Wheat Gradient */}
          <linearGradient id="crop-wheat-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="40%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>

          {/* Corn Gradient */}
          <linearGradient id="crop-corn-gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFEE58" />
            <stop offset="60%" stopColor="#FBC02D" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          {/* Carrot Gradient */}
          <linearGradient id="crop-carrot-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9800" />
            <stop offset="50%" stopColor="#FF6D00" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>

          {/* Pumpkin 3D Gradient */}
          <radialGradient id="crop-pumpkin-rad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFB74D" />
            <stop offset="50%" stopColor="#FF9800" />
            <stop offset="85%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#BF360C" />
          </radialGradient>

          {/* Sugarcane Stalk Gradient */}
          <linearGradient id="crop-sugarcane-stalk" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#AED581" />
            <stop offset="50%" stopColor="#7CB342" />
            <stop offset="100%" stopColor="#558B2F" />
          </linearGradient>

          {/* Ready Sparkle Glow */}
          <filter id="plot-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft Ambient Ground Shadow */}
        <ellipse cx="70" cy="62" rx="56" ry="22" fill="rgba(0,0,0,0.28)" />

        {/* 3D Elevated Earth Bed Side Walls */}
        <polygon points="70,68 14,38 14,48 70,78" fill="url(#plot-soil-left)" />
        <polygon points="70,68 126,38 126,48 70,78" fill="url(#plot-soil-right)" />

        {/* 3D Elevated Earth Bed Beveled Edge Highlight */}
        <polyline points="14,38 70,68 126,38" fill="none" stroke="#8D6E63" strokeWidth="1" opacity="0.6" />

        {/* Main Isometric Tilled Loam Diamond Surface */}
        <polygon
          points="70,8 126,38 70,68 14,38"
          fill="url(#plot-soil-top)"
          stroke="#2D1B15"
          strokeWidth="1.2"
        />

        {/* 3D Furrow Ridges (Volumetric plowed soil ripples) */}
        {/* Ridge 1 */}
        <path
          d="M 28 32 Q 50 43 70 54 Q 90 43 112 32"
          fill="none"
          stroke="#3E2723"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 28 30 Q 50 41 70 52 Q 90 41 112 30"
          fill="none"
          stroke="#8D6E63"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Ridge 2 */}
        <path
          d="M 38 24 Q 54 33 70 42 Q 86 33 102 24"
          fill="none"
          stroke="#3E2723"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 38 22 Q 54 31 70 40 Q 86 31 102 22"
          fill="none"
          stroke="#8D6E63"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Ridge 3 */}
        <path
          d="M 48 16 Q 60 22 70 28 Q 80 22 92 16"
          fill="none"
          stroke="#3E2723"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Fertile Soil Pebbles / Humus Texture */}
        <circle cx="34" cy="36" r="1.5" fill="#A1887F" opacity="0.7" />
        <circle cx="58" cy="48" r="1.2" fill="#8D6E63" opacity="0.6" />
        <circle cx="82" cy="46" r="1.8" fill="#3E2723" opacity="0.8" />
        <circle cx="106" cy="34" r="1.3" fill="#A1887F" opacity="0.7" />
        <circle cx="70" cy="18" r="1.4" fill="#8D6E63" opacity="0.6" />

        {/* Empty Soil Subtle 'Livre' Indicator if not planted */}
        {!isPlanted && (
          <g opacity="0.3">
            <ellipse cx="70" cy="38" rx="16" ry="8" fill="rgba(255,255,255,0.06)" />
          </g>
        )}

        {/* 3D Rendered Crop Plants */}
        {isPlanted && cropId && (
          <g className="transition-all duration-300">
            {render3DCropVegetation(cropId, stage, isReady)}
          </g>
        )}

        {/* Ready Golden Sparkles */}
        {isReady && (
          <g filter="url(#plot-glow)">
            {/* Sparkle 1 */}
            <path
              d="M 36 14 Q 36 20 40 20 Q 36 20 36 26 Q 36 20 32 20 Q 36 20 36 14"
              fill="#FFF59D"
              className="animate-ping"
            />
            {/* Sparkle 2 */}
            <path
              d="M 104 18 Q 104 24 108 24 Q 104 24 104 30 Q 104 24 100 24 Q 104 24 104 18"
              fill="#FFF59D"
              className="animate-pulse"
            />
            {/* Sparkle 3 Center */}
            <path
              d="M 70 8 Q 70 15 75 15 Q 70 15 70 22 Q 70 15 65 15 Q 70 15 70 8"
              fill="#FFFFFF"
              className="animate-bounce"
            />
          </g>
        )}
      </svg>

      {/* Action Overlay */}
      {isReady ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHarvest?.();
          }}
          className="absolute -top-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:brightness-110 text-amber-950 text-xs font-black px-3 py-1 rounded-full border-2 border-white shadow-[0_4px_12px_rgba(245,158,11,0.6)] flex items-center gap-1.5 animate-bounce z-20 active:scale-95 transition-transform"
          title="Colher Agora!"
        >
          <span className="text-sm">✂️</span>
          <span>Colher!</span>
        </button>
      ) : isPlanted ? (
        <div className="absolute -bottom-1 bg-black/75 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow-md z-10">
          ⏳ {Math.max(0, Math.ceil(growDuration - elapsed))}s
        </div>
      ) : null}
    </div>
  );
};

// 3D Volumetric Crop Growth Renderers (Hay Day Stylized)
function render3DCropVegetation(cropId: ItemId, stage: number, isReady: boolean) {
  // STAGE 0: Small 3D Green Sprouts with Morning Dew
  if (stage === 0) {
    return (
      <g>
        {[
          { x: 44, y: 28 },
          { x: 68, y: 20 },
          { x: 92, y: 28 },
          { x: 54, y: 44 },
          { x: 80, y: 46 },
          { x: 70, y: 34 },
        ].map((pt, idx) => (
          <g key={idx}>
            {/* Ambient Soil Shadow */}
            <ellipse cx={pt.x} cy={pt.y + 2} rx="6" ry="2.5" fill="rgba(0,0,0,0.3)" />
            {/* Sprout Stem */}
            <line x1={pt.x} y1={pt.y + 2} x2={pt.x} y2={pt.y - 6} stroke="#558B2F" strokeWidth="1.8" strokeLinecap="round" />
            {/* Left Leaf (3D curved) */}
            <path
              d={`M ${pt.x} ${pt.y - 4} Q ${pt.x - 6} ${pt.y - 12} ${pt.x - 9} ${pt.y - 8} Q ${pt.x - 4} ${pt.y - 4} ${pt.x} ${pt.y - 2}`}
              fill="#8BC34A"
              stroke="#33691E"
              strokeWidth="0.6"
            />
            {/* Right Leaf */}
            <path
              d={`M ${pt.x} ${pt.y - 4} Q ${pt.x + 6} ${pt.y - 12} ${pt.x + 9} ${pt.y - 8} Q ${pt.x + 4} ${pt.y - 4} ${pt.x} ${pt.y - 2}`}
              fill="#AED581"
              stroke="#33691E"
              strokeWidth="0.6"
            />
            {/* Center Bud */}
            <circle cx={pt.x} cy={pt.y - 6} r="1.5" fill="#C5E1A5" />
          </g>
        ))}
      </g>
    );
  }

  // STAGE 1: Medium Bushy Lush 3D Foliage
  if (stage === 1) {
    return (
      <g>
        {[
          { x: 42, y: 30, scale: 1 },
          { x: 68, y: 22, scale: 1.1 },
          { x: 94, y: 30, scale: 1 },
          { x: 52, y: 46, scale: 1.15 },
          { x: 82, y: 48, scale: 1.15 },
          { x: 70, y: 36, scale: 1.2 },
        ].map((pt, idx) => (
          <g key={idx}>
            {/* Ambient Shadow */}
            <ellipse cx={pt.x} cy={pt.y + 3} rx="9" ry="4" fill="rgba(0,0,0,0.35)" />
            {/* Main Central Stem */}
            <line x1={pt.x} y1={pt.y + 2} x2={pt.x} y2={pt.y - 14 * pt.scale} stroke="#33691E" strokeWidth="2.2" strokeLinecap="round" />
            {/* Lower Broad Leaves */}
            <path
              d={`M ${pt.x} ${pt.y - 4} Q ${pt.x - 10 * pt.scale} ${pt.y - 14} ${pt.x - 14 * pt.scale} ${pt.y - 8} Q ${pt.x - 6} ${pt.y} ${pt.x} ${pt.y + 1}`}
              fill="#689F38"
              stroke="#1B5E20"
              strokeWidth="0.7"
            />
            <path
              d={`M ${pt.x} ${pt.y - 4} Q ${pt.x + 10 * pt.scale} ${pt.y - 14} ${pt.x + 14 * pt.scale} ${pt.y - 8} Q ${pt.x + 6} ${pt.y} ${pt.x} ${pt.y + 1}`}
              fill="#7CB342"
              stroke="#1B5E20"
              strokeWidth="0.7"
            />
            {/* Upper Fresh Leaves */}
            <path
              d={`M ${pt.x} ${pt.y - 8} Q ${pt.x - 6 * pt.scale} ${pt.y - 20 * pt.scale} ${pt.x - 2} ${pt.y - 24 * pt.scale} Q ${pt.x + 2} ${pt.y - 16 * pt.scale} ${pt.x} ${pt.y - 8}`}
              fill="#9CCC65"
              stroke="#33691E"
              strokeWidth="0.7"
            />
            {/* Specular Highlight */}
            <path
              d={`M ${pt.x + 1} ${pt.y - 18 * pt.scale} Q ${pt.x + 3} ${pt.y - 12 * pt.scale} ${pt.x + 1} ${pt.y - 8}`}
              stroke="#DCEDC8"
              strokeWidth="0.8"
              fill="none"
            />
          </g>
        ))}
      </g>
    );
  }

  // STAGE 2: 3D Hay Day Mature/Ripe Crops
  switch (cropId) {
    case 'wheat':
      return (
        <g className={isReady ? 'animate-pulse' : ''}>
          {/* Multi-layered dense golden wheat field */}
          {[
            { x: 36, y: 30, h: 28, tilt: -10 },
            { x: 48, y: 22, h: 32, tilt: -5 },
            { x: 62, y: 18, h: 35, tilt: 2 },
            { x: 78, y: 20, h: 33, tilt: 6 },
            { x: 92, y: 26, h: 30, tilt: 10 },
            { x: 104, y: 32, h: 27, tilt: 12 },
            { x: 44, y: 44, h: 30, tilt: -8 },
            { x: 58, y: 40, h: 34, tilt: -2 },
            { x: 72, y: 36, h: 36, tilt: 3 },
            { x: 86, y: 42, h: 32, tilt: 8 },
            { x: 100, y: 48, h: 28, tilt: 12 },
            { x: 58, y: 54, h: 30, tilt: -4 },
            { x: 74, y: 52, h: 32, tilt: 4 },
          ].map((w, idx) => (
            <g key={idx} transform={`rotate(${w.tilt} ${w.x} ${w.y})`}>
              {/* Drop Shadow */}
              <ellipse cx={w.x} cy={w.y + 2} rx="4" ry="2" fill="rgba(0,0,0,0.3)" />

              {/* 3D Golden Wheat Stalk */}
              <line x1={w.x} y1={w.y} x2={w.x} y2={w.y - w.h} stroke="#FBC02D" strokeWidth="2.2" strokeLinecap="round" />

              {/* Golden Wheat Leaves */}
              <path
                d={`M ${w.x} ${w.y - 10} Q ${w.x - 7} ${w.y - 14} ${w.x - 9} ${w.y - 8}`}
                fill="none"
                stroke="#FBC02D"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* 3D Plump Wheat Grain Ear (Volumetric segmented grains) */}
              <ellipse cx={w.x} cy={w.y - w.h + 2} rx="4.5" ry="10" fill="url(#crop-wheat-gold)" stroke="#E65100" strokeWidth="0.8" />

              {/* Grain Texture Ribs */}
              <line x1={w.x - 3} y1={w.y - w.h + 2} x2={w.x + 3} y2={w.y - w.h + 4} stroke="#F57F17" strokeWidth="1" />
              <line x1={w.x - 3} y1={w.y - w.h - 2} x2={w.x + 3} y2={w.y - w.h} stroke="#F57F17" strokeWidth="1" />
              <line x1={w.x - 3} y1={w.y - w.h - 6} x2={w.x + 3} y2={w.y - w.h - 4} stroke="#F57F17" strokeWidth="1" />

              {/* Whisker Awns on Top */}
              <line x1={w.x - 2} y1={w.y - w.h - 6} x2={w.x - 6} y2={w.y - w.h - 14} stroke="#FFA000" strokeWidth="1" strokeLinecap="round" />
              <line x1={w.x} y1={w.y - w.h - 8} x2={w.x} y2={w.y - w.h - 16} stroke="#FFD54F" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={w.x + 2} y1={w.y - w.h - 6} x2={w.x + 6} y2={w.y - w.h - 14} stroke="#FFA000" strokeWidth="1" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );

    case 'corn':
      return (
        <g>
          {[
            { x: 44, y: 32, h: 44 },
            { x: 68, y: 22, h: 48 },
            { x: 94, y: 32, h: 45 },
            { x: 56, y: 50, h: 46 },
            { x: 84, y: 52, h: 46 },
          ].map((c, idx) => (
            <g key={idx}>
              {/* Ground Shadow */}
              <ellipse cx={c.x} cy={c.y + 3} rx="11" ry="5" fill="rgba(0,0,0,0.4)" />

              {/* Robust Tall Green Stalk */}
              <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - c.h} stroke="#33691E" strokeWidth="4" strokeLinecap="round" />
              <line x1={c.x - 0.8} y1={c.y} x2={c.x - 0.8} y2={c.y - c.h} stroke="#689F38" strokeWidth="1.5" />

              {/* Broad Tropical Corn Leaves */}
              <path
                d={`M ${c.x} ${c.y - 14} Q ${c.x - 18} ${c.y - 24} ${c.x - 22} ${c.y - 16}`}
                fill="none"
                stroke="#558B2F"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d={`M ${c.x} ${c.y - 20} Q ${c.x + 18} ${c.y - 30} ${c.x + 24} ${c.y - 22}`}
                fill="none"
                stroke="#689F38"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Left Ripe Golden Corn Cob */}
              <g transform={`rotate(-32 ${c.x - 6} ${c.y - 22})`}>
                <ellipse cx={c.x - 6} cy={c.y - 22} rx="5" ry="11" fill="url(#crop-corn-gold)" stroke="#E65100" strokeWidth="0.9" />
                {/* Corn Kernel Grid */}
                <line x1={c.x - 9} y1={c.y - 24} x2={c.x - 3} y2={c.y - 24} stroke="#F57F17" strokeWidth="0.8" />
                <line x1={c.x - 9} y1={c.y - 21} x2={c.x - 3} y2={c.y - 21} stroke="#F57F17" strokeWidth="0.8" />
                <line x1={c.x - 9} y1={c.y - 18} x2={c.x - 3} y2={c.y - 18} stroke="#F57F17" strokeWidth="0.8" />
                {/* Green Husk wrapping */}
                <path
                  d={`M ${c.x - 11} ${c.y - 15} Q ${c.x - 6} ${c.y - 26} ${c.x - 2} ${c.y - 14}`}
                  fill="#7CB342"
                  stroke="#33691E"
                  strokeWidth="0.8"
                />
              </g>

              {/* Right Ripe Corn Cob */}
              <g transform={`rotate(30 ${c.x + 6} ${c.y - 28})`}>
                <ellipse cx={c.x + 6} cy={c.y - 28} rx="5" ry="11" fill="url(#crop-corn-gold)" stroke="#E65100" strokeWidth="0.9" />
                <line x1={c.x + 3} y1={c.y - 30} x2={c.x + 9} y2={c.y - 30} stroke="#F57F17" strokeWidth="0.8" />
                <line x1={c.x + 3} y1={c.y - 27} x2={c.x + 9} y2={c.y - 27} stroke="#F57F17" strokeWidth="0.8" />
                {/* Green Husk */}
                <path
                  d={`M ${c.x + 1} ${c.y - 20} Q ${c.x + 6} ${c.y - 32} ${c.x + 11} ${c.y - 20}`}
                  fill="#8BC34A"
                  stroke="#33691E"
                  strokeWidth="0.8"
                />
              </g>

              {/* Silk Tassel Tuft on Stalk Top */}
              <path
                d={`M ${c.x - 4} ${c.y - c.h - 8} L ${c.x} ${c.y - c.h} L ${c.x + 4} ${c.y - c.h - 8}`}
                stroke="#FFF59D"
                strokeWidth="1.5"
                fill="none"
              />
            </g>
          ))}
        </g>
      );

    case 'carrot':
      return (
        <g>
          {[
            { x: 38, y: 30 },
            { x: 56, y: 22 },
            { x: 76, y: 24 },
            { x: 96, y: 32 },
            { x: 46, y: 44 },
            { x: 68, y: 46 },
            { x: 88, y: 48 },
            { x: 62, y: 34 },
          ].map((cr, idx) => (
            <g key={idx}>
              {/* Soil Disturbance Rim */}
              <ellipse cx={cr.x} cy={cr.y + 2} rx="8" ry="4" fill="#2D1B15" />

              {/* Big Plump Bright Orange Carrot Shoulders Popping Out */}
              <path
                d={`M ${cr.x - 6} ${cr.y + 1} Q ${cr.x} ${cr.y - 9} ${cr.x + 6} ${cr.y + 1} Z`}
                fill="url(#crop-carrot-orange)"
                stroke="#BF360C"
                strokeWidth="1"
              />

              {/* Carrot Shoulder Rings */}
              <path d={`M ${cr.x - 4} ${cr.y - 2} Q ${cr.x} ${cr.y - 4} ${cr.x + 4} ${cr.y - 2}`} stroke="#FFA726" strokeWidth="0.8" fill="none" />
              <path d={`M ${cr.x - 5} ${cr.y} Q ${cr.x} ${cr.y - 2} ${cr.x + 5} ${cr.y}`} stroke="#E65100" strokeWidth="0.8" fill="none" />

              {/* Feathery Lush 3D Fern Carrot Greens */}
              <line x1={cr.x} y1={cr.y - 5} x2={cr.x - 10} y2={cr.y - 22} stroke="#388E3C" strokeWidth="1.8" strokeLinecap="round" />
              <line x1={cr.x} y1={cr.y - 5} x2={cr.x} y2={cr.y - 26} stroke="#2E7D32" strokeWidth="2.2" strokeLinecap="round" />
              <line x1={cr.x} y1={cr.y - 5} x2={cr.x + 10} y2={cr.y - 22} stroke="#388E3C" strokeWidth="1.8" strokeLinecap="round" />

              {/* Feathery Leaf Tufts */}
              <circle cx={cr.x - 10} cy={cr.y - 22} r="2.5" fill="#81C784" />
              <circle cx={cr.x} cy={cr.y - 26} r="3" fill="#A5D6A7" />
              <circle cx={cr.x + 10} cy={cr.y - 22} r="2.5" fill="#81C784" />
            </g>
          ))}
        </g>
      );

    case 'sugarcane':
      return (
        <g>
          {[
            { x: 44, y: 32, h: 48 },
            { x: 64, y: 22, h: 52 },
            { x: 88, y: 28, h: 50 },
            { x: 56, y: 50, h: 48 },
            { x: 80, y: 52, h: 50 },
          ].map((sc, idx) => (
            <g key={idx}>
              {/* Ground Shadow */}
              <ellipse cx={sc.x} cy={sc.y + 2} rx="9" ry="4" fill="rgba(0,0,0,0.35)" />

              {/* Bamboo Segmented Thick Stalk */}
              <line x1={sc.x} y1={sc.y} x2={sc.x} y2={sc.y - sc.h} stroke="url(#crop-sugarcane-stalk)" strokeWidth="4.5" strokeLinecap="round" />

              {/* Ring Nodes */}
              <ellipse cx={sc.x} cy={sc.y - 12} rx="3" ry="1.2" fill="#558B2F" stroke="#33691E" strokeWidth="0.6" />
              <ellipse cx={sc.x} cy={sc.y - 24} rx="3" ry="1.2" fill="#558B2F" stroke="#33691E" strokeWidth="0.6" />
              <ellipse cx={sc.x} cy={sc.y - 36} rx="3" ry="1.2" fill="#558B2F" stroke="#33691E" strokeWidth="0.6" />

              {/* Long Elegant Arching Ribbon Cane Leaves */}
              <path
                d={`M ${sc.x} ${sc.y - sc.h} Q ${sc.x - 18} ${sc.y - sc.h - 12} ${sc.x - 26} ${sc.y - sc.h + 4}`}
                fill="none"
                stroke="#8BC34A"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d={`M ${sc.x} ${sc.y - sc.h} Q ${sc.x + 18} ${sc.y - sc.h - 12} ${sc.x + 26} ${sc.y - sc.h + 4}`}
                fill="none"
                stroke="#9CCC65"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d={`M ${sc.x} ${sc.y - sc.h + 8} Q ${sc.x + 14} ${sc.y - sc.h} ${sc.x + 20} ${sc.y - sc.h + 12}`}
                fill="none"
                stroke="#7CB342"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      );

    case 'pumpkin':
      return (
        <g>
          {/* Sprawling Thick Green Vines */}
          <path
            d="M 32 36 Q 54 20 76 34 Q 98 48 114 36"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 44 48 Q 66 58 88 44"
            fill="none"
            stroke="#388E3C"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Broad Vine Leaves */}
          <circle cx="34" cy="34" r="6" fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.8" />
          <circle cx="68" cy="26" r="7" fill="#66BB6A" stroke="#1B5E20" strokeWidth="0.8" />
          <circle cx="106" cy="38" r="6" fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.8" />
          <circle cx="58" cy="54" r="6" fill="#66BB6A" stroke="#1B5E20" strokeWidth="0.8" />

          {/* 3 Large Plump 3D Ribbed Pumpkins (Hay Day Stylized) */}
          {[
            { x: 46, y: 34, r: 12 },
            { x: 74, y: 26, r: 15 },
            { x: 92, y: 44, r: 13 },
          ].map((p, idx) => (
            <g key={idx}>
              {/* Pumpkin Ground Shadow */}
              <ellipse cx={p.x} cy={p.y + p.r * 0.7} rx={p.r * 1.1} ry={p.r * 0.4} fill="rgba(0,0,0,0.4)" />

              {/* Main 3D Spherical Pumpkin Body with Radial Lighting */}
              <ellipse cx={p.x} cy={p.y} rx={p.r} ry={p.r * 0.85} fill="url(#crop-pumpkin-rad)" stroke="#BF360C" strokeWidth="1.2" />

              {/* Characteristic Vertical Rib Sections */}
              <ellipse cx={p.x} cy={p.y} rx={p.r * 0.65} ry={p.r * 0.85} fill="none" stroke="#E65100" strokeWidth="1" opacity="0.75" />
              <ellipse cx={p.x} cy={p.y} rx={p.r * 0.3} ry={p.r * 0.85} fill="none" stroke="#FFA726" strokeWidth="0.8" opacity="0.8" />

              {/* Glossy Specular Sun Reflection */}
              <ellipse cx={p.x - p.r * 0.3} cy={p.y - p.r * 0.35} rx={p.r * 0.25} ry={p.r * 0.15} fill="#FFF9C4" opacity="0.65" />

              {/* Curly Green Wooden Stem */}
              <path
                d={`M ${p.x} ${p.y - p.r * 0.8} Q ${p.x + 3} ${p.y - p.r * 0.8 - 6} ${p.x + 6} ${p.y - p.r * 0.8 - 4}`}
                fill="none"
                stroke="#33691E"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      );

    default:
      // Generic Lush 3D Crop
      return (
        <g>
          {[
            { x: 44, y: 30 },
            { x: 68, y: 22 },
            { x: 92, y: 30 },
            { x: 56, y: 48 },
            { x: 80, y: 50 },
          ].map((pt, i) => (
            <g key={i}>
              <ellipse cx={pt.x} cy={pt.y + 2} rx="8" ry="4" fill="rgba(0,0,0,0.3)" />
              <circle cx={pt.x} cy={pt.y - 12} r="9" fill="#4CAF50" stroke="#1B5E20" strokeWidth="1.2" />
              <circle cx={pt.x - 3} cy={pt.y - 15} r="3" fill="#A5D6A7" opacity="0.7" />
            </g>
          ))}
        </g>
      );
  }
}
