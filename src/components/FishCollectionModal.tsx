import React from 'react';
import { GameState, ItemId } from '../types/game';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';

interface FishCollectionModalProps {
  gameState: GameState;
  onClose: () => void;
}

const FISH_TYPES: ItemId[] = ['fish_fillet', 'salmon', 'trout', 'bass', 'catfish'];

export const FishCollectionModal: React.FC<FishCollectionModalProps> = ({ gameState, onClose }) => {
  const fishCollection = gameState.fishCollection || {};

  const totalCaught = Object.values(fishCollection).reduce((acc, curr) => acc + curr.caught, 0);
  const uniqueCaught = FISH_TYPES.filter(id => (fishCollection[id]?.caught || 0) > 0).length;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4 font-sans">
      <div className="bg-[#FFF8E1] w-full max-w-3xl rounded-3xl shadow-2xl border-4 border-[#8D6E63] overflow-hidden flex flex-col relative max-h-[90vh]">
        
        {/* Book Binding effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#5D4037] border-r-4 border-[#3E2723] z-10" />
        
        {/* Header */}
        <div className="bg-[#795548] p-6 pl-14 text-white flex justify-between items-center shadow-md relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#8D6E63] rounded-full flex items-center justify-center text-2xl border-2 border-[#A1887F] shadow-inner">
               📖
             </div>
             <div>
               <h2 className="text-2xl font-black drop-shadow-md tracking-wide">Coleção de Peixes</h2>
               <p className="text-amber-200 text-sm font-semibold opacity-90 drop-shadow">
                 Você já pescou {totalCaught} peixes ({uniqueCaught}/{FISH_TYPES.length} espécies)
               </p>
             </div>
          </div>
          
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white font-bold border-2 border-red-700 shadow-md transition-transform active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Content (Grid of Fish) */}
        <div className="flex-1 overflow-y-auto p-6 pl-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
          
          {FISH_TYPES.map((fishId) => {
            const def = ITEMS[fishId];
            const data = fishCollection[fishId];
            const isCaught = data && data.caught > 0;
            
            return (
              <div 
                key={fishId}
                className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                  isCaught 
                    ? 'bg-white border-[#8D6E63] shadow-md hover:-translate-y-1 hover:shadow-xl' 
                    : 'bg-[#EFEBE9] border-[#BCAAA4] opacity-80'
                }`}
              >
                {/* Image/Icon */}
                <div className={`text-6xl mb-4 transition-all duration-500 ${isCaught ? 'drop-shadow-lg' : 'grayscale brightness-0 opacity-20'}`}>
                  {def.icon}
                </div>
                
                {/* Title */}
                <h3 className={`font-black text-xl mb-1 text-center ${isCaught ? 'text-[#4E342E]' : 'text-[#9E9E9E]'}`}>
                  {isCaught ? def.name : '???'}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-[#795548] text-center h-10 line-clamp-2 mb-4 italic">
                  {isCaught ? def.description : 'Continue pescando para descobrir esta espécie.'}
                </p>

                {/* Stats */}
                <div className="w-full bg-[#F5F5F5] rounded-xl p-3 border border-[#E0E0E0] flex justify-between items-center text-sm font-semibold text-[#616161]">
                   <div className="flex flex-col items-center">
                     <span className="text-[#9E9E9E] text-xs uppercase tracking-wider">Pescados</span>
                     <span className={`text-lg ${isCaught ? 'text-green-600 font-black' : ''}`}>{isCaught ? data.caught : 0}</span>
                   </div>
                   <div className="h-6 w-px bg-[#E0E0E0]"></div>
                   <div className="flex flex-col items-center">
                     <span className="text-[#9E9E9E] text-xs uppercase tracking-wider">Maior Peso</span>
                     <span className={`text-lg ${isCaught && data.largestWeight ? 'text-amber-600 font-black' : ''}`}>
                       {isCaught && data.largestWeight ? `${data.largestWeight.toFixed(1)}kg` : '--'}
                     </span>
                   </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};
