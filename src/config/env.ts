interface EnvConfig {
  API_BASE_URL: string;
  ECONOMY: string;
  USDT_TOKEN: string;
  STAKING: string;
  SPONSOR: string;
  TOKEN: string;
  LEVEL_TOKEN: string;
  TOKRIO_LEVEL: string;
  TOKRIO_VESTING: string;
  WEB_URL: string;
  ProxyRegistry: string;
  ProxyTrading: string;
  BTC: string;
  ETH: string;
  NET_SCAN_URL:string;
}

const ENV_CONFIG: Record<string, EnvConfig> = {
  development: {
    API_BASE_URL: 'https://beta-api-1.tokrio.com/api',
    WEB_URL: 'https://beta-1.tokrio.com/',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x3dffEbb98e459F3Fe353159ba0938A840c6621fF',
    STAKING: '0x8A502A63DdD970C319D9F50B259B784BBB819312',
    SPONSOR: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764',
    LEVEL_TOKEN: '0x37dEEDA082B2A577bb522087e8D130e596D1627A',
    NET_SCAN_URL: 'https://testnet.bscscan.com/tx',
    TOKRIO_LEVEL: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKRIO_VESTING: '0xFBfE4c349801ED0190384E578ccddc13e7A1E8b7',
    ProxyRegistry:'0x796F48c51B24283fd10B51778800bddBF33bFBBD',
    ProxyTrading:'0x30CF11F00fd41874F7481FF2904ca0Ac1B94E4e7',
    BTC:'0xD362dd0F20a0bE18f0b569A4787148bfE7858974',
    ETH:'0x3B3b484302e576Af287C946fCc5F6Fb0156330a4'
  },
  beta: {
    API_BASE_URL: 'https://beta-api-1.tokrio.com/api',
    WEB_URL: 'https://beta-1.tokrio.com/',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x3dffEbb98e459F3Fe353159ba0938A840c6621fF',
    STAKING: '0x8A502A63DdD970C319D9F50B259B784BBB819312',
    SPONSOR: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764',
    LEVEL_TOKEN: '0x37dEEDA082B2A577bb522087e8D130e596D1627A',
    NET_SCAN_URL: 'https://testnet.bscscan.com/tx',
    TOKRIO_LEVEL: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKRIO_VESTING: '0xFBfE4c349801ED0190384E578ccddc13e7A1E8b7',
    ProxyRegistry:'0x796F48c51B24283fd10B51778800bddBF33bFBBD',
    ProxyTrading:'0x30CF11F00fd41874F7481FF2904ca0Ac1B94E4e7',
    BTC:'0xD362dd0F20a0bE18f0b569A4787148bfE7858974',
    ETH:'0x3B3b484302e576Af287C946fCc5F6Fb0156330a4'
  },
  alpha: {
    API_BASE_URL: 'https://alpha-api-1.tokrio.com/api',
    WEB_URL: 'https://tokrio.com/',
    ECONOMY: '',
    USDT_TOKEN: '0x55d398326f99059fF775485246999027B3197955',
    STAKING: '',
    SPONSOR: '',
    TOKEN: '',
    LEVEL_TOKEN: '',
    TOKRIO_LEVEL: '0x0000000000000000000000000000000000000000',
    TOKRIO_VESTING: '',
    NET_SCAN_URL: 'https://bscscan.com/tx',
    ProxyRegistry:'0x126eae87a3E4CD1DaE8953a09B34D81B079Cb15a',
    ProxyTrading:'0x6C8AA5CbD08Addf42cA85c82A26c102DB87401b7',
    BTC:'',
    ETH:''
  },
  production: {
    API_BASE_URL: 'https://api-1.tokrio.com/api',
    WEB_URL: 'https://tokrio.com/',
    ECONOMY: '',
    USDT_TOKEN: '0x55d398326f99059fF775485246999027B3197955',
    STAKING: '',
    SPONSOR: '',
    TOKEN: '',
    LEVEL_TOKEN: '',
    TOKRIO_LEVEL: '0x0000000000000000000000000000000000000000',
    TOKRIO_VESTING: '',
    NET_SCAN_URL: 'https://bscscan.com/tx',
    ProxyRegistry:'0x126eae87a3E4CD1DaE8953a09B34D81B079Cb15a',
    ProxyTrading:'0x6C8AA5CbD08Addf42cA85c82A26c102DB87401b7',
    BTC:'',
    ETH:''
  }
};

const getEnvConfig = (): EnvConfig => {
  const env = process.env.REACT_APP_ENV || 'development';
  const config = ENV_CONFIG[env] || ENV_CONFIG.development;

  console.log('=================================');
  console.log('Environment:', env);
  console.log('API_BASE_URL:', config.API_BASE_URL);
  console.log('=================================');

  return config;
};

export const config = getEnvConfig(); 