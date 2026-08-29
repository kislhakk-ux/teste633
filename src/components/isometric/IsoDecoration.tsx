import React from 'react';
import { DecorationType } from '../../types/game';

interface IsoDecorationProps {
  type: DecorationType;
  isSelected?: boolean;
}

export const IsoDecoration: React.FC<IsoDecorationProps> = ({ type, isSelected }) => {
  switch (type) {
    case 'scarecrow':
      return (
        <div className={`relative w-24 h-28 flex items-center justify-center filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.32)] ${isSelected ? 'scale-105' : ''}`}>
          <svg viewBox="0 0 96 110" className="w-full h-full overflow-visible pointer-events-none select-none">
            <defs>
              <linearGradient id="scarecrow-shirt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#42A5F5" />
                <stop offset="50%" stopColor="#1E88E5" />
                <stop offset="100%" stopColor="#1565C0" />
              </linearGradient>
              <linearGradient id="scarecrow-straw" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="60%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>
              <linearGradient id="scarecrow-wood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8D6E63" />
                <stop offset="100%" stopColor="#4E342E" />
              </linearGradient>
              <style>{`
                @keyframes scarecrow-sway {
                  0%, 100% { transform: rotate(-2deg); }
                  50% { transform: rotate(2deg); }
                }
                @keyframes bird-hop {
                  0%, 88%, 100% { transform: translateY(0); }
                  92% { transform: translateY(-3.5px) scaleY(0.9); }
                  96% { transform: translateY(0); }
                }
                .scarecrow-sway-anim {
                  animation: scarecrow-sway 4.5s ease-in-out infinite;
                  transform-origin: 48px 98px;
                }
                .bird-hop-anim {
                  animation: bird-hop 6s ease-in-out infinite;
                  transform-origin: 78px 38px;
                }
              `}</style>
            </defs>

            {/* Dirt Mount around base pole on ground */}
            <ellipse cx="48" cy="98" rx="14" ry="6" fill="#5D4037" />
            <ellipse cx="48" cy="97" rx="10" ry="4" fill="#795548" />

            {/* Animated Scarecrow Frame */}
            <g className="scarecrow-sway-anim">
              {/* Main Vertical Wooden Post */}
              <rect x="45" y="36" width="6" height="62" rx="2" fill="url(#scarecrow-wood)" stroke="#3E2723" strokeWidth="1" />

              {/* Horizontal Crossbeam Arms */}
              <rect x="14" y="44" width="68" height="5.5" rx="2" fill="url(#scarecrow-wood)" stroke="#3E2723" strokeWidth="1" />

              {/* Straw poking out of wrists */}
              <path d="M 12 43 L 6 40 M 12 46 L 4 47 M 12 48 L 7 52" stroke="url(#scarecrow-straw)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 84 43 L 90 40 M 84 46 L 92 47 M 84 48 L 89 52" stroke="url(#scarecrow-straw)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Blue Flannel Shirt */}
              <polygon points="36,40 60,40 64,68 32,68" fill="url(#scarecrow-shirt)" stroke="#0D47A1" strokeWidth="1.2" />
              {/* Shirt Sleeves */}
              <polygon points="36,40 18,44 18,51 36,49" fill="url(#scarecrow-shirt)" stroke="#0D47A1" strokeWidth="1" />
              <polygon points="60,40 78,44 78,51 60,49" fill="url(#scarecrow-shirt)" stroke="#0D47A1" strokeWidth="1" />

              {/* Patches on Shirt */}
              <rect x="38" y="52" width="7" height="7" rx="1" fill="#E53935" stroke="#B71C1C" strokeWidth="0.8" />
              <line x1="41.5" y1="50" x2="41.5" y2="61" stroke="#FFF" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
              <line x1="36" y1="55.5" x2="47" y2="55.5" stroke="#FFF" strokeWidth="0.6" strokeDasharray="1.5 1.5" />

              {/* Rope Belt */}
              <line x1="33" y1="62" x2="63" y2="62" stroke="#FFF59D" strokeWidth="2.5" strokeLinecap="round" />

              {/* Straw Collar & Neck */}
              <path d="M 42 38 L 40 32 M 48 38 L 48 30 M 54 38 L 56 32" stroke="url(#scarecrow-straw)" strokeWidth="2" strokeLinecap="round" />

              {/* Burlap Head */}
              <circle cx="48" cy="25" r="11" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1.2" />
              {/* Button Eyes */}
              <circle cx="44" cy="24" r="1.8" fill="#212121" />
              <circle cx="52" cy="24" r="1.8" fill="#212121" />
              {/* Stitched Smile */}
              <path d="M 43 29 Q 48 33 53 29" fill="none" stroke="#5D4037" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="45" y1="28" x2="45" y2="31" stroke="#5D4037" strokeWidth="0.8" />
              <line x1="48" y1="29" x2="48" y2="32" stroke="#5D4037" strokeWidth="0.8" />
              <line x1="51" y1="28" x2="51" y2="31" stroke="#5D4037" strokeWidth="0.8" />

              {/* Rustic Straw Hat */}
              <ellipse cx="48" cy="18" rx="19" ry="6" fill="#FBC02D" stroke="#F57F17" strokeWidth="1" />
              <path d="M 38 17 Q 48 4 58 17 Z" fill="#FDD835" stroke="#F57F17" strokeWidth="1" />
              {/* Red Hat Band */}
              <path d="M 39 16 Q 48 13 57 16" fill="none" stroke="#D32F2F" strokeWidth="2.2" />

              {/* Little Bluebird perched on the arm */}
              <g className="bird-hop-anim">
                <ellipse cx="78" cy="38" rx="5" ry="3.5" fill="#1E88E5" />
                <circle cx="76" cy="35" r="2.8" fill="#42A5F5" />
                <polygon points="73,35 70,36 73,37" fill="#FFB300" />
              </g>
            </g>
          </svg>
        </div>
      );

    case 'apple_tree':
      return (
        <div className={`relative w-28 h-32 flex items-center justify-center filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.36)] ${isSelected ? 'scale-105' : ''}`}>
          <svg viewBox="0 0 110 130" className="w-full h-full overflow-visible pointer-events-none select-none">
            <defs>
              <linearGradient id="tree-bark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5D4037" />
                <stop offset="40%" stopColor="#795548" />
                <stop offset="80%" stopColor="#4E342E" />
                <stop offset="100%" stopColor="#3E2723" />
              </linearGradient>
              <radialGradient id="foliage-main" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#81C784" />
                <stop offset="40%" stopColor="#4CAF50" />
                <stop offset="80%" stopColor="#2E7D32" />
                <stop offset="100%" stopColor="#1B5E20" />
              </radialGradient>
              <radialGradient id="apple-shine" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FF8A80" />
                <stop offset="40%" stopColor="#FF1744" />
                <stop offset="85%" stopColor="#C62828" />
                <stop offset="100%" stopColor="#B71C1C" />
              </radialGradient>
            </defs>

            {/* Tree Trunk Base flared into ground */}
            <path d="M 48 85 Q 46 102 38 114 L 72 114 Q 64 102 62 85 Z" fill="url(#tree-bark)" stroke="#3E2723" strokeWidth="1" />
            <path d="M 42 114 Q 48 108 55 114 Q 62 108 68 114" fill="none" stroke="#2E1C14" strokeWidth="1.2" />

            {/* Lush Tiered Isometric Foliage Canopy */}
            {/* Back foliage lobes */}
            <circle cx="34" cy="55" r="22" fill="#2E7D32" opacity="0.9" />
            <circle cx="76" cy="55" r="22" fill="#2E7D32" opacity="0.9" />
            <circle cx="55" cy="40" r="28" fill="url(#foliage-main)" />
            {/* Front accent lobes for 3D fullness */}
            <circle cx="40" cy="62" r="22" fill="url(#foliage-main)" />
            <circle cx="70" cy="62" r="22" fill="url(#foliage-main)" />
            <circle cx="55" cy="68" r="21" fill="url(#foliage-main)" />

            {/* Highlighted sunlit leaf tufts */}
            <ellipse cx="44" cy="38" rx="10" ry="7" fill="#A5D6A7" opacity="0.6" />
            <ellipse cx="64" cy="50" rx="9" ry="6" fill="#A5D6A7" opacity="0.5" />

            {/* Shiny Red Apples with specular points */}
            {/* Apple 1 */}
            <circle cx="42" cy="52" r="4.5" fill="url(#apple-shine)" stroke="#B71C1C" strokeWidth="0.5" />
            <circle cx="40.5" cy="50.5" r="1.2" fill="#FFF" opacity="0.8" />
            {/* Apple 2 */}
            <circle cx="68" cy="54" r="4.5" fill="url(#apple-shine)" stroke="#B71C1C" strokeWidth="0.5" />
            <circle cx="66.5" cy="52.5" r="1.2" fill="#FFF" opacity="0.8" />
            {/* Apple 3 */}
            <circle cx="54" cy="74" r="4.5" fill="url(#apple-shine)" stroke="#B71C1C" strokeWidth="0.5" />
            <circle cx="52.5" cy="72.5" r="1.2" fill="#FFF" opacity="0.8" />
            {/* Apple 4 */}
            <circle cx="33" cy="66" r="4.2" fill="url(#apple-shine)" stroke="#B71C1C" strokeWidth="0.5" />
            <circle cx="31.8" cy="64.8" r="1.1" fill="#FFF" opacity="0.8" />
            {/* Apple 5 */}
            <circle cx="78" cy="68" r="4.2" fill="url(#apple-shine)" stroke="#B71C1C" strokeWidth="0.5" />
            <circle cx="76.8" cy="66.8" r="1.1" fill="#FFF" opacity="0.8" />
          </svg>
        </div>
      );

    case 'hay_bale':
      return (
        <div className={`relative w-20 h-16 flex items-center justify-center filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.3)] ${isSelected ? 'scale-105' : ''}`}>
          <svg viewBox="0 0 84 64" className="w-full h-full overflow-visible pointer-events-none select-none">
            <defs>
              <linearGradient id="bale-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="60%" stopColor="#FDD835" />
                <stop offset="100%" stopColor="#FBC02D" />
              </linearGradient>
              <linearGradient id="bale-side-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>
              <linearGradient id="bale-side-right" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F57F17" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>

            {/* 3D Isometric Hay Block */}
            {/* Left face */}
            <polygon points="42,38 14,24 14,42 42,56" fill="url(#bale-side-left)" stroke="#E65100" strokeWidth="1" />
            {/* Right face */}
            <polygon points="42,38 70,24 70,42 42,56" fill="url(#bale-side-right)" stroke="#BF360C" strokeWidth="1" />
            {/* Top diamond */}
            <polygon points="42,10 70,24 42,38 14,24" fill="url(#bale-top)" stroke="#F57F17" strokeWidth="1" />

            {/* Straw texture lines */}
            <line x1="22" y1="28" x2="36" y2="35" stroke="#FFFDE7" strokeWidth="1" strokeLinecap="round" />
            <line x1="48" y1="35" x2="62" y2="28" stroke="#FFE082" strokeWidth="1" strokeLinecap="round" />

            {/* Twine binding bands */}
            <polyline points="28,17 35,21 35,50" fill="none" stroke="#D84315" strokeWidth="1.8" />
            <polyline points="56,17 49,21 49,50" fill="none" stroke="#D84315" strokeWidth="1.8" />
          </svg>
        </div>
      );

    case 'flower_red':
    case 'flower_yellow': {
      const isYellow = type === 'flower_yellow';
      return (
        <div className={`relative w-20 h-16 flex items-center justify-center filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.28)] ${isSelected ? 'scale-105' : ''}`}>
          <svg viewBox="0 0 84 64" className="w-full h-full overflow-visible pointer-events-none select-none">
            {/* Wooden Border Planter Diamond on Ground */}
            <polygon points="42,22 68,35 42,48 16,35" fill="#5D4037" stroke="#3E2723" strokeWidth="1.2" />
            <polygon points="42,25 64,36 42,47 20,36" fill="#3E2723" />

            {/* Soil loam inside planter */}
            <polygon points="42,27 61,36 42,45 23,36" fill="#2E1C14" />

            {/* Dense Green Leaves */}
            <ellipse cx="36" cy="35" rx="8" ry="4.5" fill="#388E3C" />
            <ellipse cx="48" cy="35" rx="8" ry="4.5" fill="#4CAF50" />
            <ellipse cx="42" cy="32" rx="7" ry="4" fill="#2E7D32" />
            <ellipse cx="42" cy="39" rx="8" ry="4.5" fill="#43A047" />

            {/* Blooming Flower Blossoms */}
            {/* Center Flower */}
            <circle cx="42" cy="30" r="5" fill={isYellow ? '#FFEB3B' : '#E53935'} stroke={isYellow ? '#F57F17' : '#B71C1C'} strokeWidth="0.8" />
            <circle cx="42" cy="30" r="2" fill={isYellow ? '#FF6F00' : '#FFD54F'} />

            {/* Left Flower */}
            <circle cx="32" cy="35" r="4.5" fill={isYellow ? '#FFF176' : '#FF5252'} stroke={isYellow ? '#F57F17' : '#C62828'} strokeWidth="0.8" />
            <circle cx="32" cy="35" r="1.8" fill={isYellow ? '#FF6F00' : '#FFD54F'} />

            {/* Right Flower */}
            <circle cx="52" cy="35" r="4.5" fill={isYellow ? '#FBC02D' : '#D32F2F'} stroke={isYellow ? '#F57F17' : '#B71C1C'} strokeWidth="0.8" />
            <circle cx="52" cy="35" r="1.8" fill={isYellow ? '#FF6F00' : '#FFD54F'} />
          </svg>
        </div>
      );
    }

    case 'fence_wood':
      return (
        <div className={`relative w-20 h-16 flex items-center justify-center filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.3)] ${isSelected ? 'scale-105' : ''}`}>
          <svg viewBox="0 0 84 64" className="w-full h-full overflow-visible pointer-events-none select-none">
            {/* Wooden Fence Section aligned isometrically */}
            {/* Post 1 (Left-back) */}
            <rect x="22" y="24" width="5" height="22" rx="1" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
            {/* Post 2 (Right-front) */}
            <rect x="58" y="38" width="5.5" height="22" rx="1" fill="#A1887F" stroke="#4E342E" strokeWidth="1" />

            {/* Horizontal Rails connecting posts */}
            <polygon points="24,28 61,42 61,46 24,32" fill="#BCAAA4" stroke="#5D4037" strokeWidth="1" />
            <polygon points="24,36 61,50 61,54 24,40" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
          </svg>
        </div>
      );

    case 'windmill':
      return (
        <div className={`relative w-36 h-44 flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.35)] ${isSelected ? 'scale-105' : ''}`}>
          <svg viewBox="0 0 160 180" className="w-full h-full overflow-visible pointer-events-none select-none">
            {/* Stone Base Ring */}
            <ellipse cx="80" cy="144" rx="42" ry="21" fill="#78909C" stroke="#37474F" strokeWidth="1.5" />
            <ellipse cx="80" cy="142" rx="38" ry="19" fill="#90A4AE" />

            {/* Tapered Stone Windmill Tower */}
            <polygon points="62,60 98,60 114,142 46,142" fill="#ECEFF1" stroke="#455A64" strokeWidth="1.5" />
            <polygon points="80,60 98,60 114,142 80,142" fill="#CFD8DC" />

            {/* Wooden Door */}
            <path d="M 74 142 L 74 122 Q 80 118 86 122 L 86 142 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />

            {/* Conical Roof */}
            <polygon points="56,62 80,24 104,62" fill="#D32F2F" stroke="#B71C1C" strokeWidth="1.5" />
            <polygon points="80,24 104,62 80,62" fill="#B71C1C" />

            {/* Rotating Windmill Sails Rotor */}
            <g className="animate-[spin_10s_linear_infinite]" style={{ transformOrigin: '80px 48px' }}>
              <circle cx="80" cy="48" r="4.5" fill="#FFB300" stroke="#E65100" strokeWidth="1" />
              {/* Sail 1 */}
              <polygon points="78,48 82,48 85,8 75,8" fill="#FFFDE7" stroke="#8D6E63" strokeWidth="1" />
              {/* Sail 2 */}
              <polygon points="80,46 80,50 120,53 120,43" fill="#FFFDE7" stroke="#8D6E63" strokeWidth="1" />
              {/* Sail 3 */}
              <polygon points="78,48 82,48 85,88 75,88" fill="#FFFDE7" stroke="#8D6E63" strokeWidth="1" />
              {/* Sail 4 */}
              <polygon points="80,46 80,50 40,53 40,43" fill="#FFFDE7" stroke="#8D6E63" strokeWidth="1" />
            </g>
          </svg>
        </div>
      );

    case 'tractor':
      return (
        <div className={`relative w-36 h-32 flex items-center justify-center filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.36)] ${isSelected ? 'scale-105' : ''}`}>
          <svg viewBox="0 0 160 140" className="w-full h-full overflow-visible pointer-events-none select-none">
            {/* Vintage Red Farm Tractor */}
            {/* Big Rear Left Tire */}
            <ellipse cx="106" cy="94" rx="20" ry="26" fill="#263238" stroke="#101416" strokeWidth="2" />
            <ellipse cx="106" cy="94" rx="10" ry="14" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1" />
            <circle cx="106" cy="94" r="3" fill="#FF1744" />

            {/* Front Left Tire */}
            <ellipse cx="50" cy="104" rx="11" ry="15" fill="#263238" stroke="#101416" strokeWidth="1.5" />
            <ellipse cx="50" cy="104" rx="5" ry="8" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1" />

            {/* Tractor Body Chassis Engine Hood */}
            <polygon points="46,84 96,76 102,96 46,98" fill="#D50000" stroke="#B71C1C" strokeWidth="1.5" />
            <polygon points="46,84 82,68 96,76 46,84" fill="#FF1744" />

            {/* Chrome Grille Front */}
            <polygon points="42,88 46,84 46,98 42,96" fill="#ECEFF1" stroke="#78909C" strokeWidth="1" />

            {/* Seat & Steering Wheel */}
            <path d="M 88 74 L 88 64 Q 92 62 96 66 L 96 74 Z" fill="#212121" />
            <line x1="82" y1="72" x2="80" y2="64" stroke="#78909C" strokeWidth="2" />
            <ellipse cx="79" cy="63" rx="4" ry="1.5" fill="#212121" stroke="#CFD8DC" strokeWidth="1" />

            {/* Chrome Vertical Exhaust Pipe */}
            <rect x="58" y="52" width="3" height="26" rx="1.5" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="0.8" />
            <ellipse cx="59.5" cy="52" rx="2" ry="1" fill="#455A64" />
          </svg>
        </div>
      );

    default:
      return (
        <div className="relative w-16 h-16 flex items-center justify-center text-3xl filter drop-shadow-md">
          🌻
        </div>
      );
  }
};
