import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, Star, ArrowLeft, Phone } from 'lucide-react';
import { SYMPTOMS, Symptom } from '../data/troubleshooting';

type Severity = 'low' | 'medium' | 'high' | 'critical';

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bgColor: string; emoji: string; borderColor: string }> = {
  low: { 
    label: 'Низкий', 
    color: 'text-green-700 dark:text-green-300', 
    bgColor: 'bg-green-100 dark:bg-green-900/30', 
    emoji: '🟢',
    borderColor: 'border-green-500'
  },
  medium: { 
    label: 'Средний', 
    color: 'text-yellow-700 dark:text-yellow-300', 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', 
    emoji: '🟡',
    borderColor: 'border-yellow-500'
  },
  high: { 
    label: 'Высокий', 
    color: 'text-red-700 dark:text-red-300', 
    bgColor: 'bg-red-100 dark:bg-red-900/30', 
    emoji: '🔴',
    borderColor: 'border-red-500'
  },
  critical: { 
    label: 'Критический', 
    color: 'text-red-800 dark:text-red-200', 
    bgColor: 'bg-red-200 dark:bg-red-900/50', 
    emoji: '🔴',
    borderColor: 'border-red-600'
  },
};

export function Troubleshooting() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({});

  // Загрузка избранного из LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteSymptoms');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Сохранение избранного в LocalStorage
  useEffect(() => {
    localStorage.setItem('favoriteSymptoms', JSON.stringify(favorites));
  }, [favorites]);

  // Фильтрация и поиск
  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS.filter((symptom) => {
      const matchesSeverity = selectedSeverity === 'all' || symptom.severity === selectedSeverity;
      const matchesSearch = searchQuery === '' || 
        symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        symptom.causes.some(cause => 
          cause.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cause.action.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      return matchesSeverity && matchesSearch;
    });
  }, [searchQuery, selectedSeverity]);

  // Переключение избранного
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // Переключение чекбокса
  const toggleCheck = (symptomId: string, index: number) => {
    setCheckedItems(prev => {
      const current = prev[symptomId] || [];
      const newChecked = [...current];
      newChecked[index] = !newChecked[index];
      return { ...prev, [symptomId]: newChecked };
    });
  };

  // Проверка, является ли симптом избранным
  const isFavorite = (id: string) => favorites.includes(id);

  // Проверка, отмечен ли пункт
  const isChecked = (symptomId: string, index: number) => {
    return checkedItems[symptomId]?.[index] || false;
  };

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
          <AlertTriangle className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Диагностика по симптомам
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Пошаговая диагностика проблем с водоснабжением и отоплением
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по симптому..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSeverity === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Все
          </button>
          {(Object.keys(SEVERITY_CONFIG) as Severity[]).map((severity) => {
            const config = SEVERITY_CONFIG[severity];
            return (
              <button
                key={severity}
                onClick={() => setSelectedSeverity(severity)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSeverity === severity
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {config.emoji} {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Найдено симптомов: {filteredSymptoms.length}
      </div>

      {/* Symptom Cards */}
      <div className="space-y-4">
        {filteredSymptoms.map((symptom) => {
          const severityConfig = SEVERITY_CONFIG[symptom.severity];
          const isFav = isFavorite(symptom.id);
          const isCritical = symptom.severity === 'critical';

          return (
            <div
              key={symptom.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 ${severityConfig.borderColor} p-4 md:p-6`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {symptom.name}
                    </h2>
                    {isCritical && (
                      <span className="animate-pulse text-2xl">⚠️</span>
                    )}
                  </div>
                  
                  {/* Severity Badge */}
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${severityConfig.bgColor} ${severityConfig.color}`}>
                    <span>{severityConfig.emoji}</span>
                    <span>Уровень: {severityConfig.label}</span>
                  </div>
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(symptom.id)}
                  className="p-2 hover:scale-110 transition-transform"
                  title={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                  <Star
                    className={`w-6 h-6 ${
                      isFav
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  />
                </button>
              </div>

              {/* Urgent Actions for Critical Symptoms */}
              {isCritical && symptom.urgentActions && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 border-2 border-red-500 rounded-lg">
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ:
                  </h3>
                  <ul className="space-y-2">
                    {symptom.urgentActions.map((action, idx) => (
                      <li key={idx} className="flex items-start text-red-900 dark:text-red-100 font-medium">
                        <span className="mr-2 text-red-600 dark:text-red-400">⚠️</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Call Button for Gas Emergency */}
                  {symptom.id === 'gas-smell' && (
                    <a
                      href="tel:104"
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Позвонить 104
                    </a>
                  )}
                </div>
              )}

              {/* Causes Checklist */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Возможные причины и порядок проверки:
                </h3>
                <div className="space-y-3">
                  {symptom.checkOrder.map((orderNum, idx) => {
                    const causeIndex = orderNum - 1;
                    const cause = symptom.causes[causeIndex];
                    if (!cause) return null;

                    const checked = isChecked(symptom.id, idx);

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
                          checked
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleCheck(symptom.id, idx)}
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            checked
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500'
                          }`}
                        >
                          {checked && <span className="text-sm font-bold">✓</span>}
                        </button>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                              {orderNum}
                            </span>
                            <p className={`font-medium ${
                              checked
                                ? 'text-green-700 dark:text-green-300 line-through'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {cause.description}
                            </p>
                          </div>
                          <p className={`text-sm ml-8 ${
                            checked
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            → {cause.action}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress */}
              {symptom.checkOrder.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Прогресс проверки:</span>
                    <span className="font-medium">
                      {checkedItems[symptom.id]?.filter(Boolean).length || 0} / {symptom.checkOrder.length}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((checkedItems[symptom.id]?.filter(Boolean).length || 0) / symptom.checkOrder.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSymptoms.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Симптомы не найдены
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}
    </div>
  );
}
