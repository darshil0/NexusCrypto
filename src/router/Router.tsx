import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string, state?: any) => void;
  params: Record<string, string>;
  search: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(rawPath: string): string {
  let p = rawPath;
  // If starts with hash e.g. #/markets/BTC
  if (p.startsWith('#')) {
    p = p.slice(1);
  }
  // Strip query string for path matching
  const qIndex = p.indexOf('?');
  if (qIndex !== -1) {
    p = p.slice(0, qIndex);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  // Remove trailing slash unless root
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname + window.location.search;
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        setCurrentUrl(window.location.hash.slice(1));
      } else {
        setCurrentUrl(window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', to);
      setCurrentUrl(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Compute params based on route structure
  const path = normalizePath(currentUrl);
  const qIndex = currentUrl.indexOf('?');
  const search = qIndex !== -1 ? currentUrl.slice(qIndex) : '';

  const params: Record<string, string> = {};
  const segments = path.split('/').filter(Boolean);

  if (segments[0] === 'markets' && segments[1]) {
    params.symbol = segments[1].toUpperCase();
  } else if (segments[0] === 'trade' && segments[1]) {
    if (segments[2]) {
      params.pair = `${segments[1].toUpperCase()}/${segments[2].toUpperCase()}`;
    } else {
      const decoded = decodeURIComponent(segments[1]).toUpperCase();
      params.pair = decoded.includes('/') ? decoded : `${decoded}/USD`;
    }
  } else if (segments[0] === 'learn' && segments[1]) {
    params.slug = segments[1];
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params, search }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};

export const Router = RouterProvider;

export const Route: React.FC<{
  path: string;
  component: React.ComponentType<any>;
}> = ({ path, component: Component }) => {
  const { path: currentPath } = useRouter();

  // Handle parameterized matching
  const matchRoute = (pattern: string, actual: string) => {
    if (pattern === actual) return true;
    const patternSegments = pattern.split('/').filter(Boolean);
    const actualSegments = actual.split('/').filter(Boolean);

    // Special case for /trade/:pair matching /trade/BTC/USD or /trade/BTC
    if (pattern === '/trade/:pair' && actualSegments[0] === 'trade' && actualSegments.length >= 2) {
      return true;
    }

    if (patternSegments.length !== actualSegments.length) return false;

    return patternSegments.every((seg, i) => {
      if (seg.startsWith(':')) return true;
      return seg === actualSegments[i];
    });
  };

  if (!matchRoute(path, currentPath)) {
    return null;
  }

  return <Component />;
};

export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
  activeClassName?: string;
}> = ({ to, children, className = '', id, onClick, activeClassName = '' }) => {
  const { path, navigate } = useRouter();
  const isActive = path === normalizePath(to) || (to !== '/' && path.startsWith(normalizePath(to)));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  const finalClass = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a id={id} href={to} onClick={handleClick} className={finalClass}>
      {children}
    </a>
  );
};


