import { describe, it, expect, beforeEach } from 'vitest';
import { safeStorage } from '../lib/errors/safe-storage';

describe('Safe Storage Engine', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  it('stores and retrieves data with fallback', () => {
    const key = 'test_key';
    const defaultValue = { a: 1 };
    
    // First retrieve default value
    expect(safeStorage.get(key, defaultValue)).toEqual(defaultValue);

    // Set value and retrieve
    safeStorage.set(key, { a: 2 });
    expect(safeStorage.get(key, defaultValue)).toEqual({ a: 2 });
  });

  it('handles schema validation callback', () => {
    const key = 'test_schema';
    safeStorage.set(key, { invalid: true });

    // Validate schema
    const result = safeStorage.get(
      key,
      { valid: true },
      (val: unknown) => typeof val === 'object' && val !== null && 'valid' in (val as Record<string, unknown>)
    );

    expect(result).toEqual({ valid: true });
  });

  it('removes keys properly', () => {
    const key = 'test_removal';
    safeStorage.set(key, 'value');
    expect(safeStorage.get(key, null)).toBe('value');
    safeStorage.remove(key);
    expect(safeStorage.get(key, null)).toBeNull();
  });
});
