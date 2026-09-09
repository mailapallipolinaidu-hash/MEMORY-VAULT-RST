import React, { useState, useEffect } from 'react';
import { X, FileText, Tag, Pin, Palette, AlertCircle } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { NoteMemory } from '../../types';

interface NoteModalProps {
  isOpen: boolean;
  initialNote?: NoteMemory | null;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

const COLOR_OPTIONS = [
  { id: '#8b5cf6', label: 'Violet', bgClass: 'bg-purple-500' },
  { id: '#0ea5e9', label: 'Sky', bgClass: 'bg-sky-500' },
  { id: '#10b981', label: 'Emerald', bgClass: 'bg-emerald-500' },
  { id: '#f59e0b', label: 'Amber', bgClass: 'bg-amber-500' },
  { id: '#f43f5e', label: 'Rose', bgClass: 'bg-rose-500' },
  { id: '#64748b', label: 'Slate', bgClass: 'bg-slate-500' },
];

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  initialNote,
  onClose,
  onSuccess,
}) => {
  const { addNote, updateNote } = useMemories();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState('#8b5cf6');
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setTags(initialNote.tags || []);
      setColor(initialNote.color || '#8b5cf6');
      setIsPinned(!!initialNote.isPinned);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setColor('#8b5cf6');
      setIsPinned(false);
    }
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError('Please provide a title or content for your note.');
      return;
    }

    try {
      setError(null);
      if (initialNote) {
        await updateNote(initialNote.id, {
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
          tags,
          color,
          isPinned,
        });
        onSuccess?.('Note updated! 📝');
      } else {
        await addNote({
          title: title.trim() || 'Untitled Note',
          content: content.trim(),
          tags,
          color,
          isPinned,
          date: new Date().toISOString().split('T')[0],
          isFavorite: false,
        });
        onSuccess?.('Note created! 📝');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save note.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialNote ? 'Edit Note' : 'Create Quick Note'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Checklists, mantras, ideas, and reminders
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note Title & Pin Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title..."
              className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              title="Pin note to top"
              className={`p-2.5 rounded-xl border transition-all ${
                isPinned
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jot down your notes, lists, or thoughts..."
              className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed"
            />
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              Card Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-xl ${c.bgClass} transition-transform ${
                    color === c.id ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-navy-900 shadow-md' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              Labels / Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a label and press Enter"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              {initialNote ? 'Update Note' : 'Save Note 📝'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
