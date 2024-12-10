import axios from 'axios';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

// API 响应接口
interface ApiResponse<T> {
  code: number;
  message: string;
  body: T;
}

// Portfolio Overview 接口
export interface Position {
  id: string;
  tokenSymbol: string;
  tokenAmount: number;
  currentPrice: number;
  value: number;
  initialUSDT: number;
  profit: number;
  profitRate: number;
  trending: string;
  trendingStrength: number;
  trendingUpdateTime: string;
  enabled: boolean;
}

export interface PortfolioOverview {
  activeTrades: number;
  totalInvestment: number;
  totalValue: number;
  totalProfit: number;
  profitRate: number;
  positions: Position[];
}

// API Key 相关接口
export interface ApiKey {
  id: number;
  apiKey: string;
  platform: string;
  apiName: string;
  maskedSecret: string;
}

export interface ApiKeyListResponse {
  items: ApiKey[];
  total: number;
}

export interface CreateApiKeyRequest {
  apiKey: string;
  apiSecretKey: string;
  platform: string;
  apiName: string;
}

// Token Pairs 接口
export interface TokenPair {
  tokenSymbol: string;
  currentPrice: number;
}

export interface TokenPairsResponse {
  pairs: TokenPair[];
  total: number;
}

export const api = {
  // 登录接口
  login: async (data: { walletAddress: string; signature: string }): Promise<ApiResponse<string>> => {
    const response = await axios.post(`${API_BASE_URL}/login`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Portfolio Overview 接口
  getPortfolioOverview: async (): Promise<ApiResponse<PortfolioOverview>> => {
    const response = await axios.get(`${API_BASE_URL}/portfolio/overview`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // API Key 相关接口
  createApiKey: async (data: CreateApiKeyRequest): Promise<ApiResponse<ApiKey>> => {
    const response = await axios.post(`${API_BASE_URL}/api-keys`, data);
    return response.data;
  },

  deleteApiKey: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await axios.delete(`${API_BASE_URL}/api-keys/${id}`);
    return response.data;
  },

  listApiKeys: async (): Promise<ApiResponse<ApiKeyListResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/api-keys`);
    return response.data;
  },

  // Token Pairs 接口
  listTokenPairs: async (): Promise<ApiResponse<TokenPairsResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/token/pairs`);
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