export interface TradingPairConfig {
  id: string;
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
  id: string;
  orderId: string;
  pairId: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
  timestamp: Date;
  balanceAfter: {
    usdt: number;
    token: number;
  };
} 