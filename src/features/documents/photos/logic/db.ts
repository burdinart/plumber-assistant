import type { PhotoRecord, SyncTask } from '../types';

const DB_NAME = 'plumber-assistant-db';
const DB_VERSION = 1;

const STORES = {
  photos: 'photos',
  syncQueue: 'syncQueue',
};

const INDEXES = {
  photos: ['orderId', 'objectId', 'synced'],
  syncQueue: ['timestamp'],
};

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Хранилище photos
      if (!db.objectStoreNames.contains(STORES.photos)) {
        const photoStore = db.createObjectStore(STORES.photos, { keyPath: 'id' });
        INDEXES.photos.forEach(index => {
          photoStore.createIndex(index, index, { unique: false });
        });
      }
      
      // Хранилище syncQueue
      if (!db.objectStoreNames.contains(STORES.syncQueue)) {
        const syncStore = db.createObjectStore(STORES.syncQueue, { keyPath: 'id' });
        INDEXES.syncQueue.forEach(index => {
          syncStore.createIndex(index, index, { unique: false });
        });
      }
    };
  });
}

/**
 * Создать миниатюру из файла
 */
export async function createThumbnail(file: File, maxSize: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Расчёт размеров с сохранением пропорций
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          reject(new Error('Cannot get canvas context'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Сжать оригинальное фото
 */
export async function compressOriginal(file: File, maxWidth: number = 1920): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          reject(new Error('Cannot get canvas context'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Получить геолокацию (не падает при отказе)
 */
export async function readGeolocation(): Promise<{ lat: number; lng: number; accuracy: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => resolve(null),
      { timeout: 5000, maximumAge: 60000 }
    );
  });
}

/**
 * Сохранить фото в IndexedDB
 */
export async function savePhoto(record: PhotoRecord): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.photos, 'readwrite');
    const store = tx.objectStore(STORES.photos);
    const request = store.put(record);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить фото по заказу
 */
export async function getPhotosByOrder(orderId: string): Promise<PhotoRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.photos, 'readonly');
    const store = tx.objectStore(STORES.photos);
    const index = store.index('orderId');
    const request = index.getAll(orderId);
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить фото по объекту
 */
export async function getPhotosByObject(objectId: string): Promise<PhotoRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.photos, 'readonly');
    const store = tx.objectStore(STORES.photos);
    const index = store.index('objectId');
    const request = index.getAll(objectId);
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить все фото
 */
export async function getAllPhotos(): Promise<PhotoRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.photos, 'readonly');
    const store = tx.objectStore(STORES.photos);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Добавить задачу синхронизации
 */
export async function addSyncTask(task: SyncTask): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.syncQueue, 'readwrite');
    const store = tx.objectStore(STORES.syncQueue);
    const request = store.put(task);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Получить все задачи синхронизации
 */
export async function getSyncTasks(): Promise<SyncTask[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.syncQueue, 'readonly');
    const store = tx.objectStore(STORES.syncQueue);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Удалить задачу синхронизации
 */
export async function removeSyncTask(taskId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.syncQueue, 'readwrite');
    const store = tx.objectStore(STORES.syncQueue);
    const request = store.delete(taskId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Обновить статус синхронизации фото
 */
export async function updatePhotoSyncStatus(photoId: string, synced: boolean, serverUrl?: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.photos, 'readwrite');
    const store = tx.objectStore(STORES.photos);
    
    const getRequest = store.get(photoId);
    getRequest.onsuccess = () => {
      const photo = getRequest.result;
      if (photo) {
        photo.synced = synced;
        if (serverUrl) photo.serverUrl = serverUrl;
        const putRequest = store.put(photo);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Удалить старые синхронизированные фото (оригиналы)
 */
export async function cleanupOldPhotos(daysOld: number = 30): Promise<void> {
  const db = await openDB();
  const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.photos, 'readwrite');
    const store = tx.objectStore(STORES.photos);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const photos = request.result || [];
      let deleteCount = 0;
      
      for (const photo of photos) {
        if (photo.synced && photo.timestamp < cutoffDate) {
          store.delete(photo.id);
          deleteCount++;
        }
      }
      
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}
