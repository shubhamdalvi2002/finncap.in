import React, { useState } from 'react';
import { useMarketData, Stock } from '../hooks/useMarketData';
import { motion, AnimatePresence } from 'motion/react';

export const MarketTicker: React.FC = () => {
  const { stocks, connected } = useMarketData();
  const [hoveredStock, setHoveredStock] = useState<{ stock: Stock; index: number } | null>(null);

  const formatValue = (val: number | undefined) => {
    if (val === undefined) return 'N/A';
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e7) return (val / 1e7).toFixed(2) + 'Cr';
    if (val >= 1e5) return (val / 1e5).toFixed(2) + 'L';
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="fixed top-[68px] left-0 right-0 z-[190] bg-[rgb(var(--background))] border-b border-gold/20 h-[34px] flex items-center">
      <div 
        className={`flex whitespace-nowrap animate-ticker ${hoveredStock ? 'pause-animation' : ''}`}
      >
        {[...stocks, ...stocks].map((s, i) => (
          <div 
            key={i} 
            className="relative inline-flex items-center gap-2 px-8 text-[0.75rem] font-medium border-r border-gold/20 cursor-help group h-full"
            onMouseEnter={() => setHoveredStock({ stock: s, index: i })}
            onMouseLeave={() => setHoveredStock(null)}
          >
            <span className="text-muted-foreground tracking-wider">{s.name}</span>
            <span className="font-semibold">
              {s.name.includes('AAPL') || s.name.includes('GOOGL') || s.name.includes('MSFT') ? '$' : '₹'}
              {s.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={s.change >= 0 ? 'text-green-500' : 'text-red-500'}>
              <span className="text-[0.65rem]">{s.change >= 0 ? '▲' : '▼'}</span> {s.change >= 0 ? '+' : ''}{s.change}%
            </span>

            <AnimatePresence>
              {hoveredStock?.index === i && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-bg-dark-2 border border-gold/30 rounded-lg shadow-2xl p-3 z-[1000] pointer-events-none"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-gold/10 pb-1 mb-1">
                      <span className="text-gold font-bold">{s.name}</span>
                      <span className={s.change >= 0 ? 'text-green-500' : 'text-red-500'}>{s.change}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[0.65rem]">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase tracking-tighter">Day High</span>
                        <span className="text-white font-mono">₹{s.high?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase tracking-tighter">Day Low</span>
                        <span className="text-white font-mono">₹{s.low?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase tracking-tighter">Volume</span>
                        <span className="text-white font-mono">{formatValue(s.volume)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase tracking-tighter">Mkt Cap</span>
                        <span className="text-white font-mono">{formatValue(s.marketCap)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-dark-2 border-b border-r border-gold/30 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {!connected && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[0.6rem] text-red-500">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Offline
        </div>
      )}
    </div>
  );
};
