import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DocumentationSection from './components/DocumentationSection';
import FeaturesSection from './components/FeaturesSection';
import Guidelines from './components/HowItWorks';
import StakingPage from './pages/StakingPage';
import SponsorPage from './pages/SponsorPage';
import MarketPage from './pages/MarketPage';
import SponsorSharePage from './pages/SponsorSharePage';
import MatrixRain from './components/MatrixRain';
import TokenUsageSection from './components/TokenUsageSection';
import TokenUtilitySection from './components/TokenUtilitySection';
import Tokenomics from './components/Tokenomics';
import Footer from './components/Footer';
import StatsPanel from './components/StatsPanel';
import IncreaseEquity from './components/IncreaseEquity';
import AdvantagesSection from './components/AdvantagesSection';
import LevelBenefitsPage from './pages/LevelBenefitsPage';
import JarvisPage from './pages/JarvisPage';
import ClaimPage from './pages/ClaimPage';
import IntroPage from './pages/IntroPage';

// Lazy loading implementation
const Dashboard = React.lazy(() => import('./components/Dashboard'));

function App() {

  const [isOpen, setIsOpen] = React.useState(true);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar />
          <HeroSection />
          <StatsPanel />
          <AdvantagesSection />
          <Guidelines />
          <TokenUsageSection />
          <TokenUtilitySection />
          <Tokenomics />
          <FeaturesSection />
          <DocumentationSection />
          <Footer />
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
      path: "/claim",
      element: <ClaimPage />
    },
    {
      path: "/intro",
      element: <IntroPage />
    },
    {
      path: "/dashboard",
      element: (
        <Suspense fallback={<div className='red text-8xl'></div>}>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: "/userSponsors",
      element: <SponsorPage />
    },
    {
      path: "/sponsor/share/:address",
      element: <SponsorSharePage />
    },
    {
      path: "/levels",
      element: <LevelBenefitsPage />
    },
    {
      path: "/jarvis",
      element: <JarvisPage />
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