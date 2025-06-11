import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreateApiKeyRequest, Position, TokenBalanceProps, WithdrwaRequest } from '../services/api';
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
import { on } from 'events';

interface DepositProps {
  isOpen: boolean;
  item: Position;
  onClose: () => void;
  onSave: () => void;
}

export const WithdrawTokenPop: React.FC<DepositProps> = ({ isOpen,item, onClose,onSave }) => {
  const [formData, setFormData] = useState<WithdrwaRequest>({
    tokenAddress: item.tokenAddress || "",
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

    if(new BigNumber(formData.amount).isGreaterThan(new BigNumber(item.tokenAmount))){
      toast.error("Insufficient balance.")
      return
    }

    if (loading == 2) {
      return
    }

    setLoading(2);

    try {

      let decimals = 18
      let { data, code }: IResponse = await getReadData("decimals", erc20Abi, item.tokenAddress, [])

      if (code == 200) {
        decimals = data
      } else {
        setLoading(0);
        toast.error("Please check your chain, try it again.")
        return
      }

      let realAmount = new BigNumber(formData.amount).multipliedBy(new BigNumber(10).pow(decimals)).toFixed(0).toString()

      
      const hash = await writeContract(chainConfig, {
        address: config.ProxyTrading as `0x${string}`,
        abi: ProxyTradingAbi,
        functionName: 'withdraw',
        args: [item.tokenAddress, realAmount]
      });

      const depositData: any = await waitForTransactionReceipt(chainConfig, {
        hash: hash
      })

      if (depositData.status && depositData.status.toString() == "success") {
        toast.success('Withdraw successfully');
        onClose();
        onSave();
        setLoading(1);
      } else {
        toast.error('Withdraw Failed!');
        setLoading(0);
        return

      }
    } catch (error) {
     // toast.error('Withdraw Failed!');
      toast.error(showErr(error));
      setLoading(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 text-sm  backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className=" rounded-lg p-6 w-full border border-gray-400/60 max-w-md"
      >
        <h2 className="text-xl font-bold text-white mb-3 text-center">Withdraw</h2>

        <div className='text-amber-400'>Balance:{item.tokenAmount} {item.tokenSymbol.replace("USDT","")}</div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div>
            <label className="block font-medium text-gray-300 my-1">
              Enter Amount
            </label>
            <input
              type="text"
              className="w-full bg-gray-800 mt-2 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 cta-button"
            >
              {loading === 2 ? 'Loading...' : 'Ok'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
