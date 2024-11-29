import React from 'react';
import CountUp from 'react-countup';

const CountUpAnimation = ({ end, prefix, suffix = '' }: { end: number; prefix: string; suffix?: string }) => {
  return (
    <div className="text-4xl md:text-5xl font-bold text-primary">
      <CountUp end={end} prefix={prefix} suffix={suffix} duration={2.5} />
    </div>
  );
};

const StatsPanel = () => {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Trading Volume
            </h3>
            <CountUpAnimation end={1000000} prefix="$" />
            <p className="text-gray-500 mt-2">24h Volume</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Active Users
            </h3>
            <CountUpAnimation end={5000} prefix="" suffix="+" />
            <p className="text-gray-500 mt-2">Worldwide</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Success Rate
            </h3>
            <CountUpAnimation end={98} prefix="" suffix="%" />
            <p className="text-gray-500 mt-2">Trading Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 