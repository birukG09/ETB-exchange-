export interface ExchangeRate {
  currency: string;
  currencyName: string;
  flag: string;
  buyRate?: number;
  sellRate?: number;
  midRate: number;
  change24h: number;
  source: string;
  lastUpdated: string;
}

export interface RatesResponse {
  success: boolean;
  data: ExchangeRate[];
  lastUpdated: string;
  sources: string[];
  error?: string;
}
