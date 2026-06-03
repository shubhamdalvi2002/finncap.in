import React from 'react';
import { FinauraLogo } from './FinauraLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 border-t border-gold/10 bg-[rgb(var(--background))]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <FinauraLogo variant="horizontal" className="scale-95 origin-center md:origin-left" />
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#services" className="text-muted-foreground text-sm hover:text-gold transition-colors">Services</a>
          <a href="#about" className="text-muted-foreground text-sm hover:text-gold transition-colors">About</a>
          <a href="#contact" className="text-muted-foreground text-sm hover:text-gold transition-colors">Contact</a>
          <a href="http://p.njw.bz/103924" target="_blank" className="text-muted-foreground text-sm hover:text-gold transition-colors">Invest Now</a>
          <a href="https://www.instagram.com/finnauracapital" target="_blank" className="text-muted-foreground text-sm hover:text-gold transition-colors">Instagram</a>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="text-muted-foreground text-[0.8rem]">
            © {new Date().getFullYear()} FinAura Capital. All rights reserved.
          </div>
          <div className="text-[0.65rem] text-muted-foreground/60 uppercase tracking-widest font-medium">
            NISM Certified Mutual Fund Distributor
          </div>
        </div>
      </div>
    </footer>
  );
};
