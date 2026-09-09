import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  MemoryItem,
  PhotoMemory,
  VideoMemory,
  DiaryMemory,
  NoteMemory,
  StorageStats,
} from '../types';
import {
  dbGetMemoriesByUser,
  dbSaveMemory,
  dbDeleteMemory,
  dbToggleFavorite,
  dbCalculateStats,
} from '../services/db';
import { useAuth } from './AuthContext';

interface MemoryContextType {
  memories: MemoryItem[];
  photos: PhotoMemory[];
  videos: VideoMemory[];
  diaryEntries: DiaryMemory[];
  notes: NoteMemory[];
  favorites: MemoryItem[];
  stats: StorageStats;
  loading: boolean;
  addPhoto: (photo: Omit<PhotoMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => Promise<void>;
  addVideo: (video: Omit<VideoMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => Promise<void>;
  addDiaryEntry: (diary: Omit<DiaryMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => Promise<void>;
  updateDiaryEntry: (id: string, diary: Partial<DiaryMemory>) => Promise<void>;
  addNote: (note: Omit<NoteMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => Promise<void>;
  updateNote: (id: string, note: Partial<NoteMemory>) => Promise<void>;
  deleteMemory: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  searchMemories: (query: string) => MemoryItem[];
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<{ success: boolean; count?: number; error?: string }>;
  refreshMemories: () => Promise<void>;
  celebrate: () => void;
}

const defaultStats: StorageStats = {
  totalPhotos: 0,
  totalVideos: 0,
  totalDiary: 0,
  totalNotes: 0,
  totalFavorites: 0,
  totalMemories: 0,
  photosSizeMb: 0,
  videosSizeMb: 0,
  otherSizeKb: 0,
  totalSizeMb: 0,
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [stats, setStats] = useState<StorageStats>(defaultStats);
  const [loading, setLoading] = useState<boolean>(true);

  const celebrate = useCallback(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#f43f5e', '#38bdf8', '#10b981'],
      });
    } catch (e) {
      // Ignored if confetti fails
    }
  }, []);

  const refreshMemories = useCallback(async () => {
    if (!user) {
      setMemories([]);
      setStats(defaultStats);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userMemories = await dbGetMemoriesByUser(user.id);
      const userStats = await dbCalculateStats(user.id);
      setMemories(userMemories);
      setStats(userStats);
    } catch (err) {
      console.error('Error fetching user memories:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshMemories();
  }, [refreshMemories]);

  // Derived filtered lists
  const photos = useMemo(
    () => memories.filter((m): m is PhotoMemory => m.type === 'photo'),
    [memories]
  );
  const videos = useMemo(
    () => memories.filter((m): m is VideoMemory => m.type === 'video'),
    [memories]
  );
  const diaryEntries = useMemo(
    () => memories.filter((m): m is DiaryMemory => m.type === 'diary'),
    [memories]
  );
  const notes = useMemo(
    () => memories.filter((m): m is NoteMemory => m.type === 'note'),
    [memories]
  );
  const favorites = useMemo(
    () => memories.filter((m) => m.isFavorite),
    [memories]
  );

  const addPhoto = async (photoData: Omit<PhotoMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => {
    if (!user) return;
    const newPhoto: PhotoMemory = {
      ...photoData,
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: user.id,
      type: 'photo',
      createdAt: new Date().toISOString(),
    };
    await dbSaveMemory(newPhoto);
    await refreshMemories();
    celebrate();
  };

  const addVideo = async (videoData: Omit<VideoMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => {
    if (!user) return;
    const newVideo: VideoMemory = {
      ...videoData,
      id: `video_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: user.id,
      type: 'video',
      createdAt: new Date().toISOString(),
    };
    await dbSaveMemory(newVideo);
    await refreshMemories();
    celebrate();
  };

  const addDiaryEntry = async (diaryData: Omit<DiaryMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => {
    if (!user) return;
    const newDiary: DiaryMemory = {
      ...diaryData,
      id: `diary_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: user.id,
      type: 'diary',
      createdAt: new Date().toISOString(),
    };
    await dbSaveMemory(newDiary);
    await refreshMemories();
    celebrate();
  };

  const updateDiaryEntry = async (id: string, updates: Partial<DiaryMemory>) => {
    if (!user) return;
    const existing = memories.find((m) => m.id === id && m.userId === user.id);
    if (!existing || existing.type !== 'diary') return;

    const updated: DiaryMemory = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await dbSaveMemory(updated);
    await refreshMemories();
  };

  const addNote = async (noteData: Omit<NoteMemory, 'id' | 'userId' | 'type' | 'createdAt'>) => {
    if (!user) return;
    const newNote: NoteMemory = {
      ...noteData,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: user.id,
      type: 'note',
      createdAt: new Date().toISOString(),
    };
    await dbSaveMemory(newNote);
    await refreshMemories();
    celebrate();
  };

  const updateNote = async (id: string, updates: Partial<NoteMemory>) => {
    if (!user) return;
    const existing = memories.find((m) => m.id === id && m.userId === user.id);
    if (!existing || existing.type !== 'note') return;

    const updated: NoteMemory = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await dbSaveMemory(updated);
    await refreshMemories();
  };

  const deleteMemory = async (id: string): Promise<boolean> => {
    if (!user) return false;
    const success = await dbDeleteMemory(id, user.id);
    if (success) {
      await refreshMemories();
    }
    return success;
  };

  const toggleFavorite = async (id: string) => {
    if (!user) return;
    await dbToggleFavorite(id, user.id);
    await refreshMemories();
  };

  /**
   * Search strictly across the authenticated user's private data
   */
  const searchMemories = (query: string): MemoryItem[] => {
    const q = query.trim().toLowerCase();
    if (!q) return memories;

    return memories.filter((m) => {
      // Common match: date
      if (m.date && m.date.toLowerCase().includes(q)) return true;

      if (m.type === 'photo') {
        if (m.title && m.title.toLowerCase().includes(q)) return true;
        if (m.caption && m.caption.toLowerCase().includes(q)) return true;
        if (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) return true;
      } else if (m.type === 'video') {
        if (m.title && m.title.toLowerCase().includes(q)) return true;
        if (m.description && m.description.toLowerCase().includes(q)) return true;
        if (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) return true;
      } else if (m.type === 'diary') {
        if (m.title && m.title.toLowerCase().includes(q)) return true;
        if (m.content && m.content.toLowerCase().includes(q)) return true;
        if (m.mood && m.mood.toLowerCase().includes(q)) return true;
      } else if (m.type === 'note') {
        if (m.title && m.title.toLowerCase().includes(q)) return true;
        if (m.content && m.content.toLowerCase().includes(q)) return true;
        if (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) return true;
      }
      return false;
    });
  };

  const exportData = async (): Promise<string> => {
    if (!user) return '{}';
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      memories,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importData = async (jsonData: string): Promise<{ success: boolean; count?: number; error?: string }> => {
    if (!user) return { success: false, error: 'No authenticated user' };
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.memories || !Array.isArray(parsed.memories)) {
        return { success: false, error: 'Invalid backup file format' };
      }

      let count = 0;
      for (const item of parsed.memories) {
        if (item.type && item.id) {
          // Re-assign to current user to guarantee isolation
          const remappedItem = {
            ...item,
            id: `imported_${Date.now()}_${count++}`,
            userId: user.id,
          };
          await dbSaveMemory(remappedItem);
        }
      }
      await refreshMemories();
      celebrate();
      return { success: true, count };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to parse JSON file' };
    }
  };

  return (
    <MemoryContext.Provider
      value={{
        memories,
        photos,
        videos,
        diaryEntries,
        notes,
        favorites,
        stats,
        loading,
        addPhoto,
        addVideo,
        addDiaryEntry,
        updateDiaryEntry,
        addNote,
        updateNote,
        deleteMemory,
        toggleFavorite,
        searchMemories,
        exportData,
        importData,
        refreshMemories,
        celebrate,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemories = (): MemoryContextType => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemories must be used within a MemoryProvider');
  }
  return context;
};
