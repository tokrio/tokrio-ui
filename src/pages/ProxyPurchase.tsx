"use client";

import { Check, CheckCircle2, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { config } from '../config/env';
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { ProxyRegistryAbi } from '../abi/Abi';
import { chainConfig } from '../WalletConfig';
import { getReadData, IResponse } from '../contract/api';
import toast from 'react-hot-toast';
import { erc20Abi, maxUint256 } from 'viem';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { showErr } from '../util/utils';
import { useState } from "react";

export default function ProxyPurchase() {

    const [loading, setLoading] = useState(0);
    const { address } = useAccount();
    const [buyIndex, setBuyIndex] = useState(0);

    const features = [
        {
            icon: CheckCircle2,
            title: "Lifetime access to proxy platform",
        },
        {
            icon: CheckCircle2,
            title: "Real-time transaction monitoring",
        },
        {
            icon: CheckCircle2,
            title: "Transparent profit sharing system",
        },
        {
            icon: CheckCircle2,
            title: "Priority access to new features",
        },
        {
            icon: CheckCircle2,
            title: "Limited to 100 exclusive members",
        },
    ]

    const features1 = [
        {
            icon: CheckCircle2,
            title: "Monitor your real-time earnings",
        },
        {
            icon: CheckCircle2,
            title: "View transaction history",
        },
        {
            icon: CheckCircle2,
            title: "Access proxy settings and analytics",
        },
        {
            icon: CheckCircle2,
            title: "Receive instant fee payments directly to your connected walle",
        },
    ]

    const plans = [
        {
            name: "Basic Package",
            price: "1,000 USDT",
            features: [
                "Basic Trading Features",
                "Standard Support",
                "Basic Profit Share"
            ],
            recommended: false
        },
        {
            name: "Premium Package",
            price: "5,000 USDT",
            features: [
                "Advanced Trading Features",
                "Priority Support",
                "Advanced Analytics",
            ],
            recommended: true
        }
    ];

    const vipPlans = {
        name: "VIP Package",
        price: "10,000 USDT",
        features: [
            "All Premium Features",
            "Dedicated Server Required",
            "Custom Solutions",
        ],
        requirements: [
            "Dedicated server with at least 4GB RAM and 2 CPU cores",
            "24/7 server uptime (minimum 99% uptime required)",
            "Stable internet connection with at least 100Mbps bandwidth",
            "Ability to run our proxy client software",
            "Basic technical knowledge for server maintenance",
        ]
    }

    const buy = async (planIndex: number, price: number) => {
        if (loading == 2) {
            return
        }

        setLoading(2);



        try {

            let decimals = 6
            let { data, code }: IResponse = await getReadData("decimals", erc20Abi, config.USDT_TOKEN, [])

            if (code == 200) {
                decimals = data
            } else {
                setLoading(0);
                toast.error("Network error, try it again.")
                return
            }

            let realAmount = new BigNumber(price).multipliedBy(new BigNumber(10).pow(decimals)).toFixed(0).toString()

            const allowance: any = await readContract(chainConfig, {
                address: config.USDT_TOKEN as '0x',
                abi: erc20Abi,
                functionName: 'allowance',
                args: [address as `0x${string}`, config.ProxyRegistry as `0x${string}`],
            })

            if (new BigNumber(allowance.toString()).isLessThan(realAmount + "")) {

                const approveHash = await writeContract(chainConfig, {
                    address: config.USDT_TOKEN as '0x',
                    abi: erc20Abi,
                    functionName: 'approve',
                    // args: [config.SPONSOR as `0x${string}`, tAmount],
                    args: [config.ProxyRegistry as `0x${string}`, realAmount as any],
                    account: address
                })
                const approveData: any = await waitForTransactionReceipt(chainConfig, {
                    hash: approveHash
                })

                if (approveData.status && approveData.status.toString() == "success") {

                } else {
                    toast.error('Your wallet failed allowed assets deduction!');
                    setLoading(0);
                    return

                }
            }
            const hash = await writeContract(chainConfig, {
                address: config.ProxyRegistry as `0x${string}`,
                abi: ProxyRegistryAbi,
                functionName: 'purchaseProxyQualification',
                args: [planIndex]
            });

            const depositData: any = await waitForTransactionReceipt(chainConfig, {
                hash: hash
            })

            if (depositData.status && depositData.status.toString() == "success") {
                toast.success('Buy successfully');
                setLoading(1);
            } else {
                toast.error('Buy Failed!');
                setLoading(0);
                return

            }
        } catch (error) {
            console.error('Buy Failed:', error);
            toast.error(showErr(error));
            setLoading(0);
        }
    }

    return (
        <div className=" min-h-screen text-white p-4">
            <Navbar showMenu={false} />
            <div className="max-w-7xl my-24 bg-[#222] p-4 rounded-lg  mx-auto space-y-4">
                <h1 className="text-3xl font-bold my-6">Purchase Proxy</h1>
                <div className="border border-gray-600 p-3 rounded-lg">
                    <div>
                        <div className="text-base font-bold mb-3">Why We're Offering This Opportunity</div>
                        <div className="opacity-80 ">We're raising funds to accelerate our development process and expand our proxy network. This is a unique opportunity to become part of our ecosystem and earn passive income for life.</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        {features.map((plan, index) => (

                            <div key={index} className="flex items-center ">
                                <Check className="text-green-500 w-6 h-6 mr-2" />
                                <div className="text-white text-sm font-semibold">{plan.title}</div>
                            </div>

                        ))}
                    </div>
                </div>

                <div className="rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plans.map((plan, index) => (
                            <div key={index} className="border border-gray-600 p-4 rounded-lg">
                                <div className="text-lg text-amber-400 font-semibold mb-2">{plan.name}</div>
                                <div className="text-2xl font-bold mb-2">{plan.price}</div>
                                <div className="grid grid-cols-1 gap-2 mt-4">
                                    {plan.features.map((feature, featureIndex) => (

                                        <div key={index} className="flex items-center ">
                                            <Check className="text-green-500 w-6 h-6 mr-2" />
                                            <div className="text-white text-sm font-semibold">{feature}</div>
                                        </div>

                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setBuyIndex(index)
                                        if (index === 0) {
                                            buy(0, 1000)
                                        } else {
                                            buy(1, 5000)
                                        }

                                    }}
                                    className={`mt-4 px-4 py-3 font-bold text-sm rounded-lg text-black w-full bg-amber-400`}
                                >
                                    {loading === 2 && buyIndex === index ? 'Loading...' : 'Purchase'}
                                </button>

                            </div>
                        ))}

                    </div>
                </div>


                <div className="border border-gray-600 p-4 rounded-lg">
                    <div className="text-lg text-amber-400 font-semibold mb-2">{vipPlans.name}</div>
                    <div className="text-2xl font-bold mb-2">{vipPlans.price}</div>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                        {vipPlans.features.map((feature, index) => (

                            <div key={index} className="flex items-center ">
                                <Check className="text-green-500 w-6 h-6 mr-2" />
                                <div className="text-white text-sm font-semibold">{feature}</div>
                            </div>

                        ))}
                    </div>

                    <div>
                        <div className="font-bold mt-3">Requirements:</div>
                        {
                            vipPlans.requirements.map((requirement, index) => (

                                <div key={index} className="flex gap-2 items-center ">
                                    <div className="text-white/70 text-sm mt-2 font-semibold">· {requirement}</div>
                                </div>
                            ))
                        }
                    </div>

                    <button
                        // disabled
                        onClick={() => {
                            setBuyIndex(2)
                            buy(2, 10000)
                        }}
                        className={`mt-4 px-4  py-3 font-bold text-sm rounded-lg text-black w-full bg-amber-400`}
                    >
                        {loading === 2 && buyIndex === 2 ? 'Loading...' : 'Purchase'}
                    </button>

                </div>

                <div className="border border-gray-600 p-3 rounded-lg">
                    <div>
                        <div className="text-base font-bold mb-3">Payment Instructions</div>
                        <div className="opacity-80 ">After connecting your wallet and selecting a package, you will be directed to the payment process. Once payment is completed, you will automatically gain access to the Proxy Admin dashboard where you can:</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        {features1.map((plan, index) => (

                            <div key={index} className="flex items-start ">
                                <Check className="text-green-500 w-6 h-6 min-w-[24px] mr-2" />
                                <div className="text-white text-sm font-semibold break-words">{plan.title}</div>
                            </div>

                        ))}
                    </div>
                    <div className="mt-4 opacity-60">Your connected wallet address will be used as your login credentials for the Proxy Admin dashboard.</div>
                </div>

            </div>
        </div >
    );
}