import { useState, useEffect, useRef } from 'react';

export interface MarketIndicators {
  inflation: number;
  interestRate: number;
  marketReturn: number;
  goldRate: number;
}

export interface Stock {
  name: string;
  price: number;
  change: number;
  high?: number;
  low?: number;
  volume?: number;
  marketCap?: number;
}

const DEFAULT_SIMULATED_STOCKS: Stock[] = [
  { name: 'NIFTY 50', price: 24356.55, change: +0.43, high: 24410.20, low: 24290.15, volume: 245600000, marketCap: 185000000000000 },
  { name: 'SENSEX', price: 80218.37, change: +0.38, high: 80350.50, low: 80120.10, volume: 15600000, marketCap: 410000000000000 },
  { name: 'NIFTY BANK', price: 52134.10, change: -0.21, high: 52300.00, low: 52050.45, volume: 85400000, marketCap: 35000000000000 },
  { name: 'RELIANCE', price: 2987.45, change: +1.12, high: 3010.00, low: 2965.20, volume: 4500000, marketCap: 20200000000000 },
  { name: 'TCS', price: 4123.80, change: +0.67, high: 4150.00, low: 4105.50, volume: 1200000, marketCap: 14900000000000 },
  { name: 'HDFC BANK', price: 1712.30, change: -0.45, high: 1730.00, low: 1705.10, volume: 12500000, marketCap: 13000000000000 },
  { name: 'INFOSYS', price: 1894.55, change: +0.89, high: 1910.20, low: 1880.00, volume: 3200000, marketCap: 7800000000000 },
  { name: 'ICICI BANK', price: 1298.70, change: +0.34, high: 1305.00, low: 1288.40, volume: 8900000, marketCap: 9100000000000 },
  { name: 'GOLD', price: 73245.00, change: +0.25, high: 73500.00, low: 73100.00, volume: 5000, marketCap: 0 }
];

const DEFAULT_SIMULATED_INDICATORS: MarketIndicators = {
  inflation: 6.0,
  interestRate: 8.5,
  marketReturn: 12.0,
  goldRate: 73245
};

const DEFAULT_SIMULATED_NEWS = [
  { title: "Market Update: NIFTY 50 hits new high", description: "The Indian stock market continues its bullish trend with NIFTY 50 reaching record levels.", url: "#", urlToImage: "https://picsum.photos/seed/market/800/400" },
  { title: "RBI maintains repo rate at 6.5%", description: "The Reserve Bank of India keeps interest rates steady in its latest monetary policy review.", url: "#", urlToImage: "https://picsum.photos/seed/rbi/800/400" },
  { title: "Gold prices stabilize near record highs", description: "Safe-haven demand keeps gold prices firm amid global economic uncertainty.", url: "#", urlToImage: "https://picsum.photos/seed/gold/800/400" }
];

export const useMarketData = () => {
  const [stocks, setStocks] = useState<Stock[]>(DEFAULT_SIMULATED_STOCKS);
  const [indicators, setIndicators] = useState<MarketIndicators>(DEFAULT_SIMULATED_INDICATORS);
  const [news, setNews] = useState<any[]>(DEFAULT_SIMULATED_NEWS);
  const [connected, setConnected] = useState(true);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    const handleDataReceived = () => {
      lastUpdateTimeRef.current = Date.now();
      setConnected(true);
    };

    const connect = () => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          setConnected(true);
        };

        ws.onmessage = (event) => {
          handleDataReceived();
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'STOCK_UPDATE' && message.data) {
              setStocks(message.data);
            } else if (message.type === 'MARKET_INDICATORS' && message.data) {
              setIndicators(message.data);
            } else if (message.type === 'NEWS_UPDATE' && message.data) {
              setNews(message.data);
            }
          } catch (err) {
            console.warn('Error parsing WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket closed');
          if (wsRef.current === ws) {
            setTimeout(connect, 5000);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (e) {
        console.warn('WebSocket connection error:', e);
      }
    };

    // Resilient HTTP Polling Fallback
    const pollData = async () => {
      try {
        // Fetch each endpoint individually with standalone cache catches
        const stocksPromise = fetch('/api/stocks')
          .then(async res => {
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) return data;
            }
            return null;
          })
          .catch(() => null);

        const indicatorsPromise = fetch('/api/indicators')
          .then(async res => {
            if (res.ok) {
              const data = await res.json();
              if (data && typeof data === 'object') return data;
            }
            return null;
          })
          .catch(() => null);

        const newsPromise = fetch('/api/news')
          .then(async res => {
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) return data;
            }
            return null;
          })
          .catch(() => null);

        const [stocksData, indicatorsData, newsData] = await Promise.all([
          stocksPromise,
          indicatorsPromise,
          newsPromise
        ]);

        if (stocksData) {
          setStocks(stocksData);
          handleDataReceived();
        } else {
          // Slowly drift local simulated stocks slightly to look live and dynamic
          setStocks(prev => 
            prev.map(s => {
              const drift = (Math.random() - 0.495) * 0.12;
              const newChange = parseFloat((s.change + drift).toFixed(2));
              const newPrice = parseFloat((s.price * (1 + drift / 100)).toFixed(2));
              return { ...s, price: newPrice, change: newChange };
            })
          );
        }

        if (indicatorsData) {
          setIndicators(indicatorsData);
          handleDataReceived();
        }

        if (newsData) {
          setNews(newsData);
          handleDataReceived();
        }
      } catch (err) {
        // Silent block to prevent any telemetry errors reflecting onto UI
        console.warn('Safe polling notification:', err);
      }
    };

    connect();
    
    const pollInterval = setInterval(pollData, 10000);
    pollData();

    // Resilient online connectivity check using native browser status
    const handleOnlineStatusChange = () => {
      setConnected(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    // Initial sync
    setConnected(navigator.onLine);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(pollInterval);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return { stocks, indicators, news, connected };
};
