import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FuturePredictionPoint, StockPoint } from '../../types.ts';
import { Compass, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FutureForecastChartProps {
  recentHistory: StockPoint[];
  predictions: FuturePredictionPoint[];
  symbol: string;
}

export function FutureForecastChart({
  recentHistory,
  predictions,
  symbol
}: FutureForecastChartProps) {
  const [modelMode, setModelMode] = useState<'ensemble' | 'both' | 'rf' | 'lr'>('ensemble');

  const { labels, historyDataset, ensembleDataset, lrDataset, rfDataset, upperDataset, lowerDataset } =
    useMemo(() => {
      // Take last 15 historical points for context
      const historySlice = recentHistory.slice(-15);
      const allLabels = [
        ...historySlice.map((h) => h.date),
        ...predictions.map((p) => p.date)
      ];

      const histCount = historySlice.length;

      // History curve
      const histData: (number | null)[] = historySlice.map((h) => h.close);
      // Pad future with nulls
      for (let i = 0; i < predictions.length; i++) {
        histData.push(null);
      }

      // Future curves: starting from the last historical point for visual continuity
      const lastClose = historySlice[historySlice.length - 1]?.close || 0;

      const ensData: (number | null)[] = new Array(histCount - 1).fill(null);
      ensData.push(lastClose); // anchor at transition point
      predictions.forEach((p) => ensData.push(p.predicted_close_ensemble));

      const lrData: (number | null)[] = new Array(histCount - 1).fill(null);
      lrData.push(lastClose);
      predictions.forEach((p) => lrData.push(p.predicted_close_lr));

      const rfData: (number | null)[] = new Array(histCount - 1).fill(null);
      rfData.push(lastClose);
      predictions.forEach((p) => rfData.push(p.predicted_close_rf));

      const upData: (number | null)[] = new Array(histCount - 1).fill(null);
      upData.push(lastClose);
      predictions.forEach((p) => upData.push(p.confidence_upper));

      const lowData: (number | null)[] = new Array(histCount - 1).fill(null);
      lowData.push(lastClose);
      predictions.forEach((p) => lowData.push(p.confidence_lower));

      return {
        labels: allLabels,
        historyDataset: histData,
        ensembleDataset: ensData,
        lrDataset: lrData,
        rfDataset: rfData,
        upperDataset: upData,
        lowerDataset: lowData
      };
    }, [recentHistory, predictions]);

  const lastHistClose = recentHistory[recentHistory.length - 1]?.close || 1;
  const finalPrediction = predictions[predictions.length - 1]?.predicted_close_ensemble || lastHistClose;
  const overallReturn = +(((finalPrediction - lastHistClose) / lastHistClose) * 100).toFixed(2);
  const isBullish = overallReturn >= 0;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Historical Close ($)',
        data: historyDataset,
        borderColor: '#94A3B8', // slate-400
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.1
      },
      // Shaded Confidence Interval Bounds
      {
        label: 'Upper Confidence (95%)',
        data: upperDataset,
        borderColor: 'transparent',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: '+1', // fill down to lowerDataset
        pointRadius: 0
      },
      {
        label: 'Lower Confidence (95%)',
        data: lowerDataset,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        pointRadius: 0
      },
      // Active models
      ...(modelMode === 'ensemble' || modelMode === 'both'
        ? [
            {
              label: 'Ensemble ML Forecast ($)',
              data: ensembleDataset,
              borderColor: '#10B981', // emerald-500
              backgroundColor: '#10B981',
              borderWidth: 2.5,
              pointRadius: 3,
              tension: 0.2
            }
          ]
        : []),
      ...(modelMode === 'lr' || modelMode === 'both'
        ? [
            {
              label: 'Linear Regression Forecast ($)',
              data: lrDataset,
              borderColor: '#06B6D4', // cyan-500
              borderWidth: 1.8,
              borderDash: [5, 4],
              pointRadius: 2,
              tension: 0.2
            }
          ]
        : []),
      ...(modelMode === 'rf' || modelMode === 'both'
        ? [
            {
              label: 'Random Forest Forecast ($)',
              data: rfDataset,
              borderColor: '#A855F7', // purple-500
              borderWidth: 2,
              borderDash: [4, 4],
              pointRadius: 2,
              tension: 0.2
            }
          ]
        : [])
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
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
          maxTicksLimit: 9
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Future Price Projection ({predictions.length} Trading Days)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Recursive multi-step forecast extending historical quotes with 95% statistical confidence interval
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Trend Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-medium ${
              isBullish
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {isBullish ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>
              {isBullish ? 'Bullish Outlook' : 'Bearish Outlook'}: {overallReturn > 0 ? `+${overallReturn}%` : `${overallReturn}%`}
            </span>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setModelMode('ensemble')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                modelMode === 'ensemble'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ensemble
            </button>
            <button
              onClick={() => setModelMode('both')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                modelMode === 'both'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compare Both
            </button>
            <button
              onClick={() => setModelMode('rf')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                modelMode === 'rf'
                  ? 'bg-slate-800 text-purple-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RF Only
            </button>
            <button
              onClick={() => setModelMode('lr')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                modelMode === 'lr'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LR Only
            </button>
          </div>
        </div>
      </div>

      <div className="h-[320px] sm:h-[380px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80">
        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Last Historical Close</span>
          <span className="text-sm font-bold font-mono tabular-nums text-slate-100">
            ${lastHistClose.toFixed(2)}
          </span>
        </div>
        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Day +1 Forecast</span>
          <span className="text-sm font-bold font-mono tabular-nums text-emerald-400">
            ${predictions[0]?.predicted_close_ensemble.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Day +{predictions.length} Horizon End</span>
          <span
            className={`text-sm font-bold font-mono tabular-nums ${
              isBullish ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            ${finalPrediction.toFixed(2)}
          </span>
        </div>
        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 block">95% Range at Horizon</span>
          <span className="text-xs font-mono tabular-nums text-slate-300">
            ${predictions[predictions.length - 1]?.confidence_lower.toFixed(1)} - $
            {predictions[predictions.length - 1]?.confidence_upper.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
