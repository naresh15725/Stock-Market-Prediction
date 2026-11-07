import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { TickerBar } from './components/TickerBar.tsx';
import { StockOverview } from './components/StockOverview.tsx';
import { MLControlPanel } from './components/MLControlPanel.tsx';
import { PerformanceMetrics } from './components/PerformanceMetrics.tsx';
import { PriceChart } from './components/charts/PriceChart.tsx';
import { ActualVsPredictedChart } from './components/charts/ActualVsPredictedChart.tsx';
import { FutureForecastChart } from './components/charts/FutureForecastChart.tsx';
import { FeatureImportanceChart } from './components/charts/FeatureImportanceChart.tsx';
import { HistoricalDataTable } from './components/HistoricalDataTable.tsx';
import { ProjectDocumentation } from './components/ProjectDocumentation.tsx';
import { StockPoint, StockProfile, MLPredictionResult, MLConfig } from './types.ts';
import { POPULAR_STOCKS } from './data/fallbackStockData.ts';
import { Loader2, AlertCircle, Sparkles, TrendingUp, Cpu, Award, LineChart } from 'lucide-react';

export default function App() {
  const [currentSymbol, setCurrentSymbol] = useState('AAPL');
  const [currentRange, setCurrentRange] = useState('1y');
  const [profile, setProfile] = useState<StockProfile | null>(
    POPULAR_STOCKS.AAPL.profile
  );
  const [historyData, setHistoryData] = useState<StockPoint[]>(
    POPULAR_STOCKS.AAPL.history
  );
  const [dataSource, setDataSource] = useState('Yahoo Finance Live API');
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('dashboard');

  const [mlConfig, setMlConfig] = useState<MLConfig>({
    horizon_days: 14,
    test_split_ratio: 0.2,
    rf_estimators: 100,
    selected_model: 'both'
  });

  const [isTraining, setIsTraining] = useState(false);
  const [mlResult, setMlResult] = useState<MLPredictionResult | null>(null);
  const [mlError, setMlError] = useState<string | null>(null);
  const [pythonStatus, setPythonStatus] = useState<any>(null);

  // 1. Fetch Python System Status
  useEffect(() => {
    fetch('/api/system/status')
      .then((res) => res.json())
      .then((data) => setPythonStatus(data))
      .catch((err) => console.warn('System status error:', err));
  }, []);

  // 2. Machine Learning Training Request
  const runPrediction = useCallback(
    async (pointsToTrain: StockPoint[], configToUse: MLConfig) => {
      if (!pointsToTrain || pointsToTrain.length < 30) {
        setMlError('At least 30 historical points required for ML training.');
        return;
      }

      setIsTraining(true);
      setMlError(null);

      try {
        const response = await fetch('/api/ml/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symbol: currentSymbol,
            historical_data: pointsToTrain,
            horizon_days: configToUse.horizon_days,
            test_split_ratio: configToUse.test_split_ratio,
            rf_estimators: configToUse.rf_estimators
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || errData.details || 'Machine learning training failed');
        }

        const data: MLPredictionResult = await response.json();
        setMlResult(data);
      } catch (err) {
        console.error('Prediction failed:', err);
        setMlError((err as Error).message);
      } finally {
        setIsTraining(false);
      }
    },
    [currentSymbol]
  );

  // 3. Fetch Stock Historical Data
  const fetchStockData = useCallback(
    async (symbol: string, range: string) => {
      setIsLoadingStock(true);
      setStockError(null);

      try {
        const res = await fetch(
          `/api/stocks/history?symbol=${encodeURIComponent(symbol)}&range=${encodeURIComponent(range)}`
        );
        if (!res.ok) {
          throw new Error(`Failed to load quotes for ${symbol}`);
        }
        const json = await res.json();
        setProfile(json.profile);
        setHistoryData(json.history);
        setDataSource(json.source || 'Yahoo Finance');

        // Automatically trigger ML training with the fresh data
        runPrediction(json.history, mlConfig);
      } catch (err) {
        console.error('Stock fetch error:', err);
        setStockError((err as Error).message);
        // Fallback to local cache if present
        if (POPULAR_STOCKS[symbol]) {
          const fb = POPULAR_STOCKS[symbol];
          setProfile(fb.profile);
          setHistoryData(fb.history);
          setDataSource('Curated Historical Database (Offline Fallback)');
          runPrediction(fb.history, mlConfig);
        }
      } finally {
        setIsLoadingStock(false);
      }
    },
    [mlConfig, runPrediction]
  );

  // Trigger initial fetch on load
  useEffect(() => {
    fetchStockData(currentSymbol, currentRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSymbol, currentRange]);

  const handleSelectSymbol = (symbol: string) => {
    setCurrentSymbol(symbol);
  };

  const handleSelectRange = (range: string) => {
    setCurrentRange(range);
  };

  const handleTrainTrigger = () => {
    if (historyData.length >= 30) {
      runPrediction(historyData, mlConfig);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchSymbol={handleSelectSymbol}
        isTraining={isTraining}
        onTrainTrigger={handleTrainTrigger}
        pythonStatus={pythonStatus}
      />

      {/* 2. Ticker Selector Bar */}
      <TickerBar
        currentSymbol={currentSymbol}
        onSelectSymbol={handleSelectSymbol}
        currentRange={currentRange}
        onSelectRange={handleSelectRange}
        dataSource={dataSource}
      />

      {/* 3. Main Viewport Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification banner if stock loading fails */}
        {stockError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{stockError}. Reverting to offline historical cache.</span>
          </div>
        )}

        {/* Loading Indicator for Data Fetch */}
        {isLoadingStock && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Fetching historical market quotes for {currentSymbol}...</span>
          </div>
        )}

        {/* Stock Overview Card */}
        {profile && (
          <StockOverview
            profile={profile}
            recentData={historyData}
            dataSource={dataSource}
          />
        )}

        {/* Machine Learning Hyperparameter Control Panel */}
        <MLControlPanel
          config={mlConfig}
          onChangeConfig={setMlConfig}
          onTrain={handleTrainTrigger}
          isTraining={isTraining}
          predictionResult={mlResult}
          error={mlError}
        />

        {/* TAB CONTENT ROUTING */}

        {/* Tab 1: Dashboard View (All-in-one comprehensive overview) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Primary Charts Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Historical Price Chart */}
              <PriceChart data={historyData} symbol={currentSymbol} />

              {/* Future Forecast Chart */}
              {mlResult ? (
                <FutureForecastChart
                  recentHistory={historyData}
                  predictions={mlResult.future_predictions}
                  symbol={currentSymbol}
                />
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400 min-h-[380px]">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mb-3" />
                  <p className="text-sm font-semibold text-slate-200">
                    Training Machine Learning Models...
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Executing Scikit-Learn regression pipeline on historical time-series data
                  </p>
                </div>
              )}
            </div>

            {/* Performance Benchmarks */}
            {mlResult && <PerformanceMetrics result={mlResult} />}

            {/* Test Set Actual vs Predicted & Feature Importance */}
            {mlResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActualVsPredictedChart
                  comparisonData={mlResult.test_comparison}
                  symbol={currentSymbol}
                />
                <FeatureImportanceChart
                  importances={mlResult.feature_importance.random_forest}
                  linearCoefficients={
                    mlResult.feature_importance.linear_regression_coefficients
                  }
                />
              </div>
            )}

            {/* Historical Data Table */}
            <HistoricalDataTable data={historyData} symbol={currentSymbol} />
          </div>
        )}

        {/* Tab 2: Model Evaluation Focus */}
        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            {mlResult ? (
              <>
                <PerformanceMetrics result={mlResult} />
                <ActualVsPredictedChart
                  comparisonData={mlResult.test_comparison}
                  symbol={currentSymbol}
                />
                <FeatureImportanceChart
                  importances={mlResult.feature_importance.random_forest}
                  linearCoefficients={
                    mlResult.feature_importance.linear_regression_coefficients
                  }
                />
              </>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
                <p className="text-sm">Calculating out-of-sample statistical metrics...</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Future Forecast Focus */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            {mlResult ? (
              <>
                <FutureForecastChart
                  recentHistory={historyData}
                  predictions={mlResult.future_predictions}
                  symbol={currentSymbol}
                />

                {/* Forecast Table Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-100 font-display mb-3 pb-3 border-b border-slate-800">
                    Day-by-Day Forecast Schedule ({mlResult.future_predictions.length} Trading Days)
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-xs font-mono tabular-nums">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Forecast Day</th>
                          <th className="py-2.5 px-3">Target Date</th>
                          <th className="py-2.5 px-3">Linear Regression</th>
                          <th className="py-2.5 px-3">Random Forest</th>
                          <th className="py-2.5 px-3">Ensemble ($)</th>
                          <th className="py-2.5 px-3">Expected Return</th>
                          <th className="py-2.5 px-3">95% Confidence Band</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {mlResult.future_predictions.map((p) => {
                          const isUp = p.expected_change_pct >= 0;
                          return (
                            <tr key={p.day} className="hover:bg-slate-850/40">
                              <td className="py-2 px-3 text-slate-400">Day +{p.day}</td>
                              <td className="py-2 px-3 text-slate-200">{p.date}</td>
                              <td className="py-2 px-3 text-cyan-400">
                                ${p.predicted_close_lr.toFixed(2)}
                              </td>
                              <td className="py-2 px-3 text-purple-400">
                                ${p.predicted_close_rf.toFixed(2)}
                              </td>
                              <td className="py-2 px-3 font-bold text-emerald-400">
                                ${p.predicted_close_ensemble.toFixed(2)}
                              </td>
                              <td className="py-2 px-3">
                                <span className={isUp ? 'text-emerald-400' : 'text-rose-400'}>
                                  {isUp ? '+' : ''}
                                  {p.expected_change_pct.toFixed(2)}%
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-400">
                                ${p.confidence_lower.toFixed(2)} - ${p.confidence_upper.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
                <p className="text-sm">Generating multi-step forecasting model...</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Historical Data Focus */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <PriceChart data={historyData} symbol={currentSymbol} />
            <HistoricalDataTable data={historyData} symbol={currentSymbol} />
          </div>
        )}

        {/* Tab 5: College Project Documentation */}
        {activeTab === 'documentation' && <ProjectDocumentation />}
      </main>

      {/* Clean Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 font-display">
              STOCK MARKET PRICE PREDICTION USING MACHINE LEARNING
            </span>
            <span>·</span>
            <span>College Applied ML Project</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>Linear Regression (OLS)</span>
            <span>·</span>
            <span>Random Forest (100 Trees)</span>
            <span>·</span>
            <span>Scikit-Learn & React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
