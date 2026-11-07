import express, { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { POPULAR_STOCKS, generateSyntheticHistory } from './src/data/fallbackStockData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// 1. Health & Machine Learning Stack Status Endpoint
app.get('/api/system/status', (_req: Request, res: Response) => {
  const pyProcess = spawn('python3', [
    '-c',
    'import sklearn, pandas, numpy; print(sklearn.__version__ + "," + pandas.__version__ + "," + numpy.__version__)'
  ]);

  let stdout = '';
  let stderr = '';

  pyProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  pyProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  pyProcess.on('close', (code) => {
    if (code === 0 && stdout.trim()) {
      const [sklearnVer, pandasVer, numpyVer] = stdout.trim().split(',');
      res.json({
        status: 'online',
        python_available: true,
        scikit_learn_version: sklearnVer,
        pandas_version: pandasVer,
        numpy_version: numpyVer,
        backend: 'Express Full-Stack with Python Scikit-Learn Engine'
      });
    } else {
      res.json({
        status: 'online',
        python_available: true,
        scikit_learn_version: 'pure_python_fallback',
        pandas_version: 'native',
        numpy_version: 'native',
        notice: stderr || 'Running in pure-python fallback mode',
        backend: 'Express Full-Stack with Python Engine'
      });
    }
  });
});

// 2. Popular Stocks Directory
app.get('/api/stocks/popular', (_req: Request, res: Response) => {
  const popular = Object.keys(POPULAR_STOCKS).map((symbol) => ({
    symbol,
    name: POPULAR_STOCKS[symbol].profile.name,
    sector: POPULAR_STOCKS[symbol].profile.sector,
    price: POPULAR_STOCKS[symbol].profile.regularMarketPrice,
    change: POPULAR_STOCKS[symbol].profile.regularMarketChange,
    changePercent: POPULAR_STOCKS[symbol].profile.regularMarketChangePercent
  }));
  res.json({ stocks: popular });
});

// 3. Stock History Endpoint (Yahoo Finance Live with Fallback)
app.get('/api/stocks/history', async (req: Request, res: Response) => {
  const symbol = (req.query.symbol as string || 'AAPL').toUpperCase().trim();
  const range = (req.query.range as string || '1y').toLowerCase();

  try {
    // Attempt Yahoo Finance API call
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=1d&includePrePost=false`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const result = data?.chart?.result?.[0];

      if (result && result.timestamp && result.indicators?.quote?.[0]) {
        const meta = result.meta;
        const timestamps = result.timestamp;
        const quote = result.indicators.quote[0];
        const opens = quote.open || [];
        const highs = quote.high || [];
        const lows = quote.low || [];
        const closes = quote.close || [];
        const volumes = quote.volume || [];

        const points = [];
        for (let i = 0; i < timestamps.length; i++) {
          const c = closes[i];
          const o = opens[i];
          const h = highs[i];
          const l = lows[i];
          const v = volumes[i];

          // Skip days with null or incomplete quotes
          if (c !== null && c !== undefined && o !== null && h !== null && l !== null) {
            const dateStr = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
            points.push({
              date: dateStr,
              open: +o.toFixed(2),
              high: +h.toFixed(2),
              low: +l.toFixed(2),
              close: +c.toFixed(2),
              volume: v || 0
            });
          }
        }

        if (points.length >= 20) {
          const lastPoint = points[points.length - 1];
          const prevPoint = points[points.length - 2] || lastPoint;
          const change = +(lastPoint.close - prevPoint.close).toFixed(2);
          const changePercent = +((change / prevPoint.close) * 100).toFixed(2);

          const high52 = Math.max(...points.map((p) => p.high));
          const low52 = Math.min(...points.map((p) => p.low));

          return res.json({
            symbol,
            source: 'Yahoo Finance Live API',
            profile: {
              symbol,
              name: meta.longName || meta.shortName || `${symbol} Corporation`,
              currency: meta.currency || 'USD',
              regularMarketPrice: meta.regularMarketPrice || lastPoint.close,
              regularMarketChange: change,
              regularMarketChangePercent: changePercent,
              regularMarketDayHigh: meta.regularMarketDayHigh || lastPoint.high,
              regularMarketDayLow: meta.regularMarketDayLow || lastPoint.low,
              fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || high52,
              fiftyTwoWeekLow: meta.fiftyTwoWeekLow || low52,
              regularMarketVolume: meta.regularMarketVolume || lastPoint.volume,
              sector: meta.instrumentType || 'Equity'
            },
            history: points
          });
        }
      }
    }
  } catch (error) {
    console.warn(`Live stock fetch for ${symbol} failed, falling back to cache:`, (error as Error).message);
  }

  // Graceful fallback to static cache or generated history
  if (POPULAR_STOCKS[symbol]) {
    const cached = POPULAR_STOCKS[symbol];
    return res.json({
      symbol,
      source: 'Curated Historical Database (Offline/Fallback)',
      profile: cached.profile,
      history: cached.history
    });
  }

  // Fallback for custom symbols
  const synthetic = generateSyntheticHistory(150.0, 180);
  const last = synthetic[synthetic.length - 1];
  const prev = synthetic[synthetic.length - 2];
  const change = +(last.close - prev.close).toFixed(2);
  const changePercent = +((change / prev.close) * 100).toFixed(2);

  return res.json({
    symbol,
    source: 'Simulated Historical Random Walk (Fallback)',
    profile: {
      symbol,
      name: `${symbol} Equity Asset`,
      currency: 'USD',
      regularMarketPrice: last.close,
      regularMarketChange: change,
      regularMarketChangePercent: changePercent,
      regularMarketDayHigh: last.high,
      regularMarketDayLow: last.low,
      fiftyTwoWeekHigh: Math.max(...synthetic.map((s) => s.high)),
      fiftyTwoWeekLow: Math.min(...synthetic.map((s) => s.low)),
      regularMarketVolume: last.volume,
      sector: 'General Equity'
    },
    history: synthetic
  });
});

// 4. Machine Learning Training & Prediction Endpoint
app.post('/api/ml/predict', (req: Request, res: Response) => {
  const {
    historical_data,
    horizon_days = 14,
    test_split_ratio = 0.2,
    rf_estimators = 100
  } = req.body;

  if (!historical_data || !Array.isArray(historical_data) || historical_data.length < 30) {
    return res.status(400).json({
      error: 'At least 30 historical daily data points are required to train the machine learning models.'
    });
  }

  // Spawn Python ml_engine.py
  const pythonPath = 'python3';
  const scriptPath = path.join(__dirname, 'ml_engine.py');

  const pyProcess = spawn(pythonPath, [scriptPath]);

  let stdout = '';
  let stderr = '';

  pyProcess.stdout.on('data', (chunk) => {
    stdout += chunk.toString();
  });

  pyProcess.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  pyProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('ML engine process failed with code', code, stderr);
      return res.status(500).json({
        error: 'Failed to execute Machine Learning engine',
        details: stderr || stdout
      });
    }

    try {
      const parsed = JSON.parse(stdout);
      return res.json(parsed);
    } catch (parseError) {
      console.error('Failed to parse ML engine output:', stdout, parseError);
      return res.status(500).json({
        error: 'Invalid response from ML engine',
        details: stdout
      });
    }
  });

  // Write payload to python stdin
  const payload = JSON.stringify({
    historical_data,
    horizon_days,
    test_split_ratio,
    rf_estimators
  });

  pyProcess.stdin.write(payload);
  pyProcess.stdin.end();
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev mode, mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ML Stock Prediction Server running on port ${PORT}`);
  });
}

startServer();
