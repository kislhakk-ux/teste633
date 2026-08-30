import React, { useEffect, useRef, useCallback } from 'react';
import { ItemId, CropDef } from '../types/game';

// ─── Seed data passed from the parent ───────────────────────────────────────
export interface SeedEntry {
  cropId: ItemId;
  def: CropDef;
  qty: number;        // current inventory quantity
  unlocked: boolean;  // player level check
}

interface PlantingPanelProps {
  seeds: SeedEntry[];
  /** Called while pointer is held and dragging starts — gives the cropId being dragged */
  onStartDrag: (cropId: ItemId, startPos: { x: number; y: number }) => void;
  onClose: () => void;
  /** ID of the plot that triggered the panel (used to keep it highlighted) */
  sourcePlotId?: string;
}

// Format seconds as "Xs" / "Xm" / "Xh"
function fmtTime(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.round(sec / 60)}m`;
  return `${(sec / 3600).toFixed(1)}h`;
}

export const PlantingPanel: React.FC<PlantingPanelProps> = ({
  seeds,
  onStartDrag,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Close on outside pointer-down (but not if user is dragging a seed)
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Small delay so the tap that opened the panel doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown, { passive: true });
    }, 200);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onClose]);

  const handleSeedPointerDown = useCallback(
    (e: React.PointerEvent, seed: SeedEntry) => {
      if (!seed.unlocked || seed.qty <= 0) return;
      e.stopPropagation();
      e.preventDefault();
      onStartDrag(seed.cropId, { x: e.clientX, y: e.clientY });
    },
    [onStartDrag]
  );

  const handleSeedTouchStart = useCallback(
    (e: React.TouchEvent, seed: SeedEntry) => {
      if (!seed.unlocked || seed.qty <= 0) return;
      e.stopPropagation();
      const touch = e.touches[0];
      onStartDrag(seed.cropId, { x: touch.clientX, y: touch.clientY });
    },
    [onStartDrag]
  );

  return (
    <div
      ref={panelRef}
      id="planting-panel"
      className="fixed bottom-0 left-0 right-0 z-[30000] flex flex-col items-center"
      style={{ pointerEvents: 'none' }}  // let map events pass by default
    >
      {/* The card itself has pointer-events:auto */}
      <div
        className="relative w-full max-w-2xl mx-auto mb-3 px-3"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Glass card */}
        <div
          className="relative bg-gradient-to-b from-amber-950/95 to-amber-900/97 border-2 border-amber-500/70 rounded-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md overflow-hidden"
          style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,100,0.15)' }}
        >
          {/* Top handle bar */}
          <div className="flex justify-center pt-2 pb-0">
            <div className="w-12 h-1 rounded-full bg-amber-500/40" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-2 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span className="text-amber-200 font-black text-sm tracking-wide uppercase">
                Escolha a Cultura
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-800/60 hover:bg-amber-700 text-amber-300 text-sm font-bold transition-colors"
              aria-label="Fechar painel"
            >
              ✕
            </button>
          </div>

          {/* Instruction hint */}
          <p className="text-amber-400/70 text-[10px] text-center px-4 pb-1 font-semibold">
            Segure e arraste sobre os canteiros para plantar
          </p>

          {/* Seed grid */}
          <div className="flex gap-2 overflow-x-auto pb-4 pt-1 px-3 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {seeds.map((seed) => {
              const canPlant = seed.unlocked && seed.qty > 0;
              return (
                <div
                  key={seed.cropId}
                  id={`seed-card-${seed.cropId}`}
                  onPointerDown={(e) => handleSeedPointerDown(e, seed)}
                  onTouchStart={(e) => handleSeedTouchStart(e, seed)}
                  className={[
                    'relative flex-shrink-0 flex flex-col items-center gap-1',
                    'w-[72px] rounded-2xl border-2 py-2 px-1 transition-all duration-150 select-none',
                    canPlant
                      ? 'bg-amber-800/60 border-amber-500/60 hover:bg-amber-700/80 hover:border-amber-400 active:scale-95 cursor-grab active:cursor-grabbing'
                      : 'bg-amber-950/50 border-amber-800/30 opacity-50 cursor-not-allowed',
                  ].join(' ')}
                  title={
                    !seed.unlocked
                      ? `Requer nível ${seed.def.minLevel}`
                      : seed.qty <= 0
                      ? 'Sem sementes no silo'
                      : `Arraste para plantar (${seed.qty} disponível)`
                  }
                >
                  {/* Lock overlay */}
                  {!seed.unlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-amber-950/60 z-10">
                      <span className="text-lg">🔒</span>
                      <span className="text-[9px] text-amber-400/80 font-bold">
                        Nív.{seed.def.minLevel}
                      </span>
                    </div>
                  )}

                  {/* Crop icon */}
                  <span className="text-3xl leading-none" style={{ filter: canPlant ? 'none' : 'grayscale(80%)' }}>
                    {seed.def.icon}
                  </span>

                  {/* Crop name */}
                  <span className="text-amber-100 font-bold text-[10px] text-center leading-tight">
                    {seed.def.name}
                  </span>

                  {/* Grow time */}
                  <span className="text-amber-400/80 font-semibold text-[9px]">
                    ⏱ {fmtTime(seed.def.growTimeSeconds)}
                  </span>

                  {/* Quantity badge */}
                  <div className={[
                    'absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center',
                    'border text-[10px] font-black',
                    seed.qty > 0
                      ? 'bg-green-600 border-green-300 text-white'
                      : 'bg-red-900 border-red-600 text-red-200',
                  ].join(' ')}>
                    {seed.qty}
                  </div>

                  {/* Drag hint for available seeds */}
                  {canPlant && (
                    <div className="text-[8px] text-amber-500/60 font-semibold">
                      arraste ↑
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
