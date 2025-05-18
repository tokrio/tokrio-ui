import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { tokenStorage } from '../services/api';
import { ConnectButtonComponents } from './ConnectButtonComponents';
import { Tooltip } from 'react-tooltip';
import { Menu, X } from 'lucide-react';

interface Props {
  showMenu?: boolean
}

const Navbar = ({ showMenu = true }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { address } = useAccount();
  const location = useLocation();
  const { code } = useParams();

  useEffect(() => {
    if (code) {
      console.log("code", code);
      localStorage.setItem("code", code || "");
    }
    const lastAddress = localStorage.getItem("lastAddress")
    console.log("address11lastAddress", lastAddress);
    console.log("address12", address);
    if (address && lastAddress && address != lastAddress) {
      tokenStorage.removeToken();
      navigate("/")
    }
    localStorage.setItem("lastAddress", address || "");
  }, [address]) // When address changes

  useEffect(() => {
    if (!address && location.pathname !== '/staking' && location.pathname !== '/sponsor' && location.pathname !== '/market' && location.pathname !== '/jarvis') {
      tokenStorage.removeToken();
      navigate("/")
    }
  }, [address, location.pathname])

  const menuItems = [
    { path: '/proxyPurchase', label: 'Proxy Purchase', enabled: true },
    { path: '/proxyAdmin', label: 'Proxy Admin', enabled: true },
    { label: 'Staking', enabled: false },
    { label: 'Jarvis', enabled: false },
    { label: 'Market', enabled: false },
  ];

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
            <img src={process.env.PUBLIC_URL + 'logo.png'} alt="logo" className="h-8 w-auto rounded-full" />
            <span className="text-xl tracking-widest hidden md:block uppercase main-font font-medium text-primary">
              Tokrio
            </span>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center space-x-8"
          >
            {menuItems.map((item, index) => (
              item.enabled ? (
                <Link
                  key={index}
                  to={item.path || '/'}
                  className="text-white text-sm main-font uppercase hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={index}
                  data-tooltip-content="Coming Soon"
                  data-tooltip-id="comming-soon"
                  className="text-gray-600 cursor-pointer text-sm main-font uppercase transition-colors duration-200"
                >
                  {item.label}
                </a>
              )
            ))}
            <ConnectButtonComponents />
          </motion.div>

          <div className="md:hidden flex items-center space-x-4">
            <ConnectButtonComponents />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-black/95 overflow-hidden"
      >
        <div className="px-4 py-2 space-y-4">
          {menuItems.map((item, index) => (
            <div key={index} className="border-b border-gray-800 last:border-0">
              {item.enabled ? (
                <Link
                  to={item.path || '/'}
                  className="block py-3 text-white text-sm main-font uppercase hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  className="block py-3 text-gray-600 text-sm main-font uppercase cursor-pointer"
                  data-tooltip-content="Coming Soon"
                  data-tooltip-id="comming-soon"
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      
      <Tooltip id="comming-soon" />
    </nav>
  );
};

export default Navbar;