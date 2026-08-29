import React from 'react';

export const IsoOrderBoard: React.FC<{ hasOrders?: boolean }> = ({ hasOrders = true }) => {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)]">
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* 3D Wood Post Gradient */}
          <linearGradient id="ob-wood-3d" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE0B2" />
            <stop offset="35%" stopColor="#FFA726" />
            <stop offset="70%" stopColor="#FB8C00" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          {/* 3D Corkboard Gradient */}
          <linearGradient id="ob-cork-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="40%" stopColor="#FFE082" />
            <stop offset="80%" stopColor="#FFCA28" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>

          {/* 3D Roof Shingles */}
          <linearGradient id="ob-roof-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="50%" stopColor="#6D4C41" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="144" rx="50" ry="16" fill="rgba(0,0,0,0.28)" />

        {/* 3D Chunky Wooden Support Posts */}
        <rect x="40" y="68" width="9" height="74" rx="3" fill="url(#ob-wood-3d)" stroke="#E65100" strokeWidth="1.2" />
        <rect x="111" y="68" width="9" height="74" rx="3" fill="url(#ob-wood-3d)" stroke="#E65100" strokeWidth="1.2" />

        {/* Cross Wood Support Beams */}
        <line x1="42" y1="110" x2="118" y2="110" stroke="#FB8C00" strokeWidth="4" strokeLinecap="round" />
        <line x1="42" y1="126" x2="118" y2="126" stroke="#FB8C00" strokeWidth="4" strokeLinecap="round" />

        {/* Main Board Frame */}
        <rect x="24" y="36" width="112" height="74" rx="6" fill="#8D6E63" stroke="#4E342E" strokeWidth="2.5" />
        {/* Cork Surface with Beveled Inset */}
        <rect x="30" y="42" width="100" height="62" rx="3" fill="url(#ob-cork-3d)" stroke="#FFA000" strokeWidth="1.5" />

        {/* 3D Glossy Order Notes Pinned to Board */}
        {/* Order 1 (Yellow note with bright red pushpin) */}
        <g className="hover:scale-105 transition-transform">
          <polygon points="36,46 60,44 61,68 37,70" fill="#FFFDE7" stroke="#FDD835" strokeWidth="1" />
          <circle cx="48" cy="56" r="3.8" fill="#43A047" />
          <circle cx="48" cy="46" r="2.8" fill="#FF1744" stroke="#B71C1C" strokeWidth="0.8" />
          <circle cx="47.5" cy="45" r="0.8" fill="#FFFFFF" />
        </g>

        {/* Order 2 (White note with gold star and blue pin) */}
        <g>
          <polygon points="68,46 94,48 92,72 66,70" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
          {/* Gold Star */}
          <circle cx="80" cy="58" r="5.5" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />
          <text x="80" y="61.5" fontSize="7" fontWeight="black" textAnchor="middle" fill="#E65100">
            ★
          </text>
          {/* Blue Pushpin */}
          <circle cx="80" cy="47" r="2.8" fill="#00B0FF" stroke="#0091EA" strokeWidth="0.8" />
          <circle cx="79.5" cy="46" r="0.8" fill="#FFFFFF" />
        </g>

        {/* Order 3 (Pink note with green pin) */}
        <g>
          <polygon points="102,48 126,46 128,70 104,72" fill="#FCE4EC" stroke="#F48FB1" strokeWidth="1" />
          <circle cx="115" cy="58" r="4" fill="#FF4081" />
          <circle cx="115" cy="47" r="2.8" fill="#00E676" stroke="#00C853" strokeWidth="0.8" />
        </g>

        {/* Order 4 (Green note) */}
        <g>
          <polygon points="40,75 64,73 66,97 42,99" fill="#E8F5E9" stroke="#81C784" strokeWidth="1" />
          <circle cx="53" cy="85" r="3.8" fill="#00C853" />
          <circle cx="53" cy="75" r="2.8" fill="#FF9100" stroke="#FF6D00" strokeWidth="0.8" />
        </g>

        {/* Order 5 (Orange note) */}
        <g>
          <polygon points="98,74 122,76 120,100 96,98" fill="#FFF3E0" stroke="#FFB74D" strokeWidth="1" />
          <circle cx="109" cy="86" r="4" fill="#FF6D00" />
          <circle cx="109" cy="75" r="2.8" fill="#E040FB" stroke="#AA00FF" strokeWidth="0.8" />
        </g>

        {/* 3D Shingled Roof Canopy on Top */}
        <polygon points="80,12 8,36 152,36" fill="url(#ob-roof-3d)" stroke="#3E2723" strokeWidth="2" />
        <polygon points="8,36 80,12 80,17 12,41" fill="#A1887F" />
        <polygon points="80,12 152,36 148,41 80,17" fill="#6D4C41" />

        {/* Top Header Sign */}
        <rect x="52" y="18" width="56" height="15" rx="3.5" fill="#FFE082" stroke="#FFA000" strokeWidth="1.2" />
        <text x="80" y="29" fontSize="7.5" fontWeight="black" textAnchor="middle" fill="#E65100">
          PEDIDOS 📋
        </text>

        {/* Natural Lawn Grass Tufts around Post Bases */}
        <g id="orderboard-ground-grass-tufts" className="pointer-events-none">
          {/* Left post base grass */}
          <path d="M 38 144 Q 33 136 30 138 Q 34 145 39 147" fill="#7CB342" />
          <path d="M 46 145 Q 49 135 52 137 Q 48 145 45 147" fill="#8BC34A" />
          <circle cx="33" cy="135" r="2.2" fill="#FFFFFF" />

          {/* Right post base grass */}
          <path d="M 109 144 Q 105 136 102 138 Q 106 145 110 147" fill="#7CB342" />
          <path d="M 118 145 Q 122 135 125 137 Q 120 145 117 147" fill="#8BC34A" />
          <circle cx="124" cy="134" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
