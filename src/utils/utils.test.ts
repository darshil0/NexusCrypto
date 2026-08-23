import { describe, it, expect, beforeEach } from 'vitest';
import type { CryptoAsset, WalletBalance, AssetSymbol } from '../types';
import {
  calculateTradeFee,
  calculateConvertQuote,
  validateBalance,
  calculatePortfolioSummary,
} from './calculations';
import { safeStorage } from '../lib/errors/safe-storage';
import {
  validateRequired,
  validatePositiveNumber,
  validatePrecision,
  validateOrderNotional,
  validateWithdrawalAddress,
  validateSupportTicket,
} from '../lib/errors/validation';
import {
  formatUSD,
  formatCrypto,
  formatPercent,
  formatCompactNumber,
  formatTimestamp,
} from './formatters';

describe('Calculations Utility', () => {
  it('calculates trade fees correctly', () => {
    expect(calculateTradeFee(1000)).toBe(1.0);
    expect(calculateTradeFee(0)).toBe(0);
    expect(calculateTradeFee(-50)).toBe(0);
  });

  it('calculates convert quote correctly', () => {
    const prices = { BTC: 65000, ETH: 3500, USD: 1 };
    const quote = calculateConvertQuote('BTC', 'ETH', 1, prices);
    expect(quote.fromSymbol).toBe('BTC');
    expect(quote.toSymbol).toBe('ETH');
    expect(quote.estimatedValueUSD).toBe(65000);
    expect(quote.toAmount).toBeGreaterThan(0);
  });

  it('throws error for invalid asset pricing in convert quote', () => {
    const prices = { BTC: 0, ETH: 3500 };
    expect(() => calculateConvertQuote('BTC', 'ETH', 1, prices)).toThrow('Invalid asset pricing for conversion');
  });

  it('validates balance accurately with floating-point epsilon tolerance', () => {
    expect(validateBalance(100, 50).valid).toBe(true);
    expect(validateBalance(100, 100.00000000000001).valid).toBe(true);
    expect(validateBalance(100, 150).valid).toBe(false);
    expect(validateBalance(100, 150).shortfall).toBe(50);
  });

  it('calculates portfolio summary', () => {
    const balances = {
      USD: { symbol: 'USD' as AssetSymbol, name: 'US Dollar', amount: 1000, locked: 0 },
      BTC: { symbol: 'BTC' as AssetSymbol, name: 'Bitcoin', amount: 1, avgBuyPrice: 60000, locked: 0 },
    } as unknown as Record<AssetSymbol, WalletBalance>;
    const assets = {
      BTC: {
        symbol: 'BTC' as AssetSymbol,
        name: 'Bitcoin',
        price: 65000,
        change24h: 5,
        high24h: 66000,
        low24h: 59000,
        volume24h: 100000,
        marketCap: 1000000,
        sparkline: [60000, 65000],
        category: 'Layer 1',
        description: 'Bitcoin',
        color: '#F7931A',
        decimals: 8,
      },
    } as unknown as Record<AssetSymbol, CryptoAsset>;
    const summary = calculatePortfolioSummary(balances, assets);
    expect(summary.totalValueUSD).toBe(66000);
    expect(summary.totalPnLUSD).toBe(5000);
  });

  it('handles 0 avgBuyPrice cost basis correctly without replacing with current price', () => {
    const balances = {
      BTC: { symbol: 'BTC' as AssetSymbol, name: 'Bitcoin', amount: 1, avgBuyPrice: 0, locked: 0 },
    } as unknown as Record<AssetSymbol, WalletBalance>;
    const assets = {
      BTC: {
        symbol: 'BTC' as AssetSymbol,
        name: 'Bitcoin',
        price: 50000,
        change24h: 0,
        high24h: 50000,
        low24h: 50000,
        volume24h: 1000,
        marketCap: 1000000,
        sparkline: [50000],
        category: 'Layer 1',
        description: 'Bitcoin',
        color: '#F7931A',
        decimals: 8,
      },
    } as unknown as Record<AssetSymbol, CryptoAsset>;
    const summary = calculatePortfolioSummary(balances, assets);
    expect(summary.totalValueUSD).toBe(50000);
    expect(summary.totalPnLUSD).toBe(50000);
    expect(summary.breakdown[0]?.avgBuyPrice).toBe(0);
  });
});

describe('SafeStorage Utility', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  it('saves and retrieves values safely', () => {
    safeStorage.set('test_key', { foo: 'bar' });
    const retrieved = safeStorage.get('test_key', null);
    expect(retrieved).toEqual({ foo: 'bar' });
  });

  it('returns fallback if key not found', () => {
    const val = safeStorage.get('non_existent', 'default');
    expect(val).toBe('default');
  });

  it('uses validator function when provided', () => {
    safeStorage.set('invalid_key', 'not an array');
    const val = safeStorage.get('invalid_key', ['default'], (v) => Array.isArray(v));
    expect(val).toEqual(['default']);
  });

  it('removes keys correctly', () => {
    safeStorage.set('remove_me', 'hello');
    expect(safeStorage.get('remove_me', null)).toBe('hello');
    safeStorage.remove('remove_me');
    expect(safeStorage.get('remove_me', null)).toBeNull();
  });
});

describe('Validation Utility', () => {
  it('validates required fields', () => {
    expect(validateRequired('test').isValid).toBe(true);
    expect(validateRequired('').isValid).toBe(false);
    expect(validateRequired(null).isValid).toBe(false);
  });

  it('validates positive numbers and boundaries', () => {
    expect(validatePositiveNumber(10).isValid).toBe(true);
    expect(validatePositiveNumber(-5).isValid).toBe(false);
    expect(validatePositiveNumber('invalid').isValid).toBe(false);
    expect(validatePositiveNumber(0.000000001, 'Amount', 0.01).isValid).toBe(false);
    expect(validatePositiveNumber(20000000, 'Amount', 0.01, 10000000).isValid).toBe(false);
  });

  it('validates precision', () => {
    expect(validatePrecision(10.123, 4).isValid).toBe(true);
    expect(validatePrecision(10.12345, 4).isValid).toBe(false);
  });

  it('validates order notional boundaries', () => {
    expect(validateOrderNotional(1, 10).isValid).toBe(true);
    expect(validateOrderNotional(0.01, 10, 1.0).isValid).toBe(false);
    expect(validateOrderNotional(100, 20000, 1.0, 1000000).isValid).toBe(false);
  });

  it('validates withdrawal addresses', () => {
    expect(validateWithdrawalAddress('0x1234567890abcdef1234567890').isValid).toBe(true);
    expect(validateWithdrawalAddress('short').isValid).toBe(false);
    expect(validateWithdrawalAddress('   ').isValid).toBe(false);
    expect(validateWithdrawalAddress('0x1234567890abcdef1234567890!@#$').isValid).toBe(false);
  });

  it('validates support ticket inputs', () => {
    expect(validateSupportTicket('Help with order', 'Trading', 'This is a long message about an issue').isValid).toBe(true);
    expect(validateSupportTicket('', 'Trading', 'Message text here').isValid).toBe(false);
    expect(validateSupportTicket('Subject', 'Select Category', 'Message text here').isValid).toBe(false);
    expect(validateSupportTicket('Subject', 'Trading', 'Too short').isValid).toBe(false);
  });
});

describe('Formatters Utility', () => {
  it('formats USD currency correctly', () => {
    expect(formatUSD(1234.56)).toBe('$1,234.56');
    expect(formatUSD(0)).toBe('$0.00');
    expect(formatUSD(NaN)).toBe('$0.00');
    expect(formatUSD(0.0001)).toBe('$0.0001');
  });

  it('formats crypto amounts with precision', () => {
    expect(formatCrypto(0.12345678, 8)).toContain('0.12345678');
    expect(formatCrypto(0)).toBe('0');
    expect(formatCrypto(NaN)).toBe('0.0000');
  });

  it('formats percent values with signs', () => {
    expect(formatPercent(5.25)).toBe('+5.25%');
    expect(formatPercent(-3.1)).toBe('-3.10%');
    expect(formatPercent(NaN)).toBe('0.00%');
  });

  it('formats compact numbers', () => {
    expect(formatCompactNumber(1500000000000)).toBe('$1.50T');
    expect(formatCompactNumber(2500000000)).toBe('$2.50B');
    expect(formatCompactNumber(3500000)).toBe('$3.50M');
    expect(formatCompactNumber(4500)).toBe('$4.50K');
    expect(formatCompactNumber(120)).toBe('$120.00');
  });

  it('formats timestamps correctly', () => {
    const ts = new Date('2025-01-01T12:00:00Z').getTime();
    expect(formatTimestamp(ts, 'time')).toBeDefined();
    expect(formatTimestamp(ts, 'full')).toBeDefined();
    expect(formatTimestamp(ts, 'short')).toBeDefined();
  });
});
