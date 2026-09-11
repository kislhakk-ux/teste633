import React from 'react';

export const IsoSugarMill: React.FC<{ isWorking?: boolean }> = ({ isWorking }) => {
  return (
    <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 210 190"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Sugar Mill Wood Timber Gradient */}
          <linearGradient id="hd-sugar-wood-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A1887F" />
            <stop offset="50%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>
          <linearGradient id="hd-sugar-wood-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D4C41" />
            <stop offset="50%" stopColor="#4E342E" />
            <stop offset="100%" stopColor="#2E1C14" />
          </linearGradient>

          {/* Copper Syrup Boiling Vat Gradient */}
          <radialGradient id="hd-sugar-copper" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="35%" stopColor="#FFB300" />
            <stop offset="70%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#BF360C" />
          </radialGradient>

          {/* Cast Iron Rollers */}
          <linearGradient id="hd-sugar-rollers" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#90A4AE" />
            <stop offset="50%" stopColor="#CFD8DC" />
            <stop offset="100%" stopColor="#37474F" />
          </linearGradient>

          {/* Thatch Tropical Palm Leaf Roof */}
          <linearGradient id="hd-sugar-thatch-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DCEDC8" />
            <stop offset="40%" stopColor="#AED581" />
            <stop offset="80%" stopColor="#7CB342" />
            <stop offset="100%" stopColor="#558B2F" />
          </linearGradient>
          <linearGradient id="hd-sugar-thatch-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8BC34A" />
            <stop offset="50%" stopColor="#689F38" />
            <stop offset="100%" stopColor="#33691E" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="105" cy="158" rx="84" ry="28" fill="rgba(0,0,0,0.32)" />

        {/* 1. Heavy Timber Platform Base - DEACTIVATED FOR SEAMLESS GRASS INTEGRATION */}

        {/* 2. Open-Air Rustic Wooden Sugar Shed Structure */}
        <polygon points="105,80 46,108 46,128 105,154" fill="url(#hd-sugar-wood-l)" stroke="#4E342E" strokeWidth="1.2" />
        <polygon points="105,80 164,108 164,128 105,154" fill="url(#hd-sugar-wood-r)" stroke="#2E1C14" strokeWidth="1.2" />

        {/* 3. Multi-Sloped Thatched Green Palm Roof */}
        {/* Gable peak */}
        <polygon points="46,108 76,62 105,80" fill="url(#hd-sugar-wood-l)" />
        <polygon points="105,80 134,62 164,108" fill="url(#hd-sugar-wood-r)" />
        {/* Overhanging thatch layer Left */}
        <polygon points="76,56 105,40 105,80 46,108 38,102 68,50" fill="url(#hd-sugar-thatch-l)" stroke="#558B2F" strokeWidth="1" />
        {/* Overhanging thatch layer Right */}
        <polygon points="105,40 134,56 172,102 164,108 105,80" fill="url(#hd-sugar-thatch-r)" stroke="#33691E" strokeWidth="1" />

        {/* Thatch Straw Ridges & Highlights */}
        <line x1="50" y1="98" x2="82" y2="58" stroke="#DCEDC8" strokeWidth="2" strokeLinecap="round" />
        <line x1="62" y1="88" x2="94" y2="48" stroke="#DCEDC8" strokeWidth="2" strokeLinecap="round" />
        <line x1="116" y1="48" x2="148" y2="88" stroke="#33691E" strokeWidth="2" strokeLinecap="round" />
        <line x1="126" y1="58" x2="158" y2="98" stroke="#33691E" strokeWidth="2" strokeLinecap="round" />

        {/* 4. Sugarcane Crusher Heavy Cast-Iron Rollers & Gears */}
        <g id="sugarcane-crusher">
          <rect x="64" y="106" width="9" height="24" rx="3.5" fill="url(#hd-sugar-rollers)" stroke="#263238" strokeWidth="1.2" />
          <rect x="75" y="101" width="9" height="24" rx="3.5" fill="url(#hd-sugar-rollers)" stroke="#263238" strokeWidth="1.2" />
          <rect x="86" y="96" width="9" height="24" rx="3.5" fill="url(#hd-sugar-rollers)" stroke="#263238" strokeWidth="1.2" />
          {/* Crusher Top Gears */}
          <circle cx="68.5" cy="106" r="5.5" fill="#455A64" stroke="#CFD8DC" strokeWidth="1.2" className={isWorking ? 'animate-spin' : ''} />
          <circle cx="79.5" cy="101" r="5.5" fill="#37474F" stroke="#CFD8DC" strokeWidth="1.2" className={isWorking ? 'animate-spin' : ''} />
          <circle cx="90.5" cy="96" r="5.5" fill="#263238" stroke="#CFD8DC" strokeWidth="1.2" className={isWorking ? 'animate-spin' : ''} />

          {/* Sugarcane Stalks Fed into Rollers */}
          <line x1="42" y1="130" x2="72" y2="110" stroke="#8BC34A" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="46" y1="136" x2="76" y2="114" stroke="#AED581" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="142" x2="80" y2="118" stroke="#689F38" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="58" cy="120" r="1.8" fill="#558B2F" />
          <circle cx="66" cy="114" r="1.8" fill="#558B2F" />
        </g>

        {/* 5. Big Copper Molasses Boiler / Cauldron on Right */}
        <g id="sugar-copper-cauldron">
          {/* Stone Furnace Underneath */}
          <ellipse cx="132" cy="138" rx="20" ry="10" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />

          {/* Copper Cauldron Body */}
          <ellipse cx="132" cy="124" rx="20" ry="10" fill="url(#hd-sugar-copper)" stroke="#BF360C" strokeWidth="1.5" />
          <path
            d="M 112 124 Q 132 146 152 124 L 150 136 Q 132 152 114 136 Z"
            fill="#D84315"
            stroke="#BF360C"
            strokeWidth="1.2"
          />

          {/* Bubbling Sweet Golden Molasses Syrup */}
          <ellipse cx="132" cy="124" rx="15" ry="7" fill="#FF8F00" />
          <circle cx="127" cy="124" r="3" fill="#FFE082" className={isWorking ? 'animate-ping' : ''} />
          <circle cx="137" cy="122" r="2.5" fill="#FFE082" />

          {/* Sweet Steam Puffs */}
          {isWorking ? (
            <g className="animate-bounce" style={{ animationDuration: '2.2s' }}>
              <circle cx="130" cy="106" r="5" fill="#FFF9C4" opacity="0.85" />
              <circle cx="136" cy="94" r="7" fill="#FFF9C4" opacity="0.65" />
              <circle cx="140" cy="82" r="9" fill="#FFF9C4" opacity="0.4" />
            </g>
          ) : (
            <circle cx="132" cy="108" r="3.5" fill="#FFF9C4" opacity="0.4" />
          )}
        </g>

        {/* 6. Wooden Sugar Barrels with Sweet White & Brown Sugar */}
        <polygon points="150,136 164,128 164,146 150,154" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
        <ellipse cx="157" cy="128" rx="7" ry="3" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="0.8" />
        <circle cx="157" cy="128" r="3.5" fill="#FFFFFF" />

        {/* Sugar Mill Sign */}
        <polygon points="98,46 112,38 112,54 98,62" fill="#FFF9C4" stroke="#8BC34A" strokeWidth="1.2" />
        <text x="105" y="52" fontSize="7.5" fontWeight="black" textAnchor="middle" fill="#558B2F">
          🎋
        </text>

        {/* 7. Natural Lawn Grass Tufts around Sugar Mill Base */}
        <g id="sugarmill-ground-grass-tufts" className="pointer-events-none">
          <path d="M 38 132 Q 33 124 30 126 Q 34 133 39 135" fill="#7CB342" />
          <path d="M 40 134 Q 37 122 34 124 Q 39 133 42 136" fill="#8BC34A" />
          <circle cx="33" cy="123" r="2.2" fill="#FFFFFF" />

          <path d="M 103 162 Q 99 152 96 154 Q 101 162 104 164" fill="#7CB342" />
          <path d="M 107 163 Q 109 150 113 152 Q 109 162 106 164" fill="#8BC34A" />

          <path d="M 166 138 Q 171 130 174 132 Q 169 140 164 142" fill="#7CB342" />
          <circle cx="173" cy="129" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
