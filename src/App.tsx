import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsPanel from './components/StatsPanel';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <StatsPanel />
    </div>
  );
}

export default App; 