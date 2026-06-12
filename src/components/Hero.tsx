import React, { useState } from 'react';
import { HeroBackground } from './HeroBackground';
import { motion } from 'motion/react';
import { FinauraLogo } from './FinauraLogo';
import { ConceptExplainerModal, ConceptType } from './ConceptExplainerModal';
import { ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>('sip');

  const openConcept = (concept: ConceptType) => {
    setSelectedConcept(concept);
    setModalOpen(true);
  };
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-36 pb-20 relative overflow-hidden">
      <HeroBackground />
      
      {/* Floating Coins (CSS animated) */}
      <div className="absolute top-[18%] left-[8%] w-[70px] h-[70px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-70 blur-[1px] animate-bounce duration-[7s] z-10 hidden md:block" style={{ animationDuration: '7s' }} />
      <div className="absolute top-[30%] right-[10%] w-[45px] h-[45px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-50 blur-[1px] animate-bounce duration-[5.5s] z-10 hidden md:block" style={{ animationDuration: '5.5s' }} />
      <div className="absolute bottom-[22%] left-[14%] w-[90px] h-[90px] rounded-full bg-gradient-to-br from-gold-dim via-gold to-gold-light opacity-40 blur-[1px] animate-bounce duration-[8s] z-10 hidden md:block" style={{ animationDuration: '8s' }} />

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
        <Stat num="SIP" label="Systematic Investment Plan" onClick={() => openConcept('sip')} />
        <Stat num="ETFs" label="Exchange Traded Funds" onClick={() => openConcept('etf')} />
        <Stat num="MF" label="Mutual Funds" onClick={() => openConcept('mf')} />
        <Stat num="SWP" label="Systematic Withdrawal Plan" onClick={() => openConcept('swp')} />
      </motion.div>

      <ConceptExplainerModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initialConcept={selectedConcept} 
      />
    </section>
  );
};

const Stat = ({ num, label, onClick }: { num: string; label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 rounded-xl p-2 md:p-3 transition-all duration-300 hover:bg-gold/5 hover:scale-105"
    aria-label={`View educational guide on ${num}`}
  >
    <div className="font-serif text-3xl font-bold text-gold group-hover:text-gold-light transition-colors flex items-start">
      <span>{num}</span>
      <ArrowUpRight size={12} className="text-gold/40 group-hover:text-gold opacity-0 group-hover:opacity-100 transition-all ml-1 mt-1 shrink-0" />
    </div>
    <div className="text-[0.68rem] text-muted-foreground uppercase tracking-wider mt-1 group-hover:text-white/80 transition-colors">{label}</div>
  </button>
);
