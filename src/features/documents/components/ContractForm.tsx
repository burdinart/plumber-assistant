import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FileText, Save, X, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { useClients } from '../../clients/hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { Contract } from '../types';
import { EstimateItem } from '../../finance/types';
import { getTodayDate, getDateAfterDays } from '../../finance/utils/formatters';
import { Toast } from '../../../shared/ui/Toast';

export function ContractForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createContract } = useDocuments();
  const { clients, getClient } = useClients();
  const { getOrder } = useOrders();

  const orderId = searchParams.get('orderId');
  const clientId = searchParams.get('clientId');
  const order = orderId ? getOrder(orderId) : undefined;
  const preselectedClient = clientId ? getClient(clientId) : undefined;

  const [formData, setFormData] = useState({
    clientId: preselectedClient?.id || order?.clientId || '',
    orderId: orderId || '',
    startDate: getTodayDate(),
    endDate: getDateAfterDays(14),
    cost: 0,
    paymentTerms: '100% по факту выполнения работ',
    warrantyTerms: 'Гарантия на выполненные работы — 12 месяцев',
    additionalTerms: '',
    items: [] as EstimateItem[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Автозаполнение из заявки
  useEffect(() => {
    if (order) {
      setFormData(prev => ({
        ...prev,
        clientId: order.clientId,
        additionalTerms: order.description || '',
      }));
    }
  }, [order]);

  // Пересчёт стоимости при изменении items
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    if (total > 0) {
      setFormData(prev => ({ ...prev, cost: total }));
    }
  }, [formData.items]);

  // Добавление новой работы
  const addItem = () => {
    const newItem: EstimateItem = {
      id: `item-${Date.now()}`,
      name: '',
      unit: 'шт',
      quantity: 1,
      price: 0,
      type: 'work',
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Удаление работы
  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  // Обновление работы
  const updateItem = (itemId: string, field: keyof EstimateItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

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
            <select
              value={formData.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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

          {/* Items table */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Работы и материалы
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </button>
            </div>

            {formData.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">Наименование</th>
                      <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">Тип</th>
                      <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">Кол-во</th>
                      <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">Цена</th>
                      <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-400 font-medium">Сумма</th>
                      <th className="py-2 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            placeholder="Название работы"
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={item.type}
                            onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                          >
                            <option value="work">Работа</option>
                            <option value="material">Материал</option>
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            min="0.1"

                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                            min="0"

                            className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm text-center"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-medium text-gray-800 dark:text-white">
                          {(item.quantity * item.price).toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="py-2 px-2">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Нет добавленных работ</p>
                <p className="text-sm mt-1">Нажмите "Добавить" для добавления работы</p>
              </div>
            )}

            {/* Total */}
            {formData.items.length > 0 && (
              <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Итого:</span>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            )}
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
