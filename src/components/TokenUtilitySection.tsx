import React from 'react';
import { motion } from 'framer-motion';

const TokenUtilitySection = () => {
  const utilities = [
    {
      title: "Tier Progression System",
      description: "Enhance trading capabilities through strategic TOKR accumulation and tier advancement",
      icon: "🔝"
    },
    {
      title: "Yield Generation",
      description: "Generate passive income through participation in the protocol's reward distribution mechanism",
      icon: "💰"
    },
    {
      title: "Revenue Sharing",
      description: "Participate in the protocol's revenue stream by sponsoring qualified traders",
      icon: "🤝"
    },
    {
      title: "Market Intelligence",
      description: "Access premium market insights and emerging trading opportunities through TOKR staking",
      icon: "🔍"
    }
  ];

  return (
    <div className="py-24 bg-[#111]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">Protocol Utility</h2>
          <p className="text-gray-400">
            Comprehensive Benefits of TOKR Token Integration
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