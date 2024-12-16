import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BigNumber from 'bignumber.js';

interface Sponsor {
  id: string;
  creator: string;
  tokenAmount: bigint;
  duration: bigint;
  isActive: boolean;
  level: bigint;
  createdAt: bigint;
}

const SponsorSharePage = () => {
  const { address } = useParams();
  
  // 模拟数据
  const userSponsors: Sponsor[] = [
    {
      id: '1',
      creator: address || '0x0',
      tokenAmount: BigInt(100000000000000000000), // 100 TOKR
      duration: BigInt(30),
      isActive: false,
      level: BigInt(1),
      createdAt: BigInt(Math.floor(Date.now() / 1000))
    },
    {
      id: '2',
      creator: address || '0x0',
      tokenAmount: BigInt(200000000000000000000), // 200 TOKR
      duration: BigInt(90),
      isActive: false,
      level: BigInt(2),
      createdAt: BigInt(Math.floor(Date.now() / 1000))
    }
  ];

  const performanceStats = {
    totalTrades: 1234,
    successRate: 98.5,
    avgROI: 35.8,
    monthlyVolume: '2.5M'
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar showMenu={false} />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Trading Performance */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI-Powered Trading Excellence
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join our high-performance trading ecosystem powered by advanced AI algorithms
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="text-2xl font-bold text-primary">{performanceStats.totalTrades}</div>
              <div className="text-sm text-gray-400">Total Trades</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="text-2xl font-bold text-green-400">{performanceStats.successRate}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="text-2xl font-bold text-primary">{performanceStats.avgROI}%</div>
              <div className="text-sm text-gray-400">Average ROI</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="text-2xl font-bold text-white">${performanceStats.monthlyVolume}</div>
              <div className="text-sm text-gray-400">Monthly Volume</div>
            </motion.div>
          </div>
        </div>

        {/* Available Sponsors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">Available Sponsorships</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userSponsors.map((sponsor, index) => (
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

                <button
                  className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Buy Sponsor
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Get Started Section */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Get Started Today</h3>
            <p className="text-gray-400">
              Choose your preferred way to join our trading ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-700 rounded-lg p-6"
            >
              <h4 className="text-xl font-bold text-white mb-4">Buy TOKR</h4>
              <p className="text-gray-400 mb-4">
                Purchase TOKR tokens to access all features and earn rewards
              </p>
              <a
                href="/swap"
                className="block w-full px-4 py-2 bg-primary text-white rounded text-center hover:bg-primary-dark"
              >
                Go to Swap
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-700 rounded-lg p-6"
            >
              <h4 className="text-xl font-bold text-white mb-4">Get Sponsored</h4>
              <p className="text-gray-400 mb-4">
                Choose a sponsor above to start trading immediately
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                View Sponsors
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorSharePage; 