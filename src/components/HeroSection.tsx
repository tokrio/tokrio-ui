import React from 'react';
import { motion } from 'framer-motion';
import MatrixRain from './MatrixRain';
import { api, tokenStorage } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { signMessage } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import AnimationButton from './AnimationButton';

const HeroSection = () => {

  const navigate = useNavigate();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleLogin = async () => {

    navigate('/dashboard');
  };

  const handleBuyToken = () => {
    // 跳转到指定的 DEX 链接
    window.open('https://pancakeswap.finance/swap?outputCurrency=0x3380eb9fE9242b4955ACFa019D495cDD64DfA764', '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto relative overflow-hidden">
      {/* <MatrixRain /> */}

      <div className="relative z-10 container my-36 md:my-40 mx-auto px-4">
        <div className=" text-center flex flex-col justify-center items-center">

          <h1 className="hero-text">
            <span className="text-primary uppercase text-4xl btn-shine">T o k r i o</span>

          </h1>
          <div className="hero-text max-w-2xl font-medium uppercase text-3xl md:text-4xl mt-4 move-text">Where AI Meets<br /> Trading Excellence<br />Welcome to the future of trading</div>
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 text-black mt-2 text-sm font-semibold main-font uppercase px-3 py-1 bg-white "
          >
            <div className='gradient-color1'>Welcome to the future of trading</div>

          </motion.div> */}
          <div className="hero-subtext max-w-xl ">
            Experience the next evolution in cryptocurrency trading with our AI-driven algorithms that analyze trends, predict movements, and execute trades with precision.
          </div>

          {/* 添加价格显示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 mt-4"
          >
            <div className="text-2xl font-bold text-primary main-font">
              TOKR Price: $0.5 USDT
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Market Cap: $500,000 USDT
            </div>
          </motion.div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            <AnimationButton onClick={() => { 
              handleLogin() }}>
              Trading NOW
            </AnimationButton>
            <AnimationButton onClick={handleBuyToken}>
              Buy TOKR
            </AnimationButton>
          </div>


          <div className="hidden md:block relative h-full">
            {/* Matrix rain will show through this space */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 