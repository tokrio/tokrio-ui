import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiKey, api, TokenPair, TokenPairsGroup } from '../services/api';
import { AddAssetCexConfig, NewTradingPairConfig, NewTradingPairGroupConfig } from '../types/trading';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import toast, { Toaster } from 'react-hot-toast';

interface TradingPairManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  apiKeys: ApiKey[];
}

const CexAddToken: React.FC<TradingPairManagerProps> = ({
  isOpen,
  onClose,
  onSave,
  apiKeys
}) => {
  const [formData, setFormData] = useState<AddAssetCexConfig>({
    tokenSymbol: '',
    apiKeyId: '',
    usdtAmount: ''
  });

  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTokenPairs = async () => {
      try {
        setLoading(true);
        const response = await api.getCexTokenList();
        if (response.code === 200 && response.body.data) {
          setTokenList([...response.body.data]);
          if (response.body.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              tokenSymbol: response.body.data[0].tokenSymbol,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch token pairs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTokenPairs();
    }
  }, [isOpen]);


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!formData.apiKeyId) {
      toast.error('Please select an API key.');
      return;
    }
    if (!formData.tokenSymbol) {
      toast.error('Please select a token.');
      return;
    }

    if (!formData.usdtAmount || Number(formData.usdtAmount) <= 0) {
      toast.error('Please enter USDT amount.');
      return;
    }

    if (addLoading) {
      return
    }
    setAddLoading(true)

    try {
      const param = {
        apiKeyId: Number(formData.apiKeyId),
        tokenSymbol: formData.tokenSymbol,
        usdtAmount: Number(formData.usdtAmount),
      }
      const response = await api.addCexToken(param);
      if (response.code === 200) {
        setAddLoading(false)
        onSave()
        onClose();
      } else {
        setAddLoading(false)
        toast.error(response.message??'Add token failed.');
      }
    } catch (error) {
      setAddLoading(false)
      console.error('Failed to create API key:', error);
    }


  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <Toaster />
        <h2 className="text-xl font-bold text-white mb-6">Add Trading Asset</h2>
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading trade set...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select API Key
              </label>
              <Listbox value={formData.apiKeyId} onChange={(value) => setFormData({ ...formData, apiKeyId: value })}>
                <div className="relative">
                  <ListboxButton className="w-full text-left bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    {formData.apiKeyId ? apiKeys.find(key => key.id + "" === formData.apiKeyId + "")?.apiName : 'Select an API Key'}
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                      aria-hidden="true"
                    />
                  </ListboxButton>
                  <ListboxOptions className="mt-1 z-50 absolute h-40 w-full overflow-auto bg-gray-700 border border-gray-600 rounded-md py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
                   
                    {apiKeys.map((key) => (
                      <ListboxOption key={key.id} value={key.id}>
                        {({ selected }) => (
                          <div className={`cursor-pointer select-none relative py-2 px-4 ${selected ? 'text-white' : 'text-gray-300'}`}>
                            {key.apiName} ({key.platform})
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select token
              </label>
              <Listbox value={formData.tokenSymbol} onChange={(value) => {
                setFormData({ ...formData, tokenSymbol: value })
              }}>
                <div className="relative">
                  <ListboxButton className="w-full text-left bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    {formData.tokenSymbol || 'Select a token'}
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                      aria-hidden="true"
                    />
                  </ListboxButton>
                  <ListboxOptions className="mt-1 absolute max-h-60 w-full overflow-auto bg-gray-700 border border-gray-600 rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                   
                    {tokenList.map((item:any) => (
                      <ListboxOption key={item.tokenSymbol} value={item.tokenSymbol}>
                        {({ selected }) => (
                          <div className={` cursor-pointer select-none relative py-2 px-4 ${selected ? 'text-amber-400' : 'text-gray-300'}`}>
                            {item.tokenSymbol}
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                USDT Trading Amount
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter USDT amount"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={formData.usdtAmount + ''}
                onChange={(e) => setFormData({ ...formData, usdtAmount: e.target.value })}
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
                disabled={addLoading}
                type="submit"
                className="px-4 py-2 bg-[#412700] border text-white rounded-lg border-[#FFA41C] hover:bg-[#000]"
              >
                {addLoading ? "Loading..." : "Add Asset"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default CexAddToken; 