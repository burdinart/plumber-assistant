import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Save, Plus, Trash2, X } from 'lucide-react';
import { useEstimates } from '../hooks/useEstimates';
import { usePriceList } from '../hooks/usePriceList';
import { useClients } from '../../clients/hooks/useClients';
import { Estimate, EstimateItem, EstimateItemType } from '../types';
import { formatCurrency, getTodayDate, getDateAfterDays } from '../utils/formatters';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';

export function EstimateForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEstimate, createEstimate, updateEstimate } = useEstimates();
  const { priceList } = usePriceList();
  const { clients } = useClients();

  const isEditing = Boolean(id);
  const existingEstimate = id ? getEstimate(id) : undefined;

  const [formData, setFormData] = useState({
    clientId: '',
    address: '',
    validUntil: getDateAfterDays(14),
    items: [] as EstimateItem[],
    discount: 0,
    discountType: 'percent' as 'percent' | 'fixed',
    notes: '',
    status: 'draft' as 'draft' | 'sent' | 'accepted' | 'declined',
  });

  const [showPriceListModal, setShowPriceListModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isEditing && existingEstimate) {
      setFormData({
        clientId: existingEstimate.clientId,
        address: existingEstimate.address,
        validUntil: existingEstimate.validUntil,
        items: existingEstimate.items,
        discount: existingEstimate.discount,
        discountType: existingEstimate.discountType,
        notes: existingEstimate.notes || '',
        status: existingEstimate.status,
      });
    }
  }, [isEditing, existingEstimate]);

  // Автозаполнение адреса при выборе клиента
  useEffect(() => {
    if (formData.clientId && !isEditing) {
      const client = clients.find(c => c.id === formData.clientId);
      if (client) {
        setFormData(prev => ({ ...prev, address: client.address }));
      }
    }
  }, [formData.clientId, isEditing]);

  // Расчёт итогов
  const totalWork = formData.items
    .filter(item => item.type === 'work')
    .reduce((sum, item) => sum + item.quantity * item.price, 0);

  const totalMaterials = formData.items
    .filter(item => item.type === 'material')
    .reduce((sum, item) => sum + item.quantity * item.price, 0);

  const subtotal = totalWork + totalMaterials;
  const discountAmount = formData.discountType === 'percent'
    ? (subtotal * formData.discount) / 100
    : formData.discount;
  const total = Math.max(0, subtotal - discountAmount);

  const addItem = (item: EstimateItem) => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item],
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const updateItem = (itemId: string, field: keyof EstimateItem, value: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addFromPriceList = (priceItem: typeof priceList[0]) => {
    const newItem: EstimateItem = {
      id: `item-${Date.now()}`,
      name: priceItem.name,
      unit: priceItem.unit,
      quantity: 1,
      price: priceItem.price,
      type: 'work',
    };
    addItem(newItem);
    setShowPriceListModal(false);
  };

  const addManualItem = () => {
    const newItem: EstimateItem = {
      id: `item-${Date.now()}`,
      name: 'Новая позиция',
      unit: 'шт',
      quantity: 1,
      price: 0,
      type: 'work',
    };
    addItem(newItem);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Выберите клиента';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Укажите адрес';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Добавьте хотя бы одну позицию';
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
      if (isEditing && id) {
        updateEstimate(id, formData);
        setToast({ message: 'Смета обновлена', type: 'success' });
      } else {
        createEstimate(formData);
        setToast({ message: 'Смета создана', type: 'success' });
      }

      setTimeout(() => navigate('/finance/estimates'), 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при сохранении', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? `Смета ${existingEstimate?.number}` : 'Новая смета'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Редактирование сметы' : 'Создание новой сметы'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Основная информация
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Клиент */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Клиент <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
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

            {/* Срок действия */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Срок действия
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Адрес */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Адрес объекта <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="г. Москва, ул. Ленина, д. 1, кв. 10"
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.address ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.address && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* Позиции сметы */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Позиции сметы
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPriceListModal(true)}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Из прайса
              </button>
              <button
                type="button"
                onClick={addManualItem}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Вручную
              </button>
            </div>
          </div>

          {errors.items && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errors.items}</p>}

          {formData.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-300 font-medium">Наименование</th>
                    <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-300 font-medium">Тип</th>
                    <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-300 font-medium">Кол-во</th>
                    <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-300 font-medium">Цена</th>
                    <th className="text-right py-2 px-2 text-gray-600 dark:text-gray-300 font-medium">Сумма</th>
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
                          onChange={(e) => updateItem(item.id, 'name' as any, e.target.value as any)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={item.type}
                          onChange={(e) => updateItem(item.id, 'type' as any, e.target.value as any)}
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
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm text-center"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm text-center"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-medium text-gray-800 dark:text-white">
                        {formatCurrency(item.quantity * item.price)}
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
              <p>Добавьте позиции из прайс-листа или вручную</p>
            </div>
          )}
        </div>

        {/* Итоги */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Итоги
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Работы:</span>
              <span className="font-medium text-gray-800 dark:text-white">{formatCurrency(totalWork)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Материалы:</span>
              <span className="font-medium text-gray-800 dark:text-white">{formatCurrency(totalMaterials)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">Подытог:</span>
              <span className="font-medium text-gray-800 dark:text-white">{formatCurrency(subtotal)}</span>
            </div>

            {/* Скидка */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Скидка</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Тип скидки</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                >
                  <option value="percent">Процент (%)</option>
                  <option value="fixed">Фиксированная (₽)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Скидка:</span>
              <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(discountAmount)}</span>
            </div>

            <div className="flex justify-between pt-3 border-t-2 border-gray-300 dark:border-gray-600">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">Итого к оплате:</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Примечания */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Примечания
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Условия оплаты, гарантии, дополнительные условия..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Кнопки */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Сохранить' : 'Создать смету'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/finance/estimates')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Модальное окно выбора из прайс-листа */}
      <Modal
        isOpen={showPriceListModal}
        onClose={() => setShowPriceListModal(false)}
        title="Выберите работу из прайс-листа"
      >
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {priceList.map(item => (
            <button
              key={item.id}
              onClick={() => addFromPriceList(item)}
              className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400">{formatCurrency(item.price)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">за {item.unit}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
