import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Image as ImageIcon,
  Video as VideoIcon,
  BookOpen,
  FileText,
  Filter,
  ChevronDown,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useMemories } from '../../context/MemoryContext';
import { MemoryItem, MemoryType } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface TimelineViewProps {
  onSelectMemory: (memory: MemoryItem) => void;
}

interface GroupedMemories {
  [year: string]: {
    [month: string]: MemoryItem[];
  };
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onSelectMemory }) => {
  const { memories } = useMemories();
  const [filterType, setFilterType] = useState<string>('all');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group memories hierarchically: Year -> Month -> Items
  const groupedData = useMemo(() => {
    let list = [...memories];
    if (filterType !== 'all') {
      list = list.filter((m) => m.type === filterType);
    }

    // Sort chronologically descending (newest first)
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const groups: GroupedMemories = {};

    list.forEach((item) => {
      const d = new Date(item.date);
      const year = isNaN(d.getFullYear()) ? 'Other' : d.getFullYear().toString();
      const month = isNaN(d.getMonth()) ? 'Other' : monthNames[d.getMonth()];

      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = [];
      groups[year][month].push(item);
    });

    return groups;
  }, [memories, filterType]);

  const years = Object.keys(groupedData).sort((a, b) => (b === 'Other' ? -1 : +b - +a));

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

  const getItemTitle = (m: MemoryItem) => {
    if (m.type === 'photo') return m.title || m.caption;
    return m.title;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Clock className="w-6 h-6" />
            </span>
            <span>Memory Timeline</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Travel chronologically through your life's chapters
          </p>
        </div>

        {/* Media Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-navy-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
          {['all', 'photo', 'video', 'diary', 'note'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterType === t
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
              }`}
            >
              {t === 'all' ? 'All Memories' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {years.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No timeline moments"
          description="Memories you create will appear here mapped across years and months."
        />
      ) : (
        <div className="space-y-10 relative before:absolute before:inset-0 before:left-4 sm:before:left-7 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-indigo-500 before:to-transparent">
          {years.map((year) => (
            <div key={year} className="relative pl-10 sm:pl-16 space-y-6">
              {/* Year Pin */}
              <div className="absolute left-1 sm:left-4 -top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-lg shadow-purple-500/30 ring-4 ring-slate-50 dark:ring-navy-950">
                ⭐
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {year}
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
              </div>

              {/* Months */}
              {Object.keys(groupedData[year]).map((month) => {
                const monthItems = groupedData[year][month];
                return (
                  <div key={month} className="space-y-3 pl-3 sm:pl-4 border-l-2 border-purple-500/20">
                    <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                      <span>{month}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">
                        {monthItems.length} {monthItems.length === 1 ? 'event' : 'events'}
                      </span>
                    </h3>

                    {/* Month Items List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {monthItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onSelectMemory(item)}
                          className="group flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                        >
                          {/* Thumbnail / Icon Badge */}
                          {item.type === 'photo' ? (
                            <img
                              src={item.imageUrl}
                              alt={item.caption}
                              className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-purple-500/30 group-hover:scale-105 transition-transform"
                            />
                          ) : item.type === 'video' ? (
                            <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                              {item.thumbnailUrl ? (
                                <img
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <VideoIcon className="w-6 h-6 text-sky-400" />
                              )}
                              <span className="absolute text-[10px] text-white">▶</span>
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                              {getItemIcon(item.type)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400">
                                {item.type}
                              </span>
                              <span>{item.date}</span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-500 transition-colors">
                              {getItemTitle(item)}
                            </h4>

                            {item.type === 'diary' && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {item.content}
                              </p>
                            )}

                            {item.isFavorite && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-semibold mt-1">
                                <Star className="w-2.5 h-2.5 fill-current" /> Favorite
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
