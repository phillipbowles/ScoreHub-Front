import { API_BASE_URL, API_TIMEOUT } from 'react-native-dotenv';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Ajustar según la respuesta real de tu backend
export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string; // Si tu backend devuelve token
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL || 'http://localhost/api';
    this.timeout = parseInt(API_TIMEOUT) || 10000;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof Error) {
        return {
          success: false,
          error: error.name === 'AbortError' ? 'Request timeout' : error.message,
        };
      }
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  // AUTH - Ajustado a tus rutas
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    // Si tu login es GET con parámetros de query
    const params = new URLSearchParams({
      email: credentials.email,
      password: credentials.password,
    });
    
    return this.makeRequest<AuthResponse>(`/users/login?${params}`, {
      method: 'GET',
    });
  }

  // Si prefieres cambiar tu backend para que login sea POST:
  // async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  //   return this.makeRequest<AuthResponse>('/users/login', {
  //     method: 'POST',
  //     body: JSON.stringify(credentials),
  //   });
  // }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // USERS
  async getUsers(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/users');
  }

  async getUser(userId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}`);
  }

  async updateUser(userId: number, userData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return this.makeRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // GAMES (requieren auth según tus rutas)
  async getGames(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/games');
  }

  async getGame(gameId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/games/${gameId}`);
  }

  async createGame(gameData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async updateGame(gameId: number, gameData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/games/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
  }
}

export const apiService = new ApiService();