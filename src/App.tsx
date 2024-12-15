import React, { Suspense, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsPanel from './components/StatsPanel';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import PricingSection from './components/PricingSection';
import DocumentationSection from './components/DocumentationSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(<>
      <Route path="/" element={
        <div className="App">
          <Navbar />
          <HeroSection />
          <StatsPanel />
          <FeaturesSection />
          <HowItWorks />
          <DocumentationSection />
          <PricingSection />
        </div>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        // loader={}
        lazy={async () => {
        const module = await import('./components/Dashboard')
        const Dashboard = module.default
        return {
          element: (
            <Suspense fallback={<div className='red text-8xl'>Loading</div>}>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Suspense>

          )
        }
      }} />

    </>
    )
  )


  return <RouterProvider router={router} />
}



export default App; 