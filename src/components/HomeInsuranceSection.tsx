import React from 'react';
import { motion } from 'motion/react';
import { Shield, HeartPulse, Umbrella, Car, Building2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const HomeInsuranceSection: React.FC = () => {
  const categories = [
    {
      id: 'health',
      title: 'Health & Mediclaim Insurance',
      link: '#insurance-health',
      badge: '10,000+ Cashless Hospitals',
      desc: 'Protect your family against rising medical bills with cashless hospitalization, floater plans, and tax benefits u/s 80D.',
      icon: <HeartPulse size={22} className="text-rose-400" />,
      tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'term',
      title: 'Term Life Insurance',
      link: '#insurance-term',
      badge: 'Up to ₹1Cr - ₹5Cr Cover',
      desc: 'High sum assured life protection for family breadwinners with critical illness riders and tax savings u/s 80C.',
      icon: <Umbrella size={22} className="text-gold" />,
      tagColor: 'bg-gold/10 text-gold border-gold/20'
    },
    {
      id: 'motor',
      title: 'Car & Two-Wheeler Insurance',
      link: '#insurance-car',
      badge: 'Zero Depreciation Cover',
      desc: 'Comprehensive motor insurance, instant digital policy renewal, roadside assistance, and cashless repairs.',
      icon: <Car size={22} className="text-blue-400" />,
      tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'commercial',
      title: 'Business & Commercial Risk',
      link: '#insurance',
      badge: 'Group Mediclaim & Fire Cover',
      desc: 'Protect corporate assets, employee health (GMC), shop premises, cargo transit, and business liabilities.',
      icon: <Building2 size={22} className="text-purple-400" />,
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <section id="insurance-home" className="py-20 px-[6%] bg-bg-dark border-t border-gold/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] tracking-[0.15em] uppercase text-gold mb-2 font-mono">
              <Shield className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>AeroFin Insurance Advisory</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Shield Your Health, Life & Assets
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2 leading-relaxed">
              Complete risk management provided by AeroFin Insurance — comparing top plans across HDFC ERGO, Star Health, LIC, Max Life, Tata AIG, and more.
            </p>
          </div>

          <a
            href="#insurance"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all hover:scale-105 shrink-0"
          >
            <span>Explore AeroFin Insurance</span>
            <ArrowRight size={15} />
          </a>
        </div>

        {/* Insurance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-bg-dark-3/60 border border-gold/10 p-6 rounded-3xl hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-black/40 rounded-2xl border border-gold/10">{cat.icon}</div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border ${cat.tagColor}`}>
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{cat.desc}</p>
              </div>

              <a
                href={cat.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors pt-4 border-t border-gold/10"
              >
                <span>Get Policy Quote</span>
                <ArrowRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* TRUST BANNER BAR */}
        <div className="mt-12 p-5 bg-[#090b10] border border-gold/15 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold/10 border border-gold/20 text-gold hidden sm:block shrink-0">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Dedicated Claim Assistance & Unbiased Policy Audits</div>
              <p className="text-[11px] text-stone-400">Our team manages your policy renewals, claim processing, and health card support end-to-end.</p>
            </div>
          </div>

          <a
            href="#insurance"
            className="px-5 py-2.5 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
          >
            Calculate Coverage Gap
          </a>
        </div>
      </div>
    </section>
  );
};
