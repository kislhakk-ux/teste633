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
      className={`cursor-pointer select-none transition-transform duration-200 ${
        isReady ? 'animate-animal-ready' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onTap(index);
      }}
    >
      <defs>
        {/* 3D Volumetric Body Lighting (Radial Gradient with Soft Underbelly Shadow) */}
        <radialGradient id={`chick-body-${index}`} cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFF8D" />
          <stop offset="35%" stopColor="#FFF176" />
          <stop offset="70%" stopColor="#FBC02D" />
          <stop offset="90%" stopColor="#F57F17" />
          <stop offset="100%" stopColor="#E65100" />
        </radialGradient>

        {/* 3D Feather Wing Gradient */}
        <linearGradient id={`chick-wing-${index}`} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="30%" stopColor="#FFF176" />
          <stop offset="70%" stopColor="#FBC02D" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>

        {/* Glossy Ruby-Red Comb & Wattle */}
        <radialGradient id={`chick-comb-${index}`} cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FF5252" />
          <stop offset="50%" stopColor="#E53935" />
          <stop offset="85%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#8E0000" />
        </radialGradient>

        {/* Glossy White Egg */}
        <radialGradient id={`egg-white-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F5F5F5" />
          <stop offset="85%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#B0BEC5" />
        </radialGradient>

        {/* Glossy Brown/Golden Egg */}
        <radialGradient id={`egg-brown-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF8E1" />
          <stop offset="40%" stopColor="#FFE0B2" />
          <stop offset="75%" stopColor="#FFB74D" />
          <stop offset="100%" stopColor="#E65100" />
        </radialGradient>
      </defs>

      {/* 1. Ambient Contact Ground Shadow */}
      <ellipse cx="0" cy="8.5" rx="13" ry="5.5" fill="rgba(0,0,0,0.32)" />

      {/* 2. Nest of Golden Straw with 3 Large Glossy Eggs (Rendered when Ready) */}
      {isReady && (
        <g id="egg-nest" className="animate-golden-sparkle">
          {/* Straw Nest Cushion */}
          <ellipse cx="0" cy="8" rx="15" ry="7.5" fill="#FDD835" stroke="#F57F17" strokeWidth="1.2" />
          {/* Individual Woven Straw Strands */}
          <path d="M -13 7 Q -16 3 -10 6 M 13 7 Q 16 3 10 6" stroke="#FFE082" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M -8 11 Q -6 13 0 11 M 8 11 Q 6 13 0 11" stroke="#FFB300" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Left White Ceramic Egg */}
          <g transform="translate(-5.5, 4.5) rotate(-14)">
            <ellipse cx="0" cy="0" rx="4.2" ry="5.6" fill={`url(#egg-white-${index})`} stroke="#B0BEC5" strokeWidth="0.7" />
            <ellipse cx="-1.2" cy="-1.8" rx="1.3" ry="2" fill="#FFFFFF" opacity="0.95" />
          </g>

          {/* Right Golden Ceramic Egg */}
          <g transform="translate(5.5, 4.5) rotate(14)">
            <ellipse cx="0" cy="0" rx="4.2" ry="5.6" fill={`url(#egg-brown-${index})`} stroke="#FFA726" strokeWidth="0.7" />
            <ellipse cx="-1.2" cy="-1.8" rx="1.3" ry="2" fill="#FFFFFF" opacity="0.95" />
          </g>

          {/* Center Foreground White Egg */}
          <g transform="translate(0, 6.5)">
            <ellipse cx="0" cy="0" rx="4" ry="5.4" fill={`url(#egg-white-${index})`} stroke="#B0BEC5" strokeWidth="0.7" />
            <ellipse cx="-1" cy="-1.8" rx="1.2" ry="1.8" fill="#FFFFFF" opacity="0.95" />
          </g>

          {/* Compact Golden Sparkle Stars within Nest */}
          <g transform="translate(11, -3)">
            <path d="M 0 -3 L 0.8 -0.8 L 3 0 L 0.8 0.8 L 0 3 L -0.8 0.8 L -3 0 L -0.8 -0.8 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.4" />
          </g>
          <g transform="translate(-11, -2)">
            <path d="M 0 -2.5 L 0.6 -0.6 L 2.5 0 L 0.6 0.6 L 0 2.5 L -0.6 0.6 L -2.5 0 L -0.6 -0.6 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.4" />
          </g>
        </g>
      )}

      {/* 3. Main Chicken Body Group (Pecking & Wing Flapping Animations) */}
      <g className={isFed && !isReady ? 'animate-chicken-peck' : ''}>
        {/* Fluffy Tail Feathers (3 Layered Plumes) */}
        <g id="tail-feathers">
          <path d="M -9 -2 Q -16 -10 -13 -13 Q -9 -7 -7 -3" fill="#FFF59D" stroke="#F57F17" strokeWidth="1" />
          <path d="M -8 0 Q -15 -5 -12 -9 Q -8 -3 -6 0" fill="#FFEE58" stroke="#F57F17" strokeWidth="1" />
          <path d="M -8 3 Q -13 0 -11 -3 Q -7 0 -6 2" fill="#FDD835" stroke="#F57F17" strokeWidth="0.8" />
        </g>

        {/* Chubby Round Chicken Body with 3D Radial Lighting */}
        <circle cx="0" cy="0" r="10.8" fill={`url(#chick-body-${index})`} stroke="#E65100" strokeWidth="1" />

        {/* Underbelly Depth Shadow */}
        <ellipse cx="1" cy="6" rx="7.5" ry="3.2" fill="#E65100" opacity="0.25" />

        {/* Specular Highlight on Body (3D Vinyl Sheen) */}
        <ellipse cx="-3" cy="-3.5" rx="4.2" ry="2.6" fill="#FFFFFF" opacity="0.8" />

        {/* 3D Scalloped Wing (Animated Flapping) */}
        <g className={isFed && !isReady ? 'animate-chicken-wing' : ''}>
          {/* Wing Shadow underneath */}
          <ellipse cx="-1.5" cy="2.5" rx="6.5" ry="4.5" fill="rgba(0,0,0,0.15)" transform="rotate(-15 -1.5 2.5)" />
          {/* Main Wing Body */}
          <path
            d="M -6 -1 Q -3 -3 2 -2 Q 4 1 2 4 Q -2 6 -6 4 Q -8 2 -6 -1 Z"
            fill={`url(#chick-wing-${index})`}
            stroke="#E65100"
            strokeWidth="0.9"
            transform="rotate(-12 -1 1)"
          />
          {/* Wing Feather Scallops */}
          <path d="M -4 1 Q -1 4 2 2" stroke="#BF360C" strokeWidth="0.8" fill="none" />
          <path d="M -5 3 Q -2 5 1 4" stroke="#BF360C" strokeWidth="0.7" fill="none" />
          {/* Specular Gleam on Wing */}
          <ellipse cx="-2.5" cy="-0.5" rx="2.8" ry="1.4" fill="#FFFFFF" opacity="0.65" />
        </g>

        {/* Chicken Head Group */}
        <g transform="translate(7.5, -5.5)">
          {/* Head Base */}
          <circle cx="0" cy="0" r="6.6" fill={`url(#chick-body-${index})`} stroke="#E65100" strokeWidth="1" />
          {/* Head Specular Highlight */}
          <ellipse cx="-1.5" cy="-2.4" rx="2.4" ry="1.4" fill="#FFFFFF" opacity="0.85" />

          {/* Big Expressive 3D Cartoon Eye */}
          <circle cx="1.6" cy="-1.4" r="2.5" fill="#FFFFFF" stroke="#212121" strokeWidth="0.7" />
          {/* Warm Dark Iris */}
          <circle cx="2.1" cy="-1.4" r="1.6" fill="#3E2723" />
          {/* Deep Black Pupil */}
          <circle cx="2.3" cy="-1.4" r="1" fill="#1A1A1A" />
          {/* Dual Crisp Specular Catchlights (Pixar Eye Shine) */}
          <circle cx="1.7" cy="-2.1" r="0.75" fill="#FFFFFF" />
          <circle cx="2.7" cy="-0.9" r="0.35" fill="#FFFFFF" />

          {/* Ruby-Red 3D Comb on Crown (3 Rounded Lobes with Gloss Spots) */}
          <g id="comb">
            <circle cx="-2.8" cy="-6.2" r="2.2" fill={`url(#chick-comb-${index})`} stroke="#8E0000" strokeWidth="0.5" />
            <circle cx="0.6" cy="-7.2" r="2.6" fill={`url(#chick-comb-${index})`} stroke="#8E0000" strokeWidth="0.5" />
            <circle cx="3.8" cy="-5.8" r="2" fill={`url(#chick-comb-${index})`} stroke="#8E0000" strokeWidth="0.5" />
            {/* Comb Specular Highlights */}
            <circle cx="0.4" cy="-8.2" r="0.7" fill="#FFFFFF" opacity="0.75" />
            <circle cx="-2.8" cy="-7" r="0.5" fill="#FFFFFF" opacity="0.75" />
          </g>

          {/* Ruby-Red Wattle Under Beak */}
          <g id="wattle">
            <circle cx="1.8" cy="3.8" r="2" fill={`url(#chick-comb-${index})`} stroke="#8E0000" strokeWidth="0.5" />
            <circle cx="3.5" cy="4" r="1.7" fill={`url(#chick-comb-${index})`} stroke="#8E0000" strokeWidth="0.5" />
            <circle cx="2.2" cy="4.2" r="0.5" fill="#FFFFFF" opacity="0.6" />
          </g>

          {/* Chubby Triangular 3D Beak */}
          <polygon points="3.2,-1 9.2,0.8 3.2,3" fill="#FF9800" stroke="#BF360C" strokeWidth="0.8" />
          {/* Beak Mouth Seam & Top Highlight */}
          <line x1="3.2" y1="0.8" x2="7.8" y2="0.8" stroke="#BF360C" strokeWidth="0.7" />
          <ellipse cx="4.8" cy="-0.1" rx="1.2" ry="0.5" fill="#FFE082" />
        </g>

        {/* Cute Yellow/Orange Feet (Visible when not nested) */}
        {!isReady && (
          <g id="feet">
            {/* Left Foot */}
            <line x1="-2.8" y1="8" x2="-2.8" y2="12.5" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
            <line x1="-2.8" y1="12.5" x2="-5.5" y2="13.5" stroke="#FF9800" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="-2.8" y1="12.5" x2="0" y2="13.5" stroke="#FF9800" strokeWidth="1.8" strokeLinecap="round" />

            {/* Right Foot */}
            <line x1="2.8" y1="8" x2="2.8" y2="12.5" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
            <line x1="2.8" y1="12.5" x2="0" y2="13.5" stroke="#FF9800" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="2.8" y1="12.5" x2="5.5" y2="13.5" stroke="#FF9800" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* 4. Speech Bubble on direct Tap (Kept compact and within pen boundary) */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(0, -18)" className="animate-in zoom-in duration-150">
          <rect x="-22" y="-10" width="44" height="13" rx="6.5" fill="#2E7D32" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="-2,3 2,3 0,5" fill="#2E7D32" />
          <text x="0" y="-1" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
