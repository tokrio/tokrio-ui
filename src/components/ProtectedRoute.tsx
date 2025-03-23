import React from 'react';
import { Navigate } from 'react-router-dom';
import { tokenStorage } from '../services/api';
import LoginPage from './LoginPage';
import { useAccount } from 'wagmi';
import { config } from '../config/env';
import { chainConfig } from '../WalletConfig';
import { switchChain } from '@wagmi/core'

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = tokenStorage.getToken();

  const { address,chainId, chain } = useAccount();

  console.log('chainId',chainId)
  console.log('chainId',chain)

  if (!address || !token || !chainId ||  chainId !== chainConfig.chains[0].id) {
    // return <LoginPage />;
      return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 