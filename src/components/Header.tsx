import { useState } from 'react';
import { Search, BookOpen, Activity, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchSymbol: (symbol: string) => void;
  isTraining: boolean;
  onTrainTrigger: () => void;
  pythonStatus: {
    scikit_learn_version?: string;
    backend?: string;
  } | null;
}

export function Header({
  activeTab,
  setActiveTab,
  onSearchSymbol,
  isTraining,
  onTrainTrigger,
  pythonStatus
}: HeaderProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSymbol(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100 font-display whitespace-nowrap">
                StockPredict <span className="text-emerald-400">ML</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-2 font-mono">
                Scikit-Learn · Linear Reg · Random Forest
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'evaluation', label: 'Model Evaluation' },
              { id: 'forecast', label: 'Future Forecast' },
              { id: 'history', label: 'Historical Data' },
              { id: 'documentation', label: 'Documentation' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-850 text-emerald-400 font-semibold border border-emerald-500/30 bg-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Search input & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Ticker (e.g. NVDA)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                className="w-32 lg:w-40 bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            <button
              onClick={onTrainTrigger}
              disabled={isTraining}
              className={`px-3 sm:px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
                isTraining
                  ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-emerald-500/20 hover:shadow-emerald-500/30'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
              <span>{isTraining ? 'Training Models...' : 'Train & Predict'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between gap-1 py-2 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'evaluation', label: 'Evaluation' },
            { id: 'forecast', label: 'Forecast' },
            { id: 'history', label: 'History' },
            { id: 'documentation', label: 'Docs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
