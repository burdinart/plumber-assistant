import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Search, Star, Phone, MapPin, User, Building2 } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { formatPhone, getInitials } from '../../../shared/utils/helpers';

export function ClientList() {
  const { clients, searchClients, toggleFavorite } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredClients = searchClients(searchQuery).filter(
    (c) => !showFavoritesOnly || c.isFavorite
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Клиенты</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {clients.length} {clients.length === 1 ? 'клиент' : 'клиентов'}
            </p>
          </div>
        </div>
        <Link
          to="/clients/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Новый клиент</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по имени, телефону или адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            showFavoritesOnly
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Избранные
        </button>
      </div>

      {/* Client list */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                    client.type === 'legal'
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                      : 'bg-gradient-to-br from-violet-500 to-violet-600'
                  }`}>
                    {client.type === 'legal' ? (
                      <Building2 className="w-6 h-6" />
                    ) : (
                      getInitials(client.name)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {client.name}
                    </h3>
                    {client.type === 'legal' && client.inn && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ИНН: {client.inn}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(client.id);
                  }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      client.isFavorite
                        ? 'text-amber-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{formatPhone(client.phone)}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{client.address}</span>
                </div>
              </div>

              {client.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {client.notes}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {searchQuery || showFavoritesOnly ? 'Клиенты не найдены' : 'Нет клиентов'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || showFavoritesOnly
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте первого клиента'}
          </p>
          {!searchQuery && !showFavoritesOnly && (
            <Link
              to="/clients/new"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить клиента
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
