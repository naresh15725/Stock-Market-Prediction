export interface StockPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockProfile {
  symbol: string;
  name: string;
  sector: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketVolume: number;
}

export interface MetricScores {
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  mape: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
}

export interface TestComparisonPoint {
  date: string;
  actual: number;
  predicted_lr: number;
  predicted_rf: number;
  residual_lr: number;
  residual_rf: number;
}

export interface FuturePredictionPoint {
  day: number;
  date: string;
  predicted_close_lr: number;
  predicted_close_rf: number;
  predicted_close_ensemble: number;
  confidence_upper: number;
  confidence_lower: number;
  expected_change_pct: number;
}

export interface MLPredictionResult {
  engine_info: {
    sklearn_powered: boolean;
    total_samples: number;
    train_samples: number;
    test_samples: number;
    features_used: string[];
  };
  performance_metrics: {
    linear_regression: MetricScores;
    random_forest: MetricScores;
    recommended_model: string;
    r2_delta: number;
  };
  feature_importance: {
    random_forest: FeatureImportanceItem[];
    linear_regression_coefficients: Record<string, number>;
  };
  forecast_summary: {
    last_closing_price: number;
    predicted_next_day_price: number;
    predicted_end_horizon_price: number;
    expected_horizon_return_pct: number;
    market_trend: 'Bullish' | 'Bearish';
    horizon_days: number;
  };
  test_comparison: TestComparisonPoint[];
  future_predictions: FuturePredictionPoint[];
}

export interface MLConfig {
  horizon_days: number;
  test_split_ratio: number;
  rf_estimators: number;
  selected_model: 'both' | 'linear_regression' | 'random_forest';
}
