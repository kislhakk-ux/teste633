import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { admobService, ADMOB_CONFIG } from '../utils/admobService';

interface FreeGemsModalProps {
  currentGems: number;
  onClose: () => void;
  onEarnGems: (amount: number) => void;
}

// Sample sponsor video advertisements for web browser testing
const SPONSOR_ADS = [
  {
    title: 'Supercell • Squad Busters Mobile',
    sponsor: 'Google AdMob Gaming Network',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15,
  },
  {
    title: 'Clash Royale • Temporada Lendária',
    sponsor: 'Google AdMob Games',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: 15,
  },
  {
    title: 'Brawl Stars • Novo Brawler',
    sponsor: 'Google AdMob Premium Video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    duration: 15,
  },
];

export const FreeGemsModal: React.FC<FreeGemsModalProps> = ({
  currentGems,
  onClose,
  onEarnGems,
}) => {
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRewarded, setIsRewarded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeAd = SPONSOR_ADS[currentAdIndex % SPONSOR_ADS.length];

  const handleWatchAd = async () => {
    sound.playClick();
    setIsRewarded(false);

    // 1. Try Native Google AdMob Rewarded Video (Android / iOS)
    const showedNative = await admobService.showRewardedAd((rewardAmount) => {
      handleAdComplete(rewardAmount);
    });

    // 2. If running on Web / Browser, launch real Video Ad Player with onEnded callback
    if (!showedNative) {
      setCurrentAdIndex((prev) => prev + 1);
      setIsPlayingAd(true);
      setTimeRemaining(15);
      setVideoProgress(0);

      // Play video with audio if permitted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {
            // Autoplay with sound might need muted start on some browsers
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play();
            }
          });
        }
      }, 100);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 15;
      setTimeRemaining(Math.max(0, Math.ceil(total - current)));
      setVideoProgress((current / total) * 100);
    }
  };

  // Callback ONLY fired when the video ad reaches 100% completion!
  const handleVideoEnded = () => {
    handleAdComplete(ADMOB_CONFIG.rewardAmount);
  };

  const handleAdComplete = (amount: number) => {
    setIsPlayingAd(false);
    setIsRewarded(true);
    sound.playDing();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });
    onEarnGems(amount);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={isPlayingAd ? undefined : onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border-4 border-[#b45309] rounded-3xl p-5 sm:p-6 shadow-2xl max-w-lg w-full relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-amber-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Hidden during ad playback to enforce complete view) */}
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
              Assista a um anúncio em vídeo completo para receber a recompensa de <strong>+{ADMOB_CONFIG.rewardAmount} 💎 Diamantes</strong> instantaneamente em sua conta!
            </p>

            {/* Success message if just earned */}
            {isRewarded && (
              <div className="w-full bg-emerald-100 border-2 border-emerald-500 text-emerald-950 px-3 py-2 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow animate-in fade-in">
                <span>🎉</span>
                <span>+{ADMOB_CONFIG.rewardAmount} Diamantes creditados com sucesso!</span>
              </div>
            )}

            {/* Watch Ad Action Button */}
            <button
              onClick={handleWatchAd}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:brightness-110 text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer mt-1"
            >
              <span className="text-xl">▶️</span>
              <span>Assistir Anúncio em Vídeo (+{ADMOB_CONFIG.rewardAmount} 💎)</span>
            </button>

            {/* AdMob ID Footer info */}
            <div className="text-[10px] text-amber-800/70 font-mono flex items-center gap-1">
              <span>🛡️ Google AdMob Rewarded:</span>
              <span className="font-bold">{ADMOB_CONFIG.rewardedAdUnitId.slice(0, 20)}...</span>
            </div>
          </div>
        ) : (
          /* Active Video Ad Player (Real Commercials with Strict Callback) */
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-full bg-black rounded-2xl aspect-video relative flex flex-col items-center justify-center border-4 border-amber-900 shadow-2xl overflow-hidden">
              {/* Real Video Commercial Stream */}
              <video
                ref={videoRef}
                src={activeAd.videoUrl}
                playsInline
                autoPlay
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
              />

              {/* Top AdMob Header Overlay */}
              <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1">
                  <span>📢</span>
                  <span>{activeAd.sponsor}</span>
                </div>

                <div className="bg-yellow-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full border border-white shadow">
                  Recompensa em: {timeRemaining}s
                </div>
              </div>

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                <button
                  onClick={toggleMute}
                  className="bg-black/70 hover:bg-black/90 text-white text-xs px-2.5 py-1 rounded-lg border border-white/30 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isMuted ? '🔇 Mudo' : '🔊 Som'}</span>
                </button>

                <div className="text-[11px] text-white/90 font-bold bg-black/60 px-2 py-0.5 rounded">
                  {activeAd.title}
                </div>
              </div>

              {/* Progress bar at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/80">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-green-500 transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-amber-900 font-semibold animate-pulse">
              ⏳ Assista ao vídeo até o final para liberar sua recompensa de +{ADMOB_CONFIG.rewardAmount} 💎!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
