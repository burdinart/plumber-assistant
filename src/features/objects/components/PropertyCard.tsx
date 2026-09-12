import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Edit, Trash2, Home, Bath, BedDouble, Plus } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useClients } from '../../clients/hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { OBJECT_TYPE_NAMES, OBJECT_TYPE_ICONS } from '../types';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusColor, getOrderTypeText } from '../../../shared/utils/helpers';

export function PropertyCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProperty, deleteProperty } = useProperties();
  const { getClient } = useClients();
  const { orders } = useOrders();

  const property = id ? getProperty(id) : undefined;
  const client = property ? getClient(property.clientId) : undefined;
  const propertyOrders = id ? orders.filter(o => o.propertyId === id) : [];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Home className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Объект не найден
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Возможно, объект был удалён
          </p>
          <Link
            to="/objects"
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
      deleteProperty(id);
      setToast({ message: 'Объект удалён', type: 'success' });
      setTimeout(() => navigate('/objects'), 1000);
    }
  };

  const sortedOrders = [...propertyOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/objects"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к списку
      </Link>

      {/* Property info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{OBJECT_TYPE_ICONS[property.type]}</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{property.name}</h1>
                <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded">
                  {OBJECT_TYPE_NAMES[property.type]}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Создан {formatDate(property.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Адрес</div>
              <div className="text-gray-800 dark:text-white">{property.address}</div>
            </div>
          </div>

          {client && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Владелец</div>
                <Link
                  to={`/clients/${client.id}`}
                  className="text-gray-800 dark:text-white hover:text-violet-600 dark:hover:text-violet-400"
                >
                  {client.name}
                </Link>
              </div>
            </div>
          )}

          {property.area && (
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Площадь</div>
                <div className="text-gray-800 dark:text-white">{property.area} м²</div>
              </div>
            </div>
          )}

          {property.bathrooms && (
            <div className="flex items-start gap-3">
              <Bath className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Санузлы</div>
                <div className="text-gray-800 dark:text-white">{property.bathrooms}</div>
              </div>
            </div>
          )}

          {property.bedrooms && (
            <div className="flex items-start gap-3">
              <BedDouble className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Комнаты</div>
                <div className="text-gray-800 dark:text-white">{property.bedrooms}</div>
              </div>
            </div>
          )}

          {property.notes && (
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5">📝</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Заметки</div>
                <div className="text-gray-800 dark:text-white">{property.notes}</div>
              </div>
            </div>
          )}

          {property.accessInfo && (
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5">🔑</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Информация о доступе</div>
                <div className="text-gray-800 dark:text-white">{property.accessInfo}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            to={`/objects/${property.id}/edit`}
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
            История заявок ({propertyOrders.length})
          </h2>
          <Link
            to={`/orders/new?propertyId=${property.id}&clientId=${property.clientId}`}
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
            <p>На этом объекте пока нет заявок</p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удалить объект?"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Вы уверены, что хотите удалить объект <strong>{property.name}</strong>?
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
