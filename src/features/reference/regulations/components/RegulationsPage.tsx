import React, { useState, useEffect } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { searchRegulations, getQuickTableById } from '../logic/search';
import { quickTables } from '../data/quickTables';
import { regulationsData } from '../data/regulationsData';
import type { RegulationEntry, QuickTable } from '../types';

interface SearchResultItemProps {
  entry: RegulationEntry;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ entry, onToggleFavorite, isFavorite }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{entry.title}</h3>
          <p className="text-lg font-bold text-blue-600 mb-2">{entry.value}</p>
          <p className="text-sm text-gray-500">{entry.source}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(entry.id)}
          className={`p-2 rounded-full transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center ${
            isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'
          }`}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
      <div className="mt-2">
        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
          entry.category === 'water' ? 'bg-blue-100 text-blue-700' :
          entry.category === 'sewage' ? 'bg-green-100 text-green-700' :
          entry.category === 'heating' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {entry.category === 'water' && '💧 Водоснабжение'}
          {entry.category === 'sewage' && '🚽 Канализация'}
          {entry.category === 'heating' && '🔥 Отопление'}
          {entry.category === 'general' && '📋 Общее'}
        </span>
      </div>
    </div>
  );
};

interface QuickTableCardProps {
  table: QuickTable;
  onSelect: (table: QuickTable) => void;
}

const QuickTableCard: React.FC<QuickTableCardProps> = ({ table, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(table)}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all w-full text-left min-h-[48px]"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{table.icon}</span>
        <span className="font-medium text-gray-900">{table.title}</span>
      </div>
    </button>
  );
};

interface QuickTableDetailProps {
  table: QuickTable;
  onBack: () => void;
}

const QuickTableDetail: React.FC<QuickTableDetailProps> = ({ table, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-200 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label="Назад"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{table.icon}</span>
          <h2 className="font-semibold text-gray-900">{table.title}</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Прибор / Параметр</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Значение</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Источник</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-900">{row.label}</td>
                <td className="px-4 py-3 font-medium text-blue-600">{row.value}</td>
                <td className="px-4 py-3 text-gray-500">{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RegulationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RegulationEntry[]>([]);
  const [selectedTable, setSelectedTable] = useState<QuickTable | null>(null);
  const favoritesStore = useFavoritesStore();
  
  // Загрузка избранных при монтировании
  useEffect(() => {
    favoritesStore.loadFromStorage();
  }, []);
  
  // Поиск при изменении запроса
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchRegulations(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  const handleToggleFavorite = (id: string) => {
    if (favoritesStore.isFavorite(id)) {
      favoritesStore.removeFavorite(id);
    } else {
      favoritesStore.addFavorite(id);
    }
  };
  
  const handleSelectTable = (table: QuickTable) => {
    setSelectedTable(table);
  };
  
  const handleBackToTables = () => {
    setSelectedTable(null);
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">📚 Справочник нормативов</h1>
      
      {/* Поиск */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск: высота инсталляции, уклон канализации, давление опрессовки..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Очистить поиск"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Результаты поиска */}
      {searchQuery && searchResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Результаты поиска ({searchResults.length})</h2>
          <div className="space-y-3">
            {searchResults.map(entry => (
              <SearchResultItem
                key={entry.id}
                entry={entry}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favoritesStore.isFavorite(entry.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Нет результатов */}
      {searchQuery && searchResults.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">Ничего не найдено по запросу "{searchQuery}"</p>
        </div>
      )}
      
      {/* Быстрые таблицы или детальное представление */}
      {!searchQuery && (
        <>
          {selectedTable ? (
            <QuickTableDetail table={selectedTable} onBack={handleBackToTables} />
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">⚡ Быстрые таблицы</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickTables.map(table => (
                  <QuickTableCard key={table.id} table={table} onSelect={handleSelectTable} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Избранное (отдельная секция внизу) */}
      {favoritesStore.favorites.length > 0 && !selectedTable && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">⭐ Избранное</h2>
          <div className="space-y-3">
            {regulationsData
              .filter(entry => favoritesStore.favorites.includes(entry.id))
              .map(entry => (
                <SearchResultItem
                  key={entry.id}
                  entry={entry}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={true}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Импорт для доступа к данным удалён - теперь в начале файла
