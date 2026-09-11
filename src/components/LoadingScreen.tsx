import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  statusText?: string;
  subMessage?: string;
  errorMessage?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  onPlayOffline?: () => void;
  isFadingOut?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  statusText = 'Carregando sua fazenda',
  subMessage = 'Buscando seu progresso na nuvem ☁️',
  errorMessage = null,
  onRetry,
  onCancel,
  onPlayOffline,
  isFadingOut = false,
}) => {
  const [dots, setDots] = useState('');

  // Pulsating / cycling dots animation
  useEffect(() => {
    if (errorMessage) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 450);
    return () => clearInterval(interval);
  }, [errorMessage]);

  return (
    <div
      id="harvest-loading-screen"
      className={`fixed inset-0 z-[50000] flex flex-col items-center justify-between overflow-hidden font-sans select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        background: 'linear-gradient(180deg, #7ecafc 0%, #a4e082 55%, #60a838 100%)',
      }}
    >
      {/* ── Sun & Rays Background ── */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-yellow-100 via-yellow-200/50 to-transparent blur-2xl pointer-events-none opacity-80" />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-yellow-300 shadow-[0_0_60px_rgba(250,204,21,0.8)] pointer-events-none opacity-90 animate-pulse" />

      {/* ── Floating Animated Clouds ── */}
      <div
        className="absolute top-12 pointer-events-none opacity-85 text-4xl sm:text-5xl"
        style={{
          animation: 'driftCloud 26s linear infinite',
          left: '-20%',
        }}
      >
        ☁️
      </div>
      <div
        className="absolute top-28 pointer-events-none opacity-70 text-5xl sm:text-6xl"
        style={{
          animation: 'driftCloud 38s linear infinite',
          animationDelay: '-14s',
          left: '-20%',
        }}
      >
        ☁️
      </div>
      <div
        className="absolute top-44 pointer-events-none opacity-60 text-3xl sm:text-4xl"
        style={{
          animation: 'driftCloud 48s linear infinite',
          animationDelay: '-26s',
          left: '-20%',
        }}
      >
        ☁️
      </div>

      {/* ── Header Badge ── */}
      <div className="relative z-10 pt-8 sm:pt-12 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 bg-amber-950/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-yellow-300/40 shadow-lg">
          <span className="text-base sm:text-lg">🌾</span>
          <span className="text-xs sm:text-sm font-black text-amber-100 tracking-wider uppercase drop-shadow-sm">
            Harvest Horizon
          </span>
        </div>
      </div>

      {/* ── Center Stage: Animated Chicken & Message / Error ── */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full px-6 py-2">
        {/* Chicken Character Stage */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Ground Contact Shadow (pulses inversely with hop) */}
          <div
            className="absolute bottom-1 w-24 h-6 rounded-full bg-amber-950/30 blur-[2px]"
            style={{
              animation: errorMessage ? 'none' : 'shadowPulse 1.6s ease-in-out infinite',
            }}
          />

          {/* SVG Stylized Bouncing Chicken */}
          <div
            className="relative z-10 w-32 h-32 sm:w-36 sm:h-36"
            style={{
              animation: errorMessage ? 'none' : 'chickenHop 1.6s ease-in-out infinite',
            }}
          >
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl overflow-visible">
              <defs>
                <linearGradient id="ch-body" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#FFF9E6" />
                  <stop offset="100%" stopColor="#F5E4B5" />
                </linearGradient>
                <linearGradient id="ch-comb" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF4D4D" />
                  <stop offset="100%" stopColor="#C41C1C" />
                </linearGradient>
                <linearGradient id="ch-beak" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA726" />
                  <stop offset="100%" stopColor="#F57C00" />
                </linearGradient>
                <linearGradient id="ch-wing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBF0" />
                  <stop offset="100%" stopColor="#EAD29A" />
                </linearGradient>
              </defs>

              {/* Comb on Head */}
              <circle cx="50" cy="22" r="7" fill="url(#ch-comb)" />
              <circle cx="60" cy="18" r="8.5" fill="url(#ch-comb)" />
              <circle cx="70" cy="22" r="7" fill="url(#ch-comb)" />

              {/* Plump Chicken Body */}
              <ellipse cx="60" cy="65" rx="38" ry="34" fill="url(#ch-body)" stroke="#D4B476" strokeWidth="1.5" />

              {/* Tail Feathers */}
              <path
                d="M 24 55 C 10 40, 10 25, 20 22 C 28 35, 28 45, 32 52 Z"
                fill="#F2E0BA"
                stroke="#C4A364"
                strokeWidth="1.2"
              />
              <path
                d="M 28 62 C 16 52, 14 38, 25 35 C 32 46, 32 55, 36 60 Z"
                fill="#FFF0D4"
                stroke="#C4A364"
                strokeWidth="1.2"
              />

              {/* Flapping Wing */}
              <ellipse
                cx="58"
                cy="68"
                rx="20"
                ry="15"
                fill="url(#ch-wing)"
                stroke="#C4A364"
                strokeWidth="1.2"
                transform="rotate(-8 58 68)"
              />

              {/* Head / Face */}
              <ellipse cx="80" cy="42" rx="16" ry="15" fill="url(#ch-body)" stroke="#D4B476" strokeWidth="1.2" />

              {/* Eye (Shining Cute Cartoon Eye) */}
              <circle cx="85" cy="38" r="4.5" fill="#2C1810" />
              <circle cx="86.5" cy="36.5" r="1.5" fill="#FFFFFF" />

              {/* Beak */}
              <path d="M 94 40 L 108 45 L 94 50 Z" fill="url(#ch-beak)" stroke="#E65100" strokeWidth="0.8" />

              {/* Wattle (red under beak) */}
              <ellipse cx="90" cy="54" rx="4.5" ry="7" fill="url(#ch-comb)" />

              {/* Cute Blush Cheek */}
              <ellipse cx="78" cy="46" rx="5" ry="3" fill="#FF8A80" opacity="0.55" />

              {/* Yellow Little Feet */}
              <path d="M 50 96 L 50 108 L 44 112 M 50 108 L 50 113 M 50 108 L 56 112" stroke="#FFA000" strokeWidth="3" strokeLinecap="round" />
              <path d="M 70 96 L 70 108 L 64 112 M 70 108 L 70 113 M 70 108 L 76 112" stroke="#FFA000" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* ── Status Text & Progress / Error Box ── */}
        {!errorMessage ? (
          <div className="flex flex-col items-center gap-2 mt-4 text-center w-full">
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 drop-shadow-sm tracking-wide">
              {statusText}
              <span className="inline-block w-6 text-left">{dots}</span>
            </h2>
            <p className="text-xs sm:text-sm font-bold text-amber-900/85">
              {subMessage}
            </p>

            {/* Indeterminate Shimmer Progress Bar */}
            <div className="w-full max-w-xs h-3.5 bg-amber-950/20 rounded-full p-0.5 overflow-hidden border border-amber-900/30 shadow-inner mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 shadow-md"
                style={{
                  width: '45%',
                  animation: 'shimmerBar 1.8s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        ) : (
          /* Error State Box */
          <div className="bg-[#fffbeb] border-3 border-red-500 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-3 text-center w-full mt-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl text-red-600 border border-red-300">
              ⚠️
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-black text-red-950">Não foi possível carregar</h3>
              <p className="text-xs text-amber-950/80 font-semibold leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full pt-1">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs py-2.5 px-3 rounded-2xl border border-amber-300 transition-all active:scale-95 cursor-pointer"
                >
                  Voltar
                </button>
              )}
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-105 text-amber-950 font-black text-xs py-2.5 px-3 rounded-2xl border border-amber-600 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Tentar novamente
                </button>
              )}
            </div>
            {onPlayOffline && (
              <button
                onClick={onPlayOffline}
                className="w-full bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold text-xs py-2 px-3 rounded-xl border border-amber-400/80 transition-all active:scale-95 cursor-pointer"
              >
                🌾 Jogar no Modo Local (Offline)
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Hills and Daisies ── */}
      <div className="relative z-10 w-full pb-6 pt-2 flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-950/70">
          <span>🌻</span>
          <span>Colheitas frescas & amigos online</span>
          <span>🌻</span>
        </div>
      </div>

      {/* ── Inline Keyframe Animations ── */}
      <style>{`
        @keyframes driftCloud {
          0% { transform: translateX(0); }
          100% { transform: translateX(120vw); }
        }
        @keyframes chickenHop {
          0%, 100% {
            transform: translateY(0) scale(1, 1);
          }
          15% {
            transform: translateY(4px) scale(1.08, 0.92);
          }
          35% {
            transform: translateY(-28px) scale(0.96, 1.05) rotate(-3deg);
          }
          50% {
            transform: translateY(-32px) scale(1, 1) rotate(2deg);
          }
          70% {
            transform: translateY(0) scale(1.12, 0.88);
          }
          85% {
            transform: translateY(-4px) scale(0.98, 1.02);
          }
        }
        @keyframes shadowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.35;
          }
          40%, 50% {
            transform: scale(0.65);
            opacity: 0.15;
          }
          70% {
            transform: scale(1.15);
            opacity: 0.45;
          }
        }
        @keyframes shimmerBar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
};
