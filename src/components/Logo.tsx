import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 外环 - 代表全球化交易网络 */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#gradientStroke)"
        strokeWidth="2"
        strokeDasharray="4 2"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* 神经网络节点连接 - 代表AI */}
      <path
        d="M20 50C20 30 35 20 50 20M80 50C80 70 65 80 50 80"
        stroke="url(#gradientAI)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.6"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;12"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      {/* 中心图形 - 结合T和箭头，代表上升趋势 */}
      <path
        d="M35 30H65M50 30L50 70L65 55"
        stroke="url(#gradientPrimary)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 数据节点 - 代表数据分析点 */}
      <circle cx="35" cy="30" r="4" fill="url(#gradientAccent)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="65" cy="30" r="4" fill="url(#gradientAccent)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>
      <circle cx="65" cy="55" r="4" fill="url(#gradientAccent)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
          begin="1s"
        />
      </circle>

      {/* 金融数据流动效果 */}
      <path
        d="M25 60Q50 40 75 60"
        stroke="url(#gradientFinance)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.4"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;16"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {/* 渐变定义 */}
      <defs>
        <linearGradient
          id="gradientPrimary"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>

        <linearGradient
          id="gradientAccent"
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>

        <linearGradient
          id="gradientStroke"
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient
          id="gradientAI"
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>

        <linearGradient
          id="gradientFinance"
          x1="0"
          y1="0"
          x2="100"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;