# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-08-23

### Fixed
- Router: improved navigate() to handle hash-based navigation and basePath handling, and made path normalization more robust.
- package.json: removed duplicate `vite` from dependencies and updated package name to `nexus-crypto`.
- Minor maintenance: added changelog entry documenting the fixes.

## [0.1.0] - 2026-08-22

### Added
- Vitest unit test suite covering financial calculations, safe storage fallback, form validations, and formatters (`src/utils/utils.test.ts`).
- `typecheck` script (`tsc --noEmit`) and `test` script (`vitest run`) in `package.json`.
- Automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`) supporting GitHub Pages with concurrency control and permissions.
- Full `README.md` documentation including project overview, disclaimer, local commands, troubleshooting table, and limitations.
- `CHANGELOG.md` following Keep a Changelog standard.

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
