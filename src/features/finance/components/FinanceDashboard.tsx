import { Link } from 'react-router-dom';
import { DollarSign, FileText, Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useEstimates } from '../hooks/useEstimates';
import { useOrders } from '../../orders/hooks/useOrders';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TRANSACTION_CATEGORY_NAMES } from '../types';

export function FinanceDashboard() {
  const { getBalance, getRecent } = useTransactions();
  const { estimates } = useEstimates();
  const { orders } = useOrders();

  // Текущий месяц
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const balance = getBalance(startDate, endDate);

  // Активные сметы (отправленные или принятые)
  const activeEstimates = estimates.filter(e => e.status === 'sent' || e.status === 'accepted');

  // Неоплаченные заявки
  const unpaidOrders = orders.filter(o => o.status !== 'paid');

  // Последние транзакции
  const recentTransactions = getRecent(5);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Финансы</h1>
        <p className="text-gray-600 dark:text-gray-400">Управление финансами и аналитика</p>
      </div>

      {/* Main balance */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-sm mb-1">Баланс за текущий месяц</p>
            <p className="text-4xl font-bold">{formatCurrency(balance.balance)}</p>
          </div>
          <Wallet className="w-12 h-12 text-emerald-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm text-emerald-100">Доходы</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(balance.income)}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm text-emerald-100">Расходы</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(balance.expense)}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/finance/estimates/new"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Новая смета</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Создать смету</p>
            </div>
          </div>
        </Link>

        <Link
          to="/finance/transactions/new?type=income"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Добавить доход</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Зафиксировать оплату</p>
            </div>
          </div>
        </Link>

        <Link
          to="/finance/transactions/new?type=expense"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Добавить расход</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Записать расход</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">Активные сметы</h3>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {activeEstimates.length}
            </span>
          </div>
          <Link to="/finance/estimates" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Посмотреть все →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">Неоплаченные заявки</h3>
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {unpaidOrders.length}
            </span>
          </div>
          <Link to="/orders" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
            Посмотреть все →
          </Link>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Последние транзакции
          </h2>
          <Link to="/finance/transactions" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
            Все транзакции →
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {transaction.description || TRANSACTION_CATEGORY_NAMES[transaction.category]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${
                  transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Нет транзакций</p>
            <Link to="/finance/transactions/new" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline mt-2 inline-block">
              Добавить первую транзакцию →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
