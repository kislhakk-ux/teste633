import React, { useState } from 'react';
import { Achievement, GameStats } from '../types/game';
import { sound } from '../utils/sound';

interface AchievementsModalProps {
  farmName: string;
  level: number;
  achievements: Achievement[];
  stats: GameStats;
  onClose: () => void;
  onRenameFarm: (newName: string) => void;
  onClaimAchievement: (achId: string) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  farmName,
  level,
  achievements,
  stats,
  onClose,
  onRenameFarm,
  onClaimAchievement,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(farmName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onRenameFarm(tempName.trim());
      setEditingName(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff8e1] via-[#ffecb3] to-[#ffe082] border-4 border-[#c62828] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-xl w-full relative flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-300 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-2xl border-2 border-white shadow flex items-center justify-center text-3xl text-white">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-2">
                {editingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="px-2 py-0.5 bg-white border border-amber-400 rounded-lg text-sm font-bold text-amber-950"
                      maxLength={20}
                    />
                    <button
                      onClick={handleSaveName}
                      className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg font-bold"
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-amber-950 font-black text-lg sm:text-xl">
                      {farmName}
                    </h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-xs text-amber-700 hover:text-amber-900"
                      title="Editar nome da fazenda"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-amber-800 font-semibold">
                Nível {level} • Conquistas & Estatísticas da Fazenda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white font-black flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Stats summary banner */}
        <div className="grid grid-cols-3 gap-2 bg-amber-900/10 p-2.5 rounded-2xl border border-amber-300 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-amber-800">Total Colheitas</span>
            <span className="text-sm font-black text-amber-950">
              🌾 {stats.totalHarvested}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-amber-800">Pedidos Entregues</span>
            <span className="text-sm font-black text-amber-950">
              🚚 {stats.totalOrdersCompleted}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-amber-800">Total Produzido</span>
            <span className="text-sm font-black text-amber-950">
              🍞 {stats.totalCrafted}
            </span>
          </div>
        </div>

        {/* Achievements list */}
        <div className="flex flex-col gap-2.5 overflow-y-auto max-h-72 pr-1">
          <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
            Troféus & Metas:
          </span>

          {achievements.map((ach) => {
            const isCompleted = ach.current >= ach.target;
            const progress = Math.min(100, Math.round((ach.current / ach.target) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                  ach.claimed
                    ? 'bg-amber-100/50 border-gray-300 opacity-60'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                    : 'bg-white border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl border border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                    {ach.icon}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-black text-xs text-amber-950">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] text-amber-800">{ach.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden border border-amber-200">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-amber-900">
                        {ach.current}/{ach.target}
                      </span>
                    </div>
                  </div>
                </div>

                {ach.claimed ? (
                  <span className="text-xs font-black text-gray-500 px-3 py-1 bg-gray-200 rounded-xl">
                    Coletado ✓
                  </span>
                ) : isCompleted ? (
                  <button
                    onClick={() => {
                      sound.playCoin();
                      onClaimAchievement(ach.id);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-2 rounded-xl shadow border border-white flex flex-col items-center animate-bounce"
                  >
                    <span>Reivindicar!</span>
                    <span className="text-[10px] text-emerald-200">
                      +{ach.rewardGems} 💎 +{ach.rewardCoins} 🪙
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-col items-end text-[11px] font-black text-amber-900">
                    <span>+{ach.rewardGems} 💎</span>
                    <span>+{ach.rewardCoins} 🪙</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
