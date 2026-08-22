import React from 'react';
import { Link } from '../../router/Router';
import { Layers, ShieldAlert, AlertTriangle, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B0E11] border-t border-gray-800 text-gray-400 text-xs select-none">
      {/* High-Visibility Risk & Demo Warning Banner */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-gray-300 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-white font-semibold">MANDATORY DEMO & RISK DISCLOSURE:</strong>{' '}
              <span className="text-gray-400">
                NexusCrypto is strictly a sandbox simulator & educational platform. No real money or cryptocurrencies are processed.
              </span>
            </div>
          </div>
          <Link
            to="/legal/risk"
            className="text-amber-400 hover:text-amber-300 underline font-semibold shrink-0"
          >
            Read Risk Notice →
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                N
              </div>
              <span className="font-bold text-base text-white">NexusCrypto</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono font-bold">
                DEMO SANDBOX
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs max-w-sm">
              The premier interactive crypto simulator. Master paper trading, explore deep order books, understand self-custody fundamentals, and learn risk management with virtual capital.
            </p>
            <div className="pt-2 text-gray-500 text-[11px]">
              Built with React, Vite, and Tailwind CSS.
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Markets Overview
                </Link>
              </li>
              <li>
                <Link to="/trade" className="hover:text-white transition-colors">
                  Paper Trading Terminal
                </Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-white transition-colors">
                  Instant Buy & Convert
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Portfolio Tracker
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-white transition-colors">
                  Wallet Simulator & Faucet
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">
                  Transaction Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn & Help Col */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Education</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Learn Hub
                </Link>
              </li>
              <li>
                <Link to="/learn/what-is-bitcoin" className="hover:text-white transition-colors">
                  What is Bitcoin?
                </Link>
              </li>
              <li>
                <Link to="/learn/how-crypto-wallets-work" className="hover:text-white transition-colors">
                  Wallet Custody Guide
                </Link>
              </li>
              <li>
                <Link to="/learn/avoiding-crypto-scams" className="hover:text-white transition-colors">
                  Scam Prevention
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  FAQ & Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Col */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Disclosures</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/legal/risk" className="hover:text-white transition-colors text-amber-400">
                  Trading Risk Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Security Simulator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Note */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>
            © 2026 NexusCrypto Demo. Designed for learning and paper trading. No financial advice or real execution.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/legal/terms" className="hover:text-gray-400">Terms</Link>
            <Link to="/legal/privacy" className="hover:text-gray-400">Privacy</Link>
            <Link to="/legal/risk" className="hover:text-gray-400">Risk Notice</Link>
            <Link to="/help" className="hover:text-gray-400">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
