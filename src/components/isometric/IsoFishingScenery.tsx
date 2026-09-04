import React from 'react';
import { gridToScreen, TILE_WIDTH, TILE_HEIGHT } from '../../utils/isometricCoords';
import { WaterLily, Cattails, RiverStone } from './IsoScenery';

const MAP_SIZE = 16;
// Calculate bounding box of the isometric grid
const topPos = gridToScreen(0, 0);
const leftPos = gridToScreen(0, MAP_SIZE - 1);
const rightPos = gridToScreen(MAP_SIZE - 1, 0);
const bottomPos = gridToScreen(MAP_SIZE - 1, MAP_SIZE - 1);

// Bounding box for the SVG
const minX = leftPos.x - TILE_WIDTH * 3;
const maxX = rightPos.x + TILE_WIDTH * 3;
const minY = topPos.y - TILE_HEIGHT * 3;
const maxY = bottomPos.y + TILE_HEIGHT * 4;

const width = maxX - minX;
const height = maxY - minY;

// Animated Dragonfly hovering over the lake
const AnimatedDragonfly: React.FC<{ x: number; y: number; delay?: string }> = ({ x, y, delay = '0s' }) => (
  <g transform={`translate(${x}, ${y})`} className="pointer-events-none">
    <animateTransform
      attributeName="transform"
      type="translate"
      values={`${x},${y}; ${x + 28},${y - 18}; ${x - 18},${y - 12}; ${x},${y}`}
      dur="6s"
      begin={delay}
      repeatCount="indefinite"
    />
    {/* Body */}
    <ellipse cx="0" cy="0" rx="2.5" ry="8" fill="#00E5FF" stroke="#00838F" strokeWidth="0.5" />
    <circle cx="0" cy="-8" r="3" fill="#00ACC1" />
    {/* Transparent Wings */}
    <ellipse cx="-8" cy="-2" rx="8" ry="2.5" fill="white" opacity="0.75" stroke="#B2EBF2" strokeWidth="0.5" transform="rotate(-15)" className="animate-pulse" />
    <ellipse cx="8" cy="-2" rx="8" ry="2.5" fill="white" opacity="0.75" stroke="#B2EBF2" strokeWidth="0.5" transform="rotate(15)" className="animate-pulse" />
  </g>
);

// Sparkle Star on Sunlit Water
const WaterSunGlint: React.FC<{ x: number; y: number; delay: string; scale?: number }> = ({ x, y, delay, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} className="pointer-events-none">
    <path
      d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Q 0 0 0 -8 Z"
      fill="#FFFFFF"
      opacity="0"
    >
      <animate
        attributeName="opacity"
        values="0;0.9;0"
        dur="3s"
        begin={delay}
        repeatCount="indefinite"
      />
      <animateTransform
        attributeName="transform"
        type="scale"
        values="0.3; 1.2; 0.3"
        dur="3s"
        begin={delay}
        repeatCount="indefinite"
      />
    </path>
    <circle cx="0" cy="0" r="2" fill="#E0F7FA" opacity="0">
      <animate
        attributeName="opacity"
        values="0;0.8;0"
        dur="3s"
        begin={delay}
        repeatCount="indefinite"
      />
    </circle>
  </g>
);

// Underwater Darting Fish School Silhouette
const UnderwaterFishSchool: React.FC<{ startX: number; startY: number; delay?: string }> = ({ startX, startY, delay = '0s' }) => (
  <g opacity="0.35" className="pointer-events-none">
    <animateTransform
      attributeName="transform"
      type="translate"
      values={`${startX},${startY}; ${startX + 140},${startY + 65}; ${startX + 70},${startY + 120}; ${startX},${startY}`}
      dur="18s"
      begin={delay}
      repeatCount="indefinite"
    />
    {/* Fish 1 */}
    <g transform="translate(0, 0) rotate(25)">
      <ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#002244" />
      <polygon points="-7,0 -12,-3 -12,3" fill="#002244" />
    </g>
    {/* Fish 2 */}
    <g transform="translate(18, 10) rotate(28)">
      <ellipse cx="0" cy="0" rx="7" ry="2.8" fill="#002244" />
      <polygon points="-5,0 -9,-2.5 -9,2.5" fill="#002244" />
    </g>
    {/* Fish 3 */}
    <g transform="translate(-14, 12) rotate(20)">
      <ellipse cx="0" cy="0" rx="8" ry="3" fill="#002244" />
      <polygon points="-6,0 -10,-2.5 -10,2.5" fill="#002244" />
    </g>
  </g>
);

export const IsoFishingScenery: React.FC = () => {
  const lakeTopLeft = gridToScreen(2, 2);
  const lakeTopRight = gridToScreen(15, 2);
  const lakeBottomRight = gridToScreen(15, 15);
  const lakeBottomLeft = gridToScreen(2, 15);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <svg
        width={width}
        height={height}
        viewBox={`${minX} ${minY} ${width} ${height}`}
        style={{ position: 'absolute', left: minX, top: minY, overflow: 'visible' }}
      >
        <defs>
          {/* Rich Multi-tone Cartoon Water Depth Gradient */}
          <linearGradient id="lake-water-depth-rich" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4DD0E1" />
            <stop offset="15%" stopColor="#26C6DA" />
            <stop offset="35%" stopColor="#00BCD4" />
            <stop offset="55%" stopColor="#0288D1" />
            <stop offset="80%" stopColor="#01579B" />
            <stop offset="100%" stopColor="#002F6C" />
          </linearGradient>

          {/* Shoreline Sand/Shallows Gradient */}
          <linearGradient id="lake-shoreline-sand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="30%" stopColor="#B2EBF2" />
            <stop offset="70%" stopColor="#4DD0E1" />
            <stop offset="100%" stopColor="#00ACC1" />
          </linearGradient>

          {/* Grass Hills Surface Gradient */}
          <linearGradient id="grass-surface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#AED581" />
            <stop offset="40%" stopColor="#8BC34A" />
            <stop offset="85%" stopColor="#689F38" />
            <stop offset="100%" stopColor="#437222" />
          </linearGradient>

          {/* Mountain Rock Cliff */}
          <linearGradient id="rock-cliff" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="40%" stopColor="#6D4C41" />
            <stop offset="80%" stopColor="#4E342E" />
            <stop offset="100%" stopColor="#2D1B15" />
          </linearGradient>

          {/* Wooden Pier Planks */}
          <linearGradient id="pier-wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BCAAA4" />
            <stop offset="40%" stopColor="#8D6E63" />
            <stop offset="85%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
        </defs>

        {/* --- BASE TERRAIN (Lush Green Grass Hills) --- */}
        <polygon
          points={`
            ${topPos.x},${topPos.y - 520}
            ${rightPos.x + 520},${rightPos.y - 260}
            ${bottomPos.x},${bottomPos.y + 520}
            ${leftPos.x - 520},${leftPos.y + 260}
          `}
          fill="url(#grass-surface)"
        />

        {/* Mountain Ridge Accent in Background */}
        <polygon
          points={`
            ${topPos.x - 320},${topPos.y - 480}
            ${topPos.x + 320},${topPos.y - 480}
            ${topPos.x + 120},${topPos.y - 220}
            ${topPos.x - 220},${topPos.y - 220}
          `}
          fill="#3B591D"
          opacity="0.45"
        />

        {/* --- LAKE BASIN SHORELINE (Beveled Natural Rocky Bank) --- */}
        {/* Back Cliffs */}
        <polygon
          points={`
            ${lakeTopLeft.x},${lakeTopLeft.y}
            ${lakeTopRight.x},${lakeTopRight.y}
            ${lakeTopRight.x},${lakeTopRight.y + 75}
            ${lakeTopLeft.x},${lakeTopLeft.y + 75}
          `}
          fill="url(#rock-cliff)"
        />
        <polygon
          points={`
            ${lakeTopLeft.x},${lakeTopLeft.y}
            ${lakeBottomLeft.x},${lakeBottomLeft.y}
            ${lakeBottomLeft.x},${lakeBottomLeft.y + 75}
            ${lakeTopLeft.x},${lakeTopLeft.y + 75}
          `}
          fill="url(#rock-cliff)"
        />

        {/* --- MAIN LAKE WATER SURFACE (Hay Day Rich Stylized Water) --- */}
        <g transform="translate(0, 45)">
          {/* Layer 1: Shallow Sand/Pebble Shoreline ring */}
          <polygon
            points={`
              ${lakeTopLeft.x - 18},${lakeTopLeft.y - 10}
              ${lakeTopRight.x + 18},${lakeTopRight.y - 10}
              ${lakeBottomRight.x + 18},${lakeBottomRight.y + 18}
              ${lakeBottomLeft.x - 18},${lakeBottomLeft.y + 18}
            `}
            fill="url(#lake-shoreline-sand)"
            opacity="0.9"
          />

          {/* Layer 2: Deep Crystal Water Body */}
          <polygon
            points={`
              ${lakeTopLeft.x},${lakeTopLeft.y}
              ${lakeTopRight.x},${lakeTopRight.y}
              ${lakeBottomRight.x},${lakeBottomRight.y}
              ${lakeBottomLeft.x},${lakeBottomLeft.y}
            `}
            fill="url(#lake-water-depth-rich)"
            stroke="#00ACC1"
            strokeWidth="1.5"
          />

          {/* Layer 3: Shoreline Animated White Foam Wave Crest */}
          <polygon
            points={`
              ${lakeTopLeft.x + 3},${lakeTopLeft.y + 2}
              ${lakeTopRight.x - 3},${lakeTopRight.y + 2}
              ${lakeBottomRight.x - 3},${lakeBottomRight.y - 2}
              ${lakeBottomLeft.x + 3},${lakeBottomLeft.y - 2}
            `}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeDasharray="14 8 20 6"
            strokeLinecap="round"
            opacity="0.75"
          >
            <animate attributeName="stroke-dashoffset" values="0; 48" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6; 0.9; 0.6" dur="2.5s" repeatCount="indefinite" />
          </polygon>

          {/* Secondary Delicate Inner Foam Lace */}
          <polygon
            points={`
              ${lakeTopLeft.x + 12},${lakeTopLeft.y + 8}
              ${lakeTopRight.x - 12},${lakeTopRight.y + 8}
              ${lakeBottomRight.x - 12},${lakeBottomRight.y - 8}
              ${lakeBottomLeft.x + 12},${lakeBottomLeft.y - 8}
            `}
            fill="none"
            stroke="#E0F7FA"
            strokeWidth="2"
            strokeDasharray="8 12"
            opacity="0.5"
          >
            <animate attributeName="stroke-dashoffset" values="40; 0" dur="5s" repeatCount="indefinite" />
          </polygon>

          {/* Layer 4: Animated Water Caustics / Sunlight Shimmer Bands (Hay Day Waves) */}
          <g stroke="#E0F7FA" strokeWidth="3" strokeLinecap="round" opacity="0.6">
            <path d={`M ${gridToScreen(3.5, 4.5).x} ${gridToScreen(3.5, 4.5).y} Q ${gridToScreen(4.8, 5.8).x} ${gridToScreen(4.8, 5.8).y - 14} ${gridToScreen(6.2, 4.5).x} ${gridToScreen(6.2, 4.5).y}`}>
              <animateTransform attributeName="transform" type="translate" values="-18,0; 18,0; -18,0" dur="4.8s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(8.5, 6.5).x} ${gridToScreen(8.5, 6.5).y} Q ${gridToScreen(9.8, 7.8).x} ${gridToScreen(9.8, 7.8).y - 16} ${gridToScreen(11.2, 6.5).x} ${gridToScreen(11.2, 6.5).y}`}>
              <animateTransform attributeName="transform" type="translate" values="16,0; -16,0; 16,0" dur="5.2s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(6.5, 10.5).x} ${gridToScreen(6.5, 10.5).y} Q ${gridToScreen(7.8, 11.8).x} ${gridToScreen(7.8, 11.8).y - 12} ${gridToScreen(9.2, 10.5).x} ${gridToScreen(9.2, 10.5).y}`}>
              <animateTransform attributeName="transform" type="translate" values="0,8; 0,-8; 0,8" dur="4.2s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(11.5, 9.5).x} ${gridToScreen(11.5, 9.5).y} Q ${gridToScreen(12.8, 10.8).x} ${gridToScreen(12.8, 10.8).y - 14} ${gridToScreen(14, 9.5).x} ${gridToScreen(14, 9.5).y}`}>
              <animateTransform attributeName="transform" type="translate" values="-10,6; 10,-6; -10,6" dur="4.5s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(5, 13).x} ${gridToScreen(5, 13).y} Q ${gridToScreen(6.2, 14).x} ${gridToScreen(6.2, 14).y - 12} ${gridToScreen(7.5, 13).x} ${gridToScreen(7.5, 13).y}`}>
              <animateTransform attributeName="transform" type="translate" values="14,-4; -14,4; 14,-4" dur="5.6s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Cyan Glow Caustic Mesh (Soft Sun Rays on Water) */}
          <g stroke="#80DEEA" strokeWidth="1.8" strokeLinecap="round" opacity="0.45">
            <path d={`M ${gridToScreen(4, 7).x} ${gridToScreen(4, 7).y} C ${gridToScreen(5.5, 8).x} ${gridToScreen(5.5, 8).y - 8}, ${gridToScreen(7, 6.5).x} ${gridToScreen(7, 6.5).y + 8}, ${gridToScreen(8.5, 7.5).x} ${gridToScreen(8.5, 7.5).y}`}>
              <animateTransform attributeName="transform" type="translate" values="-8,5; 8,-5; -8,5" dur="6s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(9, 11).x} ${gridToScreen(9, 11).y} C ${gridToScreen(10.5, 12).x} ${gridToScreen(10.5, 12).y - 8}, ${gridToScreen(12, 10.5).x} ${gridToScreen(12, 10.5).y + 8}, ${gridToScreen(13.5, 11.5).x} ${gridToScreen(13.5, 11.5).y}`}>
              <animateTransform attributeName="transform" type="translate" values="8,-4; -8,4; 8,-4" dur="5.4s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Layer 5: Twinkling Sunlight Glint Stars (✦) across Water */}
          <WaterSunGlint x={gridToScreen(5, 4).x} y={gridToScreen(5, 4).y} delay="0s" scale={1.1} />
          <WaterSunGlint x={gridToScreen(7.5, 6).x} y={gridToScreen(7.5, 6).y} delay="1.2s" scale={1.3} />
          <WaterSunGlint x={gridToScreen(10, 5).x} y={gridToScreen(10, 5).y} delay="0.6s" scale={0.9} />
          <WaterSunGlint x={gridToScreen(12.5, 8).x} y={gridToScreen(12.5, 8).y} delay="1.8s" scale={1.2} />
          <WaterSunGlint x={gridToScreen(8, 12).x} y={gridToScreen(8, 12).y} delay="2.4s" scale={1.4} />
          <WaterSunGlint x={gridToScreen(13.5, 11).x} y={gridToScreen(13.5, 11).y} delay="1s" scale={1} />
          <WaterSunGlint x={gridToScreen(4.5, 11.5).x} y={gridToScreen(4.5, 11.5).y} delay="2.1s" scale={1.1} />

          {/* Layer 6: Underwater Swimming Fish Schools */}
          <UnderwaterFishSchool startX={gridToScreen(5, 8).x} startY={gridToScreen(5, 8).y} delay="0s" />
          <UnderwaterFishSchool startX={gridToScreen(10, 9).x} startY={gridToScreen(10, 9).y} delay="7s" />

          {/* Layer 7: Water Lilies with Pink Lotus Flowers */}
          <WaterLily x={gridToScreen(3, 3.5).x} y={gridToScreen(3, 3.5).y} scale={1.4} />
          <WaterLily x={gridToScreen(3.8, 4.2).x} y={gridToScreen(3.8, 4.2).y} scale={1} />
          <WaterLily x={gridToScreen(13.5, 13.5).x} y={gridToScreen(13.5, 13.5).y} scale={1.6} />
          <WaterLily x={gridToScreen(14.2, 12.5).x} y={gridToScreen(14.2, 12.5).y} scale={1.2} />
          <WaterLily x={gridToScreen(6, 14).x} y={gridToScreen(6, 14).y} scale={1.3} />
          <WaterLily x={gridToScreen(11.5, 14.2).x} y={gridToScreen(11.5, 14.2).y} scale={1.1} />

          {/* Dragonflies Buzzing over the water */}
          <AnimatedDragonfly x={gridToScreen(6, 6).x} y={gridToScreen(6, 6).y} delay="0s" />
          <AnimatedDragonfly x={gridToScreen(12, 8).x} y={gridToScreen(12, 8).y} delay="2s" />
          <AnimatedDragonfly x={gridToScreen(8, 13).x} y={gridToScreen(8, 13).y} delay="3.5s" />
        </g>

        {/* --- WOODEN PIER DOCK BOARDWALK (Connecting Cabin & Lure Maker) --- */}
        <g>
          {/* Depth Shadow under the pier */}
          <polygon
            points={`
              ${gridToScreen(2, 2).x + 40},${gridToScreen(2, 2).y + 65}
              ${gridToScreen(6, 2).x + 40},${gridToScreen(6, 2).y + 65}
              ${gridToScreen(6, 5).x + 40},${gridToScreen(6, 5).y + 65}
              ${gridToScreen(2, 5).x + 40},${gridToScreen(2, 5).y + 65}
            `}
            fill="#001F3F"
            opacity="0.4"
          />

          {/* Main Wooden Pier Platform */}
          <polygon
            points={`
              ${gridToScreen(2, 2).x + 40},${gridToScreen(2, 2).y + 50}
              ${gridToScreen(6, 2).x + 40},${gridToScreen(6, 2).y + 50}
              ${gridToScreen(6, 5).x + 40},${gridToScreen(6, 5).y + 50}
              ${gridToScreen(2, 5).x + 40},${gridToScreen(2, 5).y + 50}
            `}
            fill="url(#pier-wood)"
            stroke="#3E2723"
            strokeWidth="2"
            opacity="0.95"
            className="drop-shadow-md"
          />
          {/* Planks styling lines */}
          <line
            x1={gridToScreen(2.5, 2).x + 40}
            y1={gridToScreen(2.5, 2).y + 50}
            x2={gridToScreen(2.5, 5).x + 40}
            y2={gridToScreen(2.5, 5).y + 50}
            stroke="#5D4037"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line
            x1={gridToScreen(3.5, 2).x + 40}
            y1={gridToScreen(3.5, 2).y + 50}
            x2={gridToScreen(3.5, 5).x + 40}
            y2={gridToScreen(3.5, 5).y + 50}
            stroke="#5D4037"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line
            x1={gridToScreen(4.5, 2).x + 40}
            y1={gridToScreen(4.5, 2).y + 50}
            x2={gridToScreen(4.5, 5).x + 40}
            y2={gridToScreen(4.5, 5).y + 50}
            stroke="#5D4037"
            strokeWidth="1.5"
            opacity="0.7"
          />
        </g>

        {/* --- FRONT BANKS (Overlapping Water with Lush Foliage) --- */}
        <polygon
          points={`
            ${lakeTopRight.x},${lakeTopRight.y}
            ${rightPos.x + 520},${rightPos.y - 260}
            ${bottomPos.x},${bottomPos.y + 520}
            ${lakeBottomRight.x},${lakeBottomRight.y + 45}
          `}
          fill="url(#grass-surface)"
        />
        <polygon
          points={`
            ${lakeBottomLeft.x},${lakeBottomLeft.y}
            ${leftPos.x - 520},${leftPos.y + 260}
            ${bottomPos.x},${bottomPos.y + 520}
            ${lakeBottomRight.x},${lakeBottomRight.y + 45}
          `}
          fill="url(#grass-surface)"
        />

        {/* --- FLORA & ENVIRONMENTAL DETAILS --- */}
        {/* River Stones along Shoreline */}
        <RiverStone x={gridToScreen(1.5, 5).x} y={gridToScreen(1.5, 5).y + 10} scale={2} />
        <RiverStone x={gridToScreen(2, 7).x} y={gridToScreen(2, 7).y + 20} scale={1.5} />
        <RiverStone x={gridToScreen(5, 15.5).x} y={gridToScreen(5, 15.5).y + 10} scale={2.5} />
        <RiverStone x={gridToScreen(7, 15.8).x} y={gridToScreen(7, 15.8).y + 15} scale={1.8} />
        <RiverStone x={gridToScreen(15.5, 6).x} y={gridToScreen(15.5, 6).y + 20} scale={2.2} />
        <RiverStone x={gridToScreen(15.2, 9).x} y={gridToScreen(15.2, 9).y + 10} scale={1.6} />

        {/* Cattails (Taboas) Clusters */}
        <Cattails x={gridToScreen(1, 4).x} y={gridToScreen(1, 4).y} scale={1.8} />
        <Cattails x={gridToScreen(1.8, 4.5).x} y={gridToScreen(1.8, 4.5).y} scale={1.4} />
        <Cattails x={gridToScreen(3.5, 15.5).x} y={gridToScreen(3.5, 15.5).y} scale={1.9} />
        <Cattails x={gridToScreen(4.5, 15.8).x} y={gridToScreen(4.5, 15.8).y} scale={1.5} />
        <Cattails x={gridToScreen(15.5, 4).x} y={gridToScreen(15.5, 4).y} scale={1.7} />
        <Cattails x={gridToScreen(15.8, 7.5).x} y={gridToScreen(15.8, 7.5).y} scale={1.4} />
      </svg>
    </div>
  );
};
