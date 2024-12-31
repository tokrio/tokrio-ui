import React from 'react';
import { motion } from 'framer-motion';

const DocumentationSection = () => {
  const algorithms = [
    {
      title: "Predictive Analytics Engine",
      description: "Multi-dimensional market analysis powered by advanced machine learning",
      details: [
        "Neural network architecture for time-series forecasting",
        "Transformer-based sequence modeling",
        "Multi-head attention mechanism for market signals",
        "Cross-market data correlation analysis"
      ]
    },
    {
      title: "Adaptive Risk Management",
      description: "Sophisticated risk mitigation system with real-time adaptation",
      details: [
        "Dynamic position sizing optimization",
        "Kelly criterion portfolio allocation",
        "Automated risk parameter adjustment",
        "Cross-market volatility analysis"
      ]
    },
    {
      title: "Statistical Arbitrage System",
      description: "High-frequency market inefficiency detection",
      details: [
        "Cointegration-based pair selection",
        "Low-latency execution framework",
        "Liquidity-aware order routing",
        "Market impact analysis"
      ]
    },
    {
      title: "Market Intelligence Network",
      description: "Comprehensive market sentiment aggregation",
      details: [
        "Natural language processing for market sentiment",
        "On-chain metrics analysis",
        "Institutional flow monitoring",
        "Macro event impact quantification"
      ]
    }
  ];

  const features = [
    {
      title: "Low-Latency Infrastructure",
      points: [
        "Microsecond execution capability",
        "Intelligent order routing system",
        "Dynamic liquidity aggregation",
        "Transaction cost optimization"
      ]
    },
    {
      title: "Enterprise Risk Framework",
      points: [
        "Real-time exposure monitoring",
        "Multi-factor risk modeling",
        "Automated circuit breakers",
        "Portfolio optimization engine"
      ]
    },
    {
      title: "System Architecture",
      points: [
        "GPU-accelerated computation",
        "Distributed processing system",
        "Real-time data streaming",
        "High-availability infrastructure"
      ]
    }
  ];

  return (
    <div className="py-24 bg-[#111]/40" id="documentation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">
            Technical Architecture
          </h2>
          <p className="text-gray-400">
            Advanced Trading Infrastructure and Implementation
          </p>
        </div>

        {/* Algorithms Section */}
        <div className="mb-20">
          <h3 className="text-2xl text-center hero-text font-bold text-white mb-16">Core Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {algorithms.map((algo, index) => (
              <motion.div
                key={algo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card-dark">
                  <h4 className="text-base main-font font-bold text-white mb-2">{algo.title}</h4>
                  <p className="text-gray-400 mb-6">{algo.description}</p>
                  <ul className="space-y-2">
                    {algo.details.map((detail, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-[#FFA41C] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Features */}
        <div>
          <h3 className="text-2xl  text-center hero-text font-bold text-white mb-16">Technical Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card-dark">
                  <h4 className="text-base main-font font-bold text-white mb-6">{feature.title}</h4>
                  <ul className="space-y-2">
                    {feature.points.map((point, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-4 h-4 text-[#FFA41C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-white font-semibold">
            Continuously optimized algorithms with comprehensive backtesting
          </p>
          <div className="mt-4">
            * Historical performance does not guarantee future results. Trading involves substantial risk.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationSection; 