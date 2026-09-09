import React from 'react';
import { X, Star, Trash2, Calendar, Tag, Play } from 'lucide-react';
import { VideoMemory } from '../../types';

interface VideoPlayerModalProps {
  video: VideoMemory | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onToggleFavorite,
  onDelete,
}) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-navy-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-navy-900/80">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Play className="w-4 h-4 fill-current" />
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-md">
              {video.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(video.id)}
              aria-label="Toggle Favorite"
              className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                video.isFavorite
                  ? 'text-amber-400 bg-amber-500/20 ring-1 ring-amber-500/50'
                  : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <Star className={`w-4 h-4 ${video.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onDelete(video.id)}
              aria-label="Delete Video"
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            poster={video.thumbnailUrl}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Information / Description */}
        <div className="p-5 sm:p-6 space-y-3 bg-navy-950 overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              Recorded on {video.date}
            </span>
            {video.duration && <span>Duration: ~{video.duration}s</span>}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {video.description}
          </p>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {video.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 text-xs font-semibold"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
