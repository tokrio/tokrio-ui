import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, tokenStorage } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 使用指定的参数值登录
      const response = await api.login({
        walletAddress: "eoa2",
        signature: "123456"
      });
      
      if (response.code === 200) {
        // 保存 token
        tokenStorage.setToken(response.body);
        // 跳转到 dashboard
        navigate('/dashboard');
      } else {
        console.error('Login failed:', response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome to Tokrio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            AI-Powered Crypto Trading Platform
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Login with Wallet
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 