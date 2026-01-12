
export type PlanetName = 'Mercury' | 'Venus' | 'Earth' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune';

export interface Planet {
  name: PlanetName;
  color: string;
  size: string;
  description: string;
  imageUrl: string;
  winChance: number; // 0 to 1
  multiplier: number;
  profitLabel: string;
}

export type ViewState = 'selection' | 'launching' | 'result';

export interface GameState {
  balance: number;
  currentBet: number;
  selectedPlanet: PlanetName | null;
  targetPlanet: PlanetName | null;
  currentView: ViewState;
  message: string;
  lastResult: 'win' | 'loss' | null;
  narration: string;
  showExplosion: boolean;
  wonAmount: number;
  isMuted: boolean;
}
