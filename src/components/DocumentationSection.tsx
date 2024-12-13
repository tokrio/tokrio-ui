import React from 'react';
import { motion } from 'framer-motion';

const DocumentationSection = () => {
  const algorithms = [
    {
      title: "Trend Prediction Algorithm",
      description: "Multi-dimensional trend prediction system based on deep learning",
      details: [
        "LSTM neural networks for historical price pattern analysis",
        "Transformer architecture for long-term dependency processing",
        "Attention mechanism for key market turning points",
        "Multi-source data fusion for improved accuracy"
      ]
    },
    {
      title: "Dynamic Risk Control",
      description: "Adaptive multi-level risk control mechanism",
      details: [
        "Volatility-adaptive position management",
        "Kelly criterion-based capital allocation",
        "Dynamic stop-loss and take-profit settings",
        "Cross-market correlation analysis"
      ]
    },
    {
      title: "Arbitrage Strategy Engine",
      description: "Efficient cross-market arbitrage mechanism",
      details: [
        "Statistical arbitrage modeling",
        "High-frequency spread capture",
        "Liquidity analysis and optimization",
        "Latency arbitrage risk assessment"
      ]
    },
    {
      title: "Sentiment Analysis System",
      description: "Comprehensive market sentiment capture",
      details: [
        "Social media sentiment analysis",
        "On-chain data analysis",
        "Whale behavior tracking",
        "Global macro event impact assessment"
      ]
    }
  ];

  const features = [
    {
      title: "High-Frequency Trading Engine",
      points: [
        "Millisecond-level response",
        "Smart order routing",
        "Liquidity optimization",
        "Transaction cost control"
      ]
    },
    {
      title: "Risk Management",
      points: [
        "Real-time risk monitoring",
        "Multi-dimensional risk assessment",
        "Automated stop-loss mechanism",
        "Capital management optimization"
      ]
    },
    {
      title: "Performance Optimization",
      points: [
        "GPU-accelerated computing",
        "Distributed processing architecture",
        "Real-time data processing",
        "High availability design"
      ]
    }
  ];

  return (
    <div className="bg-gray-900 py-24" id="documentation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Technical Documentation
          </h2>
          <p className="text-xl text-gray-400">
            Deep dive into our core technologies and strategy implementation
          </p>
        </div>

        {/* Algorithms Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8">Core Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {algorithms.map((algo, index) => (
              <motion.div
                key={algo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h4 className="text-xl font-bold text-primary mb-2">{algo.title}</h4>
                <p className="text-gray-400 mb-4">{algo.description}</p>
                <ul className="space-y-2">
                  {algo.details.map((detail, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <svg className="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Features */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8">Technical Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                <ul className="space-y-2">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <svg className="w-4 h-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Our algorithms are rigorously backtested and continuously optimized for market adaptability
          </p>
          <div className="mt-4 text-sm text-gray-500">
            * Past performance does not guarantee future results. Trading involves risks.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationSection; 