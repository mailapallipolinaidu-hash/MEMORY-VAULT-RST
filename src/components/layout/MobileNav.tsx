import React from 'react';
import { Home, Image, Video, BookOpen, FileText, Clock, User } from 'lucide-react';
import { ActiveTab } from '../../types';

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'diary', label: 'Diary', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
