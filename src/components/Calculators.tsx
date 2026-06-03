import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { formatCurrency, formatCurrencyShort } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Check, Zap } from 'lucide-react';
import { useMarketData, MarketIndicators } from '../hooks/useMarketData';

type CalcType = 'sip' | 'swp' | 'stp' | 'retirement' | 'emi' | 'goal';

export const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalcType>('sip');
  const { indicators, stocks } = useMarketData();

  return (
    <section id="calculators" className="py-24 px-6 relative overflow-hidden">
      <div className="text-center mb-12">
        <div className="text-[0.72rem] tracking-[0.14em] uppercase text-gold mb-2">Smart Tools</div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Financial Calculators</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Plan your financial future with precision. Enter your numbers and see the power of compounding.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="flex overflow-x-auto no-scrollbar max-w-full border border-gold/20 rounded-2xl md:rounded-full bg-bg-dark-3/50 backdrop-blur-sm px-2 md:px-0">
          {(['sip', 'swp', 'stp', 'retirement', 'emi', 'goal'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-8 py-3 text-[0.65rem] md:text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab ? 'bg-gold text-bg-dark shadow-lg' : 'text-muted-foreground hover:bg-gold/10 hover:text-gold'
              }`}
            >
              {tab === 'emi' ? 'Loan EMI' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'sip' && <SIPCalculator key="sip" indicators={indicators} stocks={stocks} />}
          {activeTab === 'swp' && <SWPCalculator key="swp" indicators={indicators} stocks={stocks} />}
          {activeTab === 'stp' && <STPCalculator key="stp" indicators={indicators} stocks={stocks} />}
          {activeTab === 'retirement' && <RetirementCalculator key="retirement" indicators={indicators} />}
          {activeTab === 'emi' && <EMICalculator key="emi" indicators={indicators} />}
          {activeTab === 'goal' && <GoalCalculator key="goal" indicators={indicators} stocks={stocks} />}
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1115] border border-gold/20 p-4 rounded-xl shadow-2xl text-xs font-sans">
        <p className="font-bold text-gold mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-8 py-0.5 border-b border-white/5 last:border-0 pb-1 last:pb-0">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.color }} />
                {p.name}:
              </span>
              <span className="font-mono font-bold text-white">{formatCurrency(p.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const GrowthChart = ({ 
  data, 
  keys, 
  colors, 
  title, 
  description 
}: { 
  data: any[], 
  keys: string[], 
  colors: string[], 
  title: string, 
  description?: string 
}) => {
  return (
    <div className="border-t border-gold/10 p-8 md:p-12 bg-[#090b0d]/40">
      <div className="mb-8">
        <h4 className="font-serif text-xl font-bold text-white mb-2">{title}</h4>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="h-72 w-full select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {keys.map((key, i) => (
                <linearGradient id={`grad-${key}`} key={key} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[i] || '#C9A84C'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors[i] || '#C9A84C'} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 168, 76, 0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={v => formatCurrencyShort(v)} 
              dx={-5} 
            />
            <RechartsTooltip content={<CustomTooltip />} />
            {keys.map((key, i) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[i] || '#C9A84C'} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#grad-${key})`} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-6 justify-center mt-6">
        {keys.map((key, i) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: colors[i] }} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};





const RetirementCalculator = ({ indicators }: { indicators: MarketIndicators }) => {
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
    { name: 'Returns', value: estReturns, color: 'rgba(201, 168, 76, 0.2)' },
  ];

  const getRetirementData = () => {
    const chartData = [];
    const rRate = returns / 100 / 12;
    const step = yearsToRetire <= 10 ? 1 : yearsToRetire <= 20 ? 2 : 5;
    
    for (let y = step; y < yearsToRetire; y += step) {
      const m = y * 12;
      const investedPct = monthlySavings * m;
      const progressValue = rRate === 0 
        ? investedPct 
        : monthlySavings * ((Math.pow(1 + rRate, m) - 1) / rRate) * (1 + rRate);
      chartData.push({
        name: `Age ${currentAge + y}`,
        Invested: Math.round(investedPct),
        Value: Math.round(progressValue)
      });
    }
    
    chartData.push({
      name: `Age ${retireAge}`,
      Invested: Math.round(invested),
      Value: Math.round(corpusRequired)
    });
    return chartData;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-bg-dark-3/80 backdrop-blur-xl border border-gold/10 rounded-[40px] overflow-hidden shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Input Region */}
        <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gold/10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Retirement Planner</h3>
              <p className="text-sm text-muted-foreground">Calculate your retirement corpus accurately.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={applyRealTime}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/20 transition-all text-gold"
              >
                <Zap size={14} className="fill-gold" />
                Live Data
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <Slider label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={60} step={1} format={v => `${v} yrs`} />
            <Slider label="Retirement Age" value={retireAge} onChange={setRetireAge} min={currentAge + 1} max={75} step={1} format={v => `${v} yrs`} />
            <Slider label="Monthly Expenses" value={expenses} onChange={setExpenses} min={10000} max={500000} step={5000} format={v => formatCurrency(v)} />
            <Slider label="Expectation Inflation" value={inflation} onChange={v => { setInflation(v); setIsLive(false); }} min={1} max={15} step={0.5} format={v => `${v}%`} isLive={isLive} />
          </div>

          <div className="mt-12">
            <a href="https://wa.me/919423669236" target="_blank" className="inline-flex items-center gap-3 bg-gold text-bg-dark px-10 py-4 rounded-2xl font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/10 group">
              Get Personalised Plan
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Results Region */}
        <div className="lg:col-span-5 p-8 md:p-12 bg-gold/5 flex flex-col items-center justify-between gap-12">
          <div className="w-full space-y-6">
            <ResultBox label="Target Corpus" value={formatCurrency(corpusRequired)} highlight />
            <ResultBox label="Monthly Savings Needed" value={formatCurrency(monthlySavings)} />
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    innerRadius="65%" 
                    outerRadius="85%" 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                    cx="50%"
                    cy="50%"
                  >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-serif font-bold text-white">{formatCurrencyShort(corpusRequired)}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">Corpus</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-8 mt-4">
              {data.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[24px] text-xs text-muted-foreground leading-relaxed">
            Your expenses will adjust to <span className="text-gold font-bold">{formatCurrency(monthlyExpAtRetire)}</span>/month by age {retireAge}.
          </div>
        </div>
      </div>

      <GrowthChart 
        data={getRetirementData()}
        keys={['Invested', 'Value']}
        colors={['rgba(255, 255, 255, 0.2)', '#C9A84C']}
        title="Retirement Corpus Accumulation"
        description="See how your savings compound year-on-year to hit your golden nest egg target."
      />
    </motion.div>
  );
};

const EMICalculator = ({ indicators }: { indicators: MarketIndicators }) => {
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
    { name: 'Interest', value: totalInterest, color: 'rgba(201, 168, 76, 0.2)' },
  ];

  const getEmiData = () => {
    const chartData = [];
    const rRate = interestRate / 12 / 100;
    const totalPayments = tenure * 12;
    const step = tenure <= 10 ? 1 : tenure <= 20 ? 2 : 5;
    
    chartData.push({
      name: 'Start',
      'Principal Paid': 0,
      'Balance': Math.round(loanAmount)
    });

    for (let y = step; y <= tenure; y += step) {
      const m = y * 12;
      let remainingBalance = 0;
      if (rRate === 0) {
        remainingBalance = loanAmount - (loanAmount * (m / totalPayments));
      } else {
        remainingBalance = loanAmount * (Math.pow(1 + rRate, totalPayments) - Math.pow(1 + rRate, m)) / (Math.pow(1 + rRate, totalPayments) - 1);
      }
      remainingBalance = Math.max(0, remainingBalance);
      const principalPaid = loanAmount - remainingBalance;
      
      chartData.push({
        name: `Yr ${y}`,
        'Principal Paid': Math.round(principalPaid),
        'Balance': Math.round(remainingBalance)
      });
    }

    if (tenure % step !== 0) {
      chartData.push({
        name: `Yr ${tenure}`,
        'Principal Paid': Math.round(loanAmount),
        'Balance': 0
      });
    }
    return chartData;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-bg-dark-3/80 backdrop-blur-xl border border-gold/10 rounded-[40px] overflow-hidden shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gold/10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Loan EMI Calculator</h3>
              <p className="text-sm text-muted-foreground">Calculate your monthly loan repayments.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={applyRealTime}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/20 transition-all text-gold"
              >
                <Zap size={14} className="fill-gold" />
                Live Rates
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <Slider label="Loan Amount" value={loanAmount} onChange={setLoanAmount} min={100000} max={50000000} step={100000} format={v => formatCurrency(v)} />
            <Slider label="Interest Rate (p.a)" value={interestRate} onChange={v => { setInterestRate(v); setIsLive(false); }} min={5} max={20} step={0.1} format={v => `${v}%`} isLive={isLive} />
            <Slider label="Loan Tenure" value={tenure} onChange={setTenure} min={1} max={30} step={1} format={v => `${v} yrs`} />
          </div>

          <div className="mt-12">
            <a href="https://wa.me/919423669236" target="_blank" className="inline-flex items-center gap-3 bg-gold text-bg-dark px-10 py-4 rounded-2xl font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/10 group">
              Get Loan Advice
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-gold/5 flex flex-col items-center justify-between gap-12">
          <div className="w-full space-y-4">
            <ResultBox label="Monthly EMI" value={formatCurrency(emi)} highlight />
            <div className="grid grid-cols-2 gap-4">
              <ResultBox label="Total Interest" value={formatCurrency(totalInterest)} />
              <ResultBox label="Total Payment" value={formatCurrency(totalPayment)} />
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    innerRadius="65%" 
                    outerRadius="85%" 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                    cx="50%"
                    cy="50%"
                  >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-serif font-bold text-white">{formatCurrencyShort(totalPayment)}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">Total</div>
              </div>
            </div>
          </div>

          <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[24px] text-xs text-muted-foreground leading-relaxed text-center">
            Total interest is <span className="text-gold font-bold">{((totalInterest / totalPayment) * 100).toFixed(1)}%</span> of your total payment.
          </div>
        </div>
      </div>

      <GrowthChart 
        data={getEmiData()}
        keys={['Principal Paid', 'Balance']}
        colors={['#C9A84C', 'rgba(255, 255, 255, 0.2)']}
        title="Amortization Schedule"
        description="Observe how your home equity increases as the outstanding loan balance decays."
      />
    </motion.div>
  );
};

const GoalCalculator = ({ indicators, stocks }: { indicators: MarketIndicators, stocks: any[] }) => {
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
    { name: 'Returns', value: estReturns, color: 'rgba(201, 168, 76, 0.2)' },
  ];

  const getGoalData = () => {
    const chartData = [];
    const rRate = returns / 100 / 12;
    const isShortHorizon = years <= 2;
    const limit = isShortHorizon ? years * 12 : years;
    
    for (let i = 1; i <= limit; i++) {
      const m = isShortHorizon ? i : i * 12;
      const investedPct = monthlySavings * m;
      const progressValue = rRate === 0 
        ? investedPct 
        : monthlySavings * ((Math.pow(1 + rRate, m) - 1) / rRate) * (1 + rRate);
      chartData.push({
        name: isShortHorizon ? `Mo ${m}` : `Yr ${i}`,
        Invested: Math.round(investedPct),
        Value: Math.round(progressValue)
      });
    }
    return chartData;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-bg-dark-3/80 backdrop-blur-xl border border-gold/10 rounded-[40px] overflow-hidden shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gold/10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Goal Planner</h3>
              <p className="text-sm text-muted-foreground">Track your way to financial milestones.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={applyRealTime}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/20 transition-all text-gold"
              >
                <Zap size={14} className="fill-gold" />
                Live Data
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <Slider label="Target Amount" value={target} onChange={setTarget} min={100000} max={100000000} step={100000} format={v => formatCurrency(v)} />
            
            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10">
              <div className="text-[9px] font-bold uppercase tracking-wider text-gold/60 mb-4 px-1">Market Benchmark</div>
              <div className="flex flex-wrap gap-2">
                {stocks.slice(0, 6).map(stock => (
                  <button
                    key={stock.name}
                    onClick={() => handleStockReturn(stock.name)}
                    className="px-3 py-1.5 rounded-lg bg-bg-dark-2 border border-gold/10 text-[10px] font-bold text-white hover:border-gold/40 transition-all"
                  >
                    {stock.name} <span className="text-gold/60">{stock.change}%</span>
                  </button>
                ))}
              </div>
            </div>

            <Slider label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} format={v => `${v} yrs`} />
            <Slider label="Expected Return (p.a)" value={returns} onChange={v => { setReturns(v); setIsLive(false); }} min={1} max={30} step={0.5} format={v => `${v}%`} isLive={isLive} />
          </div>

          <div className="mt-12">
            <a href="https://wa.me/919423669236" target="_blank" className="inline-flex items-center gap-3 bg-gold text-bg-dark px-10 py-4 rounded-2xl font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/10 group">
              Start Saving Now
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-gold/5 flex flex-col items-center justify-between gap-12">
          <div className="w-full space-y-4">
            <ResultBox label="Monthly Savings Needed" value={formatCurrency(monthlySavings)} highlight />
            <ResultBox label="Total Invested Amount" value={formatCurrency(monthlySavings * n)} />
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    innerRadius="65%" 
                    outerRadius="85%" 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                    cx="50%"
                    cy="50%"
                  >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-serif font-bold text-white">{formatCurrencyShort(target)}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">Target</div>
              </div>
            </div>
          </div>

          <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[24px] text-xs text-muted-foreground leading-relaxed text-center">
            To reach <span className="text-gold font-bold">{formatCurrencyShort(target)}</span> in {years} years, you need <span className="text-gold font-bold">{formatCurrency(monthlySavings)}</span> monthly.
          </div>
        </div>
      </div>

      <GrowthChart 
        data={getGoalData()}
        keys={['Invested', 'Value']}
        colors={['rgba(255, 255, 255, 0.2)', '#C9A84C']}
        title="Goal Target Milestone Progression"
        description="Visualize the dynamic spacing with compounding interest tracking up to your targeted corpus."
      />
    </motion.div>
  );
};

const SIPCalculator = ({ indicators, stocks }: { indicators: MarketIndicators, stocks: any[] }) => {
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
    { name: 'Returns', value: returns, color: 'rgba(201, 168, 76, 0.2)' },
  ];

  const getSipData = () => {
    const chartData = [];
    const rRate = rate / 100 / 12;
    const isShortHorizon = years <= 2;
    const limit = isShortHorizon ? years * 12 : years;
    
    for (let i = 1; i <= limit; i++) {
      const m = isShortHorizon ? i : i * 12;
      const investedPct = amount * m;
      const progressValue = rRate === 0 
        ? investedPct 
        : amount * ((Math.pow(1 + rRate, m) - 1) / rRate) * (1 + rRate);
      chartData.push({
        name: isShortHorizon ? `Mo ${m}` : `Yr ${i}`,
        Invested: Math.round(investedPct),
        Value: Math.round(progressValue)
      });
    }
    return chartData;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-bg-dark-3/80 backdrop-blur-xl border border-gold/10 rounded-[40px] overflow-hidden shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Input Region */}
        <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gold/10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">SIP Calculator</h3>
              <p className="text-sm text-muted-foreground">Plan your long-term wealth creation.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={applyRealTime}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/20 transition-all text-gold"
              >
                <Zap size={14} className="fill-gold" />
                Live Data
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <Slider label="Monthly SIP Amount" value={amount} onChange={v => { setAmount(v); setIsLive(false); }} min={500} max={100000} step={500} format={v => `₹${v.toLocaleString('en-IN')}`} />
            
            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10">
              <div className="text-[9px] font-bold uppercase tracking-wider text-gold/60 mb-4 px-1">Market Benchmark</div>
              <div className="flex flex-wrap gap-2">
                {stocks.slice(0, 6).map(stock => (
                  <button
                    key={stock.name}
                    onClick={() => handleStockReturn(stock.name)}
                    className="px-3 py-1.5 rounded-lg bg-bg-dark-2 border border-gold/10 text-[10px] font-bold text-white hover:border-gold/40 transition-all"
                  >
                    {stock.name} <span className="text-gold/60">{stock.change}%</span>
                  </button>
                ))}
              </div>
            </div>

            <Slider label="Expected Return (p.a)" value={rate} onChange={v => { setRate(v); setIsLive(false); }} min={1} max={30} step={0.5} format={v => `${v}%`} isLive={isLive} />
            <Slider label="Investment Period" value={years} onChange={setYears} min={1} max={40} step={1} format={v => `${v} yrs`} />
          </div>

          <div className="mt-12">
            <a href="http://p.njw.bz/103924" target="_blank" className="inline-flex items-center gap-3 bg-gold text-bg-dark px-10 py-4 rounded-2xl font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/10 group">
              Start SIP Now
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Results Region */}
        <div className="lg:col-span-5 p-8 md:p-12 bg-gold/5 flex flex-col items-center justify-between gap-12">
          <div className="w-full space-y-4">
            <ResultBox label="Estimated Total Value" value={formatCurrency(fv)} highlight />
            <div className="grid grid-cols-2 gap-4">
              <ResultBox label="Invested" value={formatCurrency(invested)} />
              <ResultBox label="Returns" value={formatCurrency(returns)} />
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    innerRadius="65%" 
                    outerRadius="85%" 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                    cx="50%"
                    cy="50%"
                  >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-serif font-bold text-white">{formatCurrencyShort(fv)}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">Total</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-8 mt-4">
              {data.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[24px] text-xs text-muted-foreground leading-relaxed">
            Your {formatCurrencyShort(invested)} grows to <span className="text-gold font-bold">{formatCurrencyShort(fv)}</span> — a <span className="text-gold font-bold">{(fv / invested).toFixed(1)}x</span> wealth multiplier!
          </div>
        </div>
      </div>

      <GrowthChart 
        data={getSipData()}
        keys={['Invested', 'Value']}
        colors={['rgba(255, 255, 255, 0.2)', '#C9A84C']}
        title="SIP Compound Growth Curve"
        description="See how your monthly SIP builds massive wealth systematically through continuous compounding over your chosen horizon."
      />
    </motion.div>
  );
};

const SWPCalculator = ({ indicators, stocks }: { indicators: MarketIndicators, stocks: any[] }) => {
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
    { name: 'Withdrawn', value: totalWithdrawn, color: 'rgba(201, 168, 76, 0.2)' },
  ];

  const getSwpData = () => {
    const chartData = [];
    const limitYears = exhausted ? Math.max(1, yrs) : 30;
    const step = limitYears <= 10 ? 1 : limitYears <= 20 ? 2 : 5;
    
    chartData.push({
      name: 'Start',
      Balance: Math.round(corpus),
      Withdrawn: 0
    });

    for (let y = step; y <= limitYears; y += step) {
      const limitMonths = y * 12;
      let currentBal = corpus;
      for (let m = 0; m < limitMonths; m++) {
        currentBal = currentBal * (1 + monRate) - withdrawal;
        if (currentBal <= 0) {
          currentBal = 0;
          break;
        }
      }
      chartData.push({
        name: `Yr ${y}`,
        Balance: Math.round(currentBal),
        Withdrawn: Math.round(y * 12 * withdrawal)
      });
    }
    
    if (exhausted && yrs > 0 && (yrs % step !== 0)) {
      chartData.push({
        name: `Yr ${yrs}`,
        Balance: 0,
        Withdrawn: Math.round(totalWithdrawn)
      });
    }
    return chartData;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-bg-dark-3/80 backdrop-blur-xl border border-gold/10 rounded-[40px] overflow-hidden shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gold/10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">SWP Calculator</h3>
              <p className="text-sm text-muted-foreground">Systematic Withdrawal Plan for regular income.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={applyRealTime}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/20 transition-all text-gold"
              >
                <Zap size={14} className="fill-gold" />
                Live Data
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <Slider label="Total Investment" value={corpus} onChange={setCorpus} min={100000} max={100000000} step={100000} format={v => formatCurrency(v)} />
            <Slider label="Monthly Withdrawal" value={withdrawal} onChange={setWithdrawal} min={1000} max={500000} step={1000} format={v => formatCurrency(v)} />
            <Slider label="Expected Return (p.a)" value={rate} onChange={v => { setRate(v); setIsLive(false); }} min={1} max={20} step={0.5} format={v => `${v}%`} isLive={isLive} />
          </div>

          <div className="mt-12">
            <a href="https://wa.me/919423669236" target="_blank" className="inline-flex items-center gap-3 bg-gold text-bg-dark px-10 py-4 rounded-2xl font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/10 group">
              Get Tax Planning Advice
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-gold/5 flex flex-col items-center justify-between gap-12">
          <div className="w-full space-y-4">
            <ResultBox label="Payout Duration" value={exhausted ? `${yrs}y ${mos}m` : '50+ years'} highlight />
            <ResultBox label="Total Amount Withdrawn" value={formatCurrency(totalWithdrawn)} />
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    innerRadius="65%" 
                    outerRadius="85%" 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                    cx="50%"
                    cy="50%"
                  >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <div className="text-2xl font-serif font-bold text-white max-w-[120px] truncate">{formatCurrencyShort(remaining)}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">Remaining</div>
              </div>
            </div>
          </div>

          <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[24px] text-xs text-muted-foreground leading-relaxed text-center">
            {exhausted 
              ? `Your corpus will last for approximately ${yrs} years and ${mos} months.`
              : `Your corpus is sustainable indefinitely at this withdrawal rate.`
            }
          </div>
        </div>
      </div>

      <GrowthChart 
        data={getSwpData()}
        keys={['Balance', 'Withdrawn']}
        colors={['#C9A84C', 'rgba(255, 255, 255, 0.2)']}
        title="SWP Portfolio Projection"
        description="Track the sustainability timeline of your corpus vs cumulative withdrawal payouts."
      />
    </motion.div>
  );
};

const STPCalculator = ({ indicators, stocks }: { indicators: MarketIndicators, stocks: any[] }) => {
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
    { name: 'Source Fund', value: srcBalance, color: 'rgba(201, 168, 76, 0.2)' },
  ];

  const getStpData = () => {
    const chartData = [];
    const limitYears = Math.max(1, yrs);
    const step = limitYears <= 10 ? 1 : limitYears <= 20 ? 2 : 5;

    chartData.push({
      name: 'Start',
      'Source Fund': Math.round(lump),
      'Target Fund': 0,
      'Total Portfolio': Math.round(lump)
    });

    for (let y = step; y <= limitYears; y += step) {
      const limitMonths = y * 12;
      let tempSrc = lump;
      let tempTgt = 0;
      
      for (let m = 0; m < limitMonths; m++) {
        if (tempSrc > transfer) {
          tempSrc = tempSrc * (1 + sRate) - transfer;
          tempTgt = (tempTgt + transfer) * (1 + tRate);
        } else if (tempSrc > 0) {
          tempTgt = (tempTgt + tempSrc) * (1 + tRate);
          tempSrc = 0;
        } else {
          tempTgt = tempTgt * (1 + tRate);
        }
      }
      
      chartData.push({
        name: `Yr ${y}`,
        'Source Fund': Math.round(tempSrc),
        'Target Fund': Math.round(tempTgt),
        'Total Portfolio': Math.round(tempSrc + tempTgt)
      });
    }

    if (yrs > 0 && (yrs % step !== 0)) {
      chartData.push({
        name: `Yr ${yrs}`,
        'Source Fund': Math.round(srcBalance),
        'Target Fund': Math.round(tgtBalance),
        'Total Portfolio': Math.round(srcBalance + tgtBalance)
      });
    }

    return chartData;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-bg-dark-3/80 backdrop-blur-xl border border-gold/10 rounded-[40px] overflow-hidden shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gold/10">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">STP Calculator</h3>
              <p className="text-sm text-muted-foreground">Optimize your market entry with Systematic Transfer.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={applyRealTime}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-[10px] uppercase tracking-widest font-bold hover:bg-gold/20 transition-all text-gold"
              >
                <Zap size={14} className="fill-gold" />
                Live Data
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <Slider label="Lump Sum Amount" value={lump} onChange={setLump} min={10000} max={100000000} step={10000} format={v => formatCurrency(v)} />
            <Slider label="Monthly Transfer" value={transfer} onChange={setTransfer} min={1000} max={1000000} step={1000} format={v => formatCurrency(v)} />
            <Slider label="Target Fund Return (p.a)" value={tgtRate} onChange={v => { setTgtRate(v); setIsLive(false); }} min={1} max={30} step={0.5} format={v => `${v}%`} isLive={isLive} />
          </div>

          <div className="mt-12">
            <a href="http://p.njw.bz/103924" target="_blank" className="inline-flex items-center gap-3 bg-gold text-bg-dark px-10 py-4 rounded-2xl font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/10 group">
              Start STP Journey
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 bg-gold/5 flex flex-col items-center justify-between gap-12">
          <div className="w-full space-y-4">
            <ResultBox label="Target Fund Value" value={formatCurrency(tgtBalance)} highlight />
            <div className="grid grid-cols-2 gap-4">
              <ResultBox label="Duration" value={`${yrs}y ${mos}m`} />
              <ResultBox label="Source Rem." value={formatCurrency(srcBalance)} />
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    innerRadius="65%" 
                    outerRadius="85%" 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                    cx="50%"
                    cy="50%"
                  >
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <div className="text-2xl font-serif font-bold text-white max-w-[120px] truncate">{formatCurrencyShort(tgtBalance)}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">Target Value</div>
              </div>
            </div>
          </div>

          <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[24px] text-xs text-muted-foreground leading-relaxed text-center">
            Building target fund to <span className="text-gold font-bold">{formatCurrency(tgtBalance)}</span>.
          </div>
        </div>
      </div>

      <GrowthChart 
        data={getStpData()}
        keys={['Source Fund', 'Target Fund', 'Total Portfolio']}
        colors={['rgba(255, 255, 255, 0.2)', '#C9A84C', '#E2D2A2']}
        title="STP Systematic Asset Migration"
        description="Monitor how your low-risk Source Fund systematic decay compounds and appreciates inside the higher return Target Fund."
      />
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
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="group"
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground group-hover:text-gold transition-colors">{label}</label>
        <AnimatePresence>
          {isLive && (
            <motion.span 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[8px] font-bold text-green-500 uppercase"
            >
              <Zap size={8} className="fill-green-500" />
              Live
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative group/input">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(val);
            }}
            className="w-32 bg-bg-dark-2/50 border border-gold/10 rounded-xl px-3 py-2 text-right text-sm font-mono font-bold text-gold focus:outline-none focus:border-gold/50 focus:bg-bg-dark-2 transition-all outline-none"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono opacity-40 group-focus-within/input:opacity-100 transition-opacity">EDIT</div>
        </div>
        <div className="text-[10px] font-mono font-medium text-muted-foreground opacity-60 w-24 text-right hidden sm:block">
          {format(value)}
        </div>
      </div>
    </div>

    <div className="px-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gold/10 rounded-full appearance-none cursor-pointer accent-gold hover:accent-gold-light transition-all focus:outline-none"
      />
      <div className="flex justify-between text-[9px] font-bold text-muted-foreground/40 mt-3 uppercase tracking-tighter">
        <span>Min {format(min)}</span>
        <span>Max {format(max)}</span>
      </div>
    </div>
  </motion.div>
);

const ResultBox = ({ label, value, highlight, helpText }: { label: string, value: string, highlight?: boolean, helpText?: string }) => (
  <motion.div 
    layout
    whileHover={{ y: -4 }}
    className={`p-6 rounded-[28px] border transition-all duration-500 relative overflow-hidden flex flex-col items-center justify-center text-center ${
      highlight 
        ? 'bg-gold text-bg-dark border-transparent shadow-xl shadow-gold/20' 
        : 'bg-bg-dark-2/40 border-gold/10 hover:border-gold/30 shadow-lg'
    }`}
  >
    <div className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${highlight ? 'text-bg-dark/60' : 'text-muted-foreground'}`}>{label}</div>
    <div className={`text-xl md:text-2xl font-serif font-black ${highlight ? 'text-bg-dark' : 'text-white'}`}>
      {value}
    </div>
  </motion.div>
);
