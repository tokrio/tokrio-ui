import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreateApiKeyRequest } from '../services/api';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateApiKeyRequest) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    apiKey: '',
    apiSecretKey: '',
    platform: 'binance',
    apiName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      apiKey: '',
      apiSecretKey: '',
      platform: 'binance',
      apiName: ''
    });
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
              API Key Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.apiName}
              onChange={(e) => setFormData({ ...formData, apiName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Platform
            </label>
            <Listbox value={formData.platform} onChange={(value) => setFormData({ ...formData, platform: value })}>
              <div className="relative">
                <ListboxButton className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-left">
                  {formData.platform}
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions className="absolute  h-40 w-full overflow-auto mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg z-10">
                  <ListboxOption value="binance" className="cursor-pointer  select-none relative py-2 px-3 text-white hover:bg-gray-600">
                    binance
                  </ListboxOption>
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Key
            </label>
            <input
              type="text"
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
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.apiSecretKey}
              onChange={(e) => setFormData({ ...formData, apiSecretKey: e.target.value })}
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
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ApiKeyManager; 