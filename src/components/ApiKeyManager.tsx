import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface ApiKey {
  id: string;
  name: string;
  exchange: string;
  apiKey: string;
  apiSecret: string;
  createdAt: Date;
}

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: ApiKey) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<ApiKey, 'id' | 'createdAt'>>({
    name: '',
    exchange: 'Binance',
    apiKey: '',
    apiSecret: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date()
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
        <h2 className="text-xl font-bold text-white mb-6">Add New API Key</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="My Binance Account"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Exchange
            </label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.exchange}
              onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
            >
              <option value="Binance">Binance</option>
              <option value="Huobi">Huobi</option>
              <option value="OKX">OKX</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Key
            </label>
            <input
              type="text"
              placeholder="Enter your API key"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Secret
            </label>
            <input
              type="password"
              placeholder="Enter your API secret"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.apiSecret}
              onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
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
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ApiKeyManager; 