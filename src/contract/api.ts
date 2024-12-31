import { readContract } from "@wagmi/core";
import { chainConfig } from "../WalletConfig";
import { erc20Abi } from "viem";

// Response Interface
export interface IResponse {
    code: number;
    message: string;
    data: any;
}

// Get Token Balance
export const fetchBalanceObj = async (address: string | undefined, token: string) => {
    try {
        const decimals: any = await readContract(chainConfig, {
            address: token as `0x${string}`,
            abi: erc20Abi,
            functionName: 'decimals',
            args: []
        });

        const balance: any = await readContract(chainConfig, {
            address: token as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address as `0x${string}`]
        });

        return {
            decimals,
            value: balance.toString(),
            formatted: (Number(balance.toString()) / Math.pow(10, decimals)).toString()
        };
    } catch (error) {
        console.error('Error fetching balance:', error);
        return {
            decimals: 18,
            value: '0',
            formatted: '0'
        };
    }
};

// Read Contract Data
export const getReadData = async (functionName: string, abi: any, address: string, args: any[]) => {
    try {
        const data: any = await readContract(chainConfig, {
            address: address as `0x${string}`,
            abi: abi,
            functionName: functionName,
            args: args
        });
        return {
            code: 200,
            message: 'success',
            data: data
        };
    } catch (error) {
        console.error('Error reading contract data:', error);
        return {
            code: 500,
            message: 'error',
            data: null
        };
    }
};