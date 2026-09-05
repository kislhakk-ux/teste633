import React, { useMemo } from 'react';
import { EXPANSION_PARCELS, ExpansionParcel, isTileInParcel } from '../../constants/expansionData';
import { generateForestForParcel } from '../../utils/forestGen';
import {
  CartoonFoliageDefs,
  ProceduralFoliageProp,
  Detailed3DSurveyStake,
} from './IsoCartoonFoliage';

interface IsoExpansionTerritoryProps {
  unlockedParcelIds: string[];
  gridToIso: (gx: number, gy: number) => { x: number; y: number };
  onOpenExpansionModal?: (parcelId: string) => void;
  viewportBoundingBox?: { minX: number; maxX: number; minY: number; maxY: number } | null;
  playerLevel?: number;
}

export const IsoExpansionTerritory: React.FC<IsoExpansionTerritoryProps> = React.memo(({
  unlockedParcelIds = [],
  gridToIso,
  onOpenExpansionModal,
  viewportBoundingBox,
  playerLevel = 1,
}) => {
  return (
    <g id="iso-expansion-territory-layer" className="select-none">
      <CartoonFoliageDefs />

      <defs>
        {/* Untamed Deep Forest Terrain Gradient for Locked Wilderness */}
        <linearGradient id="hd-locked-wilderness-grad" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#4A8518" />
          <stop offset="35%" stopColor="#3B6F12" />
          <stop offset="70%" stopColor="#2E590E" />
          <stop offset="100%" stopColor="#214209" />
        </linearGradient>

        {/* Unlocked Sunny Farm Expansion Lawn Gradient */}
        <linearGradient id="hd-unlocked-lawn-grad" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#9DE83B" />
          <stop offset="35%" stopColor="#86D628" />
          <stop offset="70%" stopColor="#6DBF1B" />
          <stop offset="100%" stopColor="#55A412" />
        </linearGradient>

        {/* Earthen Embankment Border Lip */}
        <linearGradient id="hd-embankment-rim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="50%" stopColor="#4E342E" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Golden Expansion Banner Radial Glow */}
        <radialGradient id="hd-expand-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF176" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FBC02D" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F57F17" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* RENDER ALL EXPANSION PARCELS */}
      {EXPANSION_PARCELS.map((parcel) => {
        const isUnlocked = unlockedParcelIds.includes(parcel.id);

        // Viewport Culling Optimization
        if (
          viewportBoundingBox &&
          (parcel.bounds.maxX < viewportBoundingBox.minX ||
            parcel.bounds.minX > viewportBoundingBox.maxX ||
            parcel.bounds.maxY < viewportBoundingBox.minY ||
            parcel.bounds.minY > viewportBoundingBox.maxY)
        ) {
          return null;
        }

        const centerIso = gridToIso(parcel.center.x, parcel.center.y);
        const canAffordLevel = playerLevel >= parcel.requiredLevel;

        // 1. UNLOCKED TERRITORY: Sunny playable farm grass
        if (isUnlocked) {
          return (
            <g key={`unlocked_${parcel.id}`} className="pointer-events-none opacity-95">
              {parcel.tiles.map((tile) => {
                const pTop = gridToIso(tile.x, tile.y);
                const pRight = gridToIso(tile.x + 1, tile.y);
                const pBottom = gridToIso(tile.x + 1, tile.y + 1);
                const pLeft = gridToIso(tile.x, tile.y + 1);

                return (
                  <polygon
                    key={`tile_${tile.x}_${tile.y}`}
                    points={`${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`}
                    fill="url(#hd-unlocked-lawn-grad)"
                    stroke="rgba(109, 191, 27, 0.4)"
                    strokeWidth="0.5"
                  />
                );
              })}
            </g>
          );
        }

        // 2. LOCKED WILDERNESS TERRITORY: Rich 3D Cartoon Forest with Natural Demarcation
        const forestItems = generateForestForParcel(parcel);

        return (
          <g
            key={`locked_${parcel.id}`}
            id={`parcel-${parcel.id}`}
            className="cursor-pointer pointer-events-auto group transition-all duration-300"
            onClick={() => onOpenExpansionModal?.(parcel.id)}
          >
            {/* A. Natural Ground Tiles with Depth & Ambient Border Embankment */}
            {parcel.tiles.map((tile) => {
              const pTop = gridToIso(tile.x, tile.y);
              const pRight = gridToIso(tile.x + 1, tile.y);
              const pBottom = gridToIso(tile.x + 1, tile.y + 1);
              const pLeft = gridToIso(tile.x, tile.y + 1);

              return (
                <g key={`locked_tile_${tile.x}_${tile.y}`}>
                  {/* Base Wild Grass Polygon */}
                  <polygon
                    points={`${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`}
                    fill="url(#hd-locked-wilderness-grad)"
                    stroke="#1E3D08"
                    strokeWidth="0.8"
                    className="transition-colors group-hover:brightness-110"
                  />
                  {/* Subtle terrain shadow along southern tile edges */}
                  <line
                    x1={pLeft.x}
                    y1={pLeft.y}
                    x2={pBottom.x}
                    y2={pBottom.y}
                    stroke="#142B05"
                    strokeWidth="1.2"
                    opacity="0.6"
                  />
                </g>
              );
            })}

            {/* B. Natural Boundary Survey Stakes along Perimeter Corners */}
            {parcel.stakePoints.map((pt, idx) => {
              const stakeIso = gridToIso(pt.x, pt.y);
              return (
                <Detailed3DSurveyStake
                  key={`stake_${parcel.id}_${idx}`}
                  x={stakeIso.x}
                  y={stakeIso.y}
                  scale={0.9}
                  hasFlag={true}
                />
              );
            })}

            {/* C. Dense, Lush 3D Cartoon Flora, Rocks, and Fallen Logs */}
            {forestItems.map((item, idx) => {
              const itemIso = gridToIso(item.x, item.y);
              return (
                <g
                  key={`flora_${parcel.id}_${idx}`}
                  className="transition-transform duration-200 group-hover:scale-105"
                >
                  <ProceduralFoliageProp
                    type={item.type}
                    x={itemIso.x}
                    y={itemIso.y}
                    baseScale={item.scale}
                    seed={item.seed}
                  />
                </g>
              );
            })}

            {/* D. Interactive 3D Wooden Expansion Signpost at Center */}
            <g
              transform={`translate(${centerIso.x}, ${centerIso.y})`}
              className="pointer-events-none transition-all duration-300"
            >
              {/* Pulsing Sunlit Ambient Aura on Hover */}
              <ellipse
                cx="0"
                cy="8"
                rx="48"
                ry="24"
                fill="url(#hd-expand-glow)"
                className="opacity-40 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
              />

              {/* Wooden Signpost Assembly */}
              <g className="transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-110">
                {/* Ground Shadow */}
                <ellipse cx="0" cy="12" rx="20" ry="8" fill="rgba(0,0,0,0.35)" />

                {/* Vertical Wooden Post */}
                <polygon
                  points="-3,12 3,12 2,-28 -2,-28"
                  fill="url(#bark-trunk-3d)"
                  stroke="#271610"
                  strokeWidth="1"
                />

                {/* Carved Wooden Directional Plaque */}
                <path
                  d="M -54 -28 L 54 -28 Q 62 -28 62 -36 L 62 -52 Q 62 -60 54 -60 L -54 -60 Q -62 -60 -62 -52 L -62 -36 Q -62 -28 -54 -28 Z"
                  fill="#FFF8E1"
                  stroke="#8D6E63"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                />
                <path
                  d="M -52 -30 L 52 -30 Q 58 -30 58 -36 L 58 -50 Q 58 -58 52 -58 L -52 -58 Q -58 -58 -58 -50 L -58 -36 Q -58 -30 -52 -30 Z"
                  fill="#FFE082"
                  stroke="#FFA000"
                  strokeWidth="1.2"
                />

                {/* Brass Corner Rivets */}
                <circle cx="-54" cy="-35" r="1.8" fill="#FFB300" stroke="#795548" strokeWidth="0.6" />
                <circle cx="54" cy="-35" r="1.8" fill="#FFB300" stroke="#795548" strokeWidth="0.6" />
                <circle cx="-54" cy="-53" r="1.8" fill="#FFB300" stroke="#795548" strokeWidth="0.6" />
                <circle cx="54" cy="-53" r="1.8" fill="#FFB300" stroke="#795548" strokeWidth="0.6" />

                {/* Plaque Title */}
                <text
                  x="0"
                  y="-46"
                  fontSize="11"
                  fontWeight="900"
                  fill="#4E342E"
                  textAnchor="middle"
                  letterSpacing="0.3"
                  fontFamily="system-ui, sans-serif"
                >
                  {parcel.name}
                </text>

                {/* Subtitle / Level Badge */}
                <g transform="translate(0, -34)">
                  <rect
                    x="-42"
                    y="-5"
                    width="84"
                    height="13"
                    rx="6.5"
                    fill={canAffordLevel ? '#2E7D32' : '#C62828'}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="5"
                    fontSize="8.5"
                    fontWeight="800"
                    fill="#FFFFFF"
                    textAnchor="middle"
                    fontFamily="system-ui, sans-serif"
                  >
                    ⭐ Nível {parcel.requiredLevel} • EXPANDIR
                  </text>
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
});
