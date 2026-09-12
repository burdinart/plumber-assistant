import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useClients } from '../../clients/hooks/useClients';
import { Property, ObjectType, OBJECT_TYPE_NAMES, OBJECT_TYPE_ICONS } from '../types';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';

export function PropertyForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getProperty, createProperty, updateProperty, deleteProperty } = useProperties();
  const { clients } = useClients();

  const isEditing = Boolean(id);
  const existingProperty = id ? getProperty(id) : undefined;
  const preselectedClientId = searchParams.get('clientId');

  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    name: '',
    type: 'apartment' as ObjectType,
    address: '',
    city: '',
    street: '',
    building: '',
    apartment: '',
    floor: undefined as number | undefined,
    entrance: undefined as number | undefined,
    area: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
    bedrooms: undefined as number | undefined,
    hasGas: false,
    hasCentralHeating: false,
    waterSupplyType: undefined as Property['waterSupplyType'],
    sewageType: undefined as Property['sewageType'],
    pipeMaterial: undefined as Property['pipeMaterial'],
    heatingSystem: undefined as Property['heatingSystem'],
    notes: '',
    accessInfo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isEditing && existingProperty) {
      setFormData({
        clientId: existingProperty.clientId,
        name: existingProperty.name,
        type: existingProperty.type,
        address: existingProperty.address,
        city: existingProperty.city || '',
        street: existingProperty.street || '',
        building: existingProperty.building || '',
        apartment: existingProperty.apartment || '',
        floor: existingProperty.floor,
        entrance: existingProperty.entrance,
        area: existingProperty.area,
        bathrooms: existingProperty.bathrooms,
        bedrooms: existingProperty.bedrooms,
        hasGas: existingProperty.hasGas || false,
        hasCentralHeating: existingProperty.hasCentralHeating || false,
        waterSupplyType: existingProperty.waterSupplyType,
        sewageType: existingProperty.sewageType,
        pipeMaterial: existingProperty.pipeMaterial,
        heatingSystem: existingProperty.heatingSystem,
        notes: existingProperty.notes || '',
        accessInfo: existingProperty.accessInfo || '',
      });
    }
  }, [isEditing, existingProperty]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Введите название объекта';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес объекта';
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
      const propertyData = {
        ...formData,
        floor: formData.floor || undefined,
        entrance: formData.entrance || undefined,
        area: formData.area || undefined,
        bathrooms: formData.bathrooms || undefined,
        bedrooms: formData.bedrooms || undefined,
      };

      if (isEditing && id) {
        updateProperty(id, propertyData);
        setToast({ message: 'Объект обновлён', type: 'success' });
      } else {
        createProperty(propertyData);
        setToast({ message: 'Объект создан', type: 'success' });
      }

      setTimeout(() => navigate('/objects'), 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при сохранении', type: 'error' });
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteProperty(id);
      setToast({ message: 'Объект удалён', type: 'success' });
      setTimeout(() => navigate('/objects'), 1000);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Автозаполнение адреса из компонентов
  useEffect(() => {
    const parts = [];
    if (formData.city) parts.push(`г. ${formData.city}`);
    if (formData.street) parts.push(`ул. ${formData.street}`);
    if (formData.building) parts.push(`д. ${formData.building}`);
    if (formData.apartment) parts.push(`кв. ${formData.apartment}`);
    
    if (parts.length > 0) {
      handleChange('address', parts.join(', '));
    }
  }, [formData.city, formData.street, formData.building, formData.apartment]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/objects')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {isEditing ? 'Редактирование объекта' : 'Новый объект'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEditing ? 'Измените информацию об объекте' : 'Добавьте новый объект'}
            </p>
          </div>
        </div>
        {isEditing && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {/* Основная информация */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Основная информация
            </h2>
            <div className="space-y-4">
              {/* Клиент */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Владелец <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleChange('clientId', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                    errors.clientId ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Выберите клиента</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.clientId}</p>}
              </div>

              {/* Название */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Название объекта <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Например: Квартира на Ленина"
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                    errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Тип объекта */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тип объекта
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(Object.keys(OBJECT_TYPE_NAMES) as ObjectType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('type', type)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        formData.type === type
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span>{OBJECT_TYPE_ICONS[type]}</span>
                      <span>{OBJECT_TYPE_NAMES[type]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Адрес */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Адрес
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Город
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Москва"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Улица
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleChange('street', e.target.value)}
                    placeholder="Ленина"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Дом
                  </label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => handleChange('building', e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Квартира/Офис
                  </label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => handleChange('apartment', e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Этаж
                  </label>
                  <input
                    type="number"
                    value={formData.floor || ''}
                    onChange={(e) => handleChange('floor', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Полный адрес <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="г. Москва, ул. Ленина, д. 10, кв. 25"
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                    errors.address ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.address && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Характеристики */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Характеристики
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Площадь (м²)
                  </label>
                  <input
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => handleChange('area', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="65"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Санузлы
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Комнаты
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="2"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasGas}
                    onChange={(e) => handleChange('hasGas', e.target.checked)}
                    className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Есть газ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasCentralHeating}
                    onChange={(e) => handleChange('hasCentralHeating', e.target.checked)}
                    className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Центральное отопление</span>
                </label>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Дополнительная информация
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Заметки
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Особенности объекта: старые трубы, нет горячей воды и т.д."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Информация о доступе
                </label>
                <textarea
                  value={formData.accessInfo}
                  onChange={(e) => handleChange('accessInfo', e.target.value)}
                  placeholder="Как попасть: домофон 123, ключи у консьержа и т.д."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Сохранить' : 'Создать'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/objects')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить объект?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить объект <strong>{existingProperty?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Это действие нельзя отменить. Все связанные заявки и документы останутся в системе.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Удалить
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
