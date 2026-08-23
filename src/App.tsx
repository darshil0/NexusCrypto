/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DemoProvider } from './context/DemoContext';
import { Router, Route, Switch, useRouter } from './router/Router';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner, MobileNav } from './components/layout/DemoBanner';
import { ToastContainer } from './components/ui/ToastContainer';
import { Button } from './components/ui/BaseComponents';
import { ErrorBoundary } from './lib/errors/error-boundary';

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
import {
  LegalRiskPage,
  LegalTermsPage,
  LegalPrivacyPage,
} from './pages/LegalPages';

const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section
      className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 text-center"
      aria-labelledby="not-found-title"
    >
      <h1
        id="not-found-title"
        className="font-mono text-4xl font-extrabold text-white"
      >
        404
      </h1>

      <p className="max-w-sm text-sm text-slate-400">
        The sandbox destination you requested could not be located or may have moved.
      </p>

      <Button variant="primary" size="md" onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </section>
  );
};

export default function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <DemoProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-[#0B0E11] pb-16 font-sans text-gray-100 antialiased selection:bg-indigo-600 selection:text-white md:pb-0">
            <a
              href="#main-content"
              className="sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
            >
              Skip to content
            </a>

            <DemoBanner />
            <Navbar />

            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 focus:outline-none"
            >
              <ErrorBoundary>
                <Switch>
                  {/* Specific routes must appear before their parent routes. */}
                  <Route path="/markets/:symbol" component={AssetDetailPage} />
                  <Route path="/markets" component={MarketsPage} />

                  <Route path="/trade/:pair" component={TradePage} />
                  <Route path="/trade" component={TradePage} />

                  <Route path="/buy" component={BuySellConvertPage} />
                  <Route path="/sell" component={BuySellConvertPage} />
                  <Route path="/convert" component={BuySellConvertPage} />

                  <Route path="/dashboard" component={DashboardPage} />
                  <Route path="/portfolio" component={DashboardPage} />
                  <Route path="/wallet" component={WalletPage} />
                  <Route path="/history" component={HistoryPage} />

                  <Route path="/watchlist" component={WatchlistAlertsPage} />
                  <Route path="/alerts" component={WatchlistAlertsPage} />

                  <Route path="/learn/:slug" component={LearnArticlePage} />
                  <Route path="/learn" component={LearnPage} />

                  <Route path="/settings" component={SettingsSecurityPage} />
                  <Route path="/security" component={SettingsSecurityPage} />
                  <Route path="/help" component={HelpPage} />
                  <Route path="/faq" component={HelpPage} />

                  <Route path="/legal/risk" component={LegalRiskPage} />
                  <Route path="/legal/terms" component={LegalTermsPage} />
                  <Route path="/legal/privacy" component={LegalPrivacyPage} />

                  {/* Keep the root route last if Route uses prefix matching. */}
                  <Route path="/" component={HomePage} />

                  <NotFoundPage />
                </Switch>
              </ErrorBoundary>
            </main>

            <Footer />
            <MobileNav />
            <ToastContainer />
          </div>
        </Router>
      </DemoProvider>
    </ErrorBoundary>
  );
}
