export type MemoryType = 'photo' | 'video' | 'diary' | 'note';

export type MoodType = 'happy' | 'loved' | 'peaceful' | 'sad' | 'angry' | 'excited' | 'tired';

export interface MoodMeta {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  pinHash?: string;
  avatarUrl?: string;
  createdAt: string;
  bio?: string;
}

export interface BaseMemory {
  id: string;
  userId: string;
  type: MemoryType;
  date: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PhotoMemory extends BaseMemory {
  type: 'photo';
  title?: string;
  caption: string;
  tags: string[];
  imageUrl: string;
  thumbnailUrl?: string;
  fileSize?: number; // in bytes
  aspectRatio?: number;
}

export interface VideoMemory extends BaseMemory {
  type: 'video';
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  fileSize?: number; // in bytes
}

export interface DiaryMemory extends BaseMemory {
  type: 'diary';
  title: string;
  mood: MoodType;
  content: string;
  imageUrl?: string;
}

export interface NoteMemory extends BaseMemory {
  type: 'note';
  title: string;
  content: string;
  tags: string[];
  color: string; // hex or tailwind badge class
  isPinned: boolean;
}

export type MemoryItem = PhotoMemory | VideoMemory | DiaryMemory | NoteMemory;

export interface StorageStats {
  totalPhotos: number;
  totalVideos: number;
  totalDiary: number;
  totalNotes: number;
  totalFavorites: number;
  totalMemories: number;
  photosSizeMb: number;
  videosSizeMb: number;
  otherSizeKb: number;
  totalSizeMb: number;
}

export type ActiveTab = 
  | 'dashboard'
  | 'photos'
  | 'videos'
  | 'diary'
  | 'notes'
  | 'favorites'
  | 'timeline'
  | 'profile'
  | 'search';
