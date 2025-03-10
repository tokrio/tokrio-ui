import React from 'react';
import Navbar from '../components/Navbar';

const LevelBenefitsPage = () => {
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
    <div>
      <Navbar />
      <div className="py-24 bg-[#111]/40 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="hero-text mb-4">TOKR Level Benefits</h2>
            <p className="text-gray-400">
              Detailed overview of benefits and requirements for each level
            </p>
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
    </div>
  );
};

export default LevelBenefitsPage; 