import React, { useState } from 'react';
import { ItemId } from '../types/game';
import {
  MINE_TOOLS,
  MINE_RESOURCES,
  rollMiningDrops,
  MiningRollResult,
} from '../constants/mineData';
import { sound } from '../utils/sound';
import { Ore3DIcon, MineTool3DIcon, MineOreType, MineToolType } from './mine/Mine3DOres';
import { MineCavernView } from './mine/MineCavernView';

interface MineModalProps {
  playerLevel: number;
  inventory: Partial<Record<ItemId, number>>;
  gems: number;
  barnUsed: number;
  barnCap: number;
  onClose: () => void;
  onMineSuccess: (
    toolId: 'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel',
    result: MiningRollResult
  ) => void;
  onOpenSmelter?: () => void;
}

export const MineModal: React.FC<MineModalProps> = ({
  playerLevel,
  inventory,
  gems,
  barnUsed,
  barnCap,
  onClose,
  onMineSuccess,
  onOpenSmelter,
}) => {
  const [selectedTool, setSelectedTool] = useState<MineToolType>('pickaxe');
  const [activeMiningTool, setActiveMiningTool] = useState<
    'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel' | null
  >(null);
  const [miningPhase, setMiningPhase] = useState<
    'idle' | 'preparing' | 'countdown' | 'action' | 'revealing'
  >('idle');
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [recentDrops, setRecentDrops] = useState<MiningRollResult['drops'] | null>(null);
  const [diamondCelebration, setDiamondCelebration] = useState<number | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const availableBarnSpace = Math.max(0, barnCap - barnUsed);

  const handleUseTool = (toolId: MineToolType) => {
    if (miningPhase !== 'idle') return;

    setSelectedTool(toolId);
    const toolDef = MINE_TOOLS[toolId];
    const ownedCount = inventory[toolId] || 0;

    if (ownedCount <= 0) {
      sound.playClick();
      setWarningMessage(
        `Você não possui ${toolDef.name}! Obtenha colhendo lavouras, cuidando de animais ou completando pedidos.`
      );
      setTimeout(() => setWarningMessage(null), 3500);
      return;
    }

    // Barn capacity check
    if (availableBarnSpace < toolDef.maxYield) {
      sound.playClick();
      setWarningMessage(
        `Celeiro cheio! Você precisa de pelo menos ${toolDef.maxYield} espaços livres no Celeiro para usar ${toolDef.name}.`
      );
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    setActiveMiningTool(toolId);
    setWarningMessage(null);
    setRecentDrops(null);
    setDiamondCelebration(null);

    // Roll rewards
    const result = rollMiningDrops(toolId, playerLevel);

    if (toolId === 'tnt_barrel') {
      // TNT has 3.. 2.. 1.. countdown
      setMiningPhase('countdown');
      setCountdownNum(3);

      sound.playClick();
      const interval = setInterval(() => {
        setCountdownNum((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            executeBlast(toolId, result);
            return 0;
          }
          sound.playClick();
          return prev - 1;
        });
      }, 550);
    } else if (toolId === 'dynamite') {
      // Dynamite has sizzling fuse then pop
      setMiningPhase('action');
      sound.playDynamite();

      setTimeout(() => {
        triggerImpactShake(true);
        finishMining(toolId, result);
      }, 1100);
    } else {
      // Pickaxe or Shovel
      setMiningPhase('action');
      if (toolId === 'pickaxe') {
        sound.playPickaxe();
      } else {
        sound.playShovel();
      }

      setTimeout(() => {
        triggerImpactShake(false);
        finishMining(toolId, result);
      }, 750);
    }
  };

  const handleCavernClick = () => {
    if (miningPhase !== 'idle') return;

    // Check if current selected tool has stock
    if ((inventory[selectedTool] || 0) > 0) {
      handleUseTool(selectedTool);
      return;
    }

    // Otherwise find first tool with stock
    const tools: MineToolType[] = ['pickaxe', 'shovel', 'dynamite', 'tnt_barrel'];
    const available = tools.find((t) => (inventory[t] || 0) > 0);
    if (available) {
      handleUseTool(available);
    } else {
      handleUseTool(selectedTool);
    }
  };

  const executeBlast = (
    toolId: 'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel',
    result: MiningRollResult
  ) => {
    setMiningPhase('action');
    sound.playTNT();
    triggerImpactShake(true);

    setTimeout(() => {
      finishMining(toolId, result);
    }, 700);
  };

  const triggerImpactShake = (isHeavy = false) => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), isHeavy ? 650 : 380);
  };

  const finishMining = (
    toolId: 'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel',
    result: MiningRollResult
  ) => {
    setMiningPhase('revealing');
    setRecentDrops(result.drops);

    if (result.directGems > 0) {
      sound.playDiamondFound();
      setDiamondCelebration(result.directGems);
    } else {
      sound.playOreFound();
    }

    // Call success handler
    onMineSuccess(toolId, result);

    // Reset back to idle after display
    setTimeout(() => {
      setMiningPhase('idle');
      setActiveMiningTool(null);
    }, 2800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 rounded-3xl border-4 border-amber-600/90 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto transition-transform duration-75 ${
          screenShake ? 'scale-[1.02] translate-x-1.5 -translate-y-1 rotate-[0.5deg]' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER BAR */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-5 py-3.5 border-b-2 border-amber-700/60 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-300/80 p-1">
              <MineTool3DIcon type="pickaxe" size={38} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-amber-100 drop-shadow-md tracking-wide">
                  Mina Subterrânea
                </h3>
                <span className="bg-gradient-to-r from-amber-700 to-yellow-600 text-amber-100 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400/80 shadow-xs">
                  Nível {playerLevel}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">
                Extraia veios nobres de carvão, ferro, prata, ouro e diamantes raros
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Barn Storage Capacity Pill */}
            <div className="bg-stone-950/90 px-3.5 py-1.5 rounded-xl border border-stone-700 flex flex-col items-end shadow-inner">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-200">
                <span>📦 Celeiro:</span>
                <span
                  className={
                    barnUsed >= barnCap
                      ? 'text-red-400 font-black animate-pulse'
                      : barnUsed >= barnCap * 0.85
                      ? 'text-amber-400 font-black'
                      : 'text-emerald-400 font-black'
                  }
                >
                  {barnUsed}/{barnCap}
                </span>
              </div>
              {/* Mini storage bar */}
              <div className="w-24 h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all ${
                    barnUsed >= barnCap
                      ? 'bg-red-500'
                      : barnUsed >= barnCap * 0.85
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (barnUsed / barnCap) * 100)}%` }}
                />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 bg-stone-800 hover:bg-red-900/80 text-stone-200 hover:text-white rounded-full flex items-center justify-center font-black text-base border-2 border-stone-600 transition-all active:scale-90 shadow-md"
            >
              ✕
            </button>
          </div>
        </div>

        {/* WARNING MESSAGE BANNER */}
        {warningMessage && (
          <div className="bg-red-950/95 border-b border-red-500/80 px-4 py-2.5 text-center text-xs font-black text-red-200 flex items-center justify-center gap-2 animate-bounce">
            <span className="text-base">⚠️</span>
            <span>{warningMessage}</span>
          </div>
        )}

        {/* MAIN 3D CARTOON CAVERN INTERIOR */}
        <MineCavernView
          playerLevel={playerLevel}
          miningPhase={miningPhase}
          activeMiningTool={activeMiningTool}
          countdownNum={countdownNum}
          recentDrops={recentDrops}
          diamondCelebration={diamondCelebration}
          onCavernClick={handleCavernClick}
        />

        {/* TOOL SELECTION DOCK */}
        <div className="p-4 bg-gradient-to-b from-stone-900 to-stone-950 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                🛠️ Suas Ferramentas de Mineração
              </span>
              <span className="text-[10px] text-amber-400/80 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-700/60 font-bold">
                Toque na ferramenta ou na parede para minerar
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Disponíveis no seu celeiro
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(MINE_TOOLS) as (keyof typeof MINE_TOOLS)[]).map((toolKey) => {
              const tool = MINE_TOOLS[toolKey];
              const count = inventory[toolKey] || 0;
              const canUse = count > 0 && miningPhase === 'idle';
              const isSelected = selectedTool === toolKey;

              return (
                <button
                  key={tool.id}
                  disabled={miningPhase !== 'idle'}
                  onClick={() => handleUseTool(toolKey)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all relative group cursor-pointer ${
                    isSelected && count > 0
                      ? 'bg-gradient-to-b from-amber-950/80 via-stone-850 to-stone-900 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.45)] ring-2 ring-amber-400/50 scale-[1.02]'
                      : canUse
                      ? 'bg-gradient-to-b from-stone-800 to-stone-900 border-amber-700/60 hover:border-amber-400 hover:brightness-110 active:scale-95 shadow-md'
                      : 'bg-stone-900/60 border-stone-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Quantity Badge */}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full border shadow-sm ${
                      count > 0
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 border-yellow-200'
                        : 'bg-stone-800 text-stone-400 border-stone-700'
                    }`}
                  >
                    x{count}
                  </span>

                  {/* 3D Cartoon Tool Icon with Interactive Hover */}
                  <div className="w-14 h-14 bg-stone-950/80 rounded-2xl flex items-center justify-center mb-1 shadow-inner border border-stone-700/80 group-hover:scale-105 transition-transform">
                    <MineTool3DIcon type={toolKey} size={48} animate={canUse} />
                  </div>

                  <h4 className="text-xs font-black text-amber-100 mt-1">{tool.name}</h4>

                  <span className="text-[10px] font-black text-yellow-400 mt-0.5">
                    {tool.minYield}-{tool.maxYield} recursos
                  </span>

                  <span className="text-[9px] text-stone-400 mt-1 line-clamp-1 font-medium">
                    {toolKey === 'shovel' && 'Carvão e Ferro'}
                    {toolKey === 'pickaxe' && 'Ferro e Prata'}
                    {toolKey === 'dynamite' && 'Prata, Ouro e Jóias'}
                    {toolKey === 'tnt_barrel' && 'Ouro e Diamantes!'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM DRAWER: 3D CARTOON ORES INVENTORY & SMELTER SHORTCUT */}
        <div className="bg-stone-950 px-4 py-3 border-t-2 border-stone-800/80 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
          {/* Current Ores Inventory Display with 3D Cartoon Icons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
              Minérios no Celeiro:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Coal */}
              <div className="bg-gradient-to-r from-stone-900 to-stone-950 px-2.5 py-1 rounded-xl border border-stone-700 text-xs font-bold text-stone-300 flex items-center gap-1.5 shadow-xs">
                <Ore3DIcon type="coal" size={24} />
                <span>Carvão:</span>
                <b className="text-white font-black">{inventory.coal || 0}</b>
              </div>

              {/* Iron */}
              <div className="bg-gradient-to-r from-stone-900 to-stone-950 px-2.5 py-1 rounded-xl border border-stone-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 shadow-xs">
                <Ore3DIcon type="iron_ore" size={24} />
                <span>Ferro:</span>
                <b className="text-white font-black">{inventory.iron_ore || 0}</b>
              </div>

              {/* Silver (Level >= 27) */}
              {playerLevel >= 27 && (
                <div className="bg-gradient-to-r from-stone-900 to-sky-950/60 px-2.5 py-1 rounded-xl border border-sky-800/60 text-xs font-bold text-sky-200 flex items-center gap-1.5 shadow-xs">
                  <Ore3DIcon type="silver_ore" size={24} />
                  <span>Prata:</span>
                  <b className="text-white font-black">{inventory.silver_ore || 0}</b>
                </div>
              )}

              {/* Gold (Level >= 30) */}
              {playerLevel >= 30 && (
                <div className="bg-gradient-to-r from-stone-900 to-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800/60 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-xs">
                  <Ore3DIcon type="gold_ore" size={24} />
                  <span>Ouro:</span>
                  <b className="text-white font-black">{inventory.gold_ore || 0}</b>
                </div>
              )}

              {/* Diamond */}
              <div className="bg-gradient-to-r from-sky-950/90 to-blue-950/80 px-2.5 py-1 rounded-xl border border-sky-500/60 text-xs font-bold text-sky-100 flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                <Ore3DIcon type="diamond" size={24} />
                <span>Diamantes:</span>
                <b className="text-cyan-300 font-black">{gems}</b>
              </div>
            </div>
          </div>

          {/* Smelter Shortcut Button */}
          {onOpenSmelter && (
            <button
              onClick={() => {
                onClose();
                onOpenSmelter();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:brightness-110 text-stone-950 font-black text-xs shadow-lg border border-amber-300 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <span className="text-base">🔥</span>
              <span>Fundir Barras</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
