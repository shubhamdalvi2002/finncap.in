import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const BLOG_POSTS = [
  {
    tag: 'Beginner',
    title: 'Why Starting a SIP Early Can Change Your Life',
    excerpt: 'The power of compounding rewards those who start early. Even ₹500/month at age 22 can grow into a substantial corpus.',
    full: 'A Systematic Investment Plan (SIP) lets you invest a fixed amount every month into a mutual fund. Starting as low as ₹500/month, SIP harnesses the power of rupee cost averaging — you buy more units when markets are low and fewer when high. Over time, this smooths out volatility and compounds your wealth significantly. The key is consistency: even a ₹5,000/month SIP at 12% annual returns grows to over ₹1 Crore in 25 years.',
    icon: '📈',
    color: 'from-bg-dark to-orange-900/20'
  },
  {
    tag: 'Strategy',
    title: 'STP: The Smartest Way to Enter Equity Markets',
    excerpt: 'Lump sum investing at the wrong time can be costly. A Systematic Transfer Plan helps you enter equity gradually.',
    full: 'If you have a large lump sum to invest but fear market volatility, a Systematic Transfer Plan (STP) is ideal. Park your money in a liquid or debt fund first (earning ~6–7%), then transfer a fixed amount monthly to an equity fund. This gives you the safety of debt with gradual equity exposure — effectively mimicking a SIP from your own corpus while your entire amount earns returns from day one.',
    icon: '🛡️',
    color: 'from-bg-dark to-green-900/20'
  },
  {
    tag: 'Retirement',
    title: 'How SWP Creates a Salary After Retirement',
    excerpt: 'A Systematic Withdrawal Plan lets your corpus keep growing while paying you monthly — a tax-efficient alternative.',
    full: 'A Systematic Withdrawal Plan (SWP) lets your mutual fund corpus pay you monthly while the remaining balance continues earning returns. Unlike FD interest, SWP withdrawals from equity funds held over 1 year are taxed at only 10% on gains exceeding ₹1L — making it highly tax-efficient. For example, a ₹50L corpus at 10% annual growth can sustain ₹35,000/month withdrawals for 30+ years.',
    icon: '💸',
    color: 'from-bg-dark to-red-900/20'
  },
  {
    tag: 'ETFs',
    title: 'ETFs vs Mutual Funds: Which is Right for You?',
    excerpt: 'Both have merit, but the choice depends on your investment style. ETFs offer flexibility and low costs.',
    full: 'ETFs (Exchange Traded Funds) trade on stock exchanges like shares and typically track an index passively with very low expense ratios (0.05–0.2%). Mutual funds are actively managed with higher expense ratios (0.5–2%) but offer professional fund manager expertise. Choose ETFs if you want low-cost, passive exposure to markets. Choose mutual funds if you want active management aiming to beat the benchmark.',
    icon: '🔗',
    color: 'from-bg-dark to-purple-900/20'
  },
  {
    tag: 'Stocks',
    title: '5 Golden Rules Before Buying Your First Stock',
    excerpt: 'Understand the business, check valuation, diversify, and never chase tips. Invest for the long term.',
    full: 'Understand the business, check valuation, diversify, invest only what you can afford to hold long-term, and never chase tips. The stock market is a vehicle for wealth creation, but it requires patience and a systematic approach. Research backed decisions always outperform speculative bets.',
    icon: '📊',
    color: 'from-bg-dark to-yellow-900/20'
  },
  {
    tag: 'Wealth Tips',
    title: 'The 50-30-20 Rule: A Simple Budget That Works',
    excerpt: '50% needs, 30% wants, 20% savings & investments. This timeless framework is the foundation of every plan.',
    full: '50% needs, 30% wants, 20% savings & investments. This timeless framework is the foundation of every solid financial plan. By automating your 20% investment at the start of the month, you ensure your future self is taken care of before you spend on wants.',
    icon: '💡',
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPost(post)}
              className="bg-bg-dark-3 border border-gold/10 rounded-2xl overflow-hidden cursor-pointer hover:border-gold/30 transition-all group flex flex-col h-full"
            >
              <div className={`h-48 flex items-center justify-center text-6xl relative bg-gradient-to-br ${post.color}`}>
                <span className="relative z-10 filter drop-shadow-lg">{post.icon}</span>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <span className="inline-block text-[0.6rem] tracking-[0.2em] uppercase text-gold bg-gold/5 border border-gold/20 px-3 py-1 rounded-full mb-5 w-fit">
                  {post.tag}
                </span>
                <h3 className="font-serif text-xl font-bold leading-tight mb-4 group-hover:text-gold transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                <div className="mt-auto pt-6 border-t border-gold/5 flex items-center justify-between text-[0.7rem] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold/40" />
                    <span>5 min read</span>
                  </div>
                  <span className="text-gold font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <span>→</span>
                  </span>
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
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-dark-3 border border-gold/20 rounded-[20px] p-10 max-w-xl w-full relative shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 bg-gold/10 border border-gold/20 text-gold rounded-full hover:bg-gold/20 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="text-[0.72rem] tracking-[0.12em] uppercase text-gold mb-3">Financial Tip</div>
              <h3 className="font-serif text-2xl font-bold mb-4 leading-tight">{selectedPost.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{selectedPost.full}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                For a personalised strategy based on this insight, reach out to our advisory team — we'll help you turn knowledge into action.
              </p>
              <a
                href={`https://wa.me/919423669236?text=Hi FinAura Capital! I read about '${selectedPost.title}' and want to know more.`}
                target="_blank"
                className="inline-block bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all"
              >
                💬 Ask an Expert →
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
