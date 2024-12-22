import { ConnectButton } from '@rainbow-me/rainbowkit';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { User } from '../img/FileImports';

export const ConnectButtonComponents = () => {
  
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                ////console.log("authenticationStatus", authenticationStatus)
                ////console.log("authenticationStatus", account)
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');
                return (
                    <div
                        className='text-xs main-font text-white font-medium' 
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button className='cta-button text-xs  cursor-pointer py-1.5 px-2 rounded-md' onClick={openConnectModal} type="button">
                                        Connect Wallet
                                    </button>
                                );
                            }
                            
                            if (chain.unsupported) {
                                return (
                                    <button className=' px-4 truncate uppercase cursor-pointer py-1.5 rounded-lg bg-[#ff494a]' onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button
                                        className='hidden lg:flex text-[#fff] border-2 border-[#4d4d4d] py-1  px-2 items-center cursor-pointer rounded-full'
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div className='  rounded-full overflow-hidden mr-1'>
                                                {chain.iconUrl && (
                                                    <img className='  w-5 h-5 mr-1'
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>
                                    <button className='hidden md:flex text-[#fff] border-2 border-[#4d4d4d] py-1 px-2 items-center cursor-pointer rounded-full ' onClick={openAccountModal} type="button">
                                        {/* <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} /> */}
                                        <img className='w-5 h-5' src={User} />
                                        <p className=' ml-1'> {account.displayName}</p>
                                        <img className=' w-6' src={process.env.PUBLIC_URL + '/img/' + 'down.png'} alt="" />
                                    </button>
                                    <img onClick={openAccountModal} className='h-5 cursor-pointer block md:hidden ml-3' src={process.env.PUBLIC_URL + '/img/' + 'wallet.png'} />
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};