import React from 'react';
import { GameState, ItemId } from '../types/game';
import { EXPANSION_PARCELS, ExpansionParcel } from '../constants/expansionData';
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

  const parcel = EXPANSION_PARCELS.find(p => p.id === parcelId);
  if (!parcel) {
    onClose();
    return null;
  }

  const { cost, requiredLevel } = parcel;
  
  // Validation
  const hasLevel = gameState.level >= requiredLevel;
  const hasCoins = gameState.coins >= cost.coins;
  
  const missingItems: { item: string; missing: number }[] = [];
  let hasAllItems = true;
  
  Object.entries(cost.items).forEach(([id, qty]) => {
    const invQty = gameState.inventory[id as ItemId] || 0;
    if (invQty < (qty as number)) {
      hasAllItems = false;
      const def = ITEMS[id as ItemId];
      missingItems.push({ item: def?.name || id, missing: (qty as number) - invQty });
    }
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

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#e7f5e7] via-[#ccebd5] to-[#a3d9b4] border-4 border-[#2e7d32] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-[#388e3c] pb-2">
          <span className="font-black text-[#1b5e20] text-lg flex items-center gap-2">
            <span>🗺️</span> Nova Área
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center gap-3 w-full">
          <div className="text-4xl">🌲</div>
          <h2 className="text-[#1b5e20] font-black text-xl">{parcel.name}</h2>
          <p className="text-[#2e7d32] font-semibold text-xs px-2">
            Expanda sua fazenda para construir e plantar mais!
          </p>

          <div className="w-full bg-white/70 p-3 rounded-2xl border border-[#81c784] shadow-inner mt-2">
            <h4 className="font-bold text-[#1b5e20] mb-2 text-sm">Requisitos para Desbloquear</h4>
            
            <ul className="flex flex-col gap-2 text-sm text-left font-semibold">
              <li className={`flex justify-between items-center ${hasLevel ? 'text-green-700' : 'text-red-600'}`}>
                <span className="flex items-center gap-1">⭐ Nível {requiredLevel}</span>
                <span>{gameState.level}/{requiredLevel}</span>
              </li>
              
              <li className={`flex justify-between items-center ${hasCoins ? 'text-green-700' : 'text-red-600'}`}>
                <span className="flex items-center gap-1">🪙 Moedas</span>
                <span>{gameState.coins}/{cost.coins}</span>
              </li>

              {Object.entries(cost.items).map(([itemId, qty]) => {
                const def = ITEMS[itemId as ItemId];
                const invQty = gameState.inventory[itemId as ItemId] || 0;
                const has = invQty >= (qty as number);
                return (
                  <li key={itemId} className={`flex justify-between items-center ${has ? 'text-green-700' : 'text-red-600'}`}>
                    <span className="flex items-center gap-1 text-xl" title={def?.name}>{def?.icon}</span>
                    <span className="text-sm">
                      {invQty}/{qty as number} {def?.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {!canUnlock && (
            <p className="text-red-600 text-xs font-bold bg-white/80 px-2 py-1 rounded w-full">
              Faltam requisitos para expandir.
            </p>
          )}

          {/* Action Button */}
          <button
            onClick={handleUnlockClick}
            disabled={!canUnlock}
            className={`w-full py-3 px-4 rounded-xl font-black text-lg text-white shadow-lg flex items-center justify-center gap-2 mt-2 transition-transform ${
              canUnlock
                ? 'bg-green-600 hover:bg-green-500 hover:scale-105 active:scale-95 border-b-4 border-green-800'
                : 'bg-gray-400 border-b-4 border-gray-500 cursor-not-allowed opacity-80'
            }`}
          >
            🔓 Desbloquear Terreno
          </button>
        </div>
      </div>
    </div>
  );
};
