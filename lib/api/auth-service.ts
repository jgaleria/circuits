import { apiClient } from "../api/client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  display_name?: string;
}

export interface PasswordUpdateRequest {
  new_password: string;
  old_password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

type AuthResponse = {
  access_token?: string;
  user?: unknown;
};

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials as unknown as Record<string, unknown>);
    // Store token for future API calls
    if (response.access_token) {
      apiClient.setToken(response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async signup(userData: SignupRequest) {
    const response = await apiClient.post<AuthResponse>('/api/auth/signup', userData as unknown as Record<string, unknown>);
    if (response.access_token) {
      apiClient.setToken(response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout', undefined);
    } finally {
      apiClient.clearToken();
    }
  },

  async getCurrentUser() {
    return apiClient.get('/api/auth/me');
  },

  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async updatePassword(data: PasswordUpdateRequest) {
    return apiClient.put('/api/auth/password', data as unknown as Record<string, unknown>);
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    return apiClient.post('/api/auth/forgot-password', data as unknown as Record<string, unknown>);
  },

  async resetPassword(data: ResetPasswordRequest) {
    return apiClient.post('/api/auth/reset-password', data as unknown as Record<string, unknown>);
  }
}; 