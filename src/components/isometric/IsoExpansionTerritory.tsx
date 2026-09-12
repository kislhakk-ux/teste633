import React, { useState } from 'react';
import { EXPANSION_PARCELS, LEGACY_PARCEL_ALIASES } from '../../constants/expansionData';
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
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);

  return (
    <g id="iso-expansion-territory-layer" className="select-none">
      <CartoonFoliageDefs />

      <defs>
        {/* Hay Day Wild Untamed Pasture Gradient */}
        <linearGradient id="hd-wild-pasture-grad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#C9DD55" />
          <stop offset="35%" stopColor="#B3CD3F" />
          <stop offset="75%" stopColor="#9AB82C" />
          <stop offset="100%" stopColor="#81A01B" />
        </linearGradient>

        {/* Subtle Parcel Hover Golden Glow */}
        <radialGradient id="hd-parcel-hover-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#FFEE58" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FBC02D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* RENDER ALL EXPANSION PARCELS */}
      {EXPANSION_PARCELS.map((parcel) => {
        const isUnlocked = unlockedParcelIds.some(
          (id) => id === parcel.id || LEGACY_PARCEL_ALIASES[id] === parcel.id
        );

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
        const isHovered = hoveredParcelId === parcel.id;

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

        // 2. LOCKED WILDERNESS TERRITORY (Hay Day Format)
        const forestItems = getCachedForestForParcel(parcel);
        const hash = parcel.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // Calculate polygon points in isometric space for the parcel ground
        const polyIsoPoints = parcel.stakePoints.map((pt) => {
          const iso = gridToIso(pt.x, pt.y);
          return `${iso.x},${iso.y}`;
        }).join(' ');

        // Sort foliage items by isometric Y for correct rendering depth
        const sortedForestItems = [...forestItems].sort((a, b) => {
          const isoA = gridToIso(a.x, a.y);
          const isoB = gridToIso(b.x, b.y);
          return isoA.y - isoB.y;
        });

        return (
          <g
            key={`locked_${parcel.id}`}
            id={`parcel-${parcel.id}`}
            className="cursor-pointer pointer-events-auto transition-all duration-200"
            onMouseEnter={() => setHoveredParcelId(parcel.id)}
            onMouseLeave={() => setHoveredParcelId(null)}
            onClick={(e) => {
              e.stopPropagation();
              onOpenExpansionModal?.(parcel.id);
            }}
          >
            {/* A. Wild Golden-Green Pasture Base Ground Polygon */}
            {polyIsoPoints && (
              <polygon
                points={polyIsoPoints}
                fill="url(#hd-wild-pasture-grad)"
                stroke={isHovered ? '#FFF59D' : 'rgba(90,120,30,0.4)'}
                strokeWidth={isHovered ? 2.5 : 1}
                className="transition-all duration-200"
              />
            )}

            {/* Hover Sunlight Glow */}
            {isHovered && polyIsoPoints && (
              <polygon
                points={polyIsoPoints}
                fill="url(#hd-parcel-hover-glow)"
                className="pointer-events-none"
              />
            )}

            {/* B. Natural Forest Lake (if parcel has one) */}
            {parcel.lake && (
              <Detailed3DForestLake
                x={gridToIso(parcel.lake.x, parcel.lake.y).x}
                y={gridToIso(parcel.lake.x, parcel.lake.y).y}
                radiusX={parcel.lake.radiusX || 48}
                radiusY={parcel.lake.radiusY || 26}
                name={parcel.lake.name}
              />
            )}

            {/* C. Continuous Hay Day Stacked Cobblestone Wall Border around perimeter */}
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

            {/* D. Natural Corner Stones / Corner Markers */}
            {parcel.stakePoints.map((pt, idx) => {
              const stakeIso = gridToIso(pt.x, pt.y);
              return (
                <g key={`corner_${parcel.id}_${idx}`} transform={`translate(${stakeIso.x}, ${stakeIso.y})`}>
                  {/* Small whitewashed corner stone cap */}
                  <ellipse cx="0" cy="1.2" rx="6" ry="3.5" fill="rgba(0,0,0,0.3)" />
                  <ellipse cx="0" cy="0" rx="5.5" ry="3.2" fill="#B0BEC5" stroke="#455A64" strokeWidth="0.8" />
                  <ellipse cx="0" cy="-1.5" rx="4.8" ry="2.8" fill="#ECEFF1" stroke="#78909C" strokeWidth="0.7" />
                  <circle cx="-1" cy="-2.2" r="1.2" fill="#FFFFFF" />
                </g>
              );
            })}

            {/* E. Dense Natural Trees, Rocks, Pines, and Swamp Puddles (Sorted by Depth) */}
            {sortedForestItems.map((item, idx) => {
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

            {/* F. Clean Hay Day Survey Stake & Compact Level Lock Badge */}
            {/* Shows a clean survey marker at center, with subtle star level badge on hover or if locked */}
            <g
              transform={`translate(${centerIso.x}, ${centerIso.y})`}
              className={`transition-all duration-200 pointer-events-none ${
                isHovered ? 'scale-110 opacity-100' : 'opacity-85'
              }`}
            >
              {/* Ground Shadow */}
              <ellipse cx="0" cy="8" rx="14" ry="5.5" fill="rgba(0,0,0,0.35)" />

              {/* Slender Wooden Survey Stake with Red Ribbon (Iconic Hay Day Stake) */}
              <Detailed3DSurveyStake x={0} y={6} scale={0.85} hasFlag={true} />

              {/* Compact Floating Level Pill on Hover or if level requirement not yet met */}
              {(!canAffordLevel || isHovered) && (
                <g transform="translate(0, -26)">
                  <rect
                    x="-34"
                    y="-9"
                    width="68"
                    height="18"
                    rx="9"
                    fill={canAffordLevel ? 'rgba(46, 125, 50, 0.95)' : 'rgba(198, 40, 40, 0.95)'}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))"
                  />
                  <text
                    x="0"
                    y="3.5"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#FFFFFF"
                    textAnchor="middle"
                    fontFamily="system-ui, sans-serif"
                  >
                    ⭐ Nível {parcel.requiredLevel}
                  </text>
                </g>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
});
