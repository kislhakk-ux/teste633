import React from 'react';
import { FarmVisitor, ItemId } from '../types/game';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface VisitorModalProps {
  visitor: FarmVisitor | null;
  inventory: Partial<Record<ItemId, number>>;
  onClose: () => void;
  onAcceptDeal: (visitor: FarmVisitor) => void;
  onRefuseDeal: () => void;
}

export const VisitorModal: React.FC<VisitorModalProps> = ({
  visitor,
  inventory,
  onClose,
  onAcceptDeal,
  onRefuseDeal,
}) => {
  if (!visitor) return null;

  const itemDef = ITEMS[visitor.requestedItem];
  const countInInventory = inventory[visitor.requestedItem] || 0;
  const hasEnough = countInInventory >= visitor.count;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff8e1] via-[#ffecb3] to-[#ffe082] border-4 border-[#ff8f00] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-amber-300 pb-2">
          <span className="font-black text-amber-950 text-base flex items-center gap-2">
            <span>👋</span> Visitante na Porteira
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow"
          >
            ✕
          </button>
        </div>

        {/* Character Avatar & Dialogue bubble */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-amber-200 rounded-full border-3 border-amber-500 flex items-center justify-center text-5xl shadow-md">
            {visitor.avatar}
          </div>
          <h3 className="font-black text-amber-950 text-base">
            {visitor.name}
          </h3>
          <div className="bg-white/90 p-3 rounded-2xl border border-amber-300 shadow-sm text-center">
            <p className="text-xs text-amber-900 font-semibold italic">
              "{visitor.dialogue}"
            </p>
          </div>
        </div>

        {/* Trade Details Box */}
        <div className="w-full bg-white/80 p-3 rounded-2xl border-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{itemDef?.icon}</span>
            <div className="flex flex-col">
              <span className="font-black text-xs text-amber-950">
                {visitor.count}x {itemDef?.name}
              </span>
              <span className="text-[10px] text-amber-800">
                Seu estoque: {countInInventory}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-xl border border-yellow-400 font-black text-xs text-amber-950">
            <span>🪙</span>
            <span>+{visitor.offeredCoins}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onRefuseDeal();
            }}
            className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 font-black text-xs rounded-xl border border-red-300 transition-colors"
          >
            Desculpe, agora não
          </button>

          <button
            disabled={!hasEnough}
            onClick={() => {
              sound.playCoin();
              onAcceptDeal(visitor);
            }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs shadow border transition-all flex items-center justify-center gap-1 ${
              hasEnough
                ? 'bg-green-600 hover:bg-green-500 text-white border-white active:scale-95'
                : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
            }`}
          >
            {hasEnough ? 'Vender Agora! 🤝' : 'Faltam Itens'}
          </button>
        </div>
      </div>
    </div>
  );
};
