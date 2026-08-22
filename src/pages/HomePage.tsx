import React from 'react';
import { useDemo } from '../context/DemoContext';
import { Link } from '../router/Router';
import { formatUSD, formatPercent, formatCompactNumber } from '../utils/formatters';
import {
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  BarChart3,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';

export const HomePage: React.FC = () => {
  const { assets, portfolio } = useDemo();

  const featuredSymbols = ['BTC', 'ETH', 'SOL', 'USDC', 'XRP'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Live Sandbox Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>100% Risk-Free Demo Sandbox • $25,000 Seed Capital</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Master Crypto Trading <br />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Without Financial Risk
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              NexusCrypto is a simulated paper trading platform and learning hub. Practice with real-time order books, test execution strategies, understand self-custody, and track virtual portfolios.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/trade">
                <Button size="lg" variant="primary" className="font-bold shadow-lg shadow-indigo-600/25 px-6">
                  Launch Paper Terminal <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="px-6">
                  View Demo Portfolio
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline" className="px-5">
                  <BookOpen className="w-4 h-4 mr-2 text-purple-400" /> Learn Basics
                </Button>
              </Link>
            </div>

            {/* Simulated Balance Pill */}
            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-4">
              <span>✓ Instant Browser Storage</span>
              <span>✓ No KYC or Real Cards</span>
              <span>✓ Live-Feel Deterministic Engine</span>
            </div>
          </div>

          {/* Live Market Cards Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {featuredSymbols.map((sym) => {
              const asset = assets[sym];
              if (!asset) return null;
              const isPos = asset.change24h >= 0;
              return (
                <Link
                  key={sym}
                  to={`/markets/${sym}`}
                  className="block group focus:outline-none"
                >
                  <Card className="p-4 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-200 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{asset.symbol}</span>
                        <span className="text-xs text-slate-400">{asset.name}</span>
                      </div>
                      <Badge variant={isPos ? 'emerald' : 'rose'}>
                        {formatPercent(asset.change24h)}
                      </Badge>
                    </div>
                    <div className="font-mono text-lg font-bold text-white mt-1">
                      {formatUSD(asset.price, sym === 'USDC' || sym === 'XRP' ? 4 : 2)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                      <span>24h Vol</span>
                      <span>{formatCompactNumber(asset.volume24h)}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold font-mono tracking-widest text-indigo-400 uppercase">
              SANDBOX CAPABILITIES
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              Everything You Need to Learn & Practice
            </h3>
            <p className="text-slate-400 text-sm">
              Explore advanced simulated exchange mechanics with zero pressure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Paper Trading Terminal</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Test limit orders, market orders, and depth chart mechanics against deterministic live-feel order books and recent trade feeds.
              </p>
              <Link to="/trade" className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                Explore Terminal →
              </Link>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Wallet & Faucet Simulator</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Experience simulated deposits, withdrawals, network fee estimation, QR address generators, and instant sandbox faucet top-ups.
              </p>
              <Link to="/wallet" className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                Open Wallet Simulator →
              </Link>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Education & Scam Prevention</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Grasp Bitcoin scarcity, Ethereum smart contracts, seed phrase custody, and scam-avoidance checklists with interactive quizzes.
              </p>
              <Link to="/learn" className="inline-flex items-center text-xs font-semibold text-purple-400 hover:text-purple-300">
                Start Learning →
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Flow */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase">
              GETTING STARTED
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              Three Simple Steps to Practice
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-white text-base">Explore Markets</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Inspect 24h gainers, volume trends, and interactive multi-timeframe candlestick charts for top digital assets.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-white text-base">Place Paper Orders</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Use your $25,000 USD virtual seed funds to test limit buys, market sells, and instant crypto-to-crypto conversions.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-white text-base">Track & Review</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitor portfolio allocation, unrealized profit/loss, and export full transaction history to CSV directly from your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Risk Principles Callout */}
      <section className="py-16 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950/70 border border-slate-800 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase">
                <Lock className="w-4 h-4" />
                <span>Security First Architecture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Learn Safe Digital Asset Habits
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Understanding private key custody, phishing attacks, and risk exposure is just as important as technical chart analysis. Explore our security simulator to review mock 2FA, session audits, and wallet safety.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/security">
                  <Button variant="secondary" size="md">
                    Security Center Simulator
                  </Button>
                </Link>
                <Link to="/legal/risk">
                  <Button variant="outline" size="md" className="text-amber-400 border-amber-500/30">
                    Read Trading Risk Guide
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-80 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
              <div className="text-slate-400 font-sans font-bold text-sm">Demo Status Checklist</div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Real Capital Risk:</span>
                <span className="text-emerald-400 font-bold">$0.00 (Zero)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Local Storage:</span>
                <span className="text-emerald-400">Encrypted in browser</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>KYC Requirement:</span>
                <span className="text-slate-400">None (Demo)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Execution Type:</span>
                <span className="text-indigo-400">Paper Trading</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
