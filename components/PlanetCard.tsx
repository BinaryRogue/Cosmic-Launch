
import React from 'react';
import { Planet } from '../types';

interface PlanetCardProps {
  planet: Planet;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const PlanetCard: React.FC<PlanetCardProps> = ({ planet, isSelected, onClick, disabled }) => {
  // Convert winChance decimal to percentage string
  const winPercentage = Math.floor(planet.winChance * 100);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center w-full min-w-[100px] p-4 transition-all duration-500 rounded-3xl border-2
        ${isSelected 
          ? 'border-yellow-500 bg-yellow-500/10 scale-105 shadow-[0_0_30px_rgba(234,179,8,0.3)]' 
          : 'border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/20'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
    >
      {/* Dynamic Size Planet Image Wrapper */}
      <div className={`relative flex items-center justify-center h-20 mb-4`}>
        <div className={`rounded-full overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6
          ${isSelected ? 'ring-4 ring-yellow-500/50' : 'ring-1 ring-white/10'} 
          ${planet.size.replace('w-', 'w-').replace('h-', 'h-')}
        `}>
          <img src={planet.imageUrl} alt={planet.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex flex-col items-center w-full space-y-1">
        <span className="text-white text-[11px] font-cinzel font-black tracking-[0.1em] uppercase truncate">
          {planet.name}
        </span>
        
        <div className="h-[1px] w-8 bg-white/10 my-1"></div>
        
        <div className="flex flex-col items-center space-y-0.5">
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
            {winPercentage}% Chance
          </span>
          <span className={`text-[12px] font-black uppercase tracking-tighter ${isSelected ? 'text-yellow-400' : 'text-yellow-500/80'}`}>
            {planet.profitLabel}
          </span>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-[12px] text-black font-black border-2 border-black shadow-lg">
          ✓
        </div>
      )}
    </button>
  );
};

export default PlanetCard;
