import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Building2, Phone, MapPin, Mail, FileText, Star, Edit, Trash2, Plus, ArrowLeft, Copy, DollarSign, TrendingUp, TrendingDown, FileCheck } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { useTransactions } from '../../finance/hooks/useTransactions';
import { useEstimates } from '../../finance/hooks/useEstimates';
import { Modal } from '../../../shared/ui/Modal';
import { Toast } from '../../../shared/ui/Toast';
import { formatPhone, formatDate, formatCurrency, getOrderStatusText, getOrderStatusColor, getOrderTypeText } from '../../../shared/utils/helpers';
import { TRANSACTION_CATEGORY_NAMES } from '../../finance/types';

export function ClientCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClient, deleteClient, toggleFavorite } = useClients();
  const { getOrdersByClient } = useOrders();
  const { transactions } = useTransactions();
  const { getByClient: getEstimatesByClient } = useEstimates();

  const client = id ? getClient(id) : undefined;
  const clientOrders = id ? getOrdersByClient(id) : [];
  const clientEstimates = id ? getEstimatesByClient(id) : [];
  const clientTransactions = id ? transactions.filter(t => t.clientId === id) : [];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'finance'>('orders');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleCreateContract = () => {
    // Переход к созданию договора с предзаполненными данными клиента
    sessionStorage.setItem('contractFromClient', JSON.stringify({
      clientId: client?.id,
      customerName: client?.name,
      customerPhone: client?.phone,
      customerAddress: client?.address,
    }));
    navigate('/documents/new?type=contract&clientId=' + client?.id);
  };

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

  const copyRequisites = () => {
    if (client.type !== 'legal') return;

    const requisites = [
      `Наименование: ${client.name}`,
      client.inn && `ИНН: ${client.inn}`,
      client.kpp && `КПП: ${client.kpp}`,
      client.ogrn && `ОГРН: ${client.ogrn}`,
      `Адрес: ${client.address}`,
      client.bankName && `Банк: ${client.bankName}`,
      client.bik && `БИК: ${client.bik}`,
      client.account && `Р/с: ${client.account}`,
      client.correspondentAccount && `К/с: ${client.correspondentAccount}`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(requisites);
    setToast({ message: 'Реквизиты скопированы в буфер обмена', type: 'success' });
  };

  // Финансовая статистика
  const totalIncome = clientTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = clientTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const sortedOrders = [...clientOrders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedTransactions = [...clientTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedEstimates = [...clientEstimates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
              client.type === 'legal'
                ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                : 'bg-gradient-to-br from-violet-500 to-violet-600'
            }`}>
              {client.type === 'legal' ? (
                <Building2 className="w-8 h-8" />
              ) : (
                client.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{client.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  client.type === 'legal'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {client.type === 'legal' ? 'Юр лицо' : 'Физ лицо'}
                </span>
              </div>
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
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {client.type === 'legal' ? 'Юридический адрес' : 'Адрес'}
              </div>
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

        {/* Legal entity requisites */}
        {client.type === 'legal' && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Реквизиты</h3>
              <button
                onClick={copyRequisites}
                className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"
              >
                <Copy className="w-3 h-3" />
                Скопировать
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {client.inn && (
                <div>
                  <div className="text-gray-500 dark:text-gray-400">ИНН</div>
                  <div className="text-gray-800 dark:text-white font-medium">{client.inn}</div>
                </div>
              )}
              {client.kpp && (
                <div>
                  <div className="text-gray-500 dark:text-gray-400">КПП</div>
                  <div className="text-gray-800 dark:text-white font-medium">{client.kpp}</div>
                </div>
              )}
              {client.ogrn && (
                <div>
                  <div className="text-gray-500 dark:text-gray-400">ОГРН</div>
                  <div className="text-gray-800 dark:text-white font-medium">{client.ogrn}</div>
                </div>
              )}
              {client.bankName && (
                <div className="col-span-2 md:col-span-3">
                  <div className="text-gray-500 dark:text-gray-400">Банк</div>
                  <div className="text-gray-800 dark:text-white font-medium">{client.bankName}</div>
                </div>
              )}
              {client.bik && (
                <div>
                  <div className="text-gray-500 dark:text-gray-400">БИК</div>
                  <div className="text-gray-800 dark:text-white font-medium">{client.bik}</div>
                </div>
              )}
              {client.account && (
                <div className="col-span-2">
                  <div className="text-gray-500 dark:text-gray-400">Р/с</div>
                  <div className="text-gray-800 dark:text-white font-medium">{client.account}</div>
                </div>
              )}
              {client.correspondentAccount && (
                <div className="col-span-2 md:col-span-3">
                  <div className="text-gray-500 dark:text-gray-400">К/с</div>
                  <div className="text-gray-800 dark:text-white font-medium">{client.correspondentAccount}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <Link
            to={`/clients/${client.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Редактировать
          </Link>
          <button
            onClick={handleCreateContract}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            Создать договор
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

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-violet-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Заявки ({clientOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'finance'
              ? 'bg-violet-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Финансы ({clientTransactions.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              История заявок
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
      )}

      {/* Finance Tab */}
      {activeTab === 'finance' && (
        <div className="space-y-4">
          {/* Financial Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Финансовая сводка
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Доходы</span>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalIncome)}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Расходы</span>
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpense)}
                </div>
              </div>
              <div className={`rounded-lg p-4 ${balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className={`w-5 h-5 ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Баланс</span>
                </div>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {formatCurrency(balance)}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Транзакции
              </h2>
              <Link
                to={`/finance/transactions/new?clientId=${client.id}`}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </Link>
            </div>

            {sortedTransactions.length > 0 ? (
              <div className="space-y-2">
                {sortedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
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
                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                          {transaction.description || TRANSACTION_CATEGORY_NAMES[transaction.category]}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </div>
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
                <p>У клиента пока нет транзакций</p>
              </div>
            )}
          </div>

          {/* Estimates */}
          {sortedEstimates.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Сметы
                </h2>
                <Link
                  to={`/finance/estimates/new?clientId=${client.id}`}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Новая смета
                </Link>
              </div>
              <div className="space-y-2">
                {sortedEstimates.slice(0, 5).map((estimate) => (
                  <Link
                    key={estimate.id}
                    to={`/finance/estimates/${estimate.id}`}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-violet-300 dark:hover:border-violet-600 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {estimate.number}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(estimate.createdAt)}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-violet-600 dark:text-violet-400">
                      {formatCurrency(estimate.total)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
