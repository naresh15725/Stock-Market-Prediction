import { MLConfig, MLPredictionResult } from '../types.ts';
import { Sliders, Cpu, Play, CheckCircle, AlertCircle } from 'lucide-react';

interface MLControlPanelProps {
  config: MLConfig;
  onChangeConfig: (config: MLConfig) => void;
  onTrain: () => void;
  isTraining: boolean;
  predictionResult: MLPredictionResult | null;
  error: string | null;
}

export function MLControlPanel({
  config,
  onChangeConfig,
  onTrain,
  isTraining,
  predictionResult,
  error
}: MLControlPanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Machine Learning Training & Forecasting Setup
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure Scikit-Learn training parameters, chronological test partition, and multi-step projection window
          </p>
        </div>

        {predictionResult && (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Trained on {predictionResult.engine_info.train_samples} samples · Evaluated on {predictionResult.engine_info.test_samples} test samples</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Sliders and Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Forecast Horizon */}
        <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-slate-300">Forecast Horizon</label>
            <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
              {config.horizon_days} Days
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="30"
            step="1"
            value={config.horizon_days}
            onChange={(e) =>
              onChangeConfig({ ...config, horizon_days: parseInt(e.target.value, 10) })
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>3d (Short)</span>
            <span>14d (Swing)</span>
            <span>30d (Month)</span>
          </div>
        </div>

        {/* Test Split Ratio */}
        <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-slate-300">Test Split Ratio</label>
            <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
              {(config.test_split_ratio * 100).toFixed(0)}% Test / {(100 - config.test_split_ratio * 100).toFixed(0)}% Train
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.30"
            step="0.05"
            value={config.test_split_ratio}
            onChange={(e) =>
              onChangeConfig({ ...config, test_split_ratio: parseFloat(e.target.value) })
            }
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>10%</span>
            <span>20% (Standard)</span>
            <span>30%</span>
          </div>
        </div>

        {/* Random Forest Estimators */}
        <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-slate-300">RF Decision Trees</label>
            <span className="text-xs font-mono font-bold text-purple-400 tabular-nums">
              {config.rf_estimators} Trees
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            step="20"
            value={config.rf_estimators}
            onChange={(e) =>
              onChangeConfig({ ...config, rf_estimators: parseInt(e.target.value, 10) })
            }
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>20 Fast</span>
            <span>100 Default</span>
            <span>200 Deep</span>
          </div>
        </div>

        {/* Trigger Button Card */}
        <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-300 block mb-1">
            Execute Pipeline
          </span>
          <button
            onClick={onTrain}
            disabled={isTraining}
            className={`w-full py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isTraining
                ? 'bg-emerald-600/50 text-emerald-200 cursor-wait'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            <span>{isTraining ? 'Running Scikit-Learn...' : 'Train Models & Predict'}</span>
          </button>
          <span className="text-[10px] text-slate-500 text-center mt-1 font-mono">
            Trains Linear Regression + Random Forest
          </span>
        </div>
      </div>
    </div>
  );
}
