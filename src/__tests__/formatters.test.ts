import { describe, it, expect } from 'vitest';
import {
  formatUSD,
  formatCrypto,
  formatPercent,
  formatCompactNumber,
  formatTimestamp,
} from '../utils/formatters';

describe('Formatters', () => {
  describe('formatUSD', () => {
    it('formats standard numbers into currency', () => {
      expect(formatUSD(1234.56)).toBe('$1,234.56');
      expect(formatUSD(0)).toBe('$0.00');
    });

    it('formats micro prices with 4 decimals by default', () => {
      expect(formatUSD(0.0543)).toBe('$0.0543');
    });
  });

  describe('formatCrypto', () => {
    it('formats crypto amounts safely', () => {
      expect(formatCrypto(1.23456789, 4)).toBe('1.2346');
      expect(formatCrypto(0)).toBe('0');
    });
  });

  describe('formatPercent', () => {
    it('formats percentages with optional sign', () => {
      expect(formatPercent(5.2)).toBe('+5.20%');
      expect(formatPercent(-3.14)).toBe('-3.14%');
      expect(formatPercent(0)).toBe('0.00%');
    });
  });

  describe('formatCompactNumber', () => {
    it('formats billions, millions, and thousands', () => {
      expect(formatCompactNumber(1500000000)).toBe('$1.50B');
      expect(formatCompactNumber(25000000)).toBe('$25.00M');
      expect(formatCompactNumber(4500)).toBe('$4.50K');
    });
  });

  describe('formatTimestamp', () => {
    it('formats timestamps into valid date strings', () => {
      const ts = new Date('2026-01-01T12:00:00Z').getTime();
      expect(formatTimestamp(ts, 'short')).toBeTruthy();
      expect(formatTimestamp(ts, 'full')).toBeTruthy();
    });
  });
});
