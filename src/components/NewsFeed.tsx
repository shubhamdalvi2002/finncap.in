import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: { name: string };
  publishedAt: string;
}

export const NewsFeed: React.FC = () => {
  const { news: articles, connected } = useMarketData();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUpdateBadge, setShowUpdateBadge] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const prevArticlesLength = useRef(0);

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn('Audio notification failed:', err);
    }
  };

  useEffect(() => {
    if (articles.length > 0) {
      setLoading(false);
      if (prevArticlesLength.current > 0 && articles.length !== prevArticlesLength.current) {
        setShowUpdateBadge(true);
        playNotificationSound();
        setTimeout(() => setShowUpdateBadge(false), 5000);
      }
      prevArticlesLength.current = articles.length;
    }
  }, [articles]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    if (!loading && articles.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex === articles.length - 1 ? 0 : prevIndex + 1));
      }, 6000);
    }
    return () => resetTimeout();
  }, [currentIndex, loading, articles]);

  const next = () => {
    resetTimeout();
    setCurrentIndex(prevIndex => (prevIndex === articles.length - 1 ? 0 : prevIndex + 1));
  };

  const prev = () => {
    resetTimeout();
    setCurrentIndex(prevIndex => (prevIndex === 0 ? articles.length - 1 : prevIndex - 1));
  };

  if (loading) {
    return (
      <div className="py-12 bg-bg-dark-3 border-y border-gold/10 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gold animate-pulse">
          <Newspaper size={20} />
          <span className="text-sm font-medium uppercase tracking-widest">Fetching Market News...</span>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  const current = articles[currentIndex];
  if (!current) return null;

  return (
    <div className={`relative bg-bg-dark-3 border-y transition-all duration-700 overflow-hidden ${showUpdateBadge ? 'border-gold shadow-[inset_0_0_20px_rgba(201,168,76,0.15)]' : 'border-gold/10'}`}>
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0 flex items-center gap-3 text-gold md:border-r md:border-gold/20 md:pr-8 relative">
          <AnimatePresence>
            {showUpdateBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -10 }}
                className="absolute -top-4 -right-2 bg-gold text-bg-dark text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full shadow-lg z-20"
              >
                NEW
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Newspaper size={20} />
          </div>
          <div>
            <div className="text-[0.65rem] uppercase tracking-widest opacity-60">Live Feed</div>
            <div className="font-serif font-bold text-lg">Market News</div>
          </div>
        </div>

        <div className="flex-grow relative min-h-[80px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[0.65rem] text-gold font-medium uppercase tracking-wider">
                  <span>{current.source.name}</span>
                  <span className="opacity-30">•</span>
                  <span className="opacity-60">{new Date(current.publishedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-medium text-sm md:text-base leading-snug line-clamp-2">
                  {current.title}
                </h3>
                <a 
                  href={current.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[0.7rem] text-gold hover:text-gold-light flex items-center gap-1 mt-1 transition-colors group"
                >
                  Read full story <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prev}
            className="p-2 rounded-full border border-gold/20 text-gold hover:bg-gold/10 transition-colors"
            aria-label="Previous headline"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-[0.65rem] font-mono text-muted-foreground w-10 text-center">
            {currentIndex + 1} / {articles.length}
          </div>
          <button 
            onClick={next}
            className="p-2 rounded-full border border-gold/20 text-gold hover:bg-gold/10 transition-colors"
            aria-label="Next headline"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-gold/30 w-full">
        <motion.div 
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-gold"
        />
      </div>
    </div>
  );
};
