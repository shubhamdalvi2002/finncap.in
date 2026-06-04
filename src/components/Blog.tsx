import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, ShieldCheck, Wallet, ArrowLeftRight, BarChart3, Lightbulb, ArrowLeft } from 'lucide-react';
import { Glossary } from './Glossary';

const BLOG_POSTS = [
  {
    tag: 'Beginner',
    title: 'Why Starting a SIP Early Can Change Your Life',
    excerpt: 'The power of compounding rewards those who start early. Even ₹500/month at age 22 can grow into a substantial corpus.',
    full: 'A Systematic Investment Plan (SIP) lets you invest a fixed amount every month into a mutual fund. Starting as low as ₹500/month, SIP harnesses the power of rupee cost averaging — you buy more units when markets are low and fewer when high. Over time, this smooths out volatility and compounds your wealth significantly. The key is consistency: even a ₹5,000/month SIP at 12% annual returns grows to over ₹1 Crore in 25 years.',
    icon: <TrendingUp className="w-16 h-16" />,
    color: 'from-bg-dark to-orange-900/20'
  },
  {
    tag: 'Strategy',
    title: 'STP: The Smartest Way to Enter Equity Markets',
    excerpt: 'Lump sum investing at the wrong time can be costly. A Systematic Transfer Plan helps you enter equity gradually.',
    full: 'If you have a large lump sum to invest but fear market volatility, a Systematic Transfer Plan (STP) is ideal. Park your money in a liquid or debt fund first (earning ~6–7%), then transfer a fixed amount monthly to an equity fund. This gives you the safety of debt with gradual equity exposure — effectively mimicking a SIP from your own corpus while your entire amount earns returns from day one.',
    icon: <ShieldCheck className="w-16 h-16" />,
    color: 'from-bg-dark to-green-900/20'
  },
  {
    tag: 'Retirement',
    title: 'How SWP Creates a Salary After Retirement',
    excerpt: 'A Systematic Withdrawal Plan lets your corpus keep growing while paying you monthly — a tax-efficient alternative.',
    full: 'A Systematic Withdrawal Plan (SWP) lets your mutual fund corpus pay you monthly while the remaining balance continues earning returns. Unlike FD interest, SWP withdrawals from equity funds held over 1 year are taxed at only 10% on gains exceeding ₹1L — making it highly tax-efficient. For example, a ₹50L corpus at 10% annual growth can sustain ₹35,000/month withdrawals for 30+ years.',
    icon: <Wallet className="w-16 h-16" />,
    color: 'from-bg-dark to-red-900/20'
  },
  {
    tag: 'ETFs',
    title: 'ETFs vs Mutual Funds: Which is Right for You?',
    excerpt: 'Both have merit, but the choice depends on your investment style. ETFs offer flexibility and low costs.',
    full: 'ETFs (Exchange Traded Funds) trade on stock exchanges like shares and typically track an index passively with very low expense ratios (0.05–0.2%). Mutual funds are actively managed with higher expense ratios (0.5–2%) but offer professional fund manager expertise. Choose ETFs if you want low-cost, passive exposure to markets. Choose mutual funds if you want active management aiming to beat the benchmark.',
    icon: <ArrowLeftRight className="w-16 h-16" />,
    color: 'from-bg-dark to-purple-900/20'
  },
  {
    tag: 'Stocks',
    title: '5 Golden Rules Before Buying Your First Stock',
    excerpt: 'Understand the business, check valuation, diversify, and never chase tips. Invest for the long term.',
    full: 'Understand the business, check valuation, diversify, invest only what you can afford to hold long-term, and never chase tips. The stock market is a vehicle for wealth creation, but it requires patience and a systematic approach. Research backed decisions always outperform speculative bets.',
    icon: <BarChart3 className="w-16 h-16" />,
    color: 'from-bg-dark to-yellow-900/20'
  },
  {
    tag: 'Wealth Tips',
    title: 'The 50-30-20 Rule: A Simple Budget That Works',
    excerpt: '50% needs, 30% wants, 20% savings & investments. This timeless framework is the foundation of every plan.',
    full: '50% needs, 30% wants, 20% savings & investments. This timeless framework is the foundation of every solid financial plan. By automating your 20% investment at the start of the month, you ensure your future self is taken care of before you spend on wants.',
    icon: <Lightbulb className="w-16 h-16" />,
    color: 'from-bg-dark to-emerald-900/20'
  }
];


export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<typeof BLOG_POSTS[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(BLOG_POSTS.map(post => post.tag))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.tag === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 px-6 bg-bg-dark-2">
      <div className="max-w-7xl mx-auto mb-10 -mt-6 flex justify-start">
        <a 
          href="#" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 text-gold" />
          <span>Back to Home</span>
        </a>
      </div>

      <div className="text-center mb-16">
        <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">Knowledge Centre</div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Financial Tips & Insights</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10">Grow smarter with bite-sized financial wisdom — curated for every investor.</p>

        {/* Search and Filter Bar */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  activeCategory === cat 
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
              className="w-full bg-bg-dark-3 border border-gold/10 rounded-full px-5 py-2 text-sm outline-none focus:border-gold/40 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -12 }}
              onClick={() => setSelectedPost(post)}
              className="group relative bg-bg-dark-3/40 backdrop-blur-sm border border-gold/10 rounded-3xl overflow-hidden cursor-pointer hover:border-gold/40 hover:shadow-[0_20px_50px_rgba(201,168,76,0.1)] transition-all duration-500 flex flex-col h-full"
            >
              {/* Card Header/Image Area */}
              <div className={`h-56 flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${post.color}`}>
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
                
                {/* Overlay gradient for text readability if needed, but here it's for style */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark-3/80 to-transparent opacity-60" />
                
                {/* Tag floating on image */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-1.5 rounded-full text-[0.65rem] font-bold tracking-widest uppercase bg-bg-dark/80 backdrop-blur-md border border-gold/20 text-gold shadow-lg">
                    {post.tag}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow relative">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <h3 className="font-serif text-2xl font-bold leading-[1.2] mb-4 group-hover:text-gold transition-colors duration-300">
                  {post.title}
                </h3>
                
                <p className="text-[0.95rem] text-muted-foreground leading-relaxed mb-8 line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  {post.excerpt}
                </p>

                {/* Footer Info */}
                <div className="mt-auto pt-6 border-t border-gold/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[0.7rem] text-muted-foreground/60 font-medium">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>5 min read</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gold/20" />
                    <span>Insights</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gold text-[0.75rem] font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                    <span>Explore</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
          <button 
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className="text-gold text-sm mt-4 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-bg-dark/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-bg-dark-2 border border-gold/20 rounded-[32px] w-full max-w-3xl relative shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-50 p-2.5 bg-bg-dark/50 backdrop-blur-md border border-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-dark transition-all duration-300 group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Left Side: Visual/Icon */}
              <div className={`hidden md:flex md:w-1/3 items-center justify-center relative bg-gradient-to-br ${selectedPost.color} p-12 overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
                </div>
                <div className="relative z-10 text-gold filter drop-shadow-[0_0_20px_rgba(201,168,76,0.5)] transform scale-150">
                  {selectedPost.icon}
                </div>
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-2/3 p-6 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full text-[0.6rem] font-bold tracking-[0.15em] uppercase bg-gold/10 border border-gold/20 text-gold">
                    {selectedPost.tag}
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground/60 font-medium uppercase tracking-widest">
                    5 Min Read
                  </span>
                </div>

                <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-[1.1] text-white">
                  {selectedPost.title}
                </h3>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8 italic border-l-2 border-gold/30 pl-6">
                    {selectedPost.excerpt}
                  </p>
                  
                  <p className="text-white/80 text-[1.05rem] leading-[1.8] mb-10">
                    {selectedPost.full}
                  </p>
                </div>

                <div className="bg-gold/5 border border-gold/10 rounded-2xl p-6 mb-10">
                  <h4 className="text-gold font-bold text-sm uppercase tracking-wider mb-2">Expert Action Point</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    For a personalised strategy based on this insight, reach out to our advisory team. We'll help you turn this knowledge into a concrete wealth plan.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/919423669236?text=Hi FinAura Capital! I read about '${selectedPost.title}' and want to know more.`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-bg-dark px-8 py-4 rounded-2xl font-bold hover:bg-gold-light hover:shadow-[0_10px_20px_rgba(201,168,76,0.2)] transition-all duration-300"
                  >
                    <span>Consult an Expert</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </a>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="flex-1 inline-flex items-center justify-center bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
                  >
                    Close Article
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
