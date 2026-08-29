import React from 'react';

export const IsoTruck: React.FC<{ isDelivering?: boolean }> = ({ isDelivering }) => {
  return (
    <div className={`relative w-28 h-24 flex items-center justify-center filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.38)] ${isDelivering ? 'animate-pulse' : ''}`}>
      <svg
        viewBox="0 0 130 110"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* 3D Glossy Red Cartoon Paint */}
          <linearGradient id="truck-red-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="35%" stopColor="#FF1744" />
            <stop offset="70%" stopColor="#D50000" />
            <stop offset="100%" stopColor="#9C0006" />
          </linearGradient>

          {/* 3D Shiny Chrome Bevel */}
          <linearGradient id="truck-chrome-3d" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ECEFF1" />
            <stop offset="40%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#B0BEC5" />
            <stop offset="100%" stopColor="#78909C" />
          </linearGradient>

          {/* Golden Truck Cargo Crates */}
          <linearGradient id="truck-crate-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>
        </defs>

        {/* Ground Drop Shadow */}
        <ellipse cx="65" cy="88" rx="50" ry="16" fill="rgba(0,0,0,0.32)" />

        {/* 3D Chunky Rubber Wheels */}
        {/* Front-Left Wheel */}
        <ellipse cx="42" cy="80" rx="8.5" ry="12" fill="#263238" stroke="#101416" strokeWidth="1.5" />
        <ellipse cx="42" cy="80" rx="4.5" ry="6.5" fill="url(#truck-chrome-3d)" stroke="#37474F" strokeWidth="0.8" />
        <circle cx="42" cy="80" r="1.5" fill="#FF1744" />

        {/* Rear-Left Wheel */}
        <ellipse cx="92" cy="66" rx="8.5" ry="12" fill="#263238" stroke="#101416" strokeWidth="1.5" />
        <ellipse cx="92" cy="66" rx="4.5" ry="6.5" fill="url(#truck-chrome-3d)" stroke="#37474F" strokeWidth="0.8" />
        <circle cx="92" cy="66" r="1.5" fill="#FF1744" />

        {/* 3D Wooden Truck Bed */}
        <polygon points="58,62 102,46 116,55 72,71" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.2" />
        <polygon points="72,71 116,55 116,62 72,78" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />

        {/* Wooden Bed Chunky Side Rails */}
        <line x1="72" y1="71" x2="72" y2="54" stroke="#D7CCC8" strokeWidth="3" strokeLinecap="round" />
        <line x1="116" y1="55" x2="116" y2="38" stroke="#D7CCC8" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="58" x2="116" y2="42" stroke="#FFE0B2" strokeWidth="2.5" />
        <line x1="72" y1="64" x2="116" y2="48" stroke="#FFE0B2" strokeWidth="2.5" />

        {/* 3D Cargo Crates & Grain Sacks */}
        <polygon points="78,48 94,42 98,49 82,55" fill="url(#truck-crate-3d)" stroke="#E65100" strokeWidth="1" />
        <polygon points="82,55 98,49 98,58 82,64" fill="#E65100" stroke="#BF360C" strokeWidth="1" />
        <polygon points="78,48 82,55 82,64 78,57" fill="#FFA000" stroke="#E65100" strokeWidth="1" />
        {/* Grain Sack on Cargo Bed */}
        <ellipse cx="102" cy="48" rx="6" ry="5" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="1" />
        <circle cx="102" cy="45" r="1.5" fill="#F57F17" />

        {/* 3D Chubby Vintage Truck Cab Body */}
        <polygon points="26,66 60,50 72,68 38,84" fill="url(#truck-red-3d)" stroke="#B71C1C" strokeWidth="1.5" />
        {/* Cab Curved Highlight */}
        <path d="M 28 67 Q 45 57 60 52" stroke="#FFCDD2" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />

        {/* 3D Rounded Cab Roof */}
        <polygon points="36,46 60,34 70,46 46,58" fill="#FF5252" stroke="#C62828" strokeWidth="1.2" />
        <ellipse cx="50" cy="46" rx="8" ry="3" fill="#FFFFFF" opacity="0.4" />

        {/* Curved Cyan Windshield Glass with Gloss Reflection */}
        <polygon points="38,49 58,39 58,51 38,61" fill="#80DEEA" stroke="#00ACC1" strokeWidth="1" />
        <line x1="42" y1="52" x2="52" y2="42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

        {/* Side Door Window */}
        <polygon points="58,39 68,46 68,57 58,51" fill="#4DD0E1" stroke="#00ACC1" strokeWidth="1" />
        <line x1="60" y1="43" x2="66" y2="48" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" />

        {/* Rounded Front Engine Hood & Grille */}
        <polygon points="18,72 36,63 36,79 18,88" fill="url(#truck-chrome-3d)" stroke="#546E7A" strokeWidth="1.2" />
        {/* Grille Horizontal Chrome Ribs */}
        <line x1="22" y1="76" x2="32" y2="71" stroke="#37474F" strokeWidth="1.5" />
        <line x1="22" y1="80" x2="32" y2="75" stroke="#37474F" strokeWidth="1.5" />
        <line x1="22" y1="84" x2="32" y2="79" stroke="#37474F" strokeWidth="1.5" />

        {/* Curved Chrome Front Bumper */}
        <path d="M 14 88 Q 22 93 34 86" stroke="url(#truck-chrome-3d)" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Big Bright 3D Cartoon Headlights */}
        <circle cx="20" cy="72" r="4.2" fill="#FFF59D" stroke="#FFA000" strokeWidth="1" className="animate-pulse" />
        <circle cx="19" cy="71" r="1.5" fill="#FFFFFF" />
        <circle cx="34" cy="65" r="4.2" fill="#FFF59D" stroke="#FFA000" strokeWidth="1" className="animate-pulse" />
        <circle cx="33" cy="64" r="1.5" fill="#FFFFFF" />

        {/* Exhaust Pipe with Animated Puffy Clouds */}
        <line x1="102" y1="67" x2="110" y2="65" stroke="#78909C" strokeWidth="3" strokeLinecap="round" />
        {isDelivering ? (
          <g className="animate-bounce">
            <circle cx="116" cy="62" r="4.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="123" cy="56" r="6" fill="#FFFFFF" opacity="0.75" />
          </g>
        ) : (
          <circle cx="114" cy="63" r="2.5" fill="#ECEFF1" opacity="0.6" />
        )}
      </svg>
    </div>
  );
};
