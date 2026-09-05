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
      className={`cursor-pointer transition-transform duration-200 ${
        isReady ? 'animate-animal-ready' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onTap(index);
      }}
    >
      <defs>
        {/* 3D Cow Body Gradient (White porcelain with warm soft shadow) */}
        <radialGradient id={`cow-body-${index}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#F5F5F5" />
          <stop offset="90%" stopColor="#E0E0E0" />
          <stop offset="100%" stopColor="#B0BEC5" />
        </radialGradient>

        {/* Cow Black Patch Gradient */}
        <radialGradient id={`cow-spot-${index}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#455A64" />
          <stop offset="50%" stopColor="#263238" />
          <stop offset="100%" stopColor="#1A2024" />
        </radialGradient>

        {/* Pink Snout / Udder Gradient */}
        <radialGradient id={`cow-pink-${index}`} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF80AB" />
          <stop offset="60%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#C2185B" />
        </radialGradient>

        {/* Golden Bell Gradient */}
        <linearGradient id={`cow-bell-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="40%" stopColor="#FFD54F" />
          <stop offset="80%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>

        {/* Milk Bottle Glass Gradient */}
        <linearGradient id={`milk-bottle-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F7FA" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#B2EBF2" />
        </linearGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse cx="4" cy="14" rx="24" ry="9" fill="rgba(0,0,0,0.28)" />

      {/* 2. Swishing Tail at Back */}
      <g id="cow-tail" transform="translate(-16, 2)" className="animate-tail-swish">
        <path
          d="M 0 0 Q -8 8 -6 16"
          stroke="#37474F"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tail Fluffy Tip */}
        <ellipse cx="-6" cy="17" rx="3" ry="4.5" fill={`url(#cow-spot-${index})`} />
      </g>

      {/* 3. Short Chubby Legs with Hooves */}
      <g id="cow-legs">
        {/* Back Legs */}
        <rect x="-13" y="6" width="5.5" height="12" rx="2" fill="#ECEFF1" stroke="#37474F" strokeWidth="1" />
        <rect x="-13" y="14" width="5.5" height="4" rx="1" fill="#263238" />

        <rect x="-4" y="8" width="5.5" height="12" rx="2" fill="#ECEFF1" stroke="#37474F" strokeWidth="1" />
        <rect x="-4" y="16" width="5.5" height="4" rx="1" fill="#263238" />

        {/* Front Legs */}
        <rect x="7" y="6" width="5.5" height="12" rx="2" fill="#FFFFFF" stroke="#37474F" strokeWidth="1" />
        <rect x="7" y="14" width="5.5" height="4" rx="1" fill="#263238" />

        <rect x="15" y="8" width="5" height="11" rx="2" fill="#FFFFFF" stroke="#37474F" strokeWidth="1" />
        <rect x="15" y="15" width="5" height="4" rx="1" fill="#263238" />
      </g>

      {/* 4. Udder (Enlarged & Glowing when Ready to Milk) */}
      <g id="udder" transform="translate(-6, 9)">
        <ellipse
          cx="0"
          cy="0"
          rx={isReady ? 8 : 6}
          ry={isReady ? 6 : 4.5}
          fill={`url(#cow-pink-${index})`}
          stroke="#C2185B"
          strokeWidth="0.8"
        />
        <circle cx="-3" cy="4" r={isReady ? 2 : 1.5} fill="#C2185B" />
        <circle cx="2" cy="4" r={isReady ? 2 : 1.5} fill="#C2185B" />
        {isReady && (
          <ellipse cx="-1" cy="-1.5" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.6" />
        )}
      </g>

      {/* 5. Chubby Holstein Cow Body */}
      <g id="cow-torso">
        <ellipse
          cx="0"
          cy="0"
          rx="19"
          ry="14.5"
          fill={`url(#cow-body-${index})`}
          stroke="#37474F"
          strokeWidth="1.4"
        />
        {/* Specular Highlight along cow back */}
        <ellipse cx="-4" cy="-6" rx="9" ry="3.5" fill="#FFFFFF" opacity="0.8" />

        {/* Big Organic Black Spots */}
        <path
          d="M -11 -7 Q -4 -15 3 -9 Q 0 1 -9 -3 Z"
          fill={`url(#cow-spot-${index})`}
        />
        <path
          d="M 5 2 Q 14 -1 11 9 Q 3 11 5 2 Z"
          fill={`url(#cow-spot-${index})`}
        />
        <circle cx="-13" cy="4" r="3" fill={`url(#cow-spot-${index})`} />
      </g>

      {/* 6. Red Collar & Golden Chime Bell */}
      <g id="collar">
        <path d="M 9 -2 Q 13 4 16 1" stroke="#E53935" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Golden Cowbell */}
        <g transform="translate(12.5, 6)">
          <path d="M -3 0 L 3 0 L 4 5 L -4 5 Z" fill={`url(#cow-bell-${index})`} stroke="#E65100" strokeWidth="0.8" />
          <circle cx="0" cy="5.5" r="1.5" fill="#FFA000" />
          <ellipse cx="-1" cy="2" rx="1.5" ry="1" fill="#FFFFFF" opacity="0.8" />
        </g>
      </g>

      {/* 7. Cute 3D Cow Head with Chewing Cud & Ear Twitching */}
      <g id="cow-head" transform="translate(17, -7)">
        {/* Ears with twitch animation */}
        <g id="ears" className={isFed && !isReady ? 'animate-cow-ears' : ''}>
          <ellipse cx="-6" cy="-8" rx="3" ry="5.5" fill="#FFFFFF" stroke="#37474F" strokeWidth="1" transform="rotate(-35 -6 -8)" />
          <ellipse cx="-6" cy="-8" rx="1.8" ry="3.5" fill="#FF80AB" transform="rotate(-35 -6 -8)" />

          <ellipse cx="6" cy="-8" rx="3" ry="5.5" fill="#FFFFFF" stroke="#37474F" strokeWidth="1" transform="rotate(35 6 -8)" />
          <ellipse cx="6" cy="-8" rx="1.8" ry="3.5" fill="#FF80AB" transform="rotate(35 6 -8)" />
        </g>

        {/* Golden Horns */}
        <path d="M -5 -9 Q -9 -16 -4 -16 Q -3 -12 -2 -9" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />
        <path d="M 5 -9 Q 9 -16 4 -16 Q 3 -12 2 -9" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />

        {/* Head Base */}
        <ellipse cx="0" cy="0" rx="10.5" ry="9.5" fill={`url(#cow-body-${index})`} stroke="#37474F" strokeWidth="1.4" />
        {/* Black patch across forehead */}
        <path d="M -4 -8 Q 6 -11 4 -3 Q -3 -3 -4 -8 Z" fill={`url(#cow-spot-${index})`} />
        {/* Forehead Specular */}
        <ellipse cx="-2" cy="-4" rx="4" ry="2" fill="#FFFFFF" opacity="0.75" />

        {/* Big Cartoon Eyes */}
        <g id="eyes">
          <circle cx="0.5" cy="-3.5" r="3.2" fill="#FFFFFF" stroke="#212121" strokeWidth="0.8" />
          <circle cx="1" cy="-3.5" r="2.2" fill="#212121" />
          <circle cx="0.2" cy="-4.2" r="0.9" fill="#FFFFFF" />
          <circle cx="1.5" cy="-2.8" r="0.45" fill="#FFFFFF" />
          {/* Eyelash */}
          <path d="M -1 -7 Q 1 -8 3 -7" stroke="#212121" strokeWidth="0.8" fill="none" />
        </g>

        {/* Pink Snout / Muzzle (with chewing motion when fed!) */}
        <g id="snout" className={isFed && !isReady ? 'animate-cow-chew' : ''} transform="translate(6, 3)">
          <ellipse cx="0" cy="0" rx="7.2" ry="5.5" fill={`url(#cow-pink-${index})`} stroke="#C2185B" strokeWidth="1.1" />
          <ellipse cx="-1.5" cy="-1.5" rx="3.5" ry="1.5" fill="#FFFFFF" opacity="0.65" />
          {/* Nostrils */}
          <circle cx="-2.2" cy="0.2" r="1.3" fill="#880E4F" />
          <circle cx="2.2" cy="0.2" r="1.3" fill="#880E4F" />
          {/* Gentle Smile */}
          <path d="M -3 2.5 Q 0 4.5 3 2.5" stroke="#880E4F" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          {/* Cute Clover in mouth when fed */}
          {isFed && (
            <g transform="translate(4, 2.5) scale(0.7)">
              <circle cx="2" cy="-1" r="2" fill="#7CB342" />
              <circle cx="4" cy="1" r="2" fill="#7CB342" />
              <line x1="0" y1="0" x2="3" y2="0" stroke="#558B2F" strokeWidth="1" />
            </g>
          )}
        </g>
      </g>

      {/* 8. Ready for Milking Celebration Overlay */}
      {isReady && (
        <g id="milk-ready" className="animate-golden-sparkle">
          {/* Floating Glass Milk Bottle */}
          <g transform="translate(24, -20)">
            <rect x="-4" y="-3" width="8" height="12" rx="2" fill={`url(#milk-bottle-${index})`} stroke="#0097A7" strokeWidth="0.8" />
            <rect x="-2" y="-6" width="4" height="3" fill="#FFFFFF" stroke="#0097A7" strokeWidth="0.6" />
            <ellipse cx="0" cy="-6" rx="2.5" ry="1" fill="#E0F7FA" />
            <text x="0" y="5" fontSize="7" textAnchor="middle">🥛</text>
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

      {/* 9. Hungry Thought Bubble ("🌾") when not fed */}
      {!isFed && (
        <g id="hungry-bubble" className="animate-thought-float" transform="translate(14, -28)">
          <circle cx="0" cy="0" r="8.5" fill="#FFFFFF" stroke="#FFA000" strokeWidth="1.2" />
          <circle cx="-4" cy="7.5" r="2.2" fill="#FFFFFF" stroke="#FFA000" strokeWidth="0.8" />
          <circle cx="-7" cy="11.5" r="1.4" fill="#FFFFFF" />
          <text x="0" y="3.5" fontSize="9.5" textAnchor="middle">🌾</text>
        </g>
      )}

      {/* 10. Speech Bubble on Tap */}
      {bubbleText && (
        <g id="speech-bubble" transform="translate(4, -32)" className="animate-in zoom-in duration-150">
          <rect x="-26" y="-12" width="52" height="15" rx="7.5" fill="#1565C0" stroke="#FFFFFF" strokeWidth="1.2" />
          <polygon points="-3,3 3,3 0,6" fill="#1565C0" />
          <text x="0" y="-1.5" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            {bubbleText}
          </text>
        </g>
      )}
    </g>
  );
});
