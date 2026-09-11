import React, { useState, useEffect, useRef } from 'react';
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
  const [isPlayingWebAd, setIsPlayingWebAd] = useState(false);
  const [webAdTimer, setWebAdTimer] = useState<number>(15);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const adPushedRef = useRef(false);

  // Inicializa a chamada do anúncio AdSense do Google quando o player web abre
  useEffect(() => {
    if (isPlayingWebAd && !adPushedRef.current) {
      adPushedRef.current = true;
      try {
        const win = window as any;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
        console.log('[AdSense/Web] Requisição do anúncio Google AdSense enviada com sucesso para ca-pub-2377512488351478.');
      } catch (e) {
        console.warn('[AdSense/Web] Push de anúncio:', e);
      }
    }
  }, [isPlayingWebAd]);

  // Contagem regressiva de visualização obrigatória do anúncio Web (15 segundos)
  useEffect(() => {
    let interval: any = null;
    if (isPlayingWebAd && webAdTimer > 0) {
      interval = setInterval(() => {
        setWebAdTimer((prev) => prev - 1);
      }, 1000);
    } else if (isPlayingWebAd && webAdTimer === 0) {
      // Anúncio assistido até o fim com sucesso!
      setIsPlayingWebAd(false);
      sound.playDing();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
      onEarnGems(ADMOB_CONFIG.rewardAmount);
      setSuccessMessage(`+${ADMOB_CONFIG.rewardAmount} Diamantes recebidos com sucesso!`);
      adPushedRef.current = false;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingWebAd, webAdTimer, onEarnGems]);

  const handleWatchAd = async () => {
    sound.playClick();
    setIsLoadingAd(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    console.log('[FreeGemsModal] Usuário clicou para assistir anúncio.');

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

    if (result.isWeb) {
      // Inicia a experiência de anúncio na Web com contagem e bloco oficial do Google
      setWebAdTimer(15);
      adPushedRef.current = false;
      setIsPlayingWebAd(true);
      return;
    }

    if (!result.success || result.error) {
      console.warn('[FreeGemsModal] Falha na exibição do anúncio:', result.error);
      setErrorMessage(result.error || 'Não foi possível carregar o anúncio no momento.');
    }
  };

  const isNativePlatform = admobService.isNative();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={isLoadingAd || isPlayingWebAd ? undefined : onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border-4 border-[#b45309] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-md w-full relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-amber-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isLoadingAd && !isPlayingWebAd && (
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
              Anúncios Premiados • Google AdMob & AdSense
            </p>
          </div>
        </div>

        {/* MODO 1: PLAYER DE ANÚNCIO WEB EM ANDAMENTO */}
        {isPlayingWebAd ? (
          <div className="flex flex-col items-center gap-3.5 py-2">
            <div className="w-full flex items-center justify-between bg-amber-900/10 px-3 py-1.5 rounded-xl border border-amber-700/20 text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span>Exibindo anúncio oficial</span>
              </span>
              <span className="bg-amber-950 text-yellow-300 px-2 py-0.5 rounded-full text-xs font-black shadow-xs">
                {webAdTimer}s restantes
              </span>
            </div>

            {/* Barra de Progresso da Exibição */}
            <div className="w-full bg-amber-200/80 rounded-full h-2.5 overflow-hidden border border-amber-400">
              <div
                className="bg-gradient-to-r from-yellow-500 to-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((15 - webAdTimer) / 15) * 100}%` }}
              />
            </div>

            {/* Container do Bloco Google AdSense para Web */}
            <div className="w-full min-h-[220px] max-h-[280px] bg-white/90 border-2 border-amber-500 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center p-2 relative text-center">
              <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: '200px' }}
                data-ad-client="ca-pub-2377512488351478"
                data-ad-slot="8190958508"
                data-ad-format="rectangle,horizontal"
                data-full-width-responsive="true"
              />
              <div className="text-[10px] text-gray-500 mt-2 font-mono">
                Patrocinado por Google • Conta: ca-pub-2377512488351478
              </div>
            </div>

            <p className="text-xs text-amber-950 font-bold text-center">
              ⏳ Assista até o cronômetro zerar para creditar seus <strong>+{ADMOB_CONFIG.rewardAmount} 💎 Diamantes</strong>!
            </p>

            <button
              onClick={() => {
                if (confirm('Atenção: Se sair agora, você não receberá seus diamantes gratuitos. Deseja cancelar?')) {
                  setIsPlayingWebAd(false);
                  adPushedRef.current = false;
                  setErrorMessage('Você cancelou o anúncio antes de concluir.');
                }
              }}
              className="text-xs text-red-700 hover:text-red-900 font-bold underline cursor-pointer py-1"
            >
              Cancelar e sair sem recompensas
            </button>
          </div>
        ) : (
          /* MODO 2: TELA PRINCIPAL DE SOLICITAÇÃO */
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
              Assista a um anúncio em vídeo completo do Google para receber{' '}
              <strong>+{ADMOB_CONFIG.rewardAmount} 💎 Diamantes</strong> na sua fazenda. Funciona no celular (APK) e no navegador web!
            </p>

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
                  <span>Carregando anúncio Google...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">▶️</span>
                  <span>Assistir Anúncio (+{ADMOB_CONFIG.rewardAmount} 💎)</span>
                </>
              )}
            </button>

            {/* Info Badge */}
            <div className="text-[10px] text-amber-800/70 font-mono text-center">
              Google Publisher: {ADMOB_CONFIG.publisherId} • {isNativePlatform ? 'Android APK' : 'Navegador Web'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
