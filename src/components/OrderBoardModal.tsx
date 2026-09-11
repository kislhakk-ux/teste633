import React, { useState, useEffect } from 'react';
import { TruckOrder, ItemId } from '../types/game';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface OrderBoardModalProps {
  orders: TruckOrder[];
  inventory: Partial<Record<ItemId, number>>;
  truckDeliveringUntil: number | null;
  gems: number;
  onClose: () => void;
  onSendOrder: (orderId: string) => void;
  onTrashOrder: (orderId: string) => void;
  onSpeedUpTruck: (gemsCost: number) => void;
}

export const OrderBoardModal: React.FC<OrderBoardModalProps> = ({
  orders,
  inventory,
  truckDeliveringUntil,
  gems,
  onClose,
  onSendOrder,
  onTrashOrder,
  onSpeedUpTruck,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<TruckOrder | null>(
    orders[0] || null
  );
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  const isTruckDelivering = truckDeliveringUntil !== null && time < truckDeliveringUntil;
  const truckRemainingSeconds = isTruckDelivering
    ? Math.max(0, Math.ceil((truckDeliveringUntil! - time) / 1000))
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#8d6e63] via-[#795548] to-[#5d4037] border-4 border-[#3e2723] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl w-full relative flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with wood grain styling */}
        <div className="flex items-center justify-between border-b-2 border-amber-900/40 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 rounded-2xl border-2 border-white shadow flex items-center justify-center text-3xl">
              📋
            </div>
            <div>
              <h2 className="text-amber-100 font-black text-lg sm:text-xl flex items-center gap-2">
                Quadro de Pedidos do Caminhão
              </h2>
              <p className="text-xs text-amber-200/80 font-semibold">
                Entregue encomendas para vizinhos e ganhe moedas e XP!
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

        {/* Truck Delivery Status Banner */}
        {isTruckDelivering && (
          <div className="bg-blue-900/90 border-2 border-blue-400 rounded-2xl p-3 flex items-center justify-between text-white shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚚</span>
              <div>
                <p className="font-extrabold text-sm text-blue-200">
                  Caminhão na estrada fazendo a entrega!
                </p>
                <p className="text-xs text-blue-300">
                  Retorna em {truckRemainingSeconds} segundos com sua recompensa.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (gems >= 1) {
                  onSpeedUpTruck(1);
                }
              }}
              className="bg-teal-500 hover:bg-teal-400 text-white font-black text-xs px-3 py-2 rounded-xl shadow border border-white flex items-center gap-1 active:scale-95"
            >
              ⚡ Voltar Já (1 💎)
            </button>
          </div>
        )}

        {/* Main Cork Board Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pr-1">
          {/* Order Cards Grid (Left 2 columns on desktop) */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {orders.map((ord, idx) => {
              const isSelected = selectedOrder?.id === ord.id;
              const hasAllItems = ord.items.every(
                (it) => (inventory[it.itemId] || 0) >= it.count
              );

              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 shadow-md ${
                    isSelected
                      ? 'bg-amber-100 border-yellow-400 ring-2 ring-yellow-400 scale-[1.02]'
                      : 'bg-[#fff8e1] border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {/* Push pin icon */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm drop-shadow">
                    📌
                  </div>

                  {/* Character Avatar & Dialogue */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl">{ord.characterAvatar}</span>
                    <span className="font-extrabold text-xs text-amber-950 truncate">
                      {ord.characterName}
                    </span>
                  </div>

                  {/* Items miniature list */}
                  <div className="flex flex-wrap gap-1 my-1">
                    {ord.items.map((it) => {
                      const countInInv = inventory[it.itemId] || 0;
                      const hasEnough = countInInv >= it.count;
                      return (
                        <div
                          key={it.itemId}
                          className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            hasEnough
                              ? 'bg-emerald-200 text-emerald-950 border border-emerald-400'
                              : 'bg-red-200 text-red-950 border border-red-400'
                          }`}
                        >
                          <span>{ITEMS[it.itemId]?.icon}</span>
                          <span>{countInInv}/{it.count}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rewards Footer */}
                  <div className="flex items-center justify-between text-[11px] font-black border-t border-amber-200 pt-1">
                    <span className="text-amber-900 flex items-center gap-0.5">
                      🪙 {ord.rewardCoins}
                    </span>
                    <span className="text-blue-700 flex items-center gap-0.5">
                      🌟 {ord.rewardXp} XP
                    </span>
                  </div>

                  {/* Ready check indicator */}
                  {hasAllItems && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white shadow">
                      ✓ Pronto
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Order Detail Panel (Right Column) */}
          <div className="bg-[#fff8e1] border-3 border-amber-400 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg">
            {selectedOrder ? (
              <>
                <div className="flex items-center gap-2.5 pb-2 border-b border-amber-200">
                  <div className="w-12 h-12 bg-amber-200 rounded-full border-2 border-amber-400 flex items-center justify-center text-3xl shadow">
                    {selectedOrder.characterAvatar}
                  </div>
                  <div>
                    <h3 className="font-black text-amber-950 text-sm">
                      {selectedOrder.characterName}
                    </h3>
                    <p className="text-[11px] text-amber-800 italic">
                      "{selectedOrder.dialogue}"
                    </p>
                  </div>
                </div>

                {/* Items required list */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black text-amber-950">
                    Itens Solicitados:
                  </span>
                  {selectedOrder.items.map((it) => {
                    const countInInv = inventory[it.itemId] || 0;
                    const hasEnough = countInInv >= it.count;
                    return (
                      <div
                        key={it.itemId}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs font-bold ${
                          hasEnough
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-red-50 border-red-300 text-red-950'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ITEMS[it.itemId]?.icon}</span>
                          <span>{ITEMS[it.itemId]?.name}</span>
                        </div>
                        <span>
                          {countInInv} / {it.count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Recompensa */}
                <div className="bg-amber-100/80 p-2.5 rounded-xl border border-amber-300 flex items-center justify-around text-xs font-black">
                  <div className="flex items-center gap-1 text-amber-950">
                    <span className="text-lg">🪙</span>
                    <span>+{selectedOrder.rewardCoins} Moedas</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-800">
                    <span className="text-lg">🌟</span>
                    <span>+{selectedOrder.rewardXp} XP</span>
                  </div>
                </div>

                {/* Buttons Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  {(() => {
                    const canSend =
                      !isTruckDelivering &&
                      selectedOrder.items.every(
                        (it) => (inventory[it.itemId] || 0) >= it.count
                      );

                    return (
                      <button
                        id="btn-send-truck"
                        disabled={!canSend}
                        onClick={() => {
                          sound.playTruck();
                          onSendOrder(selectedOrder.id);
                        }}
                        className={`w-full py-3 rounded-2xl font-black text-sm shadow-lg border-2 border-white flex items-center justify-center gap-2 transition-all ${
                          canSend
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white active:scale-95'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span>🚚</span>
                        {isTruckDelivering
                          ? 'Caminhão em Trânsito...'
                          : canSend
                          ? 'Despachar Caminhão!'
                          : 'Faltam Produtos'}
                      </button>
                    );
                  })()}

                  <button
                    onClick={() => onTrashOrder(selectedOrder.id)}
                    className="w-full py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-xl border border-red-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    🗑️ Descartar Pedido (Novo em 10s)
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-amber-800 text-xs font-bold">
                Selecione uma encomenda no quadro para ver os detalhes!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
