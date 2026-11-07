import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

interface TickerBarProps {
  currentSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  currentRange: string;
  onSelectRange: (range: string) => void;
  dataSource: string;
}

const POPULAR = [
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'GOOGL', name: 'Google' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'NVDA', name: 'NVIDIA' }
];

const RANGES = [
  { label: '1M', value: '1mo' },
  { label: '3M', value: '3mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
  { label: '2Y', value: '2y' }
];

export function TickerBar({
  currentSymbol,
  onSelectSymbol,
  currentRange,
  onSelectRange,
  dataSource
}: TickerBarProps) {
  const [customInput, setCustomInput] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectSymbol(customInput.trim().toUpperCase());
      setCustomInput('');
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Popular Stocks Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium mr-1.5 whitespace-nowrap">
            Stocks:
          </span>
          {POPULAR.map((stock) => {
            const isActive = currentSymbol === stock.symbol;
            return (
              <button
                key={stock.symbol}
                onClick={() => onSelectSymbol(stock.symbol)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{stock.symbol}</span>
                <span className={`text-[10px] hidden sm:inline ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  · {stock.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Symbol Search & Timeframe Range */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Custom Search Form */}
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Custom Symbol..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
              className="w-28 sm:w-32 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Search symbol"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Timeframe Range */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {RANGES.map((rng) => (
              <button
                key={rng.value}
                onClick={() => onSelectRange(rng.value)}
                className={`px-2.5 py-0.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  currentRange === rng.value
                    ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rng.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
