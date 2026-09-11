import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { sound } from '../utils/sound';
import { HD_BUILDING_SPRITES } from '../constants/buildingSprites';

interface FishingBoatModalProps {
  gameState: GameState;
  onClose: () => void;
  onStartRepair: (costCoins: number) => void;
  onSpeedUpRepair: (costGems: number) => void;
  onOpenLake?: () => void;
  onToggleBroken?: () => void;
}

const REPAIR_TIME_MS = 36 * 60 * 60 * 1000; // 36 hours
const REPAIR_COST_COINS = 35000;
const MAX_SPEEDUP_GEMS = 90;
const MIN_LEVEL = 25;

export const FishingBoatModal: React.FC<FishingBoatModalProps> = ({
  gameState,
  onClose,
  onStartRepair,
  onSpeedUpRepair,
  onOpenLake,
  onToggleBroken,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const status = gameState.fishingBoat?.status || 'broken';
  const startedAt = gameState.fishingBoat?.repairStartedAt || 0;

  useEffect(() => {
    if (status !== 'repairing') return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, REPAIR_TIME_MS - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, startedAt]);

  // Initial calculation
  useEffect(() => {
    if (status === 'repairing') {
      const elapsed = Date.now() - startedAt;
      setTimeLeft(Math.max(0, REPAIR_TIME_MS - elapsed));
    }
  }, [status, startedAt]);

  const speedUpCost = Math.max(1, Math.ceil((timeLeft / REPAIR_TIME_MS) * MAX_SPEEDUP_GEMS));

  const formatTime = (ms: number) => {
    if (ms <= 0) return 'Pronto!';
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleStartRepair = () => {
    if (gameState.coins >= REPAIR_COST_COINS) {
      sound.playCoin();
      sound.playWoodHit();
      onStartRepair(REPAIR_COST_COINS);
    } else {
      sound.playError();
    }
  };

  const handleSpeedUp = () => {
    if (gameState.gems >= speedUpCost) {
      sound.playDing();
      sound.playSuccess();
      onSpeedUpRepair(speedUpCost);
    } else {
      sound.playError();
    }
  };

  const isLevelLocked = gameState.level < MIN_LEVEL;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#e1f5fe] via-[#b3e5fc] to-[#81d4fa] border-4 border-[#0288d1] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-sm w-full relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-[#0288d1] pb-2">
          <span className="font-black text-[#01579b] text-lg flex items-center gap-2">
            <span>⛵</span> Barco de Pesca
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center text-center gap-3 w-full">
          {/* 3D Realistic Cartoon Boat Preview */}
          <div className="relative w-44 h-32 flex items-center justify-center bg-sky-200/50 rounded-2xl border-2 border-[#4fc3f7] shadow-inner p-1 overflow-hidden">
            <img
              src={status === 'repaired' ? HD_BUILDING_SPRITES.repaired_boat : HD_BUILDING_SPRITES.broken_boat}
              alt={status === 'repaired' ? 'Barco 3D Reparado' : 'Barco 3D Quebrado'}
              className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-1 right-2 bg-sky-900/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              3D Realista
            </div>
          </div>

          {status === 'broken' && (
            <>
              <p className="text-[#01579b] font-semibold text-sm px-2">
                Este velho barco de madeira pode levar você ao Lago de Pesca, mas precisa ser consertado primeiro!
              </p>

              {isLevelLocked ? (
                <div className="bg-red-100 border-2 border-red-500 rounded-xl p-3 w-full mt-2 shadow-inner">
                  <p className="text-red-700 font-black text-sm">🔒 Bloqueado</p>
                  <p className="text-red-600 text-xs font-semibold mt-1">
                    Desbloqueia no Nível {MIN_LEVEL}
                  </p>
                </div>
              ) : (
                <div className="w-full bg-white/70 p-4 rounded-2xl border border-[#4fc3f7] shadow-inner mt-2">
                  <h4 className="font-bold text-[#01579b] mb-3 text-sm">Custo do Conserto (36 Horas)</h4>
                  
                  <div className="flex items-center justify-center gap-2 text-lg font-black text-amber-600 bg-amber-100 rounded-lg p-2 border-2 border-amber-300">
                    <span>🪙</span> {REPAIR_COST_COINS.toLocaleString()}
                  </div>

                  <button
                    onClick={handleStartRepair}
                    disabled={gameState.coins < REPAIR_COST_COINS}
                    className={`w-full py-3 px-4 rounded-xl font-black text-lg text-white shadow-lg flex items-center justify-center gap-2 mt-4 transition-transform cursor-pointer ${
                      gameState.coins >= REPAIR_COST_COINS
                        ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 border-b-4 border-blue-800'
                        : 'bg-gray-400 border-b-4 border-gray-500 cursor-not-allowed opacity-80'
                    }`}
                  >
                    🔨 Iniciar Conserto
                  </button>
                </div>
              )}
            </>
          )}

          {status === 'repairing' && (
            <>
              <h2 className="text-[#01579b] font-black text-xl">Consertando o Barco...</h2>
              
              <div className="w-full bg-white/70 p-4 rounded-2xl border border-[#4fc3f7] shadow-inner mt-2">
                <div className="text-3xl font-black text-[#0277bd] drop-shadow-sm mb-2 font-mono">
                  {formatTime(timeLeft)}
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-inner mb-4">
                  <div 
                    className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${Math.max(0, Math.min(100, ((REPAIR_TIME_MS - timeLeft) / REPAIR_TIME_MS) * 100))}%` }}
                  ></div>
                </div>

                <p className="text-[#01579b] text-xs font-semibold mb-3">
                  Não quer esperar? Acelere o trabalho com Diamantes!
                </p>

                <button
                  onClick={handleSpeedUp}
                  disabled={gameState.gems < speedUpCost}
                  className={`w-full py-3 px-4 rounded-xl font-black text-lg text-white shadow-lg flex items-center justify-center gap-2 transition-transform cursor-pointer ${
                    gameState.gems >= speedUpCost
                      ? 'bg-purple-600 hover:bg-purple-500 hover:scale-105 active:scale-95 border-b-4 border-purple-800'
                      : 'bg-gray-400 border-b-4 border-gray-500 cursor-not-allowed opacity-80'
                  }`}
                >
                  <span>💎</span> Acelerar ({speedUpCost})
                </button>
              </div>
            </>
          )}

          {status === 'repaired' && (
            <div className="w-full flex flex-col gap-3">
              <p className="text-[#01579b] font-semibold text-sm px-2">
                Seu barco 3D está totalmente reparado e pronto para navegar até a Área de Pesca!
              </p>

              <button
                onClick={() => {
                  onClose();
                  onOpenLake?.();
                }}
                className="w-full py-3.5 px-4 rounded-xl font-black text-base text-white shadow-lg flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 active:scale-95 transition-all cursor-pointer"
              >
                🎣 Ir para a Área de Pesca
              </button>

              <button
                onClick={() => onToggleBroken?.()}
                className="w-full py-2 px-3 rounded-xl font-bold text-xs text-amber-950 bg-amber-200/80 hover:bg-amber-300 border border-amber-400/80 transition-all cursor-pointer"
              >
                🏚️ Alternar para Barco Quebrado 3D
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
