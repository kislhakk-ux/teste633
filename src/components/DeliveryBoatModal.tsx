import React from 'react';
import { GameState, ItemId } from '../types/game';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface DeliveryBoatModalProps {
  gameState: GameState;
  onClose: () => void;
  onFillCrate: (crateId: string) => void;
  onSendBoat: () => void;
}

export const DeliveryBoatModal: React.FC<DeliveryBoatModalProps> = ({
  gameState,
  onClose,
  onFillCrate,
  onSendBoat,
}) => {
  const boat = gameState.deliveryBoat;
  if (!boat || boat.status !== 'docked') return null;

  const allFilled = boat.crates.every((c) => c.isFilled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#FFF8E7] w-full max-w-2xl rounded-[32px] shadow-2xl border-4 border-[#8D6E63] relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#5D4037] text-white p-4 rounded-t-[28px] border-b-4 border-[#3E2723] flex justify-between items-center relative overflow-hidden">
          <div className="absolute -left-10 top-0 opacity-20 text-6xl">🚢</div>
          <h2 className="text-2xl font-black ml-10 drop-shadow-md z-10 uppercase tracking-widest text-amber-200">
            Barco Fluvial
          </h2>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 bg-red-500 hover:bg-red-400 text-white rounded-full font-black border-2 border-red-700 shadow-lg active:scale-95 transition-transform z-10"
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-[#FFF8E7] to-[#FFECB3]">
          <div className="mb-6 flex items-center justify-between bg-amber-100 p-4 rounded-2xl border-2 border-amber-300">
            <div>
              <h3 className="text-lg font-bold text-amber-900">Pedidos do Barco</h3>
              <p className="text-amber-800 text-sm font-medium">Preencha todas as caixas para enviar o barco e ganhar recompensas extras!</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {boat.crates.map((crate) => {
              const itemDef = ITEMS[crate.itemId];
              const owned = gameState.inventory[crate.itemId] || 0;
              const canFill = owned >= crate.count && !crate.isFilled;

              return (
                <div
                  key={crate.id}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-4 shadow-md transition-all ${
                    crate.isFilled
                      ? 'bg-green-100 border-green-500 opacity-90'
                      : 'bg-white border-amber-400'
                  }`}
                >
                  <div className="text-4xl mb-2 filter drop-shadow-sm">{itemDef?.icon || '📦'}</div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-700 uppercase">{itemDef?.name || 'Item'}</p>
                    {crate.isFilled ? (
                      <p className="text-green-700 font-black mt-1 text-sm bg-green-200 px-3 py-1 rounded-full shadow-inner">
                        ✓ CHEIA
                      </p>
                    ) : (
                      <>
                        <p className="text-lg font-black text-amber-900 my-1">{crate.count}</p>
                        <p className={`text-xs font-bold mb-2 ${owned >= crate.count ? 'text-green-600' : 'text-red-500'}`}>
                          Você tem: {owned}
                        </p>
                        <button
                          disabled={!canFill}
                          onClick={() => {
                            sound.playClick();
                            onFillCrate(crate.id);
                          }}
                          className={`w-full py-2 rounded-xl font-black text-xs shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                            canFill
                              ? 'bg-amber-400 hover:bg-amber-300 border-amber-600 text-amber-950'
                              : 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed opacity-70'
                          }`}
                        >
                          ENCHER
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-50 rounded-b-[28px] border-t-4 border-[#8D6E63] flex justify-end gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-3 rounded-2xl font-black text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all"
          >
            VOLTAR
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSendBoat();
            }}
            className={`px-8 py-3 rounded-2xl font-black text-sm text-white shadow-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 ${
              allFilled
                ? 'bg-green-500 hover:bg-green-400 border-green-700 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-400 border-blue-700'
            }`}
          >
            {allFilled ? '🚢 ENVIAR CHEIO!' : '🚢 ENVIAR AGORA'}
          </button>
        </div>
      </div>
    </div>
  );
};
