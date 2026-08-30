import React from 'react';
import { ItemId } from '../../types/game';

interface IsoCropPlotProps {
  cropId?: ItemId;
  plantedAt?: number;
  growDuration?: number;
  currentTime: number;
  onHarvest?: () => void;
}

// Unique ID suffix per instance so SVG defs don't collide when many plots render
let _plotIdCounter = 0;

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

  // Stable unique ID per component instance (not per render)
  const uid = React.useRef(`cp${++_plotIdCounter}`).current;

  return (
    /*
     * Container: NO drop-shadow filter — that was creating the "dark square" borders.
     * Size matches the anchor registry: 128 × 96 px.
     */
    <div className="relative w-32 h-24 flex items-center justify-center">
      <svg
        viewBox="0 0 128 96"
        className="w-full h-full overflow-visible pointer-events-none"
        style={{ display: 'block' }}
      >
        <defs>
          {/* ── TOP FACE: sun-lit tilled loam ── */}
          {/* Warm golden-ochre at the lit peak → rich earthy mid-tone → deep shadow at bottom */}
          <linearGradient id={`${uid}-top`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#D4A96A" />   {/* sun-lit sandy crest */}
            <stop offset="28%"  stopColor="#C0924E" />   {/* warm loam */}
            <stop offset="58%"  stopColor="#A87840" />   {/* mid tilled earth */}
            <stop offset="100%" stopColor="#8A6030" />   {/* deep furrow shadow */}
          </linearGradient>

          {/* ── LEFT SIDE WALL ── */}
          <linearGradient id={`${uid}-left`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#8A6030" />
            <stop offset="100%" stopColor="#6B4820" />
          </linearGradient>

          {/* ── RIGHT SIDE WALL ── */}
          <linearGradient id={`${uid}-right`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#7A5228" />
            <stop offset="100%" stopColor="#523018" />
          </linearGradient>

          {/* ── FURROW SHADOW: dark channel of a plowed row ── */}
          <linearGradient id={`${uid}-fd`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7A5030" stopOpacity="0.85" />
            <stop offset="50%"  stopColor="#654025" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#7A5030" stopOpacity="0.85" />
          </linearGradient>

          {/* ── FURROW HIGHLIGHT: lit crest of plowed ridge ── */}
          <linearGradient id={`${uid}-fl`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#E0BA78" stopOpacity="0.50" />
            <stop offset="50%"  stopColor="#F0CC88" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#E0BA78" stopOpacity="0.50" />
          </linearGradient>

          {/* ── MOISTURE PATCH: subtle central darker zone ── */}
          <radialGradient id={`${uid}-moist`} cx="50%" cy="55%" r="50%">
            <stop offset="0%"   stopColor="#7A5028" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7A5028" stopOpacity="0" />
          </radialGradient>

          {/* ── READY GOLDEN SHIMMER ── */}
          <radialGradient id={`${uid}-shine`} cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#FFE082" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#FFE082" stopOpacity="0" />
          </radialGradient>

          {/* ── INNER EDGE VIGNETTE (replaces drop-shadow) ── */}
          {/*  A subtle dark inset at the diamond edge makes plots readable */}
          {/*  without creating harsh external borders between adjacent tiles */}
          <linearGradient id={`${uid}-vign`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#52300A" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#52300A" stopOpacity="0.08" />
          </linearGradient>

          {/* ── SPARKLE GLOW FILTER ── */}
          <filter id={`${uid}-glow`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* ── CROP GRADIENTS ── */}
          <linearGradient id={`${uid}-wheat`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFF176" />
            <stop offset="40%"  stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>
          <linearGradient id={`${uid}-corn`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#FFEE58" />
            <stop offset="60%"  stopColor="#FBC02D" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>
          <linearGradient id={`${uid}-carrot`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FF9800" />
            <stop offset="50%"  stopColor="#FF6D00" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>
          <radialGradient id={`${uid}-pumpkin`} cx="40%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#FFB74D" />
            <stop offset="50%"  stopColor="#FF9800" />
            <stop offset="85%"  stopColor="#E65100" />
            <stop offset="100%" stopColor="#BF360C" />
          </radialGradient>
          <linearGradient id={`${uid}-cane`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#AED581" />
            <stop offset="50%"  stopColor="#7CB342" />
            <stop offset="100%" stopColor="#558B2F" />
          </linearGradient>
        </defs>

        {/* ─────────────────────────────────────────────────
            ISOMETRIC TILE: viewBox 128×96, 2:1 diamond
            Diamond vertices (matches 84×42 grid tile):
              Top    (64,  4)
              Right  (126, 37)
              Bottom (64, 70)
              Left   (2,  37)
            Side walls drop 8px.
        ───────────────────────────────────────────────── */}

        {/* ── SIDE WALLS (raised bed look) ── */}
        {/* Left wall */}
        <polygon
          points="2,37 64,70 64,78 2,45"
          fill={`url(#${uid}-left)`}
        />
        {/* Right wall */}
        <polygon
          points="64,70 126,37 126,45 64,78"
          fill={`url(#${uid}-right)`}
        />

        {/* ── TOP DIAMOND FACE ── */}
        <polygon
          points="64,4 126,37 64,70 2,37"
          fill={`url(#${uid}-top)`}
          /* Thin warm-brown stroke — NOT black.
             Opacity 0.45 keeps adjacent plots visually connected. */
          stroke="#9A7040"
          strokeWidth="0.9"
          strokeOpacity="0.45"
        />

        {/* ── INNER EDGE VIGNETTE (reads edge without external dark border) ── */}
        <polygon
          points="64,4 126,37 64,70 2,37"
          fill="none"
          stroke={`url(#${uid}-vign)`}
          strokeWidth="5"
          strokeOpacity="1"
        />

        {/* ── MOISTURE / HUMUS CENTRE PATCH ── */}
        <ellipse cx="64" cy="42" rx="30" ry="16" fill={`url(#${uid}-moist)`} />

        {/* ══════════════════════════════════════
            PLOWED FURROW ROWS  (3 rows)
            Each: shadow channel + lit ridge crest
            Rows go front→back in isometric space.
        ══════════════════════════════════════ */}

        {/* Furrow 1 – front */}
        <path d="M 16 30 Q 40 44 64 56 Q 88 44 112 30"
          fill="none" stroke={`url(#${uid}-fd)`}
          strokeWidth="3.2" strokeLinecap="round" opacity="0.80" />
        <path d="M 16 28 Q 40 42 64 54 Q 88 42 112 28"
          fill="none" stroke={`url(#${uid}-fl)`}
          strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />

        {/* Furrow 2 – mid */}
        <path d="M 30 20 Q 50 33 64 42 Q 78 33 98 20"
          fill="none" stroke={`url(#${uid}-fd)`}
          strokeWidth="2.8" strokeLinecap="round" opacity="0.72" />
        <path d="M 30 18 Q 50 31 64 40 Q 78 31 98 18"
          fill="none" stroke={`url(#${uid}-fl)`}
          strokeWidth="1.0" strokeLinecap="round" opacity="0.58" />

        {/* Furrow 3 – back */}
        <path d="M 44 12 Q 56 19 64 26 Q 72 19 84 12"
          fill="none" stroke={`url(#${uid}-fd)`}
          strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
        <path d="M 44 10 Q 56 17 64 24 Q 72 17 84 10"
          fill="none" stroke={`url(#${uid}-fl)`}
          strokeWidth="0.8" strokeLinecap="round" opacity="0.52" />

        {/* ── NATURAL SOIL TEXTURE: pebbles & humus flecks ── */}
        <circle cx="22"  cy="35" r="1.6" fill="#CC9A5C" opacity="0.55" />
        <circle cx="48"  cy="51" r="1.2" fill="#B88A48" opacity="0.50" />
        <circle cx="80"  cy="49" r="1.5" fill="#7A5030" opacity="0.45" />
        <circle cx="104" cy="33" r="1.3" fill="#CC9A5C" opacity="0.50" />
        <circle cx="64"  cy="15" r="1.2" fill="#B88A48" opacity="0.45" />
        <circle cx="38"  cy="24" r="1.0" fill="#DBA870" opacity="0.40" />
        <circle cx="90"  cy="22" r="1.1" fill="#CC9A5C" opacity="0.38" />
        <circle cx="64"  cy="56" r="1.4" fill="#8C6040" opacity="0.42" />

        {/* Earth micro-clods */}
        <ellipse cx="34"  cy="28" rx="2.5" ry="1.1" fill="#A07840" opacity="0.28" />
        <ellipse cx="94"  cy="28" rx="2.0" ry="1.0" fill="#A07840" opacity="0.26" />
        <ellipse cx="56"  cy="18" rx="1.8" ry="0.9" fill="#B88A48" opacity="0.26" />

        {/* ── READY-TO-HARVEST SHIMMER ── */}
        {isReady && (
          <polygon
            points="64,4 126,37 64,70 2,37"
            fill={`url(#${uid}-shine)`}
          />
        )}

        {/* ── EMPTY PLOT SOFT AVAILABLE INDICATOR ── */}
        {!isPlanted && (
          <ellipse cx="64" cy="38" rx="16" ry="9"
            fill="rgba(255,248,210,0.30)" />
        )}

        {/* ── 3D CROP PLANTS ── */}
        {isPlanted && cropId && (
          <g className="transition-all duration-300">
            {render3DCropVegetation(cropId, stage, isReady, uid)}
          </g>
        )}

        {/* ── HARVEST-READY SPARKLES ── */}
        {isReady && (
          <g filter={`url(#${uid}-glow)`}>
            <path
              d="M 28 12 Q 28 18 32 18 Q 28 18 28 24 Q 28 18 24 18 Q 28 18 28 12"
              fill="#FFF59D" className="animate-ping"
            />
            <path
              d="M 100 16 Q 100 22 104 22 Q 100 22 100 28 Q 100 22 96 22 Q 100 22 100 16"
              fill="#FFF59D" className="animate-pulse"
            />
            <path
              d="M 64 4 Q 64 11 68 11 Q 64 11 64 18 Q 64 11 60 11 Q 64 11 64 4"
              fill="#FFFFFF" className="animate-bounce"
            />
          </g>
        )}
      </svg>

    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
//  3D Volumetric Crop Renderers  (coordinates adapted to new 128×96
//  viewBox — centre X=64, soil face spans ~y4→y70)
// ─────────────────────────────────────────────────────────────────
function render3DCropVegetation(
  cropId: ItemId,
  stage: number,
  isReady: boolean,
  uid: string
) {
  // ── STAGE 0: Tiny 3-D sprouts with morning dew ──
  if (stage === 0) {
    const sprouts = [
      { x: 40, y: 28 }, { x: 64, y: 20 }, { x: 88, y: 28 },
      { x: 50, y: 44 }, { x: 76, y: 46 }, { x: 64, y: 36 },
    ];
    return (
      <g>
        {sprouts.map((pt, idx) => (
          <g key={idx}>
            <ellipse cx={pt.x} cy={pt.y + 2} rx="5" ry="2" fill="rgba(0,0,0,0.25)" />
            <line x1={pt.x} y1={pt.y + 2} x2={pt.x} y2={pt.y - 6}
              stroke="#558B2F" strokeWidth="1.8" strokeLinecap="round" />
            <path
              d={`M ${pt.x} ${pt.y - 4} Q ${pt.x-6} ${pt.y-12} ${pt.x-9} ${pt.y-8} Q ${pt.x-4} ${pt.y-4} ${pt.x} ${pt.y-2}`}
              fill="#8BC34A" stroke="#33691E" strokeWidth="0.6" />
            <path
              d={`M ${pt.x} ${pt.y - 4} Q ${pt.x+6} ${pt.y-12} ${pt.x+9} ${pt.y-8} Q ${pt.x+4} ${pt.y-4} ${pt.x} ${pt.y-2}`}
              fill="#AED581" stroke="#33691E" strokeWidth="0.6" />
            <circle cx={pt.x} cy={pt.y - 6} r="1.4" fill="#C5E1A5" />
          </g>
        ))}
      </g>
    );
  }

  // ── STAGE 1: Medium bushy 3-D foliage ──
  if (stage === 1) {
    const bushes = [
      { x: 38, y: 30, s: 1.0 }, { x: 64, y: 22, s: 1.1 }, { x: 90, y: 30, s: 1.0 },
      { x: 48, y: 46, s: 1.15 }, { x: 78, y: 48, s: 1.15 }, { x: 64, y: 36, s: 1.2 },
    ];
    return (
      <g>
        {bushes.map((pt, idx) => (
          <g key={idx}>
            <ellipse cx={pt.x} cy={pt.y + 3} rx="8" ry="3.5" fill="rgba(0,0,0,0.30)" />
            <line x1={pt.x} y1={pt.y + 2} x2={pt.x} y2={pt.y - 14 * pt.s}
              stroke="#33691E" strokeWidth="2.0" strokeLinecap="round" />
            <path
              d={`M ${pt.x} ${pt.y-4} Q ${pt.x-10*pt.s} ${pt.y-14} ${pt.x-13*pt.s} ${pt.y-8} Q ${pt.x-6} ${pt.y} ${pt.x} ${pt.y+1}`}
              fill="#689F38" stroke="#1B5E20" strokeWidth="0.7" />
            <path
              d={`M ${pt.x} ${pt.y-4} Q ${pt.x+10*pt.s} ${pt.y-14} ${pt.x+13*pt.s} ${pt.y-8} Q ${pt.x+6} ${pt.y} ${pt.x} ${pt.y+1}`}
              fill="#7CB342" stroke="#1B5E20" strokeWidth="0.7" />
            <path
              d={`M ${pt.x} ${pt.y-8} Q ${pt.x-6*pt.s} ${pt.y-20*pt.s} ${pt.x-2} ${pt.y-23*pt.s} Q ${pt.x+2} ${pt.y-15*pt.s} ${pt.x} ${pt.y-8}`}
              fill="#9CCC65" stroke="#33691E" strokeWidth="0.7" />
            <path
              d={`M ${pt.x+1} ${pt.y-17*pt.s} Q ${pt.x+3} ${pt.y-11*pt.s} ${pt.x+1} ${pt.y-8}`}
              stroke="#DCEDC8" strokeWidth="0.8" fill="none" />
          </g>
        ))}
      </g>
    );
  }

  // ── STAGE 2: Mature / Ripe crops ──
  switch (cropId) {

    case 'wheat':
      return (
        <g className={isReady ? 'animate-pulse' : ''}>
          {[
            { x: 30, y: 30, h: 26, t: -10 }, { x: 44, y: 22, h: 30, t: -5 },
            { x: 58, y: 18, h: 33, t:  2  }, { x: 74, y: 20, h: 31, t:  6 },
            { x: 88, y: 26, h: 28, t: 10  }, { x: 100,y: 32, h: 25, t: 12 },
            { x: 40, y: 44, h: 28, t: -8  }, { x: 54, y: 40, h: 32, t: -2 },
            { x: 68, y: 36, h: 34, t:  3  }, { x: 82, y: 42, h: 30, t:  8 },
            { x: 96, y: 48, h: 26, t: 12  }, { x: 54, y: 54, h: 28, t: -4 },
            { x: 72, y: 52, h: 30, t:  4  },
          ].map((w, idx) => (
            <g key={idx} transform={`rotate(${w.t} ${w.x} ${w.y})`}>
              <ellipse cx={w.x} cy={w.y + 2} rx="3.5" ry="1.6" fill="rgba(0,0,0,0.28)" />
              <line x1={w.x} y1={w.y} x2={w.x} y2={w.y - w.h}
                stroke="#FBC02D" strokeWidth="2.0" strokeLinecap="round" />
              <path
                d={`M ${w.x} ${w.y-10} Q ${w.x-6} ${w.y-14} ${w.x-8} ${w.y-8}`}
                fill="none" stroke="#FBC02D" strokeWidth="1.4" strokeLinecap="round" />
              <ellipse cx={w.x} cy={w.y - w.h + 2} rx="4" ry="9"
                fill={`url(#${uid}-wheat)`} stroke="#E65100" strokeWidth="0.8" />
              <line x1={w.x-3} y1={w.y-w.h+2}  x2={w.x+3} y2={w.y-w.h+4}  stroke="#F57F17" strokeWidth="0.9" />
              <line x1={w.x-3} y1={w.y-w.h-2}  x2={w.x+3} y2={w.y-w.h}    stroke="#F57F17" strokeWidth="0.9" />
              <line x1={w.x-3} y1={w.y-w.h-6}  x2={w.x+3} y2={w.y-w.h-4}  stroke="#F57F17" strokeWidth="0.9" />
              <line x1={w.x-2} y1={w.y-w.h-6}  x2={w.x-6} y2={w.y-w.h-13} stroke="#FFA000" strokeWidth="1.0" strokeLinecap="round" />
              <line x1={w.x}   y1={w.y-w.h-8}  x2={w.x}   y2={w.y-w.h-15} stroke="#FFD54F" strokeWidth="1.1" strokeLinecap="round" />
              <line x1={w.x+2} y1={w.y-w.h-6}  x2={w.x+6} y2={w.y-w.h-13} stroke="#FFA000" strokeWidth="1.0" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );

    case 'corn':
      return (
        <g>
          {[
            { x: 40, y: 32, h: 42 }, { x: 64, y: 22, h: 46 },
            { x: 90, y: 32, h: 43 }, { x: 52, y: 50, h: 44 }, { x: 80, y: 52, h: 44 },
          ].map((c, idx) => (
            <g key={idx}>
              <ellipse cx={c.x} cy={c.y + 3} rx="10" ry="4.5" fill="rgba(0,0,0,0.38)" />
              <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - c.h}
                stroke="#33691E" strokeWidth="3.8" strokeLinecap="round" />
              <line x1={c.x-0.8} y1={c.y} x2={c.x-0.8} y2={c.y - c.h}
                stroke="#689F38" strokeWidth="1.4" />
              <path d={`M ${c.x} ${c.y-14} Q ${c.x-17} ${c.y-24} ${c.x-21} ${c.y-16}`}
                fill="none" stroke="#558B2F" strokeWidth="2.8" strokeLinecap="round" />
              <path d={`M ${c.x} ${c.y-20} Q ${c.x+17} ${c.y-30} ${c.x+23} ${c.y-22}`}
                fill="none" stroke="#689F38" strokeWidth="2.8" strokeLinecap="round" />
              <g transform={`rotate(-32 ${c.x-6} ${c.y-22})`}>
                <ellipse cx={c.x-6} cy={c.y-22} rx="4.5" ry="10"
                  fill={`url(#${uid}-corn)`} stroke="#E65100" strokeWidth="0.9" />
                <line x1={c.x-9} y1={c.y-24} x2={c.x-3} y2={c.y-24} stroke="#F57F17" strokeWidth="0.8" />
                <line x1={c.x-9} y1={c.y-21} x2={c.x-3} y2={c.y-21} stroke="#F57F17" strokeWidth="0.8" />
                <line x1={c.x-9} y1={c.y-18} x2={c.x-3} y2={c.y-18} stroke="#F57F17" strokeWidth="0.8" />
                <path d={`M ${c.x-11} ${c.y-15} Q ${c.x-6} ${c.y-26} ${c.x-2} ${c.y-14}`}
                  fill="#7CB342" stroke="#33691E" strokeWidth="0.8" />
              </g>
              <g transform={`rotate(30 ${c.x+6} ${c.y-28})`}>
                <ellipse cx={c.x+6} cy={c.y-28} rx="4.5" ry="10"
                  fill={`url(#${uid}-corn)`} stroke="#E65100" strokeWidth="0.9" />
                <line x1={c.x+3} y1={c.y-30} x2={c.x+9} y2={c.y-30} stroke="#F57F17" strokeWidth="0.8" />
                <line x1={c.x+3} y1={c.y-27} x2={c.x+9} y2={c.y-27} stroke="#F57F17" strokeWidth="0.8" />
                <path d={`M ${c.x+1} ${c.y-20} Q ${c.x+6} ${c.y-32} ${c.x+11} ${c.y-20}`}
                  fill="#8BC34A" stroke="#33691E" strokeWidth="0.8" />
              </g>
              <path d={`M ${c.x-4} ${c.y-c.h-7} L ${c.x} ${c.y-c.h} L ${c.x+4} ${c.y-c.h-7}`}
                stroke="#FFF59D" strokeWidth="1.4" fill="none" />
            </g>
          ))}
        </g>
      );

    case 'carrot':
      return (
        <g>
          {[
            { x: 34, y: 30 }, { x: 52, y: 22 }, { x: 72, y: 24 }, { x: 92, y: 32 },
            { x: 42, y: 44 }, { x: 64, y: 46 }, { x: 84, y: 48 }, { x: 58, y: 34 },
          ].map((cr, idx) => (
            <g key={idx}>
              <ellipse cx={cr.x} cy={cr.y + 2} rx="7" ry="3.5" fill="#7A5030" />
              <path
                d={`M ${cr.x-6} ${cr.y+1} Q ${cr.x} ${cr.y-9} ${cr.x+6} ${cr.y+1} Z`}
                fill={`url(#${uid}-carrot)`} stroke="#BF360C" strokeWidth="1.0" />
              <path d={`M ${cr.x-4} ${cr.y-2} Q ${cr.x} ${cr.y-4} ${cr.x+4} ${cr.y-2}`}
                stroke="#FFA726" strokeWidth="0.8" fill="none" />
              <path d={`M ${cr.x-5} ${cr.y} Q ${cr.x} ${cr.y-2} ${cr.x+5} ${cr.y}`}
                stroke="#E65100" strokeWidth="0.8" fill="none" />
              <line x1={cr.x} y1={cr.y-5} x2={cr.x-9} y2={cr.y-21}
                stroke="#388E3C" strokeWidth="1.7" strokeLinecap="round" />
              <line x1={cr.x} y1={cr.y-5} x2={cr.x} y2={cr.y-25}
                stroke="#2E7D32" strokeWidth="2.0" strokeLinecap="round" />
              <line x1={cr.x} y1={cr.y-5} x2={cr.x+9} y2={cr.y-21}
                stroke="#388E3C" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx={cr.x-9} cy={cr.y-21} r="2.4" fill="#81C784" />
              <circle cx={cr.x}   cy={cr.y-25} r="2.8" fill="#A5D6A7" />
              <circle cx={cr.x+9} cy={cr.y-21} r="2.4" fill="#81C784" />
            </g>
          ))}
        </g>
      );

    case 'sugarcane':
      return (
        <g>
          {[
            { x: 40, y: 32, h: 46 }, { x: 60, y: 22, h: 50 },
            { x: 84, y: 28, h: 48 }, { x: 52, y: 50, h: 46 }, { x: 76, y: 52, h: 48 },
          ].map((sc, idx) => (
            <g key={idx}>
              <ellipse cx={sc.x} cy={sc.y + 2} rx="8" ry="3.5" fill="rgba(0,0,0,0.30)" />
              <line x1={sc.x} y1={sc.y} x2={sc.x} y2={sc.y - sc.h}
                stroke={`url(#${uid}-cane)`} strokeWidth="4.2" strokeLinecap="round" />
              <ellipse cx={sc.x} cy={sc.y-12} rx="2.8" ry="1.1" fill="#558B2F" stroke="#33691E" strokeWidth="0.6" />
              <ellipse cx={sc.x} cy={sc.y-24} rx="2.8" ry="1.1" fill="#558B2F" stroke="#33691E" strokeWidth="0.6" />
              <ellipse cx={sc.x} cy={sc.y-36} rx="2.8" ry="1.1" fill="#558B2F" stroke="#33691E" strokeWidth="0.6" />
              <path d={`M ${sc.x} ${sc.y-sc.h} Q ${sc.x-17} ${sc.y-sc.h-11} ${sc.x-25} ${sc.y-sc.h+4}`}
                fill="none" stroke="#8BC34A" strokeWidth="2.6" strokeLinecap="round" />
              <path d={`M ${sc.x} ${sc.y-sc.h} Q ${sc.x+17} ${sc.y-sc.h-11} ${sc.x+25} ${sc.y-sc.h+4}`}
                fill="none" stroke="#9CCC65" strokeWidth="2.6" strokeLinecap="round" />
              <path d={`M ${sc.x} ${sc.y-sc.h+8} Q ${sc.x+13} ${sc.y-sc.h} ${sc.x+19} ${sc.y-sc.h+12}`}
                fill="none" stroke="#7CB342" strokeWidth="1.9" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );

    case 'pumpkin':
      return (
        <g>
          <path d="M 28 36 Q 50 20 72 34 Q 94 48 110 36"
            fill="none" stroke="#2E7D32" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 40 48 Q 62 58 84 44"
            fill="none" stroke="#388E3C" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="30" cy="34" r="6" fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.8" />
          <circle cx="64" cy="26" r="7" fill="#66BB6A" stroke="#1B5E20" strokeWidth="0.8" />
          <circle cx="102" cy="38" r="6" fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.8" />
          <circle cx="54" cy="54" r="6" fill="#66BB6A" stroke="#1B5E20" strokeWidth="0.8" />
          {[
            { x: 42, y: 34, r: 11 }, { x: 70, y: 26, r: 14 }, { x: 88, y: 44, r: 12 },
          ].map((p, idx) => (
            <g key={idx}>
              <ellipse cx={p.x} cy={p.y + p.r * 0.7} rx={p.r * 1.1} ry={p.r * 0.4} fill="rgba(0,0,0,0.38)" />
              <ellipse cx={p.x} cy={p.y} rx={p.r} ry={p.r * 0.85}
                fill={`url(#${uid}-pumpkin)`} stroke="#BF360C" strokeWidth="1.2" />
              <ellipse cx={p.x} cy={p.y} rx={p.r * 0.65} ry={p.r * 0.85}
                fill="none" stroke="#E65100" strokeWidth="1.0" opacity="0.75" />
              <ellipse cx={p.x} cy={p.y} rx={p.r * 0.3} ry={p.r * 0.85}
                fill="none" stroke="#FFA726" strokeWidth="0.8" opacity="0.80" />
              <ellipse cx={p.x - p.r*0.3} cy={p.y - p.r*0.35}
                rx={p.r * 0.24} ry={p.r * 0.14} fill="#FFF9C4" opacity="0.65" />
              <path
                d={`M ${p.x} ${p.y - p.r*0.8} Q ${p.x+3} ${p.y - p.r*0.8 - 6} ${p.x+6} ${p.y - p.r*0.8 - 4}`}
                fill="none" stroke="#33691E" strokeWidth="2.6" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );

    default:
      return (
        <g>
          {[{ x: 40, y: 30 }, { x: 64, y: 22 }, { x: 88, y: 30 }, { x: 52, y: 48 }, { x: 76, y: 50 }]
            .map((pt, i) => (
              <g key={i}>
                <ellipse cx={pt.x} cy={pt.y + 2} rx="7" ry="3.5" fill="rgba(0,0,0,0.28)" />
                <circle cx={pt.x} cy={pt.y - 12} r="9" fill="#4CAF50" stroke="#1B5E20" strokeWidth="1.2" />
                <circle cx={pt.x - 3} cy={pt.y - 15} r="3" fill="#A5D6A7" opacity="0.7" />
              </g>
            ))}
        </g>
      );
  }
}
