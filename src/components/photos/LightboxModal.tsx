import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Trash2,
  Download,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { PhotoMemory } from '../../types';

interface LightboxModalProps {
  photo: PhotoMemory | null;
  allPhotos: PhotoMemory[];
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (photo: PhotoMemory) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  allPhotos,
  onClose,
  onToggleFavorite,
  onDelete,
  onNavigate,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIsZoomed(false);
  }, [photo]);

  // Keyboard navigation: Left/Right arrow and Escape
  useEffect(() => {
    if (!photo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, allPhotos]);

  if (!photo) return null;

  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhotos.length - 1;

  const handlePrev = () => {
    if (hasPrev) onNavigate(allPhotos[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onNavigate(allPhotos[currentIndex + 1]);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `memory-${photo.date}-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3 text-white">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
            {currentIndex + 1} / {allPhotos.length}
          </span>
          <span className="text-sm font-bold truncate max-w-xs sm:max-w-md">
            {photo.title || photo.caption || 'Memory Photo'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label="Toggle zoom"
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            aria-label="Download Photo"
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(photo.id)}
            aria-label="Toggle Favorite"
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              photo.isFavorite
                ? 'text-amber-400 bg-amber-500/20 ring-1 ring-amber-500/50 scale-105'
                : 'text-slate-300 hover:text-white bg-white/10 hover:bg-white/20'
            }`}
          >
            <Star className={`w-5 h-5 ${photo.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(photo.id)}
            aria-label="Delete Photo"
            className="p-2 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 backdrop-blur-md transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Arrow Left */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          aria-label="Previous Photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-2xl bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Arrow Right */}
      {hasNext && (
        <button
          onClick={handleNext}
          aria-label="Next Photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-2xl bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="w-full h-full flex items-center justify-center p-6 sm:p-12 overflow-auto"
        onClick={() => {
          if (isZoomed) setIsZoomed(false);
        }}
      >
        <img
          src={photo.imageUrl}
          alt={photo.caption || 'Memory'}
          className={`max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300 select-none ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
        />
      </div>

      {/* Bottom Metadata Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {photo.date}
              </span>
              {photo.fileSize && (
                <span>• {(photo.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-100 leading-relaxed max-w-2xl">
              {photo.caption}
            </p>
          </div>

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {photo.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-purple-300 text-xs font-semibold backdrop-blur-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
