import React from 'react';
import { GameState, ItemId } from '../types/game';
import { EXPANSION_PARCELS, ExpansionParcel, LEGACY_PARCEL_ALIASES } from '../constants/expansionData';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface UnlockParcelModalProps {
  parcelId: string | null;
  gameState: GameState;
  onClose: () => void;
  onUnlock: (parcel: ExpansionParcel) => void;
}

export const UnlockParcelModal: React.FC<UnlockParcelModalProps> = ({
  parcelId,
  gameState,
  onClose,
  onUnlock,
}) => {
  if (!parcelId) return null;

  const activeId = LEGACY_PARCEL_ALIASES[parcelId] || parcelId;
  const parcel = EXPANSION_PARCELS.find((p) => p.id === activeId);

  if (!parcel) {
    onClose();
    return null;
  }

  const { cost, requiredLevel, name, subtitle, description, biome } = parcel;

  // Validation
  const hasLevel = gameState.level >= requiredLevel;
  const hasCoins = gameState.coins >= cost.coins;

  let hasAllItems = true;
  const itemsStatus = Object.entries(cost.items).map(([id, requiredQty]) => {
    const invQty = gameState.inventory[id as ItemId] || 0;
    const req = requiredQty as number;
    const hasEnough = invQty >= req;
    if (!hasEnough) hasAllItems = false;
    const def = ITEMS[id as ItemId];

    return {
      id: id as ItemId,
      name: def?.name || id,
      icon: def?.icon || '📦',
      current: invQty,
      required: req,
      isMet: hasEnough,
    };
  });

  const canUnlock = hasLevel && hasCoins && hasAllItems;

  const handleUnlockClick = () => {
    if (canUnlock) {
      sound.playSuccess();
      onUnlock(parcel);
    } else {
      sound.playError();
    }
  };

  const getBiomeIcon = (b: string) => {
    switch (b) {
      case 'pine_hill':
      case 'highland':
        return '🌲';
      case 'fruit_meadow':
        return '🍎';
      case 'riverbank':
        return '🌊';
      case 'pasture':
        return '🌻';
      case 'waterfall_terrace':
        return '🏞️';
      case 'ancient_grove':
        return '🌳';
      default:
        return '🌿';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 3D Cartoon Wooden Farm Board Modal */}
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#FFF9C4] via-[#FFF8E1] to-[#FFE082] border-4 border-[#6D4C41] rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4 text-stone-800"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -4px 0 #D7CCC8',
        }}
      >
        {/* Decorative Top Wooden Header Banner */}
        <div className="w-full bg-gradient-to-r from-[#5D4037] via-[#795548] to-[#5D4037] text-amber-100 py-2.5 px-4 rounded-2xl border-2 border-[#3E2723] shadow-md flex items-center justify-between -mt-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow">{getBiomeIcon(biome)}</span>
            <div className="leading-tight">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-300">
                Expansão de Território
              </span>
              <h3 className="text-lg font-black text-white drop-shadow-sm">{name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-sm flex items-center justify-center border-2 border-red-900 shadow transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Territory Overview Card */}
        <div className="w-full bg-amber-50/80 rounded-2xl p-3 border border-amber-200 shadow-inner flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 border-2 border-emerald-700 flex items-center justify-center text-3xl shadow-sm shrink-0">
            {getBiomeIcon(biome)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-amber-800 uppercase">{subtitle}</span>
            <p className="text-xs font-medium text-stone-700 leading-snug">{description}</p>
          </div>
        </div>

        {/* Requirements Breakdown Panel */}
        <div className="w-full bg-white/90 rounded-2xl p-3.5 border-2 border-[#D7CCC8] shadow-sm flex flex-col gap-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <span>📋</span> Requisitos para Conquistar
          </span>

          {/* Level Requirement */}
          <div className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2 border border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-stone-900 font-black text-xs shadow-sm">
                ⭐
              </div>
              <span className="font-bold text-xs text-stone-800">Nível da Fazenda</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black text-xs px-2 py-0.5 rounded-full ${
                  hasLevel ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                Nv. {gameState.level} / {requiredLevel}
              </span>
              <span>{hasLevel ? '✅' : '🔒'}</span>
            </div>
          </div>

          {/* Coins Requirement */}
          <div className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2 border border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-yellow-400 border border-yellow-600 flex items-center justify-center text-stone-900 font-black text-xs shadow-sm">
                🪙
              </div>
              <span className="font-bold text-xs text-stone-800">Moedas de Ouro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black text-xs px-2 py-0.5 rounded-full ${
                  hasCoins ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {gameState.coins.toLocaleString('pt-BR')} / {cost.coins.toLocaleString('pt-BR')}
              </span>
              <span>{hasCoins ? '✅' : '❌'}</span>
            </div>
          </div>

          {/* Expansion Items Requirements */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">
              Materiais de Demarcação
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {itemsStatus.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center sm:flex-col justify-between sm:justify-center p-2 rounded-xl border ${
                    item.isMet
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                      : 'bg-red-50/80 border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-1 sm:flex-col">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] font-bold truncate max-w-[120px] sm:max-w-none">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-black text-xs">
                    <span>
                      {item.current}/{item.required}
                    </span>
                    <span>{item.isMet ? '✅' : '❌'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Hint */}
        {!canUnlock && (
          <p className="text-red-700 font-bold text-xs text-center bg-red-100/90 py-1.5 px-3 rounded-xl border border-red-300 w-full">
            ⚠️ Consiga os materiais de expansão nas caixas misteriosas, pedidos ou roleta!
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={handleUnlockClick}
          disabled={!canUnlock}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center gap-2 transition-all duration-150 ${
            canUnlock
              ? 'bg-gradient-to-b from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:to-green-600 active:scale-98 border-b-4 border-green-900 shadow-green-900/40 cursor-pointer animate-pulse'
              : 'bg-stone-400 border-b-4 border-stone-600 cursor-not-allowed opacity-75'
          }`}
        >
          <span className="text-2xl">🗺️</span>
          <span>EXPANDIR</span>
        </button>
      </div>
    </div>
  );
};
