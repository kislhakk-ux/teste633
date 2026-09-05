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
      className={`cursor-pointer transition-transform duration-200 ${
        isReady ? 'animate-animal-ready' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onTap(index);
      }}
    >
      <defs>
        {/* 3D Wool Cloud Gradient */}
        <radialGradient id={`wool-puff-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#ECEFF1" />
          <stop offset="90%" stopColor="#CFD8DC" />
          <stop offset="100%" stopColor="#90A4AE" />
        </radialGradient>

        {/* 3D Sheep Head Dark Slate Gradient */}
        <radialGradient id={`sheep-face-${index}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#546E7A" />
          <stop offset="60%" stopColor="#37474F" />
          <stop offset="100%" stopColor="#212121" />
        </radialGradient>

        {/* Shears Gold Gradient */}
        <linearGradient id={`shears-gold-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="50%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse cx="0" cy="11" rx="20" ry="7.5" fill="rgba(0,0,0,0.28)" />

      {/* 2. Slender Black Trotter Legs */}
      <g id="sheep-legs">
        {/* Back Legs */}
        <rect x="-9" y="7" width="4" height="10" rx="1.5" fill="#37474F" stroke="#212121" strokeWidth="0.8" />
        <rect x="-9" y="14" width="4" height="3" fill="#212121" />

        <rect x="-2" y="8" width="4" height="10" rx="1.5" fill="#455A64" stroke="#212121" strokeWidth="0.8" />
        <rect x="-2" y="15" width="4" height="3" fill="#212121" />

        {/* Front Legs */}
        <rect x="5" y="7" width="4" height="10" rx="1.5" fill="#37474F" stroke="#212121" strokeWidth="0.8" />
        <rect x="5" y="14" width="4" height="3" fill="#212121" />

        <rect x="11" y="8" width="4" height="10" rx="1.5" fill="#455A64" stroke="#212121" strokeWidth="0.8" />
        <rect x="11" y="15" width="4" height="3" fill="#212121" />
      </g>

      {/* 3. Cloud-like Fluffy Wool Body (with breathing animation) */}
      <g className={isFed && !isReady ? 'animate-sheep-breathe' : ''}>
        {/* Overlapping Volumetric Puffs of Wool */}
        {/* Back Puffs */}
        <circle cx="-10" cy="-6" r={isReady ? 9.5 : 8} fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="1" />
        <circle cx="-2" cy="-9" r={isReady ? 10 : 8.5} fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="1" />
        <circle cx="7" cy="-7" r={isReady ? 9.5 : 8} fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="1" />

        {/* Lower Puffs */}
        <circle cx="-11" cy="4" r={isReady ? 9 : 7.5} fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="1" />
        <circle cx="-3" cy="6" r={isReady ? 9.5 : 8} fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="1" />
        <circle cx="6" cy="5" r={isReady ? 9 : 7.5} fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="1" />

        {/* Central Core Puff */}
        <circle cx="-2" cy="-1" r={isReady ? 13 : 11} fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="1.2" />

        {/* Specular White Highlights on Puffs */}
        <circle cx="-5" cy="-5" r="4.5" fill="#FFFFFF" opacity="0.85" />
        <circle cx="2" cy="-6" r="3.5" fill="#FFFFFF" opacity="0.85" />
        <circle cx="-7" cy="2" r="3.2" fill="#FFFFFF" opacity="0.75" />

        {/* Extra Puffy Cloud Puffs when Ready to Shear! */}
        {isReady && (
          <g id="super-fluffy-wool">
            <circle cx="-14" cy="-1" r="6" fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="0.8" />
            <circle cx="11" cy="-2" r="6" fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="0.8" />
            <circle cx="-2" cy="-12" r="5" fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="0.8" />
          </g>
        )}

        {/* Sheep Head with Nibbling Motion */}
        <g
          id="sheep-head"
          transform="translate(15, -4)"
          className={isFed && !isReady ? 'animate-sheep-nibble' : ''}
        >
          {/* Droopy Slate Black Ears */}
          <ellipse cx="-4" cy="-2" rx="3.2" ry="6" fill={`url(#sheep-face-${index})`} stroke="#212121" strokeWidth="0.8" transform="rotate(25 -4 -2)" />
          <ellipse cx="-4" cy="-2" rx="1.8" ry="4" fill="#37474F" transform="rotate(25 -4 -2)" />

          {/* Head Base */}
          <ellipse cx="0" cy="0" rx="8" ry="7.2" fill={`url(#sheep-face-${index})`} stroke="#212121" strokeWidth="1.2" />
          <ellipse cx="-1.5" cy="-2.5" rx="3" ry="1.6" fill="#78909C" opacity="0.6" />

          {/* Forehead Fluffy Wool Crown Curls */}
          <circle cx="-2" cy="-6.5" r="3.8" fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="0.8" />
          <circle cx="2.5" cy="-6.2" r="3.6" fill={`url(#wool-puff-${index})`} stroke="#B0BEC5" strokeWidth="0.8" />
          <circle cx="0" cy="-5" r="3" fill="#FFFFFF" />

          {/* Cute Big Cartoon Eyes */}
          <circle cx="2" cy="-2.5" r="2.6" fill="#FFFFFF" stroke="#212121" strokeWidth="0.6" />
          <circle cx="2.5" cy="-2.5" r="1.6" fill="#000000" />
          <circle cx="1.8" cy="-3.1" r="0.7" fill="#FFFFFF" />
          <circle cx="2.8" cy="-2.1" r="0.35" fill="#FFFFFF" />

          {/* Muzzle / Nostrils / Smile */}
          <circle cx="6" cy="1" r="0.9" fill="#212121" />
          <path d="M 4 2.5 Q 6 4 7 2.5" stroke="#212121" strokeWidth="0.8" fill="none" strokeLinecap="round" />

          {/* Blade of Clover in mouth when fed */}
          {isFed && (
            <g transform="translate(6, 2.5) scale(0.65)">
              <line x1="0" y1="0" x2="6" y2="-2" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="-2" r="2" fill="#81C784" />
            </g>
          )}
        </g>
      </g>

      {/* 4. Ready for Shearing Celebration Overlay */}
      {isReady && (
        <g id="wool-ready" className="animate-golden-sparkle">
          {/* Floating Shears & Wool Skein Badge */}
          <g transform="translate(20, -22)">
            <rect x="-14" y="-8" width="28" height="15" rx="7.5" fill="#37474F" stroke={`url(#shears-gold-${index})`} strokeWidth="1.5" />
            <text x="0" y="3.5" fontSize="8.5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">✂️ Lã</text>
          </g>

          {/* Sparkle Stars */}
          <g transform="translate(-16, -14)">
            <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
          </g>
          <g transform="translate(8, -26)">
            <path d="M 0 -3 L 0.8 -0.8 L 3 0 L 0.8 0.8 L 0 3 L -0.8 0.8 L -3 0 L -0.8 -0.8 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
          </g>
        </g>
      )}

      {/* 5. Hungry Thought Bubble ("🌾") when not fed */}
      {!isFed && (
        <g id="hungry-bubble" className="animate-thought-float" transform="translate(14, -28)">
          <circle cx="0" cy="0" r="8.5" fill="#FFFFFF" stroke="#FFA000" strokeWidth="1.2" />
          <circle cx="-4" cy="7.5" r="2.2" fill="#FFFFFF" stroke="#FFA000" strokeWidth="0.8" />
          <circle cx="-7" cy="11.5" r="1.4" fill="#FFFFFF" />
          <text x="0" y="3.5" fontSize="9.5" textAnchor="middle">🌾</text>
        </g>
      )}

      {/* 6. Speech Bubble on Tap */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(2, -32)" className="animate-in zoom-in duration-150">
          <rect x="-24" y="-12" width="48" height="15" rx="7.5" fill="#455A64" stroke="#FFFFFF" strokeWidth="1.2" />
          <polygon points="-3,3 3,3 0,6" fill="#455A64" />
          <text x="0" y="-1.5" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
