import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useRouter, Link } from '../../router/Router';
import { formatUSD, formatPercent, formatTimestamp } from '../../utils/formatters';
import {
  TrendingUp,
  Activity,
  Wallet,
  BookOpen,
  Settings,
  Bell,
  BellRing,
  Sun,
  Moon,
  RotateCcw,
  Menu,
  X,
  Search,
  Layers,
  ArrowRightLeft,
  LayoutDashboard,
  Star,
  Zap,
  Trash2,
  RefreshCw,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { Badge } from '../ui/BaseComponents';
import { AssetSymbol } from '../../types';

export const Navbar: React.FC = () => {
  const {
    assets,
    alerts,
    createAlert,
    deleteAlert,
    rearmAlert,
    clearTriggeredAlerts,
    testTriggerAlert,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    settings,
    updateSettings,
    resetDemoData,
    portfolio,
  } = useDemo();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickAlertSymbol, setQuickAlertSymbol] = useState<AssetSymbol>('BTC');
  const [quickAlertCondition, setQuickAlertCondition] = useState<'above' | 'below'>('above');
  const [quickAlertPrice, setQuickAlertPrice] = useState('');
  const [quickAlertError, setQuickAlertError] = useState<string | null>(null);

  const { navigate } = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const triggeredAlerts = alerts.filter((a) => a.triggered);
  const activeAlerts = alerts.filter((a) => !a.triggered);
  const hasTriggered = triggeredAlerts.length > 0;
  const recentTriggeredAlert = triggeredAlerts[0];

  const topAssets = ['BTC', 'ETH', 'SOL', 'USDC', 'XRP'];

  const filteredAssets = Object.values(assets).filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const handleQuickAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickAlertError(null);
    const priceNum = parseFloat(quickAlertPrice);
    if (!quickAlertPrice || isNaN(priceNum) || priceNum <= 0) {
      setQuickAlertError('Please enter a valid price greater than 0');
      return;
    }
    const res = createAlert(quickAlertSymbol, quickAlertCondition, priceNum, 'Quick Header Alert');
    if (res && !res.success) {
      setQuickAlertError(res.error || 'Failed to create alert');
      return;
    }
    setQuickAlertPrice('');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E11]/90 border-b border-gray-800 backdrop-blur-md">
      {/* Top Real-Time Ticker Bar with Alert Ticker Notification */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1.5 bg-[#0B0E11] border-b border-gray-800 text-[11px] font-mono text-gray-400 overflow-x-auto select-none">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-indigo-400 font-sans font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span>LIVE FEED:</span>
          </div>
          {topAssets.map((sym) => {
            const asset = assets[sym];
            if (!asset) return null;
            const isPos = asset.change24h >= 0;
            return (
              <Link
                key={sym}
                to={`/markets/${sym}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className="font-bold text-gray-200">{sym}</span>
                <span>{formatUSD(asset.price, sym === 'USDC' || sym === 'XRP' ? 4 : 2)}</span>
                <span className={isPos ? 'text-green-400' : 'text-red-400'}>
                  {formatPercent(asset.change24h)}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Visual Indicator Banner in Ticker when target price is crossed */}
        {hasTriggered && recentTriggeredAlert && (
          <div
            id="header-ticker-alert-indicator"
            className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 animate-pulse text-[11px] font-sans shrink-0 mx-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-bold text-amber-200">PRICE ALERT:</span>
            <span>
              {recentTriggeredAlert.symbol} crossed {recentTriggeredAlert.condition.toUpperCase()}{' '}
              {formatUSD(recentTriggeredAlert.targetValue)}
            </span>
            <button
              type="button"
              onClick={() => setIsAlertsOpen(true)}
              className="underline font-semibold text-amber-100 hover:text-white ml-1 cursor-pointer"
            >
              View ({triggeredAlerts.length})
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0 font-sans">
          <span className="text-gray-400">
            Portfolio:{' '}
            <strong className="text-gray-100 font-mono">
              {formatUSD(portfolio.totalValueUSD)}
            </strong>
          </span>
          <button
            type="button"
            onClick={resetDemoData}
            title="Reset sandbox balances"
            className="flex items-center gap-1 text-gray-400 hover:text-amber-400 transition-colors text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md group-hover:scale-105 transition-transform">
              N
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-white tracking-tight">Nexus</span>
              <span className="font-bold text-lg text-indigo-400">Crypto</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              activeClassName="text-white bg-gray-800 font-semibold"
            >
              <div className="w-3.5 h-3.5 rounded-xs border-2 border-indigo-400 shrink-0" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/markets"
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              activeClassName="text-white bg-gray-800 font-semibold"
            >
              <div className="w-3.5 h-3.5 rounded-xs border-2 border-gray-600 shrink-0" />
              <span>Markets</span>
            </Link>
            <Link
              to="/trade"
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              activeClassName="text-white bg-gray-800 font-semibold"
            >
              <div className="w-3.5 h-3.5 rounded-xs border-2 border-emerald-400 shrink-0" />
              <span>Trade</span>
            </Link>
            <Link
              to="/buy"
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              activeClassName="text-white bg-gray-800 font-semibold"
            >
              <div className="w-3.5 h-3.5 rounded-xs border-2 border-gray-600 shrink-0" />
              <span>Buy & Convert</span>
            </Link>
            <Link
              to="/watchlist"
              id="nav-watchlist-alerts-link"
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2 relative"
              activeClassName="text-white bg-gray-800 font-semibold"
            >
              <div
                className={`w-3.5 h-3.5 rounded-xs border-2 transition-colors ${
                  hasTriggered ? 'border-amber-400 bg-amber-400/30 animate-pulse' : 'border-amber-400'
                } shrink-0`}
              />
              <span>Watchlist & Alerts</span>
              {hasTriggered && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-[#0B0E11] text-[10px] font-extrabold shadow-sm">
                  {triggeredAlerts.length}
                </span>
              )}
            </Link>
            <Link
              to="/wallet"
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              activeClassName="text-white bg-gray-800 font-semibold"
            >
              <div className="w-3.5 h-3.5 rounded-xs border-2 border-amber-400 shrink-0" />
              <span>Wallet</span>
            </Link>
            <Link
              to="/learn"
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
              activeClassName="text-white bg-gray-800 font-semibold"
            >
              <div className="w-3.5 h-3.5 rounded-xs border-2 border-purple-400 shrink-0" />
              <span>Learn</span>
            </Link>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <div className="relative hidden xl:block">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search assets (BTC, ETH...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-44 focus:w-60 transition-all duration-200 bg-[#0B0E11] border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Search dropdown */}
              {isSearchOpen && searchQuery && (
                <div
                  className="absolute left-0 mt-1 w-60 bg-[#161A1E] border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-800"
                  onMouseLeave={() => setIsSearchOpen(false)}
                >
                  {filteredAssets.length === 0 ? (
                    <div className="p-3 text-xs text-gray-400 text-center">No assets found</div>
                  ) : (
                    filteredAssets.slice(0, 5).map((a) => (
                      <div
                        key={a.symbol}
                        onClick={() => {
                          navigate(`/markets/${a.symbol}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2.5 hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{a.symbol}</span>
                          <span className="text-[11px] text-gray-400">{a.name}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-200">{formatUSD(a.price)}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Price Alerts Visual Indicator & Quick Panel */}
            <div className="relative" id="header-price-alerts-container">
              <button
                id="btn-header-price-alerts"
                onClick={() => {
                  setIsAlertsOpen(!isAlertsOpen);
                  setIsNotifOpen(false);
                }}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  hasTriggered
                    ? 'text-amber-300 bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : alerts.length > 0
                    ? 'text-gray-300 bg-gray-800/80 border-gray-700 hover:text-white hover:bg-gray-800'
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800'
                }`}
                title={
                  hasTriggered
                    ? `${triggeredAlerts.length} Price Alert(s) Triggered!`
                    : `${alerts.length} Price Alerts Configured`
                }
                aria-label="Price Alerts Indicator"
              >
                {hasTriggered ? (
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-amber-400 opacity-60"></span>
                    <BellRing className="w-4 h-4 text-amber-400 relative" />
                  </div>
                ) : (
                  <Bell className="w-4 h-4 text-gray-400" />
                )}

                <span className="hidden sm:inline font-sans">
                  {hasTriggered ? (
                    <span className="text-amber-300 font-bold">
                      {triggeredAlerts.length} Triggered
                    </span>
                  ) : alerts.length > 0 ? (
                    <span className="text-gray-400">{alerts.length} Alerts</span>
                  ) : (
                    <span>Alerts</span>
                  )}
                </span>

                {hasTriggered && (
                  <span className="sm:hidden px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-black">
                    {triggeredAlerts.length}
                  </span>
                )}
              </button>

              {/* Price Alerts Popover */}
              {isAlertsOpen && (
                <div
                  id="popover-price-alerts"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#161A1E] border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#0B0E11]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span>Price Alerts</span>
                      </h4>
                      {hasTriggered ? (
                        <Badge variant="amber">{triggeredAlerts.length} Triggered</Badge>
                      ) : (
                        <Badge variant="slate">{alerts.length} Active</Badge>
                      )}
                    </div>
                    {hasTriggered && (
                      <button
                        onClick={clearTriggeredAlerts}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Clear Triggered
                      </button>
                    )}
                  </div>

                  {/* Triggered Alerts Attention Box */}
                  {hasTriggered && (
                    <div className="p-3 bg-amber-950/40 border-b border-amber-800/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>Triggered by simulated market ticks</span>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {triggeredAlerts.map((al) => {
                          const currPrice = assets[al.symbol]?.price || 0;
                          return (
                            <div
                              key={al.id}
                              className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 flex items-center justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center gap-1.5 font-bold text-white">
                                  <span>{al.symbol}</span>
                                  <span className="text-amber-300 text-[11px] font-mono">
                                    {al.condition.toUpperCase()} {formatUSD(al.targetValue)}
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                                  Current: <span className="text-gray-200">{formatUSD(currPrice)}</span>
                                  {al.triggeredAt && (
                                    <span className="ml-1 text-gray-500">
                                      • {formatTimestamp(al.triggeredAt, 'time')}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => rearmAlert(al.id)}
                                  title="Re-arm and watch again"
                                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-emerald-400 flex items-center gap-1 text-[10px] font-medium"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Re-arm</span>
                                </button>
                                <button
                                  onClick={() => deleteAlert(al.id)}
                                  title="Delete alert"
                                  className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Active Monitoring Alerts List */}
                  <div className="max-h-56 overflow-y-auto divide-y divide-gray-800/60">
                    {activeAlerts.length === 0 && !hasTriggered ? (
                      <div className="py-6 text-center text-gray-500">
                        <Bell className="w-6 h-6 mx-auto mb-1.5 text-gray-600" />
                        <span>No price triggers configured in localStorage</span>
                      </div>
                    ) : (
                      activeAlerts.map((al) => {
                        const currPrice = assets[al.symbol]?.price || 0;
                        const diffPct =
                          currPrice > 0
                            ? (((al.targetValue - currPrice) / currPrice) * 100).toFixed(1)
                            : '0';

                        return (
                          <div
                            key={al.id}
                            className="p-3 hover:bg-gray-800/40 transition-colors flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-gray-200">
                                <span>{al.symbol}</span>
                                <span className="text-gray-400 font-mono text-[11px]">
                                  {al.condition} {formatUSD(al.targetValue)}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono mt-0.5 flex items-center gap-2">
                                <span>Live: {formatUSD(currPrice)}</span>
                                <span className="text-indigo-400">({diffPct}% to target)</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => testTriggerAlert(al.id)}
                                title="Simulate market price crossing this target"
                                className="px-2 py-1 rounded bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 text-[10px] font-medium flex items-center gap-1"
                              >
                                <Zap className="w-2.5 h-2.5 text-amber-400" />
                                <span>Test</span>
                              </button>
                              <button
                                onClick={() => deleteAlert(al.id)}
                                className="p-1 text-gray-500 hover:text-rose-400"
                                title="Delete alert"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Quick Add Mini Form */}
                  <div className="p-3 bg-[#0B0E11] border-t border-gray-800">
                    <form onSubmit={handleQuickAddAlert} className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-gray-300">
                        <span>Quick Trigger Setup</span>
                        {quickAlertError && (
                          <span className="text-rose-400 text-[10px]">{quickAlertError}</span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <select
                          value={quickAlertSymbol}
                          onChange={(e) => setQuickAlertSymbol(e.target.value as AssetSymbol)}
                          className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-white font-bold text-xs"
                        >
                          {Object.keys(assets).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <select
                          value={quickAlertCondition}
                          onChange={(e) => setQuickAlertCondition(e.target.value as any)}
                          className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs"
                        >
                          <option value="above">Above &gt;=</option>
                          <option value="below">Below &lt;=</option>
                        </select>
                        <input
                          type="number"
                          step="any"
                          placeholder="Target USD"
                          value={quickAlertPrice}
                          onChange={(e) => setQuickAlertPrice(e.target.value)}
                          className="w-24 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-white font-mono text-xs flex-1"
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                          title="Save alert to localStorage"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>

                    <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Persisted in localStorage</span>
                      <Link
                        to="/watchlist"
                        onClick={() => setIsAlertsOpen(false)}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
                      >
                        <span>Full Alerts Manager</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsAlertsOpen(false);
                }}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#161A1E] border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#0B0E11]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">Notifications</h4>
                      <Badge variant="indigo">{unreadCount} New</Badge>
                    </div>
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-gray-400 hover:text-gray-200"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-800/60">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs hover:bg-gray-800/50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-semibold text-gray-200">{n.title}</h5>
                            <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                              {formatTimestamp(n.timestamp, 'time')}
                            </span>
                          </div>
                          <p className="text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Settings Link */}
            <Link
              to="/settings"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors hidden sm:inline-flex"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Quick Deposit CTA */}
            <Link to="/wallet">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                Deposit
              </button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 md:hidden"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#0B0E11] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3">
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <LayoutDashboard className="w-5 h-5 text-sky-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/markets"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Markets</span>
          </Link>
          <Link
            to="/trade"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Paper Trading Terminal</span>
          </Link>
          <Link
            to="/buy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            <span>Buy, Sell & Convert</span>
          </Link>
          <Link
            to="/watchlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Watchlist & Price Alerts</span>
            </div>
            {hasTriggered && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold animate-pulse">
                {triggeredAlerts.length} Triggered
              </span>
            )}
          </Link>
          <Link
            to="/wallet"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <Wallet className="w-5 h-5 text-amber-400" />
            <span>Wallet & Faucet</span>
          </Link>
          <Link
            to="/history"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <Layers className="w-5 h-5 text-gray-400" />
            <span>Transaction Ledger</span>
          </Link>
          <Link
            to="/learn"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Learn Hub & Quiz</span>
          </Link>
          <Link
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:bg-gray-800 font-medium text-sm"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings & Security</span>
          </Link>
          <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
            <span>Demo Balance: {formatUSD(portfolio.totalValueUSD)}</span>
            <button
              onClick={() => {
                resetDemoData();
                setIsMobileMenuOpen(false);
              }}
              className="text-amber-400 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
