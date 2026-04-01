import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 border-t border-gold/10 bg-[rgb(var(--background))]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="font-serif text-xl font-bold text-gold">FinAura Capital</div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#services" className="text-muted-foreground text-sm hover:text-gold transition-colors">Services</a>
          <a href="#about" className="text-muted-foreground text-sm hover:text-gold transition-colors">About</a>
          <a href="#contact" className="text-muted-foreground text-sm hover:text-gold transition-colors">Contact</a>
          <a href="http://p.njw.bz/103924" target="_blank" className="text-muted-foreground text-sm hover:text-gold transition-colors">Invest Now</a>
          <a href="https://www.instagram.com/finnauracapital" target="_blank" className="text-muted-foreground text-sm hover:text-gold transition-colors">Instagram</a>
        </div>

        <div className="text-muted-foreground text-[0.8rem]">
          © {new Date().getFullYear()} FinAura Capital. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
