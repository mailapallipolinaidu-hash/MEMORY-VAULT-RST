import { dbSaveBlob } from './db';

export interface StorageUploadResult {
  url: string;
  thumbnailUrl?: string;
  size: number;
  duration?: number;
}

export interface IStorageService {
  uploadPhoto(file: File, userId: string): Promise<StorageUploadResult>;
  uploadVideo(file: File, userId: string): Promise<StorageUploadResult>;
  deleteMedia(url: string, userId: string): Promise<void>;
}

/**
 * High-performance browser-native private storage implementation.
 * Stores binary blobs in IndexedDB and creates private Object URLs.
 * Eliminates base64 bloat and ensures user data isolation.
 */
class BrowserIndexedDbStorageService implements IStorageService {
  async uploadPhoto(file: File, userId: string): Promise<StorageUploadResult> {
    const id = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await dbSaveBlob(id, userId, file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    return {
      url,
      size: file.size,
    };
  }

  async uploadVideo(file: File, userId: string): Promise<StorageUploadResult> {
    const id = `video_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await dbSaveBlob(id, userId, file);

    const url = URL.createObjectURL(file);

    // Extract video duration and thumbnail frame
    const { duration, thumbnailUrl } = await this.generateVideoThumbnail(file);

    return {
      url,
      thumbnailUrl,
      size: file.size,
      duration,
    };
  }

  async deleteMedia(url: string, _userId: string): Promise<void> {
    if (url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // Ignored
      }
    }
  }

  private generateVideoThumbnail(file: File): Promise<{ duration: number; thumbnailUrl: string }> {
    return new Promise((resolve) => {
      let duration = 0;
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;

      video.onloadedmetadata = () => {
        duration = Math.round(video.duration) || 0;
        // Seek to 1s or midpoint for thumbnail
        video.currentTime = Math.min(1.0, video.duration / 2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(640, video.videoWidth || 640);
          canvas.height = Math.min(360, video.videoHeight || 360);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
            URL.revokeObjectURL(videoUrl);
            resolve({ duration, thumbnailUrl });
            return;
          }
        } catch (e) {
          // Fallback
        }
        URL.revokeObjectURL(videoUrl);
        resolve({ duration: 0, thumbnailUrl: '' });
      };

      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        resolve({ duration: 0, thumbnailUrl: '' });
      };
    });
  }
}

/**
 * Singleton instance of active storage service.
 * Ready to be swapped with FirebaseStorageService or SupabaseStorageService.
 */
export const storageService: IStorageService = new BrowserIndexedDbStorageService();
