import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, RefreshCw, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface CalculatorAIAssistantProps {
  calculatorType: 'sip' | 'swp' | 'stp' | 'retirement' | 'emi' | 'goal';
  calculatorData: any;
}

export const CalculatorAIAssistant: React.FC<CalculatorAIAssistantProps> = ({
  calculatorType,
  calculatorData,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts depending on the active calculator type
  const getSuggestedPrompts = () => {
    switch (calculatorType) {
      case 'sip':
        return [
          { label: 'Interpret my SIP results', prompt: 'Please interpret my current SIP calculation results and numbers.' },
          { label: 'Is 12% return realistic?', prompt: 'Is a 12% expected annual return realistic for Indian market mutual funds?' },
          { label: 'What is a Step-Up SIP?', prompt: 'What is a Step-up SIP and how can it boost my final retirement wealth?' }
        ];
      case 'swp':
        return [
          { label: 'Check sustainability', prompt: 'Is my Systematic Withdrawal Plan (SWP) withdrawal rate sustainable?' },
          { label: 'What is Sequence of Returns Risk?', prompt: 'Can you explain Sequence of Returns Risk in SWPs?' },
          { label: 'SWP Tax efficiency in India', prompt: 'How is SWP more tax-efficient than dividend or FD payouts in India?' }
        ];
      case 'stp':
        return [
          { label: 'Why use STP over Lump Sum?', prompt: 'Why is an STP preferred over a direct lump-sum investment in equity markets?' },
          { label: 'Explain debt-to-equity migration', prompt: 'Explain the low-risk to high-growth systematic migration concept.' }
        ];
      case 'retirement':
        return [
          { label: 'Why does inflation matter?', prompt: 'Why does a 6% inflation rate cause my expenses to double every 12 years?' },
          { label: 'Post-retirement asset allocation', prompt: 'What is a safe asset allocation strategy during the post-retirement withdrawal phase in India?' }
        ];
      case 'emi':
        return [
          { label: 'Explain Amortization scheduling', prompt: 'Why are early EMIs mostly interest repayments? How does prepayment help?' },
          { label: 'Impact of interest rate hikes', prompt: 'How does a 1% home loan interest rate hike affect my tenure or EMI?' }
        ];
      case 'goal':
        return [
          { label: 'How to close the goal gap?', prompt: 'If I can\'t invest this much monthly today, what are alternative ways to reach my goal?' },
          { label: 'Effect of starting early', prompt: 'How does starting my investments 5 years earlier reduce my required monthly savings?' }
        ];
      default:
        return [
          { label: 'Get Expert Summary', prompt: 'Please analyze my current numbers and give me an educational summary.' }
        ];
    }
  };

  // Auto-scroll chat to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle auto-analysis on data/type change or manual request
  const handleAutoAnalysis = async (customPrompt?: string) => {
    const promptToSend = customPrompt || `Please analyze my current ${calculatorType.toUpperCase()} calculation.`;
    setIsLoading(true);
    setError(null);

    // If starting a new analysis, clear history or keep context
    const newUserMessage: Message = { role: 'user', text: promptToSend };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/calculator-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: promptToSend,
          calculatorType,
          calculatorData,
          history: messages, // Send existing chat log
        }),
      });

      if (!response.ok) {
        throw new Error('Could not fetch expert insights. Please check your connection.');
      }

      const data = await response.json();
      const modelMessage: Message = { role: 'model', text: data.text || 'No insights returned.' };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      setError(err?.message || 'An unexpected issue occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage;
    setInputMessage('');
    await handleAutoAnalysis(userText);
  };

  return (
    <div id="calculator-ai-section" className="mt-8 border border-gold/10 rounded-[32px] bg-[#090b0d]/70 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Widget Header */}
      <div id="ai-widget-header" className="p-6 md:p-8 border-b border-gold/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gold/5 via-transparent to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-gold/10 flex items-center justify-center border border-gold/20">
              <Sparkles size={14} className="text-gold" />
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-gold">AI Co-Pilot</span>
          </div>
          <h4 className="font-serif text-lg font-bold text-white">FinAura Portfolio Intuition</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Let AI parse, interpret, and risk-evaluate your current parameters.</p>
        </div>

        <button
          id="btn-ai-analyze-now"
          onClick={() => handleAutoAnalysis()}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-xs font-bold text-gold transition-all hover:border-gold/50 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} className="fill-gold/10" />
          )}
          {isLoading ? 'Analysing...' : 'Interpret My Numbers'}
        </button>
      </div>

      {/* Main Core Region */}
      <div id="ai-main-chatbox" className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
        {/* Left Side: Predefined Prompts & Educational Benchmarks */}
        <div id="ai-suggest-sidebar" className="lg:col-span-4 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gold/10 space-y-6 bg-[#000000]/10">
          <div>
            <h5 className="text-[10px] uppercase font-bold tracking-wider text-gold/80 mb-3 flex items-center gap-1.5">
              <HelpCircle size={12} className="text-gold" />
              Suggested Queries
            </h5>
            <div className="space-y-2">
              {getSuggestedPrompts().map((p, idx) => (
                <button
                  key={idx}
                  id={`ai-prompt-${idx}`}
                  onClick={() => handleAutoAnalysis(p.prompt)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl border border-gold/5 bg-bg-dark-3/50 hover:bg-gold/5 hover:border-gold/20 text-xs text-muted-foreground hover:text-white transition-all disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gold/10 pt-6">
            <h5 className="text-[10px] uppercase font-bold tracking-wider text-gold/80 mb-3 flex items-center gap-1.5">
              <TrendingUp size={12} className="text-gold" />
              Indian Benchmark Returns
            </h5>
            <div className="space-y-2 text-[11px] text-muted-foreground font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Bank FD Average</span>
                <span className="text-white font-bold">~6.5% - 7.5%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Nifty 50 Index CAGR</span>
                <span className="text-white font-bold">~12.0% - 13.5%</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Nifty Midcap 150 CAGR</span>
                <span className="text-white font-bold">~15.0% - 18.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Conversation Logs & Interactive Input */}
        <div id="ai-chat-content" className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between bg-bg-dark-2/20">
          
          {/* Conversation Stream */}
          <div id="ai-message-pane" className="flex-1 overflow-y-auto max-h-[350px] space-y-4 mb-6 pr-1">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground px-4">
                <Sparkles size={28} className="text-gold/40 mb-3 animate-pulse" />
                <p className="text-xs font-semibold text-white/90">Curious about what your compound growth looks like?</p>
                <p className="text-[10px] text-muted-foreground max-w-sm mt-1">
                  Click <strong className="text-gold">"Interpret My Numbers"</strong> or choose any query on the left to start.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    id={`chat-msg-${idx}`}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`text-[9px] uppercase tracking-wider font-bold mb-1 px-1 ${
                      m.role === 'user' ? 'text-gold/60' : 'text-white/60'
                    }`}>
                      {m.role === 'user' ? 'You' : 'FinAura Expert Co-Pilot'}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[90%] border ${
                      m.role === 'user' 
                        ? 'bg-gold/10 border-gold/30 text-white rounded-tr-none' 
                        : 'bg-bg-dark-3/80 border-gold/10 text-muted-foreground rounded-tl-none font-sans'
                    }`}>
                      <div className="markdown-body prose prose-invert max-w-none text-xs leading-relaxed">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div className="text-[9px] uppercase tracking-wider font-bold mb-1 text-white/40 px-1">
                      Thinking...
                    </div>
                    <div className="p-4 rounded-2xl text-xs bg-bg-dark-3/40 border border-white/5 text-muted-foreground rounded-tl-none flex items-center gap-2">
                      <RefreshCw size={12} className="animate-spin text-gold" />
                      <span className="font-sans">Analyzing mathematical models and generating educational insights...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Prompt Form */}
          <form id="ai-entry-form" onSubmit={handleSendMessage} className="relative mt-auto">
            <input
              id="input-ai-text"
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask anything about mutual funds, CAGR, SWP, or compounding..."
              disabled={isLoading}
              className="w-full text-xs py-4 pl-5 pr-14 bg-bg-dark-3/90 border border-gold/20 focus:border-gold/60 rounded-2xl outline-none text-white placeholder-muted-foreground/60 focus:ring-1 focus:ring-gold/30 transition-all font-sans"
            />
            <button
              id="btn-ai-submit-prompt"
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gold hover:bg-gold-light text-bg-dark transition-all disabled:opacity-40 disabled:hover:bg-gold flex items-center justify-center cursor-pointer"
            >
              <Send size={14} className="fill-bg-dark" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
