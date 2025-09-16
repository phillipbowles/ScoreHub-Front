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

// Tipos para navegación
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  GameSetup: undefined;
  Game: { players: string[]; gameName?: string };
};