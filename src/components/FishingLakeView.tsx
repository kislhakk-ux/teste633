import React, { useState } from 'react';
import { GameState, ItemId } from '../types/game';
import { sound } from '../utils/sound';

interface FishingLakeViewProps {
  gameState: GameState;
  onReturnToFarm: () => void;
  onCatchFish: (lureId: ItemId, fishId: ItemId) => void;
}

export const FishingLakeView: React.FC<FishingLakeViewProps> = ({
  gameState,
  onReturnToFarm,
  onCatchFish,
}) => {
  const [selectedLure, setSelectedLure] = useState<ItemId | null>(null);
  const [isFishing, setIsFishing] = useState(false);
  const [fishCaught, setFishCaught] = useState<{ id: ItemId; name: string } | null>(null);

  const availableLures = [
    { id: 'red_lure' as ItemId, name: 'Isca Vermelha', icon: '🪱' },
    { id: 'green_lure' as ItemId, name: 'Isca Verde', icon: '🐛' },
  ].filter((lure) => (gameState.inventory[lure.id] || 0) > 0);

  const handleCastLure = () => {
    if (!selectedLure || isFishing) return;
    
    sound.playClick();
    setIsFishing(true);
    setFishCaught(null);

    // Simulate fishing time (3 seconds)
    setTimeout(() => {
      sound.playSuccess();
      
      // Determine what was caught based on lure
      let caughtId: ItemId = 'fish_fillet';
      let caughtName = 'Filé de Peixe';

      if (selectedLure === 'green_lure' && Math.random() > 0.5) {
        caughtId = 'salmon';
        caughtName = 'Salmão';
      }

      setFishCaught({ id: caughtId, name: caughtName });
      setIsFishing(false);
      onCatchFish(selectedLure, caughtId);
      setSelectedLure(null);
    }, 3000);
  };

  return (
    <div className="absolute inset-0 bg-[#0288D1] overflow-hidden select-none flex flex-col">
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={() => {
            sound.playClick();
            onReturnToFarm();
          }}
          className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg border-2 border-amber-900 active:scale-95 transition-transform flex items-center gap-2"
        >
          <span>⬅️</span> Voltar à Fazenda
        </button>

        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-white font-black drop-shadow-md">
          Lago de Pesca Silencioso
        </div>
      </div>

      {/* Lake Environment */}
      <div className="relative flex-1 w-full h-full cursor-pointer flex items-center justify-center overflow-hidden" onClick={handleCastLure}>
        {/* Ripples */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-[#0288D1] to-[#01579B]"></div>
        
        {isFishing ? (
          <div className="z-10 flex flex-col items-center animate-bounce">
            <div className="text-6xl drop-shadow-lg">🎣</div>
            <div className="mt-4 bg-black/40 text-white px-4 py-2 rounded-full font-bold animate-pulse">
              Pescando...
            </div>
            
            {/* Water splash effect */}
            <div className="absolute top-16 w-16 h-4 bg-white/40 rounded-[100%] animate-ping"></div>
          </div>
        ) : fishCaught ? (
          <div className="z-10 flex flex-col items-center animate-in zoom-in-50 duration-500">
            <div className="text-8xl drop-shadow-2xl mb-4 animate-bounce">
              {fishCaught.id === 'salmon' ? '🍣' : '🐟'}
            </div>
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-black text-2xl border-4 border-white shadow-[0_0_20px_rgba(34,197,94,0.8)]">
              Você pescou: {fishCaught.name}!
            </div>
            <p className="mt-4 text-white/80 font-bold bg-black/30 px-3 py-1 rounded-full">Toque na água para pescar novamente</p>
          </div>
        ) : (
          <div className="z-10 text-center opacity-80 hover:opacity-100 transition-opacity">
            <div className="text-8xl drop-shadow-lg opacity-40 mb-4 animate-pulse">🐟</div>
            <h2 className="text-white text-3xl font-black drop-shadow-md">
              {selectedLure ? 'Toque na água para arremessar!' : 'Selecione uma isca abaixo'}
            </h2>
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 text-6xl drop-shadow-lg">🌿</div>
        <div className="absolute top-20 right-20 text-5xl drop-shadow-lg">🦆</div>
        <div className="absolute bottom-32 right-12 text-6xl drop-shadow-lg transform scale-x-[-1]">🌿</div>
      </div>

      {/* Lure Selection Dock */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#3E2723] to-[#5D4037] border-t-8 border-[#4E342E] p-4 flex flex-col items-center z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <h3 className="text-amber-200 font-bold mb-2 uppercase tracking-wider text-sm drop-shadow">Caixa de Pesca</h3>
        
        <div className="flex gap-4">
          {availableLures.length === 0 ? (
            <div className="bg-black/20 text-amber-100/50 italic px-6 py-4 rounded-xl border border-black/30">
              Você não tem iscas! Produza na Fábrica de Iscas.
            </div>
          ) : (
            availableLures.map((lure) => {
              const count = gameState.inventory[lure.id] || 0;
              const isSelected = selectedLure === lure.id;
              
              return (
                <button
                  key={lure.id}
                  disabled={isFishing}
                  onClick={() => {
                    sound.playClick();
                    setSelectedLure(lure.id);
                  }}
                  className={`relative flex flex-col items-center p-3 rounded-2xl border-4 transition-all ${
                    isSelected 
                      ? 'bg-amber-400 border-white scale-110 shadow-[0_0_20px_#FBBF24] z-10' 
                      : 'bg-[#8D6E63] border-[#3E2723] opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <div className="text-4xl drop-shadow-md bg-white/20 p-2 rounded-full mb-1">
                    {lure.icon}
                  </div>
                  <div className="text-white font-black text-sm drop-shadow-md leading-tight">
                    {lure.name}
                  </div>
                  
                  {/* Badge count */}
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white font-black text-sm w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                    {count}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
