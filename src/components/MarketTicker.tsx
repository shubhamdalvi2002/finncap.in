import React from 'react';
import { useMarketData } from '../hooks/useMarketData';

export const MarketTicker: React.FC = () => {
  const { stocks, connected } = useMarketData();

  return (
    <div className="fixed top-[68px] left-0 right-0 z-[190] bg-[rgb(var(--background))] border-b border-gold/20 overflow-hidden h-[34px] flex items-center">
      <div className="flex whitespace-nowrap animate-ticker">
        {[...stocks, ...stocks].map((s, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-8 text-[0.75rem] font-medium border-r border-gold/20">
            <span className="text-muted-foreground tracking-wider">{s.name}</span>
            <span className="font-semibold">
              {s.name.includes('AAPL') || s.name.includes('GOOGL') || s.name.includes('MSFT') ? '$' : '₹'}
              {s.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={s.change >= 0 ? 'text-green-500' : 'text-red-500'}>
              <span className="text-[0.65rem]">{s.change >= 0 ? '▲' : '▼'}</span> {s.change >= 0 ? '+' : ''}{s.change}%
            </span>
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
