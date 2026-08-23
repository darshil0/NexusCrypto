import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { Link } from '../router/Router';
import { formatUSD, formatPercent, formatTimestamp } from '../utils/formatters';
import {
  Star,
  Bell,
  BellRing,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';
import { InlineFieldError } from '../components/feedback/inline-field-error';
import { AppErrorAlert } from '../components/feedback/app-error-alert';
import { validatePositiveNumber } from '../lib/errors/validation';
import { AssetSymbol } from '../types';

export const WatchlistAlertsPage: React.FC = () => {
  const {
    assets,
    watchlist,
    toggleWatchlist,
    alerts,
    createAlert,
    deleteAlert,
    rearmAlert,
    clearTriggeredAlerts,
    clearAllAlerts,
    testTriggerAlert,
    simulatePriceMovement,
  } = useDemo();

  // Alert creation state
  const [selectedSymbol, setSelectedSymbol] = useState<AssetSymbol>('BTC');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [note, setNote] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Filter state
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'triggered'>('all');

  // Manual simulator state
  const [simSymbol, setSimSymbol] = useState<AssetSymbol>('BTC');

  const currentAsset = assets[selectedSymbol];
  const currentSimAsset = assets[simSymbol];

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
    const res = createAlert(selectedSymbol, condition, priceNum, note);
    if (res && !res.success) {
      setGeneralError(res.error || 'Failed to create alert');
      return;
    }

    setTargetPrice('');
    setNote('');
  };

  const applyPresetPercentage = (pct: number) => {
    if (!currentAsset) return;
    const calculatedPrice = currentAsset.price * (1 + pct / 100);
    const precision = selectedSymbol === 'USDC' || selectedSymbol === 'XRP' ? 4 : 2;
    setTargetPrice(calculatedPrice.toFixed(precision));
    setCondition(pct >= 0 ? 'above' : 'below');
    if (fieldError) setFieldError(null);
  };

  const handleSimulateMove = (multiplier: number) => {
    if (!currentSimAsset) return;
    const newPrice = currentSimAsset.price * multiplier;
    simulatePriceMovement(simSymbol, newPrice);
  };

  const triggeredAlerts = alerts.filter((a) => a.triggered);
  const activeAlerts = alerts.filter((a) => !a.triggered);

  const displayedAlerts = alerts.filter((a) => {
    if (filterTab === 'active') return !a.triggered;
    if (filterTab === 'triggered') return a.triggered;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Watchlist & Price Alerts</h1>
            {triggeredAlerts.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold animate-pulse flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5" />
                <span>{triggeredAlerts.length} Triggered in Header</span>
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Persist target price triggers in <code className="text-indigo-400 font-mono">localStorage</code>.
            When simulated market ticks cross a target, the visual indicator in the top navbar activates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {triggeredAlerts.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearTriggeredAlerts}
              className="text-xs text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
            >
              Clear Triggered ({triggeredAlerts.length})
            </Button>
          )}
          {alerts.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAllAlerts}
              className="text-xs text-slate-400 hover:text-rose-400"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Watchlist Table & Configured Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Watchlist Table */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Favorite Watchlist ({watchlist.length})</span>
              </h3>
              <Link to="/markets" className="text-xs text-indigo-400 hover:underline">
                + Browse All Markets
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
                    <th className="px-4 py-3 text-center">Quick Alert</th>
                    <th className="px-4 py-3 text-center">Trade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-sans">
                  {watchlist.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
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
                              className="text-amber-400 hover:text-slate-400 transition-colors"
                              title="Toggle favorite"
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
                            <button
                              onClick={() => {
                                setSelectedSymbol(sym as AssetSymbol);
                                const estPrice = (asset.price * 1.05).toFixed(
                                  sym === 'USDC' || sym === 'XRP' ? 4 : 2
                                );
                                setTargetPrice(estPrice);
                                setCondition('above');
                              }}
                              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-sans transition-colors"
                            >
                              + Alert
                            </button>
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

          {/* Configured Alerts Manager */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <span>Configured Price Alerts ({alerts.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time distance tracking and instant re-arm controls
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterTab === 'all'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({alerts.length})
                </button>
                <button
                  onClick={() => setFilterTab('active')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterTab === 'active'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Active ({activeAlerts.length})
                </button>
                <button
                  onClick={() => setFilterTab('triggered')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterTab === 'triggered'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Triggered ({triggeredAlerts.length})
                </button>
              </div>
            </div>

            {displayedAlerts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>No {filterTab !== 'all' ? filterTab : ''} price alerts found.</p>
                <p className="mt-1 text-slate-600">
                  Use the trigger creation form on the right to set new price thresholds.
                </p>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {displayedAlerts.map((al) => {
                  const currPrice = assets[al.symbol]?.price || 0;
                  const isMet = al.triggered;
                  const distancePct =
                    currPrice > 0
                      ? (((al.targetValue - currPrice) / currPrice) * 100).toFixed(2)
                      : '0.00';
                  const distanceNum = parseFloat(distancePct);

                  return (
                    <div
                      key={al.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isMet
                          ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2.5 rounded-lg shrink-0 ${
                              isMet
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {isMet ? (
                              <BellRing className="w-5 h-5 animate-pulse" />
                            ) : (
                              <Bell className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 font-sans font-bold text-white flex-wrap">
                              <span className="text-sm">{al.symbol}</span>
                              <Badge variant={al.condition === 'above' ? 'emerald' : 'rose'} size="sm">
                                {al.condition === 'above' ? '≥ RISES ABOVE' : '≤ FALLS BELOW'}
                              </Badge>
                              <span className="font-mono text-slate-200 text-sm">
                                {formatUSD(
                                  al.targetValue,
                                  al.symbol === 'USDC' || al.symbol === 'XRP' ? 4 : 2
                                )}
                              </span>
                              {isMet ? (
                                <Badge variant="amber" size="sm">
                                  TRIGGERED
                                </Badge>
                              ) : (
                                <Badge variant="slate" size="sm">
                                  Active Watch
                                </Badge>
                              )}
                            </div>

                            {/* Live Distance or Trigger info */}
                            <div className="mt-1 flex items-center gap-3 text-[11px] font-sans text-slate-400 flex-wrap">
                              <span>
                                Current Spot:{' '}
                                <strong className="text-slate-200 font-mono">
                                  {formatUSD(
                                    currPrice,
                                    al.symbol === 'USDC' || al.symbol === 'XRP' ? 4 : 2
                                  )}
                                </strong>
                              </span>

                              {!isMet ? (
                                <span
                                  className={`font-mono ${
                                    distanceNum > 0 ? 'text-indigo-400' : 'text-rose-400'
                                  }`}
                                >
                                  ({distanceNum > 0 ? `+${distanceNum}%` : `${distanceNum}%`} to target)
                                </span>
                              ) : (
                                al.triggeredAt && (
                                  <span className="text-amber-300 font-mono">
                                    Triggered at {formatTimestamp(al.triggeredAt, 'time')}
                                  </span>
                                )
                              )}
                            </div>

                            {al.note && (
                              <p className="text-slate-400 text-[11px] font-sans mt-1 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60 inline-block">
                                Note: {al.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center font-sans">
                          {isMet ? (
                            <button
                              onClick={() => rearmAlert(al.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              title="Re-arm alert to continue monitoring live prices"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Re-arm</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => testTriggerAlert(al.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              title="Simulate price crossing target to test notification"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              <span>Simulate Trigger</span>
                            </button>
                          )}

                          <Link to={`/trade/${al.symbol}/USD`}>
                            <button className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors">
                              <span>Trade</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </Link>

                          <button
                            onClick={() => deleteAlert(al.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete alert"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Create Alert Form & Market Simulator */}
        <div className="space-y-6">
          {/* Create Alert Form Card */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create Price Trigger</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved instantly to your local browser storage
              </p>
            </div>

            {generalError && (
              <AppErrorAlert
                error={generalError}
                onDismiss={() => setGeneralError(null)}
                className="my-2"
              />
            )}

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs font-sans" noValidate>
              <div>
                <label htmlFor="alert-asset-select" className="text-slate-400 block mb-1 font-medium">
                  Asset
                </label>
                <select
                  id="alert-asset-select"
                  value={selectedSymbol}
                  onChange={(e) => {
                    setSelectedSymbol(e.target.value as AssetSymbol);
                    setTargetPrice('');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
                >
                  {Object.keys(assets).map((sym) => (
                    <option key={sym} value={sym}>
                      {assets[sym].name} ({sym}) -{' '}
                      {formatUSD(assets[sym].price, sym === 'USDC' || sym === 'XRP' ? 4 : 2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-medium">Trigger Condition</span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label="Trigger Condition">
                  <button
                    type="button"
                    onClick={() => setCondition('above')}
                    className={`py-2.5 px-3 rounded-lg font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      condition === 'above'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Price Rises Above</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('below')}
                    className={`py-2.5 px-3 rounded-lg font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      condition === 'below'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Price Falls Below</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="alert-target-price" className="text-slate-400 font-medium">
                    Target Price (USD)
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Spot: {formatUSD(currentAsset?.price || 0, selectedSymbol === 'USDC' || selectedSymbol === 'XRP' ? 4 : 2)}
                  </span>
                </div>
                <input
                  id="alert-target-price"
                  type="number"
                  step="any"
                  value={targetPrice}
                  onChange={(e) => {
                    setTargetPrice(e.target.value);
                    if (fieldError) setFieldError(null);
                  }}
                  placeholder={`e.g. ${(currentAsset?.price * 1.05 || 1000).toFixed(2)}`}
                  className={`w-full bg-slate-950 border rounded-lg p-2.5 text-white font-mono ${
                    fieldError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-700'
                  }`}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? 'alert-price-error' : undefined}
                />
                <InlineFieldError id="alert-price-error" error={fieldError} />

                {/* Quick Preset Buttons */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500">Presets:</span>
                  {[
                    { label: '+1%', pct: 1 },
                    { label: '+5%', pct: 5 },
                    { label: '+10%', pct: 10 },
                    { label: '-1%', pct: -1 },
                    { label: '-5%', pct: -5 },
                    { label: '-10%', pct: -10 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPresetPercentage(p.pct)}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-white transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="alert-note-input" className="text-slate-400 block mb-1 font-medium">
                  Optional Strategy Note
                </label>
                <input
                  id="alert-note-input"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Take profit 50%, Buy dip"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <Button size="md" variant="primary" type="submit" className="w-full font-bold">
                Set Price Alert
              </Button>
            </form>
          </Card>

          {/* Real-Time Market Movement Simulator Card */}
          <Card className="p-6 space-y-4 bg-slate-900/40 border-indigo-900/40">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Market Movement Simulator</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate price movements to test header visual indicators
              </p>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="text-slate-400 block mb-1">Target Asset</label>
                <select
                  value={simSymbol}
                  onChange={(e) => setSimSymbol(e.target.value as AssetSymbol)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                >
                  {Object.keys(assets).map((sym) => (
                    <option key={sym} value={sym}>
                      {sym} - {formatUSD(assets[sym].price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSimulateMove(1.05)}
                  className="py-2 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold flex items-center justify-center gap-1"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Pump +5%</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateMove(0.95)}
                  className="py-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-700 text-rose-300 font-bold flex items-center justify-center gap-1"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Dump -5%</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateMove(1.1)}
                  className="py-1.5 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  +10% Surge
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateMove(0.9)}
                  className="py-1.5 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  -10% Drop
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
