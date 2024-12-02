import axios from 'axios';

const API_BASE_URL = 'http://localhost:6500/api';

export interface LoginResponse {
  code: number;
  message: string;
  body: string;  // JWT token
}

export interface LoginRequest {
  walletAddress: string;
  signature: string;
}

export const api = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/login`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};

// Token 管理
export const tokenStorage = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  getToken: () => {
    return localStorage.getItem('token');
  },
  removeToken: () => {
    localStorage.removeItem('token');
  }
};

// Axios 拦截器设置 Bearer token
axios.interceptors.request.use(config => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 