
import { getBalance,readContract } from '@wagmi/core'
import BigNumber from 'bignumber.js';
import { chainConfig } from '../WalletConfig';
import { NATIVE_ADDRESS } from '../config/constant';


export interface IBalance {
    decimals: number,
    formatted: string,
    symbol: string,
    value: any
}

export interface IResponse {
    data: any,
    code: number
}

export const fetchBalanceFormat = async (account: any, token?: any, fix?: number) => {

    if (!fix) {
        fix = 4
    }
    let balanceFormat: string;

    if(!token){
        token = NATIVE_ADDRESS
    }

    try {
       let tokenObj = await fetchBalanceObj(account, token)
       
        balanceFormat =  new BigNumber(tokenObj.formatted).toFixed(fix).toString();
    } catch (error) {
        balanceFormat = "Check address"
    }
    return balanceFormat;

}

export const fetchBalanceObj = async (account: any, token: any) => {

    if (token == NATIVE_ADDRESS) {
        const balanceObj: IBalance = await getBalance(chainConfig,{
            address: account
        })
        console.log(balanceObj)
        return balanceObj
    } else {
        const balanceObj: IBalance = await getBalance(chainConfig,{
            address: account,
            token: token
        })
        console.log(balanceObj)
        return balanceObj
    }

}


export const getReadData = async (method: any, abi: any, address: any, args: any, account?: any) => {
    let response: IResponse

    try {
        if (account) {

            let data: any = await readContract(chainConfig,{
                address: address,
                abi: abi,
                functionName: method,
                args: args,
                account
            })
            response = {
                data: data,
                code: 200
            }
        } else {
            let data: any = await readContract(chainConfig,{
                address: address,
                abi: abi,
                functionName: method,
                args: args
            })
            response = {
                data: data,
                code: 200
            }
        }
    } catch (error) {
        response = {
            data: error,
            code: 0
        }
    }

    console.log(method, address, args, response.data)
    return response;
}