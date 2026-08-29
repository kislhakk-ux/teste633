import React from 'react';

export const IsoSilo: React.FC<{ isSelected?: boolean }> = ({ isSelected }) => {
  return (
    <div className="relative w-40 h-48 flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 160 210"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Hay Day Vibrant Red Silo Cylinder */}
          <linearGradient id="hd-silo-red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D32F2F" />
            <stop offset="25%" stopColor="#FF1744" />
            <stop offset="50%" stopColor="#FF5252" />
            <stop offset="75%" stopColor="#D50000" />
            <stop offset="100%" stopColor="#8A0000" />
          </linearGradient>

          {/* Silo Dark Metal Cap & Hatch */}
          <linearGradient id="hd-silo-cap" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#607D8B" />
            <stop offset="40%" stopColor="#455A64" />
            <stop offset="80%" stopColor="#37474F" />
            <stop offset="100%" stopColor="#212121" />
          </linearGradient>

          {/* Golden Grain Inside Glass Slit */}
          <linearGradient id="hd-silo-grain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFEE58" />
            <stop offset="60%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF9800" />
          </linearGradient>

          {/* Silver Chrome Support Legs & Spout */}
          <linearGradient id="hd-silo-chrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CFD8DC" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#90A4AE" />
          </linearGradient>

          {/* Concrete Base */}
          <linearGradient id="hd-silo-base" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#90A4AE" />
            <stop offset="50%" stopColor="#ECEFF1" />
            <stop offset="100%" stopColor="#607D8B" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="188" rx="56" ry="18" fill="rgba(0,0,0,0.32)" />

        {/* 1. Concrete Octagonal Base Ring */}
        <path
          d="M 44 168 Q 80 186 116 168 L 116 182 Q 80 200 44 182 Z"
          fill="url(#hd-silo-base)"
          stroke="#455A64"
          strokeWidth="1.5"
        />

        {/* Steel Leg Supports on Base */}
        <rect x="48" y="160" width="6" height="22" rx="2" fill="url(#hd-silo-chrome)" stroke="#37474F" strokeWidth="1" />
        <rect x="77" y="166" width="6" height="22" rx="2" fill="url(#hd-silo-chrome)" stroke="#37474F" strokeWidth="1" />
        <rect x="106" y="160" width="6" height="22" rx="2" fill="url(#hd-silo-chrome)" stroke="#37474F" strokeWidth="1" />

        {/* 2. Main Red Cylindrical Silo Tower */}
        <path
          d="M 46 68 Q 80 84 114 68 L 114 162 Q 80 178 46 162 Z"
          fill="url(#hd-silo-red)"
          stroke="#5C0000"
          strokeWidth="1.8"
        />

        {/* White Horizontal Structural Hoops / Bands */}
        <path d="M 46 95 Q 80 110 114 95" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.95" />
        <path d="M 46 128 Q 80 143 114 128" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.95" />

        {/* White Vertical Trims running down the sides */}
        <line x1="56" y1="73" x2="56" y2="167" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />
        <line x1="104" y1="73" x2="104" y2="167" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />

        {/* Central Vertical Level Window Frame (White Rectangle) */}
        <rect x="71" y="80" width="18" height="74" rx="4" fill="#FFFFFF" stroke="#B71C1C" strokeWidth="1.5" />
        {/* Dark Window Inset */}
        <rect x="74" y="84" width="12" height="66" rx="2" fill="#212121" />

        {/* Golden Grain Level Fill inside Window */}
        <rect x="75" y="108" width="10" height="40" rx="1.5" fill="url(#hd-silo-grain)" />
        {/* Golden Grain Texture and kernels */}
        <circle cx="80" cy="112" r="1.8" fill="#FFF59D" />
        <circle cx="78" cy="120" r="1.8" fill="#FFA000" />
        <circle cx="82" cy="128" r="1.8" fill="#FFF59D" />
        <circle cx="79" cy="136" r="1.8" fill="#FFA000" />
        <circle cx="81" cy="144" r="1.8" fill="#FFF59D" />
        {/* Glass Specular Streak */}
        <line x1="76" y1="86" x2="76" y2="148" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />

        {/* Silo Specular Body Reflection Streak */}
        <path d="M 64 74 L 64 168" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />

        {/* 3. Left Side Metal Grain Spout Pipe */}
        <g id="silo-spout">
          {/* Elbow Pipe coming out from Silo */}
          <path
            d="M 52 78 L 36 82 L 36 94"
            fill="none"
            stroke="url(#hd-silo-chrome)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 52 78 L 36 82 L 36 94"
            fill="none"
            stroke="#37474F"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Spout Funnel Nozzle */}
          <polygon points="32,94 40,94 43,102 29,102" fill="#455A64" stroke="#263238" strokeWidth="1" />
        </g>

        {/* 4. Top Dark Metal Beveled Cap / Roof */}
        <path
          d="M 44 68 Q 80 84 116 68 L 94 40 Q 80 44 66 40 Z"
          fill="url(#hd-silo-cap)"
          stroke="#212121"
          strokeWidth="1.5"
        />
        {/* Roof Flat Top Rim */}
        <ellipse cx="80" cy="42" rx="18" ry="7" fill="#455A64" stroke="#212121" strokeWidth="1.2" />

        {/* Roof Open Inspection Hatch Lid propped with Silver Handle */}
        <g id="silo-hatch">
          <polygon points="72,36 92,34 94,44 74,46" fill="#78909C" stroke="#263238" strokeWidth="1" />
          <polygon points="74,33 94,31 96,37 76,39" fill="#B0BEC5" stroke="#FFFFFF" strokeWidth="0.8" />
          {/* Silver Hatch Handle */}
          <line x1="82" y1="33" x2="88" y2="32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Roof Specular Rim Highlight */}
        <path d="M 46 66 Q 80 82 114 66" fill="none" stroke="#90A4AE" strokeWidth="1.5" opacity="0.7" />

        {/* 5. Natural Lawn Grass Tufts around Silo Concrete Base */}
        <g id="silo-ground-grass-tufts" className="pointer-events-none">
          <path d="M 38 182 Q 33 174 30 176 Q 34 183 39 185" fill="#7CB342" />
          <path d="M 40 184 Q 37 172 34 174 Q 39 183 42 186" fill="#8BC34A" />
          <circle cx="33" cy="173" r="2.2" fill="#FFFFFF" />
          <circle cx="33" cy="173" r="0.8" fill="#FFD54F" />

          <path d="M 78 198 Q 74 188 71 190 Q 76 198 79 200" fill="#7CB342" />
          <path d="M 82 199 Q 84 186 88 188 Q 84 198 81 200" fill="#8BC34A" />

          <path d="M 118 182 Q 123 174 126 176 Q 121 183 117 185" fill="#7CB342" />
          <circle cx="125" cy="173" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
