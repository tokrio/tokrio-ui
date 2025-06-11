import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiKey, api, TokenPair, TokenPairsGroup, SetDexUsdtParam, SetCexUsdtParam, CloseTokenParam, Position } from '../services/api';
import { NewTradingPairConfig, NewTradingPairGroupConfig } from '../types/trading';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import toast from 'react-hot-toast';
import { showErr } from '../util/utils';

interface CloseTokenProps {
    isOpen: boolean;
    tokenSymbol: string;
    item: Position;
    isCex: boolean;
    onClose: () => void;
    onSave: () => void;
}

const CloseToken: React.FC<CloseTokenProps> = ({
    isOpen,
    isCex,
    item,
    tokenSymbol,
    onClose,
    onSave
}) => {


    const [addLoading, setAddLoading] = useState<boolean>(false);


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();



        if (addLoading) {
            return
        }
        setAddLoading(true)

        try {
            let param = {
                tokenSymbol: tokenSymbol,
            };

            let response;
            if (isCex) {
                if(item.active === 1){
                    response = await api.closeCexToken(param);
                } else {
                    response = await api.openCexToken(param);
                }
            } else {
                if(item.active === 1){
                    response = await api.closeDexToken(param);
                } else {
                    response = await api.openDexToken(param);
                }
            }
            if (response.code === 200) {
                setAddLoading(false)
                toast.success('Confirm successfully');
                onSave()
                onClose();
            } else {
                setAddLoading(false)
                toast.error(response.message ?? 'Confirm failed');
            }
        } catch (error) {
            toast.error('Confirm failed');
            setAddLoading(false)
        }


    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 text-white bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
                <h2 className="text-xl font-bold text-white mb-6">
                    {item.active === 1 ? 'Close Trading Bot' : 'Open Trading Bot'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className=' font-bold'>
                        {item.active === 1 ? `Are you sure you want to open the trading bot for ${tokenSymbol}?` : `Are you sure you want to close the trading bot for ${tokenSymbol}?`}
                    </div>
                    <div className='opacity-60'>
                        {item.active === 1 ? `This will stop all automated trading for this token. Your current positions will remain unchanged.`:`This will resume automated trading with your current settings.`}
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
                            className={` ${item.active !== 1?'bg-green-400':'bg-red-600 '} px-4 py-2 text-white rounded-lg`}
                        >
                            {addLoading ? "Loading..." : item.active === 1 ? "Close Trading Bot" : "Open Trading Bot"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CloseToken; 