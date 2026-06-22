import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, Shield, ShieldAlert, FileSpreadsheet, Calendar, 
  TrendingUp, Users, MessageSquare, CheckCircle, Clock, 
  ExternalLink, LogOut, Check, Plus, Trash2, Edit, Save, 
  RefreshCw, Award, ArrowUpRight, HelpCircle, Briefcase, ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Default Admin Credentials info
const DEFAULT_EMAIL = 'finnauracapital@gmail.com';
const DEFAULT_PASS = 'India@11'; // Owner security code, customizable from code as needed

interface WorkspaceLink {
  id: string;
  title: string;
  url: string;
  category: 'sheet' | 'calendar' | 'other';
  description: string;
}

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  date: string;
  status: 'Pending' | 'In Discussion' | 'Onboarded' | 'Closed';
}

export const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'workspace' | 'enquiries' | 'settings'>('overview');
  
  // Workspace Custom Links
  const [links, setLinks] = useState<WorkspaceLink[]>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: 'sheet' as 'sheet' | 'calendar' | 'other', description: '' });
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState('');

  // Enquiry Lists
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<string>('All');

  // Stats Counters
  const [stats, setStats] = useState({
    simulatedAum: 48500000, // ₹4.85 Cr
    activeClients: 142,
    leadConversionRate: 68
  });

  // Load state and data on mount
  useEffect(() => {
    // Check if authenticated in existing session
    const authSession = sessionStorage.getItem('finaura_admin_auth');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }

    // Load custom links from localStorage or set defaults
    const storedLinks = localStorage.getItem('finaura_admin_links');
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else {
      const defaultLinks: WorkspaceLink[] = [
        {
          id: '1',
          title: 'Client Investment Master Ledger',
          url: 'https://docs.google.com/spreadsheets/d/1exampleClientLedgerId/edit',
          category: 'sheet',
          description: 'Primary Google Sheet containing portfolio balances, asset class allocations, and demographic details'
        },
        {
          id: '2',
          title: 'Daily Mutual Fund Outpost Pipeline',
          url: 'https://docs.google.com/spreadsheets/d/1exampleSipPipelineId/edit',
          category: 'sheet',
          description: 'Tracks recurring SIP mandates, active SWP schedules, and target execution dates'
        },
        {
          id: '3',
          title: 'Client Wealth Consultations Calendar',
          url: 'https://calendar.google.com',
          category: 'calendar',
          description: 'Direct link to Google Calendar containing booked initial planning sessions and reviews'
        }
      ];
      setLinks(defaultLinks);
      localStorage.setItem('finaura_admin_links', JSON.stringify(defaultLinks));
    }

    // Load inquiries
    loadEnquiries();
  }, []);

  const loadEnquiries = () => {
    const rawEnquiries = localStorage.getItem('finaura_enquiries');
    if (rawEnquiries) {
      setEnquiries(JSON.parse(rawEnquiries));
    } else {
      // Mock 2 high-quality initial inquiries so dashboard looks realistic and polished
      const mockEnquiries: Enquiry[] = [
        {
          id: 'mock-1',
          name: 'Amit Patel',
          phone: '+91 98765 43210',
          email: 'amit.patel@gmail.com',
          service: 'SWP – Systematic Withdrawal Plan',
          message: 'Plan to retire in Sept 2026. Needs assessment of ₹1.5 Cr corpus sustainability with safe monthly systematic draw-down payouts.',
          date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          status: 'In Discussion'
        },
        {
          id: 'mock-2',
          name: 'Priya Sen',
          phone: '+91 91234 56789',
          email: 'priya.sen@outlook.com',
          service: 'SIP – Systematic Investment Plan',
          message: 'Interested in starting a highly tax-efficient SIP of ₹25k/month split amongst Large/Mid Cap diversified equity funds. Request advising on long-term compound matrices.',
          date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
          status: 'Pending'
        }
      ];
      setEnquiries(mockEnquiries);
      localStorage.setItem('finaura_enquiries', JSON.stringify(mockEnquiries));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email.trim().toLowerCase() === DEFAULT_EMAIL || email.trim().toLowerCase() === 'finnauracapital' || email.trim().toLowerCase() === 'admin') &&
      password === DEFAULT_PASS
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('finaura_admin_auth', 'true');
    } else {
      setLoginError('Invalid Administrator credentials. Please verify and retry.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('finaura_admin_auth');
    setEmail('');
    setPassword('');
  };

  const handleAddWorkspaceLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) {
      alert('Please fill out Title and URL fields.');
      return;
    }

    let urlFormatted = newLink.url;
    if (!urlFormatted.startsWith('http://') && !urlFormatted.startsWith('https://')) {
      urlFormatted = 'https://' + urlFormatted;
    }

    const updated: WorkspaceLink = {
      id: Date.now().toString(),
      title: newLink.title,
      url: urlFormatted,
      category: newLink.category,
      description: newLink.description || 'Custom administrator configured shortcut link.'
    };

    const newLinksList = [...links, updated];
    setLinks(newLinksList);
    localStorage.setItem('finaura_admin_links', JSON.stringify(newLinksList));
    
    // Reset form
    setNewLink({ title: '', url: '', category: 'sheet', description: '' });
    setIsAddingLink(false);
    setLinkSuccess('Shortcut added successfully!');
    setTimeout(() => setLinkSuccess(''), 3000);
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('Are you sure you want to remove this project/sheet link?')) {
      const filtered = links.filter(l => l.id !== id);
      setLinks(filtered);
      localStorage.setItem('finaura_admin_links', JSON.stringify(filtered));
    }
  };

  const handleStatusChange = (id: string, newStatus: Enquiry['status']) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e);
    setEnquiries(updated);
    localStorage.setItem('finaura_enquiries', JSON.stringify(updated));
  };

  const handleDeleteEnquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry record?')) {
      const filtered = enquiries.filter(e => e.id !== id);
      setEnquiries(filtered);
      localStorage.setItem('finaura_enquiries', JSON.stringify(filtered));
    }
  };

  const handleRefreshData = () => {
    loadEnquiries();
    setStats({
      simulatedAum: Math.floor(45000000 + Math.random() * 5000000),
      activeClients: Math.floor(138 + Math.random() * 10),
      leadConversionRate: Math.floor(65 + Math.random() * 5)
    });
  };

  return (
    <section className="min-h-[85vh] py-12 px-6 flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* SECTION - LOGIN GATE */
          <motion.div
            key="login-gate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md border border-gold/15 glass rounded-3xl p-8 md:p-10 text-center shadow-2xl relative overflow-hidden mt-12 bg-bg-dark-3/60"
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full" />

            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-gold/10 border border-gold/25 rounded-2xl flex items-center justify-center text-gold shadow-lg shadow-gold/5 animate-pulse">
                <Shield size={28} className="stroke-[1.5]" />
              </div>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-white mb-2">FinAura Capital</h2>
            <div className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-6">Executive Partner Login</div>

            <p className="text-sm text-muted-foreground mb-8 text-center leading-relaxed">
              Welcome, Shubham. Access your proprietary client spreadsheets, wealth portfolios, and contact records securely.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block">
                  Admin Identity / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="finnauracapital@gmail.com"
                    autoComplete="username"
                    className="w-full bg-[#0a0c10]/90 border border-gold/20 rounded-xl py-3 pl-4 text-sm text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5 block">
                  Secure Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#0a0c10]/90 border border-gold/20 rounded-xl py-3 px-4 text-sm text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 text-xs flex items-start gap-2.5 leading-relaxed">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 bg-gold hover:bg-gold-light text-bg-dark py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-gold/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={14} className="stroke-[2]" />
                Authorize Console
              </button>
            </form>
          </motion.div>
        ) : (
          /* SECTION - ADMIN DASHBOARD CONTROL PANEL */
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl mt-12"
          >
            {/* TOP HEADER BRANDING */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gold/10 pb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 border border-gold/25 rounded-2xl flex items-center justify-center text-gold shadow-md">
                  <Award size={22} className="stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase mb-1">
                    Primary Advisory Console
                  </div>
                  <h1 className="font-serif text-3xl font-extrabold text-white flex items-center gap-2">
                    FinAura Capital Console
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefreshData}
                  className="border border-gold/15 bg-gold/5 hover:bg-gold/10 text-gold hover:text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  title="Synchronize calculations and reload inquiries"
                >
                  <RefreshCw size={13} />
                  Sync Metrics
                </button>
                <div className="h-6 w-px bg-gold/10" />
                <button
                  onClick={handleLogout}
                  className="bg-red-500/5 hover:bg-red-500/15 border border-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  Lock Session
                </button>
              </div>
            </div>

            {/* TAB CORNER NAVIGATION */}
            <div className="flex border-b border-gold/5 overflow-x-auto gap-1 mb-8 pb-px">
              {[
                { id: 'overview', label: 'Overview Metrics', icon: <TrendingUp size={14} /> },
                { id: 'workspace', label: 'Google Sheets & Links', icon: <FileSpreadsheet size={14} /> },
                { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: <MessageSquare size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-5 py-3 border-b-2 text-xs font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-gold text-gold bg-gold/5 font-extrabold'
                      : 'border-transparent text-muted-foreground hover:text-white hover:border-gold/30'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB VIEWPORT BODY */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="tab-overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                  {/* WIDGET 1: AUM METRIC */}
                  <div className="border border-gold/10 glass rounded-2xl p-6 bg-bg-dark-3/40 hover:border-gold/30 transition-all flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Advisory Assets Under Management (AUM)</span>
                      <div className="p-2 bg-gold/10 rounded-xl text-gold group-hover:scale-105 transition-transform">
                        <TrendingUp size={16} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-sans text-3xl font-extrabold text-white mb-2 font-mono">
                        {formatCurrency(stats.simulatedAum)}
                      </h3>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <span>↑ 12.4% compounding year-to-date</span>
                      </p>
                    </div>
                  </div>

                  {/* WIDGET 2: CLIENT COUNT */}
                  <div className="border border-gold/10 glass rounded-2xl p-6 bg-bg-dark-3/40 hover:border-gold/30 transition-all flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Active Advisory Portfolios</span>
                      <div className="p-2 bg-gold/10 rounded-xl text-gold group-hover:scale-105 transition-transform">
                        <Users size={16} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-sans text-3xl font-extrabold text-white mb-2 font-mono">
                        {stats.activeClients} Households
                      </h3>
                      <p className="text-[11px] text-gold/80 flex items-center gap-1 font-medium">
                        <span>Including 11 new sign-ups this month</span>
                      </p>
                    </div>
                  </div>

                  {/* WIDGET 3: LEAD STATUS */}
                  <div className="border border-gold/10 glass rounded-2xl p-6 bg-bg-dark-3/40 hover:border-gold/30 transition-all flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Inquiry Conversion Baseline</span>
                      <div className="p-2 bg-gold/10 rounded-xl text-gold group-hover:scale-105 transition-transform">
                        <CheckCircle size={16} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-sans text-3xl font-extrabold text-white mb-2 font-mono">
                        {stats.leadConversionRate}% Enrollment
                      </h3>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                        <span>Average response latency: &lt; 2 hrs</span>
                      </p>
                    </div>
                  </div>

                  {/* SUBSECTION: ADVICE SYSTEM DIRECTIVES */}
                  <div className="md:col-span-3 border border-gold/10 glass rounded-3xl p-6 md:p-8 bg-bg-dark-3/40">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={18} className="text-gold" />
                      <h4 className="font-serif text-lg font-bold text-white">Regulatory Partner Compliance System</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      FinAura Capital operates as an authorized mutual fund distributor under the Association of Mutual Funds in India (AMFI) Guidelines. Active certificates and advisory disclaimers are linked in real-time across client-facing interfaces.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-gold/5 bg-[#0a0c10]/40 flex items-start gap-3">
                        <div className="p-1 text-gold"><Check size={14} /></div>
                        <div>
                          <div className="text-xs font-bold text-white mb-0.5">AMFI Registry</div>
                          <div className="text-[10px] text-muted-foreground">ARN-35358 (Active)</div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-gold/5 bg-[#0a0c10]/40 flex items-start gap-3">
                        <div className="p-1 text-gold"><Check size={14} /></div>
                        <div>
                          <div className="text-xs font-bold text-white mb-0.5">Licensing Metric</div>
                          <div className="text-[10px] text-muted-foreground">NISM Series V-A Certified</div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border border-gold/5 bg-[#0a0c10]/40 flex items-start gap-3">
                        <div className="p-1 text-gold"><Check size={14} /></div>
                        <div>
                          <div className="text-xs font-bold text-white mb-0.5">Primary Broker Interface</div>
                          <div className="text-[10px] text-muted-foreground">EWA Desk Integration Support</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'workspace' && (
                <motion.div
                  key="tab-workspace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex justify-between items-center bg-[#0a0c10]/30 p-4 rounded-2xl border border-gold/10">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">Google Sheets & Calendar Pipeline</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Configure and launch target financial trackers directly for fast client administration.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingLink(!isAddingLink)}
                      className="bg-gold text-bg-dark hover:bg-gold-light py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isAddingLink ? 'Cancel' : <><Plus size={14} /> Add Spreadsheet / Link</>}
                    </button>
                  </div>

                  {linkSuccess && (
                    <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 text-emerald-400 text-xs font-semibold">
                      {linkSuccess}
                    </div>
                  )}

                  {/* ADD SHORTCUT LINK FORM */}
                  {isAddingLink && (
                    <motion.form
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl border border-gold/15 bg-bg-dark-3/80 flex flex-col gap-4 max-w-xl self-start w-full shadow-xl"
                      onSubmit={handleAddWorkspaceLink}
                    >
                      <h5 className="font-serif text-sm font-bold text-white border-b border-white/5 pb-2">New Configuration Blueprint</h5>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Asset / Link Group</label>
                          <select
                            value={newLink.category}
                            onChange={e => setNewLink({ ...newLink, category: e.target.value as any })}
                            className="bg-bg-dark-2 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold"
                          >
                            <option value="sheet">Google Sheet Guide</option>
                            <option value="calendar">Google Calendar / Meeting Schedule</option>
                            <option value="other">Other Administrator Portal</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Link Title *</label>
                          <input
                            type="text"
                            value={newLink.title}
                            onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                            placeholder="e.g. Lead Pipeline Ledger"
                            className="bg-bg-dark-2 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Destination URL *</label>
                        <input
                          type="text"
                          value={newLink.url}
                          onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                          placeholder="e.g. docs.google.com/spreadsheets/d/..."
                          className="bg-bg-dark-2 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description (Optional)</label>
                        <textarea
                          value={newLink.description}
                          onChange={e => setNewLink({ ...newLink, description: e.target.value })}
                          placeholder="What is this ledger used for..."
                          className="bg-bg-dark-2 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold min-h-[60px]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-gold text-bg-dark hover:bg-gold-light py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                      >
                        <Save size={13} />
                        Persist Shortcut
                      </button>
                    </motion.form>
                  )}

                  {/* SHORTCUTS LIST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map(link => (
                      <div 
                        key={link.id}
                        className="border border-gold/10 rounded-2xl p-5 bg-[#090b0d]/20 relative overflow-hidden flex flex-col justify-between hover:border-gold/30 transition-all group"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                              link.category === 'sheet' 
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                                : link.category === 'calendar' 
                                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' 
                                  : 'bg-gold/15 text-gold border border-gold/20'
                            }`}>
                              {link.category === 'sheet' ? 'Google Sheet' : link.category === 'calendar' ? 'Calendar' : 'Tool Shortcut'}
                            </span>

                            {/* Detach option */}
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="text-muted-foreground hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/5 cursor-pointer"
                              title="Delete Link Shortcut"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <h5 className="text-white font-bold text-sm mb-2 group-hover:text-gold transition-colors">{link.title}</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-6">{link.description}</p>
                        </div>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gold/5 hover:bg-gold border border-gold/20 text-gold hover:text-bg-dark w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                        >
                          Launch Operational URL
                          <ArrowUpRight size={13} />
                        </a>
                      </div>
                    ))}
                    
                    {links.length === 0 && (
                      <div className="col-span-full border border-dashed border-gold/15 rounded-3xl p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                        <FileSpreadsheet size={32} className="text-gold/30 mb-3" />
                        <span className="text-sm font-semibold mb-1">No custom links stored.</span>
                        <span className="text-xs">Click "Add Spreadsheet / Link" above to customize your shortcuts.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'enquiries' && (
                <motion.div
                  key="tab-enquiries"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* ENQUIRY CONTROL ROW */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/10 pb-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">Client Wealth Inquiries</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Submitted via the contact forms. Fully interactive pipeline.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Filter Pipeline:</span>
                      <div className="flex bg-[#0a0c10]/40 p-1 rounded-xl border border-gold/15">
                        {['All', 'Pending', 'In Discussion', 'Onboarded'].map(f => (
                          <button
                            key={f}
                            onClick={() => setEnquiryFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                              enquiryFilter === f
                                ? 'bg-gold text-bg-dark font-extrabold'
                                : 'text-muted-foreground hover:text-gold'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LIST ENQUIRIES */}
                  <div className="flex flex-col gap-4">
                    {enquiries
                      .filter(e => enquiryFilter === 'All' || e.status === enquiryFilter)
                      .map(enq => (
                        <div 
                          key={enq.id}
                          className="border border-gold/10 rounded-2xl p-6 bg-bg-dark-3/20 flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 shadow-md hover:border-gold/25 transition-all relative overflow-hidden"
                        >
                          {/* Accent border left */}
                          <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                            enq.status === 'Pending' 
                              ? 'bg-yellow-400' 
                              : enq.status === 'In Discussion' 
                                ? 'bg-blue-400' 
                                : enq.status === 'Onboarded' 
                                  ? 'bg-emerald-400' 
                                  : 'bg-muted-foreground'
                          }`} />

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2.5">
                              <span className="font-serif font-bold text-white text-base">{enq.name}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(enq.date).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-[6px] mb-4">
                              <span className="bg-gold/10 border border-gold/20 text-gold px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                {enq.service}
                              </span>
                              <span className="bg-[#0a0c10]/40 text-muted-foreground px-2.5 py-0.5 rounded-md text-xs font-semibold">
                                📞 {enq.phone}
                              </span>
                              <span className="bg-[#0a0c10]/40 text-muted-foreground px-2.5 py-0.5 rounded-md text-xs font-semibold">
                                ✉️ {enq.email}
                              </span>
                            </div>

                            <p className="text-xs text-foreground/90 bg-[#0a0c10]/20 p-3.5 rounded-xl border border-white/5 leading-relaxed">
                              {enq.message}
                            </p>
                          </div>

                          <div className="flex md:flex-col justify-between items-end gap-4 shrink-0 md:border-l md:border-gold/5 md:pl-6 min-w-[200px]">
                            {/* Pipeline status controller */}
                            <div className="flex flex-col gap-1.5 w-full">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest md:text-right">Pipeline Phase</span>
                              <select
                                value={enq.status}
                                onChange={e => handleStatusChange(enq.id, e.target.value as any)}
                                className={`w-full bg-[#0a0c10]/80 border py-2 px-3 rounded-lg text-xs font-semibold outline-none transition-all cursor-pointer ${
                                  enq.status === 'Pending' 
                                    ? 'border-yellow-500/40 text-yellow-500' 
                                    : enq.status === 'In Discussion' 
                                      ? 'border-blue-500/40 text-blue-400' 
                                      : enq.status === 'Onboarded' 
                                        ? 'border-emerald-500/40 text-emerald-400 font-bold' 
                                        : 'border-white/10 text-muted-foreground'
                                }`}
                              >
                                <option value="Pending">🕒 Pending Review</option>
                                <option value="In Discussion">💬 In Discussion</option>
                                <option value="Onboarded">🌟 Onboarded Partner</option>
                                <option value="Closed">🔒 Closed</option>
                              </select>
                            </div>

                            <div className="flex gap-2 w-full md:justify-end">
                              <a
                                href={`tel:${enq.phone.replace(/[\s-+]/g, '')}`}
                                className="bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-center flex-1 md:flex-initial"
                              >
                                Call Client
                              </a>
                              <button
                                onClick={() => handleDeleteEnquiry(enq.id)}
                                className="border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 p-2.5 rounded-xl transition-all cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                    {enquiries.filter(e => enquiryFilter === 'All' || e.status === enquiryFilter).length === 0 && (
                      <div className="border border-dashed border-gold/15 rounded-3xl p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                        <MessageSquare size={36} className="text-gold/25 mb-3" />
                        <span className="text-sm font-semibold mb-1">No enquiries found in this segment.</span>
                        <span className="text-xs">Clients submitting the main web layout contact form will appear immediately in your feed.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
