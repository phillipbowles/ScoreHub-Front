// src/types/backend.types.ts
// Types that match the backend API structure

export type EndingType = 'end_rounds' | 'reach_max_score' | 'reach_min_score';

export interface BackendGame {
  id: number;
  name: string;
  description?: string;
  number_of_players: number;
  turn_duration: number;
  round_duration: number;
  rounds: number;
  has_turns: boolean;
  has_teams: boolean;
  min_team_length: number;
  max_team_length: number;
  ending: EndingType;
  min_points: number;
  max_points: number;
  rules: string;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGameRequest {
  name: string;
  number_of_players: number;
  turn_duration: number;
  round_duration: number;
  rounds: number;
  has_turns: boolean;
  has_teams: boolean;
  min_team_length: number;
  max_team_length: number;
  ending: EndingType;
  min_points: number;
  max_points: number;
  rules?: string;
}

export interface BackendMatch {
  id: number;
  name: string;
  creator_id: number;
  game_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMatchRequest {
  name: string;
  creator_id: number;
  game_id: number;
}

export interface xBackendUser {
  id: number;
  name: string;
  username: string;
  email_address: string;
  created_at?: string;
  updated_at?: string;
}

// Response wrappers
export interface BackendResponse<T> {
  data: T;
}

export interface BackendListResponse<T> {
  data: T[];
}
