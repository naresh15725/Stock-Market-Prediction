import { useState, useMemo } from 'react';
import { StockPoint } from '../types.ts';
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface HistoricalDataTableProps {
  data: StockPoint[];
  symbol: string;
}

export function HistoricalDataTable({ data, symbol }: HistoricalDataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'date' | 'close' | 'volume'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const pageSize = 12;

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => row.date.includes(q));
    }

    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortAsc
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      }
      if (sortField === 'close') {
        return sortAsc ? a.close - b.close : b.close - a.close;
      }
      if (sortField === 'volume') {
        return sortAsc ? a.volume - b.volume : b.volume - a.volume;
      }
      return 0;
    });

    return result;
  }, [data, searchQuery, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pageData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: 'date' | 'close' | 'volume') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Daily_Change', 'Change_Pct'];
    const rows = filteredData.map((row, idx, arr) => {
      const prev = arr[idx + 1] || row;
      const change = +(row.close - prev.close).toFixed(2);
      const pct = +((change / (prev.close || 1)) * 100).toFixed(2);
      return [
        row.date,
        row.open,
        row.high,
        row.low,
        row.close,
        row.volume,
        change,
        `${pct}%`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${symbol}_historical_stock_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 font-display">
            Historical OHLCV Market Records ({data.length} Trading Sessions)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified opening, highest, lowest, closing prices and volume used to train ML models
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search by date */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search date (YYYY-MM)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-2.5 px-3.5 cursor-pointer hover:text-slate-200 select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Trading Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3.5">Open ($)</th>
              <th className="py-2.5 px-3.5">High ($)</th>
              <th className="py-2.5 px-3.5">Low ($)</th>
              <th
                onClick={() => handleSort('close')}
                className="py-2.5 px-3.5 cursor-pointer hover:text-slate-200 select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Close ($)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3.5">Daily Change</th>
              <th
                onClick={() => handleSort('volume')}
                className="py-2.5 px-3.5 cursor-pointer hover:text-slate-200 select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
            {pageData.map((row, idx) => {
              const prev = filteredData[idx + 1] || row;
              const change = +(row.close - prev.close).toFixed(2);
              const changePct = +((change / (prev.close || 1)) * 100).toFixed(2);
              const isBull = change >= 0;

              return (
                <tr key={row.date} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3.5 text-slate-200 font-medium">{row.date}</td>
                  <td className="py-2.5 px-3.5 text-slate-300">${row.open.toFixed(2)}</td>
                  <td className="py-2.5 px-3.5 text-emerald-400/90">${row.high.toFixed(2)}</td>
                  <td className="py-2.5 px-3.5 text-rose-400/90">${row.low.toFixed(2)}</td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-100">${row.close.toFixed(2)}</td>
                  <td className="py-2.5 px-3.5">
                    <span className={isBull ? 'text-emerald-400' : 'text-rose-400'}>
                      {isBull ? '+' : ''}
                      {change.toFixed(2)} ({isBull ? '+' : ''}
                      {changePct.toFixed(2)}%)
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-400">
                    {row.volume.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
        <div className="font-mono">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
