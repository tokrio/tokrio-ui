import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Address } from "viem";
import { fetchBalanceObj } from "../contract/api";
import { useAccount } from "wagmi";

interface ITokenBalance {
    token: string,
    addr?: string,
    decimalPlaces: number,
    isLoading?: boolean,
}

export default function TokenBalance({ token, addr, decimalPlaces = 2, isLoading }: ITokenBalance) {

    const { address } = useAccount();
    const [balance, setBalance] = useState<string>('0');

    useEffect(() => {

        if (token) {
            getChainTokenBalance();
        }


    }, [token, address, addr, isLoading]);

    const getChainTokenBalance = async () => {

        const balanceObj = await fetchBalanceObj((addr || address) as Address, token)
        
        setBalance(balanceObj.formatted);


    }


    return <>
        {new BigNumber(balance).toFixed(decimalPlaces)}
    </>
}