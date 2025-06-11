import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TradeHistory, TradingPairConfig } from '../types/trading';
import { api, VaultLog } from '../services/api';
import { useAccount } from 'wagmi';
import ReactPaginate from 'react-paginate';

interface TradingHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  tokenSymbol: string;
}

let page = 1;
const pageSize = 12;

const TradinContractHistory: React.FC<TradingHistoryProps> = ({
  isOpen,
  onClose,
  tokenSymbol
}) => {
  const { address, chainId } = useAccount();
  const [history, setHistory] = React.useState<VaultLog[]>([]);
  const [loadingGroup, setLoadingGroup] = React.useState(false);
  const [total, setTotal] = useState(0)
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      getHistory();
    }
  }, [isOpen])

  const getHistory = async () => {

    setLoadingGroup(true);
    try {
      const response = await api.getVaultLogs({
        chainId: chainId || 0, tokenSymbol: tokenSymbol,
        page: page,
        size: pageSize
      });
      if (response.code === 200 && response.body) {
        setTotal(response.body.total);
        if (response.body.logs && response.body.logs.length > 0) {
          setHistory([...response.body.logs])
        } else {

          setHistory([]);
        }
      }
      setLoadingGroup(false);
    } catch (error) {
      console.log(error);
      setLoadingGroup(false);
    }


  }

  const handlePageClick = (event: any) => {
    page = event.selected + 1;
    getHistory();
};

  return (
    <div className="fixed mx-4 inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-base font-bold text-white">
              Transaction History
            </h2>

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
          {loadingGroup ? (<div className="text-center py-8 text-gray-400">
            Loading history yet...
          </div>) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No trading history yet.
            </div>
          ) : (
            <div>
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="text-left py-3 px-4">Token</th>
                    <th className="text-left py-3 px-4">Dex</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((vaultLog: VaultLog) => (
                    <tr
                      key={vaultLog.id}
                      className="text-white border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">{vaultLog.tokenSymbol}</td>
                      <td className="py-3 px-4">{vaultLog.dex}</td>
                      <td className="py-3 px-4">{vaultLog.actionType}</td>
                      <td className="py-3 px-4">{vaultLog.tokenChanged}</td>
                      <td className="py-3 px-4">{new Date(vaultLog.updatedAt).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <a
                          href={`https://etherscan.io/tx/${vaultLog.eventHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {vaultLog.eventHash.substring(0, 6)}...{vaultLog.eventHash.substring(vaultLog.eventHash.length - 4)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactPaginate
                className="text-[#666] flex items-center justify-center mt-8"
                previousClassName="text-[#666] h-7 rounded-sm text-xl leading-6 w-7 bg-gray-800 text-center "
                nextClassName="text-[#666] h-7 rounded-sm text-xl leading-6 w-7 bg-gray-800 text-center"
                pageClassName=" border-[2px] border-gray-800 min-w-7 flex items-center justify-center text-center h-7  rounded-sm mx-[5px]"
                activeClassName="border-[2px] text-amber-400 font-bold border-amber-400"
                breakClassName="break-me"
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={Math.ceil(total / pageSize)}
                previousLabel="<"
                renderOnZeroPageCount={null}
              />
            </div>
          )}
        </div>
      </motion.div >
    </div >
  );
};

export default TradinContractHistory; 