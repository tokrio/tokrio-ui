import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { CountUpAnimation } from './CountUpAnimation';



const StatsPanel = () => {
  return (
    <div className="py-24 bg-[#111]/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">
            Trading Performance
          </h2>
          <p className=" text-gray-400">
            Our AI-powered trading system delivers consistent results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center bg-card-dark"
          >
            <h3 className="text-xl font-semibold text-white mb-4 uppercase main-font">
              Win Rate
            </h3>
            <CountUpAnimation end={65} suffix="%" />
            <p className="text-gray-400 mt-2">
              Above 65% Trading Success Rate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-card-dark"
          >
            <h3 className="text-xl font-semibold text-white mb-4 uppercase main-font">
              Annual ROI
            </h3>
            <CountUpAnimation end={2000} suffix="%" />
            <p className="text-gray-400 mt-2">
              Maximum Annual Return
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-card-dark"
          >
            <h3 className="text-xl font-semibold text-white mb-4 uppercase main-font">
              AI Simulations
            </h3>
            <CountUpAnimation end={20} suffix="B+" />
            <p className="text-gray-400 mt-2">
              AI Algorithm Iterations
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 