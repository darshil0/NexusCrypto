import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { useRouter, Link } from '../router/Router';
import { formatUSD, formatPercent, formatCompactNumber, formatCrypto } from '../utils/formatters';
import { TradingChart } from '../components/trade/TradingChart';
import { OrderForm } from '../components/trade/OrderForm';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Activity,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  Info,
  Clock,
  ShieldAlert,
  ArrowRightLeft,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';

export const AssetDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { assets, watchlist, toggleWatchlist, balances } = useDemo();

  const symbol = (params.symbol || 'BTC').toUpperCase();
  const asset = assets[symbol] || assets['BTC'];

  const [activeTab, setActiveTab] = useState<'chart' | 'trade' | 'convert'>('chart');

  const isWatched = watchlist.includes(asset.symbol);
  const isPos = asset.change24h >= 0;

  const currentHoldings = balances[asset.symbol]?.amount || 0;
  const holdingsValueUSD = currentHoldings * asset.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/markets')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Back to markets"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${asset.iconBg}`}>
              {asset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{asset.name}</h1>
                <span className="text-sm font-mono text-slate-400 font-bold">{asset.symbol}</span>
                <Badge variant="indigo">Rank #{asset.rank}</Badge>
              </div>
              <span className="text-xs text-slate-400">{asset.category} • {asset.consensus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWatchlist(asset.symbol)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              isWatched
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isWatched ? 'fill-amber-400' : ''}`} />
            <span>{isWatched ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>

          <Link to={`/trade/${asset.symbol}/USD`}>
            <Button size="md" variant="primary" className="font-bold">
              <Activity className="w-4 h-4 mr-1.5" /> Paper Terminal
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Price Card + Interactive Chart + Quick Trade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Price Card & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price & High/Low Overview Card */}
          <Card className="p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
              <div>
                <span className="text-xs text-slate-400 block font-mono">SIMULATED SPOT PRICE</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatUSD(asset.price, asset.symbol === 'USDC' || asset.symbol === 'XRP' ? 4 : 2)}
                  </span>
                  <Badge variant={isPos ? 'emerald' : 'rose'} size="md">
                    {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {formatPercent(asset.change24h)} (24h)
                  </Badge>
                </div>
              </div>

              {/* 24h High / Low Meter */}
              <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Low: {formatUSD(asset.low24h)}</span>
                  <span>High: {formatUSD(asset.high24h)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((asset.price - asset.low24h) / (asset.high24h - asset.low24h || 1)) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Candlestick / Line Chart */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <TradingChart symbol={asset.symbol} basePrice={asset.price} change24h={asset.change24h} height={400} />
            </div>
          </Card>

          {/* Market Statistics Grid */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Market Statistics (Simulated)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">MARKET CAP</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {formatCompactNumber(asset.marketCap)}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">24H VOLUME</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {formatCompactNumber(asset.volume24h)}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">CIRCULATING SUPPLY</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {formatCompactNumber(asset.circulatingSupply)} {asset.symbol}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">ALL-TIME HIGH</span>
                <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                  {formatUSD(asset.allTimeHigh)}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">MAX SUPPLY</span>
                <span className="font-bold text-slate-300 text-sm mt-0.5 block">
                  {asset.maxSupply ? `${formatCompactNumber(asset.maxSupply)} ${asset.symbol}` : 'No Max Limit'}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">LAUNCH YEAR</span>
                <span className="font-bold text-slate-300 text-sm mt-0.5 block">
                  {asset.launchYear}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 col-span-2">
                <span className="text-slate-500 block text-[11px]">CONSENSUS / NETWORK</span>
                <span className="font-bold text-indigo-400 text-sm mt-0.5 block">
                  {asset.consensus}
                </span>
              </div>
            </div>
          </Card>

          {/* About Asset & Network Details */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white">About {asset.name}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{asset.description}</p>
            <div className="pt-2 flex flex-wrap gap-3 text-xs">
              <Link to="/learn/what-is-bitcoin" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Learn how {asset.name} works →
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Col: Quick Order Widget & User Position */}
        <div className="space-y-6">
          {/* User Holdings Card for this asset */}
          <Card className="p-5 bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Demo Holdings</span>
              <Badge variant={currentHoldings > 0 ? 'emerald' : 'slate'}>
                {currentHoldings > 0 ? 'Active Position' : 'No Balance'}
              </Badge>
            </div>
            <div className="font-mono">
              <span className="text-2xl font-bold text-white block">
                {formatCrypto(currentHoldings)} {asset.symbol}
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                ≈ {formatUSD(holdingsValueUSD)}
              </span>
            </div>
          </Card>

          {/* Quick Order Form */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Quick Paper Order</span>
            </h3>
            <OrderForm pair={`${asset.symbol}/USD`} />
          </div>

          {/* Risk Disclosure Box */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-200">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Educational Sandbox Mode</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Quotes, order executions, and profit/loss values on this page are deterministic simulations. No real financial risk exists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
