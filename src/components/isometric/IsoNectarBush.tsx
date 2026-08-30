import React from 'react';
import { FarmEntity, NectarBushData } from '../../types/game';

interface IsoNectarBushProps {
  entity: FarmEntity;
  isSelected?: boolean;
  onChopDeadBush?: () => void;
}

export const IsoNectarBush: React.FC<IsoNectarBushProps> = ({
  entity,
  isSelected,
  onChopDeadBush,
}) => {
  const data: NectarBushData = entity.nectarBushData || {
    nectarLeft: 200,
    maxNectar: 200,
    isWilted: false,
  };

  const isDried = data.nectarLeft <= 0 || data.isWilted;
  const progressRatio = Math.max(0, data.nectarLeft / data.maxNectar);

  return (
    <div
      className="relative cursor-pointer select-none group flex flex-col items-center justify-center"
      style={{ width: 80, height: 75 }}
    >
      {/* Nectar Status Pill */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black shadow-md border transition-all whitespace-nowrap ${
          isDried
            ? 'bg-amber-950/80 text-orange-300 border-amber-800'
            : data.nectarLeft > 100
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400'
            : 'bg-amber-950/90 text-yellow-300 border-yellow-400'
        }`}
      >
        <span>{isDried ? '🥀' : '🌺'}</span>
        <span>{data.nectarLeft}/200</span>
      </div>

      {/* SVG Isometric Bush */}
      <svg
        viewBox="0 0 80 75"
        className="w-full h-full overflow-visible drop-shadow-md group-hover:scale-105 transition-transform"
      >
        <defs>
          <radialGradient id="bush-healthy-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="45%" stopColor="#22C55E" />
            <stop offset="85%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#14532D" />
          </radialGradient>

          <radialGradient id="bush-wilted-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#A8A29E" />
            <stop offset="50%" stopColor="#78716C" />
            <stop offset="100%" stopColor="#44403C" />
          </radialGradient>
        </defs>

        {/* Base shadow */}
        <ellipse cx="40" cy="58" rx="28" ry="14" fill="#000000" opacity="0.28" />

        {isDried ? (
          /* Wilted / Dried Bush Branches */
          <g>
            {/* Dry Base Twigs */}
            <path
              d="M 38 56 L 36 40 L 26 30 M 36 40 L 44 26 M 42 56 L 46 38 L 56 28 M 46 38 L 40 28"
              stroke="#57534E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 34 48 L 22 44 M 46 46 L 58 42 M 39 34 L 32 24"
              stroke="#78716C"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Withered small leaves on ground */}
            <ellipse cx="30" cy="55" rx="3" ry="1.5" fill="#78716C" />
            <ellipse cx="50" cy="56" rx="2.5" ry="1.2" fill="#78716C" />
            <ellipse cx="42" cy="60" rx="3" ry="1.4" fill="#57534E" />
          </g>
        ) : (
          /* Healthy Blooming Nectar Bush */
          <g>
            {/* Back Foliage Puff */}
            <circle cx="28" cy="38" r="16" fill="#15803D" opacity="0.9" />
            <circle cx="52" cy="38" r="16" fill="#15803D" opacity="0.9" />
            <circle cx="40" cy="28" r="17" fill="#166534" opacity="0.9" />

            {/* Front Sunlit Foliage Puffs */}
            <circle cx="26" cy="42" r="15" fill="url(#bush-healthy-grad)" />
            <circle cx="54" cy="42" r="15" fill="url(#bush-healthy-grad)" />
            <circle cx="40" cy="34" r="18" fill="url(#bush-healthy-grad)" />
            <circle cx="40" cy="46" r="15" fill="url(#bush-healthy-grad)" />

            {/* Blooming Nectar Flowers (quantity based on remaining nectar) */}
            {/* Flower 1 - Center top */}
            <g transform="translate(40, 24)">
              <circle cx="0" cy="0" r="3.5" fill="#C084FC" />
              <circle cx="0" cy="0" r="1.5" fill="#FDE047" />
            </g>

            {/* Flower 2 - Left */}
            <g transform="translate(24, 36)">
              <circle cx="0" cy="0" r="3.5" fill="#F472B6" />
              <circle cx="0" cy="0" r="1.5" fill="#FDE047" />
            </g>

            {/* Flower 3 - Right */}
            <g transform="translate(56, 36)">
              <circle cx="0" cy="0" r="3.5" fill="#C084FC" />
              <circle cx="0" cy="0" r="1.5" fill="#FDE047" />
            </g>

            {/* Flower 4 - Center bottom */}
            {progressRatio > 0.3 && (
              <g transform="translate(38, 44)">
                <circle cx="0" cy="0" r="3.5" fill="#F472B6" />
                <circle cx="0" cy="0" r="1.5" fill="#FDE047" />
              </g>
            )}

            {/* Flower 5 - Upper right */}
            {progressRatio > 0.6 && (
              <g transform="translate(48, 28)">
                <circle cx="0" cy="0" r="3.2" fill="#E879F9" />
                <circle cx="0" cy="0" r="1.4" fill="#FDE047" />
              </g>
            )}

            {/* Flower 6 - Upper left */}
            {progressRatio > 0.8 && (
              <g transform="translate(30, 28)">
                <circle cx="0" cy="0" r="3.2" fill="#E879F9" />
                <circle cx="0" cy="0" r="1.4" fill="#FDE047" />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Selected Indicator Outline */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
