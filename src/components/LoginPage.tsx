import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, tokenStorage } from '../services/api';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { signMessage } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import AnimationButton from './AnimationButton';
import { switchChain } from '@wagmi/core'
import { FaRegTimesCircle, FaWindowClose } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { address,chainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  

  const handleLogin = async () => {
    if (!address) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (chainId !== chainConfig.chains[0].id) {
      switchChain(chainConfig,{ chainId: Number(chainConfig.chains[0].id)})
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
      const response = await api.login({
        walletAddress: address,
        timestamp: now,
        signature: sign
      });

      if (response.code === 200) {
        tokenStorage.setToken(response.body);
        navigate('/dashboard');
      } else {
        console.error('Login failed:', response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-[#111] border border-[#222] p-8 rounded-xl"
      >
        <div>
          <div className='flex justify-end'>
            <Link to={"/"} ><FaRegTimesCircle className=' text-2xl'  /></Link>
          </div>
          <h2 className="mt-6 main-font text-center text-3xl font-extrabold text-white ">
            Welcome to Tokrio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            AI-Powered Crypto Trading Platform
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <AnimationButton
            onClick={handleLogin}
          >
            Login with Wallet
          </AnimationButton>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 