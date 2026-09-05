import React from 'react';
import { AnimalVisualProps } from './AnimalDefs';

export const IsoSheepModel: React.FC<AnimalVisualProps> = React.memo(({
  x,
  y,
  isFed,
  isReady,
  bubbleText,
  onTap,
  index,
}) => {
  return (
    <g
      id={`sheep-${index}`}
      transform={`translate(${x}, ${y})`}
      className={`cursor-pointer transition-transform duration-200 select-none ${
        isReady ? 'animate-animal-ready' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onTap(index);
      }}
    >
      <defs>
        {/* 3D Fluffy Wool Fleece Gradient */}
        <radialGradient id={`wool-cloud-${index}`} cx="40%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F5F5F5" />
          <stop offset="85%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#BDBDBD" />
        </radialGradient>

        {/* 3D Black Velvet Sheep Face & Ears */}
        <radialGradient id={`sheep-face-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#424242" />
          <stop offset="65%" stopColor="#263238" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </radialGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse cx="2" cy="11" rx="19" ry="6.5" fill="rgba(0,0,0,0.28)" />

      {/* 2. Dainty Black Hooved Legs */}
      <g id="sheep-legs">
        {/* Back legs */}
        <rect x="-10" y="5" width="4.2" height="9" rx="2" fill="#263238" stroke="#1A1A1A" strokeWidth="0.8" />
        <rect x="-10" y="11.5" width="4.2" height="2.5" rx="1" fill="#000000" />

        <rect x="-2" y="6" width="4.2" height="9" rx="2" fill="#263238" stroke="#1A1A1A" strokeWidth="0.8" />
        <rect x="-2" y="12.5" width="4.2" height="2.5" rx="1" fill="#000000" />

        {/* Front legs */}
        <rect x="6" y="5" width="4.2" height="9" rx="2" fill="#37474F" stroke="#1A1A1A" strokeWidth="0.8" />
        <rect x="6" y="11.5" width="4.2" height="2.5" rx="1" fill="#000000" />

        <rect x="12" y="6" width="4" height="8.5" rx="2" fill="#37474F" stroke="#1A1A1A" strokeWidth="0.8" />
        <rect x="12" y="12" width="4" height="2.5" rx="1" fill="#000000" />
      </g>

      {/* 3. Main Fluffy 3D Cloud Wool Fleece Body */}
      <g id="wool-fleece">
        {/* Outer Cloud Puffs creating ultra-plump volumetric silhouette */}
        <circle cx="-10" cy="-4" r="6.5" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="-5" cy="-7" r="7" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="2" cy="-7" r="7" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="8" cy="-5" r="6.5" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="12" cy="1" r="6" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="8" cy="5" r="6" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="0" cy="6" r="6.5" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="-8" cy="4" r="6.5" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />
        <circle cx="-13" cy="0" r="6" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />

        {/* Center Plump Fill */}
        <ellipse cx="0" cy="0" rx="12" ry="9" fill={`url(#wool-cloud-${index})`} />

        {/* Specular Highlight Puffs */}
        <circle cx="-4" cy="-4" r="2.8" fill="#FFFFFF" opacity="0.8" />
        <circle cx="3" cy="-4" r="2.5" fill="#FFFFFF" opacity="0.8" />
      </g>

      {/* 4. Tiny Tail Puff */}
      <circle cx="-14" cy="2" r="3.2" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.8" />

      {/* 5. 3D Velvet Sheep Face & Head */}
      <g id="sheep-head" transform="translate(11, -3)">
        {/* Head Base */}
        <ellipse cx="0" cy="0" rx="7.2" ry="6.2" fill={`url(#sheep-face-${index})`} stroke="#1A1A1A" strokeWidth="0.8" />

        {/* Fluffy Wool Forelock (Crown of curls) */}
        <circle cx="-2" cy="-6" r="3" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.6" />
        <circle cx="2" cy="-6.5" r="3.5" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.6" />
        <circle cx="5" cy="-5.5" r="2.8" fill={`url(#wool-cloud-${index})`} stroke="#BDBDBD" strokeWidth="0.6" />

        {/* Floppy Drooping Velvet Ears */}
        <ellipse cx="-6" cy="-2" rx="4.5" ry="2.2" fill={`url(#sheep-face-${index})`} stroke="#1A1A1A" strokeWidth="0.6" transform="rotate(-30 -6 -2)" />
        <ellipse cx="6" cy="-2" rx="4.5" ry="2.2" fill={`url(#sheep-face-${index})`} stroke="#1A1A1A" strokeWidth="0.6" transform="rotate(30 6 -2)" />

        {/* Big Expressive 3D Cartoon Eye */}
        <g id="sheep-eye" transform="translate(1.5, -2)">
          <circle cx="0" cy="0" r="2.6" fill="#FFFFFF" stroke="#000000" strokeWidth="0.6" />
          <circle cx="0.4" cy="0" r="1.6" fill="#3E2723" />
          <circle cx="0.6" cy="0" r="1" fill="#000000" />
          <circle cx="0" cy="-0.6" r="0.7" fill="#FFFFFF" />
          <circle cx="0.9" cy="0.3" r="0.3" fill="#FFFFFF" />
        </g>

        {/* Snout with Chewing Motion when fed */}
        <g className={isFed && !isReady ? 'animate-cow-chew' : ''} transform="translate(4.5, 2.5)">
          <ellipse cx="0" cy="0" rx="4" ry="2.8" fill="#37474F" />
          {/* Nostrils */}
          <circle cx="-1.2" cy="0" r="0.8" fill="#1A1A1A" />
          <circle cx="1.2" cy="0" r="0.8" fill="#1A1A1A" />
          {/* Fresh Green Grass Strand in mouth when fed */}
          {isFed && (
            <g transform="translate(3, 1) scale(0.65)">
              <line x1="0" y1="0" x2="5" y2="-2" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="5" cy="-2" r="1.8" fill="#81C784" />
            </g>
          )}
        </g>
      </g>

      {/* 6. Ready Wool Harvest Sparkles (No floating text badges!) */}
      {isReady && (
        <g id="wool-ready-sparkle" className="animate-golden-sparkle">
          <g transform="translate(16, -12)">
            <path d="M 0 -3 L 0.8 -0.8 L 3 0 L 0.8 0.8 L 0 3 L -0.8 0.8 L -3 0 L -0.8 -0.8 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.4" />
          </g>
          <g transform="translate(-14, -10)">
            <path d="M 0 -2.5 L 0.6 -0.6 L 2.5 0 L 0.6 0.6 L 0 2.5 L -0.6 0.6 L -2.5 0 L -0.6 -0.6 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.4" />
          </g>
        </g>
      )}

      {/* 7. Compact Speech Bubble on direct Tap */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(0, -18)" className="animate-in zoom-in duration-150">
          <rect x="-22" y="-10" width="44" height="13" rx="6.5" fill="#37474F" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="-2,3 2,3 0,5" fill="#37474F" />
          <text x="0" y="-1" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
