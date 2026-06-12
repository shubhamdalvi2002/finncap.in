import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, TrendingUp, PieChart, LayoutGrid, Wallet, Check, AlertTriangle, 
  HelpCircle, BookOpen, Info, ArrowUpRight, Percent, Award, ShieldAlert, 
  Sparkles, CheckCircle2, Scale, ArrowRight
} from 'lucide-react';

export type ConceptType = 'sip' | 'mf' | 'etf' | 'swp' | 'comparisons' | 'tips';

interface ConceptExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConcept: ConceptType;
}

export const ConceptExplainerModal: React.FC<ConceptExplainerModalProps> = ({ 
  isOpen, 
  onClose, 
  initialConcept 
}) => {
  const [activeTab, setActiveTab] = useState<ConceptType>(initialConcept);
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({});

  // Sync state if initialConcept changes while open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialConcept);
    }
  }, [initialConcept, isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const toggleFaq = (id: string) => {
    setFaqOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs: { id: ConceptType; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'sip', label: 'SIP Guide', desc: 'Systematic Investment Plan', icon: <TrendingUp size={14} /> },
    { id: 'mf', label: 'Mutual Funds', desc: 'Diversified pooled assets', icon: <PieChart size={14} /> },
    { id: 'etf', label: 'ETFs Guide', desc: 'Live exchange traded baskets', icon: <LayoutGrid size={14} /> },
    { id: 'swp', label: 'SWP Income', desc: 'Systematic Withdrawal Plan', icon: <Wallet size={14} /> },
    { id: 'comparisons', label: 'Comparisons', desc: 'Side-by-side matrices', icon: <Scale size={14} /> },
    { id: 'tips', label: 'Beginner Tips', desc: 'Essential starting lessons', icon: <Award size={14} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#040710]/95 backdrop-blur-md cursor-pointer"
            id="modal-backdrop"
          />

          {/* Modal Content Board */}
          <motion.div
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
            className="relative w-full max-w-5xl h-[90vh] md:h-[82vh] flex flex-col bg-[#070b13] border border-gold/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(201,168,76,0.12)] z-10 text-white"
            id="concept-explainer-card"
          >
            {/* Header Area */}
            <div className="flex border-b border-white/5 px-6 py-4.5 items-center justify-between bg-gradient-to-r from-[#0e1424] via-[#070b13] to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/25 rounded-full shadow-[0_2px_10px_rgba(201,168,76,0.05)]">
                  <BookOpen size={13} className="text-gold" />
                  <span className="text-[10px] tracking-[0.16em] uppercase text-gold font-bold font-mono">FinAura Learning Desk</span>
                </div>
                <div className="hidden sm:inline-block h-4 w-px bg-white/10" />
                <span className="hidden sm:inline-block text-[11px] text-muted-foreground font-mono">NISM Registered Advisory Education Portal</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 mr-1 rounded-full text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Close modal"
                id="close-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Container Split layout for large sizes */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              
              {/* MOBILE HORIZONTAL TABS (Hidden on md+) */}
              <div className="flex md:hidden border-b border-white/5 bg-[#0a0e17] overflow-x-auto select-none no-scrollbar shrink-0">
                <div className="flex p-2.5 gap-1.5 min-w-max">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-gold text-[#070b12] shadow-[0_4px_12px_rgba(201,168,76,0.25)]' 
                            : 'text-muted-foreground hover:text-white hover:bg-white/5'
                        }`}
                        id={`tab-btn-mobile-${tab.id}`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DESKTOP SIDEBAR Vertical tabs (Hidden on mobile) */}
              <div className="hidden md:flex flex-col w-[240px] bg-[#090d16]/90 border-r border-white/5 p-4.5 shrink-0 justify-between select-none">
                <div className="space-y-4">
                  <div className="px-2 py-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase font-mono mb-1">Learning Modules</h3>
                    <p className="text-[11px] text-white/50">Select a course module below</p>
                  </div>
                  
                  <div className="space-y-1">
                    {tabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer group ${
                            isActive 
                              ? 'bg-gradient-to-r from-gold/15 to-gold/5 border border-gold/30 text-white shadow-[0_4px_15px_rgba(201,168,76,0.06)]' 
                              : 'border border-transparent text-muted-foreground hover:text-white hover:bg-white/5'
                          }`}
                          id={`tab-btn-desktop-${tab.id}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`p-1.5 rounded-lg transition-colors ${
                              isActive ? 'bg-gold/20 text-gold' : 'bg-white/5 text-muted-foreground group-hover:text-white group-hover:bg-white/10'
                            }`}>
                              {tab.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold uppercase tracking-wider">{tab.label}</span>
                              <span className="text-[8px] text-muted-foreground font-mono leading-none mt-0.5 group-hover:text-white/40 transition-colors uppercase">{tab.id} Matrix</span>
                            </div>
                          </div>
                          
                          {/* Indicator light */}
                          <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                            isActive ? 'bg-gold scale-100 shadow-[0_0_8px_#c9a84c]' : 'bg-transparent scale-0 group-hover:scale-100 group-hover:bg-white/20'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Distributor Endorsement Card */}
                <div className="bg-gold/5 border border-gold/15 p-3.5 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-gold font-mono text-[9px] font-bold uppercase tracking-wider">
                    <Award size={12} className="shrink-0" />
                    <span>Education Partner</span>
                  </div>
                  <p className="text-[11px] font-serif font-bold text-white leading-snug">
                    Shubham Dalvi
                  </p>
                  <p className="text-[9px] text-muted-foreground leading-snug font-medium">
                    NISM-Certified Mutual Fund Advisor (ARN-193423)
                  </p>
                </div>
              </div>

              {/* Scrollable Content Body (Right pane) */}
              <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-8 min-h-0 bg-[#070b13] no-scrollbar">
                
                {/* 1. SIP MODULE */}
                {activeTab === 'sip' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Visual Title Header */}
                    <div className="pb-4 border-b border-gold/15">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><TrendingUp size={16} /></div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">SIP – Systematic Investment Plan</h2>
                      </div>
                      <p className="text-[11px] text-gold/80 font-medium font-mono tracking-wider uppercase mt-1">Smart Investing • Brighter Future through regular consistent compounding.</p>
                    </div>

                    {/* Core Description Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">What is a Systematic Investment Plan?</h3>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          Rather than attempting to save and invest a massive lump sum all at once, an <strong>SIP (Systematic Investment Plan)</strong> is a smart mechanism that automates small, disciplined, regular contributions (monthly, weekly, or quarterly) directly into chosen mutual funds.
                        </p>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          SIP is not an independent asset; it is a defensive, highly robust investment <strong>strategy value-multiplier</strong> designed to shield everyday investors from stock market volatility.
                        </p>
                      </div>

                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">How Does It Work?</h3>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          Once configured, capital is auto-debited on a fixed calendar date. This automatic habit purchases mutual fund fractions called **Units** at the prevailing daily **NAV** (Net Asset Value).
                        </p>
                        <ul className="text-[11.5px] text-muted-foreground space-y-2 pt-1 font-medium">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold font-mono mt-0.5">•</span> 
                            <span>When markets dip, NAV is lower—your fixed amount automatically buys <strong>more units</strong>.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gold font-bold font-mono mt-0.5">•</span> 
                            <span>When markets rise, NAV is higher—your fixed amount purchases <strong>fewer units</strong>.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Two Key Compound Mechanics */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[#0b0e17] p-4.5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-lg rounded-full" />
                        <div className="flex items-center gap-1.5 mb-2">
                          <Percent size={13} className="text-emerald-400" />
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">Rupee Cost Averaging</h4>
                        </div>
                        <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                          By spreading your acquisitions across market cycles, your average purchase cost naturally gets scaled down. You completely bypass the high-stakes game of timing the stock market.
                        </p>
                      </div>
                      <div className="bg-[#0b0e17] p-4.5 rounded-xl border border-white/5 relative overflow-hidden group hover:border-gold/20 transition-all">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 blur-lg rounded-full" />
                        <div className="flex items-center gap-1.5 mb-2">
                          <Sparkles size={13} className="text-gold" />
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">The Power of Compounding</h4>
                        </div>
                        <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                          Returns carry dynamic momentum. Earnings in months 1-12 are fully reinvested into acquisition pools, generating additional returns over future years in an exponential wealth curve.
                        </p>
                      </div>
                    </div>

                    {/* Beautiful Case Study Bento Panel */}
                    <div className="p-4.5 bg-gradient-to-r from-[#0d1424] to-[#070b13] border border-gold/15 rounded-2xl space-y-3.5 shadow-inner">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest font-mono">Simulated SIP Projections (₹5,000 / month @ 13% CAGR)</h4>
                        <span className="text-[8.5px] text-muted-foreground font-mono">Projected values rounded for illustration</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 pt-1 text-center font-mono">
                        <div className="p-3 bg-gradient-to-b from-[#0e1424] to-[#0a0e1a] rounded-xl border border-white/5 hover:border-gold/20 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                          <span className="text-[9px] text-muted-foreground uppercase block mb-1 tracking-wider font-semibold">5 Years</span>
                          <div className="text-[10px] text-white/50 mb-0.5">Principal: ₹3 L</div>
                          <div className="text-gold text-sm font-extrabold">₹4.27 L</div>
                          <div className="mt-1.5 text-[8.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block font-sans font-bold">1.4x Growth</div>
                        </div>
                        
                        <div className="p-3 bg-[#0a0e16] rounded-xl border border-gold/20 shadow-[0_4px_22px_rgba(201,168,76,0.06)] scale-[1.03] relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-gold/15 text-gold text-[7px] font-bold font-mono px-1.5 py-0.5 rounded-bl uppercase tracking-wider">Compound Lift</div>
                          <span className="text-[9px] text-gold uppercase block mb-1 tracking-wider font-bold">10 Years</span>
                          <div className="text-[10px] text-white/50 mb-0.5">Principal: ₹6 L</div>
                          <div className="text-gold text-sm font-extrabold">₹12.18 L</div>
                          <div className="mt-1.5 text-[8.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block font-sans font-bold">2.0x Growth</div>
                        </div>
                        
                        <div className="p-3 bg-gradient-to-b from-[#0e1424] to-[#0a0e1a] rounded-xl border border-white/5 hover:border-gold/20 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                          <span className="text-[9px] text-muted-foreground uppercase block mb-1 tracking-wider font-semibold">15 Years</span>
                          <div className="text-[10px] text-white/50 mb-0.5">Principal: ₹9 L</div>
                          <div className="text-gold text-sm font-extrabold">₹27.45 L</div>
                          <div className="mt-1.5 text-[8.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block font-sans font-bold">3.0x Growth</div>
                        </div>
                      </div>
                      
                      <p className="text-[9.5px] text-muted-foreground italic leading-relaxed pt-1 select-none">
                        *Tenure expansion from 10 to 15 years doubles your principal outlay but more than <strong>doubles</strong> your accumulated returns. This represents the long-term compound multiplier.
                      </p>
                    </div>

                    {/* Structured Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-emerald-400 mb-2.5 flex items-center gap-1.5 font-mono"><Check size={13} /> Key Utility Benefits</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-2">
                          <li className="flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-400 font-bold">✓</span> 
                            <span><strong>Flexible Thresholds</strong> - Initiate goals with as low as ₹500/month. Pause or cancel instantly.</span>
                          </li>
                          <li className="flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-400 font-bold">✓</span> 
                            <span><strong>Mitigate Emotion</strong> - Auto-debits eliminate the fear of speculative entries.</span>
                          </li>
                          <li className="flex items-start gap-1.5 leading-snug">
                            <span className="text-emerald-400 font-bold">✓</span> 
                            <span><strong>Habit Engineering</strong> - Enforces a disciplined "invest first, spend remainder" habit automatically.</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-xl border border-red-500/15 bg-red-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-red-400 mb-2.5 flex items-center gap-1.5 font-mono"><ShieldAlert size={13} /> Relevant Risk Deciders</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-2">
                          <li className="flex items-start gap-1.5 leading-snug">
                            <span className="text-red-400 font-bold">✗</span> 
                            <span><strong>Market Performance Linked</strong> - Portfolio returns fluctuate based on market movements.</span>
                          </li>
                          <li className="flex items-start gap-1.5 leading-snug">
                            <span className="text-red-400 font-bold">✗</span> 
                            <span><strong>No Nominal Guarantees</strong> - Unlike bank Fixed Deposits, mutual funds carry equity risks.</span>
                          </li>
                          <li className="flex items-start gap-1.5 leading-snug">
                            <span className="text-red-400 font-bold">✗</span> 
                            <span><strong>Patience Pre-requisite</strong> - Standard horizons under 36 months are vulnerable to short-term cyclical dips.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Interactive Collapsible FAQ with Rotations */}
                    <div className="bg-[#0b0e16] p-4.5 rounded-2xl border border-white/5 space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
                        <HelpCircle size={14} className="text-gold" /> 
                        <span>Frequently Asked Questions</span>
                      </h4>
                      
                      <div className="space-y-2.5">
                        <div 
                          className="bg-[#0d1424]/50 border border-white/5 p-3 rounded-xl cursor-pointer hover:border-gold/20 transition-all select-none" 
                          onClick={() => toggleFaq('sip_q1')}
                        >
                          <div className="flex justify-between items-center text-[11px] font-bold text-white leading-normal">
                            <span>Q1. Will I incur regulatory fines if my linked account is insufficiently funded?</span>
                            <motion.span 
                              animate={{ rotate: faqOpen['sip_q1'] ? 180 : 0 }}
                              className="text-gold cursor-pointer"
                            >
                              ▼
                            </motion.span>
                          </div>
                          <AnimatePresence>
                            {faqOpen['sip_q1'] && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[10.5px] text-muted-foreground mt-2 leading-relaxed">
                                  Mutual fund houses will not charge penalties for missed contributions. Your system simply waits for the next cycle. However, some linked commercial banks might charge bounce fees. Ensure accounts are funded prior to your scheduled dates.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div 
                          className="bg-[#0d1424]/50 border border-white/5 p-3 rounded-xl cursor-pointer hover:border-gold/20 transition-all select-none" 
                          onClick={() => toggleFaq('sip_q2')}
                        >
                          <div className="flex justify-between items-center text-[11px] font-bold text-white leading-normal">
                            <span>Q2. What are the lock-in timelines on normal mutual funds under SIP?</span>
                            <motion.span 
                              animate={{ rotate: faqOpen['sip_q2'] ? 180 : 0 }}
                              className="text-gold cursor-pointer"
                            >
                              ▼
                            </motion.span>
                          </div>
                          <AnimatePresence>
                            {faqOpen['sip_q2'] && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[10.5px] text-muted-foreground mt-2 leading-relaxed">
                                  Standard open-ended mutual funds carry absolutely no structural lock-in—you can withdraw capital anytime. Only ELSS (Equity Linked Savings Schemes) carry an obligatory, tax-saving 3-year lock-in period.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MUTUAL FUNDS MODULE */}
                {activeTab === 'mf' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header */}
                    <div className="pb-4 border-b border-gold/15">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><PieChart size={16} /></div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">Mutual Funds Core Matrix</h2>
                      </div>
                      <p className="text-[11px] text-gold/80 font-medium font-mono tracking-wider uppercase mt-1">Smart Investing • Brighter Future through professional asset allocation and diversification.</p>
                    </div>

                    {/* Explanation Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">What is a Mutual Fund?</h3>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          Imagine wanting to buy slices of 50 different large-cap companies like Reliance, TCS, or HDFC, but only starting with ₹1,000. Under normal stocks, that's impossible. A <strong>Mutual Fund</strong> solves this by pooling together savings from thousands of retail investors and investing it collectively.
                        </p>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          This massive pooled capital is strategically allocated into a highly diversified mix of equity, corporate bonds, or government security reserves according to specific fund targets.
                        </p>
                      </div>

                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5 font-medium">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">The Strategic Pillars</h3>
                        <ul className="text-[11.5px] text-muted-foreground space-y-3 pl-1">
                          <li>
                            <strong className="text-white block mb-0.5 uppercase tracking-wide text-[10.5px]">NISM-Certified Oversight</strong>
                            Experienced, SEBI-vetted fund managers study market indices and dynamically allocate constituent holdings to limit downside risks.
                          </li>
                          <li>
                            <strong className="text-white block mb-0.5 uppercase tracking-wide text-[10.5px]">Net Asset Value (NAV) Demystified</strong>
                            Think of NAV as the "share price" of a mutual fund scheme. It represents the actual market value of one fund unit at the closing of each trading evening. It is calculated by dividing the total net assets of a fund by its total active distributed units.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Essential Types Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono border-l-2 border-gold pl-2 mb-3">Essential Classes of Mutual Funds</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 hover:border-gold/20 transition-all duration-300 group">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-white font-bold text-[11.5px] uppercase tracking-wider group-hover:text-gold transition-colors">Equity Funds</span>
                          </div>
                          <p className="text-[10.5px] text-muted-foreground leading-relaxed">Invests 65%+ in active shares. Built for aggressive CAGR asset accumulation, high growth, and beating inflation over standard 5+ year terms.</p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 hover:border-gold/20 transition-all duration-300 group">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            <span className="text-white font-bold text-[11.5px] uppercase tracking-wider group-hover:text-gold transition-colors">Debt Funds</span>
                          </div>
                          <p className="text-[10.5px] text-muted-foreground leading-relaxed">Capital is allocated to secure government and corporate bonds. Built for low-to-moderate risk steady yield reserves or emergency shields.</p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 hover:border-gold/20 transition-all duration-300 group">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            <span className="text-white font-bold text-[11.5px] uppercase tracking-wider group-hover:text-gold transition-colors">Hybrid Funds</span>
                          </div>
                          <p className="text-[10.5px] text-muted-foreground leading-relaxed">Features a balanced, dynamic blend of both equity and debt. Automatically buffers stock volatility while keeping equity compounding active.</p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-[#0b0e16] border border-white/5 hover:border-gold/20 transition-all duration-300 group">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                            <span className="text-white font-bold text-[11.5px] uppercase tracking-wider group-hover:text-gold transition-colors">Passive Index Funds</span>
                          </div>
                          <p className="text-[10.5px] text-muted-foreground leading-relaxed">Directly clones top national market baskets like Nifty 50. Incredibly low cost fees since there’s zero speculative stock-picking.</p>
                        </div>
                      </div>
                    </div>

                    {/* Practical Numerical Case Study */}
                    <div className="p-4 bg-gradient-to-r from-[#0d1424] to-[#070b13] border border-white/10 rounded-xl space-y-1.5 shadow-inner select-none font-mono">
                      <div className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={11} />
                        <span>Pool-Allocation Case Study</span>
                      </div>
                      <p className="text-[11px] text-white/95 leading-relaxed">
                        If a specific scheme has a Net Asset Value (NAV) of <strong>₹100</strong>, and you invest a lump-sum of <strong>₹10,000</strong>, you are allocated exactly <strong>100 active Units</strong> in the pool.
                      </p>
                      <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                        If the underlying stock basket grows <strong>15%</strong> over your tenure, the NAV rises to <strong>₹115</strong>. Your 100 units are now valued at <strong>₹11,500</strong>, capturing clean passive growth on complete autopilot.
                      </p>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-emerald-400 mb-2 flex items-center gap-1"><Check size={12} /> Key Advantages</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Instant Diversification</strong> - Buy into 30 to 100 blue-chip companies with one click.</span></li>
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Regulatory Armor</strong> - Safe and clean, fully audited under SEBI and AMFI frameworks.</span></li>
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Professional Supervision</strong> - Advanced researchers run your optimization charts daily.</span></li>
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-xl border border-red-500/15 bg-red-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-red-400 mb-2 flex items-center gap-1"><ShieldAlert size={12} /> Expense & Volatility Disclaimers</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Expense Ratios</strong> - Asset management teams charge administrative fees (0.5% - 2.25%).</span></li>
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Exit Load Timelines</strong> - Withdrawing within 365 days of entry triggers fine percentages (around 1.0%).</span></li>
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Capital Gains Taxes</strong> - Redeeming gains triggers standard short/long-term tax slabs on withdrawal dates.</span></li>
                        </ul>
                      </div>
                    </div>

                    {/* FAQ Collapsible */}
                    <div className="bg-[#0b0e16] p-4.5 rounded-2xl border border-white/5 space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
                        <HelpCircle size={14} className="text-gold" /> 
                        <span>Frequently Asked Questions</span>
                      </h4>
                      
                      <div className="space-y-2.5">
                        <div 
                          className="bg-[#0d1424]/50 border border-white/5 p-3 rounded-xl cursor-pointer hover:border-gold/20 transition-all select-none" 
                          onClick={() => toggleFaq('mf_q1')}
                        >
                          <div className="flex justify-between items-center text-[11px] font-bold text-white leading-normal">
                            <span>Q1. What is the difference between Direct and Regular investment plans?</span>
                            <motion.span 
                              animate={{ rotate: faqOpen['mf_q1'] ? 180 : 0 }}
                              className="text-gold cursor-pointer"
                            >
                              ▼
                            </motion.span>
                          </div>
                          <AnimatePresence>
                            {faqOpen['mf_q1'] && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[10.5px] text-muted-foreground mt-2 leading-relaxed">
                                  Direct plans feature marginally lower administrative expenses since they eliminate brokerage commissions. Regular plans are formatted through licensed, professional distributors (like Shubham Dalvi) who verify full documentation layouts, assist in continuous tracking mechanics, handles standard annual harvesting, and structures your asset allocation securely.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. ETF MODULE */}
                {activeTab === 'etf' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header */}
                    <div className="pb-4 border-b border-gold/15">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><LayoutGrid size={16} /></div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">ETFs – Exchange Traded Funds</h2>
                      </div>
                      <p className="text-[11px] text-gold/80 font-medium font-mono tracking-wider uppercase mt-1">Smart Investing • Brighter Future through transparent live tracking indexes.</p>
                    </div>

                    {/* Explanation Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">What is an ETF?</h3>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          An <strong>Exchange Traded Fund (ETF)</strong> is a unique financial instrument that behaves like a hybrid between a mutual fund and a single stock. Like mutual funds, an ETF pools client funds to purchase a diversified basket of securities (for example, replicating the top 50 national companies).
                        </p>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          However, unlike traditional mutual funds that only purchase or settle at closing daily NAV prices, ETFs are listed directly on stock exchanges. This means they are traded <strong>live</strong>, with prices moving by the second during trading hours!
                        </p>
                      </div>

                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5 font-medium">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">Live Liquidity & Execution</h3>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          Because ETFs trade on active exchanges (like NSE or BSE), purchasing them requires a standard registered <strong>Demat & Trading Account</strong>. 
                        </p>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          This grants instant, intraday transparency. You can set stop-losses, buy on sudden 10-minute dips, or scale out exactly as you would with individual stocks during active market hours.
                        </p>
                      </div>
                    </div>

                    {/* Contrast block */}
                    <div className="bg-gradient-to-r from-[#0d1424] to-[#0a0f18] p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-xl group-hover:bg-gold/10 transition-all rounded-full" />
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-gold/15 text-gold"><Info size={14} /></div>
                        <h4 className="text-[11.5px] font-bold uppercase tracking-wider text-white">ETF vs Traditional Mutual Fund: Key Structural Deciders</h4>
                      </div>
                      
                      <div className="grid sm:grid-cols-3 gap-4.5 pt-1">
                        <div className="space-y-1 bg-[#060a12] p-3 rounded-xl border border-white/5 select-none hover:border-gold/10 transition-colors">
                          <span className="text-[9px] text-gold uppercase tracking-widest font-mono block">LIVE SETTLEMENT</span>
                          <strong className="text-[11px] text-white block font-serif">Intraday Trading</strong>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">ETFs are bought/sold live like Stocks; MFs settle at single end-of-day NAV prices.</p>
                        </div>
                        <div className="space-y-1 bg-[#060a12] p-3 rounded-xl border border-white/5 select-none hover:border-gold/10 transition-colors">
                          <span className="text-[9px] text-gold uppercase tracking-widest font-mono block">MANAGEMENT FEES</span>
                          <strong className="text-[11px] text-white block font-serif">Bare Minimum Costs</strong>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">ETFs are passive indexes (0.05% - 0.3% expense); MFs are active (0.5% - 2.25%).</p>
                        </div>
                        <div className="space-y-1 bg-[#060a12] p-3 rounded-xl border border-white/5 select-none hover:border-gold/10 transition-colors">
                          <span className="text-[9px] text-gold uppercase tracking-widest font-mono block">SETUP CONSTRAINTS</span>
                          <strong className="text-[11px] text-white block font-serif">Brokerage Demat</strong>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">ETFs strictly require an active broker demat account; MFs directly auto-debit bank logs.</p>
                        </div>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-emerald-400 mb-2 flex items-center gap-1"><Check size={12} /> Key Advantages</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Rock-Bottom Expense</strong> - Incredibly low administrative fees make holding ETFs very cheap.</span></li>
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Instant Trades</strong> - Execute buy/sell transacting instantly inside active hours.</span></li>
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Holding Clarity</strong> - Daily publications show exactly where capital is allocated.</span></li>
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-xl border border-red-500/15 bg-red-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-red-400 mb-2 flex items-center gap-1"><ShieldAlert size={12} /> Disadvantages & Risks</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Volume Liquidity Risk</strong> - Low unit-volume ETFs might experience pricing bid-ask gaps when trying to sell.</span></li>
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Minor Tracking Errors</strong> - Standard deviation spreads can arise between ETF and physical tracker baskets.</span></li>
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Forces Demat Setup</strong> - Trades require holding a regular brokerage demat account.</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SWP MODULE */}
                {activeTab === 'swp' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header */}
                    <div className="pb-4 border-b border-gold/15">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><Wallet size={16} /></div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">SWP – Systematic Withdrawal Plan</h2>
                      </div>
                      <p className="text-[11px] text-gold/80 font-medium font-mono tracking-wider uppercase mt-1">Smart Investing • Brighter Future through highly secure, tax-efficient passive incomes.</p>
                    </div>

                    {/* Explanation Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">What is an SWP?</h3>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          While SIP is engineered to <strong>accumulate</strong> wealth systematically over long durations, a <strong>Systematic Withdrawal Plan (SWP)</strong> is designed to do the exact opposite. It is a highly optimized mechanism that lets you periodically redeem and withdraw a fixed sum of money from your accumulated mutual fund pool.
                        </p>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          Think of SWP as generating your own customized "monthly salary." Your capital remains invested in the market, continuing to grow, while a portion is sold to fund your lifestyle.
                        </p>
                      </div>

                      <div className="space-y-3 bg-[#0d1424]/40 p-4 rounded-xl border border-white/5 font-medium">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">Steady Regular Income Paychecks</h3>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          Instead of locking up principal forever inside structural annuities (where interest income is fully taxable on standard margins), SWP remains beautifully flexible and highly tax-friendly.
                        </p>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                          The scheme automatically liquidates the precise unit configuration needed to honor your specified monthly payload, transferring capital directly to your primary bank records.
                        </p>
                      </div>
                    </div>

                    {/* Tax Efficiency highlight panel */}
                    <div className="p-4 bg-[#0a0e16] border-l-4 border-gold rounded-r-xl space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-2xl rounded-full" />
                      <h4 className="text-[10.5px] font-bold text-gold uppercase tracking-wider font-mono">Tax-Efficiency Demystified</h4>
                      <p className="text-[11px] text-white/95 leading-relaxed">
                        Standard Fixed Deposit interest gets fully added to your annual taxation bracket, meaning you can lose up to <strong>30%</strong> of cash value depending on your income.
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        SWP withdrawals are governed under **Capital Gains** rules. Only the actual **net capital profit slice** of your withdrawn cash is taxed, not your principal! With equity capital gains remaining fully tax-exempt up to ₹1.25 Lakh per financial year, your post-tax yields are exceptionally higher!
                      </p>
                    </div>

                    {/* Retiree Case Study Bento Panel */}
                    <div className="p-4.5 bg-gradient-to-r from-[#0d1424] to-[#070b13] border border-white/10 rounded-2xl space-y-3">
                      <span className="text-[9.5px] text-gold uppercase font-mono block font-bold tracking-widest">Retirement Portfolio Simulation</span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Consider a retiree who places a capital pool of <strong>₹50,00,000</strong> (50 Lakhs) into an optimized conservative hybrid fund earning an average defensive <strong>9% CAGR</strong>. They schedule a stable monthly paycheck of <strong>₹30,000</strong>:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center pt-2">
                        <div className="p-3 bg-[#060a12] rounded-xl border border-white/5">
                          <span className="text-[9px] text-muted-foreground block uppercase mb-1">RETIREMENT CAPITAL</span>
                          <strong className="text-white text-sm block">₹50,00,000</strong>
                          <span className="text-[8px] text-muted-foreground">Original principal seed</span>
                        </div>
                        <div className="p-3 bg-[#060a12] rounded-xl border border-emerald-500/10">
                          <span className="text-[9px] text-emerald-400 block uppercase mb-1 font-bold">ANNUAL WITHDRAWAL</span>
                          <strong className="text-emerald-400 text-sm block">₹3,60,000</strong>
                          <span className="text-[8px] text-muted-foreground">₹30,000 / month payload</span>
                        </div>
                        <div className="p-3 bg-[#060a12] rounded-xl border border-gold/15">
                          <span className="text-[9px] text-gold block uppercase mb-1 font-bold">CORPUS YEAR-END</span>
                          <strong className="text-gold text-sm block">~₹50,90,000+</strong>
                          <span className="text-[8px] text-emerald-400 font-semibold uppercase leading-tight block">Principal Grown!</span>
                        </div>
                      </div>
                      <p className="text-[9.5px] text-muted-foreground italic leading-relaxed pt-1 select-none">
                        *Because your moderate growth rate of 9% exceeded your annual draw-down rate (7.2% of the initial capital), you generated regular income payments while your core principal grew, preventing capital erosion.
                      </p>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-emerald-400 mb-2 flex items-center gap-1"><Check size={12} /> Key Benefits</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Tax-Harvesting Masterclass</strong> - Exceptional post-tax payouts over classic fixed income models.</span></li>
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Dynamic Reserves</strong> - Non-withdrawn capital stays invested to continuously compound.</span></li>
                          <li className="flex items-start gap-1"><span className="text-emerald-400 mr-1 font-bold">✓</span> <span><strong>Pillars of control</strong> - Adjust, increase, or terminate withdrawal schemes whenever goals shift.</span></li>
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-xl border border-red-500/15 bg-red-950/20">
                        <h4 className="text-[11px] uppercase font-bold text-red-400 mb-2 flex items-center gap-1"><ShieldAlert size={12} /> Tail Risk Warnings</h4>
                        <ul className="text-[11px] text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Inherent Inflation Risk</strong> - Static payouts lose real purchase value over 15+ years.</span></li>
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Excess Drawdown Risk</strong> - Setting withdrawals too high can exhaust your seed capital.</span></li>
                          <li className="flex items-start gap-1"><span className="text-red-400 mr-1 font-bold">✗</span> <span><strong>Sequence Risk</strong> - Extreme market drawdowns early on can impact portfolio recovery.</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. COMPARISONS MODULE */}
                {activeTab === 'comparisons' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header */}
                    <div className="pb-4 border-b border-gold/15">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400"><Scale size={16} /></div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">Comparative Performance Analytics</h2>
                      </div>
                      <p className="text-[11px] text-gold/80 font-medium font-mono tracking-wider uppercase mt-1">Evaluate structural metrics across different investment strategies side-by-side.</p>
                    </div>

                    {/* Table 1: SIP vs Lump Sum */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#93c5fd] font-mono border-l-2 border-blue-400 pl-2">SIP vs Lump Sum</h3>
                      <div className="overflow-hidden rounded-xl border border-white/5 bg-[#090d16]">
                        <table className="w-full text-[10.5px] text-left text-muted-foreground">
                          <thead className="text-[9px] uppercase font-mono tracking-wider text-white/50 bg-[#0d1424]">
                            <tr>
                              <th className="p-3">Feature Metric</th>
                              <th className="p-3 text-gold">SIP (Systematic Plan)</th>
                              <th className="p-3 text-white">Lump Sum (One-time)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 leading-normal">
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Investment Pattern</td>
                              <td className="p-3">Regular predefined contributions (e.g., ₹5,000 monthly)</td>
                              <td className="p-3 text-white/80">Bulk one-time investment (e.g., ₹5,00,000)</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Market Timing Necessity</td>
                              <td className="p-3 text-emerald-400 font-semibold bg-emerald-500/5">None. Rupee Cost Averaging leverages drops.</td>
                              <td className="p-3">Very High. Poor timing can significantly impact long-term yields.</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Risk Exposure</td>
                              <td className="p-3">Low short-term volatility impact. Smooths entries.</td>
                              <td className="p-3">Mitigated over longer horizons, but vulnerable to early cyclical corrections.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Table 2: ETF vs Mutual Fund */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#c084fc] font-mono border-l-2 border-purple-400 pl-2">ETF vs Mutual Fund</h3>
                      <div className="overflow-hidden rounded-xl border border-white/5 bg-[#090d16]">
                        <table className="w-full text-[10.5px] text-left text-muted-foreground">
                          <thead className="text-[9px] uppercase font-mono tracking-wider text-white/50 bg-[#0d1424]">
                            <tr>
                              <th className="p-3">Feature Metric</th>
                              <th className="p-3 text-gold">Exchange Traded Fund (ETF)</th>
                              <th className="p-3 text-white">Mutual Fund (MF)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 leading-normal">
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Trading Venues</td>
                              <td className="p-3">Traded live on national NSE & BSE stock exchanges.</td>
                              <td className="p-3">Allocated daily via fund houses based on closing prices.</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Pricing Model</td>
                              <td className="p-3 text-gold font-semibold">Fluctuates intraday based on live market supply/demand.</td>
                              <td className="p-3">Single daily price NAV declared at market close (3:30 PM).</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Management Costs</td>
                              <td className="p-3 text-emerald-400 font-semibold bg-emerald-500/5">Bare Minimum Fees (typically 0.05% - 0.3%).</td>
                              <td className="p-3">Active advisory allocation fees (0.5% - 2.25%).</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Table 3: SIP vs SWP */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2dd4bf] font-mono border-l-2 border-teal-400 pl-2">SIP vs SWP</h3>
                      <div className="overflow-hidden rounded-xl border border-white/5 bg-[#090d16]">
                        <table className="w-full text-[10.5px] text-left text-muted-foreground">
                          <thead className="text-[9px] uppercase font-mono tracking-wider text-white/50 bg-[#0d1424]">
                            <tr>
                              <th className="p-3">Feature Metric</th>
                              <th className="p-3 text-gold">SIP (Systematic Plan)</th>
                              <th className="p-3 text-white">SWP (Systematic Withdrawal)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 leading-normal">
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Primary Objective</td>
                              <td className="p-3 text-emerald-400 bg-emerald-500/5 font-semibold">Wealth Accumulation (Asset building)</td>
                              <td className="p-3 text-amber-400 bg-amber-500/5 font-semibold">Wealth Distribution (Regular Income)</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Cashflow Direction</td>
                              <td className="p-3">Inward: Monthly debit from savings to fund.</td>
                              <td className="p-3">Outward: Monthly credit from fund to savings.</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">Ideal Lifecycle Phase</td>
                              <td className="p-3">Active accumulation phase (working and earning years).</td>
                              <td className="p-3">Harvesting phase (retirement, financial freedom support).</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. BEGINNER TIPS MODULE */}
                {activeTab === 'tips' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Header */}
                    <div className="pb-4 border-b border-gold/15">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500"><Award size={16} /></div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">Key Takeaways & Beginner Blueprints</h2>
                      </div>
                      <p className="text-[11px] text-gold/80 font-medium font-mono tracking-wider uppercase mt-1">Strategic guidelines to shield and maximize your compounding models.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Takeaways */}
                      <div className="space-y-4 bg-[#0d1424]/40 p-5 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">The Golden Decisions</h3>
                        <div className="space-y-3 pt-1">
                          <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                            <CheckCircle2 size={15} className="text-gold mt-0.5 shrink-0" />
                            <p><strong className="text-white">Consistency Rules All</strong>: Maintaining a steady investment habit is significantly more effective than speculating on stock market peaks or troughs.</p>
                          </div>
                          <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                            <CheckCircle2 size={15} className="text-gold mt-0.5 shrink-0" />
                            <p><strong className="text-white">Diversification is Your Armor</strong>: Spreading capital across robust asset classes forms a buffer against unexpected market downturns.</p>
                          </div>
                          <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                            <CheckCircle2 size={15} className="text-gold mt-0.5 shrink-0" />
                            <p><strong className="text-white">Minimizing Unnecessary Fees</strong>: Small differences in administrative costs can impact portfolio value over multi-decade compounding cycles.</p>
                          </div>
                        </div>
                      </div>

                      {/* Proactive Checklist */}
                      <div className="space-y-4 bg-[#0d1424]/40 p-5 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gold font-mono border-l-2 border-gold pl-2">Beginner Checklist</h3>
                        <div className="space-y-3 pt-1">
                          <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                            <div className="bg-gold/15 px-1.5 py-0.5 rounded font-mono font-bold text-gold text-[9px] leading-none shrink-0 mt-0.5 shadow-sm">1</div>
                            <p><strong className="text-white">Automate on Salary Day</strong>: Auto-debit your investments immediately after payday to practice a disciplined "invest first, spend later" approach.</p>
                          </div>
                          <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                            <div className="bg-gold/15 px-1.5 py-0.5 rounded font-mono font-bold text-gold text-[9px] leading-none shrink-0 mt-0.5 shadow-sm">2</div>
                            <p><strong className="text-white">Annual Step-Up Strategy</strong>: Increase your monthly investment value by a realistic margin (e.g. 10%) each year to build wealth faster.</p>
                          </div>
                          <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                            <div className="bg-gold/15 px-1.5 py-0.5 rounded font-mono font-bold text-gold text-[9px] leading-none shrink-0 mt-0.5 shadow-sm">3</div>
                            <p><strong className="text-white">Trust the Horizon</strong>: Give equity allocations adequate time to recover from short-term volatility and let compounding take effect.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-[#0b0e16] p-4.5 rounded-2xl border border-red-500/15 space-y-2">
                      <div className="flex items-center gap-2 text-red-400 font-bold text-[10.5px] uppercase tracking-wider font-mono">
                        <ShieldAlert size={13} className="shrink-0" />
                        <span>Regulatory Risk Disclaimer</span>
                      </div>
                      <p className="text-[9.5px] text-muted-foreground leading-relaxed">
                        Mutual fund investments are subject to market risks. Please read all scheme-related documents, prospectus sheets, and structural asset breakdowns carefully before allocating funds. Past performances are not indicative of future results. Content compiled in the FinAura Desk is strictly for educational purposes and should not be construed as legal tax-planning advice.
                      </p>
                    </div>
                  </div>
                )}

                {/* Master Advisory CTA at bottom of every tab */}
                <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#080c16] to-[#040810] border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left relative overflow-hidden group shadow-lg">
                  <div className="absolute inset-0 bg-gold/[0.01] pointer-events-none" />
                  <div className="space-y-1 relative z-10 max-w-xl">
                    <h4 className="font-serif text-sm font-bold text-white tracking-wide">Want to build a customized compounding roadmap?</h4>
                    <p className="text-muted-foreground text-[10.5px] leading-relaxed">
                      Consult directly with expert distributor <strong>Shubham Dalvi</strong> to implement customized equity index schemes, low-cost passive indices, or tax-optimized retirement income SWPs.
                    </p>
                  </div>
                  <div className="flex gap-2.5 shrink-0 w-full sm:w-auto relative z-10">
                    <a 
                      href="https://wa.me/919423669236" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:scale-105"
                    >
                      <span>WhatsApp</span>
                      <ArrowUpRight size={12} />
                    </a>
                    <button 
                      onClick={() => { onClose(); window.location.hash = '#contact'; }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gold hover:bg-gold-light text-[#070b13] px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(201,168,76,0.2)] hover:scale-105 cursor-pointer"
                    >
                      <span>Book Advisory</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

              </div> {/* End Right pane */}

            </div> {/* End split layout container */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
