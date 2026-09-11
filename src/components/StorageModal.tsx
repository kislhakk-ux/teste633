import React, { useState } from 'react';
import { ItemId, StorageType } from '../types/game';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface StorageModalProps {
  type: StorageType;
  inventory: Partial<Record<ItemId, number>>;
  siloLevel: number;
  barnLevel: number;
  gems: number;
  coins: number;
  onClose: () => void;
  onUpgradeStorage: (type: StorageType) => void;
  onSellItem: (itemId: ItemId, count: number) => void;
}

export const StorageModal: React.FC<StorageModalProps> = ({
  type,
  inventory,
  siloLevel,
  barnLevel,
  gems,
  coins,
  onClose,
  onUpgradeStorage,
  onSellItem,
}) => {
  const [activeTab, setActiveTab] = useState<StorageType>(type);
  const [selectedSellItem, setSelectedSellItem] = useState<ItemId | null>(null);
  const [sellAmount, setSellAmount] = useState<number>(1);

  const capacity = activeTab === 'silo' ? siloLevel * 50 : barnLevel * 50;
  const currentLevel = activeTab === 'silo' ? siloLevel : barnLevel;

  // Filter items stored in current tab
  const itemsInStorage = (Object.entries(inventory) as [ItemId, number][])
    .filter(([id, count]) => {
      const def = ITEMS[id];
      return def && def.storage === activeTab && count > 0;
    })
    .map(([id, count]) => ({
      def: ITEMS[id],
      count,
    }));

  const totalUsed = itemsInStorage.reduce((acc, it) => acc + Number(it.count), 0);
  const percentFull = Math.min(100, Math.round((totalUsed / capacity) * 100));

  // Required materials for upgrade
  const reqMaterials =
    activeTab === 'silo'
      ? [
          { id: 'nail' as ItemId, count: siloLevel * 2 },
          { id: 'screw' as ItemId, count: siloLevel * 2 },
        ]
      : [
          { id: 'wood_plank' as ItemId, count: barnLevel * 2 },
          { id: 'bolt' as ItemId, count: barnLevel * 2 },
        ];

  const hasAllUpgradeMaterials = reqMaterials.every(
    (mat) => (inventory[mat.id] || 0) >= mat.count
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff8e1] via-[#ffecb3] to-[#ffe082] border-4 border-[#f57f17] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-xl w-full relative flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b-2 border-amber-300 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('silo');
                setSelectedSellItem(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-sm border-2 transition-all ${
                activeTab === 'silo'
                  ? 'bg-amber-600 text-white border-white shadow-md scale-105'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>🌾</span> Silo de Grãos
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('barn');
                setSelectedSellItem(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-sm border-2 transition-all ${
                activeTab === 'barn'
                  ? 'bg-red-700 text-white border-white shadow-md scale-105'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>🛖</span> Celeiro
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white font-black flex items-center justify-center shadow-md active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Capacity Bar & Upgrade Area */}
        <div className="bg-amber-900/10 border-2 border-amber-400 rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-black text-amber-950">
            <span>
              Capacidade do {activeTab === 'silo' ? 'Silo' : 'Celeiro'} (Nível {currentLevel}):
            </span>
            <span
              className={
                totalUsed >= capacity ? 'text-red-700 font-black' : 'text-amber-900'
              }
            >
              {totalUsed} / {capacity} unidades ({percentFull}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden border border-amber-300 shadow-inner">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                totalUsed >= capacity
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${percentFull}%` }}
            />
          </div>

          {/* Upgrade Section Box */}
          <div className="flex items-center justify-between bg-white/90 p-2 rounded-xl border border-amber-300 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950">
                Expandir (+50 vagas):
              </span>
              <div className="flex gap-1.5">
                {reqMaterials.map((mat) => {
                  const hasCount = inventory[mat.id] || 0;
                  const enough = hasCount >= mat.count;
                  return (
                    <div
                      key={mat.id}
                      className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${
                        enough
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-red-100 text-red-900 border-red-300'
                      }`}
                    >
                      <span>{ITEMS[mat.id]?.icon}</span>
                      <span>
                        {hasCount}/{mat.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              id="btn-upgrade-storage"
              disabled={!hasAllUpgradeMaterials}
              onClick={() => onUpgradeStorage(activeTab)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs shadow border transition-all ${
                hasAllUpgradeMaterials
                  ? 'bg-green-600 hover:bg-green-500 text-white border-white active:scale-95'
                  : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
              }`}
            >
              Melhorar ⬆️
            </button>
          </div>
        </div>

        {/* Item Grid */}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-64 pr-1">
          {itemsInStorage.length === 0 ? (
            <div className="text-center py-10 text-amber-800 text-sm font-bold">
              Nenhum item armazenado no {activeTab === 'silo' ? 'Silo' : 'Celeiro'} ainda!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {itemsInStorage.map(({ def, count }) => {
                const isSelected = selectedSellItem === def.id;

                return (
                  <div
                    key={def.id}
                    onClick={() => {
                      setSelectedSellItem(def.id);
                      setSellAmount(1);
                    }}
                    className={`p-2.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-1 shadow-sm ${
                      isSelected
                        ? 'bg-amber-200 border-amber-600 scale-105 shadow-md'
                        : 'bg-white hover:bg-amber-50 border-amber-300'
                    }`}
                  >
                    <span className="text-3xl">{def.icon}</span>
                    <span className="font-extrabold text-xs text-amber-950 text-center truncate w-full">
                      {def.name}
                    </span>
                    <div className="flex items-center justify-between w-full text-[11px] font-bold text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded-md">
                      <span>Qtd:</span>
                      <span className="text-green-800 font-extrabold">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Sell Bar (if item selected) */}
        {selectedSellItem && (
          <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{ITEMS[selectedSellItem]?.icon}</span>
              <div>
                <p className="font-black text-xs text-amber-950">
                  Vender {ITEMS[selectedSellItem]?.name}
                </p>
                <p className="text-[11px] text-amber-800">
                  Preço unitário: 🪙 {ITEMS[selectedSellItem]?.basePrice} moedas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-amber-300">
                <button
                  onClick={() => setSellAmount((p) => Math.max(1, p - 1))}
                  className="w-6 h-6 bg-amber-200 hover:bg-amber-300 rounded font-bold text-xs"
                >
                  -
                </button>
                <span className="font-black text-xs px-2 text-amber-950">
                  {sellAmount}
                </span>
                <button
                  onClick={() =>
                    setSellAmount((p) =>
                      Math.min(inventory[selectedSellItem] || 1, p + 1)
                    )
                  }
                  className="w-6 h-6 bg-amber-200 hover:bg-amber-300 rounded font-bold text-xs"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  sound.playCoin();
                  onSellItem(selectedSellItem, sellAmount);
                  setSelectedSellItem(null);
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-amber-950 font-black text-xs px-4 py-2 rounded-xl shadow border border-white flex items-center gap-1 active:scale-95"
              >
                <span>🪙</span> Vender (+
                {(ITEMS[selectedSellItem]?.basePrice || 1) * sellAmount})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
