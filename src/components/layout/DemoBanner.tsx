import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { formatUSD } from '../../utils/formatters';
import { RotateCcw } from 'lucide-react';
import { Link } from '../../router/Router';

export const DemoBanner: React.FC = () => {
  const { portfolio, resetDemoData, settings, updateSettings } = useDemo();

  if (settings.riskBannerDismissed) return null;

  return (
    <div className="bg-[#0B0E11] border-b border-gray-800 px-4 py-2 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 text-gray-300">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0" />
          <span className="font-semibold text-white">Paper Trading Active</span>
          <span className="hidden sm:inline text-gray-600">•</span>
          <span className="hidden sm:inline text-gray-400">
            Simulated Balance:{' '}
            <strong className="text-green-400 font-mono font-bold">
              {formatUSD(portfolio.totalValueUSD)}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetDemoData}
            id="btn-global-reset-demo"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 text-[11px] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Reset Demo Balances</span>
          </button>
          <Link
            to="/trade"
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors shadow-sm"
          >
            Terminal
          </Link>
          <button
            type="button"
            onClick={() => updateSettings({ riskBannerDismissed: true })}
            className="text-gray-500 hover:text-gray-300 text-xs px-1"
            title="Dismiss top banner"
            aria-label="Dismiss top banner"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E11]/95 border-t border-gray-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around text-[10px] select-none">
      <Link
        to="/"
        className="flex flex-col items-center gap-1 py-1 px-2 text-gray-400 hover:text-white"
        activeClassName="text-indigo-400 font-semibold"
      >
        <span className="text-base">🏠</span>
        <span>Home</span>
      </Link>
      <Link
        to="/markets"
        className="flex flex-col items-center gap-1 py-1 px-2 text-gray-400 hover:text-white"
        activeClassName="text-indigo-400 font-semibold"
      >
        <span className="text-base">📊</span>
        <span>Markets</span>
      </Link>
      <Link
        to="/trade"
        className="flex flex-col items-center gap-1 py-1 px-2 text-gray-400 hover:text-white"
        activeClassName="text-indigo-400 font-semibold"
      >
        <span className="text-base">⚡</span>
        <span>Trade</span>
      </Link>
      <Link
        to="/dashboard"
        className="flex flex-col items-center gap-1 py-1 px-2 text-gray-400 hover:text-white"
        activeClassName="text-indigo-400 font-semibold"
      >
        <span className="text-base">💼</span>
        <span>Portfolio</span>
      </Link>
      <Link
        to="/wallet"
        className="flex flex-col items-center gap-1 py-1 px-2 text-gray-400 hover:text-white"
        activeClassName="text-indigo-400 font-semibold"
      >
        <span className="text-base">🪙</span>
        <span>Wallet</span>
      </Link>
    </div>
  );
};
