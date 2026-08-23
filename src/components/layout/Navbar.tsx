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
  Sun,
  Moon,
  RotateCcw,
  Menu,
  X,
  Search,
  Layers,
  ArrowRightLeft,
  LayoutDashboard,
} from 'lucide-react';
import { Badge } from '../ui/BaseComponents';

export const Navbar: React.FC = () => {
  const {
    assets,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    settings,
    updateSettings,
    resetDemoData,
    portfolio,
  } = useDemo();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { navigate } = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E11]/90 border-b border-gray-800 backdrop-blur-md">
      {/* Top Real-Time Ticker Bar */}
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

        <div className="flex items-center gap-3 shrink-0 font-sans">
          <span className="text-gray-400">
            Portfolio:{' '}
            <strong className="text-gray-100 font-mono">
              {formatUSD(portfolio.totalValueUSD)}
            </strong>
          </span>
          <button
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
              <span>Learn Hub</span>
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
                  className="w-48 focus:w-64 transition-all duration-200 bg-[#0B0E11] border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Search dropdown */}
              {isSearchOpen && searchQuery && (
                <div
                  className="absolute left-0 mt-1 w-64 bg-[#161A1E] border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-800"
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

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
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
