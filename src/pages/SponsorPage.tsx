import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import { config } from '../config/env';
import { TokrioStaking } from '../abi/Abi';
import { erc20Abi } from 'viem';
import toast from 'react-hot-toast';
import BigNumber from 'bignumber.js';
import Navbar from '../components/Navbar';

interface Sponsor {
  id: string;
  creator: string;
  tokenAmount: bigint;
  duration: bigint;
  isActive: boolean;
  buyer?: string;
  createdAt: bigint;
  level: bigint;
}

interface CreateSponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tokenAmount: string, duration: string) => Promise<void>;
  loading: boolean;
}

interface PricingOption {
  duration: number;  // 天数
  price: number;    // USDT 价格
  level: number;    // 等级
}

const PRICING_OPTIONS: PricingOption[] = [
  {
    duration: 30,
    price: 256,
    level: 1
  },
  {
    duration: 90,
    price: 512,
    level: 2
  },
  {
    duration: 180,
    price: 1024,
    level: 3
  },
  {
    duration: 365,
    price: 3888,
    level: 4
  }
];

const CreateSponsorModal: React.FC<CreateSponsorModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [selectedOption, setSelectedOption] = useState<PricingOption | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customDuration, setCustomDuration] = useState('30');
  const [selectedLevel, setSelectedLevel] = useState(1);

  if (!isOpen) return null;

  const currentBenefits = getBenefits(selectedLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 如果选择了预设选项，使用预设值；否则使用自定义值
    const amount = selectedOption ? selectedOption.price.toString() : customAmount;
    const duration = selectedOption ? selectedOption.duration.toString() : customDuration;
    onSubmit(amount, duration);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-4">Create Sponsor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 等级选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sponsorship Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              required
            >
              <option value={1}>Level 1 (3 Trading Pairs)</option>
              <option value={2}>Level 2 (5 Trading Pairs)</option>
              <option value={3}>Level 3 (10 Trading Pairs)</option>
              <option value={4}>Level 4 (Unlimited Trading Pairs)</option>
            </select>
          </div>

          {/* 预设选项 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {PRICING_OPTIONS.filter(option => option.level === selectedLevel).map((option) => (
              <button
                key={option.duration}
                type="button"
                onClick={() => {
                  setSelectedOption(option);
                  setCustomAmount('');
                }}
                className={`p-4 rounded-lg border ${
                  selectedOption === option
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-lg font-bold">{option.price} USDT</div>
                <div className="text-sm text-gray-400">{option.duration} Days</div>
              </button>
            ))}
          </div>

          {/* 自定义输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Amount (Optional)
            </label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedOption(null);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="Enter custom amount"
              min={PRICING_OPTIONS.find(opt => opt.level === selectedLevel)?.price || 0}
            />
          </div>

          {/* 预估收益说明 */}
          <div className="bg-gray-700/50 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Level {selectedLevel} Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• {currentBenefits.pairs}</li>
              <li>• {currentBenefits.support}</li>
              <li>• {currentBenefits.features}</li>
              <li>• Estimated ROI: up to {currentBenefits.maxROI}</li>
              <li>• Minimum Amount: {currentBenefits.minAmount} USDT</li>
              <li>• 60% of sponsored user's trading fees</li>
              <li>• Auto-return after sponsorship period</li>
            </ul>
          </div>

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
              disabled={loading || (!selectedOption && !customAmount)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

interface LevelBenefit {
  pairs: string;
  support: string;
  features: string;
  minAmount: number;
  maxROI: string;
}

type LevelBenefits = {
  [key in 1 | 2 | 3 | 4]: LevelBenefit;
}

const LEVEL_BENEFITS: LevelBenefits = {
  1: {
    pairs: '3 Trading Pairs',
    support: 'Standard Support',
    features: 'Basic Features',
    minAmount: 256,
    maxROI: '25%'
  },
  2: {
    pairs: '5 Trading Pairs',
    support: 'Priority Support',
    features: 'Advanced Features',
    minAmount: 512,
    maxROI: '30%'
  },
  3: {
    pairs: '10 Trading Pairs',
    support: 'VIP Support',
    features: 'Premium Features',
    minAmount: 1024,
    maxROI: '35%'
  },
  4: {
    pairs: 'Unlimited Trading Pairs',
    support: '24/7 VIP Support',
    features: 'All Features',
    minAmount: 3888,
    maxROI: '40%'
  }
};

const getBenefits = (level: number): LevelBenefit => {
  return LEVEL_BENEFITS[level as keyof LevelBenefits] || LEVEL_BENEFITS[1];
};

const SponsorPage = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 使用模拟数据
  const [activeSponsor] = useState<Sponsor | null>({
    id: '1',
    creator: '0x1234...5678',
    tokenAmount: BigInt(1000000000000000000), // 1 TOKR
    duration: BigInt(30),
    isActive: true,
    level: BigInt(2),
    createdAt: BigInt(Math.floor(Date.now() / 1000))
  });
  
  const [createdSponsors] = useState<Sponsor[]>([
    {
      id: '2',
      creator: address || '0x0',
      tokenAmount: BigInt(2000000000000000000), // 2 TOKR
      duration: BigInt(90),
      isActive: false,
      level: BigInt(2),
      createdAt: BigInt(Math.floor(Date.now() / 1000))
    }
  ]);
  
  const [availableSponsors] = useState<Sponsor[]>([
    {
      id: '3',
      creator: '0x9876...4321',
      tokenAmount: BigInt(3000000000000000000), // 3 TOKR
      duration: BigInt(180),
      isActive: false,
      level: BigInt(3),
      createdAt: BigInt(Math.floor(Date.now() / 1000))
    }
  ]);

  // 创建赞助
  const handleCreateSponsor = async (tokenAmount: string, duration: string) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Sponsor created successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create sponsor');
    } finally {
      setLoading(false);
    }
  };

  // 购买赞助
  const handleBuySponsor = async (sponsorId: string) => {
    setLoading(true);
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Sponsor purchased successfully');
    } catch (error) {
      toast.error('Failed to buy sponsor');
    } finally {
      setLoading(false);
    }
  };

  // 分享赞助
  const handleShare = (sponsorId: string) => {
    const url = `${window.location.origin}/sponsor/${sponsorId}`;
    navigator.clipboard.writeText(url);
    toast.success('Sponsor link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar showMenu={false} />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sponsor Program
          </h2>
          <p className="text-xl text-gray-400">
            Earn rewards by sponsoring other traders
          </p>
        </div>

        {/* Active Sponsor */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Your Active Sponsor</h3>
          {activeSponsor ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Level</div>
                  <div className="text-xl font-bold text-white">Level {activeSponsor.level.toString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Token Amount</div>
                  <div className="text-xl font-bold text-white">
                    {new BigNumber(activeSponsor.tokenAmount.toString()).div(1e18).toString()} TOKR
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="text-xl font-bold text-white">{activeSponsor.duration.toString()} Days</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Sponsor</div>
                  <div className="text-xl font-bold text-white truncate">
                    {activeSponsor.creator.substring(0, 6)}...{activeSponsor.creator.substring(38)}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg">
              No active sponsor. Browse available sponsors below.
            </div>
          )}
        </div>

        {/* Created Sponsors */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Created Sponsors</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Create Sponsor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {createdSponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xl font-bold text-white mb-1">
                      Level {sponsor.level.toString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new BigNumber(sponsor.tokenAmount.toString()).div(1e18).toFixed(2)} TOKR
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getBenefits(Number(sponsor.level.toString())).pairs}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    sponsor.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {sponsor.isActive ? 'Active' : 'Available'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-white">{sponsor.duration.toString()} Days</div>
                  </div>
                  {sponsor.buyer && (
                    <div>
                      <div className="text-sm text-gray-400">Buyer</div>
                      <div className="text-white truncate">
                        {sponsor.buyer.substring(0, 6)}...{sponsor.buyer.substring(38)}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleShare(sponsor.id)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Share
                </button>
              </motion.div>
            ))}
          </div>

          {createdSponsors.length === 0 && (
            <div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg">
              No sponsors created yet. Click "Create Sponsor" to get started.
            </div>
          )}
        </div>

        {/* Available Sponsors */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Available Sponsors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableSponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xl font-bold text-white mb-1">
                      Level {sponsor.level.toString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new BigNumber(sponsor.tokenAmount.toString()).div(1e18).toFixed(2)} TOKR
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getBenefits(Number(sponsor.level.toString())).pairs}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {sponsor.duration.toString()} Days
                    </div>
                    <div className="text-xs text-green-400 mt-1">
                      Est. ROI: 15-40%
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-400">Creator</div>
                  <div className="text-white truncate">
                    {sponsor.creator.substring(0, 6)}...{sponsor.creator.substring(38)}
                  </div>
                </div>

                <button
                  onClick={() => handleBuySponsor(sponsor.id)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Buy Sponsor'}
                </button>
              </motion.div>
            ))}
          </div>

          {availableSponsors.length === 0 && (
            <div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg">
              No available sponsors at the moment. Check back later.
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-16">
          <h3 className="text-xl font-bold text-white mb-4">How Sponsorship Works</h3>
          <div className="prose prose-invert max-w-none">
            <p>
              Token holders can create sponsorships to earn rewards while helping other traders:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lock your tokens for a specific duration (30-365 days)</li>
              <li>Other users can purchase your sponsorship to instantly access higher level features</li>
              <li>Earn 60% of their trading fees as passive income</li>
              <li>Higher sponsorship levels allow users to trade more pairs</li>
              <li>Your tokens are automatically returned after the sponsorship period</li>
            </ul>
            <p className="mt-4 text-sm text-gray-400">
              * Sponsorship rewards are distributed in real-time based on actual trading volume
            </p>
          </div>
        </div>
      </div>

      <CreateSponsorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSponsor}
        loading={loading}
      />

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <div className="text-white mt-4">Processing...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorPage; 