import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ApiKey } from './ApiKeyManager';
import { NewTradingPairConfig } from '../types/trading';

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
  const [formData, setFormData] = useState<Omit<NewTradingPairConfig, 'id' | 'createdAt' | 'trend' | 'enabled'>>({
    symbol: 'BTC/USDT',
    initialUSDT: 100,
    apiKeyId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date(),
      trend: 'Neutral',
      enabled: false
    });
    onClose();
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Trading Pair
            </label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              required
            >
              <option value="BTC/USDT">BTC/USDT</option>
              <option value="ETH/USDT">ETH/USDT</option>
              <option value="SOL/USDT">SOL/USDT</option>
              <option value="BNB/USDT">BNB/USDT</option>
              <option value="XRP/USDT">XRP/USDT</option>
            </select>
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Select API Key
            </label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.apiKeyId}
              onChange={(e) => setFormData({ ...formData, apiKeyId: e.target.value })}
              required
            >
              <option value="">Select an API Key</option>
              {apiKeys.map((key) => (
                <option key={key.id} value={key.id}>
                  {key.name} ({key.exchange})
                </option>
              ))}
            </select>
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
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Add Trading Pair
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TradingPairManager; 