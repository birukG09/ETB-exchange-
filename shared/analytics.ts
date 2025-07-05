export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  source: string;
}

export interface CryptoAnalytics {
  symbol: string;
  name: string;
  price: number;
  priceETB: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  source: string;
}

export interface ForexData {
  pair: string;
  rate: number;
  change: number;
  timestamp: string;
  source: string;
}

export interface MarketAnalytics {
  stocks: StockData[];
  crypto: CryptoAnalytics[];
  forex: ForexData[];
  etbAnalytics: {
    avgRate: number;
    volatility: number;
    trend: string;
    volume: number;
  };
  marketSentiment: {
    score: number;
    label: string;
    factors: string[];
  };
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
  volume: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: MarketAnalytics;
  timestamp: string;
  sources: string[];
}

export interface HistoricalResponse {
  success: boolean;
  data: HistoricalDataPoint[];
  symbol: string;
  period: string;
}
