/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DemoProvider } from './context/DemoContext';
import { Router, Route, Switch, useRouter, Link } from './router/Router';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner, MobileNav } from './components/layout/DemoBanner';
import { ToastContainer } from './components/ui/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketsPage } from './pages/MarketsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { TradePage } from './pages/TradePage';
import { BuySellConvertPage } from './pages/BuySellConvertPage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletPage } from './pages/WalletPage';
import { HistoryPage } from './pages/HistoryPage';
import { WatchlistAlertsPage } from './pages/WatchlistAlertsPage';
import { LearnPage } from './pages/LearnPage';
import { LearnArticlePage } from './pages/LearnArticlePage';
import { SettingsSecurityPage } from './pages/SettingsSecurityPage';
import { HelpPage } from './pages/HelpPage';
import { LegalRiskPage, LegalTermsPage, LegalPrivacyPage } from './pages/LegalPages';
import { Button } from './components/ui/BaseComponents';

import { ErrorBoundary } from './lib/errors/error-boundary';

// 404 Fallback Page
const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <h2 className="text-4xl font-extrabold text-white font-mono">404</h2>
      <p className="text-slate-400 text-sm max-w-sm">
        The sandbox destination you requested could not be located or may have moved.
      </p>
      <Button variant="primary" size="md" onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <DemoProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#0B0E11] text-gray-100 font-sans antialiased selection:bg-indigo-600 selection:text-white pb-16 md:pb-0">
            {/* Skip to Main Content Link for A11y */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:outline-none shadow-lg"
            >
              Skip to content
            </a>

            {/* Top Persistent Sandbox Mode Banner */}
            <DemoBanner />

            {/* Main Navigation Header */}
            <Navbar />

            {/* Main Route Content Outlet */}
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              <ErrorBoundary>
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/markets" component={MarketsPage} />
                  <Route path="/markets/:symbol" component={AssetDetailPage} />
                  <Route path="/trade" component={TradePage} />
                  <Route path="/trade/:pair" component={TradePage} />
                  <Route path="/buy" component={BuySellConvertPage} />
                  <Route path="/sell" component={BuySellConvertPage} />
                  <Route path="/convert" component={BuySellConvertPage} />
                  <Route path="/dashboard" component={DashboardPage} />
                  <Route path="/portfolio" component={DashboardPage} />
                  <Route path="/wallet" component={WalletPage} />
                  <Route path="/history" component={HistoryPage} />
                  <Route path="/watchlist" component={WatchlistAlertsPage} />
                  <Route path="/alerts" component={WatchlistAlertsPage} />
                  <Route path="/learn" component={LearnPage} />
                  <Route path="/learn/:slug" component={LearnArticlePage} />
                  <Route path="/settings" component={SettingsSecurityPage} />
                  <Route path="/security" component={SettingsSecurityPage} />
                  <Route path="/help" component={HelpPage} />
                  <Route path="/faq" component={HelpPage} />
                  <Route path="/legal/risk" component={LegalRiskPage} />
                  <Route path="/legal/terms" component={LegalTermsPage} />
                  <Route path="/legal/privacy" component={LegalPrivacyPage} />
                  <NotFoundPage />
                </Switch>
              </ErrorBoundary>
            </main>

            {/* Footer with Compliance & Risk Disclosures */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <MobileNav />

            {/* Global Toast Notification Stack */}
            <ToastContainer />
          </div>
        </Router>
      </DemoProvider>
    </ErrorBoundary>
  );
}
