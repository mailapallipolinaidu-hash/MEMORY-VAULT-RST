import { MemoryItem, User, StorageStats, MemoryType } from '../types';

const DB_NAME = 'MemoryVault_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('phone', 'phone', { unique: true });
        }

        // Memories store (photo, video, diary, note)
        if (!db.objectStoreNames.contains('memories')) {
          const memStore = db.createObjectStore('memories', { keyPath: 'id' });
          memStore.createIndex('userId', 'userId', { unique: false });
          memStore.createIndex('type', 'type', { unique: false });
          memStore.createIndex('date', 'date', { unique: false });
          memStore.createIndex('isFavorite', 'isFavorite', { unique: false });
          memStore.createIndex('userId_type', ['userId', 'type'], { unique: false });
        }

        // Media Blobs store for high-resolution photos & video data
        if (!db.objectStoreNames.contains('mediaBlobs')) {
          const blobStore = db.createObjectStore('mediaBlobs', { keyPath: 'id' });
          blobStore.createIndex('userId', 'userId', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

// ----------------- USER REPOSITORY -----------------

export async function dbSaveUser(user: User): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    const req = store.put(user);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetUser(id: string): Promise<User | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetUserByPhone(phone: string): Promise<User | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const index = store.index('phone');
    const req = index.get(phone.trim());
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbListUsers(): Promise<User[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// ----------------- MEMORIES REPOSITORY -----------------

/**
 * Strictly returns memories belonging ONLY to the requested userId.
 * Cross-user contamination is physically prevented at database query time.
 */
export async function dbGetMemoriesByUser(userId: string, type?: MemoryType): Promise<MemoryItem[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('memories', 'readonly');
    const store = tx.objectStore('memories');
    
    let req: IDBRequest<MemoryItem[]>;
    if (type) {
      const index = store.index('userId_type');
      req = index.getAll(IDBKeyRange.only([userId, type]));
    } else {
      const index = store.index('userId');
      req = index.getAll(IDBKeyRange.only(userId));
    }

    req.onsuccess = () => {
      // Always sort descending by date (newest first)
      const list = (req.result || []).sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return dateB - dateA;
      });
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function dbSaveMemory(memory: MemoryItem): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('memories', 'readwrite');
    const store = tx.objectStore('memories');
    const req = store.put(memory);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function dbDeleteMemory(id: string, userId: string): Promise<boolean> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['memories', 'mediaBlobs'], 'readwrite');
    const memStore = tx.objectStore('memories');
    const blobStore = tx.objectStore('mediaBlobs');

    // First ensure memory belongs to user
    const getReq = memStore.get(id);
    getReq.onsuccess = () => {
      const item = getReq.result as MemoryItem | undefined;
      if (!item || item.userId !== userId) {
        resolve(false);
        return;
      }

      memStore.delete(id);
      blobStore.delete(id); // Clean up associated binary blob if exists
      resolve(true);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function dbToggleFavorite(id: string, userId: string): Promise<boolean> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('memories', 'readwrite');
    const store = tx.objectStore('memories');
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item = getReq.result as MemoryItem | undefined;
      if (!item || item.userId !== userId) {
        resolve(false);
        return;
      }
      item.isFavorite = !item.isFavorite;
      item.updatedAt = new Date().toISOString();
      store.put(item);
      resolve(item.isFavorite);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

// ----------------- MEDIA BLOBS REPOSITORY -----------------

export async function dbSaveBlob(id: string, userId: string, blob: Blob): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('mediaBlobs', 'readwrite');
    const store = tx.objectStore('mediaBlobs');
    const req = store.put({ id, userId, blob, createdAt: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetBlob(id: string): Promise<Blob | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('mediaBlobs', 'readonly');
    const store = tx.objectStore('mediaBlobs');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result ? req.result.blob : null);
    req.onerror = () => reject(req.error);
  });
}

// ----------------- STORAGE METRICS -----------------

export async function dbCalculateStats(userId: string): Promise<StorageStats> {
  const memories = await dbGetMemoriesByUser(userId);

  let totalPhotos = 0;
  let totalVideos = 0;
  let totalDiary = 0;
  let totalNotes = 0;
  let totalFavorites = 0;
  let photosSizeBytes = 0;
  let videosSizeBytes = 0;
  let otherSizeBytes = 0;

  for (const m of memories) {
    if (m.isFavorite) totalFavorites++;

    if (m.type === 'photo') {
      totalPhotos++;
      photosSizeBytes += m.fileSize || (m.imageUrl.length * 0.75) || 1500000;
    } else if (m.type === 'video') {
      totalVideos++;
      videosSizeBytes += m.fileSize || 18000000;
    } else if (m.type === 'diary') {
      totalDiary++;
      otherSizeBytes += (m.content.length * 2) + 2000;
    } else if (m.type === 'note') {
      totalNotes++;
      otherSizeBytes += (m.content.length * 2) + 1000;
    }
  }

  const photosSizeMb = +(photosSizeBytes / (1024 * 1024)).toFixed(2);
  const videosSizeMb = +(videosSizeBytes / (1024 * 1024)).toFixed(2);
  const otherSizeKb = +(otherSizeBytes / 1024).toFixed(1);
  const totalSizeMb = +(photosSizeMb + videosSizeMb + (otherSizeKb / 1024)).toFixed(2);

  return {
    totalPhotos,
    totalVideos,
    totalDiary,
    totalNotes,
    totalFavorites,
    totalMemories: memories.length,
    photosSizeMb,
    videosSizeMb,
    otherSizeKb,
    totalSizeMb,
  };
}
