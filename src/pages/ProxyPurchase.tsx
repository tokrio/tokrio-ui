import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRobot, faServer, faInfinity, faCheck, faHandshake,
    faClock, faWifi, faCode, faTools, faChartLine,
    faHistory, faCog, faWallet
} from '@fortawesome/free-solid-svg-icons';
import { config } from '../config/env';
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { ProxyRegistryAbi } from '../abi/Abi';
import { chainConfig } from '../WalletConfig';
import { getReadData, IResponse } from '../contract/api';
import toast from 'react-hot-toast';
import { erc20Abi, maxUint256 } from 'viem';
import BigNumber from 'bignumber.js';
import { showErr } from '../util/utils';

interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    features: string[];
    isComingSoon?: boolean;
}

const packages: Package[] = [
    {
        id: 0,
        name: 'Basic Package',
        description: 'Perfect for beginners',
        price: 1000,
        features: [
            'Basic Trading Features',
            'Standard Support',
            'Basic Analytics'
        ]
    },
    {
        id: 1,
        name: 'Premium Package',
        description: 'For serious traders',
        price: 5000,
        features: [
            'Advanced Trading Features',
            'Priority Support',
            'Advanced Analytics'
        ]
    },
    {
        id: 2,
        name: 'VIP Package',
        description: 'For institutional clients',
        price: 10000,
        features: [
            'All Premium Features',
            'Dedicated Server Required',
            'Custom Solutions'
        ],
        isComingSoon: true
    }
];

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPackage: Package | null;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, selectedPackage }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { address } = useAccount();
    const [loading, setLoading] = useState(0);
    const [buyIndex, setBuyIndex] = useState(0);
    const [code, setCode] = React.useState('');

    if (!isOpen || !selectedPackage) return null;

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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg max-w-lg w-full m-4 p-6">
                <h2 className="text-xl font-bold mb-4">Confirm Purchase</h2>

                <div className="mb-4">
                    <p className="text-gray-400 mb-2">Connected Wallet:</p>
                    <div className="bg-black/20 p-3 rounded-lg">
                        <code className="text-sm break-all">{address || 'Please Connect Wallet'}</code>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-400 mb-2">Selected Package:</p>
                    <p className="font-medium">{selectedPackage.name} - {selectedPackage.price} USDT</p>
                </div>

                <div className="mb-4">
                    <p className="text-gray-400 mb-2">Package Benefits:</p>
                    <div className="bg-black/20 p-3 rounded-lg">
                        <ul className="space-y-2 text-sm">
                            {selectedPackage.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-400 mr-2" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* <div>
                    <div className='opacity-60'>Referral Code (Optional)</div>
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.trim())}
                        type="text"
                        placeholder="Enter Referral Code"
                        className="w-full my-2 border border-gray-600 px-4 py-3 mt-4 bg-[#222] text-white rounded-md focus:outline-none focus:ring focus:border-gray-300" />
                    <div className='text-amber-400'>* Enter a referral code to get additional benefits</div>

                </div> */}

                <div className="my-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="rounded text-primary checked:bg-amber-400 w-5 h-5"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <span className="text-sm text-gray-400">
                            I agree to the <a target='_blank' href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a target='_blank' href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                        </span>
                    </label>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setBuyIndex(selectedPackage.id)
                            buy(selectedPackage.id, selectedPackage.price)
                        }}
                        className={`bg-amber-400 text-black px-4 py-2 rounded-lg ${!termsAccepted && 'opacity-50 cursor-not-allowed'}`}
                        disabled={!termsAccepted}
                    >
                        {loading === 2 && buyIndex === selectedPackage.id ? 'Loading...' : 'Confirm Purchase'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProxyPurchasePage: React.FC = () => {
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

    return (
        <div className="bg-[#121212] mt-20 min-h-screen text-white">
            <Navbar showMenu={false} />

            <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Earn Lifetime Passive Income with Institutional-Grade AI Infrastructure
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Power the next generation of AI trading. Limited to 100 exclusive members.
                    </p>
                </div>

                {/* Why Join Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-[#1E1E1E] rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mr-4">
                                <FontAwesomeIcon icon={faRobot} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">AI-Powered, Real Results</h3>
                                <p className="text-gray-400">
                                    Our proxy network is integrated with Tokrio's bidirectional LSTM-based trading model.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E1E1E] rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mr-4">
                                <FontAwesomeIcon icon={faServer} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Institutional Infrastructure</h3>
                                <p className="text-gray-400">
                                    Join a secure, high-speed trading backbone built for consistent performance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E1E1E] rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mr-4">
                                <FontAwesomeIcon icon={faInfinity} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Lifetime Access</h3>
                                <p className="text-gray-400">
                                    Once you're in - you're in for good. Enjoy lifetime platform access.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Packages Section */}
                <div className="bg-[#1E1E1E] rounded-lg p-6 mb-12">
                    <h2 className="text-2xl font-bold mb-6">Available Packages</h2>

                    {packages.map((pkg, index) => (
                        <div key={index} className="border-b border-gray-800 last:border-0 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                                    <p className="text-gray-400">{pkg.description}</p>
                                </div>
                                <div className="space-y-2">
                                    {pkg.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center space-x-3">
                                            <FontAwesomeIcon icon={faCheck} className="text-green-400" />
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold mb-2">{pkg.price} USDT</div>
                                    <button
                                        className={`bg-amber-400 w-full text-black py-2 rounded-lg ${pkg.isComingSoon && 'opacity-50 cursor-not-allowed'}`}
                                        onClick={() => !pkg.isComingSoon && setSelectedPackage(pkg)}
                                        disabled={pkg.isComingSoon}
                                    >
                                        {pkg.isComingSoon ? 'Coming Soon' : 'Purchase'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* VIP Requirements Section */}
                    <div className="mt-8 bg-black/20 p-6 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">VIP Package Requirements:</h3>
                        <ul className="space-y-3">
                            {[
                                { icon: faServer, text: 'Dedicated server with at least 4GB RAM and 2 CPU cores' },
                                { icon: faClock, text: '24/7 server uptime (minimum 99% uptime required)' },
                                { icon: faWifi, text: 'Stable internet connection with at least 100Mbps bandwidth' },
                                { icon: faCode, text: 'Ability to run our proxy client software' },
                                { icon: faTools, text: 'Basic technical knowledge for server maintenance' }
                            ].map((req, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <FontAwesomeIcon icon={req.icon} className="text-orange-500 mt-1" />
                                    <span className="text-gray-300">{req.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Why We're Selling Section */}
                <div className="bg-[#1E1E1E] rounded-lg p-6 mb-12">
                    <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faHandshake} className="text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Why We're Selling Proxies</h2>
                            <p className="text-gray-400 leading-relaxed">
                                As a startup, we have chosen not to pursue traditional funding routes.
                                We are a self-sustaining, value-driven Web3 project. To accelerate our growth,
                                we need capital to move faster. Therefore, we are sharing a portion of our
                                confirmed revenue stream with those who support us, creating a mutually
                                beneficial ecosystem where everyone can prosper together.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <PurchaseModal
                isOpen={!!selectedPackage}
                onClose={() => setSelectedPackage(null)}
                selectedPackage={selectedPackage}
            />
        </div>
    );
};

export default ProxyPurchasePage;