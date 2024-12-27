import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TokenUsageSection = () => {
  const currentPrice = 0.5; // USDT
  const minTokens = 100;

  const levels = [
    { level: 1, tokens: 100, pairs: 3, priority: "Normal" },
    { level: 2, tokens: 200, pairs: 5, priority: "Enhanced" },
    { level: 3, tokens: 400, pairs: 10, priority: "High" },
    { level: 4, tokens: 800, pairs: 15, priority: "Very High" },
    { level: 5, tokens: 1600, pairs: 20, priority: "Premium" },
    { level: 6, tokens: 3200, pairs: 30, priority: "Elite" },
    { level: 7, tokens: 6400, pairs: 40, priority: "Super Elite" },
    { level: 8, tokens: 12800, pairs: 50, priority: "Master" },
    { level: 9, tokens: 25600, pairs: 75, priority: "Grand Master" },
    { level: 10, tokens: 51200, pairs: "Unlimited", priority: "Ultimate" }
  ];

  return (
    <div className="py-24 bg-[#111]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">Start Trading with TOKR</h2>
          <p className=" text-gray-400">
            Begin your AI trading journey with just {minTokens} TOKR (${(currentPrice * minTokens).toFixed(2)} USDT)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card-dark"
          >
            <h3 className="text-xl font-bold text-white mb-4">Level Up Your Trading</h3>
            <p className="text-gray-400 mb-4">
              Double your TOKR holdings to unlock higher levels. Each level brings enhanced trading capabilities and privileges.
            </p>
            <div className="text-primary flex items-center">
               View detailed level benefits
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card-dark"
          >
            <h3 className="text-xl font-bold text-white mb-4">Trading Benefits</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Higher levels = More trading pairs</li>
              <li>• Increased execution priority</li>
              <li>• Enhanced trading speed</li>
              <li>• Advanced AI features</li>
            </ul>
          </motion.div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">TOKR Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trading Pairs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {levels.map((level, index) => (
                <tr key={level.level} className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/30'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Level {level.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{level.tokens.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{level.pairs}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{level.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenUsageSection; 