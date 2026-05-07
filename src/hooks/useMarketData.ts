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

export const useMarketData = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [indicators, setIndicators] = useState<MarketIndicators>({
    inflation: 6.0,
    interestRate: 8.5,
    marketReturn: 12.0,
    goldRate: 73245
  });
  const [news, setNews] = useState<any[]>([]);
  const [connected, setConnected] = useState(true); // Start as true to avoid initial flicker
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

      // Skip WebSocket if we are in an environment known to be flaky with them (optional, but keep it for now)
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
            if (message.type === 'STOCK_UPDATE') {
              setStocks(message.data);
            } else if (message.type === 'MARKET_INDICATORS') {
              setIndicators(message.data);
            } else if (message.type === 'NEWS_UPDATE') {
              setNews(message.data);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          // Don't immediately set connected to false, polling might be working
          console.log('WebSocket closed');
          if (wsRef.current === ws) {
            setTimeout(connect, 5000);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (e) {
        console.error('WebSocket connection error:', e);
      }
    };

    // HTTP Polling Fallback for environments without WebSocket support
    const pollData = async () => {
      console.log('Polling market data...');
      try {
        const [stocksRes, indicatorsRes, newsRes] = await Promise.all([
          fetch('/api/stocks'),
          fetch('/api/indicators'),
          fetch('/api/news')
        ]);
        
        if (stocksRes.ok) {
          const stocksData = await stocksRes.json();
          if (stocksData.length > 0) {
            setStocks(stocksData);
            handleDataReceived();
          }
        }

        if (indicatorsRes.ok) {
          const indicatorsData = await indicatorsRes.json();
          setIndicators(indicatorsData);
          handleDataReceived();
        }

        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(newsData);
          handleDataReceived();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    connect();
    
    const pollInterval = setInterval(pollData, 10000);
    pollData();

    // Secondary check for "Offline" status - if no data received for 30 seconds
    const statusCheckInterval = setInterval(() => {
      const timeSinceLastUpdate = Date.now() - lastUpdateTimeRef.current;
      if (timeSinceLastUpdate > 30000) {
        setConnected(false);
      }
    }, 5000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      clearInterval(pollInterval);
      clearInterval(statusCheckInterval);
    };
  }, []); // Empty deps - run once on mount

  return { stocks, indicators, news, connected };
};
