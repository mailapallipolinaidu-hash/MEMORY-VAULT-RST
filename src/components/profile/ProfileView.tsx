import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Phone,
  Calendar,
  HardDrive,
  Layers,
  Camera,
  Download,
  Upload,
  LogOut,
  ShieldCheck,
  Moon,
  Sun,
  Save,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMemories } from '../../context/MemoryContext';
import { useTheme } from '../../context/ThemeContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
];

export const ProfileView: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { stats, exportData, importData, celebrate } = useMemories();
  const { isDarkMode, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name: name.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSelectAvatar = async (url: string) => {
    await updateUser({ avatarUrl: url });
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      updateUser({ avatarUrl: url });
    }
  };

  const handleExport = async () => {
    const jsonStr = await exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memoryvault-backup-${user.name.toLowerCase().replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    celebrate();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        if (text) {
          const res = await importData(text);
          if (res.success) {
            setImportStatus(`Successfully restored ${res.count} memories into your vault!`);
          } else {
            setImportStatus(`Import failed: ${res.error}`);
          }
          setTimeout(() => setImportStatus(null), 5000);
        }
      };
      reader.readAsText(file);
    }
  };

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-navy-950 border border-purple-500/20 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with edit overlay */}
          <div className="relative group">
            <img
              src={user.avatarUrl || PRESET_AVATARS[0]}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-purple-500/30 shadow-xl"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span>Change</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Personal Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-xl">
              {user.bio || 'Your memories are strictly isolated and accessible only to you.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 mt-4">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                {user.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Member since {formattedJoinDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Memories
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalMemories}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Photos Stored
          </span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {stats.totalPhotos}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Videos Saved
          </span>
          <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
            {stats.totalVideos}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Storage Footprint
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats.totalSizeMb} MB
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Personal Information
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Personal Bio / Motto
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Documenting the little moments."
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Avatar Gallery */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Choose Preset Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAvatar(url)}
                  className={`relative shrink-0 rounded-2xl overflow-hidden transition-all ${
                    user.avatarUrl === url
                      ? 'ring-4 ring-purple-500 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-12 h-12 object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {savedSuccess ? (
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile updated successfully!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup & Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Data Backup & Restore */}
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Data Vault Backup & Migration
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Download an offline JSON backup of your entire private memory vault, or restore from a previous export.
          </p>

          {importStatus && (
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-medium">
              {importStatus}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-purple-500" />
              <span>Export Vault</span>
            </button>

            <button
              onClick={() => jsonImportRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <Upload className="w-4 h-4 text-sky-500" />
              <span>Import Backup</span>
            </button>
            <input
              type="file"
              ref={jsonImportRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Preferences & Logout */}
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-navy-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Preferences & Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your interface experience and active session
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/80 dark:bg-navy-950/80">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Theme Appearance
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-navy-850 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition-all"
            >
              {isDarkMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-purple-400" /> Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode
                </>
              )}
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>End Session / Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
