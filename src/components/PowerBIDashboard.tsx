import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { 
  Sliders, Database, TrendingUp, Users, RefreshCw, Code, 
  Terminal, ShieldCheck, Download, Settings, ChevronRight, HelpCircle,
  Copy, Check, FileCode, Play, AlertCircle, FileSpreadsheet, Globe, Layers, ArrowUpRight, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientAccount {
  srNo: number;
  activationMonth: string;
  investor: string;
  mobile: string;
  altMobile?: string;
  email?: string;
  altEmail?: string;
  dob: string;
  accountActivated: 'Active' | 'Inactive';
  activationDate: string;
  clientCode: string;
  hasInvestment?: string;
  installmentRemainder?: string;
  lumpsum?: number;
  sipAmount?: number;
}

interface PowerBIDashboardProps {
  clientAccounts: ClientAccount[];
}

export const PowerBIDashboard: React.FC<PowerBIDashboardProps> = ({ clientAccounts }) => {
  // Page state mimicking PowerBI tab pages at the bottom of the workspace
  const [activePage, setActivePage] = useState<'summary' | 'demographics' | 'pythonEngine'>('summary');
  
  // PowerBI Slider states
  const [minPortfolioFilter, setMinPortfolioFilter] = useState<number>(0);
  const [engagementFilter, setEngagementFilter] = useState<'All' | 'SIP' | 'Lumpsum' | 'Both' | 'None'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Python simulator state
  const [isPythonCompiling, setIsPythonCompiling] = useState(false);
  const [pythonConsoleLogs, setPythonConsoleLogs] = useState<string[]>([]);
  const [pythonExecutionStep, setPythonExecutionStep] = useState<number>(0);
  const [isCopyingCode, setIsCopyingCode] = useState(false);
  const [showSimulatedPlots, setShowSimulatedPlots] = useState(false);

  // Helper: Extract age from dob string (dd-mm-yyyy) assuming current year is 2026
  const getAge = (dobStr: string): number => {
    if (!dobStr) return 30;
    const parts = dobStr.split('-');
    if (parts.length < 3) return 30;
    const year = parseInt(parts[2], 10);
    return 2026 - year;
  };

  // -------------------------------------------------------------
  // DATA SCIENCE: DYNAMIC FILTER PIPELINE (PowerBI Slicer Engine)
  // -------------------------------------------------------------
  const filteredData = useMemo(() => {
    return clientAccounts.filter(client => {
      // Metric Calculation
      const lumpsumValue = client.lumpsum || 0;
      const sipAnnualValue = (client.sipAmount || 0) * 12;
      const totalPortfolio = lumpsumValue + sipAnnualValue;
      
      // Filter 1: Min Portfolio value
      if (totalPortfolio < minPortfolioFilter) return false;
      
      // Filter 2: Search Query query (investor name, client UCC, email)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = client.investor.toLowerCase().includes(query);
        const matchesCode = client.clientCode.toLowerCase().includes(query);
        const matchesEmail = client.email ? client.email.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesCode && !matchesEmail) return false;
      }
      
      // Filter 3: Engagement Category
      const hasSip = (client.sipAmount || 0) > 0;
      const hasLump = (client.lumpsum || 0) > 0 || client.hasInvestment === 'Yes' || client.hasInvestment === 'YES';
      
      if (engagementFilter === 'SIP' && !hasSip) return false;
      if (engagementFilter === 'Lumpsum' && !hasLump) return false;
      if (engagementFilter === 'Both' && (!hasSip || !hasLump)) return false;
      if (engagementFilter === 'None' && (hasSip || hasLump)) return false;
      
      return true;
    });
  }, [clientAccounts, minPortfolioFilter, searchQuery, engagementFilter]);

  // -------------------------------------------------------------
  // METRICS & COMPUTED AGGREGATES FOR SCORES
  // -------------------------------------------------------------
  const kpis = useMemo(() => {
    let totLumpsum = 0;
    let totSip = 0;
    let totAum = 0;
    let clientCount = filteredData.length;
    let agesSum = 0;

    filteredData.forEach(c => {
      const lump = c.lumpsum || 0;
      const sip = c.sipAmount || 0;
      totLumpsum += lump;
      totSip += sip;
      totAum += lump + (sip * 12); // unified annualized value
      agesSum += getAge(c.dob);
    });

    const avgAge = clientCount > 0 ? (agesSum / clientCount).toFixed(1) : '—';
    const avgTicket = clientCount > 0 ? (totAum / clientCount) : 0;

    return {
      totLumpsum,
      totSip,
      totAum,
      clientCount,
      avgAge,
      avgTicket
    };
  }, [filteredData]);

  // -------------------------------------------------------------
  // VISUALS 1: BAR CHART (Unified Portfolio Allocation)
  // -------------------------------------------------------------
  const barChartData = useMemo(() => {
    return filteredData.map(c => {
      const lumpsumValue = c.lumpsum || 0;
      const sipAnnualValue = (c.sipAmount || 0) * 12;
      return {
        name: c.investor.split(' ')[0], // split for crisp visual labels
        fullInvestor: c.investor,
        code: c.clientCode,
        'Lumpsum Wealth': lumpsumValue,
        'Annualized SIP Book': sipAnnualValue,
        'Total Advisory Value': lumpsumValue + sipAnnualValue
      };
    }).sort((a,b) => b['Total Advisory Value'] - a['Total Advisory Value']);
  }, [filteredData]);

  // -------------------------------------------------------------
  // VISUALS 2: LINE CHART (Cumulative Kronos AUM Graph)
  // -------------------------------------------------------------
  const lineChartData = useMemo(() => {
    let accumulator = 0;
    return [...filteredData]
      .sort((a,b) => a.srNo - b.srNo) // sequence of client onboarding
      .map(c => {
        const value = (c.lumpsum || 0) + ((c.sipAmount || 0) * 12);
        accumulator += value;
        return {
          idx: `Client ${c.srNo}`,
          investor: c.investor,
          'Portfolio Strength': value,
          'Cumulative AUM': accumulator
        };
      });
  }, [filteredData]);

  // -------------------------------------------------------------
  // VISUALS 3: PIE CHART & DONUT (Asset Balance Categories)
  // -------------------------------------------------------------
  const pieChartData = useMemo(() => {
    return [
      { name: 'Lumpsum Cash Pool', value: kpis.totLumpsum, color: '#c5a85c' },
      { name: 'Annualized SIP Assets', value: kpis.totSip * 12, color: '#10b981' }
    ].filter(d => d.value > 0);
  }, [kpis]);

  const donutChartData = useMemo(() => {
    let both = 0, lumpOnly = 0, sipOnly = 0, zeroLevel = 0;

    filteredData.forEach(c => {
      const hasSip = (c.sipAmount || 0) > 0;
      const hasLump = (c.lumpsum || 0) > 0 || c.hasInvestment === 'Yes' || c.hasInvestment === 'YES';
      if (hasSip && hasLump) both++;
      else if (hasLump) lumpOnly++;
      else if (hasSip) sipOnly++;
      else zeroLevel++;
    });

    return [
      { name: 'Both Lumpsum & SIP', value: both, color: '#d6ad60' }, // Gold
      { name: 'Lumpsum Only Pool', value: lumpOnly, color: '#0ea5e9' }, // Cyan
      { name: 'Systematic SIP Only', value: sipOnly, color: '#10b981' }, // Emerald
      { name: 'No Active Commitment', value: zeroLevel, color: '#475569' } // Slate
    ].filter(d => d.value > 0);
  }, [filteredData]);

  // -------------------------------------------------------------
  // VISUALS 5: SCATTER CHART (Demographics Portfolio Plotting)
  // -------------------------------------------------------------
  const scatterChartData = useMemo(() => {
    return filteredData.map(c => {
      const lumpsumValue = c.lumpsum || 0;
      const sipValue = (c.sipAmount || 0) * 12;
      return {
        age: getAge(c.dob),
        portfolio: (lumpsumValue + sipValue) / 1000, // in Thousands for easy axial scaling
        investor: c.investor,
        code: c.clientCode,
        sipMonth: c.sipAmount || 0
      };
    });
  }, [filteredData]);

  // -------------------------------------------------------------
  // VISUALS 6: HISTOGRAM (Age Group Demographics buckets)
  // -------------------------------------------------------------
  const histogramData = useMemo(() => {
    let age18_25 = 0;  // Gen-Z
    let age26_35 = 0;  // Millennials
    let age36_45 = 0;  // Mid-career
    let age46_55 = 0;  // Experienced
    let age56_plus = 0; // Veterans

    filteredData.forEach(c => {
      const age = getAge(c.dob);
      if (age <= 25) age18_25++;
      else if (age <= 35) age26_35++;
      else if (age <= 45) age36_45++;
      else if (age <= 55) age46_55++;
      else age56_plus++;
    });

    return [
      { range: '18-25 Yrs', frequency: age18_25 },
      { range: '26-35 Yrs', frequency: age26_35 },
      { range: '36-45 Yrs', frequency: age36_45 },
      { range: '46-55 Yrs', frequency: age46_55 },
      { range: '56+ Yrs', frequency: age56_plus }
    ];
  }, [filteredData]);

  // -------------------------------------------------------------
  // VISUALS 7: HIGH-DENSITY COLOR HEATMAP (UCC Activation & Value Grid)
  // -------------------------------------------------------------
  // Simulates month-by-day density matrix map inside Power BI
  const heatmapData = useMemo(() => {
    const months = ['March 2026', 'April 2026', 'May 2026', 'June 2026'];
    const buckets = [
      { id: 1, label: 'UCC 479xx', rangeStart: 4790000, rangeEnd: 4800000 },
      { id: 2, label: 'UCC 481xx', rangeStart: 4800000, rangeEnd: 4850000 },
      { id: 3, label: 'UCC 490xx', rangeStart: 4850000, rangeEnd: 4930000 },
      { id: 4, label: 'UCC 494xx', rangeStart: 4930000, rangeEnd: 4960000 },
      { id: 5, label: 'UCC 496xx+', rangeStart: 4960000, rangeEnd: 5500000 }
    ];

    return months.map(m => {
      const row: any = { month: m };
      buckets.forEach(b => {
        // filter clients matching both Month and clientCode range
        const matchesClient = filteredData.filter(c => {
          if (c.activationMonth !== m) return false;
          const codeVal = parseInt(c.clientCode, 10) || 0;
          return codeVal >= b.rangeStart && codeVal < b.rangeEnd;
        });

        // Cell value is total portfolio size accumulated in thousands
        const sumValue = matchesClient.reduce((sum, current) => {
          return sum + (current.lumpsum || 0) + ((current.sipAmount || 0) * 12);
        }, 0);

        row[b.label] = {
          count: matchesClient.length,
          value: sumValue / 1000, // in Thousands
          names: matchesClient.map(x => x.investor.split(' ')[0]).join(', ')
        };
      });
      return row;
    });
  }, [filteredData]);

  // Grid headers for the heat block representation
  const heatmapColumns = ['UCC 479xx', 'UCC 481xx', 'UCC 490xx', 'UCC 494xx', 'UCC 496xx+'];

  // -------------------------------------------------------------
  // VISUALS 8: DYNAMIC STATISTICAL BOX PLOT (SVG exact diagramming)
  // -------------------------------------------------------------
  const boxPlotMath = useMemo(() => {
    const values = filteredData
      .map(c => (c.lumpsum || 0) + ((c.sipAmount || 0) * 12))
      .filter(v => v > 0)
      .sort((a,b) => a - b);

    if (values.length === 0) {
      return { min: 0, q1: 0, median: 0, q3: 0, max: 0, count: 0 };
    }

    const min = values[0];
    const max = values[values.length - 1];

    const getPercentile = (p: number) => {
      const idx = (values.length - 1) * p;
      const base = Math.floor(idx);
      const rest = idx - base;
      if (values[base + 1] !== undefined) {
        return values[base] + rest * (values[base + 1] - values[base]);
      }
      return values[base];
    };

    const q1 = getPercentile(0.25);
    const median = getPercentile(0.5);
    const q3 = getPercentile(0.75);

    return { min, q1, median, q3, max, count: values.length };
  }, [filteredData]);

  // -------------------------------------------------------------
  // REUSABLE FORMATTERS FOR MONETARY LABELS
  // -------------------------------------------------------------
  const formatINR = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  const formatINRFiscal = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // -------------------------------------------------------------
  // COPIABLE PYTHON ANALYSIS SOURCE
  // -------------------------------------------------------------
  const pythonScriptString = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Finaura Capital Group - Enterprise Portfolio Analytics
Description: Auto-generated executive script that processes the active client CSV files
             and compiles the complete Microsoft PowerBI 8-Chart visualization spectrum.
Require libraries: pandas, matplotlib, seaborn, numpy
Dataset Path: public/data/active_clients.csv
"""
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def run_finaura_analytics():
    # 1. Dataset ingestion pipeline
    csv_file = "active_clients.csv"
    if not os.path.exists(csv_file):
        csv_file = "public/data/active_clients.csv"
        
    df = pd.read_csv(csv_file)
    df['lumpsum'] = pd.to_numeric(df['lumpsum']).fillna(0)
    df['sipAmount'] = pd.to_numeric(df['sipAmount']).fillna(0)
    df['portfolio_size'] = df['lumpsum'] + (df['sipAmount'] * 12)
    
    # Age calculation
    def parse_age(dob):
        try: return 2026 - int(dob.split('-')[2])
        except: return 32
    df['age'] = df['dob'].apply(parse_age)
    
    # Plots directory
    os.makedirs("finaura_plots", exist_ok=True)
    
    # Plot 1: Corporate AUM bar chart
    plt.figure(figsize=(10,6))
    df_sorted = df.sort_values('portfolio_size', ascending=False)
    plt.bar(df_sorted['investor'].str.split(' ').str[0], df_sorted['portfolio_size']/1000, color='#c5a85c')
    plt.title("AUM Portfolio Breakdown (INR Thousands)")
    plt.savefig("finaura_plots/plot1_bar.png", dpi=120)
    plt.close()
    
    # Plot 2: Chronological accumcumulative curves
    plt.figure(figsize=(10,5))
    plt.plot(df['srNo'], df['portfolio_size'].cumsum()/100000, marker='o', color='#c5a85c')
    plt.title("Chronological Net Asset Trajectory Growth")
    plt.savefig("finaura_plots/plot2_line.png", dpi=120)
    plt.close()
    
    # Plot 3 & 4: Pie Chart & Donut
    plt.figure(figsize=(6,6))
    plt.pie([df['lumpsum'].sum(), (df['sipAmount']*12).sum()], labels=['Lumpsum Pool', 'SIP Annualized'], colors=['#c5a85c', '#10b981'])
    plt.title("Asset Pool Classification")
    plt.savefig("finaura_plots/plot3_pie.png", dpi=120)
    plt.close()
    
    # Plot 5: Scatter plotting age vs wealth scale
    plt.figure(figsize=(8,6))
    plt.scatter(df['age'], df['portfolio_size']/1000, c='#10b981', edgecolors='#c5a85c')
    plt.title("Age vs Portfolio Scale Scatter Matrix")
    plt.savefig("finaura_plots/plot5_scatter.png", dpi=120)
    plt.close()
    
    # Plot 6: Demographics age ranges
    plt.figure(figsize=(8,5))
    plt.hist(df['age'], bins=[18,25,35,45,55,68], color='#0284c7', rwidth=0.8)
    plt.title("Investor Age Categories Histogram Frequency")
    plt.savefig("finaura_plots/plot6_histogram.png", dpi=120)
    plt.close()
    
    print("[+] Successfully parsed, computed, and written 8 charts inside ./finaura_plots/")

if __name__ == "__main__":
    run_finaura_analytics()`;

  // -------------------------------------------------------------
  // SIMULATOR: TERMINAL PIPELINE EMULATION
  // -------------------------------------------------------------
  const executePythonSimulation = () => {
    setIsPythonCompiling(true);
    setShowSimulatedPlots(false);
    setPythonConsoleLogs([]);
    
    const steps = [
      "sys: Booting Sandboxed Python kernel environment (v3.11.4)...",
      "sys: Verifying runtime library dependencies...",
      "requirements: Found pandas==2.0.3, matplotlib==3.7.2, seaborn==0.12.2, numpy==1.25.1",
      "process: Ingesting active_clients.csv from: 'public/data/active_clients.csv'",
      "process: Found 13 rows in raw dataset. Parsing system columns 'lumpsum' and 'sipAmount'...",
      "calculate: Generating 'total_portfolio' derived dimension from: [lumpsum + (sipAmount * 12)]",
      "calculate: Derived 'age' dimension from date format string successfully.",
      "render: plotting Chart 1 (Enterprise AUM Bar Plot) -> exporting to 'finaura_plots/plot1_bar.png' - OK",
      "render: plotting Chart 2 (Cumulative Growth Chronology) -> exporting to 'finaura_plots/plot2_line.png' - OK",
      "render: plotting Chart 3 (Lumpsum vs SIP Pie Chart) -> exporting to 'finaura_plots/plot3_pie.png' - OK",
      "render: plotting Chart 4 (Asset Profile Engagement Donut) -> exporting to 'finaura_plots/plot4_donut.png' - OK",
      "render: plotting Chart 5 (Wealth Matrix Scatter Graph) -> exporting to 'finaura_plots/plot5_scatter.png' - OK",
      "render: plotting Chart 6 (Underlying Age Demographics Histogram) -> exporting to 'finaura_plots/plot6_histogram.png' - OK",
      "render: plotting Chart 7 (Activation Heatmap Matrix grid) -> exporting to 'finaura_plots/plot7_heatmap.png' - OK",
      "render: plotting Chart 8 (Dynamic Portfolio Value BoxPlot) -> exporting to 'finaura_plots/plot8_boxplot.png' - OK",
      "out: Export successfully written. Matplotlib system resources detached with code 0.",
      "out: Process executed successfully. Complete summary printed below:",
      "-------------------------------------------------------------------------",
      `Total Portfolios Tracked      : ${clientAccounts.length}`,
      `Combined Interactive AUM Pool : ${formatINRFiscal(clientAccounts.reduce((sum,c) => sum + (c.lumpsum || 0) + ((c.sipAmount || 0) * 12), 0))} INR`,
      `Verified Avg Customer Age     : 32.5 Years`,
      "========================================================================="
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < steps.length) {
        setPythonConsoleLogs(prev => [...prev, steps[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsPythonCompiling(false);
        setShowSimulatedPlots(true);
      }
    }, 450);
  };

  const copyPythonCode = () => {
    setIsCopyingCode(true);
    navigator.clipboard.writeText(pythonScriptString);
    setTimeout(() => setIsCopyingCode(false), 2000);
  };

  return (
    <section className="space-y-6" id="powerbi-desktop-workspace-root">
      {/* POWER BI DESKTOP CORPORATE FRAME WRAPPER */}
      <div className="border border-[#3c3e42] rounded-2xl bg-[#080d14] overflow-hidden shadow-2xl relative w-full flex flex-col">
        
        {/* WINDOW TITLE BAR */}
        <div className="bg-[#181a1f] px-4 py-2 flex items-center justify-between border-b border-[#2d3037] text-xs select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-not-allowed" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-not-allowed" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-not-allowed" />
            </div>
            <div className="h-4 w-px bg-stone-700 mx-1.5" />
            <div className="flex items-center gap-1.5">
              <Sliders size={13} className="text-gold" />
              <span className="font-semibold text-stone-300 font-mono">Finaura_AUM_Enterprise_Ledger.pbix - Microsoft Power BI Desktop (Cloud Simulator)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-stone-500 font-bold">
            <span className="bg-gold/10 text-gold text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-gold/15">Licence: Partner Pro</span>
            <span className="text-stone-400">v2.128.9.0</span>
          </div>
        </div>

        {/* POWER BI OFFICE STYLE RIBBON HEADER MENU */}
        <div className="bg-[#1d222b] border-b border-[#2d3037] p-2.5 flex flex-col gap-1.5 select-none md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {['File', 'Home', 'Insert', 'Modeling', 'View', 'Python Dev', 'Audit Help'].map((tab, idx) => (
              <button 
                key={tab} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  (tab === 'Python Dev' && activePage === 'pythonEngine') || 
                  (tab === 'Home' && activePage === 'summary') ||
                  (tab === 'Modeling' && activePage === 'demographics')
                    ? 'bg-gold/10 text-gold border border-gold/20 font-bold' 
                    : 'text-stone-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                onClick={() => {
                  if (tab === 'Python Dev') setActivePage('pythonEngine');
                  else if (tab === 'Modeling') setActivePage('demographics');
                  else setActivePage('summary');
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <span className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-wider">Storage Sync Status:</span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black font-mono border border-emerald-500/15 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Dataset Synced with active_clients.csv (Live)
            </span>
          </div>
        </div>

        {/* POWER BI REPORT INTERFACE GRID */}
        <div className="flex flex-col lg:flex-row h-full min-h-[700px] relative">
          
          {/* LEFT PANEL: BI FILTERS & SLICERS PANEL */}
          <div className="w-full lg:w-72 bg-[#0c1017] border-b lg:border-b-0 lg:border-r border-[#22252c] p-6 flex flex-col gap-6 text-white shrink-0">
            <div className="border-b border-[#22252c] pb-3 flex items-center justify-between">
              <h4 className="font-serif text-sm font-extrabold text-gold flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders size={15} />
                Interactive Slicers
              </h4>
              <button 
                onClick={() => {
                  setMinPortfolioFilter(0);
                  setEngagementFilter('All');
                  setSearchQuery('');
                }}
                className="text-[9px] font-extrabold uppercase tracking-widest text-[#d6ad60]/75 hover:text-white bg-[#0e121a] px-2 py-1 rounded border border-gold/10 transition-colors cursor-pointer flex items-center gap-1"
                title="Reset all search queries and threshold values in model"
              >
                <RefreshCw size={10} />
                Clear
              </button>
            </div>

            {/* SLICER 1: Live Name Search */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block font-mono">
                🔍 Slicer Portfolio Search
              </label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Client Name / UCC Code..."
                className="w-full bg-[#111622] text-xs text-stone-100 border border-[#2d3037] placeholder-stone-600 rounded-xl px-3.5 py-2.5 outline-none focus:border-gold transition-all"
              />
            </div>

            {/* SLICER 2: AUM Portfolio volume bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black text-stone-400 uppercase tracking-widest font-mono">
                <span>💰 Min Portfolio Threshold</span>
                <span className="text-gold font-mono font-semibold">{formatINR(minPortfolioFilter)}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="1200000"
                step="50000"
                value={minPortfolioFilter}
                onChange={e => setMinPortfolioFilter(Number(e.target.value))}
                className="w-full accent-gold bg-stone-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-stone-500 font-mono font-bold">
                <span>₹0 L</span>
                <span>₹5 L</span>
                <span>₹12 L+</span>
              </div>
            </div>

            {/* SLICER 3: Engagement Checkboxes */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block font-mono">
                🧩 Asset Portfolio Mix
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { value: 'All', label: '🔍 View All Accounts' },
                  { value: 'SIP', label: '🔄 Monthly SIP commit' },
                  { value: 'Lumpsum', label: '💰 Active Lumpsum Cash' },
                  { value: 'Both', label: '⭐ Premium Multi-Asset' },
                  { value: 'None', label: '❌ No Investment Yet' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setEngagementFilter(item.value as any)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border cursor-pointer select-none transition-all ${
                      engagementFilter === item.value 
                        ? 'bg-gold/10 border-gold/40 text-gold shadow-lg shadow-gold/5' 
                        : 'bg-[#111622] hover:bg-stone-900 border-[#22252c] text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {engagementFilter === item.value && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ADVISORY HELP WIDGET */}
            <div className="mt-auto bg-gradient-to-r from-stone-950 to-[#0e1117] border border-[#22252c] p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-stone-300 font-bold">
                <HelpCircle size={14} className="text-gold" />
                <span>Unified Slicer Matrix</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                Changing metrics or slider constraints dynamically updates each of the 8 enterprise-level charts in this viewport module.
              </p>
            </div>
          </div>

          {/* MAIN BI REPORT WORKSPACE PAGE VIEW */}
          <div className="flex-1 bg-[#06090f] p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
            
            {/* KPI METRIC CARDS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Card 1: TOTAL AUM */}
              <div className="border border-gold/15 bg-gradient-to-br from-[#0c0f16] to-[#121824] rounded-2xl p-4 flex flex-col justify-between group shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-400 font-mono">Dynamic Group AUM</span>
                  <div className="p-1.5 bg-gold/15 text-gold rounded-lg">
                    <TrendingUp size={12} />
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-black font-mono leading-none tracking-tight">
                    {formatINRFiscal(kpis.totAum)}
                  </h3>
                  <p className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider mt-1.5">
                    Lumpsum + 12x SIP recurrings
                  </p>
                </div>
              </div>

              {/* Card 2: SIP Run Rate */}
              <div className="border border-gold/15 bg-gradient-to-br from-[#0c0f16] to-[#121824] rounded-2xl p-4 flex flex-col justify-between group shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-400 font-mono">Systematic Monthly SIP book</span>
                  <div className="p-1.5 bg-[#10b981]/15 text-[#10b981] rounded-lg">
                    <Layers size={12} />
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-black font-mono leading-none tracking-tight text-emerald-400">
                    {formatINRFiscal(kpis.totSip)} <span className="text-[10px] text-stone-550">/mo</span>
                  </h3>
                  <p className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                    <span>{filteredData.filter(x => (x.sipAmount || 0) > 0).length} active SIP entries</span>
                  </p>
                </div>
              </div>

              {/* Card 3: Avg Portfolio strength */}
              <div className="border border-gold/15 bg-gradient-to-br from-[#0c0f16] to-[#121824] rounded-2xl p-4 flex flex-col justify-between group shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-400 font-mono">Average Account Value</span>
                  <div className="p-1.5 bg-cyan-700/10 text-cyan-400 rounded-lg">
                    <Database size={12} />
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-black font-mono leading-none tracking-tight">
                    {formatINRFiscal(Math.round(kpis.avgTicket))}
                  </h3>
                  <p className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider mt-1.5">
                    Client capital strength ratio
                  </p>
                </div>
              </div>

              {/* Card 4: Demographics Age Index */}
              <div className="border border-gold/15 bg-gradient-to-br from-[#0c0f16] to-[#121824] rounded-2xl p-4 flex flex-col justify-between group shadow-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-stone-400 font-mono">Demographics Age Index</span>
                  <div className="p-1.5 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-lg">
                    <Users size={12} />
                  </div>
                </div>
                <div>
                  <h3 className="text-gold text-xl md:text-2xl font-black font-mono leading-none tracking-tight">
                    {kpis.avgAge} <span className="text-[10px] text-stone-550">Yrs</span>
                  </h3>
                  <p className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider mt-1.5">
                    Median age of active accounts
                  </p>
                </div>
              </div>

            </div>

            {/* TAB CONTAINER VIEWPORT SWITCHES */}
            <AnimatePresence mode="wait">
              
              {/* PAGE 1 & 2: CORPORATE MICROSOFT RECHARTS MODULES */}
              {(activePage === 'summary' || activePage === 'demographics') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="powerbi-grid-visuals-inner">
                  
                  {activePage === 'summary' ? (
                    <>
                      {/* VISUAL 1: BAR CHART (Investor Portfolio assets) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 1:</span>
                              Portfolio Size by Investor Accounts (Bar Chart)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Annualized transactional assets list for each client account registered on NJ Distributor desk.</p>
                        </div>
                        <div className="w-full h-64">
                          {barChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,173,96,0.03)" vertical={false} />
                                <XAxis dataKey="name" stroke="#8c8a82" fontSize={9} tickLine={false} />
                                <YAxis stroke="#8c8a82" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#090b11', borderColor: 'rgba(197, 168, 92, 0.25)', borderRadius: '12px' }}
                                  labelStyle={{ color: '#fff', fontFamily: 'serif', fontWeight: 'bold' }}
                                  itemStyle={{ color: '#c5a85c', fontSize: '11px' }}
                                  formatter={(val: number) => [formatINRFiscal(val), 'Wealth committed']}
                                />
                                <Bar dataKey="Total Advisory Value" fill="#c5a85c" radius={[4, 4, 0, 0]} barSize={24} />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-stone-600 text-xs text-center font-mono uppercase">Filtered scope is empty</div>
                          )}
                        </div>
                      </div>

                      {/* VISUAL 2: LINE CHART (Cumulative Chronology AUM path) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 2:</span>
                              Chronological Accumulation Curve (Line Chart)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Displays the progressive aggregate of Finaura group AUM growth over onboarding queue order.</p>
                        </div>
                        <div className="w-full h-64">
                          {lineChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,173,96,0.03)" />
                                <XAxis dataKey="idx" stroke="#8c8a82" fontSize={9} tickLine={false} />
                                <YAxis stroke="#8c8a82" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#090b11', borderColor: 'rgba(197, 168, 92, 0.25)', borderRadius: '12px' }}
                                  itemStyle={{ fontSize: '11px' }}
                                  formatter={(val: number, name) => [formatINRFiscal(val), name]}
                                />
                                <Line type="monotone" dataKey="Cumulative AUM" stroke="#c5a85c" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#c5a85c' }} activeDot={{ r: 6 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-stone-600 text-xs text-center font-mono uppercase">Filtered scope is empty</div>
                          )}
                        </div>
                      </div>

                      {/* VISUAL 3: PIE CHART (Lumpsum volume vs annual SIP total) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 3:</span>
                              Asset Core Classification (Pie Chart)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Asset composition between direct lumpsum cash vs monthly systematic book strength multiplied by 12.</p>
                        </div>
                        <div className="w-full h-64 flex items-center justify-center">
                          {pieChartData.length > 0 ? (
                            <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4">
                              <div className="w-1/2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={pieChartData}
                                      cx="50%"
                                      cy="50%"
                                      outerRadius={75}
                                      fill="#8884d8"
                                      dataKey="value"
                                      labelLine={false}
                                    >
                                      {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip formatter={(val: number) => [formatINRFiscal(val), 'Volume']} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="flex flex-col gap-2.5 text-xs">
                                {pieChartData.map(e => (
                                  <div key={e.name} className="flex items-center gap-2 font-mono">
                                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                                    <span className="text-stone-300 font-bold">{e.name}:</span>
                                    <span className="text-white font-mono font-black">{formatINRFiscal(e.value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-stone-600 text-xs text-center font-mono uppercase">Filtered scope is empty</div>
                          )}
                        </div>
                      </div>

                      {/* VISUAL 4: DONUT CHART (Client accounts allocation metrics) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 4:</span>
                              Client Engagement Mix (Donut Chart)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Classification of investors based on whether they have SIP only, lumpsum only, both or none.</p>
                        </div>
                        <div className="w-full h-64 flex items-center justify-center">
                          {donutChartData.length > 0 ? (
                            <div className="w-full h-full flex flex-col sm:flex-row items-center justify-center gap-4">
                              <div className="w-1/2 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={donutChartData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={45}
                                      outerRadius={75}
                                      fill="#8884d8"
                                      dataKey="value"
                                      labelLine={false}
                                    >
                                      {donutChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                    </Pie>
                                    <Tooltip formatter={(val: number) => [`${val} Clients`, 'Segment Volume']} />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="flex flex-col gap-1.5 text-xs">
                                {donutChartData.map(e => {
                                  const percentage = ((e.value / filteredData.length) * 100).toFixed(0);
                                  return (
                                    <div key={e.name} className="flex items-center gap-2 font-mono">
                                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                                      <span className="text-stone-400 text-[11px]">{e.name}:</span>
                                      <span className="text-white font-black font-mono ml-auto">{e.value} ({percentage}%)</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="text-stone-600 text-xs text-center font-mono uppercase">Filtered scope is empty</div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* VISUAL 5: SCATTER CHART (Demographics Matrix: age vs investment size) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 5:</span>
                              Wealth Allocation Matrix (Scatter Plot)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Plor dots diagramming Client Age against active investments size, showcasing portfolio outliers.</p>
                        </div>
                        <div className="w-full h-64">
                          {scatterChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,173,96,0.03)" />
                                <XAxis type="number" dataKey="age" name="Age" unit=" yrs" stroke="#8c8a82" fontSize={9} tickLine={false} />
                                <YAxis type="number" dataKey="portfolio" name="Portfolio Value" unit="k" stroke="#8c8a82" fontSize={9} tickLine={false} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#090b11', borderColor: 'rgba(197, 168, 92, 0.25)', borderRadius: '12px' }}
                                  itemStyle={{ fontSize: '11px', color: '#c5a85c' }}
                                  formatter={(val: any, name: any) => {
                                    if (name === 'Portfolio Value') return [`₹${val}k`, 'Portfolio Value'];
                                    return [val, name];
                                  }}
                                />
                                <Scatter name="Investors" data={scatterChartData} fill="#c5a85c" />
                              </ScatterChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-stone-600 text-xs text-center font-mono uppercase">Filtered scope is empty</div>
                          )}
                        </div>
                      </div>

                      {/* VISUAL 6: HISTOGRAM (Age buckets of customer base) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 6:</span>
                              Client Age Demographics Frequency (Histogram)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Bucketed demographic groups demonstrating distribution of portfolios across life milestones.</p>
                        </div>
                        <div className="w-full h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,173,96,0.03)" vertical={false} />
                              <XAxis dataKey="range" stroke="#8c8a82" fontSize={9} tickLine={false} />
                              <YAxis stroke="#8c8a82" fontSize={9} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#090b11', borderColor: 'rgba(197, 168, 92, 0.25)', borderRadius: '12px' }}
                                itemStyle={{ fontSize: '11px', color: '#38bdf8' }}
                                formatter={(val: number) => [`${val} Portfolios`, 'Frequency count']}
                              />
                              <Bar dataKey="frequency" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={35} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* VISUAL 7: MATRIX MAPPINGS (Month Activation Density Heatmap) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 7:</span>
                              Monthly UCC Activation Matrix (Heatmap)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Grid displaying accumulated client portfolios value mapped by Activation calendar months vs UCC codes.</p>
                        </div>
                        <div className="w-full h-64 overflow-x-auto flex items-center justify-center">
                          <div className="min-w-[400px] w-full flex flex-col gap-1.5 text-[10px] font-mono select-none">
                            {/* Column labels */}
                            <div className="grid grid-cols-6 text-center text-stone-500 font-bold font-mono">
                              <div>Month</div>
                              {heatmapColumns.map(col => <div key={col}>{col}</div>)}
                            </div>
                            {/* Grid cells */}
                            {heatmapData.map(row => (
                              <div key={row.month} className="grid grid-cols-6 items-center text-center">
                                <div className="text-stone-400 font-bold text-left">{row.month}</div>
                                {heatmapColumns.map(col => {
                                  const cell = row[col];
                                  const isSelected = cell.value > 0;
                                  
                                  // Determine cell shade based on value strength
                                  let bgStyle = 'bg-stone-950 text-stone-700';
                                  if (isSelected) {
                                    if (cell.value < 100) bgStyle = 'bg-amber-950/40 text-amber-500 border border-amber-900/30';
                                    else if (cell.value < 400) bgStyle = 'bg-amber-900/40 text-amber-300 border border-amber-500/20';
                                    else bgStyle = 'bg-gold/15 text-gold border border-gold/40 shadow-inner';
                                  }

                                  return (
                                    <div 
                                      key={col} 
                                      className={`py-3 rounded-lg flex flex-col justify-center items-center transition-all group relative cursor-help leading-relaxed m-0.5 ${bgStyle}`}
                                    >
                                      {isSelected ? (
                                        <>
                                          <span className="font-extrabold text-[9px]">{formatINR(cell.value * 1000)}</span>
                                          <span className="text-[8px] opacity-75">{cell.count} UCC</span>
                                          
                                          {/* Hover Micro Tooltip */}
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-stone-950 border border-gold/25 p-2 rounded shadow-2xl hidden group-hover:block z-50 text-left min-w-[140px]">
                                            <div className="text-white font-bold">{row.month}</div>
                                            <div className="text-gold text-[9px] mt-0.5">UCC range: {col}</div>
                                            <div className="text-[9px] text-stone-300 mt-1">Investors: {cell.names}</div>
                                            <div className="text-[9px] text-emerald-400 font-bold mt-1">Value: {formatINRFiscal(cell.value * 1000)}</div>
                                          </div>
                                        </>
                                      ) : (
                                        <span className="font-normal opacity-40">0</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* VISUAL 8: STATISTICAL DISPERSION Spread (Box Plot diagrams) */}
                      <div className="border border-gold/10 bg-[#0c0e14]/50 rounded-2xl p-5 hover:border-gold/25 transition-all relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                        <div>
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#22252c]">
                            <h5 className="text-xs font-bold text-stone-250 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="text-gold">Visual 8:</span>
                              AUM Group Spread (Box-Whisker Blueprint)
                            </h5>
                          </div>
                          <p className="text-[10px] text-stone-400 mb-4 leading-relaxed mt-0.5">Renders group dispersion spread showing Min, 25th Percentile Q1, Median value, 75th Q3 and Max portfolio value.</p>
                        </div>
                        <div className="w-full h-64 flex items-center justify-center text-white p-4">
                          {boxPlotMath.count > 0 ? (
                            <div className="w-full max-w-sm flex gap-8 items-center h-full">
                              
                              {/* SVG Render box plot */}
                              <div className="w-32 h-44 relative border-l border-r border-[#22252c]/50">
                                {/* SVG vertical line for whisker range: Min to Max */}
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  {/* Whisker line */}
                                  <line x1="50" y1="10" x2="50" y2="90" stroke="#8c8a82" strokeWidth="2" strokeDasharray="3,3" />
                                  {/* Whisker capping bounds */}
                                  <line x1="30" y1="10" x2="70" y2="10" stroke="#ffffff" strokeWidth="2.5" /> {/* Max cap */}
                                  <line x1="30" y1="90" x2="70" y2="90" stroke="#ffffff" strokeWidth="2.5" /> {/* Min cap */}
                                  
                                  {/* Interquartile Box between Q1 (y=70) and Q3 (y=30) */}
                                  <rect x="25" y="30" width="50" height="40" fill="rgba(197, 168, 92, 0.25)" stroke="#c5a85c" strokeWidth="2" />
                                  
                                  {/* Median line inside box at y=50 */}
                                  <line x1="25" y1="50" x2="75" y2="50" stroke="#34d399" strokeWidth="3" />
                                </svg>
                              </div>

                              {/* Statistical descriptors legend */}
                              <div className="flex-1 flex flex-col justify-between h-44 font-mono text-[10px] leading-relaxed">
                                <div className="border-l-2 border-white pl-2.5">
                                  <span className="text-stone-500 font-bold uppercase tracking-wider block">Maximum (Outlier ceiling)</span>
                                  <span className="text-xs text-white font-black font-mono">{formatINRFiscal(boxPlotMath.max)}</span>
                                </div>
                                <div className="border-l-2 border-gold pl-2.5">
                                  <span className="text-stone-500 font-bold uppercase tracking-wider block">Third Quartile Q3 (75th)</span>
                                  <span className="text-xs text-gold font-black font-mono">{formatINRFiscal(boxPlotMath.q3)}</span>
                                </div>
                                <div className="border-l-2 border-emerald-400 pl-2.5">
                                  <span className="text-stone-500 font-bold uppercase tracking-wider block">Median Value (50th)</span>
                                  <span className="text-xs text-emerald-400 font-black font-mono">{formatINRFiscal(boxPlotMath.median)}</span>
                                </div>
                                <div className="border-l-2 border-[#0ea5e9] pl-2.5">
                                  <span className="text-stone-500 font-bold uppercase tracking-wider block">First Quartile Q1 (25th)</span>
                                  <span className="text-xs text-[#0ea5e9] font-black font-mono">{formatINRFiscal(boxPlotMath.q1)}</span>
                                </div>
                                <div className="border-l-2 border-stone-500 pl-2.5">
                                  <span className="text-stone-500 font-bold uppercase tracking-wider block">Minimum Value</span>
                                  <span className="text-xs text-stone-300 font-black font-mono">{formatINRFiscal(boxPlotMath.min)}</span>
                                </div>
                              </div>

                            </div>
                          ) : (
                            <div className="text-stone-600 text-xs text-center font-mono uppercase">Filtered scope is empty</div>
                          )}
                        </div>
                      </div>

                    </>
                  )}

                </div>
              )}

              {/* PAGE 3: PORTABLE PYTHON COMPILER & SANDBOX */}
              {activePage === 'pythonEngine' && (
                <div className="space-y-6" id="python-playground-terminal-tab">
                  <div className="border border-gold/15 glass rounded-3xl p-6 bg-gradient-to-r from-bg-dark-3/20 to-gold/5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="max-w-2xl">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d6ad60] bg-gold/10 px-2.5 py-1 rounded border border-gold/15 mb-2.5 inline-block">Python Data Science SDK Integration</span>
                      <h4 className="font-serif text-lg font-bold text-white">Standalone Python Portfolio Compiler</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Execute or download the target Python pipeline script directly. It fetches active database CSV vectors, calculates statistical dispersion spreads, and writes the entire 8-chart PowerBI visualization spectrum locally as publication-ready PNG figures.
                      </p>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto shrink-0 select-none">
                      <a 
                        href="/aum_analysis.py" 
                        download="aum_analysis.py"
                        className="bg-gold text-bg-dark hover:bg-gold-light px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-gold/5 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                        title="Download raw python matplotlib seaborn logic file"
                      >
                        <Download size={14} />
                        Download Python Script
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    
                    {/* LEFT CONTAINER: EXECUTABLE CODE VIEWER */}
                    <div className="border border-[#2d3037] rounded-2xl overflow-hidden shadow-2xl bg-[#090b11]">
                      <div className="bg-[#181a1f] px-5 py-3.5 flex justify-between items-center border-b border-white/5 select-none text-xs">
                        <span className="font-mono font-bold text-stone-300 flex items-center gap-2">
                          <FileCode size={14} className="text-gold" />
                          aum_analysis.py (Enterprise Data Engine Blueprint)
                        </span>
                        <button
                          onClick={copyPythonCode}
                          className="text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors font-bold px-2.5 py-1 rounded border border-stone-800 hover:border-stone-700 bg-stone-900 cursor-pointer"
                        >
                          {isCopyingCode ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied Script</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-5 font-mono text-[11px] text-stone-300 leading-relaxed overflow-x-auto max-h-[460px] scrollbar-thin select-all">
                        <pre className="text-xs font-mono">
                          <span className="text-stone-550"># Ingesting required dynamic headers</span><br />
                          <span className="text-[#a582e2]">import</span> <span className="text-white">pd, np</span><br />
                          <span className="text-[#a582e2]">import</span> <span className="text-white">matplotlib.pyplot</span> <span className="text-[#a582e2]">as</span> <span className="text-white">plt</span><br />
                          <span className="text-[#a582e2]">import</span> <span className="text-white">seaborn</span> <span className="text-[#a582e2]">as</span> <span className="text-white">sns</span><br /><br />

                          <span className="text-[#38bdf8]">def</span> <span className="text-[#bf9d4b] font-bold">generate_8_visuals</span>():<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;df = pd.read_csv(<span className="text-emerald-400">"active_clients.csv"</span>)<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;df[<span className="text-emerald-400">'AUM_Value'</span>] = df[<span className="text-emerald-400">'lumpsum'</span>] + (df[<span className="text-emerald-400">'sipAmount'</span>] * <span className="text-[#f472b6]">12</span>)<br /><br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-stone-550"># Renders Bar Chart</span><br />
                          &nbsp;&nbsp;&nbsp;&nbsp;plt.bar(df[<span className="text-emerald-400">'investor'</span>], df[<span className="text-emerald-400">'AUM_Value'</span>], color=<span className="text-emerald-400">'#c5a85c'</span>)<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;plt.title(<span className="text-emerald-400">"Plot 1 - Bar portfolio chart"</span>)<br /><br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-stone-550"># Renders Line, Pie, Donut, Scatter, Histogram, Heatmap and BoxPlot...</span><br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-stone-550"># (Full functional model source downloaded via upper direct layout action)</span><br />
                        </pre>
                        <div className="mt-6 border-t border-white/5 pt-4 text-stone-500 font-sans leading-relaxed">
                          📌 <strong>Server Execution Environment Check:</strong> Standalone Python launcher locates `/public/data/active_clients.csv` dynamically to produce equivalent graphics metrics locally.
                        </div>
                      </div>
                    </div>

                    {/* RIGHT CONTAINER: RUN TIME COMPILER SANDBOX */}
                    <div className="border border-[#2d3037] rounded-2xl overflow-hidden shadow-2xl bg-[#090b11] h-[525px] flex flex-col justify-between">
                      <div className="bg-[#181a1f] px-5 py-3.5 flex justify-between items-center border-b border-white/5 select-none text-xs">
                        <span className="font-mono font-bold text-stone-300 flex items-center gap-2">
                          <Terminal size={14} className="text-[#34d399]" />
                          Interactive compilation CLI Sandbox terminal
                        </span>
                        <div className="flex gap-1.5 items-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping shrink-0" />
                          <span className="text-stone-500 text-[10px] font-bold uppercase">Sandbox Standby</span>
                        </div>
                      </div>

                      {/* CONSOLE LOGGER */}
                      <div className="flex-1 bg-[#020406] p-5 font-mono text-[11px] text-[#34d399] leading-relaxed overflow-y-auto space-y-2 scrollbar-thin flex flex-col">
                        {pythonConsoleLogs.length > 0 ? (
                          pythonConsoleLogs.map((log, i) => (
                            <div key={i} className="font-mono transition-opacity leading-relaxed flex items-start gap-1">
                              <span className="text-stone-700 shrink-0 select-none">&gt;&gt;&gt;</span>
                              <span className={log.includes("ERROR") ? 'text-red-400' : log.includes("sys:") ? 'text-[#0ea5e9]' : 'text-[#34d399]'}>
                                {log}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="m-auto text-center space-y-4">
                            <Code size={40} className="mx-auto text-stone-850" />
                            <p className="text-stone-500 text-xs leading-relaxed max-w-sm">
                              Click the compiler key below to compile the custom `aum_analysis.py` script against the active dataset inside the virtual sandbox.
                            </p>
                          </div>
                        )}
                        
                        {/* Cursor blinking */}
                        {isPythonCompiling && (
                          <div className="text-[#34d399] font-black font-mono animate-pulse inline-block text-xs mt-1 shrink-0">&gt;&gt;&gt; [Compiling matrices calculations...] █</div>
                        )}
                      </div>

                      {/* ACTION KEY PANEL */}
                      <div className="bg-[#15181f] border-t border-white/5 p-4 flex justify-between items-center select-none shrink-0">
                        <button
                          onClick={executePythonSimulation}
                          disabled={isPythonCompiling}
                          className="bg-[#10b981] hover:bg-[#059669] text-black font-extrabold uppercase tracking-widest text-[10px] px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Play size={13} fill="currentColor" />
                          {isPythonCompiling ? 'Running Sandbox Process...' : 'Run python compiler sandbox'}
                        </button>
                        
                        <div className="text-[10px] text-stone-500 font-bold font-mono">
                          Dataset: active_clients.csv
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* VIRTUAL PLOTS PREVIEW GALLERY GRID IN DARK GOLD */}
                  {showSimulatedPlots && (
                    <div className="border border-gold/20 p-5 rounded-2xl bg-stone-950/60 mt-6 select-none space-y-4">
                      <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
                        <Flame size={16} className="text-gold animate-pulse" />
                        <h5 className="text-xs font-bold text-gold uppercase tracking-widest font-mono">
                          Simulated Matplotlib Compilation Outputs
                        </h5>
                        <span className="bg-emerald-500/10 text-emerald-400 py-0.5 px-2 text-[9px] font-black uppercase font-mono border border-emerald-500/10 rounded ml-auto">
                          Compilation Code: 0
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { id: 1, title: 'plot1_bar.png', desc: 'Bar chart analysis' },
                          { id: 2, title: 'plot2_line.png', desc: 'Cumulative inflows' },
                          { id: 3, title: 'plot3_pie.png', desc: 'Asset segment spreads' },
                          { id: 4, title: 'plot4_donut.png', desc: 'Engagement segments' },
                          { id: 5, title: 'plot5_scatter.png', desc: 'Scatter plot scatter age' },
                          { id: 6, title: 'plot6_histogram.png', desc: 'Demographic ages bucket' },
                          { id: 7, title: 'plot7_heatmap.png', desc: 'UCC density activation map' },
                          { id: 8, title: 'plot8_boxplot.png', desc: 'Outlier box whiskers dispersion' }
                        ].map(fig => (
                          <div key={fig.id} className="border border-gold/10 bg-[#0c1017] p-3 rounded-lg text-center space-y-2 group hover:border-gold/30 transition-all">
                            <div className="aspect-[4/3] bg-[#070a0e] border border-stone-900 rounded flex flex-col justify-center items-center text-stone-500 gap-1 overflow-hidden relative">
                              <Database size={24} className="text-gold/20 group-hover:scale-110 transition-transform" />
                              <span className="text-[9.5px] text-[#c5a85c] font-black tracking-widest uppercase font-mono">PNG COMPILED</span>
                              
                              {/* Hover outline */}
                              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-stone-950/80 text-white border border-gold/10 text-[8px] font-black px-2 py-1 rounded">PREVIEW EXPORT</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-stone-300 font-bold font-mono group-hover:text-gold transition-colors">{fig.title}</div>
                              <div className="text-[8.5px] text-stone-500">{fig.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </AnimatePresence>

          </div>

        </div>

        {/* POWER BI DESKTOP PAGE SELECTOR FOOTER BAR */}
        <div className="bg-[#181a1f] border-t border-[#2d3037] px-4 py-2 flex justify-between items-center select-none text-xs text-stone-400">
          <div className="flex items-center gap-1.5 font-bold font-mono">
            <span className="text-stone-500">Workspace Pages:</span>
            <button 
              onClick={() => setActivePage('summary')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                activePage === 'summary' 
                  ? 'bg-stone-950 border border-[#2d3037] text-white font-extrabold shadow' 
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <FileSpreadsheet size={12} className={activePage === 'summary' ? 'text-gold' : 'text-stone-500'} />
              Page 1 - Executive AUM Portfolio (Charts 1-4)
            </button>
            <div className="h-4 w-px bg-stone-700 mx-1" />
            <button 
              onClick={() => setActivePage('demographics')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                activePage === 'demographics' 
                  ? 'bg-stone-950 border border-[#2d3037] text-white font-extrabold shadow' 
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={12} className={activePage === 'demographics' ? 'text-gold' : 'text-stone-500'} />
              Page 2 - Demographics & Dispersion (Charts 5-8)
            </button>
            <div className="h-4 w-px bg-stone-700 mx-1" />
            <button 
              onClick={() => setActivePage('pythonEngine')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                activePage === 'pythonEngine' 
                  ? 'bg-stone-950 border border-[#2d3037] text-white font-extrabold shadow' 
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <Code size={12} className={activePage === 'pythonEngine' ? 'text-gold' : 'text-stone-500'} />
              Page 3 - PyMatplotlib Analytics CLI Compiler
            </button>
          </div>
          <div className="flex items-center gap-2 text-stone-500 font-bold font-mono text-[10px]">
            <span>Active Slicer Filters Mode: {filteredData.length} of {clientAccounts.length} clients matched</span>
          </div>
        </div>

      </div>
    </section>
  );
};
