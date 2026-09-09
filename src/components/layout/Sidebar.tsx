import React from 'react';
import {
  Home,
  Image,
  Video,
  BookOpen,
  FileText,
  Star,
  Clock,
  User as UserIcon,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { useMemories } from '../../context/MemoryContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { stats } = useMemories();
  const { user, logout } = useAuth();

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    color?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'photos', label: 'Photos', icon: Image, count: stats.totalPhotos, color: 'text-purple-400' },
    { id: 'videos', label: 'Videos', icon: Video, count: stats.totalVideos, color: 'text-sky-400' },
    { id: 'diary', label: 'Diary', icon: BookOpen, count: stats.totalDiary, color: 'text-rose-400' },
    { id: 'notes', label: 'Notes', icon: FileText, count: stats.totalNotes, color: 'text-emerald-400' },
    { id: 'favorites', label: 'Favorites', icon: Star, count: stats.totalFavorites, color: 'text-amber-400' },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'profile', label: 'Profile & Vault', icon: UserIcon },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-navy-950/60 backdrop-blur-xl p-4 transition-colors select-none">
      {/* Brand Header */}
      <div
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-3 px-3 py-4 mb-4 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
          <span className="text-xl">❤️</span>
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Memory<span className="text-purple-500">Vault</span>
          </h1>
          <span className="text-[10px] tracking-wider uppercase font-semibold text-purple-400 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Private Space
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/15 to-indigo-600/10 text-purple-600 dark:text-purple-300 font-semibold shadow-sm border border-purple-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-navy-900/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-purple-500' : item.color || 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {typeof item.count === 'number' && item.count > 0 && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'bg-slate-200/80 dark:bg-navy-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Storage Indicator */}
      <div className="mt-4 p-3 rounded-2xl bg-slate-100/80 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Storage Used</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{stats.totalSizeMb} MB</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            style={{ width: `${Math.min(100, Math.max(8, (stats.totalSizeMb / 500) * 100))}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 mt-1 block">500 MB Free Tier</span>
      </div>

      {/* Logout Action */}
      {user && (
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout ({user.name.split(' ')[0]})</span>
        </button>
      )}
    </aside>
  );
};
