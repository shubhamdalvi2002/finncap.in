import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  X, 
  ChevronRight, 
  FileSignature, 
  ArrowLeft, 
  Home, 
  ExternalLink, 
  Headset, 
  ListFilter, 
  Search, 
  Copy, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { FinauraLogo } from './FinauraLogo';

const GOOGLE_FORM_URL = "https://forms.gle/mnC4LFNZMtRZ1MPd9";
const WHATSAPP_URL = "https://wa.me/919423669236?text=Hi%20FinAura%20Capital!%20I%20would%20like%20to%20enquire%20about%20your%20financial%20services.";

interface TopicItem {
  label: string;
  title: string;
  content: string;
  tag?: string;
  highlights?: string[];
}

interface CategoryData {
  title: string;
  prompt: string;
  items: Record<string, TopicItem>;
}

const chatbotData: Record<string, CategoryData> = {
  investment: {
    title: "Investment Options",
    prompt: "What would you like to know about?",
    items: {
      mutual_funds: {
        label: "Mutual Funds",
        title: "Mutual Funds",
        tag: "Wealth Creation",
        content: "A mutual fund pools money from multiple investors and invests it in a diversified portfolio of securities such as equities, bonds or other assets. Mutual funds are managed by professional fund managers and are available across different risk and investment objectives.",
        highlights: [
          "Diversified across top companies",
          "Managed by professional fund managers",
          "Flexible options (Equity, Debt, Hybrid)"
        ]
      },
      sip: {
        label: "SIP (Systematic Investment)",
        title: "Systematic Investment Plan (SIP)",
        tag: "Disciplined Growth",
        content: "SIP allows you to invest a fixed amount regularly, usually monthly, into a mutual fund. It helps develop disciplined investing and allows you to invest gradually instead of investing a large amount at once.",
        highlights: [
          "Start with as little as ₹500/month",
          "Power of rupee cost averaging",
          "Compound growth over the long run"
        ]
      },
      lumpsum: {
        label: "Lumpsum Investment",
        title: "Lumpsum Investment",
        tag: "One-Time Allocation",
        content: "Lumpsum investment means investing a larger amount in a mutual fund or other investment in a single transaction instead of making regular installments.",
        highlights: [
          "Ideal for deploying surplus cash or bonuses",
          "Immediate market participation",
          "Custom asset allocation strategies"
        ]
      },
      swp: {
        label: "SWP (Systematic Withdrawal)",
        title: "Systematic Withdrawal Plan (SWP)",
        tag: "Regular Income",
        content: "SWP allows an investor to withdraw a fixed amount from a mutual fund investment at regular intervals. It can be useful for creating a regular cash flow from an investment portfolio.",
        highlights: [
          "Predictable monthly cash flow",
          "Tax-efficient income stream",
          "Remaining balance continues to grow"
        ]
      },
      stp: {
        label: "STP (Systematic Transfer)",
        title: "Systematic Transfer Plan (STP)",
        tag: "Smart Rebalancing",
        content: "STP allows an investor to transfer a fixed amount from one mutual fund scheme to another at regular intervals. It is commonly used to gradually move money between different types of mutual fund investments.",
        highlights: [
          "Liquid fund to equity fund transition",
          "Protects against sudden market peaks",
          "Automated portfolio rebalancing"
        ]
      },
      etf: {
        label: "ETFs (Exchange Traded Funds)",
        title: "Exchange Traded Funds (ETFs)",
        tag: "Low Cost Indexing",
        content: "An ETF is an investment fund that is traded on a stock exchange like a stock. ETFs can provide exposure to a group of securities, an index, sector or other assets through a single investment.",
        highlights: [
          "Traded live in real-time on exchanges",
          "Low expense ratios",
          "Tracks indices like Nifty 50 and Gold"
        ]
      },
      stocks: {
        label: "Stocks (Equity Shares)",
        title: "Stocks",
        tag: "Direct Equity",
        content: "Stocks represent ownership in a company. When you purchase shares of a company, you become a shareholder. Stock investments can offer growth potential but also involve market risk.",
        highlights: [
          "Direct equity ownership in businesses",
          "Potential for capital appreciation & dividends",
          "Involves market volatility & research"
        ]
      }
    }
  },
  insurance: {
    title: "Insurance Options",
    prompt: "What type of insurance are you interested in?",
    items: {
      health_insurance: {
        label: "Health Insurance",
        title: "Health Insurance",
        tag: "Medical Safety",
        content: "Health insurance provides financial protection against eligible medical and hospitalization expenses. Depending on the policy, it may cover hospitalization, treatments, surgeries and other eligible healthcare expenses.",
        highlights: [
          "Cashless hospitalization network",
          "Pre & post hospitalization coverage",
          "Tax savings under Section 80D"
        ]
      },
      term_insurance: {
        label: "Term Insurance",
        title: "Term Insurance",
        tag: "Family Protection",
        content: "Term insurance provides life insurance coverage for a specified period. If the insured person passes away during the policy term, the policy provides a death benefit to the nominee, subject to the policy terms and conditions.",
        highlights: [
          "High life cover at affordable premiums",
          "Financial security for dependents",
          "Optional critical illness riders"
        ]
      },
      car_insurance: {
        label: "Car Insurance",
        title: "Car Insurance",
        tag: "Vehicle Protection",
        content: "Car insurance provides financial protection against covered risks related to your vehicle. Depending on the policy, coverage may include accidental damage, theft and third-party liabilities, subject to the policy terms and conditions.",
        highlights: [
          "Comprehensive & Zero-Depreciation options",
          "Third-party liability compliance",
          "24/7 roadside assistance support"
        ]
      }
    }
  }
};

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  title?: string;
  tag?: string;
  highlights?: string[];
}

type ChatView = 'welcome' | 'investment_list' | 'insurance_list' | 'topic_detail' | 'enquiry';

export const FinAuraAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>('welcome');
  const [activeCategory, setActiveCategory] = useState<'investment' | 'insurance' | null>(null);
  const [activeTopicKey, setActiveTopicKey] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: "Hello, I’m the FinAura Capital Assistant.\nHow can I help you today?"
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    handleReset();
  };

  const handleClose = () => {
    setIsOpen(false);
    handleReset();
  };

  const handleReset = () => {
    setCurrentView('welcome');
    setActiveCategory(null);
    setActiveTopicKey(null);
    setSearchQuery('');
    setIsTyping(false);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: "Hello, I’m the FinAura Capital Assistant.\nHow can I help you today?"
      }
    ]);
  };

  const addMessageWithTyping = (
    sender: 'bot' | 'user', 
    text: string, 
    title?: string, 
    tag?: string,
    highlights?: string[],
    callback?: () => void
  ) => {
    if (sender === 'user') {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-${Math.random()}`,
          sender,
          text,
          title,
          tag,
          highlights
        }
      ]);
      if (callback) callback();
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-${Math.random()}`,
          sender,
          text,
          title,
          tag,
          highlights
        }
      ]);
      if (callback) callback();
    }, 220);
  };

  const selectCategory = (category: 'investment' | 'insurance') => {
    setSearchQuery('');
    addMessageWithTyping('user', category === 'investment' ? 'Investment Options' : 'Insurance Solutions');
    setActiveCategory(category);
    setActiveTopicKey(null);

    const promptText = chatbotData[category].prompt;
    addMessageWithTyping('bot', promptText, undefined, undefined, undefined, () => {
      setCurrentView(category === 'investment' ? 'investment_list' : 'insurance_list');
    });
  };

  const selectTopic = (category: 'investment' | 'insurance', topicKey: string) => {
    setSearchQuery('');
    const topic = chatbotData[category].items[topicKey];
    addMessageWithTyping('user', topic.label);
    setActiveCategory(category);
    setActiveTopicKey(topicKey);

    addMessageWithTyping('bot', topic.content, topic.title, topic.tag, topic.highlights, () => {
      setTimeout(() => {
        addMessageWithTyping('bot', 'Would you like to make an enquiry or speak with a financial advisor?');
      }, 100);
      setCurrentView('topic_detail');
    });
  };

  const handleEnquiryClick = () => {
    addMessageWithTyping('user', 'Enquiry Now');
    addMessageWithTyping(
      'bot', 
      'Please continue to our enquiry form or WhatsApp desk. Our team will review your request and connect with you for personalized advisory.',
      undefined,
      undefined,
      undefined,
      () => {
        setCurrentView('enquiry');
      }
    );
  };

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Search filter across all topics
  const allTopics = [
    ...Object.entries(chatbotData.investment.items).map(([key, item]) => ({ ...item, key, category: 'investment' as const })),
    ...Object.entries(chatbotData.insurance.items).map(([key, item]) => ({ ...item, key, category: 'insurance' as const })),
  ];

  const filteredTopics = searchQuery.trim() === '' 
    ? [] 
    : allTopics.filter(t => 
        t.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.tag && t.tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <>
      {/* Floating Chat Trigger Button with Pure White Headset Icon */}
      <motion.button
        type="button"
        id="finaura-assistant-trigger"
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-8 right-24 z-[998] w-14 h-14 bg-gradient-to-tr from-blue-950 via-blue-900 to-blue-800 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-950/40 border border-white/20 hover:shadow-2xl hover:shadow-blue-900/50 transition-all cursor-pointer group"
        aria-label="FinAura Capital Financial Assistant"
        title="FinAura Capital Financial Assistant"
      >
        {/* Subtle white pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />
        
        {/* White Assistance Icon */}
        <Headset className="w-6 h-6 text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
        
        {/* Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl border border-white/10">
          FinAura Assistant
        </span>
      </motion.button>

      {/* Floating Chat Widget Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="finaura-assistant-modal"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-8 z-[999] w-[400px] max-w-[calc(100vw-24px)] h-[600px] max-h-[calc(100vh-110px)] bg-white rounded-2xl shadow-2xl shadow-slate-950/25 border border-slate-200/80 flex flex-col overflow-hidden font-sans text-slate-900"
          >
            {/* Header: Company Logo Left of Name & White Icons */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-4 py-3.5 flex items-center justify-between select-none border-b border-white/10 relative">
              <div className="flex items-center gap-3">
                {/* Company Logo in pure white left of the name */}
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
                  <FinauraLogo variant="icon-white" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-[14px] sm:text-[15px] leading-tight text-white tracking-tight">
                      FinAura Capital Assistant
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active" />
                  </div>
                  <p className="text-[11px] text-blue-200/90 font-medium mt-0.5">
                    Financial Advisory & Product Intelligence
                  </p>
                </div>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  title="Restart Conversation"
                  aria-label="Restart Conversation"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  title="Close Assistant"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., SIP, Mutual Funds, Health)..."
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Search Results Overlay if Searching */}
            {searchQuery.trim() !== '' ? (
              <div className="flex-1 p-3 overflow-y-auto bg-slate-50 flex flex-col gap-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
                  Matching Results ({filteredTopics.length})
                </div>
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <button
                      key={`${topic.category}-${topic.key}`}
                      type="button"
                      onClick={() => selectTopic(topic.category, topic.key)}
                      className="w-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-2.5 rounded-xl text-left transition-all group flex items-center justify-between shadow-sm cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-blue-950 group-hover:text-blue-700">
                            {topic.label}
                          </span>
                          {topic.tag && (
                            <span className="text-[9px] bg-blue-100/80 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                              {topic.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {topic.content}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No matching financial topics found for "{searchQuery}".
                  </div>
                )}
              </div>
            ) : (
              /* Normal Conversation Stream */
              <div className="flex-1 p-3.5 overflow-y-auto bg-slate-50/50 flex flex-col gap-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] p-3.5 rounded-2xl text-[13px] leading-relaxed break-words shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-900 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      {/* Topic Title & Badge Header */}
                      {msg.title && (
                        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 font-bold text-blue-950 text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            {msg.title}
                          </div>
                          {msg.tag && (
                            <span className="text-[9px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                              {msg.tag}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="whitespace-pre-line text-[12.5px] leading-normal">
                        {msg.text}
                      </div>

                      {/* Bullet Highlights */}
                      {msg.highlights && msg.highlights.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Key Highlights:
                          </span>
                          {msg.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11.5px] text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Copy Action Button for Bot Cards */}
                      {msg.sender === 'bot' && msg.title && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleCopyContent(`${msg.title}\n\n${msg.text}`, msg.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-700 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-100"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Details</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Simulated Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 bg-white border border-slate-200 p-2.5 rounded-xl rounded-tl-xs w-fit shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Interactive Controls & Navigation */}
            {searchQuery.trim() === '' && (
              <div className="p-3 bg-white border-t border-slate-200/90 flex flex-col gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>
                    {currentView === 'welcome' && 'Select Category'}
                    {currentView === 'investment_list' && 'Investment Categories'}
                    {currentView === 'insurance_list' && 'Insurance Solutions'}
                    {currentView === 'topic_detail' && 'Next Steps'}
                    {currentView === 'enquiry' && 'Submit Enquiry'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-normal">Rule-based • Fast response</span>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[170px] overflow-y-auto pr-1">
                  {/* VIEW 1: WELCOME SCREEN */}
                  {currentView === 'welcome' && (
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => selectCategory('investment')}
                        className="bg-gradient-to-b from-white to-blue-50/50 hover:to-blue-50 border border-blue-200/90 text-blue-950 font-semibold p-3 rounded-xl text-xs flex flex-col items-start gap-2 transition-all shadow-xs cursor-pointer text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[13px] text-blue-950">Investment</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Mutual Funds, SIP, Stocks</div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => selectCategory('insurance')}
                        className="bg-gradient-to-b from-white to-indigo-50/50 hover:to-indigo-50 border border-indigo-200/90 text-indigo-950 font-semibold p-3 rounded-xl text-xs flex flex-col items-start gap-2 transition-all shadow-xs cursor-pointer text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[13px] text-indigo-950">Insurance</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Health, Term, Car</div>
                        </div>
                      </motion.button>
                    </div>
                  )}

                  {/* VIEW 2: INVESTMENT TOPICS */}
                  {currentView === 'investment_list' && (
                    <>
                      {Object.entries(chatbotData.investment.items).map(([key, item]) => (
                        <motion.button
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          key={key}
                          type="button"
                          onClick={() => selectTopic('investment', key)}
                          className="w-full bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-blue-950 font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{item.label}</span>
                            {item.tag && (
                              <span className="text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                        </motion.button>
                      ))}
                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-medium px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
                      </button>
                    </>
                  )}

                  {/* VIEW 3: INSURANCE TOPICS */}
                  {currentView === 'insurance_list' && (
                    <>
                      {Object.entries(chatbotData.insurance.items).map(([key, item]) => (
                        <motion.button
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          key={key}
                          type="button"
                          onClick={() => selectTopic('insurance', key)}
                          className="w-full bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-indigo-950 font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{item.label}</span>
                            {item.tag && (
                              <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                        </motion.button>
                      ))}
                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-medium px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Menu
                      </button>
                    </>
                  )}

                  {/* VIEW 4: TOPIC DETAILS & ACTIONS */}
                  {currentView === 'topic_detail' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleEnquiryClick}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-3.5 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        <span>Enquiry Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                      </motion.button>

                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeCategory === 'investment') {
                              addMessageWithTyping('user', 'Back to Investment Options');
                              setCurrentView('investment_list');
                            } else {
                              addMessageWithTyping('user', 'Back to Insurance Options');
                              setCurrentView('insurance_list');
                            }
                          }}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ListFilter className="w-3.5 h-3.5 text-blue-600" />
                          <span>All {activeCategory === 'investment' ? 'Investments' : 'Insurance'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Home className="w-3.5 h-3.5 text-slate-500" />
                          <span>Main Menu</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* VIEW 5: ENQUIRY CONFIRMATION */}
                  {currentView === 'enquiry' && (
                    <>
                      <div className="flex flex-col gap-2">
                        <a
                          href={GOOGLE_FORM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer text-center"
                        >
                          <span>Submit Online Google Form</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer text-center"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Connect on WhatsApp Desk</span>
                        </a>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeCategory && activeTopicKey) {
                              setCurrentView('topic_detail');
                            } else if (activeCategory === 'investment') {
                              setCurrentView('investment_list');
                            } else {
                              setCurrentView('insurance_list');
                            }
                          }}
                          className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3 h-3" /> Back
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Home className="w-3 h-3" /> Main Menu
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Educational Disclaimer Footer */}
            <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 text-[9.5px] text-slate-500 text-center leading-tight select-none">
              Educational purposes only. Not financial advice. Subject to market risks & terms.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
