import React, { useState, useEffect } from 'react';
import { FarmEntity, BeeTreeData } from '../../types/game';

interface IsoBeeTreeProps {
  entity: FarmEntity;
  isSelected?: boolean;
  onOpenModal: () => void;
}

export const IsoBeeTree: React.FC<IsoBeeTreeProps> = ({
  entity,
  isSelected,
  onOpenModal,
}) => {
  const [beeAngle, setBeeAngle] = useState(0);
  const data: BeeTreeData = entity.beeTreeData || {
    stage: 1,
    beesCount: 5,
    nectarCount: 0,
    maxNectar: 100,
    lastHarvestAt: Date.now(),
  };

  const isFull = data.nectarCount >= data.maxNectar;

  // Gentle bee flight animation ticker
  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const animateBees = (now: number) => {
      const elapsed = (now - start) / 1000;
      setBeeAngle(elapsed);
      animId = requestAnimationFrame(animateBees);
    };
    animId = requestAnimationFrame(animateBees);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Locations for up to 5 hanging beehives
  const hivePositions = [
    { x: 38, y: 72, scale: 1 },    // Stage 1 - Main low branch
    { x: 74, y: 68, scale: 0.95 }, // Stage 2 - Right branch
    { x: 48, y: 52, scale: 0.9 },  // Stage 3 - Center mid branch
    { x: 66, y: 46, scale: 0.85 }, // Stage 4 - Upper right
    { x: 32, y: 56, scale: 0.85 }, // Stage 5 - Upper left
  ];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onOpenModal();
      }}
      className="relative cursor-pointer select-none group"
      style={{ width: 120, height: 140 }}
    >
      {/* Nectar Status Bubble */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-lg border-2 transition-all ${
          isFull
            ? 'bg-amber-500 text-white border-yellow-200 animate-bounce shadow-yellow-400/50'
            : data.nectarCount > 0
            ? 'bg-amber-950/90 text-yellow-300 border-amber-400'
            : 'bg-amber-900/60 text-amber-200 border-amber-600/40'
        }`}
      >
        <span>🍯</span>
        <span>{data.nectarCount}/100</span>
        {isFull && <span className="text-[9px] text-yellow-200 uppercase font-extrabold ml-0.5">CHEIO!</span>}
      </div>

      {/* Main Isometric Bee Tree SVG */}
      <svg
        viewBox="0 0 120 140"
        className="w-full h-full overflow-visible drop-shadow-lg group-hover:brightness-105 transition-all"
      >
        <defs>
          <radialGradient id="tree-canopy-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="40%" stopColor="#22C55E" />
            <stop offset="85%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#14532D" />
          </radialGradient>

          <linearGradient id="trunk-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <radialGradient id="hive-grad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </radialGradient>
        </defs>

        {/* Tree Trunk & Strong Gnarled Branches */}
        <path
          d="M 52 135 C 50 115 45 95 40 85 C 32 75 22 76 18 72 C 16 70 20 68 28 70 C 36 72 44 78 48 86 C 52 80 50 65 52 55 C 54 65 60 75 66 82 C 72 75 82 72 90 74 C 94 75 90 78 84 78 C 76 78 70 84 66 90 C 64 100 64 118 68 135 Z"
          fill="url(#trunk-grad)"
          stroke="#3E2723"
          strokeWidth="1.2"
        />

        {/* Tree Trunk Base Roots */}
        <path
          d="M 44 135 Q 52 132 60 135 Q 68 133 76 135 Q 60 138 44 135 Z"
          fill="#451A03"
        />

        {/* Main Tree Foliage Canopy Clouds */}
        {/* Back Canopy Layer */}
        <circle cx="42" cy="48" r="26" fill="#15803D" opacity="0.9" />
        <circle cx="78" cy="46" r="28" fill="#15803D" opacity="0.9" />
        <circle cx="60" cy="32" r="28" fill="#166534" opacity="0.9" />

        {/* Front Sunlit Canopy Layer */}
        <circle cx="36" cy="44" r="24" fill="url(#tree-canopy-grad)" />
        <circle cx="80" cy="42" r="25" fill="url(#tree-canopy-grad)" />
        <circle cx="58" cy="28" r="27" fill="url(#tree-canopy-grad)" />
        <circle cx="58" cy="50" r="26" fill="url(#tree-canopy-grad)" />

        {/* Yellow Blossom Flowers scattered on tree */}
        <g id="tree-blossoms" opacity="0.9">
          <circle cx="34" cy="36" r="2.5" fill="#FEF08A" />
          <circle cx="34" cy="36" r="1" fill="#EA580C" />

          <circle cx="76" cy="32" r="2.5" fill="#FEF08A" />
          <circle cx="76" cy="32" r="1" fill="#EA580C" />

          <circle cx="52" cy="22" r="2.5" fill="#FEF08A" />
          <circle cx="52" cy="22" r="1" fill="#EA580C" />

          <circle cx="66" cy="46" r="2.5" fill="#FEF08A" />
          <circle cx="66" cy="46" r="1" fill="#EA580C" />

          <circle cx="48" cy="44" r="2.5" fill="#FEF08A" />
          <circle cx="48" cy="44" r="1" fill="#EA580C" />
        </g>

        {/* Hanging Beehives (Rendered according to stage 1 to 5) */}
        {hivePositions.slice(0, data.stage).map((pos, idx) => (
          <g
            key={`beehive-${idx}`}
            transform={`translate(${pos.x}, ${pos.y}) scale(${pos.scale})`}
            className="transition-transform duration-300"
          >
            {/* Hanging String/Branch attachment */}
            <line x1="0" y1="-8" x2="0" y2="0" stroke="#78350F" strokeWidth="1.2" />

            {/* Beehive Oval Segments (Hay Day layered beehive) */}
            <ellipse cx="0" cy="0" rx="4" ry="2.2" fill="url(#hive-grad)" stroke="#78350F" strokeWidth="0.6" />
            <ellipse cx="0" cy="3" rx="6" ry="2.6" fill="url(#hive-grad)" stroke="#78350F" strokeWidth="0.6" />
            <ellipse cx="0" cy="6.5" rx="7.5" ry="3" fill="url(#hive-grad)" stroke="#78350F" strokeWidth="0.6" />
            <ellipse cx="0" cy="10.5" rx="6.5" ry="2.8" fill="url(#hive-grad)" stroke="#78350F" strokeWidth="0.6" />
            <ellipse cx="0" cy="14" rx="4.5" ry="2.2" fill="url(#hive-grad)" stroke="#78350F" strokeWidth="0.6" />
            <ellipse cx="0" cy="16.5" rx="2.5" ry="1.5" fill="#A16207" />

            {/* Hive Entrance Hole */}
            <circle cx="0" cy="8.5" r="1.8" fill="#451A03" />

            {/* Honey Drips if Nectar > 50 */}
            {data.nectarCount >= 50 && (
              <path
                d="M 1 15 Q 1.5 19 0 20 Q -1 19 -0.5 15 Z"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="0.4"
                className="animate-pulse"
              />
            )}
          </g>
        ))}

        {/* Flying Worker Bees orbiting around the tree */}
        {Array.from({ length: Math.min(6, data.beesCount) }).map((_, bIdx) => {
          const speed = 1.2 + bIdx * 0.3;
          const radiusX = 35 + (bIdx % 3) * 12;
          const radiusY = 18 + (bIdx % 2) * 8;
          const offset = (bIdx * Math.PI * 2) / 6;
          const bx = 60 + Math.cos(beeAngle * speed + offset) * radiusX;
          const by = 55 + Math.sin(beeAngle * speed + offset) * radiusY;
          const isFacingRight = Math.cos(beeAngle * speed + offset + 0.1) > Math.cos(beeAngle * speed + offset);

          return (
            <g
              key={`flying-bee-${bIdx}`}
              transform={`translate(${bx}, ${by}) scale(${isFacingRight ? 0.75 : -0.75}, 0.75)`}
              className="pointer-events-none select-none"
            >
              {/* Flapping Wings */}
              <ellipse
                cx="-2"
                cy={-4 + Math.sin(beeAngle * 25 + bIdx) * 1.5}
                rx="3.5"
                ry="1.8"
                fill="rgba(255, 255, 255, 0.85)"
                stroke="#E2E8F0"
                strokeWidth="0.4"
                transform="rotate(-25)"
              />
              <ellipse
                cx="2"
                cy={-4 + Math.sin(beeAngle * 25 + bIdx) * 1.5}
                rx="3.5"
                ry="1.8"
                fill="rgba(255, 255, 255, 0.85)"
                stroke="#E2E8F0"
                strokeWidth="0.4"
                transform="rotate(25)"
              />

              {/* Bee Striped Body */}
              <ellipse cx="0" cy="0" rx="4.5" ry="3.2" fill="#FACC15" stroke="#1E293B" strokeWidth="0.6" />
              {/* Black Stripes */}
              <path d="M -1.5 -2.8 L -1.5 2.8" stroke="#1E293B" strokeWidth="1.1" />
              <path d="M 1.5 -2.8 L 1.5 2.8" stroke="#1E293B" strokeWidth="1.1" />
              {/* Stinger */}
              <polygon points="-4.5,0 -6,-0.6 -6,0.6" fill="#1E293B" />
              {/* Head & Antennae */}
              <circle cx="4" cy="0" r="2.2" fill="#1E293B" />
              <circle cx="4.8" cy="-0.6" r="0.6" fill="#FFFFFF" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
