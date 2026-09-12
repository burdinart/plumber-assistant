import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ClipboardList, Save, X } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useClients } from '../../clients/hooks/useClients';
import { Toast } from '../../../shared/ui/Toast';
import { getTodayDate, getCurrentTime, isDateInPast, formatCurrency } from '../../../shared/utils/helpers';
import { OrderStatus, OrderType } from '../../../shared/types';

export function OrderForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getOrder, addOrder, updateOrder } = useOrders();
  const { clients, getClient } = useClients();

  const isEditing = Boolean(id);
  const existingOrder = id ? getOrder(id) : undefined;
  const preselectedClientId = searchParams.get('clientId') || '';

  const [formData, setFormData] = useState({
    clientId: preselectedClientId,
    type: 'repair' as OrderType,
    address: '',
    date: getTodayDate(),
    time: getCurrentTime(),
    description: '',
    status: 'new' as OrderStatus,
    workCost: 0,
    materialsCost: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isEditing && existingOrder) {
      setFormData({
        clientId: existingOrder.clientId,
        type: existingOrder.type,
        address: existingOrder.address,
        date: existingOrder.date,
        time: existingOrder.time,
        description: existingOrder.description,
        status: existingOrder.status,
        workCost: existingOrder.workCost,
        materialsCost: existingOrder.materialsCost,
      });
    } else if (preselectedClientId) {
      const client = getClient(preselectedClientId);
      if (client) {
        setFormData((prev) => ({ ...prev, address: client.address }));
      }
    }
  }, [isEditing, existingOrder, preselectedClientId]);

  // Автозаполнение адреса при выборе клиента
  useEffect(() => {
    if (formData.clientId && !isEditing) {
      const client = getClient(formData.clientId);
      if (client) {
        setFormData((prev) => ({ ...prev, address: client.address }));
      }
    }
  }, [formData.clientId, isEditing]);

  const total = formData.workCost + formData.materialsCost;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Укажите адрес';
    }

    if (!formData.date) {
      newErrors.date = 'Укажите дату';
    } else if (!isEditing && isDateInPast(formData.date, formData.time)) {
      newErrors.date = 'Дата не может быть в прошлом';
    }

    if (!formData.time) {
      newErrors.time = 'Укажите время';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Опишите проблему';
    }

    if (formData.workCost < 0) {
      newErrors.workCost = 'Стоимость не может быть отрицательной';
    }

    if (formData.materialsCost < 0) {
      newErrors.materialsCost = 'Стоимость не может быть отрицательной';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToast({ message: 'Исправьте ошибки в форме', type: 'error' });
      return;
    }

    try {
      if (isEditing && id) {
        updateOrder(id, formData);
        setToast({ message: 'Заявка обновлена', type: 'success' });
      } else {
        addOrder(formData);
        setToast({ message: 'Заявка создана', type: 'success' });
      }

      setTimeout(() => navigate('/orders'), 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при сохранении', type: 'error' });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const ORDER_TYPES: { value: OrderType; label: string }[] = [
    { value: 'emergency', label: 'Аварийный выезд' },
    { value: 'installation', label: 'Установка' },
    { value: 'repair', label: 'Ремонт' },
    { value: 'consultation', label: 'Консультация' },
  ];

  const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
    { value: 'new', label: 'Новая' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'completed', label: 'Завершена' },
    { value: 'paid', label: 'Оплачена' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? 'Редактирование заявки' : 'Новая заявка'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Измените данные заявки' : 'Заполните данные новой заявки'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Клиент <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.clientId ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Выберите клиента</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} — {client.phone}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.clientId}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Тип работы <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ORDER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Адрес <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 10"
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.address ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.address && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.address}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Дата <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.date && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Время <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.time ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.time && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание проблемы <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Опишите проблему подробно..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.description && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Status (only for editing) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Costs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Стоимость работ (₽)
              </label>
              <input
                type="number"
                value={formData.workCost}
                onChange={(e) => handleChange('workCost', Number(e.target.value))}
                min="0"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.workCost ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.workCost && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.workCost}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Стоимость материалов (₽)
              </label>
              <input
                type="number"
                value={formData.materialsCost}
                onChange={(e) => handleChange('materialsCost', Number(e.target.value))}
                min="0"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.materialsCost ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.materialsCost && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.materialsCost}</p>}
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Итого:</span>
              <span className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Сохранить' : 'Создать'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/orders')}
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
