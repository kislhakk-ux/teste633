import React, { useMemo } from 'react';
import { gridToScreen } from '../../utils/isometricCoords';
import { TerrainGridMap } from '../../utils/admStorage';
import { LakeTerrainType } from '../../types/adm';

interface IsoLakeTerrainOverlayProps {
  terrainMap: TerrainGridMap;
  isAdmMode: boolean;
  activeTab: 'objects' | 'terrain' | 'transform';
  selectedTiles: { x: number; y: number }[];
  hoveredTile: { x: number; y: number } | null;
  onTileClick?: (gx: number, gy: number) => void;
  onTilePointerDown?: (gx: number, gy: number) => void;
  onTilePointerEnter?: (gx: number, gy: number) => void;
}

export const IsoLakeTerrainOverlay: React.FC<IsoLakeTerrainOverlayProps> = ({
  terrainMap,
  isAdmMode,
  activeTab,
  selectedTiles,
  hoveredTile,
  onTileClick,
  onTilePointerDown,
  onTilePointerEnter,
}) => {
  const selectedSet = useMemo(() => {
    const s = new Set<string>();
    selectedTiles.forEach((t) => s.add(`${t.x}_${t.y}`));
    return s;
  }, [selectedTiles]);

  // Compute all custom tiles to render
  const customEntries = useMemo(() => {
    return Object.entries(terrainMap).map(([key, type]) => {
      const [xStr, yStr] = key.split('_');
      return {
        x: parseInt(xStr, 10),
        y: parseInt(yStr, 10),
        type,
      };
    });
  }, [terrainMap]);

  const renderTilePolygon = (gx: number, gy: number, type: LakeTerrainType, isSelected: boolean) => {
    const p0 = gridToScreen(gx, gy);
    const p1 = gridToScreen(gx + 1, gy);
    const p2 = gridToScreen(gx + 1, gy + 1);
    const p3 = gridToScreen(gx, gy + 1);

    const pointsStr = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;

    let fill = '#00838F';
    let stroke = 'rgba(0, 229, 255, 0.4)';
    let strokeWidth = '0.5';

    switch (type) {
      case 'water':
        fill = 'url(#adm-lake-water)';
        stroke = '#00B0FF';
        strokeWidth = '0.8';
        break;
      case 'shallow_water':
        fill = 'url(#adm-shallow-water)';
        stroke = '#4DD0E1';
        strokeWidth = '0.8';
        break;
      case 'grass':
        fill = 'url(#adm-grass-tile)';
        stroke = '#4CAF50';
        strokeWidth = '0.5';
        break;
      case 'sand':
        fill = 'url(#adm-sand-tile)';
        stroke = '#FFD54F';
        strokeWidth = '0.8';
        break;
      case 'pier':
        fill = 'url(#adm-pier-tile)';
        stroke = '#5D4037';
        strokeWidth = '1';
        break;
      case 'cliff':
        fill = 'url(#adm-cliff-tile)';
        stroke = '#455A64';
        strokeWidth = '1.2';
        break;
    }

    return (
      <g key={`tile_${gx}_${gy}`} className="pointer-events-none">
        {/* Ground Polygon */}
        <polygon
          points={pointsStr}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className="transition-colors duration-200"
        />

        {/* Extra details based on type */}
        {type === 'water' && (
          <g>
            {/* Animated Light Reflection line */}
            <line
              x1={p0.x}
              y1={p0.y + 10}
              x2={p2.x}
              y2={p2.y - 10}
              stroke="white"
              strokeWidth="1.2"
              opacity="0.3"
              strokeDasharray="6 4"
            >
              <animate attributeName="stroke-dashoffset" values="0; 20" dur="2.5s" repeatCount="indefinite" />
            </line>
          </g>
        )}

        {type === 'pier' && (
          <g opacity="0.6">
            <line x1={(p0.x + p1.x)/2} y1={(p0.y + p1.y)/2} x2={(p3.x + p2.x)/2} y2={(p3.y + p2.y)/2} stroke="#3E2723" strokeWidth="0.8" />
            <circle cx={(p0.x + p1.x)/2} cy={(p0.y + p1.y)/2 + 2} r="1" fill="#212121" />
            <circle cx={(p3.x + p2.x)/2} cy={(p3.y + p2.y)/2 - 2} r="1" fill="#212121" />
          </g>
        )}
      </g>
    );
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible w-full h-full"
      style={{ zIndex: 12 }}
    >
      <defs>
        {/* Dynamic Water Pattern */}
        <linearGradient id="adm-lake-water" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006699" />
          <stop offset="50%" stopColor="#0088CC" />
          <stop offset="100%" stopColor="#004D73" />
        </linearGradient>

        <linearGradient id="adm-shallow-water" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#26C6DA" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#00ACC1" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="adm-grass-tile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#43A047" />
        </linearGradient>

        <linearGradient id="adm-sand-tile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFCA28" />
        </linearGradient>

        <linearGradient id="adm-pier-tile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>

        <linearGradient id="adm-cliff-tile" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78909C" />
          <stop offset="100%" stopColor="#546E7A" />
        </linearGradient>
      </defs>

      {/* Render all custom tiles created by ADM */}
      {customEntries.map((tile) =>
        renderTilePolygon(tile.x, tile.y, tile.type, selectedSet.has(`${tile.x}_${tile.y}`))
      )}

      {/* When in ADM mode, render interactive Grid & Selection overlays */}
      {isAdmMode && (
        <g className="pointer-events-auto">
          {/* Interactive Grid cells (16x16) */}
          {Array.from({ length: 16 }).map((_, gx) =>
            Array.from({ length: 16 }).map((_, gy) => {
              const p0 = gridToScreen(gx, gy);
              const p1 = gridToScreen(gx + 1, gy);
              const p2 = gridToScreen(gx + 1, gy + 1);
              const p3 = gridToScreen(gx, gy + 1);
              const pointsStr = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;

              const isSelected = selectedSet.has(`${gx}_${gy}`);
              const isHovered = hoveredTile?.x === gx && hoveredTile?.y === gy;

              return (
                <polygon
                  key={`grid_${gx}_${gy}`}
                  points={pointsStr}
                  fill={
                    isSelected
                      ? 'rgba(0, 229, 255, 0.45)'
                      : isHovered
                      ? 'rgba(255, 235, 59, 0.35)'
                      : activeTab === 'terrain'
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'transparent'
                  }
                  stroke={
                    isSelected
                      ? '#00E5FF'
                      : isHovered
                      ? '#FFEB3B'
                      : activeTab === 'terrain'
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'none'
                  }
                  strokeWidth={isSelected || isHovered ? '2' : '0.5'}
                  strokeDasharray={isSelected ? '4 2' : undefined}
                  className="cursor-pointer transition-all duration-100 hover:opacity-100"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onTilePointerDown?.(gx, gy);
                  }}
                  onPointerEnter={() => {
                    onTilePointerEnter?.(gx, gy);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTileClick?.(gx, gy);
                  }}
                />
              );
            })
          )}
        </g>
      )}
    </svg>
  );
};
