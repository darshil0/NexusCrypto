# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-08-23

### Added
- **Price Alerts Trigger System**: Save target price triggers (`≥ above` and `≤ below`) persisted reliably across browser sessions in `localStorage`.
- **Header Visual Indicator & Live Ticker Alerts**: Visual alert beacon in the top header with radar pulse effect, count badges, and ticker indicators displaying when simulated market movements cross configured targets.
- **Quick Alerts Dropdown**: Header dropdown allowing users to view active vs. triggered alerts, inspect distances to targets (`% to target`), test alerts, re-arm triggered triggers, and set new price alerts without leaving the page.
- **Market Movement Simulator**: Interactive control panel in `/watchlist` enabling users to simulate market movements (e.g. +5% pumps or -5% dumps) to test alert triggers in real time.
- **Price Alerts Unit Tests**: Vitest test suite (`src/__tests__/price-alerts.test.ts`) validating threshold conditions, state transitions, and re-arming behavior.
- **CI/CD Pipeline Hardening**: Streamlined `.github/workflows/ci.yml` and `.github/workflows/deploy.yml` with Node.js LTS 20 setup, npm dependency caching with `package-lock.json`, npm security audits, TypeScript typechecking, code coverage reports, automated `404.html` SPA routing fallbacks, and concurrency management.

## [0.2.0] - 2026-08-22

### Added
- **Interactive Paper Trading Sandbox**: Full simulation suite supporting Market, Limit, and Stop Loss orders, instant asset conversion, portfolio management, wallet faucet, and transaction ledger.
- **Market Heatmap & Analytics**: Dynamic market visualization dashboard with live price tracking, 24h change indicators, volume metrics, order book visualization, and recent trade history.
- **Learn Hub & Micro-Quizzes**: Educational module containing interactive guides, cryptocurrency tutorials, and micro-quizzes to test trading knowledge.
- **Watchlists & Custom Price Alerts**: Personalized asset tracking and alert notification system for monitoring crypto market movements.
- **SafeStorage Fallback System**: High-reliability browser storage abstraction (`safeStorage`) that seamlessly falls back to in-memory storage if `localStorage` is restricted or quota is exceeded.
- **Comprehensive Unit Test Suite**: Vitest tests covering financial calculations, safe storage operations, validation logic, formatters, and global `DemoContext` state operations.
- **GitHub Actions Deployment Workflows**: Automated CI/CD pipeline (`.github/workflows/deploy.yml`) supporting build verification, linting, typechecking, testing, and deployment to GitHub Pages.

### Changed
- **Client Router Enhancements**: Upgraded lightweight client-side router with robust path normalization, `NEXT_PUBLIC_BASE_PATH` / `BASE_PATH` subpath resolution, and hash navigation fallback support.
- **UI & Accessibility Improvements**: Enhanced modals with `Escape` key handling, `role="dialog"`, `aria-modal`, and focus trap attributes. Added focusable "Skip to content" anchor for keyboard navigation.
- **Project Structure & Dependencies**: Cleaned up `package.json` dependencies, standardized package name to `nexus-crypto`, and configured Vite output directory to `out/`.

### Fixed
- **Router Navigation Mismatches**: Resolved path handling issues with base paths and subpath routing for deployment environments like GitHub Pages and Vercel.
- **TypeScript Mismatches & Boundary State Errors**: Fixed error boundary class inheritance, `createAppError` type signature in `src/lib/errors/validation.ts`, and missing `isProcessing` state property in `DemoContext`.
- **Linting & Code Style Compliance**: Addressed `prefer-const` warnings and unused variables across page components and hooks.

## [0.1.0] - 2026-08-22

### Added
- Vitest unit test suite covering financial calculations, safe storage fallback, form validations, and formatters (`src/utils/utils.test.ts`).
- `typecheck` script (`tsc --noEmit`) and `test` script (`vitest run`) in `package.json`.
- Automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`) supporting GitHub Pages with concurrency control and permissions.
- Full `README.md` documentation including project overview, disclaimer, local commands, troubleshooting table, and limitations.
- Initial `CHANGELOG.md` following Keep a Changelog standard.

### Changed
- Configured Vite build output directory to `out` and added support for configurable `NEXT_PUBLIC_BASE_PATH` / `BASE_PATH` environment variables.
- Updated Router navigation and Link components to safely handle base paths and subpaths for GitHub Pages and Vercel.
- Enhanced Modal accessibility with `Escape` key listeners, `role="dialog"`, `aria-modal`, and `aria-labelledby`.
- Updated `useDefineForClassFields` in `tsconfig.json` and React component type bindings.

### Fixed
- Fixed TypeScript module export mismatch in `src/lib/errors/validation.ts` for `createAppError`.
- Fixed ErrorBoundary inheritance and class state type errors in `src/lib/errors/error-boundary.tsx`.
- Fixed missing `isProcessing` property in `DemoContext`.
- Fixed React Link `title` property interface definition in `src/router/Router.tsx`.
- Fixed fallback 404 route rendering using a new `Switch` component in `src/App.tsx`.
