import React from 'react';
import { Search, FolderOpen, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'folder';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try adjusting your search query, filter criteria, or date range.',
  icon = 'search',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-[#0B0E11] border border-gray-800 flex items-center justify-center text-gray-500">
        {icon === 'search' ? <Search className="w-6 h-6" /> : <FolderOpen className="w-6 h-6" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-gray-200">{title}</h4>
        <p className="text-xs text-gray-400 max-w-sm">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
