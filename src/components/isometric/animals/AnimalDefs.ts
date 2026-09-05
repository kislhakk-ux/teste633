import { AnimalType, ItemId } from '../../../types/game';

export interface AnimalInstanceData {
  id: string;
  fedAt: number | null;
}

export interface AnimalVisualProps {
  id: string;
  index: number;
  type: AnimalType;
  x: number;
  y: number;
  isFed: boolean;
  isReady: boolean;
  progress: number; // 0 to 1
  remainingSeconds: number;
  onTap: (index: number) => void;
  bubbleText?: string | null;
}

export interface PenAnimalPosition {
  x: number;
  y: number;
  scale?: number;
  facing?: 'left' | 'right';
  delay?: string;
}

// 3 distinct animated positions per pen type strictly contained inside the pen interior
export const PEN_ANIMAL_POSITIONS: Record<AnimalType, PenAnimalPosition[]> = {
  chicken: [
    { x: 80, y: 70, scale: 1.05, facing: 'right', delay: '0s' },
    { x: 108, y: 58, scale: 0.98, facing: 'left', delay: '0.8s' },
    { x: 130, y: 72, scale: 1.02, facing: 'right', delay: '1.5s' },
  ],
  cow: [
    { x: 82, y: 74, scale: 1.02, facing: 'right', delay: '0s' },
    { x: 110, y: 60, scale: 0.96, facing: 'left', delay: '1.2s' },
    { x: 132, y: 74, scale: 1.0, facing: 'right', delay: '2.1s' },
  ],
  pig: [
    { x: 82, y: 72, scale: 1.02, facing: 'right', delay: '0.4s' },
    { x: 108, y: 62, scale: 0.98, facing: 'left', delay: '1.6s' },
    { x: 132, y: 74, scale: 1.0, facing: 'right', delay: '0s' },
  ],
  sheep: [
    { x: 80, y: 72, scale: 1.0, facing: 'right', delay: '0s' },
    { x: 110, y: 60, scale: 0.95, facing: 'left', delay: '1.1s' },
    { x: 132, y: 72, scale: 1.02, facing: 'right', delay: '1.9s' },
  ],
};

export const ANIMAL_VOICES: Record<AnimalType, string[]> = {
  chicken: ['🌾 Có-có-có!', '🥚 Có-ró-có!', '✨ Piu piu!'],
  cow: ['🥛 Muuuu!', '🐮 Muuuu-uu!', '🌿 Muuh!'],
  pig: ['🥓 Oinc oinc!', '🐷 Rónc-rónc!', '🥣 Oinc!'],
  sheep: ['🧶 Béééé!', '🐑 Mééé-é!', '✨ Bééé!'],
};
