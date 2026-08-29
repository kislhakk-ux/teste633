import React from 'react';

export const IsoFeedMill: React.FC<{ isWorking?: boolean }> = ({ isWorking }) => {
  return (
    <div className="relative w-44 h-40 flex items-center justify-center filter drop-shadow-[0_12px_14px_rgba(0,0,0,0.35)]">
      <svg
        viewBox="0 0 180 160"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Hay Day Feed Mill Red Drum */}
          <linearGradient id="hd-feed-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="35%" stopColor="#FF1744" />
            <stop offset="70%" stopColor="#D50000" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>

          {/* Yellow Tubular Frame Stand */}
          <linearGradient id="hd-feed-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF59D" />
            <stop offset="40%" stopColor="#FFEB3B" />
            <stop offset="80%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>

          {/* Silver Exhaust Pipe */}
          <linearGradient id="hd-feed-pipe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CFD8DC" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#78909C" />
          </linearGradient>

          {/* Burlap Feed Sacks */}
          <radialGradient id="hd-feed-sack" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#D7CCC8" />
            <stop offset="60%" stopColor="#A1887F" />
            <stop offset="100%" stopColor="#6D4C41" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="90" cy="138" rx="66" ry="20" fill="rgba(0,0,0,0.3)" />

        {/* 1. Wooden Plank Ground Platform */}
        <polygon points="40,126 80,106 106,118 66,138" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.2" />
        <line x1="48" y1="129" x2="88" y2="109" stroke="#4E342E" strokeWidth="1.2" />
        <line x1="56" y1="133" x2="96" y2="113" stroke="#4E342E" strokeWidth="1.2" />

        {/* 2. Bright Yellow Tubular A-Frame Stand Legs */}
        <line x1="72" y1="84" x2="58" y2="124" stroke="url(#hd-feed-yellow)" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="72" y1="84" x2="78" y2="128" stroke="url(#hd-feed-yellow)" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="108" y1="72" x2="98" y2="114" stroke="url(#hd-feed-yellow)" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="108" y1="72" x2="118" y2="116" stroke="url(#hd-feed-yellow)" strokeWidth="4.5" strokeLinecap="round" />
        {/* Horizontal Cross Strut */}
        <line x1="64" y1="110" x2="74" y2="114" stroke="url(#hd-feed-yellow)" strokeWidth="3" />
        <line x1="103" y1="100" x2="114" y2="102" stroke="url(#hd-feed-yellow)" strokeWidth="3" />

        {/* 3. Curved Silver Exhaust Pipe Rising from Back */}
        <g id="feed-pipe">
          <path
            d="M 68 76 L 68 48 Q 68 36 60 36 L 56 36"
            fill="none"
            stroke="url(#hd-feed-pipe)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d="M 68 76 L 68 48 Q 68 36 60 36 L 56 36"
            fill="none"
            stroke="#455A64"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Flared Pipe Opening Collar */}
          <rect x="52" y="32" width="5" height="8" rx="1.5" fill="#B0BEC5" stroke="#37474F" strokeWidth="0.8" />

          {/* Animated Puffy Smoke when Grinding Feed */}
          {isWorking ? (
            <g className="animate-bounce" style={{ animationDuration: '2s' }}>
              <circle cx="48" cy="30" r="3.5" fill="#FFFFFF" opacity="0.85" />
              <circle cx="40" cy="22" r="5" fill="#FFFFFF" opacity="0.7" />
              <circle cx="34" cy="12" r="6.5" fill="#FFFFFF" opacity="0.5" />
            </g>
          ) : (
            <circle cx="48" cy="30" r="2.5" fill="#ECEFF1" opacity="0.4" />
          )}
        </g>

        {/* 4. Horizontal Red Grinding Hopper Drum */}
        {/* Drum Back/Body (Tilted Cylindrical Isometric Shape) */}
        <path
          d="M 66 66 L 108 48 Q 120 54 114 74 L 72 92 Q 60 84 66 66 Z"
          fill="url(#hd-feed-red)"
          stroke="#B71C1C"
          strokeWidth="1.5"
        />

        {/* Drum White Specular Reflection Stripe */}
        <path d="M 68 70 L 108 52" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        {/* Golden Star Badge on Hopper Side */}
        <polygon
          points="88,62 89.5,66 94,66 90.5,69 92,73 88,70.5 84,73 85.5,69 82,66 86.5,66"
          fill="#FFEB3B"
          stroke="#FFA000"
          strokeWidth="0.8"
        />

        {/* Open Front Hopper Tray with Metal Lip */}
        <polygon points="106,48 126,58 116,78 96,68" fill="#37474F" stroke="#212121" strokeWidth="1.2" />
        <polygon points="104,46 128,58 118,80 94,68" fill="none" stroke="#FFA726" strokeWidth="1.5" />

        {/* Golden Corn & Wheat Inside Hopper Mouth */}
        <ellipse cx="111" cy="63" rx="9" ry="6" fill="#FDD835" />
        <circle cx="107" cy="62" r="1.8" fill="#F57F17" />
        <circle cx="112" cy="65" r="1.8" fill="#F57F17" />
        <circle cx="116" cy="61" r="1.8" fill="#E65100" />
        {isWorking && (
          <circle cx="111" cy="63" r="2" fill="#FFF59D" className="animate-ping" />
        )}

        {/* 5. Two Burlap Feed Sacks Stacked at Base with Dark Grain */}
        {/* Left Feed Sack */}
        <g id="feed-sack-left">
          <ellipse cx="50" cy="116" rx="10" ry="12" fill="url(#hd-feed-sack)" stroke="#5D4037" strokeWidth="1" />
          <ellipse cx="50" cy="108" rx="8" ry="4" fill="#3E2723" />
          {/* Dark Feed Pellets inside top */}
          <circle cx="48" cy="108" r="1.6" fill="#212121" />
          <circle cx="52" cy="107" r="1.6" fill="#212121" />
          <circle cx="50" cy="109" r="1.6" fill="#212121" />
          {/* Sack Stitch Patch */}
          <rect x="46" y="116" width="6" height="5" rx="1" fill="#FFE082" stroke="#FFA000" strokeWidth="0.5" />
        </g>

        {/* Right Feed Sack */}
        <g id="feed-sack-right">
          <ellipse cx="130" cy="112" rx="10" ry="12" fill="url(#hd-feed-sack)" stroke="#5D4037" strokeWidth="1" />
          <ellipse cx="130" cy="104" rx="8" ry="4" fill="#3E2723" />
          {/* Dark Feed Pellets */}
          <circle cx="128" cy="104" r="1.6" fill="#212121" />
          <circle cx="132" cy="103" r="1.6" fill="#212121" />
          <circle cx="130" cy="105" r="1.6" fill="#212121" />
          <rect x="126" y="112" width="6" height="5" rx="1" fill="#FFE082" stroke="#FFA000" strokeWidth="0.5" />
        </g>

        {/* Floating Working Indicator Animation */}
        {isWorking && (
          <g className="animate-bounce" style={{ animationDuration: '1.2s' }}>
            <circle cx="112" cy="42" r="5" fill="#4CAF50" stroke="#FFFFFF" strokeWidth="1.2" />
            <text x="112" y="45" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
              ⚙
            </text>
          </g>
        )}

        {/* 6. Natural Lawn Grass Tufts around Feed Mill Timber Base */}
        <g id="feedmill-ground-grass-tufts" className="pointer-events-none">
          <path d="M 38 128 Q 33 120 30 122 Q 34 129 39 131" fill="#7CB342" />
          <path d="M 40 130 Q 37 118 34 120 Q 39 129 42 132" fill="#8BC34A" />
          <circle cx="33" cy="119" r="2.2" fill="#FFFFFF" />

          <path d="M 98 156 Q 94 146 91 148 Q 96 156 99 158" fill="#7CB342" />
          <path d="M 102 157 Q 104 144 108 146 Q 104 156 101 158" fill="#8BC34A" />

          <path d="M 152 126 Q 157 118 160 120 Q 155 128 150 130" fill="#7CB342" />
          <circle cx="158" cy="117" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
