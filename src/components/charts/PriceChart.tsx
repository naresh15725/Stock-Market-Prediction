import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { StockPoint } from '../../types.ts';
import { Eye, TrendingUp, BarChart2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  data: StockPoint[];
  symbol: string;
}

export function PriceChart({ data, symbol }: PriceChartProps) {
  const [showSMA7, setShowSMA7] = useState(true);
  const [showSMA21, setShowSMA21] = useState(true);
  const [activeView, setActiveView] = useState<'price' | 'volume'>('price');

  // Compute Moving Averages
  const { labels, closes, volumes, sma7, sma21 } = useMemo(() => {
    const lbls = data.map((d) => d.date);
    const cls = data.map((d) => d.close);
    const vols = data.map((d) => d.volume);

    const s7: (number | null)[] = [];
    const s21: (number | null)[] = [];

    for (let i = 0; i < cls.length; i++) {
      if (i >= 6) {
        const sum7 = cls.slice(i - 6, i + 1).reduce((a, b) => a + b, 0);
        s7.push(+(sum7 / 7).toFixed(2));
      } else {
        s7.push(null);
      }

      if (i >= 20) {
        const sum21 = cls.slice(i - 20, i + 1).reduce((a, b) => a + b, 0);
        s21.push(+(sum21 / 21).toFixed(2));
      } else {
        s21.push(null);
      }
    }

    return { labels: lbls, closes: cls, volumes: vols, sma7: s7, sma21: s21 };
  }, [data]);

  const priceChartData = {
    labels,
    datasets: [
      {
        label: `${symbol} Closing Price ($)`,
        data: closes,
        borderColor: '#10B981', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#10B981',
        tension: 0.15
      },
      ...(showSMA7
        ? [
            {
              label: '7-Day SMA',
              data: sma7,
              borderColor: '#38BDF8', // sky-400
              borderWidth: 1.5,
              borderDash: [4, 4],
              pointRadius: 0,
              fill: false,
              tension: 0.2
            }
          ]
        : []),
      ...(showSMA21
        ? [
            {
              label: '21-Day SMA',
              data: sma21,
              borderColor: '#F59E0B', // amber-500
              borderWidth: 1.5,
              borderDash: [6, 4],
              pointRadius: 0,
              fill: false,
              tension: 0.2
            }
          ]
        : [])
    ]
  };

  const volumeChartData = {
    labels,
    datasets: [
      {
        label: 'Trading Volume',
        data: volumes,
        backgroundColor: data.map((d) => (d.close >= d.open ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)')),
        borderRadius: 2
      }
    ]
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        callbacks: {
          label: (context) => {
            const val = context.parsed.y;
            if (val === null || val === undefined) return '';
            return ` ${context.dataset.label}: $${val.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.2)'
        },
        ticks: {
          color: '#94A3B8',
          font: { family: 'JetBrains Mono', size: 11 },
          maxTicksLimit: 10
        }
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)'
        },
        ticks: {
          color: '#94A3B8',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (value) => `$${value}`
        }
      }
    }
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#E2E8F0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => ` Volume: ${Number(ctx.raw).toLocaleString()} shares`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'JetBrains Mono', size: 11 },
          maxTicksLimit: 10
        }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.25)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (val) => `${(Number(val) / 1000000).toFixed(1)}M`
        }
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Historical Price & Market Trend
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real historical quotes showing closing price dynamics and trend indicators
          </p>
        </div>

        {/* View toggle and indicator toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveView('price')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeView === 'price'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Price View
            </button>
            <button
              onClick={() => setActiveView('volume')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'volume'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Volume
            </button>
          </div>

          {activeView === 'price' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSMA7(!showSMA7)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors whitespace-nowrap ${
                  showSMA7
                    ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-400'
                }`}
              >
                SMA 7
              </button>
              <button
                onClick={() => setShowSMA21(!showSMA21)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors whitespace-nowrap ${
                  showSMA21
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-400'
                }`}
              >
                SMA 21
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-[320px] sm:h-[380px] w-full">
        {activeView === 'price' ? (
          <Line data={priceChartData} options={lineOptions} />
        ) : (
          <Bar data={volumeChartData} options={barOptions} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Close Price
          </span>
          {showSMA7 && activeView === 'price' && (
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-0.5 bg-sky-400"></span>
              7-Day SMA
            </span>
          )}
          {showSMA21 && activeView === 'price' && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-400"></span>
              21-Day SMA
            </span>
          )}
        </div>
        <div className="font-mono tabular-nums text-slate-500">
          Total Trading Days: {data.length}
        </div>
      </div>
    </div>
  );
}
