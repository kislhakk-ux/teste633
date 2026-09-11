import React from 'react';

export const IsoPopcornPot: React.FC<{ isWorking?: boolean }> = ({ isWorking }) => {
  return (
    <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 210 190"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Copper Cauldron Gradient */}
          <radialGradient id="hd-popcorn-copper" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="25%" stopColor="#FFE082" />
            <stop offset="60%" stopColor="#FFA000" />
            <stop offset="90%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#BF360C" />
          </radialGradient>

          {/* Retro Popcorn Cart Candy Red */}
          <linearGradient id="hd-popcorn-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="40%" stopColor="#FF1744" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>

          {/* Gold Trim */}
          <linearGradient id="hd-popcorn-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="50%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="105" cy="158" rx="82" ry="26" fill="rgba(0,0,0,0.32)" />

        {/* 1. Stone / Wooden Cart Base - DEACTIVATED FOR SEAMLESS GRASS INTEGRATION */}

        {/* Big Golden Spoke Cart Wheels on Sides */}
        <g id="popcorn-cart-wheels">
          {/* Left Wheel */}
          <ellipse cx="48" cy="138" rx="14" ry="20" fill="none" stroke="#FFA000" strokeWidth="2.5" />
          <ellipse cx="48" cy="138" rx="4" ry="6" fill="#FFE082" stroke="#E65100" strokeWidth="1" />
          <line x1="48" y1="118" x2="48" y2="158" stroke="#FFA000" strokeWidth="1.5" />
          <line x1="36" y1="128" x2="60" y2="148" stroke="#FFA000" strokeWidth="1.5" />
          <line x1="36" y1="148" x2="60" y2="128" stroke="#FFA000" strokeWidth="1.5" />

          {/* Right Wheel */}
          <ellipse cx="162" cy="138" rx="14" ry="20" fill="none" stroke="#E65100" strokeWidth="2.5" />
          <ellipse cx="162" cy="138" rx="4" ry="6" fill="#FFB300" stroke="#BF360C" strokeWidth="1" />
        </g>

        {/* 2. Retro Candy-Red Popcorn Cart Body */}
        <polygon points="105,82 54,106 54,128 105,152" fill="url(#hd-popcorn-red)" stroke="#B71C1C" strokeWidth="1.2" />
        <polygon points="105,82 156,106 156,128 105,152" fill="#C62828" stroke="#7F0000" strokeWidth="1.2" />

        {/* Gold Trim Corner Columns */}
        <line x1="54" y1="106" x2="54" y2="128" stroke="url(#hd-popcorn-gold)" strokeWidth="3" />
        <line x1="105" y1="82" x2="105" y2="152" stroke="url(#hd-popcorn-gold)" strokeWidth="3" />
        <line x1="156" y1="106" x2="156" y2="128" stroke="url(#hd-popcorn-gold)" strokeWidth="3" />

        {/* 3. Transparent Glass Warmer Case Full of Buttered Popcorn */}
        <polygon points="105,48 62,68 62,100 105,80" fill="rgba(255, 255, 255, 0.45)" stroke="#FFE082" strokeWidth="1.5" />
        <polygon points="105,48 148,68 148,100 105,80" fill="rgba(240, 240, 240, 0.35)" stroke="#FFE082" strokeWidth="1.5" />

        {/* Mountains of Popped Fluffy Golden Popcorn inside Glass */}
        <ellipse cx="84" cy="86" rx="16" ry="8" fill="#FFF9C4" />
        <ellipse cx="126" cy="86" rx="16" ry="8" fill="#FFF59D" />
        {/* Kernels */}
        <circle cx="76" cy="83" r="3.5" fill="#FFFDE7" />
        <circle cx="84" cy="80" r="4" fill="#FFF9C4" />
        <circle cx="92" cy="84" r="3.5" fill="#FFFDE7" />
        <circle cx="118" cy="83" r="3.5" fill="#FFFDE7" />
        <circle cx="126" cy="80" r="4" fill="#FFF9C4" />
        <circle cx="134" cy="84" r="3.5" fill="#FFFDE7" />

        {/* 4. Giant Polished Copper Kettle / Cauldron on Top */}
        <ellipse cx="105" cy="54" rx="22" ry="11" fill="url(#hd-popcorn-copper)" stroke="#BF360C" strokeWidth="1.5" />
        <path
          d="M 83 54 Q 105 78 127 54 L 125 64 Q 105 86 85 64 Z"
          fill="#D84315"
          stroke="#BF360C"
          strokeWidth="1.2"
        />

        {/* Popcorn popping lively jumping out of cauldron */}
        {isWorking ? (
          <g>
            <circle cx="98" cy="38" r="4" fill="#FFFDE7" stroke="#FBC02D" strokeWidth="0.6" className="animate-bounce" />
            <circle cx="109" cy="33" r="4.5" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="0.6" className="animate-ping" />
            <circle cx="114" cy="40" r="3.5" fill="#FFFDE7" stroke="#FBC02D" strokeWidth="0.6" className="animate-bounce" />
            <circle cx="92" cy="44" r="3.5" fill="#FFFDE7" stroke="#FBC02D" strokeWidth="0.6" />
          </g>
        ) : (
          <circle cx="105" cy="50" r="3.5" fill="#FFFDE7" />
        )}

        {/* 5. Striped Circus Big-Top Canopy (Red & Yellow) */}
        <polygon points="105,16 52,42 105,58 158,42" fill="#FFF9C4" stroke="#F57F17" strokeWidth="1.2" />
        <polygon points="105,16 70,33 105,58 87,46" fill="#E53935" />
        <polygon points="105,16 123,46 105,58 140,33" fill="#E53935" />
        {/* Golden Roof Finial Ball */}
        <circle cx="105" cy="14" r="4.5" fill="#FFD54F" stroke="#FFA000" strokeWidth="1.2" />

        {/* Basket of Golden Dried Corn Cobs */}
        <ellipse cx="66" cy="140" rx="11" ry="6.5" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        <line x1="60" y1="138" x2="70" y2="140" stroke="#FBC02D" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="62" y1="142" x2="72" y2="138" stroke="#FDD835" strokeWidth="3.5" strokeLinecap="round" />

        {/* Popcorn Box / Sign */}
        <polygon points="98,104 112,98 112,114 98,120" fill="#FFF9C4" stroke="#E53935" strokeWidth="1.2" />
        <text x="105" y="112.5" fontSize="7.5" fontWeight="900" textAnchor="middle" fill="#C62828">
          🍿
        </text>

        {/* 6. Natural Lawn Grass Tufts around Popcorn Cart Wheels */}
        <g id="popcorn-ground-grass-tufts" className="pointer-events-none">
          <path d="M 42 142 Q 36 134 33 136 Q 38 144 43 146" fill="#7CB342" />
          <path d="M 45 144 Q 41 132 38 134 Q 44 143 47 147" fill="#8BC34A" />
          <circle cx="35" cy="133" r="2.2" fill="#FFFFFF" />

          <path d="M 103 162 Q 99 152 96 154 Q 101 162 104 164" fill="#7CB342" />
          <path d="M 107 163 Q 109 150 113 152 Q 109 162 106 164" fill="#8BC34A" />

          <path d="M 158 142 Q 163 134 166 136 Q 161 144 156 146" fill="#7CB342" />
          <circle cx="165" cy="133" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
