import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsPanel from './components/StatsPanel';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DocumentationSection from './components/DocumentationSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import StakingPage from './pages/StakingPage';
import SponsorPage from './pages/SponsorPage';
import MarketPage from './pages/MarketPage';
import SponsorSharePage from './pages/SponsorSharePage';
import MatrixRain from './components/MatrixRain';
import TokenUsageSection from './components/TokenUsageSection';
import TokenUtilitySection from './components/TokenUtilitySection';
import Tokenomics from './components/Tokenomics';

// 正确的懒加载方式
const Dashboard = React.lazy(() => import('./components/Dashboard'));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar />
          <HeroSection />
          <TokenUsageSection />
          <TokenUtilitySection />
          <Tokenomics />
          <FeaturesSection />
          <HowItWorks />
          <DocumentationSection />
        </div>
      ),
    },
    {
      path: "/login",
      element: <LoginPage />
    },
    {
      path: "/staking",
      element: <StakingPage />
    },
    {
      path: "/sponsor",
      element: <SponsorPage />
    },
    {
      path: "/market",
      element: <MarketPage />
    },
    {
      path: "/dashboard",
      element: (
        <Suspense fallback={<div className='red text-8xl'>Loading</div>}>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: "/sponsor/share/:address",
      element: <SponsorSharePage />
    }
  ]);

  return <div className='relative'>
    <div className='absolute z-10'>
      <MatrixRain />
    </div>
    <div className='absolute max-h-screen no-scrollbar bg-[#111]/50 w-full overflow-y-scroll mx-auto z-20'>
      <RouterProvider router={router} />
    </div>

  </div>
}

export default App; 