import { useEffect, useState } from "react";
import { api, PortfolioOverview, DexToken, TokenBalanceProps } from "../services/api";
import { motion } from "framer-motion";
import { DepositPop } from "./DepositPop";
import { WithdrawTradePop } from "./WithdrawTradePop";
import { get } from "http";
import { getReadData, IResponse } from "../contract/api";
import { ProxyTradingAbi } from "../abi/Abi";
import { config } from "../config/env";
import { useAccount } from "wagmi";
import TokenBalance from "./TokenBalance";
import TokenDecimals from "./TokenDecimals";
import { TradingPairContract } from "./TradingPairContract";
import { erc20Abi } from "viem";
import BigNumber from "bignumber.js";
import { FaBlog, FaQuestionCircle, FaHistory } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import TradingContractHistory from "./TradingContractHistory";
import toast from "react-hot-toast";



export default function DexUi() {
    const [portfolioData, setPortfolioData] = useState<PortfolioOverview | null>(null);
    const [dexTokens, setDexTokens] = useState<DexToken[] | null>(null);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [isPairOpen, setIsPairOpen] = useState<number>(0);
    const [addLoading, setAddLoading] = useState(false);
    const [usdtBalance, setUsdtBalance] = useState<TokenBalanceProps>({
        uiBalance: "0",
        decimals: 0
    });
    const { address } = useAccount();

    const fetchPortfolioData = async () => {
        try {
            const response = await api.getWeb3PortfolioOverview();
            if (response.code === 200) {
                setPortfolioData(response.body);
            }
        } catch (error) {
            console.error('Failed to fetch portfolio data:', error);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
        getDexTokensData();
        const intervalId = setInterval(fetchPortfolioData, 30000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!isDepositOpen || !isWithdrawOpen) {
            getUSDTBalance();
        }
    }, [isDepositOpen, isWithdrawOpen]);

    const setTradingAsset = async () => {

        if (!address) {
            toast.error('Please connect your wallet.');
            return;
        }
        if (addLoading) {
            return;
        }
        setAddLoading(true)

        try {
            const response = await api.setTradeToken();

            if (response.code === 200) {
                setAddLoading(false)
                toast.success('Add Trading Asset successfully.');
                getDexTokensData();
            } else {
                toast.error('Add Trading Asset failed.');
            }
            setAddLoading(false)
        } catch (error) {
            setAddLoading(false)
            toast.error('Add Trading Asset failed...');
        }



    }

    const getUSDTBalance = async () => {
        try {
            const response = await getReadData("getTokenBalance", ProxyTradingAbi, config.ProxyTrading, [address, config.USDT_TOKEN]);
            if (response.code === 200) {
                //setBalance(response.data);
                let { data, code }: IResponse = await getReadData("decimals", erc20Abi, config.USDT_TOKEN, [])
                if (code == 200) {
                    setUsdtBalance({
                        uiBalance: new BigNumber(response.data).dividedBy(new BigNumber(10).pow(Number(data.toString()))).toFixed(2),
                        decimals: Number(data.toString())
                    });

                }
            }

        } catch (error) {
            console.error('Failed to fetch portfolio data:', error);
        }
    };

    const getDexTokensData = async () => {
        try {
            const response = await api.getDexTokens();
            if (response.code === 200 && response.body.tokens) {
                setDexTokens(response.body.tokens);
            } else {
                setDexTokens([]);
            }
        } catch (error) {
            console.error('Failed to fetch dex tokens:', error);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-lg p-6"
                >
                    <h3 className="text-lg font-medium text-white mb-4">Portfolio Overview</h3>
                    <div className="text-3xl font-bold text-primary">
                        ${portfolioData?.totalValue.toFixed(2) || '0.00'}
                    </div>
                    <div className={`text-sm ${(portfolioData?.profitRate || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(portfolioData?.profitRate || 0) >= 0 ? '+' : ''}{portfolioData?.profitRate || 0}% total
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-lg p-6"
                >
                    <h3 className="text-lg font-medium text-white mb-4">Active Trades</h3>
                    <div className="text-3xl font-bold text-primary">{portfolioData?.activeTrades || 0}</div>
                    <div className="text-gray-400 text-sm">Running strategies</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card rounded-lg p-6"
                >
                    <h3 className="text-lg font-medium text-white mb-4">Total Profit</h3>
                    <div className={`text-3xl font-bold ${(portfolioData?.totalProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(portfolioData?.totalProfit || 0) >= 0 ? '+' : ''}{portfolioData?.totalProfit.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-gray-400 text-sm">All time</div>
                </motion.div>
            </div>
            <div>
                <div className="bg-card rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="text-lg flex-1 font-medium text-white">USDT Balance</div>

                        <div className="md:flex items-center hidden">
                            <button
                                onClick={() => setIsDepositOpen(true)}
                                className="px-3 py-2 cta-button"
                            >
                                <span className="mr-1">+</span> Deposit
                            </button>
                            <button
                                onClick={() => setIsWithdrawOpen(true)}
                                className="px-3 ml-2 py-2 cta-button"
                            >
                                <span className="mr-1">-</span> Withdraw
                            </button>
                            <Tooltip id="withdraw-set" />

                            <div onClick={() => {
                                setIsHistoryOpen(true)
                                setTokenSymbol("USDT")
                            }} className="bg-slate-600/50 ml-2 rounded-md px-2 py-2">
                                <FaHistory className='cursor-pointer text-xl text-amber-400' />
                            </div>
                            <a className="rounded-md ml-2 py-2 " data-tooltip-html="Deposited/withdrawn USDT<br/> will be automatically allocated proportionally<br/> across your token trading accounts." data-tooltip-id="withdraw-set">
                                <FaQuestionCircle className='cursor-pointer text-xl text-amber-400' />
                            </a>

                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{usdtBalance.uiBalance} USDT</div>
                    <div className="flex items-center md:hidden mt-3">
                        <button
                            onClick={() => setIsDepositOpen(true)}
                            className="px-4 py-2 cta-button"
                        >
                            <span className="mr-1">+</span> Deposit
                        </button>
                        <button
                            onClick={() => setIsWithdrawOpen(true)}
                            className="px-4 ml-2 py-2 cta-button"
                        >
                            <span className="mr-1">-</span> Withdraw
                        </button>
                        <Tooltip id="withdraw-set1" />
                        <div onClick={() => {
                            setIsHistoryOpen(true)
                            setTokenSymbol("USDT")
                        }} className="bg-slate-600/50 ml-2 rounded-md px-2 py-2">
                            <FaHistory className='cursor-pointer text-xl text-amber-400' />
                        </div>
                        <a className="rounded-md ml-2 py-2 " data-tooltip-html="Deposited/withdrawn USDT<br/> will be automatically allocated proportionally<br/> across your token trading accounts." data-tooltip-id="withdraw-set">
                            <FaQuestionCircle className='cursor-pointer text-xl text-amber-400' />
                        </a>

                    </div>
                </div>



                <div className="bg-card rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-lg flex-1 font-medium text-white">Token Assets</div>

                        <div className="hidden md:flex items-center">
                            <button onClick={() => {
                                // setTradingAsset()
                                 setIsPairOpen(2)
                            }} className="px-3 py-2 cta-button">
                                {addLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Loading...
                                    </div>
                                ) : 'Set Trading Asset'}
                            </button>
                            {/* <button onClick={() => {
                                setIsPairOpen(2)
                            }} className="px-3 ml-2 py-2 cta-button">
                                Set Trading USDT
                            </button> */}

                        </div>
                    </div>

                    <div className=" items-center md:hidden flex">
                        <button onClick={() => {
                            setTradingAsset()
                            // setIsPairOpen(1)
                        }} className="px-3 py-2 cta-button">
                            {addLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Loading...
                                </div>
                            ) : 'Set Trading Asset'}
                        </button>
                        <button onClick={() => {
                            setIsPairOpen(2)
                        }} className="px-3 ml-2 py-2 cta-button">
                            Set Trading USDT
                        </button>
                    </div>

                    <div className="gap-4 grid grid-cols-1 mt-4 md:grid-cols-3">
                        {/* BTC Asset */}
                        {dexTokens?.map((token: DexToken, index: number) => (
                            <motion.div
                                key={token.tokenSymbol}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="border border-gray-800 p-4 rounded-md bg-black/60"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <div className="font-bold text-white mr-2">{token.tokenSymbol}</div>
                                        <div className="text-gray-400 text-sm">{token.tokenName}</div>
                                    </div>
                                    <div className={`text-sm ${token.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {token.profitPercent > 0 ? '+' : (token.profitPercent < 0 ? '-' : '')}{token.profitPercent || 0}%
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-xl font-bold text-white">${new BigNumber(token.usdtLeft).dividedBy(10 ** usdtBalance.decimals).toFixed(2) || 0}</div>
                                        <div className="text-gray-400 text-sm">
                                            USDT Value
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5">
                                    <div
                                        className="bg-primary h-1.5 rounded-full"
                                        style={{ width: `${token.allocation ?? 10}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-gray-400">Allocation</span>
                                    <span className="text-xs text-gray-400">{token.allocation ?? 10}%</span>
                                </div> */}
                                <button onClick={() => {
                                    setIsHistoryOpen(true)
                                    setTokenSymbol(token.tokenSymbol)
                                }} className=" bg-slate-800 mt-4 py-2 hover:opacity-80 w-full text-white px-3 rounded-md text-xs border border-gray-700">
                                    History
                                </button>
                            </motion.div>
                        ))}


                    </div>
                </div>
            </div>
            <DepositPop
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
            />
            {usdtBalance.decimals > 0 && <WithdrawTradePop
                isOpen={isWithdrawOpen}
                usdtBalance={usdtBalance}
                onClose={() => setIsWithdrawOpen(false)}
            />}
            <TradingPairContract
                isOpen={isPairOpen}
                isDex={true}
                usdtBalance={usdtBalance}
                onClose={() => setIsPairOpen(0)}
                onSave={getDexTokensData}
            />
            {tokenSymbol && isHistoryOpen && <TradingContractHistory
                isOpen={isHistoryOpen}
                onClose={() => {
                    setIsHistoryOpen(false);
                }}
                tokenSymbol={tokenSymbol}
            />}
        </div>
    )
}

