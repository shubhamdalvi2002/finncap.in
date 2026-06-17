import React from 'react';
import { HeroBackground } from './HeroBackground';
import { motion } from 'motion/react';
import { FinauraLogo } from './FinauraLogo';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-36 pb-20 relative overflow-hidden">
      <HeroBackground />
      
      {/* Floating Coins (CSS animated) */}
      <div className="absolute top-[18%] left-[8%] w-[70px] h-[70px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-70 blur-[1px] animate-bounce duration-[7s] z-10 hidden md:block" style={{ animationDuration: '7s' }} />
      <div className="absolute top-[30%] right-[10%] w-[45px] h-[45px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-50 blur-[1px] animate-bounce duration-[5.5s] z-10 hidden md:block" style={{ animationDuration: '5.5s' }} />
      <div className="absolute bottom-[22%] left-[14%] w-[90px] h-[90px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-40 blur-[1px] animate-bounce duration-[8s] z-10 hidden md:block" style={{ animationDuration: '8s' }} />

      {/* Floating Candlestick Charts (Green and Red motion ornaments) */}
      <motion.div
        className="absolute left-[4%] top-[42%] flex flex-col items-center opacity-40 md:opacity-60 z-10 hidden sm:flex pointer-events-none"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 4, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[1.5px] h-8 bg-emerald-500/60" />
        <div className="w-4 h-12 bg-emerald-500/35 dark:bg-emerald-500/25 rounded border border-emerald-500/50 backdrop-blur-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]" />
        <div className="w-[1.5px] h-6 bg-emerald-500/60" />
      </motion.div>

      <motion.div
        className="absolute right-[5%] bottom-[38%] flex flex-col items-center opacity-30 md:opacity-50 z-10 hidden sm:flex pointer-events-none"
        animate={{
          y: [0, 22, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[1.5px] h-6 bg-rose-500/60" />
        <div className="w-4 h-14 bg-rose-500/35 dark:bg-rose-500/25 rounded border border-rose-500/50 backdrop-blur-xs shadow-[0_0_15px_rgba(244,63,94,0.15)]" />
        <div className="w-[1.5px] h-10 bg-rose-500/60" />
      </motion.div>

      {/* Smaller auxiliary candles for perspective depth */}
      <motion.div
        className="absolute left-[16%] top-[24%] flex flex-col items-center opacity-25 md:opacity-45 z-10 hidden md:flex pointer-events-none"
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[1px] h-5 bg-emerald-500/50" />
        <div className="w-3.5 h-8 bg-emerald-500/30 dark:bg-emerald-500/20 rounded border border-emerald-500/40" />
        <div className="w-[1px] h-5 bg-emerald-500/50" />
      </motion.div>

      <motion.div
        className="absolute right-[14%] top-[20%] flex flex-col items-center opacity-20 md:opacity-40 z-10 hidden md:flex pointer-events-none"
        animate={{
          y: [0, 18, 0],
          x: [0, -6, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[1px] h-8 bg-rose-500/50" />
        <div className="w-3.5 h-10 bg-rose-500/30 dark:bg-rose-500/20 rounded border border-rose-500/40" />
        <div className="w-[1px] h-6 bg-rose-500/50" />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <FinauraLogo variant="full" className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:scale-105 transition-transform duration-500 cursor-pointer" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block border border-gold/20 text-gold text-[0.7rem] md:text-[0.75rem] tracking-[0.12em] uppercase px-5 py-1.5 rounded-full bg-gold/5 mb-8"
        >
          Trusted Financial Advisory
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.08] mb-6 text-balance"
        >
          Grow With <span className="text-gold">Clarity,</span><br />Invest With Confidence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed"
        >
          Expert guidance in Stocks, Mutual Funds, ETFs, SIP, SWP & STP — crafted to help you build lasting wealth on your terms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <a href="http://p.njw.bz/103924" target="_blank" className="bg-gold text-bg-dark px-8 py-3.5 rounded-full font-medium hover:bg-gold-light hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/30 transition-all">
              Start Investing Now
            </a>
            <a href="https://ewa.njindiaonline.com/ewa/login" target="_blank" rel="noopener noreferrer" className="border border-gold/45 text-gold px-8 py-3.5 rounded-full font-medium hover:bg-gold/5 hover:-translate-y-1 transition-all">
              Client Login
            </a>
          </div>
          <a href="#services" className="border border-foreground/25 text-foreground px-8 py-3.5 rounded-full font-medium hover:border-gold hover:text-gold hover:-translate-y-1 transition-all text-sm uppercase tracking-wider font-semibold">
            Explore Services
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mt-20 pt-12 border-t border-gold/10 w-full max-w-4xl relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12"
      >
        <Stat num="SIP" label="Systematic Investment Plan" />
        <Stat num="ETFs" label="Exchange Traded Funds" />
        <Stat num="MF" label="Mutual Funds" />
        <Stat num="SWP" label="Systematic Withdrawal Plan" />
      </motion.div>
    </section>
  );
};

const Stat = ({ num, label }: { num: string; label: string }) => (
  <div 
    className="flex flex-col items-center p-2 md:p-3 transition-colors duration-300"
    aria-label={`Educational information about ${num}`}
  >
    <div className="font-serif text-3xl font-bold text-gold transition-colors">
      <span>{num}</span>
    </div>
    <div className="text-[0.68rem] text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
  </div>
);
