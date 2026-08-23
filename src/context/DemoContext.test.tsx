import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DemoProvider, useDemo } from '../context/DemoContext';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const TestComponent: React.FC = () => {
  const {
    balances,
    orders,
    portfolio,
    executeMarketTrade,
    placeLimitOrder,
    cancelOrder,
    executeConvert,
    simulateDeposit,
    simulateWithdrawal,
    resetDemoData,
  } = useDemo();

  return (
    <div>
      <div data-testid="usd-balance">{balances.USD?.amount ?? 0}</div>
      <div data-testid="btc-balance">{balances.BTC?.amount ?? 0}</div>
      <div data-testid="portfolio-value">{portfolio.totalValueUSD}</div>
      <div data-testid="open-orders-count">{orders.filter((o) => o.status === 'open').length}</div>

      <button
        data-testid="buy-btc-btn"
        onClick={() => executeMarketTrade('BTC/USD', 'buy', 0.1)}
      >
        Buy BTC
      </button>

      <button
        data-testid="limit-buy-btn"
        onClick={() => placeLimitOrder('BTC/USD', 'buy', 0.1, 50000)}
      >
        Limit Buy BTC
      </button>

      <button
        data-testid="cancel-order-btn"
        onClick={() => {
          const openOrd = orders.find((o) => o.status === 'open');
          if (openOrd) {
            cancelOrder(openOrd.id);
          }
        }}
      >
        Cancel Order
      </button>

      <button
        data-testid="convert-btn"
        onClick={() => executeConvert('USD', 'BTC', 1000)}
      >
        Convert USD to BTC
      </button>

      <button
        data-testid="deposit-btn"
        onClick={() => simulateDeposit('USD', 5000, 'Bank Transfer')}
      >
        Deposit USD
      </button>

      <button
        data-testid="withdraw-btn"
        onClick={() => simulateWithdrawal('USD', 1000, '1234567890abcdef1234567890', 'ACH')}
      >
        Withdraw USD
      </button>

      <button data-testid="reset-btn" onClick={resetDemoData}>
        Reset
      </button>
    </div>
  );
};

describe('DemoContext State and Operations', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('provides initial portfolio state', () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    expect(Number(screen.getByTestId('usd-balance').textContent)).toBe(25000);
    expect(Number(screen.getByTestId('btc-balance').textContent)).toBe(0.12);
  });

  it('executes market buy trade and updates balances', () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    const initialBtc = Number(screen.getByTestId('btc-balance').textContent);

    act(() => {
      screen.getByTestId('buy-btc-btn').click();
    });

    const newBtc = Number(screen.getByTestId('btc-balance').textContent);
    expect(newBtc).toBeGreaterThan(initialBtc);
  });

  it('places and cancels limit orders', () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    const initialOpenCount = Number(screen.getByTestId('open-orders-count').textContent);
    expect(initialOpenCount).toBeGreaterThanOrEqual(1);

    act(() => {
      screen.getByTestId('limit-buy-btn').click();
    });

    expect(Number(screen.getByTestId('open-orders-count').textContent)).toBe(initialOpenCount + 1);

    act(() => {
      screen.getByTestId('cancel-order-btn').click();
    });

    expect(Number(screen.getByTestId('open-orders-count').textContent)).toBe(initialOpenCount);
  });

  it('executes instant convert between assets', () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    const initialBtc = Number(screen.getByTestId('btc-balance').textContent);

    act(() => {
      screen.getByTestId('convert-btn').click();
    });

    const newBtc = Number(screen.getByTestId('btc-balance').textContent);
    expect(newBtc).toBeGreaterThan(initialBtc);
  });

  it('simulates deposit and withdrawal', () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    act(() => {
      screen.getByTestId('deposit-btn').click();
    });

    expect(Number(screen.getByTestId('usd-balance').textContent)).toBe(30000);

    act(() => {
      screen.getByTestId('withdraw-btn').click();
    });

    expect(Number(screen.getByTestId('usd-balance').textContent)).toBe(28995); // 30000 - 1000 - 5 fee
  });

  it('resets demo data to defaults', () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>
    );

    act(() => {
      screen.getByTestId('deposit-btn').click();
    });
    expect(Number(screen.getByTestId('usd-balance').textContent)).toBe(30000);

    act(() => {
      screen.getByTestId('reset-btn').click();
    });
    expect(Number(screen.getByTestId('usd-balance').textContent)).toBe(25000);
  });
});
