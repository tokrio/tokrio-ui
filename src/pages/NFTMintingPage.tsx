import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Nft } from '../img/FileImports';
import { signMessage, switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { chainConfig } from '../WalletConfig';
import toast, { Toaster } from 'react-hot-toast';
import { JarvisGen1Abi } from '../abi/Abi';
import { config } from '../config/env';
import { FaCheck, FaRocket, FaSpinner } from 'react-icons/fa';
import { api, tokenStorage } from '../services/api';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const NFTMintingPage: React.FC = () => {
    const [mintCode, setMintCode] = useState<string>('');
    const [loading, setLoading] = React.useState(0);
    const { address, chainId } = useAccount();
    const { openConnectModal } = useConnectModal();


    // Minting functionality
    const startMinting = async () => {

        if (!address) {
            if (openConnectModal) {
                openConnectModal()
            }
            return
        }
        
        if (chainId !== chainConfig.chains[0].id) {
            switchChain(chainConfig, { chainId: Number(chainConfig.chains[0].id) })
        }

        if(!mintCode){
            toast.error('Please input the mint code.')
            return
        }

        //authCode
        if (loading == 2) {
            return
        }

        setLoading(2);

        try {

            if (!tokenStorage.getToken()) {
                let now = new Date().getTime()
    
                let message = `Welcome to Tokrio!\n\nClick to sign in and experience the AI-powered crypto trading ecosystem based on TAST (Trend Analysis & SuperTrend Technology).\n\nThis action will not initiate a blockchain transaction or incur any gas fees.\n\nWallet address:\n${(address as `0x${string}`).toLowerCase()}\n\nNonce:\n${now}`
    
    
                const sign = await signMessage(chainConfig, {
                    message: message
                })
    
                let param: any = {
                    walletAddress: address,
                    timestamp: now,
                    signature: sign
                }
    
    
                const response = await api.login(param);
    
                if (response.code === 200) {
                    tokenStorage.setToken(response.body);
                } else {
                    toast.error(response.message ?? 'network error.')
                    console.error('Login failed:', response.message);
                    setLoading(0);
                    return
                }
            }

            console.log('Login successfully',tokenStorage.getToken());
    
            const response = await api.authCode({
                "promotionId": 1,   
                "authCode": mintCode
            });
            let sign = ""
            if (response.code !== 200) {
                toast.error(response.message ?? 'network error.')
                console.error('Login failed:', response.message);
                setLoading(0);
                return
            } else {
                sign = response.body.signature
            }

            const hash = await writeContract(chainConfig, {
                address: config.JarvisNFT as `0x${string}`,
                abi: JarvisGen1Abi,
                functionName: 'mintWithAuthCode',
                args: [mintCode, sign]
            });

            const approveData: any = await waitForTransactionReceipt(chainConfig, {
                hash: hash
            })

            if (approveData.status && approveData.status.toString() == "success") {
                toast.success('Minted successfully');
                setLoading(1);
            } else {
                toast.error('Minted Failed!');
                setLoading(0);
                return

            }
        } catch (error) {
            setLoading(0);
            toast.error('Minted Failed!!!');
        }


    };


    return (
        <div className="min-h-screen text-sm md:text-base text-white">
            <Navbar showMenu={false} />
            <Toaster />
            <div className="py-32 max-w-6xl font-light mx-auto px-4 sm:px-6 lg:px-8">

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="text-5xl font-darker leading-[60px] font-semibold mb-6">
                        🎉 Congratulations!
                    </div>
                    <div className="text-xl leading-6 text-gray-400 mb-8 max-w-4xl mx-auto">
                        You've been selected to join the Tokrio AI NFT whitelist program — and officially boarded as an early co-builder of the AI-powered Web3 financial ecosystem.
                    </div>
                    <div className="border border-[#22C55E]/40 bg-gray-900/30 rounded-lg p-6 max-w-2xl mx-auto">
                        <div className="text-[#22C55E]">
                            Your NFT is more than just a badge. It's your passport to Tokrio's AI future.
                        </div>
                    </div>
                </div>

                {/* What is Tokrio AI NFT */}
                <div className="mb-16">
                    <div className="text-3xl font-darker font-semibold mb-6">
                        🤖 What is <span className="text-[#FFA41C]">Tokrio AI NFT</span>?
                    </div>
                    <div className="leading-6 text-gray-400 mb-8">
                        Tokrio is the next-generation Web3 AI Agent platform built to maximize capital efficiency for every user.<br />
                        Holding this limited NFT grants you exclusive access to our advanced trading systems.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-[#FFA41C]/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">🔓</span>
                            </div>
                            <div className="font-medium mb-2">Lifetime Access</div>
                            <div className="text-gray-400 text-sm">
                                Free access to Tokrio AI Trading & AI Agent services
                            </div>
                        </div>
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-[#FFA41C]/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">💰</span>
                            </div>
                            <div className="font-medium mb-2">Revenue Sharing</div>
                            <div className="text-gray-400 text-sm">
                                Early participation in platform revenue-sharing opportunities
                            </div>
                        </div>
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-[#FFA41C]/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">👑</span>
                            </div>
                            <div className="font-medium mb-2">Exclusive Privileges</div>
                            <div className="text-gray-400 text-sm">
                                Governance, referral, and ecosystem privileges as Tokrio grows
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mint Access Code */}
                {/* <div className="mb-16">
          <div className="text-3xl font-darker font-semibold mb-6">
            🎁 Your <span className="text-[#FFA41C]">Mint Access Code</span>
          </div>
          <div className="leading-6 text-gray-400 mb-8">
            You'll find your NFT Claim Code below. This code allows you and your invited recipients to mint your exclusive Tokrio AI NFT — free of charge.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6">
              <div className="text-center">
                <div className="text-gray-400 mb-2">Your Code:</div>
                <div className="text-2xl font-bold text-[#FFA41C] mb-4 font-mono">{mintCode}</div>
                <button 
                  className="px-4 py-2 rounded-md text-black bg-[#FFA41C] hover:bg-[#FFA41C]/80 transition-colors"
                  onClick={copyCode}
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Code
                </button>
              </div>
            </div>
            
            <div className="border border-yellow-500/40 bg-gray-900/30 rounded-md p-6">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-yellow-500 mt-1"></i>
                <div>
                  <div className="font-medium text-yellow-400 mb-2">Important Information</div>
                  <div className="text-yellow-200 text-sm leading-5">
                    🔓 One NFT unlocks all benefits. Extra codes? Gift them to top contributors, close partners, or friends in your community — help us grow the AI network together.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

                {/* Minting Section */}
                <div className="mb-16">
                    <div className="text-3xl font-darker font-semibold mb-6">
                        🎁 Mint Your <span className="text-[#FFA41C]">Tokrio AI NFT</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* NFT Preview */}
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 flex flex-col items-center justify-center rounded-md p-6">

                            <img className='w-48 h-48 mb-6' src={Nft} />

                            <div className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FFA41C] to-[#FFD700]">
                                Tokrio AI NFT
                            </div>
                            <div className="text-gray-400 text-center text-sm">
                                Limited Edition
                            </div>

                        </div>

                        {/* Minting Details */}
                        <div className="space-y-6">
                            <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6">
                                <div className="font-medium mb-4">Minting Details</div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Mint Price:</span>
                                        <span className="font-bold text-[#22C55E]">FREE</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Network:</span>
                                        <span className="font-medium">BSC Mainnet</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6">
                                <div className="font-medium mb-3">Mint Access Code</div>
                                <input
                                    type="text"
                                    onChange={(e) => setMintCode(e.target.value)}
                                    placeholder="Please enter Mint Access Code"
                                    className="w-full bg-gray-800/50 border border-[#FFA41C]/30 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFA41C] focus:ring-1 focus:ring-[#FFA41C] transition-all duration-300"
                                />

                            </div>

                            <button
                                className={`w-full py-4 rounded-md flex items-center justify-center text-lg font-medium transition-all duration-300 ${loading === 2 ? 'animate-pulse' : 'hover:bg-[#FFA41C]/80'
                                    } ${loading === 1 ? 'bg-[#22C55E] text-black' : 'bg-[#FFA41C] text-black'}`}
                                onClick={startMinting}
                                disabled={loading === 2}
                            >
                                {loading === 2 ? (
                                    <><FaSpinner className="fas animate-spin fa-spinner fa-spin mr-2" />Minting...</>
                                ) : loading === 1 ? (
                                    <><FaCheck className="fas fa-check mr-2" />Minted Successfully</>
                                ) : (
                                    <><FaRocket className="fas fa-rocket mr-2" />Connect Wallet & Mint NFT</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features & Benefits */}
                <div className="mb-16">
                    <div className="text-3xl font-darker font-semibold mb-6">
                        Features & <span className="text-[#FFA41C]">Benefits</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6">
                            <div className="font-medium mb-4">🎯 Core Features</div>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">AI-Powered Trading Bots</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">Advanced Trading Strategies</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">Priority Trade Execution</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">Exclusive Market Analysis</span>
                                </li>
                            </ul>
                        </div>

                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6">
                            <div className="font-medium mb-4">💎 Exclusive Benefits</div>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">Priority Customer Support</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">Early Access to New Features</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">Governance Rights</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-[#22C55E]">✓</span>
                                    <span className="text-gray-300">Revenue Sharing Opportunities</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div>
                    <div className="text-3xl font-darker font-semibold mb-6">
                        What's <span className="text-[#FFA41C]">Next</span>?
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-[#FFA41C]/20 rounded-full flex items-center justify-center">
                                <span className="text-[#FFA41C] font-bold">1</span>
                            </div>
                            <div className="font-medium mb-2">Mint Your NFT</div>
                            <div className="text-gray-400 text-sm">Complete the minting process to claim your NFT</div>
                        </div>
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-[#FFA41C]/20 rounded-full flex items-center justify-center">
                                <span className="text-[#FFA41C] font-bold">2</span>
                            </div>
                            <div className="font-medium mb-2">Access Platform</div>
                            <div className="text-gray-400 text-sm">Connect your NFT to unlock trading features</div>
                        </div>
                        <div className="border border-[#FFA41C]/40 bg-gray-900/30 rounded-md p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-[#FFA41C]/20 rounded-full flex items-center justify-center">
                                <span className="text-[#FFA41C] font-bold">3</span>
                            </div>
                            <div className="font-medium mb-2">Start Trading</div>
                            <div className="text-gray-400 text-sm">Begin your AI-powered trading journey</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFTMintingPage;