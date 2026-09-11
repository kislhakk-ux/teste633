import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ore3DIcon, MineTool3DIcon, MineOreType, MineToolType } from './Mine3DOres';
import { MiningRollResult } from '../../constants/mineData';

interface MineCavernViewProps {
  playerLevel: number;
  miningPhase: 'idle' | 'preparing' | 'countdown' | 'action' | 'revealing';
  activeMiningTool: MineToolType | null;
  countdownNum: number;
  recentDrops: MiningRollResult['drops'] | null;
  diamondCelebration: number | null;
  onCavernClick?: () => void;
}

export const MineCavernView: React.FC<MineCavernViewProps> = ({
  playerLevel,
  miningPhase,
  activeMiningTool,
  countdownNum,
  recentDrops,
  diamondCelebration,
  onCavernClick,
}) => {
  // Ambient floating dust particles
  const [dustParticles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      size: 2 + Math.random() * 3,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  );

  // Debris particles generated upon impact
  const [debris, setDebris] = useState<{ id: number; x: number; y: number; angle: number; dist: number; size: number; color: string }[]>([]);

  useEffect(() => {
    if (miningPhase === 'action') {
      const colors = ['#78716C', '#44403C', '#CA8A04', '#94A3B8', '#EF4444', '#FEF08A'];
      const newDebris = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: 50,
        y: 52,
        angle: (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
        dist: 50 + Math.random() * 110,
        size: 5 + Math.random() * 8,
        color: colors[i % colors.length],
      }));
      setDebris(newDebris);
    } else {
      setDebris([]);
    }
  }, [miningPhase]);

  return (
    <div
      className="relative h-72 sm:h-80 w-full bg-stone-950 overflow-hidden flex items-center justify-center border-b-2 border-amber-900/60 select-none shadow-inner cursor-pointer"
      onClick={onCavernClick}
    >
      {/* 1. LAYER: DEEP CAVERN BACKGROUND SVG */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 320">
        <defs>
          {/* Radial Cavern Ambient Lighting */}
          <radialGradient id="cavern-ambient" cx="50%" cy="55%" r="65%">
            <stop offset="0%" stopColor="#451A03" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#1C1917" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#0C0A09" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#050505" stopOpacity="1" />
          </radialGradient>

          {/* Lantern Warm Light Cones */}
          <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
          </radialGradient>

          {/* Vein gradients */}
          <linearGradient id="wall-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
          <linearGradient id="wall-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="wall-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="wood-beam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>

        {/* Cavern Void Base */}
        <rect width="800" height="320" fill="url(#cavern-ambient)" />

        {/* Deep Rock Strata (Back Wall) */}
        <path
          d="M 0 50 Q 180 20 380 45 T 800 30 L 800 320 L 0 320 Z"
          fill="#1C1917"
          opacity="0.95"
        />

        {/* Faceted Craggy Rock Layers (Midground) */}
        <polygon points="0,70 120,40 240,85 360,50 480,90 620,45 800,80 800,320 0,320" fill="#292524" />
        <polygon points="0,130 140,110 260,150 410,120 540,165 680,125 800,150 800,320 0,320" fill="#211F1D" />

        {/* Stalactites hanging from cavern roof */}
        <g opacity="0.9">
          <polygon points="80,0 95,50 110,0" fill="#1C1917" stroke="#0C0A09" strokeWidth="1" />
          <polygon points="170,0 185,75 200,0" fill="#292524" stroke="#0C0A09" strokeWidth="1" />
          <polygon points="310,0 320,45 330,0" fill="#1C1917" />
          <polygon points="460,0 475,80 490,0" fill="#292524" stroke="#0C0A09" strokeWidth="1" />
          <polygon points="590,0 600,55 610,0" fill="#1C1917" />
          <polygon points="690,0 705,65 720,0" fill="#292524" />
        </g>

        {/* 2. GLOWING ORE VEINS EMBEDDED IN ROCK FACE */}
        {/* A. Coal & Iron Veins (Always Visible) */}
        <g>
          {/* Coal fissures */}
          <path
            d="M 80 140 Q 140 120 200 155 T 280 140"
            stroke="#09090B"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 85 140 Q 140 122 200 155 T 275 140"
            stroke="#374151"
            strokeWidth="3"
            strokeDasharray="14 6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Iron ore seam */}
          <path
            d="M 190 200 Q 280 180 370 210 T 450 195"
            stroke="#881337"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 190 200 Q 280 180 370 210 T 450 195"
            stroke="#FB7185"
            strokeWidth="3.5"
            strokeDasharray="12 5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Iron ore raw nuggets protruding */}
          <circle cx="240" cy="192" r="4.5" fill="#E11D48" stroke="#881337" strokeWidth="1" />
          <circle cx="330" cy="196" r="5" fill="#F43F5E" stroke="#881337" strokeWidth="1" />
          <circle cx="410" cy="204" r="4" fill="#FDA4AF" />
        </g>

        {/* B. Silver Crystal Vein (Level >= 27) */}
        {playerLevel >= 27 && (
          <g>
            <path
              d="M 480 120 Q 560 95 640 130 T 730 115"
              stroke="url(#wall-silver)"
              strokeWidth="5"
              strokeDasharray="16 8"
              fill="none"
              opacity="0.9"
            />
            {/* Embedded crystal shards */}
            <polygon points="530,110 535,95 540,110" fill="#FFFFFF" stroke="#0284C7" strokeWidth="0.8" />
            <polygon points="600,120 607,102 614,120" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.8" />
            <polygon points="670,125 675,112 680,125" fill="#FFFFFF" />
            {/* Sparkle Glints */}
            <circle cx="535" cy="95" r="2.5" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <circle cx="675" cy="112" r="2" fill="#E0F2FE" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          </g>
        )}

        {/* C. Gold Vein with Rich 24K Nuggets (Level >= 30) */}
        {playerLevel >= 30 && (
          <g>
            <path
              d="M 320 125 Q 400 100 480 135 T 560 120"
              stroke="url(#wall-gold)"
              strokeWidth="6"
              strokeDasharray="14 6"
              fill="none"
              opacity="0.95"
            />
            {/* Gold nuggets */}
            <circle cx="365" cy="115" r="6" fill="#FACC15" stroke="#854D0E" strokeWidth="1.2" />
            <circle cx="363" cy="113" r="2" fill="#FEF9C3" />
            <circle cx="440" cy="120" r="7" fill="#EAB308" stroke="#854D0E" strokeWidth="1.2" />
            <circle cx="438" cy="118" r="2.5" fill="#FFFFFF" />
            <circle cx="510" cy="128" r="5" fill="#FDE047" stroke="#713F12" strokeWidth="1" />
            {/* Gold Twinkle Stars */}
            <polygon
              points="440,108 442,112 446,114 442,116 440,120 438,116 434,114 438,112"
              fill="#FEF08A"
              className="animate-spin"
              style={{ transformOrigin: '440px 114px', animationDuration: '4s' }}
            />
          </g>
        )}

        {/* D. Deep Diamond Geode Cluster (Mystic Sparkling Cyan Point) */}
        <g>
          {/* Diamond Geode Cavity */}
          <ellipse cx="270" cy="85" r="14" ry="11" fill="#0C4A6E" stroke="#0369A1" strokeWidth="1.5" />
          <polygon points="266,85 270,74 274,85 270,92" fill="url(#wall-diamond)" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="270" cy="74" r="3" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: '2s' }} />
          {/* Rotating star glint */}
          <polygon
            points="270,68 272,72 276,74 272,76 270,80 268,76 264,74 268,72"
            fill="#FFFFFF"
            className="animate-spin"
            style={{ transformOrigin: '270px 74px', animationDuration: '3.5s' }}
          />
        </g>

        {/* 3. MINECART & ISOMETRIC TRACKS ON CAVERN FLOOR */}
        <g transform="translate(0, 0)">
          {/* Floor Rock Base */}
          <path d="M 0 250 Q 400 235 800 250 L 800 320 L 0 320 Z" fill="#18181B" />

          {/* Wooden Minecart Rails / Ties */}
          <g opacity="0.85">
            {/* Railroad Ties */}
            {[
              { x: 120, y: 280, w: 50, h: 7 },
              { x: 190, y: 275, w: 52, h: 7 },
              { x: 265, y: 271, w: 55, h: 7 },
              { x: 345, y: 268, w: 57, h: 7 },
              { x: 425, y: 266, w: 60, h: 7 },
              { x: 510, y: 265, w: 62, h: 7 },
              { x: 600, y: 265, w: 64, h: 7 },
              { x: 690, y: 266, w: 66, h: 7 },
            ].map((tie, i) => (
              <rect
                key={`tie_${i}`}
                x={tie.x}
                y={tie.y}
                width={tie.w}
                height={tie.h}
                rx="1.5"
                fill="#78350F"
                stroke="#3E2723"
                strokeWidth="1"
              />
            ))}
            {/* Iron Rails */}
            <path d="M 100 282 Q 400 268 760 268" stroke="#475569" strokeWidth="4" fill="none" />
            <path d="M 100 280 Q 400 266 760 266" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
            <path d="M 130 292 Q 420 278 780 278" stroke="#475569" strokeWidth="4" fill="none" />
            <path d="M 130 290 Q 420 276 780 276" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          </g>

          {/* 3D Cartoon Wooden Minecart Loaded with Mined Ores */}
          <g transform="translate(620, 222)">
            {/* Wheels */}
            <circle cx="-22" cy="40" r="10" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            <circle cx="-22" cy="40" r="4" fill="#94A3B8" />
            <circle cx="22" cy="40" r="10" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            <circle cx="22" cy="40" r="4" fill="#94A3B8" />
            {/* Axle Frame */}
            <rect x="-26" y="32" width="52" height="4" fill="#1E293B" />

            {/* Wooden Cart Bin Body */}
            <polygon
              points="-32,8 32,8 26,34 -26,34"
              fill="url(#wood-beam)"
              stroke="#271202"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Iron Reinforcing Corner Straps & Rivets */}
            <line x1="-32" y1="8" x2="-26" y2="34" stroke="#475569" strokeWidth="3" />
            <line x1="32" y1="8" x2="26" y2="34" stroke="#475569" strokeWidth="3" />
            <line x1="-28" y1="21" x2="28" y2="21" stroke="#334155" strokeWidth="2.5" />
            <circle cx="-27" cy="21" r="1.5" fill="#E2E8F0" />
            <circle cx="27" cy="21" r="1.5" fill="#E2E8F0" />

            {/* Mined Treasure Overflowing from Cart */}
            {/* Gold nuggets */}
            <circle cx="-12" cy="3" r="7" fill="#FACC15" stroke="#854D0E" strokeWidth="1" />
            <circle cx="-14" cy="1" r="2" fill="#FEF9C3" />
            <circle cx="8" cy="1" r="8" fill="#EAB308" stroke="#854D0E" strokeWidth="1" />
            <circle cx="6" cy="-1" r="2.5" fill="#FFFFFF" />
            {/* Silver crystal */}
            <polygon points="-2,6 3,-3 8,6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="0.8" />
            {/* Brilliant Diamond */}
            <polygon points="18,5 23,-2 28,5 23,10" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="23" cy="-2" r="1.5" fill="#FFFFFF" />
            {/* Coal chunks */}
            <polygon points="-24,6 -18,1 -14,7 -20,10" fill="#1F2937" stroke="#111827" strokeWidth="0.8" />
          </g>
        </g>

        {/* 4. HEAVY TIMBER SUPPORT ARMORED ARCHES (Foreground Frame) */}
        <g>
          {/* Top Heavy Horizontal Crossbeam */}
          <rect x="0" y="0" width="800" height="24" fill="url(#wood-beam)" stroke="#271202" strokeWidth="2" />
          {/* Wood grain grooves */}
          <line x1="20" y1="8" x2="780" y2="8" stroke="#B45309" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="16" x2="760" y2="16" stroke="#451A03" strokeWidth="1" opacity="0.8" />

          {/* Left Vertical Timber Support Post */}
          <rect x="15" y="0" width="34" height="320" fill="url(#wood-beam)" stroke="#271202" strokeWidth="2" />
          {/* Wood grain & Metal Brackets */}
          <line x1="26" y1="10" x2="26" y2="310" stroke="#451A03" strokeWidth="1.5" opacity="0.6" />
          <rect x="13" y="24" width="38" height="8" fill="#334155" stroke="#0F172A" strokeWidth="1" />
          <circle cx="20" cy="28" r="1.5" fill="#E2E8F0" />
          <circle cx="44" cy="28" r="1.5" fill="#E2E8F0" />
          {/* Diagonal Corner Timber Brace */}
          <polygon points="49,24 85,24 49,60" fill="#92400E" stroke="#271202" strokeWidth="1.5" />

          {/* Right Vertical Timber Support Post */}
          <rect x="751" y="0" width="34" height="320" fill="url(#wood-beam)" stroke="#271202" strokeWidth="2" />
          <line x1="762" y1="10" x2="762" y2="310" stroke="#451A03" strokeWidth="1.5" opacity="0.6" />
          <rect x="749" y="24" width="38" height="8" fill="#334155" stroke="#0F172A" strokeWidth="1" />
          <circle cx="756" cy="28" r="1.5" fill="#E2E8F0" />
          <circle cx="780" cy="28" r="1.5" fill="#E2E8F0" />
          {/* Diagonal Corner Timber Brace */}
          <polygon points="751,24 715,24 751,60" fill="#92400E" stroke="#271202" strokeWidth="1.5" />
        </g>

        {/* 5. HANGING 3D MINING LANTERNS WITH DYNAMIC SWAY */}
        {/* Left Lantern */}
        <g transform="translate(130, 24)">
          {/* Chain */}
          <line x1="0" y1="0" x2="0" y2="40" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Lantern Body */}
          <g transform="translate(0, 40)" className="animate-[spin_6s_ease-in-out_infinite_alternate]" style={{ transformOrigin: '0px 0px' }}>
            {/* Ambient Radial Glow */}
            <circle cx="0" cy="18" r="75" fill="url(#lantern-glow)" />

            {/* Brass Cap */}
            <polygon points="-12,0 12,0 8,-6 -8,-6" fill="#D97706" stroke="#78350F" strokeWidth="1" />
            <circle cx="0" cy="-8" r="3" fill="none" stroke="#B45309" strokeWidth="1.5" />
            {/* Glass Cage with Glowing Candle */}
            <rect x="-10" y="0" width="20" height="26" rx="2" fill="#FEF3C7" fillOpacity="0.85" stroke="#78350F" strokeWidth="1.2" />
            <rect x="-8" y="2" width="16" height="22" rx="1" fill="#FDE047" fillOpacity="0.9" />
            {/* Flame */}
            <ellipse cx="0" cy="12" rx="3.5" ry="6" fill="#F97316" className="animate-pulse" />
            <ellipse cx="0" cy="13" rx="1.8" ry="3.5" fill="#FFFFFF" />
            {/* Protective Brass Cage Bars */}
            <line x1="-5" y1="0" x2="-5" y2="26" stroke="#92400E" strokeWidth="1" />
            <line x1="5" y1="0" x2="5" y2="26" stroke="#92400E" strokeWidth="1" />
            {/* Brass Base */}
            <rect x="-11" y="26" width="22" height="5" rx="1.5" fill="#D97706" stroke="#78350F" strokeWidth="1" />
          </g>
        </g>

        {/* Right Lantern */}
        <g transform="translate(670, 24)">
          <line x1="0" y1="0" x2="0" y2="45" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
          <g transform="translate(0, 45)" className="animate-[spin_7s_ease-in-out_infinite_alternate]" style={{ transformOrigin: '0px 0px' }}>
            <circle cx="0" cy="18" r="85" fill="url(#lantern-glow)" />
            <polygon points="-12,0 12,0 8,-6 -8,-6" fill="#D97706" stroke="#78350F" strokeWidth="1" />
            <circle cx="0" cy="-8" r="3" fill="none" stroke="#B45309" strokeWidth="1.5" />
            <rect x="-10" y="0" width="20" height="26" rx="2" fill="#FEF3C7" fillOpacity="0.85" stroke="#78350F" strokeWidth="1.2" />
            <rect x="-8" y="2" width="16" height="22" rx="1" fill="#FDE047" fillOpacity="0.9" />
            <ellipse cx="0" cy="12" rx="3.5" ry="6" fill="#F97316" className="animate-pulse" />
            <ellipse cx="0" cy="13" rx="1.8" ry="3.5" fill="#FFFFFF" />
            <line x1="-5" y1="0" x2="-5" y2="26" stroke="#92400E" strokeWidth="1" />
            <line x1="5" y1="0" x2="5" y2="26" stroke="#92400E" strokeWidth="1" />
            <rect x="-11" y="26" width="22" height="5" rx="1.5" fill="#D97706" stroke="#78350F" strokeWidth="1" />
          </g>
        </g>
      </svg>

      {/* 2. LAYER: FLOATING AMBIENT DUST MOTES */}
      {dustParticles.map((pt) => (
        <motion.div
          key={`dust_${pt.id}`}
          className="absolute rounded-full bg-amber-300 pointer-events-none"
          style={{
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            width: pt.size,
            height: pt.size,
            boxShadow: '0 0 6px rgba(251, 191, 36, 0.8)',
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 8, -4, 0],
            opacity: [0.3, 0.85, 0.3],
          }}
          transition={{
            duration: pt.duration,
            repeat: Infinity,
            delay: pt.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 3. LAYER: INTERACTIVE WALL RETICLE / IDLE PROMPT */}
      {miningPhase === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-stone-950/80 border border-amber-500/40 shadow-2xl backdrop-blur-sm pointer-events-none text-center"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs sm:text-sm font-black text-amber-200 tracking-wide">
              Parede de Rocha Pronta para Mineração
            </span>
          </div>
          <p className="text-[11px] text-stone-300 max-w-sm">
            Escolha uma ferramenta abaixo para quebrar veios de carvão, ferro, prata, ouro e diamantes
          </p>
        </motion.div>
      )}

      {/* 4. LAYER: TNT 3.. 2.. 1.. COUNTDOWN OVERLAY */}
      <AnimatePresence>
        {miningPhase === 'countdown' && (
          <motion.div
            key="tnt_countdown"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/65 backdrop-blur-xs"
          >
            {/* 3D Barrel in Cavern Center with Fuses */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 0.15 }}
              className="mb-3"
            >
              <MineTool3DIcon type="tnt_barrel" size={88} />
            </motion.div>

            {/* Countdown Badge */}
            <motion.div
              key={countdownNum}
              initial={{ scale: 1.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 border-4 border-yellow-300 shadow-[0_0_40px_rgba(239,68,68,0.9)] flex items-center justify-center text-4xl sm:text-5xl font-black text-white"
            >
              {countdownNum}
            </motion.div>

            <span className="text-sm font-black text-yellow-300 tracking-widest uppercase mt-3 drop-shadow-md animate-pulse">
              🔥 Pavio Aceso! Afaste-se...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. LAYER: DYNAMIC TOOL IMPACT & EXPLOSION ANIMATIONS */}
      <AnimatePresence>
        {miningPhase === 'action' && activeMiningTool && (
          <motion.div
            key="mining_action"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            {/* A. PICKAXE ANIMATION */}
            {activeMiningTool === 'pickaxe' && (
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ rotate: -55, x: -30, y: -20, scale: 1.2 }}
                  animate={{
                    rotate: [-55, 35, -45, 40],
                    x: [-30, 10, -20, 15],
                    y: [-20, 10, -15, 12],
                  }}
                  transition={{ duration: 0.6, times: [0, 0.4, 0.7, 1], ease: 'easeInOut' }}
                  className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                >
                  <MineTool3DIcon type="pickaxe" size={120} />
                </motion.div>

                {/* Impact Flash Shockwave */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-amber-300 bg-amber-400/30"
                />

                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="absolute -top-12 text-3xl font-black text-yellow-300 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] tracking-wider"
                >
                  💥 CLANG!
                </motion.div>
              </div>
            )}

            {/* B. SHOVEL ANIMATION */}
            {activeMiningTool === 'shovel' && (
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ y: 20, rotate: -25 }}
                  animate={{
                    y: [20, -25, 10],
                    rotate: [-25, 20, -10],
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <MineTool3DIcon type="shovel" size={120} />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute -top-10 text-2xl font-black text-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]"
                >
                  ⛏️ SCRAPE!
                </motion.div>
              </div>
            )}

            {/* C. DYNAMITE / TNT EXPLOSION FIREBALL */}
            {(activeMiningTool === 'dynamite' || activeMiningTool === 'tnt_barrel') && (
              <div className="relative flex flex-col items-center justify-center">
                {/* Expanding Golden Fire Shockwave */}
                <motion.div
                  initial={{ scale: 0.1, opacity: 1 }}
                  animate={{ scale: 3.5, opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="w-48 h-48 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-300 shadow-[0_0_100px_rgba(245,158,11,1)]"
                />

                {/* Explosion Starburst */}
                <motion.div
                  initial={{ scale: 0.2, rotate: 0 }}
                  animate={{ scale: 1.6, rotate: 45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-7xl sm:text-8xl drop-shadow-[0_0_40px_rgba(239,68,68,1)]"
                >
                  💥
                </motion.div>

                {/* BOOM! Typography */}
                <motion.div
                  initial={{ scale: 0.3, y: 20 }}
                  animate={{ scale: 1.4, y: -20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="absolute text-4xl sm:text-6xl font-black text-yellow-300 drop-shadow-[0_6px_20px_rgba(220,38,38,1)] tracking-widest"
                >
                  BOOM!
                </motion.div>
              </div>
            )}

            {/* Flying Rock Debris Shards */}
            {debris.map((shard) => (
              <motion.div
                key={`shard_${shard.id}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(shard.angle) * shard.dist,
                  y: Math.sin(shard.angle) * shard.dist + 20, // Add gravity
                  rotate: shard.angle * 80,
                  opacity: [1, 1, 0],
                  scale: [1, 0.8, 0.2],
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute rounded-xs shadow-md pointer-events-none"
                style={{
                  width: shard.size,
                  height: shard.size * 0.8,
                  backgroundColor: shard.color,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. LAYER: REWARD REVEAL CARDS (FLYING FROM CRATER) */}
      <AnimatePresence>
        {miningPhase === 'revealing' && recentDrops && (
          <motion.div
            key="drops_reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 p-3 bg-black/60 backdrop-blur-xs"
          >
            {/* Diamond Celebration Fanfare */}
            {diamondCelebration && (
              <motion.div
                initial={{ scale: 0.5, y: -30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 via-cyan-300 to-sky-500 border-2 border-white shadow-[0_0_30px_rgba(56,189,248,0.8)] flex items-center gap-2.5 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider"
              >
                <span className="text-xl animate-bounce">💎</span>
                <span>Diamante Raro Encontrado! (+{diamondCelebration} Diamantes)</span>
                <span className="text-xl animate-bounce">💎</span>
              </motion.div>
            )}

            {/* Cards Grid with High-Definition 3D Cartoon Ores */}
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-xl">
              {recentDrops.map((drop, idx) => (
                <motion.div
                  key={`drop_card_${idx}`}
                  initial={{ scale: 0.2, y: 40, rotate: (idx % 2 === 0 ? -1 : 1) * 8 }}
                  animate={{ scale: 1, y: 0, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 18,
                    delay: idx * 0.1,
                  }}
                  className={`relative px-4 py-3 rounded-2xl border-2 shadow-2xl flex items-center gap-3.5 backdrop-blur-md overflow-hidden ${
                    drop.isGem
                      ? 'bg-gradient-to-b from-sky-950/95 via-sky-900/90 to-slate-950 border-sky-400 text-sky-100 shadow-[0_0_25px_rgba(56,189,248,0.5)]'
                      : drop.id === 'gold_ore'
                      ? 'bg-gradient-to-b from-amber-950/95 via-yellow-950/90 to-stone-950 border-amber-400 text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
                      : drop.id === 'silver_ore'
                      ? 'bg-gradient-to-b from-slate-900/95 via-sky-950/90 to-slate-950 border-sky-300 text-sky-100 shadow-[0_0_20px_rgba(186,230,253,0.4)]'
                      : drop.id === 'iron_ore'
                      ? 'bg-gradient-to-b from-stone-900/95 via-rose-950/90 to-stone-950 border-rose-400 text-rose-100'
                      : 'bg-gradient-to-b from-stone-900/95 via-stone-800/90 to-stone-950 border-stone-600 text-stone-100'
                  }`}
                >
                  {/* Internal Glow Backdrop */}
                  <div
                    className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full opacity-30 blur-xl pointer-events-none"
                    style={{ backgroundColor: drop.glowColor }}
                  />

                  {/* 3D Cartoon Ore Art */}
                  <div className="shrink-0 flex items-center justify-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    <Ore3DIcon type={drop.id as MineOreType} size={48} animate={true} />
                  </div>

                  {/* Information & Count */}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black tracking-wide leading-tight drop-shadow">
                      {drop.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-base font-black text-yellow-300 drop-shadow">
                        +{drop.count}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold">
                        {drop.isGem ? '💎 Jóia' : '📦 Celeiro'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
