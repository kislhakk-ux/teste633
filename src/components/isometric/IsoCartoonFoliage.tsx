import React, { useMemo } from 'react';
import { pseudoRandom } from '../../utils/forestGen';

/**
 * Premium 3D Cartoon Foliage & Vegetation System
 * Inspired by top-tier mobile farming games like Hay Day.
 * Features:
 * - Multi-layered volumetric canopies with rich radial highlights and ambient underside shading
 * - Detailed gnarled trunks with bark ridges, exposed roots, and branch forks
 * - Projected soft directional isometric ground shadows
 * - Diverse tree species: Oak, Pine, Fruit Tree (Apples/Oranges), Cypress, Blossom Tree
 * - Rich undergrowth: Berry Bushes, Mossy Granite Boulders, Hollow Fallen Logs, Wildflowers
 * - Procedural variety in scale, rotation, trunk lean, and foliage tinting
 */

// Shared SVG Gradient & Filter Defs for 3D Cartoon Nature Props
export const CartoonFoliageDefs: React.FC = React.memo(() => (
  <defs>
    {/* Ground Ambient & Directional Shadow */}
    <radialGradient id="foliage-ground-shadow" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stopColor="#0a290a" stopOpacity="0.45" />
      <stop offset="65%" stopColor="#0a290a" stopOpacity="0.22" />
      <stop offset="100%" stopColor="#0a290a" stopOpacity="0" />
    </radialGradient>

    {/* 3D Chunky Wooden Bark */}
    <linearGradient id="bark-trunk-3d" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#8D6E63" />
      <stop offset="25%" stopColor="#6D4C41" />
      <stop offset="70%" stopColor="#4E342E" />
      <stop offset="100%" stopColor="#2E1C14" />
    </linearGradient>

    {/* Bark Highlight Ridge */}
    <linearGradient id="bark-ridge-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#A1887F" />
      <stop offset="100%" stopColor="#5D4037" />
    </linearGradient>

    {/* 3D Volumetric Oak Foliage (Sunny Lime to Deep Emerald) */}
    <radialGradient id="foliage-oak-globe" cx="32%" cy="28%" r="68%">
      <stop offset="0%" stopColor="#C5E1A5" />   {/* Sunlit top highlight */}
      <stop offset="28%" stopColor="#9CCC65" />  {/* Warm leaf mid-tone */}
      <stop offset="65%" stopColor="#689F38" />  {/* Rich cartoon green */}
      <stop offset="90%" stopColor="#33691E" />  {/* Ambient underside shadow */}
      <stop offset="100%" stopColor="#1B4D0C" /> {/* Deep crevice occlusion */}
    </radialGradient>

    {/* Alternate Golden-Green Oak Foliage */}
    <radialGradient id="foliage-oak-golden" cx="30%" cy="25%" r="70%">
      <stop offset="0%" stopColor="#DCE775" />
      <stop offset="30%" stopColor="#AED581" />
      <stop offset="68%" stopColor="#7CB342" />
      <stop offset="92%" stopColor="#43771B" />
      <stop offset="100%" stopColor="#254C0C" />
    </radialGradient>

    {/* 3D Alpine Pine (Teal to Deep Forest) */}
    <radialGradient id="foliage-pine-layer" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#80CBC4" />
      <stop offset="30%" stopColor="#26A69A" />
      <stop offset="70%" stopColor="#00796B" />
      <stop offset="95%" stopColor="#004D40" />
      <stop offset="100%" stopColor="#002922" />
    </radialGradient>

    {/* 3D Fruit Tree Foliage (Vibrant Spring Green) */}
    <radialGradient id="foliage-fruit-globe" cx="35%" cy="26%" r="65%">
      <stop offset="0%" stopColor="#DCEDC8" />
      <stop offset="35%" stopColor="#8BC34A" />
      <stop offset="70%" stopColor="#558B2F" />
      <stop offset="95%" stopColor="#2E5616" />
    </radialGradient>

    {/* 3D Pink Blossom Foliage (Cherry / Apple Blossom) */}
    <radialGradient id="foliage-blossom-globe" cx="32%" cy="28%" r="68%">
      <stop offset="0%" stopColor="#FFF0F5" />
      <stop offset="30%" stopColor="#F8BBD0" />
      <stop offset="65%" stopColor="#F06292" />
      <stop offset="92%" stopColor="#C2185B" />
      <stop offset="100%" stopColor="#880E4F" />
    </radialGradient>

    {/* 3D Plump Red Apple */}
    <radialGradient id="apple-fruit-3d" cx="30%" cy="28%" r="70%">
      <stop offset="0%" stopColor="#FF8A80" />
      <stop offset="35%" stopColor="#FF1744" />
      <stop offset="80%" stopColor="#D50000" />
      <stop offset="100%" stopColor="#880000" />
    </radialGradient>

    {/* 3D Golden Orange */}
    <radialGradient id="orange-fruit-3d" cx="30%" cy="28%" r="70%">
      <stop offset="0%" stopColor="#FFE082" />
      <stop offset="40%" stopColor="#FF9800" />
      <stop offset="80%" stopColor="#F57C00" />
      <stop offset="100%" stopColor="#E65100" />
    </radialGradient>

    {/* 3D Bush Leaf Clump */}
    <radialGradient id="foliage-bush-globe" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#AED581" />
      <stop offset="40%" stopColor="#7CB342" />
      <stop offset="75%" stopColor="#558B2F" />
      <stop offset="100%" stopColor="#2E5616" />
    </radialGradient>

    {/* 3D Granite Boulder */}
    <linearGradient id="rock-facet-top" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#BDBDBD" />
      <stop offset="50%" stopColor="#9E9E9E" />
      <stop offset="100%" stopColor="#757575" />
    </linearGradient>
    <linearGradient id="rock-facet-side" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#757575" />
      <stop offset="60%" stopColor="#616161" />
      <stop offset="100%" stopColor="#424242" />
    </linearGradient>
  </defs>
));

// 1. NOBLE 3D OAK TREE
export const Detailed3DOak: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  seed?: number;
  hasFruit?: boolean;
}> = ({ x = 0, y = 0, scale = 1, seed = 42, hasFruit = false }) => {
  const rnd = (offset: number) => pseudoRandom(seed + offset);
  const trunkCurve = (rnd(1) - 0.5) * 6;
  const goldenTint = rnd(2) > 0.6;
  const globeGrad = goldenTint ? 'url(#foliage-oak-golden)' : 'url(#foliage-oak-globe)';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 1. Soft Isometric Ground Shadow */}
      <ellipse cx="4" cy="10" rx="32" ry="14" fill="url(#foliage-ground-shadow)" />

      {/* 2. Gnarled Wooden Trunk with Roots & Branch Forks */}
      {/* Left flare root */}
      <path
        d="M -7 8 Q -15 11 -20 14 Q -14 16 -6 11 Z"
        fill="#3E2723"
        stroke="#271610"
        strokeWidth="0.8"
      />
      {/* Right flare root */}
      <path
        d="M 7 8 Q 16 11 22 14 Q 16 16 6 11 Z"
        fill="#4E342E"
        stroke="#271610"
        strokeWidth="0.8"
      />
      {/* Front taproot */}
      <ellipse cx="0" cy="10" rx="9" ry="3.5" fill="#3E2723" />

      {/* Main Trunk Column */}
      <path
        d={`M -8 9 Q ${trunkCurve - 6} -12 -5 -24 L 5 -24 Q ${trunkCurve + 7} -12 8 9 Z`}
        fill="url(#bark-trunk-3d)"
        stroke="#271610"
        strokeWidth="1.2"
      />

      {/* Bark Grain Lines */}
      <path
        d={`M -2 7 Q ${trunkCurve - 1} -8 -1 -22`}
        stroke="url(#bark-ridge-highlight)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d={`M 3 6 Q ${trunkCurve + 3} -7 2 -18`}
        stroke="#3E2723"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Branch Forks Entering Foliage */}
      <path
        d="M -4 -20 Q -14 -28 -18 -32"
        stroke="#4E342E"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 4 -20 Q 14 -28 18 -32"
        stroke="#4E342E"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. Multi-Layered Volumetric Foliage Globes */}
      {/* Back layer globes (darker, establishing depth) */}
      <circle cx="-16" cy="-36" r="16" fill={globeGrad} stroke="#27500B" strokeWidth="1" />
      <circle cx="16" cy="-36" r="16" fill={globeGrad} stroke="#27500B" strokeWidth="1" />
      <circle cx="0" cy="-48" r="18" fill={globeGrad} stroke="#27500B" strokeWidth="1" />

      {/* Mid-layer overlapping globes */}
      <circle cx="-18" cy="-26" r="17" fill={globeGrad} stroke="#27500B" strokeWidth="1" />
      <circle cx="18" cy="-26" r="17" fill={globeGrad} stroke="#27500B" strokeWidth="1" />
      <circle cx="-6" cy="-38" r="19" fill={globeGrad} stroke="#27500B" strokeWidth="1" />
      <circle cx="8" cy="-38" r="18" fill={globeGrad} stroke="#27500B" strokeWidth="1" />

      {/* Front center crown globe */}
      <circle cx="0" cy="-28" r="17" fill={globeGrad} stroke="#27500B" strokeWidth="1" />

      {/* 4. Sunlight Rim Crests (Gentle 3D Specular Highlights) */}
      <ellipse cx="-4" cy="-55" rx="9" ry="4" fill="#EDF7D2" opacity="0.75" />
      <ellipse cx="-20" cy="-34" rx="7" ry="3.5" fill="#EDF7D2" opacity="0.7" />
      <ellipse cx="14" cy="-35" rx="7" ry="3.5" fill="#EDF7D2" opacity="0.7" />
      <ellipse cx="-3" cy="-35" rx="8" ry="4" fill="#EDF7D2" opacity="0.65" />

      {/* Optional Fruit Plump Apples */}
      {hasFruit && (
        <g>
          {[
            { cx: -15, cy: -24, r: 3.8 },
            { cx: -8, cy: -38, r: 3.5 },
            { cx: 4, cy: -42, r: 3.8 },
            { cx: 14, cy: -32, r: 3.6 },
            { cx: 2, cy: -22, r: 3.8 },
            { cx: 18, cy: -20, r: 3.4 },
          ].map((app, i) => (
            <g key={i}>
              <circle cx={app.cx} cy={app.cy} r={app.r} fill="url(#apple-fruit-3d)" stroke="#7F0000" strokeWidth="0.6" />
              <circle cx={app.cx - 1.1} cy={app.cy - 1.1} r={app.r * 0.3} fill="#FFFFFF" opacity="0.9" />
              <path d={`M ${app.cx} ${app.cy - app.r} Q ${app.cx + 2} ${app.cy - app.r - 2} ${app.cx + 1} ${app.cy - app.r - 3}`} stroke="#3E2723" strokeWidth="0.7" fill="none" />
            </g>
          ))}
        </g>
      )}
    </g>
  );
};

// 2. ALPINE 3D CARTOON PINE TREE
export const Detailed3DPine: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  seed?: number;
}> = ({ x = 0, y = 0, scale = 1, seed = 17 }) => {
  const rnd = (offset: number) => pseudoRandom(seed + offset);
  const tierWidth1 = 26 + rnd(1) * 4;
  const tierWidth2 = 22 + rnd(2) * 3;
  const tierWidth3 = 17 + rnd(3) * 3;
  const tierWidth4 = 11 + rnd(4) * 2;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Soft Ground Shadow */}
      <ellipse cx="2" cy="7" rx="24" ry="10" fill="url(#foliage-ground-shadow)" />

      {/* Chunky Trunk with Bark Detail */}
      <polygon points="-4.5,8 4.5,8 3,-14 -3,-14" fill="url(#bark-trunk-3d)" stroke="#271610" strokeWidth="1" />
      <path d="M -5 7 Q -9 9 -12 11" stroke="#3E2723" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 5 7 Q 9 9 12 11" stroke="#3E2723" strokeWidth="2.4" strokeLinecap="round" />

      {/* Layer 1 (Bottom Tier - Widest) */}
      <path
        d={`M 0 -36 L -${tierWidth1} -12 Q -${tierWidth1 * 0.6} -9 -${tierWidth1 * 0.3} -14 Q 0 -10 ${tierWidth1 * 0.3} -14 Q ${tierWidth1 * 0.6} -9 ${tierWidth1} -12 Z`}
        fill="url(#foliage-pine-layer)"
        stroke="#00332C"
        strokeWidth="1.2"
      />
      {/* Layer 1 Needle Rim Highlight */}
      <path
        d={`M -${tierWidth1 * 0.8} -14 L 0 -26 L ${tierWidth1 * 0.8} -14`}
        stroke="#B2DFDB"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />

      {/* Layer 2 (Mid-Lower Tier) */}
      <path
        d={`M 0 -48 L -${tierWidth2} -26 Q -${tierWidth2 * 0.5} -23 -${tierWidth2 * 0.25} -28 Q 0 -24 ${tierWidth2 * 0.25} -28 Q ${tierWidth2 * 0.5} -23 ${tierWidth2} -26 Z`}
        fill="url(#foliage-pine-layer)"
        stroke="#00332C"
        strokeWidth="1.2"
      />
      {/* Layer 2 Rim Highlight */}
      <path
        d={`M -${tierWidth2 * 0.75} -27 L 0 -38 L ${tierWidth2 * 0.75} -27`}
        stroke="#B2DFDB"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Layer 3 (Mid-Upper Tier) */}
      <path
        d={`M 0 -60 L -${tierWidth3} -40 Q 0 -38 ${tierWidth3} -40 Z`}
        fill="url(#foliage-pine-layer)"
        stroke="#00332C"
        strokeWidth="1.2"
      />

      {/* Layer 4 (Top Conical Spire) */}
      <path
        d={`M 0 -72 L -${tierWidth4} -54 Q 0 -52 ${tierWidth4} -54 Z`}
        fill="url(#foliage-pine-layer)"
        stroke="#00332C"
        strokeWidth="1.2"
      />

      {/* Top Spire Highlight */}
      <ellipse cx="-1.5" cy="-66" rx="2.5" ry="5" fill="#E0F2F1" opacity="0.8" transform="rotate(-15 -1.5 -66)" />
    </g>
  );
};

// 3. 3D CARTOON FRUIT TREE (Apple or Orange)
export const Detailed3DFruitTree: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  fruitType?: 'apple' | 'orange';
}> = ({ x = 0, y = 0, scale = 1, fruitType = 'apple' }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="2" cy="7" rx="26" ry="11" fill="url(#foliage-ground-shadow)" />

      {/* Curved friendly trunk */}
      <path
        d="M -6 7 Q 0 -6 -3 -18 L 4 -18 Q 6 -6 6 7 Z"
        fill="url(#bark-trunk-3d)"
        stroke="#271610"
        strokeWidth="1.1"
      />

      {/* Clustered rounded foliage */}
      <circle cx="-14" cy="-28" r="14" fill="url(#foliage-fruit-globe)" stroke="#27500B" strokeWidth="1" />
      <circle cx="14" cy="-28" r="14" fill="url(#foliage-fruit-globe)" stroke="#27500B" strokeWidth="1" />
      <circle cx="0" cy="-38" r="16" fill="url(#foliage-fruit-globe)" stroke="#27500B" strokeWidth="1" />
      <circle cx="0" cy="-24" r="15" fill="url(#foliage-fruit-globe)" stroke="#27500B" strokeWidth="1" />

      {/* Glossy highlights */}
      <ellipse cx="-3" cy="-44" rx="7" ry="3.5" fill="#F1F8E9" opacity="0.8" />
      <ellipse cx="-15" cy="-32" rx="5" ry="2.5" fill="#F1F8E9" opacity="0.75" />
      <ellipse cx="12" cy="-32" rx="5" ry="2.5" fill="#F1F8E9" opacity="0.75" />

      {/* Fruit placement */}
      {[
        { cx: -12, cy: -24 },
        { cx: -2, cy: -32 },
        { cx: 8, cy: -34 },
        { cx: 13, cy: -24 },
        { cx: -1, cy: -18 },
      ].map((f, i) => (
        <g key={i}>
          <circle
            cx={f.cx}
            cy={f.cy}
            r="3.5"
            fill={fruitType === 'apple' ? 'url(#apple-fruit-3d)' : 'url(#orange-fruit-3d)'}
            stroke={fruitType === 'apple' ? '#7F0000' : '#BF360C'}
            strokeWidth="0.6"
          />
          <circle cx={f.cx - 1} cy={f.cy - 1} r="1" fill="#FFFFFF" opacity="0.9" />
        </g>
      ))}
    </g>
  );
};

// 4. 3D FLOWERING BLOSSOM TREE (Pastel Pink)
export const Detailed3DBlossomTree: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 0, y = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="2" cy="7" rx="27" ry="11" fill="url(#foliage-ground-shadow)" />

      {/* Slender trunk */}
      <path
        d="M -5 7 Q 1 -8 -2 -20 L 4 -20 Q 7 -7 5 7 Z"
        fill="url(#bark-trunk-3d)"
        stroke="#271610"
        strokeWidth="1.1"
      />

      {/* Pink petal canopy */}
      <circle cx="-15" cy="-32" r="15" fill="url(#foliage-blossom-globe)" stroke="#880E4F" strokeWidth="1" />
      <circle cx="15" cy="-32" r="15" fill="url(#foliage-blossom-globe)" stroke="#880E4F" strokeWidth="1" />
      <circle cx="0" cy="-44" r="17" fill="url(#foliage-blossom-globe)" stroke="#880E4F" strokeWidth="1" />
      <circle cx="0" cy="-28" r="16" fill="url(#foliage-blossom-globe)" stroke="#880E4F" strokeWidth="1" />

      {/* Highlights */}
      <ellipse cx="-2" cy="-50" rx="8" ry="4" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="-14" cy="-38" rx="6" ry="3" fill="#FFFFFF" opacity="0.75" />

      {/* Falling blossom specks */}
      <circle cx="-22" cy="-14" r="1.5" fill="#F8BBD0" />
      <circle cx="20" cy="-16" r="1.8" fill="#F48FB1" />
      <circle cx="15" cy="-6" r="1.4" fill="#F8BBD0" />
    </g>
  );
};

// 5. 3D SLENDER CYPRESS / CEDAR
export const Detailed3DCypress: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 0, y = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="1" cy="5" rx="16" ry="7" fill="url(#foliage-ground-shadow)" />
      {/* Base Trunk */}
      <rect x="-3" y="-5" width="6" height="11" fill="url(#bark-trunk-3d)" stroke="#271610" strokeWidth="0.8" />

      {/* Stacked flame-like rounded lobes */}
      <ellipse cx="0" cy="-14" rx="13" ry="15" fill="url(#foliage-pine-layer)" stroke="#00332C" strokeWidth="1" />
      <ellipse cx="0" cy="-28" rx="11" ry="16" fill="url(#foliage-pine-layer)" stroke="#00332C" strokeWidth="1" />
      <ellipse cx="0" cy="-44" rx="8" ry="16" fill="url(#foliage-pine-layer)" stroke="#00332C" strokeWidth="1" />
      <ellipse cx="0" cy="-58" rx="4.5" ry="12" fill="url(#foliage-pine-layer)" stroke="#00332C" strokeWidth="1" />

      {/* Vertical Sunlight Highlights */}
      <ellipse cx="-2" cy="-40" rx="3.5" ry="18" fill="#B2DFDB" opacity="0.65" />
    </g>
  );
};

// 6. 3D LUSH BERRY BUSH
export const Detailed3DBush: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  hasBerries?: boolean;
}> = ({ x = 0, y = 0, scale = 1, hasBerries = true }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="1" cy="4" rx="18" ry="8" fill="url(#foliage-ground-shadow)" />

      {/* Foliage cluster */}
      <circle cx="-9" cy="-7" r="10" fill="url(#foliage-bush-globe)" stroke="#27500B" strokeWidth="0.8" />
      <circle cx="9" cy="-7" r="10" fill="url(#foliage-bush-globe)" stroke="#27500B" strokeWidth="0.8" />
      <circle cx="0" cy="-13" r="11" fill="url(#foliage-bush-globe)" stroke="#27500B" strokeWidth="0.8" />
      <circle cx="0" cy="-6" r="10" fill="url(#foliage-bush-globe)" stroke="#27500B" strokeWidth="0.8" />

      {/* Top Highlights */}
      <ellipse cx="-2" cy="-16" rx="5" ry="2.5" fill="#EDF7D2" opacity="0.8" />

      {/* Wild Red & Blue Berries */}
      {hasBerries && (
        <g>
          <circle cx="-8" cy="-8" r="2.2" fill="#E91E63" stroke="#880E4F" strokeWidth="0.5" />
          <circle cx="-3" cy="-12" r="2.4" fill="#9C27B0" stroke="#4A148C" strokeWidth="0.5" />
          <circle cx="5" cy="-11" r="2.2" fill="#E91E63" stroke="#880E4F" strokeWidth="0.5" />
          <circle cx="8" cy="-5" r="2.4" fill="#9C27B0" stroke="#4A148C" strokeWidth="0.5" />
          <circle cx="1" cy="-4" r="2" fill="#E91E63" stroke="#880E4F" strokeWidth="0.5" />
        </g>
      )}
    </g>
  );
};

// 7. 3D CHUNKY MOSSY BOULDER
export const Detailed3DBoulder: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 0, y = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="2" cy="5" rx="18" ry="8" fill="url(#foliage-ground-shadow)" />

      {/* Chiseled Facets */}
      <path
        d="M -14 3 Q -17 -6 -9 -11 L 3 -13 L 13 -7 Q 16 1 12 5 L -10 6 Z"
        fill="url(#rock-facet-side)"
        stroke="#2E2E2E"
        strokeWidth="1.2"
      />
      {/* Top Light-Facing Plane */}
      <path
        d="M -9 -11 L 3 -13 L 11 -7 L 1 -3 L -11 -4 Z"
        fill="url(#rock-facet-top)"
        stroke="#424242"
        strokeWidth="0.8"
      />

      {/* Velvety Green Moss Blanket */}
      <path
        d="M -10 -8 Q -4 -13 4 -12 Q 9 -11 7 -6 Q 2 -4 -3 -5 Q -8 -4 -10 -8 Z"
        fill="#689F38"
        stroke="#33691E"
        strokeWidth="0.8"
      />
      {/* Little daisy growing near base */}
      <circle cx="-12" cy="4" r="2.5" fill="#FFFFFF" />
      <circle cx="-12" cy="4" r="1" fill="#FFD600" />
    </g>
  );
};

// 8. 3D HOLLOW FALLEN LOG WITH MUSHROOMS
export const Detailed3DFallenLog: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 0, y = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="4" rx="20" ry="7" fill="url(#foliage-ground-shadow)" />

      {/* Log Body */}
      <path
        d="M -16 1 L 14 -8 L 17 -1 L -13 8 Z"
        fill="url(#bark-trunk-3d)"
        stroke="#271610"
        strokeWidth="1.2"
      />
      {/* Left Hollow Cut End */}
      <ellipse cx="-14.5" cy="4.5" rx="4" ry="3.5" fill="#2E1C14" stroke="#4E342E" strokeWidth="1" />
      <ellipse cx="-14.5" cy="4.5" rx="2" ry="1.8" fill="#150B06" />

      {/* Moss Patch on Bark */}
      <path d="M -6 1 Q 0 -3 6 -2 L 5 2 Q 0 1 -5 4 Z" fill="#689F38" opacity="0.85" />

      {/* Little Orange Bracket Mushrooms */}
      <ellipse cx="6" cy="-4" rx="3.5" ry="1.8" fill="#FF9800" stroke="#E65100" strokeWidth="0.5" />
      <ellipse cx="10" cy="-6" rx="2.8" ry="1.5" fill="#FFA726" stroke="#E65100" strokeWidth="0.5" />
    </g>
  );
};

// 9. 3D WILDFLOWER CLUSTER
export const Detailed3DWildflowers: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 0, y = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Grass Stems */}
      <path d="M -6 4 Q -10 -4 -8 -10" stroke="#7CB342" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 0 4 Q 1 -6 4 -12" stroke="#689F38" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 6 4 Q 10 -2 12 -8" stroke="#7CB342" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Daisy */}
      <circle cx="-8" cy="-10" r="3.2" fill="#FFFFFF" stroke="#ECEFF1" strokeWidth="0.5" />
      <circle cx="-8" cy="-10" r="1.4" fill="#FFCA28" />

      {/* Red Poppy */}
      <circle cx="4" cy="-12" r="3.6" fill="#FF1744" stroke="#C62828" strokeWidth="0.5" />
      <circle cx="4" cy="-12" r="1.2" fill="#212121" />

      {/* Bluebell */}
      <ellipse cx="12" cy="-8" rx="2.5" ry="3" fill="#448AFF" stroke="#1565C0" strokeWidth="0.5" />
    </g>
  );
};

// 10. 3D WOODEN SURVEY STAKE WITH FLUTTERING RIBBON (Frontier Demarcation)
export const Detailed3DSurveyStake: React.FC<{
  x: number;
  y: number;
  scale?: number;
  hasFlag?: boolean;
}> = ({ x, y, scale = 1, hasFlag = true }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground Hole / Shadow */}
      <ellipse cx="0" cy="4" rx="4" ry="2" fill="rgba(0,0,0,0.3)" />

      {/* Wooden Peg */}
      <polygon points="-2,4 2,4 1.5,-16 -1.5,-16" fill="url(#bark-trunk-3d)" stroke="#271610" strokeWidth="0.8" />
      <polygon points="-1.5,-16 0,-19 1.5,-16" fill="#A1887F" stroke="#271610" strokeWidth="0.6" />

      {/* Fluttering Red Ribbon / Pennant Flag */}
      {hasFlag && (
        <g>
          <path
            d="M 1.5 -16 Q 8 -19 14 -16 Q 8 -13 1.5 -12 Z"
            fill="#E53935"
            stroke="#B71C1C"
            strokeWidth="0.6"
          />
          <circle cx="1.5" cy="-16" r="1.2" fill="#FFD54F" />
        </g>
      )}
    </g>
  );
};

// 11. UNIFIED PROCEDURAL NATURE PROP
// Automatically selects appropriate tree or prop with procedural variation so NO two look identical!
export type FoliagePropType =
  | 'oak'
  | 'pine'
  | 'fruit_tree'
  | 'cypress'
  | 'blossom'
  | 'bush'
  | 'rock'
  | 'log'
  | 'wildflowers';

export const ProceduralFoliageProp: React.FC<{
  type: FoliagePropType;
  x: number;
  y: number;
  seed?: number;
  baseScale?: number;
}> = React.memo(({ type, x, y, seed = 0, baseScale = 1 }) => {
  const rnd = (offset: number) => pseudoRandom(seed + offset);
  const scaleJitter = 0.85 + rnd(1) * 0.35; // 0.85x to 1.2x
  const finalScale = baseScale * scaleJitter;

  switch (type) {
    case 'oak':
      return <Detailed3DOak x={x} y={y} scale={finalScale} seed={seed} hasFruit={rnd(2) > 0.6} />;
    case 'pine':
      return <Detailed3DPine x={x} y={y} scale={finalScale} seed={seed} />;
    case 'fruit_tree':
      return (
        <Detailed3DFruitTree
          x={x}
          y={y}
          scale={finalScale}
          fruitType={rnd(3) > 0.5 ? 'apple' : 'orange'}
        />
      );
    case 'cypress':
      return <Detailed3DCypress x={x} y={y} scale={finalScale} />;
    case 'blossom':
      return <Detailed3DBlossomTree x={x} y={y} scale={finalScale} />;
    case 'bush':
      return <Detailed3DBush x={x} y={y} scale={finalScale} hasBerries={rnd(4) > 0.3} />;
    case 'rock':
      return <Detailed3DBoulder x={x} y={y} scale={finalScale} />;
    case 'log':
      return <Detailed3DFallenLog x={x} y={y} scale={finalScale} />;
    case 'wildflowers':
      return <Detailed3DWildflowers x={x} y={y} scale={finalScale} />;
    default:
      return <Detailed3DOak x={x} y={y} scale={finalScale} seed={seed} />;
  }
});
