interface EnvConfig {
  API_BASE_URL: string;
  // ... 其他环境变量
}

const ENV_CONFIG: Record<string, EnvConfig> = {
  development: {
    API_BASE_URL: 'http://localhost:6500/api'
  },
  beta: {
    API_BASE_URL: 'https://beta-api-1.tokrio.com/api'
  },
  production: {
    API_BASE_URL: 'https://api.tokrio.io/api'
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