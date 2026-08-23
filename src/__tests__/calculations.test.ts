import { describe, it, expect } from 'vitest';
import {
  calculateTradeFee,
  calculateConvertQuote,
  validateBalance,
  calculatePortfolioSummary,
  SIMULATED_FEE_RATE,
} from '../utils/calculations';
import { CryptoAsset, WalletBalance } from '../types';

describe('Financial Calculations', () => {
  describe('calculateTradeFee', () => {
    it('returns 0 for non-positive amounts', () => {
      expect(calculateTradeFee(0)).toBe(0);
      expect(calculateTradeFee(-50)).toBe(0);
    });

    it('calculates 0.1% simulated fee correctly', () => {
      expect(calculateTradeFee(1000)).toBe(1); // 1000 * 0.001 = 1.00
      expect(calculateTradeFee(500, SIMULATED_FEE_RATE)).toBe(0.5);
    });
  });

  describe('calculateConvertQuote', () => {
    const mockPrices = {
      BTC: 50000,
      ETH: 3000,
      SOL: 150,
      USD: 1,
    };

    it('handles 0 amount gracefully', () => {
      const quote = calculateConvertQuote('BTC', 'ETH', 0, mockPrices);
      expect(quote.fromAmount).toBe(0);
      expect(quote.toAmount).toBe(0);
      expect(quote.exchangeRate).toBe(0);
    });

    it('calculates exchange rate and slippage accurately for BTC to ETH', () => {
      const quote = calculateConvertQuote('BTC', 'ETH', 1, mockPrices);
      // 1 BTC = $50,000. ETH = $3,000 -> 16.66666667 ETH before 0.05% slippage
      expect(quote.estimatedValueUSD).toBe(50000);
      expect(quote.exchangeRate).toBeCloseTo(16.66666667, 4);
      expect(quote.toAmount).toBeLessThan(16.66666667);
      expect(quote.fee).toBe(25); // 50000 * 0.0005 = $25 fee
    });

    it('throws error for unpriced asset', () => {
      expect(() => {
        calculateConvertQuote('UNKNOWN', 'ETH', 1, mockPrices);
      }).toThrow();
    });
  });

  describe('validateBalance', () => {
    it('validates sufficient balance', () => {
      const result = validateBalance(100, 50);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('flags insufficient balance with shortfall', () => {
      const result = validateBalance(50, 100);
      expect(result.valid).toBe(false);
      expect(result.shortfall).toBe(50);
      expect(result.error).toContain('Insufficient balance');
    });

    it('rejects zero or negative required amount', () => {
      expect(validateBalance(100, 0).valid).toBe(false);
      expect(validateBalance(100, -10).valid).toBe(false);
    });
  });

  describe('calculatePortfolioSummary', () => {
    const mockBalances: Record<string, WalletBalance> = {
      USD: { symbol: 'USD', name: 'US Dollar', amount: 5000, lockedInOrders: 0 },
      BTC: { symbol: 'BTC', name: 'Bitcoin', amount: 0.1, avgBuyPrice: 40000, lockedInOrders: 0 },
    };

    const mockAssets: Record<string, CryptoAsset> = {
      BTC: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 60000,
        change24h: 5.0,
        high24h: 61000,
        low24h: 58000,
        volume24h: 10000000,
        marketCap: 1200000000000,
        circulatingSupply: 19700000,
        maxSupply: 21000000,
        allTimeHigh: 73750,
        rank: 1,
        category: 'Layer 1',
        sparkline: [58000, 59000, 60000],
        description: 'Bitcoin',
        consensus: 'PoW',
        launchYear: 2009,
        color: '#F7931A',
        iconBg: 'bg-amber-500/20',
        decimals: 8,
      },
    };

    it('calculates total portfolio value and PnL correctly', () => {
      const summary = calculatePortfolioSummary(mockBalances, mockAssets);
      // USD = $5,000; BTC = 0.1 * 60000 = $6,000. Total = $11,000
      expect(summary.totalValueUSD).toBe(11000);
      // Cost basis: USD = $5,000, BTC = 0.1 * 40000 = $4,000. Total cost = $9,000
      // PnL = 11,000 - 9,000 = $2,000
      expect(summary.totalPnLUSD).toBe(2000);
      expect(summary.breakdown).toHaveLength(2);
    });
  });
});
