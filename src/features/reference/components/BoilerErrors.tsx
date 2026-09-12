import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, Star, Copy, Check, ArrowLeft } from 'lucide-react';
import { BOILER_ERRORS, BoilerError } from '../data/boilerErrors';

type Brand = 'all' | 'baxi' | 'vaillant' | 'bosch' | 'navien' | 'protherm';
type Severity = 'low' | 'medium' | 'high' | 'critical';

const BRAND_NAMES: Record<Brand, string> = {
  all: 'Все',
  baxi: 'Baxi',
  vaillant: 'Vaillant',
  bosch: 'Bosch',
  navien: 'Navien',
  protherm: 'Protherm',
};

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bgColor: string; emoji: string }> = {
  low: { label: 'Низкий', color: 'text-green-700 dark:text-green-300', bgColor: 'bg-green-100 dark:bg-green-900/30', emoji: '🟢' },
  medium: { label: 'Средний', color: 'text-yellow-700 dark:text-yellow-300', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', emoji: '🟡' },
  high: { label: 'Высокий', color: 'text-red-700 dark:text-red-300', bgColor: 'bg-red-100 dark:bg-red-900/30', emoji: '🔴' },
  critical: { label: 'Критический', color: 'text-red-800 dark:text-red-200', bgColor: 'bg-red-200 dark:bg-red-900/50', emoji: '🔴' },
};

export function BoilerErrors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Загрузка избранного из LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteBoilerErrors');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Сохранение избранного в LocalStorage
  useEffect(() => {
    localStorage.setItem('favoriteBoilerErrors', JSON.stringify(favorites));
  }, [favorites]);

  // Фильтрация и поиск
  const filteredErrors = useMemo(() => {
    return BOILER_ERRORS.filter((error) => {
      const matchesBrand = selectedBrand === 'all' || error.brand === selectedBrand;
      const matchesSearch = searchQuery === '' || 
        error.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.checks.some(check => check.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesBrand && matchesSearch;
    });
  }, [searchQuery, selectedBrand]);

  // Переключение избранного
  const toggleFavorite = (code: string) => {
    setFavorites(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  // Копирование в буфер обмена
  const copyToClipboard = (error: BoilerError) => {
    const text = `Ошибка ${error.code} (${error.brand.toUpperCase()}): ${error.description}\n\nЧто проверить:\n${error.checks.map(c => `• ${c}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedCode(error.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Проверка, является ли ошибка избранной
  const isFavorite = (code: string) => favorites.includes(code);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Назад
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Ошибки котлов
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Коды ошибок Baxi, Vaillant, Bosch, Navien, Protherm
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по коду ошибки или симптому..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Brand Filter */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(BRAND_NAMES) as Brand[]).map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedBrand === brand
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {BRAND_NAMES[brand]}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Найдено ошибок: {filteredErrors.length}
      </div>

      {/* Error Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredErrors.map((error) => {
          const severityConfig = SEVERITY_CONFIG[error.severity];
          const isFav = isFavorite(error.code);
          const isCopied = copiedCode === error.code;

          return (
            <div
              key={`${error.brand}-${error.code}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {error.code}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                      {error.brand.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {error.description}
                  </p>
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(error.code)}
                  className="p-1 hover:scale-110 transition-transform"
                  title={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                  <Star
                    className={`w-5 h-5 ${
                      isFav
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  />
                </button>
              </div>

              {/* Severity Badge */}
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mb-3 ${severityConfig.bgColor} ${severityConfig.color}`}>
                <span>{severityConfig.emoji}</span>
                <span>{severityConfig.label}</span>
              </div>

              {/* Checks */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Что проверить:
                </p>
                <ul className="space-y-1">
                  {error.checks.map((check, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(error)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Скопировать
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredErrors.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Ошибки не найдены
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}
    </div>
  );
}
