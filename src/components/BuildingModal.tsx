import React, { useState, useEffect } from 'react';
import { FarmEntity, ItemId, BuildingType, Recipe } from '../types/game';
import { BUILDINGS, RECIPES, ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface BuildingModalProps {
  entity: FarmEntity | null;
  level: number;
  inventory: Partial<Record<ItemId, number>>;
  gems: number;
  onClose: () => void;
  onQueueRecipe: (entityId: string, recipe: Recipe) => void;
  onCollectCompletedItem: (entityId: string, index: number) => void;
  onCollectAllCompleted: (entityId: string) => void;
  onSpeedUpBuilding: (entityId: string, gemsCost: number) => void;
  onUnlockQueueSlot: (entityId: string, gemsCost: number) => void;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({
  entity,
  level,
  inventory,
  gems,
  onClose,
  onQueueRecipe,
  onCollectCompletedItem,
  onCollectAllCompleted,
  onSpeedUpBuilding,
  onUnlockQueueSlot,
}) => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  if (!entity || entity.type !== 'building' || !entity.buildingData) return null;

  const bData = entity.buildingData;
  const bDef = BUILDINGS[bData.buildingType];
  const buildingRecipes = RECIPES.filter((r) => r.building === bData.buildingType);

  const activeItem = bData.queue[0];
  const activeRecipe = activeItem ? RECIPES.find((r) => r.id === activeItem.recipeId) : null;
  const elapsed = activeItem ? (time - activeItem.startedAt) / 1000 : 0;
  const remaining = activeItem ? Math.max(0, Math.ceil(activeItem.durationSeconds - elapsed)) : 0;
  const progressPercent = activeItem
    ? Math.min(100, Math.round((elapsed / activeItem.durationSeconds) * 100))
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff9c4] via-[#fff59d] to-[#ffe082] border-4 border-[#f57f17] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-lg w-full relative flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-400/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 rounded-2xl border-2 border-white shadow flex items-center justify-center text-3xl">
              {bDef?.icon}
            </div>
            <div>
              <h2 className="text-amber-950 font-black text-lg sm:text-xl">
                {bDef?.name}
              </h2>
              <p className="text-xs text-amber-800 font-semibold">
                {bDef?.description}
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

        {/* Finished Ready Items Shelf */}
        {bData.completedItems.length > 0 && (
          <div className="bg-emerald-100 border-2 border-emerald-500 rounded-2xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-black text-emerald-950 whitespace-nowrap">
                ✨ Prontos:
              </span>
              <div className="flex gap-1.5">
                {bData.completedItems.map((itemId, idx) => (
                  <button
                    key={`${itemId}_${idx}`}
                    onClick={() => {
                      sound.playDing();
                      onCollectCompletedItem(entity.id, idx);
                    }}
                    className="w-10 h-10 bg-white rounded-xl border border-emerald-400 shadow-sm flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-transform"
                    title={`Coletar ${ITEMS[itemId]?.name}`}
                  >
                    {ITEMS[itemId]?.icon}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                sound.playDing();
                onCollectAllCompleted(entity.id);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3 py-2 rounded-xl shadow border border-white whitespace-nowrap active:scale-95 transition-all ml-2"
            >
              Coletar Tudo
            </button>
          </div>
        )}

        {/* Current Production Queue Section */}
        <div className="bg-amber-900/10 border-2 border-amber-400 rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
              Fila de Produção ({bData.queue.length}/{bData.queueSlots})
            </span>
            {bData.queue.length > 0 && (
              <button
                onClick={() => {
                  if (gems >= 1) {
                    onSpeedUpBuilding(entity.id, 1);
                  }
                }}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow border border-white flex items-center gap-1 active:scale-95"
              >
                ⚡ Acelerar (1 💎)
              </button>
            )}
          </div>

          {/* Active Item Bar */}
          {activeItem ? (
            <div className="flex flex-col gap-1 bg-white/80 p-2.5 rounded-xl border border-amber-300">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <span className="text-xl">{ITEMS[activeItem.recipeId]?.icon}</span>
                  <span>Produzindo: {ITEMS[activeItem.recipeId]?.name}</span>
                </span>
                <span className="text-amber-800 font-extrabold">{remaining}s</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-amber-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs font-bold text-amber-800/80">
              Instalação parada. Selecione uma receita abaixo para produzir!
            </div>
          )}

          {/* Slots Row */}
          <div className="flex gap-2 items-center overflow-x-auto py-1">
            {Array.from({ length: bData.queueSlots }).map((_, slotIdx) => {
              const item = bData.queue[slotIdx];
              return (
                <div
                  key={`slot_${slotIdx}`}
                  className="w-12 h-12 rounded-xl bg-white/90 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0"
                >
                  {item ? ITEMS[item.recipeId]?.icon : <span className="text-amber-300 text-xs font-bold">#{slotIdx + 1}</span>}
                </div>
              );
            })}

            {/* Unlock slot with Gems button */}
            {bData.queueSlots < 6 && (
              <button
                onClick={() => {
                  if (gems >= 5) {
                    onUnlockQueueSlot(entity.id, 5);
                  } else {
                    sound.playClick();
                  }
                }}
                className="h-12 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs border-2 border-white shadow flex items-center gap-1 shrink-0 active:scale-95"
                title="Desbloquear mais 1 espaço na fila"
              >
                <span>+1 Espaço</span>
                <span className="text-emerald-950 bg-emerald-200 px-1.5 py-0.5 rounded-md font-extrabold">
                  5 💎
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
            Receitas Disponíveis:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {buildingRecipes.map((recipe) => {
              const isUnlocked = level >= recipe.minLevel;
              const hasIngredients = recipe.ingredients.every(
                (ing) => (inventory[ing.itemId] || 0) >= ing.count
              );
              const isQueueFull = bData.queue.length >= bData.queueSlots;
              const canCraft = isUnlocked && hasIngredients && !isQueueFull;

              return (
                <div
                  key={recipe.id}
                  className={`p-3 rounded-2xl border-2 flex flex-col justify-between gap-2 transition-all ${
                    !isUnlocked
                      ? 'bg-amber-100/40 border-gray-300 opacity-60'
                      : canCraft
                      ? 'bg-white border-amber-300 hover:border-amber-500 shadow-md'
                      : 'bg-white/80 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-3xl">{ITEMS[recipe.id]?.icon}</span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-amber-950 truncate">
                          {recipe.name}
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                          +{recipe.xp} XP
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        ⏱️ {recipe.produceTimeSeconds}s
                      </span>
                    </div>
                  </div>

                  {/* Ingredients needed */}
                  <div className="flex flex-wrap gap-1.5 bg-amber-50/80 p-1.5 rounded-xl border border-amber-200/60">
                    {recipe.ingredients.map((ing) => {
                      const currentCount = inventory[ing.itemId] || 0;
                      const hasEnough = currentCount >= ing.count;
                      return (
                        <div
                          key={ing.itemId}
                          className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            hasEnough
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-red-100 text-red-900 border border-red-300'
                          }`}
                        >
                          <span>{ITEMS[ing.itemId]?.icon}</span>
                          <span>
                            {currentCount}/{ing.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Craft button */}
                  {isUnlocked ? (
                    <button
                      disabled={!canCraft}
                      onClick={() => {
                        sound.playQueue();
                        onQueueRecipe(entity.id, recipe);
                      }}
                      className={`w-full py-2 rounded-xl font-black text-xs shadow transition-all flex items-center justify-center gap-1 ${
                        canCraft
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 border border-white active:scale-95'
                          : isQueueFull
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isQueueFull
                        ? 'Fila Cheia'
                        : !hasIngredients
                        ? 'Faltam Ingredientes'
                        : 'Produzir'}
                    </button>
                  ) : (
                    <div className="w-full text-center py-1.5 bg-amber-100 text-red-700 text-[11px] font-black rounded-xl border border-red-200">
                      🔒 Desbloqueia no Nível {recipe.minLevel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
