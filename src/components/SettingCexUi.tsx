import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiKey, api, TokenPair, TokenPairsGroup, SetDexUsdtParam, SetCexUsdtParam } from '../services/api';
import { NewTradingPairConfig, NewTradingPairGroupConfig } from '../types/trading';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import toast from 'react-hot-toast';
import { showErr } from '../util/utils';

interface SettingUiProps {
  isOpen: boolean;
  initUsdt: number;
  tokenAccountId: number;
  onClose: () => void;
  onSave: () => void;
}

const SettingCexUi: React.FC<SettingUiProps> = ({
  isOpen,
  tokenAccountId,
  initUsdt,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<SetCexUsdtParam>({
    tokenAccountId: tokenAccountId,
    usdtAmount: initUsdt + "",
  });

  const [addLoading, setAddLoading] = useState<boolean>(false);


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!formData.usdtAmount || Number(formData.usdtAmount) <= 0) {
      toast.error('Please enter the  USDT amount.');
      return;
    }

    if (addLoading) {
      return
    }
    setAddLoading(true)

    try {
      let param = {
        ...formData,
        tokenAccountId: tokenAccountId,
      };
      const response = await api.setCexUsdt(param);
      if (response.code === 200) {
        setAddLoading(false)
        toast.success('Setting successfully');
        onSave()
        onClose();
      } else {
        setAddLoading(false)
        toast.error(response.message ?? 'Setting failed');
      }
    } catch (error) {
      setAddLoading(false)
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
        <h2 className="text-xl font-bold text-white mb-6">Token Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Current Initial USDT
            </label>
            <div className='text-white'>{initUsdt} USDT</div>
            <label className="block text-sm font-medium mt-4 text-gray-500 mb-1">
              Adjust USDT Amount
            </label>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Enter USDT amount"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              value={formData.usdtAmount + ""}
              onChange={(e) => setFormData({ ...formData, usdtAmount: (e.target.value) })}
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
              {addLoading ? "Loading..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingCexUi; 