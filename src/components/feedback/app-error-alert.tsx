import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { AppError } from '../../lib/errors/error-codes';

interface AppErrorAlertProps {
  error: AppError | string | null;
  onDismiss?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  className?: string;
  id?: string;
}

export const AppErrorAlert: React.FC<AppErrorAlertProps> = ({
  error,
  onDismiss,
  onAction,
  actionLabel,
  severity = 'error',
  className = '',
  id,
}) => {
  if (!error) return null;

  const title = typeof error === 'string' ? 'Attention Required' : error.title;
  const message = typeof error === 'string' ? error : error.message;
  const resolvedActionLabel = actionLabel || (typeof error !== 'string' ? error.actionLabel : undefined);

  const styles = {
    error: {
      bg: 'bg-red-950/70 border-red-800/80 text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
      btn: 'bg-red-900/80 hover:bg-red-800 text-red-100 border-red-700',
    },
    warning: {
      bg: 'bg-amber-950/70 border-amber-800/80 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      btn: 'bg-amber-900/80 hover:bg-amber-800 text-amber-100 border-amber-700',
    },
    info: {
      bg: 'bg-indigo-950/70 border-indigo-800/80 text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
      btn: 'bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border-indigo-700',
    },
    success: {
      bg: 'bg-emerald-950/70 border-emerald-800/80 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      btn: 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border-emerald-700',
    },
  }[severity];

  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className={`rounded-xl border p-4 flex items-start justify-between gap-3 shadow-sm ${styles.bg} ${className}`}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="space-y-1">
          {title && <h4 className="text-xs font-bold uppercase tracking-wider">{title}</h4>}
          <p className="text-xs leading-relaxed opacity-95">{message}</p>

          {resolvedActionLabel && onAction && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onAction}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${styles.btn}`}
              >
                {resolvedActionLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error message"
          className="p-1 rounded-lg hover:bg-black/20 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
