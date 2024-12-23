import React from 'react';
import { motion } from 'framer-motion';

const Tokenomics = () => {
  const distribution = [
    { category: "Private Sale", percentage: 10, color: "#FFA41C" },
    { category: "Public Sale", percentage: 15, color: "#FFD700" },
    { category: "Team", percentage: 15, color: "#FF6B6B" },
    { category: "Ecosystem & Community", percentage: 40, color: "#4CAF50" },
    { category: "Liquidity & Market", percentage: 15, color: "#2196F3" },
    { category: "Project Reserve", percentage: 5, color: "#9C27B0" }
  ];

  return (
    <div className="py-24 bg-[#111]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">Tokenomics</h2>
          <p className="text-xl text-gray-400">
            TOKR token distribution and allocation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {distribution.map((item) => (
              <div key={item.category} className="bg-card-dark rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{item.category}</span>
                  <span className="text-primary">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card-dark rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Token Details</h3>
            <div className="space-y-4 text-gray-400">
              <div>
                <strong className="text-white">Total Supply:</strong> 1,000,000,000 TOKR
              </div>
              <div>
                <strong className="text-white">Initial Circulating Supply:</strong> 25%
              </div>
              <div>
                <strong className="text-white">Token Type:</strong> BEP-20
              </div>
              <div className="pt-4">
                <h4 className="text-white font-bold mb-2">Vesting Schedule</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Private Sale: 10% at TGE, 6 months linear vesting</li>
                  <li>Team: 12 months cliff, 24 months linear vesting</li>
                  <li>Advisors: 6 months cliff, 18 months linear vesting</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tokenomics; 