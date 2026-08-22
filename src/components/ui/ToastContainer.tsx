import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />;
        let borderClass = 'border-blue-500/30 bg-slate-900/95 text-slate-100';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
          borderClass = 'border-emerald-500/30 bg-slate-900/95 text-slate-100';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
          borderClass = 'border-amber-500/30 bg-slate-900/95 text-slate-100';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
          borderClass = 'border-rose-500/30 bg-slate-900/95 text-slate-100';
        }

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 text-sm">
              {toast.title && <h4 className="font-semibold text-white mb-0.5">{toast.title}</h4>}
              <p className="text-slate-300 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
