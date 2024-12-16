import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Securely connect your crypto wallet to get started"
    },
    {
      number: "02",
      title: "Get Level Access",
      description: "Stake TOKR tokens or get sponsored to access trading features"
    },
    {
      number: "03",
      title: "Configure API Keys",
      description: "Set up your exchange API keys with trading permissions"
    },
    {
      number: "04",
      title: "Select Trading Pairs",
      description: "Choose your preferred trading pairs and set investment amounts"
    },
    {
      number: "05",
      title: "Start Trading",
      description: "Let our AI algorithms analyze and execute trades automatically"
    }
  ];

  return (
    <div className="bg-black py-24" id="how%20it%20works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400">
            Get started with automated trading in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-full">
                <div className="text-4xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 