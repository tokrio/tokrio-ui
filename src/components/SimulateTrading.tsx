import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, SimulateResult, TokenPair } from '../services/api';

interface SimulateTradingProps {
  tokenPairs: TokenPair[];
}

const SimulateTrading: React.FC<SimulateTradingProps> = ({ tokenPairs }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulateResult | null>(null);
  const [formData, setFormData] = useState({
    tokenSymbol: '',
    usdtAmount: '',
    startDate: '2022-11-01',
    endDate: '2026-11-01'
  });

  useEffect(()=>{
    getSimulate()
  },[])

  const getSimulate = async() => {
    setLoading(true);
    try {
      let data = {...formData, usdtAmount: Number(formData.usdtAmount)}
      const response = await api.simulate(data);
      if (response.code === 200) {
        setResult(response.body);
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    getSimulate()
  };

  return (
    <div className="bg-card  rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white">Trading Simulator</h3>
        <p className="text-sm text-gray-400 mt-1">
          Test your trading strategy with historical data
        </p>
      </div>

      <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Trading Pair
          </label>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={formData.tokenSymbol}
            onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
            required
          >
            <option value="">Select a trading pair</option>
            {tokenPairs.map((pair) => (
              <option key={pair.tokenSymbol} value={pair.tokenSymbol}>
                {pair.tokenSymbol} (${pair.currentPrice})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            USDT Amount
          </label>
          <input
            type="number"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={formData.usdtAmount}
            onChange={(e) => setFormData({ ...formData, usdtAmount: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 cta-button disabled:opacity-50"
          >
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">Initial Capital</div>
              <div className="text-xl font-bold text-white">
                ${result.initialCapital.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">Final Capital</div>
              <div className="text-xl font-bold text-white">
                ${result.finalCapital.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400">Profit</div>
              <div className={`text-xl font-bold ${result.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.profitPercent >= 0 ? '+' : ''}{result.profitPercent.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    USDT Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {result.trades.map((trade, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${trade.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trade.amount.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${trade.usdtValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulateTrading; 