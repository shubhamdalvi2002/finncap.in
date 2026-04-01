import { useState, useEffect, useRef } from 'react';

export interface MarketIndicators {
  inflation: number;
  interestRate: number;
  marketReturn: number;
  goldRate: number;
}

export const useMarketData = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<MarketIndicators>({
    inflation: 6.0,
    interestRate: 8.5,
    marketReturn: 12.0,
    goldRate: 73245
  });
  const [news, setNews] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    const connect = () => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
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
        setConnected(false);
        // Only reconnect if the component is still mounted and the current ws is the one that closed
        if (wsRef.current === ws) {
          setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { stocks, indicators, news, connected };
};
