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
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleWatchAd = async () => {
    sound.playClick();
    setIsLoadingAd(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    console.log('[FreeGemsModal] Usuário clicou para assistir anúncio premiado.');

    const result = await admobService.showRewardedAd((rewardAmount) => {
      console.log(`[FreeGemsModal] Callback de recompensa recebido: +${rewardAmount} diamantes`);
      sound.playDing();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      onEarnGems(rewardAmount);
      setSuccessMessage(`+${rewardAmount} Diamantes recebidos com sucesso!`);
    });

    setIsLoadingAd(false);

    if (!result.success || result.error) {
      console.warn('[FreeGemsModal] Falha na exibição do anúncio:', result.error);
      setErrorMessage(result.error || 'Não foi possível carregar o anúncio no momento.');
    }
  };

  const isNativePlatform = admobService.isNative();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={isLoadingAd ? undefined : onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border-4 border-[#b45309] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-md w-full relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-amber-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isLoadingAd && (
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
              Anúncios Premiados Oficiais • Google Mobile Ads
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col items-center text-center gap-4 py-2">
          {/* Diamond Showcase */}
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

          {/* Description */}
          <p className="text-xs text-amber-900/90 leading-relaxed font-medium px-2">
            Assista a um anúncio em vídeo completo do Google AdMob para receber <strong>+{ADMOB_CONFIG.rewardAmount} 💎 Diamantes</strong> na sua fazenda.
          </p>

          {/* Platform notification for web testing */}
          {!isNativePlatform && (
            <div className="w-full bg-amber-100/80 border border-amber-400/80 text-amber-900 p-2.5 rounded-2xl text-[11px] text-left leading-snug">
              <span className="font-bold block text-amber-950 mb-0.5">ℹ️ Ambiente de Teste Web:</span>
              O SDK do <strong>Google Mobile Ads (AdMob)</strong> opera nativamente no aplicativo Android (APK). No navegador web, os anúncios são acionados via SDK nativo no dispositivo.
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="w-full bg-red-100 border-2 border-red-400 text-red-900 px-3 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 shadow text-left animate-in fade-in">
              <span className="text-lg">⚠️</span>
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="w-full bg-emerald-100 border-2 border-emerald-500 text-emerald-950 px-3 py-2 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow animate-in fade-in">
              <span>🎉</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            disabled={isLoadingAd}
            onClick={handleWatchAd}
            className={`w-full py-3.5 px-6 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center gap-2.5 font-black text-sm sm:text-base transition-all ${
              isLoadingAd
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:brightness-110 text-white cursor-pointer active:scale-98'
            }`}
          >
            {isLoadingAd ? (
              <>
                <span className="animate-spin text-lg">🔄</span>
                <span>Carregando anúncio Google AdMob...</span>
              </>
            ) : (
              <>
                <span className="text-xl">▶️</span>
                <span>Assistir Anúncio (+{ADMOB_CONFIG.rewardAmount} 💎)</span>
              </>
            )}
          </button>

          {/* AdMob Configuration Info */}
          <div className="text-[10px] text-amber-800/70 font-mono text-center">
            AdMob Rewarded Unit: {ADMOB_CONFIG.rewardedAdUnitId.slice(0, 20)}...
          </div>
        </div>
      </div>
    </div>
  );
};
