import React, { useState, useEffect } from 'react';
import { getCutoutSprite } from '../../utils/spriteCutout';
import { HD_BUILDING_SPRITES } from '../../constants/buildingSprites';

interface Iso3DDeliveryBoatProps {
  status: 'away' | 'docked';
  x: number;
  y: number;
  onClick?: () => void;
}

export const Iso3DDeliveryBoat: React.FC<Iso3DDeliveryBoatProps> = ({
  status = 'docked',
  x,
  y,
  onClick,
}) => {
  const [deliveryCutout, setDeliveryCutout] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCutoutSprite(HD_BUILDING_SPRITES.delivery_boat).then((res) => {
      if (isMounted) setDeliveryCutout(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (status !== 'docked') return null;

  return (
    <g
      id="delivery-boat-3d-group"
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group select-none"
      style={{ pointerEvents: 'auto' }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* 1. Deep water shadow under the big delivery boat */}
      <ellipse
        cx="82"
        cy="98"
        rx="78"
        ry="25"
        fill="rgba(1, 87, 155, 0.55)"
        className="blur-[2px]"
      />

      {/* 2. Concentric water ripples */}
      <ellipse
        cx="82"
        cy="98"
        rx="90"
        ry="28"
        fill="none"
        stroke="#81D4FA"
        strokeWidth="2"
        opacity="0.6"
        className="animate-pulse"
      />
      <ellipse
        cx="80"
        cy="96"
        rx="102"
        ry="34"
        fill="none"
        stroke="#E1F5FE"
        strokeWidth="1.2"
        opacity="0.35"
      />

      {/* 3. 3D Cartoon Steamboat with gentle bobbing */}
      <g className="animate-boat-bobbing transition-transform duration-200 group-hover:scale-[1.03]">
        <image
          href={deliveryCutout || HD_BUILDING_SPRITES.delivery_boat}
          xlinkHref={deliveryCutout || HD_BUILDING_SPRITES.delivery_boat}
          x="0"
          y="0"
          width="164"
          height="164"
          preserveAspectRatio="xMidYMid meet"
          style={{
            mixBlendMode: !deliveryCutout ? 'multiply' : 'normal',
          }}
          className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
        />

        {/* Animated Steam Puffs from Chimney */}
        <circle cx="70" cy="18" r="5" fill="#FFFFFF" opacity="0.6" className="animate-ping" />
        <circle cx="66" cy="12" r="7" fill="#ECEFF1" opacity="0.4" className="animate-pulse" />

        {/* Interactive Order Badge */}
        <g transform="translate(82, 8)" className="animate-bounce pointer-events-none">
          <rect
            x="-44"
            y="-14"
            width="88"
            height="28"
            rx="14"
            fill="#FFF8E1"
            stroke="#D84315"
            strokeWidth="2.5"
            className="drop-shadow-lg"
          />
          <text
            x="0"
            y="4"
            fontSize="11"
            fontWeight="900"
            textAnchor="middle"
            fill="#D84315"
            className="font-sans"
          >
            📦 PEDIDOS
          </text>
        </g>
      </g>
    </g>
  );
};
