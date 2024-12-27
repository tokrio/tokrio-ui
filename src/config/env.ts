interface EnvConfig {
  API_BASE_URL: string;
  ECONOMY: string;
  USDT_TOKEN: string;
  STAKING: string;
  SPONSOR: string;
  TOKEN: string;
  LEVEL_TOKEN: string;
  TOKRIO_LEVEL: string;
}

const ENV_CONFIG: Record<string, EnvConfig> = {
  development: {
    API_BASE_URL: 'http://localhost:6500/api',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x88e9C81F4b1D0721755F882dAfa2607D849ED1a3',
    STAKING: '0x77465db2ed5bfffcB1fb2d3071beBC9E5BC4db5D',
    SPONSOR: '0x5DDAa9C86A6FDa4a04fe8403d9E07C80a7C7A8a8',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764',
    LEVEL_TOKEN: '0x37dEEDA082B2A577bb522087e8D130e596D1627A',
    TOKRIO_LEVEL: '0x27AA806c53D3Eb298F489D8D5C77A402be7949c9'
  },
  beta: {
    API_BASE_URL: 'https://beta-api-1.tokrio.com/api',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x88e9C81F4b1D0721755F882dAfa2607D849ED1a3',
    STAKING: '0x77465db2ed5bfffcB1fb2d3071beBC9E5BC4db5D',
    SPONSOR: '0x5DDAa9C86A6FDa4a04fe8403d9E07C80a7C7A8a8',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764',
    LEVEL_TOKEN: '0x37dEEDA082B2A577bb522087e8D130e596D1627A',
    TOKRIO_LEVEL: '0x27AA806c53D3Eb298F489D8D5C77A402be7949c9'
  },
  production: {
    API_BASE_URL: 'https://api.tokrio.io/api',
    ECONOMY: '',
    USDT_TOKEN: '',
    STAKING: '',
    SPONSOR: '',
    TOKEN: '',
    LEVEL_TOKEN: '',
    TOKRIO_LEVEL: '0x0000000000000000000000000000000000000000'
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