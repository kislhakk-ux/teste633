import React from 'react';
import { Iso3DBoat } from './Iso3DBoat';
import { Iso3DDeliveryBoat } from './Iso3DDeliveryBoat';
import { IsoMineEntrance } from './IsoMineEntrance';
import { Detailed3DOak, Detailed3DPine, CartoonFoliageDefs } from './IsoCartoonFoliage';

interface IsoSceneryProps {
  mapSize: number;
  tileWidth: number;
  tileHeight: number;
  gridToIso: (gx: number, gy: number) => { x: number; y: number };
  fishingBoatStatus?: 'broken' | 'repairing' | 'repaired';
  deliveryBoatStatus?: 'away' | 'docked';
  onBoatClick?: () => void;
  onDeliveryBoatClick?: () => void;
  mineStatus?: 'locked' | 'broken' | 'repairing' | 'repaired';
  mineRepairStartedAt?: number;
  playerLevel?: number;
  onMineClick?: () => void;
}

export const IsoScenery: React.FC<IsoSceneryProps> = React.memo(({
  mapSize,
  tileWidth,
  tileHeight,
  gridToIso,
  fishingBoatStatus = 'broken',
  deliveryBoatStatus = 'away',
  onBoatClick,
  onDeliveryBoatClick,
  mineStatus = 'broken',
  mineRepairStartedAt,
  playerLevel = 1,
  onMineClick,
}) => {
  // Key boundary points of base farm
  const pTop = gridToIso(0, 0);
  const pRight = gridToIso(mapSize, 0);
  const pBottom = gridToIso(mapSize, mapSize);
  const pLeft = gridToIso(0, mapSize);

  // Outer world boundary points for continuous 3D floating terrain cross-section
  const pWorldBottom = gridToIso(28, 22);
  const pWorldLeft = gridToIso(-12, 22);
  const pWorldRight = gridToIso(28, -12);

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

        {/* Boat Notification Badge Gradient */}
        <linearGradient id="boat-badge-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="50%" stopColor="#FFF176" />
          <stop offset="100%" stopColor="#FFD54F" />
        </linearGradient>

        {/* 3D Mountain Bedrock Terrace Gradient */}
        <linearGradient id="mine-terrace-bedrock" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78716C" />
          <stop offset="40%" stopColor="#57534E" />
          <stop offset="85%" stopColor="#44403C" />
          <stop offset="100%" stopColor="#292524" />
        </linearGradient>

        {/* Mountain Terrace Alpine Meadow Grass */}
        <linearGradient id="mine-terrace-grass" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#86D628" />
          <stop offset="50%" stopColor="#6DBF1B" />
          <stop offset="100%" stopColor="#438B0E" />
        </linearGradient>

        {/* Crushed Mountain Gravel Ballast */}
        <linearGradient id="mine-ballast-gravel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8A29E" />
          <stop offset="50%" stopColor="#78716C" />
          <stop offset="100%" stopColor="#57534E" />
        </linearGradient>
      </defs>

      {/* 1. 3D UNDERGROUND EARTH CROSS-SECTION (Outer perimeter of the farm world) */}
      {/* South-West Cliff Edge */}
      <polygon
        points={`
          ${pWorldLeft.x},${pWorldLeft.y}
          ${pWorldBottom.x},${pWorldBottom.y}
          ${pWorldBottom.x},${pWorldBottom.y + 35}
          ${pWorldLeft.x},${pWorldLeft.y + 35}
        `}
        fill="url(#scenery-cliff-l-3d)"
        stroke="#271610"
        strokeWidth="1.5"
      />
      {/* South-East Cliff Edge */}
      <polygon
        points={`
          ${pWorldBottom.x},${pWorldBottom.y}
          ${pWorldRight.x},${pWorldRight.y}
          ${pWorldRight.x},${pWorldRight.y + 35}
          ${pWorldBottom.x},${pWorldBottom.y + 35}
        `}
        fill="url(#scenery-cliff-r-3d)"
        stroke="#1C0E07"
        strokeWidth="1.5"
      />
      {/* Strata Sediments */}
      <line
        x1={pWorldLeft.x}
        y1={pWorldLeft.y + 16}
        x2={pWorldBottom.x}
        y2={pWorldBottom.y + 16}
        stroke="#4E342E"
        strokeWidth="3"
        opacity="0.8"
      />
      <line
        x1={pWorldBottom.x}
        y1={pWorldBottom.y + 16}
        x2={pWorldRight.x}
        y2={pWorldRight.y + 16}
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

      {/* 4. 3D RIVER (Along the South-West Edge: pLeft to pBottom) */}
      <defs>
        <linearGradient id="river-water-3d" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29B6F6" />
          <stop offset="40%" stopColor="#039BE5" />
          <stop offset="80%" stopColor="#0288D1" />
          <stop offset="100%" stopColor="#01579B" />
        </linearGradient>
        <linearGradient id="river-bank-3d" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="50%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
      </defs>
      {(() => {
        // Base of the SW Cliff
        const rxTop = pLeft.x - tileWidth / 2;
        const ryTop = pLeft.y + tileHeight / 2 + 25;
        const rxBottom = pBottom.x;
        const ryBottom = pBottom.y + tileHeight + 25;
        
        // Outward river bounds
        const rOuterTop = { x: rxTop - 400, y: ryTop + 200 };
        const rOuterBottom = { x: rxBottom - 400, y: ryBottom + 200 };

        return (
          <g id="river-system">
            {/* 3D River Bank (Cliff dropping into water) */}
            <polygon 
              points={`${rxTop},${ryTop} ${rxBottom},${ryBottom} ${rxBottom},${ryBottom + 20} ${rxTop},${ryTop + 20}`} 
              fill="url(#river-bank-3d)" 
              stroke="#3E2723" 
              strokeWidth="1.5"
            />
            {/* Deep Water Surface */}
            <polygon 
              points={`${rxTop},${ryTop + 18} ${rxBottom},${ryBottom + 18} ${rOuterBottom.x},${rOuterBottom.y + 18} ${rOuterTop.x},${rOuterTop.y + 18}`} 
              fill="url(#river-water-3d)" 
            />
            {/* Water Ripples & Flow */}
            <path d={`M ${rxTop - 60} ${ryTop + 45} Q ${rxTop - 40} ${ryTop + 50} ${rxTop - 20} ${ryTop + 45}`} stroke="#81D4FA" strokeWidth="2" fill="none" opacity="0.8" className="animate-pulse" />
            <path d={`M ${rxBottom - 120} ${ryBottom + 35} Q ${rxBottom - 100} ${ryBottom + 40} ${rxBottom - 80} ${ryBottom + 35}`} stroke="#81D4FA" strokeWidth="2" fill="none" opacity="0.8" className="animate-pulse" />
            
            {/* Rich Flora & Details (Hay Day style) */}
            <WaterLily x={rxTop - 20} y={ryTop + 40} scale={0.8} />
            <WaterLily x={rxBottom - 160} y={ryBottom + 60} scale={1.1} />
            <Cattails x={rxTop} y={ryTop + 15} />
            <Cattails x={rxBottom - 60} y={ryBottom + 12} />
            <RiverStone x={rxTop + 30} y={ryTop + 5} scale={1} />
            
            {/* Animated Jumping Fish! */}
            <AnimatedJumpingFish x={rxTop - 100} y={ryTop + 80} delay="0s" />

            {/* Fishing Pier */}
            <g id="fishing-pier" transform={`translate(${rxTop + 140}, ${ryTop + 70})`} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onBoatClick?.(); }} style={{ pointerEvents: 'auto' }}>
              {/* 3D Pier Deck */}
              <polygon points="0,0 60,30 20,50 -40,20" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />
              <polygon points="-40,20 20,50 20,56 -40,26" fill="#5D4037" />
              <polygon points="20,50 60,30 60,36 20,56" fill="#4E342E" />
              
              {/* Wood plank gaps */}
              <line x1="-15" y1="12" x2="35" y2="37" stroke="#5D4037" strokeWidth="1" />
              <line x1="5" y1="2" x2="45" y2="22" stroke="#5D4037" strokeWidth="1" />
              
              {/* Thick Pier Posts into water */}
              <rect x="-3" y="0" width="6" height="25" fill="#3E2723" />
              <rect x="57" y="30" width="6" height="25" fill="#3E2723" />
              <rect x="17" y="50" width="6" height="25" fill="#3E2723" />
              <rect x="-43" y="20" width="6" height="25" fill="#3E2723" />
              
              {/* Rope Details */}
              <ellipse cx="-40" cy="20" rx="5" ry="2" fill="none" stroke="#D7CCC8" strokeWidth="1.5" />
              <ellipse cx="20" cy="50" rx="5" ry="2" fill="none" stroke="#D7CCC8" strokeWidth="1.5" />

              {/* AUTHENTIC 3D CARTOON FISHING BOAT (Hay Day Style) */}
              <Iso3DBoat
                status={fishingBoatStatus}
                x={10}
                y={22}
                onClick={onBoatClick}
              />
            </g>

            {/* Delivery Boat Pier */}
            <g id="delivery-pier" transform={`translate(${rxTop + 340}, ${ryTop + 170})`} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onDeliveryBoatClick?.(); }} style={{ pointerEvents: 'auto' }}>
              <polygon points="0,0 80,40 30,65 -50,25" fill="#795548" stroke="#3E2723" strokeWidth="2" />
              <polygon points="-50,25 30,65 30,73 -50,33" fill="#5D4037" />
              <polygon points="30,65 80,40 80,48 30,73" fill="#4E342E" />
              <rect x="10" y="5" width="20" height="20" fill="#8D6E63" stroke="#4E342E" transform="skewX(-30)" />
              {/* Pier Posts */}
              <rect x="-4" y="0" width="8" height="30" fill="#4E342E" />
              <rect x="76" y="40" width="8" height="30" fill="#4E342E" />
              <rect x="26" y="65" width="8" height="30" fill="#4E342E" />
              <rect x="-54" y="25" width="8" height="30" fill="#4E342E" />
              <ellipse cx="30" cy="65" rx="6" ry="3" fill="none" stroke="#D7CCC8" strokeWidth="2" />

              {/* AUTHENTIC 3D CARTOON DELIVERY STEAMBOAT */}
              <Iso3DDeliveryBoat
                status={deliveryBoatStatus}
                x={20}
                y={30}
                onClick={onDeliveryBoatClick}
              />
            </g>

          </g>
        );
      })()}

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

      {/* 8. ANIMATED BUTTERFLIES */}
      <g className="animate-bounce" style={{ animationDuration: '2.8s' }}>
        <ButterflyCartoon x={pTop.x + 60} y={pTop.y + 30} wingColor="#E040FB" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '3.6s' }}>
        <ButterflyCartoon x={pLeft.x + 80} y={pLeft.y - 40} wingColor="#FFD600" />
      </g>
      <g className="animate-bounce" style={{ animationDuration: '3.2s' }}>
        <ButterflyCartoon x={pBottom.x + 30} y={pBottom.y + 18} wingColor="#76FF03" />
      </g>

      {/* 10. AUTHENTIC 3D CARTOON MINE ENTRANCE (Firmly Situated ON the Mountain Terrain) */}
      {(() => {
        const mx = pTop.x - 135;
        const my = pTop.y - 70;
        return (
          <g id="farm-mine-area">
            {/* 1. SOLID 3D VOLUMETRIC MOUNTAIN BEDROCK CLIFF BASE (Underneath the Mine) */}
            {/* Lower Bedrock Wall Facing South-East */}
            <polygon
              points={`
                ${mx - 105},${my + 42}
                ${mx + 95},${my + 28}
                ${mx + 95},${my + 58}
                ${mx - 105},${my + 72}
              `}
              fill="url(#mine-terrace-bedrock)"
              stroke="#292524"
              strokeWidth="2"
            />
            {/* Bedrock Strata Horizontal Texture Lines */}
            <line x1={mx - 95} y1={my + 54} x2={mx + 85} y2={my + 40} stroke="#1C1917" strokeWidth="2.5" opacity="0.75" />
            <line x1={mx - 80} y1={my + 64} x2={mx + 70} y2={my + 50} stroke="#44403C" strokeWidth="1.8" opacity="0.8" />

            {/* 2. ELEVATED MOUNTAIN PLATEAU SURFACE (Solid ground the mine rests upon) */}
            <polygon
              points={`
                ${mx - 120},${my - 30}
                ${mx},${my - 75}
                ${mx + 115},${my - 20}
                ${mx + 95},${my + 28}
                ${mx - 105},${my + 42}
              `}
              fill="url(#mine-terrace-grass)"
              stroke="#365314"
              strokeWidth="2.5"
            />

            {/* Mountain Moss & Alpine Grass Tufts on the Plateau */}
            <ellipse cx={mx - 75} cy={my + 15} rx="18" ry="9" fill="#84CC16" opacity="0.8" />
            <ellipse cx={mx + 65} cy={my + 5} rx="20" ry="10" fill="#84CC16" opacity="0.8" />
            <ellipse cx={mx - 40} cy={my - 45} rx="22" ry="11" fill="#4D7C0F" opacity="0.9" />
            <ellipse cx={mx + 50} cy={my - 40} rx="24" ry="12" fill="#4D7C0F" opacity="0.9" />

            {/* Natural Alpine Boulders Anchoring the Mountain Shelf */}
            {/* Left Boulder */}
            <polygon points={`${mx - 110},${my + 22} ${mx - 90},${my + 8} ${mx - 75},${my + 25} ${mx - 95},${my + 38}`} fill="#78716C" stroke="#44403C" strokeWidth="1.8" />
            <polygon points={`${mx - 110},${my + 22} ${mx - 90},${my + 8} ${mx - 84},${my + 14} ${mx - 102},${my + 28}`} fill="#A8A29E" />
            {/* Right Boulder */}
            <polygon points={`${mx + 75},${my + 12} ${mx + 95},${my - 2} ${mx + 105},${my + 15} ${mx + 85},${my + 26}`} fill="#78716C" stroke="#44403C" strokeWidth="1.8" />
            <polygon points={`${mx + 75},${my + 12} ${mx + 95},${my - 2} ${mx + 92},${my + 5} ${mx + 80},${my + 18}`} fill="#A8A29E" />

            {/* 3. WIDE CRUSHED-STONE GRAVEL RAIL YARD & BALLAST BED (Connecting Mine to Road) */}
            <polygon
              points={`
                ${mx - 38},${my + 18}
                ${mx + 38},${my + 18}
                ${pTop.x - 65},${pTop.y - 14}
                ${pTop.x - 118},${pTop.y - 2}
              `}
              fill="url(#mine-ballast-gravel)"
              stroke="#44403C"
              strokeWidth="2"
            />
            {/* Gravel Border Pebbles & Textured Rim */}
            <line x1={mx - 38} y1={my + 18} x2={pTop.x - 118} y2={pTop.y - 2} stroke="#78716C" strokeWidth="3.5" strokeDasharray="5 3" opacity="0.85" />
            <line x1={mx + 38} y1={my + 18} x2={pTop.x - 65} y2={pTop.y - 14} stroke="#78716C" strokeWidth="3.5" strokeDasharray="5 3" opacity="0.85" />

            {/* 4. RAILWAY TIES & STEEL TRACKS EXTENDING OUTWARD ACROSS THE TERRAIN */}
            {[
              { x1: mx - 22, y1: my + 28, x2: mx + 22, y2: my + 28, w: 4 },
              { x1: mx - 15, y1: my + 42, x2: mx + 29, y2: my + 42, w: 4 },
              { x1: pTop.x - 108, y1: pTop.y + 4, x2: pTop.x - 72, y2: pTop.y - 4, w: 4 },
              { x1: pTop.x - 100, y1: pTop.y + 16, x2: pTop.x - 64, y2: pTop.y + 8, w: 4.5 },
            ].map((tie, idx) => (
              <line
                key={`scenery_mine_tie_${idx}`}
                x1={tie.x1}
                y1={tie.y1}
                x2={tie.x2}
                y2={tie.y2}
                stroke="#5D4037"
                strokeWidth={tie.w}
                strokeLinecap="round"
              />
            ))}

            {/* Steel Tracks Running Down across the Mountain Rail Bed */}
            {/* Left Rail */}
            <line x1={mx - 14} y1={my + 22} x2={pTop.x - 96} y2={pTop.y + 18} stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <line x1={mx - 14} y1={my + 22} x2={pTop.x - 96} y2={pTop.y + 18} stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            {/* Right Rail */}
            <line x1={mx + 14} y1={my + 22} x2={pTop.x - 76} y2={pTop.y + 10} stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <line x1={mx + 14} y1={my + 22} x2={pTop.x - 76} y2={pTop.y + 10} stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />

            {/* 5. THE MAJESTIC 3D IsoMineEntrance (Resting Securely on the Mountain Plateau) */}
            <g transform={`translate(${mx}, ${my})`}>
              <IsoMineEntrance
                status={mineStatus}
                repairStartedAt={mineRepairStartedAt}
                playerLevel={playerLevel}
                onClick={onMineClick}
              />
            </g>
          </g>
        );
      })()}
    </g>
  );
});

// 3D Cartoon Volumetric Oak Tree with Glossy Apple Canopy
export const TreeOakCartoon: React.FC<{ x: number; y: number; scale?: number; hasApples?: boolean }> = ({
  x,
  y,
  scale = 1,
  hasApples = false,
}) => {
  return <Detailed3DOak x={x} y={y} scale={scale} hasFruit={hasApples} />;
};

// 3D Cartoon Pine / Fir Tree
export const TreePineCartoon: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return <Detailed3DPine x={x} y={y} scale={scale} />;
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

// --- NEW HAY DAY FLORA & ENVIRONMENTAL DETAILS ---

// 3D Water Lily (Vitória-Régia)
export const WaterLily: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Lily Pad Leaf */}
      <path d="M 0 -8 C 8 -8 15 -2 15 5 C 15 10 9 14 0 14 C -9 14 -15 10 -15 5 C -15 -2 -8 -8 0 -8 Z" fill="#4CAF50" stroke="#1B5E20" strokeWidth="1" />
      <path d="M 0 5 L -10 12" stroke="#1B5E20" strokeWidth="1" />
      {/* Pink Flower */}
      <polygon points="0,-4 -3,-8 0,-12 3,-8" fill="#F48FB1" stroke="#C2185B" strokeWidth="0.5" />
      <polygon points="0,-4 -6,-5 -4,-10 0,-7" fill="#F48FB1" stroke="#C2185B" strokeWidth="0.5" />
      <polygon points="0,-4 6,-5 4,-10 0,-7" fill="#F48FB1" stroke="#C2185B" strokeWidth="0.5" />
      <circle cx="0" cy="-4" r="1.5" fill="#FFEB3B" />
    </g>
  );
};

// 3D Cattails (Taboas)
export const Cattails: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Green Stalks */}
      <path d="M -5 10 Q -8 0 -10 -15" fill="none" stroke="#689F38" strokeWidth="1.5" />
      <path d="M 0 10 Q 0 0 2 -18" fill="none" stroke="#689F38" strokeWidth="1.5" />
      <path d="M 5 10 Q 8 0 12 -12" fill="none" stroke="#689F38" strokeWidth="1.5" />
      {/* Brown Fuzzy Heads */}
      <rect x="-11.5" y="-12" width="3" height="8" rx="1.5" fill="#5D4037" transform="rotate(-15 -10 -12)" />
      <rect x="0.5" y="-14" width="3.5" height="10" rx="1.5" fill="#5D4037" />
      <rect x="10.5" y="-8" width="3" height="7" rx="1.5" fill="#5D4037" transform="rotate(20 12 -8)" />
      {/* Small Grass Blades at base */}
      <path d="M -5 10 Q -10 5 -12 0" fill="none" stroke="#7CB342" strokeWidth="1" />
      <path d="M 5 10 Q 10 5 14 2" fill="none" stroke="#7CB342" strokeWidth="1" />
    </g>
  );
};

// Smooth River Stone
export const RiverStone: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="4" rx="12" ry="5" fill="rgba(0,0,0,0.3)" />
      <path d="M -10 2 C -10 -6 0 -8 12 -2 C 14 4 6 8 -2 8 C -8 8 -10 6 -10 2 Z" fill="#9E9E9E" stroke="#616161" strokeWidth="1" />
      {/* Moss patch */}
      <path d="M -6 0 C -4 -4 4 -2 6 2 C 2 4 -4 3 -6 0 Z" fill="#558B2F" opacity="0.8" />
    </g>
  );
};

// --- ANIMATED JUMPING FISH (Hay Day Style) ---
// This uses a keyframe animation in CSS that we inject dynamically or rely on Tailwind.
// Since we can't easily add arbitrary @keyframes, we'll use SVG <animateMotion> or <animateTransform>
export const AnimatedJumpingFish: React.FC<{ x: number; y: number; delay?: string }> = ({ x, y, delay = "0s" }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Splash Ring (Expands when fish lands/jumps) */}
      <ellipse cx="0" cy="0" rx="15" ry="5" fill="none" stroke="#E1F5FE" strokeWidth="1.5" opacity="0">
        <animate attributeName="rx" values="0;15;20" dur="4s" begin={delay} repeatCount="indefinite" />
        <animate attributeName="ry" values="0;5;7" dur="4s" begin={delay} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.8;0" dur="4s" begin={delay} repeatCount="indefinite" />
      </ellipse>
      
      {/* The Fish Sprite */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.25;0.3;1" dur="4s" begin={delay} repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0; -10,-30; -20,0" keyTimes="0;0.15;0.3" dur="4s" begin={delay} repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="rotate" values="-45; 0; 45" keyTimes="0;0.15;0.3" dur="4s" begin={delay} repeatCount="indefinite" additive="sum" />
        
        {/* Fish Body */}
        <path d="M -6 0 C -6 -4 6 -4 10 0 C 6 4 -6 4 -6 0 Z" fill="#00BCD4" stroke="#00838F" strokeWidth="0.5" />
        {/* Tail */}
        <polygon points="-6,0 -10,-4 -10,4" fill="#00E5FF" stroke="#00838F" strokeWidth="0.5" />
        {/* Eye */}
        <circle cx="6" cy="-1.5" r="1" fill="#FFFFFF" />
        <circle cx="6.5" cy="-1.5" r="0.5" fill="#000000" />
        {/* Fin */}
        <path d="M 0 -2 L -2 -5 L 2 -2 Z" fill="#00E5FF" />
      </g>
    </g>
  );
};
