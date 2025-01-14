import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MatrixRain from './MatrixRain';
import { api, tokenStorage } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { signMessage } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import AnimationButton from './AnimationButton';
import { config } from '../config/env';
import { getReadData, IResponse } from '../contract/api';
import { erc20Abi } from 'viem';
import BigNumber from 'bignumber.js';

const HeroSection = () => {

  const navigate = useNavigate();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [unitPrice, setPrice] = useState<string>('???');

  const handleLogin = async () => {

    navigate('/dashboard');
  };

  const handleBuyToken = () => {
    // 跳转到指定的 DEX 链接
    // window.open('https://pancakeswap.finance/swap?outputCurrency=0x3380eb9fE9242b4955ACFa019D495cDD64DfA764', '_blank');
    window.open('https://lfj.gg/avalanche/trade', '_blank');
  };


  useEffect(() => {
    getPtice()
  }, [])

  const getPtice = async () => {
    try {
      //  const response = await api.getTokenPrice(`https://router.lfj.gg/v2/aggregator/routes/avalanche?amountIn=100000000000000000000&tokenIn=0x3a804d30959448f76b8305f019d7e6590ddfb7c2&tokenOut=${config.USDT_TOKEN}`);

      const response = await api.getTokenPrice({ url: `https://router.lfj.gg/v2/aggregator/routes/avalanche?amountIn=100000000000000000000&tokenIn=0x3a804d30959448f76b8305f019d7e6590ddfb7c2&tokenOut=${config.USDT_TOKEN}`, method: 'GET' });
      console.log('response', response)
      if (response && response.routes && response.routes[0] && response.routes[0].amountOut) {
        console.log('response.routes[0].amountOut', response.routes[0].amountOut)
        let data = response.routes[0]
        let token = data.tokenOut.address;
        let res: IResponse = await getReadData("decimals", erc20Abi, token, [])
        if (res.code == 200) {
          let decimal = Number(res.data.toString());
          let amountOut = new BigNumber(data.amountOut).dividedBy(10 ** decimal).toFixed(4).toString();
          setPrice(amountOut)
          console.log('amountOut', amountOut)
        }
      }
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
    }
  }


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
            <div className="text-base md:text-2xl font-bold text-primary main-font">
              TOKR Price: ${unitPrice} USDT
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Market Cap: ${unitPrice === "???"?"???": new BigNumber(unitPrice).multipliedBy(1000000000).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} USDT
            </div>
          </motion.div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            <AnimationButton onClick={() => {
              handleLogin()
            }}>
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