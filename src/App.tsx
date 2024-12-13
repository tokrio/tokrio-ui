import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsPanel from './components/StatsPanel';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PricingSection from './components/PricingSection';
import DocumentationSection from './components/DocumentationSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';

function App() {
  return (
    <Router>
      <Routes>
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
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App; 