import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Logo from './Logo';
import { ConnectButtonComponents } from './ConnectButtonComponents';
import { useAccount } from 'wagmi';
import { tokenStorage } from '../services/api';

interface Props {
  showMenu?: boolean
}

const Navbar = ({ showMenu = true }: Props) => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const location = useLocation();

  useEffect(() => {
    const lastAddress =  localStorage.getItem("lastAddress")
    if (address && lastAddress && address != lastAddress) {
      localStorage.setItem("lastAddress", address || "");
      tokenStorage.removeToken();
      navigate("/")
    }
  }, [address])

  useEffect(() => {
    if (!address && location.pathname !== '/staking' && location.pathname !== '/sponsor' && location.pathname !== '/market') {
      tokenStorage.removeToken();
      navigate("/")
    }
  }, [address, location.pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto px-4 md:px-6 border-none border-b border-[#222]">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Logo size={32} />
            <span className="text-xl tracking-widest hidden md:block uppercase main-font  font-medium text-primary">Tokrio</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-8"
          >
            {/* {showMenu && ['Features', 'How it Works', 'Documentation'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hidden md:block hover:text-primary transition-colors duration-200"
              >
                {item}
              </a>
            ))} */}
            <Link
              to="/staking"
              className="text-white text-sm main-font  uppercase hover:text-primary transition-colors duration-200"
            >
              Staking
            </Link>
            <Link
              to="/market"
              className="text-gray-300 text-sm main-font uppercase hover:text-primary transition-colors duration-200"
            >
              Market
            </Link>
            <ConnectButtonComponents />
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 