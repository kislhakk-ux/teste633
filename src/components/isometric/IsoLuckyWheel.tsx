import React from 'react';

export const IsoLuckyWheel: React.FC<{ isSelected?: boolean }> = ({ isSelected }) => {
  return (
    <div className="relative w-44 h-40 flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 200 180"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* 3D Purple Carnival Wagon */}
          <linearGradient id="wheel-cart-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E040FB" />
            <stop offset="40%" stopColor="#AB47BC" />
            <stop offset="80%" stopColor="#7B1FA2" />
            <stop offset="100%" stopColor="#4A148C" />
          </linearGradient>

          {/* 3D Gold Filigree */}
          <linearGradient id="wheel-gold-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="35%" stopColor="#FFEE58" />
            <stop offset="70%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>
        </defs>

        {/* Ground Drop Shadow */}
        <ellipse cx="100" cy="152" rx="74" ry="24" fill="rgba(0,0,0,0.32)" />

        {/* Carnival Wagon Spoked Wheels */}
        <ellipse cx="56" cy="142" rx="11" ry="15" fill="#37474F" stroke="#212121" strokeWidth="2" />
        <ellipse cx="56" cy="142" rx="5.5" ry="7.5" fill="url(#wheel-gold-3d)" stroke="#FFA000" strokeWidth="1" />
        <ellipse cx="144" cy="142" rx="11" ry="15" fill="#37474F" stroke="#212121" strokeWidth="2" />
        <ellipse cx="144" cy="142" rx="5.5" ry="7.5" fill="url(#wheel-gold-3d)" stroke="#FFA000" strokeWidth="1" />

        {/* Wagon Base */}
        <polygon points="100,136 40,110 40,126 100,150" fill="url(#wheel-cart-3d)" stroke="#4A148C" strokeWidth="1.5" />
        <polygon points="100,136 160,110 160,126 100,150" fill="#6A1B9A" stroke="#4A148C" strokeWidth="1.5" />

        {/* Golden Filigree Wood Trim */}
        <line x1="40" y1="126" x2="100" y2="150" stroke="url(#wheel-gold-3d)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="100" y1="150" x2="160" y2="126" stroke="url(#wheel-gold-3d)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Carnival Support Beams */}
        <rect x="50" y="58" width="5" height="64" rx="2" fill="url(#wheel-gold-3d)" stroke="#FFA000" strokeWidth="1" />
        <rect x="145" y="58" width="5" height="64" rx="2" fill="url(#wheel-gold-3d)" stroke="#FFA000" strokeWidth="1" />

        {/* Big 3D Spinning Wheel of Fortune */}
        <g className="origin-[100px_84px] animate-spin-slow" style={{ transformOrigin: '100px 84px' }}>
          {/* Wheel Outer Gold Rim */}
          <circle cx="100" cy="84" r="38" fill="#37474F" stroke="url(#wheel-gold-3d)" strokeWidth="5" />

          {/* Wheel 8 Vibrant Cartoon Slices */}
          <path d="M 100 84 L 100 48 A 36 36 0 0 1 125 57 Z" fill="#FF1744" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M 100 84 L 125 57 A 36 36 0 0 1 136 84 Z" fill="#FF9100" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M 100 84 L 136 84 A 36 36 0 0 1 125 111 Z" fill="#FFEA00" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M 100 84 L 125 111 A 36 36 0 0 1 100 120 Z" fill="#00E676" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M 100 84 L 100 120 A 36 36 0 0 1 75 111 Z" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M 100 84 L 75 111 A 36 36 0 0 1 64 84 Z" fill="#2979FF" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M 100 84 L 64 84 A 36 36 0 0 1 75 57 Z" fill="#D500F9" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M 100 84 L 75 57 A 36 36 0 0 1 100 48 Z" fill="#FF4081" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Central Gold Wheel Hub with Shiny Diamond Star */}
          <circle cx="100" cy="84" r="11" fill="url(#wheel-gold-3d)" stroke="#FF8F00" strokeWidth="2" />
          <circle cx="100" cy="84" r="5.5" fill="#FFFFFF" />
        </g>

        {/* Prize Wheel Pointer Arrow */}
        <polygon points="100,54 92,40 108,40" fill="#D50000" stroke="#FFFFFF" strokeWidth="2" />

        {/* Circus Tent Striped Canopy Roof */}
        <polygon points="100,14 38,42 100,58 162,42" fill="#FFFDE7" stroke="#FFA000" strokeWidth="1.5" />
        <polygon points="100,14 58,34 100,58 78,45" fill="#AB47BC" />
        <polygon points="100,14 122,45 100,58 142,34" fill="#AB47BC" />

        {/* Glowing Carnival Light Bulbs */}
        {[42, 56, 70, 85, 100, 115, 130, 144, 158].map((x, idx) => (
          <circle
            key={idx}
            cx={x}
            cy={x <= 100 ? 42 + (x - 42) * 0.27 : 58 - (x - 100) * 0.27}
            r="3"
            fill="#FFF59D"
            stroke="#FF9100"
            strokeWidth="1"
            className="animate-pulse"
          />
        ))}

        {/* Top Gold Finial Star */}
        <circle cx="100" cy="12" r="5" fill="url(#wheel-gold-3d)" stroke="#FF8F00" strokeWidth="1.2" />

        {/* Sign Banner */}
        <rect x="64" y="132" width="72" height="17" rx="4" fill="#6A1B9A" stroke="url(#wheel-gold-3d)" strokeWidth="1.5" />
        <text x="100" y="144" fontSize="8" fontWeight="black" textAnchor="middle" fill="#FFEE58">
          ROLETA 🎡
        </text>

        {/* Natural Lawn Grass Tufts around Wagon Base */}
        <g id="wheel-ground-grass-tufts" className="pointer-events-none">
          <path d="M 48 144 Q 43 136 40 138 Q 44 145 49 147" fill="#7CB342" />
          <path d="M 55 145 Q 58 135 61 137 Q 57 145 54 147" fill="#8BC34A" />
          <circle cx="43" cy="135" r="2.2" fill="#FFFFFF" />

          <path d="M 139 144 Q 135 136 132 138 Q 136 145 140 147" fill="#7CB342" />
          <path d="M 148 145 Q 152 135 155 137 Q 150 145 147 147" fill="#8BC34A" />
          <circle cx="154" cy="134" r="2" fill="#FFD54F" />
        </g>
      </svg>
    </div>
  );
};
