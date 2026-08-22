import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { Link } from '../router/Router';
import { formatUSD, formatPercent, formatTimestamp } from '../utils/formatters';
import {
  Star,
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';
import { InlineFieldError } from '../components/feedback/inline-field-error';
import { AppErrorAlert } from '../components/feedback/app-error-alert';
import { validatePositiveNumber } from '../lib/errors/validation';

export const WatchlistAlertsPage: React.FC = () => {
  const { assets, watchlist, toggleWatchlist, alerts, createAlert, deleteAlert } = useDemo();

  // New alert form state
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [note, setNote] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    setGeneralError(null);

    const validNum = validatePositiveNumber(targetPrice, 'Target price', 0.0001, 10000000);
    if (!validNum.isValid) {
      setFieldError(validNum.errorMessage || 'Invalid target price');
      return;
    }

    const priceNum = parseFloat(targetPrice);
    const res = createAlert(selectedSymbol as any, condition, priceNum, note);
    if (res && !res.success) {
      setGeneralError(res.error || 'Failed to create alert');
      return;
    }

    setTargetPrice('');
    setNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Watchlist & Price Alerts</h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor favored digital assets and configure simulated price triggers in local state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Watchlist Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Your Active Watchlist ({watchlist.length})</span>
              </h3>
              <Link to="/markets" className="text-xs text-indigo-400 hover:underline">
                + Add More Assets
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-center">Fav</th>
                    <th className="px-4 py-3">Asset</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">24h Change</th>
                    <th className="px-4 py-3 text-center">Trade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-sans">
                  {watchlist.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No assets in watchlist. Click the star icon on any asset in the Markets page!
                      </td>
                    </tr>
                  ) : (
                    watchlist.map((sym) => {
                      const asset = assets[sym];
                      if (!asset) return null;
                      const isPos = asset.change24h >= 0;

                      return (
                        <tr key={sym} className="hover:bg-slate-800/40 transition-colors font-mono">
                          <td className="px-4 py-3.5 text-center">
                            <button
                              onClick={() => toggleWatchlist(sym)}
                              className="text-amber-400 hover:text-slate-400"
                            >
                              <Star className="w-4 h-4 fill-amber-400" />
                            </button>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{asset.name}</span>
                              <span className="text-slate-400 text-xs">{sym}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold text-slate-100">
                            {formatUSD(asset.price, sym === 'USDC' || sym === 'XRP' ? 4 : 2)}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <Badge variant={isPos ? 'emerald' : 'rose'}>
                              {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {formatPercent(asset.change24h)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Link to={`/trade/${sym}/USD`}>
                              <Button size="sm" variant="primary" className="text-xs px-2.5 py-1">
                                Trade
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Active Alerts List */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span>Configured Price Alerts ({alerts.length})</span>
            </h3>

            {alerts.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No active price alerts. Use the form on the right to set up notifications.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {alerts.map((al) => {
                  const currPrice = assets[al.symbol]?.price || 0;
                  const isMet =
                    al.condition === 'above'
                      ? currPrice >= al.targetValue
                      : currPrice <= al.targetValue;

                  return (
                    <div
                      key={al.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isMet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-400'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-sans font-bold text-white">
                            <span>{al.symbol}</span>
                            <span className="text-slate-400 text-xs font-mono font-normal">
                              {al.condition.toUpperCase()} {formatUSD(al.targetValue)}
                            </span>
                            {isMet && <Badge variant="emerald" size="sm">Triggered</Badge>}
                          </div>
                          {al.note && <p className="text-slate-500 text-[11px] font-sans mt-0.5">{al.note}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Current Price</span>
                          <span className="font-bold text-slate-200">{formatUSD(currPrice)}</span>
                        </div>
                        <button
                          onClick={() => deleteAlert(al.id)}
                          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Create Alert Form */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Create Price Trigger</span>
            </h3>

            {generalError && (
              <AppErrorAlert
                error={generalError}
                onDismiss={() => setGeneralError(null)}
                className="my-2"
              />
            )}

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs font-sans" noValidate>
              <div>
                <label htmlFor="alert-asset-select" className="text-slate-400 block mb-1">Asset</label>
                <select
                  id="alert-asset-select"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
                >
                  {Object.keys(assets).map((sym) => (
                    <option key={sym} value={sym}>
                      {assets[sym].name} ({sym}) - {formatUSD(assets[sym].price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Trigger Condition</span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="Trigger Condition">
                  <button
                    type="button"
                    onClick={() => setCondition('above')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      condition === 'above'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Price Rises Above
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('below')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      condition === 'below'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Price Falls Below
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="alert-target-price" className="text-slate-400 block mb-1">Target Price (USD)</label>
                <input
                  id="alert-target-price"
                  type="number"
                  step="any"
                  value={targetPrice}
                  onChange={(e) => {
                    setTargetPrice(e.target.value);
                    if (fieldError) setFieldError(null);
                  }}
                  placeholder={`e.g. ${(assets[selectedSymbol]?.price * 1.05 || 1000).toFixed(2)}`}
                  className={`w-full bg-slate-950 border rounded-lg p-2.5 text-white font-mono ${
                    fieldError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-700'
                  }`}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? 'alert-price-error' : undefined}
                />
                <InlineFieldError id="alert-price-error" error={fieldError} />
              </div>

              <div>
                <label htmlFor="alert-note-input" className="text-slate-400 block mb-1">Optional Note / Strategy</label>
                <input
                  id="alert-note-input"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Take profit 50%"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <Button size="md" variant="primary" type="submit" className="w-full font-bold">
                Set Price Alert
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
