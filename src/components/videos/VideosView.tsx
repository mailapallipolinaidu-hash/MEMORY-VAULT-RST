import React, { useState } from 'react';
import { Plus, Video as VideoIcon, Star, Play, Calendar, Trash2 } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { VideoMemory } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { VideoPlayerModal } from './VideoPlayerModal';
import { AddVideoModal } from './AddVideoModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const VideosView: React.FC = () => {
  const { videos, toggleFavorite, deleteMemory } = useMemories();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoMemory | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (videoToDelete) {
      await deleteMemory(videoToDelete);
      if (selectedVideo && selectedVideo.id === videoToDelete) {
        setSelectedVideo(null);
      }
      setVideoToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <VideoIcon className="w-6 h-6" />
            </span>
            <span>Video Vault</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} preserved in your collection
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Video</span>
        </button>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title="No videos stored yet"
          description="Capture the laughter, movements, and sights that photos alone cannot tell."
          actionText="+ Upload First Video"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-navy-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => setSelectedVideo(video)}
                className="aspect-video w-full bg-slate-950 relative overflow-hidden cursor-pointer"
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-900 to-slate-950">
                    <VideoIcon className="w-12 h-12 text-sky-400/40" />
                  </div>
                )}

                {/* Dark overlay with play badge */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-sky-500/90 text-slate-900 dark:text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white">
                    0:{video.duration.toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              {/* Floating Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(video.id);
                }}
                aria-label="Toggle Favorite"
                className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                  video.isFavorite
                    ? 'bg-amber-500 text-white shadow-amber-500/30 scale-105'
                    : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70 opacity-0 group-hover:opacity-100'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${video.isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-500 transition-colors mb-1">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-sky-400" />
                    {video.date}
                  </span>

                  <button
                    onClick={() => setVideoToDelete(video.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={(id) => {
          setSelectedVideo(null);
          setVideoToDelete(id);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!videoToDelete}
        title="Delete Video Permanently?"
        message="This video will be permanently removed from your vault. This action cannot be undone."
        confirmText="Delete Video"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setVideoToDelete(null)}
      />
    </div>
  );
};
