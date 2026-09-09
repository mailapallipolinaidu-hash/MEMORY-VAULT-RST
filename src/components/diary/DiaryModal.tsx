import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Calendar, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { DiaryMemory, MoodType } from '../../types';

interface DiaryModalProps {
  isOpen: boolean;
  initialEntry?: DiaryMemory | null;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
}

export const MOODS: MoodOption[] = [
  { type: 'happy', emoji: '😊', label: 'Happy' },
  { type: 'loved', emoji: '❤️', label: 'Loved' },
  { type: 'peaceful', emoji: '😌', label: 'Peaceful' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😡', label: 'Angry' },
  { type: 'excited', emoji: '🔥', label: 'Excited' },
  { type: 'tired', emoji: '😴', label: 'Tired' },
];

export const DiaryModal: React.FC<DiaryModalProps> = ({
  isOpen,
  initialEntry,
  onClose,
  onSuccess,
}) => {
  const { addDiaryEntry, updateDiaryEntry } = useMemories();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<MoodType>('happy');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setDate(initialEntry.date);
      setMood(initialEntry.mood);
      setContent(initialEntry.content);
      setImageUrl(initialEntry.imageUrl || '');
      setPhotoPreview(initialEntry.imageUrl || null);
    } else {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setMood('happy');
      setContent('');
      setImageUrl('');
      setPhotoPreview(null);
    }
  }, [initialEntry, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setImageUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please write an entry title.');
      return;
    }
    if (!content.trim()) {
      setError('Please write your diary thoughts.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (initialEntry) {
        await updateDiaryEntry(initialEntry.id, {
          title: title.trim(),
          date,
          mood,
          content: content.trim(),
          imageUrl: imageUrl.trim() || undefined,
        });
        onSuccess?.('Diary entry updated! ❤️');
      } else {
        await addDiaryEntry({
          title: title.trim(),
          date,
          mood,
          content: content.trim(),
          imageUrl: imageUrl.trim() || undefined,
          isFavorite: false,
        });
        onSuccess?.('Diary entry written to vault! 📔');
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save diary entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {initialEntry ? 'Edit Diary Entry' : 'Write in Your Diary'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record your innermost thoughts, feelings, and memories
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
          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              How are you feeling?
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m.type}
                  onClick={() => setMood(m.type)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                    mood === m.type
                      ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-300 scale-105 shadow-sm font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-[10px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Entry Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Reflections from the Summit"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
          </div>

          {/* Main Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Dear Diary...
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened today? What made you smile, think, or cry? Write freely..."
              className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
            />
          </div>

          {/* Optional Photo Attachment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                Optional Attached Photo
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setImageUrl('');
                  }}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-36 bg-slate-950">
                <img
                  src={photoPreview}
                  alt="Diary Attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-400 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 dark:bg-navy-950/50 transition-colors flex items-center justify-center gap-2 text-xs text-slate-500"
              >
                <ImageIcon className="w-4 h-4 text-rose-400" />
                <span>Click to attach a special photo to this diary entry</span>
              </div>
            )}
          </div>

          {/* Actions */}
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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Entry...' : initialEntry ? 'Update Entry' : 'Preserve in Diary ❤️'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
