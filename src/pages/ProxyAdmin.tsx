import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CreditCard, BarChart2, MonitorSmartphone } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAccount } from 'wagmi'
import { AdminInfo, ProxyEarning, api } from '../services/api'
import toast from 'react-hot-toast'
import { showErr } from '../util/utils'
import { Link } from 'react-router-dom'
import { config } from '../config/env'

const ProxyAdminPage = () => {

    const { address } = useAccount()
    const [info, setInfo] = useState<AdminInfo>({
        status: 0,
        receiverAddr: '',
        tierLevel: 4,
        commissionRate: 0,
        totalEarnings: '0',
        last30DaysEarnings: '0',
        tradeCount: 0,
        lastTradeTime: '',
    });
    const [data, setData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [earnings, setEarnings] = useState<ProxyEarning[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getInfo();
        getEarnings();
    }, [currentPage])

    const getInfo = async () => {
        try {
            const response = await api.getAdminInfo()
            if (response.code === 200) {
                setInfo(response.body);
            } else {
                if (response.message) {
                    toast.error(showErr(response.message))
                }
            }
        } catch (error) {
            console.error('Failed to fetch portfolio data:', error);
        }
    }

    const getEarnings = async () => {
        try {
            const response = await api.getProxyEarnings(currentPage, pageSize);
            if (response.code === 200) {

                setEarnings(response.body.list);
                setTotal(response.body.total);

            }
        } catch (error) {
            setEarnings([]);
            setTotal(0);
            console.error('Failed to fetch earnings data:', error);
        }
    }

    const totalPages = Math.ceil(total / pageSize);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white p-4">
            <Navbar showMenu={false} />
            <div className="max-w-7xl py-24  mx-auto space-y-4">
                {/* Account Information Card */}
                <div className="bg-[#1E1E1E] rounded-xl p-6">
                    <h2 className="text-xl font-medium mb-4">Account Information</h2>
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col space-y-2">
                            <span className="text-gray-400">Connected Wallet:</span>
                            <span className="font-mono">{address}</span>
                        </div>
                        <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                            <span className="text-gray-400">Package Level:</span>
                            <span>{info.tierLevel === 1 ? 'Basic' : (info.tierLevel === 2 ? 'premium' : (info.tierLevel === 3 ? 'Vip' : 'No Proxy'))}</span>
                        </div>
                        <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                            <span className="text-gray-400"></span>
                            <span className="text-[#00FF9D]">{info.commissionRate * 100}% Profit</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Earnings Card */}
                    <div className="bg-[#1E1E1E] rounded-xl p-6 relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-gray-400 text-sm">Total Earnings</h3>
                                <div className="mt-2">
                                    <p className="text-2xl font-bold">{info.totalEarnings} USDT</p>
                                </div>
                            </div>
                            <div className="bg-[#2A2A2A] p-2 rounded-lg">
                                <CreditCard className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* 30 Days Earnings Card */}
                    <div className="bg-[#1E1E1E] rounded-xl p-6 relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-gray-400 text-sm">30 Days Earnings</h3>
                                <div className="mt-2">
                                    <p className="text-2xl font-bold">{info.last30DaysEarnings} USDT</p>
                                </div>
                            </div>
                            <div className="bg-[#2A2A2A] p-2 rounded-lg">
                                <BarChart2 className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Proxy Status Card */}
                    <div className="bg-[#1E1E1E] rounded-xl p-6 relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-gray-400 text-sm">Proxy Status</h3>
                                <div className="mt-2">
                                    <p className="text-2xl font-bold text-[#00FF9D]">{info.status === 0 ? 'Free' : 'Trading'}</p>
                                </div>
                            </div>
                            <div className="bg-[#2A2A2A] p-2 rounded-lg">
                                <MonitorSmartphone className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-[#1E1E1E] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">Income History</h2>
                        <div className="flex items-center space-x-2">
                            <button
                                className={`p-1 rounded-md ${currentPage > 1 ? 'bg-[#2A2A2A]' : 'bg-[#1A1A1A]'}`}
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span>Page {currentPage} of {totalPages === 0 ? 1 : totalPages}</span>
                            <button
                                className={`p-1 rounded-md ${currentPage < totalPages ? 'bg-[#2A2A2A]' : 'bg-[#1A1A1A]'}`}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {earnings && earnings.map((earning, index) => (
                            <div key={index} className="bg-[#2A2A2A] rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-gray-300">{earning.time}</span>
                                            <span className="px-2 py-1 bg-[#3A3A3A] rounded text-sm">
                                                {earning.type}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-gray-400">
                                                Token: <span className="text-white">USDT</span>
                                            </div>
                                            <div className="text-gray-400 mt-2">
                                                Hash: <Link target='_blank' className="text-blue-400 hover:text-blue-700" to={`${config.NET_SCAN_URL}/${earning.txHash}`}>
                                                    {earning.txHash.slice(0, 6)}...{earning.txHash.slice(-4)}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-[#00FF9D] text-xl font-medium">
                                            <span className="text-gray-400 text-sm">Commission: </span>{earning.commission} USDT
                                        </div>
                                        <span className="text-gray-400 mt-2 text-sm">
                                            Trade Amount: {earning.tradeAmount} USDT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProxyAdminPage