import { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Camera, Save, X, ArrowLeft, Trash2, Upload } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { PhotoReport as PhotoReportType, Photo } from '../types';
import { fileToBase64 } from '../utils/documentHelpers';
import { Toast } from '../../../shared/ui/Toast';

export function PhotoReportForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createPhotoReport } = useDocuments();
  const { getClient } = useClients();
  const { getOrder } = useOrders();

  const orderId = searchParams.get('orderId');
  const clientId = searchParams.get('clientId');
  const order = orderId ? getOrder(orderId) : undefined;
  const preselectedClient = clientId ? getClient(clientId) : undefined;

  const [formData, setFormData] = useState({
    clientId: preselectedClient?.id || order?.clientId || '',
    orderId: orderId || '',
    photos: [] as Photo[],
  });

  const [currentPhotoType, setCurrentPhotoType] = useState<'before' | 'after'>('before');
  const [currentComment, setCurrentComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'Размер файла не должен превышать 5MB', type: 'error' });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const newPhoto: Photo = {
        id: `photo-${Date.now()}`,
        data: base64,
        type: currentPhotoType,
        comment: currentComment || undefined,
        uploadedAt: new Date().toISOString(),
      };

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, newPhoto],
      }));

      setCurrentComment('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setToast({ message: 'Фото добавлено', type: 'success' });
    } catch (error) {
      setToast({ message: 'Ошибка при загрузке фото', type: 'error' });
    }
  };

  const removePhoto = (photoId: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }

    if (formData.photos.length === 0) {
      newErrors.photos = 'Добавьте хотя бы одно фото';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToast({ message: 'Заполните обязательные поля', type: 'error' });
      return;
    }

    try {
      const reportData: Omit<PhotoReportType, 'id' | 'number' | 'createdAt' | 'type'> = {
        clientId: formData.clientId,
        orderId: formData.orderId || undefined,
        photos: formData.photos,
      };

      const newReport = createPhotoReport(reportData);
      setToast({ message: 'Фотоотчёт создан', type: 'success' });
      
      setTimeout(() => {
        navigate(`/documents/photo-reports/${newReport.id}`);
      }, 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при создании фотоотчёта', type: 'error' });
    }
  };

  const client = formData.clientId ? getClient(formData.clientId) : null;
  const beforePhotos = formData.photos.filter(p => p.type === 'before');
  const afterPhotos = formData.photos.filter(p => p.type === 'after');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к документам
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Новый фотоотчёт</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {order ? `Фотоотчёт к заявке ${order.id}` : 'Создание фотоотчёта'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Клиент <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={client?.name || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            {errors.clientId && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.clientId}</p>}
          </div>

          {/* Photo upload section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Загрузка фото <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => setCurrentPhotoType('before')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  currentPhotoType === 'before'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                📷 Фото "ДО"
              </button>
              <button
                type="button"
                onClick={() => setCurrentPhotoType('after')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  currentPhotoType === 'after'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                📸 Фото "ПОСЛЕ"
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Комментарий к фото (опционально)
              </label>
              <input
                type="text"
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                placeholder="Например: Состояние трубы до замены"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-orange-500 hover:text-orange-600 dark:hover:border-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Выбрать фото
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Максимальный размер файла: 5MB
            </p>

            {errors.photos && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.photos}</p>}
          </div>

          {/* Photos preview */}
          {formData.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Загруженные фото ({formData.photos.length})
              </h3>

              {beforePhotos.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Фото "ДО" ({beforePhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {beforePhotos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.data}
                          alt={photo.comment || 'Фото до'}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        {photo.comment && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {photo.comment}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {afterPhotos.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Фото "ПОСЛЕ" ({afterPhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {afterPhotos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.data}
                          alt={photo.comment || 'Фото после'}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        {photo.comment && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {photo.comment}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Создать фотоотчёт
          </button>
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
