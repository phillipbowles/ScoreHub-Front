// src/types/index.ts

// ============================================
// USER & AUTH TYPES
// ============================================

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

// ============================================
// GAME TYPES
// ============================================

export interface Game {
  id: string;
  name: string;
  description?: string;
  icon: string;
  rules?: string;
  minPlayers: number;
  maxPlayers: number;
  hasRounds?: boolean;
  hasTimeLimit?: boolean;
  isPublic?: boolean;
  color?: string;
  createdBy?: string;
  players?: Player[];
  currentRound?: number;
  isActive?: boolean;
  createdAt?: Date;
  // API compatibility
  min_players?: number;
  max_players?: number;
}

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
  rulesType?: 'text' | 'pdf';
  rulesPdfUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  color?: string;
}

export interface GamePlayer {
  id: string;
  name: string;
  isHost: boolean;
  avatar: string;
  color: string;
  isGuest: boolean;
  userId?: string;
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

export interface GameSession {
  id: string;
  gameId: string;
  players: GamePlayer[];
  config: GameSetupConfig;
  status: 'waiting' | 'in_progress' | 'completed';
  currentRound?: number;
  scores?: { [playerId: string]: number };
  startedAt?: string;
  completedAt?: string;
}

// ============================================
// STATS TYPES
// ============================================

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  totalPlayTime: number; // in hours
  avgGameDuration: number; // in minutes
  favoriteGame?: string;
}

export interface GameStats {
  gameId: string;
  gameName: string;
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;

  // Main App
  Home: undefined;

  // Bottom Tab Screens
  HomeTab: undefined;
  GamesTab: undefined;
  StatsTab: undefined;
  ProfileTab: undefined;

  // Game Flow (New Flow)
  CreateGame: undefined;
  SelectGameType: undefined;
  GameList: { gameType: 'basic' | 'community' | 'custom' | 'favorites' };
  MatchConfig: { selectedGame: any };

  // Old Game Flow (Deprecated - to be removed)
  GameSetup: undefined;
  AddPlayers: { selectedGame: Game };
  GameConfig: { selectedGame: Game; players: GamePlayer[] };
  Game: { config: GameSetupConfig; gameConfig?: any };

  // Additional Screens
  Profile: undefined;
  Stats: undefined;
};