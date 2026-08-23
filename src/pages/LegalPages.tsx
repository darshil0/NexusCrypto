import React from 'react';
import { Link } from '../router/Router';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Badge, Card } from '../components/ui/BaseComponents';

export const LegalRiskPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none">
      <Link to="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="amber">Important Disclosure</Badge>
          <span className="text-xs text-slate-500 font-mono">Updated February 2026</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Trading & Self-Custody Risk Notice</h1>
        <p className="text-slate-400 text-sm">
          Mandatory educational notice regarding digital asset volatility, market execution, and cryptographic custody.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        <Card className="p-6 border-amber-900/40 bg-amber-950/20 space-y-2">
          <h3 className="font-bold text-amber-200 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>NexusCrypto Is Strictly a Sandbox Simulator</span>
          </h3>
          <p className="text-xs text-amber-300/90 leading-relaxed">
            All prices, account balances, trades, and portfolio values displayed on this website are simulated for educational and paper trading purposes only. NexusCrypto does not accept, hold, or transmit real fiat currency, real cryptocurrency, or real financial instruments.
          </p>
        </Card>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-white">1. High Volatility & Capital Loss Risk</h3>
          <p>
            In live cryptocurrency markets, digital assets experience extreme price volatility. Rapid swings of 20% to 50% or more within hours are common. Investors can lose up to 100% of invested capital. Simulated gains in paper trading do not guarantee or predict future success in live markets.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-white">2. Liquidity & Slippage Realities</h3>
          <p>
            While our paper terminal simulates order books and depth charts, real market orders are subject to liquidity shortages, partial fills, counterparty risk, and severe slippage during periods of extreme volume or network congestion.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-white">3. Self-Custody & Private Key Responsibility</h3>
          <p>
            In blockchain protocols, transactions are irreversible. Loss or compromise of a 12-to-24 word recovery seed phrase results in permanent loss of access. No centralized entity or customer support can recover lost private keys.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-white">4. No Investment or Financial Advice</h3>
          <p>
            Nothing on NexusCrypto constitutes financial, legal, tax, or investment advice. NexusCrypto is not a registered broker-dealer, investment advisor, or commodities trading advisor.
          </p>
        </section>
      </div>
    </div>
  );
};

export const LegalTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none">
      <Link to="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-3 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Terms of Sandbox Service</h1>
        <p className="text-slate-400 text-sm">
          Guidelines and operating agreements for accessing the NexusCrypto demo environment.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        <section className="space-y-2">
          <h3 className="text-lg font-bold text-white">1. Scope of Simulation</h3>
          <p>
            NexusCrypto provides an interactive web-based simulator. By accessing this platform, you acknowledge that all balances and transactions are virtual, non-transferable, and possess zero monetary value.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-white">2. Intellectual Property & Originality</h3>
          <p>
            NexusCrypto is an independent, original open-source demonstration. It is not affiliated with, endorsed by, or partnered with any external cryptocurrency exchange or financial service.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-white">3. Disclaimer of Warranties</h3>
          <p>
            The software is provided "AS IS", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability or fitness for a particular purpose.
          </p>
        </section>
      </div>
    </div>
  );
};

export const LegalPrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none">
      <Link to="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="space-y-3 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Privacy & Local Storage Policy</h1>
        <p className="text-slate-400 text-sm">
          Our commitment to local-first client privacy and zero third-party tracking.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        <section className="space-y-2">
          <h3 className="text-lg font-bold text-white">1. Local Browser Storage Only</h3>
          <p>
            NexusCrypto stores your paper portfolio balances, active orders, transaction ledger, and UI preferences strictly in your web browser's local storage (`localStorage`). No user data is sent to or stored on external servers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-bold text-white">2. Zero Telemetry & No Tracking Cookies</h3>
          <p>
            We do not use advertising trackers, fingerprinting scripts, or third-party analytics cookies. You can clear your browser storage at any time to remove all saved simulation data.
          </p>
        </section>
      </div>
    </div>
  );
};
