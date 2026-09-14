import { useState } from 'react';
import { Package, Search, AlertTriangle, Calculator } from 'lucide-react';

interface WallThickness {
  diameter: number;
  thickness: number;
  note?: string;
}

interface Material {
  name: string;
  type: string;
  tempMax: string;
  pressureMax: string;
  lifetime: string;
  pros: string[];
  cons: string[];
  applications: string[];
  linearExpansion: number; // мм/м·°C
  wallThickness: WallThickness[];
  roughness: number; // мм
  roughnessNote?: string;
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
    linearExpansion: 0.012,
    wallThickness: [
      { diameter: 15, thickness: 2.8, note: '1/2"' },
      { diameter: 20, thickness: 2.8, note: '3/4"' },
      { diameter: 25, thickness: 3.2, note: '1"' },
      { diameter: 32, thickness: 3.2, note: '1 1/4"' },
      { diameter: 40, thickness: 3.5, note: '1 1/2"' },
      { diameter: 50, thickness: 3.5, note: '2"' },
    ],
    roughness: 0.05,
    roughnessNote: 'новая',
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
    linearExpansion: 0.012,
    wallThickness: [
      { diameter: 15, thickness: 2.8, note: '1/2"' },
      { diameter: 20, thickness: 2.8, note: '3/4"' },
      { diameter: 25, thickness: 3.2, note: '1"' },
      { diameter: 32, thickness: 3.2, note: '1 1/4"' },
      { diameter: 40, thickness: 3.5, note: '1 1/2"' },
      { diameter: 50, thickness: 3.5, note: '2"' },
    ],
    roughness: 0.05,
    roughnessNote: 'новая',
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
    linearExpansion: 0.017,
    wallThickness: [
      { diameter: 15, thickness: 1.0 },
      { diameter: 22, thickness: 1.2 },
      { diameter: 28, thickness: 1.5 },
      { diameter: 35, thickness: 1.5 },
      { diameter: 42, thickness: 1.5 },
    ],
    roughness: 0.0015,
    roughnessNote: 'новая',
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
    linearExpansion: 0.15,
    wallThickness: [
      { diameter: 20, thickness: 3.4, note: 'PN20' },
      { diameter: 25, thickness: 4.2, note: 'PN20' },
      { diameter: 32, thickness: 5.4, note: 'PN20' },
      { diameter: 40, thickness: 6.7, note: 'PN20' },
      { diameter: 50, thickness: 8.3, note: 'PN20' },
      { diameter: 63, thickness: 10.5, note: 'PN20' },
    ],
    roughness: 0.007,
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
    linearExpansion: 0.13,
    wallThickness: [
      { diameter: 16, thickness: 2.0 },
      { diameter: 20, thickness: 2.0 },
      { diameter: 25, thickness: 2.3 },
    ],
    roughness: 0.007,
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
    linearExpansion: 0.026,
    wallThickness: [
      { diameter: 16, thickness: 2.0 },
      { diameter: 20, thickness: 2.3 },
      { diameter: 26, thickness: 3.0 },
      { diameter: 32, thickness: 3.0 },
    ],
    roughness: 0.007,
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
    linearExpansion: 0.017,
    wallThickness: [
      { diameter: 15, thickness: 1.0 },
      { diameter: 20, thickness: 1.2 },
      { diameter: 25, thickness: 1.5 },
      { diameter: 32, thickness: 1.5 },
      { diameter: 40, thickness: 1.5 },
    ],
    roughness: 0.015,
    roughnessNote: 'после 10 лет',
  },
];

export function MaterialsReferencePage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [expansionLength, setExpansionLength] = useState<Record<string, number>>({});
  const [expansionTemp, setExpansionTemp] = useState<Record<string, number>>({});

  const types = ['all', ...new Set(MATERIALS.map((m) => m.type))];

  const filtered = MATERIALS.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.applications.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    const matchType = selectedType === 'all' || m.type === selectedType;
    return matchSearch && matchType;
  });

  const calculateExpansion = (material: Material) => {
    const length = expansionLength[material.name] || 10;
    const tempDelta = expansionTemp[material.name] || 60;
    return material.linearExpansion * length * tempDelta;
  };

  const getRoughnessColor = (roughness: number) => {
    if (roughness <= 0.01) return 'text-green-600 dark:text-green-400';
    if (roughness <= 0.05) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRoughnessComparison = (material: Material) => {
    const steelRoughness = 0.05;
    const ratio = steelRoughness / material.roughness;
    
    if (ratio > 2) {
      return `В ${ratio.toFixed(1)} раз глаже стали`;
    } else if (ratio < 0.5) {
      return `В ${(1/ratio).toFixed(1)} раз шероховатее стали`;
    }
    return 'Сопоставимо со сталью';
  };

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
        {filtered.map((material) => {
          const isSelected = selectedMaterial?.name === material.name;
          const expansion = calculateExpansion(material);
          const hasHighExpansion = material.linearExpansion > 0.1;
          const hasHighRoughness = material.roughness > 0.05;

          return (
            <div
              key={material.name}
              onClick={() => setSelectedMaterial(isSelected ? null : material)}
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

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  {/* Преимущества и недостатки */}
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

                  {/* Тепловое расширение */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1">
                      🌡️ Тепловое расширение
                    </h4>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mb-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Коэффициент: <span className="font-semibold">{material.linearExpansion} мм/м·°C</span>
                      </div>
                      {hasHighExpansion && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-orange-700 dark:text-orange-300">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Высокое тепловое расширение, нужны компенсаторы</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Мини-калькулятор */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <Calculator className="w-3 h-3" />
                        <span>Калькулятор удлинения</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400">Длина (м)</label>
                          <input
                            type="number"
                            value={expansionLength[material.name] || 10}
                            onChange={(e) => {
                              e.stopPropagation();
                              setExpansionLength({
                                ...expansionLength,
                                [material.name]: Number(e.target.value)
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            min="0.1"

                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400">ΔT (°C)</label>
                          <input
                            type="number"
                            value={expansionTemp[material.name] || 60}
                            onChange={(e) => {
                              e.stopPropagation();
                              setExpansionTemp({
                                ...expansionTemp,
                                [material.name]: Number(e.target.value)
                              });
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            min="1"

                          />
                        </div>
                      </div>
                      <div className="text-center py-2 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Удлинение</div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-300">
                          {expansion.toFixed(1)} мм
                        </div>
                      </div>
                      {hasHighExpansion && expansion > 50 && (
                        <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
                          ⚠️ Для {material.name} {expansionLength[material.name] || 10}м при ΔT={expansionTemp[material.name] || 60}°C удлинение составит {expansion.toFixed(0)}мм — нужны компенсаторы!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Толщина стенки */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                      📏 Толщина стенки
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400">Диаметр</th>
                            <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400">Толщина</th>
                            <th className="text-left py-1 px-2 text-gray-600 dark:text-gray-400">Примечание</th>
                          </tr>
                        </thead>
                        <tbody>
                          {material.wallThickness.map((wt, idx) => (
                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
                              <td className="py-1 px-2 text-gray-800 dark:text-white">{wt.diameter} мм</td>
                              <td className="py-1 px-2 text-gray-800 dark:text-white font-medium">{wt.thickness} мм</td>
                              <td className="py-1 px-2 text-gray-500 dark:text-gray-400">{wt.note || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Гидравлика */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                      💧 Гидравлика
                    </h4>
                    <div className={`rounded-lg p-3 ${
                      hasHighRoughness 
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                    }`}>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Шероховатость: <span className={`font-semibold ${getRoughnessColor(material.roughness)}`}>
                          {material.roughness} мм
                        </span>
                        {material.roughnessNote && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({material.roughnessNote})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {getRoughnessComparison(material)}
                      </div>
                      {hasHighRoughness && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-700 dark:text-red-300">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Высокие гидравлические потери</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
