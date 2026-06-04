import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, TrendingUp, ShieldCheck, Wallet, ArrowLeftRight, BarChart3, Lightbulb, 
  ArrowLeft, Bookmark, Check, Info, AlertTriangle, HelpCircle, RefreshCw,
  Scale, Award, Flame, Coins, ShieldAlert
} from 'lucide-react';
import { Glossary } from './Glossary';

interface BlogPost {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  full: string;
  points: string[];
  quiz: {
    question: string;
    options: string[];
    answerIdx: number;
    explanation: string;
  };
  interactiveType: 'sip_simulator' | 'stp_calculator' | 'swp_calculator' | 'etf_comparator' | 'stock_checklist' | 'budget_calculator';
  icon: React.ReactNode;
  color: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'sip-early',
    tag: 'Beginner',
    title: 'Why Starting a SIP Early Can Change Your Life',
    excerpt: 'The power of compounding rewards those who start early. Even ₹500/month at age 22 can grow into a substantial corpus.',
    full: 'A Systematic Investment Plan (SIP) is a powerful mechanism that lets you invest a fixed amount of money at regular intervals into a chosen mutual fund scheme. Rather than waiting for a large chunk of capital, SIP enables regular allocation from your salary, building a bulletproof habit of consistent accumulation.',
    points: [
      'Time Multiplier: The exponential growth curve turns aggressive in the last 10 years of your cycle, making starting early crucial.',
      'Rupee Cost Averaging: Automatically buys more mutual fund units when market prices drop, bringing down average purchase costs.',
      'Discipline Over Luck: Automating your deployment completely takes emotions and stressful market speculation out of your path.'
    ],
    quiz: {
      question: "If you delay starting a standard ₹10,000 monthly SIP by just 5 years, how is your final 25-year returns corpus impacted?",
      options: [
        "A negligible drop that you can easily catch up to by saving slightly more later.",
        "It can reduce your ultimate wealth corpus by roughly 40% to 50%.",
        "It makes absolutely zero difference in final compound metrics."
      ],
      answerIdx: 1,
      explanation: "Because compounding returns are severely back-weighted, the last 5 years of a 25-year cycle produce massive exponential growth. Slashing those years shrinks your total wealth dramatically!"
    },
    interactiveType: 'sip_simulator',
    icon: <TrendingUp className="w-16 h-16" />,
    color: 'from-bg-dark to-orange-900/20',
    readTime: '3 min read',
    difficulty: 'Beginner'
  },
  {
    id: 'stp-smart',
    tag: 'Strategy',
    title: 'STP: The Smartest Way to Enter Equity Markets',
    excerpt: 'Lump sum investing at the wrong time can be costly. A Systematic Transfer Plan helps you enter equity gradually.',
    full: 'If you have received a large lump sum—such as a bonus, inheritance, or property sale proceeds—deploying it all at once can be risky. A Systematic Transfer Plan (STP) acts as a security guard to enter volatile stock markets smoothly.',
    points: [
      'Double Gains System: Earn safe 6-7% interest in debt or liquid funds, while automatically scheduling fixed equity transfers.',
      'Mitigate Volatility: Spreads out market risks across many weeks or months, ensuring you don\'t buy at structural market peaks.',
      'Unemotional Deployments: Operates on strict algorithmic routines, preventing safe lock-up hesitation.'
    ],
    quiz: {
      question: "What is the primary recommended destination for placing your initial lump-sum before initiating an STP?",
      options: [
        "An active high-risk small-cap fund.",
        "A low-volatility liquid or liquid debt fund scheme.",
        "Standard bank current account earning 0% interest."
      ],
      answerIdx: 1,
      explanation: "Liquid and short-term debt funds keep your massive capital extremely secure and stable, while still yielding moderate interest that beats normal savings accounts during the transition."
    },
    interactiveType: 'stp_calculator',
    icon: <ShieldCheck className="w-16 h-16" />,
    color: 'from-bg-dark to-green-900/20',
    readTime: '4 min read',
    difficulty: 'Intermediate'
  },
  {
    id: 'swp-retired',
    tag: 'Retirement',
    title: 'How SWP Creates a Salary After Retirement',
    excerpt: 'A Systematic Withdrawal Plan lets your corpus keep growing while paying you monthly — a tax-efficient alternative.',
    full: 'A Systematic Withdrawal Plan (SWP) is a highly recommended tool for retirees. Instead of traditional fixed deposits that yield stagnant, fully taxable interest, SWP lets your mutual fund corpus produce a customized monthly paycheck.',
    points: [
      'Exceptional Tax Benefits: Unlike FD interest, which is taxed at your full slab rate, SWP redemptions are subject to low long-term capital gains tax.',
      'Capital Preservation: When your retirement corpus earns more than your periodic drawdowns, your principal keeps growing!',
      'Flexible Flow: Change, skip, or terminate monthly withdrawal plans easily depending on real lifestyle conditions.'
    ],
    quiz: {
      question: "Why is SWP fundamentally more tax-efficient than conventional bank Fixed Deposit interest payouts?",
      options: [
        "SWP withdrawals are entirely tax-free by law.",
        "Payouts are structured as capital redemptions where only the capital gain portion is taxed, enjoying a ₹1.25 Lakh limit on exempt returns.",
        "Governments offer subsidies on systematic mutual fund redemptions."
      ],
      answerIdx: 1,
      explanation: "With FDs, 100% of your interest is added directly to your taxable income block. Under SWP, only the minor profit margin within your withdrawn slice is assessed, resulting in significantly lower tax exposure."
    },
    interactiveType: 'swp_calculator',
    icon: <Wallet className="w-16 h-16" />,
    color: 'from-bg-dark to-red-900/20',
    readTime: '5 min read',
    difficulty: 'Intermediate'
  },
  {
    id: 'etf-vs-mf',
    tag: 'ETFs',
    title: 'ETFs vs Mutual Funds: Which is Right for You?',
    excerpt: 'Both have merit, but the choice depends on your investment style. ETFs offer flexibility and low costs.',
    full: 'Exchange Traded Funds (ETFs) and mutual funds represent two of the most popular vehicles to build long-term wealth, but they differ significantly in their operation, trading accessibility, and administrative fees.',
    points: [
      'Trading Mechanics: ETFs trade live on stock exchanges exactly like individual shares, whereas mutual funds settle once a day at closing NAV.',
      'Management Style: ETFs are typically low-cost passive trackers of an index (NSE or BSE), while mutual funds are actively sorted by professional managers.',
      'Expense Ratios: ETFs run on bare-minimum expense percentages (0.05-0.2%) while active mutual funds charge higher fees to generate alpha.'
    ],
    quiz: {
      question: "If you prioritize very low ongoing fees and want to trade your holdings instantly during market hours, which tool is better?",
      options: [
        "Active Equity Mutual Fund scheme.",
        "An Exchange Traded Fund (ETF).",
        "Traditional Postal Savings Scheme."
      ],
      answerIdx: 1,
      explanation: "ETFs maintain incredibly low expense ratios and can be bought or sold live in your Demat account instantly at actual stock market pricing."
    },
    interactiveType: 'etf_comparator',
    icon: <ArrowLeftRight className="w-16 h-16" />,
    color: 'from-bg-dark to-purple-900/20',
    readTime: '4 min read',
    difficulty: 'Beginner'
  },
  {
    id: 'stock-rules',
    tag: 'Stocks',
    title: '5 Golden Rules Before Buying Your First Stock',
    excerpt: 'Understand the business, check valuation, diversify, and never chase tips. Invest for the long term.',
    full: 'Stepping into individual stock investing is exciting, but doing so without structural rules often transforms investing into reckless gambling. Building a multi-decade net worth requires an analytical process.',
    points: [
      'Investigate the Business: Never buy a stock whose product or service you do not understand. Learn how the business sustains profit.',
      'Valuation Checks: A fantastic company can represent an awful investment if purchased at highly overvalued peaks.',
      'Ignore Speculative Noise: Turn off media panels, cancel Telegram warning list subscriptions, and invest strictly in solid research.'
    ],
    quiz: {
      question: "Which of these traits defines a truly resilient business with a durable economic 'moat'?",
      options: [
        "Consistent high-growth without stable operating margins or cash flow.",
        "Having high brand loyalty, strong switching costs, or immense cost advantages.",
        "Heavy media coverage and highly active social media speculation."
      ],
      answerIdx: 1,
      explanation: "An economic moat represents a sustainable advantage (like Apple's ecosystem or Nike's brand) that shields the business from aggressive competitors."
    },
    interactiveType: 'stock_checklist',
    icon: <BarChart3 className="w-16 h-16" />,
    color: 'from-bg-dark to-yellow-900/20',
    readTime: '5 min read',
    difficulty: 'Intermediate'
  },
  {
    id: 'budget-rule',
    tag: 'Wealth Tips',
    title: 'The 50-30-20 Rule: A Simple Budget That Works',
    excerpt: '50% needs, 30% wants, 20% savings & investments. This timeless framework is the foundation of every plan.',
    full: 'Proper wealth creation does not start with complex investment assets; it starts with strategic capital allocation. The 50-30-20 rule is a world-class standard to simplify lifestyle spending.',
    points: [
      '50% for Essential Needs: Dedicated to unavoidable bills, housing costs, crucial groceries, medicines, and insurance pools.',
      '30% for Lifestyle Wants: Spent safely on dining out, hobby tools, vacations, subscriptions, and entertainment without guilt.',
      '20% for Wealth Accumulation: Reserved strictly for SIP mutual funds, debt payments, gold hedges, and long-term asset building.'
    ],
    quiz: {
      question: "What is the primary psychological trick behind automating the 20% savings portion first on pay-day?",
      options: [
        "It is called 'Pay Yourself First' which protects capital from being accidentally wasted across optional items during the month.",
        "It triggers dynamic tax-refund cycles automatically.",
        "It increases your credit card ratings instantly."
      ],
      answerIdx: 0,
      explanation: "By routing the retirement/savings portion 20% right at pay-day (automated SIPs), you form a stress-free environment where you only spend what remains, instead of trying to save what is left over!"
    },
    interactiveType: 'budget_calculator',
    icon: <Lightbulb className="w-16 h-16" />,
    color: 'from-bg-dark to-emerald-900/20',
    readTime: '3 min read',
    difficulty: 'Beginner'
  },
  {
    id: 'asset-allocation',
    tag: 'Strategy',
    title: 'Asset Allocation: The Ultimate Guard of Wealth',
    excerpt: 'Spread your eggs across different baskets wisely. Discover the science behind dynamic asset allocation as you grow.',
    full: 'Asset Allocation is the practice of dividing your investment portfolio among different asset categories, such as equities, bonds, real estate, and gold. Having non-correlated assets ensures that when one sector falls, another holds strong or rises, preserving overall wealth stability.',
    points: [
      'Non-Correlated Guarding: Mitigates portfolio drawdown during major stock market corrections by keeping backup debt/short-term allocations.',
      'Dynamic Risk Calibration: Adjusting asset percentages based on age ensures you do not take unnecessary risks when reaching major life targets.',
      'Disciplined Annual Rebalancing: Sells high in strong categories and buys low in underperforming ones once or twice a year.'
    ],
    quiz: {
      question: "As you get older, what is the standard recommended shift in your strategy's asset allocation split?",
      options: [
        "An aggressive shift towards 100% micro-cap equities to maximize late-stage CAGR.",
        "Gradually shifting a portion from highly volatile equities into stable capital-preserving debt/fixed income instruments.",
        "Moving all wealth and retirement assets into physical real estate to avoid digital market exposure."
      ],
      answerIdx: 1,
      explanation: "As you age, your time horizon shrinks, leaving less room to wait out deep stock market downturns. Transitioning into lower-volatility debt assets protects your principal when you need income."
    },
    interactiveType: 'etf_comparator',
    icon: <Scale className="w-16 h-16" />,
    color: 'from-bg-dark to-blue-900/20',
    readTime: '4 min read',
    difficulty: 'Intermediate'
  },
  {
    id: 'inflation-shielder',
    tag: 'Wealth Tips',
    title: 'The Silent Loss: Shielding Wealth from Inflation',
    excerpt: 'At 6% steady inflation, the buying power of idle money shrinks by 50% in just 12 years. Beat the silent tax with hard assets.',
    full: 'Inflation is the silent decay of money. While your absolute bank balance looks identical, its real-world purchasing power decays every single day. Keeping substantial capital sitting idle in bank accounts or vaults is an expensive long-term hazard.',
    points: [
      'The Silent Compound Devaluer: Inflation compounds prices upward, meaning you require larger absolute amounts just to survive.',
      'Real Growth vs Nominal Growth: Real wealth growth equals your nominal interest yield minus the current inflation percentage.',
      'Strategic Asset Preservation: Allocating elements into diversified mutual funds, equity indexes, or gold offers historic hedges.'
    ],
    quiz: {
      question: "If inflation is rising at 6% annually, what return must your net portfolio deliver to achieve a 4% real growth increase?",
      options: [
        "Exactly 4% CAGR total return interest.",
        "A total blended yield of 10% CAGR.",
        "An interest rate equivalent to exactly 6% return."
      ],
      answerIdx: 1,
      explanation: "Since Real Return = Nominal Return - Inflation, you need a 10% nominal return to beat a 6% inflation rate and gain exactly 4% in purchasing power (10% - 6% = 4%)."
    },
    interactiveType: 'budget_calculator',
    icon: <Flame className="w-16 h-16" />,
    color: 'from-bg-dark to-red-950/40',
    readTime: '5 min read',
    difficulty: 'Expert'
  }
];


export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Bookmarks state (simulated with localStorage)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('finaura_tips_saved_posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track bookmarked changes
  useEffect(() => {
    localStorage.setItem('finaura_tips_saved_posts', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Quiz interactive state
  const [quizSelectedIdx, setQuizSelectedIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Interactive Sandboxes states
  const [customSipAmount, setCustomSipAmount] = useState<number>(5000);
  const [customSipYears, setCustomSipYears] = useState<number>(20);
  const [customIncome, setCustomIncome] = useState<number>(50000);
  const [customCorpus, setCustomCorpus] = useState<number>(5000000);
  const [stockChecks, setStockChecks] = useState<boolean[]>([false, false, false, false, false]);

  // Tab and Custom Client Knowledge states
  const [activeTab, setActiveTab] = useState<'articles' | 'rules_board'>('articles');
  const [doublingRate, setDoublingRate] = useState<number>(12);
  const [taxGains, setTaxGains] = useState<number>(250000);
  const [taxType, setTaxType] = useState<'equity' | 'debt'>('equity');
  const [taxTerm, setTaxTerm] = useState<'stcg' | 'ltcg'>('ltcg');
  const [incomeSlab, setIncomeSlab] = useState<number>(0.2);
  const [inflationCapital, setInflationCapital] = useState<number>(1000000);
  const [customEmergencyExp, setCustomEmergencyExp] = useState<number>(50000);
  const [jobRisk, setJobRisk] = useState<'low' | 'medium' | 'high'>('medium');

  const categories = ['All', ...new Set(BLOG_POSTS.map(post => post.tag))];

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setQuizSelectedIdx(null);
    setQuizSubmitted(false);
    setStockChecks([false, false, false, false, false]);
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSaved = !showSavedOnly || bookmarks.includes(post.id);
    const matchesCategory = activeCategory === 'All' || post.tag === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSaved && matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 px-4 sm:px-6 bg-bg-dark-2">
      <div className="max-w-7xl mx-auto mb-10 -mt-6 flex justify-between items-center">
        <a 
          href="#" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 text-gold" />
          <span>Back to Home</span>
        </a>

        {/* Saved posts quick summary */}
        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 ${
            showSavedOnly 
              ? 'bg-gold/15 border-gold text-gold shadow-lg shadow-gold/5' 
              : 'bg-bg-dark-3/50 border-gold/10 text-muted-foreground hover:border-gold/30 hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-gold' : ''}`} />
          <span>Saved Wisdom {bookmarks.length > 0 && `(${bookmarks.length})`}</span>
        </button>
      </div>

      <div className="text-center mb-16">
        <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">Knowledge Centre</div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Financial Tips & Insights</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">Grow smarter with interactive financial tools and customized wisdom curated by founder Shubham Dalvi.</p>

        {/* TAB SWITCHER */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-bg-dark-3/60 p-1 rounded-2xl border border-gold/10">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-gold text-bg-dark shadow-lg shadow-gold/15'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Interactive Insights</span>
            </button>
            <button
              onClick={() => setActiveTab('rules_board')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'rules_board'
                  ? 'bg-gold text-bg-dark shadow-lg shadow-gold/15'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Client Wealth Rules</span>
            </button>
          </div>
        </div>

        {activeTab === 'articles' && (
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowSavedOnly(false); // Reset saved filter to explore normally
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
                    activeCategory === cat && !showSavedOnly
                      ? 'bg-gold text-bg-dark border-gold' 
                      : 'bg-bg-dark-3 text-muted-foreground border-gold/10 hover:border-gold/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-dark-3 border border-gold/10 rounded-full px-5 py-2 text-sm outline-none focus:border-gold/40 text-white transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        )}
      </div>

      {activeTab === 'articles' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, i) => {
                const isBookmarked = bookmarks.includes(post.id);
                return (
                  <motion.div
                    key={post.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => handleOpenPost(post)}
                    className="group relative bg-bg-dark-3/40 backdrop-blur-sm border border-gold/10 rounded-3xl overflow-hidden cursor-pointer hover:border-gold/30 hover:shadow-[0_20px_40px_rgba(201,168,76,0.06)] transition-all duration-500 flex flex-col h-full"
                  >
                    {/* Card Header/Image Area */}
                    <div className={`h-48 flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${post.color}`}>
                      {/* Decorative background elements */}
                      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold blur-3xl" />
                      </div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative z-10 text-gold filter drop-shadow-2xl transition-transform duration-500"
                      >
                        {post.icon}
                      </motion.div>
                      
                      {/* Overlay gradient for text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark-3/80 to-transparent opacity-60" />
                      
                      {/* Tag floating on image */}
                      <div className="absolute top-5 left-5 z-20">
                        <span className="px-3 py-1 rounded-full text-[0.62rem] font-bold tracking-widest uppercase bg-bg-dark/80 backdrop-blur-md border border-gold/20 text-gold shadow-lg">
                          {post.tag}
                        </span>
                      </div>

                      {/* Bookmark Toggle floating */}
                      <button
                        onClick={(e) => toggleBookmark(post.id, e)}
                        className="absolute top-4 right-4 z-20 p-2.5 bg-bg-dark/85 backdrop-blur-md border border-gold/10 text-gold/75 hover:text-gold hover:scale-105 rounded-full transition-all duration-300 cursor-pointer"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-gold text-gold' : ''}`} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8 flex flex-col flex-grow relative">
                      {/* Secondary Meta details */}
                      <div className="flex items-center gap-3 mb-2.5 text-[0.68rem] text-muted-foreground/50 font-bold uppercase tracking-wider font-mono">
                        <span>{post.readTime}</span>
                        <span className="w-1 h-1 rounded-full bg-gold/30" />
                        <span className={`${
                          post.difficulty === 'Beginner' 
                            ? 'text-emerald-400/80' 
                            : post.difficulty === 'Intermediate' 
                              ? 'text-amber-400/80' 
                              : 'text-rose-400/80'
                        }`}>{post.difficulty}</span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold leading-[1.25] mb-3 group-hover:text-gold transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        {post.excerpt}
                      </p>

                      {/* Footer Info */}
                      <div className="mt-auto pt-5 border-t border-gold/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-[0.68rem] text-muted-foreground/60 font-medium">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gold/45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Interactive Article</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-gold text-[0.72rem] font-bold tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                          <span>Explore</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 bg-bg-dark-3/20 border border-gold/5 max-w-4xl mx-auto rounded-3xl">
              <p className="text-muted-foreground text-sm">No insightful tips found matching your choices.</p>
              <button 
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); setShowSavedOnly(false); }}
                className="text-gold text-xs font-bold uppercase tracking-wider mt-4 hover:underline cursor-pointer"
              >
                Clear All Filters & Reset
              </button>
            </div>
          )}
        </>
      ) : (
        /* INTERACTIVE CLIENT WEALTH RULES BOARD PANEL */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto space-y-8 text-left"
        >
          {/* SECTION 1: THE MAGIC OF COMPOUND MULTIPLIERS */}
          <div className="bg-bg-dark-3/45 backdrop-blur-md border border-gold/15 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold/60 block mb-1">Fundamental Laws of Finance</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white">The Compound Multipliers Rules</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Discover how compounding velocity doubles, triples, and quadruples capital. Enter your expected average annual interest rate below:
                </p>
              </div>

              {/* Slider Controller */}
              <div className="p-4 bg-bg-dark-2/60 border border-gold/10 rounded-2xl shrink-0 w-full md:w-64">
                <div className="flex justify-between text-xs font-semibold mb-2 text-white">
                  <span>Interest (CAGR)%:</span>
                  <span className="text-gold text-sm font-bold">{doublingRate}%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="0.5"
                  value={doublingRate}
                  onChange={(e) => setDoublingRate(parseFloat(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>4% Safe Debt</span>
                  <span>12% Equities</span>
                  <span>24% Ventures</span>
                </div>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rule of 72 */}
              <div className="bg-bg-dark-2/40 border border-gold/10 rounded-2xl p-5 hover:border-gold/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center font-bold text-xs text-gold">2x</span>
                  <div className="text-left">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Rule of 72</h4>
                    <span className="text-[10px] text-gold/60">Capital Doubling Velocity</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground">Est. Doubling Period:</div>
                  <div className="text-3xl font-serif font-black text-white py-1">
                    {(72 / doublingRate).toFixed(1)} <span className="text-xs font-sans font-bold text-gold">Years</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-gold/5 pt-3">
                   A ₹10,000 lump sum turns into <strong className="text-white font-semibold">₹20,000</strong> in <strong className="text-gold">{(72 / doublingRate).toFixed(1)} years</strong> at a constant {doublingRate}% CAGR interest.
                </p>
              </div>

              {/* Rule of 114 */}
              <div className="bg-bg-dark-2/40 border border-gold/10 rounded-2xl p-5 hover:border-gold/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center font-bold text-xs text-gold">3x</span>
                  <div className="text-left">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Rule of 114</h4>
                    <span className="text-[10px] text-gold/60">Capital Tripling Velocity</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground">Est. Tripling Period:</div>
                  <div className="text-3xl font-serif font-black text-white py-1">
                    {(114 / doublingRate).toFixed(1)} <span className="text-xs font-sans font-bold text-gold">Years</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-gold/5 pt-3">
                   A ₹10,000 lump sum turns into <strong className="text-white font-semibold">₹30,000</strong> in <strong className="text-gold">{(114 / doublingRate).toFixed(1)} years</strong> at a constant {doublingRate}% CAGR interest.
                </p>
              </div>

              {/* Rule of 144 */}
              <div className="bg-bg-dark-2/40 border border-gold/10 rounded-2xl p-5 hover:border-gold/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center font-bold text-xs text-gold">4x</span>
                  <div className="text-left">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Rule of 144</h4>
                    <span className="text-[10px] text-gold/60">Capital Quadrupling Velocity</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground">Est. Quadrupling Period:</div>
                  <div className="text-3xl font-serif font-black text-white py-1">
                    {(144 / doublingRate).toFixed(1)} <span className="text-xs font-sans font-bold text-gold">Years</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-gold/5 pt-3">
                   A ₹10,000 lump sum turns into <strong className="text-white font-semibold">₹40,000</strong> in <strong className="text-gold">{(144 / doublingRate).toFixed(1)} years</strong> at a constant {doublingRate}% CAGR interest.
                </p>
              </div>
            </div>
          </div>

          {/* TWO COLUMN INTERACTIVE ROW: CAPITAL GAINS TAX AND INFLATION EROSION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUMN 1: INDIAN CAPITAL GAINS TAX PLANNERS */}
            <div className="bg-bg-dark-3/45 backdrop-blur-md border border-gold/15 rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Scale className="w-4 h-4 text-gold" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold/60 block">Capital Safeguard Calculator</span>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white">Capital Gains Taxation Estimator</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-5">
                  Calculate and optimize expected taxes under modern tax laws in India. Select active investment parameters:
                </p>
              </div>

              <div className="space-y-4">
                {/* Profit Range Controller */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5 text-white/95">
                    <span>Estimated Net Investment Profit/Gain:</span>
                    <span className="font-bold text-gold">₹{taxGains.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="25000"
                    max="1500000"
                    step="25000"
                    value={taxGains}
                    onChange={(e) => setTaxGains(parseInt(e.target.value))}
                    className="w-full accent-gold mb-4 cursor-pointer"
                  />
                </div>

                {/* Selection Switches */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Asset Class Choice */}
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 block mb-1.5">Asset Vehicle</label>
                    <div className="inline-flex bg-bg-dark-2/80 rounded-xl p-1 border border-gold/10 w-full">
                      <button
                        onClick={() => setTaxType('equity')}
                        className={`flex-grow text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          taxType === 'equity' ? 'bg-gold text-bg-dark' : 'text-muted-foreground'
                        }`}
                      >
                        Equity / Mutual
                      </button>
                      <button
                        onClick={() => setTaxType('debt')}
                        className={`flex-grow text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          taxType === 'debt' ? 'bg-gold text-bg-dark' : 'text-muted-foreground'
                        }`}
                      >
                        Fixed Debt / FD
                      </button>
                    </div>
                  </div>

                  {/* Period Switcher */}
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 block mb-1.5">Holding Timeline</label>
                    <div className="inline-flex bg-bg-dark-2/80 rounded-xl p-1 border border-gold/10 w-full">
                      <button
                        onClick={() => setTaxTerm('stcg')}
                        className={`flex-grow text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          taxTerm === 'stcg' ? 'bg-gold/15 text-gold border border-gold/20' : 'text-muted-foreground'
                        }`}
                      >
                        Short Term
                      </button>
                      <button
                        onClick={() => setTaxTerm('ltcg')}
                        className={`flex-grow text-center py-2 rounded-lg text-xs font-bold transition-all ${
                          taxTerm === 'ltcg' ? 'bg-gold/15 text-gold border border-gold/20' : 'text-muted-foreground'
                        }`}
                      >
                        Long Term
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal income bracket if Debt asset class is selected */}
                {taxType === 'debt' && (
                  <div className="p-3 bg-bg-dark-2/65 rounded-xl border border-gold/5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 block mb-1.5">Your Est. Income Tax Slab Allocation</span>
                    <div className="flex gap-2 justify-between">
                      {[0.10, 0.20, 0.30].map(slab => (
                        <button
                          key={slab}
                          onClick={() => setIncomeSlab(slab)}
                          className={`flex-1 text-center py-2 rounded-lg text-xs font-bold border transition-all ${
                            incomeSlab === slab
                              ? 'bg-gold text-bg-dark border-gold font-bold shadow-md shadow-gold/5'
                              : 'bg-bg-dark-3 text-muted-foreground border-gold/5'
                          }`}
                        >
                          {(slab * 100)}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tax Output Result Visual */}
                {(() => {
                  let calculationTax = 0;
                  let taxRatioLabel = "";
                  let exemptionLimit = 0;

                  if (taxType === 'equity') {
                    if (taxTerm === 'stcg') {
                      calculationTax = taxGains * 0.20;
                      taxRatioLabel = "Equity STCG (20% flat tax rate)";
                    } else {
                      exemptionLimit = 125000;
                      const taxablePart = Math.max(0, taxGains - exemptionLimit);
                      calculationTax = taxablePart * 0.125;
                      taxRatioLabel = "Equity LTCG (12.5% rate beyond first ₹1.25L exempt)";
                    }
                  } else {
                    // Debt assets under current law (STCG and LTCG are both pooled into slab for domestic funds post April 2023)
                    calculationTax = taxGains * incomeSlab;
                    taxRatioLabel = `Debt earnings taxed at slab rate (${incomeSlab * 100}% bracket)`;
                  }

                  return (
                    <div className="mt-4 p-4 rounded-2xl bg-bg-dark-2/90 border border-gold/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-muted-foreground">Estimated Capital Tax Owed:</span>
                          <span className="text-[10px] text-gold/60 block">{taxRatioLabel}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl md:text-2xl font-serif font-bold text-red-400">₹{calculationTax.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Info details */}
                      <div className="grid grid-cols-2 text-[11px] text-muted-foreground border-t border-gold/5 pt-3 gap-2">
                        <div>
                          <span>Tax-Exempt Profits:</span>
                          <span className="text-white block font-medium">₹{exemptionLimit.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span>Post-Tax Retained Profit:</span>
                          <span className="text-emerald-400 block font-bold">₹{(taxGains - calculationTax).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Advisory Notification banner */}
                      <p className="text-[10px] text-gold/80 italic leading-normal pt-1 flex gap-1.5 items-start">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold" />
                        <span>
                          {taxType === 'equity' && taxTerm === 'ltcg' 
                            ? "Exquisite Strategy: The ₹1.25 Lakh LTCG buffer triggers great compound savings. Let's arrange automated liquidations once a financial year to cycle exemptions legally." 
                            : taxType === 'debt'
                              ? "Reg. Notice: Since April 2023, standard debt funds no longer enjoy indexation discount benefits. Profits merge with income tax brackets. We suggest Arbitrage/Multi-Asset funds with equity taxation benefits to defend returns."
                              : "STCG Alert: Flat 20% on short-term equity positions demands cautious timing. Holding for 365+ days reduces tax significantly to 12.5%."}
                        </span>
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* COLUMN 2: THE INFLATION ERÖDER & PRESERVATION MATRIX */}
            <div className="bg-bg-dark-3/45 backdrop-blur-md border border-gold/15 rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Flame className="w-4 h-4 text-gold animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold/60 block">Erosion Audit Sandbox</span>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-bold text-white">The Silent Inflation Erosion</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-5">
                   See how a 6% average inflation index bleeds the purchasing strength of uninvested liquid capital over a 15-year lifecycle.
                </p>
              </div>

              <div className="space-y-4">
                {/* Capital reserves Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5 text-white/95">
                    <span>Capital Reserves Sitting Unsecured:</span>
                    <span className="font-bold text-gold">₹{inflationCapital.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="100000"
                    value={inflationCapital}
                    onChange={(e) => setInflationCapital(parseInt(e.target.value))}
                    className="w-full accent-gold mb-3 cursor-pointer"
                  />
                </div>

                {/* Real values visual milestones */}
                <div className="space-y-3.5 pt-1">
                  {[
                    { years: 5, bg: 'bg-[#cbd5e1]/5', border: 'border-white/5' },
                    { years: 10, bg: 'bg-[#cbd5e1]/5', border: 'border-white/5' },
                    { years: 15, bg: 'bg-red-950/10', border: 'border-red-500/10' }
                  ].map(({ years, bg, border }, idx) => {
                    // Inflation erodes cash purchasing power as Capital / (1.06)^years
                    const powerMultiplier = Math.pow(1 / 1.06, years);
                    const erodedPower = inflationCapital * powerMultiplier;
                    const lossAmount = inflationCapital - erodedPower;
                    const lossPercentage = Math.round((lossAmount / inflationCapital) * 100);

                    return (
                      <div key={years} className={`p-4 rounded-2xl border ${border} ${bg} text-left flex justify-between items-center gap-4`}>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">Timeline: After {years} Years</span>
                          <span className="text-[10px] text-muted-foreground block">
                            Nominal Balance retains original ₹{inflationCapital.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">True Buying Power:</span>
                          <span className="text-sm font-serif font-bold text-white">₹{Math.round(erodedPower).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-red-400 font-bold block">-{lossPercentage}% eroded strength</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-amber-950/20 border border-amber-500/15 rounded-xl text-left mt-2">
                  <div className="flex gap-2 text-amber-400 text-[11px] font-bold mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>How to Safely Defend Your Wealth?</span>
                  </div>
                  <p className="text-[10.5px] text-muted-foreground leading-normal">
                    Idle savings accounts yielding 3.5% lose purchasing power rapidly. Real Wealth preservation thrives when capital compounds inside diversified index tools yielding 10-14% CAGR, fully defeating inflation.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 3: THE 3-6-12 EMERGENCY SHIELD MATRIX */}
          <div className="bg-bg-dark-3/45 backdrop-blur-md border border-gold/15 rounded-3xl p-6 md:p-8 shadow-xl mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-4 h-4 text-gold animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold/60 block">Defensive Liquidity Shield</span>
                </div>
                <h3 className="font-serif text-lg md:text-2xl font-bold text-white">The 3-6-12 Emergency Shield Sandbox</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Measure the exact contingency reserves required to bulletproof your financial survival based on monthly burn and occupational volatility risk.
                </p>
              </div>

              {/* Slider for Monthly Living Expenses */}
              <div className="p-4 bg-bg-dark-2/60 border border-gold/10 rounded-2xl shrink-0 w-full md:w-72">
                <div className="flex justify-between text-xs font-semibold mb-2 text-white">
                  <span>Monthly Expenses (Burn):</span>
                  <span className="text-gold text-sm font-bold">₹{customEmergencyExp.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="5000"
                  value={customEmergencyExp}
                  onChange={(e) => setCustomEmergencyExp(parseInt(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono">
                  <span>₹10K Base</span>
                  <span>₹1.5L Mid</span>
                  <span>₹3L High</span>
                </div>
              </div>
            </div>

            {/* Selection profile & calculations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left col: Risk profiles */}
              <div className="p-5 bg-bg-dark-2/40 border border-gold/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 block mb-3">1. Occupational Risk profile</span>
                  <div className="space-y-2.5">
                    {[
                      { key: 'low', label: 'Low Risk Profile (3 Months)', desc: 'Standard salaried, secure government role, or institutional tenure.' },
                      { key: 'medium', label: 'Medium Risk Profile (6 Months)', desc: 'Corporate commissions, retail shop owner, or volatile SaaS sales position.' },
                      { key: 'high', label: 'High Risk Profile (12 Months)', desc: 'Freelancer, creative agency partner, boutique consultant, or solo creator.' }
                    ].map((profile) => (
                      <button
                        key={profile.key}
                        onClick={() => setJobRisk(profile.key as 'low' | 'medium' | 'high')}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          jobRisk === profile.key
                            ? 'bg-gold/10 border-gold/85 text-gold shadow-md'
                            : 'bg-bg-dark-3/50 border-gold/5 text-muted-foreground hover:border-gold/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            jobRisk === profile.key ? 'border-gold text-gold' : 'border-gold/30'
                          }`}>
                            {jobRisk === profile.key && <div className="w-1.5 h-1.5 bg-gold rounded-full" />}
                          </div>
                          <span className="text-xs font-bold text-white">{profile.label}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/85 leading-normal pl-5">{profile.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle & Right col: Result shield numbers */}
              {(() => {
                const monthsCount = jobRisk === 'low' ? 3 : jobRisk === 'medium' ? 6 : 12;
                const totalRequired = customEmergencyExp * monthsCount;

                return (
                  <div className="p-6 bg-bg-dark-2/40 border border-gold/10 rounded-2xl flex flex-col justify-between text-left lg:col-span-2">
                    <div className="flex flex-col md:flex-row gap-6 justify-between h-full">
                      {/* Summary Block */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 block mb-1">2. Required Shield Size</span>
                          <div className="text-4xl font-serif font-black text-rose-400 py-1.5">
                            ₹{totalRequired.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[11px] text-muted-foreground block leading-relaxed mt-1">
                            Equivalent to securing exactly <strong className="text-white">{monthsCount} months</strong> of continuous expenses during extreme transition periods.
                          </span>
                        </div>

                        <div className="p-4 bg-emerald-950/20 border border-emerald-500/15 rounded-xl text-left mt-4">
                          <div className="flex gap-2 text-emerald-400 text-xs font-bold mb-1">
                            <ShieldCheck className="w-4 h-4 shrink-0 transition-transform duration-500 hover:scale-110" />
                            <span>FinAura Defense Advisory:</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            Never deploy your Emergency Shield into stocks or high-risk lock-ins. Its sole purpose is **stability and instant liquidity**, not alpha generation. Keep it segmented as suggested.
                          </p>
                        </div>
                      </div>

                      {/* Breakdown block */}
                      <div className="flex-1 border-t md:border-t-0 md:border-l border-gold/10 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 block mb-3">3. Recommended Allocation segmentation</span>
                          <div className="space-y-3">
                            {/* segment 1: 10% Cash */}
                            <div className="p-3 bg-bg-dark-3/60 rounded-xl border border-gold/5 flex justify-between items-center text-xs">
                              <div>
                                <span className="text-[10px] text-white block font-bold">10% Immediate cash</span>
                                <span className="text-muted-foreground text-[10px]">Physical cash & standard savings</span>
                              </div>
                              <span className="font-mono font-bold text-white">₹{Math.round(totalRequired * 0.1).toLocaleString('en-IN')}</span>
                            </div>

                            {/* segment 2: 40% Sweep FD */}
                            <div className="p-3 bg-bg-dark-3/60 rounded-xl border border-gold/5 flex justify-between items-center text-xs">
                              <div>
                                <span className="text-[10px] text-gold block font-bold">40% Sweep-In FD</span>
                                <span className="text-muted-foreground text-[10px]">Instant online break-at-will FDs</span>
                              </div>
                              <span className="font-mono font-bold text-gold">₹{Math.round(totalRequired * 0.4).toLocaleString('en-IN')}</span>
                            </div>

                            {/* segment 3: 50% Arbitrage / Liquid MFs */}
                            <div className="p-3 bg-bg-dark-3/60 rounded-xl border border-gold/5 flex justify-between items-center text-xs">
                              <div>
                                <span className="text-[10px] text-emerald-400 block font-bold">50% Arbitrage / Liquid funds</span>
                                <span className="text-muted-foreground text-[10px]">Stable debt-yield funds with low tax</span>
                              </div>
                              <span className="font-mono font-bold text-emerald-400">₹{Math.round(totalRequired * 0.5).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Expanded Interactive Modal Detail */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-bg-dark/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="bg-bg-dark-2 border border-gold/15 rounded-[32px] w-full max-w-4xl relative shadow-[0_0_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
            >
              {/* Close Button details */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-5 right-5 z-50 p-2.5 bg-bg-dark/70 backdrop-blur-md border border-gold/15 text-gold rounded-full hover:bg-gold hover:text-bg-dark transition-all duration-300 group shadow-md"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Left Column: Premium Branding / Status Display */}
              <div className={`hidden md:flex md:w-[35%] items-center justify-center relative bg-gradient-to-br ${selectedPost.color} p-10 overflow-hidden flex-col text-center`}>
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_70%)]" />
                </div>
                <div className="relative z-10 text-gold filter drop-shadow-[0_0_20px_rgba(201,168,76,0.35)] transform scale-125 mb-6">
                  {selectedPost.icon}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold bg-bg-dark/80 backdrop-blur-sm border border-gold/20 px-3.5 py-1 rounded-full">
                  {selectedPost.tag}
                </span>
                
                {/* Quick saved indicator */}
                <button
                  onClick={() => toggleBookmark(selectedPost.id)}
                  className="mt-6 text-xs flex items-center gap-2 font-bold uppercase tracking-wider text-white/50 hover:text-gold transition-colors duration-300 pointer-events-auto"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(selectedPost.id) ? 'fill-gold text-gold' : ''}`} />
                  <span>{bookmarks.includes(selectedPost.id) ? 'Saved to Wisdom' : 'Save for Later'}</span>
                </button>
              </div>

              {/* Right Column: Interactive Content Area (with custom scrollbar) */}
              <div className="w-full md:w-[65%] p-6 md:p-12 overflow-y-auto max-h-[85vh] sm:max-h-none md:max-h-[92vh] custom-scrollbar text-left">
                {/* Header detail */}
                <div className="flex flex-wrap items-center gap-3 mb-4 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[0.62rem] font-bold tracking-[0.14em] uppercase bg-gold/15 border border-gold/25 text-gold">
                    {selectedPost.tag}
                  </span>
                  <span className="text-[0.68rem] text-muted-foreground/60 font-mono tracking-wider uppercase">
                    {selectedPost.readTime}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gold/30" />
                  <span className={`text-[0.68rem] font-semibold font-mono tracking-wider uppercase ${
                    selectedPost.difficulty === 'Beginner' 
                      ? 'text-emerald-400/80' 
                      : selectedPost.difficulty === 'Intermediate' 
                        ? 'text-amber-400/80' 
                        : 'text-rose-400/80'
                  }`}>
                    {selectedPost.difficulty} Level
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-[1.15] text-white">
                  {selectedPost.title}
                </h3>
                
                {/* Full narrative */}
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-white/80 text-[0.98rem] leading-[1.7] mb-6">
                    {selectedPost.full}
                  </p>
                </div>

                {/* Key Insights List */}
                <div className="mb-8 space-y-3.5">
                  <h4 className="text-[11px] uppercase tracking-[0.15em] font-bold text-gold/80 block mb-2">Core Pillars of Strategy</h4>
                  {selectedPost.points.map((pt, i) => (
                    <div key={i} className="flex gap-4 items-start bg-bg-dark-3/30 border border-gold/5 rounded-2xl p-4 hover:border-gold/15 transition-all duration-300">
                      <span className="font-mono text-xs font-bold text-gold shrink-0 bg-gold/5 w-6 h-6 rounded-full flex items-center justify-center border border-gold/10">0{i+1}</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{pt}</p>
                    </div>
                  ))}
                </div>

                {/* DYNAMIC INTERACTIVE CALCULATOR (Depends on Article Key ID) */}
                <div className="my-8 border-t border-gold/10 pt-6">
                  {selectedPost.interactiveType === 'sip_simulator' && (
                    <div className="bg-bg-dark-3/60 border border-gold/15 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none" />
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-gold" />
                        <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wide">Compounded Growth Sandbox</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                        Slide inputs below to simulate how starting early leverages compounding (assumed steady <span className="text-gold font-semibold">12% CAGR</span>).
                      </p>
                      
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Monthly Contribution:</span>
                            <span className="text-gold font-bold">₹{customSipAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <input 
                            type="range" 
                            min="1000" 
                            max="50000" 
                            step="1000"
                            value={customSipAmount} 
                            onChange={(e) => setCustomSipAmount(Number(e.target.value))}
                            className="w-full accent-gold bg-bg-dark-2 h-1 rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Time Horizon:</span>
                            <span className="text-gold font-bold">{customSipYears} Years</span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="35" 
                            step="1"
                            value={customSipYears} 
                            onChange={(e) => setCustomSipYears(Number(e.target.value))}
                            className="w-full accent-gold bg-bg-dark-2 h-1 rounded-lg"
                          />
                        </div>

                        {(() => {
                          const rate = 12 / 12 / 100;
                          const months = customSipYears * 12;
                          const invested = customSipAmount * months;
                          const futureValue = Math.round(
                            customSipAmount * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate)
                          );
                          const delayedMonths = Math.max(0, (customSipYears - 5) * 12);
                          const delayedFutureValue = Math.round(
                            customSipAmount * ((Math.pow(1 + rate, delayedMonths) - 1) / rate) * (1 + rate)
                          );
                          const delayLoss = futureValue - delayedFutureValue;

                          return (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold/10">
                                <div className="p-3 bg-bg-dark-2/60 border border-gold/5 rounded-xl text-center">
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Total Invested</span>
                                  <span className="text-sm font-bold text-white font-mono">₹{invested.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="p-3 bg-gold/5 border border-gold/10 rounded-xl text-center">
                                  <span className="text-[10px] text-gold uppercase tracking-wider block mb-0.5">Wealth Accumulated</span>
                                  <span className="text-sm font-bold text-gold font-mono">₹{futureValue.toLocaleString('en-IN')}</span>
                                </div>
                              </div>

                              <div className="p-3.5 bg-red-950/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-left">
                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Real Delay Cost Warning</span>
                                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                                    Delaying this target plan by just 5 years cuts down your accumulated compounding value by <strong className="text-white">₹{delayLoss.toLocaleString('en-IN')}</strong>! Wealth is built with time.
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {selectedPost.interactiveType === 'swp_calculator' && (
                    <div className="bg-bg-dark-3/60 border border-gold/15 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none" />
                      <div className="flex items-center gap-2 mb-4">
                        <Wallet className="w-5 h-5 text-gold" />
                        <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wide">SWP Retirement Payout Tool</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                        Input a custom target corpus amount and monthly paycheck to measure the ongoing health of your withdrawal cycle.
                      </p>

                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Retirement Corpus Pool:</span>
                            <span className="text-gold font-bold">₹{customCorpus.toLocaleString('en-IN')}</span>
                          </div>
                          <input 
                            type="range" 
                            min="1000000" 
                            max="30000000" 
                            step="500000"
                            value={customCorpus} 
                            onChange={(e) => setCustomCorpus(Number(e.target.value))}
                            className="w-full accent-gold bg-bg-dark-2 h-1 rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Target Monthly Salary withdrawal:</span>
                            <span className="text-gold font-bold">₹{customSipAmount.toLocaleString('en-IN')}</span> {/* Reusing state */}
                          </div>
                          <input 
                            type="range" 
                            min="10000" 
                            max="200000" 
                            step="5000"
                            value={customSipAmount} 
                            onChange={(e) => setCustomSipAmount(Number(e.target.value))}
                            className="w-full accent-gold bg-bg-dark-2 h-1 rounded-lg"
                          />
                        </div>

                        {(() => {
                          const annualWithdrawal = customSipAmount * 12;
                          const withdrawPercent = (annualWithdrawal / customCorpus) * 100;
                          const isSafe = withdrawPercent <= 8; // Sustainable withdrawal rate is generally under 8%

                          return (
                            <div className="space-y-4 pt-4 border-t border-gold/10">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-bg-dark-2/60 border border-gold/5 rounded-xl text-center">
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Annual Drawdown Rate</span>
                                  <span className={`text-sm font-bold font-mono ${isSafe ? 'text-emerald-400' : 'text-orange-400'}`}>
                                    {withdrawPercent.toFixed(1)}% / Year
                                  </span>
                                </div>
                                <div className="p-3 bg-gold/5 border border-gold/10 rounded-xl text-center">
                                  <span className="text-[10px] text-gold uppercase tracking-wider block mb-0.5">Tax Efficiency Multiplier</span>
                                  <span className="text-sm font-bold text-gold font-mono">~85% Tax Exempt</span>
                                </div>
                              </div>

                              <div className={`p-3.5 border rounded-xl flex items-start gap-2 text-left ${
                                isSafe ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-orange-950/10 border-orange-500/20'
                              }`}>
                                <Info className={`w-4 h-4 shrink-0 mt-0.5 ${isSafe ? 'text-emerald-400' : 'text-orange-400'}`} />
                                <div>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSafe ? 'text-emerald-400' : 'text-orange-400'}`}>
                                    {isSafe ? 'Highly Sustainable Model' : 'Aggressive Principal Erosion Warning'}
                                  </span>
                                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                                    {isSafe 
                                      ? "Excellent! At under 8% yearly withdrawal, your portfolio corpus is compounding strong enough to comfortably withstand market downtime without eating major capital."
                                      : "Warning: Since annual drawdowns exceed 8%, periods of stock market volatility can quickly eat into your core capital, shortening your payoff timeline."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {selectedPost.interactiveType === 'stp_calculator' && (
                    <div className="bg-bg-dark-3/60 border border-gold/15 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-5 h-5 text-gold" />
                        <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wide">STP Systematic Shelter Sandbox</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-6 leading-relaxed text-left">
                        See how deploying a ₹10,000,000 lump sum gradually across a scheduled timeline provides volatility protection.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Gradual Transfer Period:</span>
                            <span className="text-gold font-bold">{customSipYears} Months</span> {/* Reusing state */}
                          </div>
                          <input 
                            type="range" 
                            min="6" 
                            max="36" 
                            step="6"
                            value={customSipYears} 
                            onChange={(e) => setCustomSipYears(Number(e.target.value))}
                            className="w-full accent-gold bg-bg-dark-2 h-1 rounded-lg"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold/10">
                          <div className="p-3 bg-bg-dark-2/60 border border-gold/5 rounded-xl text-center">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Monthly Automated Transfer</span>
                            <span className="text-sm font-bold text-white font-mono">₹{Math.round(10000000 / customSipYears).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="p-3 bg-gold/5 border border-gold/10 rounded-xl text-center">
                            <span className="text-[10px] text-gold uppercase tracking-wider block mb-0.5">Estimated Liquid Safe Interest</span>
                            <span className="text-sm font-bold text-gold font-mono">~₹{Math.round(10000000 * 0.05 * (customSipYears / 24)).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-bg-dark-3 border border-gold/10 rounded-xl flex gap-2.5 items-start text-left">
                          <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            Your ₹10,000,000 earns low-volatility returns in a secure debt protector category from day one, while transferring slice-by-slice into compounding equity assets to safeguard from market crashes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPost.interactiveType === 'budget_calculator' && (
                    <div className="bg-bg-dark-3/60 border border-gold/15 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-gold" />
                        <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wide">50-30-20 Wealth Allocator</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed text-left">
                        Input your direct net monthly household household salary to generate an ideal streamlined cash allocation.
                      </p>

                      <div className="space-y-4">
                        <div className="relative">
                          <input 
                            type="number" 
                            value={customIncome} 
                            onChange={(e) => setCustomIncome(Math.max(0, Number(e.target.value)))}
                            placeholder="Monthly Income (₹)"
                            className="w-full bg-bg-dark-2 border border-gold/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold/30 focus:outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gold/50 font-bold">₹ INR</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3.5 pt-2">
                          <div className="p-3.5 bg-orange-950/20 border border-orange-500/10 rounded-xl text-center flex flex-col justify-between h-24">
                            <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider">NEEDS (50%)</span>
                            <span className="text-sm font-bold text-white font-mono">₹{Math.round(customIncome * 0.5).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="p-3.5 bg-yellow-950/20 border border-yellow-500/10 rounded-xl text-center flex flex-col justify-between h-24">
                            <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider">WANTS (30%)</span>
                            <span className="text-sm font-bold text-white font-mono">₹{Math.round(customIncome * 0.3).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/10 rounded-xl text-center flex flex-col justify-between h-24">
                            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">WEALTH (20%)</span>
                            <span className="text-sm font-bold text-emerald-400 font-mono">₹{Math.round(customIncome * 0.2).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-normal text-center italic mt-2">
                          Advice from Shubham: "Route the <strong className="text-white">₹{Math.round(customIncome * 0.2).toLocaleString('en-IN')}</strong> directly into an automated index or equity fund SIP on pay-day before shopping or dining."
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPost.interactiveType === 'etf_comparator' && (
                    <div className="bg-bg-dark-3/60 border border-gold/15 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-4">
                        <ArrowLeftRight className="w-5 h-5 text-gold" />
                        <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wide">ETF vs Mutual Fund Quick Metrics</h4>
                      </div>
                      
                      <div className="overflow-x-auto border border-gold/10 rounded-xl">
                        <table className="w-full text-left text-xs text-muted-foreground min-w-[320px]">
                          <thead>
                            <tr className="bg-bg-dark-2 text-white border-b border-gold/10">
                              <th className="p-3">Attribute</th>
                              <th className="p-3 text-gold">Exchange Traded Funds</th>
                              <th className="p-3">Mutual Funds</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gold/5 bg-bg-dark-3/35">
                            <tr>
                              <td className="p-3 font-medium text-white">Expense Fee</td>
                              <td className="p-3 text-gold font-bold">Incredibly Low (~0.05% - 0.2%)</td>
                              <td className="p-3">Slightly Higher (~0.7% - 2.2%)</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-medium text-white">Trading Speed</td>
                              <td className="p-3 text-gold font-bold">Live on NSE/BSE Exchanges</td>
                              <td className="p-3">Once-Daily Closing NAV Settlement</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-medium text-white">Advisory Input</td>
                              <td className="p-3 text-gold font-bold">Passive Index Replication</td>
                              <td className="p-3">Active Outperformance Management</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-normal mt-4 text-left">
                        Choose **ETFs** if you want simple, low-admin market tracking. Opt for **Mutual Funds** if you wish for custom professional allocation and alpha generation.
                      </p>
                    </div>
                  )}

                  {selectedPost.interactiveType === 'stock_checklist' && (
                    <div className="bg-bg-dark-3/60 border border-gold/15 rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-gold" />
                        <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wide">First Stock Robustness Audit</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed text-left">
                        Tick the filters below to evaluate a target company of interest before buying holdings:
                      </p>

                      <div className="space-y-2 text-left">
                        {[
                          "I fully understand the absolute core product/revenue model of this company.",
                          "The stock price valuation is rational compared to historical industry rates (P/E ratios).",
                          "The business debt ratio is fully under control (Debt/Equity < 1.5).",
                          "There is a sturdy, clear economic moat resisting aggressive industry competitors.",
                          "I am fully prepared to stay locked-in for a 5+ year time window."
                        ].map((checkPoint, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const updated = [...stockChecks];
                              updated[index] = !updated[index];
                              setStockChecks(updated);
                            }}
                            className="w-full flex items-start gap-3 p-3 bg-bg-dark-2/40 hover:bg-bg-dark-2/80 rounded-xl text-left border border-gold/5 hover:border-gold/20 transition-all cursor-pointer"
                          >
                            <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${
                              stockChecks[index] ? 'bg-gold border-gold text-bg-dark' : 'border-gold/30'
                            }`}>
                              {stockChecks[index] && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-[11.5px] text-white/80 leading-snug">{checkPoint}</span>
                          </button>
                        ))}
                      </div>

                      {(() => {
                        const verifiedCount = stockChecks.filter(Boolean).length;
                        return (
                          <div className="mt-4 pt-4 border-t border-gold/10 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Checklist Integrity Status:</span>
                            <span className={`font-bold px-3 py-1 rounded-full ${
                              verifiedCount === 5 
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                                : verifiedCount >= 3 
                                  ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/20' 
                                  : 'bg-red-950/40 text-red-500 border border-red-500/20'
                            }`}>
                              {verifiedCount === 5 ? "Strong Preparedness" : verifiedCount >= 3 ? "Do More Deep Study" : "Highly Volatile Strategy"}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* INTERACTIVE COMPREHENSION QUIZ BOX */}
                <div className="bg-bg-dark-3/30 border border-gold/10 rounded-[24px] p-6 md:p-8 mb-8 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-gold" />
                    <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Knowledge Check Quiz</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Test your understanding of this financial insight:
                  </p>
                  
                  <h5 className="text-white text-sm font-semibold mb-4 leading-normal">
                    {selectedPost.quiz.question}
                  </h5>

                  <div className="space-y-2.5 mb-5">
                    {selectedPost.quiz.options.map((option, idx) => {
                      const isSelected = quizSelectedIdx === idx;
                      const isCorrect = idx === selectedPost.quiz.answerIdx;
                      
                      let optionBg = "bg-bg-dark-2/65 hover:bg-bg-dark-2 border-gold/5";
                      if (quizSubmitted) {
                        if (isSelected) {
                          optionBg = isCorrect 
                            ? "bg-emerald-950/40 border-emerald-500 text-emerald-400" 
                            : "bg-red-950/40 border-red-500 text-red-400";
                        } else if (isCorrect) {
                          optionBg = "bg-emerald-995/20 border-emerald-500/50 text-emerald-400/80";
                        }
                      } else if (isSelected) {
                        optionBg = "bg-gold/10 border-gold text-gold";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizSelectedIdx(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all duration-200 flex items-start gap-3 justify-between ${optionBg}`}
                        >
                          <span className="leading-relaxed">{option}</span>
                          {quizSubmitted && isSelected && (
                            <span className="font-bold shrink-0">
                              {isCorrect ? "✓ Correct" : "✗ Wrong"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      disabled={quizSelectedIdx === null}
                      onClick={() => setQuizSubmitted(true)}
                      className="w-full bg-gold disabled:bg-gold/30 disabled:text-bg-dark/40 disabled:cursor-not-allowed text-bg-dark font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-gold-light transition-all"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gold/5 border border-gold/15 rounded-xl text-xs space-y-2 text-left"
                    >
                      <div className="flex items-center gap-1.5 text-gold font-bold">
                        <Info className="w-3.5 h-3.5" />
                        <span>Insight Explanation</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedPost.quiz.explanation}
                      </p>
                      <button
                        onClick={() => { setQuizSelectedIdx(null); setQuizSubmitted(false); }}
                        className="text-gold/80 hover:text-gold text-[10px] font-bold uppercase tracking-wider block pt-1.5 underline"
                      >
                        Try Again
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Form CTA & Consult button */}
                <div className="bg-gold/5 border border-gold/15 rounded-[24px] p-6 mb-8 text-left">
                  <h4 className="text-gold font-serif font-bold text-sm uppercase tracking-wider mb-2">Personal Advisor Roadmap</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Transforming academic insights into personalized high-yielding plans requests unique strategy parameters. Reach directly out to FinAura Capital advisory team.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/919423669236?text=Hi FinAura Capital! I read your detailed insight on '${selectedPost.title}' and want a personalized consultation plan.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow inline-flex items-center justify-center gap-2 bg-gold text-bg-dark px-6 py-3.5 rounded-2xl font-bold hover:bg-gold-light hover:shadow-[0_10px_20px_rgba(201,168,76,0.15)] transition-all duration-300 text-sm"
                  >
                    <span>Consult on WhatsApp</span>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-15.635c-.161-.357-.33-.364-.483-.37l-.41-.008c-.141 0-.372.053-.567.265-.195.212-.744.727-.744 1.772s.76 2.062.865 2.203c.105.141 1.493 2.28 3.618 3.197.505.218.9.348 1.21.446.508.162.97.139 1.337.085.41-.06 1.258-.514 1.434-1.011.176-.496.176-.922.123-1.011-.053-.089-.195-.141-.41-.247-.215-.106-1.258-.62-1.453-.69-.195-.071-.337-.106-.48.106-.141.212-.548.69-.672.831-.123.141-.247.159-.462.053-.215-.106-.906-.334-1.727-1.066-.639-.57-1.07-1.275-1.196-1.488-.127-.212-.013-.327.093-.432.095-.095.215-.247.323-.371.106-.124.142-.212.213-.353.07-.142.036-.265-.018-.371-.053-.105-.483-1.166-.662-1.597z"/>
                    </svg>
                  </a>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="sm:w-36 inline-flex items-center justify-center bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      <Glossary />
    </section>
  );
};
