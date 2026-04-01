import React from 'react';
import { HeroBackground } from './HeroBackground';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-36 pb-20 relative overflow-hidden">
      <HeroBackground />
      
      {/* Floating Coins (CSS animated) */}
      <div className="absolute top-[18%] left-[8%] w-[70px] h-[70px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-70 blur-[1px] animate-bounce duration-[7s] z-10 hidden md:block" style={{ animationDuration: '7s' }} />
      <div className="absolute top-[30%] right-[10%] w-[45px] h-[45px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-50 blur-[1px] animate-bounce duration-[5.5s] z-10 hidden md:block" style={{ animationDuration: '5.5s' }} />
      <div className="absolute bottom-[22%] left-[14%] w-[90px] h-[90px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-40 blur-[1px] animate-bounce duration-[8s] z-10 hidden md:block" style={{ animationDuration: '8s' }} />


      <div className="relative z-10 max-w-4xl mx-auto">
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
          className="flex flex-wrap justify-center gap-4"
        >
          <a href="http://p.njw.bz/103924" target="_blank" className="bg-gold text-bg-dark px-8 py-3.5 rounded-full font-medium hover:bg-gold-light hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/30 transition-all">
            Start Investing Now
          </a>
          <a href="#services" className="border border-foreground/25 text-foreground px-8 py-3.5 rounded-full font-medium hover:border-gold hover:text-gold hover:-translate-y-1 transition-all">
            Explore Services
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mt-20 pt-12 border-t border-gold/10 w-full max-w-2xl relative z-10 flex flex-wrap justify-center gap-12"
      >
        <Stat num="SIP" label="Systematic Plans" />
        <Stat num="ETFs" label="Exchange Traded" />
        <Stat num="MF" label="Mutual Funds" />
        <Stat num="SWP" label="Withdrawal Plans" />
      </motion.div>
    </section>
  );
};

const Stat = ({ num, label }: { num: string, label: string }) => (
  <div className="flex flex-col items-center">
    <div className="font-serif text-3xl font-bold text-gold">{num}</div>
    <div className="text-[0.7rem] text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
  </div>
);
