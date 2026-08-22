import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { formatUSD, formatCrypto, formatPercent } from '../utils/formatters';
import { Link } from '../router/Router';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Badge, Button, Card, Modal } from '../components/ui/BaseComponents';

export const WalletPage: React.FC = () => {
  const {
    balances,
    assets,
    simulateDeposit,
    simulateWithdrawal,
    resetDemoData,
    settings,
  } = useDemo();

  // Deposit Modal State
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAsset, setDepositAsset] = useState<string>('BTC');
  const [depositAmount, setDepositAmount] = useState<string>('0.5');
  const [depositNetwork, setDepositNetwork] = useState<string>('Bitcoin Mainnet');
  const [hasCopied, setHasCopied] = useState(false);

  // Withdrawal Modal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAsset, setWithdrawAsset] = useState<string>('BTC');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawNetwork, setWithdrawNetwork] = useState<string>('Bitcoin Mainnet');
  const [mockMfaCode, setMockMfaCode] = useState<string>('123456');

  // Networks mapping
  const networks: Record<string, string[]> = {
    BTC: ['Bitcoin Native SegWit', 'Bitcoin Taproot', 'Lightning Network (Demo)'],
    ETH: ['Ethereum Mainnet (ERC-20)', 'Arbitrum One', 'Optimism'],
    SOL: ['Solana Mainnet (SPL)', 'Solana Devnet'],
    USDC: ['Ethereum (ERC-20)', 'Solana (SPL)', 'Polygon POS'],
    XRP: ['XRP Ledger (XRPL)'],
    USD: ['Simulated ACH Wire', 'Simulated FedNow Transfer'],
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard?.writeText(addr);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleExecuteDeposit = () => {
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;
    simulateDeposit(depositAsset, amt, depositNetwork);
    setIsDepositOpen(false);
  };

  const handleExecuteWithdrawal = () => {
    const amt = parseFloat(withdrawAmount) || 0;
    if (amt <= 0 || !withdrawAddress) return;
    simulateWithdrawal(withdrawAsset, amt, withdrawAddress, withdrawNetwork);
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
    setWithdrawAddress('');
  };

  const generatedMockAddress = `demo_${depositAsset.toLowerCase()}_${depositNetwork.slice(0, 3).toLowerCase()}_8f39a4b2c1`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Wallet & Faucet Simulator</h1>
            <Badge variant="indigo">Simulated Custody</Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Test on-chain deposit faucets, simulated withdrawals, network gas estimators, and address formats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="success"
            className="font-bold"
            leftIcon={<ArrowDownLeft className="w-4 h-4" />}
            onClick={() => setIsDepositOpen(true)}
          >
            Simulate Deposit
          </Button>
          <Button
            size="md"
            variant="secondary"
            className="font-bold"
            leftIcon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => setIsWithdrawOpen(true)}
          >
            Simulate Withdrawal
          </Button>
          <Button
            size="md"
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4 text-amber-400" />}
            onClick={resetDemoData}
          >
            Reset Balances
          </Button>
        </div>
      </div>

      {/* Wallet Balances Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(balances).map((sym) => {
          const bal = balances[sym];
          const isUSD = sym === 'USD';
          const assetObj = isUSD ? null : assets[sym];
          const price = isUSD ? 1 : assetObj?.price || 0;
          const totalVal = (bal.amount + (bal.lockedInOrders || 0)) * price;

          return (
            <Card key={sym} className="p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${assetObj ? assetObj.iconBg : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {sym.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{bal.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">{sym}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Unit Price</span>
                  <span className="font-bold text-slate-200">{formatUSD(price)}</span>
                </div>
              </div>

              {/* Amount & Total Value */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Available:</span>
                  <span className="text-lg font-bold text-white">
                    {isUSD ? formatUSD(bal.amount) : formatCrypto(bal.amount)} {sym}
                  </span>
                </div>
                {bal.lockedInOrders > 0 && (
                  <div className="flex justify-between text-xs text-amber-400/90">
                    <span>Locked in Orders:</span>
                    <span>{isUSD ? formatUSD(bal.lockedInOrders) : formatCrypto(bal.lockedInOrders)} {sym}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Est. Value (USD):</span>
                  <span className="text-emerald-400 font-bold">{formatUSD(totalVal)}</span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setDepositAsset(sym);
                    setIsDepositOpen(true);
                  }}
                >
                  Deposit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setWithdrawAsset(sym);
                    setIsWithdrawOpen(true);
                  }}
                >
                  Withdraw
                </Button>
                {!isUSD && (
                  <Link to={`/trade/${sym}/USD`} className="flex-1">
                    <Button size="sm" variant="primary" className="w-full text-xs">
                      Trade
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Safety Notice & Self-Custody Explainer */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-white text-base">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Self-Custody vs Exchange Custody Education</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
          In this simulated sandbox, balances reside securely in your local browser state. In the real crypto ecosystem, "Not your keys, not your coins" is the golden rule. When keeping crypto on centralized exchanges, the exchange controls the private keys; when using non-custodial hardware wallets (like Ledger or Trezor), you maintain 100% sovereign control over your seed phrase.
        </p>
        <div className="pt-2">
          <Link to="/learn/how-crypto-wallets-work" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
            Read complete guide on Private Keys & Cold Storage →
          </Link>
        </div>
      </Card>

      {/* Deposit Simulation Modal */}
      <Modal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        title={`Simulate ${depositAsset} Deposit & Faucet`}
      >
        <div className="space-y-4 font-sans text-sm">
          {/* Asset & Network selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Asset</label>
              <select
                value={depositAsset}
                onChange={(e) => setDepositAsset(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
              >
                {Object.keys(balances).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Network</label>
              <select
                value={depositNetwork}
                onChange={(e) => setDepositNetwork(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
              >
                {(networks[depositAsset] || ['Default Network']).map((net) => (
                  <option key={net} value={net}>{net}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mock QR Code & Copy Address */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner">
              <QrCode className="w-28 h-28 text-slate-900" />
            </div>
            <div className="w-full text-center space-y-1">
              <span className="text-[11px] text-slate-400">Simulated Deposit Address ({depositNetwork})</span>
              <div className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                <span className="truncate">{generatedMockAddress}</span>
                <button
                  onClick={() => handleCopyAddress(generatedMockAddress)}
                  className="p-1 rounded hover:bg-slate-800 text-indigo-400"
                  title="Copy address"
                >
                  {hasCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Faucet Top Up Input */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">Faucet Simulated Top-Up Amount</label>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-sm"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono font-bold">
                {depositAsset}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-lg text-amber-300 text-xs">
            ⚠️ <strong>Sandbox Faucet:</strong> Clicking "Credit Sandbox Balance" will instantly top up your virtual funds.
          </div>

          <Button
            size="md"
            variant="success"
            className="w-full font-bold"
            onClick={handleExecuteDeposit}
          >
            Credit Sandbox Balance ({depositAmount} {depositAsset})
          </Button>
        </div>
      </Modal>

      {/* Withdrawal Simulation Modal */}
      <Modal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        title={`Simulate ${withdrawAsset} Withdrawal`}
      >
        <div className="space-y-4 font-sans text-sm">
          {/* Asset & Available */}
          <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Asset to Withdraw</span>
              <select
                value={withdrawAsset}
                onChange={(e) => setWithdrawAsset(e.target.value)}
                className="bg-transparent text-white font-bold text-sm focus:outline-none"
              >
                {Object.keys(balances).map((s) => (
                  <option key={s} value={s} className="bg-slate-900">{s}</option>
                ))}
              </select>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">Available Balance</span>
              <span className="font-bold text-white">
                {formatCrypto(balances[withdrawAsset]?.amount || 0)} {withdrawAsset}
              </span>
            </div>
          </div>

          {/* Destination Address */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Destination Wallet Address</label>
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              placeholder="e.g. bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Amount</span>
              <button
                type="button"
                onClick={() => setWithdrawAmount((balances[withdrawAsset]?.amount || 0).toString())}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Max
              </button>
            </div>
            <input
              type="number"
              step="any"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Simulated 2FA security step */}
          <div className="space-y-1 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1 font-semibold text-indigo-400">
                <ShieldCheck className="w-4 h-4" /> Demo MFA Verification
              </span>
              <span className="text-slate-500 font-mono">Simulated Code: 123456</span>
            </div>
            <input
              type="text"
              value={mockMfaCode}
              onChange={(e) => setMockMfaCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-white tracking-widest font-mono text-sm"
              placeholder="6-digit Authenticator Code"
            />
          </div>

          <Button
            size="md"
            variant="danger"
            className="w-full font-bold"
            disabled={!withdrawAddress || parseFloat(withdrawAmount) <= 0}
            onClick={handleExecuteWithdrawal}
          >
            Confirm Simulated Withdrawal
          </Button>
        </div>
      </Modal>
    </div>
  );
};
