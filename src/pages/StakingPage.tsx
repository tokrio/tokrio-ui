import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import { config } from '../config/env';
import { TokrioStaking } from '../abi/Abi';
import { erc20Abi } from 'viem';
import toast from 'react-hot-toast';
import BigNumber from 'bignumber.js';
import Navbar from '../components/Navbar';
import { type ReadContractReturnType } from '@wagmi/core'
import TokenBalance from '../components/TokenBalance';
import { fetchBalanceObj, getReadData } from '../contract/api';
import TokenName from '../components/TokenName';
import { PoolData } from '../components/PoolData';
import { maxUint256 } from '../config/constant';

interface StakingInfo {
  stakedAmount: bigint;
  userStaked: bigint;
  pendingReward: bigint
}

interface LevelInfo {
  level: bigint;
  currentAmount: bigint;
  nextLevelRequirement: bigint;
}

const StakingPage = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [currentAPY, setCurrentAPY] = useState<string>("0");
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [unstakeFee, setUnstakeFee] = useState<string>("1");
  const [clickType, setClickType] = useState<number>(-1);

  const getUnstakeFee = async () => {
    try {
      const fee: any = await readContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'unstakeFee',
        args: []
      });
      setUnstakeFee(new BigNumber(fee.toString()).dividedBy(100).toString())
      console.log("fee=", fee)
    } catch (error) {
    }
  };

  useMemo(() => {
    getUnstakeFee()
  }, [])







  // stake info
  const fetchStakingInfo = async () => {
    if (!address) return;
    try {
      setIsRefresh(!isRefresh)
      const tokenAllowance = await readContract(chainConfig, {
        address: config.TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, config.STAKING as `0x${string}`]
      });
      console.log("tokenAllowance=", tokenAllowance)
      setAllowance(tokenAllowance as bigint);

      const currentAPY: any = await getReadData('getCurrentAPY', TokrioStaking, config.STAKING, [])
      if (currentAPY.code == 200) {
        setCurrentAPY(new BigNumber(currentAPY.data).dividedBy(100).toFixed(0).toString())
      }


      const info: any = await readContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'getUserStakingInfo',
        args: [address]
      });
      console.log("getStakingInfo:", info)
      let stakeInfo = {
        pendingReward: info[1],
        userStaked: info[0],
      }
      setStakingInfo(stakeInfo as StakingInfo);


    } catch (error) {
      console.error('Error fetching staking info:', error);
    }
  };

  useEffect(() => {
    setClickType(-1)
    fetchStakingInfo();
    const interval = setInterval(fetchStakingInfo, 15000);
    return () => clearInterval(interval);
  }, [address]);

  // approve
  const handleApprove = async () => {
    if (!address) return;
    setClickType(1)
    setLoading(true);
    try {
      const amount = BigInt(new BigNumber(stakeAmount).multipliedBy(10 ** 18).toFixed(0).toString());
      const hash = await writeContract(chainConfig, {
        address: config.TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [config.STAKING as `0x${string}`, maxUint256]
      });
      await waitForTransactionReceipt(chainConfig, { hash });
      await fetchStakingInfo();
      toast.success('Approval successful');
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('Approval failed');
    } finally {
      setLoading(false);
    }
  };

 
  const handleStake = async () => {
    if (!address || !stakeAmount) return;
    setClickType(2)
    setLoading(true);
    try {
      const balanceObj = await fetchBalanceObj(address, config.TOKEN)
      if (new BigNumber(balanceObj.formatted).isLessThan(stakeAmount)) {
        toast.error('Insufficient token balance!');
        setLoading(false);
        return
      }
      const amount = BigInt(new BigNumber(stakeAmount).multipliedBy(10 ** balanceObj.decimals).toFixed(0).toString());

      const allowance: any = await readContract(chainConfig, {
        address: config.TOKEN as '0x',
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, config.STAKING as `0x${string}`],
      })


      if (new BigNumber(allowance.toString()).isLessThan(amount + "")) {

        const hash = await writeContract(chainConfig, {
          address: config.TOKEN as '0x',
          abi: erc20Abi,
          functionName: 'approve',
          // args: [config.STAKING as `0x${string}`, amount],
          args: [config.STAKING as `0x${string}`, maxUint256],
          account: address
        })
        const approveData: any = await waitForTransactionReceipt(chainConfig, {
          hash: hash
        })

        if (approveData.status && approveData.status.toString() == "success") {

        } else {
          toast.error('Your wallet failed approved.');
          setLoading(false);
          return

        }

      }


      const hash = await writeContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'stake',
        args: [amount]
      });
      const response = await waitForTransactionReceipt(chainConfig, { hash });
      if (response.status && response.status.toString() == "success") {
        fetchStakingInfo();
        setStakeAmount('');
        toast.success('Staking successful');
      } else {
        toast.error('Staking failed.');
        setLoading(false);
        return

      }

    } catch (error) {
      console.error('Error staking:', error);
      toast.error('Staking failed');
    } finally {
      setLoading(false);
    }
  };

  
  const handleUnstake = async () => {
    if (!address || !unstakeAmount) return;

    const balanceObj = await fetchBalanceObj(address, config.LEVEL_TOKEN)
    if (new BigNumber(balanceObj.formatted).isLessThan(unstakeAmount)) {
      toast.error(`Insufficient ${balanceObj.symbol} balance!`);
      setLoading(false);
      return
    }
    const amount = BigInt(new BigNumber(unstakeAmount).multipliedBy(10 ** balanceObj.decimals).toFixed(0).toString());

    const allowance: any = await readContract(chainConfig, {
      address: config.LEVEL_TOKEN as '0x',
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address as `0x${string}`, config.STAKING as `0x${string}`],
    })


    if (new BigNumber(allowance.toString()).isLessThan(amount + "")) {

      const hash = await writeContract(chainConfig, {
        address: config.LEVEL_TOKEN as '0x',
        abi: erc20Abi,
        functionName: 'approve',
        // args: [config.STAKING as `0x${string}`, amount],
        args: [config.STAKING as `0x${string}`, maxUint256],
        account: address
      })
      const approveData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (approveData.status && approveData.status.toString() == "success") {

      } else {
        toast.error('Your wallet failed approved.');
        setLoading(false);
        return

      }

    }

    setClickType(3)
    setLoading(true);
    try {
      const amount = BigInt(new BigNumber(unstakeAmount).multipliedBy(1e18).toString());
      console.log("amount", amount)
      const hash = await writeContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'unstake',
        args: [amount]
      });
      let response = await waitForTransactionReceipt(chainConfig, { hash });
      if (response.status && response.status.toString() == "success") {
        fetchStakingInfo();
        setStakeAmount('');
        toast.success('Unstaking successful');
      } else {
        toast.error('Unstaking failed.');
        setLoading(false);
        return

      }

      await fetchStakingInfo();
      setUnstakeAmount('');
      toast.success('Unstaking successful');
    } catch (error) {
      console.error('Error unstaking:', error);
      toast.error('Unstaking failed');
    } finally {
      setLoading(false);
    }
  };

 
  const handleClaim = async () => {
    if (!address) return;
    setClickType(4)
    setLoading(true);
    try {
      const hash = await writeContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'claimRewards'
      });
      await waitForTransactionReceipt(chainConfig, { hash });
      await fetchStakingInfo();
      toast.success('Rewards claimed');
    } catch (error) {
      console.error('Error claiming:', error);
      toast.error('Claiming failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar showMenu={false} />
      <div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white main-font mb-4">
            Staking & Rewards
          </h2>
          <p className="text-lg text-gray-400">
            Stake TOKR tokens to earn rewards and increase your level
          </p>
        </div>

        <PoolData currentAPY={currentAPY} />

        <div className="grid grid-cols-1 mb-20 mt-5 md:grid-cols-2 gap-8">
          {/* Staking Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Your Staking Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Your Staked:</span>
                <span className="text-white font-medium">
                  {stakingInfo && stakingInfo.userStaked ? new BigNumber(stakingInfo.userStaked.toString()).div(1e18).toFixed(2) : '0'} TOKR
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Pending Rewards:</span>
                <span className="text-primary font-medium">
                  {stakingInfo && stakingInfo.pendingReward ? new BigNumber(stakingInfo.pendingReward.toString()).div(1e18).toFixed(4) : '0'} TOKR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400"><TokenName address={config.TOKEN} /> Balance:</span>
                <span className="text-white font-medium">
                  <TokenBalance isLoading={isRefresh} token={config.TOKEN} decimalPlaces={0} />
                  <span>  </span>
                  <TokenName address={config.TOKEN} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Certificate Balance:</span>
                <span className="text-white font-medium">
                  <TokenBalance isLoading={isRefresh} token={config.LEVEL_TOKEN} decimalPlaces={0} />
                  <span>  </span>
                  <TokenName address={config.LEVEL_TOKEN} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current APY:</span>
                <span className="text-green-400 font-bolder">{currentAPY}%</span>
              </div>
            </div>
          </motion.div>

          {/* Staking Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Staking Actions</h3>
            <div className="space-y-6">
              {/* Stake Form */}
              <div>
                <label className="block font-medium text-gray-400 mb-2">
                  Stake Amount
                </label>
                <div className="flex space-x-0 md:space-x-2">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1 bg-black/20 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Enter amount to stake"
                  />
                  {allowance === BigInt(0) ? (
                    <button
                      onClick={handleApprove}
                      disabled={loading}
                      className="px-4 py-2 cta-button disabled:opacity-50"
                    >
                      {loading && clickType == 1 ? 'Approving...' : 'Approve'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStake}
                      disabled={loading || !stakeAmount}
                      className="px-4 py-2 cta-button disabled:opacity-50"
                    >
                      {loading && clickType == 2 ? 'Staking...' : 'Stake'}
                    </button>
                  )}
                </div>
              </div>
              <span className='font-normal text-gray-500 text-xs'>*After staking, you can obtain the same number of vouchers
                (<span className=' font-bold'>{stakeAmount} <TokenName address={config.LEVEL_TOKEN} /></span>) for upgrades or sponsors.</span>

              {/* Unstake Form */}
              <div>
                <label className="block font-medium text-gray-400 mb-2">
                  Unstake Amount
                </label>
                <div className="flex space-x-0 md:space-x-2">
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="flex-1 bg-black/20 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Enter amount to unstake"
                  />

                  <button
                    onClick={handleUnstake}
                    disabled={loading || !unstakeAmount}
                    className="px-4 py-2 cta-button disabled:opacity-50"
                  >
                    {loading && clickType == 3 ? 'Unstaking...' : 'Unstake'}
                  </button>
                </div>
              </div>

              {/* Claim Rewards */}
              <span className=' font-normal text-gray-500 text-xs'>* {unstakeFee.toString()} % of unstake amount will be destroyed.</span>
              <button
                onClick={handleClaim}
                // disabled={loading || !stakingInfo?.pendingReward || stakingInfo.pendingReward === BigInt(0)}
                className="w-full px-4 py-2 cta-button disabled:opacity-50"
              >
                {loading && clickType == 4 ? 'Claiming...' : 'Claim Rewards'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Level Benefits */}
        {/* <div className="py-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Level Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((level) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: level * 0.1 }}
                className="bg-card rounded-lg p-6 border border-gray-700"
              >
                <div className="text-2xl font-bold text-primary mb-4">Level {level}</div>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-[#FFA41C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {level === 1 && 'Basic trading features'}
                    {level === 2 && 'Advanced trading strategies'}
                    {level === 3 && 'Premium features access'}
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-[#FFA41C] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {level === 1 && 'Standard support'}
                    {level === 2 && 'Priority support'}
                    {level === 3 && '24/7 VIP support'}
                  </li>
                </ul>
              </motion.div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default StakingPage;



