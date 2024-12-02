import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApiKeyManager, { ApiKey } from './ApiKeyManager';
import TradingPairManager from './TradingPairManager';
import { TradingPairConfig, NewTradingPairConfig, TradeHistory } from '../types/trading';
import TradingHistory from './TradingHistory';

type TabType = 'trading' | 'apikeys';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('trading');
  const [isApiKeyManagerOpen, setIsApiKeyManagerOpen] = useState(false);
  const [isTradingPairManagerOpen, setIsTradingPairManagerOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Binance Main Account',
      exchange: 'Binance',
      apiKey: 'hj2h3v4jh23v4jh23v4',
      apiSecret: '********************************',
      createdAt: new Date('2024-03-15')
    },
    {
      id: '2',
      name: 'Binance Test Account',
      exchange: 'Binance',
      apiKey: '98h98h3f98h3f98h3',
      apiSecret: '********************************',
      createdAt: new Date('2024-03-16')
    }
  ]);
  const [tradingPairs, setTradingPairs] = useState<TradingPairConfig[]>([
    {
      id: '1',
      symbol: 'BTC/USDT',
      initialUSDT: 1000,
      apiKeyId: '1',
      enabled: true,
      trend: 'Bullish',
      createdAt: new Date('2024-03-15'),
      balance: {
        usdt: 500,
        token: 0.012,
        tokenPrice: 65000,
      },
      performance: {
        totalValue: 1280,
        pnl: 28,
        pnlAmount: 280,
      }
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      initialUSDT: 500,
      apiKeyId: '1',
      enabled: false,
      trend: 'Bearish',
      createdAt: new Date('2024-03-15'),
      balance: {
        usdt: 300,
        token: 0.15,
        tokenPrice: 3500,
      },
      performance: {
        totalValue: 825,
        pnl: -15,
        pnlAmount: -75,
      }
    },
    {
      id: '3',
      symbol: 'SOL/USDT',
      initialUSDT: 300,
      apiKeyId: '2',
      enabled: true,
      trend: 'Neutral',
      createdAt: new Date('2024-03-16'),
      balance: {
        usdt: 200,
        token: 0.005,
        tokenPrice: 70000,
      },
      performance: {
        totalValue: 1000,
        pnl: 10,
        pnlAmount: 100,
      }
    }
  ]);
  const [selectedPair, setSelectedPair] = useState<TradingPairConfig | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [tradeHistory, setTradeHistory] = useState<Record<string, TradeHistory[]>>({
    '1': [  // BTC/USDT 的交易历史
      {
        id: '1',
        orderId: 'ORD123456',
        pairId: '1',
        type: 'BUY',
        price: 65000,
        amount: 0.01,
        total: 650,
        timestamp: new Date('2024-03-15T10:30:00'),
        balanceAfter: {
          usdt: 350,
          token: 0.01
        }
      },
      {
        id: '2',
        orderId: 'ORD123457',
        pairId: '1',
        type: 'SELL',
        price: 66000,
        amount: 0.005,
        total: 330,
        timestamp: new Date('2024-03-15T14:20:00'),
        balanceAfter: {
          usdt: 680,
          token: 0.005
        }
      }
    ],
    '2': [  // ETH/USDT 的交易历史
      {
        id: '3',
        orderId: 'ORD123458',
        pairId: '2',
        type: 'BUY',
        price: 3500,
        amount: 0.15,
        total: 525,
        timestamp: new Date('2024-03-15T11:45:00'),
        balanceAfter: {
          usdt: 475,
          token: 0.15
        }
      }
    ]
  });

  const handleApiKeySave = (newApiKey: ApiKey) => {
    setApiKeys([...apiKeys, newApiKey]);
  };

  const handleTradingPairApiKeyChange = (index: number, apiKeyId: string) => {
    const newPairs = [...tradingPairs];
    newPairs[index] = { ...newPairs[index], apiKeyId };
    setTradingPairs(newPairs);
  };

  const handleTradingPairToggle = (pairId: string) => {
    setTradingPairs(pairs => 
      pairs.map(pair => 
        pair.id === pairId 
          ? { ...pair, enabled: !pair.enabled }
          : pair
      )
    );
  };

  const handleTradingPairSave = (newPair: NewTradingPairConfig) => {
    const fullPair: TradingPairConfig = {
      ...newPair,
      balance: {
        usdt: newPair.initialUSDT,
        token: 0,
        tokenPrice: 0,
      },
      performance: {
        totalValue: newPair.initialUSDT,
        pnl: 0,
        pnlAmount: 0,
      }
    };
    setTradingPairs([...tradingPairs, fullPair]);
  };

  const handleViewHistory = (pair: TradingPairConfig) => {
    setSelectedPair(pair);
    setIsHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-primary">Tokrio</div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white px-3 py-2">
                Account
              </button>
              <button className="text-gray-300 hover:text-white px-3 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 md:col-span-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white">Market Trend</h3>
                  <p className="text-sm text-gray-400 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">24h Trend</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-400">↗</span>
                      <span className="text-white font-medium">Strong Bullish</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">7d Prediction</div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 font-medium">
                        Uptrend +5.2%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-white mb-4">Portfolio Overview</h3>
              <div className="text-3xl font-bold text-primary">$25,432.89</div>
              <div className="text-green-400 text-sm">+2.45% today</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-white mb-4">Active Trades</h3>
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-gray-400 text-sm">Running strategies</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-medium text-white mb-4">Total Profit</h3>
              <div className="text-3xl font-bold text-green-400">+$1,432.89</div>
              <div className="text-gray-400 text-sm">All time</div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('trading')}
                  className={`${
                    activeTab === 'trading'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Trading Pairs
                  <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-gray-800">
                    {tradingPairs.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('apikeys')}
                  className={`${
                    activeTab === 'apikeys'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  API Keys
                  <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-gray-800">
                    {apiKeys.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content based on active tab */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'trading' ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-white">Trading Pairs</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Active: {tradingPairs.filter(p => p.enabled).length} / Total: {tradingPairs.length}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTradingPairManagerOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    Add Trading Pair
                  </button>
                </div>
                
                {tradingPairs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No trading pairs configured yet. Click the button above to add one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tradingPairs.map((pair) => (
                      <div 
                        key={pair.id} 
                        className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="text-xl font-medium text-white">{pair.symbol}</div>
                              <div className="text-sm text-gray-400 mt-1">
                                Initial: {pair.initialUSDT} USDT
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm ${
                              pair.trend === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                              pair.trend === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {pair.trend}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewHistory(pair)}
                              className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                            >
                              History
                            </button>
                            <button
                              onClick={() => handleTradingPairToggle(pair.id)}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                                pair.enabled
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-700 text-gray-400'
                              }`}
                            >
                              {pair.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                            <button className="px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 text-sm">
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Balance Info */}
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Current Balance</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-400">USDT</div>
                                <div className="text-white font-medium">
                                  ${pair.balance.usdt.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-400">{pair.symbol.split('/')[0]}</div>
                                <div className="text-white font-medium">
                                  {pair.balance.token.toFixed(6)}
                                  <span className="text-sm text-gray-400 ml-1">
                                    (${(pair.balance.token * pair.balance.tokenPrice).toFixed(2)})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Performance Info */}
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Performance</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-400">Total Value</div>
                                <div className="text-white font-medium">
                                  ${pair.performance.totalValue.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-400">PNL</div>
                                <div className={`font-medium ${
                                  pair.performance.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {pair.performance.pnl >= 0 ? '+' : ''}{pair.performance.pnl}%
                                  <span className="block text-sm">
                                    ${Math.abs(pair.performance.pnlAmount).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="text-sm text-gray-400">
                            Using API Key: {apiKeys.find(k => k.id === pair.apiKeyId)?.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-white">API Keys</h3>
                    <p className="text-sm text-gray-400 mt-1">Total: {apiKeys.length} keys</p>
                  </div>
                  <button
                    onClick={() => setIsApiKeyManagerOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    Add New API Key
                  </button>
                </div>
                
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No API keys added yet. Click the button above to add one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="flex items-center justify-between bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                      >
                        <div>
                          <div className="text-white font-medium flex items-center">
                            {apiKey.name}
                            <span className="ml-2 px-2 py-1 bg-gray-800 rounded text-xs text-primary">
                              {apiKey.exchange}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            API Key: {apiKey.apiKey.substring(0, 8)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-gray-400 text-sm">
                            Added {apiKey.createdAt.toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <button className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-900">
                              View Details
                            </button>
                            <button className="text-xs px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <ApiKeyManager
        isOpen={isApiKeyManagerOpen}
        onClose={() => setIsApiKeyManagerOpen(false)}
        onSave={handleApiKeySave}
      />

      <TradingPairManager
        isOpen={isTradingPairManagerOpen}
        onClose={() => setIsTradingPairManagerOpen(false)}
        onSave={handleTradingPairSave}
        apiKeys={apiKeys}
      />

      {selectedPair && (
        <TradingHistory
          isOpen={isHistoryOpen}
          onClose={() => {
            setIsHistoryOpen(false);
            setSelectedPair(null);
          }}
          tradingPair={selectedPair}
          history={tradeHistory[selectedPair.id] || []}
        />
      )}
    </div>
  );
};

export default Dashboard; 