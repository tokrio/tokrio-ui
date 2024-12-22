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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="common-button main-font transition-colors flex items-center duration-300"
            >

            
              <svg xmlns="http://www.w3.org/2000/svg" fill='rgb(255, 255, 255)' className='w-4 h-4 mr-2' focusable="false" viewBox="0 0 24 24" ><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"></path></svg>
              Watch Demo
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