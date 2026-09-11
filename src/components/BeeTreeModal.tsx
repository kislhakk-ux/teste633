import React from 'react';
import { FarmEntity, BeeTreeData } from '../types/game';
import { BEE_TREE_CONFIG } from '../constants/gameData';
import { sound } from '../utils/sound';

interface BeeTreeModalProps {
  entity: FarmEntity;
  coins: number;
  level: number;
  hasHoneyExtractor: boolean;
  onClose: () => void;
  onHarvestNectar: (entityId: string) => void;
  onUpgradeStage: (entityId: string, cost: number) => void;
  onOpenHoneyExtractor?: () => void;
}

export const BeeTreeModal: React.FC<BeeTreeModalProps> = ({
  entity,
  coins,
  level,
  hasHoneyExtractor,
  onClose,
  onHarvestNectar,
  onUpgradeStage,
  onOpenHoneyExtractor,
}) => {
  const data: BeeTreeData = entity.beeTreeData || {
    stage: 1,
    beesCount: 5,
    nectarCount: 0,
    maxNectar: 100,
    lastHarvestAt: Date.now(),
  };

  const currentStageInfo = BEE_TREE_CONFIG.stages[data.stage - 1] || BEE_TREE_CONFIG.stages[0];
  const nextStageInfo = data.stage < 5 ? BEE_TREE_CONFIG.stages[data.stage] : null;

  const canUpgrade = nextStageInfo && coins >= nextStageInfo.upgradeCost;
  const canHarvest = data.nectarCount > 0;
  const progressPercent = Math.min(100, Math.round((data.nectarCount / data.maxNectar) * 100));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fffbe7] via-[#fff3c4] to-[#fde047] border-4 border-[#b45309] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-md w-full relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-amber-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white font-black flex items-center justify-center shadow border-2 border-white cursor-pointer active:scale-95 transition-all text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 border-b-2 border-amber-500/30 pb-3">
          <span className="text-3xl animate-bounce">🌳🐝</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-950 tracking-wide uppercase">
              Árvore de Abelhas
            </h2>
            <p className="text-xs text-amber-800 font-semibold">
              Fase {data.stage} de 5 • {data.beesCount} Abelhas Ativas
            </p>
          </div>
        </div>

        {/* Nectar Storage Gauge */}
        <div className="bg-amber-950/10 border-2 border-amber-600/30 rounded-2xl p-4 flex flex-col gap-2.5 shadow-inner">
          <div className="flex items-center justify-between font-black text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 text-amber-950">
              <span>🍯</span>
              <span>Capacidade de Néctar</span>
            </span>
            <span className="bg-amber-900 text-yellow-300 px-2.5 py-0.5 rounded-full text-xs shadow">
              {data.nectarCount} / {data.maxNectar}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-amber-900/20 rounded-full overflow-hidden border border-amber-700/30 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 rounded-full transition-all duration-500 shadow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-amber-900/90 leading-tight">
            Cada abelha produz 1 unidade de néctar por ciclo de coleta. Capacidade máxima: 100 néctar.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Harvest Nectar Button */}
          <button
            disabled={!canHarvest}
            onClick={() => {
              sound.playDing();
              onHarvestNectar(entity.id);
            }}
            className={`w-full py-3 px-4 rounded-2xl shadow-lg border-2 border-white font-black text-sm flex items-center justify-center gap-2 transition-all ${
              canHarvest
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-white cursor-pointer active:scale-98 animate-pulse'
                : 'bg-gray-300 text-gray-500 border-gray-200 cursor-not-allowed'
            }`}
          >
            <span className="text-lg">🍯</span>
            <span>Colher {data.nectarCount} Néctar (+XP)</span>
          </button>

          {/* Send to Honey Extractor Button */}
          {hasHoneyExtractor ? (
            <button
              onClick={() => {
                sound.playClick();
                if (onOpenHoneyExtractor) onOpenHoneyExtractor();
              }}
              className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs py-2.5 px-4 rounded-xl border border-amber-400/80 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>⚙️</span>
              <span>Abrir Melzeiro para Produzir Mel</span>
            </button>
          ) : (
            <div className="text-[11px] text-amber-900/80 bg-amber-200/50 p-2 rounded-xl border border-amber-300 flex items-center gap-1.5">
              <span>💡</span>
              <span>Compre o <strong>Melzeiro</strong> na loja para transformar néctar em potes de mel!</span>
            </div>
          )}
        </div>

        {/* Tree Evolution / Upgrade Section */}
        <div className="border-t-2 border-amber-500/20 pt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>Evolução da Árvore:</span>
            <span className="text-amber-950 font-black">{currentStageInfo.desc}</span>
          </div>

          {nextStageInfo ? (
            <button
              disabled={!canUpgrade}
              onClick={() => {
                sound.playDing();
                onUpgradeStage(entity.id, nextStageInfo.upgradeCost);
              }}
              className={`w-full py-2.5 px-4 rounded-xl border-2 font-black text-xs flex items-center justify-between shadow transition-all ${
                canUpgrade
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white border-white cursor-pointer active:scale-98'
                  : 'bg-amber-200/60 text-amber-800/60 border-amber-300 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>⭐</span>
                <span>Evoluir para Fase {nextStageInfo.stage} (+5 Abelhas)</span>
              </div>
              <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-md text-yellow-300">
                <span>🪙</span>
                <span>{nextStageInfo.upgradeCost.toLocaleString()}</span>
              </div>
            </button>
          ) : (
            <div className="bg-emerald-100 text-emerald-900 border border-emerald-400 p-2 rounded-xl text-center text-xs font-black">
              🏆 Árvore na Fase Máxima (25 Abelhas ativas)!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
