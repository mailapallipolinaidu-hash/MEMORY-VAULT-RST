import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addPhoto } = useMemories();
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setFile(selected);
      setError(null);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    }
  };

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !previewUrl) {
      setError('Please select or upload a photo.');
      return;
    }
    if (!caption.trim()) {
      setError('Please add a brief caption or story for this photo.');
      return;
    }
    if (!user) return;

    try {
      setUploading(true);
      setError(null);

      let finalUrl = previewUrl || '';
      let fileSize = file ? file.size : 2500000;

      if (file) {
        const uploadResult = await storageService.uploadPhoto(file, user.id);
        finalUrl = uploadResult.url;
        fileSize = uploadResult.size;
      }

      await addPhoto({
        title: title.trim() || undefined,
        caption: caption.trim(),
        date: date || new Date().toISOString().split('T')[0],
        tags: tags.length > 0 ? tags : ['memory'],
        imageUrl: finalUrl,
        fileSize,
        isFavorite: false,
      });

      onSuccess?.('Photo saved to your vault! ❤️');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Add Photo to Vault
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preserve your photo with date, tags, and caption
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
          {/* Upload Drop Zone / Image Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Photo File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-950 group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white">
                  Preview ready • {file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Sample'}
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-navy-950/50 transition-colors group"
              >
                <UploadCloud className="w-10 h-10 mx-auto text-slate-400 group-hover:text-purple-500 transition-colors mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Click to select photo or drag & drop here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP, HEIC (Max 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Title <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunrise above the clouds"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Caption / Story
            </label>
            <textarea
              required
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What makes this photo special to you?"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Memory Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              Tags
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
                placeholder="Add a tag and press enter (e.g. travel, family)"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-semibold"
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

          {/* Action buttons */}
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
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {uploading ? 'Saving to Vault...' : 'Save Photo ❤️'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
