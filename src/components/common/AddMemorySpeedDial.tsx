import React, { useState, useRef, useEffect } from 'react';
import { Plus, Image, Video, BookOpen, FileText, X } from 'lucide-react';

interface AddMemorySpeedDialProps {
  onOpenPhoto: () => void;
  onOpenVideo: () => void;
  onOpenDiary: () => void;
  onOpenNote: () => void;
}

export const AddMemorySpeedDial: React.FC<AddMemorySpeedDialProps> = ({
  onOpenPhoto,
  onOpenVideo,
  onOpenDiary,
  onOpenNote,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = [
    {
      label: 'Upload Photo',
      icon: <Image className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 border-purple-500/30',
      action: () => {
        setIsOpen(false);
        onOpenPhoto();
      },
    },
    {
      label: 'Upload Video',
      icon: <Video className="w-5 h-5 text-sky-400" />,
      color: 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-200 border-sky-500/30',
      action: () => {
        setIsOpen(false);
        onOpenVideo();
      },
    },
    {
      label: 'Write Diary',
      icon: <BookOpen className="w-5 h-5 text-rose-400" />,
      color: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 border-rose-500/30',
      action: () => {
        setIsOpen(false);
        onOpenDiary();
      },
    },
    {
      label: 'Create Note',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
      action: () => {
        setIsOpen(false);
        onOpenNote();
      },
    },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-20 md:bottom-8 right-6 z-40">
      {/* Expanded options menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2.5 items-end animate-in fade-in slide-in-from-bottom-3 duration-200 min-w-[200px]">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 w-full justify-between group ${item.color} bg-navy-900/90`}
            >
              <span className="text-sm font-semibold text-white tracking-wide">
                {item.label}
              </span>
              <div className="p-1.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                {item.icon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main floating action button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Add Memory"
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? 'bg-rose-600 rotate-90 shadow-rose-600/40'
            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 shadow-purple-500/40 hover:shadow-purple-500/60'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-7 h-7 stroke-[2.5]" />}
      </button>
    </div>
  );
};
