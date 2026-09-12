import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Save, X } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useClients } from '../../clients/hooks/useClients';
import { Transaction, TransactionType, TransactionCategory, INCOME_CATEGORY_NAMES, EXPENSE_CATEGORY_NAMES, TRANSACTION_CATEGORY_NAMES } from '../types';
import { getTodayDate } from '../utils/formatters';
import { Toast } from '../../../shared/ui/Toast';

export function TransactionForm() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const { clients } = useClients();

  const [formData, setFormData] = useState({
    type: 'income' as TransactionType,
    amount: 0,
    date: getTodayDate(),
    category: 'private_client' as TransactionCategory,
    description: '',
    clientId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // При смене типа транзакции — меняем категорию по умолчанию
  useEffect(() => {
    if (formData.type === 'income') {
      setFormData(prev => ({ ...prev, category: 'private_client' }));
    } else {
      setFormData(prev => ({ ...prev, category: 'materials' }));
    }
  }, [formData.type]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
    }

    if (!formData.date) {
      newErrors.date = 'Укажите дату';
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
      addTransaction({
        type: formData.type,
        amount: formData.amount,
        date: formData.date,
        category: formData.category,
        description: formData.description,
        clientId: formData.clientId || undefined,
      });
      setToast({ message: 'Транзакция добавлена', type: 'success' });
      setTimeout(() => navigate('/finance/transactions'), 1000);
    } catch (error) {
      setToast({ message: 'Ошибка при сохранении', type: 'error' });
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

  const categories = formData.type === 'income'
    ? Object.entries(INCOME_CATEGORY_NAMES)
    : Object.entries(EXPENSE_CATEGORY_NAMES);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Новая транзакция</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Добавить доход или расход
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          {/* Тип транзакции */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тип
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('type', 'income')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ↑ Доход
              </button>
              <button
                type="button"
                onClick={() => handleChange('type', 'expense')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ↓ Расход
              </button>
            </div>
          </div>

          {/* Сумма */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Сумма (₽) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', Number(e.target.value))}
              min="0"
              step="100"
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.amount ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.amount && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.amount}</p>}
          </div>

          {/* Дата */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Дата <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                errors.date ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.date && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.date}</p>}
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {categories.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Комментарий к транзакции"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Клиент (только для доходов) */}
          {formData.type === 'income' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Клиент (опционально)
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Не указан</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Добавить
          </button>
          <button
            type="button"
            onClick={() => navigate('/finance/transactions')}
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
