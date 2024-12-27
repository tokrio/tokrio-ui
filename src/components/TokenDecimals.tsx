import { useCallback, useEffect, useState } from "react";
import { NATIVE_ADDRESS } from "../config/constant";
import { getReadData, IResponse } from "../contract/api";
import { erc20Abi } from "viem";
import { convertFix } from "../util/utils";



interface ITokenDecimals {
    token: string,
    setDecimals?: Function
    tokenType?: number,
    amount?: string,
    fixed?: number,
}

export default function TokenDecimals({ token, tokenType = 20, setDecimals, amount, fixed = 2 }: ITokenDecimals) {

    const [decimal, setDecimal] = useState<number>(18);

    useEffect(() => {
        getDecimal(token)
    }, [token, amount]);


    const getDecimal = (token:string) => {
        if (token == NATIVE_ADDRESS) {
            if (setDecimals) {
                setDecimals(18);
            }
            setDecimal(18)

        } else {
            if (tokenType == 721) {
                setDecimal(0);
            } else {
                getDecimals()
            }

        };
    }

    const getDecimals = async () => {
        let { data, code }: IResponse = await getReadData("decimals", erc20Abi, token, [])
        if (code == 200) {
            if (setDecimals) {
                setDecimals(Number(data.toString()));
            }
            setDecimal(Number(data));
        }
    }

    return amount ? <>{tokenType && tokenType != 20 ? 1 : convertFix(amount, decimal, fixed)}</> : <> </>
}