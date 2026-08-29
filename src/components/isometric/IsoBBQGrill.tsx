import React from 'react';

export const IsoBBQGrill: React.FC<{ isWorking?: boolean }> = ({ isWorking }) => {
  return (
    <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 210 190"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Brick Pit Gradients */}
          <linearGradient id="hd-bbq-brick-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7043" />
            <stop offset="40%" stopColor="#D84315" />
            <stop offset="100%" stopColor="#BF360C" />
          </linearGradient>
          <linearGradient id="hd-bbq-brick-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BF360C" />
            <stop offset="60%" stopColor="#8D2400" />
            <stop offset="100%" stopColor="#5D1000" />
          </linearGradient>

          {/* Cast Iron Metal Hood */}
          <linearGradient id="hd-bbq-iron-hood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#607D8B" />
            <stop offset="40%" stopColor="#455A64" />
            <stop offset="100%" stopColor="#212121" />
          </linearGradient>

          {/* Sizzling Fire Coals */}
          <radialGradient id="hd-bbq-coals" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="30%" stopColor="#FFD54F" />
            <stop offset="65%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#B71C1C" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="105" cy="158" rx="84" ry="28" fill="rgba(0,0,0,0.32)" />

        {/* 1. Stone Foundation */}
        <polygon points="105,150 42,120 42,132 105,164" fill="#616161" stroke="#37474F" strokeWidth="1.2" />
        <polygon points="105,150 168,120 168,132 105,164" fill="#37474F" stroke="#212121" strokeWidth="1.2" />

        {/* 2. Red Brick Masonry Smoker Pit */}
        <polygon points="105,86 46,114 46,132 105,160" fill="url(#hd-bbq-brick-l)" stroke="#BF360C" strokeWidth="1.2" />
        <polygon points="105,86 164,114 164,132 105,160" fill="url(#hd-bbq-brick-r)" stroke="#5D1000" strokeWidth="1.2" />

        {/* Mortar Brick Joint Lines */}
        <line x1="48" y1="122" x2="105" y2="94" stroke="#FFCCBC" strokeWidth="1" opacity="0.6" />
        <line x1="48" y1="128" x2="105" y2="100" stroke="#FFCCBC" strokeWidth="1" opacity="0.6" />
        <line x1="105" y1="94" x2="162" y2="122" stroke="#FFCCBC" strokeWidth="1" opacity="0.4" />
        <line x1="105" y1="100" x2="162" y2="128" stroke="#FFCCBC" strokeWidth="1" opacity="0.4" />

        {/* Firewood Storage Niche in Front Base */}
        <polygon points="68,142 90,131 90,152 68,159" fill="#1C0E07" stroke="#000000" strokeWidth="1.2" />
        {/* Split Firewood Logs */}
        <ellipse cx="76" cy="148" rx="4.5" ry="2.5" fill="#8D6E63" stroke="#4E342E" strokeWidth="0.8" />
        <ellipse cx="84" cy="144" rx="4.5" ry="2.5" fill="#A1887F" stroke="#4E342E" strokeWidth="0.8" />
        <ellipse cx="79" cy="154" rx="4.5" ry="2.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="0.8" />

        {/* 3. Cast-Iron Isometric Grill Grate */}
        <polygon points="105,66 50,92 105,118 160,92" fill="#212121" stroke="#37474F" strokeWidth="2" />
        {/* Glowing Fire Coals underneath */}
        <ellipse cx="105" cy="92" rx="28" ry="13" fill="url(#hd-bbq-coals)" className={isWorking ? 'animate-pulse' : ''} />

        {/* Heavy Iron Grate Bars */}
        <line x1="64" y1="85" x2="119" y2="111" stroke="#455A64" strokeWidth="2.5" />
        <line x1="78" y1="79" x2="133" y2="105" stroke="#455A64" strokeWidth="2.5" />
        <line x1="92" y1="73" x2="147" y2="99" stroke="#455A64" strokeWidth="2.5" />

        <line x1="92" y1="111" x2="147" y2="85" stroke="#263238" strokeWidth="2.5" />
        <line x1="78" y1="105" x2="133" y2="79" stroke="#263238" strokeWidth="2.5" />
        <line x1="64" y1="99" x2="119" y2="73" stroke="#263238" strokeWidth="2.5" />

        {/* 4. Sizzling Steaks, Sausages & Skewers on Grill */}
        <ellipse cx="90" cy="91" rx="7" ry="4" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
        <line x1="86" y1="91" x2="94" y2="91" stroke="#212121" strokeWidth="1.5" />

        <ellipse cx="120" cy="91" rx="7" ry="4" fill="#FFA000" stroke="#E65100" strokeWidth="1" />

        {/* Sizzling Bacon Strips */}
        <path d="M 98 100 Q 105 96 112 101" stroke="#E53935" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 99 103 Q 106 99 113 104" stroke="#FFCDD2" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* 5. Smoker Exhaust Hood & Tall Chimney */}
        <polygon points="94,36 116,25 116,66 94,77" fill="url(#hd-bbq-iron-hood)" stroke="#212121" strokeWidth="1.2" />
        <polygon points="116,25 128,31 128,72 116,66" fill="#212121" stroke="#000000" strokeWidth="1.2" />
        <polygon points="94,36 106,30 128,41 116,47" fill="#78909C" stroke="#212121" strokeWidth="1" />
        <rect x="92" y="23" width="28" height="4.5" rx="2" fill="#455A64" stroke="#212121" strokeWidth="1" />

        {/* Animated BBQ Smoke & Sizzle Sparks */}
        {isWorking ? (
          <g>
            <circle cx="106" cy="14" r="5" fill="#CFD8DC" opacity="0.85" className="animate-pulse" />
            <circle cx="112" cy="3" r="7" fill="#B0BEC5" opacity="0.65" className="animate-bounce" />
            <circle cx="118" cy="-8" r="9" fill="#90A4AE" opacity="0.4" />
            <circle cx="98" cy="85" r="2" fill="#FFEB3B" className="animate-ping" />
            <circle cx="112" cy="88" r="2" fill="#FF9800" className="animate-ping" />
          </g>
        ) : (
          <circle cx="106" cy="16" r="3.5" fill="#B0BEC5" opacity="0.4" />
        )}

        {/* Side Shelf with BBQ Sauce Bottle & Spatula */}
        <polygon points="152,98 168,90 168,95 152,103" fill="#78909C" stroke="#37474F" strokeWidth="1" />
        {/* BBQ Sauce Bottle */}
        <rect x="156" y="85" width="4" height="7" rx="1" fill="#C62828" stroke="#7F0000" strokeWidth="0.6" />
        <circle cx="158" cy="84" r="1.2" fill="#FFD54F" />

        {/* BBQ Sign */}
        <polygon points="98,60 112,53 112,67 98,74" fill="#FFCCBC" stroke="#D84315" strokeWidth="1.2" />
        <text x="105" y="66.5" fontSize="7.5" fontWeight="black" textAnchor="middle" fill="#BF360C">
          🥩
        </text>

        {/* 6. Natural Lawn Grass Tufts around BBQ Stone Foundation */}
        <g id="bbq-ground-grass-tufts" className="pointer-events-none">
          <path d="M 38 132 Q 33 124 30 126 Q 34 133 39 135" fill="#7CB342" />
          <path d="M 40 134 Q 37 122 34 124 Q 39 133 42 136" fill="#8BC34A" />
          <circle cx="33" cy="123" r="2.2" fill="#FFFFFF" />

          <path d="M 103 164 Q 99 154 96 156 Q 101 164 104 166" fill="#7CB342" />
          <path d="M 107 165 Q 109 152 113 154 Q 109 164 106 166" fill="#8BC34A" />

          <path d="M 166 132 Q 171 124 174 126 Q 169 134 164 136" fill="#7CB342" />
          <circle cx="173" cy="123" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
