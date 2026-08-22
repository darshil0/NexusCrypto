import React, { useState, useMemo } from 'react';
import { useDemo } from '../context/DemoContext';
import { formatUSD, formatCrypto, formatTimestamp, exportToCSV } from '../utils/formatters';
import {
  Download,
  Filter,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Activity,
  Calendar,
  Layers,
} from 'lucide-react';
import { Badge, Button, Card } from '../components/ui/BaseComponents';

export const HistoryPage: React.FC = () => {
  const { transactions } = useDemo();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (assetFilter !== 'all' && tx.asset !== assetFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(q);
        const matchesAsset = tx.asset.toLowerCase().includes(q);
        const matchesType = tx.type.toLowerCase().includes(q);
        if (!matchesId && !matchesAsset && !matchesType) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, assetFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Asset', 'Amount', 'Price (USD)', 'Fee (USD)', 'Total Value (USD)', 'Status', 'Timestamp', 'Notes'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.type.toUpperCase(),
      tx.asset,
      tx.amount,
      tx.price ? tx.price.toFixed(2) : 'N/A',
      tx.fee.toFixed(2),
      tx.totalValueUSD.toFixed(2),
      tx.status,
      new Date(tx.timestamp).toISOString(),
      tx.notes || ''
    ]);
    exportToCSV(`NexusCrypto_Ledger_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const assetList = ['all', 'BTC', 'ETH', 'SOL', 'USDC', 'XRP', 'USD'];
  const typeList = ['all', 'buy', 'sell', 'convert', 'trade', 'deposit', 'withdrawal'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 select-none">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Transaction Ledger</h1>
            <Badge variant="indigo">Simulated History</Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Complete audit trail of all paper trades, instant conversions, deposits, and simulated transfers.
          </p>
        </div>

        <Button
          size="md"
          variant="secondary"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4 h-4 text-emerald-400" />}
          className="font-bold shrink-0"
        >
          Export to CSV ({filteredTransactions.length})
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {typeList.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                  typeFilter === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Asset Dropdown & Search */}
          <div className="flex items-center gap-2">
            <select
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none"
            >
              {assetList.map((a) => (
                <option key={a} value={a}>
                  Asset: {a.toUpperCase()}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tx ID or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Time</th>
                <th className="px-6 py-3.5">Tx ID</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Asset</th>
                <th className="px-6 py-3.5 text-right">Amount</th>
                <th className="px-6 py-3.5 text-right">Price</th>
                <th className="px-6 py-3.5 text-right">Total Value (USD)</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                    No transactions matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'buy' || tx.type === 'deposit';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                      <td className="px-6 py-3.5 text-slate-400 text-[11px]">
                        {formatTimestamp(tx.timestamp, 'full')}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 text-[11px] font-bold">
                        {tx.id.slice(0, 10)}...
                      </td>
                      <td className="px-6 py-3.5 font-sans">
                        <span className="font-bold text-xs uppercase text-slate-200">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-white">
                        {tx.asset}
                      </td>
                      <td className={`px-6 py-3.5 text-right font-bold ${isCredit ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {formatCrypto(tx.amount)} {tx.asset}
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-400">
                        {tx.price ? formatUSD(tx.price) : '—'}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-slate-100">
                        {formatUSD(tx.totalValueUSD)}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <Badge variant="emerald" size="sm">
                          Completed
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
