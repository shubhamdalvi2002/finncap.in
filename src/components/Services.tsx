import React from 'react';
import { TrendingUp, PieChart, LayoutGrid, Clock, Wallet, ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';

const SERVICES = [
  {
    name: 'Stocks',
    desc: "Smart equity investments with research-backed picks to help you participate in India's growth story.",
    icon: <TrendingUp className="text-gold" size={24} />
  },
  {
    name: 'Mutual Funds',
    desc: 'Diversified fund portfolios curated to match your risk appetite, time horizon, and return expectations.',
    icon: <PieChart className="text-gold" size={24} />
  },
  {
    name: 'ETFs',
    desc: 'Low-cost, transparent exposure to indices and sectors — ideal for passive wealth building.',
    icon: <LayoutGrid className="text-gold" size={24} />
  },
  {
    name: 'SIP',
    desc: 'Invest regularly with discipline. Let compounding do the heavy lifting over time.',
    icon: <Clock className="text-gold" size={24} />
  },
  {
    name: 'SWP',
    desc: 'Create a steady income stream from your mutual fund corpus — perfect for retirement planning.',
    icon: <Wallet className="text-gold" size={24} />
  },
  {
    name: 'STP',
    desc: 'Strategically move funds between schemes to optimise returns and manage market volatility.',
    icon: <ArrowRightLeft className="text-gold" size={24} />
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 px-6 bg-bg-dark-2 relative overflow-hidden">
      <div className="text-center mb-16 relative z-10">
        <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">What We Offer</div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Comprehensive Financial Services</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">From building a wealth corpus to generating steady income — we have a solution for every financial goal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
        {SERVICES.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-bg-dark-3 border border-gold/10 rounded-xl p-8 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/5 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-gold/5 border border-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold/10 group-hover:border-gold/40 transition-all">
              {service.icon}
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">{service.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
