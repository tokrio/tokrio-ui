import { motion } from "framer-motion";
import { CountUpAnimation } from "./CountUpAnimation";
import { useEffect, useState } from "react";
import { chainConfig } from "../WalletConfig";
import { config } from "../config/env";
import { TokrioStaking } from "../abi/Abi";
import { readContract } from "@wagmi/core";
import { getReadData } from "../contract/api";
import { availableMemory } from "process";
import BigNumber from "bignumber.js";

export function PoolData() {

    const [poolInfo, setPoolInfo] = useState({
        totalStaked: 0,
        totalRewards: 0,
        availableRewards: 0,
    });

    useEffect(() => {
        getRewardPoolInfo();
    }, [])

    const getRewardPoolInfo = async () => {

        const response = await getReadData('getRewardPoolInfo', TokrioStaking, config.STAKING, [])
        if (response.code == 200) {
            const info = {
                totalStaked: Number(new BigNumber(response.data.totalStaked.toString()).dividedBy(10 ** 18).toFixed(2)),
                totalRewards: Number(new BigNumber(response.data.totalBalance.toString()).dividedBy(10 ** 18).toFixed(2)),
                availableRewards: Number(new BigNumber(response.data.availableRewards.toString()).dividedBy(10 ** 18).toFixed(2)),
            }
            setPoolInfo(info);
        }
    }

    return <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-6 bg-card-dark"
        >
            <h3 className="text-xl font-semibold text-white mb-3 uppercase main-font">
                Total Rewards
            </h3>
            <CountUpAnimation end={poolInfo.totalRewards} suffix="" />

        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-card-dark"
        >
            <h3 className="text-lg font-semibold text-white mb-3 uppercase main-font">
                Total Staked
            </h3>
            <CountUpAnimation end={poolInfo.totalStaked} suffix="" />

        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-card-dark"
        >
            <h3 className="text-lg font-semibold text-white mb-3 uppercase main-font">
                Available Rewards
            </h3>
            <CountUpAnimation end={poolInfo.availableRewards} suffix="" />

        </motion.div>
    </div>

}

