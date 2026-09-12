import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FileText, Save, X, ArrowLeft } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { useEstimates } from '../../finance/hooks/useEstimates';
import { Act } from '../types';
import { getTodayDate } from '../../finance/utils/formatters';
import { Toast } from '../../../shared/ui/Toast';

export function ActForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createAct } = useDocuments();
  const { getClient } = useClients();
  const { getEstimate } = useEstimates();

  const estimateId = searchParams.get('estimateId');
  const orderId = searchParams.get('orderId');
  const clientId = searchParams.get('clientId');

  const estimate = estimateId ? getEstimate(estimateId) : undefined;
  const preselectedClient = clientId ? getClient(clientId) : undefined;

  const [formData, setFormData] = useState({
    clientId: preselectedClient?.id || estimate?.clientId || '',
    orderId: orderId || '',
    estimateId: estimateId || '',
    completionDate: getTodayDate(),
    performerSignature: '',
    customerSignature: '',
    complaints: '',
    items: estimate?.items || [],
    totalWork: estimate?.totalWork || 0,
    totalMaterials: estimate?.totalMaterials || 0,
    total: estimate?.total || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Автозаполнение из сметы
  useEffect(() => {
    if (estimate) {
      setFormData(prev => ({
        ...prev,
        clientId: estimate.clientId,
        items: estimate.items,
        totalWork: estimate.totalWork,
        totalMaterials: estimate.totalMaterials,
        total: estimate.total,
      }));
    }
  }, [estimate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }

    if (!formData.completionDate) {
      newErrors.completionDate = 'Укажите дату выполнения';
    }

    if (!formData.performerSignature.trim()) {
      newErrors.performerSignature = 'Укажите подпись исполнителя';
    }

    if (!formData.customerSignature.trim()) {
      newErrors.customerSignature = 'Укажите подпись заказчика';
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
      const actData: Omit<Act, 'id' | 'number' | 'createdAt' | 'type'> = {
        clientId: formData.clientId,
        orderId: formData.orderId || undefined,
        estimateId: formData.estimateId || undefined,
        completionDate: formData.completionDate,
        performerSignature: formData.performerSignature,
        customerSignature: formData.customerSignature,
        complaints: formData.complaints || undefined,
        items: formData.items,
        totalWork: formData.totalWork,
        totalMaterials: formData.totalMaterials,
        total: formData.total,
      };

      const newAct = createAct(actData);
      setToast({ message: 'Акт создан', type: 'success' });
      
      setTimeout(() => {
        navigate(`/documents/acts/${newAct.id}`);
      }, 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при создании акта', type: 'error' });
    }
  };

  const handleChange = (field: string, value: string) => {
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
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Новый акт</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {estimate ? `Создание акта на основе сметы ${estimate.number}` : 'Создание акта выполненных работ'}
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

          {/* Completion Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Дата выполнения работ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.completionDate}
              onChange={(e) => handleChange('completionDate', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.completionDate ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.completionDate && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.completionDate}</p>}
          </div>

          {/* Performer Signature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Подпись исполнителя (ФИО) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.performerSignature}
              onChange={(e) => handleChange('performerSignature', e.target.value)}
              placeholder="Иванов И.И."
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.performerSignature ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.performerSignature && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.performerSignature}</p>}
          </div>

          {/* Customer Signature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Подпись заказчика (ФИО) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerSignature}
              onChange={(e) => handleChange('customerSignature', e.target.value)}
              placeholder="Петров П.П."
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.customerSignature ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.customerSignature && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.customerSignature}</p>}
          </div>

          {/* Complaints */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Претензии и замечания (опционально)
            </label>
            <textarea
              value={formData.complaints}
              onChange={(e) => handleChange('complaints', e.target.value)}
              placeholder="Претензий нет"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Items summary */}
          {formData.items.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Работы и материалы ({formData.items.length} позиций)
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Работы:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{formData.totalWork.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Материалы:</span>
                  <span className="font-medium text-gray-800 dark:text-white">{formData.totalMaterials.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Итого:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{formData.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Создать акт
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
