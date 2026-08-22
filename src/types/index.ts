export type AssetSymbol = 'BTC' | 'ETH' | 'SOL' | 'USDC' | 'XRP' | 'ADA' | 'AVAX' | 'DOT' | 'LINK' | 'NEAR';

export interface CryptoAsset {
  symbol: AssetSymbol;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  maxSupply: number | null;
  allTimeHigh: number;
  rank: number;
  category: 'Layer 1' | 'DeFi' | 'Stablecoin' | 'Large Cap';
  sparkline: number[];
  description: string;
  consensus: string;
  launchYear: number;
  color: string;
  iconBg: string;
  decimals: number;
}

export type OrderType = 'market' | 'limit' | 'stop_limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'rejected';

export interface Order {
  id: string;
  pair: string; // e.g. "BTC/USD"
  baseAsset: AssetSymbol;
  quoteAsset: string; // "USD" or "USDC"
  side: OrderSide;
  type: OrderType;
  price: number;
  triggerPrice?: number;
  amount: number;
  filledAmount: number;
  total: number;
  fee: number;
  status: OrderStatus;
  createdAt: number;
  filledAt?: number;
  isPaperTrade: true;
}

export type TransactionType = 'buy' | 'sell' | 'convert' | 'deposit' | 'withdrawal' | 'trade';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  asset: AssetSymbol | 'USD';
  toAsset?: AssetSymbol | 'USD';
  amount: number;
  toAmount?: number;
  price?: number;
  fee: number;
  totalValueUSD: number;
  txHash?: string;
  fromAddress?: string;
  toAddress?: string;
  network?: string;
  status: TransactionStatus;
  timestamp: number;
  notes?: string;
  isSimulated: true;
}

export interface WalletBalance {
  symbol: AssetSymbol | 'USD';
  name: string;
  amount: number;
  avgBuyPrice?: number;
  lockedInOrders: number;
}

export interface PriceAlert {
  id: string;
  symbol: AssetSymbol;
  condition: 'above' | 'below' | 'change_pct';
  targetValue: number;
  createdAt: number;
  triggered: boolean;
  triggeredAt?: number;
  note?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'trade';
  timestamp: number;
  read: boolean;
  link?: string;
}

export interface LearnArticle {
  slug: string;
  title: string;
  summary: string;
  category: 'Basics' | 'Trading' | 'Security' | 'Wallets';
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  author: string;
  date: string;
  content: string[];
  keyTakeaways: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserSettings {
  displayName: string;
  avatarSeed: string;
  currency: 'USD' | 'EUR' | 'GBP';
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  demoMfaEnabled: boolean;
  compactView: boolean;
  riskBannerDismissed: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: 'Open' | 'Under Review' | 'Simulated Response Available';
  createdAt: number;
  response?: string;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export interface MarketTrade {
  id: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  time: string;
}
