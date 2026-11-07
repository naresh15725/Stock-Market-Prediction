# Stock Market Price Prediction Using Machine Learning

An applied Machine Learning project for analyzing historical financial stock data and forecasting future stock prices using **Linear Regression** and **Random Forest Regressors**.

---

## 📌 Project Overview
Predicting stock prices is one of the most prominent challenges in financial time-series forecasting due to market volatility and non-linear patterns. This project implements an interactive full-stack machine learning pipeline that:
1. Ingests genuine real-time and historical stock quotes (Open, High, Low, Close, Volume) via Yahoo Finance API with offline fallback data.
2. Performs automated technical feature engineering (Moving Averages, Relative Strength Index, Lagged Prices, Volatility, Price Spreads).
3. Evaluates models out-of-sample using standard statistical metrics: **MAE**, **MSE**, **RMSE**, and **R² Score**.
4. Produces multi-day future forecasts with 95% statistical confidence intervals.
5. Provides interactive Chart.js visualizations for trend analysis, actual vs. predicted verification, and feature importance analysis.

---

## 🛠️ Technology Stack
- **Machine Learning**: Python 3, Scikit-learn, Pandas, NumPy
- **Algorithms**: Linear Regression (Ordinary Least Squares) & Random Forest Regressor
- **Backend**: Express.js (Node.js) with Python child process execution
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Data Visualization**: Chart.js and React-Chartjs-2
- **Data Ingestion**: Yahoo Finance API & Curated Historical OHLCV Cache

---

## 🧠 Machine Learning Algorithms

### 1. Linear Regression (Ordinary Least Squares)
- **Mathematical Model**:
  $$\hat{y} = \beta_0 + \sum_{j=1}^{p} \beta_j X_j + \epsilon$$
- **Closed-Form Solution**:
  $$\beta = (X^T X)^{-1} X^T y$$
- **Role in Project**: Acts as a parametric baseline model that captures linear momentum and moving average relationships.

### 2. Random Forest Regressor
- **Ensemble Methodology**: An ensemble of $B$ de-correlated Decision Trees ($B = 100$) utilizing bootstrap aggregation (bagging) and random feature subspace selection.
- **Ensemble Prediction**:
  $$\hat{y} = \frac{1}{B} \sum_{b=1}^{B} T_b(X)$$
- **Role in Project**: Models non-linear interactions between technical indicators (e.g., RSI overbought thresholds and volatility spikes) without overfitting.

---

## 📐 Evaluation Metrics

- **Mean Absolute Error (MAE)**:
  $$MAE = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|$$
- **Mean Squared Error (MSE)**:
  $$MSE = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$
- **Root Mean Squared Error (RMSE)**:
  $$RMSE = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}$$
- **Coefficient of Determination ($R^2$ Score)**:
  $$R^2 = 1 - \frac{\sum_{i=1}^{n} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{n} (y_i - \bar{y})^2}$$

---

## ⚙️ Feature Engineering Pipeline
The following 11 quantitative features are calculated from the historical time series:
1. `Lag_1`: Previous day's closing price ($Close_{t-1}$)
2. `Lag_2`: 2 days prior closing price ($Close_{t-2}$)
3. `Lag_3`: 3 days prior closing price ($Close_{t-3}$)
4. `Lag_5`: 5 days prior closing price ($Close_{t-5}$)
5. `SMA_7`: 7-day Simple Moving Average
6. `SMA_21`: 21-day Simple Moving Average
7. `HL_Spread`: Normalized intraday volatility $\frac{High - Low}{Close}$
8. `OC_Spread`: Normalized intraday movement $\frac{Close - Open}{Open}$
9. `Daily_Return`: Percentage return from previous session $\frac{Close_{t-1} - Close_{t-2}}{Close_{t-2}}$
10. `Volatility_10`: 10-day rolling standard deviation of daily returns
11. `RSI_14`: 14-period Relative Strength Index ($0 \le RSI \le 100$)

---

## 🚀 Installation & Local Execution

### Prerequisites
- Node.js (v18+)
- Python 3 (3.8+)

### Steps
```bash
# 1. Install Node.js dependencies
npm install

# 2. Install Python Machine Learning packages
pip install scikit-learn pandas numpy

# 3. Start development server
npm run dev
```
The application will be live at `http://localhost:3000`.

---

## ⚠️ Academic Disclaimer
This software is developed strictly for college-level educational and machine learning research demonstration. Stock market prices are influenced by global macroeconomics, corporate disclosures, and psychological factors. These statistical predictions do not constitute financial or investment advice.
