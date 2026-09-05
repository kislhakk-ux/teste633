import React from 'react';
import { AnimalVisualProps } from './AnimalDefs';

export const IsoChickenModel: React.FC<AnimalVisualProps> = React.memo(({
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
      id={`chicken-${index}`}
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
        {/* 3D Chicken Body Gradient */}
        <radialGradient id={`chick-body-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFF8D" />
          <stop offset="45%" stopColor="#FFF176" />
          <stop offset="85%" stopColor="#FBC02D" />
          <stop offset="100%" stopColor="#F57F17" />
        </radialGradient>

        {/* 3D Wing Gradient */}
        <linearGradient id={`chick-wing-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="60%" stopColor="#FDD835" />
          <stop offset="100%" stopColor="#F57F17" />
        </linearGradient>

        {/* Glossy Red Comb Gradient */}
        <radialGradient id={`chick-comb-${index}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF5252" />
          <stop offset="60%" stopColor="#E53935" />
          <stop offset="100%" stopColor="#B71C1C" />
        </radialGradient>

        {/* Egg Shell Gradient */}
        <radialGradient id={`egg-white-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#CFD8DC" />
        </radialGradient>

        <radialGradient id={`egg-brown-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="50%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFB74D" />
        </radialGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse cx="0" cy="8" rx="14" ry="6.5" fill="rgba(0,0,0,0.28)" />

      {/* 2. Nest of Golden Straw with 3 Large Glossy Eggs (When Ready) */}
      {isReady && (
        <g id="egg-nest" className="animate-golden-sparkle">
          {/* Straw Nest Cushion */}
          <ellipse cx="0" cy="9" rx="16" ry="8" fill="#FDD835" stroke="#F57F17" strokeWidth="1.2" />
          <path d="M -15 8 Q -18 3 -12 7 M 15 8 Q 18 3 12 7" stroke="#FFD54F" strokeWidth="2" fill="none" />

          {/* Left White Egg */}
          <g transform="translate(-6, 5) rotate(-15)">
            <ellipse cx="0" cy="0" rx="4.5" ry="6" fill={`url(#egg-white-${index})`} stroke="#B0BEC5" strokeWidth="0.8" />
            <ellipse cx="-1.5" cy="-2" rx="1.5" ry="2.2" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Right Golden Egg */}
          <g transform="translate(6, 5) rotate(15)">
            <ellipse cx="0" cy="0" rx="4.5" ry="6" fill={`url(#egg-brown-${index})`} stroke="#FFA726" strokeWidth="0.8" />
            <ellipse cx="-1.5" cy="-2" rx="1.5" ry="2.2" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Center Front White Egg */}
          <g transform="translate(0, 7)">
            <ellipse cx="0" cy="0" rx="4.2" ry="5.8" fill={`url(#egg-white-${index})`} stroke="#B0BEC5" strokeWidth="0.8" />
            <ellipse cx="-1.2" cy="-2" rx="1.4" ry="2" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Golden Sparkle Stars */}
          <g transform="translate(14, -8)">
            <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
          </g>
          <g transform="translate(-14, -6)">
            <path d="M 0 -3 L 0.8 -0.8 L 3 0 L 0.8 0.8 L 0 3 L -0.8 0.8 L -3 0 L -0.8 -0.8 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
          </g>
        </g>
      )}

      {/* 3. Chicken Body Group (with head pecking & wing flapping) */}
      <g className={isFed && !isReady ? 'animate-chicken-peck' : ''}>
        {/* Fluffy Tail Feathers */}
        <path
          d="M -10 -2 Q -18 -10 -15 -14 Q -10 -8 -8 -4"
          fill="#FFF59D"
          stroke="#F57F17"
          strokeWidth="1"
        />
        <path
          d="M -9 1 Q -16 -4 -13 -8 Q -8 -3 -7 0"
          fill="#FFEE58"
          stroke="#F57F17"
          strokeWidth="1"
        />

        {/* Chubby Round Chicken Body with 3D Radial Lighting */}
        <circle cx="0" cy="0" r="11" fill={`url(#chick-body-${index})`} stroke="#F57F17" strokeWidth="1.2" />

        {/* Specular Highlight on Body (Giving 3D Vinyl Toy look) */}
        <ellipse cx="-3.5" cy="-3.5" rx="4.5" ry="3" fill="#FFFFFF" opacity="0.75" />

        {/* Fluffy 3D Wing (Animated flapping) */}
        <g className={isFed && !isReady ? 'animate-chicken-wing' : ''}>
          <ellipse
            cx="-1.5"
            cy="1.5"
            rx="6.5"
            ry="4.8"
            fill={`url(#chick-wing-${index})`}
            stroke="#F57F17"
            strokeWidth="1"
            transform="rotate(-15 -1.5 1.5)"
          />
          <path d="M -5 0 Q -2 4 2 2" stroke="#E65100" strokeWidth="0.8" fill="none" />
          <ellipse cx="-2.5" cy="0" rx="3" ry="1.8" fill="#FFFFFF" opacity="0.6" />
        </g>

        {/* Chicken Head */}
        <g transform="translate(8, -6)">
          <circle cx="0" cy="0" r="6.8" fill={`url(#chick-body-${index})`} stroke="#F57F17" strokeWidth="1.2" />
          <ellipse cx="-1.5" cy="-2.5" rx="2.5" ry="1.5" fill="#FFFFFF" opacity="0.8" />

          {/* Big Glossy Cartoon Eye */}
          <circle cx="1.5" cy="-1.5" r="2.4" fill="#FFFFFF" stroke="#212121" strokeWidth="0.7" />
          <circle cx="2" cy="-1.5" r="1.5" fill="#212121" />
          {/* Dual Specular Catchlights */}
          <circle cx="1.6" cy="-2.2" r="0.7" fill="#FFFFFF" />
          <circle cx="2.6" cy="-1" r="0.35" fill="#FFFFFF" />

          {/* Red 3D Comb on Crown */}
          <g id="comb">
            <circle cx="-3" cy="-6.5" r="2.4" fill={`url(#chick-comb-${index})`} stroke="#B71C1C" strokeWidth="0.6" />
            <circle cx="0.5" cy="-7.5" r="2.8" fill={`url(#chick-comb-${index})`} stroke="#B71C1C" strokeWidth="0.6" />
            <circle cx="3.8" cy="-6" r="2.2" fill={`url(#chick-comb-${index})`} stroke="#B71C1C" strokeWidth="0.6" />
            <circle cx="0.2" cy="-8.5" r="0.8" fill="#FFFFFF" opacity="0.7" />
          </g>

          {/* Red Wattle Under Beak */}
          <g id="wattle">
            <circle cx="2" cy="4" r="2.2" fill={`url(#chick-comb-${index})`} stroke="#B71C1C" strokeWidth="0.6" />
            <circle cx="3.8" cy="4.2" r="1.8" fill={`url(#chick-comb-${index})`} stroke="#B71C1C" strokeWidth="0.6" />
          </g>

          {/* Chunky Orange Cartoon Beak */}
          <polygon points="3.5,-1 9.5,1 3.5,3.2" fill="#FF9800" stroke="#E65100" strokeWidth="0.8" />
          <line x1="3.5" y1="1" x2="8" y2="1" stroke="#BF360C" strokeWidth="0.7" />
          <ellipse cx="5" cy="0" rx="1.2" ry="0.6" fill="#FFE082" />
        </g>

        {/* Cute Yellow/Orange Feet */}
        {!isReady && (
          <g id="feet">
            <line x1="-3" y1="8" x2="-3" y2="13" stroke="#FF9800" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="-3" y1="13" x2="-6" y2="14" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
            <line x1="-3" y1="13" x2="0" y2="14" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />

            <line x1="3" y1="8" x2="3" y2="13" stroke="#FF9800" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="3" y1="13" x2="0" y2="14" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="13" x2="6" y2="14" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* 4. Hungry Thought Bubble ("🌾") when not fed */}
      {!isFed && (
        <g id="hungry-bubble" className="animate-thought-float" transform="translate(10, -22)">
          <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#FFA000" strokeWidth="1.2" />
          <circle cx="-4" cy="7" r="2" fill="#FFFFFF" stroke="#FFA000" strokeWidth="0.8" />
          <circle cx="-7" cy="11" r="1.2" fill="#FFFFFF" />
          <text x="0" y="3.5" fontSize="9" textAnchor="middle">🌾</text>
        </g>
      )}

      {/* 5. Speech Bubble on Tap */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(0, -26)" className="animate-in zoom-in duration-150">
          <rect x="-24" y="-12" width="48" height="14" rx="7" fill="#2E7D32" stroke="#FFFFFF" strokeWidth="1.2" />
          <polygon points="-3,2 3,2 0,5" fill="#2E7D32" />
          <text x="0" y="-2" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
