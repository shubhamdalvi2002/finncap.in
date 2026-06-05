import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Calculator, Shield, UserCheck, ArrowRight, Star, Sparkles, AlertCircle } from 'lucide-react';

export const BentoHub: React.FC = () => {
  const cards = [
    {
      id: 'services',
      href: '#services',
      category: 'Client Portfolios',
      title: '6 Core Financial Allocation Services',
      desc: 'Explore custom equity baskets, passive ETFs, active mutual funds, and disciplined systematic execution plans tailored to your specific timeline.',
      icon: <TrendingUp className="text-gold w-6 h-6" />,
      badge: 'Active Allocation',
      badgeColor: 'bg-gold/10 text-gold border-gold/20',
      actionText: 'Explore Strategies',
      gridClass: 'md:col-span-2 lg:col-span-2',
      accentColor: 'from-gold/5 via-gold/0 to-transparent',
      highlights: ['Direct Stocks', 'Managed Wealth', 'Active SIP Engine']
    },
    {
      id: 'calculators',
      href: '#calculators',
      category: 'Interactive Tools',
      title: 'Compounding Simulators',
      desc: 'Calculate long-term Wealth growth, SIP schedules, SWP retirement payouts, and EMI breakdowns with interactive visual charts.',
      icon: <Calculator className="text-emerald-400 w-6 h-6" />,
      badge: 'Analytical Suite',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      actionText: 'Launch Simulators',
      gridClass: 'md:col-span-1 lg:col-span-1',
      accentColor: 'from-emerald-500/5 via-emerald-500/0 to-transparent',
      highlights: ['SIP & SWP Outlines', 'Retirement Goals']
    },
    {
      id: 'tips',
      href: '#tips',
      category: 'Defensive Reserves',
      title: 'The Defensive Shield & Tips Sandbox',
      desc: 'Test your financial security with our interactive 3-6-12 month occupational risk calculator and learn dynamic reallocation principles.',
      icon: <Shield className="text-rose-400 w-6 h-6" />,
      badge: 'Tactical Sandbox',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      actionText: 'Configure Shield',
      gridClass: 'md:col-span-1 lg:col-span-1',
      accentColor: 'from-rose-500/5 via-rose-500/0 to-transparent',
      highlights: ['Emergency Shield', 'Risk Volatility Advice']
    },
    {
      id: 'about',
      href: '#about',
      category: 'Credentials',
      title: 'Meet Founder Shubham Dalvi',
      desc: 'NISM Certified Series V-A Advisory partner. Backed by institutional-grade research, secure mutual fund distributions, and deep financial clarity.',
      icon: <UserCheck className="text-blue-400 w-6 h-6" />,
      badge: 'Certified Partner',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      actionText: 'View Credentials',
      gridClass: 'md:col-span-2 lg:col-span-2',
      accentColor: 'from-blue-500/5 via-blue-500/0 to-transparent',
      highlights: ['NISM Series V-A Approved', 'NJ Wealth Affiliation']
    }
  ];

  return (
    <section className="py-20 px-[6%] bg-bg-dark relative overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-gold/2 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1 text-[0.72rem] tracking-[0.15em] uppercase text-gold mb-2 font-mono">
            <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            <span>Navigation Control Panel</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white">Your Path to Managed Wealth</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Choose a dedicated section to explore in-depth interactive tools, compound configurations, and certified professional services.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`group flex flex-col justify-between bg-bg-dark-3 border border-gold/10 p-6 md:p-8 rounded-3xl hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-500 relative overflow-hidden ${card.gridClass}`}
            >
              {/* Inner Gradient Spot */}
              <div className={`absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl ${card.accentColor} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500`} />
              
              <div>
                {/* Header detail */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-muted-foreground/60">{card.category}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-2xl bg-bg-dark border border-gold/10 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-gold/30 transition-transform duration-300">
                  {card.icon}
                </div>

                {/* Title and description */}
                <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors duration-300">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{card.desc}</p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {card.highlights.map((hlt) => (
                    <span key={hlt} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] text-muted-foreground tracking-wide font-mono">
                      {hlt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action trigger button */}
              <a
                href={card.href}
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold group-hover:text-gold-light transition-colors duration-300"
              >
                <span>{card.actionText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Verification Strips */}
        <div className="mt-14 p-5 bg-bg-dark-3/30 border border-gold/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold/5 border border-gold/10 text-gold hidden sm:block shrink-0">
              <Star className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9ca3af] block mb-0.5 leading-none">Mutual Funds Distribution Affiliate</span>
              <p className="text-xs text-muted-foreground leading-normal">
                Verifiable NJ Wealth distributor franchise code: <strong className="text-white font-semibold">ARN-103924</strong>
              </p>
            </div>
          </div>
          <a
            href="http://p.njw.bz/103924"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full border border-gold bg-gold/5 text-gold text-xs font-semibold hover:bg-gold hover:text-bg-dark transition-all shrink-0"
          >
            Verify ARN Credentials
          </a>
        </div>
      </div>
    </section>
  );
};
