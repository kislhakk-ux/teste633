import React, { useState, useEffect } from 'react';
import { getCutoutSprite } from '../../utils/spriteCutout';
import { HD_BUILDING_SPRITES } from '../../constants/buildingSprites';

interface Iso3DBoatProps {
  status: 'broken' | 'repairing' | 'repaired';
  x: number;
  y: number;
  onClick?: () => void;
}

export const Iso3DBoat: React.FC<Iso3DBoatProps> = ({
  status = 'broken',
  x,
  y,
  onClick,
}) => {
  const [brokenCutout, setBrokenCutout] = useState<string | null>(null);
  const [repairedCutout, setRepairedCutout] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCutoutSprite(HD_BUILDING_SPRITES.broken_boat).then((res) => {
      if (isMounted) setBrokenCutout(res);
    });
    getCutoutSprite(HD_BUILDING_SPRITES.repaired_boat).then((res) => {
      if (isMounted) setRepairedCutout(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentSrc =
    status === 'repaired'
      ? repairedCutout || HD_BUILDING_SPRITES.repaired_boat
      : brokenCutout || HD_BUILDING_SPRITES.broken_boat;

  return (
    <g
      id="fishing-boat-3d-group"
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group select-none"
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* 1. Deep translucent water shadow under the boat */}
      <ellipse
        cx="72"
        cy="92"
        rx="62"
        ry="22"
        fill="rgba(1, 87, 155, 0.55)"
        className="blur-[2px]"
      />
      <ellipse
        cx="70"
        cy="90"
        rx="48"
        ry="16"
        fill="rgba(0, 38, 77, 0.45)"
      />

      {/* 2. Concentric water ripples around the boat hull */}
      <ellipse
        cx="72"
        cy="92"
        rx="72"
        ry="26"
        fill="none"
        stroke="#81D4FA"
        strokeWidth="1.8"
        opacity="0.6"
        className="animate-pulse"
      />
      <ellipse
        cx="70"
        cy="90"
        rx="82"
        ry="30"
        fill="none"
        stroke="#E1F5FE"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M 18 94 Q 40 100 70 98 Q 110 100 135 90"
        fill="none"
        stroke="#B3E5FC"
        strokeWidth="2"
        opacity="0.75"
      />

      {/* 3. Mooring post and rope tying boat to the dock */}
      <g id="boat-mooring">
        {/* Wooden post on pier edge */}
        <ellipse cx="6" cy="62" rx="4.5" ry="2.5" fill="#3E2723" />
        <rect x="2" y="42" width="8" height="20" rx="2" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
        <ellipse cx="6" cy="42" rx="4" ry="2" fill="#8D6E63" stroke="#4E342E" strokeWidth="0.8" />
        
        {/* Coiled rope wrapped around post */}
        <ellipse cx="6" cy="49" rx="5.5" ry="2.5" fill="none" stroke="#D7CCC8" strokeWidth="2" />
        <ellipse cx="6" cy="53" rx="5.5" ry="2.5" fill="none" stroke="#BCAAA4" strokeWidth="1.8" />
        
        {/* Rope stretching from post to boat bow cleat */}
        <path
          d="M 8 50 Q 24 64 42 68"
          fill="none"
          stroke="#D7CCC8"
          strokeWidth="2.2"
          strokeDasharray="4 2"
        />
        <path
          d="M 8 51 Q 24 65 42 69"
          fill="none"
          stroke="#8D6E63"
          strokeWidth="1.2"
          opacity="0.6"
        />
      </g>

      {/* 4. Realistic 3D Cartoon Boat with Gentle Floating Bobbing */}
      <g className="animate-boat-bobbing transition-transform duration-200 group-hover:scale-[1.03]">
        {/* 3D Boat Sprite Cutout */}
        <image
          href={currentSrc}
          x="0"
          y="0"
          width="144"
          height="144"
          preserveAspectRatio="xMidYMid meet"
          className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
        />

        {/* Dynamic Water Reflection / Glint Highlight */}
        <ellipse
          cx="68"
          cy="96"
          rx="38"
          ry="6"
          fill="rgba(255, 255, 255, 0.25)"
          className="blur-[1px] mix-blend-overlay"
        />

        {/* 5. Status Interactive Badges */}
        {status === 'broken' && (
          <g transform="translate(72, 16)" className="animate-bounce pointer-events-none">
            {/* Halo shadow */}
            <ellipse cx="0" cy="18" rx="20" ry="6" fill="rgba(0,0,0,0.35)" />
            {/* Wooden / Golden Notification Badge */}
            <rect
              x="-48"
              y="-14"
              width="96"
              height="28"
              rx="14"
              fill="#FFF8E1"
              stroke="#F57F17"
              strokeWidth="2.5"
              className="drop-shadow-lg"
            />
            <rect
              x="-46"
              y="-12"
              width="92"
              height="24"
              rx="12"
              fill="url(#boat-badge-grad)"
            />
            {/* Tool Icon + Label */}
            <text
              x="0"
              y="3.5"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
              fill="#E65100"
              className="drop-shadow-sm font-sans"
            >
              🔨 CONSERTAR
            </text>
          </g>
        )}

        {status === 'repairing' && (
          <g transform="translate(72, 16)" className="pointer-events-none">
            {/* Animated repair wrench / gears */}
            <rect
              x="-52"
              y="-14"
              width="104"
              height="28"
              rx="14"
              fill="#E1F5FE"
              stroke="#0288D1"
              strokeWidth="2.5"
              className="drop-shadow-lg"
            />
            <text
              x="0"
              y="4"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
              fill="#01579B"
              className="font-sans"
            >
              ⚙️ REPARANDO...
            </text>
          </g>
        )}

        {status === 'repaired' && (
          <g transform="translate(72, 16)" className="opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
            <rect
              x="-46"
              y="-14"
              width="92"
              height="28"
              rx="14"
              fill="#E8F5E9"
              stroke="#2E7D32"
              strokeWidth="2"
              className="drop-shadow-md"
            />
            <text
              x="0"
              y="4"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
              fill="#1B5E20"
              className="font-sans"
            >
              🎣 LAGO PESCA
            </text>
          </g>
        )}
      </g>
    </g>
  );
};
