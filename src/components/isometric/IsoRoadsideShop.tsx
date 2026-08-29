import React from 'react';

export const IsoRoadsideShop: React.FC<{ isSelected?: boolean }> = ({ isSelected }) => {
  return (
    <div className="relative w-44 h-40 flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 200 180"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* 3D Wood Counter Gradients */}
          <linearGradient id="shop-wood-l-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE0B2" />
            <stop offset="40%" stopColor="#FFB74D" />
            <stop offset="100%" stopColor="#FB8C00" />
          </linearGradient>
          <linearGradient id="shop-wood-r-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA726" />
            <stop offset="50%" stopColor="#FB8C00" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          {/* 3D Striped Awning Red Gradient */}
          <linearGradient id="shop-stripe-red-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="40%" stopColor="#FF1744" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="100" cy="152" rx="76" ry="26" fill="rgba(0,0,0,0.32)" />

        {/* Counter Base Wooden Table */}
        <polygon points="100,146 42,116 42,128 100,158" fill="#FB8C00" stroke="#E65100" strokeWidth="1.5" />
        <polygon points="100,146 158,116 158,128 100,158" fill="#E65100" stroke="#BF360C" strokeWidth="1.5" />

        {/* Main Counter Structure */}
        <polygon points="100,88 46,114 46,128 100,154" fill="url(#shop-wood-l-3d)" stroke="#E65100" strokeWidth="1.5" />
        <polygon points="100,88 154,114 154,128 100,154" fill="url(#shop-wood-r-3d)" stroke="#BF360C" strokeWidth="1.5" />

        {/* Chunky Wooden Awning Pillars */}
        <rect x="48" y="56" width="5.5" height="64" rx="2" fill="#FFA726" stroke="#E65100" strokeWidth="1.2" />
        <rect x="97" y="68" width="5.5" height="64" rx="2" fill="#FFB74D" stroke="#E65100" strokeWidth="1.2" />
        <rect x="146" y="56" width="5.5" height="64" rx="2" fill="#FB8C00" stroke="#E65100" strokeWidth="1.2" />

        {/* Shelves & Crates Filled with 3D Glossy Produce */}
        {/* Left Crate (Shiny Red Apples) */}
        <polygon points="54,112 76,101 82,106 60,117" fill="#FFE082" stroke="#FFA000" strokeWidth="1" />
        <polygon points="54,112 60,117 60,127 54,122" fill="#FFB300" stroke="#E65100" strokeWidth="1" />
        <polygon points="60,117 82,106 82,116 60,127" fill="#FFA000" stroke="#E65100" strokeWidth="1" />
        {/* 3D Apples */}
        <circle cx="66" cy="110" r="3.8" fill="#FF1744" stroke="#B71C1C" strokeWidth="0.6" />
        <circle cx="65" cy="109" r="1" fill="#FFFFFF" />
        <circle cx="73" cy="106" r="3.8" fill="#FF1744" stroke="#B71C1C" strokeWidth="0.6" />
        <circle cx="72" cy="105" r="1" fill="#FFFFFF" />
        <circle cx="78" cy="104" r="3.5" fill="#D50000" stroke="#B71C1C" strokeWidth="0.6" />

        {/* Center Crate (Plump Orange Carrots) */}
        <polygon points="86,122 108,111 114,116 92,127" fill="#FFE082" stroke="#FFA000" strokeWidth="1" />
        <polygon points="86,122 92,127 92,137 86,132" fill="#FFB300" stroke="#E65100" strokeWidth="1" />
        <polygon points="92,127 114,116 114,126 92,137" fill="#FFA000" stroke="#E65100" strokeWidth="1" />
        {/* 3D Carrots */}
        <ellipse cx="98" cy="120" rx="2.5" ry="6" fill="#FF6D00" stroke="#D84315" strokeWidth="0.6" transform="rotate(30 98 120)" />
        <ellipse cx="104" cy="116" rx="2.5" ry="6" fill="#FF9100" stroke="#D84315" strokeWidth="0.6" transform="rotate(30 104 116)" />
        <ellipse cx="109" cy="113" rx="2.5" ry="6" fill="#FF6D00" stroke="#D84315" strokeWidth="0.6" transform="rotate(30 109 113)" />

        {/* Right Crate (Golden Loaves of Bread) */}
        <polygon points="116,112 138,101 144,106 122,117" fill="#FFE082" stroke="#FFA000" strokeWidth="1" />
        <polygon points="116,112 122,117 122,127 116,122" fill="#FFB300" stroke="#E65100" strokeWidth="1" />
        <polygon points="122,117 144,106 144,116 122,127" fill="#FFA000" stroke="#E65100" strokeWidth="1" />
        <ellipse cx="128" cy="110" rx="5" ry="3.2" fill="#FFA000" stroke="#E65100" strokeWidth="0.8" />
        <ellipse cx="136" cy="105" rx="5" ry="3.2" fill="#FFB300" stroke="#E65100" strokeWidth="0.8" />

        {/* 3D Striped Market Stall Awning Canopy */}
        {/* Left Side */}
        <polygon points="42,46 100,18 100,54 42,82" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="1" />
        <polygon points="46,44 58,38 58,74 46,80" fill="url(#shop-stripe-red-3d)" />
        <polygon points="70,33 82,27 82,63 70,69" fill="url(#shop-stripe-red-3d)" />
        <polygon points="92,22 100,18 100,54 92,58" fill="url(#shop-stripe-red-3d)" />

        {/* Right Side */}
        <polygon points="100,18 158,46 158,82 100,54" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="1" />
        <polygon points="100,18 110,23 110,59 100,54" fill="url(#shop-stripe-red-3d)" />
        <polygon points="122,29 134,35 134,71 122,65" fill="url(#shop-stripe-red-3d)" />
        <polygon points="144,40 156,45 156,81 144,76" fill="url(#shop-stripe-red-3d)" />

        {/* Scalloped Red Awning Trim with White Piping */}
        <path
          d="M 42 82 Q 48 87 54 82 Q 60 87 66 82 Q 72 87 78 82 Q 84 87 90 82 Q 95 87 100 82 Q 106 87 112 82 Q 118 87 124 82 Q 130 87 136 82 Q 142 87 148 82 Q 153 87 158 82"
          fill="none"
          stroke="#C62828"
          strokeWidth="3.5"
        />

        {/* Chalkboard Price Menu */}
        <polygon points="34,90 47,83 47,109 34,116" fill="#263238" stroke="#FFA726" strokeWidth="1.5" />
        <line x1="37" y1="94" x2="44" y2="90" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="37" y1="100" x2="44" y2="96" stroke="#FFEE58" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="37" y1="106" x2="44" y2="102" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Market Sign */}
        <rect x="68" y="12" width="64" height="16" rx="4" fill="#FFA000" stroke="#FF6F00" strokeWidth="1.5" />
        <text x="100" y="24" fontSize="8.5" fontWeight="black" textAnchor="middle" fill="#FFFFFF">
          BANCA 🏪
        </text>

        {/* Natural Lawn Grass Tufts around Shop Base */}
        <g id="shop-ground-grass-tufts" className="pointer-events-none">
          <path d="M 38 124 Q 33 116 30 118 Q 34 125 39 127" fill="#7CB342" />
          <path d="M 40 126 Q 37 114 34 116 Q 39 125 42 128" fill="#8BC34A" />
          <circle cx="33" cy="115" r="2.2" fill="#FFFFFF" />

          <path d="M 98 156 Q 94 146 91 148 Q 96 156 99 158" fill="#7CB342" />
          <path d="M 102 157 Q 104 144 108 146 Q 104 156 101 158" fill="#8BC34A" />

          <path d="M 154 124 Q 159 116 162 118 Q 157 126 152 128" fill="#7CB342" />
          <circle cx="160" cy="115" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
