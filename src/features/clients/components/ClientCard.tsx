import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, Mail, FileText, Star, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';
import { formatPhone, formatDate, formatCurrency, getOrderStatusText, getOrderStatusColor, getOrderTypeText } from '../../../shared/utils/helpers';

export function ClientCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClient, deleteClient, toggleFavorite } = useClients();
  const { getOrdersByClient } = useOrders();

  const client = id ? getClient(id) : undefined;
  const clientOrders = id ? getOrdersByClient(id) : [];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Клиент не найден
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Возможно, клиент был удалён
          </p>
          <Link
            to="/clients"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
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
      deleteClient(id);
      setToast({ message: 'Клиент удалён', type: 'success' });
      setTimeout(() => navigate('/clients'), 1000);
    }
  };

  const sortedOrders = [...clientOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/clients"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к списку
      </Link>

      {/* Client info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{client.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Клиент с {formatDate(client.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleFavorite(client.id)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Star
              className={`w-6 h-6 ${
                client.isFavorite ? 'text-amber-500 fill-current' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Телефон</div>
              <a href={`tel:${client.phone}`} className="text-gray-800 dark:text-white hover:text-violet-600 dark:hover:text-violet-400">
                {formatPhone(client.phone)}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Адрес</div>
              <div className="text-gray-800 dark:text-white">{client.address}</div>
            </div>
          </div>

          {client.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                <a href={`mailto:${client.email}`} className="text-gray-800 dark:text-white hover:text-violet-600 dark:hover:text-violet-400">
                  {client.email}
                </a>
              </div>
            </div>
          )}

          {client.notes && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Заметки</div>
                <div className="text-gray-800 dark:text-white">{client.notes}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            to={`/clients/${client.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Редактировать
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        </div>
      </div>

      {/* Orders history */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            История заявок ({clientOrders.length})
          </h2>
          <Link
            to={`/orders/new?clientId=${client.id}`}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Новая заявка
          </Link>
        </div>

        {sortedOrders.length > 0 ? (
          <div className="space-y-3">
            {sortedOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-violet-300 dark:hover:border-violet-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {getOrderTypeText(order.type)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.date)} в {order.time}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium bg-${getOrderStatusColor(
                      order.status
                    )}-100 dark:bg-${getOrderStatusColor(order.status)}-900/30 text-${getOrderStatusColor(
                      order.status
                    )}-700 dark:text-${getOrderStatusColor(order.status)}-300`}
                  >
                    {getOrderStatusText(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{order.description}</p>
                <div className="text-sm font-semibold text-gray-800 dark:text-white">
                  {formatCurrency(order.total)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>У клиента пока нет заявок</p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить клиента?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить клиента <strong>{client.name}</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Это действие нельзя отменить. Все связанные заявки останутся в системе.
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
