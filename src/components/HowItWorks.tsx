import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimationButton from './AnimationButton';

const Guidelines = () => {
  const steps = [
    {
      number: "01",
      title: "Buy TOKR",
      description: "Purchase TOKR tokens on PancakeSwap to get started",
      link: "https://pancakeswap.finance/swap?outputCurrency=0x3380eb9fE9242b4955ACFa019D495cDD64DfA764",
      buttonText: "Buy Now"
    },
    {
      number: "02",
      title: "Stake & Earn",
      description: "Stake TOKR tokens to access features and earn rewards",
      link: "/staking",
      buttonText: "Stake Now"
    },
    {
      number: "03",
      title: "Configure Trading",
      description: "Login and select your preferred trading pairs",
      link: "/dashboard",
      buttonText: "Dashboard"
    },
    {
      number: "04",
      title: "Auto Trading",
      description: "Let our AI algorithms handle your trades automatically",
      link: "/dashboard",
      buttonText: "Start Trading"
    }
  ];

  return (
    <div className="py-24 bg-[#111]/40" id="guidelines">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">
            Guidelines
          </h2>
          <p className=" text-gray-400">
            Follow these steps to start your AI trading journey
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
              <div className="bg-card-dark h-full flex flex-col">
                <div className="text-2xl w-6 h-6 bg-[#FFA41C] main-font font-extrabold text-[#fff] mb-4">
                  {step.number}
                </div>
                <h3 className="text-base uppercase main-font font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 mb-4 flex-grow">
                  {step.description}
                </p>
                <div className='flex justify-center'>
                  {step.link.startsWith('http') ? (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <AnimationButton>{step.buttonText}</AnimationButton>
                    </a>
                  ) : (
                    <Link
                      to={step.link}
                    >
                      <AnimationButton>{step.buttonText}</AnimationButton>
                    </Link>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-7 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default Guidelines; 