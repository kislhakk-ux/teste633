import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ItemId } from '../types/game';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface LuckyWheelModalProps {
  onClose: () => void;
  gems: number;
  lastSpinDate: string | null;
  onClaimReward: (reward: { type: 'coins' | 'gems' | 'item'; amount: number; itemId?: ItemId }) => void;
}

const WHEEL_SLICES = [
  { label: '500 Moedas', type: 'coins' as const, amount: 500, icon: '🪙', color: '#f59e0b' },
  { label: '5 Diamantes', type: 'gems' as const, amount: 5, icon: '💎', color: '#10b981' },
  { label: '2x Pregos', type: 'item' as const, amount: 2, itemId: 'nail' as ItemId, icon: '🔩', color: '#3b82f6' },
  { label: '250 Moedas', type: 'coins' as const, amount: 250, icon: '🪙', color: '#fbbf24' },
  { label: '2x Tábuas', type: 'item' as const, amount: 2, itemId: 'wood_plank' as ItemId, icon: '🪵', color: '#ec4899' },
  { label: '10 Diamantes', type: 'gems' as const, amount: 10, icon: '💎', color: '#8b5cf6' },
  { label: '3x Machados', type: 'item' as const, amount: 3, itemId: 'axe' as ItemId, icon: '🪓', color: '#ef4444' },
  { label: '1000 Moedas', type: 'coins' as const, amount: 1000, icon: '💰', color: '#059669' },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  onClose,
  gems,
  lastSpinDate,
  onClaimReward,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<typeof WHEEL_SLICES[0] | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const hasFreeSpinToday = lastSpinDate !== todayStr;

  const handleSpin = () => {
    if (isSpinning) return;
    if (!hasFreeSpinToday && gems < 2) {
      sound.playClick();
      return;
    }

    sound.playTruck();
    setIsSpinning(true);
    setWonReward(null);

    // Random winner index
    const winnerIdx = Math.floor(Math.random() * WHEEL_SLICES.length);
    const sliceAngle = 360 / WHEEL_SLICES.length;
    // Extra rotations + target slice
    const totalAngle = rotation + 1440 + (360 - winnerIdx * sliceAngle - sliceAngle / 2);

    setRotation(totalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = WHEEL_SLICES[winnerIdx];
      setWonReward(chosen);
      sound.playDing();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onClaimReward(chosen);
    }, 3500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#f3e5f5] via-[#e1bee7] to-[#ce93d8] border-4 border-[#7b1fa2] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-md w-full relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-purple-300 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎡</span>
            <div>
              <h2 className="text-purple-950 font-black text-lg">
                Roda da Fortuna da Fazenda
              </h2>
              <p className="text-xs text-purple-800 font-semibold">
                {hasFreeSpinToday ? '🎉 Seu 1º giro de hoje é GRÁTIS!' : 'Gire por 2 💎'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow"
          >
            ✕
          </button>
        </div>

        {/* Wheel Graphic Container */}
        <div className="relative w-64 h-64 flex items-center justify-center my-2">
          {/* Wheel Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-3xl filter drop-shadow">
            🔻
          </div>

          {/* Rotating Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-yellow-300 shadow-2xl overflow-hidden relative transition-transform duration-[3500ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {WHEEL_SLICES.map((slice, idx) => {
              const angle = (360 / WHEEL_SLICES.length) * idx;
              return (
                <div
                  key={idx}
                  className="absolute top-0 left-0 w-full h-full origin-center flex flex-col items-center pt-2"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(50% 50%, 25% 0%, 75% 0%)',
                    backgroundColor: slice.color,
                  }}
                >
                  <span className="text-xl filter drop-shadow mt-1">
                    {slice.icon}
                  </span>
                  <span className="text-[10px] font-black text-white drop-shadow">
                    {slice.amount}
                  </span>
                </div>
              );
            })}
            {/* Center Pin */}
            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-md flex items-center justify-center font-black text-purple-950 text-xs">
              ⭐
            </div>
          </div>
        </div>

        {/* Result banner if won */}
        {wonReward && (
          <div className="bg-white/95 border-2 border-purple-400 px-4 py-2 rounded-2xl shadow text-center animate-bounce">
            <span className="text-xs font-bold text-purple-900">
              Você ganhou:
            </span>
            <p className="font-black text-sm text-purple-950">
              {wonReward.icon} {wonReward.label}!
            </p>
          </div>
        )}

        {/* Spin Button */}
        <button
          id="btn-spin-wheel"
          disabled={isSpinning || (!hasFreeSpinToday && gems < 2)}
          onClick={handleSpin}
          className={`w-full py-3.5 rounded-2xl font-black text-base shadow-xl border-2 border-white flex items-center justify-center gap-2 transition-all ${
            isSpinning
              ? 'bg-purple-400 text-purple-900 cursor-wait'
              : hasFreeSpinToday
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 active:scale-95'
              : gems >= 2
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSpinning ? (
            <span>GIRANDO...</span>
          ) : hasFreeSpinToday ? (
            <span>🎰 GIRAR GRÁTIS!</span>
          ) : (
            <span>🎰 GIRAR POR 2 💎</span>
          )}
        </button>
      </div>
    </div>
  );
};
