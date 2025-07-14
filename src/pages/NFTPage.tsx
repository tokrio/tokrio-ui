import Navbar from "../components/Navbar";
import { ActiveValue, AiTrade, Community, Contributors, Efficiency, Enthusiasts, NftRight, OnChain, PassiveValue, Requirement, Star, Traders } from "../img/FileImports";


const NFTPage = (props: any) => {

    return (
        <div className="min-h-screen text-sm md:text-base  text-white">
            <Navbar showMenu={false} />
            <div className="py-32 max-w-6xl font-light mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 items-center">
                    <div className="flex flex-col gap-6">
                        <div className="text-5xl font-darker leading-[60px]  font-semibold">Apply for Your Limited Partner NFT – Start Building with Tokrio</div>
                        <div className="leading-6 text-gray-400">By holding a Partner NFT, you gain exclusive rights to co-develop, integrate, and profit from Tokrio’s AI trading infrastructure — including agent customization, revenue share, and whitelabel tools.</div>
                        <div className="grid grid-cols-3 mt-4 gap-3 text-xs">
                            <div className="border px-4 py-2 border-[#FFA41C]/30 rounded-md">
                                <div className="mb-1 font-medium text-white text-lg">Limited</div>
                                <div className="text-[#FFA41C]">100</div>
                            </div>

                            <div className="border px-4 py-2 border-[#FFA41C]/30 rounded-md">
                                <div className="mb-1 font-medium text-white text-lg">Livetime</div>
                                <div className="text-[#FFA41C]">ACCESS</div>
                            </div>

                            <div className="border px-4 py-2 border-[#FFA41C]/30 rounded-md">
                                <div className="mb-1 font-medium text-white text-lg">Free</div>
                                <div className="text-[#FFA41C]">MINTING</div>
                            </div>


                        </div>
                    </div>
                    <div className="w-full flex justify-center md:justify-end">
                        <img className="w-[80%] max-w-[325px]" src={NftRight} alt="" />
                    </div>
                </div>
                <div className="mt-10">
                    <div className="text-3xl font-darker font-semibold">
                        About <span className="text-[#FFA41C]">Tokrio</span>
                    </div>
                    <div className="mt-6 leading-6 text-gray-400">
                        Tokrio is an AI Agent-powered Web3 trading gateway dedicated to delivering a zero-barrier, personalized intelligent trading experience for users.<br /><br />
                        At the current stage, Tokrio integrates functional modules such as a Telegram Bot, AI-generated NFTs, and automated trading strategies. By encapsulating complex on-chain trading processes into one-click AI service interfaces, Tokrio significantly lowers the barrier to entry for everyday users participating in DeFi.<br /><br />
                        Whether it's centralized exchanges (CEX), decentralized trading platforms (DEX), or advanced strategies like cross-chain arbitrage and copy trading, users can manage and execute these operations automatically through Tokrio—getting started quickly with no technical expertise required.<br /><br />
                        In the future, Tokrio aims to evolve into an AI-driven, wallet-level gateway:
                        Tokrio's AI engine will intelligently switch between various on-chain Agent services based on user needs, helping users seamlessly complete the entire asset management flow—from trading and strategy deployment to yield rebalancing—ultimately enabling a truly self-driving on-chain asset management experience.<br /><br />
                    </div>

                </div>

                <div className="grid grid-cols-2 mt-10 font-medium gap-4 w-full md:grid-cols-4">
                    <div className="border flex flex-col p-6 rounded-md items-center justify-center  border-[#FFA41C]/40  bg-gray-900/30">
                        <img className="w-12 h-12" src={AiTrade} alt="" />
                        <div className="mt-4">AI-Powered Trading</div>

                    </div>
                    <div className="border flex flex-col p-6 rounded-md items-center justify-center  border-[#FFA41C]/40  bg-gray-900/30">
                        <img className="w-12 h-12" src={Efficiency} alt="" />
                        <div className="mt-4">Maximized Capital Efficiency</div>

                    </div>
                    <div className="border flex flex-col p-6 rounded-md items-center justify-center  border-[#FFA41C]/40  bg-gray-900/30">
                        <img className="w-12 h-12" src={OnChain} alt="" />
                        <div className="mt-4">On-chain Integration</div>

                    </div>
                    <div className="border flex flex-col p-6 rounded-md items-center justify-center  border-[#FFA41C]/40  bg-gray-900/30">
                        <img className="w-14 h-14" src={Community} alt="" />
                        <div className="mt-4">Community Driven</div>

                    </div>
                </div>

                <div className="mt-14">
                    <div className="text-3xl font-darker font-semibold">
                        Exclusive Benefits for Early Ecosystem Builders
                    </div>
                    <div className="mt-6 leading-6 w-full md:w-[80%] text-gray-400">
                        Before our official launch, we’re inviting a select group of Web3-native traders, builders, KOLs, and institutions into a limited NFT whitelist.
                        Together, we’ll form the foundation of a truly AI-native financial ecosystem.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <img src={ActiveValue} />
                        <img src={PassiveValue} />

                    </div>

                </div>

                <div className="mt-10">
                    <div className="text-3xl font-darker font-semibold">Who We're Looking For</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <img src={Traders} />
                        <img src={Enthusiasts} />
                        <img src={Contributors} />

                    </div>
                </div>

                <div className="mt-10 mb-5 flex justify-center">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSfwCRqd4dqlMU245LSUmJ8fJ4soGo_mTqQ0Yku_eBeLwx5ebg/viewform?usp=dialog"
                        target="_blank" ><div className="rounded-md text-lg font-semibold w-fit px-14 py-3 text-black bg-[#FFA41C]">Apply now</div></a>
                </div>

                <div className="py-5 border-t border-gray-700">
                    <img src={Star} className="h-6" />
                    <div className="text-3xl font-darker font-semibold">Important Notes</div>
                    <div className="grid mt-6 grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-full">
                            <div className="text-[#FFA41C]  text-lg font-darker font-semibold mb-4">Utility Logic for Tokrio AI NFTs</div>
                            <div className="border p-4 leading-5 rounded-md border-[#FFA41C]/60">
                                Owning one NFT is sufficient to unlock all associated benefits. Additional NFTs do not stack utility. However, if you apply for and
                                receive more than one NFT, you are encouraged to distribute them within your community.
                            </div>
                        </div>

                        <div className="h-full flex flex-col">
                            <div className="text-[#22C55E] text-lg font-darker font-semibold mb-4">Utility Logic for Tokrio AI NFTs</div>
                            <div className="border p-4 flex-1 leading-5 rounded-md border-[#22C55E]/60">
                                Our team will review submissions on a rolling basis. Approved applicants will receive a free mint link and exclusive invite.
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}


export default NFTPage;