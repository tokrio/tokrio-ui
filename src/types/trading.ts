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