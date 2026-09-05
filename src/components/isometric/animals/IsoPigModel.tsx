import React from 'react';
import { AnimalVisualProps } from './AnimalDefs';

export const IsoPigModel: React.FC<AnimalVisualProps> = React.memo(({
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
      id={`pig-${index}`}
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
        {/* 3D Pig Body (Rosy blush pink with volumetric depth) */}
        <radialGradient id={`pig-body-${index}`} cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="35%" stopColor="#F8BBD0" />
          <stop offset="70%" stopColor="#F48FB1" />
          <stop offset="90%" stopColor="#EC407A" />
          <stop offset="100%" stopColor="#C2185B" />
        </radialGradient>

        {/* 3D Pig Snout Gradient */}
        <radialGradient id={`pig-snout-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="60%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#C2185B" />
        </radialGradient>

        {/* Mud Splash Texture */}
        <radialGradient id={`pig-mud-${index}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="70%" stopColor="#4E342E" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse cx="2" cy="11" rx="18" ry="6.5" fill="rgba(0,0,0,0.3)" />

      {/* 2. Curly Piggy Tail */}
      <g id="pig-tail" transform="translate(-13, -1)" className="animate-tail-swish">
        <path
          d="M 0 0 C -4 -4, -7 0, -4 3 C -1 6, -5 8, -8 5"
          stroke="#EC407A"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* 3. Short Chubby Pig Trotters */}
      <g id="pig-legs">
        {/* Back legs */}
        <rect x="-10" y="5" width="4.5" height="9" rx="2" fill="#F48FB1" stroke="#C2185B" strokeWidth="0.8" />
        <rect x="-10" y="11.5" width="4.5" height="2.5" rx="1" fill="#AD1457" />

        <rect x="-2" y="6" width="4.5" height="9" rx="2" fill="#F48FB1" stroke="#C2185B" strokeWidth="0.8" />
        <rect x="-2" y="12.5" width="4.5" height="2.5" rx="1" fill="#AD1457" />

        {/* Front legs */}
        <rect x="6" y="5" width="4.5" height="9" rx="2" fill="#F8BBD0" stroke="#C2185B" strokeWidth="0.8" />
        <rect x="6" y="11.5" width="4.5" height="2.5" rx="1" fill="#AD1457" />

        <rect x="12" y="6" width="4.2" height="8.5" rx="2" fill="#F8BBD0" stroke="#C2185B" strokeWidth="0.8" />
        <rect x="12" y="12" width="4.2" height="2.5" rx="1" fill="#AD1457" />
      </g>

      {/* 4. Chubby Round 3D Pig Body */}
      <g id="pig-body">
        <ellipse cx="0" cy="0" rx="15.5" ry="11" fill={`url(#pig-body-${index})`} stroke="#C2185B" strokeWidth="1" />
        {/* Specular Highlight Curve */}
        <ellipse cx="-4" cy="-4.5" rx="9" ry="4" fill="#FFFFFF" opacity="0.65" />

        {/* Playful Mud Splats on Flank */}
        <ellipse cx="-5" cy="2" rx="4" ry="2.6" fill={`url(#pig-mud-${index})`} opacity="0.8" />
        <circle cx="2" cy="4" r="1.6" fill={`url(#pig-mud-${index})`} opacity="0.75" />
        <circle cx="-8" cy="-1" r="1.3" fill={`url(#pig-mud-${index})`} opacity="0.75" />
      </g>

      {/* 5. 3D Cartoon Pig Head */}
      <g id="pig-head" transform="translate(11, -4)">
        {/* Head Base */}
        <ellipse cx="0" cy="0" rx="8.5" ry="7.8" fill={`url(#pig-body-${index})`} stroke="#C2185B" strokeWidth="1" />
        <ellipse cx="-2" cy="-2.5" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.65" />

        {/* Cute Triangular Floppy Ears */}
        <polygon points="-6,-6 -3,-12 1,-6" fill={`url(#pig-body-${index})`} stroke="#C2185B" strokeWidth="0.8" />
        <polygon points="-5,-6 -3,-10 0,-6" fill={`url(#pig-snout-${index})`} />

        <polygon points="2,-6 5,-12 8,-6" fill={`url(#pig-body-${index})`} stroke="#C2185B" strokeWidth="0.8" />
        <polygon points="3,-6 5,-10 7,-6" fill={`url(#pig-snout-${index})`} />

        {/* Big Cartoon Eye */}
        <g id="pig-eye" transform="translate(2, -2.5)">
          <circle cx="0" cy="0" r="2.8" fill="#FFFFFF" stroke="#212121" strokeWidth="0.7" />
          <circle cx="0.4" cy="0" r="1.7" fill="#3E2723" />
          <circle cx="0.6" cy="0" r="1" fill="#1A1A1A" />
          <circle cx="0" cy="-0.7" r="0.75" fill="#FFFFFF" />
          <circle cx="1.1" cy="0.3" r="0.35" fill="#FFFFFF" />
        </g>

        {/* Chubby Button Snout with Twitch Animation */}
        <g className={isFed && !isReady ? 'animate-pig-snout' : ''} transform="translate(5.5, 2)">
          <ellipse cx="0" cy="0" rx="5.5" ry="4.2" fill={`url(#pig-snout-${index})`} stroke="#AD1457" strokeWidth="1" />
          <ellipse cx="-1.2" cy="-1.3" rx="2.5" ry="1.1" fill="#FFFFFF" opacity="0.65" />
          {/* Nostrils */}
          <circle cx="-1.6" cy="0.1" r="1.1" fill="#880E4F" />
          <circle cx="1.6" cy="0.1" r="1.1" fill="#880E4F" />
        </g>
      </g>

      {/* 6. Shiny Clean Pig Bath Sparkles when Ready (No floating text!) */}
      {isReady && (
        <g id="pig-ready-sparkle" className="animate-golden-sparkle">
          <g transform="translate(14, -14)">
            <path d="M 0 -3 L 0.8 -0.8 L 3 0 L 0.8 0.8 L 0 3 L -0.8 0.8 L -3 0 L -0.8 -0.8 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.4" />
          </g>
          <g transform="translate(-12, -8)">
            <path d="M 0 -2.5 L 0.6 -0.6 L 2.5 0 L 0.6 0.6 L 0 2.5 L -0.6 0.6 L -2.5 0 L -0.6 -0.6 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.4" />
          </g>
        </g>
      )}

      {/* 7. Compact Speech Bubble on direct Tap */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(0, -18)" className="animate-in zoom-in duration-150">
          <rect x="-22" y="-10" width="44" height="13" rx="6.5" fill="#C2185B" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="-2,3 2,3 0,5" fill="#C2185B" />
          <text x="0" y="-1" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
