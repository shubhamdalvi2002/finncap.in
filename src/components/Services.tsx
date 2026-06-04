import React, { useState } from 'react';
import { TrendingUp, PieChart, LayoutGrid, Clock, Wallet, ArrowRightLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SERVICES = [
  {
    id: 'stocks',
    name: 'Stocks',
    tag: 'Direct Equity',
    horizon: '5+ Years',
    purpose: 'Alpha Generation',
    risk: 'Aggressive Risk',
    yield: '15-22% est.',
    desc: "Smart equity investments with research-backed picks to participate in India's growth story.",
    icon: <TrendingUp className="text-gold" size={18} />,
    groups: ['all', 'growth']
  },
  {
    id: 'mf',
    name: 'Mutual Funds',
    tag: 'Managed Wealth',
    horizon: '3+ Years',
    purpose: 'Asset Diversification',
    risk: 'Moderate-High',
    yield: '12-16% est.',
    desc: 'Curated fund portfolios matching your risk appetite, timeline, and return expectations.',
    icon: <PieChart className="text-gold" size={18} />,
    groups: ['all', 'growth', 'income']
  },
  {
    id: 'etf',
    name: 'ETFs',
    tag: 'Passive Indexing',
    horizon: '5+ Years',
    purpose: 'Low-cost Exposure',
    risk: 'Moderate Risk',
    yield: '11-14% est.',
    desc: 'Low-cost, highly transparent exposure to major national indices and key sectors.',
    icon: <LayoutGrid className="text-gold" size={18} />,
    groups: ['all', 'growth', 'tactical']
  },
  {
    id: 'sip',
    name: 'SIP',
    tag: 'Systematic Investment',
    horizon: '3 - 10+ Years',
    purpose: 'Rupee Cost Averaging',
    risk: 'Market Linked',
    yield: '12-15% est.',
    desc: 'Invest regularly with steady discipline. Let compounding do the heavy lifting.',
    icon: <Clock className="text-gold" size={18} />,
    groups: ['all', 'growth', 'tactical']
  },
  {
    id: 'swp',
    name: 'SWP',
    tag: 'Systematic Withdrawal',
    horizon: 'Retirement / Payout',
    purpose: 'Tax-efficient Income',
    risk: 'Conservative',
    yield: '6-8% steady',
    desc: 'Generate a reliable, recurring payout stream from your accumulated mutual fund corpus.',
    icon: <Wallet className="text-gold" size={18} />,
    groups: ['all', 'income']
  },
  {
    id: 'stp',
    name: 'STP',
    tag: 'Systematic Transfer',
    horizon: 'Volatile Phases',
    purpose: 'Strategic Rebalancing',
    desc: 'Tactically shift investments between equity/debt funds to manage equity volatility.',
    icon: <ArrowRightLeft className="text-gold" size={18} />,
    risk: 'Risk Balanced',
    yield: '8-11% defensive',
    groups: ['all', 'tactical']
  }
];

const FILTER_TABS = [
  { id: 'all', label: 'All Services', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'growth', label: 'Wealth Acceleration', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'income', label: 'Retirement Cashouts', icon: <Wallet className="w-3.5 h-3.5" /> },
  { id: 'tactical', label: 'Volatility Shield', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
];

const ADVICE_TIPS: Record<string, string> = {
  all: "FinAura implements scientific, non-correlated diversification strategies to safely compound and shield client portfolios.",
  growth: "Bespoke equity selection & diversified system SIPs configured to catch rapid compounded CAGR and beat long-term inflation tags.",
  income: "A smart SWP allocation provides stable, liquid monthly income streams while remaining highly tax-efficient compared to fixed deposits.",
  tactical: "STP mechanics act as defensive shield ladders—gradually shifting volatile capital into safer equity positions in volatile times."
};

export const Services: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  return (
    <section id="services" className="py-20 px-6 bg-bg-dark-2 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-gold/2 blur-[120px] pointer-events-none" />

      <div className="text-center mb-10 relative z-10">
        <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">What We Offer</div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-white">Comprehensive Financial Services</h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-xs sm:text-sm">
          Dynamic allocation tools designed by expert Shubham Dalvi to compound and defend your capital systematically.
        </p>
      </div>

      {/* COMPACT INTERACTIVE SELECTOR HEADER */}
      <div className="max-w-5xl mx-auto mb-10 relative z-10 text-center">
        <div className="inline-flex flex-wrap justify-center p-1 bg-bg-dark-3/60 rounded-2xl border border-gold/10 gap-1 mb-5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10.5px] uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-gold text-bg-dark shadow-md shadow-gold/15'
                  : 'text-muted-foreground hover:text-white hover:bg-gold/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tailored Dynamic Advice Strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="bg-bg-dark-3/40 backdrop-blur-md border border-gold/10 py-3 px-5 max-w-2xl mx-auto rounded-2xl text-center text-xs flex items-center justify-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping shrink-0" />
            <p className="text-muted-foreground italic leading-relaxed">
              <strong className="text-gold font-semibold uppercase tracking-wider font-mono mr-1">Founder Tip:</strong>
              {ADVICE_TIPS[activeFilter]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto relative z-10">
        {SERVICES.map((service, i) => {
          const isHighlighted = service.groups.includes(activeFilter);
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`group bg-bg-dark-3 border rounded-2xl p-5 hover:shadow-xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${
                isHighlighted 
                  ? 'border-gold/25 hover:border-gold/45 hover:shadow-gold/5 bg-bg-dark-3' 
                  : 'border-gold/5 opacity-35 bg-bg-dark-3/30 hover:opacity-100 hover:border-gold/20'
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/40 to-transparent transition-opacity duration-500 ${isHighlighted ? 'opacity-100' : 'opacity-0'}`} />
              
              <div>
                {/* Header: Icon, Name and Tag Side by Side */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    isHighlighted 
                      ? 'bg-gold/10 border border-gold/30 group-hover:scale-105 group-hover:bg-gold/15' 
                      : 'bg-gold/5 border border-gold/15'
                  }`}>
                    {service.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold text-white group-hover:text-gold transition-colors truncate">{service.name}</h3>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-gold/60 uppercase block truncate leading-none mt-0.5">{service.tag}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
              </div>

              {/* Enhanced 3-Column Parameters Metadata density for maximum visual alignment */}
              <div className="pt-3.5 border-t border-gold/10 grid grid-cols-3 gap-2.5 text-[9.5px] text-muted-foreground/75 font-mono">
                <div>
                  <span className="text-[7.5px] text-muted-foreground/45 block uppercase tracking-wider leading-none mb-1">Purpose</span>
                  <span className="text-white/95 font-semibold truncate block leading-tight">{service.purpose}</span>
                </div>
                <div className="text-center">
                  <span className="text-[7.5px] text-muted-foreground/45 block uppercase tracking-wider leading-none mb-1">Risk profile</span>
                  <span className={`font-semibold truncate block leading-tight ${
                    service.risk.includes('Aggressive') || service.risk.includes('High')
                      ? 'text-red-400'
                      : service.risk.includes('Moderate') || service.risk.includes('Linked')
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }`}>{service.risk}</span>
                </div>
                <div className="text-right">
                  <span className="text-[7.5px] text-muted-foreground/45 block uppercase tracking-wider leading-none mb-1">Est Yield</span>
                  <span className="text-gold font-bold truncate block leading-tight">{service.yield}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
