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
      title: "Low Entry Barrier",
      description: "Start trading with just Level 1 access - making it accessible for everyone to begin their trading journey"
    },
    {
      icon: <FaShieldAlt />,
      title: "Zero Capital Risk",
      description: "Pure API operations ensure your funds remain in your control, guaranteeing complete trading security"
    },
    {
      icon: <FaPercent />,
      title: "No Trading Fees",
      description: "Trade through our proxy system with zero additional fees, maximizing your trading efficiency"
    },
    {
      icon: <FaInfinity />,
      title: "Stake Once, Use Forever",
      description: "One-time staking grants permanent access - no monthly fees or recurring charges"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-white main-font">
          Core Advantages
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Why Choose Us? Four Key Benefits for Worry-free Trading
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