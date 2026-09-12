import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Trash2 } from 'lucide-react';
import { useEstimates } from '../hooks/useEstimates';
import { useClients } from '../../clients/hooks/useClients';
import { EstimateStatus, ESTIMATE_STATUS_NAMES, ESTIMATE_STATUS_COLORS } from '../types';
import { formatDateShort, formatCurrency } from '../utils/formatters';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';

export function EstimateList() {
  const { estimates, deleteEstimate, search, getByStatus } = useEstimates();
  const { getClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | 'all'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [estimateToDelete, setEstimateToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredEstimates = (() => {
    let items = searchQuery ? search(searchQuery) : estimates;
    if (statusFilter !== 'all') {
      items = items.filter(e => e.status === statusFilter);
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  })();

  const handleDelete = (id: string) => {
    setEstimateToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (estimateToDelete) {
      deleteEstimate(estimateToDelete);
      setToast({ message: 'Смета удалена', type: 'success' });
      setShowDeleteModal(false);
      setEstimateToDelete(null);
    }
  };

  const statuses: Array<EstimateStatus | 'all'> = ['all', 'draft', 'sent', 'accepted', 'declined'];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Сметы</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {estimates.length} смет
            </p>
          </div>
        </div>
        <Link
          to="/finance/estimates/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Новая смета</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру или адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'all' ? 'Все' : ESTIMATE_STATUS_NAMES[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Estimates list */}
      {filteredEstimates.length > 0 ? (
        <div className="space-y-3">
          {filteredEstimates.map((estimate) => {
            const client = getClient(estimate.clientId);
            const statusColor = ESTIMATE_STATUS_COLORS[estimate.status];

            return (
              <div
                key={estimate.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        to={`/finance/estimates/${estimate.id}`}
                        className="text-lg font-bold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {estimate.number}
                      </Link>
                      <span className={`text-xs px-2 py-0.5 rounded bg-${statusColor}-100 dark:bg-${statusColor}-900/30 text-${statusColor}-700 dark:text-${statusColor}-300`}>
                        {ESTIMATE_STATUS_NAMES[estimate.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {client?.name || 'Клиент не найден'} • {estimate.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(estimate.total)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateShort(estimate.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-4 text-gray-500 dark:text-gray-400">
                    <span>Работы: {formatCurrency(estimate.totalWork)}</span>
                    <span>Материалы: {formatCurrency(estimate.totalMaterials)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/finance/estimates/${estimate.id}/preview`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
                    >
                      Печать
                    </Link>
                    <button
                      onClick={() => handleDelete(estimate.id)}
                      className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-xs font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Сметы не найдены
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте первую смету'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              to="/finance/estimates/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать смету
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить смету?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить эту смету? Это действие нельзя отменить.
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
