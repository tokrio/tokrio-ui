import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import { config } from '../config/env';
import { TokrioLevelAbi, TokrioStaking } from '../abi/Abi';
import { erc20Abi } from 'viem';
import toast from 'react-hot-toast';
import BigNumber from 'bignumber.js';
import Navbar from '../components/Navbar';
import formatStringNumber from '../util/utils';
import TokenDecimals from '../components/TokenDecimals';
import { useNavigate } from 'react-router-dom';
import { fetchBalanceObj, getReadData, IResponse } from '../contract/api';
import TokenName from '../components/TokenName';
import TokenBalance from '../components/TokenBalance';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdSponsors, setCreatedSponsors] = useState<any>([]);
  const [buySponsors, setBuySponsors] = useState<any>([]);
  const [isCreateSponsorModalOpen, setIsCreateSponsorModalOpen] = useState(false);
  const [createSponsorLoading, setCreateSponsorLoading] = useState(false);
  const [cancelOfferLoading, setCancelOfferLoading] = useState(false);
  const [wthdrawLoading, setWithdrawLoading] = useState(false);
  const [offerId, setOfferId] = useState<string>("");
  const [sponsorTab, setSponsorTab] = React.useState('my-sponsors');

  useEffect(() => {
    getSponsors()
  }, [sponsorTab])

  const handleTabChange = (tab: string) => {
    setSponsorTab(tab);
  };


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
    <div className="min-h-screen">
      <Navbar showMenu={false} />
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 main-font">
            Sponsor Program
          </h2>
          <p className="text-xl text-gray-400">
            Earn rewards by sponsoring other traders
          </p>
        </div>


        <div className="bg-card  rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Sponsors Created</div>
              <div className="text-2xl font-bold text-white">{createdSponsors.length}</div>
            </div>
            <div className="bg-card rounded-lg p-4">
              <div className="text-sm text-gray-400">Active Sponsors</div>
              <div className="text-2xl font-bold text-green-400">
                {createdSponsors.filter((s: { status: any; }) => Number(s.status.toString()) == 1).length}
              </div>
            </div>
            <div className="bg-card rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Earnings</div>
              <div className="text-2xl font-bold text-primary">$1,000</div>
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
                    ? 'bg-green-500/20 text-green-400' :
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
                    ? 'bg-green-500/20 text-green-400' :
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



        {/* Info Section */}
        <div className="rounded-lg p-6 border  border-gray-700 mt-6 mb-16">
          <h3 className="text-xl font-bold text-white mb-4">How Sponsorship Works</h3>
          <div className="prose prose-invert max-w-none">
            <p>
              Token holders can create sponsorships to earn rewards while helping other traders:
            </p>
            <ul className="list-disc mt-4 ml-4 space-y-2">
              <li>Lock your tokens for a specific duration (30-365 days)</li>
              <li>Other users can purchase your sponsorship to instantly access higher level features</li>
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
        isOpen={isCreateSponsorModalOpen}
        onClose={() => setIsCreateSponsorModalOpen(false)}
        onSubmit={handleCreateSponsor}
        loading={createSponsorLoading}
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