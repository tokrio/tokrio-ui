import '@rainbow-me/rainbowkit/styles.css'
import { connectorsForWallets, darkTheme, getDefaultConfig, lightTheme, RainbowKitProvider, WalletList } from '@rainbow-me/rainbowkit'
import { gateWallet, injectedWallet, metaMaskWallet, okxWallet } from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { avalancheFuji, bsc, bscTestnet, Chain, mainnet, sepolia, wemixTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import binanceWallet from '@binance/w3w-rainbow-connector-v2'
import App from './App'
import { Toaster } from 'react-hot-toast'

const WALLET_CONNECT_PROJECT_ID = 'ae6db5c9c381306507026b30055a5bbe'


// const recommendedWalletList: WalletList = [
//     {
//         groupName: 'Recommended',
//         wallets: [
//             injectedWallet,
//             gateWallet,
//             binanceWallet,
//         ],
//     },
// ]
// const connectors = connectorsForWallets(
//     recommendedWalletList,
//     { projectId: WALLET_CONNECT_PROJECT_ID, appName: APP_NAME }
// )

// export const chainConfig = createConfig({
//     ssr: true,
//     connectors,
//     chains: [ bscTestnet],
//     transports: {
//         [bscTestnet.id]: http()
//     },
// })

const rpcs = [
  "https://bsc-pokt.nodies.app",
  "https://bsc.drpc.org",
  "https://bsc.blockrazor.xyz",
  "https://binance.llamarpc.com",
  "https://bsc-mainnet.public.blastapi.io",
  "https://endpoints.omniatech.io/v1/bsc/mainnet/public",
  "https://bsc.blockrazor.xyz",
  "https://bsc-dataseed.binance.org"
]

const bscMain: Chain = {
  id: 56,
  name: 'BNB Chain',
  nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
  },
  rpcUrls: {
      default: { http: rpcs },
      public: { http: rpcs },
  },
  blockExplorers: {
      etherscan: { name: 'BscScan', url: 'https://bscscan.com' },
      default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  contracts: {
      multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 15921452,
      },
  },
}

export const chainConfig:any = getDefaultConfig(
    {
      appName: 'Tokrio',
      projectId: WALLET_CONNECT_PROJECT_ID,
      chains: [
        // bsc
        (process.env.REACT_APP_ENV !== "production" && process.env.REACT_APP_ENV !== "alpha") ? bscTestnet : bscMain,
      ],
      wallets: [
        {
          groupName: 'Recommended',
          wallets: [metaMaskWallet, okxWallet ,binanceWallet, gateWallet],
        }
      ]
    });

const queryClient = new QueryClient()

//https://cloud.walletconnect.com/app/project?uuid=48f3b6c9-c365-467f-bf19-b23da9f5a5bf



export default function WalletConfig() {


    return <WagmiProvider config={chainConfig}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
                theme={
                    darkTheme({
                        accentColor: '#F0B90B',
                        accentColorForeground: '#fff',
                        borderRadius: 'small',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })
                }
                modalSize="compact"
                locale={'en-US'}>
                <App />
                <Toaster />
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>

}