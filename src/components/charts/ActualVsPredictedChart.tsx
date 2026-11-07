import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TestComparisonPoint } from '../../types.ts';
import { CheckCircle2, SplitSquareVertical } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ActualVsPredictedChartProps {
  comparisonData: TestComparisonPoint[];
  symbol: string;
}

export function ActualVsPredictedChart({ comparisonData, symbol }: ActualVsPredictedChartProps) {
  const [showLR, setShowLR] = useState(true);
  const [showRF, setShowRF] = useState(true);
  const [viewResiduals, setViewResiduals] = useState(false);

  const labels = comparisonData.map((d) => d.date);
  const actuals = comparisonData.map((d) => d.actual);
  const lrPreds = comparisonData.map((d) => d.predicted_lr);
  const rfPreds = comparisonData.map((d) => d.predicted_rf);
  const lrResiduals = comparisonData.map((d) => d.residual_lr);
  const rfResiduals = comparisonData.map((d) => d.residual_rf);

  const standardData = {
    labels,
    datasets: [
      {
        label: 'Actual Market Price ($)',
        data: actuals,
        borderColor: '#10B981', // emerald-500
        backgroundColor: '#10B981',
        borderWidth: 2.5,
        pointRadius: 2,
        tension: 0.1
      },
      ...(showLR
        ? [
            {
              label: 'Linear Regression Pred ($)',
              data: lrPreds,
              borderColor: '#06B6D4', // cyan-500
              backgroundColor: '#06B6D4',
              borderWidth: 1.8,
              borderDash: [5, 4],
              pointRadius: 2,
              tension: 0.15
            }
          ]
        : []),
      ...(showRF
        ? [
            {
              label: 'Random Forest Pred ($)',
              data: rfPreds,
              borderColor: '#A855F7', // purple-500
              backgroundColor: '#A855F7',
              borderWidth: 2,
              borderDash: [3, 3],
              pointRadius: 2,
              tension: 0.15
            }
          ]
        : [])
    ]
  };

  const residualData = {
    labels,
    datasets: [
      {
        label: 'Linear Regression Residual (Actual - Pred)',
        data: lrResiduals,
        borderColor: '#06B6D4',
        borderWidth: 1.5,
        pointRadius: 2,
        tension: 0.1
      },
      {
        label: 'Random Forest Residual (Actual - Pred)',
        data: rfResiduals,
        borderColor: '#A855F7',
        borderWidth: 1.5,
        pointRadius: 2,
        tension: 0.1
      }
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
          maxTicksLimit: 8
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
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Model Evaluation: Actual vs. Predicted (Test Dataset)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Out-of-sample test split validation benchmarking predictions against true historical market prices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewResiduals(!viewResiduals)}
            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              viewResiduals
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            {viewResiduals ? 'Show Prices' : 'View Residual Error'}
          </button>

          {!viewResiduals && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLR(!showLR)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors whitespace-nowrap ${
                  showLR
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-400'
                }`}
              >
                Linear Reg
              </button>
              <button
                onClick={() => setShowRF(!showRF)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors whitespace-nowrap ${
                  showRF
                    ? 'border-purple-500/40 bg-purple-500/10 text-purple-400'
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-400'
                }`}
              >
                Random Forest
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-[320px] sm:h-[360px] w-full">
        <Line data={viewResiduals ? residualData : standardData} options={chartOptions} />
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Actual Market
          </span>
          {showLR && !viewResiduals && (
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400"></span>
              Linear Regression
            </span>
          )}
          {showRF && !viewResiduals && (
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-3 h-0.5 bg-purple-400"></span>
              Random Forest
            </span>
          )}
        </div>
        <div className="font-mono tabular-nums text-slate-500">
          Evaluated Points: {comparisonData.length} days
        </div>
      </div>
    </div>
  );
}
