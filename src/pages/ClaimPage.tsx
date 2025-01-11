import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { readContract } from '@wagmi/core';
import { chainConfig } from '../WalletConfig';
import { config } from '../config/env';
import { TokrioVestingAbi } from '../abi/Abi';
import { useAccount } from 'wagmi';
import TokenDecimals from '../components/TokenDecimals';
import { formatDateUTC } from '../util/utils';
import toast from 'react-hot-toast';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { motion } from 'framer-motion';
import { flushSync } from 'react-dom';
import { getReadData } from '../contract/api';

const ClaimPage: React.FC = () => {

    const { address } = useAccount();
    const [claimList, setClaimList] = React.useState([]);
    const [scheduleIds, setScheduleIds] = React.useState([]);
    const [loading, setLoading] = React.useState(0);
    const [clickIndex, setClickIndex] = React.useState(0);
    const [open, setOpen] = React.useState(true);


    useEffect(() => {
        // Add logic to fetch data from blockchain
        if (address) {
            getClaimList();
        }

    }, [address]);

    const getClaimList = async () => {
        try {
            const list: any = await readContract(chainConfig, {
                address: config.TOKRIO_VESTING as `0x${string}`,
                abi: TokrioVestingAbi,
                functionName: 'getSchedulesByBeneficiary',
                args: [address]
            });
            setClaimList(list);
            if (list && list.length > 0) {
                setScheduleIds(list[0]);

            }
            console.log("list=", list)
        } catch (error) {
        }
    };

    const handleClaim = async () => {
        console.log(`Claim button clicked for item ${clickIndex}`);
        // Add claim logic here

        if (loading == 2) {
            return
        }

        setLoading(2);

        try {
            const hash = await writeContract(chainConfig, {
                address: config.TOKRIO_VESTING as `0x${string}`,
                abi: TokrioVestingAbi,
                functionName: 'claimTokens',
                args: [scheduleIds[clickIndex]]
            });

            const approveData: any = await waitForTransactionReceipt(chainConfig, {
                hash: hash
            })

            if (approveData.status && approveData.status.toString() == "success") {
                toast.success('Claim successfully');
                getClaimList();
                setLoading(1);
            } else {
                toast.error('Claim Failed!');
                setLoading(0);
                return

            }
        } catch (error) {
            toast.error('Claim Failed!');
            setLoading(0);
        }
    };

    return (
        <div>
            <Navbar />
            {scheduleIds && scheduleIds.length > 0 && <ClaimModal
                scheduleId={Number(scheduleIds[clickIndex] + "")}
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={handleClaim}
                loading={loading == 2}
            />}
            <div className="py-24 bg-[#111]/40 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="hero-text mb-4">Claim TOKR</h2>
                        <p className="text-gray-400">
                            {/* Detailed overview of benefits and requirements for each level */}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claim Count</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claim Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claimed Count</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claimList && scheduleIds && scheduleIds.length > 0 && scheduleIds.map((item, index) => (
                                    <tr key={item + ""} className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/30'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{formatDateUTC(Number(claimList[1][index] + "") * 1000)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{claimList[2][index] + ""}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white"><TokenDecimals amount={claimList[3][index] + ""} fixed={0} token={config.TOKEN} /> TOKR</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white"><TokenDecimals amount={claimList[5][index] + ""} fixed={0} token={config.TOKEN} /> TOKR</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{claimList[4][index] + ""}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            <button className="common-button" onClick={() => {
                                                flushSync(() => {
                                                    setClickIndex(index)
                                                })

                                                setOpen(true);

                                            }}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimPage;

interface claimModalProps {
    isOpen: boolean;
    scheduleId: number
    onClose: () => void;
    onSubmit: () => void;
    loading: boolean;
}

const ClaimModal: React.FC<claimModalProps> = ({ isOpen, onClose, onSubmit, loading, scheduleId }) => {

    const [info, setInfo] = useState<any>(null)

    // {
    //     startTime: 0,
    //     nextClaimTime: 0,
    //     totalPeriods: 0,
    //     amountPerPeriod: 0,
    //     claimablePeriods: 0,
    //     claimedPeriods: 0,
    //     totalAmount: 0
    // }

    useEffect(() => {

        if (isOpen) {
            getClaimInfo()
        }

    }, [isOpen, scheduleId]);

    const getClaimInfo = async () => {

       
            const info: any = await getReadData('getScheduleInfo', TokrioVestingAbi, config.TOKRIO_VESTING, [scheduleId])

            if(info.code != 200){
                return

            }
            setInfo(info.data)

        

    }

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-lg p-6 w-full max-w-md"
            >
                <h3 className="text-lg font-bold text-white mb-6 main-font text-center">Claim TOKR</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }} className="space-y-6">

                    {
                        info && <div className="space-y-2">
                            <div>Total Periods: {info[2] + ""}</div>
                            <div>Claimed Periods: {info[4] + ""}</div>
                            <div>Claimable Periods: {Number(info[6] + "")-Number(info[4] + "")}</div>
                            <div>Next Claim Time: {formatDateUTC(Number(info[7] + "") * 1000)}</div>

                        </div>
                    }


                    <div className="flex justify-center space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !info || Number(info[6] + "")-Number(info[4] + "") <= 0}
                            className="px-4 py-2 cta-button disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700"
                        >
                            {loading ? 'Claiming...' : 'Claim'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};