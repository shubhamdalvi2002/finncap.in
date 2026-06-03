import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Shield, Award, PieChart, Star, TrendingUp, Layers, Compass } from 'lucide-react';

interface SecurityItem {
  name: string;
  type: 'Stock' | 'Mutual Fund';
  category: string;
  tag: string;
  description: string;
}

const SECURITIES_DATA: SecurityItem[] = [
  // Stocks
  {
    name: 'RELIANCE INDUSTRIES',
    type: 'Stock',
    category: 'Conglomerate / Energy & Retail',
    tag: 'Market Leader',
    description: 'India\'s largest private sector enterprise spanning energy, petrochemicals, retail, and telecommunications.'
  },
  {
    name: 'TATA CONSULTANCY SERVICES (TCS)',
    type: 'Stock',
    category: 'Information Technology',
    tag: 'Bluechip',
    description: 'An IT services, consulting, and business solutions organization offering services worldwide.'
  },
  {
    name: 'HDFC BANK',
    type: 'Stock',
    category: 'Banking & Financials',
    tag: 'Private Banking',
    description: 'The largest private sector bank in India by assets and a pillar of the financial market.'
  },
  {
    name: 'INFOSYS LIMITED',
    type: 'Stock',
    category: 'Information Technology',
    tag: 'IT Giant',
    description: 'A global leader in next-generation digital services, consulting, and platform engineering.'
  },
  {
    name: 'ICICI BANK',
    type: 'Stock',
    category: 'Banking & Financials',
    tag: 'Strong Retail',
    description: 'Leading private sector bank offering structured retail and corporate banking resources.'
  },
  {
    name: 'WIPRO',
    type: 'Stock',
    category: 'Information Technology',
    tag: 'Global Tech',
    description: 'Renowned technology consulting and business process services company.'
  },
  {
    name: 'BAJAJ FINANCE',
    type: 'Stock',
    category: 'Non-Banking Financial (NBFC)',
    tag: 'High Growth',
    description: 'One of the most diversified NBFCs in the Indian market, serving millions of active consumers.'
  },
  {
    name: 'LARSEN & TOUBRO (L&T)',
    type: 'Stock',
    category: 'Engineering & Construction',
    tag: 'Infrastructure',
    description: 'Multinational conglomerate engaged in technology, engineering, construction, manufacturing, and financial services.'
  },
  {
    name: 'MARUTI SUZUKI',
    type: 'Stock',
    category: 'Automobile',
    tag: 'Consumer Goods',
    description: 'The absolute market leader in India\'s passenger vehicle industry.'
  },
  {
    name: 'NIFTY 50 INDEX',
    type: 'Stock',
    category: 'Index Tracker',
    tag: 'Benchmark',
    description: 'The benchmark broad-based stock market index of the National Stock Exchange of India (NSE).'
  },
  {
    name: 'SENSEX INDEX',
    type: 'Stock',
    category: 'Index Tracker',
    tag: 'Benchmark',
    description: 'The oldest stock index in India (BSE), tracking 30 well-established companies.'
  },
  // Mutual Funds
  {
    name: 'Parag Parikh Flexi Cap Fund',
    type: 'Mutual Fund',
    category: 'Equity: Flexi Cap',
    tag: 'Diversified',
    description: 'A globally diversified fund investing in large, mid, and small-cap companies with a value philosophy.'
  },
  {
    name: 'SBI Bluechip Fund',
    type: 'Mutual Fund',
    category: 'Equity: Large Cap',
    tag: 'Stable Core',
    description: 'Focuses on active long-term capital growth by investing in high-potential bluechip enterprises.'
  },
  {
    name: 'HDFC Mid-Cap Opportunities Fund',
    type: 'Mutual Fund',
    category: 'Equity: Mid Cap',
    tag: 'Alpha Seeker',
    description: 'One of India\'s largest mid-cap specialized funds designed to capture fast-growing medium companies.'
  },
  {
    name: 'Mirae Asset Large Cap Fund',
    type: 'Mutual Fund',
    category: 'Equity: Large Cap',
    tag: 'Consistent',
    description: 'Robust quality-focused portfolio aiming to outperform top index standards continuously.'
  },
  {
    name: 'Nippon India Growth Fund',
    type: 'Mutual Fund',
    category: 'Equity: Mid Cap',
    tag: 'Legacy Growth',
    description: 'Focuses on capital appreciation through investments in mid-cap equity and equity-related securities.'
  },
  {
    name: 'ICICI Prudential Bluechip Fund',
    type: 'Mutual Fund',
    category: 'Equity: Large Cap',
    tag: 'Safeguard Large',
    description: 'A reliable scheme centered around fundamentally strong, large-sized bluechip corporations.'
  },
  {
    name: 'Axis Small Cap Fund',
    type: 'Mutual Fund',
    category: 'Equity: Small Cap',
    tag: 'High Risk/Return',
    description: 'Designed to unlock value from robust emerging smaller enterprises with strong management qualities.'
  },
  {
    name: 'Kotak Emerging Equity Fund',
    type: 'Mutual Fund',
    category: 'Equity: Mid Cap',
    tag: 'Value Compounder',
    description: 'Invests predominantly in mid-sized firms demonstrating superior structural growth metrics.'
  },
  {
    name: 'UTI Nifty 50 Index Fund',
    type: 'Mutual Fund',
    category: 'Equity: Index / Passive',
    tag: 'Low Expense',
    description: 'A passively managed solution replicate the performance profile of the benchmark Nifty 50 Index.'
  },
  {
    name: 'Tata Digital India Fund',
    type: 'Mutual Fund',
    category: 'Equity: Sectoral / IT',
    tag: 'Tech Focused',
    description: 'Highly targeted theme portfolio leveraging India\'s powerful technology and digital revolution.'
  }
];

export const MarketUpdate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'mutual' | 'stocks'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSecurities = SECURITIES_DATA.filter((sec) => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'mutual' && sec.type === 'Mutual Fund') ||
      (activeTab === 'stocks' && sec.type === 'Stock');

    const matchesSearch = 
      sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.tag.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <section id="market-update" className="py-24 bg-bg-dark-2 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 border border-gold/20 text-gold text-[10px] md:text-[11px] font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full bg-gold/5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Market Updates
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Daily <span className="text-gold">Securities</span> Watchlist
          </h2>
          <p className="text-muted-foreground text-sm md:text-base font-light">
            Stay aligned with today\'s most monitored equities and prominent mutual fund schemes. 
            Curated list updated daily, showcasing names, categories, and investment profiles.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-bg-dark-3/50 backdrop-blur-md rounded-2xl border border-gold/15 p-4 md:p-6 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Tabs */}
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-full border border-gold/10 w-full md:w-auto overflow-x-auto no-scrollbar justify-center">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gold text-bg-dark shadow-lg shadow-gold/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Assets ({SECURITIES_DATA.length})
            </button>
            <button
              onClick={() => setActiveTab('mutual')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeTab === 'mutual'
                  ? 'bg-gold text-bg-dark shadow-lg shadow-gold/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mutual Funds ({SECURITIES_DATA.filter(s => s.type === 'Mutual Fund').length})
            </button>
            <button
              onClick={() => setActiveTab('stocks')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeTab === 'stocks'
                  ? 'bg-gold text-bg-dark shadow-lg shadow-gold/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Equity Stocks ({SECURITIES_DATA.filter(s => s.type === 'Stock').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search securities by name or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 text-sm pl-10 pr-4 py-2.5 rounded-full border border-gold/20 focus:border-gold focus:outline-none transition-colors"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Cards Grid */}
        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSecurities.map((sec) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={sec.name}
                className="bg-bg-dark-3 border border-gold/10 hover:border-gold/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative glow hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors pointer-events-none" />

                <div>
                  {/* Badges */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      sec.type === 'Stock'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                        : 'bg-gold/10 text-gold-light border border-gold/15'
                    }`}>
                      {sec.type}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                      {sec.tag}
                    </span>
                  </div>

                  {/* Securities Name */}
                  <h3 className="font-serif text-lg font-bold text-foreground mb-1 leading-snug group-hover:text-gold transition-colors">
                    {sec.name}
                  </h3>
                  
                  {/* Sector / Category */}
                  <p className="text-[10px] text-gold/80 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-medium">
                    <Layers size={10} />
                    {sec.category}
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground/90 text-[12px] font-light leading-relaxed mb-6">
                    {sec.description}
                  </p>
                </div>

                {/* Card footer details */}
                <div className="pt-4 border-t border-gold/10 flex justify-between items-center text-[10px] text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1">
                    <Compass size={12} className="text-gold/60" />
                    Updated Today
                  </span>
                  <span className="flex items-center gap-0.5 text-gold">
                    <Star size={10} className="fill-gold" />
                    Active Tracker
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredSecurities.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-bg-dark-3/40 border border-gold/10 rounded-2xl"
          >
            <p className="text-muted-foreground font-light mb-2">No securities match your search parameters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }} 
              className="text-gold hover:underline text-xs"
            >
              Clear filters and search
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};
