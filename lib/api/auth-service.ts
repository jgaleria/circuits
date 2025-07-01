import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  display_name?: string;
}

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await apiClient.post('/api/auth/login', credentials);
    // Store token for future API calls
    if (response.access_token) {
      apiClient.setToken(response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      // Set cookie for middleware
      document.cookie = `access_token=${response.access_token}; path=/; max-age=604800`;
    }
    return response;
  },

  async signup(userData: SignupRequest) {
    const response = await apiClient.post('/api/auth/signup', userData);
    if (response.access_token) {
      apiClient.setToken(response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      document.cookie = `access_token=${response.access_token}; path=/; max-age=604800`;
    }
    return response;
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      apiClient.clearToken();
      // Remove the cookie
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },

  async getCurrentUser() {
    return apiClient.get('/api/auth/me');
  },

  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}; 