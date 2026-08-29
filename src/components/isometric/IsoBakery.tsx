import React from 'react';

export const IsoBakery: React.FC<{ isWorking?: boolean }> = ({ isWorking }) => {
  return (
    <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 210 190"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* 3D Stone Oven Wall Gradients */}
          <linearGradient id="hd-bakery-stone-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="40%" stopColor="#EFEBE9" />
            <stop offset="80%" stopColor="#D7CCC8" />
            <stop offset="100%" stopColor="#BCAAA4" />
          </linearGradient>
          <linearGradient id="hd-bakery-stone-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BCAAA4" />
            <stop offset="50%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>

          {/* 3D Blazing Fire Hearth Glow */}
          <radialGradient id="hd-fire-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="30%" stopColor="#FFEE58" />
            <stop offset="70%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#D50000" />
          </radialGradient>

          {/* 3D Striped Awning Red */}
          <linearGradient id="hd-bakery-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="40%" stopColor="#FF1744" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>

          {/* Golden Wood Grain */}
          <linearGradient id="hd-bakery-wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="105" cy="158" rx="84" ry="28" fill="rgba(0,0,0,0.32)" />

        {/* 1. Cobblestone Foundation Platform */}
        <polygon points="105,150 44,120 44,134 105,164" fill="#8D6E63" stroke="#5D4037" strokeWidth="1.2" />
        <polygon points="105,150 166,120 166,134 105,164" fill="#5D4037" stroke="#3E2723" strokeWidth="1.2" />

        {/* 2. Main Stone Oven Body */}
        <polygon points="105,74 44,104 44,128 105,156" fill="url(#hd-bakery-stone-l)" stroke="#8D6E63" strokeWidth="1.2" />
        <polygon points="105,74 166,104 166,128 105,156" fill="url(#hd-bakery-stone-r)" stroke="#5D4037" strokeWidth="1.2" />

        {/* Rounded Masonry Cobblestones Details */}
        <path
          d="M 52 112 Q 78 99 105 84 M 50 120 Q 77 107 105 92 M 54 126 Q 79 114 105 100"
          stroke="#A1887F"
          strokeWidth="1.5"
          fill="none"
        />

        {/* 3. 3D Chimney on Back Right with Smoke */}
        <polygon points="132,40 146,33 146,74 132,81" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />
        <polygon points="146,33 160,39 160,80 146,74" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        <polygon points="132,40 144,34 160,39 146,45" fill="#EFEBE9" stroke="#8D6E63" strokeWidth="1" />
        <rect x="129" y="31" width="34" height="4.5" rx="2" fill="#FFE082" stroke="#FFA000" strokeWidth="1" />

        {/* Animated 3D Chimney Smoke Puffs */}
        {isWorking ? (
          <g className="animate-bounce" style={{ animationDuration: '2s' }}>
            <circle cx="146" cy="20" r="5.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="152" cy="9" r="7.5" fill="#FFFFFF" opacity="0.75" />
            <circle cx="158" cy="-2" r="9.5" fill="#FFFFFF" opacity="0.5" />
          </g>
        ) : (
          <circle cx="146" cy="22" r="4" fill="#FFFFFF" opacity="0.4" />
        )}

        {/* 4. Arched Stone Oven Hearth Chamber with Glowing Embers */}
        <path
          d="M 60 138 C 60 102 98 102 98 118 L 98 146 L 60 150 Z"
          fill="#271610"
          stroke="#5D4037"
          strokeWidth="2.5"
        />
        {/* Fire Hearth Arch Rounded Keystones */}
        <path
          d="M 58 138 C 58 98 100 98 100 118"
          stroke="#FFE082"
          strokeWidth="3.5"
          strokeDasharray="6,3"
          fill="none"
        />
        {/* Glowing Fire Hearth Inside */}
        <ellipse cx="79" cy="132" rx="15" ry="9" fill="url(#hd-fire-glow)" className={isWorking ? 'animate-pulse' : ''} />

        {/* Baker's Peel (Pá de Madeira) with Golden Loaf */}
        <ellipse cx="79" cy="130" rx="7.5" ry="4.5" fill="#FFA000" stroke="#FF6F00" strokeWidth="1" />
        <line x1="77" y1="130" x2="108" y2="142" stroke="#FFE082" strokeWidth="2.5" strokeLinecap="round" />

        {/* 5. Baker's Prep Counter / Workbench on Right */}
        <polygon points="112,120 162,97 172,105 122,128" fill="url(#hd-bakery-wood)" stroke="#FFA000" strokeWidth="1.2" />
        <polygon points="112,120 122,128 122,146 112,139" fill="#FFB300" stroke="#E65100" strokeWidth="1" />
        <polygon points="122,128 172,105 172,123 122,146" fill="#FFA000" stroke="#E65100" strokeWidth="1" />

        {/* Plump 3D White Flour Sack on Bench */}
        <ellipse cx="126" cy="115" rx="6.5" ry="7.5" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="1" />
        <circle cx="126" cy="108" r="2.2" fill="#FFE082" stroke="#FFA000" strokeWidth="0.8" />

        {/* Golden French Baguettes & Croissants */}
        <ellipse cx="144" cy="108" rx="5.5" ry="3" fill="#FFA000" stroke="#E65100" strokeWidth="0.8" transform="rotate(-15 144 108)" />
        <ellipse cx="155" cy="104" rx="5.5" ry="3" fill="#FFB300" stroke="#E65100" strokeWidth="0.8" transform="rotate(-15 155 104)" />

        {/* 6. Striped Candy Awning over the Counter */}
        <polygon points="106,66 168,39 174,51 112,78" fill="url(#hd-bakery-red)" stroke="#C62828" strokeWidth="1" />
        <polygon points="106,66 120,60 126,72 112,78" fill="#FFFFFF" />
        <polygon points="134,54 148,48 154,60 140,66" fill="#FFFFFF" />

        {/* Scalloped Awning White Ruffle Trim */}
        <path d="M 112 78 Q 122 82 132 74 Q 142 78 152 70 Q 162 74 174 51" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

        {/* Wooden Bakery Sign */}
        <rect x="60" y="64" width="38" height="15" rx="3.5" fill="#6D4C41" stroke="#FFE082" strokeWidth="1.2" />
        <text x="79" y="74.5" fontSize="7.5" fontWeight="900" textAnchor="middle" fill="#FFFFFF">
          PADARIA 🥐
        </text>

        {/* 7. Natural Lawn Grass Tufts around Bakery stone base */}
        <g id="bakery-ground-grass-tufts" className="pointer-events-none">
          <path d="M 42 130 Q 36 122 33 124 Q 38 132 43 134" fill="#7CB342" />
          <path d="M 45 132 Q 41 120 38 122 Q 44 131 47 135" fill="#8BC34A" />
          <circle cx="35" cy="122" r="2.2" fill="#FFFFFF" />
          <circle cx="35" cy="122" r="0.8" fill="#FFD54F" />

          <path d="M 103 160 Q 99 150 96 152 Q 101 160 104 162" fill="#7CB342" />
          <path d="M 107 161 Q 109 148 113 150 Q 109 160 106 162" fill="#8BC34A" />

          <path d="M 164 130 Q 169 122 172 124 Q 167 132 162 134" fill="#7CB342" />
          <path d="M 166 132 Q 172 120 175 123 Q 169 131 165 135" fill="#8BC34A" />
          <circle cx="172" cy="121" r="2.2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
