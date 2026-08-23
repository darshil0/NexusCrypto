import type { CryptoAsset, WalletBalance } from '../types';

export const SIMULATED_FEE_RATE = 0.001; // 0.1% simulated trading fee

export interface ConvertQuote {
  fromSymbol: string;
  toSymbol: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  fee: number;
  feeAsset: string;
  slippagePercent: number;
  estimatedValueUSD: number;
}

export function calculateTradeFee(totalAmountUSD: number, feeRate: number = SIMULATED_FEE_RATE): number {
  if (totalAmountUSD <= 0) return 0;
  return Number((totalAmountUSD * feeRate).toFixed(4));
}

export function calculateConvertQuote(
  fromSymbol: string,
  toSymbol: string,
  fromAmount: number,
  assetPrices: Record<string, number>
): ConvertQuote {
  if (fromAmount <= 0) {
    return {
      fromSymbol,
      toSymbol,
      fromAmount: 0,
      toAmount: 0,
      exchangeRate: 0,
      fee: 0,
      feeAsset: fromSymbol,
      slippagePercent: 0,
      estimatedValueUSD: 0,
    };
  }

  const fromPriceUSD = fromSymbol === 'USD' ? 1 : (assetPrices[fromSymbol] || 0);
  const toPriceUSD = toSymbol === 'USD' ? 1 : (assetPrices[toSymbol] || 0);

  if (fromPriceUSD <= 0 || toPriceUSD <= 0) {
    throw new Error('Invalid asset pricing for conversion');
  }

  const totalValueUSD = fromAmount * fromPriceUSD;
  const exchangeRate = fromPriceUSD / toPriceUSD;
  const rawToAmount = totalValueUSD / toPriceUSD;
  
  // 0.05% simulated slippage for conversions
  const slippagePercent = 0.05;
  const slippageMultiplier = 1 - (slippagePercent / 100);
  const toAmount = Number((rawToAmount * slippageMultiplier).toFixed(8));
  const fee = Number((totalValueUSD * 0.0005).toFixed(4)); // 0.05% convert fee

  return {
    fromSymbol,
    toSymbol,
    fromAmount,
    toAmount,
    exchangeRate: Number(exchangeRate.toFixed(8)),
    fee,
    feeAsset: 'USD',
    slippagePercent,
    estimatedValueUSD: Number(totalValueUSD.toFixed(2)),
  };
}

export function validateBalance(
  availableBalance: number,
  requiredAmount: number,
  epsilon = 1e-8
): { valid: boolean; error?: string; shortfall?: number } {
  if (requiredAmount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero.' };
  }
  if (requiredAmount > availableBalance + epsilon) {
    const shortfall = Number((requiredAmount - availableBalance).toFixed(6));
    return {
      valid: false,
      error: `Insufficient balance. You need ${shortfall} more.`,
      shortfall,
    };
  }
  return { valid: true };
}

export interface PortfolioSummary {
  totalValueUSD: number;
  dailyChangeUSD: number;
  dailyChangePercent: number;
  totalPnLUSD: number;
  totalPnLPercent: number;
  breakdown: Array<{
    symbol: string;
    name: string;
    amount: number;
    valueUSD: number;
    percentage: number;
    color: string;
    avgBuyPrice?: number;
    unrealizedPnLUSD?: number;
    unrealizedPnLPercent?: number;
  }>;
}

export function calculatePortfolioSummary(
  balances: Record<string, WalletBalance>,
  assets: Record<string, CryptoAsset>
): PortfolioSummary {
  let totalValueUSD = 0;
  let totalCostBasisUSD = 0;
  let estimatedDailyWeightedChange = 0;

  const rawBreakdown: Array<{
    symbol: string;
    name: string;
    amount: number;
    valueUSD: number;
    color: string;
    avgBuyPrice?: number;
    unrealizedPnLUSD?: number;
    unrealizedPnLPercent?: number;
  }> = [];

  Object.values(balances).forEach((bal) => {
    if (bal.amount <= 0 && (!bal.lockedInOrders || bal.lockedInOrders <= 0)) return;

    const totalAssetAmount = bal.amount + (bal.lockedInOrders || 0);

    if (bal.symbol === 'USD') {
      const val = totalAssetAmount;
      totalValueUSD += val;
      totalCostBasisUSD += val;
      rawBreakdown.push({
        symbol: 'USD',
        name: 'US Dollar',
        amount: totalAssetAmount,
        valueUSD: val,
        color: '#10B981',
      });
    } else {
      const asset = assets[bal.symbol];
      const price = asset ? asset.price : 0;
      const val = totalAssetAmount * price;
      totalValueUSD += val;

      const avgBuy = bal.avgBuyPrice ?? price;
      const costBasis = totalAssetAmount * avgBuy;
      totalCostBasisUSD += costBasis;

      const pnlUSD = val - costBasis;
      const pnlPercent = costBasis > 0 ? (pnlUSD / costBasis) * 100 : 0;

      if (asset) {
        estimatedDailyWeightedChange += val * (asset.change24h / 100);
      }

      rawBreakdown.push({
        symbol: bal.symbol,
        name: asset ? asset.name : bal.symbol,
        amount: totalAssetAmount,
        valueUSD: val,
        color: asset ? asset.color : '#888888',
        avgBuyPrice: avgBuy,
        unrealizedPnLUSD: pnlUSD,
        unrealizedPnLPercent: pnlPercent,
      });
    }
  });

  const dailyChangeUSD = estimatedDailyWeightedChange;
  const dailyChangePercent = totalValueUSD > 0 ? (dailyChangeUSD / totalValueUSD) * 100 : 0;
  const totalPnLUSD = totalValueUSD - totalCostBasisUSD;
  const totalPnLPercent = totalCostBasisUSD > 0 ? (totalPnLUSD / totalCostBasisUSD) * 100 : 0;

  const breakdown = rawBreakdown
    .sort((a, b) => b.valueUSD - a.valueUSD)
    .map((item) => ({
      ...item,
      percentage: totalValueUSD > 0 ? Number(((item.valueUSD / totalValueUSD) * 100).toFixed(2)) : 0,
    }));

  return {
    totalValueUSD: Number(totalValueUSD.toFixed(2)),
    dailyChangeUSD: Number(dailyChangeUSD.toFixed(2)),
    dailyChangePercent: Number(dailyChangePercent.toFixed(2)),
    totalPnLUSD: Number(totalPnLUSD.toFixed(2)),
    totalPnLPercent: Number(totalPnLPercent.toFixed(2)),
    breakdown,
  };
}
