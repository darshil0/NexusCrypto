# NexusCrypto — Static Paper Trading MVP

NexusCrypto is a static, frontend-only cryptocurrency paper-trading sandbox and educational platform. It allows users to simulate market orders, limit orders, conversions, deposits, withdrawals, price alerts, and portfolio management without any real funds or backend dependencies.

> ⚠️ **DISCLAIMER**: NexusCrypto is strictly a **Paper Trading Sandbox & Educational Demo**. No real money, real wallets, blockchain transactions, or live trading take place. All account balances, price movements, order fills, and transactions are simulated in-browser.

---

## Key Features

- **Paper Trading Terminal**: Interactive candlestick/line chart, order book queue, recent trade tick feed, and market/limit order form.
- **Spot & Instant Conversion**: Instant crypto-to-crypto and fiat-to-crypto conversion simulator with fee calculations and slippage.
- **Portfolio & Asset Wallet**: Comprehensive breakdown of asset holdings, 24h PnL, cost basis, simulated deposit faucet, and withdrawal process.
- **Watchlist & Price Alerts**: Customizable price alerts (`above`, `below`, `% change`) that trigger real-time simulated popover notifications.
- **Crypto Learning Academy**: Interactive educational articles and micro-quizzes for crypto fundamentals.
- **Local Storage Persistence**: Uses safe local storage fallback logic to persist demo portfolio state across page reloads.

---

## Tech Stack

- **Framework**: React 19, Vite 6, TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Testing & Quality**: Vitest, TypeScript `tsc --noEmit`
- **Deployment**: GitHub Pages (static export) & Vercel compatible

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20 LTS recommended)
- **Package Manager**: `npm` (v9+)

---

## Available Commands

Install dependencies:
```bash
npm install
```

Run local development server:
```bash
npm run dev
```

Run TypeScript type check / linter:
```bash
npm run lint
npm run typecheck
```

Run unit tests:
```bash
npm run test
```

Build production static export (outputs to `out/` directory):
```bash
npm run build
```

---

## How localStorage Demo Data Works & How to Reset It

NexusCrypto stores all simulated wallet balances, open orders, transaction history, watchlists, alerts, user settings, and support tickets in your browser's `localStorage` using safe storage wrappers (`src/lib/errors/safe-storage.ts`).

If private browsing or quota limits prevent `localStorage` access, NexusCrypto seamlessly degrades to an in-memory storage fallback.

### Resetting Demo Data
To restore your demo account back to initial seed data ($25,000 USD, 0.12 BTC, 2.5 ETH, 35 SOL, 2,000 USDC, 1,000 XRP):
1. Click the **Reset Demo** or **Reset Sandbox** button in the top navigation bar or footer.
2. Alternatively, navigate to **Settings & Security** and click **Reset Demo Account Data**.

---

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions Pages deployment pipeline
├── src/
│   ├── components/
│   │   ├── dashboard/            # Portfolio & Heatmap components
│   │   ├── feedback/             # Error alerts, empty states & field errors
│   │   ├── layout/               # Navbar, Footer, MobileNav, DemoBanner
│   │   ├── trade/                # TradingChart, OrderBook, OrderForm, OrdersTable
│   │   └── ui/                   # Base UI components (Button, Modal, Card, Badge)
│   ├── context/
│   │   └── DemoContext.tsx       # Global state context for balances, orders, alerts
│   ├── data/
│   │   └── mockData.ts           # Initial seed data for assets, trades & guides
│   ├── lib/
│   │   └── errors/               # Safe storage, error codes, error boundary
│   ├── pages/                    # Route page views (Dashboard, Trade, Wallet, etc.)
│   ├── router/                   # Client-side router supporting base-path routing
│   ├── types/                    # TypeScript interfaces & domain models
│   └── utils/                    # Financial calculations & formatters
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Deployment Instructions

### Vercel Deployment

1. Connect your repository to Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `out`.
5. Environment Variables: Leave `NEXT_PUBLIC_BASE_PATH` blank.

### GitHub Pages Deployment

NexusCrypto includes a built-in GitHub Actions workflow in `.github/workflows/deploy.yml`.

To deploy to GitHub Pages:
1. Go to your repository settings on GitHub: **Settings > Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push changes to `main` or `master` branch (or manually trigger via `workflow_dispatch`).

#### Configuring the Base Path
If deploying under a GitHub Pages repository subpath (e.g., `https://username.github.io/repository-name/`), set the build environment variable:
```bash
NEXT_PUBLIC_BASE_PATH=/#repository-name
```
The client router in `src/router/Router.tsx` automatically resolves asset links and routes relative to `NEXT_PUBLIC_BASE_PATH`.

---

## Troubleshooting Guide

| Issue | Cause | Fix / Solution |
| :--- | :--- | :--- |
| **GitHub Pages 404 on Subpath** | Base path mismatch in GitHub Pages subfolder. | Ensure `NEXT_PUBLIC_BASE_PATH` is set to `/${repo_name}` during build. |
| **Broken CSS / Blank Page** | Static asset paths pointing to root `/assets`. | Verify `vite.config.ts` has `base: process.env.NEXT_PUBLIC_BASE_PATH \|\| '/'`. |
| **Dynamic Route Error (`/markets/BTC`)** | Refreshing on static file server without URL rewriting. | NexusCrypto router falls back to hash routing (`/#/markets/BTC`) on page refresh. |
| **localStorage Quota / Security Error** | Browser private mode or blocked cookies. | `safeStorage` automatically shifts to in-memory fallback. |
| **Stale Build Chunks** | Cached static assets in browser. | Perform a hard refresh (`Ctrl + Shift + R` or `Cmd + Shift + R`). |

---

## Known MVP Limitations

- **Simulated Market Feeds**: Prices fluctuate pseudo-randomly for demonstration purposes; no live WebSocket feed or external API is connected.
- **Frontend-Only Persistence**: All data remains in the user's local browser storage. Clearing browser data will reset state.
- **No Real Transactions**: Deposits, withdrawals, buy/sell trades, and support tickets are mock actions.
