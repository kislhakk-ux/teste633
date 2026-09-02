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
const minX = leftPos.x - TILE_WIDTH;
const maxX = rightPos.x + TILE_WIDTH;
const minY = topPos.y - TILE_HEIGHT;
const maxY = bottomPos.y + TILE_HEIGHT * 2;

const width = maxX - minX;
const height = maxY - minY;

export const IsoFishingScenery: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
      <svg
        width={width}
        height={height}
        viewBox={`${minX} ${minY} ${width} ${height}`}
        style={{ position: 'absolute', left: minX, top: minY, overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="lake-water-depth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0288D1" />
            <stop offset="50%" stopColor="#01579B" />
            <stop offset="100%" stopColor="#003C6C" />
          </linearGradient>
          
          <linearGradient id="cliff-dirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6D4C41" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>

          <linearGradient id="grass-surface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8BC34A" />
            <stop offset="100%" stopColor="#689F38" />
          </linearGradient>
        </defs>

        {/* --- BASE TERRAIN (Grass) --- */}
        {/* Draw a giant polygon covering the grid area representing the grassy banks */}
        <polygon 
          points={`
            ${topPos.x},${topPos.y - 400}
            ${rightPos.x + 400},${rightPos.y - 200}
            ${bottomPos.x},${bottomPos.y + 400}
            ${leftPos.x - 400},${leftPos.y + 200}
          `}
          fill="url(#grass-surface)" 
        />

        {/* --- LAKE HOLE (Trench / Cliffs) --- */}
        {/* Lake shape roughly from x=2, y=2 to x=15, y=15 */}
        <g>
          {/* Back Cliff Face */}
          <polygon
            points={`
              ${gridToScreen(2, 2).x},${gridToScreen(2, 2).y}
              ${gridToScreen(15, 2).x},${gridToScreen(15, 2).y}
              ${gridToScreen(15, 2).x},${gridToScreen(15, 2).y + 60}
              ${gridToScreen(2, 2).x},${gridToScreen(2, 2).y + 60}
            `}
            fill="url(#cliff-dirt)"
          />
          <polygon
            points={`
              ${gridToScreen(2, 2).x},${gridToScreen(2, 2).y}
              ${gridToScreen(2, 15).x},${gridToScreen(2, 15).y}
              ${gridToScreen(2, 15).x},${gridToScreen(2, 15).y + 60}
              ${gridToScreen(2, 2).x},${gridToScreen(2, 2).y + 60}
            `}
            fill="url(#cliff-dirt)"
          />
        </g>

        {/* --- WATER SURFACE --- */}
        <g transform="translate(0, 40)">
          {/* Deep water polygon */}
          <polygon
            points={`
              ${gridToScreen(2, 2).x},${gridToScreen(2, 2).y}
              ${gridToScreen(15, 2).x},${gridToScreen(15, 2).y}
              ${gridToScreen(15, 15).x},${gridToScreen(15, 15).y}
              ${gridToScreen(2, 15).x},${gridToScreen(2, 15).y}
            `}
            fill="url(#lake-water-depth)"
          />
          
          {/* Animated Water Ripples (Caustics effect) */}
          <g opacity="0.4" stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round">
             <path d={`M ${gridToScreen(5, 5).x} ${gridToScreen(5, 5).y} Q ${gridToScreen(6, 6).x} ${gridToScreen(6, 6).y - 10} ${gridToScreen(7, 5).x} ${gridToScreen(7, 5).y}`}>
                <animateTransform attributeName="transform" type="translate" values="-10,0; 10,0; -10,0" dur="4s" repeatCount="indefinite" />
             </path>
             <path d={`M ${gridToScreen(10, 8).x} ${gridToScreen(10, 8).y} Q ${gridToScreen(11, 9).x} ${gridToScreen(11, 9).y - 10} ${gridToScreen(12, 8).x} ${gridToScreen(12, 8).y}`}>
                <animateTransform attributeName="transform" type="translate" values="10,0; -10,0; 10,0" dur="5s" repeatCount="indefinite" />
             </path>
             <path d={`M ${gridToScreen(8, 12).x} ${gridToScreen(8, 12).y} Q ${gridToScreen(9, 13).x} ${gridToScreen(9, 13).y - 10} ${gridToScreen(10, 12).x} ${gridToScreen(10, 12).y}`}>
                <animateTransform attributeName="transform" type="translate" values="0,5; 0,-5; 0,5" dur="3s" repeatCount="indefinite" />
             </path>
          </g>

          {/* Jumping Fish */}
          <AnimatedJumpingFish x={gridToScreen(10, 10).x} y={gridToScreen(10, 10).y} delay="0s" />
          <AnimatedJumpingFish x={gridToScreen(5, 12).x} y={gridToScreen(5, 12).y} delay="2.5s" />
          <AnimatedJumpingFish x={gridToScreen(13, 6).x} y={gridToScreen(13, 6).y} delay="5s" />
          
          {/* Water Lilies */}
          <WaterLily x={gridToScreen(3, 4).x} y={gridToScreen(3, 4).y} scale={1.2} />
          <WaterLily x={gridToScreen(3, 5).x} y={gridToScreen(3, 5).y} scale={0.8} />
          <WaterLily x={gridToScreen(13, 14).x} y={gridToScreen(13, 14).y} scale={1.5} />
          <WaterLily x={gridToScreen(14, 13).x} y={gridToScreen(14, 13).y} scale={1.1} />
        </g>

        {/* --- FRONT BANKS (Overlapping Water) --- */}
        {/* We draw the bottom right and bottom left land borders so they sit ON TOP of the water */}
        <polygon
          points={`
            ${gridToScreen(15, 2).x},${gridToScreen(15, 2).y}
            ${rightPos.x + 400},${rightPos.y - 200}
            ${bottomPos.x},${bottomPos.y + 400}
            ${gridToScreen(15, 15).x},${gridToScreen(15, 15).y + 40}
          `}
          fill="url(#grass-surface)" 
        />
        <polygon
          points={`
            ${gridToScreen(2, 15).x},${gridToScreen(2, 15).y}
            ${leftPos.x - 400},${leftPos.y + 200}
            ${bottomPos.x},${bottomPos.y + 400}
            ${gridToScreen(15, 15).x},${gridToScreen(15, 15).y + 40}
          `}
          fill="url(#grass-surface)" 
        />

        {/* --- FLORA / DECORATIONS ALONG THE BANKS --- */}
        {/* Top Left Bank */}
        <Cattails x={gridToScreen(1, 3).x} y={gridToScreen(1, 3).y} scale={1.5} />
        <Cattails x={gridToScreen(1.5, 4).x} y={gridToScreen(1.5, 4).y} scale={1.2} />
        <RiverStone x={gridToScreen(1, 5).x} y={gridToScreen(1, 5).y} scale={1.8} />
        <RiverStone x={gridToScreen(1.5, 6).x} y={gridToScreen(1.5, 6).y} scale={1} />
        
        {/* Top Right Bank */}
        <Cattails x={gridToScreen(3, 1).x} y={gridToScreen(3, 1).y} scale={1.4} />
        <RiverStone x={gridToScreen(5, 1).x} y={gridToScreen(5, 1).y} scale={2} />
        <RiverStone x={gridToScreen(7, 1).x} y={gridToScreen(7, 1).y} scale={1.5} />
        
        {/* Bottom Left Bank (Overlapping) */}
        <Cattails x={gridToScreen(3, 15.5).x} y={gridToScreen(3, 15.5).y} scale={1.7} />
        <Cattails x={gridToScreen(4, 15.8).x} y={gridToScreen(4, 15.8).y} scale={1.4} />
        <RiverStone x={gridToScreen(6, 16).x} y={gridToScreen(6, 16).y} scale={2.5} />
        <RiverStone x={gridToScreen(8, 15.5).x} y={gridToScreen(8, 15.5).y} scale={1.8} />
        
        {/* Bottom Right Bank (Overlapping) */}
        <Cattails x={gridToScreen(15.5, 3).x} y={gridToScreen(15.5, 3).y} scale={1.6} />
        <RiverStone x={gridToScreen(16, 6).x} y={gridToScreen(16, 6).y} scale={2} />
        <RiverStone x={gridToScreen(15.5, 8).x} y={gridToScreen(15.5, 8).y} scale={1.5} />

      </svg>
    </div>
  );
};
