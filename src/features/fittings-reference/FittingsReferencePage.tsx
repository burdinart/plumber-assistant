import { useState } from 'react';
import { GitBranch, Search } from 'lucide-react';

interface Fitting {
  name: string;
  type: string;
  description: string;
  applications: string[];
  icon: string;
}

const FITTINGS: Fitting[] = [
  {
    name: 'Муфта',
    type: 'Прямое соединение',
    description: 'Соединяет две трубы одного диаметра на прямом участке.',
    applications: ['Удлинение трубопровода', 'Ремонт участка трубы'],
    icon: '━━',
  },
  {
    name: 'Уголок 90°',
    type: 'Поворот',
    description: 'Изменяет направление трубопровода на 90 градусов.',
    applications: ['Обход препятствий', 'Подъём/спуск стояка', 'Подключение приборов'],
    icon: '┗',
  },
  {
    name: 'Уголок 45°',
    type: 'Поворот',
    description: 'Плавный поворот трубопровода на 45 градусов.',
    applications: ['Плавные повороты', 'Меньшие гидравлические потери'],
    icon: '╱',
  },
  {
    name: 'Тройник',
    type: 'Разветвление',
    description: 'Создаёт ответвление от основной магистрали под 90°.',
    applications: ['Разводка на потребителей', 'Ответвление стояка', 'Подключение веток'],
    icon: '┣',
  },
  {
    name: 'Крестовина',
    type: 'Разветвление',
    description: 'Четыре направления: два прямых и два перпендикулярных.',
    applications: ['Пересечение трубопроводов', 'Разводка на 4 направления'],
    icon: '┼',
  },
  {
    name: 'Переход',
    type: 'Переходник',
    description: 'Соединяет трубы разного диаметра. Бывает концентрический и эксцентрический.',
    applications: ['Изменение диаметра', 'Подключение к оборудованию'],
    icon: '▷',
  },
  {
    name: 'Заглушка',
    type: 'Закрытие',
    description: 'Закрывает конец трубы. Бывает приварная, threaded и электрическая.',
    applications: ['Временное закрытие', 'Концевые точки системы', 'Опрессовка'],
    icon: '◼',
  },
  {
    name: 'Штуцер',
    type: 'Переходник',
    description: 'Фитинг с наружной резьбой для подключения шлангов и гибких подводок.',
    applications: ['Подключение гибких подводок', 'Подключение приборов', 'Съёмные соединения'],
    icon: '⊳',
  },
  {
    name: 'Американка',
    type: 'Разъёмное соединение',
    description: 'Быстроразъёмное соединение с накидной гайкой. Позволяет легко разъединять.',
    applications: ['Подключение счётчиков', 'Подключение фильтров', 'Обслуживаемые узлы'],
    icon: '⊗',
  },
  {
    name: 'Обратный клапан',
    type: 'Арматура',
    description: 'Пропускает поток только в одном направлении, предотвращая обратный ток.',
    applications: ['Защита насосов', 'Предотвращение смешивания ХВС/ГВС', 'Защита от загрязнения'],
    icon: '◁',
  },
];

export function FittingsReferencePage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const types = ['all', ...new Set(FITTINGS.map((f) => f.type))];

  const filtered = FITTINGS.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || f.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <GitBranch className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Фитинги и соединения</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Справочник фитингов, их типов и назначений
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск фитинга..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {type === 'all' ? 'Все' : type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((fitting) => (
          <div
            key={fitting.name}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {fitting.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{fitting.name}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">
                    {fitting.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{fitting.description}</p>
                <div className="flex flex-wrap gap-1">
                  {fitting.applications.map((app) => (
                    <span
                      key={app}
                      className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
