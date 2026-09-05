import React from 'react';

interface IsoSmelterProps {
  isWorking?: boolean;
}

export const IsoSmelter: React.FC<IsoSmelterProps> = React.memo(({ isWorking = false }) => {
  return (
    <div className="relative w-[176px] h-[176px] flex items-center justify-center select-none pointer-events-none">
      <svg
        viewBox="-70 -90 140 140"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Refractory Brick Gradient */}
          <linearGradient id="smelter-brick-main" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="40%" stopColor="#7F1D1D" />
            <stop offset="80%" stopColor="#450A0A" />
            <stop offset="100%" stopColor="#2A0808" />
          </linearGradient>

          <linearGradient id="smelter-stone-base" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78716C" />
            <stop offset="50%" stopColor="#57534E" />
            <stop offset="100%" stopColor="#44403C" />
          </linearGradient>

          {/* Molten Liquid Metal Gradient */}
          <linearGradient id="molten-metal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          {/* Furnace Fire Glow */}
          <radialGradient id="furnace-fire-glow" cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#F97316" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#EF4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0" />
          </radialGradient>

          {/* Chimney Cast Iron */}
          <linearGradient id="smelter-chimney" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="35%" stopColor="#334155" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* 1. GROUND CONTACT SHADOW */}
        <ellipse cx="0" cy="22" rx="55" ry="24" fill="rgba(0,0,0,0.35)" />

        {/* 2. STONE COBBLESTONE SLAB BASE */}
        <polygon
          points="-52,18 0,42 52,18 0,-6"
          fill="url(#smelter-stone-base)"
          stroke="#292524"
          strokeWidth="2"
        />
        {/* Base Rim Thickness */}
        <polygon
          points="-52,18 0,42 0,48 -52,24"
          fill="#44403C"
          stroke="#1C1917"
          strokeWidth="1.2"
        />
        <polygon
          points="0,42 52,18 52,24 0,48"
          fill="#292524"
          stroke="#1C1917"
          strokeWidth="1.2"
        />

        {/* 3. REFRACTORY BRICK FURNACE BODY (MAIN DOME KILN) */}
        {/* Left Furnace Dome */}
        <path
          d="M -38 12 C -42 -10 -36 -32 -20 -36 C -4 -38 4 -22 6 8 Z"
          fill="url(#smelter-brick-main)"
          stroke="#2A0808"
          strokeWidth="2"
        />
        {/* Right Furnace Chamber */}
        <path
          d="M -4 8 C -2 -24 10 -38 26 -36 C 42 -32 46 -10 42 12 Z"
          fill="url(#smelter-brick-main)"
          stroke="#2A0808"
          strokeWidth="2"
        />

        {/* Brick Layer Lines */}
        <path d="M -34 -6 Q -18 -12 -2 -6" stroke="#450A0A" strokeWidth="1.5" fill="none" />
        <path d="M -30 -18 Q -16 -24 -4 -18" stroke="#450A0A" strokeWidth="1.5" fill="none" />
        <path d="M 4 -6 Q 20 -12 36 -6" stroke="#450A0A" strokeWidth="1.5" fill="none" />
        <path d="M 6 -18 Q 22 -24 32 -18" stroke="#450A0A" strokeWidth="1.5" fill="none" />

        {/* 4. HEAVY BRICK & IRON CHIMNEY */}
        <polygon
          points="-14,-32 4,-32 2,-76 -12,-76"
          fill="url(#smelter-brick-main)"
          stroke="#2A0808"
          strokeWidth="1.8"
        />
        {/* Chimney Metal Cap & Iron Bands */}
        <rect x="-15" y="-78" width="18" height="4.5" rx="1.5" fill="url(#smelter-chimney)" stroke="#0F172A" strokeWidth="1" />
        <rect x="-14" y="-62" width="16" height="3" rx="1" fill="url(#smelter-chimney)" opacity="0.9" />
        <rect x="-14" y="-46" width="16" height="3" rx="1" fill="url(#smelter-chimney)" opacity="0.9" />

        {/* 5. INCANDESCENT FURNACE MOUTHS (FIRE DOORS) */}
        {/* Left Arch Door */}
        <path
          d="M -26 12 C -28 0 -26 -10 -18 -10 C -10 -10 -8 0 -10 12 Z"
          fill="#1C1917"
          stroke="#2A0808"
          strokeWidth="1.5"
        />
        {/* Left Fire Glow */}
        <ellipse
          cx="-18"
          cy="2"
          rx="7"
          ry="9"
          fill="url(#furnace-fire-glow)"
          className={isWorking ? 'animate-pulse' : ''}
        />
        {/* Iron Grate Bars */}
        <line x1="-22" y1="8" x2="-14" y2="8" stroke="#450A0A" strokeWidth="1.2" />
        <line x1="-21" y1="2" x2="-15" y2="2" stroke="#450A0A" strokeWidth="1.2" />

        {/* Right Arch Door */}
        <path
          d="M 10 12 C 8 0 10 -10 18 -10 C 26 -10 28 0 26 12 Z"
          fill="#1C1917"
          stroke="#2A0808"
          strokeWidth="1.5"
        />
        {/* Right Fire Glow */}
        <ellipse
          cx="18"
          cy="2"
          rx="7"
          ry="9"
          fill="url(#furnace-fire-glow)"
          className={isWorking ? 'animate-pulse' : ''}
        />
        <line x1="14" y1="8" x2="22" y2="8" stroke="#450A0A" strokeWidth="1.2" />
        <line x1="15" y1="2" x2="21" y2="2" stroke="#450A0A" strokeWidth="1.2" />

        {/* 6. CAST IRON MOLTEN METAL CHANNEL & INGOT MOLDS */}
        {/* Channel Slope pouring down */}
        <polygon
          points="-8,8 8,8 6,24 -6,24"
          fill="url(#smelter-chimney)"
          stroke="#0F172A"
          strokeWidth="1"
        />
        {/* Glowing Molten River stream inside the channel */}
        <polygon
          points="-4,8 4,8 3,23 -3,23"
          fill="url(#molten-metal)"
          className={isWorking ? 'animate-pulse' : ''}
        />

        {/* Ingot Mold Tray on Ground */}
        <polygon
          points="-14,24 14,24 18,34 -18,34"
          fill="#334155"
          stroke="#0F172A"
          strokeWidth="1.2"
        />
        {/* Cast Glowing Gold/Iron Ingots in Mold */}
        <polygon points="-10,26 -2,26 0,31 -8,31" fill="url(#molten-metal)" />
        <polygon points="2,26 10,26 8,31 0,31" fill="url(#molten-metal)" />

        {/* 7. BLACKSMITH ANVIL & TONGS (Right Side) */}
        <g transform="translate(36, 16)">
          {/* Anvil Wooden Stump */}
          <ellipse cx="0" cy="8" rx="8" ry="4" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          <polygon points="-6,8 6,8 5,-2 -5,-2" fill="#92400E" stroke="#451A03" strokeWidth="0.8" />
          {/* Steel Anvil */}
          <polygon points="-8,-2 6,-2 8,-5 2,-7 -6,-7 -8,-4" fill="url(#smelter-chimney)" stroke="#0F172A" strokeWidth="0.8" />
          {/* Hammer on anvil */}
          <line x1="-3" y1="-8" x2="4" y2="-4" stroke="#B45309" strokeWidth="1.2" />
          <rect x="2" y="-6" width="3" height="2" fill="#475569" stroke="#1E293B" strokeWidth="0.5" />
        </g>

        {/* 8. COAL PILE & ORE CHUNKS (Left Side) */}
        <g transform="translate(-36, 20)">
          {/* Coal Nuggets */}
          <circle cx="-5" cy="0" r="3" fill="#18181B" stroke="#09090B" strokeWidth="0.6" />
          <circle cx="0" cy="-2" r="3.5" fill="#27272A" stroke="#09090B" strokeWidth="0.6" />
          <circle cx="4" cy="1" r="2.8" fill="#18181B" stroke="#09090B" strokeWidth="0.6" />
          {/* Shiny Gold Nugget */}
          <polygon points="-2,2 3,0 4,4 -1,5" fill="#FBBF24" stroke="#B45309" strokeWidth="0.6" />
        </g>

        {/* 9. WORKING ANIMATIONS: SMOKE PUFFS & SPARKS */}
        {isWorking ? (
          <g id="smelter-working-effects">
            {/* Animated Smoke Clouds from Chimney */}
            <g className="animate-ping" style={{ animationDuration: '2.2s' }}>
              <circle cx="-5" cy="-84" r="6" fill="#94A3B8" opacity="0.75" />
            </g>
            <g className="animate-ping" style={{ animationDuration: '3s', animationDelay: '0.8s' }}>
              <circle cx="-2" cy="-96" r="9" fill="#CBD5E1" opacity="0.6" />
            </g>
            <g className="animate-ping" style={{ animationDuration: '3.8s', animationDelay: '1.4s' }}>
              <circle cx="4" cy="-110" r="12" fill="#E2E8F0" opacity="0.45" />
            </g>

            {/* Glowing Embers / Sparkles */}
            <circle cx="-6" cy="-20" r="1.2" fill="#FDE047" className="animate-ping" style={{ animationDuration: '1.2s' }} />
            <circle cx="12" cy="-16" r="1" fill="#F97316" className="animate-ping" style={{ animationDuration: '1.6s' }} />
            <circle cx="0" cy="14" r="1.2" fill="#FDE047" className="animate-ping" style={{ animationDuration: '1.4s' }} />
          </g>
        ) : (
          /* Idle gentle smoke */
          <g opacity="0.4">
            <circle cx="-5" cy="-84" r="4.5" fill="#CBD5E1" />
            <circle cx="-2" cy="-94" r="6" fill="#E2E8F0" />
          </g>
        )}
      </svg>
    </div>
  );
});
