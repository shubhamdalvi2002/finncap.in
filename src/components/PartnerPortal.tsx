import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Lock, Key, Shield, ShieldAlert, FileSpreadsheet, Calendar, 
  TrendingUp, Users, MessageSquare, CheckCircle, Clock, 
  ExternalLink, LogOut, Check, Plus, Trash2, Edit, Save, 
  RefreshCw, Award, ArrowUpRight, HelpCircle, Briefcase, ChevronRight,
  Search, Download, Upload, Database, AlertCircle, FileText, CheckCheck,
  Bell, BarChart3, Sliders, Code, Flame
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// Default Partner Credentials info
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
  hasInvestment?: 'Yes' | 'No' | 'YES' | 'no-flag';
  installmentRemainder?: string;
  lumpsum?: number;
  sipAmount?: number;
}

const clientAccountsData: ClientAccount[] = [];

// Helper to generate CSV string from active clients list
const convertToCSV = (accounts: ClientAccount[]): string => {
  const headers = [
    'srNo', 'activationMonth', 'investor', 'mobile', 'altMobile', 
    'email', 'altEmail', 'dob', 'accountActivated', 'activationDate', 
    'clientCode', 'hasInvestment', 'installmentRemainder', 'lumpsum', 'sipAmount'
  ];
  const rows = accounts.map(acc => {
    return headers.map(header => {
      let val = (acc as any)[header];
      if (val === undefined || val === null) val = '';
      const strVal = String(val);
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(',');
  });
  return [headers.join(','), ...rows].join('\n');
};

// Helper to parse CSV string into active clients list
const parseCSV = (csvText: string): ClientAccount[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  
  const result: ClientAccount[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const obj: any = {};
    headers.forEach((header, index) => {
      let val: any = values[index] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      
      if (header === 'srNo') {
        obj.srNo = parseInt(val, 10) || i;
      } else if (header === 'lumpsum') {
        obj.lumpsum = val ? parseFloat(val) : undefined;
      } else if (header === 'sipAmount') {
        obj.sipAmount = val ? parseFloat(val) : undefined;
      } else {
        obj[header] = val;
      }
    });
    
    if (obj.investor) {
      result.push(obj as ClientAccount);
    }
  }
  return result;
};

// Compute dynamic trend data based on client records
const computeTrendData = (accounts: ClientAccount[]) => {
  const months = ['February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026'];
  const monthLabels: { [key: string]: string } = {
    'February 2026': 'Feb 2026',
    'March 2026': 'Mar 2026',
    'April 2026': 'Apr 2026',
    'May 2026': 'May 2026',
    'June 2026': 'June 2026'
  };
  
  let cumulativeLumpsum = 0;
  let cumulativeSip = 0;
  let cumulativeClients = 0;
  
  return months.map(m => {
    const monthClients = accounts.filter(a => a.activationMonth === m);
    const monthLumpsum = monthClients.reduce((sum, a) => sum + (a.lumpsum || 0), 0);
    const monthSip = monthClients.reduce((sum, a) => sum + (a.sipAmount || 0), 0);
    
    cumulativeLumpsum += monthLumpsum;
    cumulativeSip += monthSip;
    cumulativeClients += monthClients.length;
    
    return {
      month: monthLabels[m] || m,
      'Total AUM': cumulativeLumpsum + cumulativeSip,
      'Monthly SIP Book': cumulativeSip,
      'Lumpsum Assets': cumulativeLumpsum,
      'Clients': cumulativeClients
    };
  });
};

interface SipScheduleAlert {
  isCurrentWeek: boolean;
  dayOfMonth: number;
  weekdayName: string;
  isToday: boolean;
  isTomorrow: boolean;
  relativeLabel: string;
  type: 'today' | 'tomorrow' | 'upcoming' | 'past_due';
}

const getSipScheduleAlert = (installmentRemainder: string | undefined): SipScheduleAlert | null => {
  if (!installmentRemainder) return null;
  const match = installmentRemainder.match(/^(\d+)(st|nd|rd|th)/i);
  if (!match) return null;
  const sipDay = parseInt(match[1], 10);
  if (isNaN(sipDay)) return null;

  const today = new Date();
  
  // Start Monday of the current week
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday ...
  const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayDiff);

  // Generate the 7 days of the current week (Monday through Sunday)
  let matchingDate: Date | null = null;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (d.getDate() === sipDay) {
      matchingDate = d;
      break;
    }
  }

  if (!matchingDate) return null;

  const isToday = matchingDate.getDate() === today.getDate() && matchingDate.getMonth() === today.getMonth();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = matchingDate.getDate() === tomorrow.getDate() && matchingDate.getMonth() === tomorrow.getMonth();

  const isPastDue = matchingDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayName = weekdays[matchingDate.getDay()];

  let relativeLabel = "";
  let type: 'today' | 'tomorrow' | 'upcoming' | 'past_due' = 'upcoming';

  if (isToday) {
    relativeLabel = "Today";
    type = 'today';
  } else if (isTomorrow) {
    relativeLabel = "Tomorrow";
    type = 'tomorrow';
  } else if (isPastDue) {
    relativeLabel = `Overdue (${weekdayName})`;
    type = 'past_due';
  } else {
    relativeLabel = weekdayName;
    type = 'upcoming';
  }

  return {
    isCurrentWeek: true,
    dayOfMonth: sipDay,
    weekdayName,
    isToday,
    isTomorrow,
    relativeLabel,
    type
  };
};

const isSipDueWithin48Hours = (installmentRemainder: string | undefined): { due: boolean; daysRemaining: number; dateLabel: string } | null => {
  if (!installmentRemainder) return null;
  const match = installmentRemainder.match(/^(\d+)(st|nd|rd|th)/i);
  if (!match) return null;
  const sipDay = parseInt(match[1], 10);
  if (isNaN(sipDay)) return null;

  const today = new Date();
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const candidateDates = [
    new Date(today.getFullYear(), today.getMonth(), sipDay),
    new Date(today.getFullYear(), today.getMonth() + 1, sipDay)
  ];

  let nextSipDate = candidateDates.find(d => d >= todayZero);
  if (!nextSipDate) {
    nextSipDate = candidateDates[0];
  }

  const diffTime = nextSipDate.getTime() - todayZero.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Within 48 hours is true if diffTime is between 0 and 48 hours (inclusive)
  const isDue = diffTime >= 0 && diffTime <= 48 * 60 * 60 * 1000;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateLabel = `${nextSipDate.getDate()} ${monthNames[nextSipDate.getMonth()]}`;

  return {
    due: isDue,
    daysRemaining: Math.floor(diffTime / (1000 * 60 * 60 * 24)),
    dateLabel
  };
};

const CustomChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload || {};
    const totalAum = data['Total AUM'] ?? 0;
    const sipBook = data['Monthly SIP Book'] ?? 0;
    const lumpsum = data['Lumpsum Assets'] ?? 0;
    const clients = data['Clients'] ?? 0;

    return (
      <div className="bg-[#0b0e14]/95 border border-gold/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md min-w-[210px] divide-y divide-gold/10">
        <div className="pb-2">
          <p className="font-serif font-black text-stone-400 text-[9px] tracking-widest uppercase">Target Month</p>
          <p className="text-white font-bold text-sm tracking-tight">{label}</p>
        </div>
        <div className="py-2.5 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-gold font-bold tracking-tight uppercase">Total AUM:</span>
            <span className="font-mono font-black text-gold text-xs">
              ₹{totalAum.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-stone-400 font-bold tracking-tight uppercase">Lumpsum Assets:</span>
            <span className="font-mono font-black text-stone-300">
              ₹{lumpsum.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-emerald-400 font-bold tracking-tight uppercase">SIP Book:</span>
            <span className="font-mono font-black text-emerald-400">
              ₹{sipBook.toLocaleString('en-IN')}/mo
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-amber-300 font-bold tracking-tight uppercase">Active Clients:</span>
            <span className="font-mono font-black text-amber-300">
              {clients} Portfolio{clients !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const PartnerPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'clients'>('overview');
  const [activeCrmSheet, setActiveCrmSheet] = useState<'crm' | 'nj'>('crm');
  const [clientSearch, setClientSearch] = useState('');
  const [clientInvestmentFilter, setClientInvestmentFilter] = useState<'All' | 'Active' | 'Lumpsum' | 'SIP' | 'None'>('All');
  const [showSipDueModal, setShowSipDueModal] = useState(false);
  const [dueSipClients, setDueSipClients] = useState<ClientAccount[]>([]);
  
  // Workspace Custom Links
  const [links, setLinks] = useState<WorkspaceLink[]>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: 'sheet' as 'sheet' | 'calendar' | 'other', description: '' });
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState('');

  // Enquiry Lists
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<string>('All');

  // Dynamic client state & CSV Editor controls
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>(clientAccountsData);
  const [rawCSVText, setRawCSVText] = useState<string>('');
  const [isCSVEditorOpen, setIsCSVEditorOpen] = useState<boolean>(false);
  const [csvStatusMsg, setCsvStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Dynamic calculations synced from Active Client Portfolios
  const totalLumpsum = clientAccounts.reduce((sum, acc) => sum + (acc.lumpsum || 0), 0);
  const totalSip = clientAccounts.reduce((sum, acc) => sum + (acc.sipAmount || 0), 0);
  const calculatedAum = totalLumpsum + totalSip; 
  const activeClientsCount = clientAccounts.length; 
  const activeSipClientsCount = clientAccounts.filter(a => (a.sipAmount || 0) > 0).length;
  
  // Computed percentages
  const lumpsumPercentage = calculatedAum > 0 ? ((totalLumpsum / calculatedAum) * 100).toFixed(2) : '0';
  const sipPercentage = calculatedAum > 0 ? ((totalSip / calculatedAum) * 100).toFixed(2) : '0';

  // Compute live trend data from state
  const liveTrendData = computeTrendData(clientAccounts);

  // Filtered clients list based on search term and investment status filter
  const filteredClients = clientAccounts.filter(acc => {
    const searchLower = clientSearch.toLowerCase();
    const matchesSearch = (
      acc.investor.toLowerCase().includes(searchLower) ||
      acc.clientCode.includes(searchLower) ||
      (acc.email && acc.email.toLowerCase().includes(searchLower)) ||
      (acc.altEmail && acc.altEmail.toLowerCase().includes(searchLower)) ||
      acc.mobile.includes(searchLower) ||
      (acc.altMobile && acc.altMobile.includes(searchLower)) ||
      acc.activationMonth.toLowerCase().includes(searchLower)
    );

    let matchesFilter = true;
    if (clientInvestmentFilter === 'Active') {
      matchesFilter = (acc.sipAmount ? acc.sipAmount > 0 : false) || 
                      (acc.lumpsum ? acc.lumpsum > 0 : false) || 
                      acc.hasInvestment === 'Yes' || acc.hasInvestment === 'YES';
    } else if (clientInvestmentFilter === 'Lumpsum') {
      matchesFilter = (acc.lumpsum ? acc.lumpsum > 0 : false);
    } else if (clientInvestmentFilter === 'SIP') {
      matchesFilter = (acc.sipAmount ? acc.sipAmount > 0 : false);
    } else if (clientInvestmentFilter === 'None') {
      matchesFilter = !(acc.sipAmount && acc.sipAmount > 0) && 
                      !(acc.lumpsum && acc.lumpsum > 0) && 
                      acc.hasInvestment !== 'Yes' && acc.hasInvestment !== 'YES';
    }

    return matchesSearch && matchesFilter;
  });

  const fetchAndLoadPublicCSV = async () => {
    try {
      const response = await fetch('/data/active_clients.csv');
      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().startsWith('srNo')) {
          const parsed = parseCSV(text);
          setClientAccounts(parsed);
          setRawCSVText(text);
          localStorage.setItem('finaura_client_accounts', JSON.stringify(parsed));
          return;
        }
      }
    } catch (e) {
      console.warn("Could not fetch active_clients.csv, falling back to static data", e);
    }
    // Fallback to pre-compiled static accounts data
    setClientAccounts(clientAccountsData);
    setRawCSVText(convertToCSV(clientAccountsData));
  };

  const handleApplyCSVText = (textToApply: string) => {
    try {
      const parsed = parseCSV(textToApply);
      setClientAccounts(parsed);
      setRawCSVText(textToApply);
      localStorage.setItem('finaura_client_accounts', JSON.stringify(parsed));
      setCsvStatusMsg({ type: 'success', text: `Success: Synced & saved ${parsed.length} client portfolios successfully! Graph and statistics refreshed.` });
      setTimeout(() => setCsvStatusMsg(null), 6000);
    } catch (err: any) {
      setCsvStatusMsg({ type: 'error', text: `Failed parsing CSV: ${err.message || err}` });
    }
  };

  const handleResetCSV = () => {
    localStorage.removeItem('finaura_client_accounts');
    setClientAccounts(clientAccountsData);
    setRawCSVText(convertToCSV(clientAccountsData));
    setCsvStatusMsg({ type: 'info', text: 'Reset directory to default active ledger dataset.' });
    setTimeout(() => setCsvStatusMsg(null), 4500);
  };

  const handleDownloadCSV = () => {
    const blob = new Blob([rawCSVText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'active_clients.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDFReport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Color definitions
      const primaryColor = [10, 13, 20]; // #0a0d14
      const accentColor = [197, 168, 92]; // #c5a85c (Finaura Gold)

      // Page background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 297, 210, 'F');

      // Decorative top thin bar
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(0, 0, 297, 4, 'F');

      // Header Title
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('FINAURA CAPITAL GROUP', 15, 18);

      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text('WEALTH MANAGEMENT & ADVISORY LEDGER', 15, 23);

      // Metadata Right-Side
      doc.setTextColor(115, 115, 115); // Neutral 500
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'normal');
      
      const todayStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generated: ${todayStr}`, 282, 18, { align: 'right' });
      doc.text(`Lead Partner Email: shubhamdalvi7218@gmail.com`, 282, 23, { align: 'right' });

      // Divider line
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setLineWidth(0.5);
      doc.line(15, 27, 282, 27);

      // Summary KPI block
      doc.setFillColor(248, 250, 252); // Slate 50
      doc.rect(15, 32, 267, 22, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 32, 267, 22, 'S');

      // KPI labels & values
      doc.setTextColor(82, 82, 82);
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');
      doc.text('GROUP DISTRIBUTOR', 25, 39);
      doc.text('ACTIVATED ACCOUNTS', 90, 39);
      doc.text('TOTAL LUMPSUM ASSETS', 155, 39);
      doc.text('MONTHLY SIP BOOK VALUE', 220, 39);

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(11);
      doc.setFont('Helvetica', 'bold');
      doc.text('SHUBHAM VILAS DALVI', 25, 46);
      doc.text(`${activeClientsCount} Verified Portfolios`, 90, 46);
      doc.text(`INR ${totalLumpsum.toLocaleString('en-IN')}`, 155, 46);
      doc.text(`INR ${totalSip.toLocaleString('en-IN')} / mo`, 220, 46);

      // Table Header
      let startY = 64;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(15, startY, 267, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('Helvetica', 'bold');

      doc.text('SR', 17, startY + 5.5);
      doc.text('CLIENT CODE', 25, startY + 5.5);
      doc.text('INVESTOR NAME', 47, startY + 5.5);
      doc.text('CONTACT INFO', 107, startY + 5.5);
      doc.text('DATE OF BIRTH', 165, startY + 5.5);
      doc.text('ACTIVATION', 195, startY + 5.5);
      doc.text('SIP / MONTH', 235, startY + 5.5, { align: 'right' });
      doc.text('LUMPSUM VALUE', 277, startY + 5.5, { align: 'right' });

      let currentY = startY + 8;
      const rowHeight = 8;
      const maxPageY = 190;

      // Draw rows
      clientAccounts.forEach((client, index) => {
        // Check if we need to add a new page
        if (currentY + rowHeight > maxPageY) {
          doc.addPage();
          
          // Page background
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, 297, 210, 'F');

          // Brand bar again
          doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
          doc.rect(0, 0, 297, 4, 'F');
          
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(12);
          doc.text('FINAURA CAPITAL GROUP - PORTFOLIO DIRECTORY (CONTD.)', 15, 12);
          
          doc.setDrawColor(226, 232, 240);
          doc.line(15, 16, 282, 16);

          // Draw Table Header on new page
          startY = 20;
          doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.rect(15, startY, 267, 8, 'F');

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.setFont('Helvetica', 'bold');
          
          doc.text('SR', 17, startY + 5.5);
          doc.text('CLIENT CODE', 25, startY + 5.5);
          doc.text('INVESTOR NAME', 47, startY + 5.5);
          doc.text('CONTACT INFO', 107, startY + 5.5);
          doc.text('DATE OF BIRTH', 165, startY + 5.5);
          doc.text('ACTIVATION', 195, startY + 5.5);
          doc.text('SIP / MONTH', 235, startY + 5.5, { align: 'right' });
          doc.text('LUMPSUM VALUE', 277, startY + 5.5, { align: 'right' });

          currentY = startY + 8;
        }

        // Zebra striping background
        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, currentY, 267, rowHeight, 'F');
        }

        // Bottom border for the row
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.3);
        doc.line(15, currentY + rowHeight, 282, currentY + rowHeight);

        // Add row text
        doc.setTextColor(51, 51, 51);
        doc.setFontSize(8);
        doc.setFont('Helvetica', 'normal');

        // SR
        doc.text(String(client.srNo), 17, currentY + 5.5);

        // Client Code
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(client.clientCode, 25, currentY + 5.5);

        // Investor Name
        doc.setFont('Helvetica', 'bold');
        doc.text(client.investor, 47, currentY + 5.5);

        // Contact Details
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(82, 82, 82);
        const contactStr = client.email ? `${client.mobile} | ${client.email}` : client.mobile;
        const truncatedContactStr = contactStr.length > 48 ? contactStr.substring(0, 45) + '...' : contactStr;
        doc.text(truncatedContactStr, 107, currentY + 5.5);

        // DOB
        doc.text(client.dob, 165, currentY + 5.5);

        // Activation info
        doc.text(`${client.activationDate} (${client.activationMonth.split(' ')[0]})`, 195, currentY + 5.5);

        // SIP
        if (client.sipAmount && client.sipAmount > 0) {
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.text(`INR ${client.sipAmount.toLocaleString('en-IN')}`, 235, currentY + 5.5, { align: 'right' });
        } else {
          doc.setTextColor(163, 163, 163);
          doc.text('—', 235, currentY + 5.5, { align: 'right' });
        }

        // Lumpsum
        if (client.lumpsum && client.lumpsum > 0) {
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(16, 124, 65); // Green
          doc.text(`INR ${client.lumpsum.toLocaleString('en-IN')}`, 277, currentY + 5.5, { align: 'right' });
        } else if (client.hasInvestment === 'Yes' || client.hasInvestment === 'YES') {
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(16, 124, 65);
          doc.text('Active Inv.', 277, currentY + 5.5, { align: 'right' });
        } else {
          doc.setTextColor(163, 163, 163);
          doc.setFont('Helvetica', 'normal');
          doc.text('—', 277, currentY + 5.5, { align: 'right' });
        }

        currentY += rowHeight;
      });

      // Add footer text on current page
      doc.setTextColor(140, 140, 140);
      doc.setFontSize(7.5);
      doc.setFont('Helvetica', 'normal');
      doc.text('Confidential business document intended solely for authorized Finaura Capital distributors and partner accounts.', 15, 203);
      doc.text('Page 1 of 1', 282, 203, { align: 'right' });

      doc.save(`Finaura_Active_Clients_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF Report. Please check the console log for errors.');
    }
  };

  // Load state and data on mount
  useEffect(() => {
    // Check if authenticated in existing session
    const authSession = sessionStorage.getItem('finaura_partner_auth');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }

    // Load client accounts from LocalStorage or fetch public CSV
    const storedClients = localStorage.getItem('finaura_client_accounts');
    if (storedClients) {
      try {
        const parsed = JSON.parse(storedClients);
        if (Array.isArray(parsed)) {
          setClientAccounts(parsed);
          setRawCSVText(convertToCSV(parsed));
        } else {
          fetchAndLoadPublicCSV();
        }
      } catch (e) {
        fetchAndLoadPublicCSV();
      }
    } else {
      fetchAndLoadPublicCSV();
    }

    // Load custom links from localStorage or set defaults
    const storedLinks = localStorage.getItem('finaura_partner_links');
    const defaultDeskLinks: WorkspaceLink[] = [
      {
        id: 'pdesk-v2',
        title: 'NJ Partner Desk 2.0',
        url: 'https://pdesk.njwealth.in/pdesk/login',
        category: 'other',
        description: 'The modernized distributor suite featuring trackings, onboarding tools, and real-time portfolio insights.'
      },
      {
        id: 'pdesk-classic',
        title: 'NJ Partner Desk Classic',
        url: 'https://www.njindiaonline.in/pdesk/login.fin?cmdAction=login',
        category: 'other',
        description: 'The classic legacy dashboard supporting daily mutual fund operations, historical report extraction, and transaction feeds.'
      }
    ];

    if (storedLinks) {
      try {
        const parsed: WorkspaceLink[] = JSON.parse(storedLinks);
        // Ensure the NJ desks are always present
        const hasV2 = parsed.some(l => l.id === 'pdesk-v2' || l.title === 'NJ Partner Desk 2.0');
        const hasClassic = parsed.some(l => l.id === 'pdesk-classic' || l.title === 'NJ Partner Desk Classic');
        
        let newLinks = [...parsed];
        if (!hasClassic) {
          newLinks.unshift(defaultDeskLinks[1]);
        }
        if (!hasV2) {
          newLinks.unshift(defaultDeskLinks[0]);
        }
        setLinks(newLinks);
        localStorage.setItem('finaura_partner_links', JSON.stringify(newLinks));
      } catch (err) {
        setLinks(defaultDeskLinks);
        localStorage.setItem('finaura_partner_links', JSON.stringify(defaultDeskLinks));
      }
    } else {
      const defaultLinks: WorkspaceLink[] = [
        ...defaultDeskLinks,
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
      localStorage.setItem('finaura_partner_links', JSON.stringify(defaultLinks));
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

  // Calculate approaching SIP clients
  useEffect(() => {
    if (clientAccounts.length > 0) {
      const due = clientAccounts.filter(acc => {
        if (!acc.sipAmount || acc.sipAmount <= 0) return false;
        const alertInfo = isSipDueWithin48Hours(acc.installmentRemainder);
        return alertInfo ? alertInfo.due : false;
      });
      setDueSipClients(due);
    }
  }, [clientAccounts]);

  // Auto trigger the upcoming SIP modal once upon fresh login/session load
  useEffect(() => {
    if (isAuthenticated && dueSipClients.length > 0) {
      const alreadyTriggered = sessionStorage.getItem('finaura_sip_due_alert_shown');
      if (alreadyTriggered !== 'true') {
        setShowSipDueModal(true);
        sessionStorage.setItem('finaura_sip_due_alert_shown', 'true');
      }
    }
  }, [isAuthenticated, dueSipClients]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email.trim().toLowerCase() === DEFAULT_EMAIL || email.trim().toLowerCase() === 'finnauracapital' || email.trim().toLowerCase() === 'admin') &&
      password === DEFAULT_PASS
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('finaura_partner_auth', 'true');
    } else {
      setLoginError('Invalid Partner credentials. Please verify and retry.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('finaura_partner_auth');
    sessionStorage.removeItem('finaura_sip_due_alert_shown');
    setEmail('');
    setPassword('');
    window.location.hash = '#home';
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
      description: newLink.description || 'Custom partner shortcut link.'
    };

    const newLinksList = [...links, updated];
    setLinks(newLinksList);
    localStorage.setItem('finaura_partner_links', JSON.stringify(newLinksList));
    
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
      localStorage.setItem('finaura_partner_links', JSON.stringify(filtered));
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
            <div className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold mb-6">Partner Platform</div>

            <p className="text-sm text-stone-400 mb-8 text-center leading-relaxed">
              This terminal is reserved for executive partners. Please sign in via the secure portal login overlay to proceed.
            </p>

            <button
              onClick={() => window.dispatchEvent(new Event('open-partner-login'))}
              className="w-full mt-2 bg-gold hover:bg-gold-light text-bg-dark py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-gold/10 transition-all cursor-pointer flex items-center justify-center gap-2"
              id="partner-unauthorized-trigger"
            >
              <Lock size={14} className="stroke-[2]" />
              Open Secure Sign-In popup
            </button>
          </motion.div>
        ) : (
          /* SECTION - PARTNER DASHBOARD CONTROL PANEL */
          <motion.div
            key="partner-dashboard"
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
                  onClick={handleLogout}
                  className="bg-red-500/5 hover:bg-red-500/15 border border-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  Log Out
                </button>
              </div>
            </div>

            {/* TAB CORNER NAVIGATION */}
            <div className="flex border-b border-gold/5 overflow-x-auto gap-1 mb-8 pb-px">
              {[
                { id: 'overview', label: 'Overview Metrics', icon: <TrendingUp size={14} /> },
                { id: 'clients', label: 'Client Data', icon: <Users size={14} /> },
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
                  className="space-y-8"
                >
                  {/* OPEN DESK UTILITY */}
                  <div className="border border-gold/20 glass rounded-3xl p-6 bg-gradient-to-r from-bg-dark-3/20 to-gold/5 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="max-w-xl">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/15 mb-2.5 inline-block">Partner Core Utility</span>
                        <h4 className="font-serif text-lg font-bold text-white">Open Partner Desk Direct Portals</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Access operations, real-time distributor desk widgets, and wealth reports instantly via direct external systems.</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a 
                          href="https://pdesk.njwealth.in/pdesk/login"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gold text-bg-dark hover:bg-gold-light px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-gold/5 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                        >
                          <ExternalLink size={14} />
                          NJ Partner Desk 2.0 (Modern)
                        </a>
                        <a 
                          href="https://www.njindiaonline.in/pdesk/login.fin?cmdAction=login"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0b0e14] hover:bg-white/5 border border-gold/15 text-gold hover:text-gold-light px-5 py-3 rounded-xl text-XS font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                        >
                          <ExternalLink size={14} />
                          NJ Wealth Partner Desk (Classic)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          ₹{(calculatedAum / 100000).toFixed(2)} Lakh
                        </h3>
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                          <span>↑ Direct synced ledger total (₹{calculatedAum.toLocaleString('en-IN')})</span>
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
                          {activeClientsCount} Portfolios
                        </h3>
                        <p className="text-[11px] text-gold/80 flex items-center gap-1 font-medium">
                          <span>100% active ledger clients verified</span>
                        </p>
                      </div>
                    </div>

                    {/* WIDGET 3: LEAD STATUS */}
                    <div className="border border-gold/5 bg-bg-dark-3/10 rounded-2xl p-6 flex flex-col justify-between select-none opacity-40 cursor-not-allowed">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Inquiry Conversion Baseline</span>
                        <div className="p-2 bg-stone-900 rounded-xl text-stone-600">
                          <CheckCircle size={16} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-sans text-2xl font-extrabold text-stone-500 mb-2 font-mono">
                          N/A
                        </h3>
                        <p className="text-[11px] text-stone-600 flex items-center gap-1 font-medium">
                          <span>Disabled temporarily</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RECHARTS MONTHLY GROWTH TREND */}
                  <div className="border border-gold/10 glass rounded-3xl p-6 bg-bg-dark-3/30 hover:border-gold/20 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/15 mb-2 inline-block">Real-time Analytics</span>
                        <h4 className="font-serif text-lg font-bold text-white">Monthly AUM & SIP Growth Trend</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Progressive financial growth mapping of combined advisory assets and systematic book value over 2026.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 bg-[#0a0c10]/40 px-4 py-2.5 rounded-2xl border border-gold/5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                          <span className="text-stone-300 font-medium">Total AUM: <strong className="text-white font-mono">₹{(calculatedAum / 100000).toFixed(2)}L</strong></span>
                        </div>
                        <div className="h-3 w-px bg-gold/10" />
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="text-stone-300 font-medium">SIP Book: <strong className="text-white font-mono">₹{(totalSip / 1000).toFixed(0)}k</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-80 md:h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={liveTrendData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorAum" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d6ad60" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#d6ad60" stopOpacity={0.01}/>
                            </linearGradient>
                            <linearGradient id="colorSip" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#34d399" stopOpacity={0.01}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,173,96,0.04)" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            stroke="#8c8a82" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10} 
                          />
                          <YAxis 
                            stroke="#8c8a82" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`} 
                            dx={-10} 
                          />
                          <Tooltip content={<CustomChartTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="Total AUM" 
                            stroke="#d6ad60" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorAum)" 
                            activeDot={{ r: 6, stroke: '#10141a', strokeWidth: 2 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="Monthly SIP Book" 
                            stroke="#34d399" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorSip)" 
                            activeDot={{ r: 5, stroke: '#10141a', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'clients' && (
                <motion.div
                  key="tab-clients"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* TOP BANNER */}
                  <div className="border border-gold/20 glass rounded-3xl p-6 bg-gradient-to-r from-bg-dark-3/20 to-gold/5 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="max-w-2xl">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/15 mb-2.5 inline-block">
                          Connected Google Sheets Hub
                        </span>
                        <h4 className="font-serif text-xl font-bold text-white">Customer Relationship Manager (CRM) & Client Data</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Directly manage leads, track customer relationships, and access official NJ Wealth client portfolios via synchronized live Google Sheets pipelines.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <a
                          href="https://docs.google.com/spreadsheets/d/1fjN_jGxTV-kh1CWjsKYUCeQoR5HrdtQB7FaXidVc5x4/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gold text-bg-dark hover:bg-gold-light px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-gold/5 transition-all cursor-pointer"
                        >
                          <ExternalLink size={14} />
                          Open CRM Sheet
                        </a>
                        <a
                          href="https://docs.google.com/spreadsheets/d/1Jdz00vZWoN_-lLilUw7uHxJzkq-q-mxCof0TuWEBUnw/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0b0e14] hover:bg-white/5 border border-gold/20 text-gold hover:text-gold-light px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <ExternalLink size={14} />
                          Open NJ Client Data Sheet
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* CARDS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CRM CARD */}
                    <div className={`border rounded-2xl p-6 transition-all flex flex-col justify-between ${
                      activeCrmSheet === 'crm' 
                        ? 'border-gold/40 bg-gold/5 shadow-xl shadow-gold/5' 
                        : 'border-gold/10 bg-bg-dark-3/40 hover:border-gold/25'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            Active CRM Pipeline
                          </span>
                          <FileSpreadsheet size={18} className="text-gold" />
                        </div>
                        <h5 className="font-serif text-lg font-bold text-white mb-2">Customer Relationship Manager (CRM)</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                          Track customer leads, sales pipelines, client follow-up reminders, interaction histories, and onboard status in real-time.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gold/10">
                        <button
                          onClick={() => setActiveCrmSheet('crm')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            activeCrmSheet === 'crm'
                              ? 'bg-gold text-bg-dark font-extrabold shadow-md'
                              : 'bg-gold/10 text-gold hover:bg-gold/20'
                          }`}
                        >
                          <FileSpreadsheet size={13} />
                          {activeCrmSheet === 'crm' ? 'Viewing Preview Below' : 'Preview CRM Sheet'}
                        </button>

                        <a
                          href="https://docs.google.com/spreadsheets/d/1fjN_jGxTV-kh1CWjsKYUCeQoR5HrdtQB7FaXidVc5x4/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1 ml-auto transition-colors"
                        >
                          Open External <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    {/* NJ CLIENT DATA CARD */}
                    <div className={`border rounded-2xl p-6 transition-all flex flex-col justify-between ${
                      activeCrmSheet === 'nj' 
                        ? 'border-gold/40 bg-gold/5 shadow-xl shadow-gold/5' 
                        : 'border-gold/10 bg-bg-dark-3/40 hover:border-gold/25'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                            NJ Wealth Ledger
                          </span>
                          <Users size={18} className="text-gold" />
                        </div>
                        <h5 className="font-serif text-lg font-bold text-white mb-2">NJ Client Data</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                          Official NJ Wealth distributor database of client accounts, UCC codes, portfolio assets, SIP mandates, and contact records.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gold/10">
                        <button
                          onClick={() => setActiveCrmSheet('nj')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            activeCrmSheet === 'nj'
                              ? 'bg-gold text-bg-dark font-extrabold shadow-md'
                              : 'bg-gold/10 text-gold hover:bg-gold/20'
                          }`}
                        >
                          <FileSpreadsheet size={13} />
                          {activeCrmSheet === 'nj' ? 'Viewing Preview Below' : 'Preview NJ Sheet'}
                        </button>

                        <a
                          href="https://docs.google.com/spreadsheets/d/1Jdz00vZWoN_-lLilUw7uHxJzkq-q-mxCof0TuWEBUnw/edit?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-stone-300 hover:text-white flex items-center gap-1 ml-auto transition-colors"
                        >
                          Open External <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* LIVE SPREADSHEET EMBEDDED WORKSPACE */}
                  <div className="border border-gold/15 rounded-3xl bg-[#080a0f] overflow-hidden shadow-2xl space-y-0">
                    {/* WORKSPACE HEADER BAR */}
                    <div className="bg-[#0b0e14] p-4 border-b border-gold/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      {/* TAB SWITCHER */}
                      <div className="flex items-center gap-2 bg-[#040609] p-1.5 rounded-2xl border border-gold/10">
                        <button
                          onClick={() => setActiveCrmSheet('crm')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            activeCrmSheet === 'crm'
                              ? 'bg-gold text-bg-dark font-extrabold shadow-md'
                              : 'text-stone-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <FileSpreadsheet size={14} />
                          CRM Sheet
                        </button>

                        <button
                          onClick={() => setActiveCrmSheet('nj')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            activeCrmSheet === 'nj'
                              ? 'bg-gold text-bg-dark font-extrabold shadow-md'
                              : 'text-stone-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Users size={14} />
                          NJ Client Data Sheet
                        </button>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-3 justify-end">
                        <a
                          href={
                            activeCrmSheet === 'crm'
                              ? 'https://docs.google.com/spreadsheets/d/1fjN_jGxTV-kh1CWjsKYUCeQoR5HrdtQB7FaXidVc5x4/edit?usp=sharing'
                              : 'https://docs.google.com/spreadsheets/d/1Jdz00vZWoN_-lLilUw7uHxJzkq-q-mxCof0TuWEBUnw/edit?usp=sharing'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink size={13} />
                          Open Full Google Sheet
                        </a>
                      </div>
                    </div>

                    {/* IFRAME CONTAINER */}
                    <div className="w-full bg-[#0a0c10] relative min-h-[620px]">
                      <iframe
                        key={activeCrmSheet}
                        src={
                          activeCrmSheet === 'crm'
                            ? 'https://docs.google.com/spreadsheets/d/1fjN_jGxTV-kh1CWjsKYUCeQoR5HrdtQB7FaXidVc5x4/htmlview?widget=true&headers=false'
                            : 'https://docs.google.com/spreadsheets/d/1Jdz00vZWoN_-lLilUw7uHxJzkq-q-mxCof0TuWEBUnw/htmlview?widget=true&headers=false'
                        }
                        className="w-full h-[650px] border-none"
                        title={activeCrmSheet === 'crm' ? 'CRM Google Sheet' : 'NJ Client Data Google Sheet'}
                        allowFullScreen
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIORITY SIP REMINDERS NOTIFICATION MODAL */}
      <AnimatePresence>
        {showSipDueModal && (
          <div id="sip-notification-modal-wrapper" className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSipDueModal(false)}
              className="fixed inset-0 bg-[#020408]/85 backdrop-blur-sm cursor-pointer"
              id="sip-modal-backdrop"
            />

            {/* Modal Dialog container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-[#0a0d14] border border-amber-500/25 rounded-2xl overflow-hidden shadow-2xl z-10 p-6 md:p-8 text-white"
              id="sip-modal-dialog"
            >
              {/* Top Warning/Alert Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shrink-0 shadow-lg shadow-amber-500/5" id="sip-bell-pulsar-container">
                  <Bell size={24} className="stroke-[1.5] animate-bounce" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    Priority SIP Reminders
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    The following client profiles have scheduled monthly SIP dates occurring in the <strong>next 48 hours</strong>.
                  </p>
                </div>
              </div>

              {/* Client Lists Section */}
              {dueSipClients.length > 0 ? (
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 overflow-x-hidden border-t border-b border-white/5 py-4 my-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
                  {dueSipClients.map(client => {
                    const alertInfo = isSipDueWithin48Hours(client.installmentRemainder);
                    return (
                      <div 
                        key={client.srNo} 
                        className="bg-[#0e1118]/85 border border-gold/10 hover:border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all group"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-bold text-white text-sm truncate group-hover:text-gold transition-colors">{client.investor}</span>
                            <span className="text-[9px] font-mono font-black text-gold bg-gold/10 border border-gold/10 px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0">
                              CODE: {client.clientCode}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2.5 text-[11px] text-stone-400 flex-wrap">
                            <span className="whitespace-nowrap">📞 {client.mobile}</span>
                            <span className="text-stone-700">•</span>
                            <span className="font-mono text-stone-500 font-medium">
                              Schedule: {client.installmentRemainder ? client.installmentRemainder.split(' ')[0] : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-extrabold text-white text-sm">
                            ₹{client.sipAmount?.toLocaleString('en-IN')}
                          </div>
                          {alertInfo && (
                            <span className={`inline-flex items-center justify-end gap-1 text-[9px] font-bold tracking-wider uppercase mt-1 ${
                              alertInfo.daysRemaining === 0 
                                ? 'text-red-400' 
                                : alertInfo.daysRemaining === 1 
                                  ? 'text-amber-300' 
                                  : 'text-gold'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                alertInfo.daysRemaining === 0 ? 'bg-red-400 animate-ping' : 'bg-amber-300'
                              }`} />
                              {alertInfo.daysRemaining === 0 ? "Due Today" : alertInfo.daysRemaining === 1 ? "Due Tomorrow" : "Approaching"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center text-stone-500 border-t border-b border-light/5 my-4" id="sip-notification-no-due">
                  <CheckCircle size={32} className="mx-auto text-emerald-500/40 mb-3" />
                  <p className="text-xs font-semibold text-stone-400">All perfect! No SIP payment schedules are approaching in the 48-hour range.</p>
                </div>
              )}

              {/* Advisory Actions / Close block footer */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSipDueModal(false)}
                  className="w-full sm:flex-1 bg-stone-900 border border-white/5 hover:bg-stone-800 text-stone-300 font-bold uppercase tracking-wider py-3 rounded-xl text-[10px] transition-colors cursor-pointer"
                  id="sip-dismiss-close-modal-btn"
                >
                  Acknowledge & Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('clients');
                    setShowSipDueModal(false);
                  }}
                  className="w-full sm:flex-1 bg-gold hover:bg-gold-light text-bg-dark font-black uppercase tracking-widest py-3 rounded-xl text-[10px] shadow-lg shadow-gold/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  id="sip-inspect-clients-btn"
                >
                  <Users size={12} />
                  Inspect Client Ledger
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
