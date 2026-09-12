import { useState } from 'react';
import { Package, Search } from 'lucide-react';

interface Material {
  name: string;
  type: string;
  tempMax: string;
  pressureMax: string;
  lifetime: string;
  pros: string[];
  cons: string[];
  applications: string[];
}

const MATERIALS: Material[] = [
  {
    name: 'Сталь чёрная',
    type: 'Металл',
    tempMax: 'до 150°C',
    pressureMax: 'до 25 атм',
    lifetime: '15–30 лет',
    pros: ['Высокая прочность', 'Низкая цена', 'Устойчивость к механическим нагрузкам'],
    cons: ['Подвержена коррозии', 'Большой вес', 'Сложный монтаж', 'Зарастание отложениями'],
    applications: ['Стояки отопления', 'Магистральные трубопроводы', 'Пожарные системы'],
  },
  {
    name: 'Сталь оцинкованная',
    type: 'Металл',
    tempMax: 'до 140°C',
    pressureMax: 'до 25 атм',
    lifetime: '30–50 лет',
    pros: ['Защита от коррозии', 'Высокая прочность', 'Долговечность'],
    cons: ['Сложный монтаж (резьба)', 'Большой вес', 'Выше цена чем чёрная сталь'],
    applications: ['Водопровод ХВС/ГВС', 'Газопроводы', 'Отопление'],
  },
  {
    name: 'Медь',
    type: 'Металл',
    tempMax: 'до 250°C',
    pressureMax: 'до 40 атм',
    lifetime: '50–100 лет',
    pros: ['Долговечность', 'Бактерицидность', 'Устойчивость к УФ', 'Пластичность'],
    cons: ['Высокая цена', 'Сложный монтаж (пайка)', 'Несовместимость с некоторыми металлами'],
    applications: ['Водопровод', 'Отопление', 'Кондиционирование', 'Газоснабжение'],
  },
  {
    name: 'Полипропилен (PP-R)',
    type: 'Полимер',
    tempMax: 'до 95°C (PN20)',
    pressureMax: 'до 20 атм',
    lifetime: 'до 50 лет',
    pros: ['Низкая цена', 'Лёгкий монтаж (пайка)', 'Не подвержен коррозии', 'Бесшумный'],
    cons: ['Большое тепловое расширение', 'Неустойчив к УФ', 'Низкая прочность при ударах'],
    applications: ['Водопровод ХВС/ГВС', 'Отопление', 'Тёплые полы'],
  },
  {
    name: 'Сшитый полиэтилен (PEX)',
    type: 'Полимер',
    tempMax: 'до 95°C',
    pressureMax: 'до 10 атм',
    lifetime: 'до 50 лет',
    pros: ['Гибкость', 'Минимум соединений', 'Устойчивость к замерзанию', 'Кислородонепроницаемый'],
    cons: ['Не держит форму', 'Дорогие фитинги', 'Боится УФ'],
    applications: ['Тёплые полы', 'Водопровод (скрытая разводка)', 'Отопление'],
  },
  {
    name: 'Металлопластик (PEX-AL-PEX)',
    type: 'Композит',
    tempMax: 'до 95°C',
    pressureMax: 'до 10 атм',
    lifetime: 'до 50 лет',
    pros: ['Держит форму', 'Кислородонепроницаемый', 'Минимальное расширение', 'Лёгкий монтаж'],
    cons: ['Фитинги — слабое место', 'Не любит перегибов', 'Средняя цена'],
    applications: ['Водопровод', 'Отопление', 'Подключение радиаторов'],
  },
  {
    name: 'Нержавеющая сталь',
    type: 'Металл',
    tempMax: 'до 250°C',
    pressureMax: 'до 40 атм',
    lifetime: '50–100 лет',
    pros: ['Не коррозирует', 'Высокая прочность', 'Долговечность', 'Эстетичный вид'],
    cons: ['Высокая цена', 'Сложный монтаж', 'Тяжёлая'],
    applications: ['Премиальные водопроводы', 'Пищевая промышленность', 'Медицина'],
  },
];

export function MaterialsReferencePage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const types = ['all', ...new Set(MATERIALS.map((m) => m.type))];

  const filtered = MATERIALS.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.applications.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    const matchType = selectedType === 'all' || m.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Материалы труб</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Справочник по материалам: характеристики, плюсы и минусы
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по материалу или применению..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((material) => (
          <div
            key={material.name}
            onClick={() => setSelectedMaterial(selectedMaterial?.name === material.name ? null : material)}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{material.name}</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">
                  {material.type}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Темп.</div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{material.tempMax}</div>
              </div>
              <div className="text-center py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Давление</div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{material.pressureMax}</div>
              </div>
              <div className="text-center py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400">Срок</div>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{material.lifetime}</div>
              </div>
            </div>

            {selectedMaterial?.name === material.name && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">✓ Преимущества</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                    {material.pros.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">✗ Недостатки</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                    {material.cons.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">🔧 Применение</h4>
                  <div className="flex flex-wrap gap-1">
                    {material.applications.map((a) => (
                      <span key={a} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
