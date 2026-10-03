import { useState, useMemo } from 'react';
import { Search, Ruler } from 'lucide-react';
import { PLUMBING_STANDARDS, PlumbingStandard } from '../data/plumbingStandards';

type Category = PlumbingStandard['category'];

const CATEGORIES: Array<Category | 'Все'> = [
  'Все',
  'Ванная комната',
  'Туалет',
  'Кухня',
  'Общие требования',
];

export function StandardsReference() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Все'>('Все');

  const filteredStandards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PLUMBING_STANDARDS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Все' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.fixture.toLowerCase().includes(query) ||
        item.parameter.toLowerCase().includes(query) ||
        (item.note?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky-панель поиска и фильтров */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-6 h-6 text-blue-600 shrink-0" />
            <h1 className="text-lg font-bold text-gray-900">
              Стандарты установки сантехприборов
            </h1>
          </div>

          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по прибору или параметру…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Чипсы категорий */}
          <div className="flex flex-wrap gap-2 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Список карточек */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        {filteredStandards.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Ничего не найдено. Попробуйте изменить запрос или категорию.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredStandards.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                    {item.fixture}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap shrink-0">
                    {item.category}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">{item.parameter}:</span>
                    <span className="font-bold text-gray-900 text-right">
                      {item.value}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-gray-600 text-xs italic border-l-2 border-gray-300 pl-2">
                      {item.note}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 text-right">
                    Источник: {item.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-gray-400 text-center">
          Значения приведены согласно СП 30.13330.2020 и СП 73.13330.2016.
        </p>
      </div>
    </div>
  );
}
