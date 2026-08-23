import React, { useState, useMemo } from 'react';
import { useDemo } from '../context/DemoContext';
import { Link } from '../router/Router';
import { formatUSD, formatPercent, formatCompactNumber } from '../utils/formatters';
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';

export const MarketsPage: React.FC = () => {
  const { assets, watchlist, toggleWatchlist } = useDemo();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<'rank' | 'price' | 'change24h' | 'volume24h' | 'marketCap'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const categories = ['All', 'Large Cap', 'Layer 1', 'DeFi', 'Stablecoin', 'Top Gainers', 'Top Losers', 'Watchlist'];

  const filteredAssets = useMemo(() => {
    return Object.values(assets).filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'All') return true;
      if (activeCategory === 'Watchlist') return watchlist.includes(asset.symbol);
      if (activeCategory === 'Top Gainers') return asset.change24h > 0;
      if (activeCategory === 'Top Losers') return asset.change24h < 0;
      return asset.category === activeCategory;
    }).sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;

      if (sortField === 'rank') {
        // Rank ascending is natural (1, 2, 3...)
        return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [assets, search, activeCategory, watchlist, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 select-none">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Cryptocurrency Markets</h1>
            <Badge variant="indigo">Simulated Quotes</Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time simulated market data, sparklines, and paper trading shortcuts.
          </p>
        </div>

        {/* Market Global Stats Bar */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px]">TOTAL SIM. MCAP</span>
            <span className="font-bold text-white">$2.45 Trillion</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 block text-[10px]">24H SIM. VOL</span>
            <span className="font-bold text-white">$68.2 Billion</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 block text-[10px]">BTC DOMINANCE</span>
            <span className="font-bold text-emerald-400">54.6%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'Watchlist' && <Star className="w-3 h-3 inline mr-1 text-amber-400 fill-amber-400" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search crypto or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Markets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="w-10 px-4 py-3 text-center">★</th>
                <th
                  onClick={() => handleSort('rank')}
                  className="px-4 py-3 cursor-pointer hover:text-white"
                >
                  <span className="flex items-center gap-1">
                    # <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="px-4 py-3">Asset</th>
                <th
                  onClick={() => handleSort('price')}
                  className="px-4 py-3 text-right cursor-pointer hover:text-white"
                >
                  <span className="flex items-center justify-end gap-1">
                    Price <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('change24h')}
                  className="px-4 py-3 text-right cursor-pointer hover:text-white"
                >
                  <span className="flex items-center justify-end gap-1">
                    24h Change <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('volume24h')}
                  className="px-4 py-3 text-right cursor-pointer hover:text-white hidden md:table-cell"
                >
                  <span className="flex items-center justify-end gap-1">
                    24h Volume <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('marketCap')}
                  className="px-4 py-3 text-right cursor-pointer hover:text-white hidden lg:table-cell"
                >
                  <span className="flex items-center justify-end gap-1">
                    Market Cap <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-center hidden sm:table-cell">Last 24h Trend</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-sans">
                    No matching crypto assets found for &ldquo;{search}&rdquo; in {activeCategory}.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isWatched = watchlist.includes(asset.symbol);
                  const isPos = asset.change24h >= 0;

                  // Mini SVG Sparkline
                  const minP = Math.min(...asset.sparkline);
                  const maxP = Math.max(...asset.sparkline);
                  const range = maxP - minP || 1;
                  const sparkW = 80;
                  const sparkH = 26;
                  const points = asset.sparkline
                    .map((p, i) => {
                      const x = (i / (asset.sparkline.length - 1)) * sparkW;
                      const y = sparkH - ((p - minP) / range) * sparkH;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' ');

                  return (
                    <tr
                      key={asset.symbol}
                      className="hover:bg-slate-800/40 transition-colors font-mono"
                    >
                      {/* Watchlist Star */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleWatchlist(asset.symbol)}
                          className="text-slate-500 hover:text-amber-400 p-1"
                          aria-label={`Toggle watchlist for ${asset.symbol}`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isWatched ? 'text-amber-400 fill-amber-400' : ''
                            }`}
                          />
                        </button>
                      </td>

                      {/* Rank */}
                      <td className="px-4 py-3 text-slate-400 font-semibold">{asset.rank}</td>

                      {/* Asset Symbol & Name */}
                      <td className="px-4 py-3 font-sans">
                        <Link
                          to={`/markets/${asset.symbol}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${asset.iconBg}`}>
                            {asset.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-indigo-400 transition-colors block">
                              {asset.name}
                            </span>
                            <span className="text-slate-400 text-[11px] font-mono">
                              {asset.symbol} • {asset.category}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right font-bold text-slate-100 text-sm">
                        {formatUSD(asset.price, asset.symbol === 'USDC' || asset.symbol === 'XRP' ? 4 : 2)}
                      </td>

                      {/* 24h Change */}
                      <td className="px-4 py-3 text-right">
                        <Badge variant={isPos ? 'emerald' : 'rose'}>
                          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatPercent(asset.change24h)}
                        </Badge>
                      </td>

                      {/* 24h Volume */}
                      <td className="px-4 py-3 text-right text-slate-300 hidden md:table-cell">
                        {formatCompactNumber(asset.volume24h)}
                      </td>

                      {/* Market Cap */}
                      <td className="px-4 py-3 text-right text-slate-300 hidden lg:table-cell">
                        {formatCompactNumber(asset.marketCap)}
                      </td>

                      {/* Mini Sparkline */}
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <div className="flex justify-center">
                          <svg width={sparkW} height={sparkH} className="overflow-visible">
                            <polyline
                              fill="none"
                              stroke={isPos ? '#10B981' : '#F43F5E'}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={points}
                            />
                          </svg>
                        </div>
                      </td>

                      {/* Action CTA */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/trade/${asset.symbol}/USD`}>
                            <Button size="sm" variant="primary" className="text-xs px-2.5 py-1">
                              Trade
                            </Button>
                          </Link>
                          <Link to={`/markets/${asset.symbol}`}>
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1 hidden sm:inline-flex">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
