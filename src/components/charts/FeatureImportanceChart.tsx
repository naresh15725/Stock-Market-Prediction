import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FeatureImportanceItem } from '../../types.ts';
import { Sliders, Cpu } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FeatureImportanceChartProps {
  importances: FeatureImportanceItem[];
  linearCoefficients: Record<string, number>;
}

export function FeatureImportanceChart({
  importances,
  linearCoefficients
}: FeatureImportanceChartProps) {
  const labels = importances.map((item) => {
    switch (item.feature) {
      case 'Lag_1':
        return 'Previous Close (t-1)';
      case 'Lag_2':
        return 'Close (t-2)';
      case 'Lag_3':
        return 'Close (t-3)';
      case 'Lag_5':
        return 'Close (t-5)';
      case 'SMA_7':
        return '7-Day SMA';
      case 'SMA_21':
        return '21-Day SMA';
      case 'Daily_Return':
        return 'Daily % Return';
      case 'Volatility_10':
        return '10D Volatility';
      case 'RSI_14':
        return '14D RSI';
      case 'HL_Spread':
        return 'High-Low Spread';
      case 'OC_Spread':
        return 'Open-Close Spread';
      default:
        return item.feature;
    }
  });

  const values = importances.map((item) => +(item.importance * 100).toFixed(1));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Random Forest Feature Importance (%)',
        data: values,
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(148, 163, 184, 0.6)',
          'rgba(148, 163, 184, 0.5)',
          'rgba(148, 163, 184, 0.4)',
          'rgba(148, 163, 184, 0.3)',
          'rgba(148, 163, 184, 0.2)'
        ],
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#1E293B'
      }
    ]
  };

  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
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
        padding: 10,
        callbacks: {
          label: (ctx) => ` Relative Weight: ${ctx.raw}%`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (val) => `${val}%`
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#E2E8F0',
          font: { family: 'Plus Jakarta Sans', size: 12, weight: 500 }
        }
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Machine Learning Feature Importance
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gini impurity reduction ranking calculated across 100 decision trees in the Random Forest ensemble
          </p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <span className="font-semibold text-slate-200">Key Finding:</span> Recent price momentum (Lag-1 and SMA-7) carries the dominant predictive weight, followed by technical spreads and rolling volatility.
      </div>
    </div>
  );
}
