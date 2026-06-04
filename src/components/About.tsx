import React from 'react';
import { motion } from 'motion/react';
import { Quote, Target, Award, Lightbulb, ShieldCheck, User, ExternalLink, Mail } from 'lucide-react';
import { FinauraLogo } from './FinauraLogo';

export const About: React.FC = () => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/5 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Founder Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28"
          >
            {/* Founder Portrait Card */}
            <div className="relative group p-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/30 via-transparent to-gold/10 rounded-[32px] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              
              <div className="relative bg-bg-dark-3/60 backdrop-blur-xl border border-gold/10 rounded-[32px] p-8 overflow-hidden shadow-2xl flex flex-col gap-6 items-center">
                {/* Image Frame - Beautiful Premium Portrait Container */}
                <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden border border-gold/25 shadow-[0_15px_30px_rgba(0,0,0,0.5)] shrink-0 group-hover:border-gold/50 transition-colors duration-500 bg-bg-dark-2">
                  {!imageError ? (
                    <img 
                      src="/api/founder-image" 
                      alt="Shubham Dalvi" 
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-bg-dark-3 via-gold/5 to-bg-dark-4 flex flex-col items-center justify-center p-4 text-center">
                      <User className="w-10 h-10 text-gold/40 mb-2 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider text-gold/60 font-bold mb-1">Founder Portrait</span>
                      <span className="text-[8px] text-muted-foreground leading-normal max-w-[140px]">
                        Ensure Drive file is shared as Public (Anyone with link)
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="text-center w-full flex flex-col items-center">
                  <h4 className="font-serif text-2xl font-bold text-white mb-1 tracking-wide">Shubham Dalvi</h4>
                  <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Founder, FinAura Capital</p>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                    Managing and simplifying wealth creation. Helping you make your financial future secure, steady, and high-yielding.
                  </p>

                  {/* Social buttons */}
                  <div className="flex gap-3 justify-center w-full">
                    <a 
                      href="https://shubhamdalviportfolio.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2.5 px-4 rounded-xl bg-gold/5 border border-gold/10 text-gold hover:bg-gold hover:text-bg-dark transition-all text-xs flex items-center gap-1.5 font-medium group"
                    >
                      <ExternalLink size={13} className="text-gold group-hover:text-inherit" />
                      <span>Portfolio</span>
                    </a>
                    <a 
                      href="mailto:shubhamdalvi7218@gmail.com" 
                      className="p-2.5 px-4 rounded-xl bg-gold/5 border border-gold/10 text-gold hover:bg-gold hover:text-bg-dark transition-all text-xs flex items-center gap-1.5 font-medium group"
                    >
                      <Mail size={13} className="text-gold group-hover:text-inherit" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Founder's Perspective Content & Beliefs */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-10"
          >
            <div>
              <div className="text-[0.72rem] tracking-[0.2em] uppercase text-gold font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-gold/50" />
                Founder's Perspective
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-[1.15] text-white">
                Making Wealth Creation <span className="text-gold italic">Simple & Accessible</span>
              </h2>
              <div className="relative mt-8">
                <Quote className="absolute -top-6 -left-8 text-gold/10 w-16 h-16 pointer-events-none" />
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6 relative z-10 italic">
                  "Building FinAura Capital isn't just about managing numbers; it's about empowering every individual with the clarity to navigate their financial future with confidence."
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                I believe that financial freedom isn't a destination, but a journey built on the foundation of smart investing and continuous awareness. Whether it's understanding mutual funds or navigating the complexities of the stock market, we simplify it all for you.
              </p>
            </div>

            {/* Mission & Goal Grid */}
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-bg-dark-2/40 backdrop-blur-sm border border-gold/10 rounded-2xl p-6 hover:border-gold/25 transition-all duration-300 group/mission shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 mb-4 group-hover/mission:scale-105 group-hover/mission:border-gold/40 transition-all duration-300">
                  <Target className="text-gold w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white mb-2">The Mission</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To democratise financial education and provide practical, transparent consulting that transforms beginners into disciplined, smart investors.
                </p>
              </div>

              <div className="bg-bg-dark-2/40 backdrop-blur-sm border border-gold/10 rounded-2xl p-6 hover:border-gold/25 transition-all duration-300 group/goal shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 mb-4 group-hover/goal:scale-105 group-hover/goal:border-gold/40 transition-all duration-300">
                  <Lightbulb className="text-gold w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white mb-2">Our Goal</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To build a digital-first platform where technology and finance meet to create long-term wealth through disciplined learning and smart research.
                </p>
              </div>
            </div>

            {/* Key Beliefs & Certifications Card */}
            <div className="relative group p-1">
              {/* Decorative border */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/40 via-gold/5 top-gold/40 rounded-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <div className="relative bg-bg-dark-3/50 backdrop-blur-xl border border-gold/10 rounded-[40px] p-6 md:p-10 overflow-hidden shadow-2xl">
                {/* Accent shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 border-b border-gold/10 pb-4">
                  <h3 className="font-serif text-2xl font-bold text-white">Key Beliefs</h3>
                  <FinauraLogo variant="icon" className="h-7 w-7 opacity-90" />
                </div>
                
                <div className="grid gap-4">
                  {[
                    { id: "01", title: "Smart Investing", desc: "Investment based on rigorous research and data, not on noise or tips." },
                    { id: "02", title: "Disciplined Learning", desc: "The best compound returns come from the knowledge and skills you accumulate over time." },
                    { id: "03", title: "Long-term Focus", desc: "Wealth is built over years, not overnight. Compounding is the ultimate driver of wealth." },
                  ].map((belief, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-bg-dark-2/30 border border-gold/5 hover:border-gold/10 transition-colors duration-300">
                      <span className="font-mono text-xs font-bold text-gold shrink-0 bg-gold/5 w-6 h-6 rounded-full flex items-center justify-center border border-gold/10">{belief.id}</span>
                      <div>
                        <h5 className="text-white font-semibold text-sm mb-1">{belief.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{belief.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subgrid for Credentials & Promise */}
                <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gold/10">
                  <div className="p-5 bg-gold/5 border border-gold/15 rounded-2xl flex flex-col justify-between hover:border-gold/25 transition-colors duration-300 min-h-[160px]">
                    <div>
                      <div className="flex items-center gap-2 text-gold mb-3">
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <span className="font-bold text-xs uppercase tracking-widest">Verified Credentials</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white font-medium">NISM Certified</span>
                        <a 
                          href="https://drive.google.com/file/d/16VAKCq27GVd9-KcBID1b8h7cPZJPV8r3/view?usp=sharing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[0.6rem] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1 group/link shrink-0"
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

                  <div className="p-5 bg-gold/5 border border-gold/15 rounded-2xl flex flex-col justify-center hover:border-gold/25 transition-colors duration-300 min-h-[160px]">
                    <div className="flex items-center gap-2 text-gold mb-3">
                      <Award className="w-5 h-5 shrink-0" />
                      <span className="font-bold text-xs uppercase tracking-widest">Our Promise</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      "Smart Investing, Disciplined Learning, and Long-Term Wealth."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left mt-2">
              <p className="text-muted-foreground text-sm font-light italic">
                Passionate about Technology, AI, and Financial Innovation.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
