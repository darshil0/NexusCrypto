# NexusCrypto — Paper Trading Platform

NexusCrypto is a frontend-only, browser-based paper trading sandbox that simulates a simplified cryptocurrency trading experience for learning and experimentation. It's intended for demos, tutorials, and local development — not real trading, custody, or financial advice.

> ⚠️ DISCLAIMER: NexusCrypto is strictly a paper trading sandbox and educational demo. No real funds, blockchain transactions, or external custody are used. All balances, orders, notifications, and activity are simulated locally in the browser.

---

## Quick highlights

- Simulated paper trading terminal with market/limit orders, order book, and charting UI.
- Portfolio, wallet faucet, and transaction ledger stored locally (safe localStorage fallback to in-memory storage when required).
- Watchlists and alert notifications for price changes.
- Educational Learn Hub with articles and micro-quizzes.
- Lightweight client-side router with optional base-path support for GitHub Pages.

---

## Tech stack

- Framework: React 19 + TypeScript
- Bundler: Vite
- Styling: Tailwind CSS
- Icons: Lucide
- Testing: Vitest

---

## Getting started (local development)

Prerequisites:
- Node.js 18+ (20 LTS recommended)
- npm (v9+) or bun/pnpm

Install and run locally:

```bash
# install
npm install

# dev server (localhost:3000)
npm run dev
```

Type checking & linting:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
```

Run tests:

```bash
npm run test        # vitest
```

Build:

```bash
npm run build       # builds static output (configured to `out/`)
```

---

## App behavior & runtime notes

Storage:
- The app stores all demo user data in `localStorage` using a safe storage wrapper. If `localStorage` is unavailable (private mode, quota errors), it falls back to an in-memory store for the session.
- Reset demo data via the top banner `Reset Demo` button or from Settings.

Routing & base path:
- The client router supports a `NEXT_PUBLIC_BASE_PATH`/`BASE_URL` environment variable for deployments under a subpath (e.g., GitHub Pages).
- The router also supports hash-style routes; navigation will prefer clean history API routes where available and fall back to hash navigation when appropriate.

Accessibility:
- Focusable "Skip to content" anchor is included for keyboard navigation. Modals and interactive components include accessible attributes where applicable, but this is an MVP — review with an a11y audit for production readiness.

---

## Environment variables

- NEXT_PUBLIC_BASE_PATH (optional) — set this if deploying to a site subpath (e.g. `/${repo-name}`) so asset and route resolution is correct.

Set during build time, for example:

```bash
NEXT_PUBLIC_BASE_PATH=/NexusCrypto- npm run build
```

---

## Deployment

Vercel
- Framework Preset: Vite
- Build command: `npm run build`
- Output directory: `out` (ensure Vite config uses `out` as `build.outDir`)

GitHub Pages
- A GitHub Actions workflow (if present) can be used to publish the `out/` directory to GitHub Pages. If deploying under `username.github.io/repo-name`, set `NEXT_PUBLIC_BASE_PATH` to `/repo-name` at build time.

---

## Project structure (abridged)

```
src/
├─ components/       # UI components, layout, trade widgets
├─ context/          # DemoContext (global demo state)
├─ data/             # seed/mock data
├─ lib/              # utilities, safeStorage, error handling
├─ pages/            # route views
├─ router/           # small client router
├─ types/            # TypeScript types
└─ utils/            # formatters & calculations
```

---

## Troubleshooting

- Blank page / broken assets: ensure `NEXT_PUBLIC_BASE_PATH` and `vite.config.ts` base are configured correctly for your deployment.
- Route refresh 404 on static hosting: either configure the host to rewrite requests to `index.html` or use hash-based routing (router supports this fallback).
- localStorage errors in private mode: the app will fall back to in-memory storage; clear cookies or use a normal browser window for persistence.

---

## Contributing

Contributions are welcome. Please open issues or PRs describing the change, run the typechecker and linter, and include tests for behavior changes where possible.

Suggested workflow:

```bash
git checkout -b fix/your-change
# make changes
npm run typecheck
npm run lint
npm run test
git commit -am "Describe your change"
git push origin fix/your-change
# open PR
```

---

## License

This project is provided as-is for educational/demo purposes. Check the repository root for an explicit license file — if none is present, assume personal/educational demo use only and request permission before reusing any substantial parts.

---

If you want, I can (1) add badges, a shorter intro for npm/github listing, and/or (2) tailor the README with usage screenshots and example flows. Do you want any of those?