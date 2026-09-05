import React from 'react';

interface IsoMineEntranceProps {
  status?: 'locked' | 'broken' | 'repairing' | 'repaired';
  repairStartedAt?: number;
  repairDurationSeconds?: number;
  currentTime?: number;
  playerLevel?: number;
  onClick?: () => void;
  onSpeedUp?: () => void;
}

export const IsoMineEntrance: React.FC<IsoMineEntranceProps> = React.memo(({
  status = 'broken',
  repairStartedAt,
  repairDurationSeconds = 129600,
  currentTime = Date.now(),
  playerLevel = 1,
  onClick,
  onSpeedUp,
}) => {
  // Repair progress calculations
  let remainingSeconds = 0;
  let progressPct = 0;
  if (status === 'repairing' && repairStartedAt) {
    const elapsedSeconds = Math.max(0, (currentTime - repairStartedAt) / 1000);
    remainingSeconds = Math.max(0, Math.ceil(repairDurationSeconds - elapsedSeconds));
    progressPct = Math.min(100, (elapsedSeconds / repairDurationSeconds) * 100);
  }

  const hoursLeft = Math.floor(remainingSeconds / 3600);
  const minutesLeft = Math.floor((remainingSeconds % 3600) / 60);
  const timeStr = hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m` : `${minutesLeft}m`;

  const isInteractive = true;

  return (
    <g
      id="iso-mine-entrance"
      className="cursor-pointer select-none group"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{ pointerEvents: 'auto' }}
    >
      <defs>
        {/* Mountain Rock Cliff Gradient */}
        <linearGradient id="mine-rock-face" x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#78716C" />
          <stop offset="35%" stopColor="#57534E" />
          <stop offset="70%" stopColor="#44403C" />
          <stop offset="100%" stopColor="#292524" />
        </linearGradient>

        <linearGradient id="mine-rock-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A8A29E" />
          <stop offset="50%" stopColor="#78716C" />
          <stop offset="100%" stopColor="#44403C" />
        </linearGradient>

        {/* Cavern Interior Shaft Void */}
        <radialGradient id="mine-cave-darkness" cx="48%" cy="58%" r="62%">
          <stop offset="0%" stopColor={status === 'repaired' ? '#78350F' : '#1C1917'} />
          <stop offset="50%" stopColor="#0C0A09" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        {/* Interior Lantern / Gold Glow */}
        <radialGradient id="mine-interior-glow" cx="45%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.45" />
          <stop offset="85%" stopColor="#B45309" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Heavy Wooden Timber Beams */}
        <linearGradient id="mine-timber-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A16207" />
          <stop offset="30%" stopColor="#B45309" />
          <stop offset="70%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <linearGradient id="mine-timber-post" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#92400E" />
          <stop offset="40%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        {/* Rails Steel Gradient */}
        <linearGradient id="mine-rail-steel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Minecart Metal Body */}
        <linearGradient id="minecart-iron" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="45%" stopColor="#475569" />
          <stop offset="85%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Lantern Glow Pulse */}
        <radialGradient id="lantern-light" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#D97706" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
        </radialGradient>

        {/* 3D Timber Top Surface Highlight */}
        <linearGradient id="mine-timber-top-surface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="40%" stopColor="#B45309" />
          <stop offset="80%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* TNT Crate Wood */}
        <linearGradient id="tnt-wood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Sparkling Gem Gradients */}
        <linearGradient id="gem-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="40%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="gem-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="40%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="gem-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* 1. MOUNTAIN ROCK FOOTPRINT & GROUND SHADOW */}
      <ellipse cx="0" cy="20" rx="84" ry="36" fill="rgba(0,0,0,0.42)" />

      {/* 2. MAJESTIC 3D ROCKY MOUNTAIN CLIFF FORMATION (Top-Down Isometric Depth) */}
      {/* Back Mountain Ridge & Upper Overhang */}
      <polygon
        points="-78,-8 -62,-58 -28,-88 32,-94 76,-70 88,-18 64,22 -52,22"
        fill="url(#mine-rock-face)"
        stroke="#1C1917"
        strokeWidth="2.5"
      />

      {/* Top Rock Shelf (Visible from above for true 3D cartoon volume) */}
      <polygon
        points="-62,-58 -28,-88 32,-94 76,-70 60,-52 24,-68 -16,-62 -48,-46"
        fill="url(#mine-rock-highlight)"
        stroke="#44403C"
        strokeWidth="1.2"
        opacity="0.9"
      />

      {/* Rocky Facets, Crags & Crevices */}
      <polygon points="-78,-8 -48,-46 -38,-16 -68,10" fill="#44403C" />
      <polygon points="76,-70 88,-18 68,14 54,-36" fill="#292524" />
      <polygon points="-48,-46 -16,-62 -12,-34 -38,-16" fill="url(#mine-rock-highlight)" opacity="0.8" />
      <polygon points="24,-68 60,-52 54,-36 18,-48" fill="url(#mine-rock-highlight)" opacity="0.8" />

      {/* Surface Crag Depth Lines */}
      <path d="M -36 -72 L -24 -46 L -30 -22" stroke="#1C1917" strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M 42 -78 L 28 -50 L 38 -20" stroke="#1C1917" strokeWidth="2.5" fill="none" opacity="0.85" />
      <path d="M -10 -84 L 2 -58 L -2 -30" stroke="#1C1917" strokeWidth="2.2" fill="none" opacity="0.8" />

      {/* Embedded Sparkly Ore Veins in the Mountain Face */}
      {/* Gold Vein Left */}
      <polygon points="-56,-24 -48,-32 -44,-26 -52,-18" fill="url(#gem-gold)" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="-50" cy="-27" r="1.2" fill="#FFF" />
      <polygon points="-58,-38 -52,-44 -48,-38 -54,-32" fill="url(#gem-gold)" stroke="#B45309" strokeWidth="0.8" />
      {/* Ruby / Emerald Geode Vein Right */}
      <polygon points="56,-32 66,-40 68,-30 58,-24" fill="url(#gem-ruby)" stroke="#991B1B" strokeWidth="0.8" />
      <circle cx="62" cy="-35" r="1.2" fill="#FFF" />
      <polygon points="62,-18 70,-24 72,-16 64,-12" fill="url(#gem-emerald)" stroke="#065F46" strokeWidth="0.8" />

      {/* Mountain Vegetation / Hanging Ivy & Alpine Moss */}
      <ellipse cx="-52" cy="-52" rx="11" ry="6" fill="#4D7C0F" opacity="0.9" />
      <ellipse cx="-50" cy="-53" rx="8" ry="4" fill="#65A30D" />
      <ellipse cx="58" cy="-58" rx="12" ry="6.5" fill="#4D7C0F" opacity="0.9" />
      <ellipse cx="60" cy="-59" rx="8.5" ry="4.5" fill="#65A30D" />
      <ellipse cx="8" cy="-90" rx="10" ry="5" fill="#365314" opacity="0.95" />
      {/* Hanging Ivy tendrils over the portal */}
      <path d="M -22 -53 Q -20 -42 -24 -36" stroke="#4D7C0F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="-24" cy="-36" r="2" fill="#65A30D" />
      <path d="M 24 -53 Q 26 -44 22 -38" stroke="#4D7C0F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="-38" r="2" fill="#65A30D" />

      {/* 3. CAVERN TUNNEL MOUTH (Deep 3D Recessed Cave) */}
      <path
        d="M -38 12 C -40 -18 -34 -48 -24 -52 C -14 -56 14 -56 24 -52 C 34 -48 40 -18 38 12 Z"
        fill="url(#mine-cave-darkness)"
        stroke="#1C1917"
        strokeWidth="3.5"
      />

      {/* Atmospheric Cavern Depth Glow & Warm Light Beam */}
      {status === 'repaired' && (
        <g>
          {/* Pulsing cavern mouth glow */}
          <ellipse cx="0" cy="-18" rx="30" ry="26" fill="url(#mine-interior-glow)" className="animate-pulse" />
          {/* Shaft light fan on ground */}
          <polygon points="-22,8 22,8 34,26 -34,26" fill="#FDE68A" opacity="0.18" />
          {/* Floating sparkling dust particles */}
          <g className="animate-pulse" style={{ animationDuration: '3.5s' }}>
            <circle cx="-12" cy="-26" r="1.5" fill="#FEF08A" opacity="0.8" />
            <circle cx="10" cy="-34" r="1.8" fill="#FDE047" opacity="0.75" />
            <circle cx="2" cy="-15" r="1.2" fill="#FFFFFF" opacity="0.9" />
          </g>
        </g>
      )}

      {/* 4. HEAVY VOLUMETRIC TIMBER PORTAL (Bevelled 3D Cartoon Beams) */}
      {/* Left Timber Post Front */}
      <polygon
        points="-40,14 -30,16 -26,-48 -37,-50"
        fill="url(#mine-timber-post)"
        stroke="#3B1C08"
        strokeWidth="2"
      />
      {/* Left Timber Top-Face Highlight */}
      <polygon points="-37,-50 -26,-48 -28,-54 -39,-56" fill="url(#mine-timber-top-surface)" stroke="#3B1C08" strokeWidth="1" />
      <line x1="-34" y1="15" x2="-31" y2="-48" stroke="#B45309" strokeWidth="1.8" opacity="0.8" />
      {/* Iron Reinforcement Bracket with Rivets */}
      <rect x="-38" y="-22" width="10" height="4.5" rx="1.5" fill="#475569" stroke="#1E293B" strokeWidth="1" />
      <circle cx="-35" cy="-20" r="1" fill="#CBD5E1" />
      <circle cx="-31" cy="-20" r="1" fill="#CBD5E1" />

      {/* Right Timber Post Front */}
      <polygon
        points="30,16 40,14 37,-50 26,-48"
        fill="url(#mine-timber-post)"
        stroke="#3B1C08"
        strokeWidth="2"
      />
      {/* Right Timber Top-Face Highlight */}
      <polygon points="26,-48 37,-50 39,-56 28,-54" fill="url(#mine-timber-top-surface)" stroke="#3B1C08" strokeWidth="1" />
      <line x1="33" y1="15" x2="35" y2="-48" stroke="#B45309" strokeWidth="1.8" opacity="0.8" />
      {/* Iron Reinforcement Bracket with Rivets */}
      <rect x="28" y="-22" width="10" height="4.5" rx="1.5" fill="#475569" stroke="#1E293B" strokeWidth="1" />
      <circle cx="31" cy="-20" r="1" fill="#CBD5E1" />
      <circle cx="35" cy="-20" r="1" fill="#CBD5E1" />

      {/* Top Heavy Crossbeam Lintel (Front Face) */}
      <polygon
        points="-44,-46 44,-46 42,-56 -42,-56"
        fill="url(#mine-timber-top)"
        stroke="#3B1C08"
        strokeWidth="2.2"
      />
      {/* Top Heavy Crossbeam Lintel (Isometric Top Face - Visible from above!) */}
      <polygon
        points="-42,-56 42,-56 46,-64 -38,-64"
        fill="url(#mine-timber-top-surface)"
        stroke="#3B1C08"
        strokeWidth="1.5"
      />
      <line x1="-38" y1="-51" x2="38" y2="-51" stroke="#D97706" strokeWidth="1.5" opacity="0.9" />

      {/* Corner Bracing Gusset Blocks */}
      <polygon points="-30,-46 -22,-46 -30,-38" fill="#78350F" stroke="#3B1C08" strokeWidth="1.2" />
      <polygon points="30,-46 22,-46 30,-38" fill="#78350F" stroke="#3B1C08" strokeWidth="1.2" />

      {/* Carved Wooden "MINA" Archway Plaque */}
      <g transform="translate(0, -58)">
        <polygon points="-24,-5 24,-5 26,4 22,9 -22,9 -26,4" fill="#D97706" stroke="#451A03" strokeWidth="1.2" />
        <polygon points="-23,-4 23,-4 25,3 21,8 -21,8 -25,3" fill="#F59E0B" opacity="0.6" />
        <text x="0" y="4" fontSize="7.5" fontWeight="900" fill="#451A03" textAnchor="middle" style={{ letterSpacing: '1px' }}>
          ⛏️ MINA ⛏️
        </text>
      </g>

      {/* 5. HEAVY STEEL RAILWAY TRACKS (On Wooden Ties) */}
      {/* Wooden Crossties (Sleepers) */}
      {[
        { x1: -14, y1: -4, x2: 14, y2: -4, w: 3.5 },
        { x1: -17, y1: 4, x2: 17, y2: 4, w: 3.8 },
        { x1: -20, y1: 12, x2: 20, y2: 12, w: 4.2 },
        { x1: -24, y1: 21, x2: 24, y2: 21, w: 4.5 },
        { x1: -28, y1: 30, x2: 28, y2: 30, w: 5 },
      ].map((tie, idx) => (
        <line
          key={`mine_tie_${idx}`}
          x1={tie.x1}
          y1={tie.y1}
          x2={tie.x2}
          y2={tie.y2}
          stroke="#78350F"
          strokeWidth={tie.w}
          strokeLinecap="round"
        />
      ))}

      {/* Steel Rail Bars (Polished top shine) */}
      {/* Left Rail */}
      <path d="M -10 -10 L -18 34" stroke="url(#mine-rail-steel)" strokeWidth="3" strokeLinecap="round" />
      <path d="M -10 -10 L -18 34" stroke="#FFFFFF" strokeWidth="1" opacity="0.85" />
      {/* Right Rail */}
      <path d="M 10 -10 L 18 34" stroke="url(#mine-rail-steel)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 10 -10 L 18 34" stroke="#FFFFFF" strokeWidth="1" opacity="0.85" />

      {/* 6. 3D CARTOON MINECART (Heaped with Sparkling Gold & Gemstones) */}
      {status === 'repaired' && (
        <g id="minecart-group" transform="translate(-1, 14)">
          {/* Cart Ground Shadow */}
          <ellipse cx="0" cy="10" rx="18" ry="8" fill="rgba(0,0,0,0.45)" />

          {/* Cart Steel Flanged Wheels */}
          <circle cx="-12" cy="7" r="4" fill="#334155" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="-12" cy="7" r="2" fill="#94A3B8" />
          <circle cx="12" cy="7" r="4" fill="#334155" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="12" cy="7" r="2" fill="#94A3B8" />

          {/* Cart Iron Basin Body */}
          <polygon
            points="-16,5 16,5 20,-8 -20,-8"
            fill="url(#minecart-iron)"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          {/* Front Iron Lip Highlight */}
          <line x1="-20" y1="-8" x2="20" y2="-8" stroke="#94A3B8" strokeWidth="1.8" />
          {/* Rivets */}
          <circle cx="-13" cy="-1" r="1" fill="#CBD5E1" />
          <circle cx="0" cy="-1" r="1" fill="#CBD5E1" />
          <circle cx="13" cy="-1" r="1" fill="#CBD5E1" />

          {/* Sparkly Raw Ores Piled Inside the Cart */}
          {/* Coal Chunk */}
          <ellipse cx="-8" cy="-11" rx="5" ry="3.5" fill="#1F2937" stroke="#111827" strokeWidth="1" />
          {/* Large Gold Ore Nugget */}
          <polygon points="-2,-9 6,-14 9,-9 4,-5" fill="url(#gem-gold)" stroke="#B45309" strokeWidth="1" />
          <circle cx="4" cy="-10" r="1.2" fill="#FEF08A" />
          {/* Emerald Crystal Gem */}
          <polygon points="-11,-12 -6,-16 -4,-12 -9,-8" fill="url(#gem-emerald)" stroke="#065F46" strokeWidth="1" />
          <circle cx="-7" cy="-13" r="1" fill="#A7F3D0" />
          {/* Ruby Crystal Gem */}
          <polygon points="7,-11 13,-15 15,-10 9,-7" fill="url(#gem-ruby)" stroke="#991B1B" strokeWidth="1" />
          <circle cx="11" cy="-12" r="1" fill="#FECACA" />
          {/* Silver Ore Chunk */}
          <polygon points="-2,-13 3,-18 5,-13 0,-10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <circle cx="2" cy="-14" r="1" fill="#FFF" />

          {/* Dynamic Twinkle Glint */}
          <path d="M 5 -12 L 6 -15 L 7 -12 L 10 -11 L 7 -10 L 6 -7 L 5 -10 L 2 -11 Z" fill="#FFF" className="animate-ping" style={{ animationDuration: '2.4s' }} />
        </g>
      )}

      {/* 7. HANGING BRASS LANTERNS WITH WARM PULSING LIGHT */}
      {/* Left Lantern */}
      <g id="left-lantern" transform="translate(-28, -30)">
        <circle cx="0" cy="6" r="16" fill="url(#lantern-light)" className="animate-pulse" />
        <line x1="0" y1="-6" x2="0" y2="0" stroke="#475569" strokeWidth="1.2" />
        <polygon points="-3.5,0 3.5,0 0,-3" fill="#92400E" stroke="#451A03" strokeWidth="0.8" />
        <rect x="-3" y="0" width="6" height="8" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
        <ellipse cx="0" cy="4" rx="1.5" ry="2.2" fill="#EA580C" />
        <ellipse cx="0" cy="4" rx="0.8" ry="1.2" fill="#FFF" />
      </g>

      {/* Right Lantern */}
      <g id="right-lantern" transform="translate(28, -30)">
        <circle cx="0" cy="6" r="16" fill="url(#lantern-light)" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
        <line x1="0" y1="-6" x2="0" y2="0" stroke="#475569" strokeWidth="1.2" />
        <polygon points="-3.5,0 3.5,0 0,-3" fill="#92400E" stroke="#451A03" strokeWidth="0.8" />
        <rect x="-3" y="0" width="6" height="8" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
        <ellipse cx="0" cy="4" rx="1.5" ry="2.2" fill="#EA580C" />
        <ellipse cx="0" cy="4" rx="0.8" ry="1.2" fill="#FFF" />
      </g>

      {/* 8. 3D MINING PROPS: PICKAXE, SHOVEL & TNT DYNAMITE CRATE */}
      {/* 3D Isometric Dynamite Crate labeled "TNT" */}
      <g id="tnt-crate" transform="translate(-52, 6)">
        {/* Ground shadow */}
        <ellipse cx="0" cy="8" rx="11" ry="5" fill="rgba(0,0,0,0.35)" />
        {/* Crate front face */}
        <polygon points="-9,-2 9,-2 9,6 -9,6" fill="url(#tnt-wood)" stroke="#78350F" strokeWidth="1" />
        {/* Crate top face (3D isometric perspective) */}
        <polygon points="-9,-2 9,-2 13,-7 -5,-7" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
        {/* Crate right side face */}
        <polygon points="9,-2 13,-7 13,1 9,6" fill="#92400E" stroke="#78350F" strokeWidth="1" />
        {/* "TNT" Stencil */}
        <text x="0" y="4" fontSize="5.5" fontWeight="900" fill="#7F1D1D" textAnchor="middle">
          TNT
        </text>
        {/* Dynamite sticks poking out */}
        <rect x="-4" y="-11" width="2.5" height="5" rx="0.8" fill="#DC2626" stroke="#991B1B" strokeWidth="0.6" />
        <rect x="0" y="-12" width="2.5" height="6" rx="0.8" fill="#DC2626" stroke="#991B1B" strokeWidth="0.6" />
        {/* Fuse wire */}
        <path d="M 1 -12 Q 3 -15 2 -17" stroke="#78716C" strokeWidth="0.8" fill="none" />
      </g>

      {/* Propped 3D Steel Pickaxe against Left Timber */}
      <g transform="translate(-25, 4) rotate(24)">
        <line x1="0" y1="-22" x2="0" y2="8" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M -8 -20 Q 0 -25 8 -20" stroke="#94A3B8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="-21" r="1.8" fill="#475569" />
        {/* Metallic pickaxe tip shine */}
        <circle cx="-7" cy="-20" r="0.8" fill="#FFF" />
        <circle cx="7" cy="-20" r="0.8" fill="#FFF" />
      </g>

      {/* Propped 3D Shovel stuck in Gravel Right */}
      <g transform="translate(26, 6) rotate(-18)">
        <line x1="0" y1="-20" x2="0" y2="5" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <polygon points="-4,5 4,5 3,11 -3,11" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
        <line x1="0" y1="5" x2="0" y2="10" stroke="#94A3B8" strokeWidth="1" />
      </g>

      {/* 9. SCATTERED ORE NUGGETS & GRANITE ROCKS ON GROUND */}
      {/* Big Boulder Left */}
      <polygon points="-46,14 -36,8 -32,16 -42,22" fill="#78716C" stroke="#44403C" strokeWidth="1.5" />
      <polygon points="-46,14 -36,8 -37,13 -44,17" fill="#A8A29E" />
      {/* Gold Ore Chunk Left */}
      <polygon points="-34,20 -28,16 -26,22 -32,24" fill="url(#gem-gold)" stroke="#B45309" strokeWidth="1" />
      <circle cx="-30" cy="19" r="1" fill="#FFFBEB" />

      {/* Rocks & Emerald Chunk Right */}
      <polygon points="38,16 48,10 52,18 42,24" fill="#78716C" stroke="#44403C" strokeWidth="1.5" />
      <polygon points="38,16 48,10 46,14 40,19" fill="#A8A29E" />
      <polygon points="32,22 38,18 40,24 34,26" fill="url(#gem-emerald)" stroke="#065F46" strokeWidth="1" />
      <circle cx="36" cy="21" r="1" fill="#A7F3D0" />

      {/* 10. SPECIFIC STATE OVERLAYS */}
      {/* A. LOCKED (Level < 24) */}
      {status === 'locked' && (
        <g id="mine-state-locked">
          {/* Heavy Boarded Planks */}
          <polygon points="-32,-8 32,-14 30,-22 -34,-16" fill="#78350F" stroke="#3B1C08" strokeWidth="1.8" />
          <polygon points="-32,-26 32,-32 30,-40 -34,-34" fill="#92400E" stroke="#3B1C08" strokeWidth="1.8" />
          <polygon points="-28,-38 28,0 24,4 -32,-34" fill="#B45309" stroke="#3B1C08" strokeWidth="1.8" />
          {/* Iron Padlock Badge */}
          <g transform="translate(0, -18)">
            <ellipse cx="0" cy="0" rx="16" ry="16" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.5))" />
            <text x="0" y="5.5" fontSize="13" textAnchor="middle" fill="#FFFFFF">
              🔒
            </text>
          </g>
        </g>
      )}

      {/* B. BROKEN (Level 24+, Ready for Repair) */}
      {status === 'broken' && (
        <g id="mine-state-broken">
          {/* Collapsed timbers & rock rubble */}
          <polygon points="-30,-6 30,-12 28,-19 -32,-13" fill="#92400E" stroke="#3B1C08" strokeWidth="1.8" />
          <polygon points="-28,-26 28,-20 26,-27 -30,-33" fill="#78350F" stroke="#3B1C08" strokeWidth="1.8" />
          <polygon points="-18,6 18,4 22,14 -14,16" fill="#57534E" stroke="#292524" strokeWidth="1.5" />
          {/* Animated 3D Bouncing Repair Hammer Badge */}
          <g transform="translate(0, -24)" className="animate-bounce" style={{ animationDuration: '1.8s' }}>
            <circle cx="0" cy="0" r="18" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />
            <text x="0" y="5.5" fontSize="15" textAnchor="middle" fill="#FFFFFF">
              🔨
            </text>
          </g>
        </g>
      )}

      {/* C. REPAIRING (In Progress) */}
      {status === 'repairing' && (
        <g id="mine-state-repairing">
          {/* Wooden Scaffolding Poles */}
          <line x1="-26" y1="4" x2="26" y2="-40" stroke="#D97706" strokeWidth="3" strokeDasharray="6 4" />
          <line x1="26" y1="4" x2="-26" y2="-40" stroke="#D97706" strokeWidth="3" strokeDasharray="6 4" />

          {/* Animated Dust Puffs */}
          <g className="animate-ping" style={{ animationDuration: '2.5s' }}>
            <circle cx="-16" cy="-6" r="6" fill="#E2E8F0" opacity="0.7" />
            <circle cx="18" cy="-10" r="5" fill="#E2E8F0" opacity="0.7" />
          </g>

          {/* Repair Progress Pill Badge */}
          <g transform="translate(0, -68)">
            <rect x="-46" y="-13" width="92" height="26" rx="13" fill="#1E293B" stroke="#F59E0B" strokeWidth="2.5" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.6))" />
            <g transform="translate(-30, 0)">
              <circle cx="0" cy="0" r="8" fill="none" stroke="#475569" strokeWidth="3" />
              <circle
                cx="0"
                cy="0"
                r="8"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray="50"
                strokeDashoffset={50 - (50 * progressPct) / 100}
                transform="rotate(-90)"
              />
            </g>
            <text x="4" y="4" fontSize="10.5" fontWeight="900" fill="#FEF08A" textAnchor="middle">
              {timeStr}
            </text>
          </g>
        </g>
      )}

      {/* D. REPAIRED (Active, Ready to Mine!) */}
      {status === 'repaired' && (
        <g id="mine-state-repaired">
          {/* Golden Hover Halo */}
          <ellipse
            cx="0"
            cy="-15"
            rx="52"
            ry="44"
            fill="none"
            stroke="#FDE047"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />

          {/* Floating Atmospheric Sparkle Stars */}
          <g className="animate-pulse" style={{ animationDuration: '2.8s' }}>
            <polygon points="-10,-36 -8,-40 -6,-36 -4,-34 -6,-32 -8,-28 -10,-32 -12,-34" fill="#FEF08A" />
            <polygon points="14,-40 16,-43 18,-40 20,-38 18,-36 16,-33 14,-36 12,-38" fill="#FBBF24" />
          </g>
        </g>
      )}
    </g>
  );
});
