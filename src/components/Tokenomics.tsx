import React from 'react';
import { motion } from 'framer-motion';

const Tokenomics = () => {
  const distribution = [
    { category: "Private Sale", percentage: 10, color: "#FFA41C" },
    { category: "Public Sale", percentage: 15, color: "#FFD700" },
    { category: "Team", percentage: 15, color: "#FF6B6B" },
    { category: "Ecosystem & Community", percentage: 40, color: "#4CAF50" },
    { category: "Liquidity & Market", percentage: 15, color: "#2196F3" },
    { category: "Project Reserve", percentage: 5, color: "#9C27B0" }
  ];

  // 计算饼图的SVG路径
  const generatePieChart = () => {
    const total = distribution.reduce((sum, item) => sum + item.percentage, 0);
    let currentAngle = 0;
    const paths = [];
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    for (const item of distribution) {
      const angle = (item.percentage / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      // 转换角度为弧度
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      // 计算路径点
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      
      // 生成SVG路径
      const largeArcFlag = angle > 180 ? 1 : 0;
      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      paths.push({ path, color: item.color });
      currentAngle += angle;
    }

    return paths;
  };

  const pieChartPaths = generatePieChart();

  return (
    <div className="py-24 bg-[#111]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="hero-text mb-4">Tokenomics</h2>
          <p className="text-xl text-gray-400">
            TOKR token distribution and allocation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* 饼图 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
              {pieChartPaths.map((item, index) => (
                <path
                  key={index}
                  d={item.path}
                  fill={item.color}
                  stroke="#111"
                  strokeWidth="1"
                >
                  <title>{distribution[index].category}: {distribution[index].percentage}%</title>
                </path>
              ))}
            </svg>
          </motion.div>

          {/* 图例和详情 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {distribution.map((item) => (
              <div key={item.category} className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.category}</span>
                    <span className="text-primary">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Token Details</h3>
              <div className="space-y-4 text-gray-400">
                <div>
                  <strong className="text-white">Total Supply:</strong> 1,000,000,000 TOKR
                </div>
                <div>
                  <strong className="text-white">Initial Circulating Supply:</strong> 25%
                </div>
                <div>
                  <strong className="text-white">Token Type:</strong> BEP-20
                </div>
                <div className="pt-4">
                  <h4 className="text-white font-bold mb-2">Vesting Schedule</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Private Sale: 10% at TGE, 6 months linear vesting</li>
                    <li>Team: 12 months cliff, 24 months linear vesting</li>
                    <li>Advisors: 6 months cliff, 18 months linear vesting</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tokenomics; 