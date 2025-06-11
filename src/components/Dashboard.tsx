import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApiKeyManager from './ApiKeyManager';
import TradingPairManager from './CexAddToken';
import { TradingPairConfig, NewTradingPairConfig, TradeHistory } from '../types/trading';
import TradingHistory from './TradingHistory';
import { api, PortfolioOverview, Position, ApiKey, CreateApiKeyRequest, TokenPair } from '../services/api';
import SimulateTrading from './SimulateTrading';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';
import { FaArrowDown, FaChevronDown, FaQuestion, FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import TradingContract from './DexUi';
import TradingView from './TradingView';
import DexUi from './DexUi';
import CexAddToken from './CexAddToken';
import SettingCexUi from './SettingCexUi';
import CloseToken from './CloseToken';
import { Captions, CaptionsOff, HistoryIcon, SettingsIcon } from 'lucide-react';
import BigNumber from 'bignumber.js';

// Tab Type Definition
type TabType = 'tokens' | 'trading' | 'apikeys' | 'simulate';

// Token Interface
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
  const [mode, setMode] = useState<'web2' | 'web3' | 'signals'>('web2');
  const [activeTab, setActiveTab] = useState<TabType>('trading');
  const [isApiKeyManagerOpen, setIsApiKeyManagerOpen] = useState(false);
  const [isTradingPairManagerOpen, setIsTradingPairManagerOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedPair, setSelectedPair] = useState<TradingPairConfig | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTokens, setTotalTokens] = useState(0);
  const [userGroup, setUserGroup] = useState<any[]>([]);
  const [isSettingCexOpen, setIsSettingCexOpen] = useState(false);
  const [isCloseTokenOpen, setIsCloseTokenOpen] = useState(false);
  const [cexItem, setCexItem] = useState<Position | null>(null);

  // Fetch Portfolio Data
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

  // Fetch API Keys
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
    } else if (activeTab === 'trading') {
      getUserGroup();
    }
  }, [activeTab]);

  const getUserGroup = async () => {
    return
    setLoadingGroup(true);
    const response = await api.getUserGroup();
    if (response.code === 200 && response.body.data) {
      if (response.body.data && response.body.data.length > 0) {
        setUserGroup(response.body.data)
      }
    }
    setLoadingGroup(false);

  };

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

  const deactivateGroup = async (groupId: number) => {
    try {
      const response = await api.deactivateGroup({
        userGroupId: groupId,
      });
      if (response.code === 200) {
        getUserGroup();
      }
    } catch (error) {
      console.error('Failed to deactivate group:', error);
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


  const handleTradingPairSave = () => {
    getUserGroup();
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

  // Fetch Token List
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

      <main className="max-w-6xl mt-20 mx-auto py-6 px-4 md:px-8">



        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setMode('web2')}
              className={`${mode === 'web2' ? 'bg-gray-700 text-white' : 'border-gray-400 text-gray-400'} px-5 border py-2 rounded-md`}
            >
              CEX Trading
            </button>
            <button
              onClick={() => setMode('web3')}
              className={`${mode === 'web3' ? 'bg-gray-700 text-white' : 'border-gray-400 text-gray-400'} px-5 border py-2 rounded-md relative`}
            >
              DEX Trading
              <span className="absolute bg-red-500 -top-3 -right-3 text-white text-xs px-1.5 rounded-sm  transform rotate-[-10deg] ">
                New
              </span>
            </button>
            <button
              onClick={() => setMode('signals')}
              className={`${mode === 'signals' ? 'bg-gray-700 text-white' : 'border-gray-400 text-gray-400'} px-5 border py-2 rounded-md relative`}
            >
              Trading Signals
              {/* <span className="absolute bg-gray-500 -top-3 -right-16 text-xs px-1.5 rounded-sm  transform rotate-[-10deg] ">
                Coming Soon
              </span> */}
            </button>

          </div>
        </div>

        {mode === 'web2' ? <div>
          {renderOverviewCards()}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-scroll scrollbar-hide">
                {/* <button
                  onClick={() => setActiveTab('tokens')}
                  className={`${activeTab === 'tokens'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Supported Tokens
                  <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-card-num">
                    {totalTokens}
                  </span>
                </button> */}
                <button
                  onClick={() => setActiveTab('trading')}
                  className={`${activeTab === 'trading'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Trade Mgmt.
                  {/* <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-card-num">
                    {portfolioData?.positions?.length || 0}
                  </span> */}
                </button>

                <button
                  onClick={() => setActiveTab('apikeys')}
                  className={`${activeTab === 'apikeys'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  API Keys
                  <span className="ml-2 py-0.5 px-2.5 text-xs rounded-full bg-card-num">
                    {apiKeys?.length || 0}
                  </span>
                </button>
                {/* <button
                  onClick={() => setActiveTab('simulate')}
                  className={`${activeTab === 'simulate'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Simulate
                </button> */}
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
              <div className="bg-card  rounded-lg p-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-white">Trade Set</h3>
                    {/* <p className="text-sm text-gray-400 mt-1">
                      Active: {portfolioData?.activeTrades || 0} / Total: {portfolioData?.positions.length || 0}
                    </p> */}
                  </div>
                  <Tooltip id="add-trade-set" />
                  <div className='flex items-center'>

                    <a data-tooltip-html="The trading pair group utilizes<br/> a trend algorithm to trade multiple tokens.<br/> While individual tokens may incur losses,<br/> the overall strategy achieves an 88% win rate,<br/> maximizing returns and minimizing risk." data-tooltip-id="add-trade-set">
                      <FaQuestionCircle className='mr-2 cursor-pointer text-xl text-amber-400' />
                    </a>
                    <button
                      onClick={handleOpenTradingPairManager}
                      className="px-4 py-2 cta-button"
                    >
                      Add Trading Set
                    </button>
                  </div>
                </div>

                {loadingGroup ? (
                  <div className="text-center py-8 text-gray-400">
                    Loading trade set...
                  </div>
                ) : !portfolioData?.positions || portfolioData?.positions.length < 1 ? (
                  <div className="text-center py-8 text-gray-400">
                    No Trade Set configured yet. Click the button above to add one.
                  </div>
                ) : (
                  <div className="space-y-4">

                    <div className='grid grid-cols-1 gap-4'>
                      {portfolioData?.positions && portfolioData.positions.map((position: any) => (
                        <div
                          key={position.tokenSymbol}
                          className="bg-card rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <div className=" mb-6 gap-3 grid grid-cols-1">
                            <div className="flex w-full items-center space-x-4">
                              <div>
                                <div className="text-xl font-medium text-white">{position.tokenSymbol}</div>

                              </div>

                              {
                                position.trending > 0 ? (
                                  <svg className='w-6 h-6 text-red-400' viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13956" width="48" height="48"><path d="M904.00256 308.34176l58.52672-184.32c1.56672-4.62336-1.82272-9.59488-6.8864-9.86624l-193.5104-13.13792c-6.41536-0.42496-10.53184 6.7584-6.912 12.07296l45.696 66.80576-255.2064 173.3376L467.26144 238.592a15.43168 15.43168 0 0 0-21.46816-4.06016l-325.1712 220.928c-0.31232 0.2048-0.63488 0.40448-0.9472 0.6144l-17.66912 12.03712-19.49696 13.24544a7.6288 7.6288 0 0 0-1.9456 1.93536c-13.6448 12.7232-16.30208 33.16224-5.39648 49.16736a38.8864 38.8864 0 0 0 47.44704 13.84448c1.1264-0.16384 2.2272-0.5632 3.2256-1.24416l312.44288-212.18304 78.37696 114.51904c4.864 7.02464 14.45888 8.84224 21.46304 4.06528L844.544 243.5584l45.69088 66.80576c3.61984 5.31456 11.82208 4.11136 13.76768-2.01728" fill="#1afa29" p-id="13957"></path><path d="M140.46208 666.99264c-22.6816 0-41.13408 14.70464-41.13408 32.77312v189.952c0 18.0736 18.45248 32.77312 41.13408 32.77312 22.6816 0 41.13408-14.69952 41.13408-32.77312v-189.952c0-18.0736-18.45248-32.77312-41.13408-32.77312M401.408 540.73856c-22.6816 0-41.13408 15.18592-41.13408 33.85344v314.05056c0 18.6624 18.45248 33.84832 41.13408 33.84832 22.6816 0 41.13408-15.18592 41.13408-33.8432v-314.0608c0-18.6624-18.45248-33.8432-41.13408-33.8432m260.93568 63.12448c-22.6816 0-41.12896 15.6672-41.12896 34.93376v248.7552c0 19.26144 18.44736 34.93376 41.12896 34.93376s41.13408-15.6672 41.13408-34.93376v-248.7552c0-19.26144-18.45248-34.93376-41.13408-34.93376m260.9408-185.1392c-22.6816 0-41.13408 18.45248-41.13408 41.13408v421.49376c0 22.6816 18.45248 41.13408 41.13408 41.13408 22.6816 0 41.13408-18.45248 41.13408-41.13408V459.86304c0-22.6816-18.45248-41.13408-41.13408-41.13408" fill="#1afa29" p-id="13958"></path></svg>
                                ) : (
                                  <svg className='w-6 h-6 text-red-400' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12820" width="48" height="48"><path d="M196.048133 357.025609v518.161062a9.162604 9.162604 0 0 1-9.478556 9.478556H142.336316a9.162604 9.162604 0 0 1-9.478556-9.478556V357.025609a9.162604 9.162604 0 0 1 9.478556-9.478556h44.233261a9.162604 9.162604 0 0 1 9.478556 9.478556z m211.687751 116.902191h-44.233261a9.162604 9.162604 0 0 0-9.478556 9.478556v391.780315a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233261a9.162604 9.162604 0 0 0 9.478556-9.478556V483.406356a9.162604 9.162604 0 0 0-9.478556-9.478556z m221.166307-31.595187h-44.233262a9.162604 9.162604 0 0 0-9.478556 9.478556v423.375502a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233262a9.162604 9.162604 0 0 0 9.478556-9.478556V451.811169a9.162604 9.162604 0 0 0-9.478556-9.478556z m221.166306 189.57112h-44.233261a9.162604 9.162604 0 0 0-9.478556 9.478556v233.804382a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233261a9.162604 9.162604 0 0 0 9.478556-9.478556v-233.804382a9.162604 9.162604 0 0 0-9.478556-9.478556z m31.595187-211.68775a14.533786 14.533786 0 0 0-25.592101-6.950941l-35.070657 42.021598a26.539957 26.539957 0 0 0-5.687134-6.319037l-284.35668-221.166307a31.595187 31.595187 0 0 0-24.644246-6.634989 31.595187 31.595187 0 0 0-21.484727 14.849737l-76.460351 126.380747-256.236964-197.785868a31.595187 31.595187 0 1 0-38.546128 49.920394l284.35668 221.166307a31.595187 31.595187 0 0 0 24.960198 6.003086 31.595187 31.595187 0 0 0 21.484727-14.849738l76.460351-126.380747 256.236964 199.365628a31.595187 31.595187 0 0 0 5.371182 3.159519l-35.702561 42.653502a14.533786 14.533786 0 0 0 11.374267 24.012342l133.015736-2.843567a14.849738 14.849738 0 0 0 14.217834-17.061401z" fill='red' p-id="12821" ></path></svg>
                                )
                              }
                              <span className={`ml-1 ${position.active === 1 ? 'text-green-400' : 'text-red-400'} `}>{position.active === 1 ? 'Active' : 'Inactive'}</span>
                              <div className='flex-1'></div>
                              <div className="text-sm  text-gray-400 ">
                                Initial: {position.initialUSDT} USDT
                              </div>
                              <div className=" hidden md:flex items-center space-x-3">
                                <button
                                  onClick={() => handleViewHistory({
                                    tokenAccountID: position.tokenAccountID,
                                    symbol: position.tokenSymbol,
                                    initialUSDT: position.initialUSDT,
                                    apiKeyId: '1',
                                    enabled: position.enabled,
                                    trending: position.trending,
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
                                  className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                                >
                                  <HistoryIcon className="w-4 h-4 mr-1" />
                                  History
                                </button>
                                <button onClick={() => {
                                  setCexItem(position)
                                  setIsSettingCexOpen(true)
                                }} className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
                                  <SettingsIcon className="w-4 h-4 mr-1" />
                                  Setting
                                </button>

                                <button onClick={() => {
                                  setCexItem(position)
                                  setIsCloseTokenOpen(true);
                                }} className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
                                  {position.active === 1 ? <CaptionsOff className="w-4 h-4 mr-1" /> :
                                    <Captions className="w-4 h-4 mr-1" />}
                                  {position.active === 1 ? 'Close' : 'Open'}
                                </button>


                              </div>

                            </div>


                            <div className=" md:hidden flex items-center space-x-3">
                              <button
                                onClick={() => handleViewHistory({
                                  tokenAccountID: position.tokenAccountID,
                                  symbol: position.tokenSymbol,
                                  initialUSDT: position.initialUSDT,
                                  apiKeyId: '1',
                                  enabled: position.enabled,
                                  trending: position.trending,
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
                                className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                              >
                                <HistoryIcon className="w-4 h-4 mr-1" />
                              </button>
                              <button onClick={() => {
                                setCexItem(position)
                                setIsSettingCexOpen(true)
                              }} className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
                                <SettingsIcon className="w-4 h-4 mr-1" />
                                Setting
                              </button>

                              <button onClick={() => {
                                setCexItem(position)
                                setIsCloseTokenOpen(true);
                              }} className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
                                {position.active === 1 ? <CaptionsOff className="w-4 h-4 mr-1" /> :
                                  <Captions className="w-4 h-4 mr-1" />}
                                {position.active === 1 ? 'Close' : 'Open'}
                              </button>


                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="text-sm text-gray-400">Current Balance</div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-400">USDT</div>
                                  <div className="text-white font-medium">
                                    ${position.usdtLeft ? new BigNumber(position.usdtLeft).toFixed(2) : '0.00'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-400">{position.tokenSymbol.split('USDT')[0]}</div>
                                  <div className="text-white font-medium">
                                    {position.tokenAmount.toFixed(6)}
                                    <span className="text-sm text-gray-400 ml-1">
                                      (${new BigNumber(position.tokenAmount * position.currentPrice).toFixed(2)})
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
                                    ${new BigNumber(position.value).toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-400">PNL</div>
                                  <div className={`font-medium flex items-center ${position.profitRate >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {position.profitRate >= 0 ? '+' : ''}{position.profitRate}%
                                    <span className="block ml-2 text-sm">
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


                  </div>
                )}
              </div>
            )}


            {activeTab === 'apikeys' && (
              <div className="bg-card  rounded-lg p-6">
                <div className="flex  items-center mb-6">
                  <div className='flex-1'>
                    <h3 className="text-lg font-medium text-white">API Keys</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Total: {apiKeys.length} keys
                    </p>
                  </div>
                  <Link target='_blank' to={'/api_key_guide.pdf'}><button
                    className="px-4 py-2 mr-2 common-button"
                  >
                    Get API Key?
                  </button></Link>
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
                            <span className="ml-2 px-2 py-1 bg-amber-400 rounded text-xs text-primary">
                              {apiKey.platform}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            API Key: {apiKey.apiKey.substring(0, 8)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {/* <div className="text-gray-400 text-sm">
                            Secret: {apiKey.maskedSecret}
                          </div> */}
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

            {/* {activeTab === 'simulate' && (
              <SimulateTrading tokenPairs={tokenPairs} />
            )} */}

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
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    {tokens.map((token) => (
                      <div
                        key={token.id}
                        className="bg-[#1a1a1a]/40 rounded-lg p-6 hover:bg-[#1a1a1a]/60 border border-[#333] hover:border-[#444] transition-colors duration-200"
                      >

                        <div className='flex w-full  justify-between items-center'>
                          <div className="text-xl font-medium text-white flex-1">{token.tokenSymbol}</div>
                          {
                            token.trending > 0 ? (
                              <svg className='w-6 h-6 text-red-400' viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13956" width="48" height="48"><path d="M904.00256 308.34176l58.52672-184.32c1.56672-4.62336-1.82272-9.59488-6.8864-9.86624l-193.5104-13.13792c-6.41536-0.42496-10.53184 6.7584-6.912 12.07296l45.696 66.80576-255.2064 173.3376L467.26144 238.592a15.43168 15.43168 0 0 0-21.46816-4.06016l-325.1712 220.928c-0.31232 0.2048-0.63488 0.40448-0.9472 0.6144l-17.66912 12.03712-19.49696 13.24544a7.6288 7.6288 0 0 0-1.9456 1.93536c-13.6448 12.7232-16.30208 33.16224-5.39648 49.16736a38.8864 38.8864 0 0 0 47.44704 13.84448c1.1264-0.16384 2.2272-0.5632 3.2256-1.24416l312.44288-212.18304 78.37696 114.51904c4.864 7.02464 14.45888 8.84224 21.46304 4.06528L844.544 243.5584l45.69088 66.80576c3.61984 5.31456 11.82208 4.11136 13.76768-2.01728" fill="#1afa29" p-id="13957"></path><path d="M140.46208 666.99264c-22.6816 0-41.13408 14.70464-41.13408 32.77312v189.952c0 18.0736 18.45248 32.77312 41.13408 32.77312 22.6816 0 41.13408-14.69952 41.13408-32.77312v-189.952c0-18.0736-18.45248-32.77312-41.13408-32.77312M401.408 540.73856c-22.6816 0-41.13408 15.18592-41.13408 33.85344v314.05056c0 18.6624 18.45248 33.84832 41.13408 33.84832 22.6816 0 41.13408-15.18592 41.13408-33.8432v-314.0608c0-18.6624-18.45248-33.8432-41.13408-33.8432m260.93568 63.12448c-22.6816 0-41.12896 15.6672-41.12896 34.93376v248.7552c0 19.26144 18.44736 34.93376 41.12896 34.93376s41.13408-15.6672 41.13408-34.93376v-248.7552c0-19.26144-18.45248-34.93376-41.13408-34.93376m260.9408-185.1392c-22.6816 0-41.13408 18.45248-41.13408 41.13408v421.49376c0 22.6816 18.45248 41.13408 41.13408 41.13408 22.6816 0 41.13408-18.45248 41.13408-41.13408V459.86304c0-22.6816-18.45248-41.13408-41.13408-41.13408" fill="#1afa29" p-id="13958"></path></svg>
                            ) : (
                              <svg className='w-6 h-6 text-red-400' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12820" width="48" height="48"><path d="M196.048133 357.025609v518.161062a9.162604 9.162604 0 0 1-9.478556 9.478556H142.336316a9.162604 9.162604 0 0 1-9.478556-9.478556V357.025609a9.162604 9.162604 0 0 1 9.478556-9.478556h44.233261a9.162604 9.162604 0 0 1 9.478556 9.478556z m211.687751 116.902191h-44.233261a9.162604 9.162604 0 0 0-9.478556 9.478556v391.780315a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233261a9.162604 9.162604 0 0 0 9.478556-9.478556V483.406356a9.162604 9.162604 0 0 0-9.478556-9.478556z m221.166307-31.595187h-44.233262a9.162604 9.162604 0 0 0-9.478556 9.478556v423.375502a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233262a9.162604 9.162604 0 0 0 9.478556-9.478556V451.811169a9.162604 9.162604 0 0 0-9.478556-9.478556z m221.166306 189.57112h-44.233261a9.162604 9.162604 0 0 0-9.478556 9.478556v233.804382a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233261a9.162604 9.162604 0 0 0 9.478556-9.478556v-233.804382a9.162604 9.162604 0 0 0-9.478556-9.478556z m31.595187-211.68775a14.533786 14.533786 0 0 0-25.592101-6.950941l-35.070657 42.021598a26.539957 26.539957 0 0 0-5.687134-6.319037l-284.35668-221.166307a31.595187 31.595187 0 0 0-24.644246-6.634989 31.595187 31.595187 0 0 0-21.484727 14.849737l-76.460351 126.380747-256.236964-197.785868a31.595187 31.595187 0 1 0-38.546128 49.920394l284.35668 221.166307a31.595187 31.595187 0 0 0 24.960198 6.003086 31.595187 31.595187 0 0 0 21.484727-14.849738l76.460351-126.380747 256.236964 199.365628a31.595187 31.595187 0 0 0 5.371182 3.159519l-35.702561 42.653502a14.533786 14.533786 0 0 0 11.374267 24.012342l133.015736-2.843567a14.849738 14.849738 0 0 0 14.217834-17.061401z" fill='red' p-id="12821" ></path></svg>
                            )
                          }

                          {/* <div className={`px-3 py-1 rounded-full text-sm ${token.trending > 0
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                            }`}>
                            {token.trending > 0 ? '↗' : '↘'}
                          </div> */}
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

                {/* Pagination Controls */}
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
        </div> : (mode === 'web3' ? <>
          <DexUi />
        </> : <TradingView />)}
      </main>

      <ApiKeyManager
        isOpen={isApiKeyManagerOpen}
        onClose={() => setIsApiKeyManagerOpen(false)}
        onSave={handleApiKeySave}
      />

      <CexAddToken
        isOpen={isTradingPairManagerOpen}
        onClose={() => setIsTradingPairManagerOpen(false)}
        onSave={fetchPortfolioData}
        apiKeys={apiKeys}
      />

      {cexItem && <SettingCexUi
        isOpen={isSettingCexOpen}
        onClose={() => {
          setIsSettingCexOpen(false);
        }}
        onSave={fetchPortfolioData}
        tokenAccountId={cexItem?.tokenAccountID}
        initUsdt={cexItem?.initialUSDT}
      />}

      {cexItem && <CloseToken
        isOpen={isCloseTokenOpen}
        onClose={() => {
          setIsCloseTokenOpen(false);
        }}
        isCex={true}
        onSave={fetchPortfolioData}
        item={cexItem}
        tokenSymbol={cexItem?.tokenSymbol} />}


      {selectedPair && (
        <TradingHistory
          isOpen={isHistoryOpen}
          onClose={() => {
            setIsHistoryOpen(false);
            setSelectedPair(null);
          }}
          tradingPair={selectedPair}
        />
      )}


    </div>
  );
};

export default Dashboard;