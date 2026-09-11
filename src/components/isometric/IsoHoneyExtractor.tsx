import React from 'react';

interface IsoHoneyExtractorProps {
  isWorking?: boolean;
}

export const IsoHoneyExtractor: React.FC<IsoHoneyExtractorProps> = ({ isWorking }) => {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center select-none">
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full overflow-visible drop-shadow-xl"
      >
        <defs>
          <linearGradient id="drum-metal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="35%" stopColor="#F1F5F9" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <radialGradient id="honey-pool-grad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          <linearGradient id="wood-stand-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* 3 Wooden Legs Stand */}
        <polygon points="35,115 40,115 50,85 45,85" fill="url(#wood-stand-grad)" stroke="#451A03" strokeWidth="0.8" />
        <polygon points="100,115 105,115 95,85 90,85" fill="url(#wood-stand-grad)" stroke="#451A03" strokeWidth="0.8" />
        <polygon points="68,125 72,125 72,90 68,90" fill="url(#wood-stand-grad)" stroke="#451A03" strokeWidth="0.8" />

        {/* Main Stainless Centrifuge Cylinder Drum */}
        {/* Bottom Ellipse */}
        <ellipse cx="70" cy="85" rx="36" ry="16" fill="#475569" />
        
        {/* Cylinder Body */}
        <path
          d="M 34 50 L 34 85 C 34 94 106 94 106 85 L 106 50 Z"
          fill="url(#drum-metal-grad)"
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Amber Honey Level inside drum window */}
        <path
          d="M 44 68 Q 70 76 96 68 L 96 78 Q 70 86 44 78 Z"
          fill="url(#honey-pool-grad)"
          opacity="0.85"
        />

        {/* Top Rim & Inside Drum Opening */}
        <ellipse cx="70" cy="50" rx="36" ry="16" fill="#E2E8F0" stroke="#475569" strokeWidth="1.2" />
        <ellipse cx="70" cy="50" rx="32" ry="13" fill="#1E293B" />
        <ellipse cx="70" cy="52" rx="30" ry="11" fill="url(#honey-pool-grad)" opacity="0.9" />

        {/* Central Spinning Rotor Axle & Frames */}
        <g className={isWorking ? 'animate-spin origin-center' : ''} style={{ transformOrigin: '70px 50px' }}>
          <ellipse cx="70" cy="50" rx="4" ry="2" fill="#F8FAFC" />
          <line x1="45" y1="50" x2="95" y2="50" stroke="#F8FAFC" strokeWidth="1.5" />
          <line x1="70" y1="40" x2="70" y2="60" stroke="#F8FAFC" strokeWidth="1.5" />

          {/* Honey Frames inside */}
          <rect x="52" y="44" width="12" height="12" rx="1" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
          <rect x="76" y="44" width="12" height="12" rx="1" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
        </g>

        {/* Top Hand Crank & Gear Lever */}
        <path d="M 70 50 L 70 30 L 85 24" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="85" cy="24" r="3.5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.8" />

        {/* Front Honey Tap / Valve Spout */}
        <rect x="66" y="82" width="8" height="6" rx="1" fill="#D97706" stroke="#92400E" strokeWidth="0.6" />
        <path d="M 70 88 L 70 96" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Honey Jar Collecting Golden Honey */}
        <g transform="translate(62, 98)">
          <rect x="0" y="0" width="16" height="20" rx="3" fill="#FEF08A" stroke="#B45309" strokeWidth="1" opacity="0.9" />
          <rect x="2" y="4" width="12" height="14" rx="2" fill="url(#honey-pool-grad)" />
          {/* Jar Lid */}
          <rect x="-1" y="-3" width="18" height="3" rx="1" fill="#78350F" />
          {/* Honey Honeycomb Label */}
          <circle cx="8" cy="11" r="3" fill="#FFFFFF" opacity="0.9" />
          <text x="8" y="13" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#B45309">🍯</text>
        </g>
      </svg>
    </div>
  );
};
