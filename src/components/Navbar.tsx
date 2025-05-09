import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import Logo from './Logo';
import { ConnectButtonComponents } from './ConnectButtonComponents';
import { useAccount } from 'wagmi';
import { tokenStorage } from '../services/api';
import { LogoIcon } from '../img/FileImports';
import { Tooltip } from 'react-tooltip';

interface Props {
  showMenu?: boolean
}

const Navbar = ({ showMenu = true }: Props) => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const location = useLocation();
  const { code } = useParams();

  useEffect(() => {
    if (code) {
      console.log("code", code);
      localStorage.setItem("code", code || "");
    }
    const lastAddress =  localStorage.getItem("lastAddress")
    console.log("address11lastAddress", lastAddress);
    console.log("address12", address);
    if (address && lastAddress && address != lastAddress) {
      
      tokenStorage.removeToken();
      navigate("/")
    }
    localStorage.setItem("lastAddress", address || "");
  }, [address])

  useEffect(() => {
    if (!address && location.pathname !== '/staking' && location.pathname !== '/sponsor' && location.pathname !== '/market' && location.pathname !== '/jarvis') {
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
            {/* <Logo size={32} /> */}
            <img src={process.env.PUBLIC_URL + 'logo.png'} alt="logo" className="h-8 w-auto  rounded-full" />
            <span className="text-xl tracking-widest hidden md:block uppercase main-font  font-medium text-primary">Tokrio</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-8"
          >
            {/* <Link
              to="/proxyPurchase"
              className="text-white text-sm main-font  uppercase hover:text-primary transition-colors duration-200"
            >
              Proxy Purchase
            </Link>
            <Link
              to="/proxyAdmin"
              className="text-white text-sm main-font  uppercase hover:text-primary transition-colors duration-200"
            >
              Proxy Admin
            </Link> */}
            <Tooltip id="comming-soon" />
            <a
              data-tooltip-content="Comming Soon"
              data-tooltip-id="comming-soon"
              className="text-gray-600 cursor-pointer text-sm main-font  uppercase  transition-colors duration-200"
            >
              Staking
            </a>
            <a
              data-tooltip-content="Comming Soon"
              data-tooltip-id="comming-soon"
              className="text-gray-600 cursor-pointer text-sm main-font  uppercase  transition-colors duration-200"
            >
              Jarvis
            </a>
            <a
              data-tooltip-content="Comming Soon"
              data-tooltip-id="comming-soon"
              className="text-gray-600 cursor-pointer text-sm main-font  uppercase  transition-colors duration-200"
            >
              Market
            </a>
            {/* <Link
              to="/staking"
              className="text-white text-sm main-font  uppercase hover:text-primary transition-colors duration-200"
            >
              Staking
            </Link>
            <Link
              to="/jarvis"
              className="text-gray-300 text-sm main-font uppercase hover:text-primary transition-colors duration-200"
            >
              Jarvis
            </Link>
            <Link
              to="/market"
              className="text-gray-300 text-sm main-font uppercase hover:text-primary transition-colors duration-200"
            >
              Market
            </Link> */}
            <ConnectButtonComponents />
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 