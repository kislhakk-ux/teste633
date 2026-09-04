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

// Buoy Rope Line with Floating Red & White Markers (Authentic Hay Day zone divider)
const BuoyRopeSegment: React.FC<{
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  numBuoys?: number;
}> = ({ p1, p2, numBuoys = 4 }) => {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2 + 10; // Sag in the rope

  const buoys = [];
  for (let i = 1; i <= numBuoys; i++) {
    const t = i / (numBuoys + 1);
    // Quadratic bezier point
    const bx = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
    const by = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;
    buoys.push({ x: bx, y: by, id: i });
  }

  return (
    <g className="pointer-events-none">
      {/* Sagging Rope */}
      <path
        d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
        fill="none"
        stroke="#8D6E63"
        strokeWidth="2"
        opacity="0.85"
      />
      {/* Buoys */}
      {buoys.map((b) => (
        <g key={b.id} transform={`translate(${b.x}, ${b.y})`}>
          {/* Water ripple underneath buoy */}
          <ellipse cx="0" cy="4" rx="7" ry="3" fill="none" stroke="#E0F7FA" strokeWidth="1" opacity="0.6" className="animate-pulse" />
          {/* Drop shadow */}
          <ellipse cx="0" cy="3" rx="4.5" ry="2" fill="#001F3F" opacity="0.35" />
          {/* Float Body: White Top, Red Bottom */}
          <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="#FFFFFF" stroke="#3E2723" strokeWidth="0.8" />
          <path d="M -4.5 0 A 4.5 5.5 0 0 0 4.5 0 Z" fill="#E53935" stroke="#B71C1C" strokeWidth="0.5" />
          {/* Little flag / top ring */}
          <circle cx="0" cy="-4" r="1.2" fill="#D32F2F" />
        </g>
      ))}
    </g>
  );
};

// Submerged Aquatic Weed Silhouette
const UnderwaterWeedPatch: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity="0.45" className="pointer-events-none">
    <path
      d="M -15 20 Q -10 5 -12 -15 Q -6 0 0 20 Q 6 3 10 -12 Q 8 8 18 20 Z"
      fill="#004D40"
    >
      <animateTransform attributeName="transform" type="rotate" values="-3 0 20; 3 0 20; -3 0 20" dur="4.5s" repeatCount="indefinite" />
    </path>
  </g>
);

export const IsoFishingScenery: React.FC = () => {
  // Key points for organic lake shoreline
  const pWaterfall = gridToScreen(1, 14);
  const pPier = gridToScreen(4.5, 3.5);
  const pCabinDock = gridToScreen(3, 2.5);
  const pLureShore = gridToScreen(6.5, 2.5);
  const pEastCove = gridToScreen(13, 1.5);
  const pDuckSalonBank = gridToScreen(15.5, 5);
  const pSouthEastCorner = gridToScreen(15.5, 14.5);
  const pSouthBank = gridToScreen(10, 15.5);
  const pSouthWestBank = gridToScreen(4, 15.5);
  const pIslandCenter = gridToScreen(4, 11);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <svg
        width={width}
        height={height}
        viewBox={`${minX} ${minY} ${width} ${height}`}
        style={{ position: 'absolute', left: minX, top: minY, overflow: 'visible' }}
      >
        <defs>
          {/* Rich Multi-tone Cartoon Water Depth Gradient (Supercell Hay Day style) */}
          <radialGradient id="lake-water-depth-rich" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#26C6DA" />
            <stop offset="35%" stopColor="#00BCD4" />
            <stop offset="65%" stopColor="#0288D1" />
            <stop offset="88%" stopColor="#01579B" />
            <stop offset="100%" stopColor="#002F6C" />
          </radialGradient>

          {/* Shoreline Sand/Shallows Gradient */}
          <linearGradient id="lake-shoreline-sand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="30%" stopColor="#B2EBF2" />
            <stop offset="70%" stopColor="#4DD0E1" />
            <stop offset="100%" stopColor="#00ACC1" />
          </linearGradient>

          {/* Grass Hills Surface Gradient */}
          <linearGradient id="grass-surface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CCC65" />
            <stop offset="40%" stopColor="#7CB342" />
            <stop offset="85%" stopColor="#558B2F" />
            <stop offset="100%" stopColor="#33691E" />
          </linearGradient>

          {/* Mountain Rock Cliff Gradient */}
          <linearGradient id="mountain-rock-face" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="25%" stopColor="#6D4C41" />
            <stop offset="55%" stopColor="#4E342E" />
            <stop offset="85%" stopColor="#3E2723" />
            <stop offset="100%" stopColor="#1B100C" />
          </linearGradient>

          {/* Darker Rocky Canyon Cliff */}
          <linearGradient id="rock-canyon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5D4037" />
            <stop offset="50%" stopColor="#3E2723" />
            <stop offset="100%" stopColor="#211511" />
          </linearGradient>

          {/* Earth/Dirt Cliff Undercut (Hay Day style brown embankment under grass) */}
          <linearGradient id="dirt-undercut" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B26A27" />
            <stop offset="40%" stopColor="#8D4B1A" />
            <stop offset="80%" stopColor="#5D310E" />
            <stop offset="100%" stopColor="#381B04" />
          </linearGradient>

          {/* Wooden Pier Planks */}
          <linearGradient id="pier-wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D7CCC8" />
            <stop offset="35%" stopColor="#A1887F" />
            <stop offset="75%" stopColor="#6D4C41" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>
        </defs>

        {/* ========================================================================= */}
        {/* 1. MOUNTAIN CLIFF RIDGE BACKGROUND (Replaces empty green with rock mountains) */}
        {/* ========================================================================= */}
        <g id="mountain-backdrop">
          {/* Base Mountain Mass */}
          <polygon
            points={`
              ${topPos.x - 300},${topPos.y - 750}
              ${topPos.x + 400},${topPos.y - 750}
              ${rightPos.x + 600},${rightPos.y - 300}
              ${leftPos.x - 500},${leftPos.y + 100}
            `}
            fill="url(#mountain-rock-face)"
          />

          {/* Layered Mountain Peaks & Rocky Ledges */}
          {/* Mountain Peak 1 (Left Ridge) */}
          <polygon
            points={`
              ${topPos.x - 450},${topPos.y - 450}
              ${topPos.x - 220},${topPos.y - 780}
              ${topPos.x - 80},${topPos.y - 500}
              ${topPos.x - 260},${topPos.y - 320}
            `}
            fill="#4E342E"
            stroke="#3E2723"
            strokeWidth="3"
          />
          {/* Mountain Peak 1 Shaded Face */}
          <polygon
            points={`
              ${topPos.x - 220},${topPos.y - 780}
              ${topPos.x - 80},${topPos.y - 500}
              ${topPos.x - 130},${topPos.y - 400}
              ${topPos.x - 220},${topPos.y - 520}
            `}
            fill="#2D1B15"
          />

          {/* Mountain Peak 2 (Center-Right Massive Ridge) */}
          <polygon
            points={`
              ${topPos.x + 20},${topPos.y - 520}
              ${topPos.x + 180},${topPos.y - 820}
              ${topPos.x + 360},${topPos.y - 550}
              ${topPos.x + 160},${topPos.y - 380}
            `}
            fill="#5D4037"
            stroke="#3E2723"
            strokeWidth="3"
          />
          {/* Mountain Peak 2 Shaded Face */}
          <polygon
            points={`
              ${topPos.x + 180},${topPos.y - 820}
              ${topPos.x + 360},${topPos.y - 550}
              ${topPos.x + 280},${topPos.y - 440}
              ${topPos.x + 180},${topPos.y - 560}
            `}
            fill="#261611"
          />

          {/* Mountain Peak 3 (Far Right Peak) */}
          <polygon
            points={`
              ${topPos.x + 320},${topPos.y - 500}
              ${topPos.x + 480},${topPos.y - 720}
              ${rightPos.x + 300},${rightPos.y - 420}
              ${topPos.x + 390},${topPos.y - 350}
            `}
            fill="#4E342E"
          />

          {/* Upper Mountain Ledge with Forest Grass Cap */}
          <polygon
            points={`
              ${topPos.x - 380},${topPos.y - 340}
              ${topPos.x + 380},${topPos.y - 340}
              ${topPos.x + 480},${topPos.y - 200}
              ${topPos.x - 480},${topPos.y - 200}
            `}
            fill="url(#grass-surface)"
          />
          {/* Stepped Rocky Cliff below Upper Ledge */}
          <polygon
            points={`
              ${topPos.x - 480},${topPos.y - 200}
              ${topPos.x + 480},${topPos.y - 200}
              ${topPos.x + 480},${topPos.y - 120}
              ${topPos.x - 480},${topPos.y - 120}
            `}
            fill="url(#rock-canyon)"
          />

          {/* Rocky Canyon crevice specifically framing the forward waterfall on the left/top */}
          <polygon
            points={`
              ${gridToScreen(0, 11).x - 40},${gridToScreen(0, 11).y - 150}
              ${gridToScreen(1, 15).x + 40},${gridToScreen(1, 15).y - 150}
              ${gridToScreen(1, 15).x + 50},${gridToScreen(1, 15).y + 60}
              ${gridToScreen(0, 11).x - 50},${gridToScreen(0, 11).y + 60}
            `}
            fill="url(#mountain-rock-face)"
            stroke="#211511"
            strokeWidth="3"
          />
        </g>

        {/* ========================================================================= */}
        {/* 2. BASE SURROUNDING TERRAIN WITH DIRT EMBANKMENTS (Hay Day Scalloped Lawn) */}
        {/* ========================================================================= */}
        <polygon
          points={`
            ${topPos.x - 480},${topPos.y - 120}
            ${rightPos.x + 520},${rightPos.y - 100}
            ${bottomPos.x},${bottomPos.y + 450}
            ${leftPos.x - 450},${leftPos.y + 250}
          `}
          fill="url(#grass-surface)"
        />

        {/* ========================================================================= */}
        {/* 3. LAKE BASIN & ORGANIC SHORELINE (Vast, naturally shaped like Hay Day)    */}
        {/* ========================================================================= */}
        {/* Main Lake Water Polygon (Encompasses the center with coves and bays) */}
        {/* We carve out the lake using an organic multi-point shape */}
        <g id="lake-basin" transform="translate(0, 30)">
          {/* Layer 1: Brown Clay Cliff Undercut (Extends beneath the water's edge) */}
          <path
            d={`
              M ${gridToScreen(1.8, 2.5).x} ${gridToScreen(1.8, 2.5).y}
              C ${gridToScreen(4, 1.8).x} ${gridToScreen(4, 1.8).y - 15}, ${gridToScreen(8, 1.5).x} ${gridToScreen(8, 1.5).y - 20}, ${gridToScreen(11, 1.8).x} ${gridToScreen(11, 1.8).y}
              C ${gridToScreen(13.5, 1.2).x} ${gridToScreen(13.5, 1.2).y}, ${gridToScreen(15.8, 2.5).x} ${gridToScreen(15.8, 2.5).y}, ${gridToScreen(15.8, 5.5).x} ${gridToScreen(15.8, 5.5).y}
              C ${gridToScreen(16.2, 8.5).x} ${gridToScreen(16.2, 8.5).y}, ${gridToScreen(15.8, 12).x} ${gridToScreen(15.8, 12).y}, ${gridToScreen(15.2, 15).x} ${gridToScreen(15.2, 15).y}
              C ${gridToScreen(12, 15.8).x} ${gridToScreen(12, 15.8).y}, ${gridToScreen(8, 15.8).x} ${gridToScreen(8, 15.8).y}, ${gridToScreen(4.5, 15.5).x} ${gridToScreen(4.5, 15.5).y}
              C ${gridToScreen(2, 15.2).x} ${gridToScreen(2, 15.2).y}, ${gridToScreen(0.8, 13).x} ${gridToScreen(0.8, 13).y}, ${gridToScreen(1, 9.5).x} ${gridToScreen(1, 9.5).y}
              C ${gridToScreen(1.2, 6).x} ${gridToScreen(1.2, 6).y}, ${gridToScreen(1.5, 4).x} ${gridToScreen(1.5, 4).y}, ${gridToScreen(1.8, 2.5).x} ${gridToScreen(1.8, 2.5).y}
              Z
            `}
            fill="url(#dirt-undercut)"
            className="drop-shadow-lg"
          />

          {/* Layer 2: Shallow Sandy/Pebble Shoreline Fringe */}
          <path
            d={`
              M ${gridToScreen(1.8, 2.5).x} ${gridToScreen(1.8, 2.5).y + 6}
              C ${gridToScreen(4, 1.8).x} ${gridToScreen(4, 1.8).y - 9}, ${gridToScreen(8, 1.5).x} ${gridToScreen(8, 1.5).y - 14}, ${gridToScreen(11, 1.8).x} ${gridToScreen(11, 1.8).y + 6}
              C ${gridToScreen(13.5, 1.2).x} ${gridToScreen(13.5, 1.2).y + 6}, ${gridToScreen(15.8, 2.5).x} ${gridToScreen(15.8, 2.5).y + 6}, ${gridToScreen(15.8, 5.5).x} ${gridToScreen(15.8, 5.5).y + 6}
              C ${gridToScreen(16.2, 8.5).x} ${gridToScreen(16.2, 8.5).y + 6}, ${gridToScreen(15.8, 12).x} ${gridToScreen(15.8, 12).y + 6}, ${gridToScreen(15.2, 15).x} ${gridToScreen(15.2, 15).y + 6}
              C ${gridToScreen(12, 15.8).x} ${gridToScreen(12, 15.8).y + 6}, ${gridToScreen(8, 15.8).x} ${gridToScreen(8, 15.8).y + 6}, ${gridToScreen(4.5, 15.5).x} ${gridToScreen(4.5, 15.5).y + 6}
              C ${gridToScreen(2, 15.2).x} ${gridToScreen(2, 15.2).y + 6}, ${gridToScreen(0.8, 13).x} ${gridToScreen(0.8, 13).y + 6}, ${gridToScreen(1, 9.5).x} ${gridToScreen(1, 9.5).y + 6}
              C ${gridToScreen(1.2, 6).x} ${gridToScreen(1.2, 6).y + 6}, ${gridToScreen(1.5, 4).x} ${gridToScreen(1.5, 4).y + 6}, ${gridToScreen(1.8, 2.5).x} ${gridToScreen(1.8, 2.5).y + 6}
              Z
            `}
            fill="url(#lake-shoreline-sand)"
            opacity="0.95"
          />

          {/* Layer 3: Deep Crystal Water Surface */}
          <path
            d={`
              M ${gridToScreen(2, 2.8).x} ${gridToScreen(2, 2.8).y + 10}
              C ${gridToScreen(4.2, 2).x} ${gridToScreen(4.2, 2).y}, ${gridToScreen(8, 1.8).x} ${gridToScreen(8, 1.8).y - 5}, ${gridToScreen(11, 2).x} ${gridToScreen(11, 2).y + 8}
              C ${gridToScreen(13.4, 1.5).x} ${gridToScreen(13.4, 1.5).y + 8}, ${gridToScreen(15.5, 2.8).x} ${gridToScreen(15.5, 2.8).y + 8}, ${gridToScreen(15.5, 5.5).x} ${gridToScreen(15.5, 5.5).y + 8}
              C ${gridToScreen(15.8, 8.5).x} ${gridToScreen(15.8, 8.5).y + 8}, ${gridToScreen(15.5, 12).x} ${gridToScreen(15.5, 12).y + 8}, ${gridToScreen(15, 14.8).x} ${gridToScreen(15, 14.8).y + 8}
              C ${gridToScreen(12, 15.5).x} ${gridToScreen(12, 15.5).y + 8}, ${gridToScreen(8, 15.5).x} ${gridToScreen(8, 15.5).y + 8}, ${gridToScreen(4.8, 15.2).x} ${gridToScreen(4.8, 15.2).y + 8}
              C ${gridToScreen(2.2, 14.8).x} ${gridToScreen(2.2, 14.8).y + 8}, ${gridToScreen(1.2, 13).x} ${gridToScreen(1.2, 13).y + 8}, ${gridToScreen(1.4, 9.5).x} ${gridToScreen(1.4, 9.5).y + 8}
              C ${gridToScreen(1.5, 6).x} ${gridToScreen(1.5, 6).y + 8}, ${gridToScreen(1.8, 4.2).x} ${gridToScreen(1.8, 4.2).y + 8}, ${gridToScreen(2, 2.8).x} ${gridToScreen(2, 2.8).y + 10}
              Z
            `}
            fill="url(#lake-water-depth-rich)"
            stroke="#00E5FF"
            strokeWidth="1.2"
          />

          {/* Submerged Aquatic Weeds / Plants under the water */}
          <UnderwaterWeedPatch x={gridToScreen(3.5, 5.5).x} y={gridToScreen(3.5, 5.5).y + 10} scale={1.2} />
          <UnderwaterWeedPatch x={gridToScreen(7, 4).x} y={gridToScreen(7, 4).y + 10} scale={1.4} />
          <UnderwaterWeedPatch x={gridToScreen(9.5, 6.5).x} y={gridToScreen(9.5, 6.5).y + 10} scale={1} />
          <UnderwaterWeedPatch x={gridToScreen(6, 12).x} y={gridToScreen(6, 12).y + 10} scale={1.3} />
          <UnderwaterWeedPatch x={gridToScreen(12.5, 11).x} y={gridToScreen(12.5, 11).y + 10} scale={1.5} />
          <UnderwaterWeedPatch x={gridToScreen(14, 7).x} y={gridToScreen(14, 7).y + 10} scale={1.1} />

          {/* Layer 4: Shoreline White Animated Foam Wave */}
          <path
            d={`
              M ${gridToScreen(2, 2.8).x} ${gridToScreen(2, 2.8).y + 10}
              C ${gridToScreen(4.2, 2).x} ${gridToScreen(4.2, 2).y}, ${gridToScreen(8, 1.8).x} ${gridToScreen(8, 1.8).y - 5}, ${gridToScreen(11, 2).x} ${gridToScreen(11, 2).y + 8}
              C ${gridToScreen(13.4, 1.5).x} ${gridToScreen(13.4, 1.5).y + 8}, ${gridToScreen(15.5, 2.8).x} ${gridToScreen(15.5, 2.8).y + 8}, ${gridToScreen(15.5, 5.5).x} ${gridToScreen(15.5, 5.5).y + 8}
              C ${gridToScreen(15.8, 8.5).x} ${gridToScreen(15.8, 8.5).y + 8}, ${gridToScreen(15.5, 12).x} ${gridToScreen(15.5, 12).y + 8}, ${gridToScreen(15, 14.8).x} ${gridToScreen(15, 14.8).y + 8}
              C ${gridToScreen(12, 15.5).x} ${gridToScreen(12, 15.5).y + 8}, ${gridToScreen(8, 15.5).x} ${gridToScreen(8, 15.5).y + 8}, ${gridToScreen(4.8, 15.2).x} ${gridToScreen(4.8, 15.2).y + 8}
              C ${gridToScreen(2.2, 14.8).x} ${gridToScreen(2.2, 14.8).y + 8}, ${gridToScreen(1.2, 13).x} ${gridToScreen(1.2, 13).y + 8}, ${gridToScreen(1.4, 9.5).x} ${gridToScreen(1.4, 9.5).y + 8}
              C ${gridToScreen(1.5, 6).x} ${gridToScreen(1.5, 6).y + 8}, ${gridToScreen(1.8, 4.2).x} ${gridToScreen(1.8, 4.2).y + 8}, ${gridToScreen(2, 2.8).x} ${gridToScreen(2, 2.8).y + 10}
              Z
            `}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeDasharray="18 10 24 8"
            strokeLinecap="round"
            opacity="0.8"
          >
            <animate attributeName="stroke-dashoffset" values="0; 60" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.65; 0.95; 0.65" dur="3s" repeatCount="indefinite" />
          </path>

          {/* Secondary Foam Lace */}
          <path
            d={`
              M ${gridToScreen(2.3, 3.2).x} ${gridToScreen(2.3, 3.2).y + 10}
              C ${gridToScreen(4.4, 2.4).x} ${gridToScreen(4.4, 2.4).y}, ${gridToScreen(8, 2.2).x} ${gridToScreen(8, 2.2).y - 5}, ${gridToScreen(10.8, 2.4).x} ${gridToScreen(10.8, 2.4).y + 8}
              C ${gridToScreen(13.2, 1.9).x} ${gridToScreen(13.2, 1.9).y + 8}, ${gridToScreen(15.2, 3.2).x} ${gridToScreen(15.2, 3.2).y + 8}, ${gridToScreen(15.2, 5.5).x} ${gridToScreen(15.2, 5.5).y + 8}
              C ${gridToScreen(15.4, 8.5).x} ${gridToScreen(15.4, 8.5).y + 8}, ${gridToScreen(15.2, 11.8).x} ${gridToScreen(15.2, 11.8).y + 8}, ${gridToScreen(14.7, 14.4).x} ${gridToScreen(14.7, 14.4).y + 8}
              C ${gridToScreen(11.8, 15.1).x} ${gridToScreen(11.8, 15.1).y + 8}, ${gridToScreen(8, 15.1).x} ${gridToScreen(8, 15.1).y + 8}, ${gridToScreen(5, 14.8).x} ${gridToScreen(5, 14.8).y + 8}
              C ${gridToScreen(2.5, 14.4).x} ${gridToScreen(2.5, 14.4).y + 8}, ${gridToScreen(1.6, 12.8).x} ${gridToScreen(1.6, 12.8).y + 8}, ${gridToScreen(1.8, 9.5).x} ${gridToScreen(1.8, 9.5).y + 8}
              C ${gridToScreen(1.9, 6.2).x} ${gridToScreen(1.9, 6.2).y + 8}, ${gridToScreen(2.1, 4.5).x} ${gridToScreen(2.1, 4.5).y + 8}, ${gridToScreen(2.3, 3.2).x} ${gridToScreen(2.3, 3.2).y + 10}
              Z
            `}
            fill="none"
            stroke="#B2EBF2"
            strokeWidth="1.8"
            strokeDasharray="10 14"
            opacity="0.5"
          >
            <animate attributeName="stroke-dashoffset" values="48; 0" dur="5s" repeatCount="indefinite" />
          </path>

          {/* Dynamic Sunlight Caustics Shimmer */}
          <g stroke="#E0F7FA" strokeWidth="3" strokeLinecap="round" opacity="0.65">
            <path d={`M ${gridToScreen(3.5, 4.5).x} ${gridToScreen(3.5, 4.5).y + 10} Q ${gridToScreen(5, 6).x} ${gridToScreen(5, 6).y - 4} ${gridToScreen(6.8, 4.5).x} ${gridToScreen(6.8, 4.5).y + 10}`}>
              <animateTransform attributeName="transform" type="translate" values="-15,0; 15,0; -15,0" dur="4.8s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(8.5, 6.5).x} ${gridToScreen(8.5, 6.5).y + 10} Q ${gridToScreen(10, 8).x} ${gridToScreen(10, 8).y - 6} ${gridToScreen(11.8, 6.5).x} ${gridToScreen(11.8, 6.5).y + 10}`}>
              <animateTransform attributeName="transform" type="translate" values="18,0; -18,0; 18,0" dur="5.2s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(6.5, 10.5).x} ${gridToScreen(6.5, 10.5).y + 10} Q ${gridToScreen(8, 12).x} ${gridToScreen(8, 12).y - 4} ${gridToScreen(9.8, 10.5).x} ${gridToScreen(9.8, 10.5).y + 10}`}>
              <animateTransform attributeName="transform" type="translate" values="0,8; 0,-8; 0,8" dur="4.2s" repeatCount="indefinite" />
            </path>
            <path d={`M ${gridToScreen(11.5, 9.5).x} ${gridToScreen(11.5, 9.5).y + 10} Q ${gridToScreen(13, 11).x} ${gridToScreen(13, 11).y - 4} ${gridToScreen(14.5, 9.5).x} ${gridToScreen(14.5, 9.5).y + 10}`}>
              <animateTransform attributeName="transform" type="translate" values="-12,6; 12,-6; -12,6" dur="4.5s" repeatCount="indefinite" />
            </path>
          </g>

          {/* ===================================================================== */}
          {/* 4. THE LONE PINE ISLAND (Ilhota do Pinheiro no Lago - Como no Hay Day) */}
          {/* ===================================================================== */}
          <g id="lone-pine-island">
            {/* Island Shadow in Water */}
            <ellipse
              cx={gridToScreen(3.8, 11.8).x}
              cy={gridToScreen(3.8, 11.8).y + 18}
              rx="64"
              ry="32"
              fill="#001F3F"
              opacity="0.4"
            />
            {/* Island Clay Undercut */}
            <polygon
              points={`
                ${gridToScreen(3, 11).x},${gridToScreen(3, 11).y + 15}
                ${gridToScreen(4.8, 11).x},${gridToScreen(4.8, 11).y + 15}
                ${gridToScreen(4.8, 12.8).x},${gridToScreen(4.8, 12.8).y + 25}
                ${gridToScreen(3, 12.8).x},${gridToScreen(3, 12.8).y + 25}
              `}
              fill="url(#dirt-undercut)"
            />
            {/* Island Lush Grass Top */}
            <polygon
              points={`
                ${gridToScreen(3, 11).x},${gridToScreen(3, 11).y + 10}
                ${gridToScreen(4.8, 11).x},${gridToScreen(4.8, 11).y + 10}
                ${gridToScreen(4.8, 12.8).x},${gridToScreen(4.8, 12.8).y + 10}
                ${gridToScreen(3, 12.8).x},${gridToScreen(3, 12.8).y + 10}
              `}
              fill="url(#grass-surface)"
              stroke="#558B2F"
              strokeWidth="2"
            />
            {/* Island Shoreline Foam */}
            <ellipse
              cx={gridToScreen(3.9, 11.9).x}
              cy={gridToScreen(3.9, 11.9).y + 24}
              rx="52"
              ry="26"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="10 8"
              opacity="0.8"
            >
              <animate attributeName="stroke-dashoffset" values="0; 36" dur="3s" repeatCount="indefinite" />
            </ellipse>
            {/* River stones on Island shore */}
            <RiverStone x={gridToScreen(3.2, 12.5).x} y={gridToScreen(3.2, 12.5).y + 20} scale={1.8} />
            <RiverStone x={gridToScreen(4.6, 12.6).x} y={gridToScreen(4.6, 12.6).y + 20} scale={1.5} />
          </g>

          {/* ===================================================================== */}
          {/* 5. BUOY ROPE LINES (Boias e Cordas dividindo as áreas de pesca Hay Day) */}
          {/* ===================================================================== */}
          {/* Rope 1: Divides Center and Eastern Cove */}
          <BuoyRopeSegment
            p1={{ x: gridToScreen(7, 3.5).x, y: gridToScreen(7, 3.5).y + 10 }}
            p2={{ x: gridToScreen(11, 7.5).x, y: gridToScreen(11, 7.5).y + 10 }}
            numBuoys={5}
          />
          {/* Rope 2: Divides Deep South-Eastern Bay */}
          <BuoyRopeSegment
            p1={{ x: gridToScreen(11, 7.5).x, y: gridToScreen(11, 7.5).y + 10 }}
            p2={{ x: gridToScreen(15, 9).x, y: gridToScreen(15, 9).y + 10 }}
            numBuoys={4}
          />
          {/* Rope 3: Divides Island Bay and Central Shallows */}
          <BuoyRopeSegment
            p1={{ x: gridToScreen(5.5, 11.5).x, y: gridToScreen(5.5, 11.5).y + 10 }}
            p2={{ x: gridToScreen(8.5, 14.5).x, y: gridToScreen(8.5, 14.5).y + 10 }}
            numBuoys={4}
          />

          {/* Twinkling Sunlight Glint Stars (✦) across Water */}
          <WaterSunGlint x={gridToScreen(5, 4).x} y={gridToScreen(5, 4).y + 10} delay="0s" scale={1.2} />
          <WaterSunGlint x={gridToScreen(7.5, 6).x} y={gridToScreen(7.5, 6).y + 10} delay="1.2s" scale={1.4} />
          <WaterSunGlint x={gridToScreen(10, 5).x} y={gridToScreen(10, 5).y + 10} delay="0.6s" scale={1} />
          <WaterSunGlint x={gridToScreen(13, 8).x} y={gridToScreen(13, 8).y + 10} delay="1.8s" scale={1.3} />
          <WaterSunGlint x={gridToScreen(8, 12).x} y={gridToScreen(8, 12).y + 10} delay="2.4s" scale={1.4} />
          <WaterSunGlint x={gridToScreen(14, 11).x} y={gridToScreen(14, 11).y + 10} delay="1s" scale={1.1} />

          {/* Swimming Fish Schools under crystal water */}
          <UnderwaterFishSchool startX={gridToScreen(5, 8).x} startY={gridToScreen(5, 8).y + 10} delay="0s" />
          <UnderwaterFishSchool startX={gridToScreen(10, 9).x} startY={gridToScreen(10, 9).y + 10} delay="7s" />

          {/* Water Lilies with Lotus Blooms */}
          <WaterLily x={gridToScreen(2.8, 3.8).x} y={gridToScreen(2.8, 3.8).y + 10} scale={1.5} />
          <WaterLily x={gridToScreen(3.6, 4.5).x} y={gridToScreen(3.6, 4.5).y + 10} scale={1.1} />
          <WaterLily x={gridToScreen(13.8, 13.2).x} y={gridToScreen(13.8, 13.2).y + 10} scale={1.6} />
          <WaterLily x={gridToScreen(14.5, 12.2).x} y={gridToScreen(14.5, 12.2).y + 10} scale={1.2} />
          <WaterLily x={gridToScreen(6.5, 14.2).x} y={gridToScreen(6.5, 14.2).y + 10} scale={1.4} />

          {/* Dragonflies */}
          <AnimatedDragonfly x={gridToScreen(6, 6).x} y={gridToScreen(6, 6).y + 10} delay="0s" />
          <AnimatedDragonfly x={gridToScreen(12, 8).x} y={gridToScreen(12, 8).y + 10} delay="2s" />
          <AnimatedDragonfly x={gridToScreen(8, 13).x} y={gridToScreen(8, 13).y + 10} delay="3.5s" />
        </g>

        {/* ========================================================================= */}
        {/* 6. WOODEN PIER DOCK PLATFORM (Extending from Cabin Peninsula into Water)  */}
        {/* ========================================================================= */}
        <g id="fishing-pier-platform">
          {/* Depth Shadow of Wooden Pier */}
          <polygon
            points={`
              ${gridToScreen(2, 2.2).x + 30},${gridToScreen(2, 2.2).y + 60}
              ${gridToScreen(5.5, 2.2).x + 30},${gridToScreen(5.5, 2.2).y + 60}
              ${gridToScreen(5.5, 4.8).x + 30},${gridToScreen(5.5, 4.8).y + 60}
              ${gridToScreen(2, 4.8).x + 30},${gridToScreen(2, 4.8).y + 60}
            `}
            fill="#001F3F"
            opacity="0.45"
          />

          {/* Main Wooden Pier Deck */}
          <polygon
            points={`
              ${gridToScreen(2, 2.2).x + 30},${gridToScreen(2, 2.2).y + 45}
              ${gridToScreen(5.5, 2.2).x + 30},${gridToScreen(5.5, 2.2).y + 45}
              ${gridToScreen(5.5, 4.8).x + 30},${gridToScreen(5.5, 4.8).y + 45}
              ${gridToScreen(2, 4.8).x + 30},${gridToScreen(2, 4.8).y + 45}
            `}
            fill="url(#pier-wood)"
            stroke="#3E2723"
            strokeWidth="2.5"
            className="drop-shadow-md"
          />

          {/* Wooden Deck Planks */}
          {[2.5, 3.2, 3.9, 4.6, 5.2].map((gx, idx) => (
            <line
              key={idx}
              x1={gridToScreen(gx, 2.2).x + 30}
              y1={gridToScreen(gx, 2.2).y + 45}
              x2={gridToScreen(gx, 4.8).x + 30}
              y2={gridToScreen(gx, 4.8).y + 45}
              stroke="#4E342E"
              strokeWidth="2"
              opacity="0.8"
            />
          ))}

          {/* Wooden Piling Posts around the Pier */}
          {[
            { x: gridToScreen(2, 4.8).x + 30, y: gridToScreen(2, 4.8).y + 45 },
            { x: gridToScreen(3.8, 4.8).x + 30, y: gridToScreen(3.8, 4.8).y + 45 },
            { x: gridToScreen(5.5, 4.8).x + 30, y: gridToScreen(5.5, 4.8).y + 45 },
            { x: gridToScreen(5.5, 2.2).x + 30, y: gridToScreen(5.5, 2.2).y + 45 },
          ].map((post, i) => (
            <g key={i}>
              <rect
                x={post.x - 5}
                y={post.y - 12}
                width="10"
                height="22"
                rx="2"
                fill="#4E342E"
                stroke="#2D1B15"
                strokeWidth="1.5"
              />
              {/* Rope wrapped on post */}
              <rect x={post.x - 5.5} y={post.y - 4} width="11" height="4" fill="#BCAAA4" stroke="#5D4037" strokeWidth="0.8" />
            </g>
          ))}

          {/* Life Preserver Buoy Ring hanging on Pier Post */}
          <g transform={`translate(${gridToScreen(5.5, 4.8).x + 40}, ${gridToScreen(5.5, 4.8).y + 38})`}>
            <circle cx="0" cy="0" r="10" fill="#FFFFFF" stroke="#D32F2F" strokeWidth="4" />
            <circle cx="0" cy="0" r="4.5" fill="#4E342E" />
          </g>
        </g>

        {/* ========================================================================= */}
        {/* 7. FOREGROUND CLIFF EDGES & SCENERY DETAILS                              */}
        {/* ========================================================================= */}
        {/* River Stones along Banks */}
        <RiverStone x={gridToScreen(1.5, 4.5).x} y={gridToScreen(1.5, 4.5).y + 25} scale={2.2} />
        <RiverStone x={gridToScreen(2, 7.5).x} y={gridToScreen(2, 7.5).y + 30} scale={1.8} />
        <RiverStone x={gridToScreen(5, 15.2).x} y={gridToScreen(5, 15.2).y + 25} scale={2.6} />
        <RiverStone x={gridToScreen(7.5, 15.5).x} y={gridToScreen(7.5, 15.5).y + 30} scale={2} />
        <RiverStone x={gridToScreen(15.2, 6.5).x} y={gridToScreen(15.2, 6.5).y + 30} scale={2.4} />
        <RiverStone x={gridToScreen(15, 10).x} y={gridToScreen(15, 10).y + 25} scale={1.9} />

        {/* Cattails (Taboas) Clusters in Water */}
        <Cattails x={gridToScreen(1.2, 4).x} y={gridToScreen(1.2, 4).y + 15} scale={2} />
        <Cattails x={gridToScreen(1.9, 4.8).x} y={gridToScreen(1.9, 4.8).y + 15} scale={1.6} />
        <Cattails x={gridToScreen(3.8, 15.2).x} y={gridToScreen(3.8, 15.2).y + 20} scale={2.1} />
        <Cattails x={gridToScreen(4.8, 15.5).x} y={gridToScreen(4.8, 15.5).y + 20} scale={1.7} />
        <Cattails x={gridToScreen(15.2, 4.5).x} y={gridToScreen(15.2, 4.5).y + 20} scale={1.9} />
        <Cattails x={gridToScreen(15.6, 8).x} y={gridToScreen(15.6, 8).y + 20} scale={1.6} />

        {/* Clusters of Wild Lawn Flowers on the Green Banks */}
        {[
          { x: gridToScreen(0.5, 2).x, y: gridToScreen(0.5, 2).y, color: '#E91E63' },
          { x: gridToScreen(1, 3).x, y: gridToScreen(1, 3).y, color: '#FFEB3B' },
          { x: gridToScreen(6.8, 1.5).x, y: gridToScreen(6.8, 1.5).y, color: '#E91E63' },
          { x: gridToScreen(14, 15.2).x, y: gridToScreen(14, 15.2).y, color: '#FFEB3B' },
          { x: gridToScreen(10, 16.2).x, y: gridToScreen(10, 16.2).y, color: '#E91E63' },
        ].map((fl, i) => (
          <g key={i} transform={`translate(${fl.x}, ${fl.y})`}>
            <circle cx="0" cy="0" r="3" fill={fl.color} />
            <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" />
          </g>
        ))}
      </svg>
    </div>
  );
};
