import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Save, X } from 'lucide-react';
import { useReminders } from '../hooks/useReminders';
import { useClients } from '../../clients/hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { Toast } from '../../../shared/ui/Toast';
import { getTodayDate, getCurrentTime } from '../../../shared/utils/helpers';
import { ReminderPriority } from '../../../shared/types';

export function ReminderForm() {
  const navigate = useNavigate();
  const { addReminder } = useReminders();
  const { clients } = useClients();
  const { orders } = useOrders();

  const [formData, setFormData] = useState({
    text: '',
    date: getTodayDate(),
    time: getCurrentTime(),
    priority: 'medium' as ReminderPriority,
    relatedClientId: '',
    relatedOrderId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Введите текст напоминания';
    }

    if (!formData.date) {
      newErrors.date = 'Укажите дату';
    }

    if (!formData.time) {
      newErrors.time = 'Укажите время';
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
      const reminderData = {
        text: formData.text,
        date: formData.date,
        time: formData.time,
        priority: formData.priority,
        relatedClientId: formData.relatedClientId || undefined,
        relatedOrderId: formData.relatedOrderId || undefined,
      };

      addReminder(reminderData);
      setToast({ message: 'Напоминание создано', type: 'success' });
      setTimeout(() => navigate('/reminders'), 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при создании напоминания', type: 'error' });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const PRIORITIES: { value: ReminderPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Низкий', color: 'gray' },
    { value: 'medium', label: 'Средний', color: 'amber' },
    { value: 'high', label: 'Высокий', color: 'red' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Новое напоминание
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Создайте напоминание о важном событии
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Текст напоминания <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Позвонить клиенту, купить материалы, проверить оплату..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none ${
                errors.text ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.text && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.text}</p>}
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
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
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
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.time ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.time && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Приоритет
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleChange('priority', priority.value)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === priority.value
                      ? `bg-${priority.color}-600 text-white`
                      : `bg-${priority.color}-100 dark:bg-${priority.color}-900/30 text-${priority.color}-700 dark:text-${priority.color}-300 hover:bg-${priority.color}-200 dark:hover:bg-${priority.color}-900/50`
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Related Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Привязать к клиенту (опционально)
            </label>
            <select
              value={formData.relatedClientId}
              onChange={(e) => handleChange('relatedClientId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Не привязывать</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Related Order */}
          {formData.relatedClientId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Привязать к заявке (опционально)
              </label>
              <select
                value={formData.relatedOrderId}
                onChange={(e) => handleChange('relatedOrderId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Не привязывать</option>
                {orders
                  .filter((o) => o.clientId === formData.relatedClientId)
                  .map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.description} — {order.date}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Создать напоминание
          </button>
          <button
            type="button"
            onClick={() => navigate('/reminders')}
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
