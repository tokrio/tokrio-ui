import React from 'react';
import { Navigate } from 'react-router-dom';
import { tokenStorage } from '../services/api';
import LoginPage from './LoginPage';
import { useAccount } from 'wagmi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = tokenStorage.getToken();
  const { address } = useAccount();

  if (!address || !token) {
    // return <LoginPage />;
      return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 