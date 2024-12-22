import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import { config } from '../config/env';
import { TokrioSponsor } from '../abi/Abi';
import TokenDecimals from '../components/TokenDecimals';
import toast from 'react-hot-toast';

interface Sponsor {
  creator: string;
  offerType: number;
  targetLevel: bigint;
  duration: bigint;
  tokenAmount: bigint;
  usdtAmount: bigint;
  active: boolean;
  sponsor: string;
  user: string;
  startTime: string;
  endTime: bigint;
  earnings: bigint;
  id: string
}

interface FilterOptions {
  level: number | 'all';
  minAmount: string;
  maxAmount: string;
  minDuration: string;
  maxDuration: string;
}

const MarketPage = () => {
  const [loading, setLoading] = useState(false);
  const [buyOfferLoading, setBuyOfferLoading] = useState(false);
  const [offerId, setOfferId] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    level: 'all',
    minAmount: '',
    maxAmount: '',
    minDuration: '',
    maxDuration: ''
  });

  // 模拟市场数据
  const [sponsors, setSponsors] = useState<any>([]);

  useEffect(() => {
    getSponsors()
  }, [])

  const getSponsors = async () => {

    const sponsorList: any = await readContract(chainConfig, {
      address: config.SPONSOR as `0x${string}`,
      abi: TokrioSponsor,
      functionName: 'getActiveOffers',
      args: [0, 100000]
    });

    let list = sponsorList[0]
    let sponsorDetailList = []
    let item: Sponsor

    for (let index = 0; index < list.length; index++) {
      const offerId = list[index];
      const sponsorDetail: any = await readContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioSponsor,
        functionName: 'getOffer',
        args: [offerId]
      });
      console.log("sponsorDetail=", sponsorDetail)
      item = {
        creator: sponsorDetail.creator,
        offerType: sponsorDetail.offerType,
        targetLevel: sponsorDetail.targetLevel,
        duration: sponsorDetail.duration,
        tokenAmount: sponsorDetail.tokenAmount,
        usdtAmount: sponsorDetail.usdtAmount,
        active: sponsorDetail.active,
        sponsor: sponsorDetail.sponsor,
        user: sponsorDetail.user,
        startTime: sponsorDetail.startTime,
        endTime: sponsorDetail.startTime ? BigInt(new BigNumber(sponsorDetail.startTime).plus(sponsorDetail.duration).toFixed()) : 0n,
        earnings: 0n,
        id: offerId + "",
      }
      sponsorDetailList.push(item)

    }

    setSponsors([...sponsorDetailList])


    console.log("sponsorList=", sponsorDetailList)


  }

  const buySponsor = async (offerId: string) => {
    setBuyOfferLoading(true)
    try {
      const hash = await writeContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioSponsor,
        functionName: 'cancelOffer',
        args: [offerId]
      });
      const approveData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (approveData.status && approveData.status.toString() == "success") {
        toast.success('Buy sponsor successfully');
        getSponsors()
      } else {
        toast.success('Buy sponsor failed');

      }

    } catch (error) {
      toast.error('Failed to create sponsor');
    } finally {
      setBuyOfferLoading(false);
    }
  }

  // 过滤赞助列表
  const filteredSponsors = sponsors.filter((sponsor: any) => {
    if (filters.level !== 'all' && Number(sponsor.targetLevel) !== filters.level) {
      return false;
    }

    const amount = Number(new BigNumber(sponsor.tokenAmount.toString()).div(1e18));
    if (filters.minAmount && amount < Number(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && amount > Number(filters.maxAmount)) {
      return false;
    }

    const duration = Number(Number(sponsor.duration.toString()) / 24 / 3600);
    if (filters.minDuration && duration < Number(filters.minDuration)) {
      return false;
    }
    if (filters.maxDuration && duration > Number(filters.maxDuration)) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen">
      <Navbar showMenu={false} />
      <div className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white main-font mb-4">
            Sponsor Market
          </h2>
          <p className="text-xl text-gray-400">
            Find the perfect sponsor to boost your trading capabilities
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Level
              </label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value === 'all' ? 'all' : Number(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="all">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Amount Range (TOKR)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Duration Range (Days)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minDuration}
                  onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDuration}
                  onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sponsor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsors.map((sponsor: Sponsor, index: number) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 border"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xl font-bold text-white mb-1">
                    Level {sponsor.targetLevel.toString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new BigNumber(sponsor.tokenAmount.toString()).div(1e18).toFixed(2)} TOKR
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {new BigNumber(sponsor.duration.toString()).dividedBy(24 * 3600).toFixed()} Days
                  </div>
                  <div className="text-xs text-green-400 mt-1">
                    Est. ROI: 15-40%
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400">Price</div>
                <div className="text-white truncate">

                  {/* <CountUpAnimation end={1000000} prefix="$" /> */}
                  <TokenDecimals token={config.USDT_TOKEN} amount={sponsor.usdtAmount.toString()} /> USDT

                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400">Creator</div>
                <div className="text-white truncate">
                  {sponsor.creator}
                </div>
              </div>

              <button
                onClick={() => {
                  setOfferId(sponsor.id)
                  buySponsor(sponsor.id)
                }}
                disabled={buyOfferLoading}
                className="w-full px-4 py-2 cta-button disabled:opacity-50"
              >
                {buyOfferLoading && offerId == sponsor.id ? 'Processing...' : 'Buy Sponsor'}
              </button>
            </motion.div>
          ))}
        </div>

        {filteredSponsors.length === 0 && (
          <div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg">
            No sponsors match your filters. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPage; 