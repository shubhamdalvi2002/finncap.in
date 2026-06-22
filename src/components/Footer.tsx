import React from 'react';
import { FinauraLogo } from './FinauraLogo';
import { Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-gold/10 bg-[rgb(var(--background))]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <FinauraLogo variant="horizontal" className="scale-95 origin-center md:origin-left" />
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#services" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider hover:text-gold transition-colors">Services</a>
            <a href="#about" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider hover:text-gold transition-colors">About</a>
            <a href="#contact" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider hover:text-gold transition-colors">Contact</a>
            <a href="http://p.njw.bz/103924" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider hover:text-gold transition-colors">Invest Now</a>
            <a href="https://ewa.njindiaonline.com/ewa/login" target="_blank" rel="noopener noreferrer" className="text-gold text-xs font-semibold uppercase tracking-wider hover:text-gold-light transition-colors">Client Login</a>
            <a href="#admin" className="text-muted-foreground/60 text-xs font-semibold uppercase tracking-wider hover:text-gold transition-colors">Admin Console</a>
          </div>
          
          {/* Social Links Row */}
          <div className="flex items-center gap-5 text-muted-foreground">
            <a href="https://www.instagram.com/finnauracapital" target="_blank" rel="noopener noreferrer" className="hover:text-gold hover:scale-110 transition-all p-1" title="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://www.facebook.com/share/18ehkCsPPh/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-gold hover:scale-110 transition-all p-1" title="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://wa.me/919423669236" target="_blank" rel="noopener noreferrer" className="hover:text-gold hover:scale-110 transition-all p-1" title="WhatsApp">
              <MessageCircle size={18} />
            </a>
            <a href="https://www.linkedin.com/in/finaura-capital-813770388/" target="_blank" rel="noopener noreferrer" className="hover:text-gold hover:scale-110 transition-all p-1" title="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="text-muted-foreground text-[0.8rem]">
            © 2026 FinAura Capital. All rights reserved.
          </div>
          <div className="text-[0.65rem] text-muted-foreground/60 uppercase tracking-widest font-medium">
            AMFI Registered Mutual Fund Distributor | ARN-35358
          </div>
        </div>
      </div>
    </footer>
  );
};
