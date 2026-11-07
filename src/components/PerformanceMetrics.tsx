import { MLPredictionResult } from '../types.ts';
import { Award, Zap, TrendingUp, HelpCircle } from 'lucide-react';

interface PerformanceMetricsProps {
  result: MLPredictionResult;
}

export function PerformanceMetrics({ result }: PerformanceMetricsProps) {
  const lr = result.performance_metrics.linear_regression;
  const rf = result.performance_metrics.random_forest;
  const recommended = result.performance_metrics.recommended_model;
  const isRFRecommended = recommended === 'Random Forest';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Machine Learning Performance Benchmarking
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard statistical regression evaluation metrics measured on out-of-sample test partition
          </p>
        </div>

        {/* Recommended Model Highlight */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Optimal Model: {recommended}</span>
        </div>
      </div>

      {/* Side-by-Side Model Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Linear Regression Card */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            !isRFRecommended
              ? 'bg-slate-950/80 border-cyan-500/40 ring-1 ring-cyan-500/30'
              : 'bg-slate-950/50 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <h4 className="text-sm font-semibold text-slate-100 font-display">
                  Linear Regression (OLS)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Ordinary Least Squares parametric baseline
              </span>
            </div>
            {!isRFRecommended && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                RECOMMENDED
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* R2 Score */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">R² Score (Variance)</span>
              <span className="text-base font-bold font-mono tabular-nums text-cyan-400">
                {lr.r2.toFixed(4)}
              </span>
            </div>

            {/* RMSE */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">RMSE (Root MSE)</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-200">
                ${lr.rmse.toFixed(2)}
              </span>
            </div>

            {/* MAE */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">MAE (Mean Abs Error)</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-200">
                ${lr.mae.toFixed(2)}
              </span>
            </div>

            {/* MSE */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">MSE (Mean Sq Error)</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-200">
                {lr.mse.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Mean Abs % Error:</span>{' '}
            <span className="font-mono tabular-nums text-slate-200">{lr.mape}%</span>
          </div>
        </div>

        {/* 2. Random Forest Card */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isRFRecommended
              ? 'bg-slate-950/80 border-emerald-500/40 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/50 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                <h4 className="text-sm font-semibold text-slate-100 font-display">
                  Random Forest Regressor
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Non-linear ensemble with bootstrap aggregation
              </span>
            </div>
            {isRFRecommended && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                RECOMMENDED
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* R2 Score */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">R² Score (Variance)</span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-400">
                {rf.r2.toFixed(4)}
              </span>
            </div>

            {/* RMSE */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">RMSE (Root MSE)</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-200">
                ${rf.rmse.toFixed(2)}
              </span>
            </div>

            {/* MAE */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">MAE (Mean Abs Error)</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-200">
                ${rf.mae.toFixed(2)}
              </span>
            </div>

            {/* MSE */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">MSE (Mean Sq Error)</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-200">
                {rf.mse.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Mean Abs % Error:</span>{' '}
            <span className="font-mono tabular-nums text-slate-200">{rf.mape}%</span>
          </div>
        </div>
      </div>

      {/* Comparative Analysis Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Evaluation Metric</th>
              <th className="py-2.5 px-3">Linear Regression</th>
              <th className="py-2.5 px-3">Random Forest</th>
              <th className="py-2.5 px-3">Superior Model</th>
              <th className="py-2.5 px-3">College Evaluation Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            <tr>
              <td className="py-2 px-3 font-medium text-slate-200">R² Score (Fit)</td>
              <td className="py-2 px-3 tabular-nums text-cyan-400">{lr.r2.toFixed(4)}</td>
              <td className="py-2 px-3 tabular-nums text-purple-400">{rf.r2.toFixed(4)}</td>
              <td className="py-2 px-3 font-bold text-emerald-400">
                {rf.r2 >= lr.r2 ? 'Random Forest' : 'Linear Regression'}
              </td>
              <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">
                Measures proportion of variance explained by model (1.0 = perfect)
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-200">RMSE (Error in $)</td>
              <td className="py-2 px-3 tabular-nums">${lr.rmse.toFixed(2)}</td>
              <td className="py-2 px-3 tabular-nums">${rf.rmse.toFixed(2)}</td>
              <td className="py-2 px-3 font-bold text-emerald-400">
                {rf.rmse <= lr.rmse ? 'Random Forest' : 'Linear Regression'}
              </td>
              <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">
                Penalizes larger outliers heavily; lower is superior
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-200">MAE (Mean Abs Error)</td>
              <td className="py-2 px-3 tabular-nums">${lr.mae.toFixed(2)}</td>
              <td className="py-2 px-3 tabular-nums">${rf.mae.toFixed(2)}</td>
              <td className="py-2 px-3 font-bold text-emerald-400">
                {rf.mae <= lr.mae ? 'Random Forest' : 'Linear Regression'}
              </td>
              <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">
                Average dollar divergence from true closing price
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-slate-200">MAPE (% Accuracy)</td>
              <td className="py-2 px-3 tabular-nums">{lr.mape}%</td>
              <td className="py-2 px-3 tabular-nums">{rf.mape}%</td>
              <td className="py-2 px-3 font-bold text-emerald-400">
                {rf.mape <= lr.mape ? 'Random Forest' : 'Linear Regression'}
              </td>
              <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">
                Relative error percentage relative to stock quote size
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
