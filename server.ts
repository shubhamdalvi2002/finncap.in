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

const fetchMarketIndicators = async () => {
  const apiKey = process.env.FINANCIAL_API_KEY;
  if (!apiKey) {
    // Simulation for indicators
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
      }
      if (interestRes.ok) {
        const data = await interestRes.json();
        if (data && data.length > 0) marketIndicators.interestRate = parseFloat(data[0].value);
      }
      
      marketIndicators.marketReturn = parseFloat((12.5 + (Math.random() - 0.5)).toFixed(2));
    } catch (err) {
      console.error('Error fetching market indicators:', err);
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
  if (!apiKey) {
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
        if (Array.isArray(data)) {
          currentStocks = data.map((item: any) => ({
            name: item.name || item.symbol.replace('.NS', ''),
            price: item.price,
            change: parseFloat(item.changesPercentage.toFixed(2))
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching stocks from FMP:', err);
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
      const message = JSON.stringify({ type: 'NEWS_UPDATE', data: currentNews });
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  } catch (err) {
    console.error('Error fetching news on server:', err);
  }
};

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/stocks", async (req, res) => {
  // In serverless, we might want to refresh data if it's stale
  // For now, just return current and trigger a background fetch
  fetchStocks(); 
  res.json(currentStocks);
});

app.get("/api/indicators", async (req, res) => {
  fetchMarketIndicators();
  res.json(marketIndicators);
});

app.get("/api/news", async (req, res) => {
  if (currentNews.length === 0) await fetchNews();
  res.json(currentNews);
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
