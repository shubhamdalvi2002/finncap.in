import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Tips', href: '#blog' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-[6%] transition-all duration-300 backdrop-blur-lg border-b border-gold/10 ${scrolled ? 'py-3 bg-[rgb(var(--background))]/90' : 'py-5 bg-[rgb(var(--background))]/80'}`}>
        <a href="#" className="font-serif text-xl md:text-2xl font-bold text-gold tracking-tight">
          FinAura <span className="text-[rgb(var(--foreground))]">Capital</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.name}>
              <a href={link.href} className="text-sm font-medium text-muted-foreground hover:text-gold transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-11 h-6 rounded-full bg-bg-dark-3 border border-gold/20 relative transition-colors hover:border-gold/40"
          >
            <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-gold transition-transform duration-300 flex items-center justify-center ${theme === 'light' ? 'translate-x-5.5' : 'translate-x-0.5'}`}>
              {theme === 'light' ? <Sun size={10} className="text-bg-dark" /> : <Moon size={10} className="text-bg-dark" />}
            </div>
          </button>
          
          <a href="http://p.njw.bz/103924" target="_blank" className="hidden sm:block border border-gold text-gold px-6 py-2 rounded-full text-sm font-medium hover:bg-gold hover:text-bg-dark transition-all">
            Start Investing
          </a>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gold p-1">
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
            className="fixed inset-0 top-[60px] z-[190] bg-[rgb(var(--background))]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-serif text-3xl font-bold hover:text-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a href="http://p.njw.bz/103924" target="_blank" className="bg-gold text-bg-dark px-8 py-3 rounded-full font-bold">
              Start Investing
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
