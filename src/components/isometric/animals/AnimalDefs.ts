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

// 3 distinct animated positions per pen type for optimal isometric depth
export const PEN_ANIMAL_POSITIONS: Record<AnimalType, PenAnimalPosition[]> = {
  chicken: [
    { x: 74, y: 76, scale: 1.05, facing: 'right', delay: '0s' },
    { x: 114, y: 64, scale: 0.95, facing: 'left', delay: '0.8s' },
    { x: 148, y: 84, scale: 1.02, facing: 'right', delay: '1.5s' },
  ],
  cow: [
    { x: 72, y: 78, scale: 1.02, facing: 'right', delay: '0s' },
    { x: 112, y: 65, scale: 0.96, facing: 'left', delay: '1.2s' },
    { x: 146, y: 82, scale: 1.0, facing: 'right', delay: '2.1s' },
  ],
  pig: [
    { x: 76, y: 76, scale: 1.02, facing: 'right', delay: '0.4s' },
    { x: 110, y: 68, scale: 0.98, facing: 'left', delay: '1.6s' },
    { x: 144, y: 82, scale: 1.0, facing: 'right', delay: '0s' },
  ],
  sheep: [
    { x: 70, y: 76, scale: 1.0, facing: 'right', delay: '0s' },
    { x: 112, y: 64, scale: 0.95, facing: 'left', delay: '1.1s' },
    { x: 146, y: 80, scale: 1.02, facing: 'right', delay: '1.9s' },
  ],
};

export const ANIMAL_VOICES: Record<AnimalType, string[]> = {
  chicken: ['🌾 Có-có-có!', '🥚 Có-ró-có!', '✨ Piu piu!'],
  cow: ['🥛 Muuuu!', '🐮 Muuuu-uu!', '🌿 Muuh!'],
  pig: ['🥓 Oinc oinc!', '🐷 Rónc-rónc!', '🥣 Oinc!'],
  sheep: ['🧶 Béééé!', '🐑 Mééé-é!', '✨ Bééé!'],
};
