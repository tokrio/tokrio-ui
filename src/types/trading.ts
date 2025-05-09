export interface TradingPairConfig {
  tokenAccountID: number;
  symbol: string;
  initialUSDT: number;
  apiKeyId: string;
  enabled: boolean;
  trending: number;
  createdAt: Date;
  balance: {
    usdt: number;
    token: number;
    tokenPrice: number;
  };
  performance: {
    totalValue: number;
    pnl: number;
    pnlAmount: number;
  };
}

export interface NewTradingPairConfig {
  id: string;
  symbol: string;
  initialUSDT: number;
  apiKeyId: string;
  enabled: boolean;
  trending: number;
  createdAt: Date;
}

export interface  TradingPairContractConfig {
  groupId: number;
  chainId: number | undefined;
  groupName: string;
  initialUsdt: string; 
}

export interface NewTradingPairGroupConfig {
  groupId: number;
  groupName: string;
  totalBalance: string;
  apiKeyId: string;
}

export interface NewTradingPairGroupParam {
  groupId: number;
  groupName: string;
  totalBalance: number;
  apiKeyId: string;
}

export interface TradeHistory {
  afterToken: number;
  afterUSDT: number;
  amount: number;
  beforeToken: number;
  beforeUSDT: number;
  executedAmount: number;
  id: number;
  orderId: string;
  price: number;
  status: string;
  tokenSymbol: string;
  tradeComment: string;
  tradeTime: string;
  trendingType: string;
  type: string;
} 
