
import React from 'react';

interface RocketProps {
  isFlying: boolean;
  isShaking?: boolean;
  rotation?: number;
}

const Rocket: React.FC<RocketProps> = ({ isFlying, isShaking, rotation = 0 }) => {
  return (
    <div 
      className={`relative transition-transform duration-500 ease-out ${isShaking ? 'animate-shake' : ''}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Engine Heat Glow (Vacuum Plume) */}
      <div className={`absolute -bottom-24 left-1/2 -translate-x-1/2 w-24 h-48 bg-blue-400/20 blur-3xl rounded-full transition-opacity duration-300 ${isFlying ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* SpaceX Style Body (Sleek White/Stainless Steel) */}
      <div className="w-10 h-36 bg-white relative shadow-[inset_-2px_0_10px_rgba(0,0,0,0.4)] rounded-t-full border-x border-t border-gray-300">
        
        {/* SpaceX Logo Placeholder Detail */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-black/80"></div>
        <div className="absolute top-[26%] left-1/2 -translate-x-1/2 w-2 h-[1px] bg-black/40"></div>

        {/* Port Window (Black rectangle style) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-5 bg-black rounded-sm border border-gray-800"></div>
        
        {/* Top Grid Fins (Falcon 9 style) */}
        <div className="absolute top-12 -left-2 w-2 h-4 bg-gray-800 opacity-80"></div>
        <div className="absolute top-12 -right-2 w-2 h-4 bg-gray-800 opacity-80"></div>

        {/* Bottom Landing Legs / Base Detail */}
        <div className="absolute -left-3 bottom-0 w-3 h-12 bg-black rounded-bl-lg"></div>
        <div className="absolute -right-3 bottom-0 w-3 h-12 bg-black rounded-br-lg"></div>
        
        {/* Engine Nozzle Section (Black) */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-3 bg-zinc-900 rounded-b-sm"></div>

        {/* Realistic High-Speed Exhaust */}
        {isFlying && (
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            {/* Core Super-heated White Flame */}
            <div className="w-5 h-20 bg-gradient-to-b from-white via-cyan-100 to-transparent rounded-full opacity-100 blur-[2px] animate-pulse"></div>
            {/* Expanded Blue/Purple Vacuum Plume */}
            <div className="absolute top-0 w-14 h-32 bg-gradient-to-b from-blue-600/40 via-purple-600/10 to-transparent rounded-full opacity-40 blur-lg animate-pulse"></div>
            {/* Mach Diamonds / Pulses */}
            <div className="absolute top-4 w-4 h-1 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute top-12 w-3 h-1 bg-white/20 rounded-full animate-ping delay-150"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rocket;
