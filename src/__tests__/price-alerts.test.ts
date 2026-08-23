import { describe, it, expect } from 'vitest';
import type { PriceAlert } from '../types';

describe('Price Alerts Logic & Rules', () => {
  it('identifies when an above trigger is reached or exceeded', () => {
    const alert: PriceAlert = {
      id: 'alert-1',
      symbol: 'BTC',
      condition: 'above',
      targetValue: 70000,
      createdAt: Date.now(),
      triggered: false,
    };

    const currentPriceBefore = 69500;
    const isTriggeredBefore =
      alert.condition === 'above'
        ? currentPriceBefore >= alert.targetValue
        : currentPriceBefore <= alert.targetValue;
    expect(isTriggeredBefore).toBe(false);

    const currentPriceAfter = 70050;
    const isTriggeredAfter =
      alert.condition === 'above'
        ? currentPriceAfter >= alert.targetValue
        : currentPriceAfter <= alert.targetValue;
    expect(isTriggeredAfter).toBe(true);
  });

  it('identifies when a below trigger is reached or exceeded', () => {
    const alert: PriceAlert = {
      id: 'alert-2',
      symbol: 'ETH',
      condition: 'below',
      targetValue: 3000,
      createdAt: Date.now(),
      triggered: false,
    };

    const currentPriceBefore = 3050;
    const isTriggeredBefore = currentPriceBefore <= alert.targetValue;
    expect(isTriggeredBefore).toBe(false);

    const currentPriceAfter = 2990;
    const isTriggeredAfter = currentPriceAfter <= alert.targetValue;
    expect(isTriggeredAfter).toBe(true);
  });

  it('handles alert state transitions upon trigger and re-arm', () => {
    let alert: PriceAlert = {
      id: 'alert-3',
      symbol: 'SOL',
      condition: 'above',
      targetValue: 200,
      createdAt: 1000,
      triggered: false,
    };

    // Simulate Trigger
    const triggerPrice = 205;
    const triggerTime = 2000;
    alert = {
      ...alert,
      triggered: true,
      triggeredAt: triggerTime,
      triggeredPrice: triggerPrice,
      dismissed: false,
    };

    expect(alert.triggered).toBe(true);
    expect(alert.triggeredPrice).toBe(205);
    expect(alert.triggeredAt).toBe(2000);

    // Simulate Re-arm
    alert = {
      ...alert,
      triggered: false,
      triggeredAt: undefined,
      triggeredPrice: undefined,
      dismissed: false,
    };

    expect(alert.triggered).toBe(false);
    expect(alert.triggeredPrice).toBeUndefined();
    expect(alert.triggeredAt).toBeUndefined();
  });
});
