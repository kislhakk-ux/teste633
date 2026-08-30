import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  statusText?: string;
  errorMessage?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  isFadingOut?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  statusText = 'Preparando sua fazenda...',
  errorMessage = null,
  onRetry,
  onCancel,
  isFadingOut = false,
}) => {
  const [dots, setDots] = useState('');
  const [subMessage, setSubMessage] = useState('Sincronizando com a nuvem...');

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 450);

    const msgs = [
      'Sincronizando com a nuvem...',
      'Alimentando os bichinhos...',
      'Regando as plantações...',
      'Polindo o trator...',
      'Abrindo as portas do celeiro...',
    ];
    let idx = 0;
    const msgTimer = setInterval(() => {
      idx = (idx + 1) % msgs.length;
      setSubMessage(msgs[idx]);
    }, 2400);

    return () => {
      clearInterval(dotTimer);
      clearInterval(msgTimer);
    };
  }, []);

  return (
    <div
      id="farm-loading-screen"
      className={`fixed inset-0 z-[50000] flex flex-col items-center justify-between overflow-hidden select-none transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(180deg, #70c5ff 0%, #a2dd6f 65%, #66a836 100%)',
      }}
    >
      {/* ── Sun & Morning Sky Radiance ── */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full bg-gradient-to-b from-yellow-200 to-amber-300 opacity-60 blur-2xl pointer-events-none" />

      {/* ── Animated Slow Moving Clouds ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Cloud 1 */}
        <div
          className="absolute top-[8%] text-6xl opacity-75"
          style={{
            animation: 'driftCloud 32s linear infinite',
            left: '-10%',
          }}
        >
          ☁️
        </div>
        {/* Cloud 2 */}
        <div
          className="absolute top-[18%] text-7xl opacity-60"
          style={{
            animation: 'driftCloud 44s linear infinite',
            animationDelay: '-16s',
            left: '-15%',
          }}
        >
          ☁️
        </div>
        {/* Cloud 3 */}
        <div
          className="absolute top-[12%] text-5xl opacity-70"
          style={{
            animation: 'driftCloud 28s linear infinite',
            animationDelay: '-8s',
            left: '-10%',
          }}
        >
          ⛅
        </div>
      </div>

      {/* ── Top Header Brand ── */}
      <div className="relative z-10 pt-10 sm:pt-14 flex flex-col items-center gap-1.5 px-4 text-center">
        <div className="flex items-center gap-2 bg-amber-950/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300/30 shadow-lg">
          <span className="text-xl">🌾</span>
          <span className="text-xs sm:text-sm font-black text-amber-100 uppercase tracking-wider">
            Harvest Horizon
          </span>
        </div>
      </div>

      {/* ── Center Content: Animated Farm Chicken ── */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 max-w-sm w-full">
        {/* Chicken Card Container */}
        <div className="relative flex flex-col items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
          {/* Animated Ground Shadow */}
          <div
            className="absolute bottom-2 w-28 h-7 rounded-[50%] bg-amber-950/30 blur-[3px]"
            style={{
              animation: 'shadowPulse 1.6s ease-in-out infinite',
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
