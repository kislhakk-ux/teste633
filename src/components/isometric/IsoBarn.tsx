import React from 'react';

export const IsoBarn: React.FC<{ isSelected?: boolean }> = ({ isSelected }) => {
  return (
    <div className="relative w-48 h-44 flex items-center justify-center pointer-events-none select-none">
      <svg
        viewBox="0 0 210 190"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* 3D Barn Red Planks - Sunlit Left */}
          <linearGradient id="hd-barn-red-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="35%" stopColor="#FF1744" />
            <stop offset="75%" stopColor="#D50000" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>
          {/* 3D Barn Red Planks - Shaded Right */}
          <linearGradient id="hd-barn-red-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D50000" />
            <stop offset="50%" stopColor="#C62828" />
            <stop offset="100%" stopColor="#7F0000" />
          </linearGradient>

          {/* Gambrel Metal Roof - Sunlit Upper Slope */}
          <linearGradient id="hd-barn-roof-top-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B0BEC5" />
            <stop offset="40%" stopColor="#90A4AE" />
            <stop offset="80%" stopColor="#78909C" />
            <stop offset="100%" stopColor="#546E7A" />
          </linearGradient>
          <linearGradient id="hd-barn-roof-top-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#607D8B" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>

          {/* Gambrel Metal Roof - Steep Lower Slope */}
          <linearGradient id="hd-barn-roof-side-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78909C" />
            <stop offset="50%" stopColor="#546E7A" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>
          <linearGradient id="hd-barn-roof-side-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#455A64" />
            <stop offset="100%" stopColor="#212121" />
          </linearGradient>

          {/* Golden Straw Gradient */}
          <linearGradient id="hd-straw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="40%" stopColor="#FFEE58" />
            <stop offset="80%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#F57F17" />
          </linearGradient>
        </defs>

        {/* Main Red Barn Walls - flush on ground */}
        <polygon points="105,86 40,118 40,132 105,164" fill="url(#hd-barn-red-l)" stroke="#B71C1C" strokeWidth="1.2" />
        <polygon points="105,86 168,118 168,132 105,164" fill="url(#hd-barn-red-r)" stroke="#7F0000" strokeWidth="1.2" />

        {/* Vertical Red Planks Grooves */}
        <line x1="52" y1="124" x2="52" y2="114" stroke="#B71C1C" strokeWidth="1.5" />
        <line x1="68" y1="132" x2="68" y2="106" stroke="#B71C1C" strokeWidth="1.5" />
        <line x1="84" y1="140" x2="84" y2="98" stroke="#B71C1C" strokeWidth="1.5" />
        <line x1="126" y1="98" x2="126" y2="140" stroke="#5C0000" strokeWidth="1.5" />
        <line x1="142" y1="106" x2="142" y2="132" stroke="#5C0000" strokeWidth="1.5" />
        <line x1="156" y1="114" x2="156" y2="124" stroke="#5C0000" strokeWidth="1.5" />

        {/* Gambrel Gable End Walls */}
        <polygon points="40,118 46,78 76,46 105,60 105,86" fill="url(#hd-barn-red-l)" stroke="#B71C1C" strokeWidth="1.2" />
        <polygon points="105,86 105,60 134,46 162,78 168,118" fill="url(#hd-barn-red-r)" stroke="#7F0000" strokeWidth="1.2" />

        {/* 3. Double Sliding Barn Doors with Iconic White 'X' Bracing */}
        {/* Wooden Entrance Ramp leading up */}
        <polygon points="56,134 98,113 104,122 62,144" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.2" />
        <polygon points="62,144 104,122 104,128 62,150" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />

        {/* Dark Door Cavity */}
        <polygon points="58,128 96,109 96,152 58,172" fill="#21100B" stroke="#000000" strokeWidth="1.2" />

        {/* Left White-Trimmed Door Panel */}
        <polygon points="60,130 76,122 76,162 60,170" fill="#D32F2F" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="60" y1="130" x2="76" y2="162" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="60" y1="170" x2="76" y2="122" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Right White-Trimmed Door Panel */}
        <polygon points="78,121 94,113 94,153 78,161" fill="#C62828" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="78" y1="121" x2="94" y2="153" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="78" y1="161" x2="94" y2="113" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Metal Overhead Sliding Track */}
        <line x1="56" y1="126" x2="98" y2="105" stroke="#CFD8DC" strokeWidth="3" strokeLinecap="round" />
        <circle cx="68" cy="120" r="1.8" fill="#37474F" />
        <circle cx="86" cy="111" r="1.8" fill="#37474F" />

        {/* 4. Upper Hayloft Opening with Spilling Golden Hay & Pulley Crane */}
        <polygon points="62,94 78,86 78,108 62,116" fill="#1C0E07" stroke="#FFFFFF" strokeWidth="2" />
        {/* Golden Volumetric Straw Puff */}
        <path
          d="M 58 114 Q 70 128 82 106 Q 76 100 60 106 Z"
          fill="url(#hd-straw)"
          stroke="#F57F17"
          strokeWidth="1.2"
        />
        <line x1="62" y1="110" x2="72" y2="122" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="66" y1="108" x2="78" y2="118" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Wooden Crane Beam with Rope & Hook */}
        <line x1="70" y1="74" x2="70" y2="86" stroke="#5D4037" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="70" cy="86" r="2.5" fill="#FFA000" stroke="#E65100" strokeWidth="0.8" />
        <line x1="70" y1="86" x2="70" y2="98" stroke="#FFE0B2" strokeWidth="1.5" />
        {/* Steel Hook */}
        <path d="M 68 98 Q 70 102 72 98 Q 74 96 72 95" stroke="#90A4AE" strokeWidth="1.5" fill="none" />

        {/* 5. Gambrel Roof 4-Facet Construction */}
        {/* Left Steep Slope */}
        <polygon points="46,74 36,116 98,85 105,54" fill="url(#hd-barn-roof-side-l)" stroke="#263238" strokeWidth="1.2" />
        <line x1="40" y1="112" x2="98" y2="83" stroke="#ECEFF1" strokeWidth="1.5" opacity="0.6" />

        {/* Left Top Slope */}
        <polygon points="76,42 46,74 105,54 105,28" fill="url(#hd-barn-roof-top-l)" stroke="#37474F" strokeWidth="1.2" />
        <line x1="50" y1="72" x2="76" y2="42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Right Top Slope */}
        <polygon points="105,28 105,54 162,74 134,42" fill="url(#hd-barn-roof-top-r)" stroke="#212121" strokeWidth="1.2" />

        {/* Right Steep Slope */}
        <polygon points="105,54 98,85 172,116 162,74" fill="url(#hd-barn-roof-side-r)" stroke="#212121" strokeWidth="1.2" />

        {/* White Trim Fascia & Crest */}
        <polygon points="76,42 105,26 134,42 105,30" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
        <polygon points="46,74 76,42 74,40 44,72" fill="#FFFFFF" />
        <polygon points="134,42 162,74 164,72 136,40" fill="#ECEFF1" />

        {/* 6. Ventilator Cupola Tower with Golden Rooster Weathervane */}
        <polygon points="98,28 112,21 112,14 98,21" fill="#FF5252" stroke="#FFFFFF" strokeWidth="1" />
        <polygon points="112,21 120,25 120,18 112,14" fill="#D32F2F" stroke="#FFFFFF" strokeWidth="1" />
        {/* Cupola Roof */}
        <polygon points="96,20 105,8 112,13" fill="#78909C" stroke="#FFFFFF" strokeWidth="0.8" />
        <polygon points="105,8 122,17 112,13" fill="#455A64" stroke="#FFFFFF" strokeWidth="0.8" />

        {/* Golden Rooster Weathervane */}
        <line x1="105" y1="8" x2="105" y2="0" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />
        <polygon points="105,0 99,3 105,5 111,3" fill="#FFD54F" stroke="#E65100" strokeWidth="0.8" />
        <circle cx="105" cy="0" r="2" fill="#FFD54F" />

        {/* 7. Warm Light Window on Right Barn Wall */}
        <polygon points="120,102 136,110 136,126 120,118" fill="#FFEE58" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="128" y1="106" x2="128" y2="122" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="120" y1="110" x2="136" y2="118" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="128" cy="114" r="3.5" fill="#FFF9C4" opacity="0.8" />

        {/* Hanging Lantern on Barn Wall */}
        <g id="barn-wall-lantern">
          <line x1="48" y1="110" x2="48" y2="116" stroke="#3E2723" strokeWidth="1.5" />
          <circle cx="48" cy="119" r="4.5" fill="#FFD54F" opacity="0.4" className="animate-pulse" />
          <polygon points="46,116 50,116 51,121 45,121" fill="#FFEB3B" stroke="#212121" strokeWidth="0.8" />
        </g>

        {/* 8. Natural Lawn Grass Tufts & Clover surrounding the barn base */}
        <g id="barn-ground-grass-tufts" className="pointer-events-none">
          {/* Left corner grass blades */}
          <path d="M 36 128 Q 30 120 27 122 Q 32 130 37 132" fill="#7CB342" />
          <path d="M 39 130 Q 35 118 32 120 Q 38 129 41 133" fill="#8BC34A" />
          <circle cx="30" cy="119" r="2.2" fill="#FFFFFF" />
          <circle cx="30" cy="119" r="0.8" fill="#FFD54F" />

          {/* Front foundation grass tufts */}
          <path d="M 102 160 Q 98 150 95 152 Q 100 160 103 162" fill="#7CB342" />
          <path d="M 106 161 Q 108 148 112 150 Q 108 160 105 162" fill="#8BC34A" />

          {/* Right corner grass blades */}
          <path d="M 170 128 Q 175 120 178 122 Q 173 130 168 132" fill="#7CB342" />
          <path d="M 172 130 Q 178 118 181 121 Q 175 129 171 133" fill="#8BC34A" />
          <circle cx="178" cy="120" r="2.2" fill="#E91E63" />
        </g>
      </svg>
    </div>
  );
};
