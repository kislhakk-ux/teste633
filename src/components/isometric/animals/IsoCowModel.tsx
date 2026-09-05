import React from 'react';
import { AnimalVisualProps } from './AnimalDefs';

export const IsoCowModel: React.FC<AnimalVisualProps> = React.memo(({
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
      id={`cow-${index}`}
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
        {/* 3D Cow Body Lighting */}
        <radialGradient id={`cow-body-${index}`} cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F5F5F5" />
          <stop offset="85%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#B0BEC5" />
        </radialGradient>

        {/* 3D Dark Cow Patch */}
        <radialGradient id={`cow-spot-${index}`} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#455A64" />
          <stop offset="55%" stopColor="#263238" />
          <stop offset="100%" stopColor="#1A2024" />
        </radialGradient>

        {/* 3D Pink Snout & Udder */}
        <radialGradient id={`cow-pink-${index}`} cx="38%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="55%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#C2185B" />
        </radialGradient>

        {/* 3D Golden Brass Bell */}
        <linearGradient id={`cow-bell-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="35%" stopColor="#FFD54F" />
          <stop offset="75%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>

        {/* Stainless Steel Milk Pail */}
        <linearGradient id={`milk-pail-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ECEFF1" />
          <stop offset="50%" stopColor="#CFD8DC" />
          <stop offset="85%" stopColor="#90A4AE" />
          <stop offset="100%" stopColor="#607D8B" />
        </linearGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse cx="2" cy="12" rx="20" ry="7" fill="rgba(0,0,0,0.3)" />

      {/* 2. Stainless Steel Milk Canister sitting in straw when Ready (No floating text!) */}
      {isReady && (
        <g id="milk-can" transform="translate(18, 2)">
          {/* Can shadow */}
          <ellipse cx="0" cy="8" rx="6" ry="2.5" fill="rgba(0,0,0,0.25)" />
          {/* Main Can body */}
          <polygon points="-4,-2 4,-2 5,7 -5,7" fill={`url(#milk-pail-${index})`} stroke="#455A64" strokeWidth="0.8" />
          {/* Top neck & lid */}
          <ellipse cx="0" cy="-2" rx="4" ry="1.8" fill="#ECEFF1" stroke="#455A64" strokeWidth="0.6" />
          <rect x="-2.5" y="-5" width="5" height="3" rx="1" fill={`url(#milk-pail-${index})`} stroke="#455A64" strokeWidth="0.6" />
          {/* Wire bail handle */}
          <path d="M -4 1 Q 0 -6 4 1" stroke="#37474F" strokeWidth="0.8" fill="none" />
          {/* Fresh white milk shimmer inside rim */}
          <ellipse cx="0" cy="-3.5" rx="2" ry="0.8" fill="#FFFFFF" />
          {/* Compact sparkle star */}
          <path d="M 5 -4 L 5.5 -2.5 L 7 -2 L 5.5 -1.5 L 5 0 L 4.5 -1.5 L 3 -2 L 4.5 -2.5 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.3" />
        </g>
      )}

      {/* 3. Swishing Tail */}
      <g id="cow-tail" transform="translate(-14, 0)" className="animate-tail-swish">
        <path d="M 0 0 Q -7 6 -5 13" stroke="#37474F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="-5" cy="14" rx="2.5" ry="3.8" fill={`url(#cow-spot-${index})`} />
      </g>

      {/* 4. Chunky Legs & Hooves */}
      <g id="cow-legs">
        {/* Back Legs */}
        <rect x="-11" y="4" width="4.8" height="10" rx="1.5" fill="#ECEFF1" stroke="#37474F" strokeWidth="0.8" />
        <rect x="-11" y="11" width="4.8" height="3.5" rx="1" fill="#263238" />

        <rect x="-3" y="6" width="4.8" height="10" rx="1.5" fill="#ECEFF1" stroke="#37474F" strokeWidth="0.8" />
        <rect x="-3" y="13" width="4.8" height="3.5" rx="1" fill="#263238" />

        {/* Front Legs */}
        <rect x="6" y="4" width="4.8" height="10" rx="1.5" fill="#FFFFFF" stroke="#37474F" strokeWidth="0.8" />
        <rect x="6" y="11" width="4.8" height="3.5" rx="1" fill="#263238" />

        <rect x="13" y="6" width="4.5" height="9.5" rx="1.5" fill="#FFFFFF" stroke="#37474F" strokeWidth="0.8" />
        <rect x="13" y="12.5" width="4.5" height="3.5" rx="1" fill="#263238" />
      </g>

      {/* 5. Plump Udder */}
      <g id="udder" transform="translate(-5, 7)">
        <ellipse cx="0" cy="0" rx="6.5" ry="4.5" fill={`url(#cow-pink-${index})`} stroke="#C2185B" strokeWidth="0.9" />
        {/* Teats */}
        <ellipse cx="-3.5" cy="4" rx="1.2" ry="2.2" fill={`url(#cow-pink-${index})`} />
        <ellipse cx="-1" cy="4.5" rx="1.2" ry="2.2" fill={`url(#cow-pink-${index})`} />
        <ellipse cx="1.5" cy="4.5" rx="1.2" ry="2.2" fill={`url(#cow-pink-${index})`} />
        <ellipse cx="4" cy="4" rx="1.2" ry="2.2" fill={`url(#cow-pink-${index})`} />
      </g>

      {/* 6. Main Chubby 3D Barrel Body */}
      <g id="cow-body">
        <ellipse cx="0" cy="0" rx="17" ry="11" fill={`url(#cow-body-${index})`} stroke="#37474F" strokeWidth="1" />
        {/* Specular 3D Highlight Curve */}
        <ellipse cx="-4" cy="-4" rx="10" ry="4" fill="#FFFFFF" opacity="0.65" />

        {/* Distinctive Organic Black Cow Patches */}
        <path
          d="M -12 -5 Q -8 -9 -3 -6 Q 0 -3 -2 2 Q -7 5 -11 1 Z"
          fill={`url(#cow-spot-${index})`}
        />
        <path
          d="M 3 -8 Q 9 -7 8 -2 Q 6 3 2 1 Z"
          fill={`url(#cow-spot-${index})`}
        />
        <ellipse cx="-6" cy="5" rx="4" ry="2.5" fill={`url(#cow-spot-${index})`} />
      </g>

      {/* 7. Golden Brass Cowbell on Leather Collar */}
      <g id="cowbell" transform="translate(10, 4)">
        {/* Leather Strap */}
        <path d="M 0 -7 Q 3 2 1 6" stroke="#8D6E63" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* Bell */}
        <polygon points="-3,5 3,5 4,11 -4,11" fill={`url(#cow-bell-${index})`} stroke="#BF360C" strokeWidth="0.8" />
        <ellipse cx="0" cy="11" rx="4" ry="1.5" fill="#FF8F00" stroke="#BF360C" strokeWidth="0.6" />
        <circle cx="0" cy="11.5" r="1" fill="#4E342E" />
      </g>

      {/* 8. 3D Cartoon Cow Head */}
      <g id="cow-head" transform="translate(14, -6)">
        {/* Head Base */}
        <ellipse cx="0" cy="0" rx="9" ry="8.5" fill={`url(#cow-body-${index})`} stroke="#37474F" strokeWidth="1" />

        {/* Head Dark Spot across forehead */}
        <path d="M -5 -7 Q 1 -8 3 -4 Q 0 1 -4 -1 Z" fill={`url(#cow-spot-${index})`} />

        {/* Cute Ivory Horns */}
        <path d="M -5 -7 Q -7 -13 -3 -12" stroke="#FFF9C4" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 3 -7 Q 5 -13 9 -11" stroke="#FFF9C4" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Floppy 3D Ears */}
        {/* Left Ear */}
        <g transform="translate(-8, -4) rotate(-22)">
          <ellipse cx="0" cy="0" rx="5" ry="2.8" fill={`url(#cow-body-${index})`} stroke="#37474F" strokeWidth="0.8" />
          <ellipse cx="0" cy="0" rx="3.2" ry="1.6" fill={`url(#cow-pink-${index})`} />
        </g>
        {/* Right Ear */}
        <g transform="translate(7, -5) rotate(24)">
          <ellipse cx="0" cy="0" rx="5" ry="2.8" fill={`url(#cow-body-${index})`} stroke="#37474F" strokeWidth="0.8" />
          <ellipse cx="0" cy="0" rx="3.2" ry="1.6" fill={`url(#cow-pink-${index})`} />
        </g>

        {/* Expressive Big 3D Cartoon Eye */}
        <g id="cow-eye" transform="translate(2, -3)">
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" stroke="#212121" strokeWidth="0.7" />
          <circle cx="0.5" cy="0" r="1.8" fill="#3E2723" />
          <circle cx="0.7" cy="0" r="1.1" fill="#1A1A1A" />
          {/* Double Specular Catchlights */}
          <circle cx="0" cy="-0.8" r="0.8" fill="#FFFFFF" />
          <circle cx="1.2" cy="0.4" r="0.35" fill="#FFFFFF" />
        </g>

        {/* Pink Snout / Muzzle with cute Chewing Motion when fed */}
        <g id="snout" className={isFed && !isReady ? 'animate-cow-chew' : ''} transform="translate(5, 3)">
          <ellipse cx="0" cy="0" rx="6.5" ry="4.8" fill={`url(#cow-pink-${index})`} stroke="#C2185B" strokeWidth="1" />
          <ellipse cx="-1.2" cy="-1.5" rx="3" ry="1.3" fill="#FFFFFF" opacity="0.65" />
          {/* Nostrils */}
          <circle cx="-1.8" cy="0.2" r="1.1" fill="#880E4F" />
          <circle cx="1.8" cy="0.2" r="1.1" fill="#880E4F" />
          {/* Smile */}
          <path d="M -2.5 2 Q 0 3.8 2.5 2" stroke="#880E4F" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          {/* Fresh green clover in mouth when fed */}
          {isFed && (
            <g transform="translate(3.5, 2) scale(0.65)">
              <circle cx="2" cy="-1" r="2" fill="#7CB342" />
              <circle cx="4" cy="1" r="2" fill="#7CB342" />
              <line x1="0" y1="0" x2="3" y2="0" stroke="#558B2F" strokeWidth="1" />
            </g>
          )}
        </g>
      </g>

      {/* 9. Compact Speech Bubble on direct Tap */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(4, -20)" className="animate-in zoom-in duration-150">
          <rect x="-22" y="-10" width="44" height="13" rx="6.5" fill="#1565C0" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="-2,3 2,3 0,5" fill="#1565C0" />
          <text x="0" y="-1" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
