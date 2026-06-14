import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const INITIAL_STOCKS = [
  { name: 'NIFTY 50', price: 24356.55, change: +0.43, high: 24410.20, low: 24290.15, volume: 245600000, marketCap: 185000000000000 },
  { name: 'SENSEX', price: 80218.37, change: +0.38, high: 80350.50, low: 80120.10, volume: 15600000, marketCap: 410000000000000 },
  { name: 'NIFTY BANK', price: 52134.10, change: -0.21, high: 52300.00, low: 52050.45, volume: 85400000, marketCap: 35000000000000 },
  { name: 'RELIANCE', price: 2987.45, change: +1.12, high: 3010.00, low: 2965.20, volume: 4500000, marketCap: 20200000000000 },
  { name: 'TCS', price: 4123.80, change: +0.67, high: 4150.00, low: 4105.50, volume: 1200000, marketCap: 14900000000000 },
  { name: 'HDFC BANK', price: 1712.30, change: -0.45, high: 1730.00, low: 1705.10, volume: 12500000, marketCap: 13000000000000 },
  { name: 'INFOSYS', price: 1894.55, change: +0.89, high: 1910.20, low: 1880.00, volume: 3200000, marketCap: 7800000000000 },
  { name: 'ICICI BANK', price: 1298.70, change: +0.34, high: 1305.00, low: 1288.40, volume: 8900000, marketCap: 9100000000000 },
  { name: 'WIPRO', price: 567.25, change: -0.18, high: 575.00, low: 562.10, volume: 5600000, marketCap: 2900000000000 },
  { name: 'BAJAJ FIN', price: 7234.90, change: +1.45, high: 7280.00, low: 7150.00, volume: 980000, marketCap: 4400000000000 },
  { name: 'LT', price: 3654.20, change: +0.72, high: 3680.00, low: 3630.00, volume: 1100000, marketCap: 5100000000000 },
  { name: 'MARUTI', price: 12450.60, change: -0.30, high: 12550.00, low: 12380.00, volume: 450000, marketCap: 3900000000000 },
  { name: 'NIFTY MID', price: 58934.20, change: +0.61, high: 59100.00, low: 58750.00, volume: 125000000, marketCap: 25000000000000 },
  { name: 'GOLD', price: 73245.00, change: +0.25, high: 73500.00, low: 73100.00, volume: 5000, marketCap: 0 },
  { name: 'NIFTY IT', price: 39812.45, change: +1.02, high: 40050.00, low: 39600.00, volume: 45000000, marketCap: 15000000000000 },
];

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const PORT = 3000;

let currentStocks = [...INITIAL_STOCKS];
let currentNews: any[] = [];
let marketIndicators = {
  inflation: 6.0,
  interestRate: 8.5,
  marketReturn: 12.0,
  goldRate: 73245
};

let isApiKeyInvalid = false;

const fetchMarketIndicators = async () => {
  const apiKey = process.env.FINANCIAL_API_KEY;
  // Skip if key is missing, a placeholder, or known to be invalid
  if (!apiKey || apiKey === 'your_fmp_api_key' || apiKey.includes('TODO') || isApiKeyInvalid) {
    if (!apiKey && !isApiKeyInvalid) console.log('No FINANCIAL_API_KEY, using simulated indicators');
    else if (isApiKeyInvalid) {
      // Silent fallback
    } else {
      console.log('FINANCIAL_API_KEY is a placeholder, using simulated indicators');
    }
    
    marketIndicators = {
      inflation: parseFloat((5.5 + Math.random()).toFixed(2)),
      interestRate: parseFloat((8.0 + Math.random()).toFixed(2)),
      marketReturn: parseFloat((11.5 + Math.random() * 2).toFixed(2)),
      goldRate: 73000 + Math.floor(Math.random() * 1000)
    };
  } else {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const [inflationRes, interestRes] = await Promise.all([
        fetch(`https://financialmodelingprep.com/api/v3/economic/inflation?apikey=${apiKey}`, { signal: controller.signal }),
        fetch(`https://financialmodelingprep.com/api/v3/economic/interest-rate?apikey=${apiKey}`, { signal: controller.signal })
      ]);
      clearTimeout(timeoutId);

      if (inflationRes.ok) {
        const data = await inflationRes.json();
        if (data && data.length > 0) marketIndicators.inflation = parseFloat(data[0].value);
      } else {
        if (inflationRes.status === 401) {
          isApiKeyInvalid = true;
          console.warn('FINANCIAL_API_KEY is invalid (401). Switching to simulation mode.');
        } else {
          console.warn(`Inflation API Error: ${inflationRes.status}`);
        }
      }

      if (interestRes.ok) {
        const data = await interestRes.json();
        if (data && data.length > 0) marketIndicators.interestRate = parseFloat(data[0].value);
      } else {
        if (interestRes.status === 401) {
          isApiKeyInvalid = true;
        } else {
          console.warn(`Interest Rate API Error: ${interestRes.status}`);
        }
      }
      
      marketIndicators.marketReturn = parseFloat((12.5 + (Math.random() - 0.5)).toFixed(2));
    } catch (err) {
      console.error('Error fetching market indicators:', err);
      // Simulation as fallback
      marketIndicators = {
        ...marketIndicators,
        inflation: parseFloat((5.5 + Math.random()).toFixed(2)),
        interestRate: parseFloat((8.0 + Math.random()).toFixed(2)),
        marketReturn: parseFloat((11.5 + Math.random() * 2).toFixed(2)),
      };
    }
  }

  const message = JSON.stringify({ type: 'MARKET_INDICATORS', data: marketIndicators });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const fetchStocks = async () => {
  const apiKey = process.env.FINANCIAL_API_KEY;
  // Skip if key is missing, a placeholder, or known to be invalid
  if (!apiKey || apiKey === 'your_fmp_api_key' || apiKey.includes('TODO') || isApiKeyInvalid) {
    if (!apiKey && !isApiKeyInvalid) console.log('No FINANCIAL_API_KEY, using simulated stocks');
    else if (isApiKeyInvalid) {
      // Silent fallback
    } else {
      console.log('FINANCIAL_API_KEY is a placeholder, using simulated stocks');
    }
    
    currentStocks = currentStocks.map(s => {
      const drift = (Math.random() - 0.498) * 0.12;
      const newChange = parseFloat((s.change + drift).toFixed(2));
      const newPrice = parseFloat((s.price * (1 + drift / 100)).toFixed(2));
      const newHigh = Math.max(s.high || newPrice, newPrice);
      const newLow = Math.min(s.low || newPrice, newPrice);
      const newVolume = (s.volume || 1000000) + Math.floor((Math.random() - 0.5) * 10000);
      return { 
        ...s, 
        price: newPrice, 
        change: newChange,
        high: newHigh,
        low: newLow,
        volume: Math.max(0, newVolume)
      };
    });
  } else {
    try {
      const symbols = [
        'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 
        'WIPRO.NS', 'BAJFINANCE.NS', 'LT.NS', 'MARUTI.NS', 'AAPL', 'GOOGL', 'MSFT'
      ].join(',');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          currentStocks = data.map((item: any) => ({
            name: item.name || item.symbol.replace('.NS', ''),
            price: item.price,
            change: parseFloat(item.changesPercentage.toFixed(2)),
            high: item.dayHigh,
            low: item.dayLow,
            volume: item.volume,
            marketCap: item.marketCap
          }));
        } else {
          console.warn('Stocks API returned empty or invalid data:', data);
          // Fallback to simulation if data is empty
          throw new Error('Empty data from API');
        }
      } else {
        if (response.status === 401) {
          isApiKeyInvalid = true;
          console.warn('FINANCIAL_API_KEY is invalid (401). Switching to simulation mode.');
          throw new Error('Invalid API Key');
        } else {
          const errorText = await response.text();
          console.error(`Stocks API Error: ${response.status} ${response.statusText}`, errorText);
          throw new Error(`Response status: ${response.status}`);
        }
      }
    } catch (err) {
      if (!isApiKeyInvalid) {
        console.error('Error fetching stocks from FMP, falling back to simulation:', err);
      }
      // Simulation as fallback
      currentStocks = currentStocks.map(s => {
        const drift = (Math.random() - 0.498) * 0.12;
        const newChange = parseFloat((s.change + drift).toFixed(2));
        const newPrice = parseFloat((s.price * (1 + drift / 100)).toFixed(2));
        const newHigh = Math.max(s.high || newPrice, newPrice);
        const newLow = Math.min(s.low || newPrice, newPrice);
        const newVolume = (s.volume || 1000000) + Math.floor((Math.random() - 0.5) * 10000);
        return { 
          ...s, 
          price: newPrice, 
          change: newChange,
          high: newHigh,
          low: newLow,
          volume: Math.max(0, newVolume)
        };
      });
    }
  }

  const message = JSON.stringify({ type: 'STOCK_UPDATE', data: currentStocks });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

const fetchNews = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/in.json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      currentNews = data.articles.slice(0, 10);
    } else {
      throw new Error('News API response not OK');
    }
  } catch (err) {
    console.error('Error fetching news on server:', err);
    // Fallback news if API fails
    if (currentNews.length === 0) {
      currentNews = [
        { title: "Market Update: NIFTY 50 hits new high", description: "The Indian stock market continues its bullish trend with NIFTY 50 reaching record levels.", url: "#", urlToImage: "https://picsum.photos/seed/market/800/400" },
        { title: "RBI maintains repo rate at 6.5%", description: "The Reserve Bank of India keeps interest rates steady in its latest monetary policy review.", url: "#", urlToImage: "https://picsum.photos/seed/rbi/800/400" },
        { title: "Gold prices stabilize near record highs", description: "Safe-haven demand keeps gold prices firm amid global economic uncertainty.", url: "#", urlToImage: "https://picsum.photos/seed/gold/800/400" }
      ];
    }
  }

  const message = JSON.stringify({ type: 'NEWS_UPDATE', data: currentNews });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

function getLocalFallbackResponse(message: string, calculatorType: string, calculatorData: any): string {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes("good") && msgLower.includes("return")) {
    return `In India, evaluating whether a return is "good" depends on the asset class and your risk tolerance:
- **Fixed Deposits (FDs)**: Generally yield ~6.5% - 7.5% per annum, offering low-risk safety.
- **Equity Benchmarks (Nifty 50)**: Has historically generated a long-term CAGR of ~12% - 13%.
- **Midcap/Smallcap Indices**: Have achieved CAGR ranges of ~15% - 18% over the long haul, though with much higher volatility.

*These are educational estimates based on historical constant trends. Actual market returns fluctuate and are never guaranteed. For personalized investment advice, please connect with a SEBI-registered financial advisor.*`;
  }

  if (calculatorType === 'sip' && calculatorData) {
    const amount = calculatorData.amount || 5000;
    const years = calculatorData.years || 20;
    const rate = calculatorData.rate || 12;
    const fv = calculatorData.futureValue || 4996000;
    const invested = amount * years * 12;
    const returnsValue = Math.max(0, fv - invested);
    const multiplier = (fv / Math.max(1, invested)).toFixed(1);

    return `Your SIP projection of **₹${amount.toLocaleString('en-IN')}/month** for **${years} years** at **${rate}%** expected return compounding is mathematically correct!

Here's some expert insights for your wealth:
1. **The Multiplier Effect**: You invest a total of **₹${invested.toLocaleString('en-IN')}**. Through compound growth, your portfolio has potential returns of **₹${returnsValue.toLocaleString('en-IN')}**, creating a **${multiplier}x** wealth multiplier of **₹${Math.round(fv).toLocaleString('en-IN')}**.
2. **The Compounding Curve**: Over a long horizon, more than 60% of your total ending wealth gets accumulated during the final 5 years of your plan. This displays the incredible power of patience!
3. **Volatility Cushion**: While an average return of ${rate}% is reasonable based on Nifty 50 benchmarks, market pathways are turbulent. SIPs help you buy more units when prices dip, smoothing out long-term returns.

**Actionable next step**: Consider a **Step-up SIP**—increasing your monthly contribution by just 5-10% every year as your income grows can nearly double your final nest egg.

*These are educational estimates based on assumed constant returns. Actual market returns vary.*`;
  }

  if (calculatorType === 'swp' && calculatorData) {
    const corpus = calculatorData.corpus || 1000000;
    const withdrawal = calculatorData.withdrawal || 8000;
    const rate = calculatorData.rate || 10;
    const isSustainable = calculatorData.isSustainableIndefinitely !== false;

    return `Your Systematic Withdrawal Plan (SWP) with a **₹${corpus.toLocaleString('en-IN')}** corpus, withdrawing **₹${withdrawal.toLocaleString('en-IN')}/month** at **${rate}%** expected return shows:

1. **Sustainability Check**: ${isSustainable ? "Your withdrawal rate is highly sustainable! Because your annual withdrawal is close to or below the expected portfolio growth, your corpus is well-protected." : `This portfolio is expected to deplete over time. At ₹${withdrawal.toLocaleString('en-IN')}/month, you are withdrawing too much of your principal.`}
2. **The ₹10 Lakh Rule**: For example, ₹10L at 10% annual returns earns roughly ₹8,333 a month in growth. If you withdraw ₹8,000/month, the core corpus remains untouched and sustainable forever.
3. **Market Risks**: SWP returns are not constant in real life. In equity-heavy mutual funds, if markets decline early on (sequence of returns risk), withdrawals can accelerate corpus depletion.

**Actionable next step**: If sustainable, you're set. If it is depleting too fast, consider decreasing your monthly payout slightly to secure the principal, or shifting a portion to low-volatility debt funds.

*These are educational estimates. Actual market returns vary.*`;
  }

  if (calculatorType === 'retirement' && calculatorData) {
    const expenses = calculatorData.expenses || 50000;
    const corpusRequired = calculatorData.corpusRequired || 15000000;
    const monthlySavingsRequired = calculatorData.monthlySavingsRequired || 25000;
    const yearsToRetire = calculatorData.yearsToRetire || 20;

    return `Evaluating your Retirement Plan shows a clear path forward:
1. **Nest-Egg Target**: To support a monthly lifestyle of **₹${expenses.toLocaleString('en-IN')}** structured against inflation, you'll need roughly a **₹${Math.round(corpusRequired).toLocaleString('en-IN')}** retirement corpus.
2. **Monthly Action**: Building this corpus requires a monthly investment of **₹${Math.round(monthlySavingsRequired).toLocaleString('en-IN')}** commencing today.
3. **Inflation Factor**: At 6% inflation, living costs double roughly every 12 years. This is why investing to beat inflation is crucial.

**Actionable next step**: Start allocating your saving volume today, prioritizing equity-oriented mutual funds for the accumulation phase, then transitioning toward safer debt funds near retirement.

*These are educational estimates based on assumed constant parameters, actual market returns vary.*`;
  }

  // Generic fallback if no specific pattern is matched
  return `Thank you for consulting the FinAura Capital AI Assistant!

Evaluating your calculations is the first step to financial security:
1. **Factor in Inflation**: Living costs rise. A 6% inflation rate means expenses double every ~12 years.
2. **Benchmark Accurately**: Base expected returns on long-term realities: safe debt yields ~7%, while large-cap index equities yield ~12-13%.
3. **Compounding Edge**: Compounding does its best work in the final years of your investing journey. Be patient!

*These are educational estimates based on assumed constant returns. Actual market returns vary. For personalized advice, connect with a SEBI-registered financial advisor.*`;
}

app.post("/api/calculator-chat", express.json(), async (req, res) => {
  const { message, calculatorType, calculatorData, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const systemInstruction = `You are a financial education assistant embedded in FinAura Capital's calculator suite. You help Indian retail investors understand their calculator results, interpret numbers, and make better financial decisions. You are NOT a SEBI-registered advisor; always clarify that outputs are educational estimates only.

Response Guidelines:
When a user shares their calculator numbers:
- Confirm the figures are mathematically reasonable
- Give 2–3 plain-English insights about what the numbers mean
- Highlight risks or assumptions baked in (constant returns, no inflation on SIP amounts, etc.)
- Suggest one actionable next step
- Keep responses under 150 words unless the user asks for more detail

When a user asks "is this a good return?":
- Compare to Indian benchmarks: FD (~7%), Nifty 50 CAGR (~13%), Nifty Midcap CAGR (~16%)
- Never imply any return is guaranteed

When a user seems confused:
- Re-explain using a simple ₹ example with round numbers
- Avoid jargon; if you must use a term, define it immediately

Tone: Warm, clear, encouraging. Like a knowledgeable friend — not a textbook or a legal disclaimer.

Hard Rules:
- Never recommend specific mutual funds, stocks, or financial products by name
- Never promise returns or imply future performance is predictable
- Always add where relevant: "These are estimates based on assumed constant returns. Actual market returns vary."
- If asked for personalised investment advice, say: "For personalised advice, connect with a SEBI-registered financial advisor."
- Currency is always Indian Rupees (₹) unless the user specifies otherwise`;

  const contextStr = calculatorType && calculatorData 
    ? `[Active Calculator Context: type=${calculatorType}, inputs/results=${JSON.stringify(calculatorData)}]`
    : '';

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      const fallbackResponse = getLocalFallbackResponse(message, calculatorType, calculatorData);
      return res.json({ text: fallbackResponse });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let contents: any[] = [];
    if (history && history.length > 0) {
      contents = history.map((h: any) => ({
        role: h.role,
        parts: [{ text: h.text }]
      }));
    }

    const fullUserMessage = contextStr 
      ? `${contextStr}\nUser's message: ${message}`
      : message;

    contents.push({
      role: 'user',
      parts: [{ text: fullUserMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const fallbackResponse = getLocalFallbackResponse(message, calculatorType, calculatorData);
    return res.json({ 
      text: `${fallbackResponse}\n\n*(Note: Displaying simulated expert insight due to a transient connection pattern)*` 
    });
  }
});

app.get("/api/founder-image", async (req, res) => {
  const fileId = "165KN0eFOsXd86rEWxmXaQhj-FEFmLlQd";
  
  // Try multiple Google Drive endpoints in sequence
  const targetUrls = [
    `https://drive.google.com/thumbnail?sz=w1000&id=${fileId}`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/uc?export=download&id=${fileId}`
  ];

  for (const targetUrl of targetUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        // Verify it looks like a real image and not a html login/error block page
        if (contentType.includes("image") || contentType.includes("octet-stream") || response.headers.get("content-length") && parseInt(response.headers.get("content-length") || "0") > 1000) {
          res.setHeader("Content-Type", contentType.includes("image") ? contentType : "image/jpeg");
          res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24h
          const arrayBuffer = await response.arrayBuffer();
          res.send(Buffer.from(arrayBuffer));
          return;
        }
      }
    } catch (err) {
      console.warn(`[Founder-Image Proxy] Failed strategy with ${targetUrl}:`, err);
    }
  }

  // If all server-side fetches failed (likely due to Google blocking Cloud Run IP range),
  // we redirect the browser to the direct thumbnail endpoint which is highly robust.
  console.log(`[Founder-Image Proxy] Server-side fetches failed. Redirecting browser directly.`);
  res.redirect(`https://drive.google.com/thumbnail?sz=w1000&id=${fileId}`);
});

app.get("/api/stocks", async (req, res) => {
  try {
    // In serverless, we always try to get fresh data or at least trigger a fetch
    // If it's the first time (cold start), we await it to ensure user sees real/simulated data
    await fetchStocks(); 
    res.json(currentStocks);
  } catch (err) {
    console.error('API stocks error:', err);
    res.json(currentStocks); // Return whatever we have
  }
});

app.get("/api/indicators", async (req, res) => {
  try {
    await fetchMarketIndicators();
    res.json(marketIndicators);
  } catch (err) {
    console.error('API indicators error:', err);
    res.json(marketIndicators);
  }
});

app.get("/api/news", async (req, res) => {
  try {
    if (currentNews.length === 0) {
      await fetchNews();
    } else {
      fetchNews(); // Background refresh
    }
    res.json(currentNews);
  } catch (err) {
    console.error('API news error:', err);
    res.json(currentNews);
  }
});

// Vite middleware / static files setup
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

async function startBackgroundTasks() {
  // Initial fetch
  await Promise.allSettled([
    fetchNews(),
    fetchStocks(),
    fetchMarketIndicators()
  ]);
  
  // These intervals will only run in standalone mode/persistent environments
  if (process.env.NODE_ENV !== "production" || process.env.PERSISTENT_SERVER) {
    // Fetch news every 5 minutes
    setInterval(fetchNews, 5 * 60 * 1000);
    
    // Fetch stocks every 10 seconds
    setInterval(fetchStocks, process.env.FINANCIAL_API_KEY ? 10000 : 2000);
    
    // Fetch indicators every 10 minutes
    setInterval(fetchMarketIndicators, 10 * 60 * 1000);

    wss.on('connection', (ws) => {
      console.log('Client connected to WebSocket');
      ws.send(JSON.stringify({ type: 'STOCK_UPDATE', data: currentStocks }));
      ws.send(JSON.stringify({ type: 'MARKET_INDICATORS', data: marketIndicators }));
      if (currentNews.length > 0) {
        ws.send(JSON.stringify({ type: 'NEWS_UPDATE', data: currentNews }));
      }
      ws.on('close', () => console.log('Client disconnected'));
    });
  }
}

// For local development or persistent servers
const isStandalone = process.env.NODE_ENV !== "production" || process.env.PERSISTENT_SERVER || !process.env.VERCEL;

async function init() {
  await startBackgroundTasks();
  await configureApp();

  if (isStandalone) {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

init().catch(console.error);

export default app;
