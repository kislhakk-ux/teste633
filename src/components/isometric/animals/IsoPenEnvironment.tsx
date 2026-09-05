import React from 'react';
import { AnimalType } from '../../../types/game';

interface IsoPenEnvProps {
  animalType: AnimalType;
}

/**
 * 3D Isometric Pen Background:
 * Renders the ground footprint, textured terrain, 3D coop/barn architecture,
 * feeding troughs, water sources, and back fences.
 */
export const IsoPenBackground: React.FC<IsoPenEnvProps> = React.memo(({ animalType }) => {
  return (
    <g id={`pen-bg-${animalType}`}>
      <defs>
        {/* Ground Terrain Gradients */}
        <radialGradient id="ground-chicken" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="50%" stopColor="#6D4C41" />
          <stop offset="85%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#4E342E" />
        </radialGradient>

        <radialGradient id="ground-cow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="55%" stopColor="#689F38" />
          <stop offset="85%" stopColor="#558B2F" />
          <stop offset="100%" stopColor="#33691E" />
        </radialGradient>

        <radialGradient id="ground-pig" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="50%" stopColor="#4E342E" />
          <stop offset="80%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#271406" />
        </radialGradient>

        <radialGradient id="ground-sheep" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#8BC34A" />
          <stop offset="55%" stopColor="#7CB342" />
          <stop offset="85%" stopColor="#689F38" />
          <stop offset="100%" stopColor="#558B2F" />
        </radialGradient>

        {/* 3D Red Barn Wood Plank Siding */}
        <linearGradient id="barn-red-wood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="25%" stopColor="#C62828" />
          <stop offset="50%" stopColor="#E53935" />
          <stop offset="75%" stopColor="#B71C1C" />
          <stop offset="100%" stopColor="#8B0000" />
        </linearGradient>

        {/* 3D Cedar Shingle Roof */}
        <linearGradient id="cedar-roof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E65100" />
          <stop offset="40%" stopColor="#D84315" />
          <stop offset="75%" stopColor="#BF360C" />
          <stop offset="100%" stopColor="#872300" />
        </linearGradient>

        {/* Golden Straw Bedding */}
        <radialGradient id="golden-straw" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="35%" stopColor="#FFF176" />
          <stop offset="70%" stopColor="#FDD835" />
          <stop offset="100%" stopColor="#F57F17" />
        </radialGradient>

        {/* Rich Mud Gradients */}
        <radialGradient id="mud-pool-gradient" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="45%" stopColor="#4E342E" />
          <stop offset="80%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#271406" />
        </radialGradient>

        <radialGradient id="mud-shine" cx="40%" cy="30%" r="55%">
          <stop offset="0%" stopColor="rgba(215, 204, 200, 0.45)" />
          <stop offset="50%" stopColor="rgba(141, 110, 99, 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Wood Fence Rail Texture */}
        <linearGradient id="pen-wood-rail" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="30%" stopColor="#FFB74D" />
          <stop offset="75%" stopColor="#F57C00" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>

        {/* Galvanized Metal Trough */}
        <linearGradient id="metal-trough" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ECEFF1" />
          <stop offset="50%" stopColor="#CFD8DC" />
          <stop offset="80%" stopColor="#90A4AE" />
          <stop offset="100%" stopColor="#607D8B" />
        </linearGradient>

        {/* Water Texture */}
        <linearGradient id="water-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E1F5FE" />
          <stop offset="40%" stopColor="#4FC3F7" />
          <stop offset="100%" stopColor="#0288D1" />
        </linearGradient>
      </defs>

      {/* 1. Base Isometric Ground Footprint */}
      <polygon
        points="100,32 180,75 100,120 20,75"
        fill={`url(#ground-${animalType})`}
        stroke="#3E2723"
        strokeWidth="1.5"
      />

      {/* 3D Ground Bevel & Drop Shadow on the base */}
      <polygon points="20,75 100,120 100,123 20,78" fill="#2E1C16" opacity="0.6" />
      <polygon points="100,120 180,75 180,78 100,123" fill="#1C100B" opacity="0.8" />

      {/* 2. Specific Enclosure Features per Animal */}
      {animalType === 'chicken' && renderChickenEnvironment()}
      {animalType === 'cow' && renderCowEnvironment()}
      {animalType === 'pig' && renderPigEnvironment()}
      {animalType === 'sheep' && renderSheepEnvironment()}
    </g>
  );
});

/**
 * 3D Isometric Pen Foreground:
 * Renders the front wooden fence rails, 3D chamfered timber posts,
 * iron bolts, gate latch, and decorative grass tufts sitting in front of animals.
 */
export const IsoPenForeground: React.FC<IsoPenEnvProps> = React.memo(({ animalType: _animalType }) => {
  return (
    <g id="front-fence-fg">
      {/* Front-Left Fence Shadow */}
      <polygon points="20,77 100,122 100,124 20,79" fill="rgba(0,0,0,0.3)" />

      {/* Front-Left Fence Rails (Upper and Lower Timber Beams) */}
      <line x1="20" y1="74" x2="100" y2="119" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="20" y1="72" x2="100" y2="117" stroke="#FFE082" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <line x1="20" y1="64" x2="100" y2="109" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="20" y1="62" x2="100" y2="107" stroke="#FFE082" strokeWidth="1" strokeLinecap="round" opacity="0.75" />

      {/* Front-Right Fence Rails (Upper and Lower Timber Beams) */}
      <line x1="100" y1="119" x2="180" y2="74" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="100" y1="117" x2="180" y2="72" stroke="#FFE082" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <line x1="100" y1="109" x2="180" y2="64" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="100" y1="107" x2="180" y2="62" stroke="#FFE082" strokeWidth="1" strokeLinecap="round" opacity="0.75" />

      {/* Chunky 3D Front Posts with Chamfered Caps & Woodgrain */}
      {[
        { x: 56, y: 82, h: 36 },
        { x: 97, y: 104, h: 36 },
        { x: 140, y: 82, h: 36 },
      ].map((p, idx) => (
        <g key={`front_post_${idx}`}>
          {/* Cast Ground Contact Shadow */}
          <ellipse cx={p.x + 3.5} cy={p.y + p.h + 1} rx="5" ry="2.5" fill="rgba(0,0,0,0.35)" />
          {/* Main 3D Timber Post Body */}
          <rect x={p.x} y={p.y} width="7.5" height={p.h} rx="2" fill="url(#pen-wood-rail)" stroke="#8D6E63" strokeWidth="0.8" />
          {/* Post Highlight Edge */}
          <line x1={p.x + 1.2} y1={p.y + 1} x2={p.x + 1.2} y2={p.y + p.h - 1} stroke="#FFF8E1" strokeWidth="0.8" opacity="0.6" />
          {/* Post Shadow Edge */}
          <line x1={p.x + 6.3} y1={p.y + 1} x2={p.x + 6.3} y2={p.y + p.h - 1} stroke="#BF360C" strokeWidth="0.8" opacity="0.7" />
          {/* Chamfered Pyramidal Cap */}
          <ellipse cx={p.x + 3.7} cy={p.y + 1} rx="3.4" ry="2" fill="#FFE0B2" stroke="#FFB74D" strokeWidth="0.6" />
          {/* Steel Fastening Bolts */}
          <circle cx={p.x + 3.7} cy={p.y + 9} r="1" fill="#455A64" stroke="#263238" strokeWidth="0.4" />
          <circle cx={p.x + 3.7} cy={p.y + 19} r="1" fill="#455A64" stroke="#263238" strokeWidth="0.4" />
        </g>
      ))}

      {/* Hanging Golden Horseshoe on Center Post */}
      <path
        d="M 98.5 112 Q 100.5 110 102.5 112 Q 103 115 100.5 117 Q 98 115 98.5 112"
        fill="none"
        stroke="#FFD54F"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="100.5" cy="111" r="0.9" fill="#FF8F00" />

      {/* Decorative Wildflower & Grass Sprigs at Front Corners */}
      <g transform="translate(22, 75)">
        <path d="M 0 0 Q -2 -6 -5 -8 M 0 0 Q 0 -8 2 -10 M 0 0 Q 3 -5 6 -7" stroke="#7CB342" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="2" cy="-10" r="1.5" fill="#FFF59D" />
      </g>
      <g transform="translate(178, 75)">
        <path d="M 0 0 Q 2 -6 5 -8 M 0 0 Q 0 -8 -2 -10 M 0 0 Q -3 -5 -6 -7" stroke="#7CB342" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="-2" cy="-10" r="1.5" fill="#FFF59D" />
      </g>
    </g>
  );
});

// Legacy single component export (renders background then foreground)
export const IsoPenEnvironment: React.FC<IsoPenEnvProps> = React.memo(({ animalType }) => {
  return (
    <>
      <IsoPenBackground animalType={animalType} />
      <IsoPenForeground animalType={animalType} />
    </>
  );
});

// ==================== CHICKEN COOP 3D CARTOON SCENE ====================
function renderChickenEnvironment() {
  return (
    <g id="chicken-coop-env">
      {/* 1. Lush Green Grassy Edge Accents inside the Pen */}
      <path
        d="M 22 75 Q 40 50 100 34 Q 160 50 178 75"
        stroke="#689F38"
        strokeWidth="2.5"
        fill="none"
        opacity="0.85"
      />

      {/* 2. Cozy Golden Hay Bedding Cushion inside the Yard */}
      <ellipse cx="80" cy="70" rx="28" ry="14" fill="url(#golden-straw)" opacity="0.95" />
      <ellipse cx="120" cy="65" rx="26" ry="13" fill="url(#golden-straw)" opacity="0.92" />
      <ellipse cx="100" cy="80" rx="36" ry="16" fill="url(#golden-straw)" opacity="0.88" />

      {/* Tactile individual curved straw strands poking out of hay */}
      {[
        { d: 'M 62 66 Q 56 62 58 58', w: 1.2 },
        { d: 'M 74 80 Q 70 86 66 84', w: 1.4 },
        { d: 'M 136 62 Q 142 58 140 54', w: 1.2 },
        { d: 'M 124 82 Q 130 88 134 85', w: 1.4 },
        { d: 'M 95 90 Q 98 96 104 94', w: 1.4 },
      ].map((s, i) => (
        <path key={`straw_${i}`} d={s.d} stroke="#FFE082" strokeWidth={s.w} fill="none" strokeLinecap="round" />
      ))}

      {/* Scattered Golden Corn Kernels on the Ground */}
      {[
        { cx: 88, cy: 62 },
        { cx: 94, cy: 59 },
        { cx: 102, cy: 63 },
        { cx: 114, cy: 68 },
        { cx: 106, cy: 72 },
        { cx: 72, cy: 74 },
      ].map((k, idx) => (
        <ellipse key={`corn_${idx}`} cx={k.cx} cy={k.cy} rx="1.6" ry="1.2" fill="#FFD54F" stroke="#FF8F00" strokeWidth="0.5" />
      ))}

      {/* 3. 3D CHICKEN COOP HOUSE (Back-Left Area) */}
      <g id="coop-house">
        {/* Coop Ground Contact Shadow */}
        <polygon points="18,36 56,18 94,36 56,54" fill="rgba(0,0,0,0.38)" />

        {/* Foundation Timber Beam */}
        <polygon points="46,58 76,43 76,46 46,61" fill="#4E342E" stroke="#3E2723" strokeWidth="0.8" />
        <polygon points="26,48 46,58 46,61 26,51" fill="#3E2723" stroke="#271406" strokeWidth="0.8" />

        {/* Coop Left Wall (Barn-Red Planks) */}
        <polygon points="26,48 46,58 46,38 26,28" fill="url(#barn-red-wood)" stroke="#5D1010" strokeWidth="1" />
        {/* Left Wall Vertical Planks */}
        <line x1="33" y1="31" x2="33" y2="51" stroke="#8B0000" strokeWidth="0.8" />
        <line x1="40" y1="35" x2="40" y2="55" stroke="#8B0000" strokeWidth="0.8" />

        {/* Coop Front-Right Wall (Barn-Red Planks) */}
        <polygon points="46,58 76,43 76,23 46,38" fill="url(#barn-red-wood)" stroke="#5D1010" strokeWidth="1" />
        {/* Vertical Planks */}
        <line x1="56" y1="33" x2="56" y2="53" stroke="#8B0000" strokeWidth="0.8" />
        <line x1="66" y1="28" x2="66" y2="48" stroke="#8B0000" strokeWidth="0.8" />

        {/* Crisp White Corner Trim Boards */}
        <polygon points="45,38 47,37 47,59 45,58" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="0.5" />
        <polygon points="75,23 77,22 77,44 75,43" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="0.5" />
        <polygon points="25,28 27,27 27,49 25,48" fill="#CFD8DC" stroke="#90A4AE" strokeWidth="0.5" />

        {/* Cozy Dark Doorway Opening with Golden Straw Interior */}
        <polygon points="52,54 66,47 66,35 52,42" fill="#212121" stroke="#3E2723" strokeWidth="1" />
        <ellipse cx="59" cy="50" rx="6" ry="3" fill="url(#golden-straw)" />
        {/* Tiny Egg sitting in Coop doorway nesting box */}
        <ellipse cx="60" cy="49" rx="2" ry="2.8" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="0.5" />

        {/* Wooden Chicken Ramp with Anti-Slip Slats */}
        <polygon points="53,54 65,48 74,62 62,68" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
        <line x1="56" y1="56" x2="65" y2="51" stroke="#5D4037" strokeWidth="1.2" />
        <line x1="59" y1="60" x2="68" y2="55" stroke="#5D4037" strokeWidth="1.2" />
        <line x1="62" y1="64" x2="71" y2="59" stroke="#5D4037" strokeWidth="1.2" />

        {/* Round Gable Attic Window with Warm Lantern Glow */}
        <circle cx="36" cy="38" r="4.5" fill="#FFE082" stroke="#5D4037" strokeWidth="1" />
        <line x1="31.5" y1="38" x2="40.5" y2="38" stroke="#5D4037" strokeWidth="0.8" />
        <line x1="36" y1="33.5" x2="36" y2="42.5" stroke="#5D4037" strokeWidth="0.8" />

        {/* 3D Double Gable Cedar Shingle Roof */}
        {/* Left Roof Slant */}
        <polygon points="20,26 56,8 56,26 20,44" fill="url(#cedar-roof)" stroke="#872300" strokeWidth="1.2" />
        {/* Right Roof Slant */}
        <polygon points="56,8 92,26 56,44 20,26" fill="url(#cedar-roof)" stroke="#BF360C" strokeWidth="1.2" opacity="0.95" />
        {/* 3D Shingle Contour Lines */}
        <line x1="32" y1="20" x2="68" y2="38" stroke="#FFE082" strokeWidth="1" opacity="0.6" />
        <line x1="44" y1="14" x2="80" y2="32" stroke="#FFE082" strokeWidth="1" opacity="0.6" />

        {/* White Bargeboard Roof Trim */}
        <line x1="20" y1="44" x2="56" y2="26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="56" y1="26" x2="92" y2="44" stroke="#ECEFF1" strokeWidth="2" strokeLinecap="round" />

        {/* Weather Vane with Golden Rooster */}
        <line x1="56" y1="8" x2="56" y2="0" stroke="#FFD54F" strokeWidth="1.5" />
        <polygon points="56,-3 59,-1 53,-1" fill="#FFB300" />
        {/* Rooster Silhouette */}
        <circle cx="56" cy="-4" r="2.2" fill="#FFD54F" />
        <polygon points="56,-6 58,-4 54,-4" fill="#FF5722" />
        <path d="M 54 -4 Q 51 -6 52 -2" stroke="#FFB300" strokeWidth="1" fill="none" />
      </g>

      {/* 4. Galvanized Steel Poultry Feeder Trough (Back-Right) */}
      <g id="feeder-trough" transform="translate(132, 42)">
        {/* Feeder Ground Shadow */}
        <ellipse cx="8" cy="8" rx="14" ry="5" fill="rgba(0,0,0,0.3)" />
        {/* Metal Basin */}
        <polygon points="0,0 18,-9 22,-6 4,3" fill="url(#metal-trough)" stroke="#455A64" strokeWidth="1" />
        <polygon points="0,0 4,3 4,7 0,4" fill="#78909C" stroke="#455A64" strokeWidth="0.8" />
        <polygon points="4,3 22,-6 22,-2 4,7" fill="#546E7A" stroke="#37474F" strokeWidth="0.8" />
        {/* Golden Grain Feed filling trough */}
        <polygon points="2,1 18,-7 20,-5 4,3" fill="#FFD54F" />
        <circle cx="6" cy="1" r="0.8" fill="#FF8F00" />
        <circle cx="12" cy="-2" r="0.8" fill="#FF8F00" />
      </g>

      {/* 5. Classic Poultry Bell Waterer (Glass Jug with Blue Water) */}
      <g id="water-font" transform="translate(112, 44)">
        {/* Red Plastic Water Basin */}
        <ellipse cx="0" cy="5" rx="7" ry="3.5" fill="#E53935" stroke="#B71C1C" strokeWidth="0.8" />
        <ellipse cx="0" cy="4" rx="5.5" ry="2.6" fill="url(#water-blue)" />
        {/* Clear Glass Reservoir Jug */}
        <ellipse cx="0" cy="1" rx="4" ry="2" fill="#CFD8DC" opacity="0.7" />
        <path d="M -4 1 Q -4 -6 0 -7 Q 4 -6 4 1 Z" fill="url(#water-blue)" stroke="#90A4AE" strokeWidth="0.8" opacity="0.85" />
        {/* Specular Gleam on Glass */}
        <line x1="-2" y1="-5" x2="-2" y2="0" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* 6. Back Wooden Fence Rails and Posts */}
      <line x1="88" y1="20" x2="180" y2="66" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="88" y1="10" x2="180" y2="56" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="135" y="30" width="5.5" height="32" rx="1.5" fill="url(#pen-wood-rail)" stroke="#8D6E63" strokeWidth="0.8" />
      <ellipse cx="137.7" cy="31" rx="2.5" ry="1.5" fill="#FFE0B2" />
    </g>
  );
}

// ==================== COW PASTURE ====================
function renderCowEnvironment() {
  return (
    <g id="cow-pen-env">
      {/* Lush Meadow Bedding with Clover & Straw */}
      <ellipse cx="70" cy="72" rx="26" ry="12" fill="url(#golden-straw)" opacity="0.9" />
      <ellipse cx="132" cy="78" rx="28" ry="13" fill="url(#golden-straw)" opacity="0.9" />

      {/* Clover Tufts */}
      {[
        { cx: 50, cy: 68 },
        { cx: 145, cy: 72 },
        { cx: 102, cy: 82 },
      ].map((cl, i) => (
        <g key={`clover_${i}`} transform={`translate(${cl.cx}, ${cl.cy})`}>
          <circle cx="-2" cy="-2" r="2" fill="#8BC34A" />
          <circle cx="2" cy="-2" r="2" fill="#8BC34A" />
          <circle cx="0" cy="1" r="2" fill="#8BC34A" />
        </g>
      ))}

      {/* BACK SHELTER: Open Dairy Timber Barn */}
      <g id="cow-barn-shelter">
        <polygon points="20,18 54,4 96,20 62,38" fill="url(#barn-red-wood)" stroke="#5D1010" strokeWidth="1.2" />
        {/* Support Timber Pillars */}
        <rect x="24" y="16" width="6" height="42" rx="1.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
        <rect x="56" y="6" width="6" height="40" rx="1.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
        <rect x="86" y="18" width="6" height="42" rx="1.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
        {/* Roof Shading */}
        <line x1="28" y1="18" x2="62" y2="35" stroke="#FFE082" strokeWidth="1.5" opacity="0.7" />
        <line x1="40" y1="12" x2="74" y2="29" stroke="#FFE082" strokeWidth="1.5" opacity="0.7" />
      </g>

      {/* Cast Iron Water Pump & Half Barrel Basin */}
      <g id="water-pump" transform="translate(142, 38)">
        <ellipse cx="0" cy="10" rx="10" ry="5.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
        <ellipse cx="0" cy="8.5" rx="8" ry="4.2" fill="url(#water-blue)" />
        <rect x="-2" y="-2" width="4" height="10" fill="#37474F" stroke="#212121" strokeWidth="0.8" />
        <line x1="-5" y1="2" x2="-2" y2="2" stroke="#37474F" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Salt Lick Block on Tree Stump */}
      <g id="salt-lick" transform="translate(112, 46)">
        <ellipse cx="0" cy="5" rx="5" ry="2.5" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="-3" y="0" width="6" height="5" rx="1" fill="#FFCDD2" stroke="#E57373" strokeWidth="0.8" />
      </g>

      {/* Back Fence */}
      <line x1="90" y1="22" x2="180" y2="68" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="12" x2="180" y2="58" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}

// ==================== PIG PEN ====================
function renderPigEnvironment() {
  return (
    <g id="pig-pen-env">
      {/* Iconic Mud Bath Pool */}
      <path
        d="M 60 76 Q 80 62 110 65 Q 145 68 150 82 Q 155 98 125 102 Q 95 106 70 98 Q 50 90 60 76 Z"
        fill="url(#mud-pool-gradient)"
        stroke="#2E1C16"
        strokeWidth="1.5"
      />
      {/* Mud Shimmer */}
      <ellipse cx="105" cy="84" rx="35" ry="14" fill="url(#mud-shine)" />
      {/* Mud Ripple Circles */}
      <ellipse cx="110" cy="84" rx="14" ry="6" fill="none" stroke="#8D6E63" strokeWidth="1" opacity="0.6" className="animate-mud-ripple" />

      {/* BACK SHELTER: Weathered Wooden Pig Lean-To */}
      <g id="pig-shelter">
        <rect x="28" y="20" width="5" height="38" rx="1" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="58" y="8" width="5" height="38" rx="1" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="88" y="20" width="5" height="38" rx="1" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <polygon points="22,22 56,6 94,22 60,38" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.2" />
        <line x1="28" y1="20" x2="62" y2="36" stroke="#BCAAA4" strokeWidth="1.5" />
      </g>

      {/* Wooden Slop Trough with Apples & Cabbage */}
      <g id="slop-trough" transform="translate(122, 42)">
        <polygon points="0,0 28,-14 36,-10 8,4" fill="#6D4C41" stroke="#3E2723" strokeWidth="1.2" />
        <circle cx="12" cy="-4" r="2.5" fill="#E53935" />
        <circle cx="18" cy="-7" r="2.5" fill="#43A047" />
      </g>

      {/* Back Fence */}
      <line x1="90" y1="22" x2="180" y2="68" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="12" x2="180" y2="58" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}

// ==================== SHEEP PASTURE ====================
function renderSheepEnvironment() {
  return (
    <g id="sheep-pen-env">
      {/* Soft Grassy Field with Wild Daisies */}
      <ellipse cx="80" cy="74" rx="28" ry="13" fill="#9CCC65" opacity="0.6" />
      <ellipse cx="128" cy="78" rx="26" ry="12" fill="#9CCC65" opacity="0.6" />

      {/* White Daisies */}
      {[
        { cx: 58, cy: 70 },
        { cx: 96, cy: 64 },
        { cx: 144, cy: 74 },
        { cx: 110, cy: 84 },
      ].map((fl, i) => (
        <g key={`daisy_${i}`} transform={`translate(${fl.cx}, ${fl.cy})`}>
          <circle cx="0" cy="0" r="1.5" fill="#FFD54F" />
          <circle cx="-2" cy="0" r="1.2" fill="#FFFFFF" />
          <circle cx="2" cy="0" r="1.2" fill="#FFFFFF" />
          <circle cx="0" cy="-2" r="1.2" fill="#FFFFFF" />
          <circle cx="0" cy="2" r="1.2" fill="#FFFFFF" />
        </g>
      ))}

      {/* BACK SHELTER: Cozy Thatched Wool Shed */}
      <g id="sheep-shelter">
        <rect x="28" y="18" width="5.5" height="40" rx="1.5" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="58" y="6" width="5.5" height="38" rx="1.5" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="88" y="18" width="5.5" height="40" rx="1.5" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        {/* Thatched Straw Roof */}
        <polygon points="20,20 56,4 94,20 58,38" fill="url(#golden-straw)" stroke="#F57F17" strokeWidth="1.2" />
        {/* Straw Thatch Layers */}
        <line x1="26" y1="18" x2="62" y2="35" stroke="#FFE082" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="12" x2="74" y2="29" stroke="#FFE082" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Fresh Water Tub & Salt Lick */}
      <g id="water-tub" transform="translate(136, 42)">
        <ellipse cx="0" cy="6" rx="8" ry="4" fill="#78909C" stroke="#455A64" strokeWidth="0.8" />
        <ellipse cx="0" cy="5" rx="6.5" ry="3" fill="url(#water-blue)" />
      </g>

      {/* Back Fence */}
      <line x1="90" y1="22" x2="180" y2="68" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="12" x2="180" y2="58" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}
