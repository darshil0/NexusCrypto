import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { AppErrorAlert } from '../components/feedback/app-error-alert';
import { ErrorBoundary } from '../lib/errors/error-boundary';
import { createAppError } from '../lib/errors/error-messages';

const ProblemChild = () => {
  throw new Error('Explosive test error');
};

describe('Error Handling Components', () => {
  describe('AppErrorAlert', () => {
    it('returns null when error is null', () => {
      const { container } = render(<AppErrorAlert error={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders string errors properly', () => {
      render(<AppErrorAlert error="Something went wrong in testing" />);
      expect(screen.getByText('Something went wrong in testing')).toBeInTheDocument();
      expect(screen.getByText('Attention Required')).toBeInTheDocument();
    });

    it('renders AppError with title and custom action', () => {
      const handleAction = vi.fn();
      const appErr = createAppError('INSUFFICIENT_USD_BALANCE');
      render(<AppErrorAlert error={appErr} onAction={handleAction} />);

      expect(screen.getByText('Insufficient USD Balance')).toBeInTheDocument();
      expect(screen.getByText('Use Max Balance')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /use max balance/i }));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it('handles dismiss button clicks', () => {
      const handleDismiss = vi.fn();
      render(<AppErrorAlert error="Dismissible error" onDismiss={handleDismiss} />);

      const dismissBtn = screen.getByLabelText('Dismiss error message');
      fireEvent.click(dismissBtn);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('ErrorBoundary', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Safe Content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });

    it('catches render error and displays fallback UI', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText(
          'An unexpected rendering error occurred. Your simulated balances and trading data remain intact.'
        )
      ).toBeInTheDocument();
      consoleSpy.mockRestore();
    });
  });
});
