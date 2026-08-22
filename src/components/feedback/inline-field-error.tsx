import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InlineFieldErrorProps {
  id?: string;
  error?: string | null;
  className?: string;
}

export const InlineFieldError: React.FC<InlineFieldErrorProps> = ({ id, error, className = '' }) => {
  if (!error) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-1.5 text-xs text-red-400 font-medium mt-1.5 animate-fadeIn ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
      <span>{error}</span>
    </div>
  );
};
