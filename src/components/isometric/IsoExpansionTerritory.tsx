import React, { useMemo } from 'react';
import { EXPANSION_PARCELS } from '../../constants/expansionData';
import { getCachedForestForParcel } from '../../utils/forestGen';
import {
  CartoonFoliageDefs,
  ProceduralFoliageProp,
  Detailed3DSurveyStake,
  Detailed3DForestLake,
  DetailedCobblestoneBorderSegment,
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
        {/* Sunny Unified Farm Lawn Gradient - seamless natural grass under locked & unlocked terrain */}
        <linearGradient id="hd-natural-lawn-grad" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#9DE83B" />
          <stop offset="35%" stopColor="#86D628" />
          <stop offset="70%" stopColor="#6DBF1B" />
          <stop offset="100%" stopColor="#55A412" />
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

        // 1. UNLOCKED TERRITORY: Seamless ground, render persistent scenery features like lakes if present
        if (isUnlocked) {
          if (parcel.lake) {
            return (
              <g key={`unlocked_${parcel.id}`} className="pointer-events-none opacity-95">
                <Detailed3DForestLake
                  x={gridToIso(parcel.lake.x, parcel.lake.y).x}
                  y={gridToIso(parcel.lake.x, parcel.lake.y).y}
                  radiusX={parcel.lake.radiusX || 48}
                  radiusY={parcel.lake.radiusY || 26}
                  name={parcel.lake.name}
                />
              </g>
            );
          }
          return null;
        }

        // 2. LOCKED WILDERNESS TERRITORY:
        // Use cached forest props for high-performance mobile rendering
        const forestItems = getCachedForestForParcel(parcel);
        const hash = parcel.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        return (
          <g
            key={`locked_${parcel.id}`}
            id={`parcel-${parcel.id}`}
            className="cursor-pointer pointer-events-auto transition-transform duration-200 hover:brightness-105"
            onClick={(e) => {
              e.stopPropagation();
              onOpenExpansionModal?.(parcel.id);
            }}
          >
            {/* A. Natural Forest Lake (if parcel has one) */}
            {parcel.lake && (
              <Detailed3DForestLake
                x={gridToIso(parcel.lake.x, parcel.lake.y).x}
                y={gridToIso(parcel.lake.x, parcel.lake.y).y}
                radiusX={parcel.lake.radiusX || 48}
                radiusY={parcel.lake.radiusY || 26}
                name={parcel.lake.name}
              />
            )}

            {/* B. Cobblestone / River Stone Border Segments circulating the perimeter */}
            {parcel.stakePoints.map((pt, idx) => {
              const nextPt = parcel.stakePoints[(idx + 1) % parcel.stakePoints.length];
              const iso1 = gridToIso(pt.x, pt.y);
              const iso2 = gridToIso(nextPt.x, nextPt.y);
              return (
                <DetailedCobblestoneBorderSegment
                  key={`border_${parcel.id}_${idx}`}
                  x1={iso1.x}
                  y1={iso1.y}
                  x2={iso2.x}
                  y2={iso2.y}
                  seed={hash + idx * 37}
                />
              );
            })}

            {/* C. Boundary Survey Stakes along Natural Perimeter Corners */}
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

            {/* D. Dense, Lush 3D Cartoon Flora, Wildflowers, Rocks, and Boulders */}
            {forestItems.map((item, idx) => {
              const itemIso = gridToIso(item.x, item.y);
              return (
                <g key={`flora_${parcel.id}_${idx}`}>
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
              className="pointer-events-none filter drop-shadow-md"
            >
              {/* Soft Sunlit Ground Shadow */}
              <ellipse
                cx="0"
                cy="8"
                rx="46"
                ry="22"
                fill="url(#hd-expand-glow)"
                className="opacity-30"
              />

              {/* Wooden Signpost Assembly */}
              <g>
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
