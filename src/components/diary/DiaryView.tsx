import React, { useState, useMemo } from 'react';
import { Plus, BookOpen, Star, Calendar, Edit3, Trash2, Image as ImageIcon } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { DiaryMemory, MoodType } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { DiaryModal, MOODS } from './DiaryModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const DiaryView: React.FC = () => {
  const { diaryEntries, toggleFavorite, deleteMemory } = useMemories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryMemory | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    let list = [...diaryEntries];
    if (selectedMood !== 'all') {
      list = list.filter((d) => d.mood === selectedMood);
    }
    // Sort descending by date
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }, [diaryEntries, selectedMood]);

  const getMoodMeta = (mood: MoodType) => {
    return MOODS.find((m) => m.type === mood) || { type: mood, emoji: '✨', label: mood };
  };

  const handleDeleteConfirm = async () => {
    if (entryToDelete) {
      await deleteMemory(entryToDelete);
      setEntryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <BookOpen className="w-6 h-6" />
            </span>
            <span>Digital Diary</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {diaryEntries.length} {diaryEntries.length === 1 ? 'entry' : 'entries'} penned in your private journal
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEntry(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Write New Entry</span>
        </button>
      </div>

      {/* Mood Filters Strip */}
      {diaryEntries.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-2xl bg-white/60 dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl scrollbar-none">
          <button
            onClick={() => setSelectedMood('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedMood === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            All Feelings ({diaryEntries.length})
          </button>
          {MOODS.map((m) => {
            const count = diaryEntries.filter((d) => d.mood === m.type).length;
            if (count === 0) return null;
            return (
              <button
                key={m.type}
                onClick={() => setSelectedMood(m.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedMood === m.type
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Diary Cards Grid */}
      {filteredEntries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No diary entries found"
          description="Your diary is waiting for your story. How are you feeling today?"
          actionText="Write First Entry"
          onAction={() => {
            setEditingEntry(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEntries.map((entry) => {
            const moodMeta = getMoodMeta(entry.mood);
            return (
              <div
                key={entry.id}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Card Header: Mood Badge & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <span>{moodMeta.emoji}</span>
                        <span>{moodMeta.label}</span>
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {entry.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(entry.id)}
                        aria-label="Toggle Favorite"
                        className={`p-1.5 rounded-xl transition-all ${
                          entry.isFavorite
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingEntry(entry);
                          setIsModalOpen(true);
                        }}
                        aria-label="Edit Entry"
                        className="p-1.5 text-slate-400 hover:text-purple-500 hover:bg-purple-500/10 rounded-xl transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setEntryToDelete(entry.id)}
                        aria-label="Delete Entry"
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {entry.title}
                  </h3>

                  {/* Body Content */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-4 leading-relaxed font-normal">
                    {entry.content}
                  </p>
                </div>

                {/* Optional Photo Attachment Preview */}
                {entry.imageUrl && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src={entry.imageUrl}
                      alt="Attached memory"
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-rose-500/30"
                    />
                    <div className="text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                        Attached Memory Photo
                      </span>
                      <span>Captured with this entry</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Diary Editor Modal */}
      <DiaryModal
        isOpen={isModalOpen}
        initialEntry={editingEntry}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!entryToDelete}
        title="Delete Diary Entry?"
        message="This memory entry will be erased from your personal journal forever."
        confirmText="Delete Entry"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEntryToDelete(null)}
      />
    </div>
  );
};
