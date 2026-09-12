import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FileText, Save, X, ArrowLeft } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { useReminders } from '../../reminders/hooks/useReminders';
import { Warranty } from '../types';
import { getTodayDate, getDateAfterDays } from '../../finance/utils/formatters';
import { Toast } from '../../../shared/ui/Toast';

export function WarrantyForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createWarranty } = useDocuments();
  const { getClient } = useClients();
  const { getOrder } = useOrders();
  const { addReminder } = useReminders();

  const orderId = searchParams.get('orderId');
  const clientId = searchParams.get('clientId');
  const order = orderId ? getOrder(orderId) : undefined;
  const preselectedClient = clientId ? getClient(clientId) : undefined;

  const [formData, setFormData] = useState({
    clientId: preselectedClient?.id || order?.clientId || '',
    orderId: orderId || '',
    issueDate: getTodayDate(),
    warrantyMonths: 12,
    workDescription: order?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Автозаполнение из заявки
  useEffect(() => {
    if (order) {
      setFormData(prev => ({
        ...prev,
        clientId: order.clientId,
        workDescription: order.description,
      }));
    }
  }, [order]);

  // Расчёт даты окончания гарантии
  const calculateExpiryDate = (issueDate: string, months: number): string => {
    const date = new Date(issueDate);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  const expiryDate = calculateExpiryDate(formData.issueDate, formData.warrantyMonths);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Укажите дату выдачи';
    }

    if (formData.warrantyMonths <= 0) {
      newErrors.warrantyMonths = 'Срок гарантии должен быть больше 0';
    }

    if (!formData.workDescription.trim()) {
      newErrors.workDescription = 'Опишите выполненные работы';
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
      const warrantyData: Omit<Warranty, 'id' | 'number' | 'createdAt' | 'type'> = {
        clientId: formData.clientId,
        orderId: formData.orderId || undefined,
        issueDate: formData.issueDate,
        expiryDate: expiryDate,
        warrantyMonths: formData.warrantyMonths,
        workDescription: formData.workDescription,
      };

      const newWarranty = createWarranty(warrantyData);

      // Создаём напоминание за месяц до окончания гарантии
      const reminderDate = new Date(expiryDate);
      reminderDate.setMonth(reminderDate.getMonth() - 1);
      
      const client = getClient(formData.clientId);
      addReminder({
        text: `Гарантия по талону ${newWarranty.number} для клиента ${client?.name || 'неизвестного'} истекает через месяц`,
        date: reminderDate.toISOString().split('T')[0],
        time: '10:00',
        priority: 'medium',
        relatedClientId: formData.clientId,
      });

      setToast({ message: 'Гарантийный талон создан', type: 'success' });
      
      setTimeout(() => {
        navigate(`/documents/warranties/${newWarranty.id}`);
      }, 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при создании талона', type: 'error' });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const client = formData.clientId ? getClient(formData.clientId) : null;

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
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Новый гарантийный талон</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Создание гарантийного талона на выполненные работы
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
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

          {/* Issue Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Дата выдачи <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => handleChange('issueDate', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.issueDate ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.issueDate && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.issueDate}</p>}
          </div>

          {/* Warranty Months */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Срок гарантии (месяцев) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.warrantyMonths}
              onChange={(e) => handleChange('warrantyMonths', Number(e.target.value))}
              min="1"
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.warrantyMonths ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.warrantyMonths && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.warrantyMonths}</p>}
          </div>

          {/* Expiry Date */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Дата окончания гарантии:</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              {new Date(expiryDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Work Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание выполненных работ <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.workDescription}
              onChange={(e) => handleChange('workDescription', e.target.value)}
              rows={4}
              placeholder="Замена смесителя в ванной комнате с гарантией на работы и материалы..."
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                errors.workDescription ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.workDescription && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.workDescription}</p>}
          </div>

          {/* Reminder info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ℹ️ Автоматически будет создано напоминание за месяц до окончания гарантии
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Создать талон
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
