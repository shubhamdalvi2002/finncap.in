import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'motion/react';
import { FinauraLogo } from './FinauraLogo';
import { ActivePage } from '../App';

interface NavbarProps {
  currentPage: ActivePage;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Calculators', href: '#calculators', id: 'calculators' },
    { name: 'Tips & Sandbox', href: '#tips', id: 'tips' },
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

        <div className="flex items-center gap-4">
          <a href="http://p.njw.bz/103924" target="_blank" className="hidden sm:block border border-gold text-gold px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-bg-dark transition-all">
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
            <a href="http://p.njw.bz/103924" target="_blank" className="bg-gold text-bg-dark px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs mt-4">
              Start Investing
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
