import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const INITIAL_STOCKS = [
  { name: 'NIFTY 50', price: 24356.55, change: +0.43 },
  { name: 'SENSEX', price: 80218.37, change: +0.38 },
  { name: 'NIFTY BANK', price: 52134.10, change: -0.21 },
  { name: 'RELIANCE', price: 2987.45, change: +1.12 },
  { name: 'TCS', price: 4123.80, change: +0.67 },
  { name: 'HDFC BANK', price: 1712.30, change: -0.45 },
  { name: 'INFOSYS', price: 1894.55, change: +0.89 },
  { name: 'ICICI BANK', price: 1298.70, change: +0.34 },
  { name: 'WIPRO', price: 567.25, change: -0.18 },
  { name: 'BAJAJ FIN', price: 7234.90, change: +1.45 },
  { name: 'LT', price: 3654.20, change: +0.72 },
  { name: 'MARUTI', price: 12450.60, change: -0.30 },
  { name: 'NIFTY MID', price: 58934.20, change: +0.61 },
  { name: 'GOLD', price: 73245.00, change: +0.25 },
  { name: 'NIFTY IT', price: 39812.45, change: +1.02 },
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
      return { ...s, price: newPrice, change: newChange };
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
            change: parseFloat(item.changesPercentage.toFixed(2))
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
        return { ...s, price: newPrice, change: newChange };
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

async function setupServer() {
  // Initial fetch
  fetchNews();
  fetchStocks();
  fetchMarketIndicators();
  
  // Fetch news every 5 minutes
  setInterval(fetchNews, 5 * 60 * 1000);
  
  // Fetch stocks every 10 seconds (or 2 seconds if simulating)
  setInterval(fetchStocks, process.env.FINANCIAL_API_KEY ? 10000 : 2000);
  
  // Fetch indicators every 10 minutes
  setInterval(fetchMarketIndicators, 10 * 60 * 1000);

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    // Send initial data
    ws.send(JSON.stringify({ type: 'STOCK_UPDATE', data: currentStocks }));
    ws.send(JSON.stringify({ type: 'MARKET_INDICATORS', data: marketIndicators }));
    if (currentNews.length > 0) {
      ws.send(JSON.stringify({ type: 'NEWS_UPDATE', data: currentNews }));
    }
    
    ws.on('close', () => console.log('Client disconnected'));
  });

  // Vite middleware for development
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

  return app;
}

// For local development or persistent servers
if (process.env.NODE_ENV !== "production" || process.env.PERSISTENT_SERVER) {
  setupServer().then(() => {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // In Vercel production, we still need to serve static files
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  // Trigger initial fetches for the warm instance
  fetchNews();
  fetchStocks();
  fetchMarketIndicators();
}

export default app;
