import React, { useState, useRef } from 'react';
import { X, UploadCloud, Video, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addVideo } = useMemories();
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      if (!selected.type.startsWith('video/')) {
        setError('Please select a valid video file (MP4, WebM, MOV).');
        return;
      }
      setFile(selected);
      setError(null);
      const url = URL.createObjectURL(selected);
      setVideoPreviewUrl(url);
    }
  };

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
    if (!file && !videoPreviewUrl) {
      setError('Please select or upload a video file.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title for this video.');
      return;
    }
    if (!user) return;

    try {
      setUploading(true);
      setError(null);

      let finalUrl = videoPreviewUrl || '';
      let thumbnailUrl: string | undefined = undefined;
      let duration: number | undefined = undefined;
      let fileSize = file ? file.size : 15000000;

      if (file) {
        const uploadResult = await storageService.uploadVideo(file, user.id);
        finalUrl = uploadResult.url;
        thumbnailUrl = uploadResult.thumbnailUrl;
        duration = uploadResult.duration;
        fileSize = uploadResult.size;
      }

      await addVideo({
        title: title.trim(),
        description: description.trim(),
        date: date || new Date().toISOString().split('T')[0],
        tags: tags.length > 0 ? tags : ['video'],
        videoUrl: finalUrl,
        thumbnailUrl,
        duration,
        fileSize,
        isFavorite: false,
      });

      onSuccess?.('Video saved to your vault! 🎥');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save video.');
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
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Add Video to Vault
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preserve your motion memories with playback preview
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
          {/* File Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Video File
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />

            {videoPreviewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-black group">
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setVideoPreviewUrl(null);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-navy-950/50 transition-colors group"
              >
                <UploadCloud className="w-10 h-10 mx-auto text-slate-400 group-hover:text-sky-500 transition-colors mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Click to select video or drag & drop here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports MP4, WebM, MOV (Max 200MB)
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Birthday celebration fireworks"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened in this video?"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              Recording Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-sky-400" />
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
                placeholder="Add a tag and press enter (e.g. holiday, pets)"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 text-xs font-bold bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300 text-xs font-semibold"
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
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {uploading ? 'Processing Video...' : 'Save Video 🎥'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
