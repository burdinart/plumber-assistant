import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FileText, Save, X, ArrowLeft } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { Contract } from '../types';
import { getTodayDate, getDateAfterDays } from '../../finance/utils/formatters';
import { Toast } from '../../../shared/ui/Toast';

export function ContractForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createContract } = useDocuments();
  const { getClient } = useClients();

  const orderId = searchParams.get('orderId');
  const clientId = searchParams.get('clientId');
  const preselectedClient = clientId ? getClient(clientId) : undefined;

  const [formData, setFormData] = useState({
    clientId: preselectedClient?.id || '',
    orderId: orderId || '',
    startDate: getTodayDate(),
    endDate: getDateAfterDays(14),
    cost: 0,
    paymentTerms: '100% по факту выполнения работ',
    warrantyTerms: 'Гарантия на выполненные работы — 12 месяцев',
    additionalTerms: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Укажите дату начала';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Укажите дату окончания';
    }

    if (formData.cost <= 0) {
      newErrors.cost = 'Стоимость должна быть больше 0';
    }

    if (!formData.paymentTerms.trim()) {
      newErrors.paymentTerms = 'Укажите условия оплаты';
    }

    if (!formData.warrantyTerms.trim()) {
      newErrors.warrantyTerms = 'Укажите гарантийные условия';
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
      const contractData: Omit<Contract, 'id' | 'number' | 'createdAt' | 'type'> = {
        clientId: formData.clientId,
        orderId: formData.orderId || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        cost: formData.cost,
        paymentTerms: formData.paymentTerms,
        warrantyTerms: formData.warrantyTerms,
        additionalTerms: formData.additionalTerms || undefined,
      };

      const newContract = createContract(contractData);
      setToast({ message: 'Договор создан', type: 'success' });
      
      setTimeout(() => {
        navigate(`/documents/contracts/${newContract.id}`);
      }, 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при создании договора', type: 'error' });
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
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Новый договор</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Создание договора на выполнение работ
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

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Дата начала <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.startDate && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Дата окончания <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.endDate && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Стоимость работ (₽) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => handleChange('cost', Number(e.target.value))}
              min="0"
              step="100"
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.cost ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.cost && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.cost}</p>}
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Условия оплаты <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.paymentTerms}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
              rows={2}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.paymentTerms ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.paymentTerms && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.paymentTerms}</p>}
          </div>

          {/* Warranty Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Гарантийные обязательства <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.warrantyTerms}
              onChange={(e) => handleChange('warrantyTerms', e.target.value)}
              rows={2}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.warrantyTerms ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.warrantyTerms && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.warrantyTerms}</p>}
          </div>

          {/* Additional Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Дополнительные условия (опционально)
            </label>
            <textarea
              value={formData.additionalTerms}
              onChange={(e) => handleChange('additionalTerms', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Создать договор
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
