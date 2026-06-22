import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarketTicker } from './components/MarketTicker';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { PartnerPortal } from './components/PartnerPortal';
import { motion, AnimatePresence } from 'motion/react';

export type ActivePage = 'home' | 'services' | 'calculators' | 'about' | 'contact' | 'partner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');

  // Handle hash or navigation events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      
      if (hash === '#services' || hash === '#/services') {
        setCurrentPage('services');
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else if (hash === '#calculators' || hash === '#/calculators') {
        setCurrentPage('services');
        setTimeout(() => {
          const element = document.getElementById('calculators');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else if (hash === '#about' || hash === '#/about') {
        setCurrentPage('about');
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else if (hash === '#contact' || hash === '#/contact') {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else if (hash === '#partner' || hash === '#/partner' || hash === '#admin' || hash === '#/admin') {
        setCurrentPage('partner');
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check on mount
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen selection:bg-gold selection:text-bg-dark bg-[rgb(var(--background))] text-foreground">
      <Navbar currentPage={currentPage} />
      <MarketTicker />
      
      <main className="pt-[36px] overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              <div className="pt-8">
                <About />
              </div>
            </motion.div>
          )}

          {currentPage === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pt-16 pb-8"
            >
              <Services />
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pt-16 pb-8"
            >
              <About />
            </motion.div>
          )}

          {currentPage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pt-16 pb-8"
            >
              <Contact />
            </motion.div>
          )}

          {currentPage === 'partner' && (
            <motion.div
              key="partner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="pt-16 pb-8"
            >
              <PartnerPortal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

