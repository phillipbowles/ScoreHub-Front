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
  email_address: string;
  password: string;
  password_confirmation: string;
}

// Respuesta de login del backend
export interface LoginResponse {
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

// Respuesta de registro del backend
export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    // Auto-detectar plataforma
    const isWeb = typeof window !== 'undefined' && window.location;

    if (isWeb) {
      // En web usa localhost
      this.baseURL = 'http://localhost:8000/api';
    } else {
      // En móvil usa ngrok
      this.baseURL = 'https://proemployment-bulah-diffusedly.ngrok-free.dev/api';
    }

    this.timeout = 10000;
    console.log('🔧 Platform:', isWeb ? 'WEB' : 'MOBILE');
    console.log('🔧 API Configuration:', { baseURL: this.baseURL, timeout: this.timeout });
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
    const fullURL = `${this.baseURL}${endpoint}`;
    console.log('🔥 === API REQUEST START ===');
    console.log('🎯 Target URL:', fullURL);
    console.log('🎯 Base URL:', this.baseURL);
    console.log('🎯 Endpoint:', endpoint);
    console.log('🎯 Method:', options.method || 'GET');

    // También enviamos a console.warn y console.error para que aparezcan en Expo
    console.warn('🔥 API REQUEST:', fullURL);
    console.error('DEBUG: Making request to:', fullURL);

    try {
      const token = await this.getAuthToken();
      console.log('🔑 Auth Token:', token ? 'EXISTS' : 'NONE');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ REQUEST TIMEOUT!');
        controller.abort();
      }, this.timeout);

      const requestOptions = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        signal: controller.signal,
      };

      console.log('📦 Request Headers:', requestOptions.headers);
      console.log('📦 Request Body:', options.body);
      console.log('🚀 Sending request...');

      const response = await fetch(fullURL, requestOptions);

      clearTimeout(timeoutId);
      console.log('✅ Response received!');
      console.log('📊 Response Status:', response.status);
      console.log('📊 Response OK:', response.ok);
      console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        const responseText = await response.text();
        console.log('📄 Raw Response Text:', responseText);
        data = JSON.parse(responseText);
        console.log('📄 Parsed Response Data:', data);
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError);
        data = {};
      }

      if (!response.ok) {
        console.log('❌ Request failed with status:', response.status);
        return {
          success: false,
          error: data.message || data.error || `HTTP error! status: ${response.status}`,
        };
      }

      console.log('✅ === API REQUEST SUCCESS ===');
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.log('💥 === API REQUEST ERROR ===');
      console.error('💥 Error Type:', error?.constructor?.name);
      console.error('💥 Error Message:', error?.message);
      console.error('💥 Full Error:', error);
      console.error('💥 Failed URL:', fullURL);

      // Esto definitivamente aparecerá en la consola de Expo
      console.warn('NETWORK ERROR for URL:', fullURL);
      console.warn('ERROR MESSAGE:', error?.message);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('💥 This was a timeout error');
        } else if (error.message.includes('Network request failed')) {
          console.log('💥 This is a network connectivity error');
          console.log('💥 Possible causes:');
          console.log('   - Backend not running');
          console.log('   - Wrong URL');
          console.log('   - Firewall blocking');
          console.log('   - Network connectivity issue');
        }

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
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/users/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<ApiResponse<any>> {
    return this.makeRequest('/me');
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