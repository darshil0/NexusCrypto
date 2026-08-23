# NexusCrypto — Paper Trading Platform

NexusCrypto is a modern, frontend-only, browser-based paper trading sandbox that simulates a full cryptocurrency trading experience for learning, testing, and experimentation. It is designed for demos, educational tutorials, and local development — zero real funds, blockchain transactions, or financial custody are involved.

> ⚠️ **DISCLAIMER**: NexusCrypto is strictly a paper trading sandbox and educational tool. All funds, balances, order book data, trades, and market activity are simulated locally inside the user's browser session.

---

## Key Features

- **Interactive Paper Trading Sandbox**: Execute simulated Market, Limit, and Stop Loss orders with real-time portfolio balance updates.
- **Instant Asset Conversion**: Convert between available cryptocurrencies and USD with zero real-world slippage or fees.
- **Market Heatmap & Live Analytics**: Real-time asset price tracking, 24-hour performance indicators, volume metrics, order books, and recent trade history.
- **Educational Learn Hub & Micro-Quizzes**: Interactive articles, crypto beginner guides, and micro-quizzes to test and reinforce trading concepts.
- **Watchlists & Custom Price Alerts**: Create custom watchlists and set target price alerts with toast notifications.
- **SafeStorage Fallback**: Storage wrapper (`safeStorage`) that transparently falls back to in-memory state if `localStorage` is disabled, blocked, or quota-exceeded.
- **Client Router with Subpath Support**: Custom lightweight client router that gracefully handles subpath routing (e.g., GitHub Pages) and hash navigation fallbacks.

---

## Tech Stack

- **Framework**: React 19 + TypeScript 5.8
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Testing**: Vitest 4 + `@testing-library/react` + JSDOM
- **Code Quality**: ESLint 10 (Flat Config) + TypeScript Strict Mode

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (20+ LTS recommended)
- `npm` (v9+) or `bun`/`pnpm`

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/darshil0/nexus-crypto.git
cd nexus-crypto

# Install dependencies
npm install

# Start the local development server (localhost:3000)
npm run dev
```

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:3000` |
| `npm run typecheck` | Runs TypeScript compiler (`tsc --noEmit`) to verify type safety |
| `npm run lint` | Runs ESLint across all codebase files |
| `npm run test` | Executes unit test suite using Vitest |
| `npm run build` | Builds optimized static production distribution output to `out/` |
| `npm run preview` | Previews the production static build locally |
| `npm run clean` | Cleans build artifacts and dist directories |

---

## Architecture & Behavior

### Storage Engine
All demo user state (balances, open orders, order history, watchlists, and price alerts) is persisted in `localStorage` via a resilient `safeStorage` utility. If `localStorage` is unavailable (e.g., private browsing mode or storage quotas), `safeStorage` automatically shifts to in-memory store for the session without throwing runtime exceptions.
Users can reset all demo data anytime via the **Reset Demo** button in the header banner or in Settings.

### Client-Side Routing & Base Paths
The custom client-side router (`Router.tsx`) resolves navigation relative to an optional base path. When deploying to site subpaths (such as GitHub Pages at `https://username.github.io/repository`), set `NEXT_PUBLIC_BASE_PATH` or `BASE_PATH` during build time.

### Accessibility (a11y)
- Focusable **"Skip to content"** link for keyboard-only navigation.
- Accessible Modal dialogs with keyboard trap support, `Escape` key close handlers, `role="dialog"`, `aria-modal`, and `aria-labelledby` bindings.

---

## Environment Variables

- `NEXT_PUBLIC_BASE_PATH` *(optional)*: Base path prefix for asset resolution and route matching when deployed under a subpath.

Example build command for subpath deployment:

```bash
NEXT_PUBLIC_BASE_PATH=/nexus-crypto npm run build
```

---

## Deployment

### Vercel
1. Import repository into Vercel.
2. Select **Vite** preset.
3. Build Command: `npm run build`
4. Output Directory: `out`

### GitHub Pages
A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included. It automatically builds, runs typecheck, tests, and deploys the generated `out/` directory to GitHub Pages on every push to `main` or `master`.

---

## Project Structure

```
nexus-crypto/
├── .github/workflows/  # GitHub Actions CI/CD workflows
├── out/                # Build output directory (static export)
├── src/
│   ├── components/     # UI components (dashboard, trade, feedback, layout, ui)
│   ├── context/        # DemoContext global state management & testing
│   ├── data/           # Mock market data & initial seed state
│   ├── hooks/          # React custom hooks (e.g., useHydrated)
│   ├── lib/            # Error boundaries, safeStorage, error definitions
│   ├── pages/          # Route views (Trade, Markets, Wallet, Learn, etc.)
│   ├── router/         # Lightweight client router with base path support
│   ├── types/          # TypeScript domain interfaces
│   └── utils/          # Financial calculations, formatters, and unit tests
├── index.html          # HTML entrypoint
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration & build settings
```

---

## Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Blank page / Asset 404** | Incorrect base path configuration | Ensure `NEXT_PUBLIC_BASE_PATH` matches your subpath during build. |
| **Page refresh 404 on static hosts** | Host not rewriting SPA routes to `index.html` | Enable SPA rewrites on host or rely on hash-style routing. |
| **Data resets on page reload** | In-memory storage fallback active | Ensure `localStorage` is enabled in browser privacy settings. |

---

## Contributing

1. Fork the repository & create a feature branch (`git checkout -b feature/amazing-feature`).
2. Run quality checks before submitting PRs:
   ```bash
   npm run typecheck
   npm run lint
   npm run test
   ```
3. Commit your changes and open a Pull Request.

---

## License

This project is open-source and intended for educational and demonstration purposes.
