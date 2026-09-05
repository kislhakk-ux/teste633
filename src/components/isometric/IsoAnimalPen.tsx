import React, { useState, useCallback } from 'react';
import { AnimalType } from '../../types/game';
import { ANIMAL_PENS } from '../../constants/gameData';
import { sound } from '../../utils/sound';
import {
  PEN_ANIMAL_POSITIONS,
  ANIMAL_VOICES,
} from './animals/AnimalDefs';
import { IsoPenBackground, IsoPenForeground } from './animals/IsoPenEnvironment';
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

      // If hungry and user has feed callback, trigger feed
      if (!isFed && onFeedAnimals) {
        onFeedAnimals();
      }

      // 3. Trigger compact cute sound/speech bubble inside pen
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
    <div className="relative w-48 h-40 flex items-center justify-center select-none cursor-pointer">
      {/* 
        3D Isometric Diorama Enclosure:
        - Layer 1: IsoPenBackground (Ground, 3D Coop/Barn/Shed, Feed Trough, Water Font, Back Fence)
        - Layer 2: 3D Cartoon Animals (Strictly enclosed within yard interior boundary via clipPath)
        - Layer 3: IsoPenForeground (Front Wooden Timber Rails, Chunky 3D Chamfered Posts, Gate Latch)
      */}
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full select-none overflow-hidden"
      >
        <defs>
          {/* Strictly bounds all animals, animations, and sparkles inside the pen yard */}
          <clipPath id={`pen-yard-boundary-${animalType}`}>
            <polygon points="100,33 178,74 100,118 22,74" />
          </clipPath>
        </defs>

        {/* 1. 3D Isometric Pen Background */}
        <IsoPenBackground animalType={animalType} />

        {/* 2. 3D Cartoon Animals strictly contained within the yard */}
        <g id={`pen-animals-yard-${animalType}`} clipPath={`url(#pen-yard-boundary-${animalType})`}>
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
        </g>

        {/* 3. 3D Isometric Pen Foreground (Front wooden fence in front of animals) */}
        <IsoPenForeground animalType={animalType} />
      </svg>
    </div>
  );
};

export const IsoAnimalPen = React.memo(IsoAnimalPenComponent);
