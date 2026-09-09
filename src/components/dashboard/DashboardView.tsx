import React from 'react';
import {
  Image,
  Video,
  BookOpen,
  FileText,
  Star,
  Layers,
  Sparkles,
  HardDrive,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMemories } from '../../context/MemoryContext';
import { StatCard } from './StatCard';
import { ActiveTab, MemoryItem } from '../../types';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPhotoModal: () => void;
  onOpenVideoModal: () => void;
  onOpenDiaryModal: () => void;
  onOpenNoteModal: () => void;
  onSelectMemory: (memory: MemoryItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenPhotoModal,
  onOpenVideoModal,
  onOpenDiaryModal,
  onOpenNoteModal,
  onSelectMemory,
}) => {
  const { user } = useAuth();
  const { memories, stats } = useMemories();

  const recentMemories = memories.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-rose-900/20 border border-purple-500/20 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Sanctuary</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            Welcome back, {user?.name || 'Explorer'} 👋
          </h1>
          <p className="text-sm sm:text-base text-purple-200/80 font-medium">
            “Your memories, your story.” Keep preserving every precious smile, sunset, and thought.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onOpenPhotoModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Image className="w-3.5 h-3.5" />
              <span>+ Add Photo</span>
            </button>
            <button
              onClick={onOpenVideoModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span>+ Add Video</span>
            </button>
            <button
              onClick={onOpenDiaryModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>+ Write Diary</span>
            </button>
            <button
              onClick={onOpenNoteModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ New Note</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark */}
        <div className="absolute -right-10 -bottom-10 text-9xl text-white/5 font-black pointer-events-none select-none">
          ❤️
        </div>
      </div>

      {/* 6 Dashboard Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Vault Overview
          </h2>
          <span className="text-xs text-slate-500">Live Statistics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            label="Photos"
            count={stats.totalPhotos}
            icon={Image}
            emoji="📸"
            colorClass="text-purple-500"
            accentBg="bg-purple-500"
            onClick={() => setActiveTab('photos')}
          />
          <StatCard
            label="Videos"
            count={stats.totalVideos}
            icon={Video}
            emoji="🎥"
            colorClass="text-sky-500"
            accentBg="bg-sky-500"
            onClick={() => setActiveTab('videos')}
          />
          <StatCard
            label="Diary Entries"
            count={stats.totalDiary}
            icon={BookOpen}
            emoji="📔"
            colorClass="text-rose-500"
            accentBg="bg-rose-500"
            onClick={() => setActiveTab('diary')}
          />
          <StatCard
            label="Notes"
            count={stats.totalNotes}
            icon={FileText}
            emoji="📝"
            colorClass="text-emerald-500"
            accentBg="bg-emerald-500"
            onClick={() => setActiveTab('notes')}
          />
          <StatCard
            label="Favorites"
            count={stats.totalFavorites}
            icon={Star}
            emoji="⭐"
            colorClass="text-amber-500"
            accentBg="bg-amber-500"
            onClick={() => setActiveTab('favorites')}
          />
          <StatCard
            label="All Memories"
            count={stats.totalMemories}
            icon={Layers}
            emoji="🗂️"
            colorClass="text-indigo-500"
            accentBg="bg-indigo-500"
            onClick={() => setActiveTab('timeline')}
          />
        </div>
      </div>

      {/* Split Section: Storage Breakdown & Quick Recent Reel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Widget */}
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-navy-900/70 backdrop-blur-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Private Vault Storage
                  </h3>
                  <span className="text-[11px] text-slate-400">IndexedDB Local Space</span>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {stats.totalSizeMb} MB / 500 MB
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden p-0.5 mb-5 flex">
              <div
                title={`Photos: ${stats.photosSizeMb} MB`}
                style={{ width: `${Math.min(100, Math.max(5, (stats.photosSizeMb / 500) * 100))}%` }}
                className="bg-purple-500 h-full rounded-l-full"
              />
              <div
                title={`Videos: ${stats.videosSizeMb} MB`}
                style={{ width: `${Math.min(100, (stats.videosSizeMb / 500) * 100)}%` }}
                className="bg-sky-500 h-full"
              />
              <div
                title={`Diary & Notes: ${stats.otherSizeKb} KB`}
                style={{ width: '5%' }}
                className="bg-rose-500 h-full rounded-r-full"
              />
            </div>

            {/* Legend */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-600 dark:text-slate-400">Photos Storage</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{stats.photosSizeMb} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-slate-600 dark:text-slate-400">Videos Storage</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{stats.videosSizeMb} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-slate-400">Diary & Notes</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{stats.otherSizeKb} KB</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="mt-6 w-full py-2.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-colors border border-purple-500/20"
          >
            Manage Storage & Backups →
          </button>
        </div>

        {/* Recent Memories Stream */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-navy-900/70 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Moments
              </h3>
              <p className="text-xs text-slate-400">Your latest preserved memories</p>
            </div>
            <button
              onClick={() => setActiveTab('timeline')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMemories.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No memories recorded yet. Click one of the buttons above to save your first memory! ❤️
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recentMemories.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMemory(m)}
                  className="group p-3 rounded-2xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      {m.type === 'photo' && '📸 Photo'}
                      {m.type === 'video' && '🎥 Video'}
                      {m.type === 'diary' && '📔 Diary'}
                      {m.type === 'note' && '📝 Note'}
                    </span>
                    <span>{m.date}</span>
                  </div>

                  {/* Thumbnail / content snippet */}
                  {m.type === 'photo' && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-2 bg-slate-200 dark:bg-navy-900">
                      <img
                        src={m.imageUrl}
                        alt={m.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {m.type === 'video' && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-2 bg-slate-900 relative flex items-center justify-center">
                      {m.thumbnailUrl ? (
                        <img
                          src={m.thumbnailUrl}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Video className="w-8 h-8 text-sky-400" />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-white/80 text-slate-900 flex items-center justify-center text-xs shadow-md">
                          ▶
                        </div>
                      </div>
                    </div>
                  )}

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-purple-500 transition-colors">
                    {m.type === 'diary' || m.type === 'note' || m.type === 'video'
                      ? m.title
                      : m.caption}
                  </h4>

                  {m.type === 'diary' && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {m.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
