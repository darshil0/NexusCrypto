import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { Link, useRouter } from '../router/Router';
import { formatUSD, formatPercent, formatCrypto, formatTimestamp } from '../utils/formatters';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Activity,
  PlusCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  ChevronRight,
  PieChart,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';
import { MarketHeatmap } from '../components/dashboard/MarketHeatmap';

export const DashboardPage: React.FC = () => {
  const {
    portfolio,
    balances,
    assets,
    transactions,
    watchlist,
    resetDemoData,
  } = useDemo();
  const { navigate } = useRouter();

  const isDailyPos = portfolio.dailyChangeUSD >= 0;
  const isPnlPos = portfolio.totalPnLUSD >= 0;

  // Filter top movers
  const marketMovers = Object.values(assets)
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Portfolio Dashboard</h1>
            <Badge variant="emerald">Paper Trading Mode</Badge>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Simulated portfolio overview, asset allocation, real-time market heatmap, and paper execution ledger.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/buy">
            <Button size="sm" variant="primary" className="font-bold">
              <ArrowRightLeft className="w-4 h-4 mr-1.5" /> Buy & Convert
            </Button>
          </Link>
          <Link to="/trade">
            <Button size="sm" variant="secondary" className="font-bold">
              <Activity className="w-4 h-4 mr-1.5 text-green-400" /> Paper Terminal
            </Button>
          </Link>
          <Link to="/wallet">
            <Button size="sm" variant="outline">
              <Wallet className="w-4 h-4 mr-1.5 text-amber-400" /> Wallet & Faucet
            </Button>
          </Link>
          <button
            onClick={resetDemoData}
            title="Reset to $25k starting funds"
            className="p-2 rounded-xl bg-[#161A1E] border border-gray-800 text-gray-400 hover:text-amber-400 transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Portfolio Value & Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Value Card */}
        <Card className="p-6 bg-gradient-to-br from-[#161A1E] via-[#161A1E] to-indigo-950/30">
          <span className="text-xs font-mono text-gray-400 block uppercase tracking-wider">
            TOTAL SIMULATED NET WORTH
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-2">
            {formatUSD(portfolio.totalValueUSD)}
          </div>
          <div className="flex items-center gap-3 mt-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">24h Change:</span>
              <span className={isDailyPos ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                {formatUSD(portfolio.dailyChangeUSD)} ({formatPercent(portfolio.dailyChangePercent)})
              </span>
            </div>
          </div>
        </Card>

        {/* Unrealized PnL Card */}
        <Card className="p-6">
          <span className="text-xs font-mono text-gray-400 block uppercase tracking-wider">
            ALL-TIME UNREALIZED PNL
          </span>
          <div className={`text-3xl font-extrabold font-mono mt-2 ${isPnlPos ? 'text-green-400' : 'text-red-400'}`}>
            {formatUSD(portfolio.totalPnLUSD)}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <Badge variant={isPnlPos ? 'emerald' : 'rose'}>
              {isPnlPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPercent(portfolio.totalPnLPercent)} Return on Cost
            </Badge>
            <span className="text-gray-500 font-mono text-[11px]">vs Seed Basis</span>
          </div>
        </Card>

        {/* Quick Deposit / Faucet Card */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-gray-400 block uppercase tracking-wider">
              SANDBOX FAUCET & RESET
            </span>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Need more virtual test funds? Top up crypto or reset demo data anytime without limits.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Link to="/wallet" className="w-full">
              <Button size="sm" variant="secondary" className="w-full text-xs">
                Top Up Faucet
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={resetDemoData}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Reset Seed
            </Button>
          </div>
        </Card>
      </div>

      {/* Real-time Market Heatmap */}
      <MarketHeatmap />

      {/* Asset Allocation Breakdown */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <span>Asset Allocation Breakdown</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {portfolio.breakdown.length} Assets Held
          </span>
        </div>

        {/* Visual Allocation Bar */}
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
          {portfolio.breakdown.map((item) => (
            <div
              key={item.symbol}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              title={`${item.name} (${item.symbol}): ${item.percentage}%`}
              className="h-full transition-all duration-300 hover:opacity-80"
            />
          ))}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2 font-mono text-xs">
          {portfolio.breakdown.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div className="overflow-hidden">
                <span className="font-bold text-slate-200 block truncate">{item.symbol}</span>
                <span className="text-[11px] text-slate-400">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Holdings List Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Your Holdings</h3>
          <Link to="/markets" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            Explore All Markets →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Asset</th>
                <th className="px-6 py-3 text-right">Balance</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Total Value</th>
                <th className="px-6 py-3 text-right">Avg Buy Price</th>
                <th className="px-6 py-3 text-right">Unrealized PnL</th>
                <th className="px-6 py-3 text-center">Trade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans">
              {portfolio.breakdown.map((item) => {
                const isItemPnlPos = (item.unrealizedPnLUSD || 0) >= 0;
                const assetPrice = item.symbol === 'USD' ? 1.0 : (assets[item.symbol]?.price || 0);

                return (
                  <tr key={item.symbol} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <span className="font-bold text-white text-sm block">{item.name}</span>
                          <span className="text-slate-400 text-xs font-mono">{item.symbol}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono text-slate-200">
                      {item.symbol === 'USD' ? formatUSD(item.amount) : formatCrypto(item.amount)}
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono text-slate-300">
                      {formatUSD(assetPrice)}
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono font-bold text-white">
                      {formatUSD(item.valueUSD)}
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono text-slate-400">
                      {item.avgBuyPrice ? formatUSD(item.avgBuyPrice) : '—'}
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono">
                      {item.unrealizedPnLUSD !== undefined ? (
                        <span className={isItemPnlPos ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {formatUSD(item.unrealizedPnLUSD)} ({formatPercent(item.unrealizedPnLPercent || 0)})
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5 text-center">
                      {item.symbol !== 'USD' ? (
                        <Link to={`/trade/${item.symbol}/USD`}>
                          <Button size="sm" variant="primary" className="text-xs px-3 py-1">
                            Trade
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/buy">
                          <Button size="sm" variant="secondary" className="text-xs px-3 py-1">
                            Buy Crypto
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Split Grid: Recent Activity & Watchlist / Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Transactions</h3>
            <Link to="/history" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View Full Ledger →
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {tx.type === 'buy' || tx.type === 'deposit' ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    ) : tx.type === 'sell' || tx.type === 'withdrawal' ? (
                      <ArrowUpRight className="w-4 h-4 text-rose-400" />
                    ) : (
                      <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-white font-sans text-xs uppercase block">
                      {tx.type} {tx.asset}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatTimestamp(tx.timestamp, 'short')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-200 block">
                    {formatUSD(tx.totalValueUSD)}
                  </span>
                  <span className="text-[10px] text-emerald-400">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Market Movers & Watchlist Preview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Market Movers (24h)</h3>
            <Link to="/markets" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {marketMovers.map((m) => {
              const isPos = m.change24h >= 0;
              return (
                <Link
                  key={m.symbol}
                  to={`/markets/${m.symbol}`}
                  className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{m.symbol}</span>
                    <Badge variant={isPos ? 'emerald' : 'rose'} size="sm">
                      {formatPercent(m.change24h)}
                    </Badge>
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-200">
                    {formatUSD(m.price)}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Watchlist Strip */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Watchlist Quick Picks
            </span>
            <div className="flex flex-wrap gap-2">
              {watchlist.map((sym) => {
                const asset = assets[sym];
                if (!asset) return null;
                return (
                  <Link
                    key={sym}
                    to={`/trade/${sym}/USD`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white transition-colors"
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{sym}</span>
                    <span className="text-slate-400 font-mono">{formatUSD(asset.price)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
