export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  currentRound: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  color?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CreateGame: undefined;
  GameSetup: undefined;
  SelectGameType: undefined;
  AddPlayers: { selectedGame: any };
  GameConfig: { selectedGame: any; players: GamePlayer[] };
  Game: { config: GameSetupConfig };
};


export interface CustomGame {
  id: string;
  name: string;
  description?: string;
  icon: string;
  rules: string;
  maxPlayers: number;
  minPlayers: number;
  hasRounds: boolean;
  hasTimeLimit: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface GameSetupConfig {
  gameName: string;
  players: GamePlayer[];
  numberOfRounds?: number;
  timePerTurn?: number;
  pointsToWin: number;
  isPrivate: boolean;
  hasTimeLimit: boolean;
  hasRounds: boolean;
}

export interface GamePlayer {
  id: string;
  name: string;
  isHost: boolean;
  avatar: string;
  color: string;
  isGuest: boolean;
}