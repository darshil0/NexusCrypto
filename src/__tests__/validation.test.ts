import { describe, it, expect } from 'vitest';
import {
  validateRequired,
  validatePositiveNumber,
  validatePrecision,
  validateOrderNotional,
  validateWithdrawalAddress,
  validateSupportTicket,
} from '../lib/errors/validation';

describe('Validation Helpers', () => {
  describe('validateRequired', () => {
    it('returns invalid for empty string, null, or undefined', () => {
      expect(validateRequired('').isValid).toBe(false);
      expect(validateRequired('   ').isValid).toBe(false);
      expect(validateRequired(null).isValid).toBe(false);
      expect(validateRequired(undefined).isValid).toBe(false);
    });

    it('returns valid for filled values', () => {
      expect(validateRequired('hello').isValid).toBe(true);
      expect(validateRequired(123).isValid).toBe(true);
      expect(validateRequired(false).isValid).toBe(true);
    });
  });

  describe('validatePositiveNumber', () => {
    it('handles empty / invalid string', () => {
      expect(validatePositiveNumber('').isValid).toBe(false);
      expect(validatePositiveNumber('abc').isValid).toBe(false);
    });

    it('rejects zero and negative numbers', () => {
      expect(validatePositiveNumber(0).isValid).toBe(false);
      expect(validatePositiveNumber(-5).isValid).toBe(false);
    });

    it('enforces min and max bounds', () => {
      expect(validatePositiveNumber(0.000000001, 'Amount', 0.0001, 100).isValid).toBe(false);
      expect(validatePositiveNumber(150, 'Amount', 0.0001, 100).isValid).toBe(false);
      expect(validatePositiveNumber(50, 'Amount', 0.0001, 100).isValid).toBe(true);
    });
  });

  describe('validatePrecision', () => {
    it('passes integers and acceptable decimals', () => {
      expect(validatePrecision(100, 2).isValid).toBe(true);
      expect(validatePrecision('100.55', 2).isValid).toBe(true);
      expect(validatePrecision('100.5', 2).isValid).toBe(true);
    });

    it('rejects exceeding decimals', () => {
      expect(validatePrecision('100.555', 2).isValid).toBe(false);
    });
  });

  describe('validateOrderNotional', () => {
    it('validates min and max notional boundaries', () => {
      expect(validateOrderNotional(0.0001, 1000).isValid).toBe(false); // $0.10 < $1.00
      expect(validateOrderNotional(1, 100).isValid).toBe(true); // $100
      expect(validateOrderNotional(2000, 1000).isValid).toBe(false); // $2M > $1M
    });
  });

  describe('validateWithdrawalAddress', () => {
    it('validates blockchain address formats', () => {
      expect(validateWithdrawalAddress('').isValid).toBe(false);
      expect(validateWithdrawalAddress('short').isValid).toBe(false);
      expect(validateWithdrawalAddress('0x71C84513643B6EC5B18D32D338008BBE45678901').isValid).toBe(true);
      expect(validateWithdrawalAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq').isValid).toBe(true);
      expect(validateWithdrawalAddress('invalid$$$$$$$$$$$$$$$').isValid).toBe(false);
    });
  });

  describe('validateSupportTicket', () => {
    it('validates ticket inputs correctly', () => {
      expect(validateSupportTicket('', 'Account', 'Detailed message here').isValid).toBe(false);
      expect(validateSupportTicket('Help', 'Select Category', 'Detailed message here').isValid).toBe(false);
      expect(validateSupportTicket('Help', 'Account', 'Short').isValid).toBe(false);
      expect(validateSupportTicket('Help needed', 'Account', 'This is a sufficiently long message').isValid).toBe(true);
    });
  });
});
