import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatCurrencyShort } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Share2, Trash2, Copy, Check, BarChart2, Zap } from 'lucide-react';
import { useMarketData, MarketIndicators } from '../hooks/useMarketData';

type CalcType = 'sip' | 'swp' | 'stp' | 'retirement' | 'emi' | 'goal' | 'compare';

interface SavedScenario {
  id: string;
  type: CalcType;
  label: string;
  params: Record<string, any>;
  results: Record<string, any>;
  timestamp: number;
}

export const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalcType>('sip');
  const { indicators, stocks } = useMarketData();
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    const saved = localStorage.getItem('finaura_scenarios');
    return saved ? JSON.parse(saved) : [];
  });

  const saveScenario = (scenario: Omit<SavedScenario, 'id' | 'timestamp'>) => {
    const newScenario: SavedScenario = {
      ...scenario,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    const updated = [newScenario, ...savedScenarios];
    setSavedScenarios(updated);
    localStorage.setItem('finaura_scenarios', JSON.stringify(updated));
  };

  const deleteScenario = (id: string) => {
    const updated = savedScenarios.filter(s => s.id !== id);
    setSavedScenarios(updated);
    localStorage.setItem('finaura_scenarios', JSON.stringify(updated));
  };

  return (
    <section id="calculators" className="py-24 px-6 relative overflow-hidden">
      <div className="text-center mb-12">
        <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">Smart Tools</div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Financial Calculators</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Plan your financial future with precision. Enter your numbers and see the power of compounding.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="flex overflow-x-auto no-scrollbar max-w-full border border-gold/20 rounded-2xl md:rounded-full bg-bg-dark-3/50 backdrop-blur-sm px-2 md:px-0">
          {(['sip', 'swp', 'stp', 'retirement', 'emi', 'goal', 'compare'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-8 py-3 text-[0.65rem] md:text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab ? 'bg-gold text-bg-dark shadow-lg' : 'text-muted-foreground hover:bg-gold/10 hover:text-gold'
              }`}
            >
              {tab === 'compare' && <BarChart2 size={14} />}
              {tab === 'emi' ? 'Loan EMI' : tab}
              {tab === 'compare' && savedScenarios.length > 0 && (
                <span className="bg-bg-dark text-gold text-[8px] px-1.5 py-0.5 rounded-full border border-gold/30">
                  {savedScenarios.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'sip' && <SIPCalculator key="sip" onSave={saveScenario} indicators={indicators} stocks={stocks} />}
          {activeTab === 'swp' && <SWPCalculator key="swp" onSave={saveScenario} indicators={indicators} stocks={stocks} />}
          {activeTab === 'stp' && <STPCalculator key="stp" onSave={saveScenario} indicators={indicators} stocks={stocks} />}
          {activeTab === 'retirement' && <RetirementCalculator key="retirement" onSave={saveScenario} indicators={indicators} />}
          {activeTab === 'emi' && <EMICalculator key="emi" onSave={saveScenario} indicators={indicators} />}
          {activeTab === 'goal' && <GoalCalculator key="goal" onSave={saveScenario} indicators={indicators} stocks={stocks} />}
          {activeTab === 'compare' && (
            <CompareView 
              key="compare" 
              scenarios={savedScenarios} 
              onDelete={deleteScenario} 
              onSwitchTab={setActiveTab}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const ShareButton = ({ title, summary }: { title: string, summary: string }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `📊 FinAura Capital - ${title}\n\n${summary}\n\nCalculate yours at: ${window.location.origin}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `FinAura Capital - ${title}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-muted-foreground hover:text-gold"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? 'Copied' : 'Share'}
    </button>
  );
};

const SaveButton = ({ onSave }: { onSave: () => void }) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button 
      onClick={handleSave}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-muted-foreground hover:text-gold"
    >
      {saved ? <Check size={14} /> : <Save size={14} />}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
};

const CompareView = ({ scenarios, onDelete, onSwitchTab }: { scenarios: SavedScenario[], onDelete: (id: string) => void, onSwitchTab: (tab: CalcType) => void }) => {
  if (scenarios.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-center py-20 bg-bg-dark-3 border border-gold/10 rounded-[20px]"
      >
        <BarChart2 size={48} className="mx-auto mb-4 text-gold/20" />
        <h3 className="text-xl font-serif mb-2">No saved scenarios yet</h3>
        <p className="text-muted-foreground mb-8">Save your calculations to compare different financial strategies side-by-side.</p>
        <button 
          onClick={() => onSwitchTab('sip')}
          className="bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all"
        >
          Go to Calculators
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-2xl font-bold">Comparison Dashboard</h3>
        <div className="text-xs text-muted-foreground">{scenarios.length} Scenarios Saved</div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((s) => (
          <div key={s.id} className="bg-bg-dark-3 border border-gold/20 rounded-2xl p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onDelete(s.id)}
                className="text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="text-[10px] uppercase tracking-widest text-gold mb-2">{s.type}</div>
            <h4 className="font-serif text-lg font-bold mb-4">{s.label}</h4>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(s.params).map(([key, val]) => (
                  <div key={key}>
                    <div className="text-[9px] text-muted-foreground uppercase">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-xs font-medium">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gold/10">
              {Object.entries(s.results).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center mb-1">
                  <div className="text-[10px] text-muted-foreground uppercase">{key}</div>
                  <div className="text-sm font-bold text-gold">{val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const RetirementCalculator = ({ onSave, indicators }: { onSave: (s: any) => void, indicators: MarketIndicators }) => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [expenses, setExpenses] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [returns, setReturns] = useState(12);
  const [isLive, setIsLive] = useState(false);

  const applyRealTime = () => {
    setInflation(indicators.inflation);
    setReturns(indicators.marketReturn);
    setIsLive(true);
  };

  const yearsToRetire = retireAge - currentAge;
  const monthlyExpAtRetire = expenses * Math.pow(1 + inflation / 100, yearsToRetire);
  const annualExpAtRetire = monthlyExpAtRetire * 12;
  
  const postRetireReturn = 8;
  const realRate = (1 + postRetireReturn / 100) / (1 + inflation / 100) - 1;
  const corpusRequired = Math.abs(realRate) < 0.0000001
    ? annualExpAtRetire * 20
    : annualExpAtRetire * ((1 - Math.pow(1 + realRate, -20)) / realRate);

  const r = returns / 100 / 12;
  const n = yearsToRetire * 12;
  const monthlySavings = r === 0 
    ? corpusRequired / n 
    : corpusRequired / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

  const invested = monthlySavings * 12 * yearsToRetire;
  const estReturns = Math.max(0, corpusRequired - invested);

  const data = [
    { name: 'Invested', value: invested, color: '#C9A84C' },
    { name: 'Returns', value: estReturns, color: '#3b2a08' },
  ];

  const handleSave = () => {
    onSave({
      type: 'retirement',
      label: `Retirement at ${retireAge}`,
      params: { currentAge, retireAge, expenses, inflation },
      results: { corpus: formatCurrency(corpusRequired), savings: formatCurrency(monthlySavings) }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 bg-bg-dark-3 border border-gold/20 rounded-[32px] p-6 md:p-12 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10 group-hover:bg-gold/10 transition-colors duration-700" />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-2">Retirement Planner</h3>
            <p className="text-sm text-muted-foreground max-w-md">Calculate the corpus you need for a comfortable retirement and the savings required today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={applyRealTime}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-gold bg-gold/5 shadow-lg shadow-gold/5"
              title="Apply real-time inflation and market returns"
            >
              <Zap size={14} className="fill-gold" />
              Live Data
            </button>
            <SaveButton onSave={handleSave} />
            <ShareButton title="Retirement Plan" summary={`Corpus Required: ${formatCurrency(corpusRequired)}\nMonthly Savings: ${formatCurrency(monthlySavings)}`} />
          </div>
        </div>

        <Slider label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={60} step={1} format={v => `${v} yrs`} helpText="Your current age in years." />
        <Slider label="Retirement Age" value={retireAge} onChange={setRetireAge} min={currentAge + 1} max={75} step={1} format={v => `${v} yrs`} helpText="The age at which you plan to stop working." />
        <Slider label="Monthly Expenses (Today)" value={expenses} onChange={setExpenses} min={10000} max={500000} step={5000} format={v => formatCurrency(v)} helpText="Your current monthly living expenses." />
        <Slider label="Expected Inflation" value={inflation} onChange={(v) => { setInflation(v); setIsLive(false); }} min={1} max={15} step={0.5} format={v => `${v}%`} isLive={isLive} helpText="The expected annual increase in the cost of living." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          <ResultBox label="Required Corpus" value={formatCurrency(corpusRequired)} highlight helpText="The total amount needed at retirement to sustain your lifestyle." />
          <ResultBox label="Monthly Savings" value={formatCurrency(monthlySavings)} helpText="The amount you need to save every month starting today." />
        </div>
        <a href="https://wa.me/919423669236" target="_blank" className="mt-6 inline-block bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all">Plan My Retirement →</a>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                nameKey="name"
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={corpusRequired}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif text-lg font-bold"
            >
              {formatCurrencyShort(corpusRequired)}
            </motion.div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Target Corpus</div>
          </div>
        </div>
        <div className="flex gap-6">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </div>
          ))}
        </div>
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-xs text-muted-foreground text-center w-full">
          Your monthly expenses will grow to <strong className="text-gold">{formatCurrency(monthlyExpAtRetire)}</strong> by age {retireAge}.
        </div>
      </div>
    </motion.div>
  );
};

const EMICalculator = ({ onSave, indicators }: { onSave: (s: any) => void, indicators: MarketIndicators }) => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [isLive, setIsLive] = useState(false);

  const applyRealTime = () => {
    setInterestRate(indicators.interestRate);
    setIsLive(true);
  };

  const r = interestRate / 12 / 100;
  const n = tenure * 12;
  const emi = r === 0 
    ? loanAmount / n 
    : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;

  const data = [
    { name: 'Principal', value: loanAmount, color: '#C9A84C' },
    { name: 'Interest', value: totalInterest, color: '#3b2a08' },
  ];

  const handleSave = () => {
    onSave({
      type: 'emi',
      label: `Loan: ${formatCurrencyShort(loanAmount)}`,
      params: { amount: formatCurrencyShort(loanAmount), rate: interestRate, tenure },
      results: { emi: formatCurrency(emi), total: formatCurrency(totalPayment) }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 bg-bg-dark-3 border border-gold/20 rounded-[32px] p-6 md:p-12 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10 group-hover:bg-gold/10 transition-colors duration-700" />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-2">Loan EMI Calculator</h3>
            <p className="text-sm text-muted-foreground max-w-md">Equated Monthly Installment — calculate your monthly loan repayments and total interest cost.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={applyRealTime}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-gold bg-gold/5 shadow-lg shadow-gold/5"
              title="Apply real-time bank interest rates"
            >
              <Zap size={14} className="fill-gold" />
              Live Rates
            </button>
            <SaveButton onSave={handleSave} />
            <ShareButton title="Loan EMI" summary={`Monthly EMI: ${formatCurrency(emi)}\nTotal Interest: ${formatCurrency(totalInterest)}`} />
          </div>
        </div>

        <Slider label="Loan Amount" value={loanAmount} onChange={setLoanAmount} min={100000} max={50000000} step={100000} format={v => formatCurrency(v)} helpText="The total principal amount you wish to borrow." />
        <Slider label="Interest Rate (p.a)" value={interestRate} onChange={(v) => { setInterestRate(v); setIsLive(false); }} min={5} max={20} step={0.1} format={v => `${v}%`} isLive={isLive} helpText="The annual interest rate charged on the loan." />
        <Slider label="Loan Tenure" value={tenure} onChange={setTenure} min={1} max={30} step={1} format={v => `${v} yrs`} helpText="The duration of the loan in years." />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          <ResultBox label="Monthly EMI" value={formatCurrency(emi)} highlight helpText="The fixed amount you pay every month towards loan repayment." />
          <ResultBox label="Total Interest" value={formatCurrency(totalInterest)} helpText="The total interest cost over the entire loan tenure." />
          <ResultBox label="Total Payment" value={formatCurrency(totalPayment)} helpText="The total amount (Principal + Interest) paid over the loan tenure." />
        </div>
        <a href="https://wa.me/919423669236" target="_blank" className="mt-6 inline-block bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all">Get Loan Advice →</a>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                nameKey="name"
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={totalPayment}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif text-xl font-bold"
            >
              {formatCurrencyShort(totalPayment)}
            </motion.div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</div>
          </div>
        </div>
        <div className="flex gap-6">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </div>
          ))}
        </div>
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-xs text-muted-foreground text-center w-full">
          Total interest is <strong className="text-gold">{((totalInterest / totalPayment) * 100).toFixed(1)}%</strong> of your total payment.
        </div>
      </div>
    </motion.div>
  );
};

const GoalCalculator = ({ onSave, indicators, stocks }: { onSave: (s: any) => void, indicators: MarketIndicators, stocks: any[] }) => {
  const [target, setTarget] = useState(1000000);
  const [years, setYears] = useState(5);
  const [returns, setReturns] = useState(12);
  const [isLive, setIsLive] = useState(false);

  const applyRealTime = () => {
    setReturns(indicators.marketReturn);
    setIsLive(true);
  };

  const handleStockReturn = (stockName: string) => {
    let returnRate = 12;
    if (stockName.includes('NIFTY')) returnRate = 13.5;
    if (stockName.includes('RELIANCE') || stockName.includes('TCS')) returnRate = 14.2;
    if (stockName.includes('AAPL') || stockName.includes('GOOGL')) returnRate = 15.5;
    if (stockName.includes('MID')) returnRate = 18.0;
    setReturns(returnRate);
    setIsLive(true);
  };

  const r = returns / 100 / 12;
  const n = years * 12;
  const monthlySavings = r === 0 
    ? target / n 
    : target / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

  const invested = monthlySavings * n;
  const estReturns = Math.max(0, target - invested);

  const data = [
    { name: 'Invested', value: invested, color: '#C9A84C' },
    { name: 'Returns', value: estReturns, color: '#3b2a08' },
  ];

  const handleSave = () => {
    onSave({
      type: 'goal',
      label: `Goal: ${formatCurrencyShort(target)}`,
      params: { target: formatCurrencyShort(target), years, returns },
      results: { monthly: formatCurrency(monthlySavings), invested: formatCurrency(monthlySavings * n) }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 bg-bg-dark-3 border border-gold/20 rounded-[32px] p-6 md:p-12 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10 group-hover:bg-gold/10 transition-colors duration-700" />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-2">Goal Planner</h3>
            <p className="text-sm text-muted-foreground max-w-md">Plan for your dreams — calculate how much you need to save every month to reach your target goal.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={applyRealTime}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-gold bg-gold/5 shadow-lg shadow-gold/5"
              title="Apply real-time inflation and market returns"
            >
              <Zap size={14} className="fill-gold" />
              Live Data
            </button>
            <SaveButton onSave={handleSave} />
            <ShareButton title="Goal Plan" summary={`Target: ${formatCurrency(target)}\nMonthly Savings: ${formatCurrency(monthlySavings)}`} />
          </div>
        </div>

        <Slider label="Target Amount" value={target} onChange={setTarget} min={100000} max={100000000} step={100000} format={v => formatCurrency(v)} helpText="The future value of the goal you want to achieve." />
        <Slider label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} format={v => `${v} yrs`} helpText="The number of years you have to reach your goal." />
        <Slider label="Expected Return" value={returns} onChange={(v) => { setReturns(v); setIsLive(false); }} min={1} max={30} step={0.5} format={v => `${v}%`} isLive={isLive} helpText="The anticipated annual growth rate of your investments." />

        <div className="mb-8 p-4 rounded-2xl bg-gold/5 border border-gold/10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60 mb-4 px-1">Benchmark with Market Leaders</div>
          <div className="flex flex-wrap gap-2">
            {stocks.slice(0, 6).map(stock => (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(201,168,76,0.15)' }}
                whileTap={{ scale: 0.95 }}
                key={stock.name}
                onClick={() => handleStockReturn(stock.name)}
                className="px-4 py-2 rounded-xl bg-bg-dark-2 border border-gold/10 hover:border-gold/30 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
              >
                <span className={`text-[8px] ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '▲' : '▼'}
                </span>
                <span className="text-white/80">{stock.name}</span>
                <span className="text-gold/60 ml-1">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          <ResultBox label="Monthly Savings" value={formatCurrency(monthlySavings)} highlight helpText="The amount you need to save every month to reach your goal." />
          <ResultBox label="Total Invested" value={formatCurrency(monthlySavings * n)} helpText="The total principal amount invested over the time period." />
        </div>
        <a href="https://wa.me/919423669236" target="_blank" className="mt-6 inline-block bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all">Start Saving Now →</a>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                nameKey="name"
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={target}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif text-xl font-bold"
            >
              {formatCurrencyShort(target)}
            </motion.div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Target</div>
          </div>
        </div>
        <div className="flex gap-6">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </div>
          ))}
        </div>
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-xs text-muted-foreground text-center w-full">
          To reach <strong className="text-gold">{formatCurrencyShort(target)}</strong> in {years} years, you need to save <strong className="text-gold">{formatCurrency(monthlySavings)}</strong> monthly.
        </div>
      </div>
    </motion.div>
  );
};

const SIPCalculator = ({ onSave, indicators, stocks }: { onSave: (s: any) => void, indicators: MarketIndicators, stocks: any[] }) => {
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [isLive, setIsLive] = useState(false);

  const applyRealTime = () => {
    setRate(indicators.marketReturn);
    setIsLive(true);
  };

  const handleStockReturn = (stockName: string) => {
    // Simulated category based returns for stocks
    let returnRate = 12;
    if (stockName.includes('NIFTY')) returnRate = 13.5;
    if (stockName.includes('RELIANCE') || stockName.includes('TCS')) returnRate = 14.2;
    if (stockName.includes('AAPL') || stockName.includes('GOOGL')) returnRate = 15.5;
    if (stockName.includes('MID')) returnRate = 18.0;
    
    setRate(returnRate);
    setIsLive(true);
  };

  const r = rate / 100 / 12;
  const n = years * 12;
  const fv = r === 0 
    ? amount * n 
    : amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = amount * n;
  const returns = fv - invested;

  const data = [
    { name: 'Invested', value: invested, color: '#C9A84C' },
    { name: 'Returns', value: returns, color: '#3b2a08' },
  ];

  const handleSave = () => {
    onSave({
      type: 'sip',
      label: `SIP: ${formatCurrencyShort(amount)}/mo`,
      params: { amount: formatCurrencyShort(amount), rate, years },
      results: { total: formatCurrency(fv), returns: formatCurrency(returns) }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 bg-bg-dark-3 border border-gold/20 rounded-[32px] p-6 md:p-12 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10 group-hover:bg-gold/10 transition-colors duration-700" />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-2">SIP Calculator</h3>
            <p className="text-sm text-muted-foreground max-w-md">Systematic Investment Plan — invest a fixed amount every month and watch your wealth grow.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={applyRealTime}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-gold bg-gold/5 shadow-lg shadow-gold/5"
              title="Apply real-time market returns"
            >
              <Zap size={14} className="fill-gold" />
              Live Data
            </button>
            <SaveButton onSave={handleSave} />
            <ShareButton title="SIP Plan" summary={`Monthly SIP: ${formatCurrency(amount)}\nTotal Value: ${formatCurrency(fv)}`} />
          </div>
        </div>

        <Slider label="Monthly Investment" value={amount} onChange={(v) => { setAmount(v); setIsLive(false); }} min={500} max={100000} step={500} format={v => `₹${v.toLocaleString('en-IN')}`} helpText="The fixed amount you invest every month." />
        <Slider label="Expected Annual Return" value={rate} onChange={(v) => { setRate(v); setIsLive(false); }} min={1} max={30} step={0.5} format={v => `${v}%`} isLive={isLive} helpText="The anticipated annual growth rate of your SIP." />
        
        <div className="mb-8 p-4 rounded-2xl bg-gold/5 border border-gold/10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60 mb-4 px-1">Benchmark with Market Leaders</div>
          <div className="flex flex-wrap gap-2">
            {stocks.slice(0, 6).map(stock => (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(201,168,76,0.15)' }}
                whileTap={{ scale: 0.95 }}
                key={stock.name}
                onClick={() => handleStockReturn(stock.name)}
                className="px-4 py-2 rounded-xl bg-bg-dark-2 border border-gold/10 hover:border-gold/30 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
              >
                <span className={`text-[8px] ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '▲' : '▼'}
                </span>
                <span className="text-white/80">{stock.name}</span>
                <span className="text-gold/60 ml-1">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
              </motion.button>
            ))}
          </div>
        </div>

        <Slider label="Investment Period" value={years} onChange={setYears} min={1} max={40} step={1} format={v => `${v} yrs`} helpText="The total duration of your systematic investment." />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          <ResultBox label="Invested" value={formatCurrency(invested)} helpText="Total principal amount invested over the period." />
          <ResultBox label="Est. Returns" value={formatCurrency(returns)} highlight helpText="Estimated wealth gained through market returns." />
          <ResultBox label="Total Value" value={formatCurrency(fv)} helpText="The total maturity value of your investment." />
        </div>
        <a href="http://p.njw.bz/103924" target="_blank" className="mt-6 inline-block bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all">Start SIP Now →</a>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                nameKey="name"
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={fv}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif text-xl font-bold"
            >
              {formatCurrencyShort(fv)}
            </motion.div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</div>
          </div>
        </div>
        <div className="flex gap-6">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </div>
          ))}
        </div>
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-xs text-muted-foreground text-center w-full">
          Your {formatCurrencyShort(invested)} grows to <strong className="text-gold">{formatCurrency(fv)}</strong> — a <strong className="text-gold">{(fv / invested).toFixed(1)}x</strong> return over {years} years!
        </div>
      </div>
    </motion.div>
  );
};

const SWPCalculator = ({ onSave, indicators, stocks }: { onSave: (s: any) => void, indicators: MarketIndicators, stocks: any[] }) => {
  const [corpus, setCorpus] = useState(1000000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [isLive, setIsLive] = useState(false);

  const applyRealTime = () => {
    setRate(indicators.marketReturn - 2); // Slightly lower for withdrawal phase
    setIsLive(true);
  };

  const handleStockReturn = (stockName: string) => {
    let returnRate = 10;
    if (stockName.includes('NIFTY')) returnRate = 11.5;
    if (stockName.includes('RELIANCE') || stockName.includes('TCS')) returnRate = 12.2;
    if (stockName.includes('AAPL') || stockName.includes('GOOGL')) returnRate = 13.5;
    if (stockName.includes('MID')) returnRate = 15.0;
    setRate(returnRate);
    setIsLive(true);
  };

  const monRate = rate / 100 / 12;
  let balance = corpus, months = 0;
  while (balance > 0 && months < 600) {
    balance = balance * (1 + monRate) - withdrawal;
    months++;
  }
  const exhausted = balance <= 0;
  const totalWithdrawn = months * withdrawal;
  const remaining = exhausted ? 0 : Math.max(balance, 0);
  const yrs = Math.floor(months / 12), mos = months % 12;

  const data = [
    { name: 'Remaining', value: remaining, color: '#C9A84C' },
    { name: 'Withdrawn', value: totalWithdrawn, color: '#3b2a08' },
  ];

  const handleSave = () => {
    onSave({
      type: 'swp',
      label: `SWP: ${formatCurrencyShort(withdrawal)}/mo`,
      params: { corpus: formatCurrencyShort(corpus), withdrawal: formatCurrencyShort(withdrawal), rate },
      results: { total: formatCurrency(totalWithdrawn), lasts: exhausted ? `${yrs}y ${mos}m` : '50+ y' }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 bg-bg-dark-3 border border-gold/20 rounded-[32px] p-6 md:p-12 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10 group-hover:bg-gold/10 transition-colors duration-700" />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-2">SWP Calculator</h3>
            <p className="text-sm text-muted-foreground max-w-md">Systematic Withdrawal Plan — generate a regular income stream from your existing corpus.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={applyRealTime}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-gold bg-gold/5 shadow-lg shadow-gold/5"
              title="Apply real-time market returns"
            >
              <Zap size={14} className="fill-gold" />
              Live Data
            </button>
            <SaveButton onSave={handleSave} />
            <ShareButton title="SWP Plan" summary={`Monthly Withdrawal: ${formatCurrency(withdrawal)}\nTotal Withdrawn: ${formatCurrency(totalWithdrawn)}`} />
          </div>
        </div>

        <Slider label="Total Investment" value={corpus} onChange={setCorpus} min={100000} max={10000000} step={50000} format={v => formatCurrency(v)} helpText="The initial lump sum amount you invest." />
        <Slider label="Monthly Withdrawal" value={withdrawal} onChange={setWithdrawal} min={1000} max={200000} step={1000} format={v => `₹${v.toLocaleString('en-IN')}`} helpText="The fixed amount you withdraw every month." />
        <Slider label="Expected Annual Return" value={rate} onChange={(v) => { setRate(v); setIsLive(false); }} min={1} max={20} step={0.5} format={v => `${v}%`} isLive={isLive} helpText="The anticipated annual growth rate of the remaining corpus." />

        <div className="mb-8 p-4 rounded-2xl bg-gold/5 border border-gold/10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60 mb-4 px-1">Benchmark with Market Leaders</div>
          <div className="flex flex-wrap gap-2">
            {stocks.slice(0, 6).map(stock => (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(201,168,76,0.15)' }}
                whileTap={{ scale: 0.95 }}
                key={stock.name}
                onClick={() => handleStockReturn(stock.name)}
                className="px-4 py-2 rounded-xl bg-bg-dark-2 border border-gold/10 hover:border-gold/30 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
              >
                <span className={`text-[8px] ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '▲' : '▼'}
                </span>
                <span className="text-white/80">{stock.name}</span>
                <span className="text-gold/60 ml-1">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          <ResultBox label="Total Withdrawn" value={formatCurrency(totalWithdrawn)} helpText="Total amount withdrawn over the duration." />
          <ResultBox label="Corpus Lasts" value={exhausted ? `${yrs}y ${mos}m` : '50+ years'} highlight helpText="How long your initial investment will last given the withdrawals and returns." />
          <ResultBox label="Remaining" value={formatCurrency(remaining)} helpText="The balance left in your corpus after the period." />
        </div>
        <a href="http://p.njw.bz/103924" target="_blank" className="mt-6 inline-block bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all">Start SWP Now →</a>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                nameKey="name"
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={remaining}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif text-xl font-bold"
            >
              {formatCurrencyShort(remaining)}
            </motion.div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Balance</div>
          </div>
        </div>
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-xs text-muted-foreground text-center w-full">
          {exhausted ? `Your corpus will last ${yrs} years ${mos} months.` : 'Your corpus outlasts 50 years!'}
        </div>
      </div>
    </motion.div>
  );
};

const STPCalculator = ({ onSave, indicators, stocks }: { onSave: (s: any) => void, indicators: MarketIndicators, stocks: any[] }) => {
  const [lump, setLump] = useState(500000);
  const [transfer, setTransfer] = useState(20000);
  const [srcRate, setSrcRate] = useState(7);
  const [tgtRate, setTgtRate] = useState(14);
  const [isLive, setIsLive] = useState(false);

  const applyRealTime = () => {
    setSrcRate(indicators.interestRate - 1.5); // Debt/Liquid fund rate
    setTgtRate(indicators.marketReturn);
    setIsLive(true);
  };

  const handleStockReturn = (stockName: string) => {
    let returnRate = 12;
    if (stockName.includes('NIFTY')) returnRate = 13.5;
    if (stockName.includes('RELIANCE') || stockName.includes('TCS')) returnRate = 14.2;
    if (stockName.includes('AAPL') || stockName.includes('GOOGL')) returnRate = 15.5;
    if (stockName.includes('MID')) returnRate = 18.0;
    setTgtRate(returnRate);
    setIsLive(true);
  };

  const sRate = srcRate / 100 / 12;
  const tRate = tgtRate / 100 / 12;
  let srcBalance = lump, tgtBalance = 0, months = 0;
  while (srcBalance > transfer && months < 600) {
    srcBalance = srcBalance * (1 + sRate) - transfer;
    tgtBalance = (tgtBalance + transfer) * (1 + tRate);
    months++;
  }
  if (srcBalance > 0 && srcBalance <= transfer) {
    tgtBalance = (tgtBalance + srcBalance) * (1 + tRate);
    months++;
    srcBalance = 0;
  }
  const yrs = Math.floor(months / 12), mos = months % 12;

  const data = [
    { name: 'Target Fund', value: tgtBalance, color: '#C9A84C' },
    { name: 'Source Fund', value: srcBalance, color: '#3b2a08' },
  ];

  const handleSave = () => {
    onSave({
      type: 'stp',
      label: `STP: ${formatCurrencyShort(transfer)}/mo`,
      params: { lump: formatCurrencyShort(lump), transfer: formatCurrencyShort(transfer), srcRate, tgtRate },
      results: { target: formatCurrency(tgtBalance), duration: `${yrs}y ${mos}m` }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 bg-bg-dark-3 border border-gold/20 rounded-[32px] p-6 md:p-12 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10 group-hover:bg-gold/10 transition-colors duration-700" />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-2">STP Calculator</h3>
            <p className="text-sm text-muted-foreground max-w-md">Systematic Transfer Plan — gradually move money from one fund to another to reduce risk.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={applyRealTime}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/10 transition-all text-gold bg-gold/5 shadow-lg shadow-gold/5"
              title="Apply real-time market returns"
            >
              <Zap size={14} className="fill-gold" />
              Live Data
            </button>
            <SaveButton onSave={handleSave} />
            <ShareButton title="STP Plan" summary={`Monthly Transfer: ${formatCurrency(transfer)}\nTarget Value: ${formatCurrency(tgtBalance)}`} />
          </div>
        </div>

        <Slider label="Lump Sum Amount" value={lump} onChange={setLump} min={10000} max={5000000} step={10000} format={v => formatCurrency(v)} helpText="The initial amount in the source fund." />
        <Slider label="Monthly Transfer" value={transfer} onChange={setTransfer} min={1000} max={200000} step={1000} format={v => `₹${v.toLocaleString('en-IN')}`} helpText="The amount transferred from source to target fund every month." />
        <Slider label="Source Fund Return" value={srcRate} onChange={(v) => { setSrcRate(v); setIsLive(false); }} min={1} max={15} step={0.5} format={v => `${v}%`} isLive={isLive} helpText="Expected returns from the lower-risk source fund (e.g., Liquid Fund)." />
        <Slider label="Target Fund Return" value={tgtRate} onChange={(v) => { setTgtRate(v); setIsLive(false); }} min={1} max={30} step={0.5} format={v => `${v}%`} isLive={isLive} helpText="Expected returns from the higher-risk target fund (e.g., Equity Fund)." />

        <div className="mb-8 p-4 rounded-2xl bg-gold/5 border border-gold/10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60 mb-4 px-1">Benchmark Target with Market Leaders</div>
          <div className="flex flex-wrap gap-2">
            {stocks.slice(0, 6).map(stock => (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(201,168,76,0.15)' }}
                whileTap={{ scale: 0.95 }}
                key={stock.name}
                onClick={() => handleStockReturn(stock.name)}
                className="px-4 py-2 rounded-xl bg-bg-dark-2 border border-gold/10 hover:border-gold/30 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
              >
                <span className={`text-[8px] ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '▲' : '▼'}
                </span>
                <span className="text-white/80">{stock.name}</span>
                <span className="text-gold/60 ml-1">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          <ResultBox label="Duration" value={`${yrs}y ${mos}m`} helpText="Total time taken to transfer the entire lump sum." />
          <ResultBox label="Target Value" value={formatCurrency(tgtBalance)} highlight helpText="The final value accumulated in the target fund." />
          <ResultBox label="Source Rem." value={formatCurrency(srcBalance)} helpText="Any remaining balance in the source fund." />
        </div>
        <a href="http://p.njw.bz/103924" target="_blank" className="mt-6 inline-block bg-gold text-bg-dark px-8 py-3 rounded-full font-medium hover:bg-gold-light transition-all">Start STP Now →</a>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                nameKey="name"
                animationDuration={400}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={tgtBalance}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif text-xl font-bold"
            >
              {formatCurrencyShort(tgtBalance)}
            </motion.div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Target</div>
          </div>
        </div>
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-xs text-muted-foreground text-center w-full">
          Building target fund to <strong className="text-gold">{formatCurrency(tgtBalance)}</strong>.
        </div>
      </div>
    </motion.div>
  );
};

const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-bg-dark-2 border border-gold/30 rounded-lg text-[10px] text-gold leading-tight w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 shadow-xl backdrop-blur-md">
    {text}
    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-bg-dark-2" />
  </div>
);

const Slider = ({ label, value, onChange, min, max, step, format, helpText, isLive }: { label: string, value: number, onChange: (v: number) => void, min: number, max: number, step: number, format: (v: number) => string, helpText?: string, isLive?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.01 }}
    className="mb-6 group relative p-3 rounded-xl hover:bg-gold/5 transition-colors duration-300"
  >
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-gold transition-colors">{label}</label>
        <AnimatePresence>
          {isLive && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[8px] font-bold text-green-500 uppercase tracking-tighter animate-pulse"
            >
              <Zap size={8} className="fill-green-500" />
              Live
            </motion.span>
          )}
        </AnimatePresence>
        {helpText && (
          <div className="relative group/tooltip">
            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[8px] text-muted-foreground/50 cursor-help hover:border-gold/50 hover:text-gold transition-colors">?</div>
            <Tooltip text={helpText} />
          </div>
        )}
      </div>
      <motion.span 
        key={value}
        initial={{ scale: 1.2, color: '#F27D26' }}
        animate={{ scale: 1, color: '#C9A84C' }}
        className="text-sm font-mono font-bold"
      >
        {format(value)}
      </motion.span>
    </div>
    <div className="relative flex items-center h-6">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-bg-dark-2 rounded-lg appearance-none cursor-pointer accent-gold hover:accent-gold-light transition-all focus:outline-none focus:ring-2 focus:ring-gold/20"
      />
    </div>
    <div className="flex justify-between text-[9px] font-medium text-muted-foreground mt-1 opacity-40 group-hover:opacity-80 transition-opacity">
      <span>{format(min)}</span>
      <span>{format(max)}</span>
    </div>
  </motion.div>
);

const ResultBox = ({ label, value, highlight, helpText }: { label: string, value: string, highlight?: boolean, helpText?: string }) => (
  <motion.div 
    layout
    whileHover={{ y: -2, scale: 1.02 }}
    className={`p-4 rounded-2xl border text-center transition-all duration-500 group/res relative overflow-hidden ${
      highlight 
        ? 'bg-gold/10 border-gold/40 shadow-[0_10px_30px_rgba(201,168,76,0.15)]' 
        : 'bg-bg-dark-2 border-gold/10 hover:border-gold/30 shadow-lg'
    }`}
  >
    {highlight && (
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gold/5 pointer-events-none"
      />
    )}
    <div className="flex items-center justify-center gap-1.5 mb-2 relative z-10">
      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{label}</div>
      {helpText && (
        <div className="relative group/tooltip">
          <div className="w-3 h-3 rounded-full border border-muted-foreground/20 flex items-center justify-center text-[7px] text-muted-foreground/40 cursor-help hover:border-gold/40 hover:text-gold transition-colors">?</div>
          <Tooltip text={helpText} />
        </div>
      )}
    </div>
    <motion.div 
      key={value}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`text-base md:text-lg font-bold relative z-10 ${highlight ? 'text-gold' : 'text-white'}`}
    >
      {value}
    </motion.div>
  </motion.div>
);
