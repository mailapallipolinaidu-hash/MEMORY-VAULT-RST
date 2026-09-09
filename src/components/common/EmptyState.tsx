import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  emoji?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title = 'No memories yet ❤️',
  description = 'Start saving your special moments in your private vault.',
  actionText,
  onAction,
  emoji,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-navy-900/40 backdrop-blur-sm my-8">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
          {emoji ? (
            <span className="text-3xl">{emoji}</span>
          ) : Icon ? (
            <Icon className="w-10 h-10" />
          ) : (
            <Sparkles className="w-10 h-10" />
          )}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs animate-bounce">
          ❤️
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
