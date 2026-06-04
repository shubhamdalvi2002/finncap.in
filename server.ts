import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

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

app.get("/api/founder-image", async (req, res) => {
  const fileId = "165KN0eFOsXd86rEWxmXaQhj-FEFmLlQd";
  const url = `https://lh3.googleusercontent.com/d/${fileId}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24h
      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } else {
      res.status(response.status).send("Failed to fetch image");
    }
  } catch (err) {
    console.warn("Error fetching founder image:", err);
    // Redirect as browser fallback
    res.redirect(url);
  }
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
