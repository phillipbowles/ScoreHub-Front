// src/types/game.types.ts

export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  score: number;
  color: string;
}

export interface RoundScore {
  [id: string]: number; // id puede ser playerId o teamId dependiendo del modo
}

export interface GameConfig {
  id?: string;
  name: string;
  description?: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  rules: string;
  
  // Configuración de jugadores/equipos
  hasTeams: boolean;
  minTeamLength: number;
  maxTeamLength: number;
  numberOfPlayers: number; // número de jugadores o equipos según hasTeams
  
  // Configuración de rondas
  hasRounds: boolean;
  totalRounds: number;
  
  // Configuración de timer
  hasTimer: boolean;
  timerDuration: number; // en segundos
  
  // Configuración de finalización
  endingType: 'points' | 'rounds';
  pointsType?: 'max' | 'min';
  pointsTarget?: number;
}

export interface GameState {
  id: string;
  config: GameConfig;
  mode: 'individual' | 'teams';
  players?: Player[];
  teams?: Team[];
  currentRound: number;
  rounds: RoundScore[];
  startedAt: Date;
  endedAt?: Date;
  winnerId?: string;
  winnerTeamId?: string;
}

export const PLAYER_COLORS = [
  '#ff9999', // coral suave
  '#99ccff', // azul suave
  '#99ff99', // verde suave
  '#ffcc99', // naranja suave
  '#cc99ff', // morado suave
  '#ffff99', // amarillo suave
  '#ff99cc', // rosa suave
  '#99ffff', // cyan suave
  '#ffb3ba', // rosa salmón
  '#bae1ff', // azul claro
  '#baffc9', // verde menta
  '#ffffba', // amarillo pastel
];