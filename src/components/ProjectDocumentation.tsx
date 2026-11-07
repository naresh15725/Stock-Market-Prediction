import { BookOpen, Brain, Terminal, ShieldAlert, Cpu, GitBranch, Layers, CheckCircle } from 'lucide-react';

export function ProjectDocumentation() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-8 text-slate-300">
      {/* Title & Academic Abstract */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-xs font-semibold mb-2">
          <BookOpen className="w-4 h-4" />
          <span>COLLEGE MACHINE LEARNING PROJECT SPECIFICATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tracking-tight">
          Stock Market Price Prediction Using Machine Learning
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          An end-to-end applied supervised machine learning system engineered to extract financial technical indicators from historical time-series stock quotes, train regression estimators (Linear Regression and Random Forest), evaluate out-of-sample statistical error metrics (MAE, MSE, RMSE, R²), and extrapolate multi-day future market prices.
        </p>
      </div>

      {/* 1. Workflow Architecture */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-100 font-display">
            1. End-to-End Machine Learning Pipeline Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
              Phase 01: Ingestion
            </span>
            <h4 className="text-sm font-semibold text-slate-100 mb-1">Data Pipeline</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fetches genuine OHLCV (Open, High, Low, Close, Volume) quotes from live Yahoo Finance endpoints with resilient offline fallback cache.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">
              Phase 02: Preprocessing
            </span>
            <h4 className="text-sm font-semibold text-slate-100 mb-1">Feature Engineering</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts 11 quantitative features including Price Lags (t-1, t-2, t-3, t-5), 7 & 21-day SMAs, 14-day RSI, daily spreads, and rolling volatility.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-xs font-mono font-bold text-purple-400 block mb-1">
              Phase 03: Training
            </span>
            <h4 className="text-sm font-semibold text-slate-100 mb-1">Model Fitting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies chronological time-series splitting (80% train / 20% test) to prevent future data leakage, training Linear Regression and Random Forest.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
              Phase 04: Projection
            </span>
            <h4 className="text-sm font-semibold text-slate-100 mb-1">Multi-Step Forecast</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Iteratively feeds forecasted predictions back into the feature matrix to project 1 to 30 days ahead with 95% RMSE confidence intervals.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Algorithms Explained */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-100 font-display">
            2. Machine Learning Algorithms Implemented
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Linear Regression */}
          <div className="p-5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-100 font-display">
                Linear Regression (Ordinary Least Squares)
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Parametric
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Linear Regression models the continuous target (next day closing price $y$) as a linear combination of explanatory features $X$:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              y = β₀ + β₁·Lag₁ + β₂·Lag₂ + β₃·SMA₇ + β₄·RSI₁₄ + ... + ε
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The regression coefficients $\beta$ are obtained analytically by minimizing the sum of squared residuals:
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
              β = (XᵀX)⁻¹ Xᵀy
            </div>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li>High interpretability through exact numerical coefficient weights.</li>
              <li>Captures macro linear trends and baseline moving average momentum.</li>
            </ul>
          </div>

          {/* Random Forest Regressor */}
          <div className="p-5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-100 font-display">
                Random Forest Regressor
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Non-Linear Ensemble
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              An ensemble method combining $B$ individual decision trees ($B = 100$) trained on bootstrapped subsets with random feature subsets:
            </p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto">
              ŷ_ensemble = (1 / B) · ∑ [Tree_b(x)] for b = 1 to B
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Splits within individual decision trees optimize variance reduction at each node:
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
              ΔVar = Var(parent) - [N_L·Var(left) + N_R·Var(right)] / N
            </div>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li>Captures non-linear thresholds (e.g. RSI &gt; 70 overbought triggers).</li>
              <li>Resistant to overfitting through bagging and feature subsampling.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Mathematical Evaluation Metrics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-100 font-display">
            3. Quantitative Evaluation Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold block">
              Coefficient of Determination (R²)
            </span>
            <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-200">
              R² = 1 - [ ∑(yᵢ - ŷᵢ)² / ∑(yᵢ - ȳ)² ]
            </div>
            <p className="text-xs text-slate-400">
              Quantifies the percentage of stock price variance successfully accounted for by the features. 1.0 represents a perfect fit.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold block">
              Root Mean Squared Error (RMSE)
            </span>
            <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-200">
              RMSE = √ [ (1/n) · ∑(yᵢ - ŷᵢ)² ]
            </div>
            <p className="text-xs text-slate-400">
              Expresses prediction error in native dollar currency ($) while penalizing larger deviations quadratically.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-purple-400 font-bold block">
              Mean Absolute Error (MAE)
            </span>
            <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-200">
              MAE = (1/n) · ∑ |yᵢ - ŷᵢ|
            </div>
            <p className="text-xs text-slate-400">
              Measures the direct linear average dollar difference between actual and model-predicted stock prices.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Local Installation & Project Structure */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-100 font-display">
            4. Local Execution & Technology Stack
          </h3>
        </div>

        <div className="p-5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <p className="text-slate-400 font-sans">
            Clone or run the project in any standard development environment:
          </p>
          <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 space-y-1">
            <div># 1. Install Python ML dependencies</div>
            <div>pip install scikit-learn pandas numpy</div>
            <div className="pt-2"># 2. Install Node dependencies & launch server</div>
            <div>npm install</div>
            <div>npm run dev</div>
          </div>
          <p className="text-slate-400 font-sans text-xs pt-1">
            Backend runs an Express server on port 3000 invoking Python 3 via child process, streaming results to the Vite React frontend.
          </p>
        </div>
      </section>

      {/* 5. Educational Disclaimer */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 font-display">
            Academic & Educational Purpose Disclaimer
          </span>
          <p className="leading-relaxed">
            This project is created strictly for academic and educational evaluation in machine learning. Real financial markets exhibit high non-stationarity, stochastic volatility, and macro-economic catalysts that cannot be reliably modeled by historical price indicators alone. Predictions rendered by this application must NOT be used as financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
