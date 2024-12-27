import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { verify, verifyInt } from '../util/utils'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import BigNumber from 'bignumber.js'
import toast from 'react-hot-toast'
import TokenBalance from './TokenBalance'
import { erc20Abi, maxInt256 } from 'viem'
import { useAccount } from 'wagmi'
import axios from 'axios'
import { chainConfig } from '../WalletConfig'
import AnimationButton from './AnimationButton'
import { fetchBalanceObj, getReadData, IResponse } from '../contract/api'
import { TokrioLevelAbi } from '../abi/Abi'
import { config } from '../config/env'
import { Level, maxUint256 } from '../config/constant'
import TokenName from './TokenName'

interface Props {
    isOpen: boolean,
    isUp: boolean,
    setIsOpen: any,
    finish?: any,
}

export default function IncreaseEquity({ isOpen, setIsOpen, finish, isUp = true }: Props) {

    const [amount, setAmount] = useState<string>("");
    const { address } = useAccount();
    const [loading, setLoading] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<any>({
        equity: 0,
        sponsored: 0,
        level: 0,
        total: 0,
        needValue: 100,
        progress: 0
    })

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

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }


    useEffect(() => {
        setLoading(0)
        if (isOpen) {
            setAmount("");
            getLevel();
        }

    }, [isOpen, address]);

    function closeModal() {

    }

    async function increaseEquity() {

        if (loading == 2) {
            return
        }

        setLoading(2)
        try {
            const balanceObj = await fetchBalanceObj(address, config.LEVEL_TOKEN)
            if (new BigNumber(balanceObj.formatted).isLessThan(amount)) {
                toast.error('Insufficient token balance!');
                setLoading(1);
                return
            }
            const tAmount = BigInt(new BigNumber(amount).multipliedBy(10 ** balanceObj.decimals).toString());

            if (isUp) {
                const allowance: any = await readContract(chainConfig, {
                    address: config.LEVEL_TOKEN as '0x',
                    abi: erc20Abi,
                    functionName: 'allowance',
                    args: [address as `0x${string}`, config.SPONSOR as `0x${string}`],
                })
                console.log("allowance=", allowance)

                if (new BigNumber(allowance.toString()).isLessThan(tAmount + "")) {

                    const hash = await writeContract(chainConfig, {
                        address: config.LEVEL_TOKEN as '0x',
                        abi: erc20Abi,
                        functionName: 'approve',
                        // args: [config.SPONSOR as `0x${string}`, tAmount],
                        args: [config.SPONSOR as `0x${string}`, maxUint256],
                        account: address
                    })
                    const approveData: any = await waitForTransactionReceipt(chainConfig, {
                        hash: hash
                    })

                    if (approveData.status && approveData.status.toString() == "success") {

                    } else {
                        toast.error('Your wallet failed allowed assets deduction!');
                        setLoading(0);
                        return

                    }

                }
            }


            let args = [tAmount]
            console.log(args)
            const hash = await writeContract(chainConfig, {
                address: config.SPONSOR as `0x${string}`,
                abi: TokrioLevelAbi,
                functionName: isUp ? 'increaseEquity' : 'decreaseEquity',
                args: args
            });

            const approveData: any = await waitForTransactionReceipt(chainConfig, {
                hash: hash
            })

            if (approveData.status && approveData.status.toString() == "success") {
                toast.success(isUp ? 'Increase Equity successfully' : 'Decrease Equity successfully');
                setIsOpen(false);
                finish && finish();
                setLoading(1);
            } else {
                toast.error(isUp ? 'Increase Equity Failed!' : 'Decrease Equity Failed!');
                setLoading(0);
                return

            }

        } catch (err: any) {
            console.log(err)
            let message = JSON.stringify(err)
            if (err && err.details) {
                message = err.details;
            } else if (err && err.message) {
                message = err.message;
            } else if (typeof err == 'string') {
                message = err;
            } else {
                try {
                    message = JSON.parse(`{${err.toString().split('{')[1]}`).message;
                } catch (e) {
                    message = "Execution failed";
                }
            }

            if (message.indexOf(".") != -1) {
                message = message.split(".")[0] + "."
            }
            console.log(message.indexOf("."));

            if (message.toString().length > 220) {
                message = message.substring(0, 220) + "...";
            }
            toast.error(message)
            setLoading(0)
        }
    }

    return (
        <>

            <Transition appear show={isOpen}>
                <Dialog as="div" className="relative profile-pop z-[900] focus:outline-none bg-black" onClose={closeModal}>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/10">
                        <div className="flex min-h-full items-center text-white font-bold justify-center p-4">
                            <TransitionChild
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 transform-[scale(95%)]"
                                enterTo="opacity-100 transform-[scale(100%)]"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 transform-[scale(100%)]"
                                leaveTo="opacity-0 transform-[scale(95%)]"
                            >
                                <DialogPanel className="w-full max-w-md rounded-xl border border-[#666] bg-[#111]/50 p-6 backdrop-blur-2xl">
                                    <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                        <div className='flex'>
                                            <div className='w-6'></div>
                                            <div className='text-center flex-1'></div>

                                            <svg onClick={close} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 cursor-pointer">
                                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </DialogTitle>
                                    {userInfo && <div className='flex items-center text-xs mt-3'>
                                        <span className='bg-[#FFA41C] px-1 rounded-sm'>LV{userInfo.level}</span>
                                        <progress className='w-full h-1.5 mx-2 custom-progress' value={userInfo.progress + ""} max="100"></progress>
                                        <span className='bg-[#FFA41C] px-1 rounded-sm'>LV{userInfo.level + 1}</span>
                                    </div>}

                                    {userInfo && isUp && <div className='text-[#666] main-font-none normal-case text-xs mt-2'>The current experience value is {userInfo.total}, and it still needs {userInfo.needValue} <TokenName address={config.LEVEL_TOKEN} /> to upgrade to LV{userInfo.level + 1}.</div>}

                                    <div className='mt-2'>
                                        {isUp ? <span>Balance: <TokenBalance token={config.LEVEL_TOKEN} decimalPlaces={2} /></span> :
                                            <span>Amount that can be reduced: {userInfo.equity}</span>}

                                        <span className='ml-1'><TokenName address={config.LEVEL_TOKEN} /></span>
                                    </div>


                                    <div className='flex items-center mt-4'>
                                        <input className="text-white  caret-[#999] border border-gray-700 border-solid block bg-[#444]  w-full  rounded-md py-2 px-3 focus:outline-none placeholder-gray-400" value={amount} placeholder={""} onChange={(event) => {
                                            const value = event.target.value;
                                            let realValue = verify(value)
                                            setAmount(realValue)

                                        }} />
                                        <span className='ml-1'><TokenName address={config.LEVEL_TOKEN} /></span>
                                    </div>


                                    <div className="mt-6 text-center">
                                        <AnimationButton
                                            onClick={increaseEquity}
                                        >
                                            {loading == 2 ? "Loading..." : (!isUp ? "Decrease Equity" : "Increase Equity")}
                                        </AnimationButton>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}