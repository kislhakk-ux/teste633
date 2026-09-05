import React, { useMemo } from 'react';
import { EXPANSION_PARCELS, ExpansionParcel } from '../../constants/expansionData';
import { generateForestForParcel } from '../../utils/forestGen';
import {
  CartoonFoliageDefs,
  ProceduralFoliageProp,
  Detailed3DSurveyStake,
  DetailedCobblestoneBorderSegment,
  Detailed3DForestLake,
} from './IsoCartoonFoliage';

interface IsoExpansionTerritoryProps {
  unlockedParcelIds: string[];
  gridToIso: (gx: number, gy: number) => { x: number; y: number };
  onOpenExpansionModal?: (parcelId: string) => void;
  viewportBoundingBox?: { minX: number; maxX: number; minY: number; maxY: number } | null;
  playerLevel?: number;
}

/**
 * Computes all outer boundary edge segments of a parcel for placing
 * the Hay Day style continuous cobblestone and pebble perimeter border.
 */
function getParcelBoundarySegments(
  parcel: ExpansionParcel,
  gridToIso: (gx: number, gy: number) => { x: number; y: number }
): { x1: number; y1: number; x2: number; y2: number; key: string }[] {
  const tileSet = new Set<string>();
  parcel.tiles.forEach((t) => tileSet.add(`${t.x},${t.y}`));

  const segments: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];

  parcel.tiles.forEach((t) => {
    const { x, y } = t;

    // Top-Right edge: neighbor is (x, y-1)
    if (!tileSet.has(`${x},${y - 1}`)) {
      const p1 = gridToIso(x, y);
      const p2 = gridToIso(x + 1, y);
      segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, key: `edge_tr_${x}_${y}` });
    }

    // Bottom-Right edge: neighbor is (x+1, y)
    if (!tileSet.has(`${x + 1},${y}`)) {
      const p1 = gridToIso(x + 1, y);
      const p2 = gridToIso(x + 1, y + 1);
      segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, key: `edge_br_${x}_${y}` });
    }

    // Bottom-Left edge: neighbor is (x, y+1)
    if (!tileSet.has(`${x},${y + 1}`)) {
      const p1 = gridToIso(x + 1, y + 1);
      const p2 = gridToIso(x, y + 1);
      segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, key: `edge_bl_${x}_${y}` });
    }

    // Top-Left edge: neighbor is (x-1, y)
    if (!tileSet.has(`${x - 1},${y}`)) {
      const p1 = gridToIso(x, y + 1);
      const p2 = gridToIso(x, y);
      segments.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, key: `edge_tl_${x}_${y}` });
    }
  });

  return segments;
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
                    fill="url(#hd-natural-lawn-grad)"
                    stroke="rgba(109, 191, 27, 0.25)"
                    strokeWidth="0.4"
                  />
                );
              })}
            </g>
          );
        }

        // 2. LOCKED WILDERNESS TERRITORY:
        // Natural sunny grass (NO dark green stepped blocks), enclosed by cute cobblestones ("umas pedrinha em volta da area bloqueada"),
        // filled with dense rocks, trees, and natural lakes ("mais cheia de pedras e arvores e lagos tbm")!
        const forestItems = generateForestForParcel(parcel);
        const boundarySegments = getParcelBoundarySegments(parcel, gridToIso);

        return (
          <g
            key={`locked_${parcel.id}`}
            id={`parcel-${parcel.id}`}
            className="cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onOpenExpansionModal?.(parcel.id);
            }}
          >
            {/* A. Seamless Natural Sunny Grass Ground */}
            <g className="opacity-95">
              {parcel.tiles.map((tile) => {
                const pTop = gridToIso(tile.x, tile.y);
                const pRight = gridToIso(tile.x + 1, tile.y);
                const pBottom = gridToIso(tile.x + 1, tile.y + 1);
                const pLeft = gridToIso(tile.x, tile.y + 1);

                return (
                  <polygon
                    key={`locked_tile_${tile.x}_${tile.y}`}
                    points={`${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`}
                    fill="url(#hd-natural-lawn-grad)"
                    stroke="rgba(109, 191, 27, 0.25)"
                    strokeWidth="0.4"
                  />
                );
              })}
            </g>

            {/* B. Natural Forest Lake ("e lagos tbm") */}
            {parcel.lake && (
              <Detailed3DForestLake
                x={gridToIso(parcel.lake.x, parcel.lake.y).x}
                y={gridToIso(parcel.lake.x, parcel.lake.y).y}
                radiusX={parcel.lake.radiusX || 48}
                radiusY={parcel.lake.radiusY || 26}
                name={parcel.lake.name}
              />
            )}

            {/* C. Enclosed Cobblestone & River Pebble Border ("umas pedrinha em volta da area bloqueada") */}
            <g id={`border-pebbles-${parcel.id}`}>
              {boundarySegments.map((seg, idx) => (
                <DetailedCobblestoneBorderSegment
                  key={`${seg.key}_${idx}`}
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  seed={idx}
                />
              ))}
            </g>

            {/* D. Boundary Survey Stakes along Perimeter Corners with Pennant Ribbons */}
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

            {/* E. Dense, Lush 3D Cartoon Flora, Rocks, and Boulders */}
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

            {/* F. Interactive 3D Wooden Expansion Signpost at Center */}
            <g
              transform={`translate(${centerIso.x}, ${centerIso.y})`}
              className="pointer-events-none"
            >
              {/* Soft Sunlit Ground Shadow */}
              <ellipse
                cx="0"
                cy="8"
                rx="42"
                ry="20"
                fill="url(#hd-expand-glow)"
                className="opacity-20"
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
