import React from 'react';
import { FaUserCheck, FaShieldAlt, FaPercent, FaInfinity } from 'react-icons/fa';

const AdvantageCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="flex flex-col items-center p-6 bg-[#1a1a1a]/40 rounded-lg backdrop-blur-sm border border-[#333] hover:border-[#444] transition-all duration-300">
      <div className="text-4xl text-green-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </div>
  );
};

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: <FaUserCheck />,
      title: "Accessible Entry Point",
      description: "Begin trading with Level 1 access - democratizing algorithmic trading for all participants"
    },
    {
      icon: <FaShieldAlt />,
      title: "Asset Security",
      description: "Direct API integration ensures complete custody of your assets with institutional-grade security"
    },
    {
      icon: <FaPercent />,
      title: "Zero Commission Trading",
      description: "Execute trades through our optimized proxy system with zero additional transaction costs"
    },
    {
      icon: <FaInfinity />,
      title: "Perpetual Access Model",
      description: "Single staking grants permanent platform access - eliminating recurring subscription costs"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-white main-font">
          Strategic Advantages
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Key Platform Differentiators for Institutional-Grade Trading
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <AdvantageCard
              key={index}
              icon={advantage.icon}
              title={advantage.title}
              description={advantage.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection; 