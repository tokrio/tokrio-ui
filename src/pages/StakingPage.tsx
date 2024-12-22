import React, { useState, useEffect } from 'react';
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

interface StakingInfo {
  stakedAmount: bigint;
  stakingStartTime: bigint;
  pendingReward: bigint;
  level: bigint;
}

interface LevelInfo {
  level: bigint;
  currentAmount: bigint;
  nextLevelRequirement: bigint;
}

const StakingPage = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [releaseRate, setReleaseRate] = useState<bigint>(BigInt(0));
  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0));
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));


  // 获取质押信息
  const fetchStakingInfo = async () => {
    if (!address) return;
    try {
      const info1: any = await readContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'pendingRewards',
        args: [address]
      });
      console.log("info1:",info1)
      const info: any = await readContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'getStakingInfo',
        args: [address]
      });
      let stakeInfo = {
        stakedAmount: info[0],
        stakingStartTime: info[1],
        pendingReward: info[2],
        level: info[3]
      }
      setStakingInfo(stakeInfo as StakingInfo);

      const level = await readContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'getStakingLevel',
        args: [address]
      });
      console.log("level=",level)
      let levelInfo = {
        level: info[0],
        currentAmount: info[1],
        nextLevelRequirement: info[2]
      }
      setLevelInfo(levelInfo as LevelInfo);

      const rate = await readContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'getCurrentReleaseRate'
      });
      setReleaseRate(rate as bigint);

      const total = await readContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'getTotalStaked'
      });
      setTotalStaked(total as bigint);

      const tokenAllowance = await readContract(chainConfig, {
        address: config.TOKEN as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, config.STAKING as `0x${string}`]
      });
      setAllowance(tokenAllowance as bigint);
    } catch (error) {
      console.error('Error fetching staking info:', error);
    }
  };

  useEffect(() => {
    fetchStakingInfo();
    const interval = setInterval(fetchStakingInfo, 15000);
    return () => clearInterval(interval);
  }, [address]);

  // 计算年化收益率
  const calculateAPR = () => {
    if (!totalStaked || totalStaked === BigInt(0)) return 0;
    const yearlyRewards = releaseRate * BigInt(365 * 24 * 60 * 60);
    return Number(yearlyRewards * BigInt(100) / totalStaked);
  };

  // 授权
  const handleApprove = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
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

  // 质押
  const handleStake = async () => {
    if (!address || !stakeAmount) return;
    setLoading(true);
    try {
      const amount = BigInt(new BigNumber(stakeAmount).multipliedBy(1e18).toString());
      const hash = await writeContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'stake',
        args: [amount]
      });
      await waitForTransactionReceipt(chainConfig, { hash });
      await fetchStakingInfo();
      setStakeAmount('');
      toast.success('Staking successful');
    } catch (error) {
      console.error('Error staking:', error);
      toast.error('Staking failed');
    } finally {
      setLoading(false);
    }
  };

  // 解除质押
  const handleUnstake = async () => {
    if (!address || !unstakeAmount) return;
    setLoading(true);
    try {
      const amount = BigInt(new BigNumber(unstakeAmount).multipliedBy(1e18).toString());
      console.log("amount",amount)
      const hash = await writeContract(chainConfig, {
        address: config.STAKING as `0x${string}`,
        abi: TokrioStaking,
        functionName: 'unstake',
        args: [amount]
      });
      await waitForTransactionReceipt(chainConfig, { hash });
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

  // 领取奖励
  const handleClaim = async () => {
    if (!address) return;
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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white main-font mb-4">
            Staking & Rewards
          </h2>
          <p className="text-xl text-gray-400">
            Stake TOKR tokens to earn rewards and increase your level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Staking Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Your Staking Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Staked Amount:</span>
                <span className="text-white font-medium">
                  {stakingInfo && stakingInfo.stakedAmount ? new BigNumber(stakingInfo.stakedAmount.toString()).div(1e18).toFixed(2) : '0'} TOKR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending Rewards:</span>
                <span className="text-primary font-medium">
                  {stakingInfo && stakingInfo.pendingReward ? new BigNumber(stakingInfo.pendingReward.toString()).div(1e18).toFixed(4) : '0'} TOKR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Level:</span>
                <span className="text-white font-medium">Level {stakingInfo?.level?.toString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Level At:</span>
                <span className="text-white font-medium">
                  {levelInfo && levelInfo.nextLevelRequirement ? new BigNumber(levelInfo.nextLevelRequirement.toString()).div(1e18).toFixed(0) : '0'} TOKR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current APR:</span>
                <span className="text-green-400 font-bolder">{calculateAPR()}%</span>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Stake Amount
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Enter amount to stake"
                  />
                  {allowance === BigInt(0) ? (
                    <button
                      onClick={handleApprove}
                      disabled={loading}
                      className="px-4 py-2 cta-button disabled:opacity-50"
                    >
                      {loading ? 'Approving...' : 'Approve'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStake}
                      disabled={loading || !stakeAmount}
                      className="px-4 py-2 cta-button disabled:opacity-50"
                    >
                      {loading ? 'Staking...' : 'Stake'}
                    </button>
                  )}
                </div>
              </div>

              {/* Unstake Form */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Unstake Amount
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Enter amount to unstake"
                  />
                  <button
                    onClick={handleUnstake}
                    disabled={loading || !unstakeAmount}
                    className="px-4 py-2 cta-button disabled:opacity-50"
                  >
                    {loading ? 'Unstaking...' : 'Unstake'}
                  </button>
                </div>
              </div>

              {/* Claim Rewards */}
              <button
                onClick={handleClaim}
                // disabled={loading || !stakingInfo?.pendingReward || stakingInfo.pendingReward === BigInt(0)}
                className="w-full px-4 py-2 cta-button disabled:opacity-50"
              >
                {loading ? 'Claiming...' : 'Claim Rewards'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Level Benefits */}
        <div className="py-16">
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
        </div>
      </div>
    </div>
  );
};

export default StakingPage; 