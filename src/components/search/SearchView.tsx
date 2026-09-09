import React, { useMemo } from 'react';
import { Search, Image as ImageIcon, Video as VideoIcon, BookOpen, FileText, Calendar, Tag, Star } from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { MemoryItem, MemoryType } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface SearchViewProps {
  query: string;
  setQuery: (q: string) => void;
  onSelectMemory: (memory: MemoryItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ query, setQuery, onSelectMemory }) => {
  const { searchMemories } = useMemories();

  const results = useMemo(() => {
    return searchMemories(query);
  }, [query, searchMemories]);

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
      {/* Top Search Controls */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-navy-900/70 backdrop-blur-xl shadow-sm">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-500" />
          <span>Search Your Personal Vault</span>
        </h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, caption, tags (#travel), date (2026-08), mood, or story text..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-3 px-1">
          <span>
            {query.trim()
              ? `Found ${results.length} matching ${results.length === 1 ? 'memory' : 'memories'}`
              : 'Showing all memories in your vault'}
          </span>
          <span className="text-[11px] text-emerald-500 font-medium">
            🔒 Strictly scoped to your private account
          </span>
        </div>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching memories found"
          description={`No moments matched "${query}". Try searching for a different keyword, tag (#hiking, #family), or date.`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMemory(item)}
              className="group relative flex flex-col justify-between p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div>
                {/* Thumbnail if Photo or Video */}
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
                        className="w-full h-full object-cover"
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
                  {item.isFavorite && (
                    <span className="text-amber-500 text-xs flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> Favorite
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1 group-hover:text-purple-500 transition-colors">
                  {item.type === 'photo'
                    ? item.title || item.caption
                    : item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {item.type === 'photo'
                    ? item.caption
                    : item.type === 'video'
                    ? item.description
                    : item.content}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  {item.date}
                </span>
                <span className="text-purple-500 font-semibold group-hover:underline">
                  View Detail →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
