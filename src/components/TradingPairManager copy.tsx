import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiKey, api, TokenPair } from '../services/api';
import { NewTradingPairConfig } from '../types/trading';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';

interface TradingPairManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pairConfig: NewTradingPairConfig) => void;
  apiKeys: ApiKey[];
}

const TradingPairManager: React.FC<TradingPairManagerProps> = ({
  isOpen,
  onClose,
  onSave,
  apiKeys
}) => {
  const [formData, setFormData] = useState<Omit<NewTradingPairConfig, 'id' | 'createdAt' | 'trending' | 'enabled'>>({
    symbol: '',
    initialUSDT: 100,
    apiKeyId: ''
  });

  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenPairs = async () => {
      try {
        setLoading(true);
        const response = await api.listTokenPairs();
        if (response.code === 200) {
          setTokenPairs(response.body.pairs);
          if (response.body.pairs.length > 0) {
            setFormData(prev => ({
              ...prev,
              symbol: response.body.pairs[0].tokenSymbol
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
    try {
      const response = await api.addTokenPairs({
        tokenSymbol: formData.symbol,
        apiKeyId: Number(formData.apiKeyId),
        usdtAmount: formData.initialUSDT
      });
      if (response.code === 200) {
        onSave({
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date(),
          trending: -1,
          enabled: false
        });
        onClose();
      }
    } catch (error) {
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
        <h2 className="text-xl font-bold text-white mb-6">Add New Trading Pair</h2>
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading trading pairs...</div>
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
                    <ListboxOption value="">
                      {({ selected }) => (
                        <div className={`cursor-default select-none relative py-2  px-4 ${selected ? 'text-white' : 'text-gray-300'}`}>
                          Select an API Key
                        </div>
                      )}
                    </ListboxOption>
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
                Trading Pair
              </label>
              <Listbox value={formData.symbol} onChange={(value) => setFormData({ ...formData, symbol: value })}>
                <div className="relative">
                  <ListboxButton className="w-full text-left bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    {formData.symbol || 'Select a trading pair'}
                    <ChevronDownIcon
                      className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                      aria-hidden="true"
                    />
                  </ListboxButton>
                  <ListboxOptions className="mt-1 absolute max-h-60 w-full overflow-auto bg-gray-700 border border-gray-600 rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption value="">
                      {({ selected }) => (
                        <div className={`cursor-default select-none relative py-2 px-4 ${selected ? 'text-white' : 'text-gray-300'}`}>
                          Select a trading pair
                        </div>
                      )}
                    </ListboxOption>
                    {tokenPairs.map((pair) => (
                      <ListboxOption key={pair.tokenSymbol} value={pair.tokenSymbol}>
                        {({ selected }) => (
                          <div className={` cursor-pointer select-none relative py-2 px-4 ${selected ? 'text-white' : 'text-gray-300'}`}>
                            {pair.tokenSymbol} (${pair.currentPrice})
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
                Initial USDT Amount
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter USDT amount"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={formData.initialUSDT}
                onChange={(e) => setFormData({ ...formData, initialUSDT: Number(e.target.value) })}
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
                className="px-4 py-2 bg-[#412700] border text-white rounded-lg border-[#FFA41C] hover:bg-[#000]"
              >
                Add Trading Pair
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default TradingPairManager; 