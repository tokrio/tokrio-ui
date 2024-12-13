import React from 'react';
import { motion } from 'framer-motion';

interface PricingTier {
  name: string;
  price: number;
  period: string;
  tokenAllocation: number;
  features: string[];
  recommended?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    period: 'Forever',
    tokenAllocation: 0,
    features: [
      'AI Trading Algorithm',
      'Basic Analytics',
      '60% Trading Rewards',
      '1 Trading Pair',
      'Community Support'
    ]
  },
  {
    name: 'Quarterly',
    price: 256,
    period: '3 Months',
    tokenAllocation: 2,
    features: [
      'Everything in Free',
      'Priority Algorithm Access',
      '60% Trading Rewards',
      '3 Trading Pairs',
      'Email Support'
    ]
  },
  {
    name: 'Semi-Annual',
    price: 512,
    period: '6 Months',
    tokenAllocation: 6,
    features: [
      'Everything in Quarterly',
      'Priority Algorithm Access',
      '60% Trading Rewards',
      '5 Trading Pairs',
      'Priority Support'
    ],
    recommended: true
  },
  {
    name: 'Annual',
    price: 1024,
    period: '1 Year',
    tokenAllocation: 20,
    features: [
      'Everything in Semi-Annual',
      'Priority Algorithm Access',
      '60% Trading Rewards',
      'Unlimited Trading Pairs',
      'VIP Support'
    ]
  },
  {
    name: 'Lifetime',
    price: 3888,
    period: 'Lifetime',
    tokenAllocation: 50,
    features: [
      'Everything in Annual',
      'Highest Algorithm Priority',
      '60% Trading Rewards',
      'Unlimited Everything',
      '24/7 VIP Support'
    ]
  }
];

const PricingSection = () => {
  return (
    <div className="bg-gray-900 py-24" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400">
            Choose the plan that best fits your trading needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                tier.recommended 
                  ? 'bg-primary/10 border-2 border-primary' 
                  : 'bg-gray-800 border border-gray-700'
              } p-8 shadow-xl flex flex-col`}
            >
              {tier.recommended && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline text-white">
                  <span className="text-2xl font-semibold">$</span>
                  <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-gray-400">USDT</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{tier.period}</p>
              </div>

              <div className="space-y-4 flex-grow">
                <div className="flex items-center">
                  <span className="text-primary font-semibold">
                    {tier.tokenAllocation} Tokens
                  </span>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`mt-8 w-full rounded-lg px-4 py-2 text-center font-medium ${
                  tier.recommended
                    ? 'bg-primary hover:bg-primary-dark text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                } transition-colors duration-200`}
              >
                {tier.price === 0 ? 'Start Free' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400">
            All plans include algorithm priority access and 60% trading rewards
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Prices in USDT • Cancel anytime • Trading rewards are distributed daily
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection; 