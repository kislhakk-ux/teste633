import React from 'react';

export const IsoDairy: React.FC<{ isWorking?: boolean }> = ({ isWorking }) => {
  return (
    <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.38)]">
      <svg
        viewBox="0 0 210 190"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Hay Day Dairy White Stucco Wall */}
          <linearGradient id="hd-dairy-wall-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F5F5F5" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>
          <linearGradient id="hd-dairy-wall-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="60%" stopColor="#E0E0E0" />
            <stop offset="100%" stopColor="#CFD8DC" />
          </linearGradient>

          {/* Hay Day Vibrant Glossy Candy-Red Roof */}
          <linearGradient id="hd-dairy-roof-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5252" />
            <stop offset="35%" stopColor="#FF1744" />
            <stop offset="80%" stopColor="#D50000" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>
          <linearGradient id="hd-dairy-roof-r" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D50000" />
            <stop offset="60%" stopColor="#C62828" />
            <stop offset="100%" stopColor="#7F0000" />
          </linearGradient>

          {/* Brass Ventilators & Golden Dormers */}
          <linearGradient id="hd-dairy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="35%" stopColor="#FFEE58" />
            <stop offset="70%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF8F00" />
          </linearGradient>

          {/* Stainless Steel Milk Cans */}
          <linearGradient id="hd-milkcan-steel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B0BEC5" />
            <stop offset="40%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#CFD8DC" />
            <stop offset="100%" stopColor="#78909C" />
          </linearGradient>

          {/* Wooden Deck & Steps */}
          <linearGradient id="hd-wood-deck" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="50%" stopColor="#6D4C41" />
            <stop offset="100%" stopColor="#4E342E" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="105" cy="160" rx="86" ry="26" fill="rgba(0,0,0,0.32)" />

        {/* 1. Brick / Stone Foundation Base - DEACTIVATED FOR SEAMLESS GRASS INTEGRATION */}

        {/* 2. Main White Stucco Walls */}
        <polygon points="105,82 48,112 48,126 105,154" fill="url(#hd-dairy-wall-l)" stroke="#CFD8DC" strokeWidth="1.2" />
        <polygon points="105,82 164,110 164,124 105,154" fill="url(#hd-dairy-wall-r)" stroke="#B0BEC5" strokeWidth="1.2" />

        {/* Exposed Red Bricks on Wall Base */}
        <rect x="58" y="120" width="8" height="4" rx="1" fill="#FF8A80" stroke="#C62828" strokeWidth="0.6" />
        <rect x="74" y="126" width="9" height="4.5" rx="1" fill="#FF8A80" stroke="#C62828" strokeWidth="0.6" />
        <rect x="116" y="136" width="9" height="4.5" rx="1" fill="#FF8A80" stroke="#C62828" strokeWidth="0.6" />
        <rect x="138" y="126" width="8" height="4" rx="1" fill="#FF8A80" stroke="#C62828" strokeWidth="0.6" />

        {/* Small Stone Windows on Left Wall */}
        <rect x="68" y="110" width="7" height="9" rx="1.5" fill="#212121" stroke="#8D6E63" strokeWidth="1" />
        <rect x="84" y="119" width="7" height="9" rx="1.5" fill="#212121" stroke="#8D6E63" strokeWidth="1" />
        <rect x="122" y="120" width="7" height="9" rx="1.5" fill="#212121" stroke="#8D6E63" strokeWidth="1" />

        {/* Gable Front Wall (Right side triangle) */}
        <polygon points="105,82 142,42 164,74 164,110" fill="url(#hd-dairy-wall-r)" stroke="#CFD8DC" strokeWidth="1" />
        {/* Gable Small Attic Window */}
        <rect x="142" y="60" width="6" height="7" rx="1" fill="#212121" stroke="#8D6E63" strokeWidth="0.8" />

        {/* 3. Iconic Bright Yellow Star Badge on Gable Wall */}
        <g id="dairy-star">
          {/* Star Shadow */}
          <polygon
            points="146,80 148,87 155,87 149,91 151,98 146,94 141,98 143,91 137,87 144,87"
            fill="rgba(0,0,0,0.15)"
          />
          {/* 3D Golden Star */}
          <polygon
            points="145,78 147,85 154,85 148,89 150,96 145,92 140,96 142,89 136,85 143,85"
            fill="url(#hd-dairy-gold)"
            stroke="#FFA000"
            strokeWidth="1"
          />
          <circle cx="145" cy="87" r="1.5" fill="#FFFFFF" />
        </g>

        {/* 4. Glossy Candy-Red Gambrel Roof */}
        {/* Left Gambrel Lower Steep Slope */}
        <polygon points="46,108 54,68 108,46 105,82" fill="url(#hd-dairy-roof-l)" stroke="#B71C1C" strokeWidth="1.2" />
        {/* Left Gambrel Upper Flatter Slope */}
        <polygon points="54,68 84,36 138,20 108,46" fill="url(#hd-dairy-roof-l)" stroke="#B71C1C" strokeWidth="1.2" />
        {/* Right Roof Eave Slope */}
        <polygon points="108,46 138,20 156,38 142,42" fill="url(#hd-dairy-roof-r)" stroke="#7F0000" strokeWidth="1.2" />
        <polygon points="105,82 108,46 142,42 166,74" fill="url(#hd-dairy-roof-r)" stroke="#7F0000" strokeWidth="1.2" />

        {/* Roof White Fascia Trims */}
        <polygon points="44,109 54,68 52,66 42,107" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="0.8" />
        <polygon points="52,66 84,36 82,34 50,64" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="0.8" />

        {/* Roof White Specular Reflection Streaks */}
        <line x1="60" y1="62" x2="102" y2="44" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        <line x1="72" y1="42" x2="124" y2="24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

        {/* 5. Gold-Rimmed Dormer Porthole Windows on Roof Slope */}
        {/* Dormer 1 (Left) */}
        <g id="dormer-1">
          <ellipse cx="68" cy="74" rx="8" ry="11" fill="url(#hd-dairy-roof-l)" stroke="#B71C1C" strokeWidth="1" />
          <ellipse cx="68" cy="74" rx="6" ry="8" fill="url(#hd-dairy-gold)" stroke="#FFA000" strokeWidth="1" />
          <ellipse cx="68" cy="74" rx="4" ry="5.5" fill="#212121" />
          <ellipse cx="67" cy="72" rx="1.5" ry="2" fill="#FFFFFF" opacity="0.8" />
        </g>

        {/* Dormer 2 (Right) */}
        <g id="dormer-2">
          <ellipse cx="94" cy="62" rx="8" ry="11" fill="url(#hd-dairy-roof-l)" stroke="#B71C1C" strokeWidth="1" />
          <ellipse cx="94" cy="62" rx="6" ry="8" fill="url(#hd-dairy-gold)" stroke="#FFA000" strokeWidth="1" />
          <ellipse cx="94" cy="62" rx="4" ry="5.5" fill="#212121" />
          <ellipse cx="93" cy="60" rx="1.5" ry="2" fill="#FFFFFF" opacity="0.8" />
        </g>

        {/* 6. Three Brass Bell-Shaped Ventilator Vents on Roof Crest */}
        <g id="roof-ventilators">
          {[
            { x: 92, y: 31 },
            { x: 108, y: 26 },
            { x: 124, y: 21 },
          ].map((vent, idx) => (
            <g key={`vent_${idx}`}>
              <rect x={vent.x - 2} y={vent.y} width="4" height="4" fill="#FF8F00" />
              {/* Bell Dome */}
              <circle cx={vent.x} cy={vent.y - 1} r="3.5" fill="url(#hd-dairy-gold)" stroke="#E65100" strokeWidth="0.8" />
              <circle cx={vent.x} cy={vent.y - 4} r="1.5" fill="#FFA000" />
              <circle cx={vent.x - 1} cy={vent.y - 2} r="0.8" fill="#FFFFFF" />
            </g>
          ))}
        </g>

        {/* 7. Conveyor Belt & Chute Exiting from Wall Hole (Left Side) */}
        <g id="dairy-conveyor">
          {/* Wall Square Exit Hole */}
          <polygon points="56,98 68,92 68,114 56,120" fill="#1A1A1A" stroke="#4E342E" strokeWidth="1.2" />
          {/* Wooden Chute Supports */}
          <rect x="42" y="112" width="4" height="24" rx="1" fill="#5D4037" stroke="#271610" strokeWidth="0.8" />
          <rect x="52" y="118" width="4" height="24" rx="1" fill="#5D4037" stroke="#271610" strokeWidth="0.8" />
          <line x1="42" y1="122" x2="56" y2="130" stroke="#3E2723" strokeWidth="2.5" />

          {/* Black Rubber Conveyor Belt Slope */}
          <polygon points="34,106 64,90 68,98 38,114" fill="#263238" stroke="#101416" strokeWidth="1.2" />
          {/* Conveyor Top Rollers / Cheese Moulds */}
          <line x1="38" y1="108" x2="66" y2="94" stroke="#455A64" strokeWidth="2" strokeDasharray="4 3" />

          {/* Fresh White Cheese / Butter block on conveyor if working */}
          {isWorking && (
            <ellipse cx="48" cy="106" rx="4" ry="2.5" fill="#FFF59D" stroke="#FFA000" strokeWidth="0.8" className="animate-pulse" />
          )}
        </g>

        {/* 8. Front Wooden Platform Deck & Step Stairs */}
        <g id="dairy-porch">
          {/* Wooden Deck Planks */}
          <polygon points="126,134 176,112 192,120 142,144" fill="url(#hd-wood-deck)" stroke="#3E2723" strokeWidth="1.5" />
          {/* Deck Planks Lines */}
          <line x1="134" y1="137" x2="180" y2="114" stroke="#3E2723" strokeWidth="1.5" />
          <line x1="142" y1="144" x2="188" y2="118" stroke="#3E2723" strokeWidth="1.5" />

          {/* Wooden Steps Down */}
          <polygon points="142,144 192,120 192,127 142,151" fill="#4E342E" stroke="#271610" strokeWidth="1" />
          <polygon points="142,151 184,130 184,136 142,156" fill="#3E2723" stroke="#1C0E07" strokeWidth="1" />
        </g>

        {/* 9. Stainless Steel Milk Cans Lined Up on Right Side */}
        <g id="milk-cans">
          {/* Milk Can 1 */}
          <path d="M 172,122 Q 177,124 182,122 L 182,136 Q 177,138 172,136 Z" fill="url(#hd-milkcan-steel)" stroke="#455A64" strokeWidth="0.8" />
          <ellipse cx="177" cy="122" rx="5" ry="2" fill="#ECEFF1" stroke="#546E7A" strokeWidth="0.6" />
          <ellipse cx="177" cy="120" rx="3" ry="1.2" fill="#FFFFFF" stroke="#546E7A" strokeWidth="0.6" />

          {/* Milk Can 2 */}
          <path d="M 180,126 Q 185,128 190,126 L 190,140 Q 185,142 180,140 Z" fill="url(#hd-milkcan-steel)" stroke="#455A64" strokeWidth="0.8" />
          <ellipse cx="185" cy="126" rx="5" ry="2" fill="#ECEFF1" stroke="#546E7A" strokeWidth="0.6" />
          <ellipse cx="185" cy="124" rx="3" ry="1.2" fill="#FFFFFF" stroke="#546E7A" strokeWidth="0.6" />

          {/* Milk Can 3 */}
          <path d="M 174,132 Q 179,134 184,132 L 184,146 Q 179,148 174,146 Z" fill="url(#hd-milkcan-steel)" stroke="#455A64" strokeWidth="0.8" />
          <ellipse cx="179" cy="132" rx="5" ry="2" fill="#ECEFF1" stroke="#546E7A" strokeWidth="0.6" />
          <ellipse cx="179" cy="130" rx="3" ry="1.2" fill="#FFFFFF" stroke="#546E7A" strokeWidth="0.6" />
        </g>

        {/* 10. Natural Lawn Grass Tufts around Dairy Foundation */}
        <g id="dairy-ground-grass-tufts" className="pointer-events-none">
          <path d="M 38 132 Q 33 124 30 126 Q 34 133 39 135" fill="#7CB342" />
          <path d="M 40 134 Q 37 122 34 123 Q 39 133 42 136" fill="#8BC34A" />
          <circle cx="33" cy="123" r="2.2" fill="#FFFFFF" />

          <path d="M 103 162 Q 99 152 96 154 Q 101 162 104 164" fill="#7CB342" />
          <path d="M 107 163 Q 109 150 113 152 Q 109 162 106 164" fill="#8BC34A" />

          <path d="M 188 132 Q 194 124 197 126 Q 192 134 187 136" fill="#7CB342" />
          <circle cx="196" cy="123" r="2.2" fill="#E91E63" />
        </g>
      </svg>
    </div>
  );
};
