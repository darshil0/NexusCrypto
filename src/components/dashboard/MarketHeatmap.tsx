import React, { useState, useMemo } from 'react';
import type { CryptoAsset } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { formatUSD, formatPercent, formatCompactNumber } from '../../utils/formatters';
import { useRouter } from '../../router/Router';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Flame,
  Layers,
  LayoutGrid,
  ArrowUpDown,
} from 'lucide-react';

type ViewMode = 'weighted' | 'grid';
type SortOption = 'marketCap' | 'performance' | 'volume' | 'name';
type CategoryFilter = 'All' | 'Layer 1' | 'DeFi' | 'Stablecoin';

interface HeatmapColorStyle {
  bgClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
  badgeClass: string;
  hexColor: string;
}

/**
 * Returns dynamic styling classes based on 24h percentage change.
 */
function getHeatmapColorStyle(change24h: number): HeatmapColorStyle {
  if (change24h >= 5.0) {
    return {
      bgClass: 'bg-emerald-600/90 hover:bg-emerald-600 text-white',
      borderClass: 'border-emerald-400/60',
      textClass: 'text-white',
      glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      badgeClass: 'bg-emerald-950/80 text-emerald-200 border-emerald-400/40',
      hexColor: '#10B981',
    };
  }
  if (change24h >= 2.5) {
    return {
      bgClass: 'bg-emerald-700/80 hover:bg-emerald-700/90 text-emerald-50',
      borderClass: 'border-emerald-500/50',
      textClass: 'text-emerald-100',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
      hexColor: '#059669',
    };
  }
  if (change24h >= 0.5) {
    return {
      bgClass: 'bg-emerald-900/60 hover:bg-emerald-900/75 text-emerald-100',
      borderClass: 'border-emerald-600/40',
      textClass: 'text-emerald-200',
      glowClass: 'shadow-[0_0_10px_rgba(16,185,129,0.1)]',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-600/30',
      hexColor: '#047857',
    };
  }
  if (change24h > 0) {
    return {
      bgClass: 'bg-emerald-950/70 hover:bg-emerald-950/85 text-emerald-200',
      borderClass: 'border-emerald-700/35',
      textClass: 'text-emerald-300',
      glowClass: '',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/40',
      hexColor: '#064e3b',
    };
  }
  if (change24h === 0) {
    return {
      bgClass: 'bg-[#161A1E] hover:bg-[#1C2127] text-gray-300',
      borderClass: 'border-gray-800',
      textClass: 'text-gray-300',
      glowClass: '',
      badgeClass: 'bg-gray-800 text-gray-300 border-gray-700',
      hexColor: '#1F242B',
    };
  }
  if (change24h >= -0.5) {
    return {
      bgClass: 'bg-red-950/70 hover:bg-red-950/85 text-red-200',
      borderClass: 'border-red-700/35',
      textClass: 'text-red-300',
      glowClass: '',
      badgeClass: 'bg-red-950/80 text-red-300 border-red-700/40',
      hexColor: '#7f1d1d',
    };
  }
  if (change24h >= -2.5) {
    return {
      bgClass: 'bg-red-900/60 hover:bg-red-900/75 text-red-100',
      borderClass: 'border-red-600/40',
      textClass: 'text-red-200',
      glowClass: 'shadow-[0_0_10px_rgba(239,68,68,0.1)]',
      badgeClass: 'bg-red-950/60 text-red-300 border-red-600/30',
      hexColor: '#b91c1c',
    };
  }
  if (change24h >= -5.0) {
    return {
      bgClass: 'bg-red-700/80 hover:bg-red-700/90 text-red-50',
      borderClass: 'border-red-500/50',
      textClass: 'text-red-100',
      glowClass: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
      badgeClass: 'bg-red-950/70 text-red-300 border-red-500/40',
      hexColor: '#dc2626',
    };
  }
  return {
    bgClass: 'bg-red-600/90 hover:bg-red-600 text-white',
    borderClass: 'border-red-400/60',
    textClass: 'text-white',
    glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    badgeClass: 'bg-red-950/80 text-red-200 border-red-400/40',
    hexColor: '#ef4444',
  };
}

export const MarketHeatmap: React.FC = () => {
  const { assets, setActivePair } = useDemo();
  const { navigate } = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('weighted');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('marketCap');
  const [, setHoveredSymbol] = useState<string | null>(null);

  // Convert assets record to array and filter/sort
  const assetList: CryptoAsset[] = useMemo(() => {
    return Object.values(assets);
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assetList
      .filter((asset) => {
        if (selectedCategory === 'All') return true;
        return asset.category === selectedCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'marketCap') {
          return b.marketCap - a.marketCap;
        }
        if (sortBy === 'performance') {
          return b.change24h - a.change24h;
        }
        if (sortBy === 'volume') {
          return b.volume24h - a.volume24h;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [assetList, selectedCategory, sortBy]);

  // Market overview statistics
  const stats = useMemo(() => {
    let gainers = 0;
    let losers = 0;
    let totalChange = 0;
    let topGainer: CryptoAsset | undefined = undefined;
    let topLoser: CryptoAsset | undefined = undefined;

    assetList.forEach((asset) => {
      totalChange += asset.change24h;
      if (asset.change24h >= 0) gainers++;
      else losers++;

      if (!topGainer || asset.change24h > topGainer.change24h) {
        topGainer = asset;
      }
      if (!topLoser || asset.change24h < topLoser.change24h) {
        topLoser = asset;
      }
    });

    const avgChange = assetList.length > 0 ? totalChange / assetList.length : 0;

    return { gainers, losers, avgChange, topGainer, topLoser };
  }, [assetList]);

  const handleTileClick = (asset: CryptoAsset) => {
    setActivePair(`${asset.symbol}/USD`);
    navigate(`/trade/${asset.symbol}/USD`);
  };

  const handleDetailsClick = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    navigate(`/markets/${symbol}`);
  };

  return (
    <div className="bg-[#161A1E] border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-5 select-none shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">Market Heatmap</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  REAL-TIME SIM
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Live color-scaled visualization of 24h market momentum across core crypto assets.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Category Filter */}
          <div className="flex items-center bg-[#0B0E11] p-1 rounded-xl border border-gray-800">
            {(['All', 'Layer 1', 'DeFi', 'Stablecoin'] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors text-[11px] ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#0B0E11] p-1 rounded-xl border border-gray-800">
            <button
              type="button"
              onClick={() => setViewMode('weighted')}
              title="Market-Cap Weighted Layout"
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                viewMode === 'weighted'
                  ? 'bg-gray-800 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Weighted</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Uniform Multi-Column Grid"
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-gray-800 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Grid</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-[#0B0E11] px-2.5 py-1.5 rounded-xl border border-gray-800 text-gray-300">
            <ArrowUpDown className="w-3 h-3 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort assets by"
              className="bg-transparent text-xs text-gray-200 outline-none cursor-pointer pr-1"
            >
              <option value="marketCap" className="bg-gray-900 text-white">Market Cap</option>
              <option value="performance" className="bg-gray-900 text-white">24h Gain</option>
              <option value="volume" className="bg-gray-900 text-white">24h Volume</option>
              <option value="name" className="bg-gray-900 text-white">Asset Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Momentum Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-[#0B0E11] border border-gray-800/80 flex items-center justify-between">
          <span className="text-gray-400 font-sans text-[11px]">Market Breadth:</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-green-400">{stats.gainers} ▲</span>
            <span className="text-gray-600">/</span>
            <span className="text-red-400">{stats.losers} ▼</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0B0E11] border border-gray-800/80 flex items-center justify-between">
          <span className="text-gray-400 font-sans text-[11px]">Avg 24h Change:</span>
          <span className={`font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercent(stats.avgChange)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0B0E11] border border-gray-800/80 flex items-center justify-between">
          <span className="text-gray-400 font-sans text-[11px]">Top Gainer:</span>
          {stats.topGainer ? (
            <span className="text-green-400 font-bold">
              {(stats.topGainer as CryptoAsset).symbol} +{(stats.topGainer as CryptoAsset).change24h.toFixed(2)}%
            </span>
          ) : (
            <span className="text-gray-500">—</span>
          )}
        </div>

        <div className="p-2.5 rounded-xl bg-[#0B0E11] border border-gray-800/80 flex items-center justify-between">
          <span className="text-gray-400 font-sans text-[11px]">Top Loser:</span>
          {stats.topLoser ? (
            <span className="text-red-400 font-bold">
              {(stats.topLoser as CryptoAsset).symbol} {(stats.topLoser as CryptoAsset).change24h.toFixed(2)}%
            </span>
          ) : (
            <span className="text-gray-500">—</span>
          )}
        </div>
      </div>

      {/* Heatmap Grid Rendering */}
      {viewMode === 'weighted' ? (
        /* Weighted Bento Treemap Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-[140px]">
          {filteredAssets.map((asset) => {
            const style = getHeatmapColorStyle(asset.change24h);
            const isPositive = asset.change24h >= 0;

            // Give BTC and ETH larger spans, SOL medium, others compact
            let colSpan = 'col-span-1';
            let rowSpan = 'row-span-1';

            if (asset.symbol === 'BTC') {
              colSpan = 'sm:col-span-2 lg:col-span-3';
              rowSpan = 'row-span-2';
            } else if (asset.symbol === 'ETH') {
              colSpan = 'sm:col-span-2 lg:col-span-3';
              rowSpan = 'row-span-2';
            } else if (asset.symbol === 'SOL' || asset.symbol === 'XRP') {
              colSpan = 'sm:col-span-1 lg:col-span-2';
              rowSpan = 'row-span-1';
            }

            return (
              <div
                key={asset.symbol}
                onClick={() => handleTileClick(asset)}
                onMouseEnter={() => setHoveredSymbol(asset.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border flex flex-col justify-between overflow-hidden ${style.bgClass} ${style.borderClass} ${style.glowClass} ${colSpan} ${rowSpan}`}
              >
                {/* Background Sparkline Silhouette */}
                {asset.sparkline && asset.sparkline.length > 0 && (
                  <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path
                        d={generateSparklinePath(asset.sparkline, 100, 40)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                )}

                {/* Top Row: Symbol, Name & Category */}
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-sm"
                      style={{ backgroundColor: asset.color }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] opacity-75 font-medium hidden sm:inline">
                          {asset.category}
                        </span>
                      </div>
                      <span className="text-[11px] opacity-80 font-sans block truncate max-w-[110px]">
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDetailsClick(e, asset.symbol)}
                    title="View Market Details"
                    className="p-1 rounded-md opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-black/60 text-white transition-opacity"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Middle/Bottom: Price & 24h Change */}
                <div className="relative z-10 mt-auto pt-2 flex items-end justify-between gap-2">
                  <div>
                    <div className="text-base sm:text-xl font-extrabold font-mono text-white tracking-tight leading-tight">
                      {formatUSD(asset.price, asset.symbol === 'USDC' || asset.symbol === 'XRP' ? 4 : 2)}
                    </div>
                    <div className="text-[11px] opacity-75 font-mono mt-0.5">
                      Vol: ${formatCompactNumber(asset.volume24h)}
                    </div>
                  </div>

                  <div className={`px-2 py-1 rounded-lg border font-mono font-extrabold text-xs flex items-center gap-1 ${style.badgeClass}`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 shrink-0" />
                    ) : (
                      <TrendingDown className="w-3 h-3 shrink-0" />
                    )}
                    <span>{formatPercent(asset.change24h)}</span>
                  </div>
                </div>

                {/* Hover CTA Bar */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            );
          })}
        </div>
      ) : (
        /* Uniform Grid Layout */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredAssets.map((asset) => {
            const style = getHeatmapColorStyle(asset.change24h);
            const isPositive = asset.change24h >= 0;

            return (
              <div
                key={asset.symbol}
                onClick={() => handleTileClick(asset)}
                onMouseEnter={() => setHoveredSymbol(asset.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border flex flex-col justify-between min-h-[140px] overflow-hidden ${style.bgClass} ${style.borderClass} ${style.glowClass}`}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-white text-[11px] shrink-0 shadow-sm"
                      style={{ backgroundColor: asset.color }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-extrabold text-sm text-white block truncate">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] opacity-75 font-sans block truncate">
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDetailsClick(e, asset.symbol)}
                    title="View Market Details"
                    className="p-1 rounded-md opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-black/60 text-white transition-opacity"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Bottom Row */}
                <div className="mt-3 pt-2 border-t border-white/10">
                  <div className="text-sm sm:text-base font-extrabold font-mono text-white truncate">
                    {formatUSD(asset.price, asset.symbol === 'USDC' || asset.symbol === 'XRP' ? 4 : 2)}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                    <span className="opacity-75">24h</span>
                    <span className="font-bold flex items-center gap-0.5">
                      {isPositive ? '▲' : '▼'} {formatPercent(asset.change24h)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Heatmap Color Legend Scale Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-mono text-gray-400 border-t border-gray-800/80">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 font-sans">24h Momentum Scale:</span>
          <div className="flex items-center gap-1">
            <span className="text-red-400 font-semibold text-[10px]">-5%+</span>
            <div className="w-28 sm:w-36 h-2 rounded-full bg-gradient-to-r from-red-600 via-gray-800 to-emerald-500 border border-gray-700/60" />
            <span className="text-green-400 font-semibold text-[10px]">+5%+</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-gray-500 hidden sm:inline">Click tile to Paper Trade</span>
          <span className="text-indigo-400 cursor-pointer hover:underline" onClick={() => navigate('/markets')}>
            All 10 Core Assets →
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper to construct an SVG sparkline path from price array
 */
function generateSparklinePath(points: number[], width: number, height: number): string {
  if (!points || points.length < 2) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}
