import React, { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { useRouter } from '../router/Router';
import { formatUSD, formatCrypto } from '../utils/formatters';
import { calculateConvertQuote, validateBalance } from '../utils/calculations';
import {
  ArrowDown,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Badge, Button, Card, Modal } from '../components/ui/BaseComponents';

export const BuySellConvertPage: React.FC<{ initialMode?: 'buy' | 'sell' | 'convert' }> = ({
  initialMode = 'buy',
}) => {
  const { path } = useRouter();
  const { assets, balances, executeConvert } = useDemo();

  // Determine mode from route path if rendered for /buy, /sell, or /convert
  const defaultTab = path.includes('/sell')
    ? 'sell'
    : path.includes('/convert')
    ? 'convert'
    : initialMode;

  const [mode, setMode] = useState<'buy' | 'sell' | 'convert'>(defaultTab);

  // Form State
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [fromAsset, setFromAsset] = useState<string>('USD');
  const [toAsset, setToAsset] = useState<string>('BTC');
  const [amount, setAmount] = useState<string>('1000');
  const [quoteCountdown, setQuoteCountdown] = useState<number>(15);

  // Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  // Refresh rate quote timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteCountdown((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const numAmount = parseFloat(amount) || 0;

  // Active prices map
  const pricesMap: Record<string, number> = {};
  Object.keys(assets).forEach((k) => {
    pricesMap[k] = assets[k].price;
  });
  pricesMap.USD = 1.0;

  // Calculate quote based on active mode
  let quote = {
    fromSymbol: 'USD',
    toSymbol: 'BTC',
    fromAmount: 0,
    toAmount: 0,
    exchangeRate: 0,
    fee: 0,
    feeAsset: 'USD',
    slippagePercent: 0,
    estimatedValueUSD: 0,
  };

  if (mode === 'buy') {
    quote = calculateConvertQuote('USD', selectedAsset, numAmount, pricesMap);
  } else if (mode === 'sell') {
    quote = calculateConvertQuote(selectedAsset, 'USD', numAmount, pricesMap);
  } else {
    quote = calculateConvertQuote(fromAsset, toAsset, numAmount, pricesMap);
  }

  // Balances
  const spendAsset = mode === 'buy' ? 'USD' : mode === 'sell' ? selectedAsset : fromAsset;
  const availableSpendBalance = balances[spendAsset]?.amount || 0;

  // Validation
  let hasError = false;
  let errorMessage = '';

  if (numAmount > 0) {
    const val = validateBalance(availableSpendBalance, numAmount);
    if (!val.valid) {
      hasError = true;
      errorMessage = val.error || 'Insufficient funds';
    }
  }

  const handlePercentage = (pct: number) => {
    if (availableSpendBalance <= 0) return;
    const calc = (availableSpendBalance * pct) / 100;
    const precision = spendAsset === 'USD' ? 2 : spendAsset === 'BTC' ? 6 : 4;
    setAmount(calc.toFixed(precision));
  };

  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const handleExecute = () => {
    if (numAmount <= 0 || hasError) return;

    if (mode === 'buy') {
      const res = executeConvert('USD', selectedAsset, numAmount);
      if (res.success) {
        setLastReceipt({
          title: `Simulated Purchase of ${formatCrypto(quote.toAmount)} ${selectedAsset}`,
          paid: `${formatUSD(numAmount)} USD`,
          received: `${formatCrypto(quote.toAmount)} ${selectedAsset}`,
          rate: `1 ${selectedAsset} = ${formatUSD(pricesMap[selectedAsset])}`,
          fee: `$0.00 (Zero Slippage Demo)`,
        });
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
        setAmount('');
      } else if (res.error) {
        alert(res.error);
      }
    } else if (mode === 'sell') {
      const res = executeConvert(selectedAsset, 'USD', numAmount);
      if (res.success) {
        setLastReceipt({
          title: `Simulated Sale of ${formatCrypto(numAmount)} ${selectedAsset}`,
          paid: `${formatCrypto(numAmount)} ${selectedAsset}`,
          received: `${formatUSD(quote.toAmount)} USD`,
          rate: `1 ${selectedAsset} = ${formatUSD(pricesMap[selectedAsset])}`,
          fee: `$0.00 (Zero Slippage Demo)`,
        });
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
        setAmount('');
      } else if (res.error) {
        alert(res.error);
      }
    } else {
      const res = executeConvert(fromAsset, toAsset, numAmount);
      if (res.success) {
        setLastReceipt({
          title: `Simulated Conversion: ${fromAsset} → ${toAsset}`,
          paid: `${formatCrypto(numAmount)} ${fromAsset}`,
          received: `${formatCrypto(quote.toAmount)} ${toAsset}`,
          rate: `1 ${fromAsset} = ${(quote.exchangeRate).toFixed(6)} ${toAsset}`,
          fee: `$0.00 (Zero Slippage Demo)`,
        });
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
        setAmount('');
      } else if (res.error) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6 select-none">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <Badge variant="indigo">Simple Paper Swap</Badge>
        <h1 className="text-3xl font-extrabold text-white">Instant Buy, Sell & Convert</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Simulate instantaneous trades and crypto conversions with guaranteed quotes.
        </p>
      </div>

      {/* Main Conversion Card */}
      <Card className="p-6 space-y-6 shadow-2xl border-slate-800">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          {(['buy', 'sell', 'convert'] as const).map((tab) => (
            <button
              key={tab}
              id={`tab-mode-${tab}`}
              onClick={() => setMode(tab)}
              className={`py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${
                mode === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Body based on Mode */}
        {mode === 'buy' && (
          <div className="space-y-4">
            {/* Spend Amount (USD) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>You Pay (Simulated USD)</span>
                <span className="font-mono">
                  Available: {formatUSD(balances.USD?.amount || 0)}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  id="input-buy-spend-usd"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-lg font-bold text-white font-mono focus:outline-none focus:border-indigo-500"
                  placeholder="0.00"
                />
                <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400 font-mono">
                  USD
                </span>
              </div>
            </div>

            {/* Percentage shortcuts */}
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentage(pct * 100)}
                  className="py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700/60"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>

            {/* Target Crypto Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-slate-400 font-medium">You Receive (Estimated)</label>
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                >
                  {Object.keys(assets).map((sym) => (
                    <option key={sym} value={sym}>
                      {assets[sym].name} ({sym})
                    </option>
                  ))}
                </select>
                <div className="flex-1 text-right font-mono text-lg font-bold text-emerald-400">
                  ≈ {formatCrypto(quote.toAmount)} {selectedAsset}
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'sell' && (
          <div className="space-y-4">
            {/* Select Crypto to Sell */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Select Crypto to Sell</span>
                <span className="font-mono">
                  Available: {formatCrypto(balances[selectedAsset]?.amount || 0)} {selectedAsset}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-white focus:outline-none"
                >
                  {Object.keys(assets).map((sym) => (
                    <option key={sym} value={sym}>
                      {assets[sym].name} ({sym})
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="any"
                    id="input-sell-amount-crypto"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-lg font-bold text-white font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400 font-mono">
                    {selectedAsset}
                  </span>
                </div>
              </div>
            </div>

            {/* Percentage shortcuts */}
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentage(pct * 100)}
                  className="py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700/60"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>

            {/* USD Receive box */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-slate-400 font-medium">You Receive in USD</label>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-right font-mono text-xl font-bold text-emerald-400">
                ≈ {formatUSD(quote.toAmount)} USD
              </div>
            </div>
          </div>
        )}

        {mode === 'convert' && (
          <div className="space-y-4">
            {/* From Asset */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>From</span>
                <span className="font-mono">
                  Available: {formatCrypto(balances[fromAsset]?.amount || 0)} {fromAsset}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={fromAsset}
                  onChange={(e) => setFromAsset(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm font-bold text-white focus:outline-none"
                >
                  {['USD', ...Object.keys(assets)].map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="any"
                    id="input-convert-amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-lg font-bold text-white font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={handleSwapAssets}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 hover:text-white transition-transform hover:rotate-180"
                title="Swap assets"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* To Asset */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>To</span>
                <span className="font-mono">
                  Current: {formatCrypto(balances[toAsset]?.amount || 0)} {toAsset}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <select
                  value={toAsset}
                  onChange={(e) => setToAsset(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                >
                  {['USD', ...Object.keys(assets)].map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>
                <div className="flex-1 text-right font-mono text-lg font-bold text-emerald-400">
                  ≈ {formatCrypto(quote.toAmount)} {toAsset}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Quote Breakdown */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Rate Guarantee:</span>
            <span className="text-slate-200">
              1 {mode === 'buy' ? selectedAsset : mode === 'sell' ? selectedAsset : fromAsset} ={' '}
              {mode === 'buy' || mode === 'sell'
                ? formatUSD(pricesMap[selectedAsset])
                : `${(quote.exchangeRate).toFixed(6)} ${toAsset}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Simulated Fee:</span>
            <span className="text-emerald-400 font-semibold">$0.00 (Zero Fee Demo)</span>
          </div>
          <div className="flex justify-between text-slate-400 items-center">
            <span>Quote Expiry:</span>
            <span className="text-amber-400 flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {quoteCountdown}s
            </span>
          </div>
        </div>

        {/* Error Warning */}
        {hasError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={() => setIsConfirmModalOpen(true)}
          id="btn-preview-swap"
          size="lg"
          variant="primary"
          className="w-full font-bold shadow-xl text-base"
          disabled={numAmount <= 0 || hasError}
        >
          Preview {mode.toUpperCase()} Order
        </Button>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Simulated Order"
      >
        <div className="space-y-4 font-sans text-slate-200 text-sm">
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">You are spending:</span>
              <strong className="text-white font-mono">
                {numAmount} {spendAsset}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">You will receive:</span>
              <strong className="text-emerald-400 font-mono">
                {quote.toAmount} {mode === 'buy' ? selectedAsset : mode === 'sell' ? 'USD' : toAsset}
              </strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Execution Mode:</span>
              <span className="text-indigo-400 font-mono">Instant Sandbox Execution</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            This transaction is a virtual simulation. Your local sandbox balance will update immediately upon confirmation.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="md"
              id="btn-confirm-execute-swap"
              className="flex-1 font-bold"
              onClick={handleExecute}
            >
              Confirm & Execute
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Receipt Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Simulated Trade Completed!"
      >
        {lastReceipt && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">{lastReceipt.title}</h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Paid:</span>
                <span className="text-slate-200">{lastReceipt.paid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Received:</span>
                <span className="text-emerald-400 font-bold">{lastReceipt.received}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exchange Rate:</span>
                <span className="text-slate-300">{lastReceipt.rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Simulated Fee:</span>
                <span className="text-slate-300">{lastReceipt.fee}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full font-bold"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
