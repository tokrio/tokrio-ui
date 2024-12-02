import React, { useEffect, useRef } from 'react';

interface Token {
  name: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
}

const TokenCloud = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.3;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const tokenNames = [
      "BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "USDC", "ADA", "AVAX", "DOGE",
      "DOT", "TRX", "LINK", "TON", "MATIC", "UNI", "ICP", "SHIB", "LTC", "DAI",
      "BCH", "ETC", "XLM", "NEAR", "INJ", "OP", "XMR", "APT", "FIL", "ATOM",
      "IMX", "CRO", "HBAR", "LDO", "SEI", "VET", "ALGO", "ORDI", "GRT", "AAVE",
      "SAND", "MANA", "EGLD", "RUNE", "SUI", "THETA", "FLOW", "KAVA", "CAKE", "ARB"
    ];

    const expandedTokens = [...tokenNames, ...tokenNames, ...tokenNames, ...tokenNames];

    const tokens: Token[] = [];
    const centerX = canvas.width * 0.6;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.45;

    const layers = 15;
    let tokenIndex = 0;

    for (let layer = 0; layer < layers; layer++) {
      const layerRadius = radius * (layer + 1) / layers;
      const circumference = 2 * Math.PI * layerRadius;
      const tokensInLayer = Math.floor(circumference / 16);
      
      for (let i = 0; i < tokensInLayer && tokenIndex < expandedTokens.length; i++) {
        const angle = (2 * Math.PI * i) / tokensInLayer;
        const originX = centerX + Math.cos(angle) * layerRadius;
        const originY = centerY + Math.sin(angle) * layerRadius;

        tokens.push({
          name: expandedTokens[tokenIndex++ % expandedTokens.length],
          x: originX,
          y: originY,
          originX,
          originY,
          vx: 0,
          vy: 0,
          size: 6 + Math.random() * 3
        });
      }
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tokens.forEach(token => {
        token.vx += (Math.random() - 0.5) * 0.25;
        token.vy += (Math.random() - 0.5) * 0.25;

        const dx = token.originX - token.x;
        const dy = token.originY - token.y;
        token.vx += dx * 0.03;
        token.vy += dy * 0.03;

        token.vx *= 0.95;
        token.vy *= 0.95;

        token.x += token.vx;
        token.y += token.vy;

        const maxOffset = 8;
        if (Math.abs(token.x - token.originX) > maxOffset) {
          token.x = token.originX + Math.sign(token.x - token.originX) * maxOffset;
          token.vx *= -0.5;
        }
        if (Math.abs(token.y - token.originY) > maxOffset) {
          token.y = token.originY + Math.sign(token.y - token.originY) * maxOffset;
          token.vy *= -0.5;
        }

        ctx.font = `bold ${token.size}px monospace`;
        ctx.fillStyle = 'rgba(50, 255, 50, 0.8)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(token.name, token.x, token.y);
      });
    };

    const interval = setInterval(draw, 16);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute right-0 top-0 h-full"
      style={{ 
        filter: 'blur(0.5px)',
        opacity: 0.85
      }}
    />
  );
};

export default TokenCloud; 