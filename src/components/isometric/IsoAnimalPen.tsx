import React from 'react';
import { AnimalType } from '../../types/game';
import { ANIMAL_PENS, ITEMS } from '../../constants/gameData';

interface IsoAnimalPenProps {
  animalType: AnimalType;
  animals: { id: string; fedAt: number | null }[];
  currentTime: number;
  onCollectAnimal: (idx: number) => void;
}

const IsoAnimalPenComponent: React.FC<IsoAnimalPenProps> = ({
  animalType,
  animals,
  currentTime,
  onCollectAnimal,
}) => {
  const penDef = ANIMAL_PENS[animalType];

  return (
    <div className="relative w-48 h-40 flex items-center justify-center filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.35)]">
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Hay Day Mud / Straw Ground */}
          <linearGradient id="hd-pen-ground" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A1887F" />
            <stop offset="40%" stopColor="#795548" />
            <stop offset="100%" stopColor="#4E342E" />
          </linearGradient>

          {/* Hay Day Fence Rails (Rich Warm Wood) */}
          <linearGradient id="hd-pen-wood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE0B2" />
            <stop offset="35%" stopColor="#FFA726" />
            <stop offset="70%" stopColor="#FB8C00" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>

          {/* Green Stall Roof & Door */}
          <linearGradient id="hd-pen-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="40%" stopColor="#4CAF50" />
            <stop offset="80%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>

          {/* Golden Straw Bedding */}
          <linearGradient id="hd-pen-straw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="50%" stopColor="#FFEB3B" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="100" cy="132" rx="84" ry="26" fill="rgba(0,0,0,0.3)" />

        {/* Base Raised Border */}
        <polygon points="100,120 20,75 20,84 100,128" fill="#3E2723" />
        <polygon points="100,120 180,75 180,84 100,128" fill="#271610" />

        {/* Main Enclosure Mud & Straw Diamond Surface */}
        <polygon
          points="100,32 180,75 100,120 20,75"
          fill="url(#hd-pen-ground)"
          stroke="#3E2723"
          strokeWidth="2"
        />

        {/* Golden Straw Bedding Patches */}
        <ellipse cx="70" cy="74" rx="26" ry="12" fill="url(#hd-pen-straw)" opacity="0.95" />
        <ellipse cx="130" cy="82" rx="28" ry="13" fill="url(#hd-pen-straw)" opacity="0.95" />

        {/* Straw Specular Blades */}
        <path d="M 55 72 Q 70 68 85 74" stroke="#FFFDE7" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 115 80 Q 130 76 145 82" stroke="#FFFDE7" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* 1. Back Shelter / Wooden Lean-To Shed with Green Tin Roof */}
        <g id="pen-shelter">
          {/* Wooden Corner Upright Posts */}
          <rect x="28" y="24" width="5" height="38" rx="1.5" fill="#5D4037" stroke="#271610" strokeWidth="0.8" />
          <rect x="58" y="10" width="5" height="36" rx="1.5" fill="#5D4037" stroke="#271610" strokeWidth="0.8" />
          <rect x="88" y="22" width="5" height="38" rx="1.5" fill="#5D4037" stroke="#271610" strokeWidth="0.8" />

          {/* Green Stall Door at Back */}
          <polygon points="46,36 72,22 72,48 46,62" fill="url(#hd-pen-green)" stroke="#1B5E20" strokeWidth="1.2" />
          {/* Door 'Z' Bracing */}
          <line x1="46" y1="38" x2="72" y2="46" stroke="#2E7D32" strokeWidth="2" />
          <line x1="46" y1="60" x2="72" y2="24" stroke="#2E7D32" strokeWidth="2" />

          {/* Lucky Iron Horseshoe Mounted on Stall Door */}
          <path
            d="M 57 32 Q 59 28 62 32 Q 62 35 59 36 Q 56 35 57 32"
            fill="none"
            stroke="#CFD8DC"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Slanted Green Corrugated Shed Roof */}
          <polygon points="22,24 56,6 94,22 58,40" fill="url(#hd-pen-green)" stroke="#1B5E20" strokeWidth="1.2" />
          {/* Roof Ridge Highlights */}
          <line x1="26" y1="22" x2="60" y2="38" stroke="#A5D6A7" strokeWidth="1.5" />
          <line x1="36" y1="16" x2="70" y2="32" stroke="#A5D6A7" strokeWidth="1.5" />
          <line x1="46" y1="11" x2="80" y2="27" stroke="#A5D6A7" strokeWidth="1.5" />

          {/* Straw Overhang on Roof Edge */}
          <path d="M 22 24 Q 38 28 58 40 Q 76 31 94 22" stroke="#FFD54F" strokeWidth="2" fill="none" strokeDasharray="3 2" />
        </g>

        {/* 2. Chunky Wooden Feeding Trough */}
        <polygon points="120,44 148,30 158,36 130,50" fill="#FFA726" stroke="#E65100" strokeWidth="1.2" />
        <polygon points="120,44 130,50 130,56 120,50" fill="#FB8C00" stroke="#E65100" strokeWidth="1" />
        <polygon points="130,50 158,36 158,42 130,56" fill="#E65100" stroke="#BF360C" strokeWidth="1" />
        {/* Golden Feed Grain in Trough */}
        <polygon points="124,44 146,33 152,37 130,48" fill="#FFEE58" />
        <circle cx="138" cy="41" r="1.5" fill="#F57F17" />
        <circle cx="142" cy="39" r="1.5" fill="#F57F17" />

        {/* 3. Back Fence Rails & Chamfered Posts */}
        <line x1="90" y1="22" x2="180" y2="68" stroke="url(#hd-pen-wood)" strokeWidth="5" strokeLinecap="round" />
        <line x1="90" y1="12" x2="180" y2="58" stroke="url(#hd-pen-wood)" strokeWidth="5" strokeLinecap="round" />

        {[
          { x: 120, y: 35, h: 28 },
          { x: 150, y: 50, h: 28 },
          { x: 178, y: 65, h: 28 },
        ].map((p, idx) => (
          <g key={`b_post_${idx}`}>
            <rect x={p.x} y={p.y} width="5.5" height={p.h} rx="2" fill="url(#hd-pen-wood)" stroke="#BF360C" strokeWidth="1" />
            <ellipse cx={p.x + 2.75} cy={p.y + 1} rx="2.5" ry="1.5" fill="#FFE0B2" />
          </g>
        ))}

        {/* 4. Livestock Animals */}
        {animals.map((animal, idx) => {
          const isFed = animal.fedAt !== null;
          const elapsed = animal.fedAt ? (currentTime - animal.fedAt) / 1000 : 0;
          const isReady = isFed && elapsed >= (penDef?.produceTimeSeconds || 30);

          const positions = [
            { x: 68, y: 76 },
            { x: 108, y: 64 },
            { x: 144, y: 80 },
          ];
          const pos = positions[idx % positions.length];

          return (
            <g
              key={animal.id}
              className={`cursor-pointer ${isReady ? 'animate-bounce' : ''}`}
            >
              {render3DCartoonAnimal(animalType, pos.x, pos.y, isFed, isReady)}
            </g>
          );
        })}

        {/* 5. Front Fence Chunky Rails & Posts */}
        <line x1="20" y1="75" x2="100" y2="120" stroke="url(#hd-pen-wood)" strokeWidth="6" strokeLinecap="round" />
        <line x1="20" y1="65" x2="100" y2="110" stroke="url(#hd-pen-wood)" strokeWidth="6" strokeLinecap="round" />
        <line x1="100" y1="120" x2="180" y2="75" stroke="url(#hd-pen-wood)" strokeWidth="6" strokeLinecap="round" />
        <line x1="100" y1="110" x2="180" y2="65" stroke="url(#hd-pen-wood)" strokeWidth="6" strokeLinecap="round" />

        {[
          { x: 55, y: 82, h: 35 },
          { x: 96, y: 104, h: 35 },
          { x: 138, y: 82, h: 35 },
        ].map((p, idx) => (
          <g key={`f_post_${idx}`}>
            <ellipse cx={p.x + 4} cy={p.y + p.h} rx="4.5" ry="2.2" fill="rgba(0,0,0,0.35)" />
            <rect x={p.x} y={p.y} width="8" height={p.h} rx="3" fill="url(#hd-pen-wood)" stroke="#BF360C" strokeWidth="1.2" />
            <ellipse cx={p.x + 4} cy={p.y + 1} rx="3.5" ry="2" fill="#FFE0B2" />
          </g>
        ))}

        {/* Golden Gate Horseshoe/Latch on Center Post */}
        <circle cx="100" cy="116" r="3.5" fill="#FFD54F" stroke="#E65100" strokeWidth="1.2" />
        <circle cx="99" cy="115" r="1.2" fill="#FFFFFF" />
      </svg>

      {/* Interactive Animal Status Overlay */}
      <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-auto">
        {animals.map((animal, idx) => {
          const isFed = animal.fedAt !== null;
          const elapsed = animal.fedAt ? (currentTime - animal.fedAt) / 1000 : 0;
          const isReady = isFed && elapsed >= (penDef?.produceTimeSeconds || 30);

          return (
            <div
              key={animal.id}
              onClick={(e) => {
                if (isReady) {
                  e.stopPropagation();
                  onCollectAnimal(idx);
                }
              }}
              className="flex flex-col items-center cursor-pointer mt-6"
            >
              {isReady && (
                <button
                  className="bg-gradient-to-b from-green-400 to-green-600 hover:brightness-110 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-[0_4px_10px_rgba(34,197,94,0.6)] border-2 border-white flex items-center gap-1 animate-bounce active:scale-95 transition-transform"
                  title="Coletar Produto!"
                >
                  <span>{ITEMS[penDef.produceId]?.icon}</span>
                  <span>Coletar!</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const IsoAnimalPen = React.memo(IsoAnimalPenComponent, (prev, next) => {
  if (prev.animalType !== next.animalType || prev.animals.length !== next.animals.length) {
    return false;
  }
  const produceTime = ANIMAL_PENS[prev.animalType]?.produceTimeSeconds || 30;
  for (let i = 0; i < prev.animals.length; i++) {
    const a1 = prev.animals[i];
    const a2 = next.animals[i];
    if (a1.fedAt !== a2.fedAt) return false;
    if (a1.fedAt) {
      const ready1 = (prev.currentTime - a1.fedAt) / 1000 >= produceTime;
      const ready2 = (next.currentTime - a2.fedAt) / 1000 >= produceTime;
      if (ready1 !== ready2) return false;
    }
  }
  return true;
});

// 3D Cartoon Characters Rendering (Hay Day Stylized)
function render3DCartoonAnimal(
  type: AnimalType,
  x: number,
  y: number,
  isFed: boolean,
  isReady: boolean
) {
  switch (type) {
    case 'chicken':
      return (
        <g>
          {/* Ground Shadow */}
          <ellipse cx={x} cy={y + 8} rx="12" ry="6" fill="rgba(0,0,0,0.3)" />

          {/* Straw Nest when Ready with 3D Eggs */}
          {isReady && (
            <g>
              <ellipse cx={x} cy={y + 9} rx="14" ry="7" fill="#FDD835" stroke="#F57F17" strokeWidth="1" />
              <ellipse cx={x - 4} cy={y + 6} rx="3.5" ry="4.5" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.8" />
              <ellipse cx={x - 5} cy={y + 5} rx="1" ry="1.5" fill="#FFFFFF" />
              <ellipse cx={x + 4} cy={y + 6} rx="3.5" ry="4.5" fill="#FFE0B2" stroke="#D7CCC8" strokeWidth="0.8" />
              <ellipse cx={x + 3} cy={y + 5} rx="1" ry="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* 3D Round Plump Chicken Body */}
          <circle cx={x} cy={y} r="10.5" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="1.2" />
          <ellipse cx={x - 3} cy={y - 3} rx="4" ry="2.5" fill="#FFFFFF" opacity="0.8" />

          {/* Chunky Fluffy Wing */}
          <ellipse cx={x - 2} cy={y + 1} rx="6" ry="4.5" fill="#FFF176" stroke="#FBC02D" strokeWidth="1" transform={`rotate(-15 ${x - 2} ${y + 1})`} />
          <path d={`M ${x - 5} ${y} Q ${x - 2} ${y + 3} ${x + 1} ${y + 1}`} stroke="#FBC02D" strokeWidth="0.8" fill="none" />

          {/* Chicken Head */}
          <circle cx={x + 7} cy={y - 6} r="6" fill="#FFF9C4" stroke="#FBC02D" strokeWidth="1.2" />
          <ellipse cx={x + 6} cy={y - 8} rx="2" ry="1" fill="#FFFFFF" />

          {/* Big Glossy Cartoon Eye */}
          <circle cx={x + 8.5} cy={y - 7} r="2.2" fill="#FFFFFF" stroke="#212121" strokeWidth="0.6" />
          <circle cx={x + 9} cy={y - 7} r="1.4" fill="#212121" />
          <circle cx={x + 8.5} cy={y - 7.6} r="0.6" fill="#FFFFFF" />

          {/* Red 3D Comb on Top */}
          <circle cx={x + 5} cy={y - 12} r="2.2" fill="#E53935" stroke="#C62828" strokeWidth="0.6" />
          <circle cx={x + 8} cy={y - 13} r="2.5" fill="#EF5350" stroke="#C62828" strokeWidth="0.6" />
          <circle cx={x + 10.5} cy={y - 11.5} r="2" fill="#E53935" stroke="#C62828" strokeWidth="0.6" />

          {/* Red Wattle under Beak */}
          <circle cx={x + 9.5} cy={y - 1.5} r="2" fill="#E53935" stroke="#C62828" strokeWidth="0.6" />

          {/* Big Chunky Orange Beak */}
          <polygon points={`${x + 11},${y - 6} ${x + 16},${y - 4} ${x + 11},${y - 2}`} fill="#FF9800" stroke="#E65100" strokeWidth="0.8" />
          <line x1={x + 11} y1={y - 4} x2={x + 15} y2={y - 4} stroke="#E65100" strokeWidth="0.6" />

          {/* Little Yellow Legs */}
          <line x1={x - 2} y1={y + 8} x2={x - 2} y2={y + 12} stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
          <line x1={x + 3} y1={y + 8} x2={x + 3} y2={y + 12} stroke="#FF9800" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'cow':
      return (
        <g>
          {/* Ground Shadow */}
          <ellipse cx={x + 4} cy={y + 12} rx="22" ry="8" fill="rgba(0,0,0,0.3)" />

          {/* 3D Chubby Holstein Cow Body */}
          <ellipse cx={x} cy={y} rx="18" ry="14" fill="#FFFFFF" stroke="#37474F" strokeWidth="1.5" />
          <ellipse cx={x - 4} cy={y - 5} rx="8" ry="4" fill="#ECEFF1" opacity="0.6" />

          {/* Large Black Spots */}
          <path d={`M ${x - 10} ${y - 6} Q ${x - 4} ${y - 14} ${x + 2} ${y - 8} Q ${x - 2} ${y + 2} ${x - 10} ${y - 6}`} fill="#263238" />
          <path d={`M ${x + 4} ${y + 2} Q ${x + 12} ${y} ${x + 10} ${y + 8} Q ${x + 2} ${y + 10} ${x + 4} ${y + 2}`} fill="#263238" />

          {/* Plump Pink Udder when Ready */}
          {isReady && (
            <g>
              <ellipse cx={x - 6} cy={y + 11} rx="7" ry="5" fill="#FF80AB" stroke="#C2185B" strokeWidth="0.8" />
              <circle cx={x - 8} cy={y + 14} r="1.5" fill="#FF4081" />
              <circle cx={x - 4} cy={y + 14} r="1.5" fill="#FF4081" />
            </g>
          )}

          {/* Chubby Short Legs with Black Hooves */}
          <rect x={x - 12} y={y + 8} width="4.5" height="10" rx="2" fill="#FFFFFF" stroke="#37474F" strokeWidth="1" />
          <rect x={x - 12} y={y + 15} width="4.5" height="3" fill="#263238" />

          <rect x={x - 4} y={y + 9} width="4.5" height="10" rx="2" fill="#FFFFFF" stroke="#37474F" strokeWidth="1" />
          <rect x={x - 4} y={y + 16} width="4.5" height="3" fill="#263238" />

          <rect x={x + 6} y={y + 8} width="4.5" height="10" rx="2" fill="#FFFFFF" stroke="#37474F" strokeWidth="1" />
          <rect x={x + 6} y={y + 15} width="4.5" height="3" fill="#263238" />

          {/* 3D Cute Cow Head */}
          <ellipse cx={x + 16} cy={y - 6} rx="10" ry="9" fill="#FFFFFF" stroke="#37474F" strokeWidth="1.5" />
          <path d={`M ${x + 12} ${y - 12} Q ${x + 20} ${y - 14} ${x + 18} ${y - 6} Q ${x + 12} ${y - 6} ${x + 12} ${y - 12}`} fill="#263238" />

          {/* Big Expressive 3D Cartoon Eyes */}
          <circle cx={x + 16} cy={y - 8} r="3" fill="#FFFFFF" stroke="#212121" strokeWidth="0.8" />
          <circle cx={x + 16.5} cy={y - 8} r="2" fill="#212121" />
          <circle cx={x + 15.8} cy={y - 8.8} r="0.8" fill="#FFFFFF" />

          {/* Pink Snout / Muzzle */}
          <ellipse cx={x + 21} cy={y - 3} rx="6.5" ry="5" fill="#FF80AB" stroke="#C2185B" strokeWidth="1" />
          <circle cx={x + 20} cy={y - 3.5} r="1.2" fill="#880E4F" />
          <circle cx={x + 23} cy={y - 3.5} r="1.2" fill="#880E4F" />
          <path d={`M ${x + 19} ${y - 1} Q ${x + 21.5} ${y + 1} ${x + 24} ${y - 1}`} stroke="#880E4F" strokeWidth="0.8" fill="none" strokeLinecap="round" />

          {/* Golden Horns */}
          <polygon points={`${x + 11},${y - 14} ${x + 8},${y - 20} ${x + 14},${y - 15}`} fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />
          <polygon points={`${x + 17},${y - 14} ${x + 20},${y - 20} ${x + 15},${y - 15}`} fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />

          {/* Red Bell Collar & Golden Bell */}
          <path d={`M ${x + 8} ${y - 1} Q ${x + 12} ${y + 4} ${x + 15} ${y + 2}`} stroke="#E53935" strokeWidth="3" fill="none" />
          <circle cx={x + 11.5} cy={y + 6} r="3" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />
          <circle cx={x + 10.8} cy={y + 5.2} r="1" fill="#FFFFFF" />
        </g>
      );

    case 'pig':
      return (
        <g>
          {/* Ground Shadow */}
          <ellipse cx={x} cy={y + 10} rx="18" ry="7" fill="rgba(0,0,0,0.3)" />

          {/* 3D Chubby Pink Piglet Body */}
          <ellipse cx={x} cy={y} rx="16" ry="13" fill="#F8BBD0" stroke="#D81B60" strokeWidth="1.5" />
          <ellipse cx={x - 4} cy={y - 4} rx="7" ry="3.5" fill="#FFD0E0" opacity="0.8" />

          {/* Mud Splashes on Piglet */}
          <ellipse cx={x - 5} cy={y - 2} rx="3.5" ry="2.5" fill="#5D4037" opacity="0.65" />
          <circle cx={x + 4} cy={y + 3} r="2.5" fill="#5D4037" opacity="0.65" />

          {/* Curly 3D Spring Tail */}
          <path
            d={`M ${x - 16} ${y} Q ${x - 22} ${y - 5} ${x - 18} ${y - 10} Q ${x - 14} ${y - 8} ${x - 18} ${y - 4}`}
            stroke="#D81B60"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Trotter Legs */}
          <rect x={x - 10} y={y + 8} width="4.5" height="7" rx="2" fill="#F8BBD0" stroke="#D81B60" strokeWidth="1" />
          <rect x={x + 3} y={y + 8} width="4.5" height="7" rx="2" fill="#F8BBD0" stroke="#D81B60" strokeWidth="1" />

          {/* Piglet Head */}
          <ellipse cx={x + 12} cy={y - 4} rx="9" ry="8.5" fill="#F8BBD0" stroke="#D81B60" strokeWidth="1.5" />
          <ellipse cx={x + 10} cy={y - 7} rx="3" ry="1.5" fill="#FFFFFF" opacity="0.6" />

          {/* Glossy Eyes */}
          <circle cx={x + 13} cy={y - 7} r="2.5" fill="#FFFFFF" stroke="#212121" strokeWidth="0.6" />
          <circle cx={x + 13.5} cy={y - 7} r="1.6" fill="#212121" />
          <circle cx={x + 12.8} cy={y - 7.6} r="0.7" fill="#FFFFFF" />

          {/* Button Snout */}
          <ellipse cx={x + 18} cy={y - 2} rx="5.5" ry="4.2" fill="#FF80AB" stroke="#C2185B" strokeWidth="1.2" />
          <circle cx={x + 16.8} cy={y - 2} r="1.4" fill="#880E4F" />
          <circle cx={x + 19.5} cy={y - 2} r="1.4" fill="#880E4F" />

          {/* Floppy Ears */}
          <polygon points={`${x + 8},${y - 11} ${x + 6},${y - 17} ${x + 12},${y - 13}`} fill="#FF80AB" stroke="#C2185B" strokeWidth="1" />
          <polygon points={`${x + 14},${y - 11} ${x + 16},${y - 17} ${x + 18},${y - 12}`} fill="#FF80AB" stroke="#C2185B" strokeWidth="1" />
        </g>
      );

    case 'sheep':
      return (
        <g>
          {/* Ground Shadow */}
          <ellipse cx={x} cy={y + 11} rx="18" ry="7" fill="rgba(0,0,0,0.3)" />

          {/* Cloud-like Wool Body */}
          <circle cx={x - 8} cy={y - 5} r="8" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1.2" />
          <circle cx={x + 4} cy={y - 6} r="8.5" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1.2" />
          <circle cx={x - 8} cy={y + 5} r="8" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="1.2" />
          <circle cx={x + 4} cy={y + 5} r="8" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="1.2" />
          <circle cx={x - 2} cy={y} r="10.5" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1.2" />
          <circle cx={x - 4} cy={y - 3} r="4" fill="#FFFFFF" />

          {/* Black Hooves */}
          <rect x={x - 9} y={y + 9} width="3.5" height="8" rx="1.5" fill="#37474F" stroke="#212121" strokeWidth="0.8" />
          <rect x={x + 3} y={y + 9} width="3.5" height="8" rx="1.5" fill="#37474F" stroke="#212121" strokeWidth="0.8" />

          {/* Sheep Head */}
          <ellipse cx={x + 14} cy={y - 4} rx="7.5" ry="6.8" fill="#37474F" stroke="#212121" strokeWidth="1.2" />
          <circle cx={x + 12} cy={y - 9} r="3.5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="0.8" />
          <circle cx={x + 16} cy={y - 9} r="3.5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="0.8" />

          {/* Sheep Eye */}
          <circle cx={x + 16} cy={y - 5} r="2.4" fill="#FFFFFF" stroke="#000000" strokeWidth="0.6" />
          <circle cx={x + 16.5} cy={y - 5} r="1.5" fill="#000000" />
          <circle cx={x + 15.8} cy={y - 5.6} r="0.6" fill="#FFFFFF" />

          {/* Droopy Black Ear */}
          <ellipse cx={x + 8} cy={y - 4} rx="3" ry="5" fill="#263238" stroke="#000000" strokeWidth="0.8" transform={`rotate(20 ${x + 8} ${y - 4})`} />
        </g>
      );
  }
}
