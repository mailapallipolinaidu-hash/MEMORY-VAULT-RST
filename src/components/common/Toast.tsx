import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-purple-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500/30 text-rose-200',
    info: 'bg-navy-900/95 border-purple-500/30 text-purple-200',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${bgStyles[toast.type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
