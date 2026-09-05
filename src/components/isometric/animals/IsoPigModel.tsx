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
      className={`cursor-pointer transition-transform duration-200 ${
        isReady ? 'animate-animal-ready' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onTap(index);
      }}
    >
      <defs>
        {/* 3D Piglet Pink Body Gradient */}
        <radialGradient id={`pig-body-${index}`} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="40%" stopColor="#F8BBD0" />
          <stop offset="80%" stopColor="#F06292" />
          <stop offset="100%" stopColor="#D81B60" />
        </radialGradient>

        {/* 3D Piglet Snout Gradient */}
        <radialGradient id={`pig-snout-${index}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="70%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#C2185B" />
        </radialGradient>

        {/* Mud Splash Texture Gradient */}
        <radialGradient id={`pig-mud-${index}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="75%" stopColor="#4E342E" />
          <stop offset="100%" stopColor="#2E1C16" />
        </radialGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse cx="0" cy="11" rx="20" ry="7.5" fill="rgba(0,0,0,0.28)" />

      {/* 2. Curly Spiral Tail at Back (Animated Twirl) */}
      <g id="pig-tail" transform="translate(-16, -1)" className="animate-pig-tail">
        <path
          d="M 0 0 Q -7 -6 -3 -12 Q 2 -10 -2 -5 Q -4 -2 0 0"
          stroke="#D81B60"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* 3. Trotter Legs */}
      <g id="pig-feet">
        {/* Back Legs */}
        <rect x="-11" y="6" width="5" height="9" rx="2" fill="#F8BBD0" stroke="#D81B60" strokeWidth="1" />
        <line x1="-8.5" y1="12" x2="-8.5" y2="15" stroke="#C2185B" strokeWidth="1" />

        <rect x="-3" y="7" width="5" height="9" rx="2" fill="#F48FB1" stroke="#D81B60" strokeWidth="1" />

        {/* Front Legs */}
        <rect x="5" y="6" width="5" height="9" rx="2" fill="#F8BBD0" stroke="#D81B60" strokeWidth="1" />
        <line x1="7.5" y1="12" x2="7.5" y2="15" stroke="#C2185B" strokeWidth="1" />

        <rect x="12" y="7" width="4.8" height="8.5" rx="2" fill="#F48FB1" stroke="#D81B60" strokeWidth="1" />
      </g>

      {/* 4. Chubby Pig Body with Mud Wallow Animation */}
      <g className={isFed && !isReady ? 'animate-pig-wallow' : ''}>
        {/* Round Plump Pig Belly */}
        <ellipse
          cx="0"
          cy="0"
          rx="17"
          ry="13.5"
          fill={`url(#pig-body-${index})`}
          stroke="#C2185B"
          strokeWidth="1.4"
        />
        {/* Specular Highlight along back */}
        <ellipse cx="-4" cy="-5" rx="7.5" ry="3.5" fill="#FFFFFF" opacity="0.75" />

        {/* Organic Mud Patches on Pig's Hide */}
        <path
          d="M -7 -4 Q -1 -9 3 -5 Q 1 1 -5 2 Z"
          fill={`url(#pig-mud-${index})`}
          opacity="0.8"
        />
        <ellipse cx="6" cy="4" rx="4.5" ry="2.8" fill={`url(#pig-mud-${index})`} opacity="0.75" />
        <circle cx="-10" cy="3" r="2.2" fill={`url(#pig-mud-${index})`} opacity="0.7" />

        {/* Piglet Head */}
        <g transform="translate(13, -4)">
          {/* Floppy Triangular Ears */}
          <g id="ears">
            <polygon points="-5,-9 -7,-17 0,-12" fill={`url(#pig-snout-${index})`} stroke="#AD1457" strokeWidth="1" />
            <polygon points="1,-9 5,-17 6,-11" fill={`url(#pig-snout-${index})`} stroke="#AD1457" strokeWidth="1" />
          </g>

          {/* Head Base */}
          <ellipse
            cx="0"
            cy="0"
            rx="9.5"
            ry="9"
            fill={`url(#pig-body-${index})`}
            stroke="#C2185B"
            strokeWidth="1.4"
          />
          {/* Specular on forehead */}
          <ellipse cx="-2" cy="-4" rx="3.5" ry="1.8" fill="#FFFFFF" opacity="0.75" />

          {/* Mud speckle on cheek */}
          <circle cx="-4" cy="2" r="1.8" fill={`url(#pig-mud-${index})`} opacity="0.75" />

          {/* Cute Big Eyes */}
          <circle cx="1" cy="-3.5" r="2.8" fill="#FFFFFF" stroke="#212121" strokeWidth="0.7" />
          <circle cx="1.5" cy="-3.5" r="1.8" fill="#212121" />
          <circle cx="0.8" cy="-4.2" r="0.8" fill="#FFFFFF" />
          <circle cx="2" cy="-3" r="0.4" fill="#FFFFFF" />

          {/* Button Snout with Twitch Animation */}
          <g className={isFed && !isReady ? 'animate-pig-snout' : ''} transform="translate(6.5, 1.5)">
            <ellipse cx="0" cy="0" rx="6.2" ry="4.8" fill={`url(#pig-snout-${index})`} stroke="#AD1457" strokeWidth="1.1" />
            <ellipse cx="-1.2" cy="-1.5" rx="3" ry="1.2" fill="#FFFFFF" opacity="0.65" />
            {/* Nostrils */}
            <circle cx="-1.8" cy="0.2" r="1.3" fill="#880E4F" />
            <circle cx="1.8" cy="0.2" r="1.3" fill="#880E4F" />
          </g>
        </g>
      </g>

      {/* 5. Sleeping Cartoon Zzz or Heart when Fed & Happy */}
      {isFed && !isReady && (
        <g id="pig-sleeping" className="animate-thought-float" transform="translate(18, -24)">
          <text x="0" y="0" fill="#E91E63" fontSize="11" fontWeight="bold">💖</text>
        </g>
      )}

      {/* 6. Ready for Bacon Collection Celebration */}
      {isReady && (
        <g id="bacon-ready" className="animate-golden-sparkle">
          {/* Floating Sizzling Bacon Badge */}
          <g transform="translate(20, -22)">
            <rect x="-14" y="-7" width="28" height="14" rx="7" fill="#D32F2F" stroke="#FFD54F" strokeWidth="1.2" />
            <text x="0" y="3.5" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">🥓 Bacon</text>
          </g>

          {/* Sparkle Stars */}
          <g transform="translate(-14, -12)">
            <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
          </g>
          <g transform="translate(6, -26)">
            <path d="M 0 -3 L 0.8 -0.8 L 3 0 L 0.8 0.8 L 0 3 L -0.8 0.8 L -3 0 L -0.8 -0.8 Z" fill="#FFD700" stroke="#FFA000" strokeWidth="0.5" />
          </g>
        </g>
      )}

      {/* 7. Hungry Thought Bubble ("🥣") when not fed */}
      {!isFed && (
        <g id="hungry-bubble" className="animate-thought-float" transform="translate(12, -26)">
          <circle cx="0" cy="0" r="8.5" fill="#FFFFFF" stroke="#FFA000" strokeWidth="1.2" />
          <circle cx="-4" cy="7.5" r="2.2" fill="#FFFFFF" stroke="#FFA000" strokeWidth="0.8" />
          <circle cx="-7" cy="11.5" r="1.4" fill="#FFFFFF" />
          <text x="0" y="3.5" fontSize="9.5" textAnchor="middle">🥣</text>
        </g>
      )}

      {/* 8. Speech Bubble on Tap */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(2, -30)" className="animate-in zoom-in duration-150">
          <rect x="-24" y="-12" width="48" height="15" rx="7.5" fill="#C2185B" stroke="#FFFFFF" strokeWidth="1.2" />
          <polygon points="-3,3 3,3 0,6" fill="#C2185B" />
          <text x="0" y="-1.5" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
