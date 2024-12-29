import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApiKeyManager from './ApiKeyManager';
import TradingPairManager from './TradingPairManager';
import { TradingPairConfig, NewTradingPairConfig, TradeHistory } from '../types/trading';
import TradingHistory from './TradingHistory';
import { api, PortfolioOverview, Position, ApiKey, CreateApiKeyRequest, TokenPair } from '../services/api';
import SimulateTrading from './SimulateTrading';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAccount } from 'wagmi';

type TabType = 'tokens' | 'trading' | 'apikeys' | 'simulate';



interface Token {
  id: number;
  tokenSymbol: string;
  trending: number;
  trendingStrength: number;
  trendingUpdateTime: string;
  description: string;
  currentPrice: number;
}

const Dashboard = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('tokens');
  const [isApiKeyManagerOpen, setIsApiKeyManagerOpen] = useState(false);
  const [isTradingPairManagerOpen, setIsTradingPairManagerOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
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
  const [portfolioData, setPortfolioData] = useState<PortfolioOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);



  const fetchPortfolioData = async () => {
    try {
      const response = await api.getPortfolioOverview();
      if (response.code === 200) {
        setPortfolioData(response.body);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
    }
  };

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await api.listApiKeys();
      if (response.code === 200) {
        setApiKeys(response.body.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'apikeys') {
      fetchApiKeys();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPortfolioData();
    const intervalId = setInterval(fetchPortfolioData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleApiKeySave = async (data: CreateApiKeyRequest) => {
    try {
      const response = await api.createApiKey(data);
      if (response.code === 200) {
        fetchApiKeys();
        setIsApiKeyManagerOpen(false);
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleDeleteApiKey = async (id: number) => {
    try {
      const response = await api.deleteApiKey(id);
      if (response.code === 200) {
        await fetchApiKeys();
        await fetchPortfolioData();
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
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

  const handleOpenTradingPairManager = async () => {
    try {
      const response = await api.listApiKeys();
      if (response.code === 200) {
        setApiKeys(response.body.items || []);
      }
      setIsTradingPairManagerOpen(true);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-white mb-4">Portfolio Overview</h3>
        <div className="text-3xl font-bold text-primary">
          ${portfolioData?.totalValue.toFixed(2) || '0.00'}
        </div>
        <div className={`text-sm ${(portfolioData?.profitRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {(portfolioData?.profitRate || 0) >= 0 ? '+' : ''}{portfolioData?.profitRate || 0}% total
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-white mb-4">Active Trades</h3>
        <div className="text-3xl font-bold text-primary">{portfolioData?.activeTrades || 0}</div>
        <div className="text-gray-400 text-sm">Running strategies</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-white mb-4">Total Profit</h3>
        <div className={`text-3xl font-bold ${(portfolioData?.totalProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {(portfolioData?.totalProfit || 0) >= 0 ? '+' : ''}{portfolioData?.totalProfit.toFixed(2) || '0.00'}
        </div>
        <div className="text-gray-400 text-sm">All time</div>
      </motion.div>
    </div>
  );

  useEffect(() => {
    const fetchTokenPairs = async () => {
      try {
        const response = await api.listTokenPairs();
        if (response.code === 200) {
          setTokenPairs(response.body.pairs);
        }
      } catch (error) {
        console.error('Failed to fetch token pairs:', error);
      }
    };

    if (activeTab === 'simulate') {
      fetchTokenPairs();
    }
  }, [activeTab]);

  

  

  const fetchTokens = async (page: number = 1) => {
    setTokenLoading(true);
    try {
      const response = await api.listTokens(page, 10);
      if (response.code === 200) {
        setTokens(response.body.data);
        setTotalTokens(response.body.total);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
    } finally {
      setTokenLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tokens') {
      fetchTokens(currentPage);
    }
  }, [activeTab, currentPage]);

  return (
    <div className="min-h-screen">
      <Navbar showMenu={false} />

      <main className="max-w-6xl mt-16 mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderOverviewCards()}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-scroll scrollbar-hide">
                <button
                  onClick={() => setActiveTab('tokens')}
                  className={`${activeTab === 'tokens'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Supported Tokens
                  <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-card">
                    {totalTokens}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('trading')}
                  className={`${activeTab === 'trading'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Trading Pairs
                  <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-card">
                    {portfolioData?.positions?.length || 0}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('apikeys')}
                  className={`${activeTab === 'apikeys'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  API Keys
                  <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-card">
                    {apiKeys?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('simulate')}
                  className={`${activeTab === 'simulate'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Simulate
                </button>
              </nav>
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'trading' && (
              <div className="bg-card  rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-white">Trading Pairs</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Active: {portfolioData?.activeTrades || 0} / Total: {portfolioData?.positions.length || 0}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenTradingPairManager}
                    className="px-4 py-2 cta-button"
                  >
                    Add Trading Pair
                  </button>
                </div>

                {!portfolioData?.positions.length ? (
                  <div className="text-center py-8 text-gray-400">
                    No trading pairs configured yet. Click the button above to add one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolioData.positions.map((position) => (
                      <div
                        key={position.tokenSymbol}
                        className="bg-card rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="text-xl font-medium text-white">{position.tokenSymbol}</div>
                              <div className="text-sm text-gray-400 mt-1">
                                Initial: {position.initialUSDT} USDT
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm ${position.trendingStrength > 0 ? 'bg-green-500/20 text-green-400' :
                              position.trendingStrength < 0 ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                              {position.trending}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewHistory({
                                id: position.id || position.tokenSymbol,
                                symbol: position.tokenSymbol,
                                initialUSDT: position.initialUSDT,
                                apiKeyId: '1',
                                enabled: position.enabled,
                                trend: position.trending,
                                createdAt: new Date(position.trendingUpdateTime),
                                balance: {
                                  usdt: position.value,
                                  token: position.tokenAmount,
                                  tokenPrice: position.currentPrice
                                },
                                performance: {
                                  totalValue: position.value,
                                  pnl: position.profitRate,
                                  pnlAmount: position.profit
                                }
                              })}
                              className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                            >
                              History
                            </button>
                            <button
                              onClick={() => handleTradingPairToggle(position.id || position.tokenSymbol)}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${position.enabled
                                ? 'bg-primary text-white'
                                : 'bg-gray-700 text-gray-400'
                                }`}
                            >
                              {position.enabled ? 'Enabled' : 'Disabled'}
                            </button>
                            <button className="px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 text-sm">
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Current Balance</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-400">USDT</div>
                                <div className="text-white font-medium">
                                  ${position.value.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-400">{position.tokenSymbol.split('USDT')[0]}</div>
                                <div className="text-white font-medium">
                                  {position.tokenAmount.toFixed(6)}
                                  <span className="text-sm text-gray-400 ml-1">
                                    (${(position.tokenAmount * position.currentPrice).toFixed(2)})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-gray-400">Performance</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-400">Total Value</div>
                                <div className="text-white font-medium">
                                  ${position.value.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-400">PNL</div>
                                <div className={`font-medium ${position.profitRate >= 0 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                  {position.profitRate >= 0 ? '+' : ''}{position.profitRate}%
                                  <span className="block text-sm">
                                    ${Math.abs(position.profit).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="text-sm text-gray-400">
                            Last Update: {position.trendingUpdateTime}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

           
            {activeTab === 'apikeys' && (
              <div className="bg-card  rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-white">API Keys</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Total: {apiKeys.length} keys
                    </p>
                  </div>
                  <button
                    onClick={() => setIsApiKeyManagerOpen(true)}
                    className="px-4 py-2 cta-button"
                  >
                    Add New API Key
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-400">
                    Loading API keys...
                  </div>
                ) : apiKeys.length === 0 ? (
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
                            {apiKey.apiName}
                            <span className="ml-2 px-2 py-1 bg-card rounded text-xs text-primary">
                              {apiKey.platform}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            API Key: {apiKey.apiKey.substring(0, 8)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-gray-400 text-sm">
                            Secret: {apiKey.maskedSecret}
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleDeleteApiKey(apiKey.id)}
                              className="text-xs px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"
                            >
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

            {activeTab === 'simulate' && (
              <SimulateTrading tokenPairs={tokenPairs} />
            )}

            {activeTab === 'tokens' && (
              <div className="bg-card rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-white">Supported Tokens</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      All available trading pairs
                    </p>
                  </div>
                </div>

                {tokenLoading ? (
                  <div className="text-center py-8 text-gray-400">
                    Loading tokens...
                  </div>
                ) : (
                  <div className="gap-4 grid grid-cols-2">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className="bg-[#1a1a1a]/40 rounded-lg p-6 hover:bg-[#1a1a1a]/60 transition-colors duration-200"
                      >

                        <div className='flex w-full  justify-between items-center'>
                          <div className="text-xl font-medium text-white flex-1">{token.tokenSymbol}</div>
                          <div className={`px-3 py-1 rounded-full text-sm ${token.trending > 0
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                            }`}>
                            {token.trending > 0 ? '↗' : '↘'} Strength: {token.trendingStrength}
                          </div>
                        </div>

                        <div className="text-sm text-gray-400 mt-1">
                          {token.description}
                        </div>

                        <div className="mt-4 text-sm text-gray-400">
                          Last Update: {new Date(token.trendingUpdateTime).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 分页控制 */}
                <div className="mt-6 flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-1.5 border border-[#444] hover:border-white text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-white">
                    Page {currentPage} of {Math.ceil(totalTokens / 10)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= Math.ceil(totalTokens / 10)}
                    className="px-4 py-1.5 border border-[#444] hover:border-white text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
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