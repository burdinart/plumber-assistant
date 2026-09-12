import { useState } from 'react';
import { Calculator, RotateCcw, Lightbulb } from 'lucide-react';
import {
  calculateRadiatorPower,
  calculateRadiatorSections,
  RADIATOR_SECTION_POWER,
} from '../utils/designCalculations';

export function RadiatorCalculator() {
  const [area, setArea] = useState<number>(20);
  const [ceilingHeight, setCeilingHeight] = useState<number>(2.7);
  const [roomType, setRoomType] = useState<'living' | 'corner' | 'bathroom' | 'kitchen'>('living');
  const [region, setRegion] = useState<'south' | 'center' | 'north'>('center');
  const [insulation, setInsulation] = useState<'good' | 'medium' | 'poor'>('medium');
  const [windowCount, setWindowCount] = useState<number>(1);
  const [radiatorType, setRadiatorType] = useState<'aluminum' | 'bimetal' | 'castIron' | 'steel'>('bimetal');

  // Расчёты
  const powerData = calculateRadiatorPower(area, ceilingHeight, roomType, region, insulation, windowCount);
  const sections = calculateRadiatorSections(powerData.totalPower, radiatorType);
  const sectionPower = RADIATOR_SECTION_POWER[radiatorType];

  const handleReset = () => {
    setArea(20);
    setCeilingHeight(2.7);
    setRoomType('living');
    setRegion('center');
    setInsulation('medium');
    setWindowCount(1);
    setRadiatorType('bimetal');
  };

  const roomTypeNames = {
    living: 'Жилая комната',
    corner: 'Угловая комната',
    bathroom: 'Ванная',
    kitchen: 'Кухня',
  };

  const regionNames = {
    south: 'Юг',
    center: 'Центр',
    north: 'Север',
  };

  const insulationNames = {
    good: 'Хорошее',
    medium: 'Среднее',
    poor: 'Плохое',
  };

  const radiatorTypeNames = {
    aluminum: 'Алюминиевый',
    bimetal: 'Биметаллический',
    castIron: 'Чугунный',
    steel: 'Стальной',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Расчёт количества радиаторов
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Подбор мощности и количества секций радиаторов
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Форма ввода */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Параметры помещения
          </h2>

          <div className="space-y-4">
            {/* Площадь */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Площадь помещения (м²)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="1"
                step="0.5"
              />
            </div>

            {/* Высота потолков */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Высота потолков (м)
              </label>
              <input
                type="number"
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="2"
                step="0.1"
              />
            </div>

            {/* Тип помещения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тип помещения
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="living">Жилая комната</option>
                <option value="corner">Угловая комната</option>
                <option value="bathroom">Ванная</option>
                <option value="kitchen">Кухня</option>
              </select>
            </div>

            {/* Регион */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Климатическая зона
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="south">Юг (тёплый климат)</option>
                <option value="central">Центр (умеренный климат)</option>
                <option value="north">Север (холодный климат)</option>
              </select>
            </div>

            {/* Утепление */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Качество утепления
              </label>
              <select
                value={insulation}
                onChange={(e) => setInsulation(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="good">Хорошее (современное утепление)</option>
                <option value="medium">Среднее (стандартное)</option>
                <option value="poor">Плохое (старый фонд)</option>
              </select>
            </div>

            {/* Количество окон */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Количество окон (шт)
              </label>
              <input
                type="number"
                value={windowCount}
                onChange={(e) => setWindowCount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                step="1"
              />
            </div>

            {/* Тип радиатора */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тип радиатора
              </label>
              <select
                value={radiatorType}
                onChange={(e) => setRadiatorType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="aluminum">Алюминиевый (190 Вт/секция)</option>
                <option value="bimetal">Биметаллический (170 Вт/секция)</option>
                <option value="castIron">Чугунный (150 Вт/секция)</option>
                <option value="steel">Стальной (135 Вт/секция)</option>
              </select>
            </div>

            {/* Кнопка сброса */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Сбросить
            </button>
          </div>
        </div>

        {/* Результаты */}
        <div className="space-y-4">
          {/* Основные результаты */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Результаты расчёта
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Базовая мощность (100 Вт/м²):
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {powerData.basePower.toFixed(0)} Вт
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Необходимая тепловая мощность:
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {powerData.totalPower.toFixed(0)} Вт
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Количество секций ({radiatorTypeNames[radiatorType]}):
                </p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {sections} шт
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Мощность одной секции: {sectionPower} Вт
                </p>
              </div>
            </div>
          </div>

          {/* Коэффициенты */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Применённые коэффициенты:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>По высоте потолков:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ×{powerData.coefficients.height.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>По типу помещения ({roomTypeNames[roomType]}):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ×{powerData.coefficients.type.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>По региону ({regionNames[region]}):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ×{powerData.coefficients.region.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>По утеплению ({insulationNames[insulation]}):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ×{powerData.coefficients.insulation.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>По окнам ({windowCount} шт):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ×{powerData.coefficients.windows.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Рекомендации */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Рекомендации:
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Рекомендуется добавить запас мощности 10-15%</li>
                  <li>• Для угловых комнат лучше установить радиаторы под каждым окном</li>
                  <li>• Нижнее подключение снижает теплоотдачу на 5-10%</li>
                  <li>• Диагональное подключение наиболее эффективно</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Формулы */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Формулы расчёта:
            </h3>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 font-mono">
              <p>P_base = площадь × 100 Вт</p>
              <p>P_total = P_base × K_height × K_type × K_region × K_insulation × K_windows</p>
              <p>Количество секций = P_total / мощность_секции</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
