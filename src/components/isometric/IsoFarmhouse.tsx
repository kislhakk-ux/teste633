import React from 'react';

export const IsoFarmhouse: React.FC<{ isSelected?: boolean }> = ({ isSelected }) => {
  return (
    <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 210 195"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Farmhouse Warm Wood Siding (Daylight Sunlit Facet) */}
          <linearGradient id="hd-fh-wall-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="40%" stopColor="#FFF8E7" />
            <stop offset="100%" stopColor="#FFE0B2" />
          </linearGradient>
          {/* Farmhouse Shadowed Wall Facet */}
          <linearGradient id="hd-fh-wall-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE0B2" />
            <stop offset="50%" stopColor="#FFCC80" />
            <stop offset="100%" stopColor="#FFA726" />
          </linearGradient>

          {/* Candy Red Shingle Roof - Sunlit Left */}
          <linearGradient id="hd-fh-roof-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="35%" stopColor="#FF1744" />
            <stop offset="75%" stopColor="#D50000" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>
          {/* Candy Red Shingle Roof - Shaded Right */}
          <linearGradient id="hd-fh-roof-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D50000" />
            <stop offset="50%" stopColor="#C62828" />
            <stop offset="100%" stopColor="#7F0000" />
          </linearGradient>

          {/* Golden Wood Porch & Trims */}
          <linearGradient id="hd-fh-wood-trim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="35%" stopColor="#FFE082" />
            <stop offset="70%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FB8C00" />
          </linearGradient>

          {/* Stone Foundation */}
          <linearGradient id="hd-fh-stone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CFD8DC" />
            <stop offset="50%" stopColor="#90A4AE" />
            <stop offset="100%" stopColor="#546E7A" />
          </linearGradient>

          {/* Blue Shutter & Door Accent */}
          <linearGradient id="hd-fh-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#40C4FF" />
            <stop offset="60%" stopColor="#0288D1" />
            <stop offset="100%" stopColor="#01579B" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="105" cy="164" rx="86" ry="26" fill="rgba(0,0,0,0.32)" />

        {/* 1. Cobblestone Foundation */}
        <polygon points="105,152 40,118 40,132 105,166" fill="url(#hd-fh-stone)" stroke="#37474F" strokeWidth="1.2" />
        <polygon points="105,152 170,118 170,132 105,166" fill="#455A64" stroke="#263238" strokeWidth="1.2" />

        {/* Round Cobblestone Reliefs */}
        <ellipse cx="54" cy="128" rx="4" ry="2.5" fill="#ECEFF1" stroke="#37474F" strokeWidth="0.6" />
        <ellipse cx="74" cy="138" rx="4.5" ry="2.8" fill="#ECEFF1" stroke="#37474F" strokeWidth="0.6" />
        <ellipse cx="94" cy="148" rx="4.5" ry="2.8" fill="#ECEFF1" stroke="#37474F" strokeWidth="0.6" />
        <ellipse cx="120" cy="148" rx="4.5" ry="2.8" fill="#ECEFF1" stroke="#37474F" strokeWidth="0.6" />
        <ellipse cx="142" cy="138" rx="4" ry="2.5" fill="#ECEFF1" stroke="#37474F" strokeWidth="0.6" />

        {/* 2. Main 2-Story House Structure */}
        {/* Left Sunlit Wall */}
        <polygon points="105,68 44,98 44,124 105,94" fill="url(#hd-fh-wall-l)" stroke="#BF360C" strokeWidth="1.2" />
        {/* Horizontal Wood Siding Grooves */}
        <line x1="44" y1="104" x2="105" y2="74" stroke="#FFE082" strokeWidth="1.2" />
        <line x1="44" y1="110" x2="105" y2="80" stroke="#FFE082" strokeWidth="1.2" />
        <line x1="44" y1="116" x2="105" y2="86" stroke="#FFE082" strokeWidth="1.2" />
        <line x1="44" y1="122" x2="105" y2="92" stroke="#FFE082" strokeWidth="1.2" />

        {/* Right Shaded Wall */}
        <polygon points="105,68 166,98 166,124 105,94" fill="url(#hd-fh-wall-r)" stroke="#BF360C" strokeWidth="1.2" />
        <line x1="105" y1="74" x2="166" y2="104" stroke="#FB8C00" strokeWidth="1.2" />
        <line x1="105" y1="80" x2="166" y2="110" stroke="#FB8C00" strokeWidth="1.2" />
        <line x1="105" y1="86" x2="166" y2="116" stroke="#FB8C00" strokeWidth="1.2" />

        {/* Triangular Gable End Walls */}
        <polygon points="44,98 74,44 105,68" fill="url(#hd-fh-wall-l)" stroke="#BF360C" strokeWidth="1.2" />
        <polygon points="105,68 136,44 166,98" fill="url(#hd-fh-wall-r)" stroke="#BF360C" strokeWidth="1.2" />

        {/* 3. Red Brick Chimney with Smoke */}
        <polygon points="128,30 140,24 140,54 128,60" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
        <polygon points="140,24 150,29 150,58 140,54" fill="#B71C1C" stroke="#7F0000" strokeWidth="1" />
        <polygon points="128,30 138,25 150,29 140,34" fill="#FF8A80" stroke="#B71C1C" strokeWidth="0.8" />
        <rect x="125" y="22" width="28" height="4" rx="2" fill="url(#hd-fh-wood-trim)" stroke="#B71C1C" strokeWidth="1" />

        {/* Animated Puffy Chimney Smoke */}
        <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
          <circle cx="138" cy="14" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="144" cy="4" r="7" fill="#FFFFFF" opacity="0.75" />
          <circle cx="150" cy="-7" r="9" fill="#FFFFFF" opacity="0.55" />
        </g>

        {/* 4. Multi-Facet Candy-Red Gambrel Roof */}
        {/* Left Overhanging Eave Roof */}
        <polygon points="74,40 105,24 105,68 40,100 32,95 68,36" fill="url(#hd-fh-roof-l)" stroke="#B71C1C" strokeWidth="1.2" />
        {/* Specular White Highlights on Roof */}
        <line x1="70" y1="40" x2="48" y2="88" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        <line x1="82" y1="32" x2="60" y2="80" stroke="#FFCDD2" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Right Roof Slope */}
        <polygon points="105,24 136,40 178,95 170,100 105,68" fill="url(#hd-fh-roof-r)" stroke="#7F0000" strokeWidth="1.2" />
        <line x1="116" y1="38" x2="152" y2="72" stroke="#4A0000" strokeWidth="2" opacity="0.6" />
        <line x1="126" y1="50" x2="162" y2="84" stroke="#4A0000" strokeWidth="2" opacity="0.6" />

        {/* Golden Ridge Cap */}
        <polygon points="68,36 105,20 140,36 105,26" fill="url(#hd-fh-wood-trim)" stroke="#E65100" strokeWidth="1.2" />

        {/* 5. Attic Dormer Window with Curved Red Roof */}
        <polygon points="74,64 88,57 88,77 74,84" fill="#FFF8E1" stroke="#BF360C" strokeWidth="1" />
        <polygon points="72,61 88,53 92,56 76,64" fill="url(#hd-fh-roof-l)" stroke="#B71C1C" strokeWidth="1" />
        <rect x="76" y="66" width="9" height="11" rx="1.5" fill="#212121" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Glowing window mullions */}
        <line x1="80.5" y1="66" x2="80.5" y2="77" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="76" y1="71.5" x2="85" y2="71.5" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="80.5" cy="71.5" r="2.5" fill="#FFEE58" opacity="0.8" />

        {/* 6. First Floor Windows with Cute Blue Shutters & Flower Boxes */}
        {/* Left Window */}
        <g id="fh-window-l">
          {/* Blue Shutters */}
          <rect x="52" y="98" width="4" height="15" rx="1" fill="url(#hd-fh-blue)" stroke="#01579B" strokeWidth="0.8" />
          <rect x="70" y="89" width="4" height="15" rx="1" fill="url(#hd-fh-blue)" stroke="#01579B" strokeWidth="0.8" />
          {/* Window Frame & Glass */}
          <polygon points="56,96 70,89 70,107 56,114" fill="#212121" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="63" y1="92.5" x2="63" y2="110.5" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="56" y1="105" x2="70" y2="98" stroke="#FFFFFF" strokeWidth="1" />
          {/* Glowing Glass */}
          <ellipse cx="63" cy="101" rx="4" ry="5" fill="#FFEE58" opacity="0.6" />
          {/* Flower Box with Red & Yellow Blooms */}
          <polygon points="54,113 72,104 72,109 54,118" fill="#5D4037" stroke="#3E2723" strokeWidth="0.8" />
          <circle cx="58" cy="113" r="2" fill="#FF1744" />
          <circle cx="63" cy="110.5" r="2" fill="#FFEB3B" />
          <circle cx="68" cy="108" r="2" fill="#FF1744" />
        </g>

        {/* Right Window */}
        <g id="fh-window-r">
          <polygon points="128,92 144,100 144,118 128,110" fill="#212121" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="136" y1="96" x2="136" y2="114" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="128" y1="101" x2="144" y2="109" stroke="#FFFFFF" strokeWidth="1" />
          <ellipse cx="136" cy="105" rx="4" ry="5" fill="#FFEE58" opacity="0.6" />
          <rect x="144" y="101" width="4" height="15" rx="1" fill="url(#hd-fh-blue)" stroke="#01579B" strokeWidth="0.8" />
        </g>

        {/* 7. Charming Front Porch with White Railings & Deck */}
        <g id="fh-porch">
          {/* Wooden Deck Floor */}
          <polygon points="86,134 136,109 152,117 102,142" fill="url(#hd-fh-wood-trim)" stroke="#E65100" strokeWidth="1.5" />
          <line x1="94" y1="137" x2="140" y2="114" stroke="#FB8C00" strokeWidth="1.5" />
          <line x1="102" y1="142" x2="148" y2="119" stroke="#FB8C00" strokeWidth="1.5" />

          {/* Porch Steps Down to Grass */}
          <polygon points="102,142 148,119 148,126 102,149" fill="#E65100" stroke="#BF360C" strokeWidth="1" />
          <polygon points="102,149 142,129 142,135 102,155" fill="#BF360C" stroke="#7F0000" strokeWidth="1" />

          {/* Porch Overhanging Red Awning Roof */}
          <polygon points="84,104 134,79 146,85 96,110" fill="url(#hd-fh-roof-r)" stroke="#7F0000" strokeWidth="1.2" />
          <polygon points="96,110 146,85 146,89 96,114" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="0.8" />

          {/* White Porch Pillars */}
          <rect x="94" y="108" width="4.5" height="30" rx="1.5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
          <rect x="118" y="96" width="4.5" height="30" rx="1.5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />
          <rect x="142" y="84" width="4.5" height="30" rx="1.5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1" />

          {/* White Cross Railings */}
          <line x1="98" y1="126" x2="118" y2="116" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="122" y1="114" x2="142" y2="104" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="98" y1="134" x2="118" y2="124" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="122" y1="122" x2="142" y2="112" stroke="#FFFFFF" strokeWidth="2" />

          {/* Blue Front Entrance Door with Brass Knob */}
          <polygon points="104,102 120,94 120,126 104,134" fill="url(#hd-fh-blue)" stroke="#01579B" strokeWidth="1.2" />
          <polygon points="107,106 117,101 117,113 107,118" fill="#0288D1" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="107,119 117,114 117,126 107,131" fill="#0288D1" stroke="#FFFFFF" strokeWidth="1" />
          {/* Golden Brass Doorknob */}
          <circle cx="116" cy="116" r="1.5" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.6" />

          {/* Cozy Rocking Chair on Porch (Hay Day signature) */}
          <g id="porch-rocking-chair">
            {/* Rocker Runners */}
            <path d="M 126 128 Q 132 133 138 126" stroke="#5D4037" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Chair Legs & Seat */}
            <line x1="128" y1="129" x2="128" y2="121" stroke="#8D6E63" strokeWidth="1.5" />
            <line x1="136" y1="126" x2="136" y2="118" stroke="#8D6E63" strokeWidth="1.5" />
            <line x1="127" y1="122" x2="137" y2="118" stroke="#FFCC80" strokeWidth="2" />
            {/* Chair Back Spindles */}
            <line x1="135" y1="118" x2="135" y2="108" stroke="#8D6E63" strokeWidth="1.5" />
            <line x1="137" y1="117" x2="137" y2="107" stroke="#8D6E63" strokeWidth="1.5" />
            <line x1="133" y1="108" x2="139" y2="106" stroke="#FFE082" strokeWidth="2" />
          </g>

          {/* Hanging Porch Lantern with Warm Glow */}
          <g id="porch-lantern">
            <line x1="96" y1="110" x2="96" y2="116" stroke="#212121" strokeWidth="1.2" />
            <circle cx="96" cy="119" r="4.5" fill="#FFD54F" opacity="0.4" className="animate-pulse" />
            <polygon points="94,116 98,116 99,121 93,121" fill="#FFEB3B" stroke="#212121" strokeWidth="0.8" />
            <rect x="94.5" y="121" width="3" height="2" rx="0.5" fill="#37474F" />
          </g>

          {/* 5. Natural Lawn Grass Tufts & Wildflowers hugging the foundation */}
          <g id="farmhouse-ground-grass-tufts" className="pointer-events-none">
            {/* Left corner grass blades */}
            <path d="M 38 132 Q 33 124 30 126 Q 34 133 39 135" fill="#7CB342" />
            <path d="M 40 134 Q 37 122 34 123 Q 39 133 42 136" fill="#8BC34A" />
            <path d="M 43 135 Q 42 125 40 126 Q 44 133 46 136" fill="#9CCC65" />
            {/* Daisy near left corner */}
            <circle cx="33" cy="123" r="2.5" fill="#FFFFFF" />
            <circle cx="33" cy="123" r="1" fill="#FFD54F" />

            {/* Front point grass blades */}
            <path d="M 103 166 Q 100 156 97 158 Q 101 166 104 168" fill="#7CB342" />
            <path d="M 106 167 Q 107 154 110 156 Q 107 166 105 168" fill="#8BC34A" />
            <path d="M 109 167 Q 113 158 115 160 Q 110 166 108 168" fill="#9CCC65" />

            {/* Right corner grass blades */}
            <path d="M 166 132 Q 170 124 173 126 Q 169 133 165 135" fill="#7CB342" />
            <path d="M 168 134 Q 174 122 176 125 Q 171 133 167 136" fill="#8BC34A" />
            {/* Red clover flower near right corner */}
            <circle cx="174" cy="123" r="2.2" fill="#E91E63" />
            <circle cx="174" cy="123" r="0.8" fill="#FFF59D" />
          </g>
        </g>
      </svg>
    </div>
  );
};
