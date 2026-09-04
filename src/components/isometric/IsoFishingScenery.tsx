import React from 'react';
import { gridToScreen, TILE_WIDTH, TILE_HEIGHT } from '../../utils/isometricCoords';
import { WaterLily, Cattails, RiverStone, AnimatedJumpingFish } from './IsoScenery';

const MAP_SIZE = 16;
// Calculate bounding box of the isometric grid
const topPos = gridToScreen(0, 0);
const leftPos = gridToScreen(0, MAP_SIZE - 1);
const rightPos = gridToScreen(MAP_SIZE - 1, 0);
const bottomPos = gridToScreen(MAP_SIZE - 1, MAP_SIZE - 1);

// Bounding box for the SVG
const minX = leftPos.x - TILE_WIDTH * 2;
const maxX = rightPos.x + TILE_WIDTH * 2;
const minY = topPos.y - TILE_HEIGHT * 2;
const maxY = bottomPos.y + TILE_HEIGHT * 3;

const width = maxX - minX;
const height = maxY - minY;

// Animated Dragonfly hovering over the lake
const AnimatedDragonfly: React.FC<{ x: number; y: number; delay?: string }> = ({ x, y, delay = '0s' }) => (
  <g transform={`translate(${x}, ${y})`} className="pointer-events-none">
    <animateTransform
      attributeName="transform"
      type="translate"
      values={`${x},${y}; ${x + 25},${y - 15}; ${x - 15},${y - 10}; ${x},${y}`}
      dur="6s"
      begin={delay}
      repeatCount="indefinite"
    />
    {/* Body */}
    <ellipse cx="0" cy="0" rx="2" ry="7" fill="#00E5FF" stroke="#00838F" strokeWidth="0.5" />
    <circle cx="0" cy="-7" r="2.5" fill="#00ACC1" />
    {/* Transparent Wings */}
    <ellipse cx="-7" cy="-2" rx="7" ry="2" fill="white" opacity="0.6" stroke="#B2EBF2" strokeWidth="0.5" transform="rotate(-15)" className="animate-pulse" />
    <ellipse cx="7" cy="-2" rx="7" ry="2" fill="white" opacity="0.6" stroke="#B2EBF2" strokeWidth="0.5" transform="rotate(15)" className="animate-pulse" />
  </g>
);

// Pine Tree for background mountain atmosphere
const MountainPine: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} className="pointer-events-none drop-shadow-lg">
    {/* Shadow */}
    <ellipse cx="0" cy="15" rx="18" ry="8" fill="rgba(0,0,0,0.2)" />
    {/* Trunk */}
    <rect x="-4" y="0" width="8" height="18" fill="#5D4037" rx="2" />
    {/* Tier 3 (Bottom) */}
    <polygon points="0,-10 24,8 -24,8" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
    {/* Tier 2 (Middle) */}
    <polygon points="0,-25 18,-6 -18,-6" fill="#388E3C" stroke="#1B5E20" strokeWidth="1.5" />
    {/* Tier 1 (Top) */}
    <polygon points="0,-40 12,-20 -12,-20" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
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
          {/* Deep Turquoise Water Gradient */}
          <linearGradient id="lake-water-depth" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#29B6F6" />
            <stop offset="30%" stopColor="#0288D1" />
            <stop offset="70%" stopColor="#01579B" />
            <stop offset="100%" stopColor="#002F6C" />
          </linearGradient>

          {/* Shoreline Sand/Shallows Gradient */}
          <linearGradient id="lake-shoreline-sand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C8E6C9" />
            <stop offset="50%" stopColor="#81D4FA" />
            <stop offset="100%" stopColor="#29B6F6" />
          </linearGradient>

          {/* Grass Hills Gradient */}
          <linearGradient id="grass-surface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CCC65" />
            <stop offset="50%" stopColor="#7CB342" />
            <stop offset="100%" stopColor="#558B2F" />
          </linearGradient>

          {/* Mountain Rock Cliff */}
          <linearGradient id="rock-cliff" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="50%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>

          {/* Wooden Pier Planks */}
          <linearGradient id="pier-wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A1887F" />
            <stop offset="50%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>
        </defs>

        {/* --- BASE TERRAIN (Lush Green Grass Hills) --- */}
        <polygon
          points={`
            ${topPos.x},${topPos.y - 500}
            ${rightPos.x + 500},${rightPos.y - 250}
            ${bottomPos.x},${bottomPos.y + 500}
            ${leftPos.x - 500},${leftPos.y + 250}
          `}
          fill="url(#grass-surface)"
        />

        {/* Mountain Ridge Accent in Background */}
        <polygon
          points={`
            ${topPos.x - 300},${topPos.y - 450}
            ${topPos.x + 300},${topPos.y - 450}
            ${topPos.x + 100},${topPos.y - 200}
            ${topPos.x - 200},${topPos.y - 200}
          `}
          fill="#4B6A28"
          opacity="0.4"
        />

        {/* --- LAKE BASIN SHORELINE (Beveled Natural Rocky Bank) --- */}
        {/* Back Cliffs */}
        <polygon
          points={`
            ${lakeTopLeft.x},${lakeTopLeft.y}
            ${lakeTopRight.x},${lakeTopRight.y}
            ${lakeTopRight.x},${lakeTopRight.y + 70}
            ${lakeTopLeft.x},${lakeTopLeft.y + 70}
          `}
          fill="url(#rock-cliff)"
        />
        <polygon
          points={`
            ${lakeTopLeft.x},${lakeTopLeft.y}
            ${lakeBottomLeft.x},${lakeBottomLeft.y}
            ${lakeBottomLeft.x},${lakeBottomLeft.y + 70}
            ${lakeTopLeft.x},${lakeTopLeft.y + 70}
          `}
          fill="url(#rock-cliff)"
        />

        {/* --- MAIN LAKE WATER SURFACE --- */}
        <g transform="translate(0, 45)">
          {/* Shallow Sand/Pebble Shoreline ring */}
          <polygon
            points={`
              ${lakeTopLeft.x - 15},${lakeTopLeft.y - 8}
              ${lakeTopRight.x + 15},${lakeTopRight.y - 8}
              ${lakeBottomRight.x + 15},${lakeBottomRight.y + 15}
              ${lakeBottomLeft.x - 15},${lakeBottomLeft.y + 15}
            `}
            fill="url(#lake-shoreline-sand)"
            opacity="0.85"
          />

          {/* Deep Crystal Water Polygon */}
          <polygon
            points={`
              ${lakeTopLeft.x},${lakeTopLeft.y}
              ${lakeTopRight.x},${lakeTopRight.y}
              ${lakeBottomRight.x},${lakeBottomRight.y}
              ${lakeBottomLeft.x},${lakeBottomLeft.y}
            `}
            fill="url(#lake-water-depth)"
          />

          {/* Animated Water Caustics / Sunlight Shimmer */}
          <g opacity="0.45" stroke="#E0F7FA" strokeWidth="2.5" strokeLinecap="round">
            <path d={`M ${gridToScreen(4, 5).x} ${gridToScreen(4, 5).y} Q ${gridToScreen(5, 6).x} ${gridToScreen(5, 6).y - 12} ${gridToScreen(6, 5).x} ${gridToScreen(6, 5).y}`}>
              <animateTransform attributeName="transform" type="translate" values="-15,0; 15,0; -15,0" dur="4.5s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(9, 7).x} ${gridToScreen(9, 7).y} Q ${gridToScreen(10, 8).x} ${gridToScreen(10, 8).y - 14} ${gridToScreen(11, 7).x} ${gridToScreen(11, 7).y}`}>
              <animateTransform attributeName="transform" type="translate" values="12,0; -12,0; 12,0" dur="5s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(7, 11).x} ${gridToScreen(7, 11).y} Q ${gridToScreen(8, 12).x} ${gridToScreen(8, 12).y - 10} ${gridToScreen(9, 11).x} ${gridToScreen(9, 11).y}`}>
              <animateTransform attributeName="transform" type="translate" values="0,6; 0,-6; 0,6" dur="3.8s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(12, 10).x} ${gridToScreen(12, 10).y} Q ${gridToScreen(13, 11).x} ${gridToScreen(13, 11).y - 12} ${gridToScreen(14, 10).x} ${gridToScreen(14, 10).y}`}>
              <animateTransform attributeName="transform" type="translate" values="-8,4; 8,-4; -8,4" dur="4.2s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Water Lilies with Pink Lotus Flowers */}
          <WaterLily x={gridToScreen(3, 3.5).x} y={gridToScreen(3, 3.5).y} scale={1.3} />
          <WaterLily x={gridToScreen(3.8, 4.2).x} y={gridToScreen(3.8, 4.2).y} scale={0.9} />
          <WaterLily x={gridToScreen(13.5, 13.5).x} y={gridToScreen(13.5, 13.5).y} scale={1.5} />
          <WaterLily x={gridToScreen(14.2, 12.5).x} y={gridToScreen(14.2, 12.5).y} scale={1.1} />
          <WaterLily x={gridToScreen(6, 14).x} y={gridToScreen(6, 14).y} scale={1.2} />

          {/* Jumping Wild Fish */}
          <AnimatedJumpingFish x={gridToScreen(8, 8).x} y={gridToScreen(8, 8).y} delay="0s" />
          <AnimatedJumpingFish x={gridToScreen(11, 11).x} y={gridToScreen(11, 11).y} delay="3s" />
          <AnimatedJumpingFish x={gridToScreen(5, 10).x} y={gridToScreen(5, 10).y} delay="6s" />

          {/* Dragonflies Buzzing */}
          <AnimatedDragonfly x={gridToScreen(6, 6).x} y={gridToScreen(6, 6).y} delay="0s" />
          <AnimatedDragonfly x={gridToScreen(12, 8).x} y={gridToScreen(12, 8).y} delay="2s" />
        </g>

        {/* --- WOODEN PIER DOCK BOARDWALK (Connecting Cabin & Lure Maker) --- */}
        <g>
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
            ${rightPos.x + 500},${rightPos.y - 250}
            ${bottomPos.x},${bottomPos.y + 500}
            ${lakeBottomRight.x},${lakeBottomRight.y + 45}
          `}
          fill="url(#grass-surface)"
        />
        <polygon
          points={`
            ${lakeBottomLeft.x},${lakeBottomLeft.y}
            ${leftPos.x - 500},${leftPos.y + 250}
            ${bottomPos.x},${bottomPos.y + 500}
            ${lakeBottomRight.x},${lakeBottomRight.y + 45}
          `}
          fill="url(#grass-surface)"
        />

        {/* --- FLORA & MOUNTAIN TREES (Hay Day Pine Trees & Cattails) --- */}
        {/* Background Mountain Pines */}
        <MountainPine x={gridToScreen(0, 0).x - 40} y={gridToScreen(0, 0).y - 60} scale={1.4} />
        <MountainPine x={gridToScreen(1, 0).x} y={gridToScreen(1, 0).y - 70} scale={1.6} />
        <MountainPine x={gridToScreen(0, 2).x - 60} y={gridToScreen(0, 2).y - 40} scale={1.3} />
        <MountainPine x={gridToScreen(15, 0).x + 40} y={gridToScreen(15, 0).y - 40} scale={1.5} />
        <MountainPine x={gridToScreen(16, 1).x + 60} y={gridToScreen(16, 1).y - 30} scale={1.3} />

        {/* River Stones along Shoreline */}
        <RiverStone x={gridToScreen(1.5, 5).x} y={gridToScreen(1.5, 5).y + 10} scale={2} />
        <RiverStone x={gridToScreen(2, 7).x} y={gridToScreen(2, 7).y + 20} scale={1.5} />
        <RiverStone x={gridToScreen(5, 15.5).x} y={gridToScreen(5, 15.5).y + 10} scale={2.5} />
        <RiverStone x={gridToScreen(7, 15.8).x} y={gridToScreen(7, 15.8).y + 15} scale={1.8} />
        <RiverStone x={gridToScreen(15.5, 6).x} y={gridToScreen(15.5, 6).y + 20} scale={2.2} />
        <RiverStone x={gridToScreen(15.2, 9).x} y={gridToScreen(15.2, 9).y + 10} scale={1.6} />

        {/* Cattails (Taboas) Clusters */}
        <Cattails x={gridToScreen(1, 4).x} y={gridToScreen(1, 4).y} scale={1.7} />
        <Cattails x={gridToScreen(1.8, 4.5).x} y={gridToScreen(1.8, 4.5).y} scale={1.3} />
        <Cattails x={gridToScreen(3.5, 15.5).x} y={gridToScreen(3.5, 15.5).y} scale={1.8} />
        <Cattails x={gridToScreen(4.5, 15.8).x} y={gridToScreen(4.5, 15.8).y} scale={1.5} />
        <Cattails x={gridToScreen(15.5, 4).x} y={gridToScreen(15.5, 4).y} scale={1.6} />
        <Cattails x={gridToScreen(15.8, 7.5).x} y={gridToScreen(15.8, 7.5).y} scale={1.4} />
      </svg>
    </div>
  );
};
