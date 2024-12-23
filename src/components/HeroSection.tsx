import React from 'react';
import { motion } from 'framer-motion';
import MatrixRain from './MatrixRain';
import { api, tokenStorage } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { signMessage } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';

const HeroSection = () => {

  const navigate = useNavigate();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleLogin = async () => {

    if (!address) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (tokenStorage.getToken()) {
      navigate('/dashboard');
      return

    }

    let now = new Date().getTime()

    let message = `Welcome to Tokrio!\n\nClick to sign in and experience the AI-powered crypto trading ecosystem based on TAST (Trend Analysis & SuperTrend Technology).\n\nThis action will not initiate a blockchain transaction or incur any gas fees.\n\nWallet address:\n${(address as `0x${string}`).toLowerCase()}\n\nNonce:\n${now}`


    const sign = await signMessage(chainConfig, {
      message: message
    })



    try {
      // 使用指定的参数值登录
      const response = await api.login({
        walletAddress: address,
        timestamp: now,
        signature: sign
      });

      if (response.code === 200) {
        // 保存 token
        tokenStorage.setToken(response.body);
        // 跳转到 dashboard
        navigate('/dashboard');
      } else {
        console.error('Login failed:', response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleBuyToken = () => {
    // 跳转到指定的 DEX 链接
    window.open('https://pancakeswap.finance/swap?outputCurrency=0x3380eb9fE9242b4955ACFa019D495cDD64DfA764', '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto relative overflow-hidden">
      {/* <MatrixRain /> */}

      <div className="relative z-10 container my-44 md:my-52 mx-auto px-4">
        <div className=" text-center flex flex-col justify-center items-center">

          <h1 className="hero-text">
            <span className="text-primary uppercase text-4xl font-normal">T o k r i o</span>

          </h1>
          <div className="hero-text max-w-2xl font-medium uppercase text-3xl md:text-4xl mt-4">Where AI Meets Trading Excellence</div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 text-black mt-2 text-sm font-semibold main-font uppercase px-3 py-1 bg-white "
          >
            <div className='gradient-color1'>Welcome to the future of trading</div>
            
          </motion.div>
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
            <div className="text-2xl font-bold text-primary">
              TOKR Price: $0.5 USDT
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Market Cap: $500,000 USDT
            </div>
          </motion.div>

          <div className="flex space-x-4">
            <motion.button
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button main-font"
            >
              Start Trading
            </motion.button>
            <motion.button
              onClick={handleBuyToken}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="common-button main-font transition-colors flex items-center duration-300"
            >
              Buy TOKR
            </motion.button>
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