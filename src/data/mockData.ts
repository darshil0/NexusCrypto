import type { CryptoAsset, LearnArticle, GlossaryTerm, QuizQuestion } from '../types';

export const INITIAL_ASSETS: Record<string, CryptoAsset> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67840.50,
    change24h: 2.84,
    high24h: 68450.00,
    low24h: 65920.10,
    volume24h: 32450000000,
    marketCap: 1338000000000,
    circulatingSupply: 19740000,
    maxSupply: 21000000,
    allTimeHigh: 73750.07,
    rank: 1,
    category: 'Large Cap',
    sparkline: [65920, 66100, 66450, 65800, 66200, 66900, 67200, 66800, 67400, 67100, 67840],
    description: 'Bitcoin is the first decentralized digital currency, enabling peer-to-peer value transfer over the internet without intermediaries.',
    consensus: 'Proof of Work (SHA-256)',
    launchYear: 2009,
    color: '#F7931A',
    iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    decimals: 8,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3520.80,
    change24h: -1.15,
    high24h: 3610.00,
    low24h: 3480.20,
    volume24h: 18900000000,
    marketCap: 423500000000,
    circulatingSupply: 120250000,
    maxSupply: null,
    allTimeHigh: 4891.70,
    rank: 2,
    category: 'Layer 1',
    sparkline: [3590, 3610, 3580, 3550, 3520, 3540, 3510, 3500, 3530, 3515, 3520],
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality, powering decentralized finance and applications.',
    consensus: 'Proof of Stake',
    launchYear: 2015,
    color: '#627EEA',
    iconBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    decimals: 6,
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    price: 158.60,
    change24h: 5.72,
    high24h: 161.40,
    low24h: 149.80,
    volume24h: 5120000000,
    marketCap: 74800000000,
    circulatingSupply: 471200000,
    maxSupply: null,
    allTimeHigh: 260.06,
    rank: 5,
    category: 'Layer 1',
    sparkline: [149, 151, 150, 153, 155, 154, 156, 158, 157, 160, 158.6],
    description: 'Solana is a high-performance blockchain supporting builders across the world creating crypto apps that scale today.',
    consensus: 'Proof of Stake + Proof of History',
    launchYear: 2020,
    color: '#14F195',
    iconBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    decimals: 4,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.0001,
    change24h: 0.01,
    high24h: 1.0005,
    low24h: 0.9998,
    volume24h: 6800000000,
    marketCap: 34500000000,
    circulatingSupply: 34500000000,
    maxSupply: null,
    allTimeHigh: 1.05,
    rank: 6,
    category: 'Stablecoin',
    sparkline: [1.00, 1.0001, 0.9999, 1.00, 1.0002, 1.00, 0.9999, 1.0001, 1.00, 1.0001, 1.0001],
    description: 'USD Coin is a digital dollar backed 100% by highly liquid cash and cash-equivalent assets, redeemable 1:1 for US dollars.',
    consensus: 'Multi-chain Smart Contract',
    launchYear: 2018,
    color: '#2775CA',
    iconBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    decimals: 2,
  },
  XRP: {
    symbol: 'XRP',
    name: 'XRP',
    price: 0.584,
    change24h: 1.45,
    high24h: 0.598,
    low24h: 0.569,
    volume24h: 2100000000,
    marketCap: 32900000000,
    circulatingSupply: 56300000000,
    maxSupply: 100000000000,
    allTimeHigh: 3.84,
    rank: 7,
    category: 'Large Cap',
    sparkline: [0.57, 0.575, 0.572, 0.58, 0.578, 0.582, 0.585, 0.58, 0.59, 0.582, 0.584],
    description: 'XRP is a digital asset built for global payments, offering financial institutions a reliable, on-demand option for cross-border liquidity.',
    consensus: 'XRP Ledger Consensus Protocol',
    launchYear: 2012,
    color: '#23292F',
    iconBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    decimals: 4,
  },
  ADA: {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.465,
    change24h: -2.30,
    high24h: 0.485,
    low24h: 0.458,
    volume24h: 890000000,
    marketCap: 16500000000,
    circulatingSupply: 35600000000,
    maxSupply: 45000000000,
    allTimeHigh: 3.10,
    rank: 9,
    category: 'Layer 1',
    sparkline: [0.48, 0.485, 0.478, 0.472, 0.468, 0.47, 0.465, 0.46, 0.463, 0.468, 0.465],
    description: 'Cardano is a proof-of-stake blockchain platform that says its goal is to allow changemakers, innovators and visionaries to bring about positive global change.',
    consensus: 'Ouroboros PoS',
    launchYear: 2017,
    color: '#0033AD',
    iconBg: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    decimals: 4,
  },
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 28.40,
    change24h: 4.10,
    high24h: 29.10,
    low24h: 26.80,
    volume24h: 740000000,
    marketCap: 11200000000,
    circulatingSupply: 395000000,
    maxSupply: 720000000,
    allTimeHigh: 146.22,
    rank: 11,
    category: 'Layer 1',
    sparkline: [26.8, 27.2, 27.0, 27.5, 27.9, 28.1, 27.8, 28.3, 28.6, 28.2, 28.4],
    description: 'Avalanche is a smart contract platform built to scale infinitely and finalize transactions in under a second.',
    consensus: 'Avalanche Consensus',
    launchYear: 2020,
    color: '#E84142',
    iconBg: 'bg-red-500/10 text-red-500 border-red-500/20',
    decimals: 4,
  },
  LINK: {
    symbol: 'LINK',
    name: 'Chainlink',
    price: 14.25,
    change24h: 3.20,
    high24h: 14.60,
    low24h: 13.70,
    volume24h: 620000000,
    marketCap: 8600000000,
    circulatingSupply: 608000000,
    maxSupply: 1000000000,
    allTimeHigh: 52.88,
    rank: 14,
    category: 'DeFi',
    sparkline: [13.7, 13.9, 13.8, 14.1, 14.3, 14.2, 14.4, 14.5, 14.1, 14.3, 14.25],
    description: 'Chainlink is an industry-standard Web3 services platform connecting blockchains to real-world data and off-chain computation.',
    consensus: 'ERC-20 Oracle Network',
    launchYear: 2017,
    color: '#375BD2',
    iconBg: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
    decimals: 4,
  }
};

export const INITIAL_BALANCES = {
  USD: { symbol: 'USD' as const, name: 'US Dollar', amount: 25000.00, lockedInOrders: 0 },
  BTC: { symbol: 'BTC' as const, name: 'Bitcoin', amount: 0.12, avgBuyPrice: 64200.00, lockedInOrders: 0 },
  ETH: { symbol: 'ETH' as const, name: 'Ethereum', amount: 2.50, avgBuyPrice: 3350.00, lockedInOrders: 0 },
  SOL: { symbol: 'SOL' as const, name: 'Solana', amount: 35.00, avgBuyPrice: 142.50, lockedInOrders: 0 },
  USDC: { symbol: 'USDC' as const, name: 'USD Coin', amount: 2000.00, avgBuyPrice: 1.00, lockedInOrders: 0 },
  XRP: { symbol: 'XRP' as const, name: 'XRP', amount: 1000.00, avgBuyPrice: 0.54, lockedInOrders: 0 },
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-sim-001',
    type: 'deposit' as const,
    asset: 'USD' as const,
    amount: 25000.00,
    fee: 0,
    totalValueUSD: 25000.00,
    status: 'completed' as const,
    timestamp: Date.now() - 86400000 * 3,
    notes: 'Demo Initial Sandbox Seed Capital',
    isSimulated: true as const,
  },
  {
    id: 'tx-sim-002',
    type: 'buy' as const,
    asset: 'BTC' as const,
    amount: 0.12,
    price: 64200.00,
    fee: 7.70,
    totalValueUSD: 7704.00,
    status: 'completed' as const,
    timestamp: Date.now() - 86400000 * 2,
    notes: 'Paper Market Buy BTC/USD',
    isSimulated: true as const,
  },
  {
    id: 'tx-sim-003',
    type: 'buy' as const,
    asset: 'ETH' as const,
    amount: 2.50,
    price: 3350.00,
    fee: 8.38,
    totalValueUSD: 8375.00,
    status: 'completed' as const,
    timestamp: Date.now() - 86400000 * 2 + 3600000,
    notes: 'Paper Limit Order Filled ETH/USD',
    isSimulated: true as const,
  },
  {
    id: 'tx-sim-004',
    type: 'convert' as const,
    asset: 'USD' as const,
    toAsset: 'SOL' as const,
    amount: 4987.50,
    toAmount: 35.00,
    price: 142.50,
    fee: 0,
    totalValueUSD: 4987.50,
    status: 'completed' as const,
    timestamp: Date.now() - 86400000,
    notes: 'Instant Instant Paper Convert USD -> SOL',
    isSimulated: true as const,
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-sim-101',
    pair: 'BTC/USD',
    baseAsset: 'BTC' as const,
    quoteAsset: 'USD',
    side: 'buy' as const,
    type: 'limit' as const,
    price: 63500.00,
    amount: 0.05,
    filledAmount: 0,
    total: 3175.00,
    fee: 3.18,
    status: 'open' as const,
    createdAt: Date.now() - 3600000 * 5,
    isPaperTrade: true as const,
  },
  {
    id: 'ord-sim-102',
    pair: 'SOL/USD',
    baseAsset: 'SOL' as const,
    quoteAsset: 'USD',
    side: 'sell' as const,
    type: 'limit' as const,
    price: 185.00,
    amount: 10.00,
    filledAmount: 0,
    total: 1850.00,
    fee: 1.85,
    status: 'open' as const,
    createdAt: Date.now() - 3600000 * 12,
    isPaperTrade: true as const,
  }
];

export const TRADING_PAIRS = [
  { pair: 'BTC/USD', base: 'BTC' as const, quote: 'USD', minSize: 0.0001, tickSize: 0.50 },
  { pair: 'ETH/USD', base: 'ETH' as const, quote: 'USD', minSize: 0.001, tickSize: 0.10 },
  { pair: 'SOL/USD', base: 'SOL' as const, quote: 'USD', minSize: 0.01, tickSize: 0.01 },
  { pair: 'BTC/USDC', base: 'BTC' as const, quote: 'USDC', minSize: 0.0001, tickSize: 0.50 },
  { pair: 'XRP/USD', base: 'XRP' as const, quote: 'USD', minSize: 1, tickSize: 0.0001 },
  { pair: 'AVAX/USD', base: 'AVAX' as const, quote: 'USD', minSize: 0.1, tickSize: 0.01 },
];

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: 'what-is-bitcoin',
    title: 'What is Bitcoin? A Beginner’s Guide to Digital Scarcity',
    summary: 'Discover how Bitcoin introduced decentralized, trustless, peer-to-peer electronic cash without centralized banking authorities.',
    category: 'Basics',
    readTime: '5 min read',
    difficulty: 'Beginner',
    author: 'NexusCrypto Research',
    date: 'August 2026',
    keyTakeaways: [
      'Bitcoin is limited to 21 million total units hardcoded into its protocol.',
      'Operates on a decentralized network secured by mathematical Proof of Work.',
      'Transactions are transparent, immutable, and recorded on a public ledger.',
      'Paper trading allows learning Bitcoin market dynamics without risking capital.'
    ],
    content: [
      'Bitcoin (BTC) was introduced in 2008 by an anonymous programmer or group under the pseudonym Satoshi Nakamoto. Nakamoto published the whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System," proposing a breakthrough solution to the classic double-spending problem in computer science.',
      'Unlike traditional fiat currencies issued by central banks that can be printed at will, Bitcoin has a strictly capped supply of 21 million coins. New bitcoins are minted through a process called mining, where computers solve cryptographic puzzles to validate blocks of transactions.',
      'Every 210,000 blocks (roughly every 4 years), the block reward paid to miners is cut in half—an event known as the Bitcoin Halving. This creates predictable, diminishing inflation.',
      'In a sandbox environment like NexusCrypto, you can practice trading Bitcoin across various timeframes and market conditions with zero capital risk.'
    ]
  },
  {
    slug: 'what-is-ethereum',
    title: 'What is Ethereum? Smart Contracts and Programmable Money',
    summary: 'Explore how Ethereum expanded blockchain from simple ledger transfers to a global, decentralized computing platform.',
    category: 'Basics',
    readTime: '6 min read',
    difficulty: 'Beginner',
    author: 'NexusCrypto Research',
    date: 'August 2026',
    keyTakeaways: [
      'Ethereum runs self-executing smart contracts via the Ethereum Virtual Machine (EVM).',
      'Ether (ETH) is the native cryptocurrency used to pay network gas fees.',
      'Secured by energy-efficient Proof-of-Stake consensus with validators.',
      'Serves as the foundational layer for DeFi, stablecoins, and tokenized assets.'
    ],
    content: [
      'Proposed in late 2013 by Vitalik Buterin, Ethereum launched in 2015 with a radically ambitious mission: to create a Turing-complete, world computer where anyone can deploy unstoppable programs known as smart contracts.',
      'Smart contracts execute automatically when predefined conditions are met. This removes counterparty risk and enables complex financial primitives such as decentralized lending pools, automated market makers (AMMs), and collateralized stablecoins.',
      'Transactions on the network require computational fuel, termed "gas", which is paid in the native currency ETH. In 2022, Ethereum completed "The Merge," switching from Proof-of-Work to Proof-of-Stake and reducing its energy consumption by more than 99.9%.'
    ]
  },
  {
    slug: 'how-crypto-wallets-work',
    title: 'How Crypto Wallets Work: Public Keys, Private Keys, & Custody',
    summary: 'Understand the critical difference between custodial exchange balances and self-custodial on-chain key management.',
    category: 'Wallets',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    author: 'NexusCrypto Security Desk',
    date: 'August 2026',
    keyTakeaways: [
      'Crypto is stored on the blockchain, not physically inside your wallet hardware or software.',
      'Your Private Key / Seed Phrase is the ultimate master key granting control over funds.',
      'Custodial platforms hold keys on your behalf; self-custody puts 100% responsibility on you.',
      'Never share your 12-to-24 word recovery phrase with anyone under any circumstances.'
    ],
    content: [
      'A crypto wallet is essentially a keychain that stores cryptographic keys rather than digital coins themselves. The actual coins reside as unspent transaction outputs (UTXOs) or account balances on the public blockchain network.',
      'Your Public Address is derived from your Public Key—like an email address or bank account IBAN that you can safely share to receive funds.',
      'Your Private Key or 12/24-word Seed Phrase is the secret mathematical signature that authorizes outgoing transactions. Anyone with access to your seed phrase has total, irreversible access to all assets associated with that wallet.',
      'Understanding self-custody vs. custodial platforms is essential before committing real capital anywhere.'
    ]
  },
  {
    slug: 'how-paper-trading-works',
    title: 'Mastering Paper Trading & Risk Management',
    summary: 'Learn how to test trading strategies, manage position sizing, calculate risk-to-reward ratios, and master your emotions using sandbox capital.',
    category: 'Trading',
    readTime: '5 min read',
    difficulty: 'Beginner',
    author: 'NexusCrypto Trading Team',
    date: 'August 2026',
    keyTakeaways: [
      'Paper trading simulates market mechanics without putting real financial assets at stake.',
      'Always risk no more than 1-2% of total portfolio equity on any single trade.',
      'Use Limit orders to control entry prices and avoid emotional market chasing.',
      'Track trade journal notes to understand winning setups and avoid repeated mistakes.'
    ],
    content: [
      'Paper trading (simulated trading) is the gold standard training methodology used by professional market makers, proprietary trading firms, and retail traders to refine market execution without financial loss.',
      'By placing mock limit and market orders into an interactive simulated order book, traders learn how slippage, bid-ask spreads, order execution delays, and volatile swings impact bottom-line PnL.',
      'A crucial rule in risk management is Position Sizing: calculating the quantity of crypto bought based on your stop-loss distance, ensuring that if a trade goes wrong, only a controlled percentage of your demo balance is lost.'
    ]
  },
  {
    slug: 'avoiding-crypto-scams',
    title: 'How to Spot and Avoid Crypto Scams & Phishing',
    summary: 'Essential cybersecurity rules to protect yourself from fake investment schemes, phishing links, social engineering, and impersonation.',
    category: 'Security',
    readTime: '6 min read',
    difficulty: 'Beginner',
    author: 'NexusCrypto Security Desk',
    date: 'August 2026',
    keyTakeaways: [
      'Guaranteed high daily or monthly returns are 100% guaranteed scams.',
      'Support staff and administrators will NEVER direct message you first asking for wallet phrases or passwords.',
      'Always verify URLs, SSL certificates, and browser bookmarks before connecting any wallet.',
      'Beware of fake token airdrops, unsolicited Telegram/Discord DMs, and remote desktop requests.'
    ],
    content: [
      'Due to the immutable and irreversible nature of blockchain transactions, cryptocurrency is a frequent target for malicious actors. Once funds leave your wallet, no bank or customer support can reverse the transfer.',
      'Common scams include "Pig Butchering" (relationship investment cons promising high yields), Phishing websites mirroring legitimate exchanges, Malicious smart contract approvals that drain wallet tokens, and Fake giveaways impersonating tech leaders.',
      'Golden rule: If an opportunity sounds too good to be true, it is a scam. Protect your keys, use hardware 2FA (like YubiKey or authenticator apps), and practice safe digital hygiene.'
    ]
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Airdrop', definition: 'A marketing method where a blockchain project distributes free tokens directly to wallet addresses of active community members.', category: 'General' },
  { term: 'All-Time High (ATH)', definition: 'The highest historical price a cryptocurrency has ever reached across spot trading markets.', category: 'Trading' },
  { term: 'Ask Price', definition: 'The lowest price a seller is currently willing to accept for an asset in the order book.', category: 'Trading' },
  { term: 'Bid Price', definition: 'The highest price a buyer is currently willing to pay for an asset in the order book.', category: 'Trading' },
  { term: 'Block Explorer', definition: 'An online tool and search engine allowing users to view real-time and historical transactions, block heights, and wallet balances on a blockchain.', category: 'Technology' },
  { term: 'Cold Storage / Cold Wallet', definition: 'A cryptocurrency storage method where private keys are kept offline, completely isolated from internet connections for maximum safety.', category: 'Security' },
  { term: 'DeFi (Decentralized Finance)', definition: 'Financial products and services running on smart contracts on public blockchains without centralized intermediaries.', category: 'General' },
  { term: 'Gas Fee', definition: 'The fee paid by a user to network validators to process, verify, and include a transaction inside a newly mined block.', category: 'Technology' },
  { term: 'Halving', definition: 'A programmed event occurring roughly every four years in Bitcoin where the issuance of new coins awarded per block is cut in half.', category: 'Economics' },
  { term: 'Limit Order', definition: 'An order to buy or sell a cryptocurrency at a specific specified price or better, rather than executing immediately at market rate.', category: 'Trading' },
  { term: 'Market Order', definition: 'An order that executes immediately at the current best available price in the order book.', category: 'Trading' },
  { term: 'Paper Trading', definition: 'A simulated trading sandbox using virtual funds to test strategies, analyze order books, and learn platform tools risk-free.', category: 'Trading' },
  { term: 'Seed Phrase', definition: 'A human-readable sequence of 12 to 24 words that generates your private keys and allows complete wallet restoration.', category: 'Security' },
  { term: 'Slippage', definition: 'The difference between the expected price of a trade and the actual executed price, caused by market volatility or thin order book liquidity.', category: 'Trading' },
  { term: 'Spread', definition: 'The mathematical price gap between the lowest ask price and the highest bid price in the order book.', category: 'Trading' },
  { term: 'Stablecoin', definition: 'A digital token engineered to maintain a stable price peg by backing reserves 1:1 against external assets like the US Dollar.', category: 'Economics' }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the maximum total supply of Bitcoin that will ever exist?',
    options: ['100 million', '21 million', 'Infinite', '18.5 million'],
    correctIndex: 1,
    explanation: 'Bitcoin has a hard mathematical cap of 21 million coins programmed directly into its consensus protocol.'
  },
  {
    id: 2,
    question: 'What is the primary purpose of paper trading in a sandbox like NexusCrypto?',
    options: [
      'To earn real cash rewards without spending money',
      'To practice trading strategies and order execution with virtual balances without risking real capital',
      'To generate interest on simulated crypto assets',
      'To mine new tokens on test networks'
    ],
    correctIndex: 1,
    explanation: 'Paper trading uses simulated balances so traders can learn platform mechanics, chart analysis, and risk management completely risk-free.'
  },
  {
    id: 3,
    question: 'If someone contacts you claiming to be exchange customer support and asks for your 12-word seed phrase, what should you do?',
    options: [
      'Send it immediately so they can fix your account issue',
      'Send only the first 6 words of the phrase',
      'Never share it under any circumstances—legitimate support will never ask for your seed phrase',
      'Share it if they provide a support ticket number'
    ],
    correctIndex: 2,
    explanation: 'Your seed phrase or private key must NEVER be shared. Anyone asking for it is attempting a theft or phishing attack.'
  },
  {
    id: 4,
    question: 'What is the key difference between a Market Order and a Limit Order?',
    options: [
      'Market orders execute immediately at current market price, while Limit orders execute only at your chosen target price or better',
      'Market orders are free, while limit orders have higher interest fees',
      'Limit orders can only be placed on weekends',
      'There is no difference'
    ],
    correctIndex: 0,
    explanation: 'Market orders prioritize immediate execution speed at the best current ask/bid, whereas Limit orders prioritize execution price precision.'
  },
  {
    id: 5,
    question: 'What does "self-custody" mean in cryptocurrency?',
    options: [
      'The government holds your crypto in an FDIC-insured account',
      'You hold and control the private keys to your wallet, making you solely responsible for security and backups',
      'An exchange manages all passwords and password resets for you',
      'Trading only during daytime market hours'
    ],
    correctIndex: 1,
    explanation: 'Self-custody means you hold the private keys and have complete sovereign ownership over your funds, without relying on an intermediary.'
  }
];

export const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Is NexusCrypto a real exchange? Can I deposit real money?',
    answer: 'No. NexusCrypto is strictly a demo, sandbox, and educational paper trading platform. All balances, trades, deposits, withdrawals, and wallets are 100% simulated in your browser. No real money or real cryptocurrency is ever accepted, processed, or transferred.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'How does the simulated demo market data work?',
    answer: 'NexusCrypto uses realistic deterministic algorithms and local market tick generators that update simulated prices, order book bids/asks, and recent trades in real-time, giving you an authentic trading experience without requiring live external API connections or real financial risk.',
    category: 'Markets'
  },
  {
    id: 'faq-3',
    question: 'Where is my demo portfolio data stored?',
    answer: 'All demo account state—including your paper balances, open orders, trade history, price alerts, watchlists, and quiz scores—is stored locally in your web browser via localStorage. Your data stays on your machine.',
    category: 'Account'
  },
  {
    id: 'faq-4',
    question: 'Can I reset my demo balance if I run out of funds?',
    answer: 'Yes! You can reset your demo account anytime using the "Reset Demo Data" button in the navigation banner, dashboard, or settings page. This restores your starting demo balances: $25,000 USD, 0.12 BTC, 2.5 ETH, 35 SOL, 2,000 USDC, and 1,000 XRP.',
    category: 'Account'
  },
  {
    id: 'faq-5',
    question: 'Does NexusCrypto provide financial or investment advice?',
    answer: 'No. Nothing on this website constitutes financial, legal, tax, or investment advice. Cryptocurrencies are highly volatile assets. All charts, quotes, statistics, and educational articles are for informational and practice purposes only.',
    category: 'Legal'
  }
];
