import React, { useState, useEffect } from 'react';
import { MINE_CONFIG } from '../constants/mineData';
import { sound } from '../utils/sound';

interface MineRepairModalProps {
  status: 'locked' | 'broken' | 'repairing';
  playerLevel: number;
  coins: number;
  gems: number;
  repairStartedAt?: number;
  onClose: () => void;
  onStartRepair: () => void;
  onSpeedUpRepair: (gemCost: number) => void;
  onFinishRepair: () => void;
}

export const MineRepairModal: React.FC<MineRepairModalProps> = ({
  status,
  playerLevel,
  coins,
  gems,
  repairStartedAt,
  onClose,
  onStartRepair,
  onSpeedUpRepair,
  onFinishRepair,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (status === 'repairing') {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const unlockLevel = MINE_CONFIG.unlockLevel;
  const cost = MINE_CONFIG.repairCostCoins;
  const canAffordCoins = coins >= cost;

  // Repair timing
  let remainingSeconds = 0;
  let progressPct = 0;
  let speedUpCost = 0;

  if (status === 'repairing' && repairStartedAt) {
    const elapsedSeconds = Math.max(0, (now - repairStartedAt) / 1000);
    remainingSeconds = Math.max(0, Math.ceil(MINE_CONFIG.repairDurationSeconds - elapsedSeconds));
    progressPct = Math.min(100, (elapsedSeconds / MINE_CONFIG.repairDurationSeconds) * 100);
    speedUpCost = MINE_CONFIG.calculateSpeedUpCost(remainingSeconds);
  }

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${hours}h ${minutes}m ${seconds}s`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 rounded-3xl border-4 border-amber-600 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-amber-950 to-stone-900 px-5 py-4 border-b border-amber-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-2xl shadow">
              ⛏️
            </div>
            <div>
              <h3 className="font-black text-lg text-amber-200">
                {status === 'locked'
                  ? 'Mina Bloqueada'
                  : status === 'repairing'
                  ? 'Reformando a Mina...'
                  : 'Restaurar Antiga Mina'}
              </h3>
              <p className="text-xs text-amber-400/80">
                {status === 'locked'
                  ? `Desbloqueia no Nível ${unlockLevel}`
                  : 'Reconstrua as galerias e trilhos subterrâneos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full flex items-center justify-center font-bold text-sm border border-stone-600"
          >
            ✕
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 flex flex-col items-center text-center gap-4">
          {/* A. LOCKED STATE */}
          {status === 'locked' && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-stone-800/90 rounded-3xl border-2 border-stone-600 flex items-center justify-center text-4xl shadow-inner">
                🔒
              </div>
              <p className="text-sm text-stone-300 max-w-xs">
                A antiga mina da fazenda está selada com tapumes e rochas. Avance na sua fazenda para desbloqueá-la!
              </p>
              <div className="bg-stone-900 px-4 py-2 rounded-xl border border-stone-700 text-xs font-bold text-stone-300">
                Seu Nível Atual: <span className="text-amber-400 font-black">{playerLevel}</span> / {unlockLevel}
              </div>
            </div>
          )}

          {/* B. BROKEN STATE - READY TO REPAIR */}
          {status === 'broken' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-20 h-20 bg-amber-950/80 rounded-3xl border-2 border-amber-600 flex items-center justify-center text-4xl shadow-inner animate-pulse">
                🔨
              </div>

              <div className="text-xs text-stone-300 max-w-sm">
                A entrada da mina desmoronou com o tempo. Contrate carpinteiros e engenheiros para escorar o túnel, instalar trilhos e luzes.
              </div>

              {/* Requirements Box */}
              <div className="w-full bg-stone-900/90 rounded-2xl border border-stone-700 p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-400">Tempo de Restauração:</span>
                  <span className="text-amber-300 flex items-center gap-1">
                    ⏱️ 1 dia e 12 horas (36h)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-400">Custo de Reforma:</span>
                  <span
                    className={`flex items-center gap-1 font-black ${
                      canAffordCoins ? 'text-amber-400' : 'text-red-400'
                    }`}
                  >
                    🪙 {cost.toLocaleString()} moedas
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-800">
                  <span>Suas moedas:</span>
                  <span>🪙 {coins.toLocaleString()}</span>
                </div>
              </div>

              <button
                disabled={!canAffordCoins}
                onClick={() => {
                  sound.playCoin();
                  onStartRepair();
                }}
                className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform ${
                  canAffordCoins
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 active:scale-95 text-stone-950 border-2 border-amber-300'
                    : 'bg-stone-800 border-2 border-stone-700 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>🔨</span>
                <span>{canAffordCoins ? 'Iniciar Restauração' : 'Moedas Insuficientes'}</span>
              </button>
            </div>
          )}

          {/* C. REPAIRING IN PROGRESS */}
          {status === 'repairing' && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-20 h-20 bg-amber-950/80 rounded-3xl border-2 border-amber-600 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                ⚙️
              </div>

              <div className="text-xs text-amber-200 font-bold">
                Obras em andamento! As vigas de sustentação e os trilhos estão sendo reconstruídos.
              </div>

              {/* Progress Bar & Timer */}
              <div className="w-full bg-stone-900 rounded-2xl border border-stone-700 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-400">Tempo Restante:</span>
                  <span className="text-yellow-400 font-mono text-sm font-black">
                    {timeFormatted}
                  </span>
                </div>

                <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Speed Up or Finish Button */}
              {remainingSeconds <= 0 ? (
                <button
                  onClick={() => {
                    sound.playLevelUp();
                    onFinishRepair();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 active:scale-95 text-white font-black text-sm rounded-2xl border-2 border-emerald-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>🎉</span>
                  <span>Abrir Mina Agora!</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    disabled={gems < speedUpCost}
                    onClick={() => {
                      if (gems >= speedUpCost) {
                        sound.playLevelUp();
                        onSpeedUpRepair(speedUpCost);
                      }
                    }}
                    className={`w-full py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform ${
                      gems >= speedUpCost
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-500 hover:brightness-110 active:scale-95 text-white border-2 border-cyan-300'
                        : 'bg-stone-800 border-2 border-stone-700 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <span>⚡</span>
                    <span>Concluir Imediatamente ({speedUpCost} 💎)</span>
                  </button>
                  <span className="text-[10px] text-stone-500">
                    Seus diamantes: {gems} 💎
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
