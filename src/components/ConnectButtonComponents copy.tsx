import { ConnectButton } from '@rainbow-me/rainbowkit';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { RobotUser, User } from '../img/FileImports';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import formatStringNumber from '../util/utils';
import AnimationButton from './AnimationButton';
import TokenName from './TokenName';
import { config } from '../config/env';
import TokenBalance from './TokenBalance';
import { useEffect, useState } from 'react';
import { api, tokenStorage } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { signMessage } from "@wagmi/core";
import { chainConfig } from '../WalletConfig';
import { getReadData, IResponse } from '../contract/api';
import { TokrioLevelAbi } from '../abi/Abi';
import toast from 'react-hot-toast';
import TokenDecimals from './TokenDecimals';
import BigNumber from 'bignumber.js';
import { progress } from 'framer-motion';
import { Level } from '../config/constant';
import IncreaseEquity from './IncreaseEquity';

export const ConnectButtonComponents = () => {

    const [showPop, setShowPop] = useState(false);
    const [hasRebot, setHasRebot] = useState(false);
    const { address } = useAccount();

    const togglePop = (event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡
        setShowPop(prevShowPop => !prevShowPop);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (event.target instanceof Element && !event.target.closest('.profile-pop') && !event.target.closest('.profile-pop-button')) {
            setShowPop(false);
        }
    };


    const checkRobot = async () => {
        let claimStatusRes: IResponse = await getReadData("checkRobotOwnership", TokrioLevelAbi, config.SPONSOR, [address])
        if (claimStatusRes.code == 200) {
            setHasRebot(claimStatusRes.data)
        }

    }

    useEffect(() => {
        checkRobot();
    }, [address])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (

        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                ////console.log("authenticationStatus", authenticationStatus)
                ////console.log("authenticationStatus", account)
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');
                return (
                    <div
                        className='text-sm relative main-font text-white font-medium'
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {showPop && address && <div className='profile-pop absolute right-0 top-12 z-30'>
                            <UserProfile />
                        </div>}
                        {(() => {
                            if (!connected) {
                                return (
                                    <button className='cta-button text-xs  cursor-pointer py-1.5 px-2 rounded-md' onClick={openConnectModal} type="button">
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button className=' px-4 truncate uppercase cursor-pointer py-1.5 rounded-lg bg-[#ff494a]' onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {/* <button
                                        className='hidden lg:flex text-[#fff] border-2 border-[#4d4d4d] py-1  px-2 items-center cursor-pointer rounded-full'
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div className='  rounded-full overflow-hidden mr-1'>
                                                {chain.iconUrl && (
                                                    <img className='  w-5 h-5 mr-1'
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button> */}
                                    <button className='hidden md:flex text-[#fff] border border-[#333] py-1.5 px-2 items-center cursor-pointer rounded-full profile-pop-button' onClick={togglePop} type="button">
                                        {/* <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} /> */}
                                        {hasRebot ? <svg className="icon w-5 h-5" viewBox="0 0 1024 1024" width="64" height="64"><path d="M981.333333 618.666667h-106.666666v-21.333334a298.666667 298.666667 0 0 0-118.186667-244.053333l103.893333-162.986667a64 64 0 1 0-36.053333-23.04l-103.04 162.133334A416.213333 416.213333 0 0 0 512 277.333333a416.213333 416.213333 0 0 0-209.28 52.053334l-103.04-162.133334a64 64 0 1 0-36.053333 23.04l103.893333 162.986667A298.666667 298.666667 0 0 0 149.333333 597.333333v21.333334H42.666667v256h106.666666v85.333333h725.333334v-85.333333h106.666666zM85.333333 832v-170.666667h64v170.666667z m746.666667 85.333333H192V597.333333c0-192 160.64-277.333333 320-277.333333s320 85.333333 320 277.333333v320z m106.666667-85.333333h-64v-170.666667h64z" p-id="4047" fill="#FFA41C"></path><path d="M405.333333 661.333333m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" p-id="4048" fill="#FFA41C"></path><path d="M618.666667 661.333333m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" p-id="4049" fill="#FFA41C"></path><path d="M661.333333 533.333333H362.666667a128 128 0 0 0 0 256h298.666666a128 128 0 0 0 0-256z m0 213.333334H362.666667a85.333333 85.333333 0 0 1 0-170.666667h298.666666a85.333333 85.333333 0 0 1 0 170.666667z" p-id="4050" fill="#FFA41C"></path></svg> :
                                            <img className='w-6 h-6' src={User} />}
                                        <p className=' ml-1'> {account.displayName}</p>
                                        <img className=' w-6' src={process.env.PUBLIC_URL + '/img/' + 'down.png'} alt="" />
                                    </button>

                                    <div onClick={togglePop} className='profile-pop-button  cursor-pointer block md:hidden ml-3'>

                                        {hasRebot ? <svg className="icon w-5 h-5" viewBox="0 0 1024 1024" width="64" height="64"><path d="M981.333333 618.666667h-106.666666v-21.333334a298.666667 298.666667 0 0 0-118.186667-244.053333l103.893333-162.986667a64 64 0 1 0-36.053333-23.04l-103.04 162.133334A416.213333 416.213333 0 0 0 512 277.333333a416.213333 416.213333 0 0 0-209.28 52.053334l-103.04-162.133334a64 64 0 1 0-36.053333 23.04l103.893333 162.986667A298.666667 298.666667 0 0 0 149.333333 597.333333v21.333334H42.666667v256h106.666666v85.333333h725.333334v-85.333333h106.666666zM85.333333 832v-170.666667h64v170.666667z m746.666667 85.333333H192V597.333333c0-192 160.64-277.333333 320-277.333333s320 85.333333 320 277.333333v320z m106.666667-85.333333h-64v-170.666667h64z" p-id="4047" fill="#FFA41C"></path><path d="M405.333333 661.333333m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" p-id="4048" fill="#FFA41C"></path><path d="M618.666667 661.333333m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" p-id="4049" fill="#FFA41C"></path><path d="M661.333333 533.333333H362.666667a128 128 0 0 0 0 256h298.666666a128 128 0 0 0 0-256z m0 213.333334H362.666667a85.333333 85.333333 0 0 1 0-170.666667h298.666666a85.333333 85.333333 0 0 1 0 170.666667z" p-id="4050" fill="#FFA41C"></path></svg> :
                                            <img className='w-6 h-6' src={User} />}
                                    </div>



                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>

    );
};

function UserProfile() {

    const { address } = useAccount();
    const { disconnect } = useDisconnect()
    const [isOpen, setIsOpen] = useState(false)
    const [isUp, setIsUp] = useState(false)
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<any>({
        equity: 0,
        sponsored: 0,
        level: 0,
        total: 0,
        needValue: 100,
        progress: 0
    })

    useEffect(() => {
        getLevel();
    }, [address])

    const getLevel = async () => {
        let { data, code }: IResponse = await getReadData("getUserEquity", TokrioLevelAbi, config.SPONSOR, [address])
        if (code != 200) {
            toast.error("Please check your RPC.")
            return
        }
        let equity = Number(new BigNumber(data[0]).dividedBy(10 ** 18).toString())
        let sponsored = Number(new BigNumber(data[1]).dividedBy(10 ** 18).toString())
        let info = {
            equity: equity,
            sponsored: sponsored,
            level: Number(data[2].toString()),
            total: equity + sponsored,
            needValue: Level[Number(data[2].toString()) + 1] - (sponsored + equity),
            progress: Math.floor(Number(new BigNumber(sponsored + equity).dividedBy(Level[Number(data[2].toString()) + 1]).multipliedBy(100).toString()))
        }
        setUserInfo(info);
    }



    const disconnectWallet = () => {
        if (disconnect) {
            disconnect()
        }
    }

    const toDashBoard = async () => {
        if (tokenStorage.getToken()) {
            navigate('/dashboard');
            return

        }

        let now = new Date().getTime()

        let message = `Welcome to Tokrio!\n\nClick to sign in and experience the AI-powered crypto trading ecosystem based on TAST (Trend Analysis & SuperTrend Technology).\n\nThis action will not initiate a blockchain transaction or incur any gas fees.\n\nWallet address:\n${(address as `0x${string}`).toLowerCase()}\n\nNonce:\n${now}`


        const sign = await signMessage(chainConfig, {
            message: message
        })



        try {
            // 使用指定的参数值登录
            const response = await api.login({
                walletAddress: address?.toString() || "",
                timestamp: now,
                signature: sign
            });

            if (response.code === 200) {
                // 保存 token
                tokenStorage.setToken(response.body);
                // 跳转到 dashboard
                navigate('/dashboard');
            } else {
                console.error('Login failed:', response.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    return <div className='w-[350px] h-screen pb-28 '>
        <IncreaseEquity isUp={isUp} isOpen={isOpen} setIsOpen={setIsOpen} finish={getLevel} />
        <div className='bg-[#151515] overflow-y-auto border relative border-[#333] py-7 px-5 h-full w-full rounded-2xl'>
            <div className=' flex items-center'>
                <img className='w-10 h-10' src={User} />
                <div className='ml-3 flex-1'>
                    <div className='flex items-center text-base'>
                        LV {userInfo ? userInfo.level.toString() : 0}
                        {/* <div className='ml-2 text-[#fff] text-xs bg-[#FFA41C] px-2 rounded-full'>
                            {userInfo ? userInfo.total : 0}
                        </div> */}

                    </div>
                    <p className=' text-xs text-[#888]'>{formatStringNumber(address)}</p>
                </div>
                <button onClick={disconnectWallet} className='inter-font hover:bg-[#111] bg-[#222] rounded-full px-3 py-2 text-xs'>Disconnect</button>
            </div>

            {userInfo && <div className='flex items-center text-xs mt-3'>
                <span className='bg-[#FFA41C] px-1 rounded-sm'>LV{userInfo.level}</span>
                <progress className='w-full h-1.5 mx-2 custom-progress' value={userInfo.progress + ""} max="100"></progress>
                <span className='bg-[#FFA41C] px-1 rounded-sm'>LV{userInfo.level + 1}</span>
            </div>}

            {userInfo && <div className='text-[#666] main-font-none normal-case text-xs mt-2'>The current experience value is {userInfo.total}, and it still needs {userInfo.needValue} <TokenName address={config.LEVEL_TOKEN} /> to upgrade to LV{userInfo.level + 1}.</div>}

            <button onClick={toDashBoard} className=' p-3 w-full mt-4 hover:bg-[#FFA41C] bg-[#222] rounded-sm '>To My Dashboard</button>

            <button onClick={() => {
                navigate('/sponsor');
            }} className=' p-3 w-full mt-3  hover:bg-[#FFA41C] bg-[#222] rounded-sm '>
                To My Sponsors
            </button>

            <button onClick={() => {
                setIsUp(true)
                setIsOpen(true)
            }} className=' p-3 w-full mt-3  hover:bg-[#FFA41C] bg-[#222] rounded-sm '>
                Increase Equity
            </button>


            <button onClick={() => {
                setIsUp(false)
                setIsOpen(true)
            }} className=' p-3 w-full mt-3 hover:bg-[#FFA41C] bg-[#222] rounded-sm '>
                Decrease Equity
            </button>


            <div className='mt-4'>Assets</div>
            {userInfo && <>
                <div className='flex border border-[#333] p-4 rounded-md mt-3 justify-between'>
                    <TokenName address={config.TOKEN} />
                    <div className='flex-1'></div>
                    <TokenBalance token={config.TOKEN} decimalPlaces={2} />
                </div>
                <div className='flex border border-[#333] p-4 rounded-md mt-3 justify-between'>
                    <TokenName address={config.LEVEL_TOKEN} />
                    <div className='flex-1'></div>
                    <TokenBalance token={config.LEVEL_TOKEN} decimalPlaces={2} isLoading={isOpen} />
                </div>
                <div className='flex border border-[#333] p-4 rounded-md mt-3 justify-between'>
                    <TokenName address={config.USDT_TOKEN} />
                    <div className='flex-1'></div>
                    <TokenBalance token={config.USDT_TOKEN} decimalPlaces={2} />
                </div>
            </>}

        </div>


    </div>

}