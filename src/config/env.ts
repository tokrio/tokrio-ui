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
    STAKING: '0x10AAb5F794a38ee6f32171833ADCE0aEcC5a8Cc4',
    SPONSOR: '0xD75D40Da81fb95f569261BC6e7D8EeC764fB07E9',
    TOKEN: '0x3380eb9fE9242b4955ACFa019D495cDD64DfA764'
  },
  beta: {
    API_BASE_URL: 'https://beta-api-1.tokrio.com/api',
    ECONOMY: '0x1f246fC9E9D1AdCb8a1939cf96E575Db6cE0F92F',
    USDT_TOKEN: '0x88e9C81F4b1D0721755F882dAfa2607D849ED1a3',
    STAKING: '0x10AAb5F794a38ee6f32171833ADCE0aEcC5a8Cc4',
    SPONSOR: '0xD75D40Da81fb95f569261BC6e7D8EeC764fB07E9',
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