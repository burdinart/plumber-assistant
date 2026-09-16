import { create } from 'zustand';
import type { PhotoRecord, PhotoCategory, PhotoInput } from '../types';
import {
  savePhoto,
  getAllPhotos,
  getPhotosByOrder,
  getPhotosByObject,
  createThumbnail,
  readGeolocation,
  addSyncTask,
} from '../logic/db';

interface PhotosState {
  photos: PhotoRecord[];
  isLoading: boolean;
  error: string | null;
  
  loadAll: () => Promise<void>;
  loadByOrder: (orderId: string) => Promise<void>;
  loadByObject: (objectId: string) => Promise<void>;
  addPhoto: (input: PhotoInput) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  filterByCategory: (category: PhotoCategory | null) => PhotoRecord[];
}

export const usePhotosStore = create<PhotosState>((set, get) => ({
  photos: [],
  isLoading: false,
  error: null,
  
  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const photos = await getAllPhotos();
      set({ photos, isLoading: false });
    } catch (err) {
      set({ error: 'Не удалось загрузить фото', isLoading: false });
    }
  },
  
  loadByOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const photos = await getPhotosByOrder(orderId);
      set({ photos, isLoading: false });
    } catch (err) {
      set({ error: 'Не удалось загрузить фото', isLoading: false });
    }
  },
  
  loadByObject: async (objectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const photos = await getPhotosByObject(objectId);
      set({ photos, isLoading: false });
    } catch (err) {
      set({ error: 'Не удалось загрузить фото', isLoading: false });
    }
  },
  
  addPhoto: async (input: PhotoInput) => {
    set({ error: null });
    try {
      // Создаём миниатюру
      const thumbnailDataUrl = await createThumbnail(input.file);
      
      // Получаем геолокацию (не блокируем)
      const geolocation = await readGeolocation();
      
      const record: PhotoRecord = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderId: input.orderId,
        objectId: input.objectId,
        clientId: input.clientId,
        category: input.category,
        caption: input.caption,
        timestamp: Date.now(),
        geolocation,
        synced: false,
        serverUrl: null,
        thumbnailDataUrl,
      };
      
      // Сохраняем в IndexedDB
      await savePhoto(record);
      
      // Добавляем задачу синхронизации
      await addSyncTask({
        id: `sync-${record.id}`,
        type: 'photo-upload',
        photoId: record.id,
        timestamp: Date.now(),
        attempts: 0,
      });
      
      // Обновляем список
      const photos = [...get().photos, record];
      set({ photos });
    } catch (err) {
      set({ error: 'Не удалось сохранить фото' });
      throw err;
    }
  },
  
  deletePhoto: async (id: string) => {
    // TODO: Реализовать удаление из IndexedDB
    const photos = get().photos.filter(p => p.id !== id);
    set({ photos });
  },
  
  filterByCategory: (category) => {
    if (!category) return get().photos;
    return get().photos.filter(p => p.category === category);
  },
}));
