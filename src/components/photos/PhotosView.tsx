import React, { useState, useMemo } from 'react';
import { Plus, Image as ImageIcon, Star, Filter, Calendar, Tag, Trash2, Maximize2 } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { PhotoMemory } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { LightboxModal } from './LightboxModal';
import { AddPhotoModal } from './AddPhotoModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const PhotosView: React.FC = () => {
  const { photos, toggleFavorite, deleteMemory } = useMemories();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    photos.forEach((p) => {
      if (p.tags) p.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [photos]);

  // Filter and sort photos
  const filteredPhotos = useMemo(() => {
    let list = [...photos];

    if (selectedTag !== 'all') {
      list = list.filter((p) => p.tags && p.tags.includes(selectedTag));
    }

    list.sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0;
      const timeB = new Date(b.date).getTime() || 0;
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [photos, selectedTag, sortOrder]);

  const handleDeleteConfirm = async () => {
    if (photoToDelete) {
      await deleteMemory(photoToDelete);
      if (selectedPhoto && selectedPhoto.id === photoToDelete) {
        setSelectedPhoto(null);
      }
      setPhotoToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ImageIcon className="w-6 h-6" />
            </span>
            <span>Photo Vault</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'} saved in your private collection
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Photo</span>
        </button>
      </div>

      {/* Filter and Tag Strip */}
      {photos.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/60 dark:bg-navy-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
          {/* Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-2xl scrollbar-none">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
              }`}
            >
              All Photos
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                  selectedTag === tag
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid Display */}
      {filteredPhotos.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No photos found"
          description={
            photos.length === 0
              ? 'Your photo vault is currently empty. Upload your first cherished memory!'
              : 'No photos match the selected tag filter.'
          }
          actionText="+ Add First Photo"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-navy-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Photo Image with Lightbox Trigger */}
              <div
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-[4/3] w-full overflow-hidden bg-slate-950 cursor-pointer relative"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="flex items-center justify-between w-full text-white text-xs">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" /> Lightbox View
                    </span>
                    <span className="text-[11px] text-slate-300">{photo.date}</span>
                  </div>
                </div>
              </div>

              {/* Floating Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(photo.id);
                }}
                aria-label="Favorite"
                className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                  photo.isFavorite
                    ? 'bg-amber-500 text-white shadow-amber-500/30 scale-105'
                    : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70 opacity-0 group-hover:opacity-100'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${photo.isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Card Footer Info */}
              <div className="p-3.5">
                {photo.title && (
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mb-1">
                    {photo.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-purple-400" />
                    {photo.date}
                  </span>

                  <button
                    onClick={() => setPhotoToDelete(photo.id)}
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

      {/* Add Photo Modal */}
      <AddPhotoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        photo={selectedPhoto}
        allPhotos={filteredPhotos}
        onClose={() => setSelectedPhoto(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={(id) => {
          setSelectedPhoto(null);
          setPhotoToDelete(id);
        }}
        onNavigate={(p) => setSelectedPhoto(p)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!photoToDelete}
        title="Delete Photo Permanently?"
        message="This photo will be removed from your vault. This action cannot be undone."
        confirmText="Delete Photo"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPhotoToDelete(null)}
      />
    </div>
  );
};
