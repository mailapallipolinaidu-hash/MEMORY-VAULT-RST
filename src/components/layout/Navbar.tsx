import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Plus, LogOut, User as UserIcon, Users, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveTab } from '../../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenAuthModal,
}) => {
  const { user, logout, availableUsers, switchUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-950/80 backdrop-blur-xl transition-colors">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 md:px-8 gap-4">
        {/* Left: Mobile Title if needed / Brand badge on mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <span className="text-xl">❤️</span>
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg">
              Memory<span className="text-purple-500">Vault</span>
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() && activeTab !== 'search') {
                  setActiveTab('search');
                }
              }}
              placeholder="Search your memories, tags, diary, photos... (Press '/' to focus)"
              className="w-full pl-10 pr-10 py-2 text-sm rounded-xl bg-slate-100/90 dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Button */}
          {user && (
            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Memory</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-850 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* User Account / Switcher */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-850 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/40"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-purple-500 dark:text-purple-400 font-medium">
                    Private Vault
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.phone}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-purple-500" />
                      View Profile & Storage
                    </button>
                  </div>

                  {/* Multi-user account switcher to immediately verify data isolation */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 pb-1">
                    <div className="px-3 py-1 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Account (User Isolation)
                      </span>
                      <Users className="w-3 h-3 text-slate-400" />
                    </div>
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`flex items-center gap-2.5 w-full px-3 py-1.5 text-xs rounded-xl transition-colors ${
                          u.id === user.id
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
                        }`}
                      >
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="truncate">{u.name}</span>
                        {u.id === user.id && <span className="ml-auto text-[10px]">Active</span>}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
