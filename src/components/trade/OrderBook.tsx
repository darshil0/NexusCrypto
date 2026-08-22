import React, { useMemo } from 'react';
import { formatUSD } from '../../utils/formatters';

interface OrderBookProps {
  currentPrice: number;
  baseAsset: string;
  quoteAsset: string;
  onSelectPrice?: (price: number) => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  currentPrice,
  baseAsset,
  quoteAsset,
  onSelectPrice,
}) => {
  // Generate 8 ask levels and 8 bid levels centered around currentPrice
  const { asks, bids, spread, spreadPct } = useMemo(() => {
    const step = currentPrice * 0.0006;
    const rawAsks = [];
    const rawBids = [];

    let totalAskVol = 0;
    for (let i = 8; i >= 1; i--) {
      const price = currentPrice + i * step;
      const amount = Number((0.15 + (Math.sin(i * 1.5) + 1) * 0.8).toFixed(4));
      totalAskVol += amount;
      rawAsks.push({ price, amount, total: totalAskVol });
    }

    let totalBidVol = 0;
    for (let i = 1; i <= 8; i++) {
      const price = currentPrice - i * step;
      const amount = Number((0.2 + (Math.cos(i * 1.2) + 1) * 0.75).toFixed(4));
      totalBidVol += amount;
      rawBids.push({ price, amount, total: totalBidVol });
    }

    const lowestAsk = rawAsks[rawAsks.length - 1]?.price || currentPrice;
    const highestBid = rawBids[0]?.price || currentPrice;
    const spread = Math.max(0, lowestAsk - highestBid);
    const spreadPct = (spread / currentPrice) * 100;

    return { asks: rawAsks, bids: rawBids, spread, spreadPct };
  }, [currentPrice]);

  const maxTotal = Math.max(
    ...asks.map((a) => a.total),
    ...bids.map((b) => b.total)
  ) || 1;

  return (
    <div className="flex flex-col h-full bg-[#161A1E] border border-gray-800 rounded-2xl overflow-hidden font-mono text-xs select-none">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-[#0B0E11]">
        <span className="font-semibold text-gray-200">Order Book (Simulated)</span>
        <span className="text-[11px] text-gray-400">Spread: {formatUSD(spread, 2, 2)} ({spreadPct.toFixed(3)}%)</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 px-4 py-1.5 text-[11px] text-gray-500 border-b border-gray-800 bg-[#0B0E11]/40">
        <span>Price ({quoteAsset})</span>
        <span className="text-right">Size ({baseAsset})</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells - Red) */}
      <div className="flex flex-col justify-end flex-1 overflow-hidden py-1">
        {asks.map((ask, idx) => {
          const depthPct = (ask.total / maxTotal) * 100;
          return (
            <div
              key={`ask-${idx}`}
              onClick={() => onSelectPrice && onSelectPrice(ask.price)}
              className="relative grid grid-cols-3 px-4 py-0.5 hover:bg-red-500/10 cursor-pointer transition-colors"
            >
              <div
                className="absolute inset-y-0 right-0 bg-red-500/10 pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-red-400 font-semibold">{formatUSD(ask.price, 2, 2)}</span>
              <span className="text-right text-gray-300">{ask.amount.toFixed(4)}</span>
              <span className="text-right text-gray-500">{ask.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* Mid Price Bar */}
      <div className="flex items-center justify-between px-4 py-2 my-0.5 bg-[#0B0E11] border-y border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">{formatUSD(currentPrice, 2, 2)}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-sans font-bold">
            MID
          </span>
        </div>
        <span className="text-[11px] text-gray-500">Deterministic Book</span>
      </div>

      {/* Bids (Buys - Green) */}
      <div className="flex flex-col flex-1 overflow-hidden py-1">
        {bids.map((bid, idx) => {
          const depthPct = (bid.total / maxTotal) * 100;
          return (
            <div
              key={`bid-${idx}`}
              onClick={() => onSelectPrice && onSelectPrice(bid.price)}
              className="relative grid grid-cols-3 px-4 py-0.5 hover:bg-green-500/10 cursor-pointer transition-colors"
            >
              <div
                className="absolute inset-y-0 right-0 bg-green-500/10 pointer-events-none"
                style={{ width: `${depthPct}%` }}
              />
              <span className="text-green-400 font-semibold">{formatUSD(bid.price, 2, 2)}</span>
              <span className="text-right text-gray-300">{bid.amount.toFixed(4)}</span>
              <span className="text-right text-gray-500">{bid.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
