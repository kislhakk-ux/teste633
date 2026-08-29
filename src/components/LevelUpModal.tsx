import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CROPS, BUILDINGS, ANIMAL_PENS, RECIPES } from '../constants/gameData';
import { sound } from '../utils/sound';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  onClose,
}) => {
  useEffect(() => {
    sound.playLevelUp();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  }, [newLevel]);

  // Find unlocks for this level
  const unlockedCrops = Object.values(CROPS).filter((c) => c.minLevel === newLevel);
  const unlockedBuildings = Object.values(BUILDINGS).filter((b) => b.minLevel === newLevel);
  const unlockedPens = Object.values(ANIMAL_PENS).filter((p) => p.minLevel === newLevel);
  const unlockedRecipes = RECIPES.filter((r) => r.minLevel === newLevel);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#ffecb3] via-[#ffe082] to-[#ffd54f] border-4 border-[#ff6f00] rounded-3xl p-6 shadow-2xl max-w-md w-full relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Level Up Star Emblem */}
        <div className="relative -mt-12 w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-300 rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-bounce">
          <span className="text-4xl font-black text-amber-950">{newLevel}</span>
          <div className="absolute -bottom-2 bg-red-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-white shadow">
            Nível
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-amber-950 tracking-wide">
            PARABÉNS!
          </h2>
          <p className="text-xs text-amber-900 font-bold">
            Sua fazenda evoluiu para o Nível {newLevel}!
          </p>
        </div>

        {/* Free gifts awarded */}
        <div className="w-full bg-white/90 p-3 rounded-2xl border-2 border-amber-300 flex items-center justify-around">
          <div className="flex items-center gap-1.5 font-black text-sm text-amber-950">
            <span className="text-2xl">🪙</span>
            <span>+{newLevel * 100} Moedas</span>
          </div>
          <div className="flex items-center gap-1.5 font-black text-sm text-emerald-800">
            <span className="text-2xl">💎</span>
            <span>+3 Diamantes</span>
          </div>
        </div>

        {/* Newly unlocked items */}
        {(unlockedCrops.length > 0 ||
          unlockedBuildings.length > 0 ||
          unlockedPens.length > 0 ||
          unlockedRecipes.length > 0) && (
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs font-black text-amber-950 text-center uppercase tracking-wider">
              ✨ Novos Desbloqueios Disponíveis:
            </span>
            <div className="flex flex-wrap gap-2 justify-center max-h-40 overflow-y-auto p-1 bg-amber-900/10 rounded-2xl">
              {unlockedCrops.map((c) => (
                <div
                  key={c.id}
                  className="bg-white px-2.5 py-1 rounded-xl border border-amber-300 flex items-center gap-1 text-xs font-bold text-amber-950 shadow-xs"
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </div>
              ))}
              {unlockedPens.map((p) => (
                <div
                  key={p.type}
                  className="bg-white px-2.5 py-1 rounded-xl border border-amber-300 flex items-center gap-1 text-xs font-bold text-amber-950 shadow-xs"
                >
                  <span>{p.icon}</span>
                  <span>{p.penName}</span>
                </div>
              ))}
              {unlockedBuildings.map((b) => (
                <div
                  key={b.type}
                  className="bg-white px-2.5 py-1 rounded-xl border border-amber-300 flex items-center gap-1 text-xs font-bold text-amber-950 shadow-xs"
                >
                  <span>{b.icon}</span>
                  <span>{b.name}</span>
                </div>
              ))}
              {unlockedRecipes.map((r) => (
                <div
                  key={r.id}
                  className="bg-white px-2.5 py-1 rounded-xl border border-amber-300 flex items-center gap-1 text-xs font-bold text-amber-950 shadow-xs"
                >
                  <span>🍳</span>
                  <span>Receita: {r.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          id="btn-confirm-levelup"
          onClick={() => {
            sound.playCoin();
            onClose();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black text-base rounded-2xl shadow-xl border-2 border-white active:scale-95 transition-all mt-2"
        >
          Continuar Fazendo Crescer! 🌾
        </button>
      </div>
    </div>
  );
};
