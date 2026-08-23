import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { EmptyState } from '../components/feedback/empty-state';
import { PageErrorState } from '../components/feedback/page-error-state';

// Mock Router hook
vi.mock('../router/Router', () => ({
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}));

describe('Feedback Components', () => {
  describe('EmptyState', () => {
    it('renders default title and description', () => {
      render(<EmptyState />);
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(
        screen.getByText('Try adjusting your search query, filter criteria, or date range.')
      ).toBeInTheDocument();
    });

    it('renders custom title, description, and handles action click', () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="No Watchlists"
          description="Add items to watchlist."
          actionLabel="Reset Filters"
          onAction={handleAction}
        />
      );

      expect(screen.getByText('No Watchlists')).toBeInTheDocument();
      expect(screen.getByText('Add items to watchlist.')).toBeInTheDocument();

      const btn = screen.getByRole('button', { name: /reset filters/i });
      fireEvent.click(btn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('PageErrorState', () => {
    it('renders default error message and navigation buttons', () => {
      render(<PageErrorState />);
      expect(screen.getByText('Content Not Available')).toBeInTheDocument();
      expect(
        screen.getByText(
          'The requested resource, asset, or trading pair could not be found or loaded.'
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /explore markets/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    });

    it('renders retry button when onRetry is passed', () => {
      const handleRetry = vi.fn();
      render(<PageErrorState onRetry={handleRetry} />);

      const retryBtn = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
