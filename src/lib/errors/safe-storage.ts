/**
 * Safe Browser Storage Module
 * Prevents runtime crashes from disabled cookies, quota limits, private browsing,
 * and malformed stored JSON.
 */

// In-memory fallback dictionary for private/blocked storage
const memoryFallback = new Map<string, string>();

let isStorageAvailableCache: boolean | null = null;

export function isLocalStorageAvailable(): boolean {
  if (isStorageAvailableCache !== null) {
    return isStorageAvailableCache;
  }

  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    isStorageAvailableCache = false;
    return false;
  }

  try {
    const testKey = '__nexus_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    isStorageAvailableCache = true;
    return true;
  } catch {
    isStorageAvailableCache = false;
    return false;
  }
}

export interface StorageResult<T> {
  data: T;
  isFallback: boolean;
  error?: 'QUOTA_EXCEEDED' | 'CORRUPTED' | 'UNAVAILABLE';
}

export const safeStorage = {
  get<T>(key: string, fallback: T, validator?: (val: unknown) => boolean): T {
    try {
      if (!isLocalStorageAvailable()) {
        const memVal = memoryFallback.get(key);
        if (!memVal) return fallback;
        const parsed = JSON.parse(memVal);
        return validator ? (validator(parsed) ? parsed : fallback) : parsed;
      }

      const rawValue = window.localStorage.getItem(key);
      if (rawValue === null || rawValue === undefined) {
        return fallback;
      }

      const parsed = JSON.parse(rawValue);
      if (validator && !validator(parsed)) {
        console.warn(`[safeStorage] Validation failed for key "${key}", restoring fallback.`);
        return fallback;
      }

      return parsed as T;
    } catch (e) {
      console.warn(`[safeStorage] Failed to read key "${key}", using fallback.`, e);
      return fallback;
    }
  },

  set<T>(key: string, value: T): boolean {
    const serialized = JSON.stringify(value);
    memoryFallback.set(key, serialized);

    if (!isLocalStorageAvailable()) {
      return true;
    }

    try {
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (e: unknown) {
      console.error(`[safeStorage] Failed to persist key "${key}".`, e);
      const err = e as { name?: string; code?: number } | null;
      // Check if QuotaExceededError
      if (
        err?.name === 'QuotaExceededError' ||
        err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err?.code === 22 ||
        err?.code === 1014
      ) {
        console.warn('[safeStorage] Quota exceeded. Retaining in memory only.');
      }
      return false;
    }
  },

  remove(key: string): boolean {
    memoryFallback.delete(key);
    if (!isLocalStorageAvailable()) return true;

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear(prefix?: string): boolean {
    memoryFallback.clear();
    if (!isLocalStorageAvailable()) return true;

    try {
      if (!prefix) {
        window.localStorage.clear();
        return true;
      }

      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  },
};
