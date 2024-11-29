import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const tokens = [
      "BTC", "ETH", "USDT", "BNB", "SOL", 
      "XRP", "USDC", "ADA", "AVAX", "DOGE",
      "DOT", "TRX", "LINK", "TON", "MATIC",
      "UNI", "ICP", "SHIB", "LTC", "DAI",
      "BCH", "ETC", "XLM", "NEAR", "INJ",
      "OP", "XMR", "APT", "FIL", "ATOM",
      "IMX", "CRO", "HBAR", "LDO", "SEI",
      "VET", "ALGO", "ORDI", "GRT", "AAVE"
    ];

    const colors = [
      '#06B6D4',  // 青色
      '#3B82F6',  // 蓝色
      '#6366F1',  // 靛蓝色
      '#8B5CF6',  // 紫色
      '#0EA5E9',  // 天蓝色
      '#22D3EE'   // 浅青色
    ];

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = tokens[Math.floor(Math.random() * tokens.length)];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.font = `${fontSize}px monospace`;
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        ctx.shadowBlur = 0;

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ 
        filter: 'blur(0.5px)',
        opacity: 0.75
      }}
    />
  );
};

export default MatrixRain; 