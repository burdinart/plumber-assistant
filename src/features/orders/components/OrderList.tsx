import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Search, Filter } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useClients } from '../../clients/hooks/useClients';
import { formatDate, formatCurrency, getOrderStatusText, getOrderStatusColor, getOrderTypeText } from '../../../shared/utils/helpers';
import { OrderStatus } from '../../../shared/types';

export function OrderList() {
  const { orders, searchOrders, getOrdersByStatus } = useOrders();
  const { getClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = (statusFilter === 'all' ? orders : getOrdersByStatus(statusFilter))
    .filter((order) => {
      if (!searchQuery.trim()) return true;
      const client = getClient(order.clientId);
      const clientName = client?.name || '';
      return (
        order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const statusCounts = {
    all: orders.length,
    new: getOrdersByStatus('new').length,
    in_progress: getOrdersByStatus('in_progress').length,
    completed: getOrdersByStatus('completed').length,
    paid: getOrdersByStatus('paid').length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Заявки</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {orders.length} {orders.length === 1 ? 'заявка' : 'заявок'}
            </p>
          </div>
        </div>
        <Link
          to="/orders/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Новая заявка</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по клиенту, адресу или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Все ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Новые ({statusCounts.new})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'in_progress'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            В работе ({statusCounts.in_progress})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Завершённые ({statusCounts.completed})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            Оплаченные ({statusCounts.paid})
          </button>
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const client = getClient(order.clientId);
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {getOrderTypeText(order.type)}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium bg-${getOrderStatusColor(
                          order.status
                        )}-100 dark:bg-${getOrderStatusColor(order.status)}-900/30 text-${getOrderStatusColor(
                          order.status
                        )}-700 dark:text-${getOrderStatusColor(order.status)}-300`}
                      >
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>{client?.name || 'Клиент не найден'}</span>
                    <span>{formatDate(order.date)} в {order.time}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Заявки не найдены
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте первую заявку'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              to="/orders/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать заявку
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
