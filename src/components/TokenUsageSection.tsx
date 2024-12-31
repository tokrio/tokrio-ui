import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TokenUsageSection = () => {
  const currentPrice = 0.5; // USDT
  const minTokens = 100;

  const levels = [
    { level: 1, tokens: 100, pairs: 3, priority: "Standard" },
    { level: 2, tokens: 200, pairs: 5, priority: "Enhanced" },
    { level: 3, tokens: 400, pairs: 10, priority: "Advanced" },
    { level: 4, tokens: 800, pairs: 15, priority: "Priority" },
    { level: 5, tokens: 1600, pairs: 20, priority: "Premium" },
    { level: 6, tokens: 3200, pairs: 30, priority: "Elite" },
    { level: 7, tokens: 6400, pairs: 40, priority: "Pro Elite" },
    { level: 8, tokens: 12800, pairs: 50, priority: "Master" },
    { level: 9, tokens: 25600, pairs: 75, priority: "Grand Master" },
    { level: 10, tokens: 51200, pairs: "Unlimited", priority: "Ultimate" }
  ];

  return (
    <div className="py-24 bg-[#111]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">Algorithmic Trading Access</h2>
          <p className="text-gray-400">
            Initialize your algorithmic trading portfolio with {minTokens} TOKR (${(currentPrice * minTokens).toFixed(2)} USDT)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card-dark"
          >
            <h3 className="text-xl font-bold text-white mb-4">Progressive Tier System</h3>
            <p className="text-gray-400 mb-4">
              Expand your trading capabilities through strategic TOKR accumulation. Each tier unlocks enhanced features and execution privileges.
            </p>
            <Link 
              to="/levels" 
              className="text-primary flex items-center hover:text-primary/80 transition-colors duration-300"
            >
              Explore Tier Benefits →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card-dark"
          >
            <h3 className="text-xl font-bold text-white mb-4">Advanced Trading Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Expanded market pair access</li>
              <li>• Priority order execution</li>
              <li>• Enhanced algorithmic performance</li>
              <li>• Advanced AI-driven analytics</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TokenUsageSection; 