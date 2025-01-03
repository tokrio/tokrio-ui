import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getReadData, IResponse } from '../contract/api';
import { TokrioLevelAbi } from '../abi/Abi';
import { config } from '../config/env';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { chainConfig } from '../WalletConfig';

const JarvisPage = () => {

  const { address } = useAccount();

  const [loading, setLoading] = React.useState(0);

  const defaultInfo = {
    currentLevel: 0,
    maxRobots: 1000,
    remainingRobots: 0,
    canClaim: false,
    claimStr: 'Unavailable'
  };

  const [jarvisInfo, setJarvisInfo] = React.useState(defaultInfo);


  useEffect(() => {
    getLevel();
  }, [address])

  const getLevel = async () => {
    let { data, code }: IResponse = await getReadData("getUserEquity", TokrioLevelAbi, config.SPONSOR, [address])
    if (code != 200) {
      toast.error("Please check your RPC.")
      return
    }

    let claimStatusRes: IResponse = await getReadData("checkRobotOwnership", TokrioLevelAbi, config.SPONSOR, [address])
    if (claimStatusRes.code != 200) {
      toast.error("Please check your RPC.")
      return
    }


    let robotRes: IResponse = await getReadData("getRobotStatus", TokrioLevelAbi, config.SPONSOR, [])
    if (robotRes.code != 200) {
      toast.error("Please check your RPC.")
      return
    }


    setJarvisInfo({
      currentLevel: Number(data[2].toString()),
      maxRobots: robotRes.data[0].toString(),
      remainingRobots: robotRes.data[2].toString(),
      canClaim: robotRes.data[3] && !claimStatusRes.data,
      claimStr: claimStatusRes.data ? 'Claimed' : (robotRes.data[3] ? 'Available' : 'Unavailable')

    })

  }

  const claimRobot = async () => {

    if (loading == 2) {
      return
    }

    setLoading(2);

    try {
      const hash = await writeContract(chainConfig, {
        address: config.SPONSOR as `0x${string}`,
        abi: TokrioLevelAbi,
        functionName: 'claimRobot',
        args: []
      });

      const approveData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (approveData.status && approveData.status.toString() == "success") {
        toast.success('Claim Robot successfully');
        getLevel();
        setLoading(1);
      } else {
        toast.error('Claim Robot Failed!');
        setLoading(0);
        return

      }
    } catch (error) {
      setLoading(0);
    }

  }

  return (
    <div className="min-h-screen">
      <Navbar showMenu={false} />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Jarvis AI Trading Robot</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Current Level</div>
              <div className="text-2xl font-bold text-white">{jarvisInfo.currentLevel}</div>
            </div>

            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Maximum Robots</div>
              <div className="text-2xl font-bold text-white">{jarvisInfo.maxRobots}</div>
            </div>

            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Remaining Slots</div>
              <div className="text-2xl font-bold text-white">{jarvisInfo.remainingRobots}</div>
            </div>

            <div className="bg-card-dark p-6 rounded-lg">
              <div className="text-gray-400">Claim Status</div>
              <div className={`text-2xl font-bold ${jarvisInfo.canClaim ? 'text-green-400' : 'text-red-400'}`}>
                {jarvisInfo.claimStr}
              </div>
            </div>
          </div>

          <button
            onClick={claimRobot}
            disabled={!jarvisInfo.canClaim || loading === 2}
            className="w-full px-6 py-3 rounded-lg font-medium cta-button disabled:bg-gray-600 text-gray-400 data-[jarvisInfo.canClaim]:cursor-not-allowed"
          >
            {loading === 2 ? 'Loading...' : 'Claim Jarvis Robot'}
          </button>

          <div className="mt-8 p-6 bg-card-dark rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Important Information</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Total available Jarvis robots: 1,000</li>
              <li>• Minimum requirement: Level 5 staking</li>
              <li>• Comprehensive AI trading capabilities including:</li>
              <ul className="ml-6 mt-2 space-y-1">
                <li>- Automated token selection</li>
                <li>- Position size management</li>
                <li>- Trade execution optimization</li>
              </ul>
              <li className="mt-4 text-yellow-400">
                Note: Access to Jarvis will be revoked if your level drops below 5 or if all robot slots are claimed,
                even if you meet the level requirement.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JarvisPage; 