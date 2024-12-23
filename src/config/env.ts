interface EnvConfig {
  API_BASE_URL: string;
  ECONOMY: string;
  USDT_TOKEN: string;
  STAKING: string;
  SPONSOR: string;
  TOKEN: string;
}

const ENV_CONFIG: Record<string, EnvConfig> = {
  development: {
    API_BASE_URL: 'http://localhost:6500/api',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x88e9C81F4b1D0721755F882dAfa2607D849ED1a3',
    STAKING: '0xD860433A2AfC1796fA49551Be92c1f4a021AEb30',
    SPONSOR: '0xAb8dcc4abe7ed7a8A9C31e674c03385b37721401',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764'
  },
  beta: {
    API_BASE_URL: 'https://beta-api-1.tokrio.com/api',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x88e9C81F4b1D0721755F882dAfa2607D849ED1a3',
    STAKING: '0xD860433A2AfC1796fA49551Be92c1f4a021AEb30',
    SPONSOR: '0xAb8dcc4abe7ed7a8A9C31e674c03385b37721401',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764'
  },
  production: {
    API_BASE_URL: 'https://api.tokrio.io/api',
    ECONOMY: '',
    USDT_TOKEN: '',
    STAKING: '',
    SPONSOR: '',
    TOKEN: ''
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