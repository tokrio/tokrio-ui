import React from 'react';
import { motion } from 'framer-motion';

const TokenUtilitySection = () => {
  const utilities = [
    {
      title: "Level Up Privileges",
      description: "Increase your TOKR holdings to unlock higher levels and enhanced trading capabilities",
      icon: "🔝"
    },
    {
      title: "Staking Rewards",
      description: "Stake TOKR to earn passive income through our reward distribution system",
      icon: "💰"
    },
    {
      title: "Sponsorship Income",
      description: "Sponsor other traders and earn a share of their trading fees",
      icon: "🤝"
    },
    {
      title: "Token Discovery",
      description: "Stake TOKR to participate in new token discoveries and trading opportunities",
      icon: "🔍"
    }
  ];

  return (
    <div className="py-24 bg-[#111]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">TOKR Utility</h2>
          <p className=" text-gray-400">
            Multiple ways to benefit from holding TOKR tokens
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {utilities.map((utility, index) => (
            <motion.div
              key={utility.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-dark"
            >
              <div className="text-4xl mb-4">{utility.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{utility.title}</h3>
              <p className="text-gray-400">{utility.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenUtilitySection; 