import { ConnectButton } from '@rainbow-me/rainbowkit';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

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
                        className='md:text-sm text-sm'
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
                                    <button className='bg-primary px-2 md:px-4 cursor-pointer py-2   rounded-md font-medium text-xs font-semibold md:text-sm' onClick={openConnectModal} type="button">
                                        Connect Wallet
                                    </button>
                                );
                            }
                            
                            if (chain.unsupported) {
                                return (
                                    <button className=' px-4 truncate cursor-pointer py-2 rounded-lg bg-[#ff494a]' onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button
                                        className='hidden lg:flex text-[#8A8A8A]  px-2 items-center cursor-pointer rounded-lg'
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
                                    <button className='hidden md:flex px-2 items-center cursor-pointer rounded-lg ' onClick={openAccountModal} type="button">
                                        <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} />
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