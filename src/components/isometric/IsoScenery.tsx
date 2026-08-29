import React from 'react';

interface IsoSceneryProps {
  mapSize: number;
  tileWidth: number;
  tileHeight: number;
  gridToIso: (gx: number, gy: number) => { x: number; y: number };
}

export const IsoScenery: React.FC<IsoSceneryProps> = React.memo(({
  mapSize,
  tileWidth,
  tileHeight,
  gridToIso,
}) => {
  // Key boundary points
  const pTop = gridToIso(0, 0);
  const pRight = gridToIso(mapSize, 0);
  const pBottom = gridToIso(mapSize, mapSize);
  const pLeft = gridToIso(0, mapSize);

  return (
    <g className="pointer-events-none select-none">
      <defs>
        {/* 3D Dirt Country Road */}
        <linearGradient id="scenery-road-3d" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="40%" stopColor="#FFCC80" />
          <stop offset="80%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#FB8C00" />
        </linearGradient>

        {/* 3D Earth Cliff Depth */}
        <linearGradient id="scenery-cliff-l-3d" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="40%" stopColor="#5D4037" />
          <stop offset="80%" stopColor="#4E342E" />
          <stop offset="100%" stopColor="#271610" />
        </linearGradient>
        <linearGradient id="scenery-cliff-r-3d" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="40%" stopColor="#4E342E" />
          <stop offset="80%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#1C0E07" />
        </linearGradient>

        {/* 3D Cartoon Oak Foliage */}
        <radialGradient id="tree-cartoon-oak" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#C5E1A5" />
          <stop offset="35%" stopColor="#9CCC65" />
          <stop offset="70%" stopColor="#689F38" />
          <stop offset="100%" stopColor="#33691E" />
        </radialGradient>

        {/* 3D Cartoon Pine Foliage */}
        <radialGradient id="tree-cartoon-pine" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#80CBC4" />
          <stop offset="40%" stopColor="#26A69A" />
          <stop offset="80%" stopColor="#00796B" />
          <stop offset="100%" stopColor="#004D40" />
        </radialGradient>

        {/* 3D Wooden Trunk */}
        <linearGradient id="tree-trunk-3d" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A1887F" />
          <stop offset="40%" stopColor="#8D6E63" />
          <stop offset="80%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>

        {/* White Picket Fence Wood */}
        <linearGradient id="fence-picket-3d" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#CFD8DC" />
        </linearGradient>

        {/* Hay Bale Straw */}
        <linearGradient id="hay-bale-straw" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="40%" stopColor="#FFEE58" />
          <stop offset="80%" stopColor="#FDD835" />
          <stop offset="100%" stopColor="#F57F17" />
        </linearGradient>
      </defs>

      {/* 1. 3D UNDERGROUND EARTH CROSS-SECTION */}
      {/* South-West Cliff Edge */}
      <polygon
        points={`
          ${pLeft.x - tileWidth / 2},${pLeft.y + tileHeight / 2}
          ${pBottom.x},${pBottom.y + tileHeight}
          ${pBottom.x},${pBottom.y + tileHeight + 30}
          ${pLeft.x - tileWidth / 2},${pLeft.y + tileHeight / 2 + 30}
        `}
        fill="url(#scenery-cliff-l-3d)"
        stroke="#271610"
        strokeWidth="1.5"
      />
      {/* South-East Cliff Edge */}
      <polygon
        points={`
          ${pBottom.x},${pBottom.y + tileHeight}
          ${pRight.x + tileWidth / 2},${pRight.y + tileHeight / 2}
          ${pRight.x + tileWidth / 2},${pRight.y + tileHeight / 2 + 30}
          ${pBottom.x},${pBottom.y + tileHeight + 30}
        `}
        fill="url(#scenery-cliff-r-3d)"
        stroke="#1C0E07"
        strokeWidth="1.5"
      />
      {/* Strata Sediments */}
      <line
        x1={pLeft.x - tileWidth / 2}
        y1={pLeft.y + tileHeight / 2 + 14}
        x2={pBottom.x}
        y2={pBottom.y + tileHeight + 14}
        stroke="#4E342E"
        strokeWidth="3"
        opacity="0.8"
      />
      <line
        x1={pBottom.x}
        y1={pBottom.y + tileHeight + 14}
        x2={pRight.x + tileWidth / 2}
        y2={pRight.y + tileHeight / 2 + 14}
        stroke="#3E2723"
        strokeWidth="3"
        opacity="0.8"
      />

      {/* 2. DIRT COUNTRY ROAD (With Tire Tracks & Wooden Guide Post) */}
      <polygon
        points={`
          ${pTop.x - 72},${pTop.y - 32}
          ${pLeft.x - 72},${pLeft.y + 32}
          ${pLeft.x - 10},${pLeft.y + 42}
          ${pTop.x - 10},${pTop.y - 22}
        `}
        fill="url(#scenery-road-3d)"
        stroke="#E65100"
        strokeWidth="2"
      />
      {/* Wheel Tracks */}
      <line
        x1={pTop.x - 48}
        y1={pTop.y - 28}
        x2={pLeft.x - 48}
        y2={pLeft.y + 36}
        stroke="#E65100"
        strokeWidth="3"
        strokeDasharray="16 10"
        opacity="0.7"
      />
      <line
        x1={pTop.x - 26}
        y1={pTop.y - 24}
        x2={pLeft.x - 26}
        y2={pLeft.y + 40}
        stroke="#E65100"
        strokeWidth="3"
        strokeDasharray="16 10"
        opacity="0.7"
      />

      {/* Wooden Signpost along the Road */}
      {(() => {
        const sx = pTop.x - 55;
        const sy = pTop.y + 50;
        return (
          <g id="road-signpost">
            <ellipse cx={sx} cy={sy + 20} rx="6" ry="3" fill="rgba(0,0,0,0.3)" />
            <rect x={sx - 2} y={sy} width="4" height="20" rx="1" fill="#8D6E63" stroke="#4E342E" strokeWidth="0.8" />
            <polygon points={`${sx - 12},${sy - 4} ${sx + 8},${sy - 4} ${sx + 14},${sy} ${sx + 8},${sy + 4} ${sx - 12},${sy + 4}`} fill="#FFE082" stroke="#FFA000" strokeWidth="0.8" />
            <text x={sx} y={sy + 2.5} fontSize="5" fontWeight="bold" textAnchor="middle" fill="#E65100">
              FAZENDA ➔
            </text>
          </g>
        );
      })()}

      {/* 3. WHITE COUNTRY PICKET FENCE */}
      {Array.from({ length: 11 }).map((_, i) => {
        const t = i / 10;
        const fx = pTop.x - 14 + t * (pLeft.x - pTop.x);
        const fy = pTop.y - 18 + t * (pLeft.y - pTop.y);
        const nextT = (i + 1) / 10;
        const nfx = pTop.x - 14 + nextT * (pLeft.x - pTop.x);
        const nfy = pTop.y - 18 + nextT * (pLeft.y - pTop.y);

        return (
          <g key={`fence_${i}`}>
            {i < 10 && (
              <>
                <line x1={fx} y1={fy - 14} x2={nfx} y2={nfy - 14} stroke="url(#fence-picket-3d)" strokeWidth="3" />
                <line x1={fx} y1={fy - 7} x2={nfx} y2={nfy - 7} stroke="url(#fence-picket-3d)" strokeWidth="3" />
              </>
            )}
            <ellipse cx={fx} cy={fy + 2} rx="4" ry="2" fill="rgba(0,0,0,0.3)" />
            <polygon
              points={`
                ${fx - 2.5},${fy}
                ${fx - 2.5},${fy - 22}
                ${fx},${fy - 25}
                ${fx + 2.5},${fy - 22}
                ${fx + 2.5},${fy}
              `}
              fill="url(#fence-picket-3d)"
              stroke="#B0BEC5"
              strokeWidth="1"
            />
            <polygon points={`${fx - 2},${fy - 22} ${fx},${fy - 25} ${fx + 2},${fy - 22}`} fill="#FFFFFF" />
          </g>
        );
      })}

      {/* Cowboy Hat & Lasso Rope Hanging on the Corner Fence Post (Hay Day icon) */}
      {(() => {
        const hx = pTop.x - 14;
        const hy = pTop.y - 43;
        return (
          <g id="cowboy-hat-post">
            {/* White Cowboy Hat */}
            <ellipse cx={hx} cy={hy} rx="9" ry="4" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="0.8" />
            <ellipse cx={hx} cy={hy - 3} rx="5" ry="4.5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="0.8" />
            {/* Hat Brown Band */}
            <ellipse cx={hx} cy={hy - 1.5} rx="5" ry="1.5" fill="#8D6E63" />
            <path d={`M ${hx - 8} ${hy} Q ${hx} ${hy + 2} ${hx + 8} ${hy}`} stroke="#B0BEC5" strokeWidth="1" fill="none" />

            {/* Coiled Brown Lasso Rope */}
            <ellipse cx={hx + 4} cy={hy + 14} rx="4.5" ry="8" fill="none" stroke="#D7CCC8" strokeWidth="2" strokeDasharray="3 2" />
            <ellipse cx={hx + 4} cy={hy + 14} rx="3" ry="6" fill="none" stroke="#A1887F" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
        );
      })()}

      {/* 4. EASTERN GREEN MEADOW (Pura grama verdejante - sem rio) */}
      {/* Gentle pasture scatter and meadow accents where the river used to be */}

      {/* 5. ROLLED GOLDEN HAY BALES ON THE GRASS (Hay Day Detail) */}
      {[
        { x: pTop.x + 80, y: pTop.y + 10 },
        { x: pTop.x + 105, y: pTop.y + 22 },
        { x: pLeft.x + 60, y: pLeft.y - 20 },
        { x: pRight.x - 20, y: pRight.y + 25 },
        { x: pRight.x + 12, y: pRight.y + 40 },
        { x: pBottom.x + 25, y: pBottom.y + 22 },
      ].map((bale, idx) => (
        <g key={`haybale_${idx}`}>
          {/* Shadow */}
          <ellipse cx={bale.x} cy={bale.y + 6} rx="12" ry="6" fill="rgba(0,0,0,0.3)" />
          {/* Cylinder Body */}
          <path
            d={`M ${bale.x - 8} ${bale.y - 6} Q ${bale.x} ${bale.y - 10} ${bale.x + 8} ${bale.y - 6} L ${bale.x + 8} ${bale.y + 4} Q ${bale.x} ${bale.y + 8} ${bale.x - 8} ${bale.y + 4} Z`}
            fill="url(#hay-bale-straw)"
            stroke="#FFA000"
            strokeWidth="1"
          />
          {/* Straw Spiral on Front Face */}
          <ellipse cx={bale.x - 8} cy={bale.y - 1} rx="4" ry="5.5" fill="#FFEB3B" stroke="#FFA000" strokeWidth="0.8" />
          <path
            d={`M ${bale.x - 8} ${bale.y - 1} Q ${bale.x - 6} ${bale.y - 3} ${bale.x - 8} ${bale.y - 4} Q ${bale.x - 11} ${bale.y - 1} ${bale.x - 8} ${bale.y + 2}`}
            stroke="#F57F17"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Twine Tie Bands */}
          <path d={`M ${bale.x - 2} ${bale.y - 8} Q ${bale.x - 2} ${bale.y + 6} ${bale.x - 2} ${bale.y + 6}`} stroke="#8D6E63" strokeWidth="1" fill="none" />
          <path d={`M ${bale.x + 4} ${bale.y - 8} Q ${bale.x + 4} ${bale.y + 6} ${bale.x + 4} ${bale.y + 6}`} stroke="#8D6E63" strokeWidth="1" fill="none" />
        </g>
      ))}

      {/* 6. VIBRANT BLUE FORGET-ME-NOT FLOWERBEDS ALONG PATHS & MEADOWS */}
      {[
        { x: pTop.x - 2, y: pTop.y + 8 },
        { x: pTop.x + 16, y: pTop.y + 18 },
        { x: pTop.x + 34, y: pTop.y + 28 },
        { x: pLeft.x + 22, y: pLeft.y - 4 },
        { x: pLeft.x + 38, y: pLeft.y + 4 },
        { x: pBottom.x - 18, y: pBottom.y + 16 },
        { x: pRight.x - 10, y: pRight.y + 12 },
        { x: pRight.x + 15, y: pRight.y + 22 },
        { x: pBottom.x + 10, y: pBottom.y + 35 },
      ].map((fb, idx) => (
        <g key={`blue_flower_${idx}`}>
          {/* Green Bush Bed */}
          <ellipse cx={fb.x} cy={fb.y} rx="8" ry="4" fill="#689F38" stroke="#33691E" strokeWidth="0.6" />
          {/* Blue Blossoms */}
          <circle cx={fb.x - 4} cy={fb.y - 2} r="2.2" fill="#00E5FF" stroke="#0091EA" strokeWidth="0.5" />
          <circle cx={fb.x - 4} cy={fb.y - 2} r="0.8" fill="#FFEE58" />

          <circle cx={fb.x + 3} cy={fb.y - 1} r="2.2" fill="#2979FF" stroke="#0D47A1" strokeWidth="0.5" />
          <circle cx={fb.x + 3} cy={fb.y - 1} r="0.8" fill="#FFEE58" />

          <circle cx={fb.x} cy={fb.y + 1} r="2.2" fill="#00E5FF" stroke="#0091EA" strokeWidth="0.5" />
          <circle cx={fb.x} cy={fb.y + 1} r="0.8" fill="#FFEE58" />
        </g>
      ))}

      {/* 7. 3D VOLUMETRIC TREES SURROUNDING THE FARM (Pasto verde e árvores em volta de toda a fazenda) */}
      {/* North Oak & Apple Trees */}
      <TreeOakCartoon x={pTop.x - 30} y={pTop.y - 50} scale={1.25} hasApples={true} />
      <TreePineCartoon x={pTop.x + 40} y={pTop.y - 42} scale={1.15} />
      <TreeOakCartoon x={pTop.x + 95} y={pTop.y - 30} scale={1.3} hasApples={true} />
      <TreePineCartoon x={pTop.x + 155} y={pTop.y - 15} scale={1.05} />

      {/* Eastern Country Oak & Pine Trees (Onde antes ficava o rio, agora árvores e pura grama verdejante) */}
      <TreeOakCartoon x={pRight.x + 30} y={pRight.y - 35} scale={1.25} hasApples={true} />
      <TreePineCartoon x={pRight.x + 65} y={pRight.y + 5} scale={1.2} />
      <TreeOakCartoon x={pRight.x + 25} y={pRight.y + 55} scale={1.3} hasApples={false} />
      <TreePineCartoon x={pBottom.x + 45} y={pBottom.y + 38} scale={1.15} />
      <TreeOakCartoon x={pBottom.x + 15} y={pBottom.y + 68} scale={1.2} hasApples={true} />

      {/* South-West Trees along Road */}
      <TreeOakCartoon x={pLeft.x - 90} y={pLeft.y - 20} scale={1.35} hasApples={false} />
      <TreePineCartoon x={pLeft.x - 60} y={pLeft.y + 30} scale={1.15} />
      <TreeOakCartoon x={pLeft.x - 20} y={pLeft.y + 50} scale={1.25} hasApples={true} />
      <TreePineCartoon x={pBottom.x - 40} y={pBottom.y + 50} scale={1.25} />

      {/* 8. ANIMATED BUTTERFLIES */}
      <g className="animate-bounce" style={{ animationDuration: '2.8s' }}>
        <ButterflyCartoon x={pTop.x + 60} y={pTop.y + 30} wingColor="#E040FB" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '3.6s' }}>
        <ButterflyCartoon x={pLeft.x + 80} y={pLeft.y - 40} wingColor="#FFD600" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '3.2s' }}>
        <ButterflyCartoon x={pRight.x - 60} y={pRight.y + 60} wingColor="#00E5FF" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '3.0s' }}>
        <ButterflyCartoon x={pRight.x + 20} y={pRight.y + 15} wingColor="#FF7043" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
        <ButterflyCartoon x={pBottom.x + 30} y={pBottom.y + 18} wingColor="#76FF03" />
      </g>
    </g>
  );
});

// 3D Cartoon Volumetric Oak Tree with Glossy Apple Canopy
const TreeOakCartoon: React.FC<{ x: number; y: number; scale?: number; hasApples?: boolean }> = ({
  x,
  y,
  scale = 1,
  hasApples = false,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground Ambient Shadow */}
      <ellipse cx="0" cy="8" rx="26" ry="11" fill="rgba(0,0,0,0.32)" />

      {/* Chunky Wooden Trunk */}
      <polygon points="-7,8 7,8 5,-20 -5,-20" fill="url(#tree-trunk-3d)" stroke="#3E2723" strokeWidth="1.2" />
      <path d="M -7 8 Q -12 11 -14 13" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
      <path d="M 7 8 Q 12 11 14 13" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />

      {/* Volumetric Spherical Green Foliage Clusters */}
      <circle cx="-15" cy="-24" r="17" fill="url(#tree-cartoon-oak)" stroke="#33691E" strokeWidth="1.2" />
      <circle cx="15" cy="-24" r="17" fill="url(#tree-cartoon-oak)" stroke="#33691E" strokeWidth="1.2" />
      <circle cx="0" cy="-40" r="19" fill="url(#tree-cartoon-oak)" stroke="#33691E" strokeWidth="1.2" />
      <circle cx="0" cy="-26" r="18" fill="url(#tree-cartoon-oak)" stroke="#33691E" strokeWidth="1.2" />

      {/* Top Gloss Highlights */}
      <ellipse cx="-4" cy="-44" rx="8" ry="4.5" fill="#DCEDC8" opacity="0.75" />
      <ellipse cx="-17" cy="-30" rx="7" ry="4" fill="#DCEDC8" opacity="0.75" />
      <ellipse cx="7" cy="-30" rx="7" ry="4" fill="#DCEDC8" opacity="0.75" />

      {/* Plump Glossy Red 3D Apples */}
      {hasApples && (
        <g>
          {[
            { cx: -13, cy: -22 },
            { cx: 2, cy: -20 },
            { cx: 13, cy: -26 },
            { cx: -5, cy: -36 },
            { cx: 9, cy: -34 },
          ].map((app, i) => (
            <g key={i}>
              <circle cx={app.cx} cy={app.cy} r="3.6" fill="#FF1744" stroke="#B71C1C" strokeWidth="0.8" />
              <circle cx={app.cx - 1.2} cy={app.cy - 1.2} r="1.2" fill="#FFFFFF" />
            </g>
          ))}
        </g>
      )}
    </g>
  );
};

// 3D Cartoon Pine / Fir Tree
const TreePineCartoon: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground Shadow */}
      <ellipse cx="0" cy="6" rx="20" ry="9" fill="rgba(0,0,0,0.32)" />

      {/* Trunk */}
      <rect x="-3.5" y="-14" width="7" height="20" rx="1.5" fill="url(#tree-trunk-3d)" stroke="#3E2723" strokeWidth="1" />

      {/* Conical Foliage Layers */}
      <polygon points="0,-44 -24,-14 24,-14" fill="url(#tree-cartoon-pine)" stroke="#004D40" strokeWidth="1.2" />
      <polygon points="0,-56 -20,-28 20,-28" fill="url(#tree-cartoon-pine)" stroke="#004D40" strokeWidth="1.2" />
      <polygon points="0,-68 -15,-42 15,-42" fill="url(#tree-cartoon-pine)" stroke="#004D40" strokeWidth="1.2" />

      {/* Glossy Edge Rim Highlights */}
      <line x1="-14" y1="-16" x2="0" y2="-24" stroke="#E0F2F1" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <line x1="-10" y1="-30" x2="0" y2="-38" stroke="#E0F2F1" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
    </g>
  );
};

// 3D Cartoon Butterfly
const ButterflyCartoon: React.FC<{ x: number; y: number; wingColor: string }> = ({ x, y, wingColor }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="-4.5" cy="0" rx="4.5" ry="3" fill={wingColor} stroke="#FFFFFF" strokeWidth="0.8" transform="rotate(-20 -4.5 0)" />
      <ellipse cx="4.5" cy="0" rx="4.5" ry="3" fill={wingColor} stroke="#FFFFFF" strokeWidth="0.8" transform="rotate(20 4.5 0)" />
      <circle cx="-4" cy="-0.5" r="1" fill="#FFFFFF" />
      <circle cx="4" cy="-0.5" r="1" fill="#FFFFFF" />
      <line x1="0" y1="-4" x2="0" y2="4" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
};
