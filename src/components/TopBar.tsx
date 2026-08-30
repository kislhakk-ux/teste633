import React from 'react';
import { LEVEL_XP_REQUIREMENTS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface TopBarProps {
  level: number;
  xp: number;
  coins: number;
  gems: number;
  siloUsed: number;
  siloMax: number;
  barnUsed: number;
  barnMax: number;
  farmName: string;
  soundEnabled?: boolean;
  musicEnabled?: boolean;
  graphicsStyle?: string;
  onlineCount?: number;
  onOpenMultiplayer?: () => void;
  onOpenSilo: () => void;
  onOpenBarn: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  isVisiting?: boolean;
  visitingFarmName?: string;
  visitingLevel?: number;
  visitingLikes?: number;
  onLeaveVisiting?: () => void;
  onLikeVisitingFarm?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  level,
  xp,
  coins,
  gems,
  siloUsed,
  siloMax,
  barnUsed,
  barnMax,
  farmName,
  onOpenSilo,
  onOpenBarn,
  onOpenAchievements,
  onOpenSettings,
  isVisiting = false,
  visitingFarmName = '',
  visitingLevel = 1,
  visitingLikes = 0,
  onLeaveVisiting,
  onLikeVisitingFarm,
}) => {
  const currentLevelXpReq = LEVEL_XP_REQUIREMENTS[level] || 99999;
  const progressPercent = Math.min(100, Math.round((xp / currentLevelXpReq) * 100));

  // If in visitor mode, show special neighbor visitation banner
  if (isVisiting) {
    return (
      <header className="absolute top-0 left-0 right-0 z-40 px-3 py-2.5 bg-gradient-to-b from-amber-950/95 via-amber-900/90 to-transparent pointer-events-none select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 pointer-events-auto">
          {/* Visitor Farm Info */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-800 to-teal-900 border-2 border-emerald-300 px-3 py-1.5 rounded-2xl shadow-xl">
            <span className="text-2xl">🏡</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white">
                  Visitando: {visitingFarmName}
                </span>
                <span className="text-[10px] bg-emerald-700 text-emerald-100 font-bold px-1.5 rounded-full">
                  Nível {visitingLevel}
                </span>
              </div>
              <span className="text-[10px] text-emerald-200 block">
                Você pode olhar a fazenda e comprar da banca dele!
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Like Farm */}
            {onLikeVisitingFarm && (
              <button
                onClick={() => {
                  sound.playDing();
                  onLikeVisitingFarm();
                }}
                className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs px-3 py-2 rounded-xl shadow-lg border border-white active:scale-95 transition-all cursor-pointer"
              >
                <span>❤️ Curtir</span>
                {visitingLikes > 0 && <span>({visitingLikes})</span>}
              </button>
            )}

            {/* Leave & Return to own farm */}
            {onLeaveVisiting && (
              <button
                onClick={() => {
                  sound.playClick();
                  onLeaveVisiting();
                }}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg border-2 border-white active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                <span>⬅</span>
                <span>Voltar para Minha Fazenda</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 py-2 bg-gradient-to-b from-amber-950/90 via-amber-950/60 to-transparent pointer-events-none select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 pointer-events-auto">
        {/* Level & XP Badge */}
        <div
          onClick={onOpenAchievements}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-800 to-amber-900 border-2 border-amber-400/80 px-2.5 py-1.5 rounded-2xl shadow-lg cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          title="Ver Nível e Conquistas"
        >
          {/* Level Star */}
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full border-2 border-white shadow-md text-amber-950 font-black text-base">
            <span>{level}</span>
            <div className="absolute -bottom-1 text-[8px] uppercase tracking-tighter font-extrabold text-amber-900 bg-yellow-200 px-1 rounded-full">
              Nív
            </div>
          </div>

          {/* XP Bar & Farm Name */}
          <div className="flex flex-col min-w-[90px] sm:min-w-[120px]">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-100">
              <span className="truncate max-w-[80px] sm:max-w-[110px]">{farmName}</span>
              <span className="text-[10px] text-amber-300">
                {xp}/{currentLevelXpReq}
              </span>
            </div>
            <div className="w-full h-2.5 bg-amber-950/80 rounded-full overflow-hidden border border-amber-500/40 mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right HUD: Storage badges, stacked currency and settings gear */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Compact Silo Badge */}
          <button
            id="btn-open-silo-top"
            onClick={() => {
              sound.playClick();
              onOpenSilo();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] sm:text-xs font-bold shadow border transition-all cursor-pointer ${
              siloUsed >= siloMax
                ? 'bg-red-700 text-white border-red-300 animate-pulse'
                : 'bg-amber-900/80 text-amber-100 border-amber-400 hover:bg-amber-800'
            }`}
            title="Abrir Silo"
          >
            <span>🌾</span>
            <span>{siloUsed}/{siloMax}</span>
          </button>

          {/* Compact Barn Badge */}
          <button
            id="btn-open-barn-top"
            onClick={() => {
              sound.playClick();
              onOpenBarn();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] sm:text-xs font-bold shadow border transition-all cursor-pointer ${
              barnUsed >= barnMax
                ? 'bg-red-700 text-white border-red-300 animate-pulse'
                : 'bg-amber-900/80 text-amber-100 border-amber-400 hover:bg-amber-800'
            }`}
            title="Abrir Celeiro"
          >
            <span>🛖</span>
            <span>{barnUsed}/{barnMax}</span>
          </button>

          {/* Currency (Coins & Gems stacked vertically in top right) */}
          <div className="flex flex-col gap-1.5 justify-center">
            {/* Coins */}
            <div className="flex items-center gap-1 bg-amber-900/90 border-2 border-yellow-400 px-2 py-0.5 rounded-xl shadow-md justify-end min-w-[80px] sm:min-w-[100px]">
              <span className="text-yellow-300 font-black text-xs sm:text-sm tracking-wide">
                {coins.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">🪙</span>
            </div>

            {/* Gems */}
            <div className="flex items-center gap-1 bg-emerald-950/90 border-2 border-emerald-400 px-2 py-0.5 rounded-xl shadow-md justify-end min-w-[80px] sm:min-w-[100px]">
              <span className="text-emerald-300 font-black text-xs sm:text-sm tracking-wide">
                {gems.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm">💎</span>
            </div>
          </div>

          {/* Settings Menu Gear Button */}
          <button
            id="btn-open-settings"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-8 h-8 rounded-xl bg-amber-950/80 text-amber-200 border border-amber-400/60 hover:bg-amber-900 flex items-center justify-center text-sm transition-all active:scale-95 cursor-pointer"
            title="Configurações"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};
