import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ConnectButtonComponents } from './ConnectButtonComponents';
import { useAccount } from 'wagmi';
import { tokenStorage } from '../services/api';

interface Props {
  showMenu?: boolean
}

const Navbar = ({ showMenu = true }: Props) => {
  const navigate = useNavigate();
  const { address } = useAccount();

  useEffect(() => {

    if (!address) {
      tokenStorage.removeToken();
      navigate("/")
    }

  }, [address])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Logo size={32} />
            <span className="text-2xl font-bold text-primary">Tokrio</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className=" flex items-center space-x-8"
          >

            {showMenu && ['Features', 'How it Works', 'Pricing', 'Documentation'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hidden md:block hover:text-primary transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            {/* <button 
              onClick={() => navigate('/login')}
              className="text-gray-300 hover:text-primary transition-colors duration-200"
            >
              Login
            </button> */}
            <ConnectButtonComponents />
            {/* <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white transition-colors duration-200"
            >
              Get Started
            </button> */}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 