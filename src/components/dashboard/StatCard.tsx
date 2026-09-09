import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  emoji: string;
  colorClass: string;
  accentBg: string;
  onClick: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  count,
  icon: Icon,
  emoji,
  colorClass,
  accentBg,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-navy-900/70 backdrop-blur-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Ambient background glow */}
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:opacity-25 transition-opacity ${accentBg}`}
      />

      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner ${colorClass} ${accentBg}`}
        >
          <span className="text-xl">{emoji}</span>
        </div>
        <div className="p-1.5 rounded-xl text-slate-400 group-hover:text-purple-500 group-hover:bg-purple-500/10 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
          {count}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
};
