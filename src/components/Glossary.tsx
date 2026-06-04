import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, ChevronDown, Award, HelpCircle, ArrowRight } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'mutual_funds' | 'growth' | 'market';
  whyItMatters: string;
  example?: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'SIP (Systematic Investment Plan)',
    category: 'mutual_funds',
    definition: 'An investment structure that allows you to invest a fixed amount of money at regular intervals (usually monthly) into a chosen mutual fund scheme.',
    whyItMatters: 'It instills investing discipline, eliminates the need to time the market, and leverages Rupee Cost Averaging.',
    example: 'Investing ₹5,000 on the 5th of every month into an equity mutual fund, regardless of whether the market is up or down.'
  },
  {
    term: 'STP (Systematic Transfer Plan)',
    category: 'mutual_funds',
    definition: 'A mechanism that allows you to systematically transfer a fixed amount of money from one mutual fund scheme (usually a low-risk debt/liquid fund) to another scheme (usually a high-growth equity fund).',
    whyItMatters: 'It helps you deploy a lump-sum amount into volatile stock markets slowly and safely while earning moderate returns on the remaining capital.',
    example: 'Parking ₹12 Lakhs in a liquid fund and auto-transferring ₹10,000 every week into an index fund for stable transition.'
  },
  {
    term: 'SWP (Systematic Withdrawal Plan)',
    category: 'mutual_funds',
    definition: 'A facility that lets you customize a regular flow of payouts from your accumulated mutual fund investments by withdrawing a fixed amount at periodic intervals.',
    whyItMatters: 'It acts as a secure "salary" post-retirement while leaving the remaining principal to compound. It is also significantly more tax-efficient than interest payouts.',
    example: 'withdrawing ₹30,000 every month from a retirement corpus of ₹50 Lakhs, enjoying low long-term capital gains tax.'
  },
  {
    term: 'CAGR (Compound Annual Growth Rate)',
    category: 'growth',
    definition: 'The smoothed annual rate at which an asset or investment grows, assuming profits are reinvested at the end of each year over the specified timeline.',
    whyItMatters: 'It is the most accurate metric to compare performance between different asset classes, like stocks, mutual funds, gold, or fixed deposits over multiple years.',
    example: 'If an investment of ₹1 Lakh grows to ₹1.61 Lakhs in 5 years, its CAGR is 10%.'
  },
  {
    term: 'Rupee Cost Averaging',
    category: 'growth',
    definition: 'An investment tactic of buying a fixed dollar or rupee amount of a security on a regular schedule. This results in buying more units when prices are low and fewer when prices are high.',
    whyItMatters: 'It lowers your average cost per unit over time, taking the emotional stress out of market corrections.',
    example: 'When the fund price is ₹100, you buy 10 units. When it drops to ₹50, you buy 20 units. Your average buying cost becomes ₹66.67 instead of ₹100.'
  },
  {
    term: 'Expense Ratio',
    category: 'mutual_funds',
    definition: 'The annual maintenance fee charged by a mutual fund house to manage and administer its schemes, represented as a small percentage of your overall investment.',
    whyItMatters: 'Directly impacts your final returns; a lower expense ratio means a higher percentage of the compounding gains remains in your pocket.',
    example: 'If you invest ₹10 Lakhs in a fund with a 1.5% expense ratio, ₹15,000 will be deducted annually across the year for operations.'
  },
  {
    term: 'NAV (Net Asset Value)',
    category: 'mutual_funds',
    definition: 'The performance price per share or unit of a mutual fund scheme, calculated by taking total fund assets minus liabilities and dividing by outstanding units.',
    whyItMatters: 'Just like stock prices, NAV measures the current market value of one unit, determining how many units you receive for your investment amount.',
    example: 'Investing ₹10,000 in a fund with an NAV of ₹50 yields you exactly 200 units on that business day.'
  },
  {
    term: 'Asset Allocation',
    category: 'growth',
    definition: 'The strategic practice of balancing risk and reward by dividing your financial portfolio among different asset categories—such as equities, debt, gold, and real estate.',
    whyItMatters: 'It is the single most critical factor in determining your portfolio\'s long-term returns and volatility safety.',
    example: 'A balanced investor maintaining 60% Equity for growth, 30% Debt/Fixed Income for safety, and 10% Gold as a hedge against inflation.'
  },
  {
    term: 'Diversification',
    category: 'growth',
    definition: 'The practice of spreading your capital across various financial instruments, sectors, and asset classes to avoid risk concentration.',
    whyItMatters: 'It ensures that poor performance of a single stock or sector does not devastate your entire wealth buildup.',
    example: 'Splitting your equity bucket into technology, healthcare, infrastructure, and banking sectors instead of investing in just tech.'
  },
  {
    term: 'Inflation',
    category: 'market',
    definition: 'The rate at which the absolute prices of goods and services rise over time, eroding the real purchasing power of your money.',
    whyItMatters: 'If your savings grow slower than inflation, you are practically losing wealth. Your investments must beat the inflation percentage to add true purchasing power.',
    example: 'An item costing ₹100 today costs ₹106 next year under a 6% inflation rate.'
  },
  {
    term: 'Equity',
    category: 'market',
    definition: 'A stock or any other security representing an ownership share in a corporation. Holders have a claim on part of the corporation\'s assets and earnings.',
    whyItMatters: 'Historically, equity is the highest wealth-building asset class available over long stretches of time, though it demands short-term risk resilience.',
    example: 'Buying shares of companies on the NSE/BSE stock exchanges to participate directly in their business growth and dividend payouts.'
  },
  {
    term: 'Debt Funds',
    category: 'mutual_funds',
    definition: 'Mutual funds that primarily invest in fixed-income market securities like government bonds, corporate debentures, commercial papers, and treasury bills.',
    whyItMatters: 'Provides portfolio safety, consistent liquidity, and steady interest growth with far lower fluctuations than equity markets.',
    example: 'Holding capital in short-duration or banking debt funds to safeguard short-term goals such as a home down payment.'
  },
  {
    term: 'Liquidity',
    category: 'market',
    definition: 'The ease and speed with which an asset can be converted into ready cash without receiving a major penalty or loss in value.',
    whyItMatters: 'Ensures that your funds are accessible during emergency times. Highly liquid portfolios keep you secure from forced debt traps.',
    example: 'Savings accounts and liquid mutual funds are highly liquid, whereas physical real estate or locks-in deposits have low liquidity.'
  }
];

const CATEGORY_LABELS = {
  all: 'All Terms',
  mutual_funds: 'Mutual Funds',
  growth: 'Growth & Strategy',
  market: 'Market Basics'
};

export const Glossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'mutual_funds' | 'growth' | 'market'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(item => {
      const matchSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="w-full mt-24 pt-16 border-t border-gold/10 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-gold/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 bg-gold/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full mb-4">
            <BookOpen className="w-4 h-4 text-gold" />
            <span className="text-[0.65rem] font-bold tracking-widest uppercase text-gold">Learning Center</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-white">
            Mutual Fund & Jargon <span className="text-gold italic">Glossary</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Financial definitions shouldn't be confusing. We demystify the terms, formulas, and strategies that power smart investment choices.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-bg-dark-3/40 backdrop-blur-md border border-gold/15 rounded-3xl p-5 mb-8 shadow-xl flex flex-col md:flex-row gap-4 items-center">
          {/* Search Box */}
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search terms or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-dark-2 border border-gold/10 rounded-2xl pl-11 pr-5 py-3 text-sm text-white placeholder-muted-foreground/60 focus:border-gold/40 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 justify-center md:justify-end">
            {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedIndex(null); // Reset expand on tag switch
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gold text-bg-dark font-bold shadow-md shadow-gold/10'
                    : 'bg-bg-dark-2/60 text-muted-foreground/80 border border-gold/5 hover:border-gold/20 hover:text-white'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Accordion */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTerms.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <motion.div
                  key={item.term}
                  layout="position"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-bg-dark-3/30 border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded 
                      ? 'border-gold/40 bg-bg-dark-3/70 shadow-[0_15px_30px_rgba(0,0,0,0.3)]' 
                      : 'border-gold/10 hover:border-gold/25 hover:bg-bg-dark-3/50'
                  }`}
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`w-4 h-4 transition-colors duration-300 ${isExpanded ? 'text-gold' : 'text-gold/40'}`} />
                      <span className="font-serif text-base font-bold text-white tracking-wide group-hover:text-gold transition-colors duration-300">
                        {item.term}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-gold/40 bg-gold/5 px-2.5 py-1 rounded border border-gold/10">
                        {CATEGORY_LABELS[item.category].split(' ')[0]}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-gold transition-transform duration-300 shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  {/* Body Expandable */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-gold/5 text-sm space-y-4">
                          {/* Definition */}
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold/40 block mb-1">Definition</span>
                            <p className="text-white/90 leading-relaxed text-[0.95rem]">{item.definition}</p>
                          </div>

                          {/* Why It Matters */}
                          <div className="p-4 bg-gold/5 border border-gold/10 rounded-xl">
                            <div className="flex items-center gap-2 mb-1.5 text-gold">
                              <Award className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[10px] uppercase font-bold tracking-widest">Why it Matters for You</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.whyItMatters}</p>
                          </div>

                          {/* Practical Example */}
                          {item.example && (
                            <div className="flex gap-2 items-start text-xs text-muted-foreground/80 pl-1 pt-1">
                              <ArrowRight className="w-3.5 h-3.5 shrink-0 text-gold/60 mt-0.5" />
                              <p>
                                <span className="font-semibold text-white/70">Example:</span> {item.example}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTerms.length === 0 && (
            <motion.div 
              layout
              className="text-center py-10 bg-bg-dark-3/20 border border-gold/10 rounded-2xl"
            >
              <p className="text-sm text-muted-foreground">No glossary terms matched your query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-xs text-gold font-bold uppercase mt-3 tracking-widest hover:underline"
              >
                Reset Search
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
