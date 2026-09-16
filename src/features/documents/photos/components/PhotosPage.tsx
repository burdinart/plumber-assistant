import React, { useState, useEffect, useRef } from 'react';
import { usePhotosStore } from '../store/photosStore';
import { CATEGORY_LABELS, type PhotoCategory } from '../types';

interface PhotosPageProps {
  objectId?: string;
  orderId?: string;
}

export const PhotosPage: React.FC<PhotosPageProps> = ({ objectId, orderId }) => {
  const store = usePhotosStore();
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Форма
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<PhotoCategory>('before');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (objectId) {
      store.loadByObject(objectId);
    } else if (orderId) {
      store.loadByOrder(orderId);
    } else {
      store.loadAll();
    }
  }, [objectId, orderId]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    let finalObjectId = objectId;
    let finalOrderId = orderId;
    
    // Если нет objectId, нужно запросить у пользователя
    if (!finalObjectId) {
      alert('Выберите объект для привязки фото');
      return;
    }
    
    try {
      await store.addPhoto({
        objectId: finalObjectId,
        orderId: finalOrderId || null,
        clientId: null,
        category,
        caption,
        file: selectedFile,
      });
      
      // Сброс формы
      setCaption('');
      setCategory('before');
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to add photo:', err);
    }
  };
  
  const filteredPhotos = selectedCategory 
    ? store.photos.filter(p => p.category === selectedCategory)
    : store.photos;
  
  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">📸 Фотоотчёт</h1>
      
      {/* Кнопка добавить фото */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full mb-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 min-h-[48px]"
      >
        {showForm ? '❌ Отмена' : '➕ Добавить фото'}
      </button>
      
      {/* Форма добавления */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Новое фото</h2>
          
          {/* Выбор категории */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PhotoCategory)}
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[48px]"
            >
              {(Object.keys(CATEGORY_LABELS) as PhotoCategory[]).map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          
          {/* Загрузка файла */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Фото</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[48px]"
            />
          </div>
          
          {/* Предпросмотр */}
          {previewUrl && (
            <div className="mb-4">
              <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg" />
            </div>
          )}
          
          {/* Описание */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Комментарий к фото..."
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[48px]"
              rows={3}
            />
          </div>
          
          {/* Кнопка сохранить */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className={`w-full py-3 rounded-lg font-medium min-h-[48px] ${
              selectedFile
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            💾 Сохранить
          </button>
        </div>
      )}
      
      {/* Фильтры по категориям */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-2 rounded-lg text-sm min-h-[48px] ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Все ({store.photos.length})
        </button>
        {(Object.keys(CATEGORY_LABELS) as PhotoCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-2 rounded-lg text-sm min-h-[48px] ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {CATEGORY_LABELS[cat].split(' ')[0]} ({filteredPhotos.filter(p => p.category === cat).length})
          </button>
        ))}
      </div>
      
      {/* Галерея */}
      {store.isLoading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Нет фото</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPhotos.map(photo => (
            <div key={photo.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <img
                src={photo.thumbnailDataUrl}
                alt={photo.caption || 'Photo'}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 mb-2">
                  {CATEGORY_LABELS[photo.category].split(' ')[0]}
                </span>
                {photo.caption && (
                  <p className="text-sm text-gray-600 mb-2 truncate">{photo.caption}</p>
                )}
                <p className="text-xs text-gray-400">{formatDateTime(photo.timestamp)}</p>
                {photo.synced ? (
                  <span className="text-xs text-green-600">✓ Синхронизировано</span>
                ) : (
                  <span className="text-xs text-orange-600">⏳ Ожидает синхронизации</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {store.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {store.error}
        </div>
      )}
    </div>
  );
};
