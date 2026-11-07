import { StockProfile, StockPoint } from '../types.ts';
import { ArrowUpRight, ArrowDownRight, Database, Gauge, BarChart } from 'lucide-react';

interface StockOverviewProps {
  profile: StockProfile;
  recentData: StockPoint[];
  dataSource: string;
}

export function StockOverview({ profile, recentData, dataSource }: StockOverviewProps) {
  const isPositive = profile.regularMarketChange >= 0;

  // Compute 14-day RSI and 10-day Volatility if data available
  const { rsi, volatility } = (() => {
    if (recentData.length < 15) return { rsi: 50.0, volatility: 0.015 };
    const closes = recentData.map((d) => d.close);
    
    // RSI
    let gains = 0;
    let losses = 0;
    for (let i = recentData.length - 14; i < recentData.length; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += -diff;
    }
    const avgGain = gains / 14;
    const avgLoss = losses / 14;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const calculatedRsi = +(100 - 100 / (1 + rs)).toFixed(1);

    // 10D Volatility
    const rets = [];
    for (let i = recentData.length - 10; i < recentData.length; i++) {
      rets.push((closes[i] - closes[i - 1]) / closes[i - 1]);
    }
    const meanRet = rets.reduce((a, b) => a + b, 0) / rets.length;
    const varRet = rets.reduce((a, b) => a + Math.pow(b - meanRet, 2), 0) / rets.length;
    const calculatedVol = +(Math.sqrt(varRet) * 100).toFixed(2);

    return { rsi: calculatedRsi, volatility: calculatedVol };
  })();

  const lastPoint = recentData[recentData.length - 1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      {/* Top Header of the Stock Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display tracking-tight">
              {profile.name}
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
              {profile.symbol}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              · {profile.sector}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Feed: {dataSource}</span>
            <span>·</span>
            <span>Currency: {profile.currency}</span>
          </div>
        </div>

        {/* Live / Last Quote */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-100">
            ${profile.regularMarketPrice.toFixed(2)}
          </span>
          <div
            className={`flex items-center text-sm font-semibold font-mono tabular-nums ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>
              {isPositive ? '+' : ''}
              {profile.regularMarketChange.toFixed(2)} ({isPositive ? '+' : ''}
              {profile.regularMarketChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Financial & Technical Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {/* Open Price */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Open Price</span>
          <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-slate-200">
            ${lastPoint ? lastPoint.open.toFixed(2) : profile.regularMarketDayLow.toFixed(2)}
          </span>
        </div>

        {/* Day High */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Day High</span>
          <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-emerald-400">
            ${profile.regularMarketDayHigh.toFixed(2)}
          </span>
        </div>

        {/* Day Low */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Day Low</span>
          <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-rose-400">
            ${profile.regularMarketDayLow.toFixed(2)}
          </span>
        </div>

        {/* 52-Week Range */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">52-Week Range</span>
          <span className="text-xs sm:text-sm font-semibold font-mono tabular-nums text-slate-300">
            ${profile.fiftyTwoWeekLow.toFixed(1)} - ${profile.fiftyTwoWeekHigh.toFixed(1)}
          </span>
        </div>

        {/* 14D RSI */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block flex items-center justify-between">
            <span>14D RSI</span>
            <Gauge className="w-3 h-3 text-cyan-400" />
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-sm sm:text-base font-semibold font-mono tabular-nums ${
                rsi > 70 ? 'text-amber-400' : rsi < 30 ? 'text-emerald-400' : 'text-slate-200'
              }`}
            >
              {rsi}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block flex items-center justify-between">
            <span>Daily Volume</span>
            <BarChart className="w-3 h-3 text-emerald-400" />
          </span>
          <span className="text-sm sm:text-base font-semibold font-mono tabular-nums text-slate-200">
            {(profile.regularMarketVolume / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>
    </div>
  );
}
