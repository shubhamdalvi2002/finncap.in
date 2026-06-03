import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const STOCKS_LIST = [
  'RELIANCE INDUSTRIES',
  'TATA CONSULTANCY SERVICES (TCS)',
  'HDFC BANK',
  'INFOSYS LIMITED',
  'ICICI BANK',
  'WIPRO',
  'BAJAJ FINANCE',
  'LARSEN & TOUBRO (L&T)',
  'MARUTI SUZUKI',
  'NIFTY 50 INDEX',
  'SENSEX INDEX',
  'NIFTY BANK INDEX',
  'NIFTY MIDCAP 100',
  'NIFTY IT INDEX'
];

const MF_LIST = [
  'Parag Parikh Flexi Cap Fund',
  'SBI Bluechip Fund',
  'HDFC Mid-Cap Opportunities Fund',
  'Mirae Asset Large Cap Fund',
  'Nippon India Growth Fund',
  'ICICI Prudential Bluechip Fund',
  'Axis Small Cap Fund',
  'Kotak Emerging Equity Fund',
  'UTI Nifty 50 Index Fund',
  'Tata Digital India Fund',
  'Canara Robeco Bluechip Equity',
  'Quant Active Fund'
];

// Combine and shuffle slightly to make the scrolling experience rich
const ALL_TICKERS = [
  ...STOCKS_LIST.map(name => ({ name, type: 'Stock' })),
  ...MF_LIST.map(name => ({ name, type: 'Mutual Fund' }))
];

export const MarketTicker: React.FC = () => {
  // Duplicate list to ensure seamless infinite scrolling loop
  const scrollItems = [...ALL_TICKERS, ...ALL_TICKERS, ...ALL_TICKERS];

  return (
    <div id="market-ticker" className="fixed top-[60px] md:top-[68px] left-0 right-0 z-[190] bg-bg-dark border-b border-gold/15 h-[36px] flex items-center overflow-hidden">
      {/* Title Badge */}
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-bg-dark border-r border-gold/15 flex items-center gap-2 z-10 select-none shadow-[4px_0_12px_rgba(0,0,0,0.8)]">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[9px] md:text-[10px] font-sans font-extrabold uppercase tracking-widest text-gold flex items-center gap-1">
          Daily Update
        </span>
      </div>

      {/* Marquee Container */}
      <div className="w-full h-full flex items-center pl-[125px]">
        <div className="flex items-center gap-12 whitespace-nowrap animate-ticker py-1">
          {scrollItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="inline-flex items-center gap-3 text-[11px] md:text-[12px] font-medium tracking-wide group cursor-default transition-all hover:text-gold"
            >
              <Sparkles size={10} className="text-gold/60 group-hover:text-gold group-hover:scale-125 transition-transform" />
              
              <span className="text-foreground font-semibold">
                {item.name}
              </span>

              <span className={`px-2 py-[1px] text-[8px] font-extrabold tracking-widest uppercase rounded-full ${
                item.type === 'Stock' 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15' 
                  : 'bg-gold/10 text-gold-light border border-gold/15'
              }`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
