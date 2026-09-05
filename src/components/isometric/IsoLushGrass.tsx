import React, { useMemo } from 'react';

interface IsoLushGrassProps {
  mapSize: number;
  tileWidth: number;
  tileHeight: number;
  gridToIso: (gx: number, gy: number) => { x: number; y: number };
}

export const IsoLushGrass: React.FC<IsoLushGrassProps> = React.memo(({
  mapSize,
  tileWidth,
  tileHeight,
  gridToIso,
}) => {
  // World bounds covering all expanded parcels, mountain plateau, and riverbank
  const minWorldX = -12;
  const maxWorldX = 28;
  const minWorldY = -12;
  const maxWorldY = 22;

  // Key isometric boundary points of the entire continuous farm landscape
  const pWorldTop = gridToIso(minWorldX, minWorldY);
  const pWorldRight = gridToIso(maxWorldX, minWorldY);
  const pWorldBottom = gridToIso(maxWorldX, maxWorldY);
  const pWorldLeft = gridToIso(minWorldX, maxWorldY);

  const worldPoints = `${pWorldTop.x},${pWorldTop.y} ${pWorldRight.x},${pWorldRight.y} ${pWorldBottom.x},${pWorldBottom.y} ${pWorldLeft.x},${pWorldLeft.y}`;

  // Organic decorative scatter elements (Grass tufts, Daisies, Clovers, Buttercups, Pebbles)
  // Distributed smoothly across both the main farm and all expansion territories
  const scatterItems = useMemo(() => {
    const items: Array<{
      id: string;
      x: number;
      y: number;
      type: 'tuft_large' | 'tuft_small' | 'daisy' | 'clover' | 'buttercup' | 'pebble';
      scale: number;
      rotation: number;
    }> = [];

    // Predefined coordinates that scatter naturally across open pasture areas
    const points: Array<[number, number, 'tuft_large' | 'tuft_small' | 'daisy' | 'clover' | 'buttercup' | 'pebble', number, number]> = [
      // Near northern fence and road
      [1.2, 0.8, 'tuft_large', 1.0, -5],
      [2.5, 0.4, 'daisy', 0.9, 10],
      [4.1, 0.6, 'clover', 1.1, 0],
      [6.3, 0.5, 'tuft_small', 0.9, 15],
      [8.2, 0.8, 'buttercup', 1.0, -10],
      [10.4, 0.5, 'tuft_large', 1.1, 8],
      [12.1, 0.9, 'daisy', 0.95, -15],

      // Upper interior meadow
      [0.8, 2.3, 'tuft_small', 1.0, 12],
      [2.2, 2.7, 'daisy', 1.1, 0],
      [3.8, 1.8, 'clover', 0.9, -8],
      [5.4, 2.2, 'tuft_large', 1.05, 5],
      [7.1, 1.9, 'pebble', 1.0, 20],
      [8.8, 2.4, 'buttercup', 0.95, -12],
      [11.2, 2.1, 'tuft_small', 1.0, -6],
      [12.8, 2.6, 'clover', 1.0, 15],

      // Central open farm lawn
      [0.6, 4.5, 'clover', 1.05, -10],
      [1.8, 4.2, 'tuft_large', 1.0, 4],
      [3.2, 3.8, 'buttercup', 0.9, 18],
      [4.7, 4.4, 'pebble', 0.9, -15],
      [6.8, 3.9, 'daisy', 1.05, 8],
      [8.3, 4.6, 'tuft_small', 0.95, -4],
      [10.1, 4.1, 'clover', 1.1, 12],
      [12.4, 4.8, 'tuft_large', 1.0, 0],

      // Mid-lower pasture
      [0.9, 6.7, 'daisy', 1.0, -12],
      [2.6, 6.3, 'tuft_small', 0.85, 15],
      [4.3, 6.9, 'buttercup', 1.0, 0],
      [6.1, 6.2, 'clover', 0.95, -18],
      [7.9, 6.8, 'tuft_large', 1.1, 6],
      [9.7, 6.4, 'pebble', 1.05, 10],
      [11.8, 6.7, 'daisy', 0.9, -5],
      [13.1, 6.2, 'tuft_small', 1.0, 8],

      // South-West edge near road
      [0.5, 8.4, 'tuft_large', 1.0, 10],
      [1.7, 8.9, 'clover', 1.0, -8],
      [3.4, 8.2, 'daisy', 1.1, 14],
      [5.2, 8.7, 'tuft_small', 0.9, -12],
      [7.0, 8.3, 'buttercup', 0.95, 5],
      [8.9, 8.8, 'tuft_large', 1.05, -7],
      [10.8, 8.5, 'pebble', 0.9, 25],
      [12.6, 8.9, 'clover', 1.0, -15],

      // Lower southern field
      [1.1, 10.5, 'pebble', 1.0, -5],
      [2.8, 10.8, 'tuft_large', 1.1, 8],
      [4.6, 10.3, 'daisy', 0.95, -10],
      [6.5, 10.9, 'clover', 1.05, 12],
      [8.4, 10.4, 'tuft_small', 0.9, 0],
      [10.2, 10.7, 'buttercup', 1.0, -18],
      [12.2, 10.5, 'tuft_large', 1.0, 14],

      // Waterfront & southern tip pasture
      [0.8, 12.4, 'clover', 0.9, 6],
      [2.4, 12.8, 'tuft_small', 1.0, -14],
      [4.2, 12.2, 'buttercup', 0.95, 10],
      [6.3, 12.7, 'daisy', 1.05, -8],
      [8.1, 12.3, 'tuft_large', 1.0, 12],
      [10.5, 12.6, 'clover', 1.1, -4],
      [12.1, 12.2, 'pebble', 0.85, 30],

      // Eastern meadow & sunny pasture
      [13.4, 1.6, 'tuft_large', 1.05, 10],
      [13.7, 3.8, 'daisy', 1.0, -8],
      [15.2, 2.4, 'clover', 1.1, 5],
      [17.1, 4.2, 'buttercup', 0.95, 12],
      [18.5, 6.1, 'tuft_small', 1.0, -10],
      [16.4, 8.3, 'daisy', 1.05, 15],
      [18.2, 10.4, 'clover', 1.0, -5],
      [15.8, 12.6, 'tuft_large', 1.1, 8],
      [17.9, 14.8, 'buttercup', 1.0, -12],

      // Southern extended meadow
      [3.2, 15.1, 'tuft_large', 1.0, 6],
      [6.4, 15.8, 'daisy', 1.1, -10],
      [9.1, 15.4, 'clover', 0.95, 14],
      [11.8, 16.2, 'buttercup', 1.0, -4],
      [4.8, 17.1, 'pebble', 1.0, 18],
      [8.3, 17.5, 'tuft_small', 0.9, -15],

      // Western slopes
      [-2.1, 2.5, 'tuft_large', 1.0, -8],
      [-3.8, 4.2, 'clover', 1.05, 10],
      [-2.4, 6.8, 'daisy', 0.9, -5],
      [-4.1, 8.5, 'buttercup', 1.1, 12],
      [-2.8, 10.2, 'tuft_small', 0.95, 7],

      // Northern mountain foothills near mine
      [2.5, -2.4, 'pebble', 1.1, 15],
      [5.2, -3.1, 'tuft_small', 1.0, -12],
      [8.4, -2.8, 'daisy', 0.9, 8],
      [10.1, -3.5, 'clover', 1.05, -6],
      [3.8, -5.2, 'pebble', 0.9, 22],
      [7.2, -5.8, 'tuft_large', 1.1, -10],
      [13.2, 5.9, 'clover', 1.1, 14],
      [13.6, 8.0, 'buttercup', 0.95, -10],
      [13.3, 10.1, 'tuft_small', 1.0, 12],
      [13.6, 11.9, 'daisy', 1.05, 5],
      [13.2, 13.1, 'clover', 1.0, -6],
    ];

    points.forEach(([gx, gy, type, scale, rot], index) => {
      const pos = gridToIso(gx, gy);
      items.push({
        id: `scatter_${index}`,
        x: pos.x,
        y: pos.y,
        type,
        scale,
        rotation: rot,
      });
    });

    return items;
  }, [gridToIso]);

  return (
    <g id="hayday-lush-grass-layer" className="select-none pointer-events-none">
      <defs>
        {/* Hay Day Rich Meadow Grass Linear Gradient */}
        <linearGradient id="hd-grass-base-vibrant" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#9DE83B" />   {/* Bright morning lime highlight */}
          <stop offset="25%" stopColor="#86D628" />  {/* Warm sunny grass */}
          <stop offset="55%" stopColor="#6DBF1B" />  {/* Classic Hay Day lush green */}
          <stop offset="85%" stopColor="#55A412" />  {/* Rich pasture emerald */}
          <stop offset="100%" stopColor="#3E830B" /> {/* Soft shaded meadow edge */}
        </linearGradient>

        {/* Sunny Dappled Sky Bloom (Warm Sunlit Glow) */}
        <radialGradient id="hd-sun-bloom" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FFFDE7" stopOpacity="0.28" />
          <stop offset="35%" stopColor="#F9FBE7" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#6DBF1B" stopOpacity="0" />
        </radialGradient>

        {/* Soft Organic Clover Patch (Deeper Emerald) */}
        <radialGradient id="hd-clover-patch-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B810A" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#4A9810" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#6DBF1B" stopOpacity="0" />
        </radialGradient>

        {/* Warm Golden Lawn Dapple */}
        <radialGradient id="hd-sunny-lawn-dapple" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A8F242" stopOpacity="0.24" />
          <stop offset="60%" stopColor="#96E430" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#6DBF1B" stopOpacity="0" />
        </radialGradient>

        {/* Natural Soil Bed Vignette on Rim */}
        <linearGradient id="hd-soil-rim-vignette" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="80%" stopColor="rgba(46, 26, 12, 0.04)" />
          <stop offset="100%" stopColor="rgba(38, 20, 8, 0.16)" />
        </linearGradient>

        {/* Clip Path for Entire Unified Pasture and Dapples */}
        <clipPath id="hayday-pasture-clip">
          <polygon points={worldPoints} />
        </clipPath>
      </defs>

      {/* 0. DISTANT COUNTRYSIDE ROLLING HILLS (Hay Day Valley Horizon) */}
      <g id="hayday-valley-hills" opacity="0.85">
        {/* Far pale hills spanning north and east horizon */}
        <path
          d={`M ${pWorldLeft.x - 300} ${pWorldLeft.y - 150} Q ${pWorldTop.x - 200} ${pWorldTop.y - 300} ${pWorldTop.x} ${pWorldTop.y - 220} Q ${pWorldTop.x + 300} ${pWorldTop.y - 320} ${pWorldRight.x + 320} ${pWorldRight.y - 120} Q ${pWorldRight.x + 280} ${pWorldRight.y + 150} ${pWorldBottom.x + 200} ${pWorldBottom.y + 100} L ${pWorldBottom.x + 200} ${pWorldBottom.y + 180} L ${pWorldLeft.x - 300} ${pWorldLeft.y + 140} Z`}
          fill="#86CD54"
          opacity="0.5"
        />
        {/* Mid-distance lush green rolling hills */}
        <path
          d={`M ${pWorldLeft.x - 180} ${pWorldLeft.y - 80} Q ${pWorldTop.x - 150} ${pWorldTop.y - 180} ${pWorldTop.x - 30} ${pWorldTop.y - 120} Q ${pWorldTop.x + 180} ${pWorldTop.y - 200} ${pWorldRight.x + 200} ${pWorldRight.y - 50} Q ${pWorldRight.x + 160} ${pWorldRight.y + 90} ${pWorldBottom.x + 120} ${pWorldBottom.y + 70} L ${pWorldBottom.x + 120} ${pWorldBottom.y + 120} L ${pWorldLeft.x - 120} ${pWorldLeft.y + 90} Z`}
          fill="#70BF36"
          opacity="0.75"
        />
      </g>

      {/* 1. MAIN LUSH HAY DAY CONTINUOUS GRASS SURFACE - Covers full farm & expansions seamlessly */}
      <polygon
        id="hayday-pasture-polygon"
        points={worldPoints}
        fill="url(#hd-grass-base-vibrant)"
      />

      {/* 2. SOFT MANICURED LAWN STRIPES (Subtle diagonal bands across extended landscape) */}
      {[-24, -20, -16, -12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((bandIndex) => {
        const p1 = gridToIso(bandIndex, minWorldY);
        const p2 = gridToIso(bandIndex + 2.8, minWorldY);
        const p3 = gridToIso(bandIndex + 2.8 - (maxWorldY - minWorldY), maxWorldY);
        const p4 = gridToIso(bandIndex - (maxWorldY - minWorldY), maxWorldY);

        return (
          <polygon
            key={`lawn_band_${bandIndex}`}
            points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
            fill={bandIndex % 2 === 0 ? '#A6F23E' : '#4E9C11'}
            opacity={bandIndex % 2 === 0 ? 0.045 : 0.035}
            clipPath="url(#hayday-pasture-clip)"
          />
        );
      })}

      {/* 3. WARM SUNLIGHT BLOOM ACROSS THE MEADOW */}
      <polygon
        points={worldPoints}
        fill="url(#hd-sun-bloom)"
      />

      {/* 4. SOFT ORGANIC CLOVER & WARM TURF DAPPLES (Clipped to pasture) */}
      <g clipPath="url(#hayday-pasture-clip)">
        <ellipse cx={pWorldTop.x + 120} cy={pWorldTop.y + 180} rx="320" ry="160" fill="url(#hd-sunny-lawn-dapple)" />
        <ellipse cx={pWorldLeft.x + 360} cy={pWorldLeft.y + 40} rx="280" ry="140" fill="url(#hd-clover-patch-glow)" />
        <ellipse cx={pWorldRight.x - 300} cy={pWorldRight.y + 80} rx="300" ry="150" fill="url(#hd-sunny-lawn-dapple)" />
        <ellipse cx={pWorldBottom.x} cy={pWorldBottom.y - 180} rx="360" ry="180" fill="url(#hd-clover-patch-glow)" />
      </g>

      {/* 5. NATURAL EARTH RIM VIGNETTE */}
      <polygon
        points={worldPoints}
        fill="url(#hd-soil-rim-vignette)"
      />

      {/* 6. HAY DAY HAND-CRAFTED SCATTER DETAILS (Tufts, Daisies, Clovers, Buttercups, Pebbles) */}
      {scatterItems.map((item) => {
        if (item.type === 'tuft_large') {
          return <GrassTuftLarge key={item.id} x={item.x} y={item.y} scale={item.scale} rotation={item.rotation} />;
        }
        if (item.type === 'tuft_small') {
          return <GrassTuftSmall key={item.id} x={item.x} y={item.y} scale={item.scale} rotation={item.rotation} />;
        }
        if (item.type === 'daisy') {
          return <WildDaisy key={item.id} x={item.x} y={item.y} scale={item.scale} />;
        }
        if (item.type === 'clover') {
          return <LuckyClover key={item.id} x={item.x} y={item.y} scale={item.scale} rotation={item.rotation} />;
        }
        if (item.type === 'buttercup') {
          return <GoldenButtercup key={item.id} x={item.x} y={item.y} scale={item.scale} />;
        }
        if (item.type === 'pebble') {
          return <PasturePebble key={item.id} x={item.x} y={item.y} scale={item.scale} />;
        }
        return null;
      })}
    </g>
  );
});

// --------------------------------------------------------------------------
// SCATTER COMPONENTS: HAND-CRAFTED HAY DAY VECTOR ART
// --------------------------------------------------------------------------

// 3D Cartoon Large Grass Clump (4 Curved Blades with Dual-Tone Sun Shading)
const GrassTuftLarge: React.FC<{ x: number; y: number; scale?: number; rotation?: number }> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}>
    {/* Ground Soft Contact Shadow */}
    <ellipse cx="0" cy="1.5" rx="7" ry="2.8" fill="rgba(20, 50, 8, 0.35)" />

    {/* Blade 1 (Left background shadow blade) */}
    <path
      d="M -1 1 C -4 -4 -7 -7 -10 -8 C -6 -6 -3 -3 0 1 Z"
      fill="#2F660A"
    />
    {/* Blade 2 (Center tall main blade) */}
    <path
      d="M -1 1 C -2 -6 -1 -12 1 -15 C 2 -9 2 -5 1 1 Z"
      fill="#6DBF1B"
    />
    {/* Blade 2 sunlit edge */}
    <path
      d="M 0 1 C 0 -6 0.8 -11 1 -15 C 1.6 -10 1.4 -6 0.8 1 Z"
      fill="#A8F240"
    />

    {/* Blade 3 (Right curved sunlit blade) */}
    <path
      d="M 0 1 C 3 -4 7 -8 11 -9 C 7 -6 4 -3 1 1 Z"
      fill="#8BE026"
    />
    {/* Blade 3 tip highlight */}
    <path
      d="M 5 -4 C 8 -7 10 -8.5 11 -9 C 9 -7 6 -5 4 -3 Z"
      fill="#D4FF70"
    />

    {/* Blade 4 (Small front baby sprout) */}
    <path
      d="M -1 1 C 1 -2 3 -5 4 -7 C 2 -4 1 -2 0 1 Z"
      fill="#A2F039"
    />

    {/* Root anchor dot */}
    <circle cx="0.2" cy="0.8" r="1.2" fill="#295708" />
  </g>
);

// 3D Cartoon Small Grass Clump (2 Delicate Blades)
const GrassTuftSmall: React.FC<{ x: number; y: number; scale?: number; rotation?: number }> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}>
    <ellipse cx="0" cy="1" rx="4.5" ry="1.8" fill="rgba(20, 50, 8, 0.28)" />
    {/* Left blade */}
    <path d="M 0 1 C -2 -3 -4 -6 -6 -7 C -3 -5 -1 -2 0 1 Z" fill="#4B9A12" />
    {/* Right sunlit blade */}
    <path d="M 0 1 C 1 -4 3 -8 5 -10 C 3 -6 1 -3 0 1 Z" fill="#8CE226" />
    <path d="M 1.5 -3 C 2.5 -6 4 -8.5 5 -10 C 3.8 -7 2.2 -4 1 -2 Z" fill="#CEFF6B" />
  </g>
);

// Cheerful Wild Daisy Flower (Margaridinha Silvestre)
const WildDaisy: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Ground Shadow */}
    <ellipse cx="0" cy="1.5" rx="5" ry="2.2" fill="rgba(20, 45, 10, 0.3)" />

    {/* Tiny Green Stem & Leaf */}
    <path d="M 0 1 Q -1.5 -2 -2 -4" stroke="#438B0E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <ellipse cx="-2.5" cy="-2.5" rx="2" ry="1" fill="#6DBF1B" transform="rotate(-30 -2.5 -2.5)" />

    {/* Blossom Center Positioned at (-2, -5) */}
    <g transform="translate(-2, -5)">
      {/* 6 Plump White Rounded Petals */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-3.2"
          rx="1.5"
          ry="2.4"
          fill="#FFFFFF"
          stroke="#E0E7D8"
          strokeWidth="0.4"
          transform={`rotate(${deg})`}
        />
      ))}
      {/* Bright Golden-Orange Pollen Heart */}
      <circle cx="0" cy="0" r="2.2" fill="#FFA000" stroke="#FF8F00" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="1.5" fill="#FFCA28" />
      <circle cx="-0.5" cy="-0.6" r="0.6" fill="#FFF9C4" />
    </g>
  </g>
);

// Lucky Three-Leaf Shamrock Clover (Trevo de Três Folhas)
const LuckyClover: React.FC<{ x: number; y: number; scale?: number; rotation?: number }> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}>
    <ellipse cx="0" cy="1" rx="4.5" ry="2" fill="rgba(15, 40, 8, 0.25)" />
    {/* Stalk */}
    <path d="M 0 1 Q 1 -1.5 0 -4" stroke="#33750D" strokeWidth="1" fill="none" />

    {/* 3 Heart-Shaped Leaflets */}
    <g transform="translate(0, -4)">
      {/* Top Leaflet */}
      <path
        d="M 0 0 C -2.2 -1.5 -3.5 -4 0 -5.5 C 3.5 -4 2.2 -1.5 0 0 Z"
        fill="#2E730E"
        stroke="#1E5207"
        strokeWidth="0.3"
      />
      {/* Left Leaflet */}
      <path
        d="M 0 0 C -1.5 -2.2 -4 -3.5 -5.5 0 C -4 3.5 -1.5 2.2 0 0 Z"
        fill="#398A12"
        stroke="#1E5207"
        strokeWidth="0.3"
      />
      {/* Right Leaflet */}
      <path
        d="M 0 0 C 1.5 -2.2 4 -3.5 5.5 0 C 4 3.5 1.5 2.2 0 0 Z"
        fill="#47A318"
        stroke="#1E5207"
        strokeWidth="0.3"
      />
      {/* Center Bright Highlight Dot */}
      <circle cx="0" cy="0" r="0.8" fill="#78D62E" />
    </g>
  </g>
);

// Golden Buttercup / Tiny Dandelion Blossom
const GoldenButtercup: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="1" rx="3.5" ry="1.6" fill="rgba(20, 45, 10, 0.25)" />
    <path d="M 0 1 Q 0.5 -1.5 0 -3" stroke="#438B0E" strokeWidth="1" fill="none" />
    {/* 4 Golden Petals */}
    <g transform="translate(0, -3)">
      <circle cx="-1.6" cy="-1.6" r="1.6" fill="#FFEB3B" />
      <circle cx="1.6" cy="-1.6" r="1.6" fill="#FFEB3B" />
      <circle cx="-1.6" cy="1.6" r="1.6" fill="#FDD835" />
      <circle cx="1.6" cy="1.6" r="1.6" fill="#FDD835" />
      {/* Center Orange Dot */}
      <circle cx="0" cy="0" r="1.2" fill="#FB8C00" />
    </g>
  </g>
);

// Smooth Country River Pebble (Pedrinha de Campo)
const PasturePebble: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Cast Shadow */}
    <ellipse cx="0.5" cy="1.2" rx="4.2" ry="2.2" fill="rgba(15, 30, 10, 0.4)" />
    {/* Smooth River Stone */}
    <ellipse cx="0" cy="0" rx="3.8" ry="2.2" fill="#90A4AE" stroke="#607D8B" strokeWidth="0.5" />
    {/* Sun Specular Highlight */}
    <ellipse cx="-0.8" cy="-0.6" rx="2" ry="0.9" fill="#CFD8DC" />
    <circle cx="-1.2" cy="-0.8" r="0.6" fill="#FFFFFF" />
  </g>
);
