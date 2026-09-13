import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Plus, Search, TrendingUp, TrendingDown, Trash2, User, Building2 } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useClients } from '../../clients/hooks/useClients';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TRANSACTION_CATEGORY_NAMES } from '../types';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';

export function Transactions() {
  const { transactions, deleteTransaction, search, getBalance } = useTransactions();
  const { clients } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Текущий месяц
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const balance = getBalance(startDate, endDate);

  const filteredTransactions = (() => {
    let items = searchQuery ? search(searchQuery) : transactions;
    if (typeFilter !== 'all') {
      items = items.filter(t => t.type === typeFilter);
    }
    if (clientFilter !== 'all') {
      items = items.filter(t => t.clientId === clientFilter);
    }
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setToast({ message: 'Транзакция удалена', type: 'success' });
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    }
  };

  // Получаем информацию о клиенте для транзакции
  const getClientInfo = (transaction: typeof transactions[0]) => {
    if (transaction.clientId) {
      const client = clients.find(c => c.id === transaction.clientId);
      if (client) {
        return {
          name: client.name,
          type: client.type,
          id: client.id,
        };
      }
    }
    // Fallback на денормализованные данные
    if (transaction.clientName) {
      return {
        name: transaction.clientName,
        type: transaction.clientType || 'individual',
        id: transaction.clientId,
      };
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Транзакции</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Учёт доходов и расходов
            </p>
          </div>
        </div>
        <Link
          to="/finance/transactions/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Добавить</span>
        </Link>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Доходы (месяц)</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(balance.income)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Расходы (месяц)</span>
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(balance.expense)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Баланс (месяц)</span>
          </div>
          <div className={`text-2xl font-bold ${balance.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(balance.balance)}
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Доходы
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Расходы
          </button>
        </div>
      </div>

      {/* Client filter */}
      <div className="mb-6">
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Все клиенты</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.type === 'legal' ? '🏢' : '👤'} {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions list */}
      {filteredTransactions.length > 0 ? (
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => {
            const clientInfo = getClientInfo(transaction);
            
            return (
              <div
                key={transaction.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 dark:text-white">
                        {transaction.description || TRANSACTION_CATEGORY_NAMES[transaction.category]}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)} • {TRANSACTION_CATEGORY_NAMES[transaction.category]}
                      </div>
                      {clientInfo && (
                        <Link
                          to={`/clients/${clientInfo.id}`}
                          className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline mt-1"
                        >
                          {clientInfo.type === 'legal' ? (
                            <Building2 className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {clientInfo.name}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-bold ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Транзакции не найдены
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || typeFilter !== 'all' || clientFilter !== 'all'
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте первую транзакцию'}
          </p>
          {!searchQuery && typeFilter === 'all' && clientFilter === 'all' && (
            <Link
              to="/finance/transactions/new"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить транзакцию
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить транзакцию?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить эту транзакцию?
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
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
