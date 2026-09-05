import React, { useState, useCallback } from 'react';
import { AnimalType } from '../../types/game';
import { ANIMAL_PENS, ITEMS } from '../../constants/gameData';
import { sound } from '../../utils/sound';
import {
  PEN_ANIMAL_POSITIONS,
  ANIMAL_VOICES,
} from './animals/AnimalDefs';
import { IsoPenEnvironment } from './animals/IsoPenEnvironment';
import { IsoChickenModel } from './animals/IsoChickenModel';
import { IsoCowModel } from './animals/IsoCowModel';
import { IsoPigModel } from './animals/IsoPigModel';
import { IsoSheepModel } from './animals/IsoSheepModel';

interface IsoAnimalPenProps {
  animalType: AnimalType;
  animals: { id: string; fedAt: number | null }[];
  currentTime: number;
  onCollectAnimal: (idx: number) => void;
  onFeedAnimals?: () => void;
  hasFeed?: boolean;
}

const IsoAnimalPenComponent: React.FC<IsoAnimalPenProps> = ({
  animalType,
  animals,
  currentTime,
  onCollectAnimal,
  onFeedAnimals,
  hasFeed = true,
}) => {
  const penDef = ANIMAL_PENS[animalType];
  const [animalBubbles, setAnimalBubbles] = useState<Record<number, string | null>>({});

  const handleAnimalTap = useCallback(
    (idx: number) => {
      // 1. Play animal sound
      sound.playAnimal(animalType);

      // 2. Check if ready for immediate collection
      const animal = animals[idx];
      if (!animal) return;

      const isFed = animal.fedAt !== null;
      const produceDuration = penDef?.produceTimeSeconds || 30;
      const elapsed = animal.fedAt ? (currentTime - animal.fedAt) / 1000 : 0;
      const isReady = isFed && elapsed >= produceDuration;

      if (isReady) {
        onCollectAnimal(idx);
        return;
      }

      // If hungry and user has feed callback, prompt or feed
      if (!isFed && onFeedAnimals) {
        onFeedAnimals();
      }

      // 3. Trigger speech bubble
      const voiceOptions = ANIMAL_VOICES[animalType] || ['✨ Olá!'];
      const randomVoice = voiceOptions[Math.floor(Math.random() * voiceOptions.length)];
      setAnimalBubbles((prev) => ({ ...prev, [idx]: randomVoice }));

      setTimeout(() => {
        setAnimalBubbles((prev) => ({ ...prev, [idx]: null }));
      }, 2000);
    },
    [animalType, animals, currentTime, onCollectAnimal, onFeedAnimals, penDef]
  );

  const produceDuration = penDef?.produceTimeSeconds || 30;
  const positions = PEN_ANIMAL_POSITIONS[animalType] || PEN_ANIMAL_POSITIONS.chicken;

  return (
    <div className="relative w-48 h-40 flex items-center justify-center select-none">
      {/* Main Isometric SVG Enclosure with 3D Cartoon Characters */}
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full overflow-visible select-none"
      >
        {/* 1. Bespoke Isometric Enclosure per Animal Type */}
        <IsoPenEnvironment animalType={animalType} />

        {/* 2. 3D Cartoon Animals */}
        {animals.map((animal, idx) => {
          const pos = positions[idx % positions.length];
          const isFed = animal.fedAt !== null;
          const elapsed = animal.fedAt ? (currentTime - animal.fedAt) / 1000 : 0;
          const isReady = isFed && elapsed >= produceDuration;
          const progress = isFed ? Math.min(1, elapsed / produceDuration) : 0;
          const remainingSeconds = isFed ? Math.max(0, Math.ceil(produceDuration - elapsed)) : 0;
          const bubble = animalBubbles[idx] || null;

          const commonProps = {
            id: animal.id,
            index: idx,
            type: animalType,
            x: pos.x,
            y: pos.y,
            isFed,
            isReady,
            progress,
            remainingSeconds,
            bubbleText: bubble,
            onTap: handleAnimalTap,
          };

          switch (animalType) {
            case 'chicken':
              return <IsoChickenModel key={animal.id} {...commonProps} />;
            case 'cow':
              return <IsoCowModel key={animal.id} {...commonProps} />;
            case 'pig':
              return <IsoPigModel key={animal.id} {...commonProps} />;
            case 'sheep':
              return <IsoSheepModel key={animal.id} {...commonProps} />;
            default:
              return null;
          }
        })}
      </svg>

      {/* 3. Interactive Floating Action Overlays (Ready Collect / Feed / Progress) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-around px-3">
        {animals.map((animal, idx) => {
          const isFed = animal.fedAt !== null;
          const elapsed = animal.fedAt ? (currentTime - animal.fedAt) / 1000 : 0;
          const isReady = isFed && elapsed >= produceDuration;
          const remainingSeconds = isFed ? Math.max(0, Math.ceil(produceDuration - elapsed)) : 0;

          return (
            <div
              key={`ui_${animal.id}`}
              className="flex flex-col items-center pointer-events-auto mt-7"
            >
              {isReady ? (
                /* Hay Day Vibrant Collect Button */
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playAnimal(animalType);
                    onCollectAnimal(idx);
                  }}
                  className="bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:brightness-110 active:scale-95 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(34,197,94,0.65)] border-2 border-white flex items-center gap-1.5 animate-animal-ready transition-transform cursor-pointer"
                  title="Coletar Produto!"
                >
                  <span className="text-sm">{ITEMS[penDef.produceId]?.icon}</span>
                  <span>Coletar!</span>
                </button>
              ) : isFed ? (
                /* Production Timer Badge */
                <div
                  className="bg-amber-950/80 backdrop-blur-xs text-amber-200 border border-amber-400/80 rounded-full px-2 py-0.5 text-[9px] font-bold shadow flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
                  title={`Produzindo ${penDef.name}...`}
                >
                  <span>⏳</span>
                  <span>{remainingSeconds}s</span>
                </div>
              ) : (
                /* Quick Feed Prompt Button */
                onFeedAnimals && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playPlant();
                      onFeedAnimals();
                    }}
                    className={`bg-gradient-to-b from-amber-400 to-amber-600 hover:brightness-110 active:scale-95 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.3)] border border-yellow-200 flex items-center gap-1 cursor-pointer transition-transform ${
                      !hasFeed ? 'opacity-60 grayscale' : ''
                    }`}
                    title={hasFeed ? 'Alimentar com Ração!' : 'Sem ração no celeiro!'}
                  >
                    <span>🥣</span>
                    <span>Alimentar</span>
                  </button>
                )
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
