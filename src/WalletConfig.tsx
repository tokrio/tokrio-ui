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
const APP_NAME = 'TradeOFF Dapp'


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

export const chainConfig = getDefaultConfig(
    {
      appName: 'Tokrio',
      projectId: WALLET_CONNECT_PROJECT_ID,
      chains: [
        avalancheFuji
        // net == "TEST" ? TestNet : net == "BSCTEST" ? bscTestnet : bsc,
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
                        accentColor: '#2563EB',
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