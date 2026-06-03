import React from 'react';
import { motion } from 'motion/react';
import { Quote, Target, Award, Lightbulb, ShieldCheck } from 'lucide-react';
import { FinauraLogo } from './FinauraLogo';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Vision & Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            <div>
              <div className="text-[0.72rem] tracking-[0.2em] uppercase text-gold font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gold/50" />
                Founder's Perspective
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] text-white">
                Making Wealth Creation <span className="text-gold italic">Simple & Accessible</span>
              </h2>
              <div className="relative">
                <Quote className="absolute -top-6 -left-8 text-gold/10 w-16 h-16 pointer-events-none" />
                <p className="text-xl text-muted-foreground font-light leading-relaxed mb-8 relative z-10 italic">
                  "Building FinAura Capital isn't just about managing numbers; it's about empowering every individual with the clarity to navigate their financial future with confidence."
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Target className="text-gold w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white">The Mission</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To democratise financial education and provide practical, transparent consulting that transforms beginners into disciplined, smart investors.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Lightbulb className="text-gold w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white">Our Goal</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To build a digital-first platform where technology and finance meet to create long-term wealth through disciplined learning and smart research.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-muted-foreground leading-relaxed mb-8">
                I believe that financial freedom isn't a destination, but a journey built on the foundation of smart investing and continuous awareness. Whether it's understanding mutual funds or navigating the complexities of the stock market, we simplify it all for you.
              </p>
              <a 
                href="https://shubhamdalviportfolio.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-gold border-t border-gold/10 pt-8 group cursor-pointer"
              >
                <div className="p-3 rounded-full bg-gold text-bg-dark font-bold group-hover:scale-110 transition-transform text-sm">SD</div>
                <div>
                  <div className="font-serif font-bold text-lg text-white">Shubham Dalvi</div>
                  <div className="text-xs uppercase tracking-widest text-gold font-medium">Founder, FinAura Capital</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Key Beliefs/Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative group p-1">
              {/* Decorative border */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/40 via-gold/5 top-gold/40 rounded-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <div className="relative bg-bg-dark-3/50 backdrop-blur-xl border border-gold/10 rounded-[40px] p-8 md:p-12 overflow-hidden shadow-2xl">
                {/* Accent shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 border-b border-gold/10 pb-4">
                  <h3 className="font-serif text-2xl font-bold text-white">Key Beliefs</h3>
                  <FinauraLogo variant="icon" className="h-7 w-7 opacity-90" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1"><span className="text-gold font-mono text-xs">01</span></div>
                    <div>
                      <h5 className="text-white font-bold mb-1">Smart Investing</h5>
                      <p className="text-sm text-muted-foreground">Investment based on research and data, not on noise or tips.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1"><span className="text-gold font-mono text-xs">02</span></div>
                    <div>
                      <h5 className="text-white font-bold mb-1">Disciplined Learning</h5>
                      <p className="text-sm text-muted-foreground">The best returns come from the knowledge you gain over time.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1"><span className="text-gold font-mono text-xs">03</span></div>
                    <div>
                      <h5 className="text-white font-bold mb-1">Long-term Focus</h5>
                      <p className="text-sm text-muted-foreground">Wealth is built over years, not overnight. Compounding is the eighth wonder.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gold/5 border border-gold/10 rounded-2xl">
                  <div className="flex items-center gap-2 text-gold mb-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold text-xs uppercase tracking-widest">Verified Credentials</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white font-medium">NISM Certified</span>
                      <a 
                        href="https://drive.google.com/file/d/16VAKCq27GVd9-KcBID1b8h7cPZJPV8r3/view?usp=sharing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[0.6rem] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 group/link"
                      >
                        View Certificate
                        <span className="opacity-70 group-hover/link:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Authorised Mutual Fund Distributor (NISM Series V-A) providing expert advisory on diversified portfolios.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gold/5 border border-gold/10 rounded-2xl">
                  <div className="flex items-center gap-2 text-gold mb-3">
                    <Award className="w-5 h-5" />
                    <span className="font-bold text-xs uppercase tracking-widest">Our Promise</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "Smart Investing, Disciplined Learning, and Long-Term Wealth."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground text-sm font-light">
                Passionate about Technology, AI, and Financial Innovation.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
