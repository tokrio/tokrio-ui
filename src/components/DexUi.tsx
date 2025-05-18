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
import SettingCexUi from "./SettingCexUi";
import CloseToken from "./CloseToken";
import SettingDexUi from "./SettingDexUi";
import { CaptionsOff, FolderClosed, History, HistoryIcon, PanelLeftClose, SettingsIcon } from "lucide-react";



export default function DexUi() {
    const [portfolioData, setPortfolioData] = useState<PortfolioOverview | null>(null);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [isPairOpen, setIsPairOpen] = useState<number>(0);
    const [addLoading, setAddLoading] = useState(false);
    const [isSettingCexOpen, setIsSettingCexOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCloseTokenOpen, setIsCloseTokenOpen] = useState(false);
    const [dexItem, setDexItem] = useState<any | null>(null);
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
                fetchPortfolioData();
            } else {
                if (response.message) {
                    toast.error(response.message);
                }else{
                    toast.error('Add Trading Asset failed.');
                }
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
                                ) : 'Add Trading Asset'}
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
                            ) : 'Add Trading Asset'}
                        </button>
                        <button onClick={() => {
                            setIsPairOpen(2)
                        }} className="px-3 ml-2 py-2 cta-button">
                            Add Trading USDT
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-gray-400">
                            Loading trade set...
                        </div>
                    ) : !portfolioData || portfolioData.positions?.length < 1 ? (
                        <div className="text-center py-8 text-gray-400">
                            No Trade Set configured yet. Click the button above to add one.
                        </div>
                    ) : (
                        <div className="space-y-4">

                            <div className='grid grid-cols-1 gap-4'>
                                {portfolioData && portfolioData.positions.map((position: any) => (
                                    <div
                                        key={position.tokenSymbol}
                                        className="bg-card rounded-lg p-6 hover:bg-gray-700/50 transition-colors duration-200"
                                    >
                                        <div className=" mb-6 gap-3 grid grid-cols-1">
                                            <div className="flex w-full items-center space-x-4">
                                                <div>
                                                    <div className="text-xl font-medium text-white">{position.tokenSymbol}</div>

                                                </div>

                                                {
                                                    position.trending > 0 ? (
                                                        <svg className='w-6 h-6 text-red-400' viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13956" width="48" height="48"><path d="M904.00256 308.34176l58.52672-184.32c1.56672-4.62336-1.82272-9.59488-6.8864-9.86624l-193.5104-13.13792c-6.41536-0.42496-10.53184 6.7584-6.912 12.07296l45.696 66.80576-255.2064 173.3376L467.26144 238.592a15.43168 15.43168 0 0 0-21.46816-4.06016l-325.1712 220.928c-0.31232 0.2048-0.63488 0.40448-0.9472 0.6144l-17.66912 12.03712-19.49696 13.24544a7.6288 7.6288 0 0 0-1.9456 1.93536c-13.6448 12.7232-16.30208 33.16224-5.39648 49.16736a38.8864 38.8864 0 0 0 47.44704 13.84448c1.1264-0.16384 2.2272-0.5632 3.2256-1.24416l312.44288-212.18304 78.37696 114.51904c4.864 7.02464 14.45888 8.84224 21.46304 4.06528L844.544 243.5584l45.69088 66.80576c3.61984 5.31456 11.82208 4.11136 13.76768-2.01728" fill="#1afa29" p-id="13957"></path><path d="M140.46208 666.99264c-22.6816 0-41.13408 14.70464-41.13408 32.77312v189.952c0 18.0736 18.45248 32.77312 41.13408 32.77312 22.6816 0 41.13408-14.69952 41.13408-32.77312v-189.952c0-18.0736-18.45248-32.77312-41.13408-32.77312M401.408 540.73856c-22.6816 0-41.13408 15.18592-41.13408 33.85344v314.05056c0 18.6624 18.45248 33.84832 41.13408 33.84832 22.6816 0 41.13408-15.18592 41.13408-33.8432v-314.0608c0-18.6624-18.45248-33.8432-41.13408-33.8432m260.93568 63.12448c-22.6816 0-41.12896 15.6672-41.12896 34.93376v248.7552c0 19.26144 18.44736 34.93376 41.12896 34.93376s41.13408-15.6672 41.13408-34.93376v-248.7552c0-19.26144-18.45248-34.93376-41.13408-34.93376m260.9408-185.1392c-22.6816 0-41.13408 18.45248-41.13408 41.13408v421.49376c0 22.6816 18.45248 41.13408 41.13408 41.13408 22.6816 0 41.13408-18.45248 41.13408-41.13408V459.86304c0-22.6816-18.45248-41.13408-41.13408-41.13408" fill="#1afa29" p-id="13958"></path></svg>
                                                    ) : (
                                                        <svg className='w-6 h-6 text-red-400' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12820" width="48" height="48"><path d="M196.048133 357.025609v518.161062a9.162604 9.162604 0 0 1-9.478556 9.478556H142.336316a9.162604 9.162604 0 0 1-9.478556-9.478556V357.025609a9.162604 9.162604 0 0 1 9.478556-9.478556h44.233261a9.162604 9.162604 0 0 1 9.478556 9.478556z m211.687751 116.902191h-44.233261a9.162604 9.162604 0 0 0-9.478556 9.478556v391.780315a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233261a9.162604 9.162604 0 0 0 9.478556-9.478556V483.406356a9.162604 9.162604 0 0 0-9.478556-9.478556z m221.166307-31.595187h-44.233262a9.162604 9.162604 0 0 0-9.478556 9.478556v423.375502a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233262a9.162604 9.162604 0 0 0 9.478556-9.478556V451.811169a9.162604 9.162604 0 0 0-9.478556-9.478556z m221.166306 189.57112h-44.233261a9.162604 9.162604 0 0 0-9.478556 9.478556v233.804382a9.162604 9.162604 0 0 0 9.478556 9.478556h44.233261a9.162604 9.162604 0 0 0 9.478556-9.478556v-233.804382a9.162604 9.162604 0 0 0-9.478556-9.478556z m31.595187-211.68775a14.533786 14.533786 0 0 0-25.592101-6.950941l-35.070657 42.021598a26.539957 26.539957 0 0 0-5.687134-6.319037l-284.35668-221.166307a31.595187 31.595187 0 0 0-24.644246-6.634989 31.595187 31.595187 0 0 0-21.484727 14.849737l-76.460351 126.380747-256.236964-197.785868a31.595187 31.595187 0 1 0-38.546128 49.920394l284.35668 221.166307a31.595187 31.595187 0 0 0 24.960198 6.003086 31.595187 31.595187 0 0 0 21.484727-14.849738l76.460351-126.380747 256.236964 199.365628a31.595187 31.595187 0 0 0 5.371182 3.159519l-35.702561 42.653502a14.533786 14.533786 0 0 0 11.374267 24.012342l133.015736-2.843567a14.849738 14.849738 0 0 0 14.217834-17.061401z" fill='red' p-id="12821" ></path></svg>
                                                    )
                                                }
                                                <div className='flex-1'></div>
                                                <div className="text-sm  text-gray-400 ">
                                                    Initial: {position.initialUSDT} USDT
                                                </div>

                                                <div className="hidden md:flex items-center space-x-3">
                                                    <button
                                                        onClick={() => {
                                                            setIsHistoryOpen(true)
                                                            setTokenSymbol(position.tokenSymbol)
                                                        }}
                                                        className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                                                    >
                                                        <HistoryIcon className="w-4 h-4 mr-1" />
                                                        History
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setDexItem(position)
                                                            setIsSettingCexOpen(true)
                                                        }} 
                                                        className="px-3 py-1.5 flex items-center bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                                                    >
                                                        <SettingsIcon className="w-4 h-4 mr-1" />
                                                        Setting
                                                    </button>

                                                    <div 
                                                        onClick={() => {
                                                            setDexItem(position)
                                                            setIsCloseTokenOpen(true);
                                                        }} 
                                                        className="px-3 py-1.5 flex items-center bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                                                    >
                                                        <CaptionsOff className="w-4 h-4 mr-1" />
                                                        Close
                                                    </div>


                                                </div>
                                            </div>
                                            <div className=" md:hidden flex items-center space-x-3">
                                                    <button
                                                        onClick={() => {
                                                            setIsHistoryOpen(true)
                                                            setTokenSymbol(position.tokenSymbol)
                                                        }}
                                                        className="px-3 flex items-center py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                                                    >
                                                        <HistoryIcon className="w-4 h-4 mr-1" />
                                                        {/* History */}
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setDexItem(position)
                                                            setIsSettingCexOpen(true)
                                                        }} 
                                                        className="px-3 py-1.5 flex items-center bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                                                    >
                                                        <SettingsIcon className="w-4 h-4 mr-1" />
                                                        Setting
                                                    </button>

                                                    <div 
                                                        onClick={() => {
                                                            setDexItem(position)
                                                            setIsCloseTokenOpen(true);
                                                        }} 
                                                        className="px-3 py-1.5 flex items-center bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm"
                                                    >
                                                        <CaptionsOff className="w-4 h-4 mr-1" />
                                                        Close
                                                    </div>


                                                </div>

                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <div className="text-sm text-gray-400">Current Balance</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-gray-400">USDT</div>
                                                        <div className="text-white font-medium">
                                                            ${position.usdtLeft?new BigNumber(position.usdtLeft).toFixed(2):'0.00'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-400">{position.tokenSymbol.split('USDT')[0]}</div>
                                                        <div className="text-white font-medium">
                                                            {position.tokenAmount.toFixed(6)}
                                                            <span className="text-sm text-gray-400 ml-1">
                                                                (${new BigNumber(position.tokenAmount * position.currentPrice).toFixed(2)})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="text-sm text-gray-400">Performance</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-gray-400">Total Value</div>
                                                        <div className="text-white font-medium">
                                                            ${new BigNumber(position.value).toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-400">PNL</div>
                                                        <div className={`font-medium flex items-center ${position.profitRate >= 0 ? 'text-green-400' : 'text-red-400'
                                                            }`}>
                                                            {position.profitRate >= 0 ? '+' : ''}{position.profitRate}%
                                                            <span className="block ml-2 text-sm">
                                                                ${Math.abs(position.profit).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <div className="text-sm text-gray-400">
                                                Last Update: {position.trendingUpdateTime}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>
                    )}
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
                onSave={fetchPortfolioData}
            />
            {dexItem && usdtBalance && <SettingDexUi
                isOpen={isSettingCexOpen}
                onClose={() => {
                    setIsSettingCexOpen(false);
                }}
                onSave={fetchPortfolioData}
                usdtBalance={usdtBalance}
                tokenAccountId={dexItem?.tokenAccountID}
                initUsdt={dexItem?.initialUSDT}
            />}

            {dexItem && <CloseToken
                isOpen={isCloseTokenOpen}
                onClose={() => {
                    setIsCloseTokenOpen(false);
                }}
                isCex={false}
                onSave={fetchPortfolioData}
                tokenSymbol={dexItem?.tokenSymbol} />}
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

