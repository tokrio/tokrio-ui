import { useEffect, useState } from "react"
import { signMessage, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { chainConfig } from "../WalletConfig";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import TokenName from "../components/TokenName";
import TokenDecimals from "../components/TokenDecimals";
import toast from "react-hot-toast";
import formatStringNumber, { showErr } from "../util/utils";
import { config } from "../config/env";
import { FaCopy, FaWallet } from "react-icons/fa";
import CopyToClipboard from 'react-copy-to-clipboard';
import { api, tokenStorage } from "../services/api";
import { getReadData, IResponse } from "../contract/api";
import { EventsAbi } from "../abi/Abi";
import Navbar from "../components/Navbar";

interface Item {
    id: number;
    projectId: number;
    eventName: string;
    eventDescription: string;
    eventType: number;
    eventTime: string;
    valid: number;
}

export const ClaimAirdrop = () => {

    const [list, setList] = useState<Item[]>([])
    const [open, setOpen] = useState<boolean>(false);
    const [item, setItem] = useState<Item | null>(null)
    const [loading, setLoading] = useState<number>(0);
    const [amount, setAmount] = useState<string>("0");
    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [dataLoading, setDataLoading] = useState<boolean>(false);
    const [noAirdrop, setNoAirdrop] = useState<boolean>(false);
    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [sign, setSign] = useState<string>("");
    const { address } = useAccount();
    const { openConnectModal } = useConnectModal()

    useEffect(() => {
        getAirdropList();
    }, []);


    const getAirdropList = async () => {
        const response = await api.getEventList();
        if (response.code === 200 && response.body) {
            setList([...response.body]);
        } else {
            setList([]);
        }
    }

    useEffect(() => {
        if (sign && open) {
            getClaimStatus();
        }
    }, [open, sign])

    const getClaimStatus = async () => {
        const { data, code }: IResponse = await getReadData("isAirdropClaimed", EventsAbi, config.Events, [sign])
        if (code === 200 && data) {
            setIsClaimed(data)
        }
    }

    const claim = async () => {

        if (loading === 2) {
            return
        }
        setLoading(2)
        try {
            const args = [
                sign,
                item?.id,
                tokenAddress,
                amount
            ]
            console.log("args:", args);
            const hash = await writeContract(chainConfig, {
                address: config.Events as `0x${string}`,
                abi: EventsAbi,
                functionName: 'claimEventAirdrop',
                args: args
            })
            console.log("hash:", hash);
            //const hash = await writeContract(config)
            const receipt: any = await waitForTransactionReceipt(chainConfig, {
                hash: hash
            })
            console.log("receipt:", receipt);
            if (receipt.status && receipt.status.toString() === "success") {
                setLoading(1)
                toast.success("Claimed successful.");
            } else {
                setLoading(0)
                toast.error("Claimed failed.");
            }
        } catch (error) {
            setLoading(0)
            const msg = showErr(error)
            toast.error(msg);
        }
    }

    const login = async (item: Item) => {
        if (!address && openConnectModal) {
            openConnectModal();
            return
        }

        if (tokenStorage.getToken()) {
            showClaimInfo(item)
            return
        }

        let now = new Date().getTime()

        let message = `Welcome to Tokrio!\n\nClick to sign in and experience the AI-powered crypto trading ecosystem based on TAST (Trend Analysis & SuperTrend Technology).\n\nThis action will not initiate a blockchain transaction or incur any gas fees.\n\nWallet address:\n${(address as `0x${string}`).toLowerCase()}\n\nNonce:\n${now}`

        try {

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
                showClaimInfo(item)
            }

        } catch (error) {
            console.log("error=", error)
        }
    }

    const showClaimInfo = async (item: Item) => {
        setItem(item);
        setOpen(true);
        setDataLoading(true);
        const response = await api.getEventSign(
            {
                address:address,
                projectId: item.projectId,
                eventId: item.id,
                eventType: item.eventType,
            }
        );
        if (response.code === 200 && response.body) {
            let body = response.body;
            if (!body.param) {
                setNoAirdrop(true);
                setAmount("0");
                setDataLoading(false);
                return
            }
            setNoAirdrop(false);
            let params = body.param.split(",");
            setAmount(params[0]);
            setTokenAddress(params[1]);
            setSign(body.sign)
            setDataLoading(false);
        } else {
            setNoAirdrop(true);
            setAmount("0");
            setDataLoading(false);
        }

    }

    
    const copyToast = (text: string, result: boolean) => {
        toast.success('Copied to clipboard');
    };

    return (
        <div className="px-4 mx-auto w-full flex flex-col items-center">
             <Navbar />
            <h1 className="main-font font-bold mt-20 text-center uppercase text-main-color my-6 text-lg">Available Airdrops.</h1>

            <div className="airdrop-list max-w-4xl w-full">
                {list && list.map((item) => (
                    <div className="border-main-color p-4 text-black" key={item.id}>
                        <div className="font-bold">{item.eventTime}</div>
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-bold">{item.eventName}</div>
                            <button className="px-8 font-bold py-2 rounded-full text-white bg-main-color" onClick={() => login(item)}>Claim</button>
                        </div>
                        <div className="text-gray-400">
                            {item.eventDescription}
                        </div>
                    </div>
                ))}
            </div>

            {open && item && <div className="modal" id="claimModal">
                {dataLoading?'Loading...':<div className="modal-content text-black">
                    <div className="modal-title">Claim Airdrop</div>
                    {noAirdrop?<div className="modal-message">The current account does not meet the conditions for collection. You can follow the <a target="_blank" rel="noreferrer" href={'https://x.com/tokrio_com'} className=" underline text-main-color border-[#593AB9] font-bold">Official Twitter</a> to participate in the collection.</div>:  <div className="mb-2 text-black">
                        Are you sure you want to claim <span className="font-bold text-main-color"><TokenDecimals token={tokenAddress} amount={amount} /> <TokenName address={tokenAddress} /></span> from <span id="modalEvent">{item.eventName}</span>?
                    </div>}
                    {tokenAddress && <div className="flex items-center justify-start">
                        <span className="truncate1 text-main-color">
                            {formatStringNumber(tokenAddress, 8, -8)}
                        </span>
                        {/* <FaWallet
                            onClick={(e) => {
                                e.stopPropagation();
                                importTo(tokenAddress);
                            }}
                            className="ml-2 opacity-50 cursor-pointer hover:opacity-100"
                        /> */}
                        <CopyToClipboard text={tokenAddress} onCopy={copyToast}>
                            <FaCopy
                                className="ml-2 opacity-50 cursor-pointer hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </CopyToClipboard>
                    </div>}
                    {/* <div className="flex items-center border w-fit px-2 py-2 rounded-md border-[#593AB9] cursor-pointer hover:bg-[#593AB9]/10" onClick={async (e) => {
                        e.stopPropagation();
                        importTo(tokenAddress);
                    }}>
                        <FaWallet className="mr-2 opacity-100 text-[#593AB9]" />
                        Add to wallet
                    </div> */}
                    <div className="modal-buttons mt-2">
                        <button className="modal-button cancel" onClick={() => {
                            setOpen(false);
                        }}>Cancel</button>
                        {
                          noAirdrop?<></>:  isClaimed ? <button disabled={true} className="modal-button bg-main-color text-white cursor-not-allowed">Claimed</button> : <button className="modal-button confirm" onClick={claim}>{loading === 2 ? 'Loading...' : 'Claim'}</button>
                        }
                    </div>
                </div>}
            </div>}
        </div>
    )

}