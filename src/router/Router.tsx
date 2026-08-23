import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string, state?: any) => void;
  params: Record<string, string>;
  search: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function getBasePath(): string {
  const envBase = (import.meta as any).env?.NEXT_PUBLIC_BASE_PATH || (import.meta as any).env?.BASE_URL || '';
  if (!envBase || envBase === '/' || envBase === '.') return '';
  let cleaned = envBase.startsWith('/') ? envBase : '/' + envBase;
  if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  return cleaned;
}

function normalizePath(rawPath: string): string {
  let p = rawPath || '';
  // If starts with hash e.g. #/markets/BTC
  if (p.startsWith('#')) {
    p = p.slice(1);
  }
  // Strip query string for path matching
  const qIndex = p.indexOf('?');
  if (qIndex !== -1) {
    p = p.slice(0, qIndex);
  }

  const basePath = getBasePath();
  if (basePath && p.startsWith(basePath)) {
    p = p.slice(basePath.length);
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

  const navigate = useCallback((to: string, _state?: any) => {
    if (typeof window === 'undefined') return;
    const basePath = getBasePath();
    // If caller explicitly uses hash-based link (e.g. "#/markets/BTC") or
    // if the current app uses hashes, prefer setting the hash to trigger hashchange.
    if (to.startsWith('#')) {
      // keep as-is (e.g. "#/path")
      window.location.hash = to;
      // update internal state to the path portion
      setCurrentUrl(window.location.hash.slice(1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If the caller passed a path and the app uses a basePath, ensure the href includes it.
    let target = to;
    if (basePath && !to.startsWith(basePath) && !to.startsWith('#')) {
      target = basePath + (to.startsWith('/') ? to : '/' + to);
    }

    // Use history API for "clean" routes
    try {
      window.history.pushState(_state || {}, '', target);
    } catch {
      // Fallback for environments where pushState may fail
      window.location.assign(target);
      return;
    }
    setCurrentUrl(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

export function matchRoute(pattern: string, actual: string): boolean {
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
}

export const Route: React.FC<{
  path: string;
  component: React.ComponentType<any>;
}> = ({ path, component: Component }) => {
  const { path: currentPath } = useRouter();

  if (!matchRoute(path, currentPath)) {
    return null;
  }

  return <Component />;
};

export const Switch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { path: currentPath } = useRouter();

  const childrenArray = React.Children.toArray(children);
  for (const child of childrenArray) {
    if (React.isValidElement(child)) {
      if (child.type === Route) {
        const routePath = (child.props as any).path;
        if (routePath && matchRoute(routePath, currentPath)) {
          return child;
        }
      } else {
        // Non-Route children are treated as a fallback (e.g. a NotFound component)
        return child;
      }
    }
  }
  return null;
};

export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
  activeClassName?: string;
}> = ({ to, children, className = '', id, title, onClick, activeClassName = '' }) => {
  const { path, navigate } = useRouter();
  const normalizedTo = normalizePath(to);
  const isActive = path === normalizedTo || (normalizedTo !== '/' && path.startsWith(normalizedTo + '/'));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  const finalClass = `${className} ${isActive ? activeClassName : ''}`.trim();
  const basePath = getBasePath();
  const href = basePath && !to.startsWith(basePath) && !to.startsWith('#') ? basePath + (to.startsWith('/') ? to : '/' + to) : to;

  return (
    <a id={id} href={href} title={title} onClick={handleClick} className={finalClass}>
      {children}
    </a>
  );
};
