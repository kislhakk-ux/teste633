import React, { useState, useEffect } from 'react';
import { GameState, ItemId } from '../types/game';
import { sound } from '../utils/sound';
import { FishingCanvas } from './FishingCanvas';

interface FishingLakeViewProps {
  gameState: GameState;
  onReturnToFarm: () => void;
  onCatchFish: (lureId: ItemId, fishId: ItemId, spotId: string) => void;
}

export const FishingLakeView: React.FC<FishingLakeViewProps> = ({
  gameState,
  onReturnToFarm,
  onCatchFish,
}) => {
  const [selectedLure, setSelectedLure] = useState<ItemId | null>(null);
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  
  const [minigameClicks, setMinigameClicks] = useState(0);
  const [fishPos, setFishPos] = useState({ x: 50, y: 50 });
  const [fishCaught, setFishCaught] = useState<{ id: ItemId; name: string } | null>(null);

  const availableLures = [
    { id: 'red_lure' as ItemId, name: 'Isca Vermelha', icon: '🪱' },
    { id: 'green_lure' as ItemId, name: 'Isca Verde', icon: '🐛' },
  ].filter((lure) => (gameState.inventory[lure.id] || 0) > 0);

  // Auto-deselect if lure runs out
  useEffect(() => {
    if (selectedLure && (gameState.inventory[selectedLure] || 0) <= 0) {
      setSelectedLure(null);
    }
  }, [gameState.inventory, selectedLure]);

  // Minigame Fish Movement
  useEffect(() => {
    if (!activeSpot || fishCaught) return;
    
    const moveInterval = setInterval(() => {
      setFishPos({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      });
    }, 800);

    return () => clearInterval(moveInterval);
  }, [activeSpot, fishCaught]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return '0s';
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSpotClick = (spot: { id: string, status: string }) => {
    if (spot.status === 'cooldown') {
      sound.playError();
      return;
    }
    if (!selectedLure) {
      sound.playError();
      alert("Selecione uma isca na caixa de pesca primeiro!");
      return;
    }
    
    sound.playClick();
    setActiveSpot(spot.id);
    setMinigameClicks(0);
    setFishCaught(null);
  };

  const handleFishClick = () => {
    sound.playWoodHit(); // sound effect for tension
    const newClicks = minigameClicks + 1;
    setMinigameClicks(newClicks);

    if (newClicks >= 3) {
      // Caught!
      sound.playSuccess();
      
      let caughtId: ItemId = 'fish_fillet';
      let caughtName = 'Filé de Peixe';

      if (selectedLure === 'green_lure' && Math.random() > 0.4) {
        caughtId = 'salmon';
        caughtName = 'Salmão';
      }

      setFishCaught({ id: caughtId, name: caughtName });
      
      setTimeout(() => {
        onCatchFish(selectedLure!, caughtId, activeSpot!);
        setActiveSpot(null);
        setFishCaught(null);
        setSelectedLure(null);
      }, 3000);
    }
  };

  const spots = gameState.fishingBoat?.spots || [];

  return (
    <div className="absolute inset-0 bg-[#0288D1] overflow-hidden select-none flex flex-col font-sans">
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={() => {
            sound.playClick();
            onReturnToFarm();
          }}
          className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg border-2 border-amber-900 active:scale-95 transition-transform flex items-center gap-2"
        >
          <span>⬅️</span> Voltar
        </button>

        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-white font-black drop-shadow-md">
          Lago de Pesca
        </div>
      </div>

      {/* Lake Environment */}
      <div className="relative flex-1 w-full h-full bg-blue-900/50">
         <FishingCanvas 
            spots={spots}
            activeSpot={activeSpot}
            selectedLure={selectedLure}
            onSpotClick={handleSpotClick}
            onReturnToFarm={onReturnToFarm}
         />
      </div>

        {/* Minigame Overlay */}
        {activeSpot && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            {fishCaught ? (
              <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
                <div className="text-9xl drop-shadow-2xl mb-4 animate-bounce">
                  {fishCaught.id === 'salmon' ? '🍣' : '🐟'}
                </div>
                <div className="bg-green-500 text-white px-8 py-4 rounded-full font-black text-3xl border-4 border-white shadow-[0_0_30px_rgba(34,197,94,0.8)] text-center">
                  Você pescou:<br/>{fishCaught.name}!
                </div>
              </div>
            ) : (
              <div className="relative w-80 h-80 bg-blue-500/30 rounded-full border-8 border-white/40 shadow-2xl overflow-hidden flex items-center justify-center backdrop-blur-md">
                
                <div className="absolute top-4 text-white font-black text-lg drop-shadow-md bg-black/30 px-4 py-1 rounded-full">
                  Toque no peixe para puxar!
                </div>

                <div 
                  className="absolute text-5xl transition-all duration-300 ease-out cursor-pointer hover:scale-110 active:scale-95 drop-shadow-lg"
                  style={{ left: `${fishPos.x}%`, top: `${fishPos.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={handleFishClick}
                >
                  {selectedLure === 'green_lure' ? '🐠' : '🐟'}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-8 w-3/4 h-4 bg-black/50 rounded-full border-2 border-white/50 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-green-500 transition-all duration-200"
                    style={{ width: `${(minigameClicks / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Lure Selection Dock */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#3E2723] to-[#5D4037] border-t-8 border-[#4E342E] p-4 flex flex-col items-center z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <h3 className="text-amber-200 font-bold mb-2 uppercase tracking-wider text-sm drop-shadow">Caixa de Iscas</h3>
        
        <div className="flex gap-4">
          {availableLures.length === 0 ? (
            <div className="bg-black/20 text-amber-100/50 italic px-6 py-4 rounded-xl border-black/30 text-sm">
              Sua caixa está vazia. Produza iscas na sua fazenda!
            </div>
          ) : (
            availableLures.map((lure) => {
              const count = gameState.inventory[lure.id] || 0;
              const isSelected = selectedLure === lure.id;
              
              return (
                <button
                  key={lure.id}
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
