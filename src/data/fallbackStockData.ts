export interface StockPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockProfile {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketVolume: number;
  marketCap: number;
  peRatio?: number;
}

// Generate realistic historical daily walk if fallback is needed
export function generateSyntheticHistory(
  basePrice: number,
  days: number = 180,
  volatility: number = 0.018,
  drift: number = 0.0004
): StockPoint[] {
  const points: StockPoint[] = [];
  const now = new Date();
  let currentPrice = basePrice * 0.85; // start lower so trend is realistic

  // Find business days backwards
  const businessDates: string[] = [];
  let d = new Date(now);
  while (businessDates.length < days) {
    d.setDate(d.getDate() - 1);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDates.unshift(d.toISOString().split('T')[0]);
    }
  }

  for (let i = 0; i < businessDates.length; i++) {
    // Random walk with drift
    const rand = (Math.random() - 0.49) * 2;
    const dailyReturn = drift + rand * volatility;
    const open = currentPrice;
    const close = Math.max(10, +(open * (1 + dailyReturn)).toFixed(2));
    const high = +(Math.max(open, close) * (1 + Math.random() * 0.012)).toFixed(2);
    const low = +(Math.min(open, close) * (1 - Math.random() * 0.012)).toFixed(2);
    const volume = Math.floor(25000000 + Math.random() * 40000000);

    points.push({
      date: businessDates[i],
      open: +open.toFixed(2),
      high,
      low,
      close,
      volume
    });

    currentPrice = close;
  }

  return points;
}

export const POPULAR_STOCKS: Record<string, { profile: StockProfile; history: StockPoint[] }> = {
  AAPL: {
    profile: {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      currency: 'USD',
      regularMarketPrice: 228.45,
      regularMarketChange: 2.15,
      regularMarketChangePercent: 0.95,
      regularMarketDayHigh: 230.12,
      regularMarketDayLow: 226.80,
      fiftyTwoWeekHigh: 237.23,
      fiftyTwoWeekLow: 164.08,
      regularMarketVolume: 48920100,
      marketCap: 3480000000000,
      peRatio: 34.2
    },
    history: generateSyntheticHistory(228.45, 180, 0.014, 0.0006)
  },
  GOOGL: {
    profile: {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      currency: 'USD',
      regularMarketPrice: 178.60,
      regularMarketChange: -1.20,
      regularMarketChangePercent: -0.67,
      regularMarketDayHigh: 180.45,
      regularMarketDayLow: 177.30,
      fiftyTwoWeekHigh: 191.75,
      fiftyTwoWeekLow: 129.40,
      regularMarketVolume: 24150000,
      marketCap: 2210000000000,
      peRatio: 25.1
    },
    history: generateSyntheticHistory(178.60, 180, 0.016, 0.0005)
  },
  AMZN: {
    profile: {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail',
      currency: 'USD',
      regularMarketPrice: 198.80,
      regularMarketChange: 3.40,
      regularMarketChangePercent: 1.74,
      regularMarketDayHigh: 200.15,
      regularMarketDayLow: 195.40,
      fiftyTwoWeekHigh: 201.20,
      fiftyTwoWeekLow: 139.46,
      regularMarketVolume: 35890000,
      marketCap: 2080000000000,
      peRatio: 43.8
    },
    history: generateSyntheticHistory(198.80, 180, 0.018, 0.0007)
  },
  TSLA: {
    profile: {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers',
      currency: 'USD',
      regularMarketPrice: 248.90,
      regularMarketChange: -4.85,
      regularMarketChangePercent: -1.91,
      regularMarketDayHigh: 256.40,
      regularMarketDayLow: 245.20,
      fiftyTwoWeekHigh: 271.00,
      fiftyTwoWeekLow: 138.80,
      regularMarketVolume: 64200000,
      marketCap: 792000000000,
      peRatio: 68.4
    },
    history: generateSyntheticHistory(248.90, 180, 0.026, 0.0008)
  },
  MSFT: {
    profile: {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      industry: 'Software - Infrastructure',
      currency: 'USD',
      regularMarketPrice: 428.15,
      regularMarketChange: 1.85,
      regularMarketChangePercent: 0.43,
      regularMarketDayHigh: 430.50,
      regularMarketDayLow: 425.80,
      fiftyTwoWeekHigh: 468.35,
      fiftyTwoWeekLow: 366.50,
      regularMarketVolume: 19840000,
      marketCap: 3180000000000,
      peRatio: 36.5
    },
    history: generateSyntheticHistory(428.15, 180, 0.013, 0.0005)
  },
  NVDA: {
    profile: {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      sector: 'Technology',
      industry: 'Semiconductors',
      currency: 'USD',
      regularMarketPrice: 138.25,
      regularMarketChange: 4.10,
      regularMarketChangePercent: 3.06,
      regularMarketDayHigh: 139.90,
      regularMarketDayLow: 134.50,
      fiftyTwoWeekHigh: 140.76,
      fiftyTwoWeekLow: 45.11,
      regularMarketVolume: 92450000,
      marketCap: 3390000000000,
      peRatio: 52.3
    },
    history: generateSyntheticHistory(138.25, 180, 0.028, 0.0012)
  }
};
