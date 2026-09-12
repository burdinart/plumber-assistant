import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Wallet, Save, X, User, Building2 } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useClients } from '../../clients/hooks/useClients';
import { Transaction, TransactionType, TransactionCategory, INCOME_CATEGORY_NAMES, EXPENSE_CATEGORY_NAMES } from '../types';
import { getTodayDate } from '../utils/formatters';
import { Toast } from '../../../shared/ui/Toast';

export function TransactionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addTransaction } = useTransactions();
  const { clients } = useClients();

  const preselectedClientId = searchParams.get('clientId') || '';

  const [formData, setFormData] = useState({
    type: 'income' as TransactionType,
    amount: 0,
    date: getTodayDate(),
    category: 'private_client' as TransactionCategory,
    description: '',
    clientId: preselectedClientId,
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

  // Автозаполнение при выборе клиента
  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
    
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        // Автоматически выбираем категорию на основе типа клиента
        if (formData.type === 'income') {
          if (client.type === 'legal') {
            setFormData(prev => ({ ...prev, category: 'legal_entity' }));
          } else {
            setFormData(prev => ({ ...prev, category: 'private_client' }));
          }
        }
      }
    }
  };

  const selectedClient = formData.clientId ? clients.find(c => c.id === formData.clientId) : null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Проверка суммы
    if (!formData.amount || formData.amount <= 0 || isNaN(formData.amount)) {
      newErrors.amount = 'Сумма должна быть больше 0';
    }

    // Проверка даты
    if (!formData.date) {
      newErrors.date = 'Укажите дату';
    }

    setErrors(newErrors);
    
    // Если есть ошибки, показываем toast
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting transaction:', formData);

    if (!validate()) {
      console.log('Validation failed:', errors);
      setToast({ message: 'Заполните обязательные поля', type: 'error' });
      return;
    }

    try {
      const transactionData: Omit<Transaction, 'id' | 'createdAt'> = {
        type: formData.type,
        amount: formData.amount,
        date: formData.date,
        category: formData.category,
        description: formData.description && formData.description.trim() !== '' ? formData.description : undefined,
        clientId: formData.clientId && formData.clientId.trim() !== '' ? formData.clientId : undefined,
      };

      // Добавляем информацию о клиенте для денормализации
      if (selectedClient) {
        transactionData.clientName = selectedClient.name;
        transactionData.clientType = selectedClient.type;
      }

      console.log('Transaction data:', transactionData);

      const result = addTransaction(transactionData);
      console.log('Transaction added:', result);
      
      setToast({ message: 'Транзакция успешно добавлена!', type: 'success' });
      
      // Увеличиваем задержку для лучшей видимости toast
      setTimeout(() => {
        navigate('/finance/transactions');
      }, 2000);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setToast({ message: 'Ошибка при сохранении транзакции', type: 'error' });
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

          {/* Клиент (только для доходов) */}
          {formData.type === 'income' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Клиент
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Не указан</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.type === 'legal' ? '🏢' : '👤'} {client.name}
                  </option>
                ))}
              </select>
              
              {/* Подсказка для юрлиц */}
              {selectedClient && selectedClient.type === 'legal' && (
                <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Для юрлица рекомендуется создать акт выполненных работ
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

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
