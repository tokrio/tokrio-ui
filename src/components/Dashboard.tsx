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
import BigNumber from 'bignumber.js';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import { config } from '../config/env';
import { TokrioLevelAbi } from '../abi/Abi';
import { erc20Abi } from 'viem';
import { fetchBalanceObj, getReadData, IResponse } from '../contract/api';
import TokenName from './TokenName';
import TokenDecimals from './TokenDecimals';
import TokenBalance from './TokenBalance';
import formatStringNumber from '../util/utils';

type TabType = 'tokens' | 'trading' | 'apikeys' | 'simulate' | 'sponsor';

interface Sponsor {
  creator: string;
  offerType: number;
  duration: bigint;
  tokenAmount: bigint;
  usdtAmount: bigint;
  targetLevel: bigint;
  status: boolean;
  sponsor: string;
  user: string;
  startTime: string;
  endTime: bigint;
  offerId: bigint
}

interface CreateSponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (level: number, amount: string, duration: number, tokenAmount: number) => void;
  loading: boolean;
}

const CreateSponsorModal: React.FC<CreateSponsorModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [level, setLevel] = useState<number>(1);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(1);

  const levelTokens = {
    1: 100,
    2: 200,
    3: 400,
    4: 800
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-6">Create Sponsor</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(level, amount, duration, levelTokens[level as (1 | 2 | 3 | 4)]);
        }} className="space-y-6">
          {/* 等级选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sponsor Level (Balance: <TokenBalance token={config.LEVEL_TOKEN} decimalPlaces={0} /> <TokenName address={config.LEVEL_TOKEN} />)
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              {Object.entries(levelTokens).map(([lvl, tokens]) => (
                <option key={lvl} value={lvl}>
                  Level {lvl} ({tokens} <TokenName address={config.LEVEL_TOKEN} />)
                </option>
              ))}
            </select>
          </div>

          {/* USDT 金额输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sponsor Amount (USDT)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="Enter amount in USDT"
              required
            />
          </div>

          {/* 时长选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (Months)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              {[1, 3, 6, 12].map((months) => (
                <option key={months} value={months}>
                  {months} {months === 1 ? 'Month' : 'Months'}
                </option>
              ))}
            </select>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!(!loading && amount)}
              className="px-4 py-2 cta-button disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdSponsors, setCreatedSponsors] = useState<any>([]);
  const [buySponsors, setBuySponsors] = useState<any>([]);
  const [isCreateSponsorModalOpen, setIsCreateSponsorModalOpen] = useState(false);
  const [createSponsorLoading, setCreateSponsorLoading] = useState(false);
  const [cancelOfferLoading, setCancelOfferLoading] = useState(false);
  const [wthdrawLoading, setWithdrawLoading] = useState(false);
  const [offerId, setOfferId] = useState<string>("");
  const [sponsorTab, setSponsorTab] = React.useState('my-sponsors');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    getSponsors()
  }, [sponsorTab])

  const handleTabChange = (tab: string) => {
    setSponsorTab(tab);
  };

  const getSponsors = async () => {
    let sponsorList: any
    if (sponsorTab === 'my-sponsors') {
      sponsorList = await readContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioLevelAbi,
        functionName: 'getUserSponsoredOffers',
        args: [address, 0, 100]
      });
    } else {
      sponsorList = await readContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioLevelAbi,
        functionName: 'getUserPurchasedOffers',
        args: [address, 0, 100]
      });
    }

    console.log("sponsorList=", sponsorList)

    if (sponsorTab === 'my-sponsors') {
      setCreatedSponsors([...sponsorList[0]])
    } else {
      setBuySponsors([...sponsorList[0]])
    }
  }

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

  const handleCreateSponsor = async (level: number, usdtAmount: string, duration: number, tokenAmount: number) => {
    setCreateSponsorLoading(true);
    try {
      const balanceObj = await fetchBalanceObj(address, config.LEVEL_TOKEN)
      if (new BigNumber(balanceObj.formatted).isLessThan(tokenAmount)) {
        toast.error('Insufficient token balance!');
        setCreateSponsorLoading(false);
        return
      }

      const tokenA = BigInt(new BigNumber(tokenAmount).multipliedBy(1e18).toString());
      const allowance: any = await readContract(chainConfig, {
        address: config.LEVEL_TOKEN as '0x',
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, config.SPONSOR as `0x${string}`],
      })
      console.log("allowance=", allowance)

      if (new BigNumber(allowance.toString()).isLessThan(tokenA + "")) {
        const hash = await writeContract(chainConfig, {
          address: config.LEVEL_TOKEN as '0x',
          abi: erc20Abi,
          functionName: 'approve',
          args: [config.SPONSOR as `0x${string}`, tokenA],
          account: address
        })
        const approveData: any = await waitForTransactionReceipt(chainConfig, {
          hash: hash
        })

        if (approveData.status && approveData.status.toString() == "success") {
        } else {
          toast.error('Your wallet failed allowed assets deduction!');
          setCreateSponsorLoading(false);
          return
        }
      }

      let decimal = 18

      let { data, code }: IResponse = await getReadData("decimals", erc20Abi, config.USDT_TOKEN, [])
      if (code != 200) {
        toast.error("Please check your RPC.")
        return
      } else {
        decimal = data
      }

      const usdtA = BigInt(new BigNumber(usdtAmount).multipliedBy(10 ** decimal).toString());

      let args = [level, duration * 30 * 3600 * 24, tokenA, usdtA]
      console.log(args)
      const hash = await writeContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioLevelAbi,
        functionName: 'createSponsorOffer',
        args: args
      });

      const approveData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (approveData.status && approveData.status.toString() == "success") {
        toast.success('Sponsor created successfully');
        getSponsors();
        setIsCreateSponsorModalOpen(false);
      } else {
        toast.error('Your wallet failed allowed assets deduction!');
        return
      }
    } catch (error) {
      console.log(JSON.stringify(error))
      toast.error('Failed to create sponsor');
    } finally {
      setCreateSponsorLoading(false);
    }
  };

  const cancelOffer = async (sponsorId: string) => {
    setCancelOfferLoading(true)
    try {
      const hash = await writeContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioLevelAbi,
        functionName: 'cancelOffer',
        args: [sponsorId]
      });
      const approveData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (approveData.status && approveData.status.toString() == "success") {
        toast.success('Sponsor cancel successfully');
        getSponsors()
        setIsCreateSponsorModalOpen(false);
      } else {
        toast.success('Sponsor cancel failed');
      }
    } catch (error) {
      toast.error('Failed to create sponsor');
    } finally {
      setCancelOfferLoading(false);
    }
  };

  const handleShare = (sponsorId: string) => {
    const url = `${window.location.origin}/sponsor/${sponsorId}`;
    navigator.clipboard.writeText(url);
    toast.success('Sponsor link copied to clipboard');
  };

  const handleDelete = async (sponsorId: string) => {
    if (!window.confirm('Are you sure you want to delete this sponsor?')) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Sponsor deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sponsor');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (sponsorId: string) => {
    setWithdrawLoading(true)
    try {
      const hash = await writeContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioLevelAbi,
        functionName: 'withdrawExpiredTokens',
        args: [sponsorId]
      });
      const approveData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (approveData.status && approveData.status.toString() == "success") {
        toast.success('Tokens withdrawn successfully');
        getSponsors()
        setIsCreateSponsorModalOpen(false);
      } else {
        toast.error('Failed to withdraw tokens');
      }
    } catch (error) {
      toast.error('Failed to withdraw tokens');
    } finally {
      setWithdrawLoading(false);
    }
  };

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
                  onClick={() => setActiveTab('sponsor')}
                  className={`${activeTab === 'sponsor'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  My Sponsors
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

            {activeTab === 'sponsor' && (
              <div className="bg-card  rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-sm text-gray-400">Total Sponsors Created</div>
                    <div className="text-2xl font-bold text-white">{createdSponsors.length}</div>
                  </div>
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-sm text-gray-400">Active Sponsors</div>
                    <div className="text-2xl font-bold text-green-400">
                      {createdSponsors.filter((s: { active: any; }) => s.active).length}
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-sm text-gray-400">Total Earnings</div>
                    <div className="text-2xl font-bold text-primary">$1,234.56</div>
                  </div>
                </div>

                <div className="grid gird-cols-1 md:flex md:justify-between items-center mb-6">
                  <div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleTabChange('my-sponsors')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${sponsorTab === 'my-sponsors'
                          ? 'bg-gray-500 text-white font-bold text-base'
                          : 'bg-gray-700 text-gray-400'
                          }`}
                      >
                        My Sponsors
                      </button>
                      <button
                        onClick={() => handleTabChange('my-orders')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${sponsorTab === 'my-orders'
                          ? 'bg-gray-500 text-white font-bold  text-base'
                          : 'bg-gray-700 text-gray-400'
                          }`}
                      >
                        My Orders
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {sponsorTab === 'my-sponsors' ? 'Manage your created sponsorships' : 'View your purchased sponsors'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3  md:flex md:space-x-3">
                    <button
                      onClick={() => navigate(`/sponsor/share/${address}`)}
                      className="common-button mt-4 md:mt-0"
                    >
                      Share All
                    </button>
                    <button
                      onClick={() => setIsCreateSponsorModalOpen(true)}
                      className="px-4 py-2 cta-button"
                    >
                      Create Sponsor
                    </button>
                  </div>
                </div>

                {sponsorTab === 'my-sponsors' ? <div className="space-y-4">
                  {createdSponsors && createdSponsors.map((sponsor: Sponsor) => (
                    <div key={sponsor.offerId} className="bg-card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-lg main-font text-white">
                            OfferId {sponsor.offerId.toString()}
                          </div>
                          <div className=" text-gray-400">
                            Amount: {new BigNumber(sponsor.tokenAmount.toString()).div(1e18).toFixed(2)} TOKR
                            <span className='ml-2'>Duration: {new BigNumber(sponsor.duration.toString()).dividedBy(60 * 60 * 24).toFixed(0)} Days</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>Creator: {formatStringNumber(sponsor.creator, 8, -8)}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full main-font  text-sm ${Number(sponsor.status) === 0
                          ? 'bg-green-500/20 text-green-400':
                           Number(sponsor.status) == 2 ? 'bg-gray-500/20 text-gray-400'
                          : Number(sponsor.endTime) > Math.floor(Date.now() / 1000)
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                          }`}>
                          {Number(sponsor.status) == 0 ? 'Active' :
                            Number(sponsor.status) == 2 ? 'Canceled'
                              : Number(sponsor.endTime) < Math.floor(Date.now() / 1000)
                                ? 'Ended'
                                : 'Available'}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-400">Sponsor Amount</div>
                            <div className="text-lg font-medium text-primary">
                              <TokenDecimals token={config.USDT_TOKEN} amount={sponsor.usdtAmount.toString()} />
                              <span className='ml-2'>USDT</span>
                            </div>
                          </div>
                          {Number(sponsor.endTime) !== 0 && <div>
                            <div className="text-sm text-gray-400">End Time</div>
                            <div className="text-sm text-gray-300">
                              {new Date(Number(sponsor.endTime) * 1000).toLocaleDateString()}
                            </div>
                          </div>}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-3">
                        {sponsor && Number(sponsor.status) == 0 && <button
                          disabled={cancelOfferLoading}
                          onClick={() => {
                            setOfferId(sponsor.offerId.toString())
                            cancelOffer(sponsor.offerId.toString())
                          }}
                          className="common-button"
                        >
                          {cancelOfferLoading && offerId == sponsor.offerId.toString() ? 'Loading' : 'Cancel'}
                        </button>}
                        {Number(sponsor.status) == 1 && Number(sponsor.endTime) < Math.floor(Date.now() / 1000) && (
                          <button
                            disabled={!(!wthdrawLoading && offerId == sponsor.offerId.toString())}
                            onClick={() => handleWithdraw(sponsor.offerId.toString())}
                            className="px-3 py-1.5 cta-button"
                          >
                            Withdraw Tokens
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {createdSponsors.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No sponsors created yet. Click "Create Sponsor" to get started.
                    </div>
                  )}
                </div> : <div className="space-y-4">
                  {buySponsors && buySponsors.map((sponsor: any) => (
                    <div key={sponsor.id} className="bg-card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-lg font-medium text-white">
                            Level {sponsor.targetLevel.toString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new BigNumber(sponsor.tokenAmount.toString()).div(1e18).toFixed(2)} TOKR
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Duration: {new BigNumber(sponsor.duration.toString()).dividedBy(60 * 60 * 24).toFixed(0)} Days
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full main-font  text-sm ${Number(sponsor.status) === 0
                          ? 'bg-green-500/20 text-green-400':
                           Number(sponsor.status) == 2 ? 'bg-gray-500/20 text-gray-400'
                          : Number(sponsor.endTime) > Math.floor(Date.now() / 1000)
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                          }`}>
                          {Number(sponsor.status) == 0 ? 'Active' :
                            Number(sponsor.status) == 2 ? 'Canceled'
                              : Number(sponsor.endTime) < Math.floor(Date.now() / 1000)
                                ? 'Ended'
                                : 'Available'}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-400">Sponsor Price (USDT)</div>
                            <div className="text-lg font-medium text-primary">
                              <TokenDecimals token={config.USDT_TOKEN} amount={sponsor.usdtAmount.toString()} /> USDT
                            </div>
                          </div>
                          {sponsor.endTime && <div>
                            <div className="text-sm text-gray-400">End Time</div>
                            <div className="text-sm text-gray-300">
                              {new Date(Number(sponsor.endTime) * 1000).toLocaleDateString()}
                            </div>
                          </div>}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-3">
                        {!sponsor.active && Number(sponsor.endTime) < Math.floor(Date.now() / 1000) && (
                          <button
                            disabled={!(!wthdrawLoading && offerId == sponsor.id)}
                            onClick={() => handleWithdraw(sponsor.id)}
                            className="px-3 py-1.5 cta-button"
                          >
                            Withdraw Tokens
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {
                    buySponsors && buySponsors.length === 0 && sponsorTab === 'my-orders' && (
                      <div className="text-center py-8 text-gray-400">
                        No sponsors purchased yet.
                      </div>
                    )
                  }

                  {
                    createdSponsors && createdSponsors.length === 0 && sponsorTab === 'my-sponsors' && (
                      <div className="text-center py-8 text-gray-400">
                        No sponsors purchased yet.
                      </div>
                    )
                  }
                </div>}
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
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className="bg-[#1a1a1a]/40 rounded-lg p-6 hover:bg-[#1a1a1a]/60 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xl font-medium text-white">{token.tokenSymbol}</div>
                            <div className="text-sm text-gray-400 mt-1">
                              {token.description}
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            token.trending > 0 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {token.trending > 0 ? '↗' : '↘'} Strength: {token.trendingStrength}
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-400">
                          Last Update: {new Date(token.trendingUpdateTime).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 分页控制 */}
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-card-dark text-gray-400 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-white">
                    Page {currentPage} of {Math.ceil(totalTokens / 10)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= Math.ceil(totalTokens / 10)}
                    className="px-4 py-2 bg-card-dark text-gray-400 rounded disabled:opacity-50"
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

      <CreateSponsorModal
        isOpen={isCreateSponsorModalOpen}
        onClose={() => setIsCreateSponsorModalOpen(false)}
        onSubmit={handleCreateSponsor}
        loading={createSponsorLoading}
      />
    </div>
  );
};

export default Dashboard; 