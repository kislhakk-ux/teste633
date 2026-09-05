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
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. MOUNTAIN ROCK FOOTPRINT & GROUND SHADOW */}
      <ellipse cx="0" cy="18" rx="72" ry="32" fill="rgba(0,0,0,0.38)" />

      {/* 2. MAJESTIC ROCKY MOUNTAIN CLIFF FORMATION */}
      {/* Back Mountain Ridge */}
      <polygon
        points="-64,-10 -50,-52 -20,-75 25,-82 62,-60 76,-15 52,18 -42,16"
        fill="url(#mine-rock-face)"
        stroke="#292524"
        strokeWidth="2.5"
      />

      {/* Rock Stratum Facets & Crags */}
      <polygon points="-50,-52 -20,-75 -10,-45 -40,-30" fill="url(#mine-rock-highlight)" opacity="0.85" />
      <polygon points="25,-82 62,-60 45,-38 10,-52" fill="url(#mine-rock-highlight)" opacity="0.75" />
      <polygon points="-64,-10 -40,-30 -35,-5 -60,5" fill="#44403C" />
      <polygon points="62,-60 76,-15 58,5 45,-38" fill="#292524" />

      {/* Surface Crag Detail Lines */}
      <path d="M -30 -62 L -20 -40 L -25 -18" stroke="#1C1917" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M 35 -68 L 22 -42 L 30 -15" stroke="#1C1917" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M -8 -72 L 0 -50 L -4 -25" stroke="#1C1917" strokeWidth="1.8" fill="none" opacity="0.7" />

      {/* Mountain Vegetation / Moss Patches */}
      <ellipse cx="-42" cy="-45" rx="9" ry="5" fill="#4D7C0F" opacity="0.85" />
      <ellipse cx="-40" cy="-46" rx="6" ry="3.5" fill="#65A30D" />
      <ellipse cx="48" cy="-50" rx="10" ry="5" fill="#4D7C0F" opacity="0.8" />
      <ellipse cx="50" cy="-51" rx="7" ry="3.5" fill="#65A30D" />
      <ellipse cx="6" cy="-78" rx="8" ry="4" fill="#365314" opacity="0.9" />

      {/* 3. CAVERN TUNNEL MOUTH */}
      <path
        d="M -32 10 C -34 -15 -30 -42 -22 -46 C -12 -50 12 -50 22 -46 C 30 -42 34 -15 32 10 Z"
        fill="url(#mine-cave-darkness)"
        stroke="#1C1917"
        strokeWidth="3"
      />

      {/* Interior Atmospheric Shaft Glow (Active when Repaired) */}
      {status === 'repaired' && (
        <g>
          <ellipse cx="0" cy="-18" rx="26" ry="24" fill="url(#mine-interior-glow)" className="animate-pulse" />
          {/* Shaft Light Beam on Ground */}
          <polygon points="-18,6 18,6 30,22 -30,22" fill="#FDE68A" opacity="0.15" />
        </g>
      )}

      {/* 4. HEAVY TIMBER PORTAL (WOOD BEAMS) */}
      {/* Left Timber Post */}
      <polygon
        points="-35,12 -27,14 -24,-45 -33,-47"
        fill="url(#mine-timber-post)"
        stroke="#3B1C08"
        strokeWidth="1.8"
      />
      {/* Left Timber Front Highlight */}
      <line x1="-31" y1="13" x2="-29" y2="-46" stroke="#B45309" strokeWidth="1.5" opacity="0.8" />
      {/* Iron Reinforcement Bracket */}
      <rect x="-34" y="-20" width="8" height="3.5" rx="1" fill="#475569" stroke="#1E293B" strokeWidth="0.8" />
      <circle cx="-32" cy="-18" r="0.8" fill="#CBD5E1" />
      <circle cx="-28" cy="-18" r="0.8" fill="#CBD5E1" />

      {/* Right Timber Post */}
      <polygon
        points="27,14 35,12 33,-47 24,-45"
        fill="url(#mine-timber-post)"
        stroke="#3B1C08"
        strokeWidth="1.8"
      />
      {/* Right Timber Front Highlight */}
      <line x1="29" y1="13" x2="31" y2="-46" stroke="#B45309" strokeWidth="1.5" opacity="0.8" />
      {/* Iron Reinforcement Bracket */}
      <rect x="26" y="-20" width="8" height="3.5" rx="1" fill="#475569" stroke="#1E293B" strokeWidth="0.8" />
      <circle cx="28" cy="-18" r="0.8" fill="#CBD5E1" />
      <circle cx="32" cy="-18" r="0.8" fill="#CBD5E1" />

      {/* Top Heavy Crossbeam Lintel */}
      <polygon
        points="-38,-44 38,-44 36,-53 -36,-53"
        fill="url(#mine-timber-top)"
        stroke="#3B1C08"
        strokeWidth="2"
      />
      <line x1="-34" y1="-49" x2="34" y2="-49" stroke="#D97706" strokeWidth="1.2" opacity="0.9" />

      {/* Corner Bracing Blocks */}
      <polygon points="-27,-44 -20,-44 -27,-37" fill="#78350F" stroke="#3B1C08" strokeWidth="1" />
      <polygon points="27,-44 20,-44 27,-37" fill="#78350F" stroke="#3B1C08" strokeWidth="1" />

      {/* 5. RAILWAY TRACKS INTO THE MINE */}
      {/* Wooden Crossties (Sleepers) */}
      {[
        { x1: -12, y1: -2, x2: 12, y2: -2, w: 3 },
        { x1: -15, y1: 5, x2: 15, y2: 5, w: 3.5 },
        { x1: -18, y1: 13, x2: 18, y2: 13, w: 4 },
        { x1: -21, y1: 21, x2: 21, y2: 21, w: 4 },
        { x1: -24, y1: 29, x2: 24, y2: 29, w: 4.5 },
      ].map((tie, idx) => (
        <line
          key={`tie_${idx}`}
          x1={tie.x1}
          y1={tie.y1}
          x2={tie.x2}
          y2={tie.y2}
          stroke="#78350F"
          strokeWidth={tie.w}
          strokeLinecap="round"
        />
      ))}

      {/* Steel Rail Bars */}
      {/* Left Rail */}
      <path
        d="M -8 -8 L -16 32"
        stroke="url(#mine-rail-steel)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M -8 -8 L -16 32" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.75" />

      {/* Right Rail */}
      <path
        d="M 8 -8 L 16 32"
        stroke="url(#mine-rail-steel)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M 8 -8 L 16 32" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.75" />

      {/* 6. MINECART (CARRINHO DE MINERAÇÃO) */}
      {status === 'repaired' && (
        <g id="minecart-group" transform="translate(-1, 14)">
          {/* Cart Ground Shadow */}
          <ellipse cx="0" cy="8" rx="14" ry="6" fill="rgba(0,0,0,0.4)" />

          {/* Cart Steel Flanged Wheels */}
          <circle cx="-9" cy="6" r="3.2" fill="#334155" stroke="#0F172A" strokeWidth="1" />
          <circle cx="-9" cy="6" r="1.5" fill="#94A3B8" />
          <circle cx="9" cy="6" r="3.2" fill="#334155" stroke="#0F172A" strokeWidth="1" />
          <circle cx="9" cy="6" r="1.5" fill="#94A3B8" />

          {/* Cart Iron Basin Body */}
          <polygon
            points="-12,4 12,4 15,-6 -15,-6"
            fill="url(#minecart-iron)"
            stroke="#1E293B"
            strokeWidth="1.2"
          />
          {/* Front Iron Lip */}
          <line x1="-15" y1="-6" x2="15" y2="-6" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Rivets */}
          <circle cx="-10" cy="-1" r="0.8" fill="#CBD5E1" />
          <circle cx="0" cy="-1" r="0.8" fill="#CBD5E1" />
          <circle cx="10" cy="-1" r="0.8" fill="#CBD5E1" />

          {/* Sparkly Raw Ores Piled Inside the Cart */}
          {/* Coal Rock */}
          <ellipse cx="-6" cy="-8" rx="4" ry="3" fill="#1F2937" stroke="#111827" strokeWidth="0.8" />
          {/* Gold Ore Nugget */}
          <polygon points="1,-6 7,-10 9,-6 5,-3" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
          <circle cx="5" cy="-7" r="1" fill="#FEF08A" />
          {/* Silver Ore Chunk */}
          <polygon points="-2,-7 2,-11 4,-7 0,-4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          {/* Sparkle Glint */}
          <path d="M 6 -9 L 7 -11 L 8 -9 L 10 -8 L 8 -7 L 7 -5 L 6 -7 L 4 -8 Z" fill="#FFF" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        </g>
      )}

      {/* 7. HANGING BRASS LANTERNS WITH WARM LIGHT */}
      {/* Left Lantern */}
      <g id="left-lantern" transform="translate(-25, -28)">
        {/* Glow halo */}
        <circle cx="0" cy="5" r="14" fill="url(#lantern-light)" className="animate-pulse" />
        {/* Chain / Cord */}
        <line x1="0" y1="-5" x2="0" y2="0" stroke="#475569" strokeWidth="1" />
        {/* Cap */}
        <polygon points="-3,0 3,0 0,-2" fill="#78350F" />
        {/* Glass Globe with Flame */}
        <rect x="-2.5" y="0" width="5" height="7" rx="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
        <ellipse cx="0" cy="3.5" rx="1.2" ry="2" fill="#EA580C" />
        <ellipse cx="0" cy="3.5" rx="0.6" ry="1" fill="#FFF" />
      </g>

      {/* Right Lantern */}
      <g id="right-lantern" transform="translate(25, -28)">
        <circle cx="0" cy="5" r="14" fill="url(#lantern-light)" className="animate-pulse" style={{ animationDelay: '0.7s' }} />
        <line x1="0" y1="-5" x2="0" y2="0" stroke="#475569" strokeWidth="1" />
        <polygon points="-3,0 3,0 0,-2" fill="#78350F" />
        <rect x="-2.5" y="0" width="5" height="7" rx="1.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
        <ellipse cx="0" cy="3.5" rx="1.2" ry="2" fill="#EA580C" />
        <ellipse cx="0" cy="3.5" rx="0.6" ry="1" fill="#FFF" />
      </g>

      {/* 8. SCATTERED ROCKS & MINERAL NUGGETS AROUND ENTRANCE */}
      {/* Big Boulder Left */}
      <polygon points="-48,6 -38,0 -34,8 -44,14" fill="#78716C" stroke="#44403C" strokeWidth="1.2" />
      <polygon points="-48,6 -38,0 -39,5 -46,9" fill="#A8A29E" />

      {/* Gold Ore Chunk Left */}
      <polygon points="-36,12 -31,9 -29,14 -34,16" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="-33" cy="12" r="0.8" fill="#FFFBEB" />

      {/* Rocks Right */}
      <polygon points="34,10 44,4 48,12 38,18" fill="#78716C" stroke="#44403C" strokeWidth="1.2" />
      <polygon points="34,10 44,4 42,8 36,13" fill="#A8A29E" />
      {/* Silver Chunk Right */}
      <polygon points="30,16 35,13 37,18 32,20" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" />

      {/* Propped Iron Pickaxe against Left Beam */}
      <g transform="translate(-23, 2) rotate(22)">
        <line x1="0" y1="-18" x2="0" y2="6" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M -6 -17 Q 0 -21 6 -17" stroke="#94A3B8" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="-18" r="1.5" fill="#475569" />
      </g>

      {/* Propped Shovel against Right Beam */}
      <g transform="translate(23, 4) rotate(-18)">
        <line x1="0" y1="-18" x2="0" y2="4" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
        <polygon points="-3.5,4 3.5,4 2.5,9 -2.5,9" fill="#64748B" stroke="#334155" strokeWidth="0.8" />
      </g>

      {/* 9. RUSTIC WOODEN SIGNPOST ("MINA") */}
      <g id="mine-signpost" transform="translate(42, 2)">
        {/* Post in Ground */}
        <ellipse cx="0" cy="16" rx="4" ry="2" fill="rgba(0,0,0,0.3)" />
        <rect x="-2" y="0" width="4" height="16" fill="#78350F" stroke="#451A03" strokeWidth="0.8" />
        {/* Wooden Board */}
        <polygon
          points="-16,-6 16,-6 18,2 14,8 -16,8"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        {/* Wood grain */}
        <line x1="-13" y1="1" x2="13" y2="1" stroke="#B45309" strokeWidth="0.8" />
        <text
          x="0"
          y="3"
          fontSize="6.5"
          fontWeight="900"
          fill="#451A03"
          textAnchor="middle"
          style={{ letterSpacing: '0.5px' }}
        >
          MINA
        </text>
      </g>

      {/* 10. SPECIFIC STATE OVERLAYS */}
      {/* A. LOCKED (Level < 24) */}
      {status === 'locked' && (
        <g id="mine-state-locked">
          {/* Cracked Wooden Planks Boarding up the Entrance */}
          <polygon points="-28,-8 28,-14 26,-22 -30,-16" fill="#78350F" stroke="#3B1C08" strokeWidth="1.5" />
          <polygon points="-28,-26 28,-32 26,-40 -30,-34" fill="#92400E" stroke="#3B1C08" strokeWidth="1.5" />
          <polygon points="-24,-38 24,0 20,4 -28,-34" fill="#B45309" stroke="#3B1C08" strokeWidth="1.5" />
          {/* Fallen Rocks blocking */}
          <polygon points="-12,4 12,2 16,12 -8,14" fill="#57534E" stroke="#292524" strokeWidth="1.2" />
          {/* Warning Lock Badge */}
          <g transform="translate(0, -18)">
            <ellipse cx="0" cy="0" rx="14" ry="14" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="4.5" fontSize="12" textAnchor="middle" fill="#FFFFFF">
              🔒
            </text>
          </g>
        </g>
      )}

      {/* B. BROKEN (Level 24+, Ready for Repair) */}
      {status === 'broken' && (
        <g id="mine-state-broken">
          {/* Planks & Rubble blocking */}
          <polygon points="-26,-6 26,-12 24,-19 -28,-13" fill="#92400E" stroke="#3B1C08" strokeWidth="1.5" />
          <polygon points="-25,-26 25,-20 23,-27 -27,-33" fill="#78350F" stroke="#3B1C08" strokeWidth="1.5" />
          {/* Rubble pile */}
          <polygon points="-16,6 16,4 20,13 -12,15" fill="#57534E" stroke="#292524" strokeWidth="1.2" />
          {/* Caution Hammer Badge floating */}
          <g transform="translate(0, -22)" className="animate-bounce" style={{ animationDuration: '2s' }}>
            <circle cx="0" cy="0" r="15" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="0" y="4.5" fontSize="13" textAnchor="middle" fill="#FFFFFF">
              🔨
            </text>
          </g>
        </g>
      )}

      {/* C. REPAIRING (In Progress) */}
      {status === 'repairing' && (
        <g id="mine-state-repairing">
          {/* Scaffolding Crossbeams */}
          <line x1="-24" y1="2" x2="24" y2="-38" stroke="#D97706" strokeWidth="2.5" strokeDasharray="5 3" />
          <line x1="24" y1="2" x2="-24" y2="-38" stroke="#D97706" strokeWidth="2.5" strokeDasharray="5 3" />

          {/* Animated Dust Puffs */}
          <g className="animate-ping" style={{ animationDuration: '2.5s' }}>
            <circle cx="-14" cy="-4" r="5" fill="#E2E8F0" opacity="0.6" />
            <circle cx="16" cy="-8" r="4" fill="#E2E8F0" opacity="0.6" />
          </g>

          {/* Repair Progress Pill Badge */}
          <g transform="translate(0, -62)">
            {/* Pill Background */}
            <rect x="-42" y="-12" width="84" height="24" rx="12" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
            {/* Mini Circular Progress */}
            <g transform="translate(-28, 0)">
              <circle cx="0" cy="0" r="7" fill="none" stroke="#475569" strokeWidth="2.5" />
              <circle
                cx="0"
                cy="0"
                r="7"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="44"
                strokeDashoffset={44 - (44 * progressPct) / 100}
                transform="rotate(-90)"
              />
            </g>
            <text x="2" y="3.5" fontSize="9.5" fontWeight="900" fill="#FEF08A" textAnchor="middle">
              {timeStr}
            </text>
          </g>
        </g>
      )}

      {/* D. REPAIRED (Ready to Explore!) */}
      {status === 'repaired' && (
        <g id="mine-state-repaired">
          {/* Subtle Golden Hover Halo */}
          <ellipse
            cx="0"
            cy="-15"
            rx="46"
            ry="40"
            fill="none"
            stroke="#FDE047"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="opacity-0 group-hover:opacity-80 transition-opacity"
          />

          {/* Floating Atmospheric Sparkle Stars */}
          <g className="animate-pulse" style={{ animationDuration: '3s' }}>
            <polygon points="-8,-34 -6,-38 -4,-34 -2,-32 -4,-30 -6,-26 -8,-30 -10,-32" fill="#FEF08A" />
            <polygon points="12,-38 14,-41 16,-38 18,-36 16,-34 14,-31 12,-34 10,-36" fill="#FBBF24" />
          </g>
        </g>
      )}
    </g>
  );
});
