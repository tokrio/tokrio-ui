import React, { useEffect } from 'react';
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
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { address, chainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [inviteCode, setInviteCode] = React.useState('');
  const [hasRegister, setHasRegister] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (localStorage.getItem('code')) {
      setInviteCode(localStorage.getItem('code') as string)
    }
    if (address) {
      getLoginInfo()
    }
  }, [address])

  // get login info from server if user is login

  const getLoginInfo = async () => {
    const response = await api.isRegister(address);

    if (response.code === 200) {
      setHasRegister(response.body.registered)
    }

  }


  const handleLogin = async () => {
    if (!address) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }
    console.log("chainId==",chainConfig.chains)
    if (chainId !== chainConfig.chains[0].id) {
      switchChain(chainConfig, { chainId: Number(chainConfig.chains[0].id) })
    }

    if (tokenStorage.getToken()) {
      navigate('/dashboard');
      return

    }

   



    try {

      if(loading){
        return
      }
      setLoading(true)
      let now = new Date().getTime()

      let message = `Welcome to Tokrio!\n\nClick to sign in and experience the AI-powered crypto trading ecosystem based on TAST (Trend Analysis & SuperTrend Technology).\n\nThis action will not initiate a blockchain transaction or incur any gas fees.\n\nWallet address:\n${(address as `0x${string}`).toLowerCase()}\n\nNonce:\n${now}`
  
  
      const sign = await signMessage(chainConfig, {
        message: message
      })

      let param: any = {
        walletAddress: address,
        timestamp: now,
        signature: sign,
        inviteCode: hasRegister ? "ABC123X" : inviteCode,
      }


      const response = await api.login(param);

      if (response.code === 200) {
        tokenStorage.setToken(response.body);
        navigate('/dashboard');
      } else {
        toast.error(response.message ?? 'network error.')
        console.error('Login failed:', response.message);
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
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
            <Link to={"/"} ><FaRegTimesCircle className=' text-2xl' /></Link>
          </div>
          <h2 className="mt-6 main-font text-center text-3xl font-extrabold text-white ">
            Welcome to Tokrio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            AI-Powered Crypto Trading Platform
          </p>
        </div>

        {!hasRegister && address && <div>
          <div>Enter invitation code:</div>
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            type="text"
            placeholder="Enter invitation code"
            className="w-full px-4 py-3 mt-4 bg-[#222] text-white rounded-md focus:outline-none focus:ring focus:border-gray-300" />
        </div>}

        <div className="mt-8 flex justify-center">
          <AnimationButton
            onClick={handleLogin}
          >
            { loading? ' Loading...': (address ? 'Login with Wallet' : 'Connect Wallet') }
          </AnimationButton>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 