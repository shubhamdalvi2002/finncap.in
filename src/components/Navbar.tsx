import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'motion/react';
import { FinauraLogo } from './FinauraLogo';
import { ActivePage } from '../App';
import { PartnerLoginModal } from './PartnerLoginModal';

interface NavbarProps {
  currentPage: ActivePage;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  const handlePartnerClick = () => {
    const isAuth = sessionStorage.getItem('finaura_partner_auth') === 'true';
    if (isAuth) {
      window.location.hash = '#partner';
    } else {
      setPartnerOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Calculators', href: '#calculators', id: 'calculators' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-[6%] transition-all duration-300 backdrop-blur-lg border-b border-gold/10 ${scrolled ? 'py-3 bg-[rgb(var(--background))]/95' : 'py-5 bg-[rgb(var(--background))]/85'}`}>
        <a href="#home" className="flex items-center gap-1 hover:opacity-90 transition-opacity">
          <FinauraLogo variant="horizontal" />
        </a>

        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(link => {
            const isActive = link.id === 'calculators'
              ? window.location.hash.startsWith('#calculators')
              : link.id === 'services'
                ? currentPage === 'services' && !window.location.hash.startsWith('#calculators')
                : currentPage === link.id;
            return (
              <li key={link.name} className="relative py-1">
                <a 
                  href={link.href} 
                  className={`text-[13px] font-semibold uppercase tracking-wider transition-colors duration-300 relative ${
                    isActive 
                      ? 'text-gold' 
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="navIndicator"
                      className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button 
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-full cursor-pointer border border-gold/40 text-gold hover:bg-gold/10 transition-all flex items-center justify-center"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button 
            id="partner-login-desktop-btn"
            onClick={handlePartnerClick} 
            className="hidden sm:block border border-gold/40 text-gold hover:bg-gold/5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Partner Login
          </button>
          <a href="https://ewa.njindiaonline.com/ewa/login" target="_blank" rel="noopener noreferrer" className="hidden sm:block border border-foreground/15 text-foreground/90 hover:border-foreground px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all">
            Client Login
          </a>
          <a href="http://p.njw.bz/103924" target="_blank" className="hidden sm:block bg-gold text-bg-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gold-light hover:shadow-lg hover:shadow-gold/10 transition-all">
            Start Investing
          </a>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gold p-1 cursor-pointer">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-0 z-[180] bg-[rgb(var(--background))]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden transition-all duration-300 ${
              scrolled ? 'top-[50px]' : 'top-[60px]'
            }`}
          >
            {navLinks.map(link => {
              const isActive = link.id === 'calculators'
                ? window.location.hash.startsWith('#calculators')
                : link.id === 'services'
                  ? currentPage === 'services' && !window.location.hash.startsWith('#calculators')
                  : currentPage === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-serif text-2xl font-bold transition-colors duration-300 ${isActive ? 'text-gold' : 'text-foreground/80 hover:text-gold'}`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="flex flex-col gap-3 mt-4 w-64">
              <button
                id="partner-login-mobile-btn"
                onClick={() => {
                  setMobileOpen(false);
                  handlePartnerClick();
                }}
                className="border border-gold/40 text-gold hover:bg-gold/5 py-3 px-8 rounded-full font-bold uppercase tracking-wider text-xs text-center transition-all bg-transparent cursor-pointer"
              >
                Partner Login
              </button>
              <a 
                href="https://ewa.njindiaonline.com/ewa/login" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setMobileOpen(false)}
                className="border border-white/25 text-white/90 py-3 px-8 rounded-full font-bold uppercase tracking-wider text-xs text-center transition-all"
              >
                Client Login
              </a>
              <a 
                href="http://p.njw.bz/103924" 
                target="_blank" 
                onClick={() => setMobileOpen(false)}
                className="bg-gold text-bg-dark py-3 px-8 rounded-full font-bold uppercase tracking-wider text-xs text-center hover:bg-gold-light transition-all"
              >
                Start Investing
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <PartnerLoginModal 
        isOpen={partnerOpen} 
        onClose={() => setPartnerOpen(false)} 
      />
    </>
  );
};
