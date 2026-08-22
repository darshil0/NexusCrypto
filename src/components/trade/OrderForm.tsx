import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { AssetSymbol, OrderSide, OrderType } from '../../types';
import { formatUSD, formatCrypto } from '../../utils/formatters';
import { calculateTradeFee, validateBalance } from '../../utils/calculations';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/BaseComponents';

interface OrderFormProps {
  pair: string;
  externalPrice?: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({ pair, externalPrice }) => {
  const { assets, balances, executeMarketTrade, placeLimitOrder } = useDemo();

  const [baseStr, quoteStr] = pair.split('/');
  const baseSymbol = (baseStr || 'BTC') as AssetSymbol;
  const quoteSymbol = quoteStr || 'USD';

  const asset = assets[baseSymbol];
  const currentPrice = asset?.price || 50000;

  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [amount, setAmount] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>(currentPrice.toString());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync external price click from order book if limit order
  useEffect(() => {
    if (externalPrice && orderType === 'limit') {
      setLimitPrice(externalPrice.toString());
    }
  }, [externalPrice, orderType]);

  // Update limit price default when pair changes
  useEffect(() => {
    setLimitPrice(currentPrice.toString());
  }, [pair, currentPrice]);

  const numAmount = parseFloat(amount) || 0;
  const activePrice = orderType === 'market' ? currentPrice : parseFloat(limitPrice) || currentPrice;
  const estimatedTotal = numAmount * activePrice;
  const estimatedFee = calculateTradeFee(estimatedTotal);

  // Available balances
  const availableQuote = balances[quoteSymbol]?.amount || 0;
  const availableBase = balances[baseSymbol]?.amount || 0;

  // Validation
  let hasError = false;
  let errorMessage = '';

  if (numAmount > 0) {
    if (side === 'buy') {
      const requiredTotal = estimatedTotal + estimatedFee;
      const val = validateBalance(availableQuote, requiredTotal);
      if (!val.valid) {
        hasError = true;
        errorMessage = val.error || 'Insufficient funds';
      }
    } else {
      const val = validateBalance(availableBase, numAmount);
      if (!val.valid) {
        hasError = true;
        errorMessage = val.error || 'Insufficient crypto balance';
      }
    }
  }

  const handlePercentage = (pct: number) => {
    if (side === 'buy') {
      if (availableQuote <= 0) return;
      const targetQuoteSpend = (availableQuote * pct) / 100;
      // Account for 0.1% fee
      const effectiveSpend = targetQuoteSpend / 1.001;
      const calculatedAmount = effectiveSpend / activePrice;
      const precision = baseSymbol === 'BTC' ? 6 : baseSymbol === 'ETH' ? 4 : 2;
      setAmount(calculatedAmount.toFixed(precision));
    } else {
      if (availableBase <= 0) return;
      const calculatedAmount = (availableBase * pct) / 100;
      const precision = baseSymbol === 'BTC' ? 6 : baseSymbol === 'ETH' ? 4 : 2;
      setAmount(calculatedAmount.toFixed(precision));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0 || hasError) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (orderType === 'market') {
        executeMarketTrade(pair, side, numAmount);
      } else {
        const p = parseFloat(limitPrice) || currentPrice;
        placeLimitOrder(pair, side, numAmount, p);
      }
      setAmount('');
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <div className="bg-[#161A1E] border border-gray-800 rounded-2xl p-4 flex flex-col justify-between select-none">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Buy / Sell Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0B0E11] rounded-xl border border-gray-800">
          <button
            type="button"
            id="trade-tab-buy"
            onClick={() => setSide('buy')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              side === 'buy'
                ? 'bg-green-600 text-white shadow-[0_4px_12px_rgba(22,163,74,0.3)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            BUY {baseSymbol}
          </button>
          <button
            type="button"
            id="trade-tab-sell"
            onClick={() => setSide('sell')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              side === 'sell'
                ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.3)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SELL {baseSymbol}
          </button>
        </div>

        {/* Order Type Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-800 pb-2 text-xs">
          <button
            type="button"
            id="order-type-market"
            onClick={() => setOrderType('market')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              orderType === 'market'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Market
          </button>
          <button
            type="button"
            id="order-type-limit"
            onClick={() => setOrderType('limit')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              orderType === 'limit'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Limit
          </button>
        </div>

        {/* Balance Row */}
        <div className="flex items-center justify-between text-xs text-gray-400 bg-[#0B0E11] px-3 py-2 rounded-lg border border-gray-800">
          <span>Available:</span>
          <span className="font-mono font-medium text-gray-200">
            {side === 'buy'
              ? `${formatUSD(availableQuote)} ${quoteSymbol}`
              : `${formatCrypto(availableBase)} ${baseSymbol}`}
          </span>
        </div>

        {/* Limit Price Input if limit order */}
        {orderType === 'limit' && (
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium flex justify-between">
              <span>Limit Price</span>
              <span className="font-mono text-indigo-400 cursor-pointer" onClick={() => setLimitPrice(currentPrice.toString())}>
                Current: {formatUSD(currentPrice)}
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                id="input-limit-price"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="w-full bg-[#0B0E11] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-mono">
                {quoteSymbol}
              </span>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">Order Amount</label>
          <div className="relative">
            <input
              type="number"
              step="any"
              id="input-order-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full bg-[#0B0E11] border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none ${
                hasError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-800 focus:border-indigo-500'
              }`}
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-mono font-semibold">
              {baseSymbol}
            </span>
          </div>
        </div>

        {/* Percentage Shortcuts */}
        <div className="grid grid-cols-4 gap-1.5">
          {[0.25, 0.50, 0.75, 1.0].map((pct) => (
            <button
              key={pct}
              type="button"
              id={`btn-pct-${pct * 100}`}
              onClick={() => handlePercentage(pct * 100)}
              className="py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-semibold text-gray-300 transition-colors border border-gray-700/60"
            >
              {pct * 100}%
            </button>
          ))}
        </div>

        {/* Cost Summary Box */}
        <div className="space-y-1.5 p-3 rounded-xl bg-[#0B0E11] border border-gray-800 text-xs font-mono">
          <div className="flex justify-between text-gray-400">
            <span>Execution:</span>
            <span className="text-gray-200">
              {orderType === 'market' ? 'Instant (Simulated)' : 'Order Book Queue'}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Est. Total:</span>
            <span className="text-white font-semibold">{formatUSD(estimatedTotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Simulated Fee (0.1%):</span>
            <span className="text-gray-300">{formatUSD(estimatedFee)}</span>
          </div>
        </div>

        {/* Error Warning */}
        {hasError && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <Button
          type="submit"
          id="btn-submit-paper-trade"
          variant={side === 'buy' ? 'success' : 'danger'}
          size="lg"
          className="w-full font-bold shadow-lg"
          disabled={numAmount <= 0 || hasError || isSubmitting}
          isLoading={isSubmitting}
        >
          {side === 'buy' ? 'PAPER BUY' : 'PAPER SELL'} {baseSymbol}
        </Button>
      </form>

      {/* Disclaimers & Demo Notice */}
      <div className="mt-4 pt-3 border-t border-gray-800 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Paper Trading Demo • No Real Capital At Risk</span>
        </div>
      </div>
    </div>
  );
};
