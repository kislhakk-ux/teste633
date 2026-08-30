import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { admobService, ADMOB_CONFIG } from '../utils/admobService';

interface FreeGemsModalProps {
  currentGems: number;
  onClose: () => void;
  onEarnGems: (amount: number) => void;
}

export const FreeGemsModal: React.FC<FreeGemsModalProps> = ({
  currentGems,
  onClose,
  onEarnGems,
}) => {
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [isRewarded, setIsRewarded] = useState(false);

  const handleWatchAd = async () => {
    sound.playClick();
    setIsPlayingAd(true);
    setAdCountdown(5);
    setIsRewarded(false);

    // Try native AdMob first
    const showedNative = await admobService.showRewardedAd((rewardAmount) => {
      handleAdComplete(rewardAmount);
    });

    // If web browser/fallback, run the video preview simulation
    if (!showedNative) {
      const interval = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAdComplete(ADMOB_CONFIG.rewardAmount);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleAdComplete = (amount: number) => {
    setIsPlayingAd(false);
    setIsRewarded(true);
    sound.playDing();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onEarnGems(amount);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={isPlayingAd ? undefined : onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border-4 border-[#b45309] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-md w-full relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-amber-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isPlayingAd && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white font-black flex items-center justify-center shadow border-2 border-white cursor-pointer active:scale-95 transition-all text-sm"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-2.5 border-b-2 border-amber-600/30 pb-3">
          <span className="text-3xl">🎬</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-950 tracking-wide uppercase">
              Cinema da Fazenda
            </h2>
            <p className="text-xs text-amber-800 font-semibold">
              Assista a anúncios premiados do Google AdMob e ganhe diamantes!
            </p>
          </div>
        </div>

        {/* Main Content Body */}
        {!isPlayingAd ? (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            {/* Diamond Showcase Badge */}
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-800 to-teal-500 border-4 border-yellow-300 shadow-xl flex items-center justify-center text-5xl animate-bounce">
                💎
              </div>
              <div className="absolute -bottom-2 bg-amber-900 text-yellow-300 text-xs font-black px-3 py-0.5 rounded-full border border-yellow-400 shadow">
                +{ADMOB_CONFIG.rewardAmount} DIAMANTES
              </div>
            </div>

            {/* Current Balance */}
            <div className="bg-amber-100/90 border border-amber-300 px-4 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-900 shadow-inner">
              <span>Seu saldo atual:</span>
              <span className="text-emerald-700 font-black text-sm">{currentGems} 💎</span>
            </div>

            {/* Info description */}
            <p className="text-xs text-amber-900/90 leading-relaxed font-medium px-2">
              Toque no botão abaixo para assistir a um anúncio em vídeo. Ao concluir a exibição, os diamantes serão adicionados instantaneamente ao seu inventário!
            </p>

            {/* Success message if just earned */}
            {isRewarded && (
              <div className="w-full bg-emerald-100 border-2 border-emerald-500 text-emerald-950 px-3 py-2 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow animate-in fade-in">
                <span>🎉</span>
                <span>+{ADMOB_CONFIG.rewardAmount} Diamantes adicionados com sucesso!</span>
              </div>
            )}

            {/* Watch Ad Action Button */}
            <button
              onClick={handleWatchAd}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:brightness-110 text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer mt-1"
            >
              <span className="text-xl">▶️</span>
              <span>Assistir Anúncio (+{ADMOB_CONFIG.rewardAmount} 💎)</span>
            </button>

            {/* AdMob ID Footer info */}
            <div className="text-[10px] text-amber-800/70 font-mono">
              AdMob Rewarded Unit: {ADMOB_CONFIG.rewardedAdUnitId.slice(0, 18)}...
            </div>
          </div>
        ) : (
          /* Simulated In-Game Ad Player (when testing on web) */
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-full bg-black rounded-2xl aspect-video relative flex flex-col items-center justify-center border-4 border-amber-900 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-purple-950/90 flex flex-col items-center justify-center p-4">
                <span className="text-4xl animate-pulse mb-2">🍿</span>
                <p className="text-white font-black text-sm tracking-wide">
                  Anúncio do Patrocinador Google AdMob
                </p>
                <p className="text-yellow-300 text-xs mt-1">
                  Recompensa em: <span className="text-base font-black">{adCountdown}s</span>
                </p>
              </div>

              {/* Progress bar at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/60">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-amber-900 font-semibold animate-pulse">
              Aguarde a conclusão do vídeo para receber seus diamantes...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
