import React, { useState } from 'react';
import { ItemId } from '../types/game';
import {
  MINE_TOOLS,
  MINE_RESOURCES,
  rollMiningDrops,
  MiningRollResult,
} from '../constants/mineData';
import { sound } from '../utils/sound';

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

  const handleUseTool = (toolId: 'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel') => {
    if (miningPhase !== 'idle') return;

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
        triggerImpactShake();
        finishMining(toolId, result);
      }, 1000);
    } else {
      // Pickaxe or Shovel
      setMiningPhase('action');
      if (toolId === 'pickaxe') {
        sound.playPickaxe();
      } else {
        sound.playShovel();
      }

      setTimeout(() => {
        triggerImpactShake();
        finishMining(toolId, result);
      }, 700);
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
    }, 600);
  };

  const triggerImpactShake = (isHeavy = false) => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), isHeavy ? 600 : 350);
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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-800 to-stone-950 rounded-3xl border-4 border-amber-600/80 shadow-2xl overflow-hidden flex flex-col my-auto transition-transform ${
          screenShake ? 'translate-x-1 translate-y-1' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER BAR */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-5 py-3.5 border-b-2 border-amber-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-600 to-yellow-500 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-amber-300/60">
              ⛏️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-amber-200 drop-shadow-md">
                  Mina Subterrânea
                </h3>
                <span className="bg-amber-800/90 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-600">
                  Nível {playerLevel}
                </span>
              </div>
              <p className="text-xs text-amber-300/80">
                Extraia carvão, ferro, prata, ouro e diamantes raros
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Barn Storage Capacity Pill */}
            <div className="bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-700 flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-200">
                <span>📦 Celeiro:</span>
                <span
                  className={
                    barnUsed >= barnCap
                      ? 'text-red-400 font-black'
                      : barnUsed >= barnCap * 0.85
                      ? 'text-amber-400'
                      : 'text-emerald-400'
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
              className="w-9 h-9 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full flex items-center justify-center font-black text-base border border-stone-600 transition-transform active:scale-90"
            >
              ✕
            </button>
          </div>
        </div>

        {/* WARNING MESSAGE BANNER */}
        {warningMessage && (
          <div className="bg-red-950/95 border-b border-red-500/80 px-4 py-2 text-center text-xs font-bold text-red-200 flex items-center justify-center gap-2 animate-bounce">
            <span>⚠️</span>
            <span>{warningMessage}</span>
          </div>
        )}

        {/* MAIN INTERACTIVE ROCK FACE / MINE INTERIOR */}
        <div className="relative h-64 sm:h-72 w-full bg-gradient-to-b from-stone-950 via-stone-900 to-black overflow-hidden flex items-center justify-center border-b-2 border-stone-700 select-none">
          {/* 3D Atmospheric Cavern Background SVG */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <radialGradient id="rock-cavern-glow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#78350F" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#1C1917" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#09090B" stopOpacity="1" />
              </radialGradient>
              <linearGradient id="gold-vein" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="silver-vein" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#rock-cavern-glow)" />

            {/* Jagged Rock Strata */}
            <path
              d="M 0 40 Q 150 20 300 50 T 600 30 L 600 0 L 0 0 Z"
              fill="#292524"
              opacity="0.85"
            />
            <path
              d="M 0 180 Q 200 160 400 190 T 800 170 L 800 300 L 0 300 Z"
              fill="#1C1917"
            />

            {/* Glowing Ore Veins inside the Wall */}
            {/* Iron & Coal Veins */}
            <path
              d="M 60 90 Q 120 70 180 110 T 260 95"
              stroke="#94A3B8"
              strokeWidth="4"
              fill="none"
              strokeDasharray="12 6"
              opacity="0.75"
            />
            <path
              d="M 120 140 Q 180 160 280 130"
              stroke="#475569"
              strokeWidth="6"
              fill="none"
              strokeDasharray="16 8"
              opacity="0.8"
            />

            {/* Silver Vein (If Level >= 27) */}
            {playerLevel >= 27 && (
              <path
                d="M 380 70 Q 440 100 520 80"
                stroke="url(#silver-vein)"
                strokeWidth="5"
                fill="none"
                strokeDasharray="14 6"
                className="animate-pulse"
                opacity="0.9"
              />
            )}

            {/* Gold Vein (If Level >= 30) */}
            {playerLevel >= 30 && (
              <path
                d="M 280 180 Q 360 160 460 190"
                stroke="url(#gold-vein)"
                strokeWidth="5.5"
                fill="none"
                strokeDasharray="10 5"
                className="animate-pulse"
                opacity="0.95"
              />
            )}

            {/* Deep Diamond Star Glint */}
            <circle cx="210" cy="85" r="2.5" fill="#38BDF8" className="animate-ping" />
            <circle cx="490" cy="110" r="3" fill="#FBBF24" className="animate-ping" style={{ animationDelay: '1s' }} />
          </svg>

          {/* DYNAMIC MINING ACTION ANIMATIONS */}
          {/* A. TNT Countdown (3.. 2.. 1..) */}
          {miningPhase === 'countdown' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs z-30">
              <div className="w-24 h-24 bg-red-600 rounded-full border-4 border-yellow-300 flex items-center justify-center text-5xl font-black text-white shadow-2xl animate-ping">
                {countdownNum}
              </div>
              <span className="text-sm font-black text-yellow-300 tracking-wider mt-4 animate-pulse">
                PAVIO ACESO! CUIDADO...
              </span>
            </div>
          )}

          {/* B. Dynamite / Tool Active Impact Animation */}
          {miningPhase === 'action' && activeMiningTool && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
              {activeMiningTool === 'pickaxe' && (
                <div className="text-7xl animate-bounce">
                  ⛏️
                  <div className="text-2xl text-yellow-300 font-black animate-ping text-center">
                    CLANG!
                  </div>
                </div>
              )}
              {activeMiningTool === 'shovel' && (
                <div className="text-7xl animate-pulse">
                  🥄
                  <div className="text-2xl text-amber-200 font-black animate-ping text-center">
                    SCRAPE!
                  </div>
                </div>
              )}
              {(activeMiningTool === 'dynamite' || activeMiningTool === 'tnt_barrel') && (
                <div className="flex flex-col items-center justify-center">
                  <div className="text-8xl animate-ping">💥</div>
                  <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_2px_10px_rgba(234,88,12,1)] animate-bounce">
                    BOOM!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* C. REWARD CARDS REVEAL */}
          {miningPhase === 'revealing' && recentDrops && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in zoom-in duration-300">
              {/* Diamond Celebration Banner */}
              {diamondCelebration && (
                <div className="bg-gradient-to-r from-sky-600 via-cyan-400 to-sky-600 text-slate-950 font-black px-4 py-1.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce">
                  <span className="text-xl">💎</span>
                  <span className="text-sm uppercase tracking-wider">
                    Diamante Raro Encontrado! (+{diamondCelebration} Diamantes)
                  </span>
                </div>
              )}

              {/* Floating Drop Cards Grid */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {recentDrops.map((drop, idx) => (
                  <div
                    key={`drop_${idx}`}
                    className={`px-4 py-2.5 rounded-2xl border-2 shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-500 ${
                      drop.isGem
                        ? 'bg-gradient-to-r from-sky-900 to-cyan-900 border-sky-400 text-sky-100 shadow-sky-500/50'
                        : drop.id === 'gold_ore'
                        ? 'bg-gradient-to-r from-amber-900 to-yellow-900 border-amber-300 text-amber-100 shadow-amber-500/50'
                        : drop.id === 'silver_ore'
                        ? 'bg-gradient-to-r from-slate-800 to-sky-950 border-sky-300 text-sky-100'
                        : 'bg-stone-800 border-stone-600 text-stone-100'
                    }`}
                  >
                    <span className="text-3xl">{drop.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{drop.name}</span>
                      <span className="text-base font-black text-yellow-300">
                        +{drop.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Idle prompt in Cavern */}
          {miningPhase === 'idle' && (
            <div className="text-center z-10 bg-stone-950/70 px-5 py-2.5 rounded-2xl border border-stone-700/80 backdrop-blur-xs">
              <span className="text-sm font-bold text-amber-200">
                Selecione uma ferramenta abaixo para explorar a parede de rocha
              </span>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Cada ferramenta tem chances e quantidades específicas de minérios
              </p>
            </div>
          )}
        </div>

        {/* TOOL SELECTION DOCK */}
        <div className="p-4 bg-stone-900 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
              🛠️ Suas Ferramentas de Mineração
            </span>
            <span className="text-[11px] text-stone-400">
              Disponíveis no seu celeiro
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.keys(MINE_TOOLS) as (keyof typeof MINE_TOOLS)[]).map((toolKey) => {
              const tool = MINE_TOOLS[toolKey];
              const count = inventory[toolKey] || 0;
              const canUse = count > 0 && miningPhase === 'idle';

              return (
                <button
                  key={tool.id}
                  disabled={!canUse}
                  onClick={() => handleUseTool(toolKey)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all relative group ${
                    canUse
                      ? 'bg-gradient-to-b from-stone-800 to-stone-900 border-amber-600/70 hover:border-amber-400 hover:brightness-110 active:scale-95 shadow-md'
                      : 'bg-stone-900/60 border-stone-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Quantity Badge */}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded-md border ${
                      count > 0
                        ? 'bg-amber-500 text-stone-950 border-amber-300'
                        : 'bg-stone-700 text-stone-400 border-stone-600'
                    }`}
                  >
                    x{count}
                  </span>

                  <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center text-3xl mb-1 shadow-inner border border-stone-700">
                    {tool.icon}
                  </div>

                  <h4 className="text-xs font-black text-amber-100">{tool.name}</h4>

                  <span className="text-[10px] font-bold text-yellow-400 mt-0.5">
                    {tool.minYield}-{tool.maxYield} recursos
                  </span>

                  <span className="text-[9px] text-stone-400 mt-1 line-clamp-1">
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

        {/* BOTTOM DRAWER: ORES INVENTORY & SMELTER SHORTCUT */}
        <div className="bg-stone-950 px-4 py-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
          {/* Current Ores Inventory Display */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-bold text-stone-400">
              Minérios no Celeiro:
            </span>

            <div className="flex items-center gap-2">
              <span className="bg-stone-900 px-2 py-1 rounded-lg border border-stone-800 text-[11px] font-bold text-stone-300 flex items-center gap-1">
                🪨 Carvão: <b className="text-white">{inventory.coal || 0}</b>
              </span>
              <span className="bg-stone-900 px-2 py-1 rounded-lg border border-stone-800 text-[11px] font-bold text-slate-300 flex items-center gap-1">
                🪙 Ferro: <b className="text-white">{inventory.iron_ore || 0}</b>
              </span>
              {playerLevel >= 27 && (
                <span className="bg-stone-900 px-2 py-1 rounded-lg border border-stone-800 text-[11px] font-bold text-sky-200 flex items-center gap-1">
                  🔘 Prata: <b className="text-white">{inventory.silver_ore || 0}</b>
                </span>
              )}
              {playerLevel >= 30 && (
                <span className="bg-stone-900 px-2 py-1 rounded-lg border border-stone-800 text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  ✨ Ouro: <b className="text-white">{inventory.gold_ore || 0}</b>
                </span>
              )}
              <span className="bg-sky-950/80 px-2 py-1 rounded-lg border border-sky-600/60 text-[11px] font-bold text-sky-200 flex items-center gap-1">
                💎 Diamantes: <b className="text-white">{gems}</b>
              </span>
            </div>
          </div>

          {/* Smelter Shortcut Button */}
          {onOpenSmelter && (
            <button
              onClick={() => {
                onClose();
                onOpenSmelter();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-stone-950 font-black text-xs shadow border border-amber-300 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>🔥</span>
              <span>Fundir Barras</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
