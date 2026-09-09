import React, { useState, useMemo } from 'react';
import { Plus, FileText, Pin, Star, Edit3, Trash2, Tag, Calendar } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { NoteMemory } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { NoteModal } from './NoteModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const NotesView: React.FC = () => {
  const { notes, toggleFavorite, deleteMemory, updateNote } = useMemories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteMemory | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.tags) n.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let list = [...notes];
    if (selectedTag !== 'all') {
      list = list.filter((n) => n.tags && n.tags.includes(selectedTag));
    }
    return list;
  }, [notes, selectedTag]);

  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.isPinned), [filteredNotes]);

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      await deleteMemory(noteToDelete);
      setNoteToDelete(null);
    }
  };

  const handleTogglePin = async (note: NoteMemory) => {
    await updateNote(note.id, { isPinned: !note.isPinned });
  };

  const renderNoteCard = (note: NoteMemory) => (
    <div
      key={note.id}
      className="group relative flex flex-col justify-between p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ borderLeftColor: note.color, borderLeftWidth: '4px' }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
            {note.title}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            {/* Pin Button */}
            <button
              onClick={() => handleTogglePin(note)}
              title={note.isPinned ? 'Unpin' : 'Pin to top'}
              className={`p-1.5 rounded-lg transition-colors ${
                note.isPinned
                  ? 'text-amber-500 bg-amber-500/10'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(note.id)}
              aria-label="Toggle Favorite"
              className={`p-1.5 rounded-lg transition-colors ${
                note.isFavorite
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-white opacity-0 group-hover:opacity-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Edit */}
            <button
              onClick={() => {
                setEditingNote(note);
                setIsModalOpen(true);
              }}
              aria-label="Edit Note"
              className="p-1.5 text-slate-400 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              onClick={() => setNoteToDelete(note.id)}
              aria-label="Delete Note"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-5 leading-relaxed font-normal">
          {note.content}
        </p>
      </div>

      {/* Footer Tags & Date */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex flex-wrap gap-1">
          {note.tags &&
            note.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 text-[10px] font-semibold"
              >
                #{t}
              </span>
            ))}
        </div>
        <span className="flex items-center gap-1 shrink-0">
          <Calendar className="w-3 h-3 text-emerald-400" />
          {note.date}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-6 h-6" />
            </span>
            <span>Personal Notes</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved for quick productivity
          </p>
        </div>

        <button
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ New Note</span>
        </button>
      </div>

      {/* Tag Filter Strip */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 rounded-2xl bg-white/60 dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl scrollbar-none">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedTag === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            All Notes
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Display */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes written yet"
          description="Keep your inspirations, recipes, checklists, and bucket lists organized in one private corner."
          actionText="Create First Note"
          onAction={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 fill-current" />
                <span>Pinned Notes ({pinnedNotes.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pinnedNotes.map(renderNoteCard)}
              </div>
            </div>
          )}

          {/* Other Notes Section */}
          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  All Other Notes ({otherNotes.length})
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {otherNotes.map(renderNoteCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note Editor Modal */}
      <NoteModal
        isOpen={isModalOpen}
        initialNote={editingNote}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!noteToDelete}
        title="Delete Note Permanently?"
        message="This note will be permanently removed from your vault."
        confirmText="Delete Note"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setNoteToDelete(null)}
      />
    </div>
  );
};
