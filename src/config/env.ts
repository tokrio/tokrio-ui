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
}

const ENV_CONFIG: Record<string, EnvConfig> = {
  development: {
    API_BASE_URL: 'http://localhost:6500/api',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x88e9C81F4b1D0721755F882dAfa2607D849ED1a3',
    STAKING: '0x8A502A63DdD970C319D9F50B259B784BBB819312',
    SPONSOR: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764',
    LEVEL_TOKEN: '0x37dEEDA082B2A577bb522087e8D130e596D1627A',
    TOKRIO_LEVEL: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKRIO_VESTING: '0xFBfE4c349801ED0190384E578ccddc13e7A1E8b7',
  },
  beta: {
    API_BASE_URL: 'https://beta-api-1.tokrio.com/api',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x88e9C81F4b1D0721755F882dAfa2607D849ED1a3',
    STAKING: '0x8A502A63DdD970C319D9F50B259B784BBB819312',
    SPONSOR: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764',
    LEVEL_TOKEN: '0x37dEEDA082B2A577bb522087e8D130e596D1627A',
    TOKRIO_LEVEL: '0xE71dD4908b7D1C6681a15dB7E054CA6f642D14de',
    TOKRIO_VESTING: '0xFBfE4c349801ED0190384E578ccddc13e7A1E8b7',
  },
  production: {
    API_BASE_URL: 'https://api.tokrio.io/api',
    ECONOMY: '',
    USDT_TOKEN: '',
    STAKING: '',
    SPONSOR: '',
    TOKEN: '',
    LEVEL_TOKEN: '',
    TOKRIO_LEVEL: '0x0000000000000000000000000000000000000000',
    TOKRIO_VESTING: '',
  }
};

// 使用 REACT_APP_ENV 环境变量
const getEnvConfig = (): EnvConfig => {
  const env = process.env.REACT_APP_ENV || 'development';
  const config = ENV_CONFIG[env] || ENV_CONFIG.development;

  // 添加调试日志
  console.log('=================================');
  console.log('Environment:', env);
  console.log('API_BASE_URL:', config.API_BASE_URL);
  console.log('=================================');

  return config;
};

export const config = getEnvConfig(); 