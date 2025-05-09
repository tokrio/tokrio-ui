import React from 'react'
import { ChevronLeft, ChevronRight, CreditCard, BarChart2, MonitorSmartphone } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAccount } from 'wagmi'

const ProxyAdminPage = () => {

    const { address } = useAccount()

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
                            <span>Premium Package</span>
                        </div>
                        <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                            <span className="text-gray-400"></span>
                            <span className="text-[#00FF9D]">10% Profit</span>
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
                                    <p className="text-2xl font-bold">5,678 USDT</p>
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
                                    <p className="text-2xl font-bold">1,234 USDT</p>
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
                                    <p className="text-2xl font-bold text-[#00FF9D]">Active</p>
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
                        <h2 className="text-xl font-medium">Transaction History</h2>
                        <div className="flex items-center space-x-2">
                            <button className="p-1 rounded-md bg-[#2A2A2A]">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span>Page 1 of 5</span>
                            <button className="p-1 rounded-md bg-[#2A2A2A]">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-800">
                                    <th className="pb-3 font-medium">Time</th>
                                    <th className="pb-3 font-medium">Type</th>
                                    <th className="pb-3 font-medium">Token</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Side</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-800">
                                    <td className="py-4">2024-03-20 14:30</td>
                                    <td className="py-4">Fee</td>
                                    <td className="py-4">USDT</td>
                                    <td className="py-4 text-[#00FF9D]">10 USDT</td>
                                    <td className="py-4 text-[#00FF9D]">Buy</td>
                                </tr>
                                <tr className="border-b border-gray-800">
                                    <td className="py-4">2024-03-20 13:45</td>
                                    <td className="py-4">Profit Share</td>
                                    <td className="py-4">USDT</td>
                                    <td className="py-4 text-[#00FF9D]">5 USDT</td>
                                    <td className="py-4 text-[#FF5757]">Sell</td>
                                </tr>
                                <tr>
                                    <td className="py-4">2024-03-20 12:15</td>
                                    <td className="py-4">Fee</td>
                                    <td className="py-4">USDT</td>
                                    <td className="py-4 text-[#00FF9D]">2.5 USDT</td>
                                    <td className="py-4 text-[#00FF9D]">Buy</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProxyAdminPage