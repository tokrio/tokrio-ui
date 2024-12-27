import { useEffect, useState } from "react"
import { getReadData, IResponse } from "../contract/api";
import { erc20Abi } from "viem";
import { NATIVE_ADDRESS } from "../config/constant";



interface Props {
    address: any
}

export default function TokenName({ address }: Props) {


    const [name, setName] = useState<string>("")

    useEffect(() => {
        getName()
    }, [address])

    const getName = async () => {

        if (address == NATIVE_ADDRESS) {
            setName("POL")
            return
        }

        if (localStorage.getItem(address)) {
            setName(localStorage.getItem(address) || "")
            return
        }

        let { data, code }: IResponse = await getReadData("symbol", erc20Abi, address, [])
        if (code == 200) {
            localStorage.setItem(address, data);
            setName(data)
        }
    }

    return <>
        {name}
    </>

}