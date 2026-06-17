import React, { useEffect, useRef } from 'react';

interface Candle {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
  targetOpen: number;
  targetClose: number;
  targetHigh: number;
  targetLow: number;
  isBullish: boolean;
}

export const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let candles: Candle[] = [];
    const candleCount = 45;
    const padding = 60; // Space at top and bottom

    // High performance resize handler
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      generateCandles();
    };

    // Generate initial candlestick dataset
    const generateCandles = () => {
      candles = [];
      const step = width / (candleCount + 1);
      
      let basePrice = height * 0.5; // Starting average Y coord
      let currentTrend = 0.3; // Upward bias initially

      for (let i = 0; i < candleCount; i++) {
        // Simple random walk with trend
        const change = (Math.random() - 0.42 + currentTrend) * (height * 0.08);
        basePrice = Math.max(padding * 1.5, Math.min(height - padding * 1.5, basePrice - change));

        // Periodically shift trends for natural market look
        if (i % 8 === 0) {
          currentTrend = (Math.random() - 0.5) * 0.9;
        }

        const size = (Math.random() * 0.12 + 0.02) * height;
        const isBullish = Math.random() > 0.42;

        const open = isBullish ? basePrice + size / 2 : basePrice - size / 2;
        const close = isBullish ? basePrice - size / 2 : basePrice + size / 2;
        const offset = Math.random() * (height * 0.04);
        const high = Math.min(open, close) - offset - (Math.random() * 10);
        const low = Math.max(open, close) + offset + (Math.random() * 10);

        candles.push({
          x: step * (i + 1),
          open,
          close,
          high,
          low,
          targetOpen: open,
          targetClose: close,
          targetHigh: high,
          targetLow: low,
          isBullish,
        });
      }
    };

    // Track mouse position on window
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial setup
    handleResize();

    let t = 0;

    // Simulation & Rendering loop
    const render = () => {
      t += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Check current theme
      const isDark = document.documentElement.classList.contains('dark');
      
      // Theme colors
      const gridColor = isDark ? 'rgba(201, 168, 76, 0.04)' : 'rgba(138, 111, 48, 0.05)';
      const lineIndicatorColor = isDark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(138, 111, 48, 0.1)';
      const fontColor = isDark ? 'rgba(240, 237, 230, 0.2)' : 'rgba(26, 26, 24, 0.18)';
      
      const upColor = isDark ? '#10B981' : '#059669'; // Emerald
      const upGlow = isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.06)';
      const downColor = isDark ? '#EF4444' : '#DC2626'; // Rose/Red
      const downGlow = isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.06)';

      const maColor = isDark ? 'rgba(201, 168, 76, 0.35)' : 'rgba(138, 111, 48, 0.4)'; // Gold Moving Average Line

      // 1. Draw Grid lines (horizontal & vertical)
      ctx.lineWidth = 1;
      ctx.strokeStyle = gridColor;

      // Vertical grid
      const gridSpacingX = width / 12;
      for (let x = gridSpacingX; x < width; x += gridSpacingX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid with subtle price tags
      const gridSpacingY = height / 8;
      ctx.font = '9px monospace';
      ctx.fillStyle = fontColor;
      for (let y = gridSpacingY; y < height; y += gridSpacingY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Simulated price tag on right side
        const simulatedPrice = (15000 + (height - y) * 12.5).toFixed(0);
        ctx.fillText(simulatedPrice, width - 42, y - 4);
      }

      // 2. Real-time dynamic wave calculations for all candle points (creating a premium floating wave effect)
      const getFloatingParams = (c: Candle, index: number) => {
        // Elegant multi-frequency floating wave pattern so they never move rigidly
        const floatShift = Math.sin(t * 0.45 + index * 0.22) * 12 + Math.cos(t * 0.18 + index * 0.08) * 6;
        
        // Active candle retains continuous real-time market noise oscillation
        let marketNoise = 0;
        if (index === candles.length - 1) {
          marketNoise = Math.sin(t * 1.6) * 5;
        }

        const open = c.open + floatShift;
        const close = c.close + floatShift + marketNoise;
        const high = Math.min(c.high + floatShift, Math.min(open, close) - 4);
        const low = Math.max(c.low + floatShift, Math.max(open, close) + 4);

        return {
          x: c.x,
          open,
          close,
          high,
          low,
          isBullish: close < open
        };
      };

      // 3. Render Trend lines (Moving Averages) matching the floating candles perfectly
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = maColor;
      ctx.setLineDash([6, 4]); // Clean dashed trading EMA look

      candles.forEach((c, idx) => {
        const f = getFloatingParams(c, idx);
        // Average Y position of candle body center
        const centerY = (f.open + f.close) / 2;
        if (idx === 0) {
          ctx.moveTo(f.x, centerY);
        } else {
          // Smooth bezier curve for financial analytics feel
          const prevRaw = candles[idx - 1];
          const prev = getFloatingParams(prevRaw, idx - 1);
          const prevY = (prev.open + prev.close) / 2;
          ctx.bezierCurveTo(
            prev.x + (f.x - prev.x) / 2, prevY,
            prev.x + (f.x - prev.x) / 2, centerY,
            f.x, centerY
          );
        }
      });
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash state

      // 4. Render Candlesticks with Floating Motion
      candles.forEach((c, idx) => {
        const f = getFloatingParams(c, idx);
        const isBullish = f.isBullish;
        const color = isBullish ? upColor : downColor;
        const glow = isBullish ? upGlow : downGlow;

        // Draw Wick (High & Low)
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(f.x, f.high);
        ctx.lineTo(f.x, f.low);
        ctx.stroke();

        // Draw Candle Body (Open & Close)
        const topY = Math.min(f.open, f.close);
        const bottomY = Math.max(f.open, f.close);
        const bodyHeight = Math.max(3, bottomY - topY);
        const bodyWidth = Math.max(4, Math.min(18, width / 65));

        // Shadow/Glow effect around the candle
        ctx.shadowColor = color;
        ctx.shadowBlur = isDark ? 8 : 2;
        ctx.fillStyle = glow;
        ctx.fillRect(f.x - bodyWidth / 2 - 2, topY - 2, bodyWidth + 4, bodyHeight + 4);

        // Solid main body
        ctx.shadowBlur = 0; // Reset shadow for crisp solid rectangle
        ctx.fillStyle = color;
        ctx.fillRect(f.x - bodyWidth / 2, topY, bodyWidth, bodyHeight);

        // Optional hollow design typical in charts (bullish is hollow/semi-transparent, bearish solid)
        if (isBullish) {
          ctx.fillStyle = isDark ? '#0A0A0C' : '#FAF8F5'; // Matches theme background to look hollow
          ctx.fillRect(f.x - (bodyWidth - 3) / 2, topY + 1.5, bodyWidth - 3, bodyHeight - 3);
        }
      });

      // 5. Interactive TradingView crosshair lines on mouse movement
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx >= 0 && mx <= width && my >= 0 && my <= height) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = lineIndicatorColor;
        ctx.setLineDash([3, 5]);

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx, height);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, my);
        ctx.lineTo(width, my);
        ctx.stroke();
        ctx.setLineDash([]); // Reset

        // Floating dynamic crosshair price badge
        ctx.fillStyle = isDark ? 'rgba(201, 168, 76, 0.9)' : 'rgba(138, 111, 48, 0.95)';
        ctx.fillRect(width - 65, my - 10, 60, 20);
        
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = isDark ? '#0A0A0C' : '#FAF8F5';
        const rawPriceValue = (15000 + (height - my) * 12.5).toFixed(1);
        ctx.fillText(rawPriceValue, width - 60, my + 3);

        // Micro target focal point circle
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? '#C9A84C' : '#8A6F30';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = isLight ? 'rgba(250, 248, 245, 0.98)' : 'rgba(10, 10, 12, 0.98)';
        ctx.fill();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const isLight = !document.documentElement.classList.contains('dark');

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-45 sm:opacity-65"
    />
  );
};
