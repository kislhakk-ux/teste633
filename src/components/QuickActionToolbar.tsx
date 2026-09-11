import React, { useState } from 'react';
import { sound } from '../utils/sound';

interface QuickActionToolbarProps {
  onOpenOrderBoard: () => void;
  onOpenRoadsideShop: () => void;
  onOpenNewspaper: () => void;
  onOpenSilo: () => void;
  onOpenBarn: () => void;
  onOpenLuckyWheel: () => void;
  onHarvestAllReady: () => void;
  hasHarvestableCrops: boolean;
}

export const QuickActionToolbar: React.FC<QuickActionToolbarProps> = ({
  onOpenOrderBoard,
  onOpenRoadsideShop,
  onOpenNewspaper,
  onOpenSilo,
  onOpenBarn,
  onOpenLuckyWheel,
  onHarvestAllReady,
  hasHarvestableCrops,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <footer className="absolute bottom-3 left-0 right-0 z-30 px-3 flex flex-col items-center gap-2 pointer-events-none select-none">
      
      {/* Secondary Floating Actions Menu (Extras) */}
      {isMenuOpen && (
        <div className="bg-gradient-to-r from-amber-950/95 via-amber-900/95 to-amber-950/95 border-2 border-amber-400/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-2 pointer-events-auto backdrop-blur-xs animate-in slide-in-from-bottom-2 fade-in duration-150">
          {/* Silo */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSilo();
            }}
            className="flex flex-col items-center justify-center w-12 h-12 bg-amber-900/80 hover:bg-amber-800 text-amber-100 rounded-xl border border-amber-400/80 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Silo de Grãos"
          >
            <span className="text-lg">🌾</span>
            <span className="text-[8px] font-bold">Silo</span>
          </button>

          {/* Barn */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBarn();
            }}
            className="flex flex-col items-center justify-center w-12 h-12 bg-amber-900/80 hover:bg-amber-800 text-amber-100 rounded-xl border border-amber-400/80 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Celeiro"
          >
            <span className="text-lg">🛖</span>
            <span className="text-[8px] font-bold">Celeiro</span>
          </button>

          {/* Lucky Wheel */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLuckyWheel();
            }}
            className="flex flex-col items-center justify-center w-12 h-12 bg-purple-900/80 hover:bg-purple-800 text-purple-100 rounded-xl border border-purple-400/80 active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Girar Roleta"
          >
            <span className="text-lg">🎡</span>
            <span className="text-[8px] font-bold">Roleta</span>
          </button>
        </div>
      )}

      {/* Main bottom dock */}
      <div className="bg-gradient-to-r from-amber-950/95 via-amber-900/95 to-amber-950/95 border-2 border-amber-400/90 rounded-3xl p-1.5 sm:p-2 shadow-2xl flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto backdrop-blur-xs max-w-full">
        {/* Truck Order Board */}
        <button
          id="btn-bottom-orders"
          onClick={() => {
            sound.playClick();
            onOpenOrderBoard();
          }}
          className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 bg-gradient-to-t from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white rounded-2xl shadow-lg border-2 border-amber-300 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <span className="text-xl sm:text-2xl">📋</span>
          <span className="text-[10px] font-black tracking-tight">Pedidos</span>
        </button>

        {/* Roadside Stand */}
        <button
          id="btn-bottom-roadside"
          onClick={() => {
            sound.playClick();
            onOpenRoadsideShop();
          }}
          className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 bg-gradient-to-t from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-2xl shadow-lg border-2 border-orange-300 active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Minha Banca de Vendas"
        >
          <span className="text-xl sm:text-2xl">🏪</span>
          <span className="text-[10px] font-black tracking-tight">Banca</span>
        </button>

        {/* Newspaper (Jornal Diário) */}
        <button
          id="btn-bottom-newspaper"
          onClick={() => {
            sound.playClick();
            onOpenNewspaper();
          }}
          className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 bg-gradient-to-t from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white rounded-2xl shadow-lg border-2 border-red-300 active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Jornal do Fazendeiro"
        >
          <span className="text-xl sm:text-2xl">📰</span>
          <span className="text-[10px] font-black tracking-tight">Jornal</span>
        </button>

        {/* Quick Harvest All (if ready crops exist) */}
        {hasHarvestableCrops && (
          <button
            id="btn-harvest-all"
            onClick={() => {
              onHarvestAllReady();
            }}
            className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 bg-gradient-to-t from-emerald-600 to-green-400 hover:from-emerald-500 hover:to-green-300 text-white rounded-2xl shadow-lg border-2 border-white animate-bounce active:scale-95 transition-all shrink-0 cursor-pointer"
            title="Colher todos os canteiros prontos"
          >
            <span className="text-xl sm:text-2xl">✂️</span>
            <span className="text-[10px] font-black tracking-tight">Colher!</span>
          </button>
        )}

        {/* Extras drawer toggle button */}
        <button
          id="btn-toggle-menu"
          onClick={() => {
            sound.playClick();
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`flex flex-col items-center justify-center w-14 sm:w-16 h-14 rounded-2xl shadow-lg border-2 active:scale-95 transition-all shrink-0 cursor-pointer ${
            isMenuOpen 
              ? 'bg-amber-500 text-white border-white' 
              : 'bg-gradient-to-t from-amber-800 to-amber-600 hover:from-amber-700 hover:to-amber-500 text-amber-100 border-amber-400'
          }`}
          title="Mais opções de jogo"
        >
          <span className="text-xl sm:text-2xl">{isMenuOpen ? '❌' : '📦'}</span>
          <span className="text-[10px] font-black tracking-tight">{isMenuOpen ? 'Fechar' : 'Mais'}</span>
        </button>
      </div>
    </footer>
  );
};
