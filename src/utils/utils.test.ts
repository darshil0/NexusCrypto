import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateTradeFee,
  calculateConvertQuote,
  validateBalance,
  calculatePortfolioSummary,
} from './calculations';
import { safeStorage } from '../lib/errors/safe-storage';
import { validatePositiveNumber, validateWithdrawalAddress } from '../lib/errors/validation';
import { formatUSD, formatCrypto } from './formatters';

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

  it('validates balance accurately', () => {
    expect(validateBalance(100, 50).valid).toBe(true);
    expect(validateBalance(100, 150).valid).toBe(false);
    expect(validateBalance(100, 150).shortfall).toBe(50);
  });

  it('calculates portfolio summary', () => {
    const balances = {
      USD: { symbol: 'USD', name: 'US Dollar', amount: 1000 },
      BTC: { symbol: 'BTC', name: 'Bitcoin', amount: 1, avgBuyPrice: 60000 },
    };
    const assets = {
      BTC: {
        symbol: 'BTC',
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
      },
    };
    const summary = calculatePortfolioSummary(balances as any, assets as any);
    expect(summary.totalValueUSD).toBe(66000);
    expect(summary.totalPnLUSD).toBe(5000);
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
});

describe('Validation Utility', () => {
  it('validates positive numbers', () => {
    expect(validatePositiveNumber(10).isValid).toBe(true);
    expect(validatePositiveNumber(-5).isValid).toBe(false);
    expect(validatePositiveNumber('invalid').isValid).toBe(false);
  });

  it('validates withdrawal addresses', () => {
    expect(validateWithdrawalAddress('0x1234567890abcdef1234567890').isValid).toBe(true);
    expect(validateWithdrawalAddress('short').isValid).toBe(false);
  });
});

describe('Formatters Utility', () => {
  it('formats USD currency correctly', () => {
    expect(formatUSD(1234.56)).toBe('$1,234.56');
    expect(formatUSD(0)).toBe('$0.00');
  });

  it('formats crypto amounts with precision', () => {
    expect(formatCrypto(0.12345678, 8)).toContain('0.12345678');
  });
});
