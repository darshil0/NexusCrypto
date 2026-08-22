import React from 'react';
import { AlertTriangle, Home, ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from '../../router/Router';

interface PageErrorStateProps {
  title?: string;
  message?: string;
  suggestedAction?: 'markets' | 'dashboard' | 'back';
  onRetry?: () => void;
}

export const PageErrorState: React.FC<PageErrorStateProps> = ({
  title = 'Content Not Available',
  message = 'The requested resource, asset, or trading pair could not be found or loaded.',
  suggestedAction = 'dashboard',
  onRetry,
}) => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 bg-[#0B0E11] select-none">
      <div className="max-w-md w-full bg-[#161A1E] border border-gray-800 rounded-2xl p-8 text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white">{title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/markets')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Markets
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0B0E11] border border-gray-700 hover:border-gray-600 text-gray-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
