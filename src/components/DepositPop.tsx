import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreateApiKeyRequest, WithdrwaRequest } from '../services/api';
import { config } from '../config/env';
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { ProxyTradingAbi } from '../abi/Abi';
import { chainConfig } from '../WalletConfig';
import { getReadData, IResponse } from '../contract/api';
import toast from 'react-hot-toast';
import { erc20Abi, maxUint256 } from 'viem';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { showErr } from '../util/utils';

interface DepositProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositPop: React.FC<DepositProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<WithdrwaRequest>({
    tokenAddress: config.USDT_TOKEN,
    amount: '',
  });
  const [loading, setLoading] = useState(0);
  const { address } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.amount == '' || new BigNumber(formData.amount).isLessThan(0)){
      toast.error("Please enter a valid amount.")
      return
    }
    if (loading == 2) {
      return
    }

    setLoading(2);



    try {

      let decimals = 6
      let { data, code }: IResponse = await getReadData("decimals", erc20Abi, formData.tokenAddress, [])

      if (code == 200) {
        decimals = data
      } else {
        setLoading(0);
        toast.error("Check your rpc, try it again...")
        return
      }

      let realAmount = new BigNumber(formData.amount).multipliedBy(new BigNumber(10).pow(decimals)).toFixed(0)

      const allowance: any = await readContract(chainConfig, {
        address: config.USDT_TOKEN as '0x',
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, config.ProxyTrading as `0x${string}`],
      })

      if (new BigNumber(allowance.toString()).isLessThan(realAmount + "")) {

        const approveHash = await writeContract(chainConfig, {
          address: config.USDT_TOKEN as '0x',
          abi: erc20Abi,
          functionName: 'approve',
          args: [config.ProxyTrading as `0x${string}`, BigInt(realAmount)],
          account: address
        })
        const approveData: any = await waitForTransactionReceipt(chainConfig, {
          hash: approveHash
        })

        if (approveData.status && approveData.status.toString() == "success") {

        } else {
          toast.error('Your wallet failed allowed assets deduction!');
          setLoading(0);
          return

        }
      }
      const hash = await writeContract(chainConfig, {
        address: config.ProxyTrading as `0x${string}`,
        abi: ProxyTradingAbi,
        functionName: 'deposit',
        args: [formData.tokenAddress, realAmount]
      });

      const depositData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (depositData.status && depositData.status.toString() == "success") {
        toast.success('Deposit successfully');
        onClose();
        setLoading(1);
      } else {
        toast.error('Deposit Failed!');
        setLoading(0);
        return

      }
    } catch (error) {
      console.error('Deposit Failed:', error);
      toast.error(showErr(error));
      setLoading(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className=" rounded-lg p-6 w-full border border-gray-400/60 max-w-md"
      >
        <h2 className="text-xl font-bold text-white mb-6">Deposit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Enter USDT Amount
            </label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg min-w-20 hover:bg-gray-600"
            >
              <div className=' min-w-20'>Cancel</div>
            </button>
            <button
              type="submit"
              className="px-4 py-2 cta-button"
            >
              <div className=' min-w-20'> {loading === 2 ? 'Loading...' : 'Ok'}</div>
             
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
