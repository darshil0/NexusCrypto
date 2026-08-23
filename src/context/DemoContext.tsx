import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type {
  CryptoAsset,
  WalletBalance,
  Order,
  Transaction,
  PriceAlert,
  NotificationItem,
  UserSettings,
  SupportTicket,
  AssetSymbol,
  OrderSide,
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_BALANCES,
  INITIAL_TRANSACTIONS,
  INITIAL_ORDERS,
} from '../data/mockData';
import {
  calculateConvertQuote,
  calculatePortfolioSummary,
  calculateTradeFee,
  validateBalance,
} from '../utils/calculations';
import type { PortfolioSummary } from '../utils/calculations';
import { formatUSD } from '../utils/formatters';

import { safeStorage } from '../lib/errors/safe-storage';
import {
  validatePositiveNumber,
  validateWithdrawalAddress,
  validateOrderNotional,
  validatePrecision,
} from '../lib/errors/validation';

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface DemoContextType {
  assets: Record<string, CryptoAsset>;
  balances: Record<string, WalletBalance>;
  orders: Order[];
  transactions: Transaction[];
  watchlist: string[];
  alerts: PriceAlert[];
  notifications: NotificationItem[];
  settings: UserSettings;
  supportTickets: SupportTicket[];
  toasts: ToastItem[];
  portfolio: PortfolioSummary;
  activePair: string;
  setActivePair: (pair: string) => void;
  isProcessing: boolean;
  // Actions
  executeMarketTrade: (
    pair: string,
    side: OrderSide,
    amount: number
  ) => { success: boolean; error?: string; orderId?: string };
  placeLimitOrder: (
    pair: string,
    side: OrderSide,
    amount: number,
    limitPrice: number
  ) => { success: boolean; error?: string; orderId?: string };
  cancelOrder: (orderId: string) => { success: boolean; error?: string };
  executeConvert: (
    fromSymbol: string,
    toSymbol: string,
    fromAmount: number
  ) => { success: boolean; error?: string };
  simulateDeposit: (
    asset: string,
    amount: number,
    network: string
  ) => { success: boolean; error?: string };
  simulateWithdrawal: (
    asset: string,
    amount: number,
    address: string,
    network: string
  ) => { success: boolean; error?: string };
  toggleWatchlist: (symbol: string) => void;
  createAlert: (
    symbol: AssetSymbol,
    condition: 'above' | 'below' | 'change_pct',
    targetValue: number,
    note?: string
  ) => { success: boolean; error?: string };
  deleteAlert: (alertId: string) => void;
  rearmAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  clearTriggeredAlerts: () => void;
  clearAllAlerts: () => void;
  simulatePriceMovement: (symbol: AssetSymbol, newPrice: number) => void;
  testTriggerAlert: (alertId: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  submitSupportTicket: (subject: string, category: string, message: string) => { success: boolean; ticketId?: string; error?: string };
  resetDemoData: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  displayName: 'Demo Trader',
  avatarSeed: 'nexus-77',
  currency: 'USD',
  theme: 'dark',
  soundEnabled: true,
  notificationsEnabled: true,
  demoMfaEnabled: true,
  compactView: false,
  riskBannerDismissed: false,
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BALANCES: 'nexus_crypto_balances_v2',
  ORDERS: 'nexus_crypto_orders_v2',
  TRANSACTIONS: 'nexus_crypto_transactions_v2',
  WATCHLIST: 'nexus_crypto_watchlist_v2',
  ALERTS: 'nexus_crypto_alerts_v2',
  NOTIFICATIONS: 'nexus_crypto_notifications_v2',
  SETTINGS: 'nexus_crypto_settings_v2',
  TICKETS: 'nexus_crypto_tickets_v2',
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Record<string, CryptoAsset>>(INITIAL_ASSETS);
  const [isProcessing] = useState<boolean>(false);

  const [balances, setBalances] = useState<Record<string, WalletBalance>>(() =>
    safeStorage.get(STORAGE_KEYS.BALANCES, INITIAL_BALANCES, (val: any) => typeof val === 'object' && val !== null && 'USD' in val)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    safeStorage.get(STORAGE_KEYS.ORDERS, INITIAL_ORDERS, (val: any) => Array.isArray(val))
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    safeStorage.get(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS, (val: any) => Array.isArray(val))
  );
  const [watchlist, setWatchlist] = useState<string[]>(() =>
    safeStorage.get(STORAGE_KEYS.WATCHLIST, ['BTC', 'ETH', 'SOL', 'USDC', 'XRP'], (val: any) => Array.isArray(val))
  );
  const [alerts, setAlerts] = useState<PriceAlert[]>(() =>
    safeStorage.get(STORAGE_KEYS.ALERTS, [
      {
        id: 'alert-1',
        symbol: 'BTC',
        condition: 'above',
        targetValue: 70000,
        createdAt: Date.now() - 86400000,
        triggered: false,
        note: 'Breakout above $70k resistance',
      },
      {
        id: 'alert-2',
        symbol: 'ETH',
        condition: 'below',
        targetValue: 3400,
        createdAt: Date.now() - 86400000,
        triggered: false,
        note: 'Support retest zone',
      },
    ], (val: any) => Array.isArray(val))
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeStorage.get(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        title: 'Welcome to NexusCrypto Demo Sandbox',
        message: 'Your demo account is seeded with $25,000 USD and sample crypto balances.',
        type: 'info',
        timestamp: Date.now() - 3600000 * 2,
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Paper Limit Order Placed',
        message: 'Limit Buy 0.05 BTC at $63,500.00 is currently active in the order book.',
        type: 'trade',
        timestamp: Date.now() - 3600000,
        read: false,
      },
    ], (val: any) => Array.isArray(val))
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    safeStorage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS, (val: any) => typeof val === 'object' && val !== null)
  );
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    safeStorage.get(STORAGE_KEYS.TICKETS, [
      {
        id: 'TICK-8841',
        subject: 'Demo Faucet Limit Question',
        category: 'Demo Sandbox',
        message: 'How often can I reset or top up simulated funds in paper trading mode?',
        status: 'Simulated Response Available',
        createdAt: Date.now() - 86400000 * 2,
        response: 'You can reset your sandbox account at any time without limitation using the "Reset Demo Data" button in the navigation or settings.',
      },
    ], (val: any) => Array.isArray(val))
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activePair, setActivePair] = useState<string>('BTC/USD');

  // Multi-tab storage sync:
  // Re-hydrates state slices from storage events across browser tabs.
  // Note: Operates on a last-write-wins basis for top-level state slices.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (e.key === STORAGE_KEYS.BALANCES && typeof parsed === 'object') {
          setBalances(parsed);
        } else if (e.key === STORAGE_KEYS.ORDERS && Array.isArray(parsed)) {
          setOrders(parsed);
        } else if (e.key === STORAGE_KEYS.TRANSACTIONS && Array.isArray(parsed)) {
          setTransactions(parsed);
        } else if (e.key === STORAGE_KEYS.WATCHLIST && Array.isArray(parsed)) {
          setWatchlist(parsed);
        } else if (e.key === STORAGE_KEYS.ALERTS && Array.isArray(parsed)) {
          setAlerts(parsed);
        } else if (e.key === STORAGE_KEYS.NOTIFICATIONS && Array.isArray(parsed)) {
          setNotifications(parsed);
        } else if (e.key === STORAGE_KEYS.SETTINGS && typeof parsed === 'object') {
          setSettings(parsed);
        } else if (e.key === STORAGE_KEYS.TICKETS && Array.isArray(parsed)) {
          setSupportTickets(parsed);
        }
      } catch {
        // ignore malformed multi-tab updates
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync to safeStorage
  useEffect(() => { safeStorage.set(STORAGE_KEYS.BALANCES, balances); }, [balances]);
  useEffect(() => { safeStorage.set(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { safeStorage.set(STORAGE_KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { safeStorage.set(STORAGE_KEYS.WATCHLIST, watchlist); }, [watchlist]);
  useEffect(() => { safeStorage.set(STORAGE_KEYS.ALERTS, alerts); }, [alerts]);
  useEffect(() => { safeStorage.set(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);
  useEffect(() => { safeStorage.set(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { safeStorage.set(STORAGE_KEYS.TICKETS, supportTickets); }, [supportTickets]);

  // Apply dark / light theme class to root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Toast manager
  const addToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10B981', '#3B82F6', '#6366F1', '#F59E0B'],
      });
    } catch {
      // Ignore if not in full browser
    }
  }, []);

  // Price Simulation Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        const next = { ...prevAssets };

        Object.keys(next).forEach((sym) => {
          const current = next[sym];
          if (sym === 'USDC') {
            // USDC stays tight around 1.00
            const delta = (Math.random() - 0.5) * 0.0002;
            const newPrice = Math.max(0.9997, Math.min(1.0003, current.price + delta));
            next[sym] = {
              ...current,
              price: Number(newPrice.toFixed(4)),
            };
            return;
          }

          // Random percentage fluctuation between -0.3% and +0.3%
          const pct = (Math.random() - 0.49) * 0.006;
          const newPrice = Math.max(0.01, current.price * (1 + pct));
          const roundedPrice = sym === 'XRP' || sym === 'ADA' ? Number(newPrice.toFixed(4)) : Number(newPrice.toFixed(2));
          
          const newSparkline = [...current.sparkline.slice(1), roundedPrice];
          const newHigh = Math.max(current.high24h, roundedPrice);
          const newLow = Math.min(current.low24h, roundedPrice);
          const newChange = Number((current.change24h + (pct * 10)).toFixed(2));
          const newVolume = current.volume24h + Math.floor(Math.random() * 50000);

          next[sym] = {
            ...current,
            price: roundedPrice,
            sparkline: newSparkline,
            high24h: newHigh,
            low24h: newLow,
            change24h: newChange,
            volume24h: newVolume,
          };
        });

        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Alert check against live prices
  useEffect(() => {
    alerts.forEach((alert) => {
      if (alert.triggered) return;
      const asset = assets[alert.symbol];
      if (!asset) return;

      let shouldTrigger = false;
      if (alert.condition === 'above' && asset.price >= alert.targetValue) {
        shouldTrigger = true;
      } else if (alert.condition === 'below' && asset.price <= alert.targetValue) {
        shouldTrigger = true;
      } else if (alert.condition === 'change_pct' && Math.abs(asset.change24h) >= alert.targetValue) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        const trigPrice = asset.price;
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === alert.id
              ? {
                  ...a,
                  triggered: true,
                  triggeredAt: Date.now(),
                  triggeredPrice: trigPrice,
                  dismissed: false,
                }
              : a
          )
        );

        const notif: NotificationItem = {
          id: `notif-alert-${Date.now()}-${alert.id}`,
          title: `Price Alert: ${alert.symbol} Triggered!`,
          message: `${alert.symbol} crossed your ${alert.condition.toUpperCase()} target of ${formatUSD(
            alert.targetValue,
            alert.symbol === 'USDC' || alert.symbol === 'XRP' ? 4 : 2
          )} (Now ${formatUSD(trigPrice, alert.symbol === 'USDC' || alert.symbol === 'XRP' ? 4 : 2)}).`,
          type: 'alert',
          timestamp: Date.now(),
          read: false,
        };
        setNotifications((prev) => [notif, ...prev]);
        addToast('warning', notif.message, notif.title);
      }
    });
  }, [assets, alerts, addToast]);

  // Check if open limit orders should be filled
  useEffect(() => {
    orders.forEach((ord) => {
      if (ord.status !== 'open' || ord.type !== 'limit') return;

      const asset = assets[ord.baseAsset];
      if (!asset) return;

      let fill = false;
      if (ord.side === 'buy' && asset.price <= ord.price) {
        fill = true;
      } else if (ord.side === 'sell' && asset.price >= ord.price) {
        fill = true;
      }

      if (fill) {
        // Execute limit order fill!
        setOrders((prev) =>
          prev.map((o) =>
            o.id === ord.id
              ? { ...o, status: 'filled', filledAmount: o.amount, filledAt: Date.now() }
              : o
          )
        );

        // Update balances
        setBalances((prev) => {
          const next = { ...prev };
          const baseSymbol = ord.baseAsset;
          const quoteSymbol = ord.quoteAsset as 'USD' | 'USDC';

          if (ord.side === 'buy') {
            // Unlock quote funds and add base crypto
            const currentQuote = next[quoteSymbol] || { symbol: quoteSymbol, name: quoteSymbol, amount: 0, lockedInOrders: 0 };
            const currentBase = next[baseSymbol] || { symbol: baseSymbol, name: asset.name, amount: 0, lockedInOrders: 0 };

            next[quoteSymbol] = {
              ...currentQuote,
              lockedInOrders: Math.max(0, (currentQuote.lockedInOrders || 0) - ord.total),
            };

            const prevAmount = currentBase.amount || 0;
            const prevCost = prevAmount * (currentBase.avgBuyPrice ?? ord.price);
            const newTotalAmount = prevAmount + ord.amount;
            const newAvgBuy = newTotalAmount > 0 ? (prevCost + ord.total) / newTotalAmount : ord.price;

            next[baseSymbol] = {
              ...currentBase,
              amount: Number(newTotalAmount.toFixed(8)),
              avgBuyPrice: Number(newAvgBuy.toFixed(2)),
            };
          } else {
            // Sell: Unlock base crypto and add quote funds
            const currentBase = next[baseSymbol] || { symbol: baseSymbol, name: asset.name, amount: 0, lockedInOrders: 0 };
            const currentQuote = next[quoteSymbol] || { symbol: quoteSymbol, name: quoteSymbol, amount: 0, lockedInOrders: 0 };

            next[baseSymbol] = {
              ...currentBase,
              lockedInOrders: Math.max(0, (currentBase.lockedInOrders || 0) - ord.amount),
            };

            next[quoteSymbol] = {
              ...currentQuote,
              amount: Number(((currentQuote.amount || 0) + (ord.total - ord.fee)).toFixed(2)),
            };
          }

          return next;
        });

        // Add Transaction
        const tx: Transaction = {
          id: `tx-lim-${Date.now()}`,
          type: 'trade',
          asset: ord.baseAsset,
          amount: ord.amount,
          price: ord.price,
          fee: ord.fee,
          totalValueUSD: ord.total,
          status: 'completed',
          timestamp: Date.now(),
          notes: `Simulated Limit Order Executed: ${ord.side.toUpperCase()} ${ord.amount} ${ord.baseAsset} @ ${formatUSD(ord.price)}`,
          isSimulated: true,
        };
        setTransactions((prev) => [tx, ...prev]);

        addToast(
          'success',
          `Filled ${ord.side.toUpperCase()} ${ord.amount} ${ord.baseAsset} at ${formatUSD(ord.price)}`,
          'Limit Order Executed'
        );
      }
    });
  }, [assets, orders, addToast]);

  // Execute Market Trade
  const executeMarketTrade = useCallback(
    (pair: string, side: OrderSide, amount: number) => {
      const [baseStr, quoteStr] = pair.split('/');
      const baseAsset = baseStr as AssetSymbol;
      const quoteAsset = quoteStr || 'USD';
      const asset = assets[baseAsset];

      if (!asset) return { success: false, error: 'Asset not found' };

      const amountValidation = validatePositiveNumber(amount, 'Amount');
      if (!amountValidation.isValid) return { success: false, error: amountValidation.errorMessage };

      const precisionValidation = validatePrecision(amount, (baseAsset as string) === 'USD' ? 2 : 8);
      if (!precisionValidation.isValid) return { success: false, error: precisionValidation.errorMessage };

      const currentPrice = asset.price;
      const notionalValidation = validateOrderNotional(amount, currentPrice);
      if (!notionalValidation.isValid) return { success: false, error: notionalValidation.errorMessage };

      const totalCost = amount * currentPrice;
      const fee = calculateTradeFee(totalCost);

      let tradeError: string | undefined;

      if (side === 'buy') {
        const totalRequired = totalCost + fee;

        // Deduct Quote, Add Base atomically
        setBalances((prev) => {
          const quoteBalance = prev[quoteAsset]?.amount || 0;
          const validation = validateBalance(quoteBalance, totalRequired);
          if (!validation.valid) {
            tradeError = validation.error;
            return prev;
          }

          const currentQuote = prev[quoteAsset] || { symbol: quoteAsset as any, name: quoteAsset, amount: 0, lockedInOrders: 0 };
          const currentBase = prev[baseAsset] || { symbol: baseAsset, name: asset.name, amount: 0, lockedInOrders: 0 };

          const prevAmount = currentBase.amount || 0;
          const prevCost = prevAmount * (currentBase.avgBuyPrice ?? currentPrice);
          const newTotalAmount = prevAmount + amount;
          const newAvgPrice = newTotalAmount > 0 ? (prevCost + totalCost) / newTotalAmount : currentPrice;

          return {
            ...prev,
            [quoteAsset]: {
              ...currentQuote,
              amount: Number((currentQuote.amount - totalRequired).toFixed(2)),
            },
            [baseAsset]: {
              ...currentBase,
              amount: Number(newTotalAmount.toFixed(8)),
              avgBuyPrice: Number(newAvgPrice.toFixed(2)),
            },
          };
        });
      } else {
        // Sell
        const netReceived = totalCost - fee;
        setBalances((prev) => {
          const baseBalance = prev[baseAsset]?.amount || 0;
          const validation = validateBalance(baseBalance, amount);
          if (!validation.valid) {
            tradeError = validation.error;
            return prev;
          }

          const currentBase = prev[baseAsset] || { symbol: baseAsset, name: asset.name, amount: 0, lockedInOrders: 0 };
          const currentQuote = prev[quoteAsset] || { symbol: quoteAsset as any, name: quoteAsset, amount: 0, lockedInOrders: 0 };

          return {
            ...prev,
            [baseAsset]: {
              ...currentBase,
              amount: Number((currentBase.amount - amount).toFixed(8)),
            },
            [quoteAsset]: {
              ...currentQuote,
              amount: Number((currentQuote.amount + netReceived).toFixed(2)),
            },
          };
        });
      }

      if (tradeError) {
        return { success: false, error: tradeError };
      }

      const orderId = `ord-${Date.now()}`;
      const newOrder: Order = {
        id: orderId,
        pair,
        baseAsset,
        quoteAsset,
        side,
        type: 'market',
        price: currentPrice,
        amount,
        filledAmount: amount,
        total: totalCost,
        fee,
        status: 'filled',
        createdAt: Date.now(),
        filledAt: Date.now(),
        isPaperTrade: true,
      };

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        type: side === 'buy' ? 'buy' : 'sell',
        asset: baseAsset,
        amount,
        price: currentPrice,
        fee,
        totalValueUSD: totalCost,
        status: 'completed',
        timestamp: Date.now(),
        notes: `Paper Market Order: ${side.toUpperCase()} ${amount} ${baseAsset} @ ${formatUSD(currentPrice)}`,
        isSimulated: true,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setTransactions((prev) => [tx, ...prev]);

      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Paper Market ${side.toUpperCase()} Executed`,
        message: `Successfully simulated ${side} of ${amount} ${baseAsset} for ${formatUSD(totalCost)}.`,
        type: 'trade',
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast('success', notif.message, notif.title);
      triggerConfetti();

      return { success: true, orderId };
    },
    [assets, addToast, triggerConfetti]
  );

  // Place Limit Order
  const placeLimitOrder = useCallback(
    (pair: string, side: OrderSide, amount: number, limitPrice: number) => {
      const [baseStr, quoteStr] = pair.split('/');
      const baseAsset = baseStr as AssetSymbol;
      const quoteAsset = quoteStr || 'USD';
      const asset = assets[baseAsset];

      if (!asset) return { success: false, error: 'Asset not found' };

      const amountValidation = validatePositiveNumber(amount, 'Amount');
      if (!amountValidation.isValid) return { success: false, error: amountValidation.errorMessage };

      const priceValidation = validatePositiveNumber(limitPrice, 'Limit price');
      if (!priceValidation.isValid) return { success: false, error: priceValidation.errorMessage };

      const precisionValidation = validatePrecision(amount, (baseAsset as string) === 'USD' ? 2 : 8);
      if (!precisionValidation.isValid) return { success: false, error: precisionValidation.errorMessage };

      const notionalValidation = validateOrderNotional(amount, limitPrice);
      if (!notionalValidation.isValid) return { success: false, error: notionalValidation.errorMessage };

      const totalCost = amount * limitPrice;
      const fee = calculateTradeFee(totalCost);

      let orderError: string | undefined;

      if (side === 'buy') {
        const totalRequired = totalCost + fee;

        // Lock funds atomically
        setBalances((prev) => {
          const quoteBalance = prev[quoteAsset]?.amount || 0;
          const validation = validateBalance(quoteBalance, totalRequired);
          if (!validation.valid) {
            orderError = validation.error;
            return prev;
          }

          const currentQuote = prev[quoteAsset] || { symbol: quoteAsset as any, name: quoteAsset, amount: 0, lockedInOrders: 0 };
          return {
            ...prev,
            [quoteAsset]: {
              ...currentQuote,
              amount: Number((currentQuote.amount - totalRequired).toFixed(2)),
              lockedInOrders: Number(((currentQuote.lockedInOrders || 0) + totalRequired).toFixed(2)),
            },
          };
        });
      } else {
        // Lock crypto atomically
        setBalances((prev) => {
          const baseBalance = prev[baseAsset]?.amount || 0;
          const validation = validateBalance(baseBalance, amount);
          if (!validation.valid) {
            orderError = validation.error;
            return prev;
          }

          const currentBase = prev[baseAsset] || { symbol: baseAsset, name: asset.name, amount: 0, lockedInOrders: 0 };
          return {
            ...prev,
            [baseAsset]: {
              ...currentBase,
              amount: Number((currentBase.amount - amount).toFixed(8)),
              lockedInOrders: Number(((currentBase.lockedInOrders || 0) + amount).toFixed(8)),
            },
          };
        });
      }

      if (orderError) return { success: false, error: orderError };

      const orderId = `ord-lim-${Date.now()}`;
      const newOrder: Order = {
        id: orderId,
        pair,
        baseAsset,
        quoteAsset,
        side,
        type: 'limit',
        price: limitPrice,
        amount,
        filledAmount: 0,
        total: totalCost,
        fee,
        status: 'open',
        createdAt: Date.now(),
        isPaperTrade: true,
      };

      setOrders((prev) => [newOrder, ...prev]);

      const notif: NotificationItem = {
        id: `notif-lim-${Date.now()}`,
        title: `Open Paper Limit Order Placed`,
        message: `Limit ${side.toUpperCase()} ${amount} ${baseAsset} @ ${formatUSD(limitPrice)} is active.`,
        type: 'trade',
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
      addToast('info', notif.message, notif.title);

      return { success: true, orderId };
    },
    [assets, addToast]
  );

  // Cancel Order
  const cancelOrder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || order.status !== 'open') return { success: false, error: 'Order cannot be cancelled' };

      // Unlock locked balances
      setBalances((prev) => {
        const next = { ...prev };
        if (order.side === 'buy') {
          const quote = next[order.quoteAsset];
          if (quote) {
            const lockedAmount = order.total + order.fee;
            next[order.quoteAsset] = {
              ...quote,
              amount: Number((quote.amount + lockedAmount).toFixed(2)),
              lockedInOrders: Math.max(0, Number(((quote.lockedInOrders || 0) - lockedAmount).toFixed(2))),
            };
          }
        } else {
          const base = next[order.baseAsset];
          if (base) {
            next[order.baseAsset] = {
              ...base,
              amount: Number((base.amount + order.amount).toFixed(8)),
              lockedInOrders: Math.max(0, Number(((base.lockedInOrders || 0) - order.amount).toFixed(8))),
            };
          }
        }
        return next;
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      );

      addToast('info', `Order ${orderId.slice(0, 10)} has been cancelled. Funds unlocked.`);
      return { success: true };
    },
    [orders, addToast]
  );

  // Convert (Instant Crypto-to-Crypto or Fiat-to-Crypto)
  const executeConvert = useCallback(
    (fromSymbol: string, toSymbol: string, fromAmount: number) => {
      if (fromSymbol === toSymbol) return { success: false, error: 'Cannot convert an asset into itself' };

      const amountValidation = validatePositiveNumber(fromAmount, 'Conversion amount');
      if (!amountValidation.isValid) return { success: false, error: amountValidation.errorMessage };

      const precisionValidation = validatePrecision(fromAmount, fromSymbol === 'USD' ? 2 : 8);
      if (!precisionValidation.isValid) return { success: false, error: precisionValidation.errorMessage };

      const prices: Record<string, number> = {};
      Object.keys(assets).forEach((k) => {
        prices[k] = assets[k].price;
      });
      prices.USD = 1.0;

      const quote = calculateConvertQuote(fromSymbol, toSymbol, fromAmount, prices);

      let convertError: string | undefined;

      setBalances((prev) => {
        const available = prev[fromSymbol]?.amount || 0;
        const validation = validateBalance(available, fromAmount);
        if (!validation.valid) {
          convertError = validation.error;
          return prev;
        }

        const fromBal = prev[fromSymbol] || { symbol: fromSymbol as any, name: fromSymbol, amount: 0, lockedInOrders: 0 };
        const toBal = prev[toSymbol] || { symbol: toSymbol as any, name: toSymbol, amount: 0, lockedInOrders: 0 };

        const newFromAmount = fromBal.amount - fromAmount;
        const newToAmount = toBal.amount + quote.toAmount;

        return {
          ...prev,
          [fromSymbol]: {
            ...fromBal,
            amount: fromSymbol === 'USD' ? Number(newFromAmount.toFixed(2)) : Number(newFromAmount.toFixed(8)),
          },
          [toSymbol]: {
            ...toBal,
            amount: toSymbol === 'USD' ? Number(newToAmount.toFixed(2)) : Number(newToAmount.toFixed(8)),
            avgBuyPrice: toSymbol === 'USD' ? undefined : (prices[toSymbol] || 0),
          },
        };
      });

      if (convertError) return { success: false, error: convertError };

      const tx: Transaction = {
        id: `tx-cnv-${Date.now()}`,
        type: 'convert',
        asset: fromSymbol as any,
        toAsset: toSymbol as any,
        amount: fromAmount,
        toAmount: quote.toAmount,
        price: quote.exchangeRate,
        fee: quote.fee,
        totalValueUSD: quote.estimatedValueUSD,
        status: 'completed',
        timestamp: Date.now(),
        notes: `Instant Paper Convert: ${fromAmount} ${fromSymbol} -> ${quote.toAmount} ${toSymbol}`,
        isSimulated: true,
      };

      setTransactions((prev) => [tx, ...prev]);

      const notif: NotificationItem = {
        id: `notif-cnv-${Date.now()}`,
        title: 'Conversion Complete',
        message: `Converted ${fromAmount} ${fromSymbol} to ${quote.toAmount} ${toSymbol}.`,
        type: 'success',
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast('success', notif.message, notif.title);
      triggerConfetti();

      return { success: true };
    },
    [assets, addToast, triggerConfetti]
  );

  // Deposit Simulation
  const simulateDeposit = useCallback(
    (asset: string, amount: number, network: string) => {
      const amountValidation = validatePositiveNumber(amount, 'Deposit amount', 0.00000001, 10000000);
      if (!amountValidation.isValid) return { success: false, error: amountValidation.errorMessage };

      const precisionValidation = validatePrecision(amount, asset === 'USD' ? 2 : 8);
      if (!precisionValidation.isValid) return { success: false, error: precisionValidation.errorMessage };

      setBalances((prev) => {
        const current = prev[asset] || { symbol: asset as any, name: asset, amount: 0, lockedInOrders: 0 };
        return {
          ...prev,
          [asset]: {
            ...current,
            amount: asset === 'USD' ? Number((current.amount + amount).toFixed(2)) : Number((current.amount + amount).toFixed(8)),
          },
        };
      });

      const price = asset === 'USD' ? 1 : (assets[asset]?.price || 0);
      const totalUSD = amount * price;

      const tx: Transaction = {
        id: `tx-dep-${Date.now()}`,
        type: 'deposit',
        asset: asset as any,
        amount,
        fee: 0,
        totalValueUSD: totalUSD,
        network,
        toAddress: `demo_${asset.toLowerCase()}_${Math.random().toString(36).substr(2, 8)}`,
        status: 'completed',
        timestamp: Date.now(),
        notes: `Simulated Sandbox Deposit via ${network}`,
        isSimulated: true,
      };

      setTransactions((prev) => [tx, ...prev]);

      const notif: NotificationItem = {
        id: `notif-dep-${Date.now()}`,
        title: 'Demo Deposit Confirmed',
        message: `Simulated deposit of ${amount} ${asset} received via ${network}.`,
        type: 'success',
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
      addToast('success', notif.message, notif.title);
      triggerConfetti();

      return { success: true };
    },
    [assets, addToast, triggerConfetti]
  );

  // Withdrawal Simulation
  const simulateWithdrawal = useCallback(
    (asset: string, amount: number, address: string, network: string) => {
      const amountValidation = validatePositiveNumber(amount, 'Withdrawal amount');
      if (!amountValidation.isValid) return { success: false, error: amountValidation.errorMessage };

      const precisionValidation = validatePrecision(amount, asset === 'USD' ? 2 : 8);
      if (!precisionValidation.isValid) return { success: false, error: precisionValidation.errorMessage };

      const addressValidation = validateWithdrawalAddress(address);
      if (!addressValidation.isValid) return { success: false, error: addressValidation.errorMessage };

      const fee = asset === 'USD' ? 5.00 : asset === 'BTC' ? 0.0002 : asset === 'ETH' ? 0.002 : 0.01;
      const totalDeducted = amount + fee;

      let withdrawError: string | undefined;

      setBalances((prev) => {
        const available = prev[asset]?.amount || 0;
        if (asset === 'USD') {
          if (available < totalDeducted) {
            withdrawError = `Available balance ($${available.toFixed(2)}) does not cover withdrawal ($${amount.toFixed(2)}) + network fee ($${fee.toFixed(2)})`;
            return prev;
          }
        } else {
          if (available < totalDeducted) {
            withdrawError = `Available balance (${available} ${asset}) does not cover withdrawal (${amount} ${asset}) + simulated network fee (${fee} ${asset})`;
            return prev;
          }
        }

        const current = prev[asset] || { symbol: asset as any, name: asset, amount: 0, lockedInOrders: 0 };
        return {
          ...prev,
          [asset]: {
            ...current,
            amount: asset === 'USD' ? Number((current.amount - totalDeducted).toFixed(2)) : Number((current.amount - totalDeducted).toFixed(8)),
          },
        };
      });

      if (withdrawError) return { success: false, error: withdrawError };

      const price = asset === 'USD' ? 1 : (assets[asset]?.price || 0);
      const totalUSD = amount * price;

      const tx: Transaction = {
        id: `tx-wdr-${Date.now()}`,
        type: 'withdrawal',
        asset: asset as any,
        amount,
        fee,
        totalValueUSD: totalUSD,
        network,
        toAddress: address.trim(),
        status: 'completed',
        timestamp: Date.now(),
        notes: `Simulated Outbound Withdrawal to ${address.trim().slice(0, 8)}... (${network})`,
        isSimulated: true,
      };

      setTransactions((prev) => [tx, ...prev]);

      const notif: NotificationItem = {
        id: `notif-wdr-${Date.now()}`,
        title: 'Demo Withdrawal Processed',
        message: `Simulated withdrawal of ${amount} ${asset} sent to ${address.trim().slice(0, 10)}...`,
        type: 'info',
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
      addToast('success', notif.message, notif.title);

      return { success: true };
    },
    [assets, addToast]
  );

  // Watchlist Toggle
  const toggleWatchlist = useCallback(
    (symbol: string) => {
      setWatchlist((prev) => {
        const exists = prev.includes(symbol);
        const next = exists ? prev.filter((s) => s !== symbol) : [...prev, symbol];
        addToast('info', exists ? `Removed ${symbol} from watchlist` : `Added ${symbol} to watchlist`);
        return next;
      });
    },
    [addToast]
  );

  // Alerts
  const createAlert = useCallback(
    (symbol: AssetSymbol, condition: 'above' | 'below' | 'change_pct', targetValue: number, note?: string) => {
      if (!targetValue || targetValue <= 0) {
        return { success: false, error: 'Target price or percentage must be greater than zero' };
      }

      // Check duplicate alert
      const isDuplicate = alerts.some(
        (a) => a.symbol === symbol && a.condition === condition && Math.abs(a.targetValue - targetValue) < 0.0001
      );
      if (isDuplicate) {
        return { success: false, error: `An identical alert for ${symbol} (${condition} ${targetValue}) already exists.` };
      }

      const newAlert: PriceAlert = {
        id: `alert-${Date.now()}`,
        symbol,
        condition,
        targetValue,
        createdAt: Date.now(),
        triggered: false,
        note: note?.trim(),
      };
      setAlerts((prev) => [newAlert, ...prev]);
      addToast('success', `Alert set for ${symbol} when price goes ${condition} ${targetValue}`);
      return { success: true };
    },
    [alerts, addToast]
  );

  const deleteAlert = useCallback(
    (alertId: string) => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      addToast('info', 'Alert removed');
    },
    [addToast]
  );

  const rearmAlert = useCallback(
    (alertId: string) => {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, triggered: false, triggeredAt: undefined, triggeredPrice: undefined, dismissed: false }
            : a
        )
      );
      addToast('success', 'Alert re-armed and actively monitoring market prices');
    },
    [addToast]
  );

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a))
    );
  }, []);

  const clearTriggeredAlerts = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.triggered));
    addToast('info', 'Cleared all triggered alerts');
  }, [addToast]);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
    addToast('info', 'All price alerts removed');
  }, [addToast]);

  // Allows manual simulation of price shifts to test triggers
  const simulatePriceMovement = useCallback(
    (symbol: AssetSymbol, newPrice: number) => {
      if (!newPrice || newPrice <= 0) return;
      setAssets((prev) => {
        const current = prev[symbol];
        if (!current) return prev;
        const roundedPrice = symbol === 'XRP' || symbol === 'ADA' || symbol === 'USDC'
          ? Number(newPrice.toFixed(4))
          : Number(newPrice.toFixed(2));
        const newSparkline = [...current.sparkline.slice(1), roundedPrice];
        const newHigh = Math.max(current.high24h, roundedPrice);
        const newLow = Math.min(current.low24h, roundedPrice);
        const pctDiff = ((roundedPrice - current.price) / current.price) * 100;
        const newChange = Number((current.change24h + pctDiff).toFixed(2));

        return {
          ...prev,
          [symbol]: {
            ...current,
            price: roundedPrice,
            sparkline: newSparkline,
            high24h: newHigh,
            low24h: newLow,
            change24h: newChange,
          },
        };
      });
      addToast('info', `Simulated ${symbol} price updated to ${formatUSD(newPrice)}`);
    },
    [addToast]
  );

  const testTriggerAlert = useCallback(
    (alertId: string) => {
      const alert = alerts.find((a) => a.id === alertId);
      if (!alert) return;
      // Nudge price slightly beyond target
      const targetPrice =
        alert.condition === 'above'
          ? alert.targetValue * 1.002
          : alert.condition === 'below'
          ? alert.targetValue * 0.998
          : (assets[alert.symbol]?.price || 100) * 1.05;
      simulatePriceMovement(alert.symbol, targetPrice);
    },
    [alerts, assets, simulatePriceMovement]
  );

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    addToast('info', 'Notifications cleared');
  }, [addToast]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Support Tickets
  const submitSupportTicket = useCallback((subject: string, category: string, message: string) => {
    if (!subject.trim()) {
      return { success: false, error: 'Subject is required' };
    }
    if (!category || category === 'Select Category') {
      return { success: false, error: 'Please choose a category' };
    }
    if (message.trim().length < 10) {
      return { success: false, error: 'Please describe the issue using at least 10 characters.' };
    }

    const id = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id,
      subject: subject.trim(),
      category,
      message: message.trim(),
      status: 'Open',
      createdAt: Date.now(),
      response: 'Thank you for reaching out! In this demo environment, tickets are stored locally. Support response simulated automatically.',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    addToast('success', `Demo support ticket #${id} submitted!`);
    return { success: true, ticketId: id };
  }, [addToast]);

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    safeStorage.clear();
    setBalances(INITIAL_BALANCES);
    setOrders(INITIAL_ORDERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setWatchlist(['BTC', 'ETH', 'SOL', 'USDC', 'XRP']);
    setAlerts([]);
    setSettings(DEFAULT_SETTINGS);
    setAssets(INITIAL_ASSETS);

    const notif: NotificationItem = {
      id: `notif-reset-${Date.now()}`,
      title: 'Demo Account Reset',
      message: 'Demo balances restored to $25,000 USD, 0.12 BTC, 2.5 ETH, 35 SOL, 2,000 USDC, 1,000 XRP.',
      type: 'info',
      timestamp: Date.now(),
      read: false,
    };
    setNotifications([notif]);
    addToast('info', 'Demo account restored to initial sandbox state.');
  }, [addToast]);

  // Portfolio calculation
  const portfolio = useMemo(() => {
    return calculatePortfolioSummary(balances, assets);
  }, [balances, assets]);

  return (
    <DemoContext.Provider
      value={{
        assets,
        balances,
        orders,
        transactions,
        watchlist,
        alerts,
        notifications,
        settings,
        supportTickets,
        toasts,
        portfolio,
        activePair,
        setActivePair,
        isProcessing,
        executeMarketTrade,
        placeLimitOrder,
        cancelOrder,
        executeConvert,
        simulateDeposit,
        simulateWithdrawal,
        toggleWatchlist,
        createAlert,
        deleteAlert,
        rearmAlert,
        dismissAlert,
        clearTriggeredAlerts,
        clearAllAlerts,
        simulatePriceMovement,
        testTriggerAlert,
        markNotificationAsRead,
        clearAllNotifications,
        updateSettings,
        submitSupportTicket,
        resetDemoData,
        addToast,
        removeToast,
        triggerConfetti,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
