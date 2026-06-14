/**
 * FinAura Capital - Mathematical Calculation Engines
 * Registered Partner Education Portal
 * 
 * This file contains the precise mathematical formulations and TypeScript implementations 
 * of the core algorithms running all the financial calculators: SIP, SWP, STP, 
 * Retirement Planner, Loan EMI, and Goal Planner.
 */

// -----------------------------------------------------------------------------
// 1. SYSTEMATIC INVESTMENT PLAN (SIP) COMPOUND SYSTEM
// -----------------------------------------------------------------------------
/**
 * Formula (Annuity Due with Monthly Compounding):
 * FV = P * [ ((1 + r)^n - 1) / r ] * (1 + r)
 * Where:
 *   P = Monthly investment amount
 *   r = Monthly rate of interest (annual expected return / 12 / 100)
 *   n = Total number of monthly installments (years * 12)
 *   FV = Future Value of investment
 */
export interface SIPResult {
  futureValue: number;
  totalInvested: number;
  estimatedReturns: number;
  chartData: Array<{ name: string; Invested: number; Value: number }>;
}

export function calculateSIP(amount: number, annualRate: number, years: number): SIPResult {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  
  const futureValue = r === 0 
    ? amount * n 
    : amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    
  const totalInvested = amount * n;
  const estimatedReturns = Math.max(0, futureValue - totalInvested);
  
  const chartData: Array<{ name: string; Invested: number; Value: number }> = [];
  const isShortHorizon = years <= 2;
  const limit = isShortHorizon ? years * 12 : years;
  
  for (let i = 1; i <= limit; i++) {
    const m = isShortHorizon ? i : i * 12;
    const investedPct = amount * m;
    const progressValue = r === 0 
      ? investedPct 
      : amount * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
      
    chartData.push({
      name: isShortHorizon ? `Mo ${m}` : `Yr ${i}`,
      Invested: Math.round(investedPct),
      Value: Math.round(progressValue),
    });
  }

  return {
    futureValue,
    totalInvested,
    estimatedReturns,
    chartData,
  };
}


// -----------------------------------------------------------------------------
// 2. SYSTEMATIC WITHDRAWAL PLAN (SWP) SUSTAINABILITY ENGINE
// -----------------------------------------------------------------------------
/**
 * Loop/Iterative Recurrent Formula for monthly decay:
 * Balance_(m+1) = Balance_m * (1 + r) - W
 * Where:
 *   Balance_0 = Initial corpus
 *   r = Monthly interest rate (annual return / 12 / 100)
 *   W = Fixed monthly systematic withdrawal payout
 */
export interface SWPResult {
  remainingBalance: number;
  totalWithdrawn: number;
  monthsActive: number;
  yearsActive: number;
  remainingMonthsActive: number;
  isSustainableIndefinitely: boolean;
  chartData: Array<{ name: string; Balance: number; Withdrawn: number }>;
}

export function calculateSWP(corpus: number, withdrawal: number, annualRate: number): SWPResult {
  const r = annualRate / 100 / 12;
  let balance = corpus;
  let months = 0;
  const maxMonths = 600; // Cap at 50 years to avoid infinite loop on high returns

  while (balance > 0 && months < maxMonths) {
    balance = balance * (1 + r) - withdrawal;
    months++;
  }

  const exhausted = balance <= 0;
  const totalWithdrawn = months * withdrawal;
  const remainingBalance = exhausted ? 0 : Math.max(balance, 0);
  const yearsActive = Math.floor(months / 12);
  const remainingMonthsActive = months % 12;

  const chartData: Array<{ name: string; Balance: number; Withdrawn: number }> = [];
  const limitYears = exhausted ? Math.max(1, yearsActive) : 30;
  const step = limitYears <= 10 ? 1 : limitYears <= 20 ? 2 : 5;

  chartData.push({
    name: 'Start',
    Balance: Math.round(corpus),
    Withdrawn: 0,
  });

  for (let y = step; y <= limitYears; y += step) {
    const limitMonths = y * 12;
    let currentBal = corpus;
    for (let m = 0; m < limitMonths; m++) {
      currentBal = currentBal * (1 + r) - withdrawal;
      if (currentBal <= 0) {
        currentBal = 0;
        break;
      }
    }
    chartData.push({
      name: `Yr ${y}`,
      Balance: Math.round(currentBal),
      Withdrawn: Math.round(y * 12 * withdrawal),
    });
  }

  if (exhausted && yearsActive > 0 && (yearsActive % step !== 0)) {
    chartData.push({
      name: `Yr ${yearsActive}`,
      Balance: 0,
      Withdrawn: Math.round(totalWithdrawn),
    });
  }

  return {
    remainingBalance,
    totalWithdrawn,
    monthsActive: months,
    yearsActive,
    remainingMonthsActive,
    isSustainableIndefinitely: !exhausted,
    chartData,
  };
}


// -----------------------------------------------------------------------------
// 3. SYSTEMATIC TRANSFER PLAN (STP) SYNERGY ENGINE
// -----------------------------------------------------------------------------
/**
 * Formula: Systematic relocation from low-risk Source Portfolio (e.g. Debt/Liquid)
 * to high-growth Target Portfolio (e.g. Equity).
 * 
 * In each monthly step:
 *   Source Fund earns its growth rate, then transfer volume 'T' is subtracted.
 *   Target Fund receives transfer 'T', then compound-accrues its equity rate.
 */
export interface STPResult {
  sourceFundRemaining: number;
  targetFundFinal: number;
  monthsActive: number;
  yearsActive: number;
  remainingMonthsActive: number;
  chartData: Array<{ name: string; 'Source Fund': number; 'Target Fund': number; 'Total Portfolio': number }>;
}

export function calculateSTP(
  lumpSum: number, 
  transferAmount: number, 
  sourceAnnualRate: number, 
  targetAnnualRate: number
): STPResult {
  const sRate = sourceAnnualRate / 100 / 12;
  const tRate = targetAnnualRate / 100 / 12;
  
  let srcBalance = lumpSum;
  let tgtBalance = 0;
  let months = 0;
  const maxMonths = 600;

  while (srcBalance > transferAmount && months < maxMonths) {
    srcBalance = srcBalance * (1 + sRate) - transferAmount;
    tgtBalance = (tgtBalance + transferAmount) * (1 + tRate);
    months++;
  }

  if (srcBalance > 0 && srcBalance <= transferAmount) {
    tgtBalance = (tgtBalance + srcBalance) * (1 + tRate);
    months++;
    srcBalance = 0;
  }

  const yearsActive = Math.floor(months / 12);
  const remainingMonthsActive = months % 12;

  const chartData: Array<{ name: string; 'Source Fund': number; 'Target Fund': number; 'Total Portfolio': number }> = [];
  const limitYears = Math.max(1, yearsActive);
  const step = limitYears <= 10 ? 1 : limitYears <= 20 ? 2 : 5;

  chartData.push({
    name: 'Start',
    'Source Fund': Math.round(lumpSum),
    'Target Fund': 0,
    'Total Portfolio': Math.round(lumpSum),
  });

  for (let y = step; y <= limitYears; y += step) {
    const limitMonths = y * 12;
    let tempSrc = lumpSum;
    let tempTgt = 0;
    
    for (let m = 0; m < limitMonths; m++) {
      if (tempSrc > transferAmount) {
        tempSrc = tempSrc * (1 + sRate) - transferAmount;
        tempTgt = (tempTgt + transferAmount) * (1 + tRate);
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
      'Total Portfolio': Math.round(tempSrc + tempTgt),
    });
  }

  if (yearsActive > 0 && (yearsActive % step !== 0)) {
    chartData.push({
      name: `Yr ${yearsActive}`,
      'Source Fund': Math.round(srcBalance),
      'Target Fund': Math.round(tgtBalance),
      'Total Portfolio': Math.round(srcBalance + tgtBalance),
    });
  }

  return {
    sourceFundRemaining: srcBalance,
    targetFundFinal: tgtBalance,
    monthsActive: months,
    yearsActive,
    remainingMonthsActive,
    chartData,
  };
}


// -----------------------------------------------------------------------------
// 4. RETIREMENT PLANNER & NEST-EGG FORECASTER
// -----------------------------------------------------------------------------
/**
 * Multi-Step Inflating Nest-Egg Formula:
 * 1. Future Monthly Expenses at Retirement age:
 *    F_EXP = CurrentExpenses * (1 + Inf_rate)^YearsToRetire
 * 
 * 2. Needed Retirement Corpus at retirement (Annuity with infinite or 20-year timeline, compounding post-retire):
 *    Real Rate of Return r_real = [ (1 + PostRetireReturn) / (1 + inflation) ] - 1
 *    Corpus = AnnualExpAtRetire * [ (1 - (1 + r_real)^-20) / r_real ]
 * 
 * 3. Required SIP Monthly Savings to achieve 'Corpus':
 *    MonthlySavings = Corpus / [ (((1 + r)^n - 1) / r) * (1 + r) ]
 */
export interface RetirementResult {
  corpusRequired: number;
  monthlySavingsRequired: number;
  monthlyExpensesAtRetire: number;
  investedCapital: number;
  estimatedReturnGrowth: number;
  chartData: Array<{ name: string; Invested: number; Value: number }>;
}

export function calculateRetirement(
  currentAge: number,
  retireAge: number,
  currentExpenses: number,
  inflationRate: number,
  preRetireReturnRate: number
): RetirementResult {
  const yearsToRetire = retireAge - currentAge;
  const monthlyExpensesAtRetire = currentExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
  const annualExpensesAtRetire = monthlyExpensesAtRetire * 12;

  // Assume a standard 8% return after retirement on safety portfolios
  const postRetireReturn = 8;
  const realRate = (1 + postRetireReturn / 100) / (1 + inflationRate / 100) - 1;
  
  const corpusRequired = Math.abs(realRate) < 0.0000001
    ? annualExpensesAtRetire * 20
    : annualExpensesAtRetire * ((1 - Math.pow(1 + realRate, -20)) / realRate);

  const r = preRetireReturnRate / 100 / 12;
  const n = yearsToRetire * 12;
  
  const monthlySavingsRequired = r === 0 
    ? corpusRequired / n 
    : corpusRequired / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

  const investedCapital = monthlySavingsRequired * 12 * yearsToRetire;
  const estimatedReturnGrowth = Math.max(0, corpusRequired - investedCapital);

  // Generate chart trajectory representation
  const chartData: Array<{ name: string; Invested: number; Value: number }> = [];
  const step = yearsToRetire <= 10 ? 1 : yearsToRetire <= 20 ? 2 : 5;

  for (let y = step; y < yearsToRetire; y += step) {
    const m = y * 12;
    const investedPct = monthlySavingsRequired * m;
    const progressValue = r === 0 
      ? investedPct 
      : monthlySavingsRequired * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
      
    chartData.push({
      name: `Age ${currentAge + y}`,
      Invested: Math.round(investedPct),
      Value: Math.round(progressValue),
    });
  }

  chartData.push({
    name: `Age ${retireAge}`,
    Invested: Math.round(investedCapital),
    Value: Math.round(corpusRequired),
  });

  return {
    corpusRequired,
    monthlySavingsRequired,
    monthlyExpensesAtRetire,
    investedCapital,
    estimatedReturnGrowth,
    chartData,
  };
}


// -----------------------------------------------------------------------------
// 5. EQUATED MONTHLY INSTALLMENT (EMI) OR AMORTIZATION MECHANIC
// -----------------------------------------------------------------------------
/**
 * Amortization Compound Rate Equation:
 * EMI = [ P * r * (1 + r)^n ] / [ (1 + r)^n - 1 ]
 * Where:
 *   P = Loan Principal Amount
 *   r = Monthly Interest Rate (annual rate / 12 / 100)
 *   n = Total loan term duration in months (years * 12)
 */
export interface EMIResult {
  monthlyEMI: number;
  totalPayment: number;
  totalInterest: number;
  interestPercentage: number;
  chartData: Array<{ name: string; 'Principal Paid': number; Balance: number }>;
}

export function calculateEMI(loanAmount: number, annualRate: number, tenureYears: number): EMIResult {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;

  const monthlyEMI = r === 0 
    ? loanAmount / n 
    : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const totalPayment = monthlyEMI * n;
  const totalInterest = totalPayment - loanAmount;
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const chartData: Array<{ name: string; 'Principal Paid': number; Balance: number }> = [];
  const step = tenureYears <= 10 ? 1 : tenureYears <= 20 ? 2 : 5;

  chartData.push({
    name: 'Start',
    'Principal Paid': 0,
    Balance: Math.round(loanAmount),
  });

  for (let y = step; y <= tenureYears; y += step) {
    const m = y * 12;
    let remainingBalance = 0;
    
    if (r === 0) {
      remainingBalance = loanAmount - (loanAmount * (m / n));
    } else {
      remainingBalance = loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, m)) / (Math.pow(1 + r, n) - 1);
    }
    
    remainingBalance = Math.max(0, remainingBalance);
    const principalPaid = loanAmount - remainingBalance;
    
    chartData.push({
      name: `Yr ${y}`,
      'Principal Paid': Math.round(principalPaid),
      Balance: Math.round(remainingBalance),
    });
  }

  if (tenureYears % step !== 0) {
    chartData.push({
      name: `Yr ${tenureYears}`,
      'Principal Paid': Math.round(loanAmount),
      Balance:0,
    });
  }

  return {
    monthlyEMI,
    totalPayment,
    totalInterest,
    interestPercentage,
    chartData,
  };
}


// -----------------------------------------------------------------------------
// 6. GOAL-BASED SIP PLANNER
// -----------------------------------------------------------------------------
/**
 * Reverse Future Value Solver for targeted SIP:
 * P = FV / [ (((1 + r)^n - 1) / r) * (1 + r) ]
 * Where:
 *   FV = Targeted future Goal amount
 *   r = Monthly expectation compounding return rate (annual / 12 / 100)
 *   n = Term duration in months (years * 12)
 *   P = Essential budget-saving amount needed monthly
 */
export interface GoalResult {
  monthlySavingsNeeded: number;
  totalSavingsInvested: number;
  estimatedGrowthReturns: number;
  chartData: Array<{ name: string; Invested: number; Value: number }>;
}

export function calculateGoal(targetAmount: number, years: number, expectedReturnRate: number): GoalResult {
  const r = expectedReturnRate / 100 / 12;
  const n = years * 12;

  const monthlySavingsNeeded = r === 0 
    ? targetAmount / n 
    : targetAmount / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

  const totalSavingsInvested = monthlySavingsNeeded * n;
  const estimatedGrowthReturns = Math.max(0, targetAmount - totalSavingsInvested);

  const chartData: Array<{ name: string; Invested: number; Value: number }> = [];
  const isShortHorizon = years <= 2;
  const limit = isShortHorizon ? years * 12 : years;

  for (let i = 1; i <= limit; i++) {
    const m = isShortHorizon ? i : i * 12;
    const investedPct = monthlySavingsNeeded * m;
    const progressValue = r === 0 
      ? investedPct 
      : monthlySavingsNeeded * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
      
    chartData.push({
      name: isShortHorizon ? `Mo ${m}` : `Yr ${i}`,
      Invested: Math.round(investedPct),
      Value: Math.round(progressValue),
    });
  }

  return {
    monthlySavingsNeeded,
    totalSavingsInvested,
    estimatedGrowthReturns,
    chartData,
  };
}
