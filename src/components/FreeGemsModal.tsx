import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { admobService, ADMOB_CONFIG } from '../utils/admobService';

interface FreeGemsModalProps {
  currentGems: number;
  onClose: () => void;
  onEarnGems: (amount: number) => void;
}

const AD_SPONSORS = [
  {
    title: 'Supercell • Squad Busters Mobile',
    subtitle: 'Monte seu esquadrão e desbloqueie heróis lendários!',
    icon: '⚡',
    badge: '🏆 Jogo Mais Baixado',
    color: 'from-amber-600 via-orange-600 to-red-700',
    tag: 'Google AdMob Gaming Network',
  },
  {
    title: 'Clash Royale • Temporada Lendária',
    subtitle: 'Batalhe em arenas PvP em tempo real pelo topo do ranking!',
    icon: '👑',
    badge: '⚔️ Batalha Real 3v3',
    color: 'from-blue-600 via-indigo-600 to-purple-800',
    tag: 'Google AdMob Games',
  },
  {
    title: 'Brawl Stars • Novo Brawler Mítico',
    subtitle: 'Sobreviva no modo combate com amigos e vença partidas épicas!',
    icon: '💥',
    badge: '🔥 Ação Multiplayer',
    color: 'from-fuchsia-600 via-pink-600 to-rose-700',
    tag: 'Google AdMob Premium Video',
  },
  {
    title: 'Hay Day • Passe Rural de Diamantes',
    subtitle: 'Turbine a sua fazenda com bônus de produção e gemas grátis!',
    icon: '🚜',
    badge: '🌾 Especial Fazenda',
    color: 'from-emerald-600 via-teal-600 to-cyan-800',
    tag: 'Google AdMob Sponsor',
  },
];

export const FreeGemsModal: React.FC<FreeGemsModalProps> = ({
  currentGems,
  onClose,
  onEarnGems,
}) => {
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adCountdown, setAdCountdown] = useState(10);
  const [isRewarded, setIsRewarded] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const timerRef = useRef<any>(null);

  const activeSponsor = AD_SPONSORS[currentAdIndex % AD_SPONSORS.length];

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleWatchAd = async () => {
    sound.playClick();
    setIsRewarded(false);
    setHasFinished(false);

    // 1. Try Native Google AdMob Rewarded Video (on Android / iOS device)
    const showedNative = await admobService.showRewardedAd((rewardAmount) => {
      handleAdComplete(rewardAmount);
    });

    // 2. If running on Web Browser, launch the interactive simulated Ad Player with guaranteed timer
    if (!showedNative) {
      setCurrentAdIndex((prev) => prev + 1);
      setIsPlayingAd(true);
      setAdCountdown(10);

      if (timerRef.current) clearInterval(timerRef.current);

      const startTime = Date.now();
      const totalDuration = 10; // 10 seconds ad

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, totalDuration - elapsed);
        setAdCountdown(remaining);

        if (remaining <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setHasFinished(true);
          handleAdComplete(ADMOB_CONFIG.rewardAmount);
        }
      }, 500);
    }
  };

  const handleAdComplete = (amount: number) => {
    setIsPlayingAd(false);
    setIsRewarded(true);
    sound.playDing();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    onEarnGems(amount);
  };

  const handleCancelAd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlayingAd(false);
    setHasFinished(false);
    sound.playClick();
  };

  const progressPercent = Math.min(100, Math.max(0, ((10 - adCountdown) / 10) * 100));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={isPlayingAd ? undefined : onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border-4 border-[#b45309] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-lg w-full relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-amber-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Available when not actively watching ad) */}
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
              Anúncios Premiados Google AdMob • Ganhe Diamantes Grátis!
            </p>
          </div>
        </div>

        {/* Normal Mode (Before watching) */}
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
              Assista a um anúncio em vídeo completo do patrocinador para receber a recompensa de <strong>+{ADMOB_CONFIG.rewardAmount} 💎 Diamantes</strong> instantaneamente!
            </p>

            {/* Success message if just earned */}
            {isRewarded && (
              <div className="w-full bg-emerald-100 border-2 border-emerald-500 text-emerald-950 px-3 py-2 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow animate-in fade-in">
                <span>🎉</span>
                <span>+{ADMOB_CONFIG.rewardAmount} Diamantes creditados com sucesso na sua fazenda!</span>
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
            <div className="text-[10px] text-amber-800/70 font-mono flex items-center gap-1">
              <span>🛡️ Google AdMob Rewarded:</span>
              <span className="font-bold">{ADMOB_CONFIG.rewardedAdUnitId.slice(0, 20)}...</span>
            </div>
          </div>
        ) : (
          /* Interactive Animated Commercial Ad Player */
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className={`w-full bg-gradient-to-br ${activeSponsor.color} rounded-2xl aspect-video relative flex flex-col items-center justify-between p-4 border-4 border-amber-900 shadow-2xl overflow-hidden text-white`}>
              {/* Background ambient lighting */}
              <div className="absolute inset-0 bg-radial from-white/15 via-transparent to-black/40 pointer-events-none" />

              {/* Top Header info */}
              <div className="w-full flex items-center justify-between z-10">
                <div className="bg-black/60 backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow">
                  <span>📢</span>
                  <span>{activeSponsor.tag}</span>
                </div>

                <div className="bg-yellow-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full border-2 border-white shadow-lg animate-pulse">
                  Recompensa em: {adCountdown}s
                </div>
              </div>

              {/* Center Animated Sponsor Showcase */}
              <div className="flex flex-col items-center justify-center gap-2 z-10 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                  {activeSponsor.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase bg-yellow-300 text-amber-950 px-2 py-0.5 rounded-md shadow-xs">
                    {activeSponsor.badge}
                  </span>
                  <h3 className="text-sm sm:text-base font-black tracking-wide mt-1 drop-shadow-md">
                    {activeSponsor.title}
                  </h3>
                  <p className="text-[11px] text-white/90 font-medium max-w-[280px] drop-shadow-sm mt-0.5">
                    {activeSponsor.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Cancel & Status */}
              <div className="w-full flex items-center justify-between z-10 text-[10px] font-bold">
                <button
                  onClick={handleCancelAd}
                  className="bg-black/50 hover:bg-black/80 text-white/80 hover:text-white px-2 py-1 rounded-lg border border-white/20 transition-all cursor-pointer"
                >
                  ✕ Cancelar
                </button>

                <div className="flex items-center gap-1 text-yellow-300">
                  <span>💎</span>
                  <span>+5 Diamantes Garantidos</span>
                </div>
              </div>

              {/* Animated Progress Bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-black/70">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-green-400 transition-all duration-500 shadow-[0_0_8px_#FACC15]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-amber-900 font-bold animate-pulse">
              ⏳ Aguarde {adCountdown} segundos para creditar os diamantes automaticamente...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
