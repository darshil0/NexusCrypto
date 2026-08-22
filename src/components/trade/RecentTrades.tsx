import React, { useMemo } from 'react';
import { formatUSD } from '../../utils/formatters';

interface RecentTradesProps {
  currentPrice: number;
  baseAsset: string;
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ currentPrice, baseAsset }) => {
  // Deterministic trade feed
  const trades = useMemo(() => {
    const list = [];
    const now = Date.now();
    for (let i = 0; i < 14; i++) {
      const isBuy = Math.sin(i * 3.7 + currentPrice) > -0.1;
      const priceOffset = (Math.cos(i * 2.1) * 0.0008) * currentPrice;
      const price = currentPrice + priceOffset;
      const amount = Number((0.02 + Math.abs(Math.sin(i * 1.8)) * 0.85).toFixed(4));
      const time = new Date(now - i * 4000).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      list.push({ id: `trade-${i}`, price, amount, isBuy, time });
    }
    return list;
  }, [currentPrice]);

  return (
    <div className="flex flex-col h-full bg-[#161A1E] border border-gray-800 rounded-2xl overflow-hidden font-mono text-xs select-none">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-[#0B0E11]">
        <span className="font-semibold text-gray-200">Market Trades</span>
        <span className="text-[11px] text-green-400 flex items-center gap-1.5 font-sans">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          Live Feed
        </span>
      </div>

      <div className="grid grid-cols-3 px-4 py-1.5 text-[11px] text-gray-500 border-b border-gray-800 bg-[#0B0E11]/40">
        <span>Price (USD)</span>
        <span className="text-right">Amount ({baseAsset})</span>
        <span className="text-right">Time</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-800/40">
        {trades.map((t) => (
          <div key={t.id} className="grid grid-cols-3 px-4 py-1 hover:bg-gray-800/40 transition-colors">
            <span className={t.isBuy ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
              {formatUSD(t.price, 2, 2)}
            </span>
            <span className="text-right text-gray-300">{t.amount.toFixed(4)}</span>
            <span className="text-right text-gray-500 text-[10px]">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
