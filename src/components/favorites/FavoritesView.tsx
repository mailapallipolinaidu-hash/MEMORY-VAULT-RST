import React, { useState, useMemo } from 'react';
import { Star, Image as ImageIcon, Video as VideoIcon, BookOpen, FileText, Calendar } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { MemoryItem, MemoryType } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface FavoritesViewProps {
  onSelectMemory: (memory: MemoryItem) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onSelectMemory }) => {
  const { favorites, toggleFavorite } = useMemories();
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredFavorites = useMemo(() => {
    if (selectedType === 'all') return favorites;
    return favorites.filter((f) => f.type === selectedType);
  }, [favorites, selectedType]);

  const getItemIcon = (type: MemoryType) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      case 'video':
        return <VideoIcon className="w-4 h-4 text-sky-400" />;
      case 'diary':
        return <BookOpen className="w-4 h-4 text-rose-400" />;
      case 'note':
        return <FileText className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
              <Star className="w-6 h-6 fill-current" />
            </span>
            <span>Starred Favorites</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {favorites.length} {favorites.length === 1 ? 'precious moment' : 'precious moments'} held closest to your heart
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/70 dark:bg-navy-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
          {['all', 'photo', 'video', 'diary', 'note'].map((tab) => {
            const count = tab === 'all' ? favorites.length : favorites.filter((f) => f.type === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setSelectedType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedType === tab
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                {tab === 'all' ? 'All' : `${tab}s`} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites starred yet"
          description="Star your most cherished memories with the ⭐ icon to revisit them in this curated hall of memories."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMemory(item)}
              className="group relative flex flex-col justify-between p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div>
                {/* Media Preview if Photo/Video */}
                {item.type === 'photo' && (
                  <div className="aspect-video rounded-2xl overflow-hidden mb-3 bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {item.type === 'video' && (
                  <div className="aspect-video rounded-2xl overflow-hidden mb-3 bg-slate-950 relative flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <VideoIcon className="w-8 h-8 text-sky-400" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center text-xs">
                        ▶
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold capitalize text-slate-500 dark:text-slate-400">
                    {getItemIcon(item.type)}
                    {item.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="p-1 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1">
                  {item.type === 'photo'
                    ? item.title || item.caption
                    : item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.type === 'photo'
                    ? item.caption
                    : item.type === 'video'
                    ? item.description
                    : item.content}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
                <span className="text-purple-500 group-hover:underline font-semibold">
                  Open →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
