import React from 'react';
import { FarmEntity, ItemId, AnimalType } from '../types/game';
import { CROPS, ANIMAL_PENS, ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface ActionRadialProps {
  selectedEntity: FarmEntity | null;
  level: number;
  inventory: Partial<Record<ItemId, number>>;
  gems: number;
  onClose: () => void;
  onPlantCrop: (entityId: string, cropId: ItemId) => void;
  onHarvestCrop: (entityId: string) => void;
  onFeedAnimals: (entityId: string) => void;
  onCollectAnimal: (entityId: string, idx: number) => void;
  onSpeedUpCrop: (entityId: string, gemsCost: number) => void;
  onSpeedUpAnimal: (entityId: string, gemsCost: number) => void;
  onOpenBuildingModal: (entity: FarmEntity) => void;
  onOpenOrderBoard: () => void;
  onOpenRoadsideShop: () => void;
  onOpenLuckyWheel: () => void;
  onOpenSilo: () => void;
  onOpenBarn: () => void;
  onOpenFarmhouse: () => void;
  onRemoveDeadEntity?: (entityId: string) => void;
  unlockedParcelIds?: string[];
  onDeliveryBoatClick?: () => void;
}

export const ActionRadial: React.FC<ActionRadialProps> = ({
  selectedEntity,
  level,
  inventory,
  gems,
  onClose,
  onPlantCrop,
  onHarvestCrop,
  onFeedAnimals,
  onCollectAnimal,
  onSpeedUpCrop,
  onSpeedUpAnimal,
  onOpenBuildingModal,
  onOpenOrderBoard,
  onOpenRoadsideShop,
  onOpenLuckyWheel,
  onOpenSilo,
  onOpenBarn,
  onOpenFarmhouse,
  onRemoveDeadEntity,
}) => {
  if (!selectedEntity) return null;

  // Auto-route special buildings directly
  if (selectedEntity.type === 'building') {
    return (
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center p-4">
        <div className="bg-amber-950/90 border-2 border-amber-400 p-4 rounded-3xl shadow-2xl pointer-events-auto flex flex-col items-center gap-3">
          <h3 className="text-white font-black text-sm">
            {ITEMS[selectedEntity.buildingData?.buildingType as ItemId]?.name || 'Edifício'}
          </h3>
          <button
            onClick={() => onOpenBuildingModal(selectedEntity)}
            className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-6 py-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 text-sm active:scale-95"
          >
            🏭 Abrir Produção
          </button>
          <button
            onClick={onClose}
            className="text-amber-300 text-xs hover:underline mt-1"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (selectedEntity.type === 'order_board') {
    onOpenOrderBoard();
    return null;
  }
  if (selectedEntity.type === 'roadside_shop') {
    onOpenRoadsideShop();
    return null;
  }
  if (selectedEntity.type === 'lucky_wheel') {
    onOpenLuckyWheel();
    return null;
  }
  if (selectedEntity.type === 'silo') {
    onOpenSilo();
    return null;
  }
  if (selectedEntity.type === 'barn') {
    onOpenBarn();
    return null;
  }
  if (selectedEntity.type === 'farmhouse') {
    onOpenFarmhouse();
    return null;
  }

  // DEAD OBSTACLES OR WILTED NECTAR BUSH
  const isDeadNectarBush = selectedEntity.type === 'nectar_bush' && selectedEntity.nectarBushData && selectedEntity.nectarBushData.nectarLeft <= 0;
  if (selectedEntity.type === 'dead_tree' || selectedEntity.type === 'dead_bush' || isDeadNectarBush) {
    const isTree = selectedEntity.type === 'dead_tree';
    const toolNeeded: ItemId = isTree ? 'saw' : 'axe';
    const toolName = toolNeeded === 'axe' ? 'Machadinha' : 'Serrote';
    const toolIcon = toolNeeded === 'axe' ? '🪓' : '🪚';
    const toolCount = inventory[toolNeeded] || 0;
    const hasTool = toolCount > 0;

    return (
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-gradient-to-b from-[#fff8e1] to-[#ffecb3] border-4 border-[#ff8f00] rounded-3xl p-5 shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-amber-950 font-black text-lg flex items-center gap-2">
              <span>{isTree ? '🌳' : '🥀'}</span> {isTree ? 'Árvore Seca' : 'Arbusto Seco'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-semibold text-amber-900 leading-relaxed">
              Este obstáculo está morto e esgotado. Use uma ferramenta para cortá-lo e liberar espaço em seu terreno!
            </p>
            <div className="flex items-center gap-2 bg-white/80 border border-amber-300 px-4 py-2 rounded-2xl shadow-xs mt-1">
              <span className="text-2xl">{toolIcon}</span>
              <span className="text-xs font-bold text-amber-950">
                {toolName} necessário
              </span>
            </div>
            <p className={`text-xs font-black mt-1 ${hasTool ? 'text-green-700' : 'text-red-600 animate-pulse'}`}>
              Disponível no Celeiro: {toolCount}
            </p>
          </div>

          <button
            onClick={() => {
              if (onRemoveDeadEntity) {
                onRemoveDeadEntity(selectedEntity.id);
              }
            }}
            disabled={!hasTool}
            className={`w-full py-3 rounded-2xl font-black text-sm shadow-lg border-2 border-white flex items-center justify-center gap-2 transition-all ${
              hasTool
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 active:scale-95 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{toolIcon}</span> {hasTool ? `Remover Obstáculo (-1)` : `Falta de ${toolName}`}
          </button>
        </div>
      </div>
    );
  }

  // CROP PLOT ACTIONS
  if (selectedEntity.type === 'crop_plot') {
    return null;
  }

  // ANIMAL PEN ACTIONS
  if (selectedEntity.type === 'animal_pen') {
    const pen = selectedEntity.animalData;
    if (!pen) return null;
    const penDef = ANIMAL_PENS[pen.animalType];
    const feedItem = ITEMS[penDef.feedId];
    const feedCount = inventory[penDef.feedId] || 0;
    const now = Date.now();

    return (
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-gradient-to-b from-[#fff8e1] to-[#ffecb3] border-4 border-[#ff8f00] rounded-3xl p-5 shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-amber-950 font-black text-lg flex items-center gap-2">
              <span>{penDef.icon}</span> {penDef.penName}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow"
            >
              ✕
            </button>
          </div>

          {/* Animals List in Pen */}
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs font-bold text-amber-900">
              Estado dos animais ({pen.animals.length}/{penDef.maxAnimalsPerPen}):
            </p>
            <div className="flex flex-col gap-2">
              {pen.animals.map((animal, idx) => {
                const isFed = animal.fedAt !== null;
                const elapsed = animal.fedAt ? (now - animal.fedAt) / 1000 : 0;
                const isReady = isFed && elapsed >= penDef.produceTimeSeconds;

                return (
                  <div
                    key={animal.id}
                    className="flex items-center justify-between bg-white/90 p-2.5 rounded-2xl border border-amber-300 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{penDef.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-amber-950">
                          {penDef.name} #{idx + 1}
                        </span>
                        <span className="text-[10px] text-amber-800">
                          {isReady
                            ? '✨ Pronto para coleta!'
                            : isFed
                            ? `Produzindo: ${Math.max(0, Math.ceil(penDef.produceTimeSeconds - elapsed))}s`
                            : 'Com fome'}
                        </span>
                      </div>
                    </div>

                    {isReady ? (
                      <button
                        onClick={() => {
                          onCollectAnimal(selectedEntity.id, idx);
                        }}
                        className="bg-green-500 hover:bg-green-400 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow border border-white flex items-center gap-1 active:scale-95"
                      >
                        {ITEMS[penDef.produceId]?.icon} Coletar
                      </button>
                    ) : isFed ? (
                      <button
                        onClick={() => {
                          if (gems >= 1) {
                            onSpeedUpAnimal(selectedEntity.id, 1);
                          }
                        }}
                        className="bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold px-2 py-1 rounded-xl shadow flex items-center gap-1 active:scale-95"
                      >
                        ⚡ 1 💎
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                        Alimentar 🥣
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feed Button */}
          <div className="w-full flex flex-col gap-1.5 pt-2 border-t border-amber-300/60">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950">
              <span>{feedItem?.icon} {feedItem?.name}</span>
              <span className={feedCount > 0 ? 'text-green-700' : 'text-red-600'}>
                Em estoque: {feedCount}
              </span>
            </div>
            <button
              id="btn-feed-animals"
              disabled={feedCount <= 0}
              onClick={() => {
                onFeedAnimals(selectedEntity.id);
              }}
              className={`w-full py-3 rounded-2xl font-black text-sm shadow-lg border-2 border-white flex items-center justify-center gap-2 transition-all ${
                feedCount > 0
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>🥣</span> Alimentar Animais Famintos
            </button>
            {feedCount <= 0 && (
              <p className="text-[11px] text-red-700 text-center font-semibold">
                Produza mais ração no Moinho de Ração!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle Obstacles and Dead Trees
  if (
    selectedEntity.type === 'obstacle'
  ) {
    let toolRequired: ItemId = 'axe';
    let toolName = 'Machado';
    let icon = '🪓';
    let actionName = 'Cortar';

    if (selectedEntity.type === 'obstacle') {
      const oType = selectedEntity.obstacleData?.type;
      if (oType === 'pine' || oType === 'bush') { toolRequired = 'axe'; toolName = 'Machado'; icon = '🪓'; }
      if (oType === 'oak') { toolRequired = 'saw'; toolName = 'Serrote'; icon = '🪚'; actionName = 'Serrar'; }
      if (oType === 'rock') { toolRequired = 'dynamite'; toolName = 'Dinamite'; icon = '🧨'; actionName = 'Explodir'; }
    }

    const toolCount = inventory[toolRequired] || 0;

    return (
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center p-4">
        <div className="bg-amber-950/90 border-2 border-amber-400 p-4 rounded-3xl shadow-2xl pointer-events-auto flex flex-col items-center gap-3 w-48">
          <div className="flex w-full justify-between items-center mb-1 border-b border-amber-700/50 pb-2">
            <h3 className="text-white font-black text-sm">Limpar Terreno</h3>
            <button onClick={onClose} className="text-amber-300 hover:text-white bg-amber-900/50 rounded-full w-6 h-6 flex items-center justify-center">
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl animate-bounce">{icon}</div>
            <p className="text-amber-100 text-xs font-bold text-center">
              Você precisa de 1x {toolName}
            </p>
            <p className={toolCount > 0 ? 'text-green-400 text-[10px] font-black' : 'text-red-400 text-[10px] font-black'}>
              Em estoque: {toolCount}
            </p>
          </div>

          <button
            disabled={toolCount <= 0}
            onClick={() => onRemoveDeadEntity?.(selectedEntity.id)}
            className={`w-full py-2.5 rounded-2xl font-black text-sm shadow-lg border-2 flex items-center justify-center gap-2 transition-all mt-2 ${
              toolCount > 0
                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 border-white text-white active:scale-95'
                : 'bg-gray-400 border-gray-300 text-gray-100 cursor-not-allowed opacity-70'
            }`}
          >
            {icon} {actionName}
          </button>
        </div>
      </div>
    );
  }

  return null;
};
