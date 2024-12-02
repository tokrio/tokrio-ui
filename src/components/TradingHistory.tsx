import React from 'react';
import { motion } from 'framer-motion';
import { TradeHistory, TradingPairConfig } from '../types/trading';

interface TradingHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  tradingPair: TradingPairConfig;
  history: TradeHistory[];
}

const TradingHistory: React.FC<TradingHistoryProps> = ({
  isOpen,
  onClose,
  tradingPair,
  history
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {tradingPair.symbol} Trading History
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Initial USDT: {tradingPair.initialUSDT}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No trading history yet.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((trade) => (
                <div
                  key={trade.id}
                  className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.type}
                        </span>
                        <span className="text-gray-400 text-sm">
                          Order ID: {trade.orderId}
                        </span>
                      </div>
                      <div className="text-white font-medium mt-1">
                        Price: ${trade.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">
                        {trade.timestamp.toLocaleString()}
                      </div>
                      <div className="text-white font-medium mt-1">
                        Amount: {trade.amount.toFixed(6)} {tradingPair.symbol.split('/')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Total</div>
                        <div className="text-white">
                          ${trade.total.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Balance After Trade</div>
                        <div className="space-y-1">
                          <div className="text-white">
                            USDT: ${trade.balanceAfter.usdt.toFixed(2)}
                          </div>
                          <div className="text-white">
                            {tradingPair.symbol.split('/')[0]}: {trade.balanceAfter.token.toFixed(6)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TradingHistory; 