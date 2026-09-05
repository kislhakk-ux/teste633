import React from 'react';
import { AnimalType } from '../../../types/game';

interface IsoPenEnvironmentProps {
  animalType: AnimalType;
}

export const IsoPenEnvironment: React.FC<IsoPenEnvironmentProps> = React.memo(({ animalType }) => {
  return (
    <g id={`pen-environment-${animalType}`}>
      <defs>
        {/* Gradients for rich textures */}
        {/* Chicken Ground (Warm golden earth + straw) */}
        <linearGradient id="ground-chicken" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C49A6C" />
          <stop offset="45%" stopColor="#A07248" />
          <stop offset="100%" stopColor="#7A4E2B" />
        </linearGradient>

        {/* Cow Ground (Lush pasture with beaten path) */}
        <linearGradient id="ground-cow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="50%" stopColor="#558B2F" />
          <stop offset="85%" stopColor="#8D6E63" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>

        {/* Pig Ground (Muddy earth & rich soil) */}
        <linearGradient id="ground-pig" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="40%" stopColor="#6D4C41" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Sheep Ground (Lush country pasture) */}
        <linearGradient id="ground-sheep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CCC65" />
          <stop offset="60%" stopColor="#689F38" />
          <stop offset="100%" stopColor="#33691E" />
        </linearGradient>

        {/* Liquid Glistening Mud Gradient */}
        <radialGradient id="mud-pool-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="60%" stopColor="#4E342E" />
          <stop offset="90%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#2E1C16" />
        </radialGradient>

        {/* Mud Wet Shine */}
        <linearGradient id="mud-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A1887F" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8D6E63" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4E342E" stopOpacity="0" />
        </linearGradient>

        {/* Rustic Timber Rails Gradient */}
        <linearGradient id="pen-wood-rail" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="25%" stopColor="#FFB74D" />
          <stop offset="65%" stopColor="#F57C00" />
          <stop offset="100%" stopColor="#BF360C" />
        </linearGradient>

        {/* Rustic Cedar Wood Shingles */}
        <linearGradient id="shingle-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF5350" />
          <stop offset="40%" stopColor="#D32F2F" />
          <stop offset="85%" stopColor="#B71C1C" />
          <stop offset="100%" stopColor="#7F0000" />
        </linearGradient>

        {/* Corrugated Farm Metal Roof */}
        <linearGradient id="corrugated-roof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="35%" stopColor="#43A047" />
          <stop offset="75%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>

        {/* Golden Hay / Straw */}
        <linearGradient id="golden-straw" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="45%" stopColor="#FDD835" />
          <stop offset="80%" stopColor="#F57F17" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>

        {/* Water Gradient */}
        <linearGradient id="water-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B3E5FC" />
          <stop offset="50%" stopColor="#29B6F6" />
          <stop offset="100%" stopColor="#0288D1" />
        </linearGradient>
      </defs>

      {/* 1. Base Isometric Ground Footprint */}
      <polygon
        points="100,32 180,75 100,120 20,75"
        fill={`url(#ground-${animalType})`}
        stroke="#4E342E"
        strokeWidth="1.2"
      />

      {/* 2. Specific Enclosure Features per Animal */}
      {animalType === 'chicken' && renderChickenEnvironment()}
      {animalType === 'cow' && renderCowEnvironment()}
      {animalType === 'pig' && renderPigEnvironment()}
      {animalType === 'sheep' && renderSheepEnvironment()}

      {/* 3. Front Wooden Fence with Chamfered Posts (Universal Hay Day charm) */}
      <g id="front-fence">
        {/* Front-Left Fence Rails */}
        <line x1="20" y1="75" x2="100" y2="120" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="20" y1="65" x2="100" y2="110" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Front-Right Fence Rails */}
        <line x1="100" y1="120" x2="180" y2="75" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="100" y1="110" x2="180" y2="65" stroke="url(#pen-wood-rail)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Chunky Front Posts with Chamfered Caps */}
        {[
          { x: 56, y: 82, h: 36 },
          { x: 97, y: 104, h: 36 },
          { x: 140, y: 82, h: 36 },
        ].map((p, idx) => (
          <g key={`front_post_${idx}`}>
            <ellipse cx={p.x + 3.5} cy={p.y + p.h} rx="4" ry="2" fill="rgba(0,0,0,0.3)" />
            <rect x={p.x} y={p.y} width="7" height={p.h} rx="2" fill="url(#pen-wood-rail)" stroke="#BF360C" strokeWidth="1" />
            <ellipse cx={p.x + 3.5} cy={p.y + 1} rx="3" ry="1.8" fill="#FFE0B2" />
          </g>
        ))}

        {/* Golden Horseshoe & Gate Latch on Center Post */}
        <circle cx="100.5" cy="116" r="3.2" fill="#FFD54F" stroke="#E65100" strokeWidth="1" />
        <circle cx="99.5" cy="115" r="1" fill="#FFFFFF" />
      </g>
    </g>
  );
});

// ==================== CHICKEN COOP ====================
function renderChickenEnvironment() {
  return (
    <g id="chicken-coop-env">
      {/* Straw patches on ground */}
      <ellipse cx="65" cy="74" rx="22" ry="10" fill="url(#golden-straw)" opacity="0.95" />
      <ellipse cx="125" cy="84" rx="26" ry="12" fill="url(#golden-straw)" opacity="0.95" />
      <ellipse cx="100" cy="70" rx="16" ry="8" fill="url(#golden-straw)" opacity="0.85" />

      {/* Scattered corn kernels */}
      {[
        { cx: 80, cy: 92 },
        { cx: 85, cy: 88 },
        { cx: 92, cy: 96 },
        { cx: 110, cy: 95 },
        { cx: 120, cy: 102 },
        { cx: 135, cy: 94 },
      ].map((k, i) => (
        <circle key={`corn_${i}`} cx={k.cx} cy={k.cy} r="1.4" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.5" />
      ))}

      {/* BACK SHELTER: Red Cedar Chicken Coop House */}
      <g id="chicken-coop-house">
        {/* Wooden coop posts */}
        <rect x="28" y="24" width="5" height="38" rx="1" fill="#5D4037" stroke="#3E2723" strokeWidth="0.8" />
        <rect x="58" y="10" width="5" height="36" rx="1" fill="#5D4037" stroke="#3E2723" strokeWidth="0.8" />
        <rect x="88" y="22" width="5" height="38" rx="1" fill="#5D4037" stroke="#3E2723" strokeWidth="0.8" />

        {/* Coop Red Barnwood Walls */}
        <polygon points="46,36 76,20 76,46 46,62" fill="url(#shingle-red)" stroke="#B71C1C" strokeWidth="1.2" />
        <line x1="46" y1="42" x2="76" y2="26" stroke="#EF5350" strokeWidth="1" opacity="0.7" />
        <line x1="46" y1="52" x2="76" y2="36" stroke="#EF5350" strokeWidth="1" opacity="0.7" />

        {/* Round attic window */}
        <circle cx="61" cy="33" r="4.5" fill="#FFE082" stroke="#5D4037" strokeWidth="1" />
        <line x1="56.5" y1="33" x2="65.5" y2="33" stroke="#5D4037" strokeWidth="0.8" />
        <line x1="61" y1="28.5" x2="61" y2="37.5" stroke="#5D4037" strokeWidth="0.8" />

        {/* Red Gable Roof */}
        <polygon points="22,24 56,6 94,22 58,40" fill="url(#shingle-red)" stroke="#7F0000" strokeWidth="1.2" />
        <line x1="26" y1="22" x2="60" y2="38" stroke="#FFCDD2" strokeWidth="1.5" opacity="0.8" />
        <line x1="40" y1="15" x2="74" y2="31" stroke="#FFCDD2" strokeWidth="1.5" opacity="0.8" />

        {/* Golden Rooster Weather Vane on Peak */}
        <g id="weathervane" transform="translate(56, 6)">
          <line x1="0" y1="0" x2="0" y2="-7" stroke="#FFD54F" strokeWidth="1.2" />
          <polygon points="-2,-7 3,-7 2,-9 0,-10 -2,-7" fill="#FFC107" stroke="#FFA000" strokeWidth="0.6" />
          <circle cx="2.5" cy="-8.5" r="0.8" fill="#D32F2F" />
        </g>

        {/* Chicken Ramp leading down to yard */}
        <polygon points="76,46 90,54 85,58 71,50" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
        {/* Ramp Step Slats */}
        <line x1="74" y1="47" x2="77" y2="49" stroke="#D7CCC8" strokeWidth="1.2" />
        <line x1="78" y1="49" x2="81" y2="51" stroke="#D7CCC8" strokeWidth="1.2" />
        <line x1="82" y1="52" x2="85" y2="54" stroke="#D7CCC8" strokeWidth="1.2" />
      </g>

      {/* Poultry Water Drinker Bell in Corner */}
      <g id="waterer" transform="translate(150, 44)">
        <ellipse cx="0" cy="5" rx="7" ry="3.5" fill="#B0BEC5" stroke="#78909C" strokeWidth="0.8" />
        <ellipse cx="0" cy="4" rx="5.5" ry="2.5" fill="url(#water-blue)" />
        <path d="M -4 4 Q 0 -6 4 4" fill="#CFD8DC" stroke="#78909C" strokeWidth="0.8" />
      </g>

      {/* Galvanized Feed Tray */}
      <polygon points="120,44 148,30 156,34 128,48" fill="#FFA726" stroke="#E65100" strokeWidth="1.2" />
      <polygon points="123,43 146,32 151,35 128,46" fill="#FFEE58" />
      <circle cx="138" cy="38" r="1.2" fill="#E65100" />
      <circle cx="143" cy="36" r="1.2" fill="#E65100" />

      {/* Back Fence Rails */}
      <line x1="90" y1="22" x2="180" y2="68" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="12" x2="180" y2="58" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}

// ==================== COW PASTURE ====================
function renderCowEnvironment() {
  return (
    <g id="cow-pasture-env">
      {/* Clover and Daisy Wildflower Patches */}
      {[
        { cx: 40, cy: 68 },
        { cx: 88, cy: 92 },
        { cx: 155, cy: 75 },
        { cx: 122, cy: 98 },
      ].map((f, i) => (
        <g key={`clover_${i}`} transform={`translate(${f.cx}, ${f.cy})`}>
          <circle cx="-3" cy="-1" r="2.2" fill="#8BC34A" />
          <circle cx="2" cy="-1" r="2.2" fill="#8BC34A" />
          <circle cx="0" cy="2" r="2.2" fill="#8BC34A" />
          <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
        </g>
      ))}

      {/* Soft straw bedding where cows sleep */}
      <ellipse cx="68" cy="74" rx="24" ry="11" fill="url(#golden-straw)" opacity="0.88" />
      <ellipse cx="132" cy="80" rx="26" ry="12" fill="url(#golden-straw)" opacity="0.88" />

      {/* BACK SHELTER: Open Timber Barn Shelter */}
      <g id="cow-barn-shelter">
        {/* Heavy Upright Timber Posts */}
        <rect x="26" y="16" width="6" height="42" rx="1.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
        <rect x="56" y="6" width="6" height="40" rx="1.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
        <rect x="86" y="18" width="6" height="42" rx="1.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />

        {/* Green Corrugated Metal Shed Roof */}
        <polygon points="20,20 54,4 96,20 62,38" fill="url(#corrugated-roof)" stroke="#1B5E20" strokeWidth="1.2" />
        <line x1="24" y1="18" x2="58" y2="35" stroke="#A5D6A7" strokeWidth="1.6" opacity="0.9" />
        <line x1="36" y1="12" x2="70" y2="29" stroke="#A5D6A7" strokeWidth="1.6" opacity="0.9" />
        <line x1="48" y1="7" x2="82" y2="24" stroke="#A5D6A7" strokeWidth="1.6" opacity="0.9" />

        {/* Hay Rack / Manger inside shelter */}
        <polygon points="36,44 72,26 76,32 40,50" fill="#8D6E63" stroke="#4E342E" strokeWidth="1" />
        <polygon points="38,43 70,27 73,30 41,46" fill="url(#golden-straw)" />
      </g>

      {/* Cast Iron Water Pump & Half Barrel Basin */}
      <g id="water-pump" transform="translate(142, 38)">
        {/* Wooden Water Barrel */}
        <ellipse cx="0" cy="10" rx="9" ry="5" fill="#6D4C41" stroke="#3E2723" strokeWidth="1" />
        <ellipse cx="0" cy="8.5" rx="7.5" ry="4" fill="url(#water-blue)" />
        {/* Water Ripple */}
        <ellipse cx="0" cy="8.5" rx="4" ry="2" fill="none" stroke="#E1F5FE" strokeWidth="0.8" opacity="0.7" />
        {/* Iron Pump */}
        <rect x="-2" y="-2" width="4" height="10" fill="#37474F" stroke="#212121" strokeWidth="0.8" />
        <line x1="-5" y1="2" x2="-2" y2="2" stroke="#37474F" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Salt Lick Block on Tree Stump */}
      <g id="salt-lick" transform="translate(112, 46)">
        <ellipse cx="0" cy="5" rx="5" ry="2.5" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="-3" y="0" width="6" height="5" rx="1" fill="#FFCDD2" stroke="#E57373" strokeWidth="0.8" />
      </g>

      {/* Back Fence Rails */}
      <line x1="90" y1="22" x2="180" y2="68" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="12" x2="180" y2="58" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}

// ==================== PIG PEN ====================
function renderPigEnvironment() {
  return (
    <g id="pig-pen-env">
      {/* 1. Iconic Hay Day Mud Bath Pool */}
      <path
        d="M 60 76 Q 80 62 110 65 Q 145 68 150 82 Q 155 98 125 102 Q 95 106 70 98 Q 50 90 60 76 Z"
        fill="url(#mud-pool-gradient)"
        stroke="#2E1C16"
        strokeWidth="1.5"
      />
      {/* Mud Shimmer & Waves */}
      <ellipse cx="105" cy="84" rx="35" ry="14" fill="url(#mud-shine)" />
      {/* Mud Ripple Circles */}
      <ellipse cx="110" cy="84" rx="14" ry="6" fill="none" stroke="#8D6E63" strokeWidth="1" opacity="0.6" className="animate-mud-ripple" />
      <ellipse cx="85" cy="82" rx="8" ry="3.5" fill="none" stroke="#8D6E63" strokeWidth="0.8" opacity="0.5" />

      {/* Mud Footprints on Ground */}
      {[
        { cx: 48, cy: 74 },
        { cx: 58, cy: 82 },
        { cx: 142, cy: 96 },
        { cx: 154, cy: 88 },
      ].map((p, i) => (
        <ellipse key={`trotter_${i}`} cx={p.cx} cy={p.cy} rx="2.5" ry="1.8" fill="#3E2723" opacity="0.75" />
      ))}

      {/* BACK SHELTER: Weathered Wooden Pig Shelter */}
      <g id="pig-shelter">
        {/* Birch/Oak Posts */}
        <rect x="28" y="20" width="5" height="38" rx="1" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="58" y="8" width="5" height="38" rx="1" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="88" y="20" width="5" height="38" rx="1" fill="#795548" stroke="#4E342E" strokeWidth="0.8" />

        {/* Weathered Timber Lean-To Roof */}
        <polygon points="22,22 56,6 94,22 60,38" fill="#8D6E63" stroke="#4E342E" strokeWidth="1.2" />
        <line x1="28" y1="20" x2="62" y2="36" stroke="#BCAAA4" strokeWidth="1.5" />
        <line x1="42" y1="13" x2="76" y2="29" stroke="#BCAAA4" strokeWidth="1.5" />

        {/* Lucky Rusty Horseshoe on Shelter */}
        <path
          d="M 58 24 Q 60 21 62 24 Q 62 27 60 28 Q 58 27 58 24"
          fill="none"
          stroke="#D7CCC8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Big Wooden Slop Trough */}
      <g id="slop-trough" transform="translate(122, 42)">
        <polygon points="0,0 28,-14 36,-10 8,4" fill="#6D4C41" stroke="#3E2723" strokeWidth="1.2" />
        <polygon points="0,0 8,4 8,9 0,5" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
        <polygon points="8,4 36,-10 36,-5 8,9" fill="#4E342E" stroke="#3E2723" strokeWidth="1" />
        {/* Slop & Veggies in Trough */}
        <polygon points="3,-1 26,-13 32,-10 8,3" fill="#A1887F" />
        {/* Corn ears & Apple cores */}
        <circle cx="12" cy="1" r="2.2" fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.6" />
        <circle cx="18" cy="-3" r="2" fill="#E53935" stroke="#B71C1C" strokeWidth="0.6" />
        <circle cx="24" cy="-8" r="1.8" fill="#FF9800" />
      </g>

      {/* Mud Splatters on Back Fence Rails */}
      <line x1="90" y1="22" x2="180" y2="68" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="12" x2="180" y2="58" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="115" cy="34" r="2" fill="#3E2723" opacity="0.6" />
      <circle cx="135" cy="45" r="2.5" fill="#3E2723" opacity="0.6" />
    </g>
  );
}

// ==================== SHEEP PASTURE ====================
function renderSheepEnvironment() {
  return (
    <g id="sheep-pasture-env">
      {/* Buttercups, Meadow Daisies & Clover Blossoms */}
      {[
        { cx: 38, cy: 72, col: '#FFEE58' },
        { cx: 52, cy: 82, col: '#FFFFFF' },
        { cx: 90, cy: 96, col: '#FFEE58' },
        { cx: 125, cy: 98, col: '#FFFFFF' },
        { cx: 160, cy: 78, col: '#F48FB1' },
      ].map((flower, i) => (
        <g key={`flower_${i}`} transform={`translate(${flower.cx}, ${flower.cy})`}>
          <circle cx="0" cy="0" r="2.2" fill={flower.col} stroke="#F57F17" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="0.8" fill="#FF8F00" />
        </g>
      ))}

      {/* Soft hay / wool bedding patch */}
      <ellipse cx="68" cy="74" rx="22" ry="10" fill="url(#golden-straw)" opacity="0.85" />
      <ellipse cx="132" cy="80" rx="24" ry="11" fill="url(#golden-straw)" opacity="0.85" />

      {/* BACK SHELTER: Open Cedar Country Shelter */}
      <g id="sheep-shelter">
        <rect x="28" y="18" width="5.5" height="40" rx="1.5" fill="#8D6E63" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="58" y="6" width="5.5" height="40" rx="1.5" fill="#8D6E63" stroke="#4E342E" strokeWidth="0.8" />
        <rect x="88" y="18" width="5.5" height="40" rx="1.5" fill="#8D6E63" stroke="#4E342E" strokeWidth="0.8" />

        {/* Slanted Shingle Roof */}
        <polygon points="22,22 56,6 94,22 60,38" fill="url(#shingle-red)" stroke="#7F0000" strokeWidth="1.2" />
        <line x1="28" y1="20" x2="62" y2="36" stroke="#FFCDD2" strokeWidth="1.5" opacity="0.8" />
        <line x1="42" y1="13" x2="76" y2="29" stroke="#FFCDD2" strokeWidth="1.5" opacity="0.8" />
      </g>

      {/* Slotted Timber Hay Feeder Rack */}
      <g id="hay-rack" transform="translate(118, 42)">
        <polygon points="0,0 26,-13 32,-10 6,3" fill="#A1887F" stroke="#5D4037" strokeWidth="1" />
        {/* Hay sticking out */}
        <path d="M 4 -1 L 6 -6 L 10 -2 L 14 -8 L 18 -3 L 22 -7 L 26 -2" stroke="#FFEB3B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Shearing Station: Polished Oak Barrel & Shears */}
      <g id="shearing-station" transform="translate(150, 48)">
        {/* Oak Barrel */}
        <ellipse cx="0" cy="6" rx="6" ry="3.5" fill="#6D4C41" stroke="#3E2723" strokeWidth="0.8" />
        <rect x="-6" y="-3" width="12" height="9" fill="#8D6E63" stroke="#3E2723" strokeWidth="0.8" />
        <ellipse cx="0" cy="-3" rx="6" ry="3" fill="#A1887F" stroke="#3E2723" strokeWidth="0.8" />
        {/* Golden / Silver Shears on Barrel */}
        <line x1="-3" y1="-3" x2="3" y2="-1" stroke="#CFD8DC" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="-3" cy="-3" r="1.2" fill="#FFA000" />
        {/* Soft Puffy Wool Ball on Barrel */}
        <circle cx="1" cy="-5" r="2.8" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="0.6" />
      </g>

      {/* Back Fence Rails */}
      <line x1="90" y1="22" x2="180" y2="68" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="90" y1="12" x2="180" y2="58" stroke="url(#pen-wood-rail)" strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
}
