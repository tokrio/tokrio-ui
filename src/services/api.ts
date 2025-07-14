import axios from 'axios';
import { config } from '../config/env';
import { DexHistory, NewTradingPairGroupConfig, NewTradingPairGroupParam, TradeHistory } from '../types/trading';

const API_BASE_URL = config.API_BASE_URL;

// API Response Interface
interface ApiResponse<T> {
  code: number;
  message: string;
  body: T;
}

// Portfolio Overview Interface
export interface Position {
  tokenAccountID: number;
  tokenSymbol: string;
  tokenAmount: number;
  currentPrice: number;
  value: number;
  active:number;
  initialUSDT: number;
  profit: number;
  profitRate: number;
  tokenAddress?: string;
  trending: number;
  trendingStrength: number;
  trendingUpdateTime: string;
  enabled: boolean;
  usdtLeft: string;
}

export interface PortfolioOverview {
  activeTrades: number;
  totalInvestment: number;
  totalValue: number;
  totalProfit: number;
  profitRate: number;
  positions: Position[];
}

export interface AdminInfo {
  status: number;           
  receiverAddr: string;     
  tierLevel: number;       
  commissionRate: number;  
  totalEarnings: string;    
  last30DaysEarnings: string; 
  tradeCount: number;      
  lastTradeTime: string;   
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

export interface WithdrwaRequest {
  tokenAddress: string;
  amount: string;
}

// Token Pairs Interface
export interface TokenPair {
  tokenSymbol: string;
  currentPrice: number;
}

export interface TokenPairParam {
  tokenSymbol: string;
  usdtAmount: number;
  apiKeyId: number;
}

export interface DexParam {
  tokenSymbol: string;
  initUsdt:string,
  chainId: number,
}

export interface SetUsdtParam {
  tokenAccountId: string;
}


export interface SetCexUsdtParam {
  tokenAccountId: number;
  usdtAmount: string;
}

export interface CloseTokenParam {
  tokenSymbol: string;
}

export interface SetDexUsdtParam {
  tokenAccountId: number;
  usdtAmount: string;
}

export interface TokenPairsResponse {
  pairs: TokenPair[];
  total: number;
}

export interface TokenPairsGroup {
  groupDescription: string;
  groupName: string;
  id: number;
}

export interface TokenPairsGroupResponse {
  data: TokenPairsGroup[];
  total: number;
}

// Simulation Trading Interface
export interface SimulateRequest {
  tokenSymbol: string;
  usdtAmount: number;
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

export interface DexTokenData {
  total: number;
  tokens: DexToken[];
}

export interface TokenBalanceProps {
  uiBalance: string;
  decimals: number;
}

export interface DexToken {
  id: number;
  tokenSymbol: string;
  tokenName: string;
  profitPercent: number;
  initUSDT: string;
  tokenLeft: string;
  usdtLeft: string;
  allocation: number;
  lastTradingOrder: string;
  lastTradingType: string;
  lastTradingDataTime: string;
  userWallet: string;
  chainId: number;
  tokenAddress: string;
  active: number;
  strategyId: number;
}

export interface DexTokenResponse {
  id: number;
  tokenSymbol: string;
  initUSDT: string;
  tokenLeft: string;
  usdtLeft: string;
  lastTradingOrder: string;
  lastTradingType: string;
  lastTradingDataTime: string;
  userWallet: string;
  chainId: number;
  tokenAddress: string;
  active: number;
  strategyId: number;
}

export interface VaultLog {
  id: number;
  walletAddress: string;
  tokenAddress: string;
  actionType: string;
  tokenBefore: string;
  tokenChanged: string;
  updatedAt: string;
  tokenAfter: string;
  changeType: number;
  tokenSymbol: string;
  eventId: number;
  dex:string;
  eventHash: string;
  vaultComment: string;
}

export interface VaultLogsResponse {
  total: number;
  page: number;
  size: number;
  logs: VaultLog[];
  chainId: number;
  tokenSymbol: string;
  wallet: string;
}

export interface ProxyEarning {
  time: string;
  type: string;
  txHash: string;
  tradeAmount: string;
  commission: string;
}

export interface ProxyEarningResponse {
  total: number;
  page: number;
  pageSize: number;
  list: ProxyEarning[];
}

export const api = {
  // Login API
  login: async (data: { walletAddress: string; signature: string, timestamp?: number, inviteCode?: string }): Promise<ApiResponse<string>> => {
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

  // DEX Tokens API
  getDexTokens: async (): Promise<ApiResponse<DexTokenData>> => {
    const response = await axios.get(`${API_BASE_URL}/dex/tokens`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getDexTokenList: async (): Promise<ApiResponse<TokenListResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/token/list?page=1&pageSize=100&dexSupported=1`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getCexTokenList: async (): Promise<ApiResponse<TokenListResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/token/list?page=1&pageSize=100&cexSupported=1`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Portfolio Overview API
  getWeb3PortfolioOverview: async (): Promise<ApiResponse<PortfolioOverview>> => {
    const response = await axios.get(`${API_BASE_URL}/dex/portfolio/overview`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getAdminInfo: async (): Promise<ApiResponse<AdminInfo>> => {
    const response = await axios.get(`${API_BASE_URL}/proxy/info`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getProxyEarnings: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<ProxyEarningResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/proxy/earnings`, {
      params: {
        page,
        pageSize
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },


  getDexToken: async (chainId: number, tokenSymbol: string): Promise<ApiResponse<DexTokenResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/dex/token`, {
      params: {
        chainId,
        tokenSymbol
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },


  getVaultLogs: async (params: {
    chainId: number;
    tokenSymbol: string;
    page: number;
    size: number;
  }): Promise<ApiResponse<VaultLogsResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/dex/vault-logs`, {
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getDexHistory: async (tokenAccountId: number): Promise<ApiResponse<DexHistory>> => {
    const response = await axios.get(`${API_BASE_URL}/dex/token/trade-history?tokenAccountId=${tokenAccountId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  setTradeTokens: async (data: any): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/dex/set-trade-tokens`, data);
    return response.data;
  },

  addCexToken: async (data: TokenPairParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/token/add-token`, data);
    return response.data;
  },

  addDexToken: async (data: DexParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/dex/add-token`, data);
    return response.data;
  },

  setDexUsdt: async (data: SetDexUsdtParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/dex/set-usdt`, data);
    return response.data; 
  },

  setCexUsdt: async (data: SetCexUsdtParam): Promise<ApiResponse<TokenPairParam>> => {
    let param = {
      tokenAccountId: data.tokenAccountId,
      usdtAmount: Number(data.usdtAmount)
    }
    const response = await axios.post(`${API_BASE_URL}/token/set-usdt`, param);
    return response.data; 
  },

  closeCexToken: async (data: CloseTokenParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/token/close`, data);
    return response.data; 
  },

  openCexToken: async (data: CloseTokenParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/token/open`, data);
    return response.data; 
  },

  closeDexToken: async (data: CloseTokenParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/dex/token/close`, data);
    return response.data; 
  },

  openDexToken: async (data: CloseTokenParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/dex/token/open`, data);
    return response.data; 
  },


  setTradeToken: async (): Promise<ApiResponse<any>> => {
    const response = await axios.post(`${API_BASE_URL}/dex/init-all-tokens`);
    return response.data;
  },
  
  setTradeTokeUSDT: async (data: SetUsdtParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/dex/set-trade-usdt`, data);
    return response.data;
  },

  // Price API
  getTokenPrice: async (body: any): Promise<any> => {
    // const response = await axios.get(`https://router.lfj.gg/v2/aggregator/routes/avalanche?amountIn=1000000000000000000&tokenIn=${config.TOKEN}&tokenOut=${config.USDT_TOKEN}`, {
    const response = await axios.post(`${API_BASE_URL}/helper/proxy`, body);
    // const response = await axios.get(`${API_BASE_URL}/helper/proxy`, {
    //   params: {
    //     url
    //   },
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    return response.data.body.responseBody;
  },

  // API Key Management APIs
  createApiKey: async (data: CreateApiKeyRequest): Promise<ApiResponse<ApiKey>> => {
    const response = await axios.post(`${API_BASE_URL}/api-keys`, data);
    return response.data;
  },

  authCode: async (data: any): Promise<ApiResponse<any>> => {
    const response = await axios.post(`${API_BASE_URL}/promotion/auth-code`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getEventSign: async (data: any): Promise<ApiResponse<any>> => {
    const response = await axios.post(`${API_BASE_URL}/sign/get-event-sign`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getEventList: async (): Promise<ApiResponse<any>> => {
    const response = await axios.get(`${API_BASE_URL}/sign/event-list`);
    return response.data;
  },

  tokenTrendingView: async (tokenSymbol: string, startTime: string, endTime: string): Promise<ApiResponse<any>> => {
    const response = await axios.get(`${API_BASE_URL}/token/analysis?tokenSymbol=${tokenSymbol}&startTime=${startTime}&endTime=${endTime}`);
    return response.data;
  },

  tokenTrends: async (): Promise<ApiResponse<any>> => {
    const response = await axios.get(`${API_BASE_URL}/token/trends`);
    return response.data;
  },

  isRegister: async (walletAddress: any): Promise<ApiResponse<any>> => {
    const response = await axios.get(`${API_BASE_URL}/user/check-wallet?walletAddress=${walletAddress}`);
    return response.data;
  },

  getCode: async (): Promise<ApiResponse<any>> => {
    const response = await axios.get(`${API_BASE_URL}/user/invite-code`);
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

  // Token Pairs API
  listTokenPairsGroup: async (): Promise<ApiResponse<TokenPairsGroupResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/token/pair-groups`);
    return response.data;
  },

  // Add Token Pairs API
  addTokenPairs: async (data: TokenPairParam): Promise<ApiResponse<TokenPairParam>> => {
    const response = await axios.post(`${API_BASE_URL}/token/account`, data);
    return response.data;
  },

  addTokenPairsGroup: async (data: any): Promise<ApiResponse<NewTradingPairGroupConfig>> => {
    const response = await axios.post(`${API_BASE_URL}/token/init-group`, data);
    return response.data;
  },

  deactivateGroup: async (data: any): Promise<ApiResponse<any>> => {
    const response = await axios.post(`${API_BASE_URL}/token/deactivate-group`, data);
    return response.data;
  },

  getTokenPairsGroupById: async (group_id: number): Promise<ApiResponse<any>> => {
    const response = await axios.post(`${API_BASE_URL}/token/group-tokens`, {
      params: {
        group_id: group_id
      }
    });
    return response.data;
  },

  getOrderHistory: async (tokenAccountId: number): Promise<ApiResponse<any>> => {
    const response = await axios.get(`${API_BASE_URL}/token/trade-history`, {
      params: {
        tokenAccountId: tokenAccountId
      }
    });
    return response.data;
  },

  getUserGroup: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<any>> => {
    const response = await axios.get(`${API_BASE_URL}/token/user-groups`, {
      params: {
        page,
        pageSize
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
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