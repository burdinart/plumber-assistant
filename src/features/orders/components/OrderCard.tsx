import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ClipboardList, Edit, Trash2, ArrowLeft, User, MapPin, Calendar, Clock, FileText, DollarSign, FileCheck } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useClients } from '../../clients/hooks/useClients';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';
import { formatDate, formatCurrency, getOrderStatusText, getOrderStatusColor, getOrderTypeText } from '../../../shared/utils/helpers';
import { OrderStatus } from '../../../shared/types';

export function OrderCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrder, deleteOrder, updateOrderStatus } = useOrders();
  const { getClient } = useClients();

  const order = id ? getOrder(id) : undefined;
  const client = order ? getClient(order.clientId) : undefined;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleCreateAct = () => {
    // Переход к созданию акта с предзаполненными данными
    const actData = {
      orderId: order?.id,
      clientId: order?.clientId,
      workCost: order?.workCost || 0,
      materialsCost: order?.materialsCost || 0,
      total: order?.total || 0,
      description: order?.description || '',
    };
    // Сохраняем данные в sessionStorage для передачи в редактор
    sessionStorage.setItem('actFromOrder', JSON.stringify(actData));
    navigate('/documents/new?type=act&orderId=' + order?.id);
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Заявка не найдена
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Возможно, заявка была удалена
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (id) {
      deleteOrder(id);
      setToast({ message: 'Заявка удалена', type: 'success' });
      setTimeout(() => navigate('/orders'), 1000);
    }
  };

  const handleStatusChange = (status: OrderStatus) => {
    if (id) {
      updateOrderStatus(id, status);
      setToast({ message: `Статус изменён на "${getOrderStatusText(status)}"`, type: 'success' });
    }
  };

  const statuses: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'new', label: 'Новая', color: 'blue' },
    { value: 'in_progress', label: 'В работе', color: 'amber' },
    { value: 'completed', label: 'Завершена', color: 'green' },
    { value: 'paid', label: 'Оплачена', color: 'emerald' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к списку
      </Link>

      {/* Order info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {getOrderTypeText(order.type)}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Создана {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-lg text-sm font-medium bg-${getOrderStatusColor(
              order.status
            )}-100 dark:bg-${getOrderStatusColor(order.status)}-900/30 text-${getOrderStatusColor(
              order.status
            )}-700 dark:text-${getOrderStatusColor(order.status)}-300`}
          >
            {getOrderStatusText(order.status)}
          </span>
        </div>

        {/* Status buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Изменить статус:
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                disabled={order.status === status.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  order.status === status.value
                    ? `bg-${status.color}-600 text-white cursor-not-allowed`
                    : `bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-700 dark:text-${status.color}-300 hover:bg-${status.color}-200 dark:hover:bg-${status.color}-900/50`
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {client && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Клиент</div>
                <Link
                  to={`/clients/${client.id}`}
                  className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {client.name}
                </Link>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Адрес</div>
              <div className="text-gray-800 dark:text-white">{order.address}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Дата</div>
              <div className="text-gray-800 dark:text-white">{formatDate(order.date)}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Время</div>
              <div className="text-gray-800 dark:text-white">{order.time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Описание</div>
              <div className="text-gray-800 dark:text-white">{order.description}</div>
            </div>
          </div>
        </div>

        {/* Costs */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Стоимость работ:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(order.workCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Стоимость материалов:</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(order.materialsCost)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-700 dark:text-gray-200">Итого:</span>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/orders/${order.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Редактировать
          </Link>
          <button
            onClick={handleCreateAct}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            Создать акт
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить заявку?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить заявку <strong>{getOrderTypeText(order.type)}</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Это действие нельзя отменить.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
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
