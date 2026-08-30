import React, { useState } from 'react';
import {
  AnimalType,
  BuildingType,
  DecorationType,
  FarmEntity,
} from '../types/game';
import {
  ANIMAL_PENS,
  BUILDINGS,
  DECORATIONS,
} from '../constants/gameData';
import { sound } from '../utils/sound';

interface ShopModalProps {
  level: number;
  coins: number;
  entities: FarmEntity[];
  onClose: () => void;
  onBuyCropPlot: () => void;
  onBuyAnimalPen: (animalType: AnimalType) => void;
  onBuyBuilding: (buildingType: BuildingType) => void;
  onBuyDecoration: (decType: DecorationType) => void;
  onBuyBeeTree?: () => void;
}

type ShopCategory = 'crops' | 'animals' | 'buildings' | 'decorations';

export const ShopModal: React.FC<ShopModalProps> = ({
  level,
  coins,
  entities,
  onClose,
  onBuyCropPlot,
  onBuyAnimalPen,
  onBuyBuilding,
  onBuyDecoration,
  onBuyBeeTree,
}) => {
  const [category, setCategory] = useState<ShopCategory>('crops');

  // Count existing plots
  const currentPlots = entities.filter((e) => e.type === 'crop_plot').length;
  const maxAllowedPlots = Math.min(24, 6 + level * 2);
  const plotCost = 20 + currentPlots * 10;

  // Bee Tree state
  const hasBeeTree = entities.some((e) => e.type === 'bee_tree');
  const isBeeTreeUnlocked = level >= 30;
  const canAffordBeeTree = coins >= 20000;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff8e1] via-[#ffecb3] to-[#ffe082] border-4 border-[#ff8f00] rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl w-full relative flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-300 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => {
                sound.playClick();
                setCategory('crops');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all shrink-0 ${
                category === 'crops'
                  ? 'bg-amber-600 text-white border-white shadow scale-105'
                  : 'bg-white text-amber-900 border-amber-300'
              }`}
            >
              <span>🌾</span> Canteiros
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCategory('animals');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all shrink-0 ${
                category === 'animals'
                  ? 'bg-amber-600 text-white border-white shadow scale-105'
                  : 'bg-white text-amber-900 border-amber-300'
              }`}
            >
              <span>🐔</span> Animais
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCategory('buildings');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all shrink-0 ${
                category === 'buildings'
                  ? 'bg-amber-600 text-white border-white shadow scale-105'
                  : 'bg-white text-amber-900 border-amber-300'
              }`}
            >
              <span>🏭</span> Instalações
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCategory('decorations');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all shrink-0 ${
                category === 'decorations'
                  ? 'bg-amber-600 text-white border-white shadow scale-105'
                  : 'bg-white text-amber-900 border-amber-300'
              }`}
            >
              <span>🌻</span> Decorações
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white font-black flex items-center justify-center shadow-md active:scale-95 transition-all ml-2 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {/* Category: Crops / Plots */}
          {category === 'crops' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner">
                    🌱
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-amber-950">
                      Lote de Canteiro
                    </h3>
                    <p className="text-xs text-amber-800">
                      Terra fértil para plantar grãos e legumes.
                    </p>
                    <span className="text-[11px] font-bold text-amber-900">
                      Possui: {currentPlots} / {maxAllowedPlots}
                    </span>
                  </div>
                </div>

                <button
                  disabled={coins < plotCost || currentPlots >= maxAllowedPlots}
                  onClick={() => {
                    sound.playCoin();
                    onBuyCropPlot();
                  }}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs shadow border transition-all flex items-center gap-1 shrink-0 ${
                    coins >= plotCost && currentPlots < maxAllowedPlots
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-amber-950 border-white active:scale-95'
                      : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>🪙</span>
                  <span>{plotCost}</span>
                </button>
              </div>
            </div>
          )}

          {/* Category: Animals */}
          {category === 'animals' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(ANIMAL_PENS).map((pen) => {
                const isUnlocked = level >= pen.minLevel;
                const canAfford = coins >= pen.cost;
                const countExisting = entities.filter(
                  (e) => e.type === 'animal_pen' && e.animalData?.animalType === pen.type
                ).length;

                return (
                  <div
                    key={pen.type}
                    className={`p-3.5 bg-white rounded-2xl border-2 shadow-sm flex items-center justify-between gap-3 ${
                      !isUnlocked ? 'opacity-60 border-gray-300' : 'border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-amber-100 rounded-2xl border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                        {pen.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-amber-950">
                          {pen.penName}
                        </h4>
                        <p className="text-xs text-amber-800">
                          Comporta até {pen.maxAnimalsPerPen} {pen.name}s.
                        </p>
                        <span className="text-[10px] text-amber-900 font-bold">
                          Possui: {countExisting}
                        </span>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          sound.playCoin();
                          onBuyAnimalPen(pen.type);
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs shadow border transition-all flex items-center gap-1 shrink-0 ${
                          canAfford
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-amber-950 border-white active:scale-95'
                            : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>🪙</span>
                        <span>{pen.cost}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-200 shrink-0">
                        Nível {pen.minLevel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Category: Buildings & Special Structures */}
          {category === 'buildings' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Special Structure: Árvore de Abelhas (Bee Tree) */}
              <div
                className={`p-3.5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 shadow-sm flex items-center justify-between gap-3 ${
                  !isBeeTreeUnlocked ? 'opacity-60 border-gray-300' : 'border-amber-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-tr from-yellow-300 to-amber-400 rounded-2xl border-2 border-yellow-500 flex items-center justify-center text-3xl shadow-inner animate-pulse">
                    🌳🐝
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-amber-950">
                        Árvore de Abelhas
                      </h4>
                      <span className="bg-amber-800 text-yellow-300 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        MÁX 1
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 line-clamp-1">
                      Coleta néctar fresco com até 25 abelhas e 5 colmeias.
                    </p>
                    <span className="text-[10px] text-amber-900 font-bold">
                      {hasBeeTree ? '✅ Já Adquirida' : 'Disponível: 1 unidade'}
                    </span>
                  </div>
                </div>

                {hasBeeTree ? (
                  <span className="text-[11px] font-bold text-gray-600 bg-gray-200 px-2.5 py-1.5 rounded-xl border border-gray-300 shrink-0">
                    Comprado
                  </span>
                ) : isBeeTreeUnlocked ? (
                  <button
                    disabled={!canAffordBeeTree || !onBuyBeeTree}
                    onClick={() => {
                      if (onBuyBeeTree) {
                        sound.playCoin();
                        onBuyBeeTree();
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs shadow border transition-all flex items-center gap-1 shrink-0 ${
                      canAffordBeeTree
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-amber-950 border-white active:scale-95'
                        : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>🪙</span>
                    <span>20.000</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-200 shrink-0">
                    Nível 30
                  </span>
                )}
              </div>

              {Object.values(BUILDINGS).map((bld) => {
                const isUnlocked = level >= bld.minLevel;
                const canAfford = coins >= bld.cost;
                const countExisting = entities.filter(
                  (e) => e.type === 'building' && e.buildingData?.buildingType === bld.type
                ).length;

                return (
                  <div
                    key={bld.type}
                    className={`p-3.5 bg-white rounded-2xl border-2 shadow-sm flex items-center justify-between gap-3 ${
                      !isUnlocked ? 'opacity-60 border-gray-300' : 'border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-amber-100 rounded-2xl border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                        {bld.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-amber-950">
                          {bld.name}
                        </h4>
                        <p className="text-xs text-amber-800 line-clamp-1">
                          {bld.description}
                        </p>
                        <span className="text-[10px] text-amber-900 font-bold">
                          Possui: {countExisting}
                        </span>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          sound.playCoin();
                          onBuyBuilding(bld.type);
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs shadow border transition-all flex items-center gap-1 shrink-0 ${
                          canAfford
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-amber-950 border-white active:scale-95'
                            : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>🪙</span>
                        <span>{bld.cost}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-200 shrink-0">
                        Nível {bld.minLevel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Category: Decorations */}
          {category === 'decorations' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(DECORATIONS).map((dec) => {
                const isUnlocked = level >= dec.minLevel;
                const canAfford = coins >= dec.cost;

                return (
                  <div
                    key={dec.type}
                    className={`p-3.5 bg-white rounded-2xl border-2 shadow-sm flex items-center justify-between gap-3 ${
                      !isUnlocked ? 'opacity-60 border-gray-300' : 'border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-amber-100 rounded-2xl border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                        {dec.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-amber-950">
                          {dec.name}
                        </h4>
                        <span className="text-xs text-amber-800">
                          Enfeite para sua fazenda.
                        </span>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          sound.playCoin();
                          onBuyDecoration(dec.type);
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs shadow border transition-all flex items-center gap-1 shrink-0 ${
                          canAfford
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-amber-950 border-white active:scale-95'
                            : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span>🪙</span>
                        <span>{dec.cost}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-200 shrink-0">
                        Nível {dec.minLevel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
