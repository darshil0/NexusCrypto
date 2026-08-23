import React, { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { useRouter } from '../router/Router';
import { TRADING_PAIRS } from '../data/mockData';
import { formatUSD, formatPercent, formatCompactNumber } from '../utils/formatters';
import { TradingChart } from '../components/trade/TradingChart';
import { OrderBook } from '../components/trade/OrderBook';
import { RecentTrades } from '../components/trade/RecentTrades';
import { OrderForm } from '../components/trade/OrderForm';
import { OrdersTable } from '../components/trade/OrdersTable';
import {
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '../components/ui/BaseComponents';

export const TradePage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { assets, resetDemoData } = useDemo();

  // Pair from route or default
  const rawPair = params.pair ? decodeURIComponent(params.pair) : 'BTC/USD';
  const validPair = TRADING_PAIRS.some((p) => p.pair === rawPair) ? rawPair : 'BTC/USD';

  const [activePair, setActivePair] = useState<string>(validPair);
  const [isPairDropdownOpen, setIsPairDropdownOpen] = useState(false);
  const [selectedBookPrice, setSelectedBookPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (params.pair) {
      const p = decodeURIComponent(params.pair);
      if (TRADING_PAIRS.some((tp) => tp.pair === p)) {
        setActivePair(p);
      }
    }
  }, [params.pair]);

  const [baseSymbol, quoteSymbol] = activePair.split('/');
  const asset = assets[baseSymbol] || assets['BTC'];
  const isPos = asset.change24h >= 0;

  const handleSelectPair = (pair: string) => {
    setActivePair(pair);
    setIsPairDropdownOpen(false);
    navigate(`/trade/${encodeURIComponent(pair)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 select-none">
      {/* Top Trading Pair Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30">
        {/* Pair Selector Dropdown */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsPairDropdownOpen(!isPairDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/60 font-bold text-white text-sm transition-colors"
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${asset.iconBg}`}>
                {baseSymbol.slice(0, 3)}
              </div>
              <span>{activePair}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isPairDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
                {TRADING_PAIRS.map((p) => {
                  const pAsset = assets[p.base];
                  if (!pAsset) return null;
                  const pPos = pAsset.change24h >= 0;
                  return (
                    <div
                      key={p.pair}
                      onClick={() => handleSelectPair(p.pair)}
                      className={`flex items-center justify-between p-3 hover:bg-slate-800/80 cursor-pointer transition-colors text-xs ${
                        activePair === p.pair ? 'bg-indigo-950/40 font-bold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{p.pair}</span>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-slate-200">{formatUSD(pAsset.price)}</div>
                        <div className={pPos ? 'text-emerald-400 text-[10px]' : 'text-rose-400 text-[10px]'}>
                          {formatPercent(pAsset.change24h)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Ticker Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs overflow-x-auto">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">MARKET PRICE</span>
              <span className={`text-base font-extrabold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatUSD(asset.price, baseSymbol === 'USDC' || baseSymbol === 'XRP' ? 4 : 2)}
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] text-slate-400 block font-sans">24H CHANGE</span>
              <span className={isPos ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {formatPercent(asset.change24h)}
              </span>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] text-slate-400 block font-sans">24H HIGH</span>
              <span className="text-slate-200">{formatUSD(asset.high24h)}</span>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] text-slate-400 block font-sans">24H LOW</span>
              <span className="text-slate-200">{formatUSD(asset.low24h)}</span>
            </div>
            <div className="hidden lg:block">
              <span className="text-[10px] text-slate-400 block font-sans">24H VOLUME ({baseSymbol})</span>
              <span className="text-slate-200">{formatCompactNumber(asset.volume24h)}</span>
            </div>
          </div>
        </div>

        {/* Paper Trade Tag & Reset */}
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
            PAPER EXECUTION
          </Badge>
          <button
            onClick={resetDemoData}
            title="Reset sandbox demo balance"
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Workspace Layout */}
      <div className="flex-1 p-3 sm:p-4 max-w-[1700px] w-full mx-auto space-y-4">
        {/* Top Split: Chart + Order Book + Order Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Chart Area (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
            <TradingChart
              symbol={baseSymbol}
              basePrice={asset.price}
              change24h={asset.change24h}
              height={460}
            />
          </div>

          {/* Order Book & Recent Trades (2.5 Cols) */}
          <div className="lg:col-span-2 grid grid-rows-2 gap-4 h-[530px]">
            <OrderBook
              currentPrice={asset.price}
              baseAsset={baseSymbol}
              quoteAsset={quoteSymbol}
              onSelectPrice={(price) => setSelectedBookPrice(price)}
            />
            <RecentTrades currentPrice={asset.price} baseAsset={baseSymbol} />
          </div>

          {/* Order Entry Form (2.5 Cols) */}
          <div className="lg:col-span-3">
            <OrderForm pair={activePair} externalPrice={selectedBookPrice} />
          </div>
        </div>

        {/* Bottom Open & Historical Orders Table */}
        <OrdersTable />
      </div>
    </div>
  );
};
