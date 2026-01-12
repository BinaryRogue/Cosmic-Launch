
import React, { useState, useRef, useEffect } from 'react';
import { PLANETS, NEBULA_IMAGE, WUKONG_IMAGE } from './constants';
import { PlanetName, GameState } from './types';
import PlanetCard from './components/PlanetCard';
import Rocket from './components/Rocket';
import { getWukongNarration } from './services/geminiService';

const BET_OPTIONS = [10, 50, 100, 500, 1000];

// Using reliable, high-fidelity audio assets for a cinematic experience
const SOUNDS = {
  // Takeoff blast
  launch: 'https://cdn.freesound.org/previews/399/399438_4057038-lq.mp3',
  // Sustained space engine rumble for the cruise phase
  cruise: 'https://cdn.freesound.org/previews/415/415511_8013327-lq.mp3',
  // Massive impact explosion
  explosion: 'https://cdn.freesound.org/previews/156/156031_2703579-lq.mp3'
};

const App: React.FC = () => {
  const [state, setState] = useState<GameState & { score: number }>({
    balance: 1000.00,
    currentBet: 100.00,
    selectedPlanet: null,
    targetPlanet: null,
    currentView: 'selection',
    message: '',
    lastResult: null,
    narration: '',
    showExplosion: false,
    wonAmount: 0,
    isMuted: false,
    score: 0
  });

  const [passingPlanet, setPassingPlanet] = useState<PlanetName | null>(null);
  const [rocketRotation, setRocketRotation] = useState(0);
  const [isImpactShaking, setIsImpactShaking] = useState(false);

  // Audio refs for precise lifecycle management
  const launchAudioRef = useRef<HTMLAudioElement | null>(null);
  const cruiseAudioRef = useRef<HTMLAudioElement | null>(null);
  const explosionAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio objects with explicit preloading
    launchAudioRef.current = new Audio(SOUNDS.launch);
    cruiseAudioRef.current = new Audio(SOUNDS.cruise);
    explosionAudioRef.current = new Audio(SOUNDS.explosion);
    
    if (launchAudioRef.current) {
      launchAudioRef.current.volume = 0.5;
      launchAudioRef.current.load();
    }
    if (cruiseAudioRef.current) {
      cruiseAudioRef.current.volume = 0.4;
      cruiseAudioRef.current.loop = true;
      cruiseAudioRef.current.load();
    }
    if (explosionAudioRef.current) {
      explosionAudioRef.current.volume = 0.8;
      explosionAudioRef.current.load();
    }

    return () => {
      launchAudioRef.current?.pause();
      cruiseAudioRef.current?.pause();
      explosionAudioRef.current?.pause();
    };
  }, []);

  // Synchronize mute state across all audio elements
  useEffect(() => {
    const audios = [launchAudioRef.current, cruiseAudioRef.current, explosionAudioRef.current];
    audios.forEach(a => { if (a) a.muted = state.isMuted; });
  }, [state.isMuted]);

  const selectedPlanetData = PLANETS.find(p => p.name === state.selectedPlanet);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const toggleMute = () => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const playSound = (audio: HTMLAudioElement | null) => {
    if (audio && !state.isMuted) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn("Audio play blocked", e));
    }
  };

  const handleLaunch = async () => {
    if (!state.selectedPlanet || !selectedPlanetData || state.currentView !== 'selection' || state.balance < state.currentBet) return;

    // Phase 1: Launch Sequence - Start the blast and the cruise engine loop
    playSound(launchAudioRef.current);
    if (cruiseAudioRef.current && !state.isMuted) {
      cruiseAudioRef.current.currentTime = 0;
      cruiseAudioRef.current.play().catch(() => {});
    }

    setState(prev => ({ 
      ...prev, 
      currentView: 'launching', 
      showExplosion: false 
    }));
    
    setIsImpactShaking(false);
    
    const isWinRoll = Math.random() < selectedPlanetData.winChance;
    let target: PlanetName;
    
    if (isWinRoll) {
      target = state.selectedPlanet;
    } else {
      const otherPlanets = PLANETS.filter(p => p.name !== state.selectedPlanet);
      const randomIndex = Math.floor(Math.random() * otherPlanets.length);
      target = otherPlanets[randomIndex].name;
    }

    const journeySequence = async () => {
      // Simulate trajectory time
      await new Promise(r => setTimeout(r, 800));

      // Planets passing by during cruise phase
      const planetsToPass = PLANETS.filter(p => p.name !== target).sort(() => 0.5 - Math.random()).slice(0, 2);
      for (const p of planetsToPass) {
        setPassingPlanet(p.name);
        setRocketRotation((Math.random() - 0.5) * 15);
        await new Promise(r => setTimeout(r, 600)); 
        setPassingPlanet(null);
        await new Promise(r => setTimeout(r, 100)); 
      }

      setPassingPlanet(target);
      setRocketRotation(0);
      
      // Impact timing
      setTimeout(async () => {
        // Phase 2: Impact - Kill the cruise loop and play the explosion blast
        if (cruiseAudioRef.current) {
          cruiseAudioRef.current.pause();
        }
        playSound(explosionAudioRef.current);

        setIsImpactShaking(true);
        setState(prev => ({ ...prev, showExplosion: true }));
        
        const isSuccess = state.selectedPlanet === target;
        const scoreChange = isSuccess ? 100 : -100;
        const rawDelta = isSuccess 
          ? (state.currentBet * selectedPlanetData.multiplier)
          : -state.currentBet;
        
        const delta = parseFloat(rawDelta.toFixed(2));

        // Generate Wukong-style narration
        const narration = await getWukongNarration(state.selectedPlanet!, target, isSuccess, Math.abs(delta));

        setTimeout(() => {
          setState(prev => ({
            ...prev,
            targetPlanet: target,
            currentView: 'result',
            balance: Math.max(0, parseFloat((prev.balance + delta).toFixed(2))),
            lastResult: isSuccess ? 'win' : 'loss',
            wonAmount: Math.abs(delta),
            score: prev.score + scoreChange,
            narration: narration,
            message: isSuccess ? 'SUCCESS' : 'LOST'
          }));
          setIsImpactShaking(false);
        }, 1200);
      }, 700);
    };

    journeySequence();
  };

  const refillBalance = () => {
    setState(prev => ({ ...prev, balance: 1000.00, score: 0 }));
  };

  const MuteButton = () => (
    <button 
      onClick={toggleMute}
      className="fixed top-8 right-8 z-[100] w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-white/10 hover:bg-white/10 transition-all text-white/80"
      title={state.isMuted ? "Unmute" : "Mute"}
    >
      {state.isMuted ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );

  const renderSelection = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-8 z-10 overflow-hidden">
      <MuteButton />
      
      {/* Dynamic Cinematic Background */}
      <div className="absolute inset-0 -z-30 bg-black">
        <div 
          className="absolute inset-0 opacity-40 scale-110 animate-wukong-cinematic grayscale-[0.2]"
          style={{ backgroundImage: `url('${WUKONG_IMAGE}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      </div>

      <div className="absolute inset-0 -z-20 overflow-hidden">
        <img src={NEBULA_IMAGE} className="w-full h-full object-cover nebula-drift opacity-30" alt="nebula" />
      </div>

      <header className="text-center mt-4">
        <h1 className="text-6xl md:text-8xl font-cinzel font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-50 via-yellow-400 to-yellow-700 drop-shadow-2xl">
          COSMIC LAUNCH
        </h1>
        <p className="text-yellow-500/60 font-cinzel tracking-[0.6em] text-[10px] md:text-xs mt-3 uppercase italic">Wager your Destiny • Forge your Path</p>
      </header>

      <div className="w-full max-w-7xl">
        <div className="glass-panel p-6 md:p-8 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
              <div className="flex flex-col">
                <h3 className="font-cinzel text-xl text-yellow-50/80 tracking-[0.1em] uppercase font-black">Celestial Chart</h3>
                <span className="text-[10px] text-white/30 tracking-widest">Select a destination to initiate sequence</span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
                    <span className="text-white/40 text-[9px] font-bold tracking-[0.4em] uppercase mb-1">Current Score</span>
                    <span className={`text-4xl font-cinzel font-bold text-white leading-none`}>
                        {state.score}
                    </span>
                </div>
                <div className="flex flex-col items-center bg-yellow-500/5 px-6 py-2 rounded-2xl border border-yellow-500/10">
                    <span className="text-yellow-500/40 text-[9px] font-bold tracking-[0.4em] uppercase mb-1">Vault Balance</span>
                    <span className={`text-4xl font-cinzel font-bold text-yellow-400 leading-none`}>
                        {formatCurrency(state.balance)} <span className="text-xs opacity-40">RS</span>
                    </span>
                </div>
              </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
            {PLANETS.map((planet) => (
              <PlanetCard
                key={planet.name}
                planet={planet}
                isSelected={state.selectedPlanet === planet.name}
                onClick={() => setState(prev => ({ ...prev, selectedPlanet: planet.name }))}
                disabled={false}
              />
            ))}
          </div>

          <div className="border-t border-white/5 pt-8">
            <h4 className="font-cinzel text-[10px] text-yellow-500/40 text-center uppercase tracking-[0.5em] mb-6 font-bold">Configure Wager</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {BET_OPTIONS.map(opt => (
                <button
                  key={opt}
                  disabled={state.balance < opt}
                  onClick={() => setState(prev => ({ ...prev, currentBet: opt }))}
                  className={`px-8 py-3 rounded-2xl font-cinzel font-black transition-all border-2 text-sm
                    ${state.currentBet === opt ? 'border-yellow-500 bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-105' : 'border-white/5 text-white/60 hover:text-white hover:bg-white/5'}
                    ${state.balance < opt ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => setState(prev => ({ ...prev, currentBet: prev.balance }))}
                className={`px-8 py-3 rounded-2xl font-cinzel font-black transition-all border-2 text-sm border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/10
                  ${state.currentBet === state.balance ? 'bg-red-600 text-white border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105' : ''}
                `}
              >
                ALL-IN
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 flex flex-col items-center gap-6">
        {state.balance <= 0 && (
          <button 
            onClick={refillBalance}
            className="text-yellow-500 text-[10px] font-cinzel font-black tracking-[0.4em] hover:text-yellow-300 transition-colors uppercase animate-pulse"
          >
            [ Divine Resurgence Available ]
          </button>
        )}
        <button
          onClick={handleLaunch}
          disabled={!state.selectedPlanet || state.balance < state.currentBet}
          className={`group relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 transform active:scale-90 disabled:opacity-20 disabled:grayscale
            bg-blue-600 shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:bg-blue-400 hover:shadow-[0_0_80px_rgba(37,99,235,1)]
          `}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-30" />
          <span className="text-white font-cinzel font-black text-lg tracking-tighter group-hover:scale-110 uppercase">LAUNCH</span>
        </button>
      </div>
    </div>
  );

  const renderLaunching = () => {
    const currentPlanet = PLANETS.find(p => p.name === passingPlanet);
    return (
      <div className={`relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden ${isImpactShaking ? 'animate-impact-shake' : ''}`}>
        <MuteButton />
        <div className="absolute inset-0 -z-10">
             <img src={NEBULA_IMAGE} className="w-full h-full object-cover nebula-drift brightness-[0.2]" alt="nebula" />
        </div>

        {passingPlanet && (
            <div key={passingPlanet} className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
                <div className="animate-planet-pass flex flex-col items-center">
                    <img 
                      src={currentPlanet?.imageUrl} 
                      className={`w-96 h-96 rounded-full shadow-[0_0_120px_rgba(255,255,255,0.05)] transition-transform duration-500
                        ${state.showExplosion ? 'scale-125 brightness-[3]' : 'scale-100'}
                      `} 
                      alt="pass-planet" 
                    />
                    <span className="mt-12 font-cinzel text-white/20 tracking-[1.5em] uppercase text-xs font-black">{passingPlanet}</span>
                </div>
            </div>
        )}

        {state.showExplosion && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
                <div className="w-48 h-48 bg-white rounded-full blast shadow-[0_0_150px_#fff]"></div>
                <div className="absolute inset-0 bg-white opacity-0 impact-flash"></div>
            </div>
        )}

        <div className={`relative z-10 transform scale-150 transition-all duration-300
          ${state.showExplosion ? 'scale-0 opacity-0' : 'translate-y-0'}
        `}>
          <Rocket isFlying={true} isShaking={!state.showExplosion} rotation={rocketRotation} />
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
                <div className="w-28 h-28 rounded-full bg-red-600 shadow-[0_0_60px_rgba(220,38,38,0.9)] flex items-center justify-center animate-pulse border-4 border-white/10">
                    <span className="text-white font-cinzel font-black text-lg tracking-tighter uppercase">ENGAGED</span>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
        <MuteButton />
        <div className="absolute inset-0 -z-20">
             <img src={NEBULA_IMAGE} className="w-full h-full object-cover nebula-drift opacity-30 grayscale-[0.8]" alt="nebula" />
        </div>
        <div className={`absolute inset-0 -z-10 ${state.lastResult === 'win' ? 'bg-green-950/20' : 'bg-red-950/20'}`}></div>

        <div className="w-full max-w-6xl flex flex-col items-center text-center space-y-10">
          
          <div className="space-y-4">
            <div className="flex flex-col items-center">
                <span className={`font-cinzel text-2xl tracking-[1em] mb-4 uppercase font-black ${state.lastResult === 'win' ? 'text-green-400' : 'text-red-500'}`}>
                    {state.message}
                </span>
                <div className="bg-white/10 px-8 py-3 rounded-2xl mb-6">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest mr-4">Result Score</span>
                    <span className={`text-4xl font-cinzel font-black ${state.lastResult === 'win' ? 'text-green-400' : 'text-red-500'}`}>
                        {state.lastResult === 'win' ? '+100' : '-100'}
                    </span>
                </div>
                
                {state.lastResult === 'win' ? (
                  <h2 className="text-[12rem] md:text-[14rem] font-cinzel font-black leading-none text-green-400 drop-shadow-[0_20px_60px_rgba(34,197,94,0.6)] animate-pulse">
                    +{formatCurrency(state.wonAmount)}
                  </h2>
                ) : (
                  <h2 className="text-[12rem] md:text-[14rem] font-cinzel font-black leading-none text-red-500 drop-shadow-[0_20px_60px_rgba(239,68,68,0.6)]">
                    -{formatCurrency(state.wonAmount)}
                  </h2>
                )}
            </div>
          </div>

          <div className="glass-panel p-10 md:p-14 rounded-[4rem] border-white/5 shadow-2xl relative w-full overflow-hidden max-w-3xl">
            <div className="relative z-10 flex flex-col items-center">
                <p className="text-2xl md:text-3xl font-cinzel leading-relaxed text-yellow-50/90 italic mb-10 font-medium">
                    "{state.narration}"
                </p>
                
                <div className="flex items-center gap-10 bg-black/60 px-10 py-6 rounded-[2.5rem] border border-white/5">
                    <div className="text-left flex flex-col items-start">
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-black mb-1">Target</p>
                        <p className="text-xl font-cinzel font-black text-blue-400 tracking-wider">{state.selectedPlanet}</p>
                    </div>
                    <div className="w-[1px] h-12 bg-white/10"></div>
                    <div className="text-right flex flex-col items-end">
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-black mb-1">Impact</p>
                        <p className={`text-xl font-cinzel font-black tracking-wider ${state.lastResult === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                            {state.targetPlanet}
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
              <div className="flex gap-20">
                <div className="text-center">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.6em] mb-3 font-bold">Vault Wealth</p>
                    <p className="text-5xl font-cinzel font-black text-yellow-400">
                        {formatCurrency(state.balance)} <span className="text-lg opacity-40">RS</span>
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-white/20 text-[10px] uppercase tracking-[0.6em] mb-3 font-bold">Total Score</p>
                    <p className="text-5xl font-cinzel font-black text-white">
                        {state.score}
                    </p>
                </div>
              </div>
              <button
                  onClick={() => setState(prev => ({ ...prev, currentView: 'selection', selectedPlanet: null, targetPlanet: null, narration: '' }))}
                  className="px-20 py-8 bg-white text-black font-cinzel font-black text-2xl tracking-[0.3em] rounded-full hover:bg-yellow-400 hover:text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)] uppercase"
              >
                  {state.balance > 0 ? 'Next Sequence' : 'Return to Void'}
              </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden select-none">
        {state.currentView === 'selection' && renderSelection()}
        {state.currentView === 'launching' && renderLaunching()}
        {state.currentView === 'result' && renderResult()}
    </div>
  );
};

export default App;
