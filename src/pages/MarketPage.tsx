import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import BigNumber from 'bignumber.js';

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

interface FilterOptions {
  level: number | 'all';
  minAmount: string;
  maxAmount: string;
  minDuration: string;
  maxDuration: string;
}

const MarketPage = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    level: 'all',
    minAmount: '',
    maxAmount: '',
    minDuration: '',
    maxDuration: ''
  });

  // 模拟市场数据
  const [sponsors] = useState<Sponsor[]>([
    {
      id: '1',
      creator: '0x1234...5678',
      tokenAmount: BigInt(256000000000000000000), // 256 TOKR
      duration: BigInt(30),
      isActive: false,
      level: BigInt(1),
      createdAt: BigInt(Math.floor(Date.now() / 1000))
    },
    {
      id: '2',
      creator: '0x8765...4321',
      tokenAmount: BigInt(512000000000000000000), // 512 TOKR
      duration: BigInt(90),
      isActive: false,
      level: BigInt(2),
      createdAt: BigInt(Math.floor(Date.now() / 1000))
    },
    {
      id: '3',
      creator: '0x9876...1234',
      tokenAmount: BigInt(1024000000000000000000), // 1024 TOKR
      duration: BigInt(180),
      isActive: false,
      level: BigInt(3),
      createdAt: BigInt(Math.floor(Date.now() / 1000))
    }
  ]);

  // 过滤赞助列表
  const filteredSponsors = sponsors.filter(sponsor => {
    if (filters.level !== 'all' && Number(sponsor.level) !== filters.level) {
      return false;
    }
    
    const amount = Number(new BigNumber(sponsor.tokenAmount.toString()).div(1e18));
    if (filters.minAmount && amount < Number(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && amount > Number(filters.maxAmount)) {
      return false;
    }

    const duration = Number(sponsor.duration);
    if (filters.minDuration && duration < Number(filters.minDuration)) {
      return false;
    }
    if (filters.maxDuration && duration > Number(filters.maxDuration)) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar showMenu={false} />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sponsor Market
          </h2>
          <p className="text-xl text-gray-400">
            Find the perfect sponsor to boost your trading capabilities
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
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
          {filteredSponsors.map((sponsor, index) => (
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
                  {sponsor.creator}
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Buy Sponsor'}
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