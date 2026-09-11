import React, { useState } from 'react';
import { LakeEntity, LakeEntityType, LakeTerrainType } from '../../types/adm';
import { sound } from '../../utils/sound';

interface AdmToolbarProps {
  activeTab: 'objects' | 'terrain' | 'transform';
  setActiveTab: (tab: 'objects' | 'terrain' | 'transform') => void;
  // Object creation & selection
  selectedEntity: LakeEntity | null;
  entityToPlace: LakeEntityType | null;
  setEntityToPlace: (type: LakeEntityType | null) => void;
  onDeleteSelectedEntity: () => void;
  onDuplicateSelectedEntity: () => void;
  onScaleEntity: (delta: number) => void;
  onFlipEntity: () => void;
  onNudgeEntity: (dx: number, dy: number) => void;
  // Terrain & Selection
  isSelectingArea: boolean;
  setIsSelectingArea: (val: boolean) => void;
  selectedTilesCount: number;
  onApplyTerrainToSelected: (type: LakeTerrainType) => void;
  onClearTileSelection: () => void;
  onSelectAllTiles: () => void;
  onExpandLakeOutward: () => void;
  onResetTerrain: () => void;
  // Global actions
  onSaveAll: () => void;
  onResetAll: () => void;
  onCloseAdm: () => void;
}

const PALETTE_OBJECTS: { type: LakeEntityType; label: string; icon: string; category: string }[] = [
  { type: 'cabin', label: 'Cabana de Pesca', icon: '🏠', category: 'Estruturas' },
  { type: 'waterfall', label: 'Cachoeira 3D', icon: '🌊', category: 'Estruturas' },
  { type: 'lure_maker', label: 'Bancada Iscas', icon: '🔨', category: 'Estruturas' },
  { type: 'net_maker', label: 'Fabricador Redes', icon: '🕸️', category: 'Estruturas' },
  { type: 'duck_salon', label: 'Salão de Patos', icon: '🛁', category: 'Estruturas' },
  { type: 'fishing_spot', label: 'Ponto de Pesca', icon: '🎣', category: 'Pesca' },
  { type: 'shrimp_trap', label: 'Covo de Lagosta', icon: '🦞', category: 'Pesca' },
  { type: 'duck', label: 'Pato Nadando', icon: '🦆', category: 'Natureza' },
  { type: 'pine', label: 'Pinheiro 3D', icon: '🌲', category: 'Natureza' },
  { type: 'lake_tree', label: 'Árvore do Lago', icon: '🌳', category: 'Natureza' },
  { type: 'water_log', label: 'Tronco com Barril', icon: '🪵', category: 'Decoração' },
  { type: 'river_stones', label: 'Pedras de Rio', icon: '🪨', category: 'Decoração' },
  { type: 'cattails', label: 'Taboas do Lago', icon: '🌾', category: 'Decoração' },
  { type: 'water_lily', label: 'Vitória-Régia', icon: '🪷', category: 'Decoração' },
  { type: 'lantern_post', label: 'Poste Lanterna', icon: '🏮', category: 'Decoração' },
  { type: 'rowboat', label: 'Barco de Madeira', icon: '⛵', category: 'Decoração' },
  { type: 'fisherman', label: 'Pescador Angus', icon: '👨‍🌾', category: 'Personagens' },
];

export const AdmToolbar: React.FC<AdmToolbarProps> = ({
  activeTab,
  setActiveTab,
  selectedEntity,
  entityToPlace,
  setEntityToPlace,
  onDeleteSelectedEntity,
  onDuplicateSelectedEntity,
  onScaleEntity,
  onFlipEntity,
  onNudgeEntity,
  isSelectingArea,
  setIsSelectingArea,
  selectedTilesCount,
  onApplyTerrainToSelected,
  onClearTileSelection,
  onSelectAllTiles,
  onExpandLakeOutward,
  onResetTerrain,
  onSaveAll,
  onResetAll,
  onCloseAdm,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  const categories = ['Todas', 'Estruturas', 'Pesca', 'Natureza', 'Decoração'];

  const filteredObjects = categoryFilter === 'Todas'
    ? PALETTE_OBJECTS
    : PALETTE_OBJECTS.filter((o) => o.category === categoryFilter);

  return (
    <div className="absolute bottom-3 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-2xl w-full z-40 bg-gradient-to-b from-[#7A4B20]/95 via-[#5A3414]/95 to-[#3B1F09]/95 backdrop-blur-md rounded-3xl border-3 border-[#F5D061] shadow-[0_12px_40px_rgba(0,0,0,0.8)] text-amber-50 p-2.5 sm:p-3 select-none flex flex-col gap-2 pointer-events-auto">
      {/* Top Header Controls: Title & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-amber-500/50 pb-2 px-1 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl bg-amber-500/30 p-1 rounded-lg border border-amber-300/40">👑</span>
          <div>
            <span className="font-black text-xs sm:text-sm text-yellow-300 tracking-wide uppercase">
              MODO ADM
            </span>
            <span className="hidden sm:inline text-[10px] text-amber-300/80 ml-2 font-semibold">
              Construção & Terreno Livre
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-amber-950/80 p-1 rounded-2xl border border-amber-700/60">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('objects');
              setIsSelectingArea(false);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'objects'
                ? 'bg-amber-500 text-amber-950 shadow-md scale-105'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            📦 Objetos
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('terrain');
              setIsSelectingArea(true);
              setEntityToPlace(null);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'terrain'
                ? 'bg-cyan-500 text-cyan-950 shadow-md scale-105'
                : 'text-cyan-200 hover:text-white'
            }`}
          >
            🌊 Estender Lago
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('transform');
              setIsSelectingArea(false);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'transform'
                ? 'bg-emerald-500 text-emerald-950 shadow-md scale-105'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            🖐️ Mover/Editar
          </button>
        </div>

        {/* Close ADM Button */}
        <button
          onClick={() => {
            sound.playClick();
            onCloseAdm();
          }}
          className="w-7 h-7 rounded-full bg-red-600/90 hover:bg-red-500 border border-white text-white font-black text-xs flex items-center justify-center active:scale-90 transition-transform shadow cursor-pointer ml-1"
          title="Fechar painel ADM"
        >
          ✕
        </button>
      </div>

      {/* TAB 1: OBJECTS PALETTE (Criar novos objetos) */}
      {activeTab === 'objects' && (
        <div className="flex flex-col gap-2 animate-in fade-in duration-150">
          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setCategoryFilter(cat);
                }}
                className={`px-2.5 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-amber-400 text-amber-950 border-white font-black shadow-sm'
                    : 'bg-amber-900/60 border-amber-700/60 text-amber-200 hover:bg-amber-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
            {entityToPlace && (
              <button
                onClick={() => {
                  sound.playClick();
                  setEntityToPlace(null);
                }}
                className="ml-auto bg-red-700/80 hover:bg-red-600 text-white px-2 py-0.5 rounded-full border border-red-400 text-[10px] font-bold cursor-pointer"
              >
                Cancelar Inserção
              </button>
            )}
          </div>

          {/* Palette Items Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredObjects.map((item) => {
              const isSelected = entityToPlace === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    sound.playPop();
                    setEntityToPlace(isSelected ? null : item.type);
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-yellow-300 to-amber-500 border-white text-amber-950 shadow-lg scale-105'
                      : 'bg-amber-950/60 hover:bg-amber-900/80 border-amber-600/50 text-amber-100 active:scale-95'
                  }`}
                >
                  <span className="text-2xl drop-shadow">{item.icon}</span>
                  <span className="text-[10px] font-black text-center truncate w-full mt-0.5">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {entityToPlace ? (
            <div className="bg-amber-400 text-amber-950 text-xs font-black py-1 px-3 rounded-xl text-center animate-pulse shadow-md flex items-center justify-center gap-1.5">
              <span>📍</span>
              <span>Clique em qualquer lugar do lago ou margem para colocar o objeto!</span>
            </div>
          ) : (
            <div className="text-[11px] text-amber-300/80 text-center">
              Escolha um item acima e clique no mapa para posicioná-lo.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TERRAIN EXPANSION (Estender Lago / Expandir Terreno) */}
      {activeTab === 'terrain' && (
        <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs bg-cyan-950/70 p-2 rounded-2xl border border-cyan-500/40">
            <div className="flex items-center gap-1.5 text-cyan-200">
              <span className="text-base animate-bounce">🖌️</span>
              <span className="font-bold">
                {selectedTilesCount > 0
                  ? `${selectedTilesCount} quadrante(s) selecionado(s)`
                  : 'Arraste ou clique no mapa para selecionar a área do lago'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectAllTiles();
                }}
                className="bg-cyan-800 hover:bg-cyan-700 text-cyan-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-cyan-400 cursor-pointer"
              >
                Selecionar Tudo
              </button>
              {selectedTilesCount > 0 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onClearTileSelection();
                  }}
                  className="bg-red-800 hover:bg-red-700 text-red-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-red-400 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Action to convert selected area into terrain */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase text-yellow-300 tracking-wider">
              Transformar Área Selecionada Em:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              <button
                onClick={() => {
                  sound.playWaterSplash();
                  onApplyTerrainToSelected('water');
                }}
                className="bg-gradient-to-b from-cyan-500 to-blue-700 hover:from-cyan-400 hover:to-blue-600 text-white font-black p-2 rounded-xl border border-cyan-300 shadow-md text-xs flex flex-col items-center gap-0.5 active:scale-95 cursor-pointer"
              >
                <span className="text-lg">💧</span>
                <span>Lago (Água)</span>
              </button>

              <button
                onClick={() => {
                  sound.playWaterSplash();
                  onApplyTerrainToSelected('shallow_water');
                }}
                className="bg-gradient-to-b from-teal-400 to-cyan-600 hover:from-teal-300 hover:to-cyan-500 text-white font-black p-2 rounded-xl border border-teal-200 shadow-md text-xs flex flex-col items-center gap-0.5 active:scale-95 cursor-pointer"
              >
                <span className="text-lg">🌊</span>
                <span>Água Rasa</span>
              </button>

              <button
                onClick={() => {
                  sound.playGrassRustle();
                  onApplyTerrainToSelected('grass');
                }}
                className="bg-gradient-to-b from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 text-white font-black p-2 rounded-xl border border-emerald-300 shadow-md text-xs flex flex-col items-center gap-0.5 active:scale-95 cursor-pointer"
              >
                <span className="text-lg">🌿</span>
                <span>Grama/Terra</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onApplyTerrainToSelected('sand');
                }}
                className="bg-gradient-to-b from-amber-300 to-yellow-600 hover:from-amber-200 hover:to-yellow-500 text-amber-950 font-black p-2 rounded-xl border border-yellow-200 shadow-md text-xs flex flex-col items-center gap-0.5 active:scale-95 cursor-pointer"
              >
                <span className="text-lg">🏖️</span>
                <span>Areia Praia</span>
              </button>

              <button
                onClick={() => {
                  sound.playWoodHit();
                  onApplyTerrainToSelected('pier');
                }}
                className="bg-gradient-to-b from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-black p-2 rounded-xl border border-amber-400 shadow-md text-xs flex flex-col items-center gap-0.5 active:scale-95 cursor-pointer"
              >
                <span className="text-lg">🪵</span>
                <span>Píer Madeira</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onApplyTerrainToSelected('cliff');
                }}
                className="bg-gradient-to-b from-stone-500 to-stone-700 hover:from-stone-400 hover:to-stone-600 text-white font-black p-2 rounded-xl border border-stone-300 shadow-md text-xs flex flex-col items-center gap-0.5 active:scale-95 cursor-pointer"
              >
                <span className="text-lg">⛰️</span>
                <span>Rocha Cliff</span>
              </button>
            </div>
          </div>

          {/* Quick Expansion Presets */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-700/50">
            <button
              onClick={() => {
                sound.playWaterSplash();
                onExpandLakeOutward();
              }}
              className="flex-1 bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-black py-1.5 px-3 rounded-xl border border-blue-300 text-xs flex items-center justify-center gap-1.5 active:scale-95 shadow cursor-pointer"
            >
              <span>🌊</span>
              <span>Expandir Lago +1 Anel</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onResetTerrain();
              }}
              className="bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold py-1.5 px-3 rounded-xl border border-amber-600 text-xs flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>🔄</span>
              <span>Restaurar Terreno</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSFORM & EDIT (Mover qualquer coisa de lugar, mudar escala/formato) */}
      {activeTab === 'transform' && (
        <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
          {selectedEntity ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-amber-950/80 p-2 rounded-2xl border border-amber-500/60">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <div>
                    <span className="font-black text-xs text-yellow-300 uppercase">
                      {selectedEntity.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-amber-200/80 block">
                      Pos: ({selectedEntity.x.toFixed(1)}, {selectedEntity.y.toFixed(1)}) • Escala:{' '}
                      {(selectedEntity.scale || 1).toFixed(2)}x
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      sound.playPop();
                      onDuplicateSelectedEntity();
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-black px-2.5 py-1 rounded-xl border border-amber-300 text-xs shadow active:scale-95 cursor-pointer"
                    title="Duplicar objeto"
                  >
                    📋 Duplicar
                  </button>
                  <button
                    onClick={() => {
                      sound.playTrash?.();
                      onDeleteSelectedEntity();
                    }}
                    className="bg-red-700 hover:bg-red-600 text-white font-black px-2.5 py-1 rounded-xl border border-red-300 text-xs shadow active:scale-95 cursor-pointer"
                    title="Excluir objeto"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>

              {/* Adjust Controls: Nudge Movement, Scale, Flip */}
              <div className="grid grid-cols-2 gap-2">
                {/* Nudge Movement */}
                <div className="bg-amber-950/60 p-2 rounded-2xl border border-amber-700/50 flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase text-amber-300 mb-1">
                    Ajustar Posição
                  </span>
                  <div className="grid grid-cols-3 gap-1 w-28">
                    <div />
                    <button
                      onClick={() => onNudgeEntity(-0.5, -0.5)}
                      className="bg-amber-800 hover:bg-amber-700 text-white font-black p-1 rounded-lg border border-amber-500 text-xs active:scale-95 cursor-pointer text-center"
                    >
                      ⬆️
                    </button>
                    <div />
                    <button
                      onClick={() => onNudgeEntity(-0.5, 0.5)}
                      className="bg-amber-800 hover:bg-amber-700 text-white font-black p-1 rounded-lg border border-amber-500 text-xs active:scale-95 cursor-pointer text-center"
                    >
                      ⬅️
                    </button>
                    <button
                      onClick={() => onNudgeEntity(0.5, 0.5)}
                      className="bg-amber-800 hover:bg-amber-700 text-white font-black p-1 rounded-lg border border-amber-500 text-xs active:scale-95 cursor-pointer text-center"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => onNudgeEntity(0.5, -0.5)}
                      className="bg-amber-800 hover:bg-amber-700 text-white font-black p-1 rounded-lg border border-amber-500 text-xs active:scale-95 cursor-pointer text-center"
                    >
                      ➡️
                    </button>
                  </div>
                </div>

                {/* Scale & Form */}
                <div className="bg-amber-950/60 p-2 rounded-2xl border border-amber-700/50 flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-300 mb-1 text-center">
                    Mudar Formato & Escala
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onScaleEntity(-0.15)}
                      className="flex-1 bg-amber-800 hover:bg-amber-700 text-white font-black py-1.5 rounded-xl border border-amber-500 text-xs active:scale-95 cursor-pointer"
                    >
                      🔍 - Menor
                    </button>
                    <button
                      onClick={() => onScaleEntity(0.15)}
                      className="flex-1 bg-amber-800 hover:bg-amber-700 text-white font-black py-1.5 rounded-xl border border-amber-500 text-xs active:scale-95 cursor-pointer"
                    >
                      🔎 + Maior
                    </button>
                  </div>
                  <button
                    onClick={() => onFlipEntity()}
                    className="mt-1.5 bg-amber-700 hover:bg-amber-600 text-yellow-200 font-bold py-1 rounded-xl border border-amber-400 text-xs active:scale-95 cursor-pointer text-center"
                  >
                    ↔️ Espelhar Horizontal
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-950/60 p-4 rounded-2xl border border-amber-700/50 text-center flex flex-col items-center justify-center gap-1">
              <span className="text-3xl animate-bounce">👆</span>
              <span className="text-xs font-bold text-yellow-300">
                Toque em qualquer objeto no mapa para selecioná-lo!
              </span>
              <span className="text-[10px] text-amber-200/70">
                Você poderá arrastá-lo, mudar seu tamanho, duplicá-lo ou reposicioná-lo livremente.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Global Save & Reset Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-amber-600/40 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playSuccess();
              onSaveAll();
            }}
            className="bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black py-1 px-3 rounded-xl border border-emerald-300 shadow active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>💾</span> Salvar Cenário
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onResetAll();
            }}
            className="bg-amber-900/80 hover:bg-amber-800 text-amber-200 font-bold py-1 px-2.5 rounded-xl border border-amber-600 text-[11px] active:scale-95 cursor-pointer"
          >
            🔄 Restaurar Padrão
          </button>
        </div>

        <div className="text-[10px] text-yellow-300/80 font-bold italic">
          Senha ADM: 2412
        </div>
      </div>
    </div>
  );
};
