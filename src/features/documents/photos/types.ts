export type PhotoCategory = 'before' | 'after' | 'problem' | 'progress' | 'materials';

export interface PhotoRecord {
  id: string;
  orderId: string | null;
  objectId: string;          // обязательно
  clientId: string | null;
  category: PhotoCategory;
  caption: string;
  timestamp: number;
  geolocation: { lat: number; lng: number; accuracy: number } | null;
  synced: boolean;
  serverUrl: string | null;
  thumbnailDataUrl: string;  // миниатюра в base64 для быстрого отображения
}

export interface SyncTask {
  id: string;
  type: 'photo-upload';
  photoId: string;
  timestamp: number;
  attempts: number;          // макс 5
}

export interface PhotoInput {
  orderId: string | null;
  objectId: string;
  clientId: string | null;
  category: PhotoCategory;
  caption: string;
  file: File;
}

export const CATEGORY_LABELS: Record<PhotoCategory, string> = {
  before: '📷 До начала работ',
  after: '✅ После завершения',
  problem: '⚠️ Проблема',
  progress: '🔨 В процессе',
  materials: '📦 Материалы',
};
