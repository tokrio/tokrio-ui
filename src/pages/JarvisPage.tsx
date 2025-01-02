import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const JarvisPage = () => {
  // 使用静态数据
  const jarvisInfo = {
    currentLevel: 3,
    maxRobots: 1000,
    remainingRobots: 850,
    canClaim: false
  };

  return (
    <div className="min-h-screen">
      <Navbar showMenu={false} />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Jarvis AI Trading Robot</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Current Level</div>
              <div className="text-2xl font-bold text-white">{jarvisInfo.currentLevel}</div>
            </div>
            
            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Maximum Robots</div>
              <div className="text-2xl font-bold text-white">{jarvisInfo.maxRobots}</div>
            </div>
            
            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Remaining Slots</div>
              <div className="text-2xl font-bold text-white">{jarvisInfo.remainingRobots}</div>
            </div>
            
            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Claim Status</div>
              <div className={`text-2xl font-bold ${jarvisInfo.canClaim ? 'text-green-400' : 'text-red-400'}`}>
                {jarvisInfo.canClaim ? 'Available' : 'Unavailable'}
              </div>
            </div>
          </div>

          <button
            disabled={true}
            className="w-full px-6 py-3 rounded-lg font-medium bg-gray-600 text-gray-400 cursor-not-allowed"
          >
            Claim Jarvis Robot
          </button>

          <div className="mt-8 p-6 bg-card-dark rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Important Information</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Total available Jarvis robots: 1,000</li>
              <li>• Minimum requirement: Level 5 staking</li>
              <li>• Comprehensive AI trading capabilities including:</li>
              <ul className="ml-6 mt-2 space-y-1">
                <li>- Automated token selection</li>
                <li>- Position size management</li>
                <li>- Trade execution optimization</li>
              </ul>
              <li className="mt-4 text-yellow-400">
                Note: Access to Jarvis will be revoked if your level drops below 5 or if all robot slots are claimed, 
                even if you meet the level requirement.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JarvisPage; 