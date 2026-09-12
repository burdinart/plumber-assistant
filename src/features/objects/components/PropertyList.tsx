import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Home, Building2, Users } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useClients } from '../../clients/hooks/useClients';
import { useOrders } from '../../orders/hooks/useOrders';
import { ObjectType, OBJECT_TYPE_NAMES, OBJECT_TYPE_ICONS } from '../types';

export function PropertyList() {
  const { properties, search, getByType, getCities } = useProperties();
  const { getClient } = useClients();
  const { orders } = useOrders();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ObjectType | 'all'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const cities = getCities();

  // Фильтрация
  const filteredProperties = (() => {
    let items = searchQuery ? search(searchQuery) : properties;
    
    if (typeFilter !== 'all') {
      items = items.filter(p => p.type === typeFilter);
    }
    
    if (cityFilter !== 'all') {
      items = items.filter(p => p.city === cityFilter);
    }
    
    return items;
  })();

  // Подсчёт заявок для каждого объекта
  const getOrdersCount = (propertyId: string): number => {
    return orders.filter(o => o.propertyId === propertyId).length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Объекты</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {properties.length} {properties.length === 1 ? 'объект' : 'объектов'}
          </p>
        </div>
        <Link
          to="/objects/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Новый объект</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию или адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
          <option value="all">Все типы</option>
          {(Object.keys(OBJECT_TYPE_NAMES) as ObjectType[]).map(type => (
            <option key={type} value={type}>
              {OBJECT_TYPE_ICONS[type]} {OBJECT_TYPE_NAMES[type]}
            </option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
          <option value="all">Все города</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Properties grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => {
            const client = getClient(property.clientId);
            const ordersCount = getOrdersCount(property.id);
            
            return (
              <Link
                key={property.id}
                to={`/objects/${property.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{OBJECT_TYPE_ICONS[property.type]}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {property.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {OBJECT_TYPE_NAMES[property.type]}
                      </span>
                    </div>
                  </div>
                  {ordersCount > 0 && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      {ordersCount} {ordersCount === 1 ? 'заявка' : 'заявок'}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{property.address}</span>
                  </div>
                  
                  {client && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{client.name}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {property.area && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{property.area}</span> м²
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{property.bathrooms}</span> с/у
                      </div>
                    )}
                    {property.bedrooms && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{property.bedrooms}</span> комн.
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Home className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Объекты не найдены
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || typeFilter !== 'all' || cityFilter !== 'all'
              ? 'Попробуйте изменить параметры поиска'
              : 'Добавьте первый объект'}
          </p>
          {!searchQuery && typeFilter === 'all' && cityFilter === 'all' && (
            <Link
              to="/objects/new"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить объект
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
