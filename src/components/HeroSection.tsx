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
    <div className="min-h-screen bg-black relative overflow-hidden">
      <MatrixRain />

      <div className="relative z-10 container mx-auto px-4 h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left pr-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-primary font-mono"
            >
              Welcome to the future of trading
            </motion.div>
            <h1 className="hero-text">
              <span className="text-primary">Tokrio</span>
              <span className="block text-3xl md:text-5xl mt-4">Where AI Meets Trading Excellence</span>
            </h1>
            <p className="hero-subtext">
              Experience the next evolution in cryptocurrency trading with our AI-driven algorithms that analyze trends, predict movements, and execute trades with precision.
            </p>
            <div className="flex space-x-4">
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button"
              >
                Start Trading
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          <div className="hidden md:block relative h-full">
            {/* Matrix rain will show through this space */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 