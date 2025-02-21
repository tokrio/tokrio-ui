import React, { forwardRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, SimulateResult, TokenPair } from '../services/api';
import { commonLocal } from '../util/utils';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface SimulateTradingProps {
  tokenPairs: TokenPair[];
}

const SimulateTrading: React.FC<SimulateTradingProps> = ({ tokenPairs }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulateResult | null>(null);
  const [formData, setFormData] = useState({
    tokenSymbol: '',
    usdtAmount: '',
    startDate: '2024-11-01',
    endDate: commonLocal(new Date().getTime()),
  });

  useEffect(() => {
    getSimulate()
  }, [])

  const getSimulate = async () => {
    setLoading(true);
    try {
      let data = { ...formData, usdtAmount: Number(formData.usdtAmount) }
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
          <Listbox value={formData.tokenSymbol} onChange={(value) => setFormData({ ...formData, tokenSymbol: value })}>
            <div className="relative">
              <ListboxButton className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-left">
                {formData.tokenSymbol ? formData.tokenSymbol : 'Select a trading pair'}
                <ChevronDownIcon
                  className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions className="absolute mt-1 w-full bg-gray-700 border border-gray-600 rounded shadow-lg z-10 max-h-44 overflow-auto">
                {tokenPairs.map((pair) => (
                  <ListboxOption
                    key={pair.tokenSymbol}
                    value={pair.tokenSymbol}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 px-4 ${active ? 'bg-gray-600 text-white' : 'text-gray-300'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {pair.tokenSymbol} (${pair.currentPrice})
                        </span>
                        {/* {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                      ✓
                      </span>
                    ) : null} */}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
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
          <DatePicker
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            selected={formData.startDate}
            onChange={(date: any) => {
              console.log(date)
              //console.log(getTime(date))
              setFormData({ ...formData, startDate: date })
            }}
            // customInput={<CustomInput />}
            // timeFormat="HH:mm"
            style={{ width: '100%' }}
            // timeIntervals={10}
            timeCaption="time"
            dateFormat="yyyy-MM-dd"
          />
          {/* <input
            type="date"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          /> */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            End Date
          </label>
          <DatePicker
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            selected={formData.endDate}
            onChange={(date: any) => {
              console.log(date)
              setFormData({ ...formData, endDate: date })
            }}
            style={{ width: '100%' }}
            timeCaption="time"
            dateFormat="yyyy-MM-dd"
          />
          {/* <input
            type="date"
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          /> */}
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
                      <span className={`px-2 py-1 rounded-full text-xs ${trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
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


const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
  // <input onClick={onClick} ref={ref} onChange={(e) => {
  //     setSt(e.target.value)
  // }} value={st} placeholder="18" className="placeholder:text-slate-700 text-slate-300 focus:outline-none border rounded p-2  border-gray-600 w-full bg-[#14151A]" />
  <button  className="placeholder:text-slate-700 w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-left focus:outline-none" onClick={onClick} ref={ref}>
      {value}
  </button>
));