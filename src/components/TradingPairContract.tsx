import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiKey, api, TokenPair, TokenPairsGroup, TokenBalanceProps } from '../services/api';
import { NewTradingPairConfig, TradingPairContractConfig } from '../types/trading';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { showErr } from '../util/utils';
import BigNumber from 'bignumber.js';

interface TradingPairContractProps {
  isOpen: number;
  usdtBalance: TokenBalanceProps;
  onClose: () => void;
  onSave: () => void;
}

export const TradingPairContract: React.FC<TradingPairContractProps> = ({
  isOpen,
  onClose,
  usdtBalance,
  onSave
}) => {
  const { address, chainId } = useAccount();
  const [tokenPairsGroup, setTokenPairsGroup] = useState<TokenPairsGroup[]>([]);
  const [formData, setFormData] = useState<TradingPairContractConfig>({
    groupId: 0,
    groupName: '',
    chainId: chainId,
    initialUsdt: ''
  });
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTokenPairs = async () => {
      try {
        setLoading(true);
        const response = await api.listTokenPairsGroup();
        if (response.code === 200 && response.body.data) {
          setTokenPairsGroup([...response.body.data]);
          if (response.body.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              groupId: response.body.data[0].id,
              groupName: response.body.data[0].groupName
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch token pairs:', error);
      } finally {
        setLoading(false);
      }
    };

    setFormData({
      groupId: 0,
      groupName: '',
      chainId: chainId,
      initialUsdt: ''
    });

    if (isOpen !== 0) {
      setAddLoading(false);
      fetchTokenPairs();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.groupId === 0) {
        toast.error('Please select a trading pair.');
        return;

      }

      if (!formData.groupName) {
        toast.error('Please enter a group name.');
        return;
      }

      if (isOpen === 2 && (!formData.initialUsdt || Number(formData.initialUsdt) <= 0)) {
        toast.error('Please enter the initial USDT amount.');
        return;
      }

      if (addLoading) {
        return
      }
      setAddLoading(true)

      if (isOpen === 1) {
        const response = await api.setTradeTokens({
          chainId: formData.chainId,
          groupId: Number(formData.groupId),
          initialUsdt: 0
        });

        if (response.code === 200) {
          console.log('Trading pair added successfully:', response.body);
          toast.success('Add Trading Asset successfully.');
          onSave();
          onClose();
        } else {
          toast.error('Add Trading Asset failed.');
        }
        setAddLoading(false)
      } else {
        const response = await api.setTradeTokeUSDT({
          totalUsdt: new BigNumber(formData.initialUsdt).multipliedBy(10 ** usdtBalance.decimals).toFixed(0).toString(),
        });

        if (response.code === 200) {
          toast.success('Set Trading USDT successfully.');
          onSave();
          onClose();
        } else {
          toast.error('Set Trading USDT failed.');
        }
        setAddLoading(false)
      }




    } catch (error) {
      setAddLoading(false)
      toast.error(showErr(error));
      console.error('Failed to create API key:', error);
    }


  };

  if (!isOpen || isOpen === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-white mb-6">{isOpen == 1 ? 'Add Trading Asset' : 'Set Trading USDT'}</h2>
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading trading data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {isOpen === 1 && <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select Trade Set
              </label>
              <Listbox value={formData.groupId} onChange={(value) => {
                const group = tokenPairsGroup.find(pair => pair.id + "" === value + "")
                // if (group) {
                //   setFormData({...formData, groupName: group.groupName })
                // }
                setFormData({ ...formData, groupId: value, groupName: group?.groupName ?? '' })
              }}>
                <div className="relative">
                  <ListboxButton className="w-full text-left bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    {formData.groupName || 'Select a trading pair'}
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                      aria-hidden="true"
                    />
                  </ListboxButton>
                  <ListboxOptions className="mt-1 absolute max-h-60 w-full overflow-auto bg-gray-700 border border-gray-600 rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption value="">
                      {({ selected }) => (
                        <div className={`cursor-default select-none relative py-2 px-4 ${selected ? 'text-white' : 'text-gray-300'}`}>
                          Select a Trade Set
                        </div>
                      )}
                    </ListboxOption>
                    {tokenPairsGroup.map((pair) => (
                      <ListboxOption key={pair.id} value={pair.id}>
                        {({ selected }) => (
                          <div className={` cursor-pointer select-none relative py-2 px-4 ${selected ? 'text-amber-400' : 'text-gray-300'}`}>
                            {pair.groupName}-<span className='text-gray-500'>({pair.groupDescription})</span>
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>}

            {isOpen === 2 && <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Initial USDT Amount
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter USDT amount"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={formData.initialUsdt}
                onChange={(e) => setFormData({ ...formData, initialUsdt: (e.target.value) })}
                required
              />
            </div>}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                disabled={addLoading}
                type="submit"
                className="px-4 py-2 bg-[#412700] border text-white rounded-lg border-[#FFA41C] hover:bg-[#000]"
              >
                {addLoading ? "Loading..." : (isOpen === 1 ? "Add Trading Asset" : "Set Trading USDT")}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
