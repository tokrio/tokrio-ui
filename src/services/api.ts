import axios from 'axios';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

// API Response Interface
interface ApiResponse<T> {
  code: number;
  message: string;
  body: T;
}

// Portfolio Overview Interface
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

// API Key Related Interfaces
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

// Token Pairs Interface
export interface TokenPair {
  tokenSymbol: string;
  currentPrice: number;
}

export interface TokenPairsResponse {
  pairs: TokenPair[];
  total: number;
}

// Simulation Trading Interface
export interface SimulateRequest {
  tokenSymbol: string;
  usdtAmount: string;
  startDate: string;
  endDate: string;
}

export interface SimulateTrade {
  amount: number;
  date: string;
  price: number;
  type: 'buy' | 'sell';
  usdtValue: number;
}

export interface SimulateResult {
  finalCapital: number;
  initialCapital: number;
  profitPercent: number;
  trades: SimulateTrade[];
}

export interface Token {
  id: number;
  tokenSymbol: string;
  trending: number;
  trendingStrength: number;
  trendingUpdateTime: string;
  description: string;
  currentPrice: number;
}

export interface TokenListResponse {
  data: Token[];
  page: number;
  pageSize: number;
  total: number;
}

export const api = {
  // Login API
  login: async (data: { walletAddress: string; signature: string, timestamp?: number }): Promise<ApiResponse<string>> => {
    const response = await axios.post(`${API_BASE_URL}/login`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Portfolio Overview API
  getPortfolioOverview: async (): Promise<ApiResponse<PortfolioOverview>> => {
    const response = await axios.get(`${API_BASE_URL}/portfolio/overview`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // API Key Management APIs
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

  // Token Pairs API
  listTokenPairs: async (): Promise<ApiResponse<TokenPairsResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/token/pairs`);
    return response.data;
  },

  // Simulation Trading API
  simulate: async (data: SimulateRequest): Promise<ApiResponse<SimulateResult>> => {
    const response = await axios.post(`${API_BASE_URL}/token/simulate`, data);
    return response.data;
  },

  listTokens: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<TokenListResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/token/list`, {
      params: {
        page,
        pageSize
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};

// Token Storage Management
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

// Axios Interceptor for Bearer Token
axios.interceptors.request.use((config: any) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 