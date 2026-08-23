import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { formatUSD, formatCrypto, formatTimestamp } from '../../utils/formatters';
import { Badge, Button } from '../ui/BaseComponents';
import { Trash2, Clock } from 'lucide-react';

export const OrdersTable: React.FC = () => {
  const { orders, cancelOrder } = useDemo();
  const [tab, setTab] = useState<'open' | 'history'>('open');

  const openOrders = orders.filter((o) => o.status === 'open');
  const historyOrders = orders.filter((o) => o.status !== 'open');

  return (
    <div className="bg-[#161A1E] border border-gray-800 rounded-2xl overflow-hidden font-mono text-xs select-none">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#0B0E11]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('open')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'open'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Open Orders ({openOrders.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'history'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Order History ({historyOrders.length})
          </button>
        </div>
        <span className="text-[11px] text-gray-500 font-sans hidden sm:inline">
          Auto-matching against simulated live ticks
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto min-h-[160px]">
        {tab === 'open' ? (
          openOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 font-sans">
              <Clock className="w-8 h-8 mb-2 stroke-[1.5] text-gray-600" />
              <p>No active open paper orders.</p>
              <p className="text-xs text-gray-600 mt-1">Place a limit order to queue in the order book.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#0B0E11]/60 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-2.5">Time</th>
                  <th className="px-4 py-2.5">Pair</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Side</th>
                  <th className="px-4 py-2.5 text-right">Price</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                  <th className="px-4 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {openOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-2.5 text-gray-400">{formatTimestamp(ord.createdAt, 'time')}</td>
                    <td className="px-4 py-2.5 font-bold text-white">{ord.pair}</td>
                    <td className="px-4 py-2.5 text-gray-300 uppercase">{ord.type}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={ord.side === 'buy' ? 'emerald' : 'rose'}>
                        {ord.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-200">
                      {formatUSD(ord.price)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-300">
                      {formatCrypto(ord.amount)} {ord.baseAsset}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-300">
                      {formatUSD(ord.total)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => cancelOrder(ord.id)}
                        className="text-[10px] px-2 py-0.5"
                        leftIcon={<Trash2 className="w-3 h-3" />}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : historyOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 font-sans">
            <p>No historical orders recorded yet.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#0B0E11]/60 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Pair</th>
                <th className="px-4 py-2.5">Side</th>
                <th className="px-4 py-2.5 text-right">Price</th>
                <th className="px-4 py-2.5 text-right">Executed</th>
                <th className="px-4 py-2.5 text-right">Fee</th>
                <th className="px-4 py-2.5 text-right">Total</th>
                <th className="px-4 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {historyOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-2.5 text-gray-400">{formatTimestamp(ord.filledAt || ord.createdAt, 'short')}</td>
                  <td className="px-4 py-2.5 font-bold text-white">{ord.pair}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={ord.side === 'buy' ? 'emerald' : 'rose'}>
                      {ord.side.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-200">
                    {formatUSD(ord.price)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-300">
                    {formatCrypto(ord.filledAmount || ord.amount)} {ord.baseAsset}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-400">
                    {formatUSD(ord.fee)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-300">
                    {formatUSD(ord.total)}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Badge variant={ord.status === 'filled' ? 'emerald' : 'slate'}>
                      {ord.status === 'filled' ? 'FILLED' : 'CANCELLED'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
